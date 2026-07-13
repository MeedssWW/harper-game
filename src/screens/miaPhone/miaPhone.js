import { stateManager } from '../../engine/stateManager.js';

const DEVICE_CHATS = [
    {
        id: 'mom',
        title: 'Мама',
        meta: 'День встречи · 21:16',
        messages: [
            ['Мама', 'Ты опять не поела?'],
            ['Миа', 'Поела.'],
            ['Мама', 'Фотографию пришли.'],
            ['Миа', 'Ты не веришь мне на слово?'],
            ['Мама', 'Нет.'],
            ['Миа', 'Очень поддерживающие отношения.']
        ]
    },
    {
        id: 'leya',
        title: 'Лея',
        meta: 'День встречи · 19:48',
        messages: [
            ['Лея', 'Ты ему всё-таки ответила?'],
            ['Миа', 'Нет.'],
            ['Лея', 'Миа.'],
            ['Миа', 'Я не знаю, что ему говорить.'],
            ['Лея', 'Хотя бы не исчезай на неделю.'],
            ['Миа', 'Я не исчезаю.'],
            ['Лея', 'Ты буквально исчезла на неделю.']
        ]
    },
    {
        id: 'harper',
        title: 'Харпер',
        meta: 'День встречи у старого моста',
        messages: [
            ['Миа', 'Ты уже там?'],
            ['Харпер', 'Да.'],
            ['Миа', 'Я буду минут через десять.'],
            ['Харпер', 'Хорошо.'],
            ['Миа', 'Всё нормально?'],
            ['Харпер', 'Да.'],
            ['Харпер', 'Просто приходи.'],
            ['Миа', 'Ты дошла?'],
            ['Харпер', 'Да.'],
            ['Миа', 'Точно?'],
            ['Харпер', 'Точно.'],
            ['Миа', 'Ты сегодня была какая-то странная.'],
            ['Харпер', 'Я просто устала.'],
            ['Миа', 'Напишешь завтра?'],
            ['Харпер', 'Да.']
        ]
    }
];

export function renderMiaPhone({ onDone } = {}) {
    stateManager.setFlag('remoteAccessUnlocked', true);
    stateManager.setFlag('miaPhoneOpened', true);
    stateManager.setFlag('backupOpened', true);

    const wrapper = document.createElement('div');
    wrapper.className = 'mia-remote-screen';
    if (stateManager.hasFlag('playerDeclinedBackupAccess')) {
        openRecoveredChat(wrapper, onDone, true);
    } else {
        renderDeviceList(wrapper, onDone);
    }
    return wrapper;
}

function renderDeviceList(wrapper, onDone) {
    wrapper.innerHTML = `
        <header class="mia-device-header">
            <div>
                <span>Устройство: MIA-OLD</span>
                <h1>Резервная копия</h1>
            </div>
            <div class="mia-device-status">
                <strong>только просмотр</strong>
                <span id="remote-status">За два дня до исчезновения Харпер</span>
            </div>
        </header>
        <main class="mia-device-body">
            <section class="mia-archive-note">
                Владелец увидит историю открытых разделов.<br>
                Некоторые данные восстановлены частично.
            </section>
            <section class="mia-recovered-block"><span>Разделы</span><small>Чаты · Фотографии · Файлы · Восстановленные данные · Сведения о копии</small></section>
            <section class="mia-phone-chat-list">
                ${DEVICE_CHATS.map(chat => renderDeviceRow(chat)).join('')}
            </section>
            <section class="mia-recovered-block">
                <span>Восстановленные данные</span>
                <button class="mia-recovered-row" id="recovered-row" type="button">
                    <div class="mia-damaged-icon">!</div>
                    <div>
                        <strong>Неизвестный чат</strong>
                        <p>1 удалённый чат · 1 удалённое вложение</p>
                        <em>День встречи · 18:46</em>
                    </div>
                </button>
                <small>14 изображений · 3 временных файла · 1 чат · 1 вложение</small>
            </section>
        </main>
    `;

    wrapper.querySelectorAll('.mia-phone-row').forEach(row => {
        row.addEventListener('click', () => {
            const chat = DEVICE_CHATS.find(item => item.id === row.dataset.chat);
            if (chat) openDeviceChat(wrapper, chat, onDone);
        });
    });

    wrapper.querySelector('#recovered-row')?.addEventListener('click', () => {
        stateManager.setFlag('recoveredChatFound', true);
        openRecoveredChat(wrapper, onDone);
    });
}

