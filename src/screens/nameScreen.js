// ============================================
// Name Input Screen
// ============================================

export function renderNameScreen(onSubmit) {
    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement('div');
    wrapper.className = 'name-screen-content';

    wrapper.innerHTML = `
        <div class="name-screen-icon" aria-hidden="true">
            <img class="ui-lucide is-light" src="src/assets/icons/lucide/user-round.svg" alt="" />
        </div>
        <div class="name-screen-title">Кто ты?</div>
        <div class="name-screen-subtitle">
            Телефон требует имя перед тем,<br>
            как открыть входящие сообщения.
        </div>
        <div class="name-input-wrapper">
            <input 
                type="text" 
                class="name-input" 
                id="player-name-input"
                placeholder="Введи своё имя..."
                maxlength="20"
                autocomplete="off"
                spellcheck="false"
            >
        </div>
        <button class="name-submit-btn" id="name-submit-btn" disabled>
            Продолжить
        </button>
    `;

    const input = wrapper.querySelector('#player-name-input');
    const btn = wrapper.querySelector('#name-submit-btn');

    input.addEventListener('input', () => {
        const val = input.value.trim();
        btn.disabled = val.length < 2;
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && input.value.trim().length >= 2) {
            submit();
        }
    });

    btn.addEventListener('click', submit);

    function submit() {
        const name = input.value.trim();
        if (name.length >= 2) {
            btn.textContent = '...';
            btn.disabled = true;
            wrapper.style.transition = 'opacity 0.5s, transform 0.5s';
            wrapper.style.opacity = '0';
            wrapper.style.transform = 'translateY(-20px)';
            setTimeout(() => onSubmit(name), 500);
        }
    }

    // Auto-focus after a brief delay
    setTimeout(() => input.focus(), 600);

    fragment.appendChild(wrapper);
    return fragment;
}
