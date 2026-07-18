// ============================================
// Messenger — Chat View (message bubbles + choices)
// ============================================

import { stateManager } from '../../engine/stateManager.js';
import { getCharacter, getCharacterColor } from '../../data/characters.js?v=124';
import { CHATS, getActiveGroupMembers } from './chatList.js?v=127';
import { storyEngine } from '../../engine/storyEngine.js?v=121';

export class ChatView {
    constructor(chatId, container, onBack, onOpenDocument = null) {
        this.chatId = chatId;
        this.container = container;
        this.onBack = onBack;
        this.onOpenDocument = onOpenDocument;
        this.messagesEl = null;
        this.choicePanelEl = null;
        this.typingEl = null;
        this.chat = CHATS[chatId];
        this.statusEl = null;
        this.statusHandler = null;
    }

    render() {
        const chat = this.chat;
        if (!chat) return;

        let avatarBg;
        let avatarText;
        let chatName;
        let statusText;

        if (chat.type === 'group') {
            avatarBg = 'linear-gradient(135deg, #4a9eff, #6366f1)';
            avatarText = getActiveGroupMembers(chat).slice(0, 4).map(memberId => {
                if (memberId === 'player') {
                    return `<span style="background:#2a3f6f">Я</span>`;
                }

                const member = getCharacter(memberId);
                return member?.avatarImage
                    ? `<img src="${member.avatarImage}" alt="">`
                    : `<span style="background:${getCharacterColor(memberId) || '#64748b'}">${member?.name?.charAt(0) || '?'}</span>`;
            }).join('');
            chatName = chat.name;
            statusText = formatParticipantCount(getActiveGroupMembers(chat).length);
        } else {
            const char = getCharacter(chat.characterId);
            avatarBg = getCharacterColor(chat.characterId) || '#1f2937';
            avatarText = char ? char.name.charAt(0) : '?';
            chatName = char ? this._getCharacterLabel(chat.characterId) : chat.name;
            statusText = this._getStatusText(chat.characterId);
        }

        this.container.innerHTML = `
            <div class="chat-header">
                <button class="chat-header-back" id="chat-back" aria-label="Назад">
                    <img src="src/assets/icons/lucide/chevron-left.svg" alt="" />
                </button>
                <div class="chat-header-avatar ${chat.type === 'group' ? 'group-avatar-collage compact' : ''}" style="background:${avatarBg}; overflow:hidden; cursor:pointer;" id="chat-profile-btn">
                    ${chat.type !== 'group' && getCharacter(chat.characterId)?.avatarImage && !this._shouldHideAvatar(chat.characterId) ? `<img src="${getCharacter(chat.characterId).avatarImage}" alt="" />` : avatarText}
                </div>
                <div class="chat-header-info" style="cursor:pointer;" id="chat-profile-info">
                    <div class="chat-header-name">${chatName}</div>
                    <div class="chat-header-status ${chat.type !== 'group' && this._isCharacterOnline(chat.characterId) ? 'online' : ''}">${statusText}</div>
                </div>
            </div>
            <div class="chat-messages" id="chat-messages" aria-live="polite" aria-relevant="additions"></div>
            <div class="chat-input-area" id="chat-input-area">
                <div class="chat-input-attach" aria-hidden="true">
                    <img src="src/assets/icons/lucide/paperclip.svg" alt="" />
                </div>
                <div style="flex:1; position:relative; display:flex; align-items:center;">
                    <div class="chat-input-box" aria-live="polite">Ответ появится здесь</div>
                    <div class="chat-input-emoji" style="position:absolute; right:12px;" aria-hidden="true">
                        <img src="src/assets/icons/lucide/smile.svg" alt="" />
                    </div>
                </div>
                <div class="chat-input-mic" aria-hidden="true">
                    <img src="src/assets/icons/lucide/send-horizontal.svg" alt="" />
                </div>
            </div>
        `;

        this.messagesEl = this.container.querySelector('#chat-messages');
        this.inputAreaEl = this.container.querySelector('#chat-input-area');
        this.statusEl = this.container.querySelector('.chat-header-status');
        this.container.querySelector('#chat-back').addEventListener('click', this.onBack);

        if (chat.type !== 'group') {
            this.statusHandler = ({ characterId }) => {
                if (characterId === chat.characterId) this._updateHeaderStatus();
            };
            stateManager.on('characterStatus', this.statusHandler);
        } else {
            this.statusHandler = ({ chatId }) => {
                if (chatId === this.chatId) this._updateHeaderStatus();
            };
            stateManager.on('newMessage', this.statusHandler);
        }

        if (chat.type !== 'group' && chat.characterId !== 'unknown') {
            const showProfile = () => this._showProfile(chat.characterId);
            this.container.querySelector('#chat-profile-btn').addEventListener('click', showProfile);
            this.container.querySelector('#chat-profile-info').addEventListener('click', showProfile);
        }

        stateManager.markChatRead(this.chatId);

        const history = stateManager.getChatHistory(this.chatId);
        for (const msg of history) {
            this._renderMessage(msg, false);
        }

        if (storyEngine.activeChoice && storyEngine.activeChoice.chatId === this.chatId) {
            this.showChoices(storyEngine.activeChoice.options, storyEngine.activeChoice.onChoose);
        }

        this._scrollToBottom(false);
        requestAnimationFrame(() => this._scrollToBottom(false));
        setTimeout(() => this._scrollToBottom(false), 80);
        setTimeout(() => this._scrollToBottom(false), 260);
    }

