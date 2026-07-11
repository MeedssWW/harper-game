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
        this.settings = this._loadSettings();
        this.bgm.volume = this.settings.musicVolume;
        this.isPlaying = false;
        this.sounds = {};
        this.messageSound = 'src/assets/audio/ui/message-in.wav';
        this.notificationSound = 'src/assets/audio/ui/notification-soft.wav';
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
    }

    unlock() {
        this.isUnlocked = true;
        this._ensureAudioContext();

        [this.messageSound, this.notificationSound, this.incomingCallSound].forEach(src => {
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
        if (!this.isPlaying) {
            this.bgm.play()
                .then(() => {
                    this.isPlaying = true;
                })
                .catch(() => {
                    this.isPlaying = false;
                });
        }
    }

    stopBGM() {
        this.bgm.pause();
        this.isPlaying = false;
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
            playback.catch(() => this.playTone());
        }
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
        Object.values(this.sounds).forEach(sound => {
            sound.volume = this.settings.effectsVolume;
        });

        if (!this.settings.musicEnabled) {
            this.stopBGM();
        } else if (this.isUnlocked) {
            this.playBGM();
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
