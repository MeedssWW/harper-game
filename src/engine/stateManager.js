// ============================================
// State Manager — Game state, saving, loyalty
// ============================================

const STATE_KEY = 'harper_act1_v4';
const STORY_VERSION = 'harper_act1_post_leak_finale_2026_07_13_v13';

const defaultState = {
    storyVersion: STORY_VERSION,
    playerName: '',
    currentAct: 1,
    currentBeatIndex: 0,
    completedBeats: [],
    activeChoices: {},       // beatId -> choiceIndex
    loyalty: {},             // characterId -> number (0-100)
    trust: {
        oliviaTrust: 0,
        miaTrust: 0,
        derekTrust: 0
    },
    unlockedChats: ['private_derek'],
    unlockedContacts: ['derek'],
    unlockedNotes: [],
    unlockedGallery: [],
    knownContacts: ['derek'],
    onlineCharacters: {},
    notes: {},
    caseEntries: [],
    chatHistories: {},       // chatId -> [messages]
    readCounts: {},          // chatId -> number
    flags: {},               // arbitrary story flags
    started: false,
    actCompleted: {},        // actId -> boolean
};

class StateManager {
    constructor() {
        this.state = this._load() || { ...defaultState };
        this.listeners = new Map();
    }

    // --- Getters ---
    get(key) {
        return this.state[key];
    }

    getPlayerName() {
        return this.state.playerName || 'Игрок';
    }

    getLoyalty(characterId) {
        return this.state.loyalty[characterId] ?? 50;
    }

    getAllLoyalty() {
        return { ...this.state.loyalty };
    }

    getTrust(key) {
        return this.state.trust?.[key] ?? 0;
    }

    getChatHistory(chatId) {
        return this.state.chatHistories[chatId] || [];
    }

    isUnlocked(type, id) {
        const key = `unlocked${type.charAt(0).toUpperCase() + type.slice(1)}`;
        return (this.state[key] || []).includes(id);
    }

    isContactIdentified(characterId) {
        return (this.state.knownContacts || []).includes(characterId);
    }

    identifyContact(characterId) {
        if (!characterId) return;
        if (!this.state.knownContacts) this.state.knownContacts = [];
        if (!this.state.knownContacts.includes(characterId)) {
            this.state.knownContacts.push(characterId);
            this._save();
            this._emit('contactIdentified', characterId);
        }
    }

    isCharacterOnline(characterId) {
        return !!this.state.onlineCharacters?.[characterId];
    }

    setCharacterOnline(characterId, online = true) {
        if (!characterId) return;
        if (!this.state.onlineCharacters) this.state.onlineCharacters = {};
        if (this.state.onlineCharacters[characterId] === !!online) return;
        this.state.onlineCharacters[characterId] = !!online;
        this._save();
        this._emit('characterStatus', { characterId, online: !!online });
    }

    isBeatCompleted(beatId) {
        return this.state.completedBeats.includes(beatId);
    }

    getChoice(beatId) {
        return this.state.activeChoices[beatId];
    }

    hasFlag(flag) {
        return !!this.state.flags[flag];
    }

    isChatUnread(chatId) {
        const history = this.state.chatHistories[chatId] || [];
        const readCounts = this.state.readCounts || {};
        const readCount = readCounts[chatId] || 0;
        return history.length > readCount;
    }

    // --- Setters ---
    setPlayerName(name) {
        this.state.playerName = name;
        this._save();
        this._emit('playerName', name);
    }

    setLoyalty(characterId, value) {
        const clamped = Math.max(0, Math.min(100, value));
        this.state.loyalty[characterId] = clamped;
        this._save();
        this._emit('loyalty', { characterId, value: clamped });
    }

    adjustLoyalty(characterId, delta) {
        const current = this.getLoyalty(characterId);
        this.setLoyalty(characterId, current + delta);
    }

    adjustTrust(key, delta) {
        if (!this.state.trust) this.state.trust = { oliviaTrust: 0, miaTrust: 0 };
        this.state.trust[key] = (this.state.trust[key] ?? 0) + delta;
        this._save();
        this._emit('trust', { key, value: this.state.trust[key] });
    }

    completeBeat(beatId) {
        if (!this.state.completedBeats.includes(beatId)) {
            this.state.completedBeats.push(beatId);
            this.state.currentBeatIndex = this.state.completedBeats.length;
            this._save();
            this._emit('beatCompleted', beatId);
        }
    }

    setChoice(beatId, choiceIndex) {
        this.state.activeChoices[beatId] = choiceIndex;
        this._save();
    }

    addChatMessage(chatId, message) {
        if (!this.state.chatHistories[chatId]) {
            this.state.chatHistories[chatId] = [];
        }
        
        // Prevent duplicates based on message ID
        if (message.id) {
            const exists = this.state.chatHistories[chatId].some(m => m.id === message.id);
            if (exists) return false;
        }
        
        this.state.chatHistories[chatId].push(message);
        this._save();
        this._emit('newMessage', { chatId, message });
        return true;
    }

    markChatRead(chatId) {
        if (!this.state.readCounts) this.state.readCounts = {};
        const history = this.state.chatHistories[chatId] || [];
        this.state.readCounts[chatId] = history.length;
        this._save();
        this._emit('chatRead', chatId);
    }