    _showProfile(charId) {
        const char = getCharacter(charId);
        if (!char) return;

        stateManager.identifyContact(charId);
        const relationship = this._getRelationshipTone(charId);
        const gallery = Array.isArray(char.gallery) ? char.gallery : [char.socialPhoto || char.avatarImage].filter(Boolean);
        const overlay = document.createElement('div');
        overlay.className = 'profile-overlay social-profile-overlay';

        overlay.innerHTML = `
            <div class="social-profile-top">
                <button id="close-profile" type="button" aria-label="Закрыть"><img class="ui-lucide is-light" src="src/assets/icons/lucide/x.svg" alt="" /></button>
                <span>${this._escapeHtml(char.handle || char.phone || '')}</span>
            </div>
            <div class="social-profile-scroll">
                <div class="social-profile-hero" style="background:${char.avatarColor};">
                    ${char.socialPhoto ? `<img src="${char.socialPhoto}" alt="" />` : ''}
                </div>
                <div class="social-profile-card">
                    <div class="social-profile-avatar" style="background:${char.avatarColor};">
                        ${char.avatarImage ? `<img src="${char.avatarImage}" alt="" />` : this._escapeHtml(char.name.charAt(0))}
                    </div>
                    <h2>${this._escapeHtml(char.name)}</h2>
                    <div class="social-profile-phone">${this._escapeHtml(char.phone || 'номер скрыт')}</div>
                    <p>${this._escapeHtml(char.bio || char.description || 'Профиль почти пустой.')}</p>
                    <div class="social-profile-mood" style="border-color:${relationship.color};">
                        <strong>${relationship.label}</strong>
                        <span>${relationship.detail}</span>
                    </div>
                </div>
                ${gallery.length ? `
                    <section class="social-profile-gallery" aria-label="Фотографии ${this._escapeHtml(char.name)}">
                        <div class="social-profile-gallery-head">
                            <strong>Моменты</strong>
                            <span>${gallery.length} фото</span>
                        </div>
                        <div class="social-profile-photo-grid">
                            ${gallery.map((photo, index) => `<button type="button" data-profile-photo="${index}" aria-label="Открыть фотографию ${index + 1}"><img src="${photo}" alt="" /></button>`).join('')}
                        </div>
                    </section>
                ` : ''}
            </div>
        `;

        overlay.querySelector('#close-profile').addEventListener('click', () => {
            overlay.remove();
            this.render();
        });
        overlay.querySelectorAll('[data-profile-photo]').forEach(button => {
            button.addEventListener('click', () => {
                const photo = gallery[Number(button.dataset.profilePhoto)];
                const viewer = document.createElement('button');
                viewer.type = 'button';
                viewer.className = 'social-profile-photo-viewer';
                viewer.setAttribute('aria-label', 'Закрыть фотографию');
                viewer.innerHTML = `<img src="${photo}" alt="" /><span><img class="ui-lucide is-light" src="src/assets/icons/lucide/x.svg" alt="" /></span>`;
                viewer.addEventListener('click', () => viewer.remove());
                overlay.appendChild(viewer);
            });
        });
        const overlayHost = document.getElementById('screen-container') || this.container;
        overlayHost.appendChild(overlay);
    }

