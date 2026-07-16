import { stateManager } from '../../engine/stateManager.js';
import { audioEngine } from '../../engine/audioEngine.js?v=123';

const LUCIDE_ICON_ROOT = 'src/assets/icons/lucide';

function icon(name, className = '') {
    return `<img class="call-lucide-icon ${className}" src="${LUCIDE_ICON_ROOT}/${name}.svg" alt="" aria-hidden="true" />`;
}

const CALL_NOTE_ACCEPTED = `22:03 — Неизвестный звонок

Мне звонили с неизвестного номера.

В трубке почти не было звука.
Только дыхание и шум дороги на фоне.

Неизвестно, связано ли это с файлом или попыткой взлома.`;

const CALL_NOTE_DECLINED = `22:03 — Неизвестный звонок

Мне звонили с неизвестного номера.

Я не ответил, но осталась короткая голосовая запись.

На ней слышен шум дороги, дыхание и звук закрывающейся двери.

Неизвестно, связано ли это с файлом или попыткой взлома.`;

export function renderUnknownCall({ onDone } = {}) {
    const wrapper = document.createElement('div');
    wrapper.className = 'unknown-call-screen';

    if (stateManager.hasFlag('unknownCallCompleted') || stateManager.hasFlag('unknownCallNoteWritten')) {
        audioEngine.stopIncomingCall();
        audioEngine.stopCallAmbience();
        setTimeout(() => {
            if (onDone) onDone();
        }, 50);
        return wrapper;
    }

    stateManager.setFlag('unknownCallReceived', true);
    stateManager.setCharacterOnline('unknown', false);
    wrapper._resumeMusic = audioEngine.pauseBGMForScene();
    audioEngine.playIncomingCall();
    startCallHaptics(wrapper);

    wrapper.innerHTML = `
        <section class="incoming-call-panel" role="dialog" aria-modal="true" aria-labelledby="unknown-call-title" aria-describedby="unknown-call-subtitle">
            <div class="call-ambient-glow" aria-hidden="true"><i></i><i></i><i></i></div>
            <div class="unknown-call-status" aria-live="polite">
                ${icon('phone-call')}
                <span>Входящий звонок</span>
            </div>
            <div class="unknown-call-avatar" aria-hidden="true">
                ${icon('user-round', 'call-avatar-icon')}
            </div>
            <div class="incoming-call-identity">
                <h1 id="unknown-call-title">Номер не определён</h1>
                <p id="unknown-call-subtitle">Скрытый номер · источник неизвестен</p>
            </div>
            <div class="incoming-call-actions">
                <button class="call-action decline" id="call-decline" type="button">
                    <span>${icon('phone-off')}</span>
                    <b>Сбросить</b>
                </button>
                <button class="call-action accept" id="call-accept" type="button">
                    <span>${icon('phone')}</span>
                    <b>Принять</b>
                </button>
            </div>
            <button class="call-wait-button" id="call-wait" type="button">
                ${icon('clock-3')}
                <span>Подождать несколько секунд</span>
            </button>
            <div class="call-swipe-caption" aria-hidden="true">Источник номера не определён</div>
        </section>
    `;

    wrapper.querySelector('#call-accept')?.addEventListener('click', () => {
        audioEngine.stopIncomingCall();
        stopCallHaptics(wrapper);
        stateManager.setFlag('unknownCallAnswered', true);
        stateManager.setFlag('unknownCallVoicemailReceived', false);
        wrapper._recordingDuration = '00:09';
        renderAcceptedCall(wrapper, onDone);
    });

    wrapper.querySelector('#call-decline')?.addEventListener('click', () => {
        audioEngine.stopIncomingCall();
        stopCallHaptics(wrapper);
        stateManager.setFlag('unknownCallAnswered', false);
        stateManager.setFlag('unknownCallVoicemailReceived', true);
        wrapper._recordingDuration = '00:04';
        renderDeclinedCall(wrapper, onDone);
    });

    wrapper.querySelector('#call-wait')?.addEventListener('click', () => {
        audioEngine.stopIncomingCall();
        stopCallHaptics(wrapper);
        stateManager.setFlag('unknownCallAnsweredAfterWaiting', true);
        wrapper._recordingDuration = '00:09';
        renderWaitingState(wrapper);
        scheduleCallTask(wrapper, () => renderAcceptedCall(wrapper, onDone), 2200);
    });

    requestAnimationFrame(() => wrapper.querySelector('#call-accept')?.focus({ preventScroll: true }));

    return wrapper;
}

