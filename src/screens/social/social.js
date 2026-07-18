import { stateManager } from '../../engine/stateManager.js';
import { getCharacter } from '../../data/characters.js?v=124';

const A = 'src/assets/ravenfeed/generated';

const PEOPLE = {
    nadia: { name: 'Надя Форд', handle: '@nadia.f', avatar: `${A}/resident-nadia.webp`, bio: 'книги, плёнка и кофе, который я опять забыла допить' },
    eli: { name: 'Эли Браун', handle: '@eli.brown', avatar: `${A}/resident-eli.webp`, bio: 'чиню велосипеды и иногда собственную жизнь' },
    june: { name: 'Джун Пак', handle: '@junep', avatar: `${A}/resident-june.webp`, bio: 'переехала ненадолго. живу здесь третий год' },
    noah: { name: 'Ноа Бриггс', handle: '@noah.north', avatar: `${A}/resident-noah.webp`, bio: 'фото с улиц Рейвенвуда. почти всегда дождь' },
    leya: { name: 'Лея Морган', handle: '@leya.m', avatar: `${A}/resident-leya.webp`, bio: 'если я не отвечаю, я на смене или сплю' },
    sam: { name: 'Сэм Ортега', handle: '@sam.o', avatar: `${A}/resident-sam.webp`, bio: 'N7, футбол и слишком много острого соуса' },
    nate: { name: 'Нейт Холлоуэй', handle: '@nate.afterdark', avatar: `${A}/resident-nate.webp`, bio: 'маленький подкаст о маленьком городе. новые выпуски — когда я наконец домонтирую старые' }
};

const SEARCH_POST = {
    id: 'search-harper',
    author: 'Брук Хейз',
    handle: '@brooke.hayes',
    avatar: 'src/assets/avatars/avatar_brooke_live.png',
    image: 'src/assets/harper_photos/harper_cafe.jpg',
    likes: 318,
    age: 'только что',
    profile: 'brooke',
    text: 'Харпер Вэнс не выходит на связь уже два дня. Если вы видели её или знаете, где она может быть, пишите полиции. Пожалуйста, не несите в комментарии слухи и не звоните её семье. Репост поможет.',
    comments: [
        ['derek', 'Все контакты для информации есть на фото.'],
        ['nadia', 'репостнула. надеюсь, она скоро найдётся'],
        ['mason', 'Если что-то знаете — передавайте полиции. Не ищите в одиночку.'],
        ['june', 'распространила у себя']
    ]
};

