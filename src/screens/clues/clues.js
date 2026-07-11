import { stateManager } from '../../engine/stateManager.js';

const CLUES = [];
const THEORIES = [];

export function renderClues({ onBack }) {
    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement('div');
    wrapper.className = 'invest-app clues-app';

    const unlocked = new Set(stateManager.get('unlockedNotes') || []);
    const visibleClues = CLUES.filter(clue => unlocked.has(clue.id));
    const boardReady = visibleClues.length >= 2;

    wrapper.innerHTML = `
        <div class="invest-header">
            <button class="messenger-back-btn" id="clues-back">←</button>
            <span>Доска</span>
            <div style="width:36px;"></div>
        </div>
        <div class="clues-summary">
            <strong>${visibleClues.length}</strong>
            <span>материала на доске</span>
        </div>
        ${boardReady ? `
            <div class="clues-board">
                ${visibleClues.map(clue => `
                    <button class="clue-node" data-clue="${clue.id}">
                        <small>${clue.tag}</small>
                        <strong>${clue.title}</strong>
                        <span>${clue.text}</span>
                    </button>
                `).join('')}
            </div>
        ` : `
            <div class="clues-empty-board">
                <strong>Пока нечего связывать</strong>
                <span>Доска оживет, когда появятся хотя бы две настоящие улики.</span>
            </div>
        `}
        <div class="theory-panel" id="theory-panel">
            <div class="theory-title">${boardReady ? 'Выберите две открытые улики' : 'Связей пока нет'}</div>
            <p>${boardReady ? 'Если связь важная, здесь появится новая версия событий.' : 'Соберите больше фактов через переписки, карту, ленту и браузер.'}</p>
        </div>
    `;

    const selected = new Set();
    const panel = wrapper.querySelector('#theory-panel');

    wrapper.querySelector('#clues-back').addEventListener('click', onBack);
    wrapper.querySelectorAll('.clue-node').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.clue;
            if (selected.has(id)) {
                selected.delete(id);
                button.classList.remove('selected');
            } else {
                if (selected.size >= 2) {
                    selected.clear();
                    wrapper.querySelectorAll('.clue-node.selected').forEach(node => node.classList.remove('selected'));
                }
                selected.add(id);
                button.classList.add('selected');
            }
            renderTheory([...selected], panel);
        });
    });

    fragment.appendChild(wrapper);
    return fragment;
}

function renderTheory(selected, panel) {
    if (selected.length < 2) {
        panel.innerHTML = '<div class="theory-title">Выберите две открытые улики</div><p>Если связь важная, здесь появится новая версия событий.</p>';
        return;
    }

    const theory = THEORIES.find(item => item.ids.every(id => selected.includes(id)));
    if (!theory) {
        panel.innerHTML = '<div class="theory-title">Связь слабая</div><p>Эти улики могут быть рядом по времени, но пока не дают новой версии.</p>';
        return;
    }

    if (stateManager.hasFlag('lizaPhoneUnlocked')) {
        stateManager.setFlag(`theory_${theory.ids.join('_')}`, true);
    }
    panel.innerHTML = `<div class="theory-title">${theory.title}</div><p>${theory.text}</p>`;
}