function renderDeviceRow(chat) {
    return `
        <button class="mia-phone-row" data-chat="${chat.id}" type="button">
            <div class="mia-phone-avatar">${chat.title.charAt(0)}</div>
            <div>
                <strong>${escapeHtml(chat.title)}</strong>
                <p>${escapeHtml(chat.messages.at(-1)?.[1] || '')}</p>
            </div>
            <span>${escapeHtml(chat.meta.split('·').pop().trim())}</span>
        </button>
    `;
}

function openDeviceChat(wrapper, chat, onDone) {
    if (chat.id === 'harper') {
        stateManager.setFlag('harperChatViewed', true);
    } else {
        incrementPrivateChatsOpened();
    }

    wrapper.innerHTML = `
        <header class="mia-device-chat-header">
            <button class="mia-device-back" type="button">‹</button>
            <div>
                <h1>${escapeHtml(chat.title)}</h1>
                <span>${escapeHtml(chat.meta)}</span>
            </div>
        </header>
        <main class="mia-device-chat-log">
            <div class="mia-archive-toast">Более ранние данные ещё не загружены.</div>
            ${chat.messages.map(([from, text]) => `
                <div class="mia-device-message ${from === 'Миа' ? 'mine' : ''}">
                    <span>${escapeHtml(from)}</span>
                    <p>${escapeHtml(text)}</p>
                </div>
            `).join('')}
            ${chat.id === 'harper' ? '<div class="mia-archive-footer"><strong>Последнее сообщение прочитано Харпер.</strong><span>В этот день с устройства был удалён ещё один чат.</span></div>' : '<div class="mia-archive-footer"><strong>Личная переписка Мии.</strong><span>Она не относится к делу Харпер.</span></div>'}
        </main>
        <footer class="mia-view-only">Режим просмотра. Ответить нельзя.</footer>
    `;

    wrapper.querySelector('.mia-device-back')?.addEventListener('click', () => renderDeviceList(wrapper, onDone));
    const log = wrapper.querySelector('.mia-device-chat-log');
    log?.addEventListener('scroll', () => {
        if (log.scrollTop < 8) {
            wrapper.querySelector('.mia-archive-toast')?.classList.add('visible');
            setTimeout(() => wrapper.querySelector('.mia-archive-toast')?.classList.remove('visible'), 1600);
        }
    });
    requestAnimationFrame(() => {
        if (log) log.scrollTop = log.scrollHeight;
    });
}

function openRecoveredChat(wrapper, onDone, restricted = false) {
    stateManager.setFlag('deletedChatFound', true);
    stateManager.setFlag('vid1842Found', true);
    wrapper.innerHTML = `
        <header class="mia-device-chat-header">
            ${restricted ? '' : '<button class="mia-device-back" type="button">‹</button>'}
            <div>
                <h1>Неизвестный чат</h1>
                <span>Контакт не сохранён · номер повреждён</span>
            </div>
        </header>
        <main class="mia-device-chat-log recovered">
            <div class="mia-time-chip">Создан 18:46 · удалён 18:49</div>
            <div class="mia-recovered-message">
                <p>Исходящие сообщения: текст не восстановлен.</p>
                <div class="mia-video-file">
                    <span>Вложение</span>
                    <strong>VID_1842.mp4</strong>
                    <em>Локальная копия отсутствует · источник: внешний сервер</em>
                </div>
                <button class="mia-open-file" id="open-video-file" type="button">Открыть VID_1842.mp4</button>
            </div>
        </main>
        <footer class="mia-view-only">Режим просмотра. Ответить нельзя.</footer>
    `;

    wrapper.querySelector('.mia-device-back')?.addEventListener('click', () => renderDeviceList(wrapper, onDone));
    wrapper.querySelector('#open-video-file')?.addEventListener('click', () => startDownload(wrapper, onDone));
}

function startDownload(wrapper, onDone) {
    stateManager.setFlag('suspiciousFileOpened', true);
    stateManager.setFlag('deletedChatFound', true);
    stateManager.setFlag('vid1842Found', true);

    wrapper.innerHTML = `
        <section class="mia-download-screen">
            <span>Загрузка вложения...</span>
            <h1>VID_1842.mp4</h1>
            <div class="mia-progress">
                <div id="mia-progress-bar"></div>
            </div>
            <strong id="mia-progress-number">0%</strong>
            <p id="mia-connection-label">Подключение: активно</p>
        </section>
    `;

    updateProgress(wrapper, 0);
    setTimeout(() => updateProgress(wrapper, 7), 700);
    setTimeout(() => updateProgress(wrapper, 18), 1250);
    setTimeout(() => updateProgress(wrapper, 31), 1800);
    setTimeout(() => runTakeover(wrapper, onDone), 2600);
}

