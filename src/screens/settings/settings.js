// ============================================
// Settings Screen
// ============================================

import { audioEngine } from '../../engine/audioEngine.js?v=123';
import { stateManager } from '../../engine/stateManager.js';
import { chapter1 } from '../../data/chapter1.js?v=129';

const STATE_KEY = 'harper_act1_v4';
const STORY_VERSION = 'harper_act1_post_leak_finale_2026_07_13_v13';

const CHECKPOINTS = [
    {
        id: 'after_derek',
        title: 'После Дерека',
        subtitle: 'Перед созданием первой группы',
        throughBeat: 'intro_derek_signoff',
        unlockedChats: ['private_derek'],
        unlockedContacts: ['derek'],
        knownContacts: ['derek'],
        flags: { harperIntroNoteWritten: true }
    },
    {
        id: 'after_group',
        title: 'После группы',
        subtitle: 'Оливия должна написать в личку',
        throughBeat: 'intro_group_seven',
        unlockedChats: ['private_derek', 'private_olivia'],
        unlockedContacts: ['derek', 'olivia', 'mia', 'mason', 'brooke', 'tyler'],
        knownContacts: ['derek', 'olivia', 'mia', 'mason', 'brooke', 'tyler']
    },
    {
        id: 'after_olivia',
        title: 'После Оливии',
        subtitle: 'Дальше пишет Миа',
        throughBeat: 'intro_olivia_common',
        unlockedChats: ['private_derek', 'private_olivia', 'private_mia'],
        unlockedContacts: ['derek', 'olivia', 'mia', 'mason', 'brooke', 'tyler'],
        knownContacts: ['derek', 'olivia', 'mia', 'mason', 'brooke', 'tyler'],
        onlineCharacters: { olivia: false }
    },
    {
        id: 'after_mia',
        title: 'После Мии',
        subtitle: 'Перед первой сортировкой дела',
        throughBeat: 'intro_mia_goodnight',
        unlockedChats: ['private_derek', 'private_olivia', 'private_mia'],
        unlockedContacts: ['derek', 'olivia', 'mia', 'mason', 'brooke', 'tyler'],
        knownContacts: ['derek', 'olivia', 'mia', 'mason', 'brooke', 'tyler'],
        onlineCharacters: { olivia: false, mia: false },
        flags: { notesMechanicPending: true, notesUnread: true }
    },
    {
        id: 'after_case',
        title: 'После дела',
        subtitle: 'Утро, Дерек отправляет фото',
        throughBeat: 'intro_case_sort_task',
        unlockedChats: ['private_derek', 'private_olivia', 'private_mia'],
        unlockedContacts: ['derek', 'olivia', 'mia', 'mason', 'brooke', 'tyler'],
        knownContacts: ['derek', 'olivia', 'mia', 'mason', 'brooke', 'tyler'],
        flags: { harperIntroNoteWritten: true, caseIntroTaskUnlocked: true, caseMechanicUnlocked: true, caseIntroCompleted: true, notesMechanicPending: false, notesUnread: false, nextMorningUnlocked: true }
    },
    {
        id: 'after_map',
        title: 'После карты',
        subtitle: 'Оливия пишет после мини-игры',
        throughBeat: 'larks_group_map_document',
        unlockedChats: ['private_derek', 'private_olivia', 'private_mia', 'group_larks'],
        unlockedContacts: ['derek', 'olivia', 'mia', 'mason', 'brooke', 'tyler'],
        knownContacts: ['derek', 'olivia', 'mia', 'mason', 'brooke', 'tyler'],
        flags: { harperIntroNoteWritten: true, postCaseNoteWritten: true, caseIntroTaskUnlocked: true, caseMechanicUnlocked: true, caseIntroCompleted: true, ravenwoodMapCompleted: true, ravenwoodMapAddedToCase: true }
    },
    {
        id: 'before_remote',
        title: 'Перед удалённым доступом',
        subtitle: 'Миа пришлёт приложение',
        throughBeat: 'larks_olivia_goodbye',
        unlockedChats: ['private_derek', 'private_olivia', 'private_mia', 'group_larks'],
        unlockedContacts: ['derek', 'olivia', 'mia', 'mason', 'brooke', 'tyler'],
        knownContacts: ['derek', 'olivia', 'mia', 'mason', 'brooke', 'tyler'],
        flags: { harperIntroNoteWritten: true, postCaseNoteWritten: true, caseIntroTaskUnlocked: true, caseMechanicUnlocked: true, caseIntroCompleted: true, ravenwoodMapCompleted: true, ravenwoodMapAddedToCase: true, larksEveningUpdateWritten: true }
    },
    {
        id: 'before_unknown_call',
        title: 'Перед звонком',
        subtitle: 'После телефона Мии, до неизвестного звонка',
        throughBeat: 'mia_after_hack_end',
        unlockedChats: ['private_derek', 'private_olivia', 'private_mia', 'private_unknown', 'group_larks'],
        unlockedContacts: ['derek', 'olivia', 'mia', 'mason', 'brooke', 'tyler', 'unknown'],
        knownContacts: ['derek', 'olivia', 'mia', 'mason', 'brooke', 'tyler', 'unknown'],
        onlineCharacters: { derek: false, olivia: false, mia: false, unknown: false },
        flags: {
            harperIntroNoteWritten: true,
            postCaseNoteWritten: true,
            caseIntroTaskUnlocked: true,
            caseMechanicUnlocked: true,
            caseIntroCompleted: true,
            ravenwoodMapCompleted: true,
            ravenwoodMapAddedToCase: true,
            larksEveningUpdateWritten: true,
            remoteAccessUnlocked: true,
            miaPhoneOpened: true,
            harperChatViewed: true,
            recoveredChatFound: true,
            suspiciousFileOpened: true,
            remoteSessionInterrupted: true,
            playerPhoneCompromised: true,
            cameraCaptureTriggered: true,
            externalConnectionBlocked: true,
            unknownChatUnlocked: true,
            miaHackUpdateWritten: true,
            miaKnowsAboutAttack: true,
            playerDeclinedBackupAccess: true,
            miaBackupAccessGranted: false,
            miaPrivateChatsOpened: false
        }
    }
];

