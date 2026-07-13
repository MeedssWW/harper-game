// ============================================
// Story Engine — Dialogue playback, choices, branching
// ============================================

import { stateManager } from './stateManager.js';

class StoryEngine {
    constructor() {
        this.currentAct = null;
        this.beats = [];
        this.isPlaying = false;
        this.currentBeatIndex = 0;
        this.messageQueue = [];
        this.onMessage = null;        // callback(chatId, message)
        this.onChoice = null;         // callback(chatId, options, beatId)
        this.onTyping = null;         // callback(chatId, characterId, show)
        this.onBeatComplete = null;   // callback(beatId)
        this.onUnlock = null;         // callback(type, id)
        this.onNotification = null;   // callback(title, text)
        this.onAppNotification = null; // callback(title, text, options)
        this.onGlitch = null;         // callback()
        this.onNarrator = null;       // callback(chatId, text)
        this.onNavigate = null;       // callback(screenId, params)
        this.onLock = null;           // callback(type, id)
        this.playbackSpeed = 0.72;
        this._playbackTimeout = null;
        this._typingTimeout = null;
        this.activeChoice = null;
        this._playingBeatIds = new Set();
    }

    loadAct(actData) {
        this.currentAct = actData;
        this.beats = actData.beats || [];
        this._restorePendingChoice();
    }

    // Start playing from the beginning or resume
    async start() {
        if (!this.currentAct || this.isPlaying || this.activeChoice) return;
        this.isPlaying = true;

        const completedBeats = stateManager.get('completedBeats') || [];
        const pendingNextBeat = this._findPendingNextBeat();

        if (pendingNextBeat) {
            this.isPlaying = false;
            await this.playBeatById(pendingNextBeat.id);
            return;
        }
        
        for (let i = 0; i < this.beats.length; i++) {
            const beat = this.beats[i];
            
            if (completedBeats.includes(beat.id)) continue;
            
            // Check trigger conditions
            if (this._canPlayBeat(beat)) {
                const result = await this._playBeat(beat);
                if (result?.pausedForChoice) {
                    break;
                }
                
                // After playing a beat, check if new beats are unlocked
                // Re-scan from start to catch any newly triggered beats
                i = -1; // Will become 0 on next iteration
            }
        }

        this.isPlaying = false;
    }

    // Play a specific beat by ID (for branching after choices)
    async playBeatById(beatId) {
        const beat = this.beats.find(b => b.id === beatId);
        if (beat && !stateManager.isBeatCompleted(beatId) && !this._playingBeatIds.has(beatId)) {
            this.isPlaying = true;
            const result = await this._playBeat(beat);
            
            if (!result?.pausedForChoice) {
                await this._continueAfterBeat(beatId);
            }
            this.isPlaying = false;
        }
    }