function updateProgress(wrapper, value) {
    wrapper.querySelector('#mia-progress-number').textContent = `${value}%`;
    wrapper.querySelector('#mia-progress-bar').style.width = `${value}%`;
}

async function runTakeover(wrapper, onDone) {
    stateManager.setFlag('fileDownloadProgress', 31);
    const label = wrapper.querySelector('#mia-connection-label');
    const number = wrapper.querySelector('#mia-progress-number');
    const downloadScreen = wrapper.querySelector('.mia-download-screen');
    wrapper.classList.add('is-hacked');
    downloadScreen?.classList.add('is-corrupted');
    downloadScreen?.insertAdjacentHTML('beforeend', renderHijackLayers('ACCESS BREACH'));
    number.textContent = '31%';

    await wait(360);
    number.textContent = '0%';
    await wait(160);
    number.textContent = '31%';
    if (label) label.textContent = 'Подключение нестабильно';
    await wait(700);
    if (label) label.textContent = 'Соединение потеряно';
    await wait(650);

    wrapper.innerHTML = `<section class="mia-blackout is-violent">${renderHijackLayers('SESSION KILLED')}<span>Сеанс удалённого доступа завершён.</span></section>`;
    await wait(700);

    await showHijackHome(wrapper);
    await showHijackChat(wrapper, 'Larks', [
        ['Оливия', 'Я отправила фото из кафе.'],
        ['Миа', 'У старого моста она была другой.'],
        ['Тайлер', 'Larks и Riverwalk рядом.'],
        ['Оливия', 'Отметь только то, что мы знаем точно.'],
        ['Миа', 'До вечера.']
    ]);
    await showHijackHome(wrapper, true);
    await showHijackChat(wrapper, 'Оливия Грант', [
        ['Оливия', 'Я заглянула на минуту.'],
        ['Оливия', 'Увидела, что ты закончил с картой.'],
        ['Игрок', 'Пока это всего две точки.'],
        ['Оливия', 'Но раньше у нас не было даже этого.'],
        ['Оливия', 'Спасибо.']
    ]);
    await showHijackHome(wrapper, true);
    await showHijackChat(wrapper, 'Дерек Миллер', [
        ['Дерек', 'Ты точно никогда ее не видел?'],
        ['Игрок', 'Нет. Я всё ещё вижу её впервые.'],
        ['Дерек', 'Понял.'],
        ['Дерек', 'Я сегодня ещё попробую поговорить с полицией.'],
        ['Дерек', 'Я напишу позже.']
    ]);
    await showHijackHome(wrapper, true);
    await showHijackCase(wrapper);
    await showCameraCapture(wrapper);

    stateManager.setFlag('playerPhoneCompromised', true);
    stateManager.setFlag('cameraCaptureTriggered', true);
    stateManager.setFlag('playerHackPhotoCreated', true);
    stateManager.setFlag('unknownFirstContact', true);
    stateManager.setFlag('videoPartialSavedByUnknown', true);
    stateManager.setFlag('externalConnectionBlocked', true);
    stateManager.setFlag('unknownChatUnlocked', true);
    stateManager.setFlag('hackSequencePending', false);
    stateManager.unlock('chats', 'private_unknown');

    wrapper.innerHTML = `
        <section class="mia-reboot-screen">
            <div class="mia-reboot-spinner"></div>
            <strong>Перезагрузка устройства...</strong>
        </section>
    `;
    await wait(2300);
    stateManager.setFlag('remoteSessionInterrupted', true);
    if (onDone) onDone();
}

async function showHijackHome(wrapper, fast = false) {
    wrapper.innerHTML = `
        <section class="phone-hijack-view hijack-home is-violent">
            ${renderHijackLayers('MESSAGES INDEX')}
            <header>
                <span>Телефон игрока</span>
                <h1>Сообщения</h1>
            </header>
            <div class="hijack-chat-list">
                <div><strong>Larks</strong><span>Миа: До вечера.</span></div>
                <div><strong>Оливия Грант</strong><span>Спасибо.</span></div>
                <div><strong>Дерек Миллер</strong><span>Я напишу позже.</span></div>
                <div><strong>Миа Картер</strong><span>Удалённый доступ</span></div>
            </div>
        </section>
    `;
    await wait(fast ? 620 : 980);
}

