export function renderLizaPhone({ onBack }) {
    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement('div');
    wrapper.className = 'invest-app liza-phone-app';

    wrapper.innerHTML = `
        <div class="invest-header">
            <button class="messenger-back-btn" id="liza-phone-back">←</button>
            <span>Второй телефон</span>
            <div style="width:36px;"></div>
        </div>
        <div class="liza-phone-shell">
            <div class="liza-lock">
                <div class="liza-crack"></div>
                <div class="liza-lock-title">Устройство недоступно</div>
                <p>Эта механика будет переписана позже под телефон Harper.</p>
                <div class="liza-error">нет сигнала</div>
            </div>
        </div>
    `;

    wrapper.querySelector('#liza-phone-back').addEventListener('click', onBack);
    fragment.appendChild(wrapper);
    return fragment;
}
