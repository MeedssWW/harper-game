import { stateManager } from '../../engine/stateManager.js';

const MAP_IMAGE = 'src/assets/maps/ravenwood_map.png?v=73';

const TASKS = [
    {
        id: 'larks',
        title: 'Larks',
        text: 'За четыре дня до исчезновения Харпер была здесь вместе с Оливией.',
        confirmed: 'Подтверждено: Харпер была в Larks за четыре дня до исчезновения.'
    },
    {
        id: 'riverwalk',
        title: 'Riverwalk',
        text: 'За три дня до исчезновения Харпер была здесь вместе с Мией.',
        confirmed: 'Подтверждено: Харпер была у старого моста с Мией за три дня до исчезновения.'
    }
];

const PLACES = [
    { id: 'larks', label: 'Larks', x: 31, y: 41, important: true },
    { id: 'riverwalk', label: 'Riverwalk', x: 84, y: 57, important: true },
    { id: 'old_bridge', label: 'Old Bridge', x: 75, y: 83 },
    { id: 'orpheum', label: 'Old Cinema Orpheum', x: 63, y: 42 },
    { id: 'town_square', label: 'Town Square', x: 51, y: 34 },
    { id: 'bus_stop', label: 'Bus Stop', x: 47, y: 58 },
    { id: 'small_park', label: 'Small Park', x: 76, y: 15 },
    { id: 'old_station', label: 'Old Station', x: 17, y: 76 },
    { id: 'orpheum_parking', label: 'Orpheum Parking', x: 73, y: 43 }
];

const NORTH_YARD_PLACE = { id: 'north_yard', label: 'Северный двор', x: 15, y: 89, important: true, unconfirmed: true };

export function renderMap({ onBack, onDone, mode = 'task' } = {}) {
    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement('div');
    wrapper.className = `ravenwood-map-screen ${mode === 'viewer' ? 'viewer' : ''}`;

    wrapper.innerHTML = `
        <section class="ravenwood-map-loading" aria-live="polite">
            <div class="map-loading-pulse"></div>
            <strong>Загрузка карты Рейвенвуда...</strong>
        </section>
    `;

    fragment.appendChild(wrapper);

    setTimeout(() => {
        if (mode === 'viewer') {
            renderViewer(wrapper, onBack);
            return;
        }
        renderTask(wrapper, onBack, onDone);
    }, 700);

    return fragment;
}

function renderViewer(wrapper, onBack) {
    const viewerPlaces = getViewerPlaces();
    wrapper.innerHTML = `
        <header class="ravenwood-map-header viewer">
            <button class="messenger-back-btn" id="map-back" type="button" aria-label="Назад"><img class="ui-lucide is-light" src="src/assets/icons/lucide/chevron-left.svg" alt="" /></button>
            <div>
                <span class="map-kicker">Рейвенвуд</span>
                <h1>Карта города</h1>
                <p>Открытые места, которые уже всплывали в расследовании. Здесь только точки, без выводов и маршрутов.</p>
            </div>
        </header>

        <main class="ravenwood-map-body map-viewer-body">
            <section class="ravenwood-map-frame map-viewer-frame" aria-label="Карта Рейвенвуда">
                <img src="${MAP_IMAGE}" alt="Карта Рейвенвуда" />
                ${viewerPlaces.map(place => renderViewerPlace(place)).join('')}
            </section>

            <section class="map-viewer-list" aria-label="Открытые места">
                ${renderViewerListItem('Larks', 'Кафе на River Street. Последнее подтверждённое место с Оливией.')}
                ${renderViewerListItem('Old Cinema Orpheum', 'Старый кинотеатр напротив Larks. Рядом парковка.')}
                ${renderViewerListItem('Riverwalk', 'Набережная возле старого моста. Там Миа видела Харпер на следующий день.')}
                ${renderViewerListItem('Old Bridge', 'Старый мост рядом с Riverwalk. Пока только ориентир.')}
                ${renderViewerListItem('Town Square', 'Центр Рейвенвуда. Отсюда быстро дойти до River Street.')}
                ${renderViewerListItem('Bus Stop', 'Остановка рядом с центральной частью города.')}
                ${stateManager.hasFlag('northYardAddedToMap') ? renderViewerListItem('Северный двор', 'Неподтверждённая точка. Служебная зона за старой станцией, возможная связь только через наклейку на седане.') : ''}
            </section>
        </main>
    `;

    wrapper.querySelector('#map-back')?.addEventListener('click', () => {
        if (onBack) onBack();
    });
}