    // Check if a beat's trigger conditions are met
    _canPlayBeat(beat) {
        if (!beat.trigger) return true;
        if (beat.trigger === 'auto') {
            const completedBeats = stateManager.get('completedBeats') || [];
            return completedBeats.length === 0 && this.beats[0]?.id === beat.id;
        }

        // after:beatId|beatId2|beatId3 — plays after ANY of the specified beats
        if (beat.trigger.startsWith('after:')) {
            const afterPart = beat.trigger.substring(6);
            const beatIds = afterPart.split('|');
            return beatIds.some(id => stateManager.isBeatCompleted(id.trim()));
        }

        // loyalty:character:threshold — plays when loyalty >= threshold
        if (beat.trigger.startsWith('loyalty:')) {
            const parts = beat.trigger.split(':');
            const charId = parts[1];
            const threshold = parseInt(parts[2]);
            const direction = parts[3]; // 'below' or undefined (above)
            const currentLoyalty = stateManager.getLoyalty(charId);
            
            // Also need to check if any beat completed to not trigger too early
            const completedBeats = stateManager.get('completedBeats') || [];
            if (completedBeats.length < 5) return false; // Don't trigger loyalty beats too early
            
            if (direction === 'below') {
                return currentLoyalty <= threshold;
            }
            return currentLoyalty >= threshold;
        }

        // multiLoyalty:char:threshold:char:threshold — plays when all listed loyalties are high enough
        if (beat.trigger.startsWith('multiLoyalty:')) {
            const parts = beat.trigger.split(':').slice(1);
            const completedBeats = stateManager.get('completedBeats') || [];
            if (completedBeats.length < 12) return false;

            for (let i = 0; i < parts.length; i += 2) {
                const charId = parts[i];
                const threshold = parseInt(parts[i + 1]);
                if (!charId || Number.isNaN(threshold)) return false;
                if (stateManager.getLoyalty(charId) < threshold) return false;
            }

            return true;
        }

        // flagLoyalty:flag:character:threshold — gated loyalty scene after a story flag
        if (beat.trigger.startsWith('flagLoyalty:')) {
            const parts = beat.trigger.split(':');
            const flagName = parts[1];
            const charId = parts[2];
            const threshold = parseInt(parts[3]);
            if (!stateManager.hasFlag(flagName) || Number.isNaN(threshold)) return false;
            return stateManager.getLoyalty(charId) >= threshold;
        }

        // flagMultiLoyalty:flag:char:threshold:char:threshold — gated jealousy scene
        if (beat.trigger.startsWith('flagMultiLoyalty:')) {
            const parts = beat.trigger.split(':');
            const flagName = parts[1];
            if (!stateManager.hasFlag(flagName)) return false;

            const loyaltyParts = parts.slice(2);
            for (let i = 0; i < loyaltyParts.length; i += 2) {
                const charId = loyaltyParts[i];
                const threshold = parseInt(loyaltyParts[i + 1]);
                if (!charId || Number.isNaN(threshold)) return false;
                if (stateManager.getLoyalty(charId) < threshold) return false;
            }

            return true;
        }

        // afterTrustFlag:beatId|beatId:trustKey:threshold:flagName:true|false
        if (beat.trigger.startsWith('afterTrustFlag:') || beat.trigger.startsWith('afterNotTrustFlag:')) {
            const invert = beat.trigger.startsWith('afterNotTrustFlag:');
            const parts = beat.trigger.split(':');
            const beatIds = (parts[1] || '').split('|').map(id => id.trim()).filter(Boolean);
            const trustKey = parts[2];
            const threshold = parseInt(parts[3]);
            const flagName = parts[4];
            const expectedFlag = parts[5] !== 'false';
            const afterOk = beatIds.some(id => stateManager.isBeatCompleted(id));
            const trustOk = !Number.isNaN(threshold) && stateManager.getTrust(trustKey) >= threshold;
            const flagOk = !flagName || stateManager.hasFlag(flagName) === expectedFlag;
            const conditionOk = afterOk && trustOk && flagOk;
            return invert ? afterOk && !conditionOk : conditionOk;
        }

        // flag:flagName — plays when a flag is set
        if (beat.trigger.startsWith('flag:')) {
            const flagName = beat.trigger.substring(5);
            return stateManager.hasFlag(flagName);
        }

        // flagAfter:flagName:beatId|beatId2 — flag and one completed story beat are both required
        if (beat.trigger.startsWith('flagAfter:')) {
            const parts = beat.trigger.split(':');
            const flagName = parts[1];
            const beatIds = (parts[2] || '').split('|').map(id => id.trim()).filter(Boolean);
            return stateManager.hasFlag(flagName) && beatIds.some(id => stateManager.isBeatCompleted(id));
        }

        // choice:beatId:optionIndex
        if (beat.trigger.startsWith('choice:')) {
            const parts = beat.trigger.split(':');
            const choiceBeatId = parts[1];
            const optionIdx = parseInt(parts[2]);
            return stateManager.getChoice(choiceBeatId) === optionIdx;
        }

        return true;
    }

    // Play a single beat
    async _playBeat(beat) {
        if (!beat?.id || this._playingBeatIds.has(beat.id)) {
            return { skipped: true };
        }

        this._playingBeatIds.add(beat.id);
        try {
            return await this._playBeatUnchecked(beat);
        } finally {
            this._playingBeatIds.delete(beat.id);
        }
    }

