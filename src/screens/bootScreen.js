export function renderBootScreen({ onBegin, onComplete }) {
    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement('div');
    wrapper.className = 'harper-boot';
    wrapper.innerHTML = `
        <div class="harper-boot-noise" aria-hidden="true"></div>
        <div class="harper-boot-rain" aria-hidden="true"></div>
        <canvas class="harper-boot-rain-canvas" aria-hidden="true"></canvas>
        <div class="harper-boot-vignette" aria-hidden="true"></div>
        <div class="harper-boot-signal" aria-hidden="true">
            <i></i><i></i><i></i>
        </div>
        <div class="harper-boot-copy">
            <span class="harper-boot-kicker">RAVENWOOD // NORTH LINE</span>
            <h1>HARPER</h1>
            <p>Некоторые сообщения находят тебя сами.</p>
        </div>
        <div class="harper-boot-case" aria-hidden="true">
            <span>ПОСЛЕДНИЙ СИГНАЛ</span>
            <strong>04:16</strong>
            <small>переезд № 7 · источник неизвестен</small>
        </div>
        <button class="harper-boot-start" type="button">
            <span>КОСНУТЬСЯ, ЧТОБЫ НАЧАТЬ</span>
            <small>лучше в наушниках</small>
        </button>
        <div class="harper-boot-progress" aria-hidden="true"><span></span></div>
        <div class="harper-boot-code">RVN-07 // LINK STANDBY</div>
    `;

    const startButton = wrapper.querySelector('.harper-boot-start');
    const stopRain = createRainEffect(wrapper.querySelector('.harper-boot-rain-canvas'), wrapper);
    let started = false;
    startButton.addEventListener('click', () => {
        if (started) return;
        started = true;
        wrapper.classList.add('is-loading');
        onBegin?.();
        window.setTimeout(() => {
            wrapper.classList.add('is-complete');
            window.setTimeout(() => {
                stopRain();
                onComplete?.();
            }, 620);
        }, 4800);
    });

    fragment.appendChild(wrapper);
    return fragment;
}

function createRainEffect(canvas, root) {
    const context = canvas?.getContext?.('2d', { alpha: true });
    if (!context) return () => {};

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
    const drops = [];
    const splashes = [];
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let animationFrame = 0;
    let lastFrame = performance.now();
    let detachedFrames = 0;
    let disposed = false;

    const resetDrop = (drop, initial = false) => {
        const depth = 0.18 + Math.random() * 0.82;
        drop.depth = depth;
        drop.x = -40 + Math.random() * (width + 80);
        drop.y = initial ? Math.random() * (height + 80) - 80 : -30 - Math.random() * height * 0.28;
        drop.speed = 440 + depth * 720 + Math.random() * 150;
        drop.length = 8 + depth * 29 + Math.random() * 9;
        drop.alpha = 0.08 + depth * 0.36;
        drop.lineWidth = 0.35 + depth * 1.05;
        drop.impactY = depth > 0.58
            ? height * (0.77 + Math.random() * 0.22)
            : height + drop.length + 20;
    };

    const resize = () => {
        const bounds = root.getBoundingClientRect();
        const nextWidth = Math.max(1, Math.round(bounds.width));
        const nextHeight = Math.max(1, Math.round(bounds.height));
        if (nextWidth === width && nextHeight === height) return;

        width = nextWidth;
        height = nextHeight;
        pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        const targetCount = reducedMotion
            ? 24
            : Math.max(58, Math.min(138, Math.round((width * height) / 4500)));

        while (drops.length < targetCount) {
            const drop = {};
            resetDrop(drop, true);
            drops.push(drop);
        }
        if (drops.length > targetCount) drops.length = targetCount;
        drops.forEach((drop) => {
            if (drop.impactY <= height) {
                drop.impactY = height * (0.77 + Math.random() * 0.22);
            }
        });
    };

    const addSplash = (drop) => {
        if (splashes.length > 34 || Math.random() > 0.58) return;
        splashes.push({
            x: drop.x,
            y: drop.impactY,
            age: 0,
            duration: 0.24 + Math.random() * 0.18,
            radius: 2.2 + drop.depth * 5.2,
            alpha: 0.12 + drop.depth * 0.22
        });
    };

    const draw = (now, delta, advance) => {
        context.clearRect(0, 0, width, height);
        context.lineCap = 'round';

        const gust = 52
            + Math.sin(now / 1850) * 28
            + Math.sin(now / 610) * 8;

        for (const drop of drops) {
            const horizontalSpeed = gust * (0.42 + drop.depth * 0.8);
            if (advance) {
                drop.x += horizontalSpeed * delta;
                drop.y += drop.speed * delta;
            }

            const trailSeconds = drop.length / drop.speed;
            context.beginPath();
            context.moveTo(drop.x, drop.y);
            context.lineTo(
                drop.x - horizontalSpeed * trailSeconds,
                drop.y - drop.length
            );
            context.lineWidth = drop.lineWidth;
            context.strokeStyle = `rgba(192, 218, 236, ${drop.alpha})`;
            context.stroke();

            if (advance && (drop.y >= drop.impactY || drop.x > width + 55)) {
                if (drop.impactY <= height) addSplash(drop);
                resetDrop(drop, false);
            }
        }

        for (let index = splashes.length - 1; index >= 0; index -= 1) {
            const splash = splashes[index];
            if (advance) splash.age += delta;
            const progress = Math.min(1, splash.age / splash.duration);
            const fade = 1 - progress;

            context.save();
            context.translate(splash.x, splash.y);
            context.scale(1, 0.28);
            context.beginPath();
            context.arc(0, 0, splash.radius * (0.45 + progress), 0, Math.PI * 2);
            context.lineWidth = 0.7;
            context.strokeStyle = `rgba(202, 226, 241, ${splash.alpha * fade})`;
            context.stroke();
            context.restore();

            if (progress >= 1) splashes.splice(index, 1);
        }
    };

    const dispose = () => {
        if (disposed) return;
        disposed = true;
        cancelAnimationFrame(animationFrame);
        resizeObserver?.disconnect();
        window.removeEventListener('resize', handleResize);
    };

    const tick = (now) => {
        if (disposed) return;
        if (!root.isConnected) {
            detachedFrames += 1;
            if (detachedFrames > 20) {
                dispose();
                return;
            }
            animationFrame = requestAnimationFrame(tick);
            return;
        }

        detachedFrames = 0;
        resize();
        if (document.hidden) {
            lastFrame = now;
            animationFrame = requestAnimationFrame(tick);
            return;
        }
        const delta = Math.min(0.034, Math.max(0, (now - lastFrame) / 1000));
        lastFrame = now;
        draw(now, delta, true);
        animationFrame = requestAnimationFrame(tick);
    };

    const handleResize = () => {
        resize();
        if (reducedMotion && root.isConnected) draw(performance.now(), 0, false);
    };

    const resizeObserver = typeof ResizeObserver === 'function'
        ? new ResizeObserver(handleResize)
        : null;
    resizeObserver?.observe(root);
    window.addEventListener('resize', handleResize, { passive: true });

    requestAnimationFrame(() => {
        handleResize();
        if (reducedMotion) {
            return;
        }
        animationFrame = requestAnimationFrame(tick);
    });

    return dispose;
}