    _getStatusText(characterId) {
        if (characterId === 'unknown') return 'неизвестный номер';
        const char = getCharacter(characterId);
        if (!stateManager.isContactIdentified(characterId)) return char?.phone || 'номер не подписан';
        return this._isCharacterOnline(characterId) ? 'в сети' : 'не в сети';
    }

    _updateHeaderStatus() {
        if (!this.statusEl) return;

        if (this.chat?.type === 'group') {
            this.statusEl.textContent = formatParticipantCount(getActiveGroupMembers(this.chat).length);
            this.statusEl.classList.remove('online');
            return;
        }

        this.statusEl.textContent = this._getStatusText(this.chat.characterId);
        this.statusEl.classList.toggle('online', this._isCharacterOnline(this.chat.characterId));
    }

    _isCharacterOnline(characterId) {
        const historyStatus = this._getHistoryOnlineStatus(characterId);
        if (historyStatus !== null) return historyStatus;
        return stateManager.isCharacterOnline(characterId);
    }

    _getHistoryOnlineStatus(characterId) {
        const char = getCharacter(characterId);
        if (!char) return null;
        const firstName = char.name.split(' ')[0];
        const history = stateManager.getChatHistory(this.chatId);

        for (let i = history.length - 1; i >= 0; i--) {
            const msg = history[i];
            if (msg.type === 'system' && typeof msg.text === 'string') {
                if (msg.text.includes(`${firstName} выш`) && msg.text.includes('из сети')) return false;
                if (msg.text.includes(`${firstName} в сети`)) return true;
            }
            if (msg.from === characterId) return true;
        }

        return null;
    }

    _getCharacterLabel(charId) {
        const char = getCharacter(charId);
        if (!char) return charId;
        if (charId === 'unknown' || charId === 'harper') return char.name;
        return stateManager.isContactIdentified(charId) ? char.name : (char.phone || 'Неизвестный номер');
    }

    _shouldHideAvatar(charId) {
        return charId === 'unknown' && stateManager.hasFlag('unknownChatUnlocked');
    }

    _getRelationshipTone(charId) {
        const loyalty = stateManager.getLoyalty(charId);

        if (loyalty >= 75) {
            return {
                label: 'держится ближе',
                detail: 'В ответах меньше защиты. Можно рискнуть более прямым вопросом.',
                color: '#22c55e'
            };
        }

        if (loyalty <= 25) {
            return {
                label: 'на грани срыва',
                detail: 'Слишком много недоверия. Следующая ошибка может закрыть личный разговор.',
                color: '#ef4444'
            };
        }

        return {
            label: 'держит дистанцию',
            detail: 'Пока непонятно, это доверие или попытка понять, что ты помнишь.',
            color: '#8888a8'
        };
    }

    addMessage(message, animate = true) {
        this._renderMessage(message, animate);
        if (message.type === 'system') {
            this._updateHeaderStatus();
        }
        this._scrollToBottom(true);
    }

