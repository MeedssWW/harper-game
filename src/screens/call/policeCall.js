import { stateManager } from '../../engine/stateManager.js';
import { audioEngine } from '../../engine/audioEngine.js?v=124';

const ICONS = 'src/assets/icons/lucide';

function icon(name) {
    return `<img src="${ICONS}/${name}.svg" alt="" aria-hidden="true">`;
}

export function renderPoliceCall({ onDone } = {}) {
    const wrapper = document.createElement('div');
    wrapper.className = 'police-call-screen';

    wrapper._resumeMusic = audioEngine.pauseBGMForScene();
    audioEngine.playIncomingCall();
    renderIncoming(wrapper, onDone);
    return wrapper;
}

function renderIncoming(wrapper, onDone) {
    wrapper.innerHTML = `
        <section class="police-incoming" role="dialog" aria-modal="true" aria-labelledby="police-call-name">
            <div class="police-call-status">${icon('phone-call')}<span>Входящий вызов</span></div>
            <div class="police-call-badge">${icon('shield-check')}</div>
            <h1 id="police-call-name">Дэниел Рид</h1>
            <p>Полиция Рейвенвуда · подтверждённый номер</p>
            <div class="police-call-actions">
                <button id="police-decline" class="decline" type="button"><span>${icon('phone-off')}</span><b>Позже</b></button>
                <button id="police-accept" class="accept" type="button"><span>${icon('phone')}</span><b>Ответить</b></button>
            </div>
        </section>
    `;

    wrapper.querySelector('#police-decline')?.addEventListener('click', () => {
        audioEngine.stopIncomingCall();
        stateManager.setFlag('policeCallDeferred', true);
        finishCall(wrapper, onDone, false);
    });

    wrapper.querySelector('#police-accept')?.addEventListener('click', () => {
        audioEngine.stopIncomingCall();
        stateManager.setFlag('policeCallAnswered', true);
        renderConversation(wrapper, onDone);
    });
}

