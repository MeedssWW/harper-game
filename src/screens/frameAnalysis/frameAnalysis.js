// ============================================
// Frame Analysis — VID_1842 sticker mini-game
// ============================================

import { stateManager } from '../../engine/stateManager.js';

const ICON_ROOT = 'src/assets/icons/lucide';
const VIDEO_SRC = 'src/assets/videos/vid_1842_fragment.mp4?v=90';
const POSTER_SRC = 'src/assets/videos/vid_1842_fragment_poster.jpg?v=90';
const STILL_SRC = 'src/assets/case/still_1842.png?v=90';
const STICKER_SRC = 'src/assets/case/still_1842_sticker.png?v=90';
const BEST_START = 1.4;
const BEST_END = 1.6;
const STICKER_TARGET = { x: 0.0, y: 0.26, w: 0.265, h: 0.09 };

export function renderFrameAnalysis({ onDone } = {}) {
    stateManager.setFlag('videoFragmentViewed', true);
    stateManager.setFlag('frameAnalysisStarted', true);

    const wrapper = document.createElement('div');
    wrapper.className = 'frame-analysis-screen';

    let capturedFrame = STILL_SRC;
    let selection = null;
    let dragMode = null;
    let dragStart = null;

    renderVideoStep();
    return wrapper;

    function renderVideoStep(message = '') {
        wrapper.innerHTML = `
            <header class="frame-analysis-header">
                <button class="frame-back-btn" id="frame-back" type="button" aria-label="Назад">${lucideIcon('chevron-left')}</button>
                <div class="frame-step"><b>01</b><i></i><span>03</span></div>
                <span class="frame-analysis-kicker">${lucideIcon('search')} Дело Харпер Вэнс</span>
                <h1>VID_1842_fragment.mp4</h1>
                <p>Найди момент, где наклейка на лобовом стекле видна лучше всего.</p>
            </header>

            <main class="frame-analysis-body">
                <section class="frame-video-shell">
                    <video id="analysis-video" class="frame-analysis-video" playsinline preload="metadata" poster="${POSTER_SRC}">
                        <source src="${VIDEO_SRC}" type="video/mp4">
                    </video>
                    <div class="frame-video-reticle" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
                    <span class="frame-video-label">RECOVERED / 00:03</span>
                </section>

                <div class="frame-time-row">
                    <span id="frame-current">00:00</span>
                    <i></i>
                    <span>00:03</span>
                </div>

                <button class="frame-primary-btn" id="frame-play" type="button">${lucideIcon('play')}<span>Воспроизвести</span></button>
                <div class="frame-timeline-shell">
                    <span class="frame-target-zone" aria-hidden="true"></span>
                    <input class="frame-timeline" id="frame-slider" type="range" min="0" max="3" step="0.01" value="0" aria-label="Таймлайн видео" aria-valuetext="00:00">
                </div>
                <div class="frame-scrub-controls" aria-label="Точная покадровая настройка">
                    <button type="button" data-frame-nudge="-0.05" aria-label="На пять сотых секунды назад">− 0,05</button>
                    <span>точная настройка</span>
                    <button type="button" data-frame-nudge="0.05" aria-label="На пять сотых секунды вперёд">+ 0,05</button>
                </div>
                <button class="frame-secondary-btn" id="frame-save" type="button">${lucideIcon('image')}<span>Сохранить этот кадр</span></button>
                <div class="frame-hint">${lucideIcon('search')}<span>Смотри на лобовое стекло, когда седан оказывается ближе к камере.</span></div>
                <div class="frame-feedback ${message ? 'visible error' : ''}" id="frame-feedback" role="status" aria-live="polite">${message ? `${lucideIcon('circle-alert')}<span>${message}</span>` : ''}</div>
            </main>
        `;

        const video = wrapper.querySelector('#analysis-video');
        const slider = wrapper.querySelector('#frame-slider');
        const current = wrapper.querySelector('#frame-current');
        const play = wrapper.querySelector('#frame-play');
        let selectedTime = 0;

        const setPlayState = playing => {
            play.classList.toggle('is-playing', playing);
            play.innerHTML = playing
                ? `${lucideIcon('pause')}<span>Пауза</span>`
                : `${lucideIcon('play')}<span>Воспроизвести</span>`;
        };

        wrapper.querySelector('#frame-back')?.addEventListener('click', () => {
            if (onDone) onDone();
        });

        const syncTime = () => {
            const time = Number.isFinite(video.currentTime) ? video.currentTime : 0;
            if (video.dataset.manualSeek === '1' && selectedTime > 0.05 && time < 0.05) {
                return;
            }
            selectedTime = time;
            slider.value = String(Math.min(3, time));
            current.textContent = formatTime(time);
            slider.setAttribute('aria-valuetext', formatPreciseTime(time));
            slider.style.setProperty('--frame-progress', `${Math.min(100, (time / 3) * 100)}%`);
        };

        video.addEventListener('loadedmetadata', syncTime);
        video.addEventListener('timeupdate', syncTime);
        video.addEventListener('pause', () => {
            setPlayState(false);
        });
        video.addEventListener('play', () => {
            setPlayState(true);
            stateManager.setFlag('videoFragmentViewed', true);
        });
        video.addEventListener('ended', () => {
            setPlayState(false);
            video.currentTime = Math.min(video.currentTime, 3);
            syncTime();
        });

        play.addEventListener('click', async () => {
            if (video.paused) {
                if (video.currentTime >= 2.98) video.currentTime = 0;
                try {
                    await video.play();
                } catch {
                    showFrameFeedback(wrapper.querySelector('#frame-feedback'), 'Не удалось запустить видео. Коснись таймлайна и попробуй ещё раз.');
                }
            } else {
                video.pause();
            }
        });

        slider.addEventListener('input', () => {
            selectedTime = Number(slider.value);
            video.dataset.manualSeek = '1';
            video.pause();
            video.currentTime = selectedTime;
            current.textContent = formatTime(selectedTime);
            slider.setAttribute('aria-valuetext', formatPreciseTime(selectedTime));
            slider.style.setProperty('--frame-progress', `${Math.min(100, (selectedTime / 3) * 100)}%`);
        });

        wrapper.querySelectorAll('[data-frame-nudge]').forEach(button => {
            button.addEventListener('click', () => {
                selectedTime = Math.max(0, Math.min(3, selectedTime + Number(button.dataset.frameNudge || 0)));
                slider.value = String(selectedTime);
                slider.dispatchEvent(new Event('input'));
                if (navigator.vibrate) navigator.vibrate(5);
            });
        });

        wrapper.querySelector('#frame-save').addEventListener('click', () => {
            const time = Number(selectedTime || slider.value || video.currentTime || 0);
            if (time < BEST_START || time > BEST_END) {
                renderVideoStep('Наклейка слишком размыта.\n\nПопробуйте остановить видео, когда машина ближе.');
                return;
            }

            stateManager.setFlag('bestFrameCaptured', true);
            capturedFrame = captureVideoFrame(video) || STILL_SRC;
            wrapper.classList.add('frame-capture-flash');
            setTimeout(() => renderCropStep(), 180);
        });
    }

    function renderCropStep(feedback = '') {
        selection = selection || { x: 0.02, y: 0.245, w: 0.24, h: 0.11 };

        wrapper.innerHTML = `
            <header class="frame-analysis-header compact">
                <button class="frame-back-btn" id="frame-back" type="button" aria-label="Назад">${lucideIcon('chevron-left')}</button>
                <div class="frame-step"><span>01</span><i></i><b>02</b><i></i><span>03</span></div>
                <span class="frame-analysis-kicker">${lucideIcon('image')} Выдели нужную деталь</span>
                <h1>Стоп-кадр</h1>
                <p>Перетащи рамку на наклейку. Потяни за круг в углу, чтобы изменить размер.</p>
            </header>

            <main class="frame-analysis-body crop">
                <section class="frame-crop-workspace" id="crop-workspace" aria-label="Стоп-кадр. Выдели наклейку на лобовом стекле">
                    <img src="${capturedFrame}" alt="Сохранённый кадр">
                    <div class="frame-crop-grid" aria-hidden="true"></div>
                    <div class="frame-selection" id="frame-selection" role="img" aria-label="Область выделения"><span></span><i></i></div>
                    <span class="frame-crop-label" aria-hidden="true">AREA 01</span>
                </section>
                <div class="frame-crop-instruction">${lucideIcon('search')}<span>Нужна только наклейка — без всей машины и фона.</span></div>
                <div class="frame-feedback ${feedback ? 'visible error' : ''}" id="crop-feedback" role="status" aria-live="polite">${feedback ? `${lucideIcon('circle-alert')}<span>${feedback}</span>` : ''}</div>
                <button class="frame-secondary-btn" id="save-crop" type="button">${lucideIcon('image')}<span>Сохранить фрагмент</span></button>
            </main>
        `;

        wrapper.querySelector('#frame-back')?.addEventListener('click', () => renderVideoStep());

        const workspace = wrapper.querySelector('#crop-workspace');
        const selectionEl = wrapper.querySelector('#frame-selection');
        updateSelectionEl(selectionEl, selection);

        workspace.addEventListener('pointerdown', event => {
            const point = getRelativePoint(event, workspace);
            const handle = isInHandle(point, selection);
            if (handle) {
                dragMode = 'resize';
                dragStart = { point, selection: { ...selection } };
            } else if (isInside(point, selection)) {
                dragMode = 'move';
                dragStart = { point, selection: { ...selection } };
            } else {
                dragMode = 'draw';
                selection = { x: point.x, y: point.y, w: 0.001, h: 0.001 };
                dragStart = { point, selection: { ...selection } };
            }
            workspace.classList.add('is-adjusting');
            workspace.setPointerCapture(event.pointerId);
            updateSelectionEl(selectionEl, selection);
        });

        workspace.addEventListener('pointermove', event => {
            if (!dragMode || !dragStart) return;
            const point = getRelativePoint(event, workspace);
            const dx = point.x - dragStart.point.x;
            const dy = point.y - dragStart.point.y;

            if (dragMode === 'move') {
                selection = clampRect({
                    ...dragStart.selection,
                    x: dragStart.selection.x + dx,
                    y: dragStart.selection.y + dy
                });
            } else if (dragMode === 'resize') {
                selection = clampRect({
                    ...dragStart.selection,
                    w: Math.max(0.03, dragStart.selection.w + dx),
                    h: Math.max(0.03, dragStart.selection.h + dy)
                });
            } else {
                selection = normalizeRect(dragStart.point, point);
            }

            updateSelectionEl(selectionEl, selection);
        });

        const stopDrag = event => {
            if (!dragMode) return;
            dragMode = null;
            dragStart = null;
            workspace.classList.remove('is-adjusting');
            try {
                workspace.releasePointerCapture(event.pointerId);
            } catch {}
        };
        workspace.addEventListener('pointerup', stopDrag);
        workspace.addEventListener('pointercancel', stopDrag);

        wrapper.querySelector('#save-crop').addEventListener('click', () => {
            if (!isCorrectSelection(selection)) {
                renderCropStep('Нужна только наклейка на лобовом стекле.');
                return;
            }

            stateManager.setFlag('stickerCropCompleted', true);
            stateManager.setFlag('stickerStillSaved', true);
            renderResultStep();
        });
    }

    function renderResultStep() {
        wrapper.innerHTML = `
            <header class="frame-analysis-header result">
                <div class="frame-step"><span>01</span><i></i><span>02</span><i></i><b>03</b></div>
                <span class="frame-analysis-kicker">${lucideIcon('file-text')} Стоп-кадр сохранён</span>
                <h1>Стоп-кадр с наклейкой</h1>
            </header>

            <main class="frame-analysis-body result">
                <article class="sticker-result-card">
                    <div class="sticker-result-image">
                        <img src="${STICKER_SRC}" alt="Вырезанный фрагмент наклейки">
                        <span>ENHANCED FRAME</span>
                    </div>
                    <div class="sticker-result-status">${lucideIcon('check-check')}<span>Деталь выделена</span></div>
                    <strong>Выцветшая наклейка</strong>
                    <p>На лобовом стекле седана видна прямоугольная наклейка. Текст не читается.</p>
                    <p class="sticker-result-version">Версия: пропуск или разрешение на въезд.</p>
                </article>
                <button class="frame-primary-btn" id="add-sticker-case" type="button">${lucideIcon('file-text')}<span>Добавить в дело</span></button>
            </main>
        `;

        wrapper.querySelector('#add-sticker-case').addEventListener('click', () => {
            addStickerToCase();
            if (onDone) onDone();
        });
    }
}

