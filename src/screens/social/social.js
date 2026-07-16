import { stateManager } from '../../engine/stateManager.js';
import { getCharacter } from '../../data/characters.js';

const A = 'src/assets/ravenfeed/generated';

const PEOPLE = {
    nadia: { name: 'Надя Форд', handle: '@nadia.f', avatar: `${A}/resident-nadia.webp`, bio: 'книги, плёнка и кофе, который я опять забыла допить' },
    eli: { name: 'Эли Браун', handle: '@eli.brown', avatar: `${A}/resident-eli.webp`, bio: 'чиню велосипеды и иногда собственную жизнь' },
    june: { name: 'Джун Пак', handle: '@junep', avatar: `${A}/resident-june.webp`, bio: 'переехала ненадолго. живу здесь третий год' },
    noah: { name: 'Ноа Бриггс', handle: '@noah.north', avatar: `${A}/resident-noah.webp`, bio: 'фото с улиц Рейвенвуда. почти всегда дождь' },
    leya: { name: 'Лея Морган', handle: '@leya.m', avatar: `${A}/resident-leya.webp`, bio: 'если я не отвечаю, я на смене или сплю' },
    sam: { name: 'Сэм Ортега', handle: '@sam.o', avatar: `${A}/resident-sam.webp`, bio: 'N7, футбол и слишком много острого соуса' }
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

export function renderSocial({ onBack }) {
    stateManager.setFlag('ravenFeedOpened', true);
    const wrapper = document.createElement('div');
    wrapper.className = 'invest-app social-app ravenfeed-app';
    let tab = 'feed';
    const draw = () => {
        const posts = getVisiblePosts();
        wrapper.innerHTML = `<header class="rf-header"><button class="rf-round" id="social-back" type="button" aria-label="Назад"><img class="ui-lucide is-light" src="src/assets/icons/lucide/chevron-left.svg" alt="" /></button><div class="rf-brand"><strong>RavenFeed</strong><span>Рейвенвуд рядом</span></div><button class="rf-round" id="rf-search" type="button" aria-label="Поиск"><img class="ui-lucide is-light" src="src/assets/icons/lucide/search.svg" alt="" /></button></header><nav class="rf-tabs" aria-label="Разделы"><button data-tab="feed" class="${tab === 'feed' ? 'active' : ''}">Для вас</button><button data-tab="city" class="${tab === 'city' ? 'active' : ''}">Город</button><button data-tab="people" class="${tab === 'people' ? 'active' : ''}">Люди</button></nav><main class="social-feed rf-feed">${tab === 'people' ? renderPeople() : posts.filter(post => tab !== 'city' || !post.profile).map(renderPost).join('')}</main>`;
        bind();
    };
    const bind = () => {
        wrapper.querySelector('#social-back')?.addEventListener('click', onBack);
        wrapper.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', () => { tab = button.dataset.tab; draw(); }));
        wrapper.querySelectorAll('[data-profile]').forEach(button => button.addEventListener('click', event => { event.stopPropagation(); openProfile(wrapper, button.dataset.profile, draw); }));
        wrapper.querySelectorAll('[data-open-post]').forEach(article => article.addEventListener('click', event => { if (event.target.closest('button')) return; const post = getVisiblePosts().find(item => item.id === article.dataset.openPost); if (post?.flag) stateManager.setFlag(post.flag, true); article.classList.add('opened'); }));
        wrapper.querySelectorAll('.rf-like').forEach(button => button.addEventListener('click', () => { const liked = button.classList.toggle('liked'); const base = Number(button.dataset.likes || 0); button.querySelector('span').textContent = String(base + (liked ? 1 : 0)); }));
        wrapper.querySelector('#rf-search')?.addEventListener('click', () => { tab = 'people'; draw(); setTimeout(() => wrapper.querySelector('.rf-people-grid')?.classList.add('pulse'), 20); });
    };
    const onStoryFlag = ({ flag }) => {
        if (!wrapper.isConnected) {
            stateManager.off('flag', onStoryFlag);
            return;
        }
        if (flag === 'brookeSearchPostLive' || flag === 'act1ViralPost') draw();
    };
    stateManager.on('flag', onStoryFlag);
    draw();
    return wrapper;
}

function getVisiblePosts() {
    const posts = [...BASE_POSTS];
    if (stateManager.hasFlag('brookeSearchPostLive')) posts.unshift(SEARCH_POST);
    if (stateManager.hasFlag('act1ViralPost')) posts.unshift(buildFramingPost());
    return posts;
}

function buildFramingPost() {
    const playerName = stateManager.getPlayerName();
    const flags = stateManager.get('flags') || {};
    const playerPhoto = flags.playerHackPhoto || flags.playerFrontCameraPhoto || '';
    const miaComment = stateManager.hasFlag('miaKnowsAboutHack')
        ? 'Фото украли с его телефона. Не разносите это дальше.'
        : 'Откуда у вас вообще это фото?';
    return { id: 'player-framed', author: 'Ravenwood Truth', handle: '@ravenwood.truth', avatar: `${A}/page-truth.webp`, image: playerPhoto, playerFallback: true, likes: 487, age: 'сейчас', danger: true, flag: 'viralPostOpened', text: `${playerName} говорит, что никогда не видел Харпер Вэнс. Тогда почему с её телефона отправили именно его номер? Сегодня нам прислали снимок с его устройства и список недавних контактов. Случайность или Рейвенвуд должен был узнать о нём раньше?`, comments: [['nadia', 'вы серьёзно выложили лицо человека без доказательств?'], ['sam', 'полиция вообще это видела?'], ['olivia', 'Удалите публикацию. Вы не знаете, что произошло.'], ['mia', miaComment], ['june', 'уже разлетелось по всему городу'], ['derek', 'Я не давал вам его номер.'], ['brooke', `${playerName}, ответь. Откуда у них твоё фото и кто рассказал им про номер?`]] };
}

function renderPost(post) {
    const comments = (post.comments || []).map(([id, text]) => { const person = getSocialPerson(id); return `<div class="rf-comment"><button data-profile="${id}" type="button">${escapeHtml(person.handle || person.name)}</button><span>${escapeHtml(text)}</span></div>`; }).join('');
    const media = post.image || post.playerFallback ? `<div class="rf-media ${post.playerFallback ? 'rf-player-media' : ''}">${post.image ? `<img src="${post.image}" alt="" onerror="this.hidden=true;this.parentElement.classList.add('missing')">` : ''}<div class="rf-photo-fallback"><img src="src/assets/icons/lucide/user-round.svg" alt=""><span>playerHackPhoto.jpg</span></div></div>` : '';
    return `<article class="social-post rf-post ${post.danger ? 'is-danger' : ''}" data-open-post="${post.id}"><div class="social-post-head rf-post-head"><button class="social-avatar" data-profile="${post.profile || ''}" type="button">${avatarMarkup(post.avatar, post.author)}</button><div><strong>${escapeHtml(post.author)}</strong><small>${escapeHtml(post.handle)} · ${escapeHtml(post.age)}</small></div><button class="rf-more" type="button" aria-label="Ещё"><img class="ui-lucide is-light" src="src/assets/icons/lucide/ellipsis.svg" alt=""></button></div><p class="rf-copy">${escapeHtml(post.text)}</p>${media}<div class="rf-actions"><button class="rf-like" data-likes="${post.likes}" type="button"><img class="ui-lucide is-light" src="src/assets/icons/lucide/heart.svg" alt=""><span>${post.likes}</span></button><span><img class="ui-lucide is-light" src="src/assets/icons/lucide/message-circle.svg" alt="">${post.comments?.length || 0}</span><span><img class="ui-lucide is-light" src="src/assets/icons/lucide/send-horizontal.svg" alt=""></span></div><div class="social-comments rf-comments">${comments}</div></article>`;
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

function getSocialPerson(id) { const char = getCharacter(id); if (char) return { name: char.name, handle: char.handle, avatar: char.avatarImage }; if (id === 'harper') return { name: 'Харпер Вэнс', handle: '@harper.v' }; return PEOPLE[id] || { name: id, handle: `@${id}` }; }
function avatarMarkup(src, name) { return src ? `<img src="${src}" alt="" onerror="this.hidden=true;this.parentElement.textContent='${escapeHtml(name.charAt(0))}'">` : escapeHtml(name.charAt(0)); }
function escapeHtml(value) { const div = document.createElement('div'); div.textContent = String(value || ''); return div.innerHTML; }