function getViewerPlaces() {
    if (!stateManager.hasFlag('northYardAddedToMap')) return PLACES;
    return [...PLACES, NORTH_YARD_PLACE];
}

function renderViewerPlace(place) {
    return `
        <span
            class="map-place map-viewer-place ${place.important ? 'important confirmed' : ''} ${place.unconfirmed ? 'unconfirmed' : ''}"
            style="left:${place.x}%; top:${place.y}%;"
            aria-label="${place.label}"
        >
            <span class="map-place-dot"></span>
            <span class="map-place-label">${place.label}</span>
        </span>
    `;
}

function renderViewerListItem(title, text) {
    return `
        <article class="map-viewer-card">
            <strong>${title}</strong>
            <p>${text}</p>
        </article>
    `;
}

function renderTask(wrapper, onBack, onDone) {
    const completed = stateManager.hasFlag('ravenwoodMapCompleted');
    const progress = completed ? TASKS.map(task => task.id) : [];

    wrapper.innerHTML = `
        <header class="ravenwood-map-header">
            <button class="messenger-back-btn" id="map-back" type="button" aria-label="Назад"><img class="ui-lucide is-light" src="src/assets/icons/lucide/chevron-left.svg" alt="" /></button>
            <div>
                <span class="map-kicker">Дело Харпер Вэнс</span>
                <h1>Карта Рейвенвуда</h1>
                <p>Добавьте две подтверждённые точки. События произошли в разные дни.</p>
            </div>
        </header>

        <main class="ravenwood-map-body">
            <section class="map-task-cards" aria-label="Задания">
                ${TASKS.map((task, index) => renderTaskCard(task, index, progress)).join('')}
            </section>

            <section class="ravenwood-map-frame ${completed ? 'is-complete' : ''}" aria-label="Карта Рейвенвуда">
                <img src="${MAP_IMAGE}" alt="Карта Рейвенвуда" />
                <div class="map-route-hint" aria-hidden="true"></div>
                ${PLACES.map(place => renderPlace(place, progress)).join('')}
            </section>

            <div class="map-feedback" id="map-feedback" aria-live="polite"></div>
            <section class="map-result" id="map-result"></section>
        </main>
    `;

    wrapper.querySelector('#map-back')?.addEventListener('click', () => {
        if (onBack) onBack();
    });

    if (completed) {
        renderResult(wrapper, onDone, false);
        return;
    }

    const selected = { value: TASKS[0].id };
    const done = new Set(progress);
    updateTaskState(wrapper, selected.value, done);

    wrapper.querySelectorAll('.map-task-card').forEach(card => {
        card.addEventListener('click', () => {
            const taskId = card.dataset.task;
            if (!done.has(taskId)) {
                selected.value = taskId;
                updateTaskState(wrapper, selected.value, done);
            }
        });
    });

    wrapper.querySelectorAll('.map-place').forEach(button => {
        button.addEventListener('click', () => {
            const placeId = button.dataset.place;
            const activeTask = selected.value;
            const feedback = wrapper.querySelector('#map-feedback');

            if (placeId !== activeTask) {
                feedback.textContent = 'Это место есть на карте, но пока нет подтверждения, что Харпер была там в последние дни.';
                feedback.className = 'map-feedback visible warning';
                return;
            }

            done.add(placeId);
            button.classList.add('confirmed');
            feedback.textContent = TASKS.find(task => task.id === placeId)?.confirmed || 'Подтверждено.';
            feedback.className = 'map-feedback visible';

            const next = TASKS.find(task => !done.has(task.id));
            selected.value = next?.id || placeId;
            updateTaskState(wrapper, selected.value, done);

            if (done.size === TASKS.length) {
                setTimeout(() => renderResult(wrapper, onDone, true), 650);
            }
        });
    });
}

