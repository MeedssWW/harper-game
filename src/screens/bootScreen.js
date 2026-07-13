export function renderBootScreen({ onBegin, onComplete }) {
    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement('div');
    wrapper.className = 'harper-boot';
    wrapper.innerHTML = `
        <div class="harper-boot-noise" aria-hidden="true"></div>
        <div class="harper-boot-signal" aria-hidden="true">
            <i></i><i></i><i></i>
        </div>
        <div class="harper-boot-copy">
            <span class="harper-boot-kicker">RAVENWOOD / SECURE LINE</span>
            <h1>HARPER</h1>
            <p>Некоторые сообщения находят тебя сами.</p>
        </div>
        <button class="harper-boot-start" type="button">
            <span>КОСНУТЬСЯ, ЧТОБЫ НАЧАТЬ</span>
            <small>используйте наушники</small>
        </button>
        <div class="harper-boot-progress" aria-hidden="true"><span></span></div>
        <div class="harper-boot-code">RVN // 04:16 // LINK STANDBY</div>
    `;

    const startButton = wrapper.querySelector('.harper-boot-start');
    let started = false;
    startButton.addEventListener('click', () => {
        if (started) return;
        started = true;
        wrapper.classList.add('is-loading');
        onBegin?.();
        window.setTimeout(() => {
            wrapper.classList.add('is-complete');
            window.setTimeout(() => onComplete?.(), 620);
        }, 4800);
    });

    fragment.appendChild(wrapper);
    return fragment;
}