function addStickerToCase() {
    stateManager.setFlag('stickerStillAddedToCase', true);
    stateManager.addCaseEntry({
        id: 'clue_still_1842_sticker',
        type: 'clue',
        title: 'Стоп-кадр с наклейкой',
        text: 'Стоп-кадр из VID_1842_fragment.mp4. На лобовом стекле тёмно-зелёного седана видна выцветшая наклейка. Текст не читается. Возможно, это пропуск или разрешение на въезд.',
        imageSrc: 'src/assets/case/still_1842_sticker.png?v=90',
        fileName: 'still_1842.png'
    });
}

function captureVideoFrame(video) {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 544;
        canvas.height = video.videoHeight || 960;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/png');
    } catch {
        return '';
    }
}

function updateSelectionEl(el, rect) {
    if (!el || !rect) return;
    el.style.left = `${rect.x * 100}%`;
    el.style.top = `${rect.y * 100}%`;
    el.style.width = `${rect.w * 100}%`;
    el.style.height = `${rect.h * 100}%`;
}

function getRelativePoint(event, el) {
    const rect = el.getBoundingClientRect();
    return {
        x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
        y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))
    };
}

function normalizeRect(a, b) {
    return clampRect({
        x: Math.min(a.x, b.x),
        y: Math.min(a.y, b.y),
        w: Math.abs(a.x - b.x),
        h: Math.abs(a.y - b.y)
    });
}

