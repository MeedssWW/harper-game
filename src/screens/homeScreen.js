// ============================================
// Home Screen
// ============================================

import { stateManager } from '../engine/stateManager.js';

export function renderHomeScreen({ onAppOpen }) {
    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement('div');
    wrapper.className = 'home-shell';

    const unreadCount = getUnreadCount();
    const apps = [
        { id: 'messenger', label: 'Чаты', action: 'messenger', icon: iconMessenger(), badge: unreadCount },
        { id: 'contacts', label: 'Контакты', action: 'contacts', icon: iconContacts() },
        { id: 'notes', label: 'Заметки', action: 'notes', icon: iconNotes(), badge: getNotesBadge(), attention: isNotesMechanicPending() },
        { id: 'casefile', label: 'Дело', action: 'caseFile', icon: iconClues(), badge: getCaseBadge(), visible: isCaseFileVisible() },
        { id: 'map', label: 'Карта', action: 'map', icon: iconMap(), visible: isMapAppVisible() },
        { id: 'browser', label: 'Браузер', action: 'browser', icon: iconBrowser() },
        { id: 'social', label: 'RavenFeed', action: 'social', icon: iconSocial(), visible: stateManager.hasFlag('ravenFeedUnlocked') },
        { id: 'settings', label: 'Настройки', action: 'settings', icon: iconSettings() }
    ].filter(app => app.visible !== false);

    const appsHTML = apps.map(app => `
        <button
            class="phone-app ${app.action ? '' : 'phone-app-muted'} ${app.attention ? 'phone-app-attention' : ''}"
            ${app.action ? `data-app="${app.action}"` : ''}
            type="button"
            aria-label="${app.label}"
        >
            <span class="phone-app-icon phone-app-icon-${app.id}">
                ${app.icon}
                ${app.badge > 0 ? `<span class="phone-app-badge">${app.badge}</span>` : ''}
            </span>
            <span class="phone-app-label">${app.label}</span>
        </button>
    `).join('');

    const now = new Date();
    const time = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });

    wrapper.innerHTML = `
        <div class="native-home-screen phone-home-screen">
            <main class="phone-home-main" aria-label="Домашний экран">
                <section class="home-glance" aria-label="Дата и погода">
                    <div>
                        <strong>${time}</strong>
                        <span>${date}</span>
                    </div>
                    <div class="home-weather">
                        <span class="home-weather-icon" aria-hidden="true">${iconWeather()}</span>
                        <strong>8°</strong>
                        <small>Рейвенвуд · дождь</small>
                    </div>
                </section>
                <div class="home-section-label">Приложения</div>
                <div class="home-apps-grid native-app-grid">${appsHTML}</div>
            </main>
        </div>
    `;

    wrapper.querySelectorAll('.phone-app[data-app]').forEach(el => {
        el.addEventListener('click', () => {
            if (navigator.vibrate) navigator.vibrate(7);
            const app = el.dataset.app;
            if (onAppOpen) onAppOpen(app);
        });
    });

    wrapper.querySelectorAll('.bottom-nav-item[data-app]').forEach(el => {
        el.addEventListener('click', () => {
            const app = el.dataset.app;
            if (onAppOpen) onAppOpen(app);
        });
    });

    fragment.appendChild(wrapper);
    return fragment;
}

function iconMessenger() {
    return lucideIcon('message-circle');
}

function iconContacts() {
    return lucideIcon('users');
}

function iconAppsGrid() {
    return lucideIcon('grid-3x3');
}

function iconProfile() {
    return lucideIcon('user-round');
}

function iconShop() {
    return lucideIcon('shopping-bag');
}

function iconNotes() {
    return lucideIcon('file-text');
}

function iconGallery() {
    return lucideIcon('image');
}

function iconCalendar() {
    return lucideIcon('calendar-days');
}

function iconMap() {
    return lucideIcon('map');
}

function iconClues() {
    return lucideIcon('search');
}

function iconBrowser() {
    return lucideIcon('globe');
}

function iconSocial() {
    return lucideIcon('id-card');
}

function iconLizaPhone() {
    return lucideIcon('smartphone');
}

function iconWeather() {
    return lucideIcon('cloud-rain');
}

function iconSettings() {
    return lucideIcon('settings');
}

function lucideIcon(name) {
    const safeName = /^[a-z0-9-]+$/.test(name) ? name : 'message-circle';
    return `<img class="lucide-app-icon" src="src/assets/icons/lucide/${safeName}.svg" alt="" aria-hidden="true" />`;
}

function getUnreadCount() {
    const unlockedChats = stateManager.get('unlockedChats') || [];
    let count = 0;
    for (const chatId of unlockedChats) {
        if (stateManager.isChatUnread(chatId)) {
            count++;
        }
    }
    return count;
}

function getNotesBadge() {
    return stateManager.hasFlag('notesUnread') ? 1 : 0;
}

function isNotesMechanicPending() {
    return stateManager.hasFlag('notesMechanicPending') && !stateManager.hasFlag('caseIntroCompleted');
}

function isCaseFileVisible() {
    return stateManager.hasFlag('caseIntroTaskUnlocked') || stateManager.hasFlag('caseMechanicUnlocked');
}

function isMapAppVisible() {
    return stateManager.hasFlag('ravenwoodMapCompleted') || stateManager.hasFlag('ravenwoodMapAddedToCase');
}

function getCaseBadge() {
    return stateManager.hasFlag('caseIntroTaskUnlocked') && !stateManager.hasFlag('caseIntroCompleted') ? 1 : 0;
}

function getClueBadge() {
    const notes = stateManager.get('unlockedNotes') || [];
    const investigationNotes = new Set([
        'note_dasha_lie',
        'note_max_alibi',
        'note_artem_love',
        'note_kira_watched',
        'note_knife',
        'note_memory3',
        'note_unknown_contact',
        'note_sever_profile',
        'note_liza_post',
        'note_camera_gap',
        'note_oak_phone',
        'note_accusation_post',
        'note_vika_screenshot'
    ]);
    const count = notes.filter(note => investigationNotes.has(note)).length;
    return count > 0 ? count : 0;
}

function getLisaPhoneBadge() {
    if (!hasLizaPhoneSignal()) return 0;
    return stateManager.hasFlag('lizaPhoneUnlocked') ? 0 : 1;
}

function hasLizaPhoneSignal() {
    return stateManager.hasFlag('lizaPhoneDiscovered') || stateManager.isBeatCompleted('beat_25_act_end');
}
