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
        meta: 'День, когда Харпер брала телефон',
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
                <span id="remote-status">Копия сделана после того дня</span>
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
                    <div class="mia-damaged-icon" aria-hidden="true"><img class="ui-lucide is-light" src="src/assets/icons/lucide/triangle-alert.svg" alt="" /></div>
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
            <button class="mia-device-back" type="button" aria-label="Назад"><img class="ui-lucide is-light" src="src/assets/icons/lucide/chevron-left.svg" alt="" /></button>
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
            ${restricted ? '' : '<button class="mia-device-back" type="button" aria-label="Назад"><img class="ui-lucide is-light" src="src/assets/icons/lucide/chevron-left.svg" alt="" /></button>'}
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
                    <span>Внешнее вложение</span>
                    <strong>VID_1842.mp4</strong>
                    <em>Локальной копии нет · сохранился только адрес</em>
                </div>
                <div class="mia-external-address">
                    <span>Источник</span>
                    <code>media.rvn-archive.invalid/v/1842</code>
                    <small>Подпись файла не сохранилась</small>
                </div>
                <button class="mia-open-file" id="open-video-file" type="button">Открыть во внешнем просмотрщике</button>
            </div>
        </main>
        <footer class="mia-view-only">Режим просмотра. Ответить нельзя.</footer>
    `;

    wrapper.querySelector('.mia-device-back')?.addEventListener('click', () => renderDeviceList(wrapper, onDone));
    wrapper.querySelector('#open-video-file')?.addEventListener('click', () => startDownload(wrapper, onDone));
}

async function startDownload(wrapper, onDone) {
    stateManager.setFlag('suspiciousFileOpened', true);
    stateManager.setFlag('deletedChatFound', true);
    stateManager.setFlag('vid1842Found', true);
    stateManager.setFlag('externalViewerOpened', true);

    wrapper.innerHTML = `
        <section class="mia-download-screen">
            <div class="mia-viewer-brand">
                <span>RavenLink Viewer</span>
                <strong>внешний адрес</strong>
            </div>
            <div class="mia-viewer-file">
                <span>VID_1842.mp4</span>
                <code>media.rvn-archive.invalid/v/1842</code>
            </div>
            <div class="mia-network-log" aria-live="polite">
                <div class="audit-step is-active" data-audit="address"><i></i><span>Проверка адреса</span><b>...</b></div>
                <div class="audit-step" data-audit="redirect"><i></i><span>Ответ внешнего узла</span><b>ожидание</b></div>
                <div class="audit-step" data-audit="viewer"><i></i><span>Веб-просмотрщик</span><b>ожидание</b></div>
                <div class="audit-step" data-audit="session"><i></i><span>Временный ключ RavenLink</span><b>ожидание</b></div>
            </div>
            <p id="mia-connection-label">Устанавливается защищённое соединение...</p>
        </section>
    `;

    await wait(650);
    completeAuditStep(wrapper, 'address', 'адрес найден');
    activateAuditStep(wrapper, 'redirect');
    await wait(720);
    completeAuditStep(wrapper, 'redirect', '302 · перенаправление');
    activateAuditStep(wrapper, 'viewer');
    wrapper.querySelector('#mia-connection-label').textContent = 'Видеофайл не найден. Открывается страница просмотра.';
    await wait(900);
    completeAuditStep(wrapper, 'viewer', 'страница загружена');
    activateAuditStep(wrapper, 'session');
    await wait(750);
    completeAuditStep(wrapper, 'session', 'ключ передан', true);
    wrapper.querySelector('#mia-connection-label').textContent = 'Внешний узел запросил дополнительные разрешения.';
    await wait(620);
    await runTakeover(wrapper, onDone);
}

async function runTakeover(wrapper, onDone) {
    stateManager.setFlag('fileDownloadProgress', 0);
    stateManager.setFlag('temporarySessionKeyExposed', true);
    wrapper.classList.add('is-hacked');

    await showPermissionEscalation(wrapper);
    await showHijackHome(wrapper);
    await showHijackCase(wrapper);
    await showCameraCapture(wrapper);
    await showSessionRevoked(wrapper);

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
        <section class="mia-reboot-screen session-closed">
            <div class="mia-reboot-spinner"></div>
            <strong>Встроенный просмотрщик закрыт</strong>
            <span>Возврат к сообщениям...</span>
        </section>
    `;
    await wait(1500);
    stateManager.setFlag('remoteSessionInterrupted', true);
    if (onDone) onDone();
}

