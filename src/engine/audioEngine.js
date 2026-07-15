// ============================================
// Audio Engine
// ============================================

const AUDIO_SETTINGS_KEY = 'harper_audio_settings_v1';

const DEFAULT_AUDIO_SETTINGS = {
    musicEnabled: true,
    messageSoundsEnabled: true,
    notificationSoundsEnabled: true,
    musicVolume: 0.35,
    effectsVolume: 0.48
};

export class AudioEngine {
    constructor() {
        this.bgm = new Audio('src/assets/audio/source.mp3');
        this.bgm.loop = true;
        this.bgm.preload = 'auto';
        this.loadingMusic = new Audio('src/assets/audio/harper-loading-echoes.mp3');
        this.loadingMusic.loop = false;
        this.loadingMusic.preload = 'auto';
        this.loadingMusic.setAttribute('playsinline', '');
        this.loadingMusic.load();
        this.settings = this._loadSettings();
        this.bgm.volume = this.settings.musicVolume;
        this.isPlaying = false;
        this.sounds = {};
        this.messageSound = 'src/assets/audio/ui/message-in.wav';
        this.notificationSound = 'src/assets/audio/ui/notification-soft.wav';
        this.signatureSound = 'src/assets/audio/ui/harper-signature-distant-train.mp3';
        this.incomingCallSound = 'src/assets/audio/ui/incoming-call.wav';
        this.unknownCallSound = 'src/assets/audio/ui/unknown-call-breath.wav';
        this.unknownVoicemailSound = 'src/assets/audio/ui/unknown-voicemail.wav';
        this.audioContext = null;
        this.isUnlocked = false;
        this._ringInterval = null;
        this._ringNodes = [];
        this._ringAudio = null;
        this._callAudio = null;
        this._voicemailAudio = null;
        this._signatureTimer = null;
        this._bootSequenceActive = false;
        this._bootAmbientNodes = [];
        this._bootFallbackTimer = null;
        this._gameAmbientNodes = [];
        this._gameAmbientMaster = null;
        this._bgmFallbackTimer = null;
    }

    unlock({ warmup = true } = {}) {
        this.isUnlocked = true;
        const ctx = this._ensureAudioContext();
        if (ctx?.state === 'suspended') ctx.resume().catch(() => {});

        if (!warmup) return;
        [this.messageSound, this.notificationSound, this.incomingCallSound, this.signatureSound].forEach(src => {
            const warmup = new Audio(src);
            warmup.volume = 0;
            warmup.play()
                .then(() => {
                    warmup.pause();
                    warmup.currentTime = 0;
                })
                .catch(() => {});
        });
    }

    playBGM() {
        if (!this.settings.musicEnabled) return;
        if (this._bootSequenceActive) return;
        if (!this.isPlaying) {
            if (this._bgmFallbackTimer) window.clearTimeout(this._bgmFallbackTimer);
            this._bgmFallbackTimer = window.setTimeout(() => {
                this._bgmFallbackTimer = null;
                if (!this.isPlaying && !this._bootSequenceActive && this.settings.musicEnabled) {
                    this._playGameAmbientSynth();
                    this.isPlaying = this._gameAmbientNodes.length > 0;
                    if (this.isPlaying) this.startSignatureLoop();
                }
            }, 1200);
            this.bgm.play()
                .then(() => {
                    if (this._bgmFallbackTimer) {
                        window.clearTimeout(this._bgmFallbackTimer);
                        this._bgmFallbackTimer = null;
                    }
                    this._stopGameAmbientSynth();
                    document.documentElement.dataset.harperGameAudio = 'track';
                    this.isPlaying = true;
                    this.startSignatureLoop();
                })
                .catch(() => {
                    if (this._bgmFallbackTimer) {
                        window.clearTimeout(this._bgmFallbackTimer);
                        this._bgmFallbackTimer = null;
                    }
                    this._playGameAmbientSynth();
                    this.isPlaying = this._gameAmbientNodes.length > 0;
                    if (this.isPlaying) this.startSignatureLoop();
                });
        }
    }

    stopBGM() {
        if (this._bgmFallbackTimer) {
            window.clearTimeout(this._bgmFallbackTimer);
            this._bgmFallbackTimer = null;
        }
        this.bgm.pause();
        this._stopGameAmbientSynth();
        this.isPlaying = false;
    }