    unlock(type, id) {
        const key = `unlocked${type.charAt(0).toUpperCase() + type.slice(1)}`;
        if (!this.state[key]) this.state[key] = [];
        if (!this.state[key].includes(id)) {
            this.state[key].push(id);
            this._save();
            this._emit('unlock', { type, id });
        }
    }

    lock(type, id) {
        const key = `unlocked${type.charAt(0).toUpperCase() + type.slice(1)}`;
        if (!this.state[key]) return;
        const before = this.state[key].length;
        this.state[key] = this.state[key].filter(item => item !== id);
        if (this.state[key].length !== before) {
            this._save();
            this._emit('lock', { type, id });
        }
    }

    setNote(id, note) {
        if (!this.state.notes) this.state.notes = {};
        this.state.notes[id] = { id, ...note };
        this.unlock('notes', id);
        this._save();
        this._emit('note', this.state.notes[id]);
    }

    addCaseEntry(entry) {
        if (!this.state.caseEntries) this.state.caseEntries = [];
        const id = entry.id || `case_${Date.now()}`;
        const exists = this.state.caseEntries.some(item => item.id === id);
        if (!exists) {
            this.state.caseEntries.push({ id, ...entry });
            this._save();
            this._emit('caseEntry', { id, ...entry });
        }
    }

    setFlag(flag, value = true) {
        if (Object.is(this.state.flags[flag], value)) return;
        this.state.flags[flag] = value;
        this._save();
        this._emit('flag', { flag, value });
    }

    setStarted(val) {
        this.state.started = val;
        this._save();
    }

    // --- Events ---
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    off(event, callback) {
        const list = this.listeners.get(event);
        if (list) {
            const idx = list.indexOf(callback);
            if (idx >= 0) list.splice(idx, 1);
        }
    }

    _emit(event, data) {
        const list = this.listeners.get(event);
        if (list) {
            list.forEach(cb => cb(data));
        }
    }

    // --- Persistence ---
    _save() {
        if (typeof localStorage === 'undefined') return;
        try {
            localStorage.setItem(STATE_KEY, JSON.stringify(this.state));
        } catch (e) {
            console.warn('Failed to save state:', e);
        }
    }

    _load() {
        if (typeof localStorage === 'undefined') return null;
        try {
            const raw = localStorage.getItem(STATE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed.storyVersion !== STORY_VERSION) {
                    return null;
                }
                // Merge with defaults to handle new fields
                return this._migrateState({ ...defaultState, ...parsed });
            }
        } catch (e) {
            console.warn('Failed to load state:', e);
        }
        return null;
    }

    _migrateState(state) {
        const histories = state.chatHistories || {};

        for (const history of Object.values(histories)) {
            if (!Array.isArray(history)) continue;

            for (const message of history) {
                if (
                    message?.type === 'image' &&
                    message.caption === 'Харпер Вэнс' &&
                    (
                        message.src === 'src/assets/avatars/avatar_harper_live.png' ||
                        message.src === 'src/assets/harper_photos/harper_intro_portrait.jpg'
                    )
                ) {
                    message.src = 'src/assets/harper_photos/harper_cafe.jpg';
                }

                if (
                    message?.type === 'image' &&
                    message.caption === 'Фото 3' &&
                    message.src === 'src/assets/harper_photos/harper_cafe.jpg'
                ) {
                    message.src = 'src/assets/harper_photos/harper_larks_window.jpg';
                }
            }
        }

        return state;
    }

    reset() {
        this.state = { ...defaultState, trust: { oliviaTrust: 0, miaTrust: 0, derekTrust: 0 }, notes: {}, caseEntries: [], onlineCharacters: {}, loyalty: {}, chatHistories: {}, completedBeats: [], activeChoices: {}, flags: {}, unlockedChats: ['private_derek'], unlockedContacts: ['derek'], unlockedNotes: [], unlockedGallery: [], knownContacts: ['derek'] };
        this._save();
        this._emit('reset');
    }

    applyCheckpoint(snapshot = {}) {
        const base = JSON.parse(JSON.stringify(defaultState));
        const currentName = this.state.playerName || 'Паша';

        this.state = {
            ...base,
            ...snapshot,
            storyVersion: STORY_VERSION,
            playerName: snapshot.playerName || currentName,
            started: true,
            trust: { ...base.trust, ...(snapshot.trust || {}) },
            flags: { ...(snapshot.flags || {}) },
            loyalty: { ...(snapshot.loyalty || {}) },
            chatHistories: { ...(snapshot.chatHistories || {}) },
            activeChoices: { ...(snapshot.activeChoices || {}) },
            onlineCharacters: { ...(snapshot.onlineCharacters || {}) },
            notes: { ...(snapshot.notes || {}) },
            caseEntries: [...(snapshot.caseEntries || [])],
            readCounts: { ...(snapshot.readCounts || {}) }
        };

        this._save();
        this._emit('reset');
    }

    // Initialize loyalty for all characters
    initLoyalty(characters) {
        for (const char of characters) {
            if (this.state.loyalty[char.id] === undefined) {
                this.state.loyalty[char.id] = char.defaultLoyalty || 50;
            }
        }
        this._save();
    }
}

export const stateManager = new StateManager();
