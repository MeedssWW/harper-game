// ============================================
// Case File Intro Task — first investigation mechanic
// ============================================

import { stateManager } from '../../engine/stateManager.js';

const CASE_MAP_IMAGE = 'src/assets/maps/ravenwood_map.png?v=73';
const ICON_ROOT = 'src/assets/icons/lucide';
const CARD_ORDER_FLAG = 'caseIntroCardOrder';

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
    const orderedCards = getStableCardOrder();

    wrapper.innerHTML = `
        <header class="case-task-header">
            <div class="case-kicker">${lucideIcon('file-text')} новая страница</div>
            <h1>ДЕЛО: ХАРПЕР ВЭНС</h1>
            <p>Раздели то, что уже известно, и то, что персонажи пока только предполагают.</p>
            <p class="case-task-rule">Даже уверенно сказанная фраза не становится фактом без подтверждения.</p>
        </header>

        <main class="case-task-body">
            <section class="case-sort-columns" aria-label="Категории. Карточки можно распределять кнопками или перетаскиванием.">
                <div class="case-column confirmed" data-value="confirmed" role="region" aria-label="Подтверждено">
                    <div class="case-column-label">${lucideIcon('search')}<span>ПОДТВЕРЖДЕНО</span></div>
                    <strong id="confirmed-count">${formatCardCount(0)}</strong>
                </div>
                <div class="case-column unknown" data-value="unknown" role="region" aria-label="Пока только версия">
                    <div class="case-column-label">${lucideIcon('message-circle')}<span>ПОКА ТОЛЬКО ВЕРСИЯ</span></div>
                    <strong id="unknown-count">${formatCardCount(0)}</strong>
                </div>
            </section>

            <div class="case-sort-progress" aria-hidden="true"><i id="case-sort-progress-fill"></i></div>

            <div class="case-task-feedback" id="case-feedback" role="status" aria-live="polite"></div>

            <section class="case-card-list" aria-label="Утверждения">
                ${orderedCards.map((card, index) => renderCard(card, index)).join('')}
            </section>

            <button class="case-check-btn" id="case-check" type="button" disabled>Завершить разбор</button>
        </main>
    `;

    const assignCard = (cardId, value) => {
        assignments.set(cardId, value);
        updateCardState(wrapper, assignments);
        showPlacementFeedback(wrapper, cardId, value);
    };

    wrapper.querySelectorAll('.case-card-action').forEach(button => {
        button.addEventListener('click', () => assignCard(button.dataset.card, button.dataset.value));
    });

    attachCardDragControls(wrapper, assignCard);

    wrapper.querySelector('#case-check').addEventListener('click', () => {
        const allCorrect = CARDS.every(card => assignments.get(card.id) === card.answer);
        const feedback = wrapper.querySelector('#case-feedback');

        if (!allCorrect) {
            const firstWrong = CARDS.find(card => assignments.get(card.id) !== card.answer);
            setCaseFeedback(feedback, firstWrong?.wrongConfirmed || 'Проверь отмеченные карточки: одна из них лежит не в своей категории.', 'error');
            const wrongCard = firstWrong && wrapper.querySelector(`.case-sort-card[data-card="${firstWrong.id}"]`);
            wrongCard?.classList.add('is-error');
            wrongCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        completeCaseIntro(wrapper, onDone);
    });

    return wrapper;
}

function renderCard(card, index) {
    return `
        <article class="case-sort-card" data-card="${card.id}" draggable="true" tabindex="0" aria-label="Карточка ${index + 1} из ${CARDS.length}">
            <span class="case-card-number">${String(index + 1).padStart(2, '0')}</span>
            <p>${card.text}</p>
            <div class="case-card-actions">
                <button class="case-card-action" data-card="${card.id}" data-value="confirmed" type="button" aria-pressed="false">Подтверждено</button>
                <button class="case-card-action" data-card="${card.id}" data-value="unknown" type="button" aria-pressed="false">Только версия</button>
            </div>
            <span class="case-card-drag-hint" aria-hidden="true">удерживай и перетащи</span>
        </article>
    `;
}

