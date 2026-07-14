// ============================================
// Contacts Screen
// ============================================

import { stateManager } from '../../engine/stateManager.js';
import { getCharacter, getCharacterColor, characters } from '../../data/characters.js?v=123';

export function renderContactList({ onContactOpen, onBack }) {
    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'height:100%;display:flex;flex-direction:column;';

    const unlockedContacts = stateManager.get('unlockedContacts') || [];
    
    let listHTML = '';
    for (const charId of unlockedContacts) {
        const char = getCharacter(charId);
        if (!char) continue;

        const avatarBg = getCharacterColor(charId);
        const relationship = getRelationshipTone(charId);

        listHTML += `
            <div class="contact-item" data-contact="${charId}">
                <div class="contact-avatar-large" style="background:${avatarBg}">
                    ${char.avatarImage ? `<img src="${char.avatarImage}" alt="${char.name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />` : char.name.charAt(0)}
                </div>
                <div class="contact-info">
                    <div class="contact-name">${char.name}</div>
                    <div class="contact-status-text">${relationship.short}</div>
                </div>
            </div>
        `;
    }

    if (!listHTML) {
        listHTML = '<div style="padding:60px 24px;text-align:center;color:var(--text-muted);font-size:14px;">Контакты пока не найдены...<br><span style="font-size:12px;margin-top:8px;display:block;">Продолжай общаться, чтобы узнать людей</span></div>';
    }

    wrapper.innerHTML = `
        <div class="contacts-header">
            <button class="messenger-back-btn" id="contacts-back">←</button>
            <span class="contacts-title">Контакты</span>
            <div style="width:36px;"></div>
        </div>
        <div class="contacts-list">
            ${listHTML}
        </div>
    `;

    wrapper.querySelector('#contacts-back').addEventListener('click', onBack);

    wrapper.querySelectorAll('.contact-item').forEach(el => {
        el.addEventListener('click', () => {
            const charId = el.dataset.contact;
            if (onContactOpen) onContactOpen(charId);
        });
    });

    fragment.appendChild(wrapper);
    return fragment;
}

export function renderContactProfile({ characterId, onBack }) {
    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'height:100%;display:flex;flex-direction:column;overflow-y:auto;';

    const char = getCharacter(characterId);
    if (!char) {
        wrapper.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-muted);">Контакт не найден</div>';
        fragment.appendChild(wrapper);
        return fragment;
    }

    const avatarBg = getCharacterColor(characterId);
    const relationship = getRelationshipTone(characterId);
    const gallery = Array.isArray(char.gallery) ? char.gallery : [char.socialPhoto || char.avatarImage].filter(Boolean);

    wrapper.innerHTML = `
        <div class="profile-header-section" style="--profile-cover:url('${char.socialPhoto || char.avatarImage || ''}')">
            <button class="profile-back-btn" id="profile-back">←</button>
            <div class="profile-avatar-xl" style="background:${avatarBg}">
                ${char.avatarImage ? `<img src="${char.avatarImage}" alt="${char.name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />` : char.name.charAt(0)}
            </div>
            <div class="profile-name">${char.name}</div>
            <div class="profile-status">${relationship.status}</div>
        </div>

        <div class="profile-loyalty-section">
            <div class="profile-loyalty-label">
                <span class="profile-loyalty-title">Динамика</span>
                <span class="profile-loyalty-value" style="color:${relationship.color}">${relationship.label}</span>
            </div>
            <div class="profile-mood-text">${relationship.detail}</div>
        </div>

        <div class="profile-info-section">
            <div class="profile-info-card">
                <div class="profile-info-item">
                    <div class="profile-info-label">О себе</div>
                    <div class="profile-info-value">${char.bio || char.description || 'Неизвестно'}</div>
                </div>
            </div>
        </div>
        ${gallery.length ? `
        <section class="contact-profile-gallery">
            <div class="contact-profile-gallery-head"><strong>Фотографии</strong><span>${gallery.length}</span></div>
            <div class="contact-profile-photo-grid">
                ${gallery.map(photo => `<img src="${photo}" alt="" />`).join('')}
            </div>
        </section>
        ` : ''}
    `;

    wrapper.querySelector('#profile-back').addEventListener('click', onBack);

    fragment.appendChild(wrapper);
    return fragment;
}

function getRelationshipTone(characterId) {
    const loyalty = stateManager.getLoyalty(characterId);

    if (loyalty >= 75) {
        return {
            short: 'отвечает быстрее обычного',
            status: 'держится ближе',
            label: 'тянется к тебе',
            detail: 'В сообщениях стало меньше защиты. Этот человек может сказать лишнее, если не давить.',
            color: 'var(--accent-green)',
            revealsSecret: true
        };
    }

    if (loyalty <= 25) {
        return {
            short: 'читает, но тянет с ответом',
            status: 'насторожен',
            label: 'закрывается',
            detail: 'Слова цепляют сильнее, чем должны. Любой резкий вопрос может сорвать разговор.',
            color: 'var(--accent-red)',
            revealsSecret: true
        };
    }

    return {
        short: 'в сети',
        status: 'наблюдает',
        label: 'держит дистанцию',
        detail: 'Пока непонятно, доверяет ли он тебе или просто ждёт, что ты сам себя выдашь.',
        color: 'var(--accent-blue)',
        revealsSecret: false
    };
}