async function showHijackChat(wrapper, title, messages) {
    wrapper.innerHTML = `
        <section class="phone-hijack-view hijack-chat is-violent">
            ${renderHijackLayers('CHAT OPENED')}
            <header>
                <span>Открыт чат</span>
                <h1>${escapeHtml(title)}</h1>
            </header>
            <div class="hijack-chat-window" id="hijack-chat-window">
                ${messages.map(([from, text], index) => `
                    <div class="hijack-message ${from === 'Игрок' ? 'mine' : ''}" style="--i:${index}">
                        <span>${escapeHtml(from)}</span>
                        <p>${escapeHtml(text)}</p>
                    </div>
                `).join('')}
            </div>
        </section>
    `;

    const log = wrapper.querySelector('#hijack-chat-window');
    await wait(180);
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' });
    await wait(720);
    if (log) log.scrollTo({ top: 0, behavior: 'smooth' });
    await wait(520);
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' });
    await wait(620);
}

async function showHijackCase(wrapper) {
    wrapper.innerHTML = `
        <section class="phone-hijack-view hijack-case is-violent">
            ${renderHijackLayers('CASE FILE')}
            <header>
                <span>Самостоятельный доступ</span>
                <h1>Дело Харпер Вэнс</h1>
            </header>
            <div class="hijack-notes" id="hijack-notes">
                <article><b>ФАКТ</b><strong>Larks</strong><p>Харпер была там с Оливией.</p></article>
                <article><b>ФАКТ</b><strong>Riverwalk</strong><p>Миа видела Харпер у старого моста.</p></article>
                <article><b>ДЕТАЛЬ</b><strong>Тёмно-зелёный седан</strong><p>Одна и та же машина могла появляться в двух местах.</p></article>
                <article><b>ВОПРОС</b><strong>Кому она написала?</strong><p>Сообщение с телефона Мии пока не найдено.</p></article>
            </div>
        </section>
    `;

    const log = wrapper.querySelector('#hijack-notes');
    await wait(240);
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' });
    await wait(980);
}

async function showCameraCapture(wrapper) {
    wrapper.innerHTML = `
        <section class="mia-camera-view is-violent">
            ${renderHijackLayers('FRONT CAMERA')}
            <div class="camera-noise"></div>
            <video class="camera-video" autoplay muted playsinline></video>
            <canvas class="camera-canvas" width="720" height="960"></canvas>
            <div class="camera-face-shadow"></div>
            <span class="camera-label">Фронтальная камера</span>
            <div class="camera-permission" hidden>
                <strong>Требуется доступ к фронтальной камере.</strong>
                <span>Нажми, чтобы сделать реальный снимок. Без кадра сеанс не продолжится.</span>
                <button type="button" id="camera-permission-btn">Разрешить</button>
                <em id="camera-permission-hint" hidden>Автоматический доступ не сработал. Можно сделать снимок вручную.</em>
                <button type="button" id="camera-file-btn" hidden>Сделать фото вручную</button>
                <input id="camera-file-input" type="file" accept="image/*" capture="user">
            </div>
        </section>
    `;

    const video = wrapper.querySelector('.camera-video');
    let stream = null;
    let captured = false;

    try {
        stream = await requestCameraStream(video);
    } catch (error) {
        stateManager.setFlag('frontCameraCaptureError', error?.message || 'camera unavailable');
    }

    if (stream) {
        await wait(1150);
        captured = saveCameraFrame(wrapper, video);
    } else {
        captured = await waitForManualCameraCapture(wrapper);
    }

    if (!captured) {
        stateManager.setFlag('frontCameraCaptureError', 'no real camera frame captured');
        return;
    }

    wrapper.querySelector('.mia-camera-view')?.classList.add('flash');
    await wait(350);
    wrapper.insertAdjacentHTML('beforeend', `<div class="camera-save-toast">Фото сохранено.</div>`);
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    await wait(850);
    wrapper.innerHTML = `
        <section class="mia-blocked-screen">
            <div class="blocked-static"></div>
            <strong>Внешнее подключение заблокировано.</strong>
        </section>
    `;
    await wait(1100);
}

