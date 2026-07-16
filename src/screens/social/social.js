import { stateManager } from '../../engine/stateManager.js';

const POSTS = [
    {
        author: 'Mill Creek Daily',
        handle: '@millcreekdaily',
        time: '08:41',
        avatar: 'src/assets/avatars/avatar_harper_cracked_live.png',
        image: 'src/assets/newspaper_liza_forest.png',
        likes: 214,
        text: 'Полиция подтвердила смерть 18-летней Харпер Вэнс. Детали не раскрываются. Следствие просит жителей не распространять непроверенные слухи.',
        comments: [
            { author: 'riley.m', text: 'это та девушка с видео у моста?' },
            { author: 'northlotcam', text: 'комментарии снова чистят, смешно' },
            { author: 'sara.w', text: 'почему никто не пишет где её нашли?' }
        ],
        note: 'frag_bridge_comment'
    },
    {
        author: 'Bean House',
        handle: '@beanhouse',
        time: 'вчера',
        avatar: 'src/assets/avatars/avatar_mia_live.png',
        likes: 87,
        text: 'Сегодня закрываемся раньше. Берегите своих людей, даже если они делают вид, что им это не нужно.',
        comments: [
            { author: 'mason.c', text: 'странный день для рекламных мудростей' },
            { author: 'olivia.g', text: 'Мейсон, не здесь' }
        ]
    },
    {
        author: 'North Lot Watch',
        handle: '@northlotwatch',
        time: '02:13',
        image: 'src/assets/blurred_park_photo.jpg',
        likes: 43,
        text: 'Камера опять лагает по времени. Если вчера кому-то нужен архив с парковки, пишите владельцу, не мне.',
        comments: [
            { author: 'tyler.r', text: 'на сорок минут спешит, если кому-то вдруг важно' },
            { author: 'user451', text: 'после новости про Харпер это звучит крипово' }
        ],
        note: 'frag_north_lot'
    }
];

const VIRAL_POST = {
    author: 'Mill Creek Confessions',
    handle: '@creekconfess',
    time: 'сейчас',
    avatar: 'src/assets/avatars/avatar_unknown_harper_new.png',
    likes: 391,
    text: 'Телефон погибшей Харпер Вэнс добавил неизвестного человека в закрытый чат её друзей. Кто такой {player}, и почему номер Харпер выбрал именно его?',
    comments: [
        { author: 'kayla.17', text: 'полиция вообще знает?' },
        { author: 'northkid', text: 'если она выбрала его, значит знала' },
        { author: 'mason.c', text: 'удалите это' },
        { author: 'brooke.h', text: 'слишком поздно' }
    ],
    note: 'frag_viral_post',
    flag: 'viralPostOpened'
};

export function renderSocial({ onBack }) {
    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement('div');
    wrapper.className = 'invest-app social-app';

    wrapper.innerHTML = `
        <div class="invest-header social-topbar">
            <button class="messenger-back-btn" id="social-back" type="button" aria-label="Назад"><img class="ui-lucide is-light" src="src/assets/icons/lucide/chevron-left.svg" alt="" /></button>
            <span class="social-logo">Лента</span>
            <button class="social-top-icon" type="button" aria-label="Обновить">
                <img class="ui-lucide is-light" src="src/assets/icons/lucide/refresh-cw.svg" alt="" />
            </button>
        </div>
        <div class="social-feed">
            ${getVisiblePosts().length ? getVisiblePosts().map((post, index) => renderPost(post, index)).join('') : '<div class="social-empty">Лента пуста.</div>'}
        </div>
    `;

    wrapper.querySelector('#social-back').addEventListener('click', onBack);
    wrapper.querySelectorAll('[data-open-post]').forEach(postEl => {
        postEl.addEventListener('click', (event) => {
            if (event.target.closest('.social-like-btn')) return;
            const post = getVisiblePosts()[Number(postEl.dataset.openPost)];
            savePostClue(post);
        });
    });
    wrapper.querySelectorAll('.social-like-btn').forEach(button => {
        button.addEventListener('click', () => {
            const liked = button.classList.toggle('liked');
            const countEl = wrapper.querySelector(`[data-like-count="${button.dataset.likeTarget}"]`);
            const base = Number(button.dataset.baseLikes);
            button.setAttribute('aria-pressed', String(liked));
            if (countEl) countEl.textContent = `${base + (liked ? 1 : 0)} отметок`;
        });
    });

    fragment.appendChild(wrapper);
    return fragment;
}

function getVisiblePosts() {
    const posts = [...POSTS];
    if (stateManager.hasFlag('act1ViralPost')) {
        posts.unshift(VIRAL_POST);
    }
    return posts;
}

function renderPost(post, index) {
    const key = String(index);
    const playerName = stateManager.getPlayerName();
    const text = post.text.replace(/\{player\}/g, playerName);
    const avatar = post.avatar
        ? `<img src="${post.avatar}" alt="">`
        : post.author.charAt(0);
    const comments = (post.comments || []).map(comment => `
        <div class="social-comment"><strong>${comment.author}</strong> ${comment.text}</div>
    `).join('');

    return `
        <article class="social-post ${key === 'viral' ? 'viral-post' : ''}" data-open-post="${key}">
            <div class="social-post-head">
                <div class="social-avatar">${avatar}</div>
                <div>
                    <strong>${post.author}</strong>
                    <small>${post.handle} · ${post.time}</small>
                </div>
            </div>
            ${post.image ? `<img class="social-image" src="${post.image}" alt="">` : ''}
            <div class="social-actions">
                <button class="social-like-btn" type="button" data-like-target="${key}" data-base-likes="${post.likes}" aria-label="Нравится" aria-pressed="false"><img class="ui-lucide is-light" src="src/assets/icons/lucide/heart.svg" alt="" /></button>
                <span aria-label="Комментарии"><img class="ui-lucide is-light" src="src/assets/icons/lucide/message-circle.svg" alt="" /></span>
                <span aria-label="Поделиться"><img class="ui-lucide is-light" src="src/assets/icons/lucide/send-horizontal.svg" alt="" /></span>
            </div>
            <div class="social-like-count" data-like-count="${key}">${post.likes} отметок</div>
            <p>${text}</p>
            <div class="social-comments">${comments}</div>
        </article>
    `;
}

function savePostClue(post) {
    if (!post) return;
    if (post.flag) stateManager.setFlag(post.flag, true);
    if (post.note) stateManager.unlock('notes', post.note);
}