    async _playBeatUnchecked(beat) {
        const chatId = beat.chat;

        // Auto-unlock the chat if not already unlocked
        if (!stateManager.isUnlocked('chats', chatId)) {
            stateManager.unlock('chats', chatId);
            if (this.onUnlock) this.onUnlock('chats', chatId);
        }

        // Auto-unlock contact for private chats
        if (chatId.startsWith('private_')) {
            const charId = chatId.replace('private_', '');
            if (!stateManager.isUnlocked('contacts', charId)) {
                stateManager.unlock('contacts', charId);
                if (this.onUnlock) this.onUnlock('contacts', charId);
            }
        }

        // Handle unlocks at beat start
        if (beat.unlock) {
            for (const u of beat.unlock) {
                stateManager.unlock(u.type, u.id);
                if (this.onUnlock) this.onUnlock(u.type, u.id);
            }
        }

        // Handle flags at beat start
        if (beat.setFlags) {
            for (const [flag, val] of Object.entries(beat.setFlags)) {
                stateManager.setFlag(flag, val);
            }
        }

        if (beat.identify) {
            for (const charId of beat.identify) {
                stateManager.identifyContact(charId);
            }
        }

        // Play messages
        for (let i = 0; i < beat.messages.length; i++) {
            const msg = beat.messages[i];

            const msgId = `${beat.id}_msg_${i}`;

            if (msg.type === 'navigate') {
                if (this.onNavigate) this.onNavigate(msg.screen, msg.params || {});
                await this._delay(msg.delay || 500);
                continue;
            }

            if (msg.type === 'lock') {
                stateManager.lock(msg.targetType || msg.typeName || 'chats', msg.id);
                if (this.onLock) this.onLock(msg.targetType || msg.typeName || 'chats', msg.id);
                await this._delay(msg.delay || 500);
                continue;
            }

            if (msg.type === 'pause') {
                await this._delay(msg.delay || 1000);
                continue;
            }

            if (msg.type === 'app_notification') {
                if (this.onAppNotification) {
                    this.onAppNotification(
                        (msg.title || '').replace(/\{player\}/g, stateManager.getPlayerName()),
                        (msg.text || '').replace(/\{player\}/g, stateManager.getPlayerName()),
                        msg.options || {}
                    );
                }
                await this._delay(msg.delay || 1000);
                continue;
            }

            if (msg.type === 'wait_flag') {
                await this._waitForFlag(msg.flag, msg.value ?? true);
                await this._delay(msg.delay || 300);
                continue;
            }

            if (msg.type === 'case_entry') {
                stateManager.addCaseEntry({
                    id: msg.id || msgId,
                    type: msg.entryType || 'note',
                    title: msg.title || 'Запись',
                    text: (msg.text || '').replace(/\{player\}/g, stateManager.getPlayerName()),
                    imageSrc: msg.imageSrc,
                    fileName: msg.fileName
                });
                await this._delay(msg.delay || 300);
                continue;
            }

            if (msg.type === 'note_update') {
                const noteId = msg.appendTo || msg.id || msgId;
                const existingNote = stateManager.get('notes')?.[noteId];
                const nextText = (msg.text || '').replace(/\{player\}/g, stateManager.getPlayerName());
                const text = msg.appendTo && existingNote?.text
                    ? `${existingNote.text.trimEnd()}\n\n${nextText}`
                    : nextText;

                stateManager.setNote(noteId, {
                    ...(existingNote || {}),
                    id: noteId,
                    title: msg.title || existingNote?.title || 'Заметка',
                    text,
                    time: msg.time || existingNote?.time || this._getTimestamp(),
                    type: msg.noteType || existingNote?.type || 'story',
                    autoTyping: false,
                    typedStart: undefined
                });

                if (msg.completeFlag) {
                    stateManager.setFlag(msg.completeFlag, true);
                }

                await this._delay(msg.delay || 300);
                continue;
            }

            if (msg.type === 'note_auto') {
                if (msg.skipIfFlag && stateManager.hasFlag(msg.skipIfFlag)) {
                    await this._delay(msg.delay || 300);
                    continue;
                }
                stateManager.setFlag('pendingNote', {
                    id: msg.id || msgId,
                    appendTo: msg.appendTo || null,
                    title: msg.title || 'Заметка',
                    text: (msg.text || '').replace(/\{player\}/g, stateManager.getPlayerName()),
                    time: msg.time || this._getTimestamp(),
                    type: msg.noteType || 'story',
                    autoTyping: true,
                    completeFlag: msg.noteCompleteFlag || null
                });
                stateManager.setFlag('notesUnread', true);
                if (this.onAppNotification) {
                    this.onAppNotification('Заметки', msg.notificationText || 'Нужно записать главное', { app: 'notes' });
                }
                await this._delay(msg.delay || 1200);
                continue;
            }

            // Check if this is a choice
            if (msg.type === 'choice') {
                // Wait for player choice
                const existingChoice = stateManager.getChoice(beat.id);
                if (existingChoice !== undefined) {
                    // Choice already made, skip
                    continue;
                }
                
                return await this._presentChoice(chatId, msg.options, beat.id);
            }

            // Glitch effect
            if (msg.type === 'glitch') {
                if (this.onGlitch) this.onGlitch();
                await this._delay(msg.delay || 500);
                continue;
            }

            if (this._messageExists(chatId, msgId)) {
                continue;
            }

            // Narrator
            if (msg.from === 'narrator') {
                const playerName = stateManager.getPlayerName();
                const narratorMsg = {
                    id: msgId,
                    type: 'narrator',
                    text: (msg.text || '').replace(/\{player\}/g, playerName),
                    timestamp: this._getTimestamp()
                };
                const added = stateManager.addChatMessage(chatId, narratorMsg);
                if (added && this.onMessage) this.onMessage(chatId, narratorMsg);
                await this._delay(msg.delay || 1000);
                continue;
            }

            // System message
            if (msg.type === 'system') {
                const playerName = stateManager.getPlayerName();
                const systemMsg = {
                    id: msgId,
                    type: 'system',
                    text: (msg.text || '').replace(/\{player\}/g, playerName),
                    timestamp: this._getTimestamp()
                };
                const added = stateManager.addChatMessage(chatId, systemMsg);
                if (added && this.onMessage) this.onMessage(chatId, systemMsg);

                if (msg.characterStatus?.id) {
                    stateManager.setCharacterOnline(msg.characterStatus.id, !!msg.characterStatus.online);
                }

                await this._delay(msg.delay || 1000);
                continue;
            }

            // Regular message — show typing, then message
            if (msg.from && msg.from !== 'player' && msg.from !== 'gg' && msg.from !== 'narrator') {
                stateManager.setCharacterOnline(msg.from, true);
            }

            const typingDuration = msg.typingDuration || Math.min(800 + (msg.text?.length || 0) * 25, 3000);
            
            // Show typing indicator
            if (this.onTyping) this.onTyping(chatId, msg.from, true);
            await this._delay(typingDuration / this.playbackSpeed);
            if (this.onTyping) this.onTyping(chatId, msg.from, false);

            // Replace {player} placeholder
            const playerName = stateManager.getPlayerName();
            const processedText = (msg.text || '').replace(/\{player\}/g, playerName);

            const {
                delay,
                typingDuration: _typingDuration,
                text: _rawText,
                ...extraFields
            } = msg;

            // Create message object
            const messageObj = {
                ...extraFields,
                id: msgId,
                type: msg.type || 'text',
                from: msg.from,
                text: processedText,
                src: msg.src,
                timestamp: this._getTimestamp()
            };

            // Deliver message
            const added = stateManager.addChatMessage(chatId, messageObj);
            if (added && this.onMessage) this.onMessage(chatId, messageObj);

            // Show notification if not viewing this chat
            if (added && this.onNotification && msg.from !== 'player') {
                this.onNotification(msg.from, processedText, chatId);
            }

            // Delay before next message
            await this._delay((msg.delay || 1500) / this.playbackSpeed);
        }

        // Mark beat as completed
        stateManager.completeBeat(beat.id);
        if (this.onBeatComplete) this.onBeatComplete(beat.id);
        return { completed: true };
    }