async function requestCameraStream(video) {
    if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('camera api unavailable');
    }

    const stream = await navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: 'user',
            width: { ideal: 720 },
            height: { ideal: 960 }
        },
        audio: false
    });

    if (video && stream) {
        video.srcObject = stream;
        await video.play().catch(() => {});
        await waitForVideoFrame(video);
    }

    return stream;
}

function waitForManualCameraCapture(wrapper) {
    const view = wrapper.querySelector('.mia-camera-view');
    const panel = wrapper.querySelector('.camera-permission');
    const button = wrapper.querySelector('#camera-permission-btn');
    const fileButton = wrapper.querySelector('#camera-file-btn');
    const hint = wrapper.querySelector('#camera-permission-hint');
    const input = wrapper.querySelector('#camera-file-input');
    const video = wrapper.querySelector('.camera-video');

    view?.classList.add('camera-denied');
    if (panel) panel.hidden = false;

    return new Promise(resolve => {
        const finishWithFile = file => {
            if (!file) {
                resolve(false);
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                const dataUrl = String(reader.result || '');
                if (!dataUrl) {
                    resolve(false);
                    return;
                }
                stateManager.setFlag('playerFrontCameraPhoto', dataUrl);
                stateManager.setFlag('playerHackPhoto', dataUrl);
                stateManager.setFlag('frontCameraCaptureMode', 'manual-file');
                resolve(true);
            };
            reader.onerror = () => {
                stateManager.setFlag('frontCameraCaptureError', 'manual file read failed');
                resolve(false);
            };
            reader.readAsDataURL(file);
        };

        input?.addEventListener('change', () => finishWithFile(input.files?.[0]), { once: true });
        fileButton?.addEventListener('click', () => input?.click());
        button?.addEventListener('click', async () => {
            try {
                const stream = await requestCameraStream(video);
                if (stream) {
                    await wait(900);
                    const saved = saveCameraFrame(wrapper, video);
                    stream.getTracks().forEach(track => track.stop());
                    resolve(saved);
                    return;
                }
            } catch (error) {
                stateManager.setFlag('frontCameraCaptureError', error?.message || 'camera permission denied');
            }

            if (hint) hint.hidden = false;
            if (fileButton) fileButton.hidden = false;
        });
    });
}

function saveCameraFrame(wrapper, video) {
    const canvas = wrapper.querySelector('.camera-canvas');
    const context = canvas?.getContext('2d');
    if (!canvas || !context || !video || !video.videoWidth) {
        stateManager.setFlag('playerFrontCameraPhoto', '');
        stateManager.setFlag('playerHackPhoto', '');
        return false;
    }

    const width = canvas.width;
    const height = canvas.height;
    const ratio = Math.max(width / video.videoWidth, height / video.videoHeight);
    const drawWidth = video.videoWidth * ratio;
    const drawHeight = video.videoHeight * ratio;
    const x = (width - drawWidth) / 2;
    const y = (height - drawHeight) / 2;

    context.save();
    context.scale(-1, 1);
    context.drawImage(video, -x - drawWidth, y, drawWidth, drawHeight);
    context.restore();

    try {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        stateManager.setFlag('playerFrontCameraPhoto', dataUrl);
        stateManager.setFlag('playerHackPhoto', dataUrl);
        stateManager.setFlag('frontCameraCaptureMode', 'getUserMedia');
        return true;
    } catch (error) {
        stateManager.setFlag('frontCameraCaptureError', error?.message || 'capture failed');
        return false;
    }
}

function renderHijackLayers(label = '') {
    return `
        <div class="hijack-glitch hard"></div>
        <div class="hijack-corruption"></div>
        <div class="hijack-slice slice-a"></div>
        <div class="hijack-slice slice-b"></div>
        <div class="hijack-slice slice-c"></div>
        <div class="hijack-frame-label">${escapeHtml(label)}</div>
    `;
}

function waitForVideoFrame(video) {
    if (!video) return Promise.resolve();
    if (video.videoWidth && video.videoHeight) return Promise.resolve();

    return new Promise(resolve => {
        const done = () => {
            video.removeEventListener('loadedmetadata', done);
            video.removeEventListener('canplay', done);
            resolve();
        };
        video.addEventListener('loadedmetadata', done, { once: true });
        video.addEventListener('canplay', done, { once: true });
        setTimeout(done, 900);
    });
}

function incrementPrivateChatsOpened() {
    const flags = stateManager.get('flags') || {};
    stateManager.setFlag('miaPrivateChatsOpened', (flags.miaPrivateChatsOpened || 0) + 1);
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