const BASE_POSTS = [
    { id: 'ponchik', author: 'Надя Форд', handle: '@nadia.f', avatar: `${A}/resident-nadia.webp`, image: `${A}/post-dog-raincoat.webp`, likes: 146, age: '18 мин', profile: 'nadia', text: 'Пончик снова отказался идти домой, пока не проверил каждую лужу. Жёлтый дождевик не помог.', comments: [['mia', 'ОН ИДЕАЛЬНЫЙ'], ['olivia', 'Миа, ты писала это ещё под четырьмя его фото.'], ['mia', 'и напишу под пятым']] },
    { id: 'north-line', author: 'North Line Alerts', handle: '@northline.alerts', avatar: `${A}/page-northline.webp`, image: `${A}/post-rain-platform.webp`, likes: 53, age: '31 мин', text: 'Линия N7 задерживается примерно на семь минут из-за сигнала у старого переезда.', comments: [['sam', 'то есть на свои обычные семь минут'], ['tyler', 'Главное — назвать это событием, а не расписанием.'], ['june', 'я опять поверила табло 🤡']] },
    { id: 'olivia-city', author: 'Оливия Грант', handle: '@olivia.grant', avatar: 'src/assets/social_profiles/v3/olivia/life-2.webp', image: 'src/assets/social_profiles/v3/olivia/life-1.webp', likes: 91, age: '2 ч', profile: 'olivia', text: 'Orpheum всё ещё выглядит лучше снаружи, чем любой фильм, который там показывают.', comments: [['mia', 'не трогай кинотеатр'], ['olivia', 'Я трогаю фильмы. Кинотеатр красивый.'], ['derek', 'Тот фильм был нормальный.'], ['brooke', 'Нет.']] },
    { id: 'larks-board', author: 'Larks', handle: '@larks.rw', avatar: `${A}/page-larks.webp`, image: `${A}/post-larks-coffee.webp`, likes: 72, age: '3 ч', text: 'На доске снова появилось место. Несите объявления, рисунки и пропавшие перчатки. Политику снимем.', comments: [['eli', 'велосипед за окном считается объявлением?'], ['leya', 'если приклеишь его к доске'], ['olivia', 'Пожалуйста, не давайте ему идей.']] },
    { id: 'mia-jacket', author: 'Миа Картер', handle: '@mia.carter', avatar: 'src/assets/social_profiles/v3/mia/life-3.webp', image: 'src/assets/social_profiles/v3/mia/life-4.webp', likes: 108, age: 'вчера', profile: 'mia', text: 'Куртка остаётся. Все жалобы принимаются и игнорируются.', comments: [['harper', 'мокрый пакет, но дорогой'], ['mia', 'ты её сама у меня забирала'], ['harper', 'не помню такого'], ['olivia', 'У меня есть фото.']] },
    { id: 'market', author: 'Riverwalk Market', handle: '@riverwalk.market', avatar: `${A}/page-market.webp`, image: `${A}/post-market.webp`, likes: 39, age: 'вчера', text: 'Субботний обмен: книги, пластинки, одежда и вещи, которые жалко выбросить. Столы под навесом.', comments: [['june', 'кто-нибудь заберите у меня лампу'], ['noah', 'ту самую страшную?'], ['june', 'она винтажная'], ['noah', 'она наблюдает за людьми']] },
    { id: 'derek-football', author: 'Сэм Ортега', handle: '@sam.o', avatar: `${A}/resident-sam.webp`, image: `${A}/post-football.webp`, likes: 64, age: '4 дн', profile: 'sam', text: 'Проиграли 2:3, зато Дерек наконец признал, что разминка нужна не только слабым.', comments: [['derek', 'Я сказал, что можно было начать раньше.'], ['sam', 'после того как потянул ногу'], ['derek', 'Это не связано.'], ['tyler', 'Конечно.']] },
    { id: 'truth-seed', author: 'Ravenwood Truth', handle: '@ravenwood.truth', avatar: `${A}/page-truth.webp`, likes: 22, age: '5 дн', danger: true, text: 'Почему ремонт Orpheum опять оплатили без открытого голосования? Иногда в маленьком городе слишком удобно, когда все друг друга знают.', comments: [['noah', 'источник: вам так показалось?'], ['june', 'они опять удалят пост через час'], ['mason', 'Если у вас есть документы, приложите документы.']] }
];

const REQUESTS = {
    nate: {
        person: 'nate',
        preview: 'Здравствуйте. Меня зовут Нейт, я веду небольшой подкаст…',
        messages: [
            'Здравствуйте. Меня зовут Нейт Холлоуэй, я веду небольшой подкаст Ravenwood After Dark.',
            'Увидел публикацию Ravenwood Truth и хотел предложить вам рассказать свою версию. Если не хотите отвечать публично, можем поговорить без настоящего имени.'
        ]
    },
    noah: {
        person: 'noah',
        preview: 'Не знаю, что у тебя там было с Харпер…',
        messages: [
            'Не знаю, что у тебя там было с Харпер, но в Рейвенвуд лучше не приезжай.',
            'Здесь тебе никто не рад.'
        ]
    },
    june: {
        person: 'june',
        preview: 'Фотография с North Lot старая.',
        messages: [
            'Привет. Не знаю, увидишь ли ты это, но фотография с North Lot старая.',
            'Я была на том матче, и человек на снимке точно не ты.',
            'Сейчас попробую найти пост, откуда они её взяли.'
        ]
    }
};