    showTyping(characterId) {
        this.removeTyping();

        const char = getCharacter(characterId);
        const avatarBg = getCharacterColor(characterId) || '#1f2937';
        const avatarText = char ? char.name.charAt(0) : '?';
        const avatarHtml = char?.avatarImage
            ? `<img class="message-avatar-small message-avatar-img" src="${char.avatarImage}" alt="${char.name}" />`
            : `<div class="message-avatar-small" style="background:${avatarBg}">${avatarText}</div>`;

        const el = document.createElement('div');
        el.className = 'typing-indicator';
        el.id = 'typing-indicator';
        el.innerHTML = `
            ${avatarHtml}
            <div class="typing-bubble">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
            <span class="typing-name">${this._escapeHtml(char?.name?.split(' ')[0] || '')} печатает</span>
        `;

        this.typingEl = el;
        this.messagesEl.appendChild(el);
        this._scrollToBottom(true);
    }

    removeTyping() {
        if (this.typingEl && this.typingEl.parentNode) {
            this.typingEl.parentNode.removeChild(this.typingEl);
            this.typingEl = null;
        }
        const existing = this.messagesEl?.querySelector('#typing-indicator');
        if (existing) existing.remove();
    }

    showChoices(options, onChoose) {
        this.removeChoices();

        const inputBox = this.inputAreaEl?.querySelector('.chat-input-box');
        this.inputAreaEl?.classList.add('chat-input-area--choice-mode');
        if (inputBox) {
            inputBox.textContent = 'Выберите ответ';
            inputBox.classList.add('is-waiting-choice');
        }

        const panel = document.createElement('div');
        panel.className = 'choice-panel choice-panel-enter';
        panel.id = 'choice-panel';
        panel.setAttribute('role', 'group');
        panel.setAttribute('aria-label', 'Варианты ответа');

        const panelHeight = Math.min(
            Math.round((this.container.clientHeight || 820) * 0.52),
            430
        );
        panel.style.setProperty('--choice-panel-open-height', `${panelHeight}px`);

        let html = '<div class="choice-label">Выберите ответ</div>';
        options.forEach((opt, i) => {
            const choiceText = (opt.text || '').replace(/\{player\}/g, stateManager.getPlayerName());
            html += `<button class="choice-btn" data-index="${i}" style="--choice-index:${i}">${this._escapeHtml(choiceText)}</button>`;
        });
        panel.innerHTML = html;

        panel.querySelectorAll('.choice-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (navigator.vibrate) navigator.vibrate(9);
                const idx = parseInt(btn.dataset.index, 10);
                const selectedText = btn.textContent.trim();
                panel.querySelectorAll('.choice-btn').forEach(b => {
                    b.style.opacity = '0.3';
                    b.style.pointerEvents = 'none';
                });
                btn.style.opacity = '1';
                btn.classList.add('selected');
                panel.classList.add('is-selecting');

                if (inputBox) {
                    inputBox.textContent = selectedText;
                    inputBox.classList.remove('is-waiting-choice');
                    inputBox.classList.add('has-choice-preview');
                }
                this.inputAreaEl?.classList.add('has-choice-preview');

                setTimeout(() => {
                    this.removeChoices();
                    onChoose(idx);
                }, 560);
            });
        });

        this.choicePanelEl = panel;
        if (this.inputAreaEl?.parentNode === this.container) {
            this.container.insertBefore(panel, this.inputAreaEl);
        } else {
            this.container.appendChild(panel);
        }

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (this.choicePanelEl !== panel) return;
                panel.classList.add('is-visible');
                this._scrollToBottom(true);
            });
        });
        setTimeout(() => {
            if (this.choicePanelEl === panel) this._scrollToBottom(true);
        }, 560);
    }

    removeChoices() {
        if (this.choicePanelEl && this.choicePanelEl.parentNode) {
            this.choicePanelEl.parentNode.removeChild(this.choicePanelEl);
            this.choicePanelEl = null;
        }
        if (this.inputAreaEl) {
            this.inputAreaEl.style.removeProperty('display');
            this.inputAreaEl.classList.remove('chat-input-area--choices', 'chat-input-area--choice-mode', 'has-choice-preview');
            this.inputAreaEl.style.removeProperty('--chat-input-height');
            const inputBox = this.inputAreaEl.querySelector('.chat-input-box');
            if (inputBox) {
                inputBox.textContent = 'Ответ появится здесь';
                inputBox.classList.remove('is-waiting-choice', 'has-choice-preview');
            }
        }
    }

    _renderMessage(message, animate) {
        if (!this.messagesEl) return;
        if (message.type === 'hidden') return;

        if (message.type === 'system') {
            const el = document.createElement('div');
            el.className = 'message-system';
            el.textContent = message.text;
            if (!animate) el.style.animation = 'none';
            this.messagesEl.appendChild(el);
            return;
        }

        if (message.type === 'narrator') {
            const el = document.createElement('div');
            el.className = 'message-narrator';
            el.textContent = message.text;
            if (!animate) el.style.animation = 'none';
            this.messagesEl.appendChild(el);
            return;
        }

        const isOutgoing = message.from === 'player' || message.from === 'gg';
        const char = isOutgoing ? null : getCharacter(message.from);
        const avatarBg = isOutgoing ? '#2a3f6f' : (getCharacterColor(message.from) || '#1f2937');
        const avatarText = isOutgoing
            ? '<img class="message-avatar-lucide ui-lucide is-light" src="src/assets/icons/lucide/user-round.svg" alt="" />'
            : (char ? char.name.charAt(0) : '?');
        const senderColor = isOutgoing ? '' : this._getSenderColor(message.from);

        let avatarHtml = `<div class="message-avatar-small" style="background:${avatarBg}" ${!isOutgoing && char ? `data-profile-character="${message.from}"` : ''}>${avatarText}</div>`;
        if (char && char.avatarImage && !this._shouldHideAvatar(message.from)) {
            avatarHtml = `<img class="message-avatar-small message-avatar-img" src="${char.avatarImage}" alt="${char.name}" data-profile-character="${message.from}" />`;
        }

        const wrapper = document.createElement('div');
        wrapper.className = `message-wrapper ${isOutgoing ? 'outgoing' : 'incoming'} message-type-${message.type || 'text'}`;
        wrapper.dataset.sender = message.from || '';
        const previousMessage = this.messagesEl.querySelector('.message-wrapper:last-of-type');
        if (previousMessage?.dataset.sender === wrapper.dataset.sender) {
            wrapper.classList.add('message-consecutive');
            previousMessage.classList.add('message-has-next');
        }
        if (!animate) wrapper.style.animation = 'none';

        const showSender = !isOutgoing && this.chat?.type === 'group';
        const senderLabel = !isOutgoing ? this._getCharacterLabel(message.from) : '';

        wrapper.innerHTML = `
            ${avatarHtml}
            <div class="message-bubble">
                ${showSender ? `<span class="message-sender" style="color:${senderColor}">${this._escapeHtml(senderLabel)}</span>` : ''}
                ${this._renderMessageContent(message)}
                <div class="message-time-inline">${message.timestamp || ''}${isOutgoing ? '<span class="message-checks" aria-label="Доставлено"><img class="ui-lucide is-light" src="src/assets/icons/lucide/check-check.svg" alt="" /></span>' : ''}</div>
            </div>
        `;

        this.messagesEl.appendChild(wrapper);

        const profileTarget = wrapper.querySelector('[data-profile-character]');
        if (profileTarget && char && message.from !== 'unknown' && message.from !== 'harper') {
            profileTarget.addEventListener('click', () => this._showProfile(message.from));
        }

        wrapper.querySelectorAll('.message-image').forEach(img => {
            img.addEventListener('click', () => {
                this._showImageViewer(img.getAttribute('src'), message.caption || '');
            });
        });

        wrapper.querySelectorAll('.message-document, .message-app-card').forEach(doc => {
            doc.addEventListener('click', () => {
                if (this.onOpenDocument) {
                    this.onOpenDocument(message);
                }
            });
        });

        wrapper.querySelectorAll('.message-video').forEach(video => {
            video.addEventListener('play', () => {
                if (message.analysisAction === 'frame_analysis') {
                    stateManager.setFlag('videoFragmentViewed', true);
                }
            });

            video.addEventListener('ended', () => {
                if (message.analysisAction === 'frame_analysis') {
                    stateManager.setFlag('videoFragmentViewed', true);
                    wrapper.querySelector('.message-video-analyze')?.classList.add('visible');
                }
            });
        });

        wrapper.querySelectorAll('.message-video-analyze').forEach(button => {
            button.addEventListener('click', () => {
                if (this.onOpenDocument) {
                    this.onOpenDocument(message);
                }
            });
        });
    }

    _showImageViewer(src, caption = '') {
        if (!src) return;
        const overlay = document.createElement('div');
        overlay.className = 'image-viewer-overlay';
        overlay.innerHTML = `
            <button class="image-viewer-close" type="button" aria-label="Закрыть"><img class="ui-lucide is-light" src="src/assets/icons/lucide/x.svg" alt="" /></button>
            <div class="image-viewer-frame">
                <img src="${this._escapeHtml(src)}" alt="" />
                ${caption ? `<div class="image-viewer-caption">${this._escapeHtml(caption)}</div>` : ''}
            </div>
        `;

        const close = () => overlay.remove();
        overlay.addEventListener('click', event => {
            if (event.target === overlay) close();
        });
        overlay.querySelector('.image-viewer-close').addEventListener('click', close);

        const overlayHost = document.getElementById('screen-container') || this.container;
        overlayHost.appendChild(overlay);
    }

    _getSenderColor(characterId) {
        const readableColors = {
            derek: '#9ecbff',
            tyler: '#7cf4df',
            mason: '#ff9da8',
            olivia: '#e4b2ff',
            mia: '#76f0a5',
            brooke: '#f4f7ff',
            unknown: '#f4f7ff',
            detective: '#93c5fd',
            harper: '#ffd58a'
        };

        return readableColors[characterId] || '#f4f7ff';
    }

    _renderMessageContent(message) {
        if (message.type === 'deleted') {
            return `<div class="message-deleted">Сообщение удалено</div>`;
        }

        if (message.type === 'voice') {
            const bars = Array.from({ length: 18 }, (_, i) => `<span style="height:${8 + (i % 5) * 4}px"></span>`).join('');
            return `
                <div class="message-voice">
                    <div class="voice-play" aria-hidden="true"><img class="ui-lucide is-light" src="src/assets/icons/lucide/play.svg" alt="" /></div>
                    <div class="voice-wave">${bars}</div>
                    <div class="voice-duration">${this._escapeHtml(message.duration || '0:00')}</div>
                </div>
                ${message.text ? `<div class="message-transcript">${this._formatText(message.text)}</div>` : ''}
            `;
        }

        if (message.type === 'call') {
            return `
                <div class="message-call">
                    <div class="call-icon" aria-hidden="true"><img class="ui-lucide is-light" src="src/assets/icons/lucide/phone.svg" alt="" /></div>
                    <div>
                        <div class="call-title">${this._escapeHtml(message.title || 'Звонок')}</div>
                        <div class="call-subtitle">${this._escapeHtml(message.text || 'Пропущено')}</div>
                    </div>
                </div>
            `;
        }

        if (message.type === 'location') {
            return `
                <div class="message-location">
                    <div class="location-map"><span></span></div>
                    <div class="location-title">${this._escapeHtml(message.title || 'Локация')}</div>
                    <div class="location-subtitle">${this._escapeHtml(message.subtitle || '')}</div>
                    ${message.text ? `<div class="location-meta">${this._escapeHtml(message.text)}</div>` : ''}
                </div>
            `;
        }

        if (message.type === 'link') {
            return `
                <div class="message-link">
                    <div class="link-domain">${this._escapeHtml(message.text || 'link')}</div>
                    <div class="link-title">${this._escapeHtml(message.title || '')}</div>
                    <div class="link-subtitle">${this._escapeHtml(message.subtitle || '')}</div>
                </div>
            `;
        }

        if (message.type === 'app') {
            return `
                <button class="message-app-card" type="button">
                    <div class="app-card-icon">
                        <img class="ui-lucide is-light" src="src/assets/icons/lucide/smartphone.svg" alt="" />
                    </div>
                    <div>
                        <div class="document-title">${this._escapeHtml(message.title || 'Приложение')}</div>
                        <div class="document-subtitle">${this._escapeHtml(message.subtitle || message.text || 'Открыть')}</div>
                    </div>
                    <span class="app-card-open">Открыть</span>
                </button>
            `;
        }

        if (message.type === 'document') {
            return `
                <button class="message-document" type="button">
                    <div class="document-icon">
                        <img class="ui-lucide is-light" src="src/assets/icons/lucide/file-text.svg" alt="" />
                    </div>
                    <div>
                        <div class="document-title">${this._escapeHtml(message.title || 'Документ')}</div>
                        <div class="document-subtitle">${this._escapeHtml(message.subtitle || message.text || 'Открыть')}</div>
                    </div>
                </button>
            `;
        }

        if (message.type === 'video') {
            const canAnalyze = message.analysisAction === 'frame_analysis';
            const analyzeVisible = canAnalyze && stateManager.hasFlag('videoFragmentViewed');
            const orientationClass = message.orientation === 'vertical' ? ' vertical' : '';
            return `
                <div class="message-video-card${orientationClass}">
                    <video class="message-video${orientationClass}" controls playsinline preload="metadata" ${message.poster ? `poster="${this._escapeHtml(message.poster)}"` : ''}>
                        <source src="${this._escapeHtml(message.src || '')}" type="${this._escapeHtml(message.mimeType || 'video/mp4')}">
                    </video>
                    <div class="message-video-meta">
                        <span>${this._escapeHtml(message.title || 'Видео')}</span>
                        <strong>${this._escapeHtml(message.duration || '')}</strong>
                    </div>
                    ${message.caption ? `<div class="message-caption">${this._escapeHtml(message.caption)}</div>` : ''}
                    ${canAnalyze ? `<button class="message-video-analyze ${analyzeVisible ? 'visible' : ''}" type="button">Изучить видео</button>` : ''}
                </div>
            `;
        }

        const textHtml = message.text ? `<div class="message-text">${this._formatText(message.text)}</div>` : '';
        const imageSrc = this._getImageSrc(message);
        const imageHtml = imageSrc ? `<img class="message-image" src="${this._escapeHtml(imageSrc)}" alt="" />` : '';
        const captionHtml = message.caption ? `<div class="message-caption">${this._escapeHtml(message.caption)}</div>` : '';

        return `${textHtml}${imageHtml}${captionHtml}`;
    }

    _getImageSrc(message) {
        if (
            message?.type === 'image' &&
            message.caption === 'Харпер Вэнс' &&
            (
                message.src === 'src/assets/avatars/avatar_harper_live.png' ||
                message.src === 'src/assets/harper_photos/harper_intro_portrait.jpg'
            )
        ) {
            return 'src/assets/harper_photos/harper_cafe.jpg';
        }

        if (
            message?.type === 'image' &&
            message.caption === 'Фото 3' &&
            message.src === 'src/assets/harper_photos/harper_cafe.jpg'
        ) {
            return 'src/assets/harper_photos/harper_larks_window.jpg';
        }

        return message.src || '';
    }

    _formatText(text) {
        return this._escapeHtml(text).replace(/\*([^*]+)\*/g, '<em>$1</em>');
    }

    _escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    _scrollToBottom(smooth) {
        if (this.messagesEl) {
            if (smooth) {
                this.messagesEl.scrollTo({
                    top: this.messagesEl.scrollHeight,
                    behavior: 'smooth'
                });
            } else {
                this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
            }
        }
    }

    destroy() {
        if (this.statusHandler) {
            stateManager.off('characterStatus', this.statusHandler);
            stateManager.off('newMessage', this.statusHandler);
            this.statusHandler = null;
        }
        this.removeTyping();
        this.removeChoices();
    }
}

function formatParticipantCount(count) {
    if (count === 1) return '1 участник';
    if (count > 1 && count < 5) return `${count} участника`;
    return `${count} участников`;
}