    // Continue playing after a beat completes
    async _continueAfterBeat(completedBeatId) {
        for (const beat of this.beats) {
            if (stateManager.isBeatCompleted(beat.id)) continue;
            if (this._canPlayBeat(beat)) {
                await this._delay(900);
                await this._playBeat(beat);
                await this._continueAfterBeat(beat.id);
                break;
            }
        }
    }

    // Present a choice to the player
    _presentChoice(chatId, options, beatId) {
        if (this.activeChoice?.beatId === beatId) {
            return Promise.resolve({ pausedForChoice: true });
        }

        if (stateManager.getChoice(beatId) !== undefined) {
            return Promise.resolve({ pausedForChoice: true });
        }

        return new Promise((resolve) => {
            let handled = false;
            this.activeChoice = {
                chatId,
                options,
                beatId,
                onChoose: (choiceIndex) => {
                    if (handled || stateManager.getChoice(beatId) !== undefined) return;
                    handled = true;
                    this.activeChoice = null;
                    const chosen = options[choiceIndex];
                    stateManager.setChoice(beatId, choiceIndex);

                    // Apply loyalty changes
                    if (chosen.loyalty) {
                        for (const [charId, delta] of Object.entries(chosen.loyalty)) {
                            stateManager.adjustLoyalty(charId, delta);
                        }
                    }

                    if (chosen.trust) {
                        for (const [key, delta] of Object.entries(chosen.trust)) {
                            stateManager.adjustTrust(key, delta);
                        }
                    }

                    // Set flags from choice
                    if (chosen.setFlag) {
                        stateManager.setFlag(chosen.setFlag, true);
                    }

                    const choiceText = (chosen.text || '').replace(/\{player\}/g, stateManager.getPlayerName());

                    if (chosen.sendMessage !== false) {
                        // Send player's message
                        const playerMsg = {
                            type: 'text',
                            from: 'player',
                            text: choiceText,
                            timestamp: this._getTimestamp()
                        };
                        if (this.onMessage) this.onMessage(chatId, playerMsg);
                        stateManager.addChatMessage(chatId, playerMsg);
                    }

                    // Mark beat complete
                    stateManager.completeBeat(beatId);
                    if (this.onBeatComplete) this.onBeatComplete(beatId);

                    resolve({ pausedForChoice: true, nextBeatId: chosen.next });

                    // Continue to the next beat specified by the choice
                    if (chosen.next) {
                        setTimeout(() => {
                            this.isPlaying = false;
                            this.playBeatById(chosen.next);
                        }, 1200);
                    } else {
                        // Continue with auto beats
                        setTimeout(() => {
                            this.isPlaying = false;
                            this._continueAfterBeat(beatId);
                        }, 1200);
                    }
                }
            };
            
            if (this.onChoice) {
                this.onChoice(chatId, options, beatId, this.activeChoice.onChoose);
            }
        });
    }

