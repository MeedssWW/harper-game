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
        { id: 'notes', label: 'Заметки', action: 'notes', icon: iconNotes(), badge: getNotesBadge() },
        { id: 'casefile', label: 'Дело', action: 'caseFile', icon: iconClues(), badge: getCaseBadge(), visible: isCaseFileVisible() },
        { id: 'map', label: 'Карта', action: 'map', icon: iconMap(), visible: isMapAppVisible() },
        { id: 'browser', label: 'Браузер', action: 'browser', icon: iconBrowser() },
        { id: 'settings', label: 'Настройки', action: 'settings', icon: iconSettings() }
    ].filter(app => app.visible !== false);

    const appsHTML = apps.map(app => `
        <button
            class="phone-app ${app.action ? '' : 'phone-app-muted'}"
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
                        <span class="home-weather-icon" aria-hidden="true"></span>
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
    return lucideIcon('cloud-sun');
}

function iconSettings() {
    return lucideIcon('settings');
}

function lucideIcon(name) {
    const paths = {
        'message-circle': '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />',
        users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />',
        'file-text': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />',
        image: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />',
        search: '<circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />',
        map: '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" /><path d="M15 5.764v15" /><path d="M9 3.236v15" />',
        globe: '<circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />',
        'id-card': '<path d="M16 10h2" /><path d="M16 14h2" /><path d="M6.17 15a3 3 0 0 1 5.66 0" /><circle cx="9" cy="11" r="2" /><rect x="2" y="5" width="20" height="14" rx="2" />',
        smartphone: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" />',
        'calendar-days': '<path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" />',
        'cloud-sun': '<path d="M12 2v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="M20 12h2" /><path d="m19.07 4.93-1.41 1.41" /><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128" /><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" />',
        settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />',
        'grid-3x3': '<rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M3 15h18" /><path d="M9 3v18" /><path d="M15 3v18" />',
        'shopping-bag': '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />',
        'user-round': '<circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" />',
        'rotate-ccw': '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />'
    };

    return `<svg class="lucide-app-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.15" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths['message-circle']}</svg>`;
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