async function showPermissionEscalation(wrapper) {
    wrapper.innerHTML = `
        <section class="mia-session-scope">
            ${renderSessionBadge('Внешний сеанс', 'ключ принят')}
            <header>
                <span>RavenLink · временный ключ</span>
                <h1>Запрос разрешений</h1>
                <p>Страница просмотра запросила доступ, которого нет у обычного видео.</p>
            </header>
            <div class="session-permission-list">
                <div class="is-granted"><span>messages.index</span><b>чтение</b></div>
                <div class="is-granted"><span>notes.index</span><b>чтение</b></div>
                <div><span>camera.capture</span><b>ожидание</b></div>
            </div>
            <small>Разрешения выданы служебным ключом просмотрщика</small>
        </section>
    `;
    await wait(1150);
}

async function showHijackHome(wrapper) {
    const playerName = escapeHtml(stateManager.getPlayerName() || 'Игрок');
    wrapper.innerHTML = `
        <section class="phone-hijack-view hijack-home is-session-read">
            ${renderSessionBadge('messages.index', 'чтение')}
            <header>
                <span>${playerName} · локальный профиль</span>
                <h1>Сообщения</h1>
            </header>
            <div class="hijack-chat-list">
                <div><strong>RavenFeed</strong><span>активный аккаунт · индекс прочитан</span></div>
                <div><strong>Оливия Грант</strong><span>последнее: «Не принимай каждую версию за факт»</span></div>
                <div><strong>Дерек Миллер</strong><span>последнее: «Допрашивать тебя заново не буду»</span></div>
                <div><strong>Миа Картер</strong><span>последнее: «Резервная копия»</span></div>
            </div>
            <div class="session-readout"><span>4 записи перечислено</span><b>заголовки и превью прочитаны</b></div>
        </section>
    `;
    await wait(1200);
}

async function showHijackCase(wrapper) {
    wrapper.innerHTML = `
        <section class="phone-hijack-view hijack-case is-session-read">
            ${renderSessionBadge('notes.index', 'чтение')}
            <header>
                <span>Заметки · локальное хранилище</span>
                <h1>Дело Харпер Вэнс</h1>
            </header>
            <div class="hijack-notes" id="hijack-notes">
                <article><b>ФАКТ</b><strong>Номер игрока</strong><p>Он пришёл Дереку с телефона Харпер.</p></article>
                <article><b>ПОКАЗАНИЯ МИИ</b><strong>Старый телефон</strong><p>По словам Мии, Харпер брала её телефон на несколько минут.</p></article>
                <article><b>НЕИЗВЕСТНО</b><strong>Удалённый чат</strong><p>Контакт и текст сообщения не восстановлены.</p></article>
                <article><b>ВОПРОС</b><strong>Кому она написала?</strong><p>В копии осталась только ссылка на VID_1842.mp4.</p></article>
            </div>
            <div class="session-readout"><span>1 заметка открыта</span><b>экспорт начат</b></div>
        </section>
    `;

    const log = wrapper.querySelector('#hijack-notes');
    await wait(240);
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' });
    await wait(1200);
}

