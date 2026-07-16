// ============================================
// Notes Screen
// ============================================

import { stateManager } from '../../engine/stateManager.js';

const ICON_ROOT = 'src/assets/icons/lucide';

const LARKS_MAP_UPDATE_TEXT = '18:37 — карта обновлена\n\nКАРТА\n• Larks: Харпер была там с Оливией за четыре дня до исчезновения.\n• Riverwalk: на следующий день Миа встретила Харпер у старого моста.\n\nОБЩАЯ ДЕТАЛЬ\n• На фото из Larks виден тёмно-зелёный седан.\n• Позже Харпер спрашивала Мию о похожей машине возле моста.\n\nПОКА НЕЯСНО\n• Это один и тот же седан?\n• Почему Харпер не хотела идти домой?\n• Кому она написала с телефона Мии?\n\nСЛЕДУЮЩЕЕ\n\nМиа вечером проверит старый телефон.';

export function renderNotes({ onBack }) {
    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement('div');
    wrapper.className = 'notes-shell';

    normalizeExistingNotes();
    consumePendingNote();

    const unlockedNotes = stateManager.get('unlockedNotes') || [];
    const notesMap = stateManager.get('notes') || {};
    const notes = unlockedNotes.map(id => notesMap[id]).filter(Boolean);

    const list = document.createElement('div');
    list.className = 'notes-list';

    if (!notes.length) {
        list.innerHTML = `
            <div class="notes-empty-state">
                <span class="notes-empty-icon">${lucideIcon('file-text')}</span>
                <strong>Здесь пока тихо</strong>
                <p>Новые записи появятся после важных разговоров и найденных деталей.</p>
            </div>
        `;
    } else {
        for (const note of notes) {
            list.appendChild(renderNoteCard(note));
        }
    }

    wrapper.innerHTML = `
        <div class="notes-header">
            <button class="messenger-back-btn notes-back-btn" id="notes-back" type="button" aria-label="Назад">${lucideIcon('chevron-left')}</button>
            <div class="notes-heading">
                <span class="notes-title">Заметки</span>
                <small>${formatNoteCount(notes.length)}</small>
            </div>
            <span class="notes-header-icon" aria-hidden="true">${lucideIcon('file-text')}</span>
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
    const type = normalizeNoteType(note.type);
    const meta = getNoteMeta(type);
    const card = document.createElement('article');
    card.className = `note-card ${type}`;

    const header = document.createElement('header');
    header.className = 'note-card-header';

    const icon = document.createElement('span');
    icon.className = 'note-card-icon';
    icon.innerHTML = lucideIcon(meta.icon);

    const heading = document.createElement('div');
    heading.className = 'note-card-heading';

    const title = document.createElement('h2');
    title.className = 'note-card-title';
    title.textContent = note.title || 'Заметка';

    const typeLabel = document.createElement('span');
    typeLabel.className = 'note-card-type';
    typeLabel.textContent = meta.label;

    heading.append(title, typeLabel);

    const text = document.createElement('div');
    text.className = 'note-card-text';
    text.setAttribute('aria-live', note.autoTyping ? 'polite' : 'off');

    const time = document.createElement('div');
    time.className = 'note-card-time';
    time.innerHTML = `${lucideIcon('calendar-days')}<span>${escapeHtml(note.time || 'Сохранено')}</span>`;

    header.append(icon, heading);
    card.appendChild(header);
    card.appendChild(text);
    card.appendChild(time);

    if (note.autoTyping) {
        card.classList.add('is-writing');
        typeText(text, note.text || '', () => {
            card.classList.remove('is-writing');
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

function normalizeNoteType(value) {
    return ['story', 'case', 'clue', 'memory'].includes(value) ? value : 'story';
}

function getNoteMeta(type) {
    if (type === 'case') return { label: 'Материалы дела', icon: 'search' };
    if (type === 'clue') return { label: 'Новая деталь', icon: 'image' };
    if (type === 'memory') return { label: 'Воспоминание', icon: 'message-circle' };
    return { label: 'Личная запись', icon: 'file-text' };
}

function formatNoteCount(count) {
    const last = count % 10;
    const lastTwo = count % 100;
    const word = last === 1 && lastTwo !== 11
        ? 'запись'
        : last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)
            ? 'записи'
            : 'записей';
    return `${count} ${word}`;
}

function lucideIcon(name) {
    const safeName = /^[a-z0-9-]+$/.test(name) ? name : 'file-text';
    return `<img class="notes-lucide-icon" src="${ICON_ROOT}/${safeName}.svg" alt="" aria-hidden="true">`;
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
        const remaining = fullText.length - index;
        const chunk = fullText.length > 1400 && remaining > 240 ? 3 : 1;
        index = Math.min(fullText.length, index + chunk);
        element.textContent = fullText.slice(0, index);
        if (index < fullText.length) {
            const char = fullText[index - 1];
            const delay = char === '\n' ? 44 : /[.!?]/.test(char) ? 34 : 13;
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