    _restorePendingChoice() {
        if (this.activeChoice || !this.beats.length) return;

        for (const beat of this.beats) {
            if (!beat?.id || stateManager.isBeatCompleted(beat.id)) continue;
            if (!this._canPlayBeat(beat)) continue;

            const choiceIndex = (beat.messages || []).findIndex(msg => msg.type === 'choice');
            const choiceMessage = choiceIndex >= 0 ? beat.messages[choiceIndex] : null;
            if (!choiceMessage) continue;
            if (stateManager.getChoice(beat.id) !== undefined) continue;
            if (!this._hasReachedChoice(beat, choiceIndex)) continue;

            this.activeChoice = {
                chatId: beat.chat,
                options: choiceMessage.options || [],
                beatId: beat.id,
                onChoose: (choiceIndex) => {
                    if (stateManager.getChoice(beat.id) !== undefined) return;
                    this.activeChoice = null;
                    const chosen = (choiceMessage.options || [])[choiceIndex];
                    if (!chosen) return;

                    stateManager.setChoice(beat.id, choiceIndex);

                    if (chosen.loyalty) {
                        for (const [charId, delta] of Object.entries(chosen.loyalty)) {
                            stateManager.adjustLoyalty(charId, delta);
                        }
                    }

                    if (chosen.trust) {
                        for (const [key, delta] of Object.entries(chosen.trust)) {
                            stateManager.adjustTrust(key, delta);
                        }
                    }

                    if (chosen.setFlag) {
                        stateManager.setFlag(chosen.setFlag, true);
                    }

                    const choiceText = (chosen.text || '').replace(/\{player\}/g, stateManager.getPlayerName());
                    if (chosen.sendMessage !== false) {
                        const playerMsg = {
                            type: 'text',
                            from: 'player',
                            text: choiceText,
                            timestamp: this._getTimestamp()
                        };
                        stateManager.addChatMessage(beat.chat, playerMsg);
                        if (this.onMessage) this.onMessage(beat.chat, playerMsg);
                    }

                    stateManager.completeBeat(beat.id);
                    if (this.onBeatComplete) this.onBeatComplete(beat.id);

                    setTimeout(() => {
                        this.isPlaying = false;
                        if (chosen.next) {
                            this.playBeatById(chosen.next);
                        } else {
                            this._continueAfterBeat(beat.id);
                        }
                    }, 1200);
                }
            };
            return;
        }
    }