function renderConversation(wrapper, onDone) {
    wrapper.innerHTML = `
        <section class="police-active-call" role="dialog" aria-modal="true" aria-labelledby="police-active-name">
            <header>
                <div class="police-mini-badge">${icon('shield-check')}</div>
                <div><h1 id="police-active-name">Дэниел Рид</h1><p>Полиция Рейвенвуда</p></div>
                <strong id="police-call-timer">00:00</strong>
            </header>
            <main id="police-call-body" aria-live="polite"></main>
            <footer><span class="police-call-secure">${icon('lock-keyhole')} служебная линия</span></footer>
        </section>
    `;

    const startedAt = Date.now();
    wrapper._timer = setInterval(() => {
        const seconds = Math.floor((Date.now() - startedAt) / 1000);
        const minutes = Math.floor(seconds / 60);
        const rest = seconds % 60;
        const timer = wrapper.querySelector('#police-call-timer');
        if (timer) timer.textContent = `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
    }, 500);

    showCallStep(wrapper, {
        line: `Здравствуйте, ${stateManager.getPlayerName()}. Я задам несколько коротких вопросов. Если чего-то не помните, так и скажите.`,
        choices: [
            ['Хорошо.', 'neutral'],
            ['Я уже всё объяснял Дереку.', 'derek'],
            ['Давайте побыстрее.', 'impatient']
        ],
        onChoose: tone => {
            stateManager.setFlag(`policeCallTone_${tone}`, true);
            showIdentityQuestion(wrapper, onDone);
        }
    });
}

function showIdentityQuestion(wrapper, onDone) {
    const prefix = stateManager.hasFlag('policeCallTone_derek')
        ? 'Мне нужны ваши ответы, а не пересказ Дерека. '
        : '';

    showCallStep(wrapper, {
        line: `${prefix}Вы подтверждаете, что никогда не были в Рейвенвуде и раньше не общались с Харпер Вэнс?`,
        choices: [
            ['Никогда там не был и Харпер не знаю.', 'plain'],
            ['Да. Я уже не знаю, как ещё это повторить.', 'tired'],
            ['Если бы я её знал, я бы так и сказал.', 'defensive']
        ],
        onChoose: tone => {
            stateManager.setFlag('policeStatementConfirmed', true);
            stateManager.setFlag(`policeStatementTone_${tone}`, true);
            showPhotoQuestion(wrapper, onDone);
        }
    });
}

function showPhotoQuestion(wrapper, onDone) {
    showCallStep(wrapper, {
        line: 'Теперь про RavenFeed. Фотография в публикации была сделана вашим телефоном?',
        choices: [
            ['Да. Камера включилась во время взлома.', 'hack'],
            ['Да, но я никому её не отправлял.', 'photo_only'],
            ['Я пока не хочу рассказывать всё по телефону.', 'withheld']
        ],
        onChoose: answer => {
            stateManager.setFlag('policeKnowsPhotoWasStolen', answer !== 'withheld');
            stateManager.setFlag('playerWithheldHackFromPolice', answer === 'withheld');
            if (answer === 'withheld') {
                finishInterview(wrapper, onDone, 'Хорошо. Тогда пока зафиксирую только то, что вы не подтверждаете способ получения фотографии.');
                return;
            }
            showUnknownQuestion(wrapper, onDone);
        }
    });
}

function showUnknownQuestion(wrapper, onDone) {
    showCallStep(wrapper, {
        line: 'Кто сообщил вам, что к телефону подключились извне?',
        choices: [
            ['Мне написал неизвестный контакт. Сказал, что остановил подключение.', 'unknown'],
            ['Я сам видел журнал доступа.', 'log'],
            ['Сначала программа закрылась, а потом я увидел журнал.', 'partial']
        ],
        onChoose: answer => {
            stateManager.setFlag('unknownReportedToPolice', answer === 'unknown');
            stateManager.setFlag('unknownHiddenFromPolice', answer !== 'unknown');
            const line = answer === 'unknown'
                ? 'Пришлите скриншоты переписки с этим контактом. Ничего не удаляйте и не переходите по новым ссылкам.'
                : 'Сохраните журнал и сообщения, которые пришли после сбоя. Ничего не удаляйте.';
            finishInterview(wrapper, onDone, line);
        }
    });
}

function showCallStep(wrapper, { line, choices, onChoose }) {
    const body = wrapper.querySelector('#police-call-body');
    if (!body) return;
    body.innerHTML = `
        <div class="police-call-wave" aria-hidden="true">${Array.from({ length: 16 }, (_, index) => `<i style="--h:${10 + (index % 5) * 5}px"></i>`).join('')}</div>
        <div class="police-call-line"><small>Дэниел Рид</small><p>${escapeHtml(line)}</p></div>
        <div class="police-call-choices">
            ${choices.map(([text, value]) => `<button data-call-choice="${value}" type="button">${escapeHtml(text)}</button>`).join('')}
        </div>
    `;
    body.querySelectorAll('[data-call-choice]').forEach(button => {
        button.addEventListener('click', () => onChoose(button.dataset.callChoice));
    });
}

function finishInterview(wrapper, onDone, line) {
    const body = wrapper.querySelector('#police-call-body');
    if (!body) return;
    body.innerHTML = `
        <div class="police-call-line final"><small>Дэниел Рид</small><p>${escapeHtml(line)}</p></div>
        <div class="police-call-line final"><small>Дэниел Рид</small><p>Если Ravenwood Truth снова что-нибудь выложит или вам напишут с угрозами, сохраните сообщения и сообщите мне.</p></div>
        <button class="police-end-call" id="police-end-call" type="button">${icon('phone-off')} Завершить разговор</button>
    `;
    body.querySelector('#police-end-call')?.addEventListener('click', () => finishCall(wrapper, onDone, true));
}

function finishCall(wrapper, onDone, answered) {
    audioEngine.stopIncomingCall();
    if (wrapper._timer) clearInterval(wrapper._timer);
    const resumeMusic = wrapper._resumeMusic;
    stateManager.setFlag('policeCallCompleted', true);
    stateManager.addChatMessage('private_detective', {
        id: 'ep2_police_call_log',
        type: 'call',
        from: 'detective',
        title: answered ? 'Завершённый вызов' : 'Вызов отложен',
        text: answered ? 'Дэниел Рид · служебная линия' : 'Полиция Рейвенвуда',
        timestamp: currentTime()
    });

    wrapper.innerHTML = `
        <section class="police-call-ended">
            <div>${icon(answered ? 'check-check' : 'clock-3')}</div>
            <h1>${answered ? 'Разговор завершён' : 'Вызов отложен'}</h1>
            <p>${answered ? 'Служебный вызов сохранён в истории.' : 'Детектив Рид останется в сообщениях.'}</p>
        </section>
    `;

    setTimeout(() => {
        audioEngine.resumeBGMForScene(resumeMusic);
        if (onDone) onDone();
    }, 1000);
}

function currentTime() {
    return new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
