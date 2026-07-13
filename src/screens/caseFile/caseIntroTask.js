// ============================================
// Case File Intro Task — first investigation mechanic
// ============================================

import { stateManager } from '../../engine/stateManager.js';

const CASE_MAP_IMAGE = 'src/assets/maps/ravenwood_map.png?v=73';

const CARDS = [
    {
        id: 'harper_missing_two_days',
        text: 'Харпер пропала два дня назад.',
        answer: 'confirmed',
        detail: 'Харпер Вэнс пропала два дня назад.\nИсточник: Дерек, Оливия, Миа.'
    },
    {
        id: 'missing_report_filed',
        text: 'Заявление о пропаже уже подано.',
        answer: 'confirmed',
        detail: 'Дерек обратился в полицию.\nПоиски Харпер уже ведутся.'
    },
    {
        id: 'derek_received_player_number',
        text: 'Утром Дереку пришло сообщение с номером игрока.',
        answer: 'confirmed',
        detail: 'Сообщение пришло с телефона Харпер.\nВ сообщении был только номер игрока.\nИсточник: Дерек.'
    },
    {
        id: 'player_never_in_ravenwood',
        text: 'Игрок раньше не был в Рейвенвуде.',
        answer: 'confirmed',
        detail: 'Игрок живёт в другом городе.\nРаньше он не бывал в Рейвенвуде.'
    },
    {
        id: 'player_does_not_know_harper',
        text: 'Игрок не знает Харпер.',
        answer: 'confirmed',
        detail: 'Игрок не узнаёт Харпер на фотографии.\nДо сообщения Дерека он о ней не слышал.'
    },
    {
        id: 'harper_sent_number_herself',
        text: 'Харпер сама отправила номер игрока.',
        answer: 'unknown',
        wrongConfirmed: 'Неизвестно, кто держал телефон Харпер в момент отправки.'
    },
    {
        id: 'someone_else_has_phone',
        text: 'Телефон Харпер находится у другого человека.',
        answer: 'unknown',
        wrongConfirmed: 'Это возможно, но пока никто не доказал, что телефоном пользовался другой человек.'
    },
    {
        id: 'harper_left_voluntarily',
        text: 'Харпер ушла добровольно.',
        answer: 'unknown',
        wrongConfirmed: 'Полиция рассматривает эту возможность, но местонахождение Харпер неизвестно.'
    },
    {
        id: 'player_connected_to_harper',
        text: 'Игрок как-то связан с Харпер.',
        answer: 'unknown',
        wrongConfirmed: 'Единственная известная связь — номер игрока в сообщении.'
    },
    {
        id: 'number_random',
        text: 'Номер игрока выбрали случайно.',
        answer: 'unknown',
        wrongConfirmed: 'Случайность пока нельзя ни подтвердить, ни исключить.'
    },
    {
        id: 'message_request_for_help',
        text: 'Сообщение было просьбой о помощи.',
        answer: 'unknown',
        wrongConfirmed: 'В сообщении не было текста. Только номер.'
    },
    {
        id: 'player_intentionally_involved',
        text: 'Кто-то намеренно втянул игрока в исчезновение Харпер.',
        answer: 'unknown',
        wrongConfirmed: 'Пока неизвестно, зачем номер отправили Дереку.'
    }
];

const COMPLETED_NOTE_TEXT = `ПОДТВЕРЖДЕНО:

• Харпер пропала два дня назад.
• Полиция уже занимается её исчезновением.
• С телефона Харпер Дереку пришёл номер игрока.
• Игрок никогда не был в Рейвенвуде.
• Игрок не знает Харпер и не узнаёт её на фотографии.

ВЕРСИИ:

• Сообщение отправила сама Харпер.
• Телефоном воспользовался другой человек.
• Харпер ушла добровольно.
• Игрок связан с Харпер.
• Номер был выбран случайно.
• Сообщение было просьбой о помощи.
• Игрока втянули намеренно.

ГЛАВНЫЙ ВОПРОС:

Почему с телефона Харпер отправили именно мой номер?`;