    _hasReachedChoice(beat, choiceIndex) {
        if (choiceIndex <= 0) return true;
        const chatId = beat.chat;
        const priorMessages = (beat.messages || []).slice(0, choiceIndex);
        let needsEvidence = false;

        for (let i = 0; i < priorMessages.length; i++) {
            const msg = priorMessages[i];
            if (!msg || ['pause', 'navigate', 'wait_flag', 'case_entry', 'note_update', 'note_auto', 'app_notification', 'glitch', 'lock'].includes(msg.type)) {
                continue;
            }
            needsEvidence = true;
            if (!this._messageExists(chatId, `${beat.id}_msg_${i}`)) {
                return false;
            }
        }

        return needsEvidence;
    }

    _findPendingNextBeat() {
        const choices = stateManager.get('activeChoices') || {};
        const completedBeats = stateManager.get('completedBeats') || [];

        for (let i = completedBeats.length - 1; i >= 0; i--) {
            const beatId = completedBeats[i];
            const choiceIndex = choices[beatId];
            if (choiceIndex === undefined) continue;

            const beat = this.beats.find(b => b.id === beatId);
            const choiceMessage = beat?.messages?.find(msg => msg.type === 'choice');
            const nextId = choiceMessage?.options?.[choiceIndex]?.next;
            if (!nextId || stateManager.isBeatCompleted(nextId)) continue;

            return this.beats.find(b => b.id === nextId);
        }

        return null;
    }

    _delay(ms) {
        return new Promise(resolve => {
            this._playbackTimeout = setTimeout(resolve, ms);
        });
    }

    _messageExists(chatId, messageId) {
        if (!messageId) return false;
        return stateManager.getChatHistory(chatId).some(message => message.id === messageId);
    }

    _waitForFlag(flag, expectedValue = true) {
        if (!flag) return Promise.resolve();
        if (stateManager.hasFlag(flag) === expectedValue) return Promise.resolve();

        return new Promise(resolve => {
            const onFlag = ({ flag: changedFlag, value }) => {
                if (changedFlag === flag && !!value === !!expectedValue) {
                    stateManager.off('flag', onFlag);
                    resolve();
                }
            };
            stateManager.on('flag', onFlag);
        });
    }

    _getTimestamp() {
        const now = new Date();
        return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }

    stop() {
        this.isPlaying = false;
        clearTimeout(this._playbackTimeout);
        clearTimeout(this._typingTimeout);
    }
}

export const storyEngine = new StoryEngine();