function clampRect(rect) {
    const w = Math.max(0.03, Math.min(0.42, rect.w));
    const h = Math.max(0.03, Math.min(0.22, rect.h));
    return {
        x: Math.max(0, Math.min(1 - w, rect.x)),
        y: Math.max(0, Math.min(1 - h, rect.y)),
        w,
        h
    };
}

function isInside(point, rect) {
    return point.x >= rect.x && point.x <= rect.x + rect.w && point.y >= rect.y && point.y <= rect.y + rect.h;
}

function isInHandle(point, rect) {
    return point.x >= rect.x + rect.w - 0.07 && point.x <= rect.x + rect.w + 0.02 &&
        point.y >= rect.y + rect.h - 0.07 && point.y <= rect.y + rect.h + 0.02;
}

function isCorrectSelection(rect) {
    if (!rect) return false;
    const area = rect.w * rect.h;
    if (area > 0.09 || area < 0.006) return false;

    const overlap = intersectionArea(rect, STICKER_TARGET);
    const targetArea = STICKER_TARGET.w * STICKER_TARGET.h;
    return overlap / targetArea > 0.34;
}

function intersectionArea(a, b) {
    const x1 = Math.max(a.x, b.x);
    const y1 = Math.max(a.y, b.y);
    const x2 = Math.min(a.x + a.w, b.x + b.w);
    const y2 = Math.min(a.y + a.h, b.y + b.h);
    if (x2 <= x1 || y2 <= y1) return 0;
    return (x2 - x1) * (y2 - y1);
}

function formatTime(value) {
    const seconds = Math.max(0, Math.min(3, value || 0));
    return `00:0${Math.floor(seconds)}`;
}

function formatPreciseTime(value) {
    const seconds = Math.max(0, Math.min(3, Number(value) || 0));
    return `00:${seconds.toFixed(2).padStart(5, '0')}`;
}

function showFrameFeedback(element, message) {
    if (!element) return;
    element.innerHTML = `${lucideIcon('circle-alert')}<span></span>`;
    element.querySelector('span').textContent = message;
    element.classList.add('visible', 'error');
}

function lucideIcon(name) {
    const safeName = /^[a-z0-9-]+$/.test(name) ? name : 'file-text';
    return `<img class="frame-lucide-icon" src="${ICON_ROOT}/${safeName}.svg" alt="" aria-hidden="true">`;
}
