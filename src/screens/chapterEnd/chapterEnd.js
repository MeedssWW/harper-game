import { stateManager } from '../../engine/stateManager.js';

export function renderChapterEnd({ onDone } = {}) {
    const wrapper = document.createElement('div');
    wrapper.className = 'chapter-end-screen';

    stateManager.setFlag('chapter1Completed', true);
    stateManager.setFlag('chapter2Unlocked', true);

    wrapper.innerHTML = `
        <section class="chapter-end-panel">
            <div class="chapter-end-title">ЭПИЗОД 1 ЗАВЕРШЁН</div>
            <div class="chapter-end-divider"></div>
            <p>ЭПИЗОД 2</p>
            <h1>ЧУЖОЕ ЛИЦО</h1>
            <button id="chapter-end-continue" type="button">Продолжить</button>
        </section>
    `;

    wrapper.querySelector('#chapter-end-continue')?.addEventListener('click', () => {
        if (onDone) onDone();
    });

    return wrapper;
}