    playBootSequence() {
        this.unlock({ warmup: false });
        this._bootSequenceActive = true;
        this.stopBGM();
        this.stopSignatureLoop();
        this._stopBootAmbientSynth();
        if (this._bootFallbackTimer) window.clearTimeout(this._bootFallbackTimer);
        this.loadingMusic.pause();
        this.loadingMusic.currentTime = 0;
        this.loadingMusic.volume = this.settings.musicEnabled ? Math.min(0.28, this.settings.musicVolume * 0.65) : 0;

        // The full loading track can buffer too slowly on mobile data. Start a short
        // musical score from Web Audio inside the tap event so the intro is never silent.
        if (this.settings.musicEnabled) this._playBootAmbientSynth();

        let musicStarted = false;
        const markPlaying = () => {
            musicStarted = true;
            document.documentElement.dataset.harperBootAudio = this._bootAmbientNodes.length
                ? 'track+score'
                : 'track';
        };
        this.loadingMusic.addEventListener('playing', markPlaying, { once: true });

        const playback = this.loadingMusic.play();
        if (playback) {
            playback.catch(() => {
                if (this._bootSequenceActive) this._playBootAmbientSynth();
            });
        }

        this._bootFallbackTimer = window.setTimeout(() => {
            this._bootFallbackTimer = null;
            if (!musicStarted && this._bootSequenceActive && this.settings.musicEnabled) {
                this._playBootAmbientSynth();
            }
        }, 900);

        // Start the signature horn inside the user's tap event so iOS treats it as intentional audio.
        this.playSignature();
    }

    finishBootSequence() {
        if (this._bootFallbackTimer) {
            window.clearTimeout(this._bootFallbackTimer);
            this._bootFallbackTimer = null;
        }
        this.loadingMusic.pause();
        this.loadingMusic.currentTime = 0;
        this._stopBootAmbientSynth();
        this._bootSequenceActive = false;
        this.playBGM();
        this.startSignatureLoop();
    }

    playSignature() {
        if (!this.settings.notificationSoundsEnabled) return false;
        this.playSound(this.signatureSound);
        return true;
    }

