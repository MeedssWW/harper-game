// ============================================
// Screen Manager — Navigation between screens
// ============================================

class ScreenManager {
    constructor(container) {
        this.container = container;
        this.screens = new Map();
        this.history = [];
        this.currentScreen = null;
    }

    register(id, renderFn) {
        this.screens.set(id, renderFn);
    }

    async navigate(screenId, params = {}, addToHistory = true) {
        if (navigator.vibrate && this.currentScreen) navigator.vibrate(5);
        // Remove active class from ALL current screens
        const currentEls = this.container.querySelectorAll('.screen.active');
        currentEls.forEach(el => {
            el.classList.remove('active');
            el.classList.add('exit-left');
            setTimeout(() => {
                if (el.parentNode === this.container) {
                    this.container.removeChild(el);
                }
            }, 300);
        });

        if (addToHistory && this.currentScreen) {
            this.history.push(this.currentScreen);
        }

        this.currentScreen = { id: screenId, params };

        // Render new screen
        const renderFn = this.screens.get(screenId);
        if (renderFn) {
            const screenEl = document.createElement('div');
            screenEl.className = `screen ${screenId}-screen`;
            screenEl.id = `screen-${screenId}`;
            
            try {
                const content = await renderFn(params);
                if (typeof content === 'string') {
                    screenEl.innerHTML = content;
                } else if (content instanceof Node) {
                    screenEl.appendChild(content);
                }
            } catch (err) {
                console.error(`Error rendering screen "${screenId}":`, err);
                screenEl.innerHTML = `<div style="padding:40px;color:#ff7b87;text-align:center;">Не удалось открыть экран: ${err.message}</div>`;
            }

            this.container.appendChild(screenEl);

            // Force reflow for animation
            screenEl.offsetHeight;
            
            requestAnimationFrame(() => {
                screenEl.classList.add('active');
            });
        }
    }

    back() {
        if (this.history.length > 0) {
            const prev = this.history.pop();
            this.navigate(prev.id, prev.params, false);
        }
    }

    getCurrentScreen() {
        return this.currentScreen;
    }
}

export const screenManager = new ScreenManager(
    document.getElementById('screen-container')
);