async function showCameraCapture(wrapper) {
    wrapper.innerHTML = `
        <section class="mia-camera-view">
            ${renderSessionBadge('camera.capture', 'запрос')}
            <div class="camera-noise"></div>
            <video class="camera-video" autoplay muted playsinline></video>
            <canvas class="camera-canvas" width="720" height="960"></canvas>
            <div class="camera-face-shadow"></div>
            <span class="camera-label">Камера открыта встроенным просмотрщиком</span>
            <div class="camera-permission" hidden>
                <strong>Браузер остановил автоматический доступ к камере.</strong>
                <span>Чтобы сцена использовала реальный кадр, разреши одноразовый снимок. Он сохранится только в локальном прогрессе игры.</span>
                <button type="button" id="camera-permission-btn">Разрешить для этой сцены</button>
                <em id="camera-permission-hint" hidden>Камера недоступна. Можно сделать снимок системной камерой.</em>
                <button type="button" id="camera-file-btn" hidden>Открыть системную камеру</button>
                <button type="button" id="camera-skip-btn">Продолжить без камеры</button>
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
    wrapper.insertAdjacentHTML('beforeend', `
        <div class="camera-save-toast">
            <strong>player_${Date.now()}.jpg</strong>
            <span id="camera-transfer-status">передача · 18%</span>
        </div>
    `);
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    await wait(420);
    const transferStatus = wrapper.querySelector('#camera-transfer-status');
    if (transferStatus) transferStatus.textContent = 'передача · 41%';
    await wait(420);
    if (transferStatus) transferStatus.textContent = 'передача · 64%';
    stateManager.setFlag('photoTransferStarted', true);
    stateManager.setFlag('photoTransferProgress', 64);
    await wait(450);
}

async function showSessionRevoked(wrapper) {
    const now = Date.now();
    wrapper.innerHTML = `
        <section class="mia-session-revoked">
            ${renderSessionBadge('RavenLink', 'ключ отозван')}
            <header>
                <span>Журнал активности</span>
                <h1>Внешний сеанс завершён</h1>
            </header>
            <div class="session-log">
                <div><time>${formatLogTime(now - 16000)}</time><span>внешний просмотрщик</span><b>сеанс открыт</b></div>
                <div><time>${formatLogTime(now - 12000)}</time><span>messages.index</span><b>прочитано</b></div>
                <div><time>${formatLogTime(now - 9000)}</time><span>notes.index</span><b>прочитано</b></div>
                <div><time>${formatLogTime(now - 4000)}</time><span>camera.capture</span><b>кадр создан</b></div>
                <div class="is-danger"><time>${formatLogTime(now - 2000)}</time><span>player_photo.jpg</span><b>передача 64%</b></div>
                <div class="is-safe"><time>${formatLogTime(now)}</time><span>временный ключ</span><b>отозван</b></div>
            </div>
            <p>Нельзя определить, успел ли сервер сохранить неполную передачу.</p>
        </section>
    `;
    await wait(2100);
}

async function requestCameraStream(video) {
    if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('camera api unavailable');
    }

    let requestTimedOut = false;
    const mediaRequest = navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: 'user',
            width: { ideal: 720 },
            height: { ideal: 960 }
        },
        audio: false
    });
    const timeout = new Promise((_, reject) => {
        setTimeout(() => {
            requestTimedOut = true;
            reject(new Error('camera permission timeout'));
        }, 3500);
    });
    const stream = await Promise.race([mediaRequest, timeout]);

    mediaRequest.then(lateStream => {
        if (requestTimedOut && lateStream) {
            lateStream.getTracks().forEach(track => track.stop());
        }
    }).catch(() => {});

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
    const skipButton = wrapper.querySelector('#camera-skip-btn');
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
        skipButton?.addEventListener('click', () => {
            stateManager.setFlag('frontCameraCaptureMode', 'skipped');
            resolve(false);
        }, { once: true });
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

function renderSessionBadge(scope, status) {
    return `
        <div class="session-badge">
            <i></i>
            <span>${escapeHtml(scope)}</span>
            <b>${escapeHtml(status)}</b>
        </div>
    `;
}

function activateAuditStep(wrapper, id) {
    const step = wrapper.querySelector(`[data-audit="${id}"]`);
    step?.classList.add('is-active');
    const status = step?.querySelector('b');
    if (status) status.textContent = '...';
}

function completeAuditStep(wrapper, id, status, warning = false) {
    const step = wrapper.querySelector(`[data-audit="${id}"]`);
    step?.classList.remove('is-active');
    step?.classList.add(warning ? 'is-warning' : 'is-complete');
    const output = step?.querySelector('b');
    if (output) output.textContent = status;
}

function formatLogTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
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