function renderTaskCard(task, index, progress) {
    const done = progress.includes(task.id);
    return `
        <button class="map-task-card ${index === 0 && !done ? 'active' : ''} ${done ? 'done' : ''}" data-task="${task.id}" type="button">
            <span>${done ? 'отмечено' : `карточка ${index + 1}`}</span>
            <strong>${task.title}</strong>
            <p>${task.text}</p>
        </button>
    `;
}

function renderPlace(place, progress) {
    const confirmed = progress.includes(place.id);
    return `
        <button
            class="map-place ${place.important ? 'important' : ''} ${confirmed ? 'confirmed' : ''}"
            data-place="${place.id}"
            style="left:${place.x}%; top:${place.y}%;"
            type="button"
        >
            <span class="map-place-dot"></span>
            <span class="map-place-label">${place.label}</span>
        </button>
    `;
}

function updateTaskState(wrapper, activeTaskId, done) {
    wrapper.querySelectorAll('.map-task-card').forEach(card => {
        const taskId = card.dataset.task;
        card.classList.toggle('active', taskId === activeTaskId && !done.has(taskId));
        card.classList.toggle('done', done.has(taskId));
        const status = card.querySelector('span');
        if (status) status.textContent = done.has(taskId) ? 'отмечено' : (taskId === activeTaskId ? 'активно' : 'ожидает');
    });

    wrapper.querySelectorAll('.map-place').forEach(place => {
        const placeId = place.dataset.place;
        place.classList.toggle('target', placeId === activeTaskId && !done.has(placeId));
        place.classList.toggle('confirmed', done.has(placeId));
    });
}

function renderResult(wrapper, onDone, animate) {
    stateManager.setFlag('ravenwoodMapCompleted', true);
    addMapCaseEntries(false);

    const frame = wrapper.querySelector('.ravenwood-map-frame');
    frame?.classList.add('is-complete');

    const result = wrapper.querySelector('#map-result');
    result.innerHTML = `
        <article class="map-summary ${animate ? 'enter' : 'visible'}">
            <span>Подтверждено</span>
            <ul>
                <li><strong>Larks</strong> — за четыре дня до исчезновения.</li>
                <li><strong>Riverwalk — старый мост</strong> — за три дня до исчезновения.</li>
            </ul>
            <div class="map-observation">
                <strong>Предупреждение</strong>
                <p>События произошли в разные дни.</p>
                <em>Это не подтверждённый маршрут Харпер.</em>
            </div>
            <button class="map-add-case-btn" id="map-add-case" type="button">${stateManager.hasFlag('larksCreated') ? 'Вернуться в Larks' : 'Закрыть карту'}</button>
        </article>
    `;

    setTimeout(() => result.querySelector('.map-summary')?.classList.add('visible'), animate ? 60 : 0);

    result.querySelector('#map-add-case')?.addEventListener('click', () => {
        addMapCaseEntries(true);
        if (onDone) onDone();
    });
}

function addMapCaseEntries(continueStory = true) {
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
        text: 'Харпер была у старого моста вместе с Мией за три дня до исчезновения.'
    });
    stateManager.addCaseEntry({
        id: 'fact_green_sedan_question',
        type: 'clue',
        title: 'Тёмно-зелёный седан',
        text: 'Харпер спрашивала Мию о тёмно-зелёном седане.'
    });
    if (continueStory) {
        stateManager.setFlag('ravenwoodMapAddedToCase', true);
    }
}

function showTimePassage(wrapper, onDone) {
    wrapper.innerHTML = `
        <section class="map-time-transition">
            <div class="map-time-main">18:37</div>
            <div class="map-time-line">Несколько часов спустя.</div>
        </section>
    `;

    setTimeout(() => {
        if (onDone) onDone();
    }, 2400);
}