function getStableCardOrder() {
    const stored = stateManager.get('flags')?.[CARD_ORDER_FLAG];
    const knownIds = new Set(CARDS.map(card => card.id));
    const isValid = Array.isArray(stored) &&
        stored.length === CARDS.length &&
        new Set(stored).size === CARDS.length &&
        stored.every(id => knownIds.has(id));

    if (isValid) {
        const byId = new Map(CARDS.map(card => [card.id, card]));
        return stored.map(id => byId.get(id));
    }

    const order = buildBalancedCardOrder();
    stateManager.setFlag(CARD_ORDER_FLAG, order.map(card => card.id));
    return order;
}

function buildBalancedCardOrder() {
    const cards = [...CARDS];

    // A regular shuffle can put all five facts next to each other. Retry until
    // no category forms a run longer than two, then shuffle inside each type.
    for (let attempt = 0; attempt < 120; attempt += 1) {
        const candidate = shuffled(cards);
        if (longestAnswerRun(candidate) <= 2) return candidate;
    }

    const confirmed = shuffled(cards.filter(card => card.answer === 'confirmed'));
    const unknown = shuffled(cards.filter(card => card.answer === 'unknown'));
    const fallback = [];
    while (confirmed.length || unknown.length) {
        const lastTwo = fallback.slice(-2);
        const blockedAnswer = lastTwo.length === 2 && lastTwo[0].answer === lastTwo[1].answer
            ? lastTwo[0].answer
            : '';
        const options = [confirmed, unknown].filter(group => group.length && group[0].answer !== blockedAnswer);
        const preferred = options.sort((a, b) => b.length - a.length)[0] || [confirmed, unknown].find(group => group.length);
        if (preferred?.length) fallback.push(preferred.shift());
    }
    return fallback;
}

function shuffled(items) {
    const output = [...items];
    for (let index = output.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
    }
    return output;
}

function longestAnswerRun(cards) {
    let longest = 0;
    let run = 0;
    let previous = '';
    for (const card of cards) {
        run = card.answer === previous ? run + 1 : 1;
        previous = card.answer;
        longest = Math.max(longest, run);
    }
    return longest;
}

function attachCardDragControls(wrapper, assignCard) {
    let draggedCardId = '';

    wrapper.querySelectorAll('.case-sort-card').forEach(card => {
        card.addEventListener('dragstart', event => {
            draggedCardId = card.dataset.card || '';
            card.classList.add('is-dragging');
            wrapper.classList.add('is-sorting');
            event.dataTransfer?.setData('text/plain', draggedCardId);
            if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
        });
        card.addEventListener('dragend', () => {
            draggedCardId = '';
            card.classList.remove('is-dragging');
            wrapper.classList.remove('is-sorting');
            wrapper.querySelectorAll('.case-column.is-drop-target').forEach(column => column.classList.remove('is-drop-target'));
        });
    });

    wrapper.querySelectorAll('.case-column[data-value]').forEach(column => {
        column.addEventListener('dragover', event => {
            event.preventDefault();
            if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
            column.classList.add('is-drop-target');
        });
        column.addEventListener('dragleave', event => {
            if (!column.contains(event.relatedTarget)) column.classList.remove('is-drop-target');
        });
        column.addEventListener('drop', event => {
            event.preventDefault();
            const cardId = event.dataTransfer?.getData('text/plain') || draggedCardId;
            column.classList.remove('is-drop-target');
            if (cardId) assignCard(cardId, column.dataset.value);
        });
    });
}

function setCaseFeedback(feedback, message, state) {
    if (!feedback) return;
    feedback.replaceChildren();
    const icon = document.createElement('img');
    icon.src = `${ICON_ROOT}/${state === 'error' ? 'circle-alert' : 'check-check'}.svg`;
    icon.alt = '';
    icon.setAttribute('aria-hidden', 'true');
    const text = document.createElement('span');
    text.textContent = message;
    feedback.append(icon, text);
    feedback.classList.remove('error', 'success', 'feedback-pop');
    feedback.classList.add('visible', state);
    requestAnimationFrame(() => feedback.classList.add('feedback-pop'));
}

function pulseCard(wrapper, cardId, className) {
    const card = wrapper.querySelector(`.case-sort-card[data-card="${cardId}"]`);
    if (!card) return;
    card.classList.remove('is-error', 'is-correct');
    // Restart the short confirmation animation when a choice is changed.
    void card.offsetWidth;
    card.classList.add(className);
    setTimeout(() => card.classList.remove(className), 560);
}