export function renderCaseIntroTask({ onDone, onFrameAnalysis } = {}) {
    if (!stateManager.hasFlag('caseIntroTaskUnlocked')) {
        stateManager.setFlag('caseIntroTaskUnlocked', true);
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'case-task-screen';
    requestAnimationFrame(() => wrapper.classList.add('entered'));

    if (stateManager.hasFlag('caseIntroCompleted')) {
        wrapper.innerHTML = renderCaseFile();
        attachCaseFileControls(wrapper, onDone, onFrameAnalysis);
        return wrapper;
    }

    const assignments = new Map();

    wrapper.innerHTML = `
        <header class="case-task-header">
            <div class="case-kicker">новая страница</div>
            <h1>ДЕЛО: ХАРПЕР ВЭНС</h1>
            <p>Раздели то, что уже известно, и то, что персонажи пока только предполагают.</p>
            <p class="case-task-rule">Даже уверенно сказанная фраза не становится фактом без подтверждения.</p>
        </header>

        <main class="case-task-body">
            <section class="case-sort-columns" aria-label="Категории">
                <div class="case-column confirmed">
                    <span>ПОДТВЕРЖДЕНО</span>
                    <strong id="confirmed-count">0</strong>
                </div>
                <div class="case-column unknown">
                    <span>ПОКА ТОЛЬКО ВЕРСИЯ</span>
                    <strong id="unknown-count">0</strong>
                </div>
            </section>

            <div class="case-task-feedback" id="case-feedback" aria-live="polite"></div>

            <section class="case-card-list" aria-label="Утверждения">
                ${CARDS.map((card, index) => renderCard(card, index)).join('')}
            </section>

            <button class="case-check-btn" id="case-check" type="button" disabled>Завершить разбор</button>
        </main>
    `;

    wrapper.querySelectorAll('.case-card-action').forEach(button => {
        button.addEventListener('click', () => {
            const cardId = button.dataset.card;
            const value = button.dataset.value;
            assignments.set(cardId, value);
            updateCardState(wrapper, assignments);
            showPlacementFeedback(wrapper, cardId, value);
        });
    });

    wrapper.querySelector('#case-check').addEventListener('click', () => {
        const allCorrect = CARDS.every(card => assignments.get(card.id) === card.answer);
        const feedback = wrapper.querySelector('#case-feedback');

        if (!allCorrect) {
            const firstWrong = CARDS.find(card => assignments.get(card.id) !== card.answer);
            feedback.textContent = firstWrong?.wrongConfirmed || 'Это уже подтверждено несколькими прямыми сведениями.';
            feedback.classList.add('visible', 'error');
            return;
        }

        completeCaseIntro(wrapper, onDone);
    });

    return wrapper;
}

function renderCard(card, index) {
    return `
        <article class="case-sort-card" data-card="${card.id}">
            <span class="case-card-number">${String(index + 1).padStart(2, '0')}</span>
            <p>${card.text}</p>
            <div class="case-card-actions">
                <button class="case-card-action" data-card="${card.id}" data-value="confirmed" type="button">Подтверждено</button>
                <button class="case-card-action" data-card="${card.id}" data-value="unknown" type="button">Только версия</button>
            </div>
        </article>
    `;
}

function showPlacementFeedback(wrapper, cardId, value) {
    const card = CARDS.find(item => item.id === cardId);
    const feedback = wrapper.querySelector('#case-feedback');
    if (!card || !feedback) return;

    if (value !== card.answer) {
        feedback.textContent = card.wrongConfirmed || 'Это уже подтверждено тем, что известно из разговоров.';
        feedback.classList.add('visible', 'error');
        return;
    }

    feedback.textContent = card.detail || (value === 'unknown' ? 'Пока это нельзя считать доказанным фактом.' : 'Подтверждено.');
    feedback.classList.add('visible');
    feedback.classList.remove('error');
}

function updateCardState(wrapper, assignments) {
    let confirmed = 0;
    let unknown = 0;

    for (const card of CARDS) {
        const value = assignments.get(card.id);
        const cardEl = wrapper.querySelector(`[data-card="${card.id}"].case-sort-card`);
        if (!cardEl) continue;

        cardEl.dataset.assigned = value || '';
        cardEl.querySelectorAll('.case-card-action').forEach(button => {
            button.classList.toggle('active', button.dataset.value === value);
        });

        if (value === 'confirmed') confirmed += 1;
        if (value === 'unknown') unknown += 1;
    }

    wrapper.querySelector('#confirmed-count').textContent = String(confirmed);
    wrapper.querySelector('#unknown-count').textContent = String(unknown);
    wrapper.querySelector('#case-check').disabled = assignments.size !== CARDS.length;

}

function completeCaseIntro(wrapper, onDone) {
    if (stateManager.hasFlag('caseIntroCompleted')) return;

    stateManager.setFlag('caseMechanicUnlocked', true);
    stateManager.setFlag('notesMechanicPending', false);
    stateManager.setFlag('notesUnread', false);
    stateManager.setFlag('caseIntroCompleted', true);
    stateManager.setNote('harper_case_notes', {
        title: 'ДЕЛО: ХАРПЕР ВЭНС',
        text: COMPLETED_NOTE_TEXT,
        time: 'Закреплено',
        type: 'case'
    });
    stateManager.addCaseEntry({
        id: 'question_harper_number_sender',
        type: 'question',
        title: 'ВОПРОС',
        text: 'Почему с телефона Харпер отправили именно мой номер?'
    });

    wrapper.innerHTML = renderCompleted(true);
    wrapper.scrollTop = 0;
    revealSystemLines(wrapper, onDone);
}

function renderCompleted(animate = false) {
    return `
        <header class="case-task-header completed">
            <div class="case-kicker">заметка сохранена</div>
            <h1>ДЕЛО: ХАРПЕР ВЭНС</h1>
            <p>Факты отделены от предположений.</p>
        </header>

        <main class="case-task-body completed">
            <section class="case-system-log case-notes-summary ${animate ? 'is-animating' : 'is-visible'}">
                <div class="case-system-line">
                    <b>ПОДТВЕРЖДЕНО</b>
                    <ul>
                        <li>Харпер пропала два дня назад.</li>
                        <li>Полиция уже занимается её исчезновением.</li>
                        <li>С телефона Харпер Дереку пришёл номер игрока.</li>
                        <li>Игрок никогда не был в Рейвенвуде.</li>
                        <li>Игрок не знает Харпер и не узнаёт её на фотографии.</li>
                    </ul>
                </div>
                <div class="case-system-line">
                    <b>ВЕРСИИ</b>
                    <ul>
                        <li>Сообщение отправила сама Харпер.</li>
                        <li>Телефоном воспользовался другой человек.</li>
                        <li>Харпер ушла добровольно.</li>
                        <li>Игрок связан с Харпер.</li>
                        <li>Номер был выбран случайно.</li>
                        <li>Сообщение было просьбой о помощи.</li>
                        <li>Игрока втянули намеренно.</li>
                    </ul>
                </div>
            </section>

            <article class="case-question-card ${animate ? '' : 'visible'}">
                <span>ГЛАВНЫЙ ВОПРОС</span>
                <p>Почему с телефона Харпер отправили именно мой номер?</p>
            </article>

            <button class="case-done-btn ${animate ? '' : 'visible'}" id="case-done" type="button">Закрыть заметки</button>
        </main>
    `;
}

function renderCaseFile() {
    backfillCaseEntries();

    const entries = stateManager.get('caseEntries') || [];
    const groups = [
        { type: 'question', label: 'Вопросы' },
        { type: 'fact', label: 'Факты' },
        { type: 'clue', label: 'Детали' },
        { type: 'thread', label: 'Нити' }
    ];
    const countText = `${entries.length} ${formatEntryCount(entries.length)}`;
    const caseMap = shouldShowCaseMap() ? renderCaseMapPanel() : '';
    const analysisPanel = shouldShowFrameAnalysisPanel() ? renderFrameAnalysisPanel() : '';

    return `
        <header class="case-task-header case-file-header">
            <button class="case-file-back" id="case-file-back" type="button" aria-label="Назад">‹</button>
            <div class="case-kicker">расследование</div>
            <h1>ДЕЛО ХАРПЕР ВЭНС</h1>
            <p>${countText}. Здесь остаются только факты, вопросы и детали, которые ещё нужно проверить.</p>
        </header>

        <main class="case-task-body case-file-body">
            ${caseMap}
            ${analysisPanel}
            ${entries.length ? groups.map(group => renderCaseGroup(group, entries)).join('') : renderCaseEmpty()}
        </main>
    `;
}

function shouldShowCaseMap() {
    return stateManager.hasFlag('ravenwoodMapCompleted') || stateManager.hasFlag('ravenwoodMapAddedToCase');
}

function renderCaseMapPanel() {
    return `
        <section class="case-map-panel" aria-label="Карта маршрута">
            <div class="case-file-section-title">Карта маршрута</div>
            <div class="case-map-frame">
                <img src="${CASE_MAP_IMAGE}" alt="Карта Рейвенвуда с отмеченным маршрутом" />
                <svg class="case-map-overlay" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M31 41 C44 42 58 48 70 53 S80 57 84 57" />
                </svg>
                <span class="case-map-marker larks"><b>Larks</b></span>
                <span class="case-map-marker riverwalk"><b>Riverwalk</b></span>
                <span class="case-map-marker bridge"><b>Old Bridge</b></span>
            </div>
            <div class="case-map-notes">
                <article>
                    <span>Маршрут</span>
                    <p>Larks и Riverwalk находятся достаточно близко, чтобы пройти пешком. Это не доказывает путь Харпер, но связывает две подтверждённые точки.</p>
                </article>
                <article>
                    <span>Отметка</span>
                    <p>Зелёный седан повторяется рядом с Larks и всплывает в разговоре Мии про старый мост.</p>
                </article>
            </div>
        </section>
    `;
}

function shouldShowFrameAnalysisPanel() {
    return stateManager.hasFlag('videoAnalysisAvailable') && !stateManager.hasFlag('stickerStillAddedToCase');
}

function renderFrameAnalysisPanel() {
    return `
        <section class="case-video-analysis-panel">
            <div class="case-file-section-title">Видео для анализа</div>
            <article>
                <span>VID_1842_fragment.mp4</span>
                <strong>Нужно выбрать стоп-кадр</strong>
                <p>В очищенном фрагменте виден тёмно-зелёный седан. Нужно найти момент, где наклейка на лобовом стекле различима лучше всего.</p>
                <button id="case-open-frame-analysis" type="button">Изучить видео</button>
            </article>
        </section>
    `;
}

function backfillCaseEntries() {
    stateManager.addCaseEntry({
        id: 'question_harper_number_sender',
        type: 'question',
        title: 'ВОПРОС',
        text: 'Кто отправил номер игрока с телефона Харпер?'
    });

    if (!stateManager.hasFlag('ravenwoodMapCompleted') && !stateManager.hasFlag('ravenwoodMapAddedToCase')) {
        return;
    }

    stateManager.addCaseEntry({
        id: 'fact_harper_larks_olivia',
        type: 'fact',
        title: 'Larks',
        text: 'Харпер была в Larks вместе с Оливией за четыре дня до исчезновения.'
    });
    stateManager.addCaseEntry({
        id: 'fact_harper_riverwalk_mia',
        type: 'fact',
        title: 'Riverwalk',
        text: 'На следующий день Миа встретила Харпер у Riverwalk.'
    });
    stateManager.addCaseEntry({
        id: 'fact_green_sedan_question',
        type: 'clue',
        title: 'Тёмно-зелёный седан',
        text: 'Харпер спрашивала Мию о тёмно-зелёном седане.'
    });
    stateManager.addCaseEntry({
        id: 'thread_mia_old_phone',
        type: 'thread',
        title: 'Вечером',
        text: 'Миа проверит старый телефон.'
    });

    if (!stateManager.hasFlag('miaHackUpdateWritten')) {
        return;
    }

    stateManager.addCaseEntry({
        id: 'clue_vid_1842_recovered',
        type: 'clue',
        title: 'VID_1842.mp4',
        text: 'На старом телефоне Мии найден восстановленный чат с неизвестным номером. Внутри было вложение VID_1842.mp4.'
    });
    stateManager.addCaseEntry({
        id: 'thread_player_phone_compromised',
        type: 'thread',
        title: 'Телефон игрока',
        text: 'Во время загрузки файла кто-то получил доступ к телефону игрока. Файл не открылся.'
    });
    stateManager.addCaseEntry({
        id: 'question_trap_attachment_owner',
        type: 'question',
        title: 'ВОПРОС',
        text: 'Кто оставил вложение в старом телефоне Мии и почему оно сработало именно при открытии?'
    });

    if (stateManager.hasFlag('stickerStillAddedToCase')) {
        stateManager.addCaseEntry({
            id: 'clue_still_1842_sticker',
            type: 'clue',
            title: 'Стоп-кадр с наклейкой',
            text: 'Стоп-кадр из VID_1842_fragment.mp4. На лобовом стекле тёмно-зелёного седана видна выцветшая наклейка. Текст не читается. Возможно, это пропуск или разрешение на въезд.',
            imageSrc: 'src/assets/case/still_1842_sticker.png?v=90',
            fileName: 'still_1842.png'
        });
    }

    if (stateManager.hasFlag('northYardLeadUnlocked') || stateManager.hasFlag('northYardAddedToMap')) {
        stateManager.addCaseEntry({
            id: 'thread_north_yard',
            type: 'thread',
            title: 'Северный двор',
            text: 'Наклейка на лобовом стекле седана может быть временным пропуском для служебного въезда за старой станцией.'
        });
        stateManager.addCaseEntry({
            id: 'question_north_yard_unknowns',
            type: 'question',
            title: 'НЕИЗВЕСТНО',
            text: 'Принадлежит ли наклейка именно этой машине? Была ли машина у Северного двора? Связано ли это место с Харпер?'
        });
    }
}

function renderCaseGroup(group, entries) {
    const groupEntries = entries.filter(entry => entry.type === group.type);
    if (!groupEntries.length) return '';

    return `
        <section class="case-file-section">
            <div class="case-file-section-title">${group.label}</div>
            <div class="case-file-entry-list">
                ${groupEntries.map(entry => renderCaseEntry(entry)).join('')}
            </div>
        </section>
    `;
}

function renderCaseEntry(entry) {
    const typeLabel = getCaseTypeLabel(entry.type);
    return `
        <article class="case-file-entry ${entry.type || 'note'}">
            <span>${typeLabel}</span>
            <strong>${escapeHtml(entry.title || 'Запись')}</strong>
            ${entry.imageSrc ? `<img class="case-file-entry-image" src="${escapeHtml(entry.imageSrc)}" alt="${escapeHtml(entry.title || '')}">` : ''}
            <p>${escapeHtml(entry.text || '')}</p>
            ${entry.fileName ? `<small>${escapeHtml(entry.fileName)}</small>` : ''}
        </article>
    `;
}

function renderCaseEmpty() {
    return `
        <section class="case-file-empty">
            <strong>Пока пусто.</strong>
            <p>Когда появятся проверенные сведения, они будут собираться здесь.</p>
        </section>
    `;
}

function getCaseTypeLabel(type) {
    if (type === 'question') return 'Вопрос';
    if (type === 'fact') return 'Факт';
    if (type === 'clue') return 'Деталь';
    if (type === 'thread') return 'Нить';
    return 'Запись';
}

function formatEntryCount(count) {
    const last = count % 10;
    const lastTwo = count % 100;
    if (last === 1 && lastTwo !== 11) return 'запись';
    if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return 'записи';
    return 'записей';
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function attachCaseFileControls(wrapper, onDone, onFrameAnalysis) {
    wrapper.querySelector('#case-file-back')?.addEventListener('click', () => {
        if (onDone) onDone();
    });
    wrapper.querySelector('#case-open-frame-analysis')?.addEventListener('click', () => {
        if (onFrameAnalysis) onFrameAnalysis();
    });
}

function revealSystemLines(wrapper, onDone) {
    const lines = [...wrapper.querySelectorAll('.case-system-line')];
    lines.forEach((line, index) => {
        setTimeout(() => line.classList.add('visible'), 450 + index * 850);
    });

    setTimeout(() => {
        wrapper.querySelector('.case-question-card')?.classList.add('visible');
    }, 2300);

    setTimeout(() => {
        wrapper.querySelector('.case-done-btn')?.classList.add('visible');
        attachDone(wrapper, onDone);
    }, 3200);
}

function attachDone(wrapper, onDone) {
    const button = wrapper.querySelector('#case-done');
    if (!button) return;
    button.addEventListener('click', () => {
        stateManager.setFlag('nextMorningUnlocked', true);
        if (onDone) onDone();
    });
}