export function renderSocial({ onBack }) {
    stateManager.setFlag('ravenFeedOpened', true);
    const wrapper = document.createElement('div');
    wrapper.className = 'invest-app social-app ravenfeed-app';
    let tab = stateManager.hasFlag('openRavenFeedRequests')
        ? 'requests'
        : stateManager.hasFlag('openRavenFeedCityGuide') ? 'city' : 'feed';
    stateManager.setFlag('openRavenFeedRequests', false);
    stateManager.setFlag('openRavenFeedCityGuide', false);
    const draw = () => {
        const posts = getVisiblePosts();
        const requestCount = getUnreadRequestCount();
        wrapper.innerHTML = `<header class="rf-header"><button class="rf-round" id="social-back" type="button" aria-label="Назад"><img class="ui-lucide is-light" src="src/assets/icons/lucide/chevron-left.svg" alt="" /></button><div class="rf-brand"><strong>RavenFeed</strong><span>Рейвенвуд рядом</span></div><div class="rf-header-actions">${stateManager.hasFlag('ravenFeedRequestsLive') ? `<button class="rf-round rf-inbox-button ${requestCount ? 'has-unread' : ''}" id="rf-inbox" type="button" aria-label="Запросы"><img class="ui-lucide is-light" src="src/assets/icons/lucide/message-circle-more.svg" alt="" />${requestCount ? `<b>${requestCount}</b>` : ''}</button>` : ''}<button class="rf-round" id="rf-search" type="button" aria-label="Поиск"><img class="ui-lucide is-light" src="src/assets/icons/lucide/search.svg" alt="" /></button></div></header><nav class="rf-tabs" aria-label="Разделы"><button data-tab="feed" class="${tab === 'feed' ? 'active' : ''}">Для вас</button><button data-tab="city" class="${tab === 'city' ? 'active' : ''}">Город</button><button data-tab="people" class="${tab === 'people' ? 'active' : ''}">Люди</button>${stateManager.hasFlag('ravenFeedRequestsLive') ? `<button data-tab="requests" class="${tab === 'requests' ? 'active' : ''}">Запросы</button>` : ''}</nav><main class="social-feed rf-feed">${tab === 'people' ? renderPeople() : tab === 'requests' ? renderRequestInbox() : posts.filter(post => tab !== 'city' || !post.profile).map(renderPost).join('')}</main>`;
        bind();
    };
    const bind = () => {
        wrapper.querySelector('#social-back')?.addEventListener('click', onBack);
        wrapper.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', () => { tab = button.dataset.tab; draw(); }));
        wrapper.querySelectorAll('[data-profile]').forEach(button => button.addEventListener('click', event => { event.stopPropagation(); openProfile(wrapper, button.dataset.profile, draw); }));
        wrapper.querySelectorAll('[data-open-post]').forEach(article => article.addEventListener('click', event => { if (event.target.closest('button')) return; const post = getVisiblePosts().find(item => item.id === article.dataset.openPost); if (post?.flag) stateManager.setFlag(post.flag, true); article.classList.add('opened'); }));
        wrapper.querySelectorAll('.rf-like').forEach(button => button.addEventListener('click', () => { const liked = button.classList.toggle('liked'); const base = Number(button.dataset.likes || 0); button.querySelector('span').textContent = String(base + (liked ? 1 : 0)); }));
        wrapper.querySelector('#rf-search')?.addEventListener('click', () => { tab = 'people'; draw(); setTimeout(() => wrapper.querySelector('.rf-people-grid')?.classList.add('pulse'), 20); });
        wrapper.querySelector('#rf-inbox')?.addEventListener('click', () => { tab = 'requests'; draw(); });
        wrapper.querySelectorAll('[data-public-response]').forEach(button => button.addEventListener('click', event => { event.stopPropagation(); submitPublicResponse(button.dataset.publicResponse); draw(); }));
        wrapper.querySelectorAll('[data-request]').forEach(button => button.addEventListener('click', () => openRequest(wrapper, button.dataset.request, draw)));
    };
    const onStoryFlag = ({ flag }) => {
        if (!wrapper.isConnected) {
            stateManager.off('flag', onStoryFlag);
            return;
        }
        if (['brookeSearchPostLive', 'act1ViralPost', 'episode2AftershockLive', 'northLotClaimLive', 'juneRequestLive', 'ep2CityGuideLive'].includes(flag)) draw();
    };
    stateManager.on('flag', onStoryFlag);
    draw();
    return wrapper;
}

function getVisiblePosts() {
    const posts = [...BASE_POSTS];
    if (stateManager.hasFlag('brookeSearchPostLive')) posts.unshift(SEARCH_POST);
    if (stateManager.hasFlag('act1ViralPost')) posts.unshift(buildFramingPost());
    if (stateManager.hasFlag('northLotClaimLive')) posts.unshift(buildNorthLotPost());
    return posts;
}

