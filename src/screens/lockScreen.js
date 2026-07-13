// ============================================
// Lock Screen
// ============================================

export function renderLockScreen(onUnlock) {
    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement('div');
    wrapper.className = 'lock-screen-inner';
    wrapper.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;width:100%;position:relative;';

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    const dateStr = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;

    wrapper.innerHTML = `
        <div class="lock-time">${timeStr}</div>
        <div class="lock-date">${dateStr}</div>
        <div class="lock-notifications">
            <div class="lock-notif" style="animation-delay: 0.3s">
                <div class="lock-notif-header">
                    <span class="lock-notif-app"><img src="src/assets/icons/lucide/message-circle.svg" alt="" /> МЕССЕНДЖЕР</span>
                    <span class="lock-notif-time">сейчас</span>
                </div>
                <div class="lock-notif-title">Дерек Миллер</div>
                <div class="lock-notif-body">Ты не знаешь Харпер Вэнс?</div>
            </div>
            <div class="lock-notif" style="animation-delay: 0.6s">
                <div class="lock-notif-header">
                    <span class="lock-notif-app"><img src="src/assets/icons/lucide/message-circle.svg" alt="" /> МЕССЕНДЖЕР</span>
                    <span class="lock-notif-time">5 мин назад</span>
                </div>
                <div class="lock-notif-title">Дерек Миллер</div>
                <div class="lock-notif-body">Привет</div>
            </div>
        </div>
        <div class="lock-swipe-hint">Нажмите, чтобы разблокировать</div>
    `;

    wrapper.addEventListener('click', () => {
        wrapper.style.transition = 'opacity 0.4s, transform 0.4s';
        wrapper.style.opacity = '0';
        wrapper.style.transform = 'scale(1.05)';
        setTimeout(onUnlock, 350);
    });

    fragment.appendChild(wrapper);
    return fragment;
}
