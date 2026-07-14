import { stateManager } from '../../engine/stateManager.js';
import { audioEngine } from '../../engine/audioEngine.js?v=123';

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

    wrapper.innerHTML = `
        <section class="incoming-call-panel">
            <div class="unknown-call-status">Входящий звонок</div>
            <div class="unknown-call-avatar">
                <span></span>
            </div>
            <h1>Номер не определён</h1>
            <p>Неизвестный абонент</p>
            <div class="incoming-call-actions">
                <button class="call-action decline" id="call-decline" type="button">
                    <span>✕</span>
                    <b>Сбросить</b>
                </button>
                <button class="call-action accept" id="call-accept" type="button">
                    <span>✓</span>
                    <b>Принять</b>
                </button>
                <button class="call-action wait" id="call-wait" type="button">
                    <span>…</span>
                    <b>Подождать и ответить</b>
                </button>
            </div>
        </section>
    `;

    wrapper.querySelector('#call-accept')?.addEventListener('click', () => {
        audioEngine.stopIncomingCall();
        stateManager.setFlag('unknownCallAnswered', true);
        stateManager.setFlag('unknownCallVoicemailReceived', false);
        renderAcceptedCall(wrapper, onDone);
    });

    wrapper.querySelector('#call-decline')?.addEventListener('click', () => {
        audioEngine.stopIncomingCall();
        stateManager.setFlag('unknownCallAnswered', false);
        stateManager.setFlag('unknownCallVoicemailReceived', true);
        renderDeclinedCall(wrapper, onDone);
    });

    wrapper.querySelector('#call-wait')?.addEventListener('click', () => {
        audioEngine.stopIncomingCall();
        stateManager.setFlag('unknownCallAnsweredAfterWaiting', true);
        setTimeout(() => renderAcceptedCall(wrapper, onDone), 2200);
    });

    return wrapper;
}

function renderAcceptedCall(wrapper, onDone) {
    wrapper.innerHTML = `
        <section class="active-call-panel">
            <div class="active-call-top">
                <span>Номер не определён</span>
                <strong id="call-timer">00:00</strong>
            </div>
            <div class="unknown-call-avatar active">
                <span></span>
            </div>
            <button class="call-end-button" id="call-end-hidden" type="button" hidden>Завершить</button>
        </section>
    `;

    const timer = wrapper.querySelector('#call-timer');
    const startedAt = Date.now();
    const timerId = setInterval(() => {
        const seconds = Math.floor((Date.now() - startedAt) / 1000);
        timer.textContent = `00:${String(seconds).padStart(2, '0')}`;
    }, 300);

    audioEngine.playCallAmbience();
    setTimeout(() => {
        clearInterval(timerId);
        queueUnknownCallNote(CALL_NOTE_ACCEPTED);
        finishCall(wrapper, onDone);
    }, 8600);
}

function renderDeclinedCall(wrapper, onDone) {
    wrapper.innerHTML = `
        <section class="call-declined-panel">
            <div class="call-ended-mark">Звонок сброшен</div>
            <div class="voicemail-toast" id="voicemail-toast" hidden>
                <span class="voicemail-icon">●</span>
                <div>
                    <strong>Новое голосовое сообщение</strong>
                    <p>Неизвестный номер</p>
                </div>
            </div>
            <div class="voicemail-card" id="voicemail-card" hidden>
                <span>Неизвестный номер</span>
                <strong>Голосовое сообщение</strong>
                <button id="voicemail-play" type="button">
                    <i>▶</i>
                    <b>Прослушать</b>
                    <em>0:04</em>
                </button>
                <div class="voicemail-wave" aria-hidden="true">
                    <i></i><i></i><i></i><i></i><i></i><i></i><i></i>
                </div>
            </div>
        </section>
    `;

    setTimeout(() => {
        wrapper.querySelector('#voicemail-toast')?.removeAttribute('hidden');
    }, 2300);

    setTimeout(() => {
        wrapper.querySelector('#voicemail-card')?.removeAttribute('hidden');
    }, 3100);

    wrapper.querySelector('#voicemail-play')?.addEventListener('click', () => {
        const button = wrapper.querySelector('#voicemail-play');
        if (button?.dataset.playing === 'true') return;
        button.dataset.playing = 'true';
        button.classList.add('playing');
        button.querySelector('b').textContent = 'Воспроизведение';
        audioEngine.playVoicemailAmbience();

        setTimeout(() => {
            queueUnknownCallNote(CALL_NOTE_DECLINED);
            finishCall(wrapper, onDone);
        }, 4300);
    });
}

function playTranscript(wrapper, lines, onComplete) {
    const host = wrapper.querySelector('#call-transcript');
    let elapsed = 0;

    lines.forEach(line => {
        elapsed += line.delay;
        setTimeout(() => {
            const item = document.createElement('div');
            item.className = `call-line ${line.className || ''}`;
            item.textContent = line.text;
            host.appendChild(item);
            host.scrollTop = host.scrollHeight;
        }, elapsed);
    });

    setTimeout(onComplete, elapsed + 700);
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
    stateManager.setFlag('unknownCallCompleted', true);
    stateManager.setFlag('anonymousCallReceived', true);
    stateManager.setFlag('unknownOfflineAfterCall', true);
    stateManager.setCharacterOnline('unknown', false);

    wrapper.innerHTML = `
        <section class="call-declined-panel">
            <div class="call-ended-mark">Запись сохранена: call_unknown_01.m4a</div>
            <div class="voicemail-card">
                <strong>Что сделать с записью?</strong>
                <button id="call-send-police" type="button"><b>Отправить полиции</b></button>
                <button id="call-write-unknown" type="button"><b>Написать Неизвестному</b></button>
                <button id="call-save-only" type="button"><b>Пока только сохранить</b></button>
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
}