function buildFramingPost() {
    const playerName = stateManager.getPlayerName();
    const flags = stateManager.get('flags') || {};
    const playerPhoto = flags.playerHackPhoto || flags.playerFrontCameraPhoto || '';
    const miaComment = stateManager.hasFlag('miaKnowsAboutHack')
        ? 'Фото украли с его телефона. Не разносите это дальше.'
        : 'Откуда у вас вообще это фото?';
    const comments = [['nadia', 'вы серьёзно выложили лицо человека без доказательств?'], ['sam', 'полиция вообще это видела?'], ['olivia', 'Удалите публикацию. Вы не знаете, что произошло.'], ['mia', miaComment], ['june', 'уже разлетелось по всему городу'], ['derek', 'Я не давал вам его номер.'], ['brooke', `${playerName}, ответь. Откуда у них твоё фото и кто рассказал им про номер?`]];
    const playerComment = getPlayerPublicComment();
    if (playerComment) comments.push(['player', playerComment]);
    if (stateManager.hasFlag('episode2AftershockLive')) {
        comments.push(['noah', 'кто-нибудь вообще знает, был ли он в городе?']);
        comments.push(['june', '«кто-нибудь знает» — отличный уровень проверки']);
    }
    return { id: 'player-framed', author: 'Ravenwood Truth', handle: '@ravenwood.truth', avatar: `${A}/page-truth.webp`, image: playerPhoto, playerFallback: true, likes: stateManager.hasFlag('episode2AftershockLive') ? 714 : 487, age: 'сейчас', danger: true, flag: 'viralPostOpened', text: `${playerName} (@${playerHandle()}) говорит, что никогда не видел Харпер Вэнс. Тогда почему с её телефона отправили именно его номер? Сегодня нам прислали снимок с его устройства и список недавних контактов. Случайность или Рейвенвуд должен был узнать о нём раньше?`, comments, responsePanel: stateManager.hasFlag('episode2AftershockLive') && !stateManager.hasFlag('ep2PublicResponseResolved') };
}

function buildNorthLotPost() {
    if (stateManager.hasFlag('northLotDebunked')) {
        return { id: 'north-lot-claim', removed: true, author: 'Ravenwood Truth', handle: '@ravenwood.truth', avatar: `${A}/page-truth.webp`, danger: true, age: 'публикация удалена', text: 'Автор удалил публикацию о North Lot без объяснения.' };
    }
    return {
        id: 'north-lot-claim', author: 'Ravenwood Truth', handle: '@ravenwood.truth', avatar: `${A}/page-truth.webp`,
        image: `${A}/post-north-lot-archive.webp`, mediaClass: 'rf-north-lot-crop', likes: 193, age: 'только что', danger: true,
        flag: 'northLotClaimOpened',
        text: `Нам прислали фотографию человека, похожего на ${stateManager.getPlayerName()}, возле North Lot. Он действительно никогда не был в Рейвенвуде?`,
        comments: [['noah', 'фото мыльное, там вообще ничего не видно'], ['sam', 'и когда это снято?'], ['june', 'подождите. я знаю этот матч']]
    };
}

function renderPost(post) {
    if (post.removed) {
        return `<article class="social-post rf-post rf-removed-post is-danger"><div class="social-post-head rf-post-head">${avatarMarkup(post.avatar, post.author)}<div><strong>${escapeHtml(post.author)}</strong><small>${escapeHtml(post.handle)} · ${escapeHtml(post.age)}</small></div></div><div class="rf-removed-copy"><img class="ui-lucide is-light" src="src/assets/icons/lucide/archive.svg" alt=""><p>${escapeHtml(post.text)}</p></div></article>`;
    }
    const comments = (post.comments || []).map(([id, text]) => { const person = getSocialPerson(id); return `<div class="rf-comment"><button data-profile="${id}" type="button">${escapeHtml(person.handle || person.name)}</button><span>${escapeHtml(text)}</span></div>`; }).join('');
    const media = post.image || post.playerFallback ? `<div class="rf-media ${post.playerFallback ? 'rf-player-media' : ''} ${post.mediaClass || ''}">${post.image ? `<img src="${post.image}" alt="" onerror="this.hidden=true;this.parentElement.classList.add('missing')">` : ''}<div class="rf-photo-fallback"><img src="src/assets/icons/lucide/user-round.svg" alt=""><span>playerHackPhoto.jpg</span></div></div>` : '';
    const responsePanel = post.responsePanel ? renderPublicResponsePanel() : '';
    return `<article class="social-post rf-post ${post.danger ? 'is-danger' : ''}" data-open-post="${post.id}"><div class="social-post-head rf-post-head"><button class="social-avatar" data-profile="${post.profile || ''}" type="button">${avatarMarkup(post.avatar, post.author)}</button><div><strong>${escapeHtml(post.author)}</strong><small>${escapeHtml(post.handle)} · ${escapeHtml(post.age)}</small></div><button class="rf-more" type="button" aria-label="Ещё"><img class="ui-lucide is-light" src="src/assets/icons/lucide/ellipsis.svg" alt=""></button></div><p class="rf-copy">${escapeHtml(post.text)}</p>${media}<div class="rf-actions"><button class="rf-like" data-likes="${post.likes}" type="button"><img class="ui-lucide is-light" src="src/assets/icons/lucide/heart.svg" alt=""><span>${post.likes}</span></button><span><img class="ui-lucide is-light" src="src/assets/icons/lucide/message-circle.svg" alt="">${post.comments?.length || 0}</span><span><img class="ui-lucide is-light" src="src/assets/icons/lucide/send-horizontal.svg" alt=""></span></div><div class="social-comments rf-comments">${comments}</div>${responsePanel}</article>`;
}