export function renderSettings({ onBack }) {
    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement('div');
    wrapper.className = 'settings-screen-shell';

    const settings = audioEngine.getSettings();

    wrapper.innerHTML = `
        <header class="settings-header">
            <button class="settings-back-btn" id="settings-back" type="button" aria-label="Назад">
                <img class="ui-lucide is-light" src="src/assets/icons/lucide/chevron-left.svg" alt="" />
            </button>
            <div>
                <h1>Настройки</h1>
                <p>Звук, уведомления и прогресс</p>
            </div>
        </header>

        <main class="settings-content">
            <div class="settings-save-status" data-settings-status>Настройки сохраняются автоматически</div>

            <section class="settings-group">
                <div class="settings-group-title">Звук</div>
                ${toggleRow('musicEnabled', 'Фоновая музыка', 'Тихая атмосфера во время игры', settings.musicEnabled)}
                ${rangeRow('musicVolume', 'Громкость музыки', settings.musicVolume)}
                ${rangeRow('effectsVolume', 'Громкость звуков', settings.effectsVolume)}
            </section>

            <section class="settings-group">
                <div class="settings-group-title">Уведомления</div>
                ${toggleRow('notificationSoundsEnabled', 'Звук SMS', 'Верхние уведомления и новые чаты', settings.notificationSoundsEnabled)}
                ${toggleRow('messageSoundsEnabled', 'Звук сообщений', 'Сообщения внутри открытого чата', settings.messageSoundsEnabled)}
                <div class="settings-actions-row">
                    <button class="settings-soft-btn" id="test-notification-sound" type="button">Проверить SMS</button>
                    <button class="settings-soft-btn" id="test-message-sound" type="button">Проверить чат</button>
                </div>
            </section>

            <section class="settings-group">
                <div class="settings-group-title">Чекпоинты</div>
                <p class="settings-note">Тестовый переключатель. Переносит прогресс к выбранному месту и перезагружает игру.</p>
                <div class="settings-checkpoint-grid">
                    ${CHECKPOINTS.map(point => `
                        <button class="settings-checkpoint-btn" data-checkpoint="${point.id}" type="button">
                            <strong>${point.title}</strong>
                            <span>${point.subtitle}</span>
                        </button>
                    `).join('')}
                </div>
            </section>

            <section class="settings-group danger">
                <div class="settings-group-title">Прогресс</div>
                <p class="settings-note">Сброс удалит историю, выборы, открытые чаты и лояльность.</p>
                <button class="settings-reset-btn" id="settings-reset-progress" type="button">
                    <img class="ui-lucide is-light" src="src/assets/icons/lucide/rotate-ccw.svg" alt="" />
                    Сбросить прогресс
                </button>
            </section>
        </main>
    `;

    wrapper.querySelector('#settings-back').addEventListener('click', onBack);

    wrapper.querySelectorAll('.settings-toggle-row').forEach(row => {
        const input = row.querySelector('[data-setting-toggle]');
        if (!input) return;

        row.addEventListener('click', (event) => {
            event.preventDefault();
            input.checked = !input.checked;
            syncToggle(wrapper, input);
        });

        input.addEventListener('change', () => {
            syncToggle(wrapper, input);
        });
    });

    wrapper.querySelectorAll('[data-setting-range]').forEach(input => {
        const valueEl = wrapper.querySelector(`[data-setting-value="${input.dataset.settingRange}"]`);
        const update = () => {
            const value = Number(input.value) / 100;
            audioEngine.updateSettings({ [input.dataset.settingRange]: value });
            if (valueEl) valueEl.textContent = `${input.value}%`;
            flashStatus(wrapper, 'Сохранено');
        };
        input.addEventListener('input', update);
    });

    wrapper.querySelector('#test-notification-sound').addEventListener('click', () => {
        audioEngine.unlock();
        flashStatus(wrapper, audioEngine.previewNotification() ? 'SMS звук включён' : 'SMS звук выключен');
    });

    wrapper.querySelector('#test-message-sound').addEventListener('click', () => {
        audioEngine.unlock();
        flashStatus(wrapper, audioEngine.previewMessage() ? 'Звук чата включён' : 'Звук чата выключен');
    });

    wrapper.querySelector('#settings-reset-progress').addEventListener('click', () => {
        if (confirm('Сбросить весь прогресс и начать заново?')) {
            stateManager.reset();
            window.location.reload();
        }
    });

    wrapper.querySelectorAll('[data-checkpoint]').forEach(button => {
        bindCheckpointButton(wrapper, button);
    });

    updatePreviewButtons(wrapper);

    fragment.appendChild(wrapper);
    return fragment;
}

