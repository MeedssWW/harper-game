import { stateManager } from '../../engine/stateManager.js';

const ICON_ROOT = 'src/assets/icons/lucide';

const THEORIES = [
    {
        ids: ['fact_harper_larks_olivia', 'fact_green_sedan_question'],
        title: 'Машина появлялась рядом',
        text: 'Седан виден возле Larks, а на следующий день Харпер спрашивала о похожей машине у старого моста. Это повторение, но пока не доказательство слежки.'
    },
    {
        ids: ['clue_vid_1842_recovered', 'clue_still_1842_sticker'],
        title: 'В видео осталась зацепка',
        text: 'Вложение из удалённого чата связано со стоп-кадром седана. Выцветшая наклейка может помочь установить машину или место, куда она имела доступ.'
    },
    {
        ids: ['fact_harper_riverwalk_mia', 'thread_mia_old_phone'],
        title: 'Сообщение после встречи',
        text: 'Харпер была у старого моста с Мией и в тот же период воспользовалась её старым телефоном. Кому она писала, всё ещё неизвестно.'
    }
];

export function renderClues({ onBack }) {
    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement('div');
    wrapper.className = 'invest-app clues-app';

    const visibleClues = getVisibleClues();
    const boardReady = visibleClues.length >= 2;

    wrapper.innerHTML = `
        <div class="invest-header clues-header">
            <button class="messenger-back-btn clues-back-btn" id="clues-back" type="button" aria-label="Назад">${lucideIcon('chevron-left')}</button>
            <div class="clues-heading">
                <span>Доска материалов</span>
                <small>Сопоставляй только известное</small>
            </div>
            <span class="clues-header-icon" aria-hidden="true">${lucideIcon('search')}</span>
        </div>
        <div class="clues-summary" aria-label="Материалы на доске: ${visibleClues.length}">
            <span class="clues-summary-icon">${lucideIcon('file-text')}</span>
            <div><strong>${visibleClues.length}</strong><span>${formatMaterialCount(visibleClues.length)} на доске</span></div>
        </div>
        ${boardReady ? `
            <div class="clues-board" aria-label="Собранные материалы">
                ${visibleClues.map((clue, index) => renderClue(clue, index)).join('')}
            </div>
        ` : `
            <div class="clues-empty-board">
                <span class="clues-empty-icon">${lucideIcon('search')}</span>
                <strong>Пока нечего связывать</strong>
                <span>Доска оживёт, когда в деле появятся хотя бы два проверяемых материала.</span>
            </div>
        `}
        <div class="theory-panel ${boardReady ? '' : 'is-empty'}" id="theory-panel" role="status" aria-live="polite">
            <span class="theory-panel-icon">${lucideIcon(boardReady ? 'message-circle' : 'file-text')}</span>
            <div>
                <div class="theory-title">${boardReady ? 'Выбери два материала' : 'Связей пока нет'}</div>
                <p>${boardReady ? 'Сравни детали. Совпадение ещё не делает версию фактом.' : 'Новые материалы появятся после разговоров, карты и анализа файлов.'}</p>
            </div>
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
            } else {
                if (selected.size >= 2) {
                    selected.clear();
                    wrapper.querySelectorAll('.clue-node.selected').forEach(node => {
                        node.classList.remove('selected');
                        node.setAttribute('aria-pressed', 'false');
                    });
                }
                selected.add(id);
            }
            button.classList.toggle('selected', selected.has(id));
            button.setAttribute('aria-pressed', String(selected.has(id)));
            renderTheory([...selected], panel);
        });
    });

    fragment.appendChild(wrapper);
    return fragment;
}

function getVisibleClues() {
    const entries = stateManager.get('caseEntries') || [];
    return entries
        .filter(entry => ['fact', 'clue', 'thread'].includes(entry.type))
        .map(entry => ({
            id: entry.id,
            tag: getEntryTag(entry.type),
            title: entry.title || 'Материал',
            text: entry.text || '',
            type: entry.type
        }));
}

function renderClue(clue, index) {
    return `
        <button class="clue-node ${escapeHtml(clue.type)}" data-clue="${escapeHtml(clue.id)}" type="button" aria-pressed="false">
            <span class="clue-node-index">${String(index + 1).padStart(2, '0')}</span>
            <span class="clue-node-icon">${lucideIcon(getEntryIcon(clue.type))}</span>
            <span class="clue-node-copy">
                <small>${escapeHtml(clue.tag)}</small>
                <strong>${escapeHtml(clue.title)}</strong>
                <span>${escapeHtml(clue.text)}</span>
            </span>
            <i aria-hidden="true"></i>
        </button>
    `;
}

function renderTheory(selected, panel) {
    if (!panel) return;

    let title = 'Выбери ещё один материал';
    let text = 'Нужны две детали, чтобы проверить возможную связь.';
    let state = 'is-pending';
    let icon = 'message-circle';

    if (!selected.length) {
        title = 'Выбери два материала';
        text = 'Сравни детали. Совпадение ещё не делает версию фактом.';
        state = '';
    } else if (selected.length === 2) {
        const theory = THEORIES.find(item => item.ids.every(id => selected.includes(id)));
        if (theory) {
            title = theory.title;
            text = theory.text;
            state = 'is-match';
            icon = 'check-check';
        } else {
            title = 'Прямой связи пока нет';
            text = 'Эти материалы могут относиться к одному делу, но сами по себе не дают новой версии.';
            state = 'is-weak';
            icon = 'circle-alert';
        }
    }

    panel.className = `theory-panel ${state}`.trim();
    panel.innerHTML = `
        <span class="theory-panel-icon">${lucideIcon(icon)}</span>
        <div><div class="theory-title">${escapeHtml(title)}</div><p>${escapeHtml(text)}</p></div>
    `;
    panel.classList.remove('theory-pop');
    requestAnimationFrame(() => panel.classList.add('theory-pop'));
}

function getEntryTag(type) {
    if (type === 'fact') return 'Подтверждено';
    if (type === 'clue') return 'Деталь';
    return 'Нить';
}

function getEntryIcon(type) {
    if (type === 'fact') return 'search';
    if (type === 'clue') return 'image';
    return 'map';
}

function formatMaterialCount(count) {
    const last = count % 10;
    const lastTwo = count % 100;
    if (last === 1 && lastTwo !== 11) return 'материал';
    if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return 'материала';
    return 'материалов';
}

function lucideIcon(name) {
    const safeName = /^[a-z0-9-]+$/.test(name) ? name : 'file-text';
    return `<img class="clues-lucide-icon" src="${ICON_ROOT}/${safeName}.svg" alt="" aria-hidden="true">`;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