function renderPublicResponsePanel() {
    return `
        <section class="rf-public-response" aria-label="Ответить на публикацию">
            <small>Ваш ответ увидят все</small>
            <button data-public-response="never" type="button">Я никогда не был в Рейвенвуде.</button>
            <button data-public-response="stolen" type="button">Фото сделали без моего разрешения. Я ничего им не отправлял.</button>
            <button data-public-response="remove" type="button">Уберите моё лицо и профиль из публикации.</button>
            <button data-public-response="silent" class="quiet" type="button">Ничего не писать</button>
        </section>
    `;
}

function submitPublicResponse(response) {
    const allowed = new Set(['never', 'stolen', 'remove', 'silent']);
    if (!allowed.has(response) || stateManager.hasFlag('ep2PublicResponseResolved')) return;
    stateManager.setFlag(`ep2PublicResponse_${response}`, true);
    stateManager.setFlag('ep2PublicResponseResolved', true);
}

function getPlayerPublicComment() {
    if (stateManager.hasFlag('ep2PublicResponse_never')) return 'Я никогда не был в Рейвенвуде.';
    if (stateManager.hasFlag('ep2PublicResponse_stolen')) return 'Фото сделали без моего разрешения. Я ничего вам не отправлял.';
    if (stateManager.hasFlag('ep2PublicResponse_remove')) return 'Уберите моё лицо и профиль из публикации.';
    return '';
}

function getUnreadRequestCount() {
    let count = 0;
    if (!stateManager.hasFlag('rfRequestRead_nate')) count += 1;
    if (!stateManager.hasFlag('rfRequestRead_noah')) count += 1;
    if (stateManager.hasFlag('juneRequestLive') && !stateManager.hasFlag('rfRequestRead_june')) count += 1;
    return count;
}

function renderRequestInbox() {
    const ids = ['nate', 'noah'];
    if (stateManager.hasFlag('juneRequestLive')) ids.unshift('june');
    return `
        <section class="rf-request-inbox">
            <header><span>Запросы на переписку</span><small>Отправители не увидят прочтение, пока вы не ответите</small></header>
            <div class="rf-request-list">
                ${ids.map(id => {
                    const request = REQUESTS[id];
                    const person = PEOPLE[request.person];
                    const unread = !stateManager.hasFlag(`rfRequestRead_${id}`);
                    return `<button class="rf-request-row ${unread ? 'unread' : ''}" data-request="${id}" type="button"><span class="rf-request-avatar">${avatarMarkup(person.avatar, person.name)}</span><span><strong>${escapeHtml(person.name)}</strong><small>${escapeHtml(person.handle)}</small><p>${escapeHtml(request.preview)}</p></span>${unread ? '<i></i>' : ''}</button>`;
                }).join('')}
            </div>
        </section>
    `;
}