function renderWaitingState(wrapper) {
    wrapper.innerHTML = `
        <section class="call-connecting-panel" role="status" aria-live="polite">
            <div class="call-ambient-glow" aria-hidden="true"><i></i><i></i><i></i></div>
            <div class="unknown-call-avatar connecting" aria-hidden="true">
                ${icon('phone-call', 'call-avatar-icon')}
            </div>
            <strong>Соединение…</strong>
            <span>Номер не определён</span>
            <div class="call-connecting-dots" aria-hidden="true"><i></i><i></i><i></i></div>
        </section>
    `;
}

function renderAcceptedCall(wrapper, onDone) {
    wrapper.innerHTML = `
        <section class="active-call-panel" role="region" aria-label="Активный вызов с неизвестного номера">
            <div class="call-ambient-glow active" aria-hidden="true"><i></i><i></i><i></i></div>
            <div class="active-call-top">
                <span>Номер не определён</span>
                <strong id="call-timer" aria-live="off">00:00</strong>
            </div>
            <div class="active-call-core">
                <div class="unknown-call-avatar active" aria-hidden="true">
                    ${icon('user-round', 'call-avatar-icon')}
                </div>
                <div class="active-call-state" aria-live="polite">
                    <strong>Вызов принят</strong>
                    <span>В линии слышен слабый шум</span>
                </div>
            </div>
            <div class="active-call-signal" aria-hidden="true">
                <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
            </div>
            <div class="active-call-indicators" role="group" aria-label="Динамик и линия активны">
                <span>${icon('volume-2')}<b>Динамик</b></span>
                <span>${icon('phone')}<b>Линия</b></span>
            </div>
            <div class="call-remote-end-hint">Не закрывайте экран до завершения вызова</div>
        </section>
    `;

    const timer = wrapper.querySelector('#call-timer');
    const startedAt = Date.now();
    const timerId = setInterval(() => {
        const seconds = Math.floor((Date.now() - startedAt) / 1000);
        timer.textContent = `00:${String(seconds).padStart(2, '0')}`;
    }, 300);

    audioEngine.playCallAmbience();
    scheduleCallTask(wrapper, () => {
        clearInterval(timerId);
        queueUnknownCallNote(CALL_NOTE_ACCEPTED);
        finishCall(wrapper, onDone);
    }, 9000);
}

function renderDeclinedCall(wrapper, onDone) {
    wrapper.innerHTML = `
        <section class="call-declined-panel" role="region" aria-label="Пропущенный вызов">
            <div class="call-ambient-glow" aria-hidden="true"><i></i><i></i><i></i></div>
            <div class="call-ended-mark">${icon('phone-off')} <span>Вызов отклонён</span></div>
            <div class="voicemail-toast" id="voicemail-toast" role="status" aria-live="polite" hidden>
                <span class="voicemail-icon">${icon('voicemail')}</span>
                <div>
                    <strong>Новое голосовое сообщение</strong>
                    <p>Неизвестный номер</p>
                </div>
            </div>
            <div class="voicemail-card" id="voicemail-card" hidden>
                <span>Неизвестный номер</span>
                <strong>Голосовое сообщение</strong>
                <button id="voicemail-play" type="button" aria-label="Прослушать голосовое сообщение, 4 секунды">
                    <i>${icon('play')}</i>
                    <b>Прослушать</b>
                    <em>0:04</em>
                </button>
                <div class="voicemail-wave" aria-hidden="true">
                    <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
                </div>
            </div>
        </section>
    `;

    scheduleCallTask(wrapper, () => {
        wrapper.querySelector('#voicemail-toast')?.removeAttribute('hidden');
    }, 700);

    scheduleCallTask(wrapper, () => {
        wrapper.querySelector('#voicemail-card')?.removeAttribute('hidden');
        requestAnimationFrame(() => wrapper.querySelector('#voicemail-play')?.focus({ preventScroll: true }));
    }, 1400);

    wrapper.querySelector('#voicemail-play')?.addEventListener('click', () => {
        const button = wrapper.querySelector('#voicemail-play');
        if (button?.dataset.playing === 'true') return;
        button.dataset.playing = 'true';
        button.classList.add('playing');
        button.querySelector('b').textContent = 'Воспроизведение';
        button.querySelector('i').innerHTML = icon('pause');
        button.setAttribute('aria-label', 'Воспроизводится голосовое сообщение');
        audioEngine.playVoicemailAmbience();

        scheduleCallTask(wrapper, () => {
            queueUnknownCallNote(CALL_NOTE_DECLINED);
            finishCall(wrapper, onDone);
        }, 4300);
    });
}

