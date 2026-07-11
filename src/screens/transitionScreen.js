// ============================================
// Transition Screen
// ============================================

export function renderTransitionScreen({
    title = '02:14',
    lines = ['Ночь прошла.', 'Следующее утро.'],
    duration = 5200,
    onComplete
} = {}) {
    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement('div');
    wrapper.className = 'story-transition-screen';

    wrapper.innerHTML = `
        <div class="story-transition-noise" aria-hidden="true"></div>
        <div class="story-transition-content">
            <div class="story-transition-time">${title}</div>
            ${lines.map(line => `<div class="story-transition-line">${line}</div>`).join('')}
        </div>
    `;

    requestAnimationFrame(() => wrapper.classList.add('visible'));

    setTimeout(() => {
        wrapper.classList.add('morning');
    }, Math.max(1800, duration - 2300));

    setTimeout(() => {
        if (onComplete) onComplete();
    }, duration);

    fragment.appendChild(wrapper);
    return fragment;
}