function bindCheckpointButton(wrapper, button) {
    let handled = false;
    const handle = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (handled) return;
        handled = true;

        const checkpoint = CHECKPOINTS.find(item => item.id === button.dataset.checkpoint);
        if (!checkpoint) return;

        button.classList.add('is-applying');
        applyCheckpoint(checkpoint);
        flashStatus(wrapper, `Чекпоинт: ${checkpoint.title}`);
        setTimeout(() => window.location.reload(), 220);
    };

    button.addEventListener('click', handle);
    button.addEventListener('pointerup', handle);
    button.addEventListener('touchend', handle);
}

function applyCheckpoint(checkpoint) {
    const checkpointState = buildCheckpointState(checkpoint);

    const previous = readSavedState();
    const nextState = {
        storyVersion: STORY_VERSION,
        playerName: previous.playerName || stateManager.getPlayerName?.() || 'Паша',
        currentAct: 1,
        currentBeatIndex: checkpointState.completedBeats.length,
        completedBeats: checkpointState.completedBeats,
        activeChoices: checkpointState.activeChoices,
        loyalty: checkpointState.loyalty || {},
        trust: checkpointState.trust,
        unlockedChats: checkpointState.unlockedChats,
        unlockedContacts: checkpointState.unlockedContacts,
        unlockedNotes: checkpointState.unlockedNotes,
        unlockedGallery: checkpointState.unlockedGallery,
        knownContacts: checkpointState.knownContacts,
        onlineCharacters: checkpointState.onlineCharacters,
        notes: checkpointState.notes,
        caseEntries: checkpointState.caseEntries,
        chatHistories: checkpointState.chatHistories || {},
        readCounts: checkpointState.readCounts || {},
        flags: checkpointState.flags,
        started: true,
        actCompleted: {}
    };

    localStorage.setItem(STATE_KEY, JSON.stringify(nextState));
}

function readSavedState() {
    try {
        return JSON.parse(localStorage.getItem(STATE_KEY) || '{}') || {};
    } catch {
        return {};
    }
}

function buildCheckpointState(checkpoint) {
    const completedBeats = getCompletedBeatsThrough(checkpoint.throughBeat, checkpoint.completedBeats);
    return {
        completedBeats,
        activeChoices: buildDefaultChoices(),
        unlockedChats: checkpoint.unlockedChats || ['private_derek'],
        unlockedContacts: checkpoint.unlockedContacts || ['derek'],
        knownContacts: checkpoint.knownContacts || ['derek'],
        onlineCharacters: checkpoint.onlineCharacters || {},
        flags: checkpoint.flags || {},
        trust: { oliviaTrust: 1, miaTrust: 1 },
        caseEntries: checkpoint.flags?.caseIntroCompleted ? defaultCaseEntries(checkpoint.flags) : [],
        notes: {},
        unlockedNotes: [],
        unlockedGallery: []
    };
}

function getCompletedBeatsThrough(throughBeat, fallback = []) {
    if (!throughBeat) return fallback || [];

    const beats = chapter1.beats || [];
    const targetIndex = beats.findIndex(beat => beat.id === throughBeat);
    if (targetIndex < 0) return fallback || [];

    return beats
        .slice(0, targetIndex + 1)
        .map(beat => beat.id)
        .filter(Boolean);
}

