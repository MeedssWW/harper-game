// ============================================
// Messenger — Chat List
// ============================================

import { stateManager } from '../../engine/stateManager.js';
import { storyEngine } from '../../engine/storyEngine.js?v=122';
import { getCharacter, getCharacterColor } from '../../data/characters.js?v=124';

// Chat definitions
const CHATS = {
    group_main: {
        id: 'group_main',
        name: 'Семеро',
        type: 'group',
        icon: '7',
        includePlayer: true,
        members: ['derek', 'tyler', 'mason', 'olivia', 'mia', 'brooke']
    },
    private_derek: {
        id: 'private_derek',
        name: 'Дерек Миллер',
        type: 'private',
        characterId: 'derek'
    },
    private_tyler: {
        id: 'private_tyler',
        name: 'Тайлер Росс',
        type: 'private',
        characterId: 'tyler'
    },
    private_mason: {
        id: 'private_mason',
        name: 'Мейсон Коул',
        type: 'private',
        characterId: 'mason'
    },
    private_olivia: {
        id: 'private_olivia',
        name: 'Оливия Грант',
        type: 'private',
        characterId: 'olivia'
    },
    private_mia: {
        id: 'private_mia',
        name: 'Миа Картер',
        type: 'private',
        characterId: 'mia'
    },
    private_brooke: {
        id: 'private_brooke',
        name: 'Брук Хейз',
        type: 'private',
        characterId: 'brooke'
    },
    private_unknown: {
        id: 'private_unknown',
        name: 'Неизвестный',
        type: 'private',
        characterId: 'unknown'
    },
    private_detective: {
        id: 'private_detective',
        name: 'Дэниел Рид',
        type: 'private',
        characterId: 'detective',
        verified: true
    },
    group_larks: {
        id: 'group_larks',
        name: 'Larks',
        type: 'group',
        icon: 'L',
        includePlayer: true,
        members: ['olivia', 'mia']
    }
};

export { CHATS };

export function renderChatList({ onChatOpen, onBack }) {
    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement('div');
    wrapper.className = 'native-chat-list-shell';

    wrapper.innerHTML = `
        <header class="native-messages-header">
            <div class="native-header-line">
                <button id="messenger-back" class="native-back-ghost" type="button" aria-label="Назад">
                    <img class="ui-lucide is-light" src="src/assets/icons/lucide/chevron-left.svg" alt="" />
                </button>
                <div class="native-coin-pill">5 <span></span></div>
            </div>
            <h1>Сообщения</h1>
            <p id="chat-count"></p>
        </header>

        <main class="native-white-panel native-messages-panel">
            <div class="chat-list" id="chat-list"></div>
        </main>
    `;

    wrapper.querySelector('#messenger-back').addEventListener('click', onBack);

    const renderRows = () => {
        const unlockedChats = stateManager.get('unlockedChats') || ['group_main'];
        const visibleChats = unlockedChats.filter(chatId => {
            const history = stateManager.getChatHistory(chatId);
            return history.length > 0 || storyEngine.activeChoice?.chatId === chatId;
        });
        const listEl = wrapper.querySelector('#chat-list');
        const countEl = wrapper.querySelector('#chat-count');
        if (!listEl || !countEl) return;

        countEl.textContent = formatChatCount(visibleChats.length);
        listEl.innerHTML = buildChatListHTML(visibleChats);

        listEl.querySelectorAll('.ios-chat-item').forEach(el => {
            el.addEventListener('click', () => {
                const chatId = el.dataset.chat;
                if (onChatOpen) onChatOpen(chatId);
            });
        });
    };

    let refreshFrame = null;
    let mounted = false;
    const cleanup = () => {
        stateManager.off('newMessage', scheduleRefresh);
        stateManager.off('chatRead', scheduleRefresh);
        stateManager.off('unlock', scheduleRefresh);
        stateManager.off('lock', scheduleRefresh);
        stateManager.off('contactIdentified', scheduleRefresh);
        window.removeEventListener('harper:chat-list-refresh', scheduleRefresh);
    };

    const scheduleRefresh = () => {
        if (mounted && !wrapper.isConnected) {
            cleanup();
            return;
        }

        if (refreshFrame) cancelAnimationFrame(refreshFrame);
        refreshFrame = requestAnimationFrame(() => {
            refreshFrame = null;
            renderRows();
        });
    };

    stateManager.on('newMessage', scheduleRefresh);
    stateManager.on('chatRead', scheduleRefresh);
    stateManager.on('unlock', scheduleRefresh);
    stateManager.on('lock', scheduleRefresh);
    stateManager.on('contactIdentified', scheduleRefresh);
    window.addEventListener('harper:chat-list-refresh', scheduleRefresh);

    renderRows();
    requestAnimationFrame(() => {
        mounted = true;
        renderRows();
    });

    fragment.appendChild(wrapper);
    return fragment;
}

