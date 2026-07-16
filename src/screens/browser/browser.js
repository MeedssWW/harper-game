import { stateManager } from '../../engine/stateManager.js';

const SEARCH_DATA = [
    {
        keys: ['harper vance', 'харпер', 'харпер вэнс'],
        url: 'ravenwood-police.local/case/harper-vance',
        title: 'Ravenwood Police: поиски Харпер Вэнс',
        text: 'Официальные обновления полиции Рейвенвуда. Детали дела не раскрываются.'
    },
    {
        keys: ['ravenwood', 'рейвенвуд'],
        url: 'ravenwood.gov',
        title: 'Ravenwood Town Services',
        text: 'Городские службы, карта района, новости муниципалитета.'
    }
];

export function renderBrowser({ onBack }) {
    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement('div');
    wrapper.className = 'invest-app browser-app';

    wrapper.innerHTML = `
        <div class="invest-header">
            <button class="messenger-back-btn" id="browser-back" type="button" aria-label="Назад"><img class="ui-lucide is-light" src="src/assets/icons/lucide/chevron-left.svg" alt="" /></button>
            <span>Браузер</span>
            <div style="width:36px;"></div>
        </div>
        <div class="browser-addressbar">
            <div class="browser-lock" aria-hidden="true"><img class="ui-lucide is-light" src="src/assets/icons/lucide/search.svg" alt="" /></div>
            <input id="browser-query" type="text" placeholder="поиск или адрес" autocomplete="off" spellcheck="false">
            <button id="browser-submit">go</button>
        </div>
        <div class="browser-results" id="browser-results">
            <div class="browser-start">
                <div class="browser-start-logo">web</div>
                <p>История браузера пустая.</p>
            </div>
        </div>
    `;

    const input = wrapper.querySelector('#browser-query');
    const results = wrapper.querySelector('#browser-results');

    const runSearch = (query) => {
        input.value = query;
        const normalized = query.trim().toLowerCase();
        if (!normalized) {
            results.innerHTML = '<div class="browser-empty">Пустой запрос.</div>';
            return;
        }

        if (normalized.includes('ravenfeed') || normalized.includes('raven feed')) {
            results.innerHTML = `
                <article class="browser-result browser-result-clickable" id="open-ravenfeed">
                    <div class="browser-url">ravenfeed.local</div>
                    <h3>RavenFeed</h3>
                    <p>Новости, слухи и сообщения жителей Рейвенвуда</p>
                    <div class="browser-cache">первый результат</div>
                </article>
            `;
            wrapper.querySelector('#open-ravenfeed')?.addEventListener('click', renderRavenFeed);
            return;
        }

        const visible = SEARCH_DATA.filter(item =>
            item.keys.some(key => normalized.includes(key)) ||
            item.title.toLowerCase().includes(normalized)
        );

        results.innerHTML = visible.length ? visible.map(item => `
            <article class="browser-result">
                <div class="browser-url">${item.url}</div>
                <h3>${item.title}</h3>
                <p>${item.text}</p>
            </article>
        `).join('') : '<div class="browser-empty">Ничего не найдено.</div>';
    };

    const renderRavenFeed = () => {
        const flags = stateManager.get('flags') || {};
        const playerPhoto = flags.playerHackPhoto || flags.playerFrontCameraPhoto || '';
        const playerPhoneNumber = flags.playerPhoneNumber || '+1 (503) 555-0172';
        const chatNames = flags.larksCreated
            ? ['Larks', 'Оливия', 'Миа', 'Дерек']
            : ['Оливия', 'Миа', 'Дерек'];

        if (playerPhoto && !flags.playerHackPhoto) {
            stateManager.setFlag('playerHackPhoto', playerPhoto);
        }
        stateManager.setFlag('playerPhoneNumber', playerPhoneNumber);
        stateManager.setFlag('ravenwatchPostPublished', true);
        stateManager.setFlag('playerHackPhotoUsedInExposurePost', true);
        stateManager.setFlag('playerNumberExposed', true);

        results.innerHTML = `
            <section class="ravenfeed-feed">
                <article class="ravenfeed-card">
                    <header class="ravenfeed-profile">
                        <strong>@ravenwood_watch</strong>
                        <span>Новости, слухи и сообщения жителей Рейвенвуда.</span>
                    </header>
                    <div class="ravenfeed-post-text">
                        <p><strong>@ravenwood_watch</strong> · Только что</p>
                        <p><b>ПОСЛЕДНИЙ КОНТАКТ ХАРПЕР ВЭНС</b></p>
                        <p>Его номер был последним сообщением, отправленным с телефона Харпер.</p>
                        <p>Он утверждает, что никогда её не знал и не был в Рейвенвуде. При этом несколько дней общался с её друзьями и получал материалы расследования.</p>
                        <p>Почему человек из другого города оказался последним контактом пропавшей девушки?</p>
                        <p><b>${playerPhoneNumber}</b></p>
                    </div>
                    ${playerPhoto
                        ? `<img class="ravenfeed-image" src="${playerPhoto}" alt="Фото игрока с фронтальной камеры">`
                        : `<div class="ravenfeed-image" style="height:260px;display:grid;place-items:center;color:#94a3b8;">фото недоступно</div>`}
                    <div class="ravenfeed-image" style="padding:18px;background:#080d16;color:#e5e7eb;display:grid;gap:10px;">
                        <small style="color:#94a3b8;">Список чатов игрока</small>
                        ${chatNames.map(name => `<div style="padding:10px 12px;border-radius:12px;background:#151c28;font-weight:800;">${name}</div>`).join('')}
                    </div>
                    <div class="ravenfeed-comments">
                        <div><b>@rivergirl:</b> Это он?</div>
                        <div><b>@unknown_local:</b> Почему полиция молчит?</div>
                        <div><b>@hollowstreet:</b> Он следил за ними через телефон?</div>
                        <div><b>@local503:</b> Номер настоящий. Я проверил.</div>
                    </div>
                </article>
            </section>
        `;
    };

    wrapper.querySelector('#browser-back').addEventListener('click', onBack);
    wrapper.querySelector('#browser-submit').addEventListener('click', () => runSearch(input.value));
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') runSearch(input.value);
    });

    if (stateManager.hasFlag('act1ViralPost') && !stateManager.hasFlag('ravenwatchPostPublished')) {
        input.value = 'ravenfeed';
        renderRavenFeed();
    }

    fragment.appendChild(wrapper);
    return fragment;
}
