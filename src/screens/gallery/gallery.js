// ============================================
// Gallery Screen
// ============================================

import { stateManager } from '../../engine/stateManager.js';

const GALLERY_ITEMS = [];

export function renderGallery({ onBack }) {
    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'height:100%;display:flex;flex-direction:column;';

    const unlockedGallery = stateManager.get('unlockedGallery') || [];

    let gridHTML = '';
    for (const item of GALLERY_ITEMS) {
        const unlocked = unlockedGallery.includes(item.id);
        const contentHtml = item.src
            ? `<img src="${item.src}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:10px;" />`
            : `<span style="font-size:36px;">${item.emoji}</span>`;

        gridHTML += `
            <div class="gallery-item ${unlocked ? '' : 'locked'}" data-id="${item.id}" data-unlocked="${unlocked}">
                ${unlocked ? contentHtml : `<span style="font-size:36px;filter:blur(4px);">${item.emoji || '❔'}</span><span class="lock-icon" style="filter:none;">🔒</span>`}
            </div>
        `;
    }

    wrapper.innerHTML = `
        <div class="gallery-header">
            <button class="messenger-back-btn" id="gallery-back">←</button>
            <span class="gallery-title">Галерея</span>
            <div style="width:36px;"></div>
        </div>
        <div class="gallery-grid">
            ${gridHTML}
        </div>
    `;

    wrapper.querySelector('#gallery-back').addEventListener('click', onBack);

    wrapper.querySelectorAll('.gallery-item[data-unlocked="true"]').forEach(el => {
        el.addEventListener('click', () => {
            const item = GALLERY_ITEMS.find(i => i.id === el.dataset.id);
            if (item) showPhotoModal(wrapper, item);
        });
    });

    fragment.appendChild(wrapper);
    return fragment;
}

function showPhotoModal(container, item) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position:absolute;top:0;left:0;width:100%;height:100%;
        background:rgba(0,0,0,0.9);z-index:50;
        display:flex;flex-direction:column;align-items:center;justify-content:center;
        padding:32px;animation:fadeIn 0.3s ease;cursor:pointer;
    `;

    const imageHtml = item.src
        ? `<img src="${item.src}" alt="" style="width:100%;max-height:60vh;object-fit:contain;margin-bottom:24px;border-radius:12px;" />`
        : `<div style="font-size:72px;margin-bottom:24px;">${item.emoji}</div>`;

    modal.innerHTML = `
        ${imageHtml}
        <div style="font-size:18px;font-weight:600;color:var(--text-primary);margin-bottom:12px;text-align:center;">${item.title}</div>
        <div style="font-size:14px;color:var(--text-secondary);text-align:center;line-height:1.6;max-width:280px;">${item.description}</div>
        <div style="margin-top:32px;font-size:12px;color:var(--text-muted);">Нажмите, чтобы закрыть</div>
    `;

    modal.addEventListener('click', () => {
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.3s';
        setTimeout(() => modal.remove(), 300);
    });
    container.appendChild(modal);
}
