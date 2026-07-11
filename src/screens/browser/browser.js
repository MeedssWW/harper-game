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
            <button class="messenger-back-btn" id="browser-back">←</button>
            <span>Браузер</span>
            <div style="width:36px;"></div>
        </div>
        <div class="browser-addressbar">
            <div class="browser-lock">⌕</div>
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
                        <p>Этот номер появился на телефоне Харпер Вэнс перед её исчезновением.</p>
                        <p><b>${playerPhoneNumber}</b></p>
                        <p>Человек не из Рейвенвуда.</p>
                        <p>Кто-нибудь знает, почему он оказался связан с Харпер?</p>
                    </div>
                    ${playerPhoto
                        ? `<img class="ravenfeed-image" src="${playerPhoto}" alt="Фото игрока с фронтальной камеры">`
                        : `<div class="ravenfeed-image" style="height:260px;display:grid;place-items:center;color:#94a3b8;">фото недоступно</div>`}
                    <div class="ravenfeed-comments">
                        <div><b>@rivergirl:</b> Это тот человек, которого Дерек добавил в чат?</div>
                        <div><b>@unknown_local:</b> Почему его номер вообще был у Харпер?</div>
                        <div><b>@hollowstreet:</b> Он ведь даже не из Рейвенвуда.</div>
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

    fragment.appendChild(wrapper);
    return fragment;
}
