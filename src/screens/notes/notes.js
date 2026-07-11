// ============================================
// Notes Screen
// ============================================

import { stateManager } from '../../engine/stateManager.js';

const LARKS_MAP_UPDATE_TEXT = '18:37 — карта обновлена\n\nКАРТА\n• Larks: Харпер была там с Оливией за четыре дня до исчезновения.\n• Riverwalk: на следующий день Миа встретила Харпер у старого моста.\n\nОБЩАЯ ДЕТАЛЬ\n• На фото из Larks виден тёмно-зелёный седан.\n• Позже Харпер спрашивала Мию о похожей машине возле моста.\n\nПОКА НЕЯСНО\n• Это один и тот же седан?\n• Почему Харпер не хотела идти домой?\n• Кому она написала с телефона Мии?\n\nСЛЕДУЮЩЕЕ\n\nМиа вечером проверит старый телефон.';

export function renderNotes({ onBack }) {
    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'height:100%;display:flex;flex-direction:column;';

    normalizeExistingNotes();
    consumePendingNote();

    const unlockedNotes = stateManager.get('unlockedNotes') || [];
    const notesMap = stateManager.get('notes') || {};
    const notes = unlockedNotes.map(id => notesMap[id]).filter(Boolean);

    const list = document.createElement('div');
    list.className = 'notes-list';

    if (!notes.length) {
        list.innerHTML = `
            <div style="padding:60px 24px;text-align:center;color:var(--text-muted);font-size:14px;">
                Пока пусто...
                <span style="font-size:12px;margin-top:8px;display:block;">Заметки появятся по мере прохождения</span>
            </div>
        `;
    } else {
        for (const note of notes) {
            list.appendChild(renderNoteCard(note));
        }
    }

    wrapper.innerHTML = `
        <div class="notes-header">
            <button class="messenger-back-btn" id="notes-back">←</button>
            <span class="notes-title">Заметки</span>
            <div style="width:36px;"></div>
        </div>
    `;
    wrapper.appendChild(list);

    wrapper.querySelector('#notes-back').addEventListener('click', onBack);

    fragment.appendChild(wrapper);
    return fragment;
}

function normalizeExistingNotes() {
    const notesMap = stateManager.get('notes') || {};
    const introNote = notesMap.harper_intro_summary;
    if (!introNote?.text || !introNote.text.includes('18:37 — Обновление')) return;

    const dividerIndex = introNote.text.indexOf('────────────');
    const updateIndex = introNote.text.indexOf('18:37 — Обновление');
    const replaceFrom = dividerIndex >= 0 ? dividerIndex : updateIndex;
    const previousText = introNote.text.slice(0, replaceFrom).trimEnd();
    const text = previousText ? `${previousText}\n\n${LARKS_MAP_UPDATE_TEXT}` : LARKS_MAP_UPDATE_TEXT;

    stateManager.setNote(introNote.id || 'harper_intro_summary', {
        ...introNote,
        text,
        autoTyping: false,
        typedStart: undefined
    });
}

function consumePendingNote() {
    const pendingNote = stateManager.get('flags')?.pendingNote;
    if (!pendingNote) {
        if (stateManager.hasFlag('notesUnread')) {
            stateManager.setFlag('notesUnread', false);
        }
        return;
    }

    const notesMap = stateManager.get('notes') || {};
    const targetId = pendingNote.appendTo || pendingNote.id || `note_${Date.now()}`;
    const existingNote = notesMap[targetId];
    const nextText = pendingNote.text || '';

    if (pendingNote.appendTo && existingNote) {
        const previousText = existingNote.text || '';
        const separator = previousText.trim() ? '\n\n' : '';
        stateManager.setNote(targetId, {
            ...existingNote,
            ...pendingNote,
            id: targetId,
            text: `${previousText}${separator}${nextText}`,
            autoTyping: true,
            typedStart: previousText.length + separator.length,
            appendTo: undefined
        });
    } else {
        const { id, ...note } = pendingNote;
        stateManager.setNote(targetId, {
            ...note,
            autoTyping: true,
            typedStart: 0
        });
    }

    stateManager.setFlag('pendingNote', null);
    stateManager.setFlag('notesUnread', false);
}

function renderNoteCard(note) {
    const card = document.createElement('div');
    card.className = `note-card ${note.type || 'story'}`;

    const title = document.createElement('div');
    title.className = 'note-card-title';
    title.textContent = note.title || 'Заметка';

    const text = document.createElement('div');
    text.className = 'note-card-text';

    const time = document.createElement('div');
    time.className = 'note-card-time';
    time.textContent = note.time || '';

    card.appendChild(title);
    card.appendChild(text);
    card.appendChild(time);

    if (note.autoTyping) {
        typeText(text, note.text || '', () => {
            text.classList.add('is-formatted');
            text.innerHTML = formatNoteText(note.text || '');
            stateManager.setNote(note.id, {
                ...note,
                autoTyping: false,
                typedStart: undefined
            });
            if (note.completeFlag) {
                stateManager.setFlag(note.completeFlag, true);
            }
        }, note.typedStart || 0);
    } else {
        text.classList.add('is-formatted');
        text.innerHTML = formatNoteText(note.text || '');
    }

    return card;
}

function formatNoteText(rawText) {
    const blocks = String(rawText || '')
        .replace(/─{3,}/g, '')
        .split(/\n{2,}/)
        .map(block => block.trim())
        .filter(Boolean);

    return blocks.map(block => {
        if (isHeading(block)) {
            return `<h3>${escapeHtml(block)}</h3>`;
        }

        if (block.includes('\n•') || block.startsWith('•')) {
            const items = block
                .split('\n')
                .map(line => line.trim())
                .filter(Boolean);

            const leading = [];
            const bullets = [];
            for (const item of items) {
                if (item.startsWith('•')) {
                    bullets.push(item.replace(/^•\s*/, ''));
                } else {
                    leading.push(item);
                }
            }

            return `
                ${leading.map(line => `<p>${escapeHtml(line)}</p>`).join('')}
                ${bullets.length ? `<ul>${bullets.map(line => `<li>${escapeHtml(line)}</li>`).join('')}</ul>` : ''}
            `;
        }

        return `<p>${escapeHtml(block)}</p>`;
    }).join('');
}

function isHeading(value) {
    if (value.length > 42) return false;
    if (value.includes('.') || value.includes('?')) return false;
    return /^[А-ЯЁA-Z0-9\s—:-]+$/.test(value);
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function typeText(element, fullText, onComplete, startIndex = 0) {
    let index = Math.max(0, Math.min(startIndex, fullText.length));
    element.textContent = fullText.slice(0, index);

    const tick = () => {
        index += 1;
        element.textContent = fullText.slice(0, index);
        if (index < fullText.length) {
            const char = fullText[index - 1];
            const delay = char === '\n' ? 90 : char === '.' ? 70 : 24;
            setTimeout(tick, delay);
        } else if (onComplete) {
            onComplete();
        }
    };

    if (index >= fullText.length) {
        if (onComplete) onComplete();
        return;
    }

    setTimeout(tick, 260);
}