    _playBootAmbientSynth() {
        if (!this.settings.musicEnabled || this.settings.musicVolume <= 0.001 || this._bootAmbientNodes.length) return;
        const ctx = this._ensureAudioContext();
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume().catch(() => {});

        const now = ctx.currentTime;
        const master = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        const movement = ctx.createOscillator();
        const movementGain = ctx.createGain();
        const scoreLevel = Math.max(0.035, this.settings.musicVolume * 0.2);
        master.gain.setValueAtTime(0.0001, now);
        master.gain.exponentialRampToValueAtTime(scoreLevel, now + 0.65);
        master.gain.setValueAtTime(scoreLevel, now + 4.25);
        master.gain.exponentialRampToValueAtTime(0.0001, now + 5.2);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(680, now);
        filter.Q.setValueAtTime(1.1, now);
        movement.type = 'sine';
        movement.frequency.setValueAtTime(0.17, now);
        movementGain.gain.setValueAtTime(230, now);
        movement.connect(movementGain);
        movementGain.connect(filter.frequency);
        filter.connect(master);
        master.connect(ctx.destination);

        const padFrequencies = [73.42, 110, 146.83, 174.61, 293.66];
        const padLevels = [0.62, 0.26, 0.18, 0.12, 0.035];
        const padNodes = padFrequencies.flatMap((frequency, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = index < 2 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(frequency, now);
            osc.detune.setValueAtTime((index - 2) * -4, now);
            gain.gain.setValueAtTime(padLevels[index], now);
            osc.connect(gain);
            gain.connect(filter);
            osc.start(now);
            osc.stop(now + 5.3);
            return [osc, gain];
        });

        const echoNodes = [
            { offset: 0.35, frequency: 293.66 },
            { offset: 1.75, frequency: 261.63 },
            { offset: 3.15, frequency: 220 }
        ].flatMap(({ offset, frequency }) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(frequency, now + offset);
            gain.gain.setValueAtTime(0.0001, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.11, now + offset + 0.08);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 1.15);
            osc.connect(gain);
            gain.connect(filter);
            osc.start(now + offset);
            osc.stop(now + offset + 1.2);
            return [osc, gain];
        });

        movement.start(now);
        movement.stop(now + 5.3);
        this._bootAmbientNodes = [
            master,
            filter,
            movement,
            movementGain,
            ...padNodes,
            ...echoNodes
        ];
        document.documentElement.dataset.harperBootAudio = 'score';
    }

    _stopBootAmbientSynth() {
        this._bootAmbientNodes.forEach(node => {
            try { node.stop?.(); } catch {}
            try { node.disconnect?.(); } catch {}
        });
        this._bootAmbientNodes = [];
    }

    _playGameAmbientSynth() {
        if (!this.settings.musicEnabled || this._gameAmbientNodes.length) return;
        const ctx = this._ensureAudioContext();
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume().catch(() => {});

        const now = ctx.currentTime;
        const master = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        master.gain.setValueAtTime(0.0001, now);
        master.gain.exponentialRampToValueAtTime(Math.max(0.012, this.settings.musicVolume * 0.1), now + 2.4);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, now);
        filter.Q.setValueAtTime(1.5, now);
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.045, now);
        lfoGain.gain.setValueAtTime(110, now);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        filter.connect(master);
        master.connect(ctx.destination);

        const oscillators = [55, 82.41, 110].map((frequency, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = index === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(frequency, now);
            osc.detune.setValueAtTime(index === 1 ? -11 : index === 2 ? 7 : 0, now);
            gain.gain.setValueAtTime(index === 0 ? 0.72 : 0.18, now);
            osc.connect(gain);
            gain.connect(filter);
            osc.start(now);
            return osc;
        });

        lfo.start(now);
        this._gameAmbientMaster = master;
        this._gameAmbientNodes = [master, filter, lfo, lfoGain, ...oscillators];
        document.documentElement.dataset.harperGameAudio = 'synth';
    }

    _stopGameAmbientSynth() {
        this._gameAmbientNodes.forEach(node => {
            try { node.stop?.(); } catch {}
            try { node.disconnect?.(); } catch {}
        });
        this._gameAmbientNodes = [];
        this._gameAmbientMaster = null;
    }

    startSignatureLoop() {
        if (this._signatureTimer || this._bootSequenceActive) return;
        const delay = 180000 + Math.floor(Math.random() * 240001);
        this._signatureTimer = window.setTimeout(() => {
            this._signatureTimer = null;
            this.playSignature();
            this.startSignatureLoop();
        }, delay);
    }

    stopSignatureLoop() {
        if (!this._signatureTimer) return;
        window.clearTimeout(this._signatureTimer);
        this._signatureTimer = null;
    }

    pauseBGMForScene() {
        const wasPlaying = this.isPlaying;
        this.stopBGM();
        return wasPlaying;
    }

    resumeBGMForScene(wasPlaying) {
        if (wasPlaying) {
            this.playBGM();
        }
    }

    playSound(src) {
        if (!this.isUnlocked) {
            this.unlock();
        }

        if (!this.sounds[src]) {
            this.sounds[src] = new Audio(src);
        }
        const snd = this.sounds[src];
        snd.volume = this.settings.effectsVolume;
        snd.currentTime = 0;
        const playback = snd.play();
        if (playback) {
            return playback
                .then(() => {
                    if (src === this.signatureSound) {
                        document.documentElement.dataset.harperSignatureAudio = 'playing';
                    }
                })
                .catch(() => {
                    if (src === this.signatureSound) return this._playTrainHornSynth();
                    return this.playTone();
                });
        }
        return null;
    }

    _playTrainHornSynth() {
        const ctx = this._ensureAudioContext();
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume().catch(() => {});

        const now = ctx.currentTime;
        const master = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(620, now);
        filter.frequency.exponentialRampToValueAtTime(360, now + 3.7);
        master.gain.setValueAtTime(0.0001, now);
        master.gain.exponentialRampToValueAtTime(0.075, now + 0.18);
        master.gain.setValueAtTime(0.075, now + 1.9);
        master.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);
        filter.connect(master);
        master.connect(ctx.destination);

        [146.83, 174.61, 220].forEach((frequency, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = index === 0 ? 'sawtooth' : 'triangle';
            osc.frequency.setValueAtTime(frequency, now);
            osc.frequency.exponentialRampToValueAtTime(frequency * 0.975, now + 3.7);
            gain.gain.setValueAtTime(index === 0 ? 0.35 : 0.24, now);
            osc.connect(gain);
            gain.connect(filter);
            osc.start(now);
            osc.stop(now + 3.85);
        });

        document.documentElement.dataset.harperSignatureAudio = 'synth';
    }

    playMessage() {
        if (!this.settings.messageSoundsEnabled) return;
        this.playSound(this.messageSound);
    }

    playNotification() {
        if (!this.settings.notificationSoundsEnabled) return;
        this.playSound(this.notificationSound);
    }

    previewMessage() {
        if (!this.settings.messageSoundsEnabled) return false;
        this.playSound(this.messageSound);
        return true;
    }

    previewNotification() {
        if (!this.settings.notificationSoundsEnabled) return false;
        this.playSound(this.notificationSound);
        return true;
    }

    playIncomingCall() {
        if (!this.settings.notificationSoundsEnabled) return;
        this.stopIncomingCall();
        this._ringAudio = new Audio(this.incomingCallSound);
        this._ringAudio.loop = true;
        this._ringAudio.volume = this.settings.effectsVolume;
        this._ringAudio.play().catch(() => {
            const playRing = () => this._playRingPattern();
            playRing();
            this._ringInterval = setInterval(playRing, 2200);
        });
    }

    stopIncomingCall() {
        if (this._ringAudio) {
            this._ringAudio.pause();
            this._ringAudio.currentTime = 0;
            this._ringAudio = null;
        }
        if (this._ringInterval) {
            clearInterval(this._ringInterval);
            this._ringInterval = null;
        }
        this._ringNodes.forEach(node => {
            try {
                node.stop?.();
                node.disconnect?.();
            } catch {}
        });
        this._ringNodes = [];
    }

    playCallAmbience() {
        if (!this.settings.notificationSoundsEnabled) return;
        this.stopCallAmbience();
        const audio = new Audio(this.unknownCallSound);
        this._callAudio = audio;
        audio.volume = this.settings.effectsVolume;
        const playback = audio.play();
        if (playback) {
            playback.catch(() => {});
        }
    }

    _playCallAmbienceSynth() {
        const ctx = this._ensureAudioContext();
        if (!ctx || !this.isUnlocked) return;
        if (ctx.state === 'suspended') ctx.resume().catch(() => {});

        this._playNoiseBurst(4.1, 0.018, 600);
        setTimeout(() => this._playBreath(0.9), 1200);
        setTimeout(() => this._playPassingCar(), 2200);
    }

    playVoicemailAmbience() {
        if (!this.settings.notificationSoundsEnabled) return;
        this.stopCallAmbience();
        const audio = new Audio(this.unknownVoicemailSound);
        this._voicemailAudio = audio;
        audio.volume = this.settings.effectsVolume;
        const playback = audio.play();
        if (playback) {
            playback.catch(() => {});
        }
    }

    stopCallAmbience() {
        [this._callAudio, this._voicemailAudio].forEach(audio => {
            if (!audio) return;
            audio.pause();
            audio.currentTime = 0;
        });
        this._callAudio = null;
        this._voicemailAudio = null;
    }

    _playVoicemailAmbienceSynth() {
        const ctx = this._ensureAudioContext();
        if (!ctx || !this.isUnlocked) return;
        if (ctx.state === 'suspended') ctx.resume().catch(() => {});

        this._playNoiseBurst(4.0, 0.022, 520);
        setTimeout(() => this._playBreath(1.0), 850);
        setTimeout(() => this._playDoorClick(), 2500);
    }

    getSettings() {
        return { ...this.settings };
    }

    updateSettings(patch = {}) {
        this.settings = {
            ...this.settings,
            ...patch,
            musicVolume: this._clampVolume(patch.musicVolume ?? this.settings.musicVolume),
            effectsVolume: this._clampVolume(patch.effectsVolume ?? this.settings.effectsVolume)
        };
        this._saveSettings();
        this._applySettings();
    }

    playTone() {
        const ctx = this._ensureAudioContext();
        if (!ctx || !this.isUnlocked) return;

        if (ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const now = ctx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1240, now + 0.08);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.08, now + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
    }

    _playRingPattern() {
        const ctx = this._ensureAudioContext();
        if (!ctx || !this.isUnlocked) return;
        if (ctx.state === 'suspended') ctx.resume().catch(() => {});

        const now = ctx.currentTime;
        [0, 0.34].forEach(offset => {
            this._playOscPulse(now + offset, 740, 0.2, 0.08, 'sine');
            this._playOscPulse(now + offset, 980, 0.2, 0.045, 'triangle');
        });
        if (navigator.vibrate) navigator.vibrate([130, 80, 130]);
    }

    _playOscPulse(start, frequency, duration, volume, type = 'sine') {
        const ctx = this._ensureAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const level = volume * this.settings.effectsVolume;

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, level), start + 0.018);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration + 0.04);
        this._ringNodes.push(osc, gain);
    }

    _playNoiseBurst(duration, volume, filterFrequency) {
        const ctx = this._ensureAudioContext();
        if (!ctx) return;

        const samples = Math.max(1, Math.floor(ctx.sampleRate * duration));
        const buffer = ctx.createBuffer(1, samples, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < samples; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / samples * 0.35);
        }

        const source = ctx.createBufferSource();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        const now = ctx.currentTime;

        source.buffer = buffer;
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(filterFrequency, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume * this.settings.effectsVolume), now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        source.start(now);
        source.stop(now + duration + 0.04);
    }

    _playBreath(duration) {
        this._playNoiseBurst(duration, 0.032, 260);
    }

    _playPassingCar() {
        const ctx = this._ensureAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(82, now);
        osc.frequency.exponentialRampToValueAtTime(46, now + 1.35);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(420, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.035 * this.settings.effectsVolume, now + 0.22);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.45);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.5);
    }

    _playDoorClick() {
        const ctx = this._ensureAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        this._playOscPulse(now, 180, 0.045, 0.07, 'square');
        this._playOscPulse(now + 0.06, 95, 0.08, 0.045, 'triangle');
    }

    _ensureAudioContext() {
        if (this.audioContext) return this.audioContext;
        const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextCtor) return null;
        this.audioContext = new AudioContextCtor();
        return this.audioContext;
    }

    _applySettings() {
        this.bgm.volume = this.settings.musicVolume;
        this.loadingMusic.volume = this.settings.musicEnabled ? Math.min(0.42, this.settings.musicVolume * 0.92) : 0;
        Object.values(this.sounds).forEach(sound => {
            sound.volume = this.settings.effectsVolume;
        });
        if (this._gameAmbientMaster) {
            this._gameAmbientMaster.gain.setTargetAtTime(
                Math.max(0.012, this.settings.musicVolume * 0.1),
                this.audioContext.currentTime,
                0.18
            );
        }

        if (!this.settings.musicEnabled) {
            this.stopBGM();
        } else if (this.isUnlocked) {
            this.playBGM();
        }

        if (this.settings.notificationSoundsEnabled) {
            this.startSignatureLoop();
        } else {
            this.stopSignatureLoop();
        }
    }

    _loadSettings() {
        try {
            const raw = localStorage.getItem(AUDIO_SETTINGS_KEY);
            if (!raw) return { ...DEFAULT_AUDIO_SETTINGS };
            return this._normalizeSettings(JSON.parse(raw));
        } catch {
            return { ...DEFAULT_AUDIO_SETTINGS };
        }
    }

    _saveSettings() {
        try {
            localStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(this.settings));
        } catch {}
    }

    _clampVolume(value) {
        const number = Number(value);
        if (Number.isNaN(number)) return 0.5;
        return Math.max(0, Math.min(1, number));
    }

    _normalizeSettings(saved = {}) {
        const merged = { ...DEFAULT_AUDIO_SETTINGS, ...saved };
        return {
            musicEnabled: merged.musicEnabled !== false,
            messageSoundsEnabled: merged.messageSoundsEnabled !== false,
            notificationSoundsEnabled: merged.notificationSoundsEnabled !== false,
            musicVolume: this._clampVolume(merged.musicVolume),
            effectsVolume: this._clampVolume(merged.effectsVolume)
        };
    }
}

export const audioEngine = new AudioEngine();