function buildDefaultChoices() {
    return {
        intro_derek_opener: 0,
        intro_derek_explains: 0,
        intro_only_lead: 0,
        intro_police_common: 0,
        intro_harper_story: 0,
        intro_olivia_private: 0,
        intro_mia_private: 0,
        intro_mia_common_first: 0,
        morning_derek_photos: 0,
        morning_olivia_cafe_photo: 1,
        morning_olivia_photo_common: 0,
        morning_olivia_place_common: 0,
        morning_olivia_followed_common: 0,
        morning_olivia_next_step_common: 0,
        larks_group_start: 0,
        larks_group_photo_common: 0,
        larks_group_walk_common: 0,
        larks_group_sedan_common: 0,
        larks_group_phone_common: 0,
        larks_group_map_task_common: 0,
        larks_olivia_after_map_start: 1,
        larks_olivia_places_common: 0,
        larks_olivia_harper_secret_common: 0,
        larks_olivia_outsider_common: 2
    };
}

function defaultCaseEntries(flags = {}) {
    const entries = [
        { id: 'question_harper_number_sender', type: 'question', title: 'ВОПРОС', text: 'Кто отправил номер игрока с телефона Харпер?' }
    ];

    if (flags.ravenwoodMapCompleted || flags.ravenwoodMapAddedToCase) {
        entries.push(
            { id: 'fact_harper_larks_olivia', type: 'fact', title: 'Larks', text: 'Харпер была в Larks вместе с Оливией за четыре дня до исчезновения.' },
            { id: 'fact_harper_riverwalk_mia', type: 'fact', title: 'Riverwalk', text: 'На следующий день Миа встретила Харпер у Riverwalk.' },
            { id: 'fact_green_sedan_question', type: 'clue', title: 'Тёмно-зелёный седан', text: 'Харпер спрашивала Мию о тёмно-зелёном седане.' },
            { id: 'thread_mia_old_phone', type: 'thread', title: 'Вечером', text: 'Миа проверит старый телефон.' }
        );
    }

    if (flags.miaHackUpdateWritten) {
        entries.push(
            { id: 'clue_vid_1842_recovered', type: 'clue', title: 'VID_1842.mp4', text: 'На старом телефоне Мии найден восстановленный чат с неизвестным номером. Внутри было вложение VID_1842.mp4.' },
            { id: 'thread_player_phone_compromised', type: 'thread', title: 'Телефон игрока', text: 'Во время загрузки файла кто-то получил доступ к телефону игрока. Файл не открылся.' },
            { id: 'question_trap_attachment_owner', type: 'question', title: 'ВОПРОС', text: 'Кто оставил вложение в старом телефоне Мии и почему оно сработало именно при открытии?' }
        );
    }

    return entries;
}

function updatePreviewButtons(wrapper) {
    const settings = audioEngine.getSettings();
    const notificationButton = wrapper.querySelector('#test-notification-sound');
    const messageButton = wrapper.querySelector('#test-message-sound');

    if (notificationButton) {
        notificationButton.classList.toggle('is-muted', !settings.notificationSoundsEnabled);
        notificationButton.textContent = settings.notificationSoundsEnabled ? 'Проверить SMS' : 'SMS выключен';
    }

    if (messageButton) {
        messageButton.classList.toggle('is-muted', !settings.messageSoundsEnabled);
        messageButton.textContent = settings.messageSoundsEnabled ? 'Проверить чат' : 'Чат выключен';
    }
}

function syncToggle(wrapper, input) {
    audioEngine.updateSettings({ [input.dataset.settingToggle]: input.checked });
    updatePreviewButtons(wrapper);
    flashStatus(wrapper, 'Сохранено');
}

function flashStatus(wrapper, text) {
    const status = wrapper.querySelector('[data-settings-status]');
    if (!status) return;

    status.textContent = text;
    status.classList.add('is-active');
    window.clearTimeout(status._hideTimer);
    status._hideTimer = window.setTimeout(() => {
        status.textContent = 'Настройки сохраняются автоматически';
        status.classList.remove('is-active');
    }, 1400);
}

function toggleRow(key, title, subtitle, checked) {
    return `
        <label class="settings-row settings-toggle-row">
            <span>
                <strong>${title}</strong>
                <small>${subtitle}</small>
            </span>
            <input type="checkbox" data-setting-toggle="${key}" ${checked ? 'checked' : ''}>
            <i aria-hidden="true"></i>
        </label>
    `;
}

function rangeRow(key, title, value) {
    const percent = Math.round(value * 100);
    return `
        <label class="settings-row settings-range-row">
            <span>
                <strong>${title}</strong>
                <small data-setting-value="${key}">${percent}%</small>
            </span>
            <input type="range" min="0" max="100" value="${percent}" data-setting-range="${key}">
        </label>
    `;
}