function lucideIcon(name, className = 'case-lucide-icon') {
    const safeName = /^[a-z0-9-]+$/.test(name) ? name : 'file-text';
    return `<img class="${className}" src="${ICON_ROOT}/${safeName}.svg" alt="" aria-hidden="true">`;
}

function showPlacementFeedback(wrapper, cardId, value) {
    const card = CARDS.find(item => item.id === cardId);
    const feedback = wrapper.querySelector('#case-feedback');
    if (!card || !feedback) return;

    if (value !== card.answer) {
        setCaseFeedback(feedback, card.wrongConfirmed || 'Это уже подтверждено тем, что известно из разговоров.', 'error');
        pulseCard(wrapper, cardId, 'is-error');
        return;
    }

    setCaseFeedback(feedback, card.detail || (value === 'unknown' ? 'Пока это нельзя считать доказанным фактом.' : 'Подтверждено.'), 'success');
    pulseCard(wrapper, cardId, 'is-correct');
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
            button.setAttribute('aria-pressed', String(button.dataset.value === value));
        });

        if (value === 'confirmed') confirmed += 1;
        if (value === 'unknown') unknown += 1;
    }

    wrapper.querySelector('#confirmed-count').innerHTML = formatCardCount(confirmed);
    wrapper.querySelector('#unknown-count').innerHTML = formatCardCount(unknown);
    const progress = wrapper.querySelector('#case-sort-progress-fill');
    if (progress) progress.style.width = `${(assignments.size / CARDS.length) * 100}%`;
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
            <div class="case-kicker">${lucideIcon('file-text')} заметка сохранена</div>
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
            <button class="case-file-back" id="case-file-back" type="button" aria-label="Назад">${lucideIcon('chevron-left')}</button>
            <div class="case-kicker">${lucideIcon('search')} расследование</div>
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
            <div class="case-file-section-title">${lucideIcon('map')}<span>Карта маршрута</span></div>
            <div class="case-map-frame">
                <img src="${CASE_MAP_IMAGE}" alt="Карта Рейвенвуда с отмеченным маршрутом" />
                <div class="case-map-route" aria-hidden="true"><i></i><i></i><i></i></div>
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
            <div class="case-file-section-title">${lucideIcon('image')}<span>Видео для анализа</span></div>
            <article>
                <span>${lucideIcon('image')} VID_1842_fragment.mp4</span>
                <strong>Нужно выбрать стоп-кадр</strong>
                <p>В очищенном фрагменте виден тёмно-зелёный седан. Нужно найти момент, где наклейка на лобовом стекле различима лучше всего.</p>
                <button id="case-open-frame-analysis" type="button">${lucideIcon('search')}<span>Изучить видео</span></button>
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
        text: 'Внешний просмотрщик передал серверу временный ключ RavenLink. Через него были прочитаны чаты, заметки и запрошена камера.'
    });
    stateManager.addCaseEntry({
        id: 'question_trap_attachment_owner',
        type: 'question',
        title: 'ВОПРОС',
        text: 'Кто подменил внешний адрес VID_1842.mp4 и кому принадлежит сервер?'
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
            <div class="case-file-section-title">${lucideIcon(getCaseTypeIcon(group.type))}<span>${group.label}</span><small>${groupEntries.length}</small></div>
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
            <span class="case-file-entry-type">${lucideIcon(getCaseTypeIcon(entry.type))}${typeLabel}</span>
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
            ${lucideIcon('file-text', 'case-file-empty-icon')}
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

function getCaseTypeIcon(type) {
    if (type === 'question') return 'circle-question-mark';
    if (type === 'fact') return 'search';
    if (type === 'clue') return 'image';
    if (type === 'thread') return 'map';
    return 'file-text';
}

function formatEntryCount(count) {
    const last = count % 10;
    const lastTwo = count % 100;
    if (last === 1 && lastTwo !== 11) return 'запись';
    if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return 'записи';
    return 'записей';
}

function formatCardCount(count) {
    const last = count % 10;
    const lastTwo = count % 100;
    const word = last === 1 && lastTwo !== 11
        ? 'карточка'
        : last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)
            ? 'карточки'
            : 'карточек';
    return `${count} <small>${word}</small>`;
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