function openRequest(wrapper, id, onClose) {
    const request = REQUESTS[id];
    if (!request) return;
    const person = PEOPLE[request.person];
    stateManager.setFlag(`rfRequestRead_${id}`, true);

    const render = () => {
        wrapper.innerHTML = `
            <section class="rf-request-thread">
                <header>
                    <button id="rf-request-back" class="rf-round" type="button"><img class="ui-lucide is-light" src="src/assets/icons/lucide/chevron-left.svg" alt=""></button>
                    <span class="rf-request-avatar">${avatarMarkup(person.avatar, person.name)}</span>
                    <div><strong>${escapeHtml(person.name)}</strong><small>${escapeHtml(person.handle)} · запрос</small></div>
                </header>
                <main>
                    <div class="rf-request-notice">Этот человек не подписан на вас</div>
                    ${request.messages.map(message => `<div class="rf-direct incoming">${escapeHtml(message)}</div>`).join('')}
                    ${renderRequestReply(id)}
                    ${id === 'june' ? renderJuneArchive() : ''}
                </main>
                ${renderRequestActions(id)}
            </section>
        `;
        wrapper.querySelector('#rf-request-back')?.addEventListener('click', onClose);
        wrapper.querySelectorAll('[data-request-action]').forEach(button => button.addEventListener('click', () => {
            handleRequestAction(id, button.dataset.requestAction);
            render();
        }));
        wrapper.querySelector('#rf-open-june-archive')?.addEventListener('click', () => {
            stateManager.setFlag('northLotDebunked', true);
            stateManager.setFlag('truthNorthLotPostRemoved', true);
            render();
        });
    };
    render();
}

function renderRequestActions(id) {
    if (hasRequestResponse(id)) return '<footer><span>Запрос обработан</span></footer>';
    if (id === 'nate') {
        return `<footer class="rf-request-actions"><button data-request-action="decline" type="button">Нет, спасибо</button><button data-request-action="text" type="button">Оставьте вопросы здесь</button><button data-request-action="delete" class="quiet" type="button">Удалить запрос</button></footer>`;
    }
    if (id === 'noah') {
        return `<footer class="rf-request-actions"><button data-request-action="not_coming" type="button">Я и не собирался</button><button data-request-action="welcome" type="button">Очень гостеприимный город</button><button data-request-action="leave" type="button">Отвали</button><button data-request-action="block" class="quiet" type="button">Заблокировать</button></footer>`;
    }
    return `<footer class="rf-request-actions"><button data-request-action="thanks" type="button">Спасибо. Напиши, если найдёшь</button><button data-request-action="why" type="button">Почему ты решила мне помочь?</button><button data-request-action="okay" type="button">Ладно</button></footer>`;
}

function handleRequestAction(id, action) {
    stateManager.setFlag(`rfRequest_${id}_${action}`, true);
    stateManager.setFlag(`rfRequestResponded_${id}`, true);
    if (id === 'noah' && action === 'block') stateManager.setFlag('noahBlockedOnRavenFeed', true);
    if (id === 'nate' && action === 'delete') stateManager.setFlag('nateRequestDeleted', true);
}

function hasRequestResponse(id) {
    return stateManager.hasFlag(`rfRequestResponded_${id}`);
}

function renderRequestReply(id) {
    if (!hasRequestResponse(id)) return '';
    if (id === 'nate') {
        if (stateManager.hasFlag('rfRequest_nate_delete')) return '<div class="rf-direct system">Запрос удалён</div>';
        if (stateManager.hasFlag('rfRequest_nate_text')) return '<div class="rf-direct outgoing">Оставьте вопросы здесь.</div><div class="rf-direct incoming">Хорошо. Сначала соберу всё в одно сообщение и пришлю без публикации.</div>';
        return '<div class="rf-direct outgoing">Нет, спасибо.</div><div class="rf-direct incoming">Понимаю. Если передумаете, можете написать сами.</div>';
    }
    if (id === 'noah') {
        if (stateManager.hasFlag('rfRequest_noah_block')) return '<div class="rf-direct system">Пользователь заблокирован</div>';
        if (stateManager.hasFlag('rfRequest_noah_welcome')) return '<div class="rf-direct outgoing">Очень гостеприимный город.</div><div class="rf-direct incoming">Сейчас не до шуток.</div>';
        if (stateManager.hasFlag('rfRequest_noah_leave')) return '<div class="rf-direct outgoing">Отвали.</div><div class="rf-direct incoming">как скажешь</div>';
        return '<div class="rf-direct outgoing">Я и не собирался.</div><div class="rf-direct incoming">и правильно</div>';
    }
    if (stateManager.hasFlag('rfRequest_june_why')) return '<div class="rf-direct outgoing">Почему ты решила мне помочь?</div><div class="rf-direct incoming">Потому что я была там и знаю, что на фото не ты. А они уже разнесли это по городу.</div>';
    if (stateManager.hasFlag('rfRequest_june_thanks')) return '<div class="rf-direct outgoing">Спасибо. Напиши, если найдёшь.</div><div class="rf-direct incoming">нашла. сейчас скину</div>';
    return '<div class="rf-direct outgoing">Ладно.</div><div class="rf-direct incoming">секунду. кажется, нашла</div>';
}