function queueUnknownCallNote(text) {
    if (stateManager.hasFlag('unknownCallNoteWritten') || stateManager.hasFlag('unknownCallNoteQueued')) return;

    stateManager.setFlag('pendingNote', {
        id: 'unknown_call_note',
        appendTo: 'harper_intro_summary',
        title: 'Харпер Вэнс',
        text,
        time: '22:03',
        type: 'story',
        autoTyping: true,
        completeFlag: 'unknownCallNoteWritten'
    });
    stateManager.setFlag('notesUnread', true);
    stateManager.setFlag('unknownCallNoteQueued', true);
}

function finishCall(wrapper, onDone) {
    audioEngine.stopIncomingCall();
    audioEngine.stopCallAmbience();
    stopCallHaptics(wrapper);
    clearCallTasks(wrapper);
    stateManager.setFlag('unknownCallCompleted', true);
    stateManager.setFlag('anonymousCallReceived', true);
    stateManager.setFlag('unknownOfflineAfterCall', true);
    stateManager.setCharacterOnline('unknown', false);

    wrapper.innerHTML = `
        <section class="call-summary-panel" role="dialog" aria-modal="true" aria-labelledby="call-summary-title">
            <div class="call-summary-artifact">
                <span class="call-summary-file-icon">${icon('file-volume')}</span>
                <div>
                    <small>Запись вызова</small>
                    <strong>call_unknown_01.m4a</strong>
                    <em>${wrapper._recordingDuration || '00:09'} · сохранено в материалах</em>
                </div>
            </div>
            <div class="call-disposition-card">
                <span class="call-disposition-kicker">Следующий шаг</span>
                <h1 id="call-summary-title">Что сделать с записью?</h1>
                <p>Выбор сохранится в материалах дела.</p>
                <div class="call-disposition-actions">
                    <button id="call-send-police" type="button">
                        <span>${icon('shield-check')}</span>
                        <b>Отправить полиции</b>
                        <small>Передать запись следователю</small>
                    </button>
                    <button id="call-write-unknown" type="button">
                        <span>${icon('message-circle')}</span>
                        <b>Написать Неизвестному</b>
                        <small>Сообщить о скрытом вызове</small>
                    </button>
                    <button id="call-save-only" type="button">
                        <span>${icon('archive')}</span>
                        <b>Только сохранить</b>
                        <small>Не отправлять запись сейчас</small>
                    </button>
                </div>
            </div>
        </section>`;

    const complete = flag => {
        stateManager.setFlag(flag, true);
        stateManager.setFlag('callDispositionChosen', true);
        audioEngine.resumeBGMForScene(!!wrapper?._resumeMusic);
        if (onDone) onDone();
    };
    wrapper.querySelector('#call-send-police')?.addEventListener('click', () => complete('callSentToPolice'));
    wrapper.querySelector('#call-write-unknown')?.addEventListener('click', () => complete('unknownContactedAfterCall'));
    wrapper.querySelector('#call-save-only')?.addEventListener('click', () => complete('callSavedOnly'));
    requestAnimationFrame(() => wrapper.querySelector('#call-send-police')?.focus({ preventScroll: true }));
}

function scheduleCallTask(wrapper, callback, delay) {
    wrapper._callTasks ||= new Set();
    const timer = window.setTimeout(() => {
        wrapper._callTasks?.delete(timer);
        if (wrapper.isConnected) callback();
    }, delay);
    wrapper._callTasks.add(timer);
    return timer;
}

function clearCallTasks(wrapper) {
    wrapper._callTasks?.forEach(timer => window.clearTimeout(timer));
    wrapper._callTasks?.clear();
}

function startCallHaptics(wrapper) {
    if (!('vibrate' in navigator) || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const pulse = () => navigator.vibrate?.([420, 280, 420, 1200]);
    pulse();
    wrapper._callHapticTimer = window.setInterval(pulse, 2500);
}

function stopCallHaptics(wrapper) {
    if (wrapper._callHapticTimer) {
        window.clearInterval(wrapper._callHapticTimer);
        wrapper._callHapticTimer = null;
    }
    navigator.vibrate?.(0);
}