function buildChatListHTML(unlockedChats) {
    let chatListHTML = '';

    for (const chatId of unlockedChats) {
        const chat = CHATS[chatId];
        if (!chat) continue;

        const history = stateManager.getChatHistory(chatId);
        const lastMsg = history.length > 0 ? history[history.length - 1] : null;
        const lastText = lastMsg ? truncate(getMessagePreview(lastMsg), 40) : 'Нет сообщений';
        const lastTime = lastMsg ? lastMsg.timestamp || 'Только что' : '';
        const unread = stateManager.isChatUnread(chatId);

        let previewPrefix = '';
        if (lastMsg && chat.type === 'group' && lastMsg.from && lastMsg.from !== 'player' && lastMsg.from !== 'narrator') {
            const char = getCharacter(lastMsg.from);
            if (char) previewPrefix = `${getSenderLabel(lastMsg.from)}: `;
        }

        const avatarHtml = getChatAvatarHtml(chat);
        const canReply = storyEngine.activeChoice?.chatId === chatId;

        chatListHTML += `
            <button class="ios-chat-item native-chat-row ${unread ? 'unread' : ''} ${canReply ? 'can-reply' : ''}" data-chat="${chatId}" type="button">
                ${avatarHtml}
                <div class="native-chat-row-body">
                    <div class="native-chat-row-top">
                        <span class="native-chat-row-name">${chat.name}</span>
                        <span class="native-chat-row-time">${lastTime}</span>
                    </div>
                    <div class="native-chat-row-preview">
                        ${previewPrefix}${lastText}
                    </div>
                </div>
                ${canReply ? messageIcon() : '<span class="native-chat-row-spacer" aria-hidden="true"></span>'}
            </button>
        `;
    }

    return chatListHTML || '<div class="native-empty-state">Нет сообщений</div>';
}

function formatChatCount(count) {
    if (count === 1) return '1 чат';
    if (count > 1 && count < 5) return `${count} чата`;
    return `${count} чатов`;
}

function messageIcon() {
    return `<img class="native-chat-row-icon ui-lucide is-light" src="src/assets/icons/lucide/message-circle.svg" alt="" aria-hidden="true" />`;
}

function truncate(str, max) {
    if (str.length <= max) return str;
    return str.substring(0, max) + '...';
}

function getMessagePreview(message) {
    if (!message) return '';
    if (message.type === 'hidden') return '';
    if (message.type === 'voice') return `Голосовое ${message.duration || ''}`.trim();
    if (message.type === 'call') return message.title || 'Звонок';
    if (message.type === 'location') return message.title ? `Локация: ${message.title}` : 'Локация';
    if (message.type === 'link') return message.title || 'Ссылка';
    if (message.type === 'image') return message.caption || 'Фото';
    if (message.type === 'deleted') return 'Сообщение удалено';
    return message.text || '';
}

function getSenderLabel(characterId) {
    const char = getCharacter(characterId);
    if (!char) return characterId;
    if (characterId === 'unknown' || characterId === 'harper') return char.name;
    return stateManager.isContactIdentified(characterId) ? char.name : (char.phone || 'Неизвестный номер');
}

function getChatAvatarHtml(chat) {
    if (chat.type === 'group') {
        const memberAvatars = getActiveGroupMembers(chat).slice(0, 4).map(memberId => {
            if (memberId === 'player') {
                return `<span style="background:#2a3f6f">Я</span>`;
            }

            const member = getCharacter(memberId);
            return member?.avatarImage
                ? `<img src="${member.avatarImage}" alt="">`
                : `<span style="background:${getCharacterColor(memberId) || '#64748b'}">${member?.name?.charAt(0) || '?'}</span>`;
        }).join('');

        return `
            <div class="group-avatar-collage" aria-hidden="true">
                ${memberAvatars}
            </div>
        `;
    }

    const char = getCharacter(chat.characterId);
    const bg = getCharacterColor(chat.characterId) || '#2f8cff';
    const hideAvatar = chat.characterId === 'unknown' && stateManager.hasFlag('unknownChatUnlocked');
    return `
        <div class="chat-list-avatar" style="background:${bg};">
            ${char?.avatarImage && !hideAvatar ? `<img src="${char.avatarImage}" alt="${char.name}" />` : (char?.name?.charAt(0) || '?')}
        </div>
    `;
}

export function getActiveGroupMembers(chat) {
    if (!chat || chat.type !== 'group') return [];

    const members = new Set([
        ...(chat.includePlayer ? ['player'] : []),
        ...(chat.members || [])
    ]);

    const history = stateManager.getChatHistory(chat.id);
    for (const message of history) {
        if (message.type !== 'system' || !message.text) continue;
        const leavingId = getLeavingMemberId(message.text);
        if (leavingId) members.delete(leavingId);
    }

    return [...members];
}

function getLeavingMemberId(text) {
    const normalized = String(text).toLowerCase().replace(/[.!?]+$/, '');
    const matchMap = {
        'мейсон вышел из группы': 'mason',
        'мейсон вышел из чата': 'mason',
        'брук вышла из группы': 'brooke',
        'брук вышла из чата': 'brooke',
        'миа вышла из группы': 'mia',
        'миа вышла из чата': 'mia',
        'оливия вышла из группы': 'olivia',
        'оливия вышла из чата': 'olivia',
        'дерек вышел из группы': 'derek',
        'дерек вышел из чата': 'derek',
        'тайлер вышел из группы': 'tyler',
        'тайлер вышел из чата': 'tyler'
    };

    return matchMap[normalized] || null;
}