function renderJuneArchive() {
    if (!hasRequestResponse('june')) return '';
    const opened = stateManager.hasFlag('northLotDebunked');
    return `
        <article class="rf-archive-card ${opened ? 'verified' : ''}">
            <img src="${A}/post-north-lot-archive.webp" alt="Старая фотография после школьного матча на North Lot">
            <div><small>Ravenwood High Athletics · 2 года назад</small><strong>Матч закончен. Спасибо всем, кто пришёл несмотря на дождь.</strong><p>На полном кадре видны игроки, сезонный баннер и человек у края парковки.</p></div>
            ${opened ? '<span>Фотография подтверждена как старая</span>' : '<button id="rf-open-june-archive" type="button">Открыть найденный пост</button>'}
        </article>
    `;
}

function renderPeople() {
    const main = ['olivia', 'mia', 'derek', 'brooke', 'mason', 'tyler'].map(id => ({ id, ...getCharacter(id) }));
    const locals = Object.entries(PEOPLE).map(([id, person]) => ({ id, ...person }));
    return `<section class="rf-people"><h2>Люди Рейвенвуда</h2><p>Знакомые лица и те, кого вы ещё не знаете.</p><div class="rf-people-grid">${[...main, ...locals].map(person => `<button data-profile="${person.id}" type="button"><span>${avatarMarkup(person.avatarImage || person.avatar, person.name)}</span><strong>${escapeHtml(person.name)}</strong><small>${escapeHtml(person.handle || '')}</small></button>`).join('')}</div></section>`;
}

function openProfile(wrapper, id, onClose) {
    if (!id) return; const char = getCharacter(id); const local = PEOPLE[id]; if (!char && !local) return; const person = char || local; const gallery = char?.gallery?.length ? char.gallery : [char?.avatarImage || local?.avatar].filter(Boolean);
    wrapper.innerHTML = `<section class="rf-profile"><header><button id="rf-profile-back" class="rf-round" type="button"><img class="ui-lucide is-light" src="src/assets/icons/lucide/chevron-left.svg" alt=""></button><strong>${escapeHtml(person.handle || person.name)}</strong></header><div class="rf-profile-hero"><img src="${char?.socialPhoto || gallery[0]}" alt=""></div><div class="rf-profile-card"><div class="rf-profile-avatar">${avatarMarkup(person.avatarImage || person.avatar, person.name)}</div><h1>${escapeHtml(person.name)}</h1><span>${escapeHtml(person.handle || '')}</span><p>${escapeHtml(person.bio || local.bio)}</p><div><b>${gallery.length}</b> публикации <b>${char ? 128 + id.length * 17 : 64 + id.length * 9}</b> подписчиков</div></div><div class="rf-profile-grid">${gallery.map(src => `<button type="button"><img src="${src}" alt=""></button>`).join('')}</div></section>`;
    wrapper.querySelector('#rf-profile-back')?.addEventListener('click', onClose); stateManager.setFlag(`ravenFeedProfile_${id}`, true);
}

function getSocialPerson(id) { const char = getCharacter(id); if (char) return { name: char.name, handle: char.handle, avatar: char.avatarImage }; if (id === 'harper') return { name: 'Харпер Вэнс', handle: '@harper.v' }; if (id === 'player') return { name: stateManager.getPlayerName(), handle: `@${playerHandle()}` }; return PEOPLE[id] || { name: id, handle: `@${id}` }; }
function playerHandle() { const base = stateManager.getPlayerName().toLowerCase().replace(/[^a-zа-яё0-9]+/giu, '.').replace(/^\.+|\.+$/g, ''); return base || 'new.user'; }
function avatarMarkup(src, name) { return src ? `<img src="${src}" alt="" onerror="this.hidden=true;this.parentElement.textContent='${escapeHtml(name.charAt(0))}'">` : escapeHtml(name.charAt(0)); }
function escapeHtml(value) { const div = document.createElement('div'); div.textContent = String(value || ''); return div.innerHTML; }
