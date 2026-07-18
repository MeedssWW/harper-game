// ============================================
// AMNESIA — Main Application Entry Point
// ============================================

import { stateManager } from './src/engine/stateManager.js';
import { storyEngine } from './src/engine/storyEngine.js?v=122';
import { screenManager } from './src/screens/screenManager.js';
import { renderLockScreen } from './src/screens/lockScreen.js?v=70';
import { renderBootScreen } from './src/screens/bootScreen.js?v=125';
import { renderNameScreen } from './src/screens/nameScreen.js?v=126';
import { renderHomeScreen } from './src/screens/homeScreen.js?v=140';
import { CHATS, renderChatList } from './src/screens/messenger/chatList.js?v=128';
import { ChatView } from './src/screens/messenger/chatView.js?v=129';
import { renderTransitionScreen } from './src/screens/transitionScreen.js?v=70';
import { renderContactList, renderContactProfile } from './src/screens/contacts/contacts.js?v=126';
import { renderGallery } from './src/screens/gallery/gallery.js?v=126';
import { renderNotes } from './src/screens/notes/notes.js?v=126';
import { renderMap } from './src/screens/map/map.js?v=126';
import { renderMiaPhone } from './src/screens/miaPhone/miaPhone.js?v=145';
import { renderBrowser } from './src/screens/browser/browser.js?v=126';
import { renderSocial } from './src/screens/social/social.js?v=151';
import { renderClues } from './src/screens/clues/clues.js?v=126';
import { renderCaseIntroTask } from './src/screens/caseFile/caseIntroTask.js?v=127';
import { renderFrameAnalysis } from './src/screens/frameAnalysis/frameAnalysis.js?v=126';
import { renderLizaPhone } from './src/screens/lizaPhone/lizaPhone.js?v=126';
import { renderSettings } from './src/screens/settings/settings.js?v=143';
import { renderUnknownCall } from './src/screens/call/unknownCall.js?v=126';
import { renderPoliceDecision } from './src/screens/policeDecision/policeDecision.js?v=70';
import { renderChapterEnd } from './src/screens/chapterEnd/chapterEnd.js?v=141';
import { audioEngine } from './src/engine/audioEngine.js?v=124';
import { characters } from './src/data/characters.js?v=124';
import { chapter1 } from './src/data/chapter1.js?v=147';
import { chapter2 } from './src/data/chapter2Opening.js?v=6';

// ---- App State ----
let activeChatView = null;
let currentViewingChat = null;

const STORY_CONTINUATION_FLAGS = new Set([
    'nextMorningUnlocked',
    'ravenwoodMapAddedToCase',
    'remoteSessionInterrupted',
    'ravenFeedOpened',
    'viralPostOpened',
    'unknownOfflineAfterCall',
    'unknownCallNoteWritten',
    'callDispositionChosen',
    'stickerStillAddedToCase',
    'derekConversationUnlocked',
    'policeLeadRouteMason',
    'policeLeadRouteAnonymous',
    'policeLeadRouteDerek',
    'policeAnonymousTipSent',
    'ravenwatchPostPublished'
]);

function getActiveChapter() {
    return stateManager.hasFlag('chapter2Started') ? chapter2 : chapter1;
}

// ---- Initialize ----
function init() {
    document.documentElement.dataset.harperReady = 'true';
    document.querySelector('.boot-error')?.remove();

    updateStatusBarTime();
    setInterval(updateStatusBarTime, 30000);

    // Initialize character loyalty
    stateManager.initLoyalty(characters);

    // Register all screens
    registerScreens();

    // Setup story engine callbacks
    setupStoryEngine();
    setupInvestigationCallbacks();

    // Always begin with the branded audio/visual handshake.
    document.body.classList.add('harper-booting');
    screenManager.navigate('boot', {
        resume: Boolean(stateManager.get('started') && stateManager.getPlayerName())
    }, false);

    // Unlock browser audio on first interaction.
    const startAudio = () => {
        audioEngine.unlock();
        if (screenManager.getCurrentScreen()?.id !== 'boot') {
            audioEngine.playBGM();
        }
        document.removeEventListener('click', startAudio);
        document.removeEventListener('touchstart', startAudio);
        document.removeEventListener('keydown', startAudio);
    };
    document.addEventListener('click', startAudio);
    document.addEventListener('touchstart', startAudio);
    document.addEventListener('keydown', startAudio);
}

function setupInvestigationCallbacks() {
    stateManager.on('flag', ({ flag, value }) => {
        if (!value || !STORY_CONTINUATION_FLAGS.has(flag)) return;
        storyEngine.loadAct(getActiveChapter());
        setTimeout(() => storyEngine.start(), 350);
    });
}

// ---- Register Screens ----
function registerScreens() {
    screenManager.register('boot', (params = {}) => {
        return renderBootScreen({
            onBegin: () => audioEngine.playBootSequence(),
            onComplete: () => {
                document.body.classList.remove('harper-booting');
                audioEngine.finishBootSequence();
                if (params.resume) {
                    screenManager.navigate('home', {}, false);
                    storyEngine.loadAct(getActiveChapter());
                    setTimeout(() => storyEngine.start(), 900);
                } else {
                    screenManager.navigate('lock', {}, false);
                }
            }
        });
    });

    // Lock Screen
    screenManager.register('lock', () => {
        return renderLockScreen(() => {
            if (stateManager.getPlayerName() && stateManager.get('started')) {
                screenManager.navigate('home');
            } else {
                screenManager.navigate('name');
            }
        });
    });

    // Name Input Screen
    screenManager.register('name', () => {
        return renderNameScreen((name) => {
            stateManager.setPlayerName(name);
            stateManager.setStarted(true);
            
            // Unlock initial content
            stateManager.unlock('chats', 'private_derek');
            
            screenManager.navigate('home');

            // Start the story!
            storyEngine.loadAct(chapter1);
            setTimeout(() => storyEngine.start(), 2000);
        });
    });

    // Home Screen
    screenManager.register('home', () => {
        return renderHomeScreen({
            onAppOpen: (app) => {
                switch (app) {
                    case 'messenger':
                        screenManager.navigate('chatList');
                        break;
                    case 'contacts':
                        screenManager.navigate('contacts');
                        break;
                    case 'gallery':
                        screenManager.navigate('gallery');
                        break;
                    case 'notes':
                        if (stateManager.hasFlag('notesMechanicPending') && !stateManager.hasFlag('caseIntroCompleted')) {
                            screenManager.navigate('caseIntroTask');
                        } else {
                            screenManager.navigate('notes');
                        }
                        break;
                    case 'map':
                        screenManager.navigate('map');
                        break;
                    case 'browser':
                        screenManager.navigate('browser');
                        break;
                    case 'settings':
                        screenManager.navigate('settings');
                        break;
                    case 'social':
                        screenManager.navigate('social');
                        break;
                    case 'clues':
                        screenManager.navigate('clues');
                        break;
                    case 'caseFile':
                        screenManager.navigate('caseIntroTask');
                        break;
                    case 'lizaPhone':
                        screenManager.navigate('lizaPhone');
                        break;
                }
            }
        });
    });

    // Chat List
    screenManager.register('chatList', () => {
        return renderChatList({
            onChatOpen: (chatId) => {
                screenManager.navigate('chat', { chatId });
            },
            onBack: () => screenManager.navigate('home')
        });
    });

    screenManager.register('transition', renderTransitionScreen);

    // Chat View
    screenManager.register('chat', (params) => {
        const container = document.createElement('div');
        container.style.cssText = 'height:100%;display:flex;flex-direction:column;';

        // Clean up previous chat view
        if (activeChatView) {
            activeChatView.destroy();
        }

        activeChatView = new ChatView(params.chatId, container, () => {
            activeChatView.destroy();
            activeChatView = null;
            currentViewingChat = null;
            screenManager.navigate('chatList');
        }, (message) => {
            if (message?.documentId === 'ravenwood_map') {
                activeChatView.destroy();
                activeChatView = null;
                currentViewingChat = null;
                screenManager.navigate('map', { sourceChatId: params.chatId });
            } else if (message?.documentId === 'mia_remote_access') {
                activeChatView.destroy();
                activeChatView = null;
                currentViewingChat = null;
                screenManager.navigate('miaPhone', { sourceChatId: params.chatId });
            } else if (message?.documentId === 'ravenfeed_invite') {
                activeChatView.destroy();
                activeChatView = null;
                currentViewingChat = null;
                screenManager.navigate('social');
            } else if (message?.documentId === 'ravenfeed_city_guide') {
                activeChatView.destroy();
                activeChatView = null;
                currentViewingChat = null;
                stateManager.setFlag('openRavenFeedCityGuide', true);
                screenManager.navigate('social');
            } else if (message?.analysisAction === 'frame_analysis') {
                activeChatView.destroy();
                activeChatView = null;
                currentViewingChat = null;
                screenManager.navigate('frameAnalysis', { sourceChatId: params.chatId });
            }
        });

        currentViewingChat = params.chatId;
        activeChatView.render();

        return container;
    });

    // Contacts List
    screenManager.register('contacts', () => {
        return renderContactList({
            onContactOpen: (charId) => {
                screenManager.navigate('contactProfile', { characterId: charId });
            },
            onBack: () => screenManager.navigate('home')
        });
    });

    // Contact Profile
    screenManager.register('contactProfile', (params) => {
        return renderContactProfile({
            characterId: params.characterId,
            onBack: () => screenManager.navigate('contacts')
        });
    });

    // Gallery
    screenManager.register('gallery', () => {
        return renderGallery({
            onBack: () => screenManager.navigate('home')
        });
    });

    // Notes
    screenManager.register('notes', () => {
        return renderNotes({
            onBack: () => screenManager.navigate('home')
        });
    });

    screenManager.register('map', (params = {}) => {
        return renderMap({
            mode: params.mode || (params.sourceChatId ? 'task' : 'viewer'),
            onBack: () => params.sourceChatId
                ? screenManager.navigate('chat', { chatId: params.sourceChatId })
                : screenManager.navigate('home'),
            onDone: () => params.sourceChatId
                ? screenManager.navigate('chat', { chatId: params.sourceChatId })
                : screenManager.navigate('chatList')
        });
    });

    screenManager.register('miaPhone', () => {
        return renderMiaPhone({
            onDone: () => screenManager.navigate('chatList')
        });
    });

    screenManager.register('browser', () => {
        return renderBrowser({
            onBack: () => screenManager.navigate('home')
        });
    });

    screenManager.register('settings', () => {
        return renderSettings({
            onBack: () => screenManager.navigate('home')
        });
    });

    screenManager.register('social', () => {
        return renderSocial({
            onBack: () => screenManager.navigate('home')
        });
    });

    screenManager.register('clues', () => {
        return renderClues({
            onBack: () => screenManager.navigate('home')
        });
    });

    screenManager.register('caseIntroTask', () => {
        if (activeChatView) {
            activeChatView.destroy();
            activeChatView = null;
        }
        currentViewingChat = null;

        return renderCaseIntroTask({
            onDone: () => screenManager.navigate('home'),
            onFrameAnalysis: () => screenManager.navigate('frameAnalysis', { sourceScreen: 'caseIntroTask' })
        });
    });

    screenManager.register('frameAnalysis', (params = {}) => {
        if (activeChatView) {
            activeChatView.destroy();
            activeChatView = null;
        }
        currentViewingChat = null;

        return renderFrameAnalysis({
            onDone: () => {
                if (params.sourceChatId) {
                    screenManager.navigate('chat', { chatId: params.sourceChatId });
                } else if (params.sourceScreen) {
                    screenManager.navigate(params.sourceScreen);
                } else {
                    screenManager.navigate('home');
                }
            }
        });
    });

    screenManager.register('lizaPhone', () => {
        return renderLizaPhone({
            onBack: () => screenManager.navigate('home')
        });
    });

    screenManager.register('unknownCall', () => {
        if (activeChatView) {
            activeChatView.destroy();
            activeChatView = null;
        }
        currentViewingChat = null;

        return renderUnknownCall({
            onDone: () => screenManager.navigate('home')
        });
    });

    screenManager.register('policeDecision', (params = {}) => {
        if (activeChatView) {
            activeChatView.destroy();
            activeChatView = null;
        }
        currentViewingChat = null;

        return renderPoliceDecision({
            mode: params.mode,
            onDone: () => screenManager.navigate('chatList')
        });
    });

    screenManager.register('chapterEnd', () => {
        if (activeChatView) {
            activeChatView.destroy();
            activeChatView = null;
        }
        currentViewingChat = null;

        return renderChapterEnd({
            onDone: () => {
                stateManager.setFlag('chapter2Started', true);
                screenManager.navigate('home');
                storyEngine.loadAct(chapter2);
                setTimeout(() => storyEngine.start(), 700);
            }
        });
    });
}

// ---- Story Engine Callbacks ----
function setupStoryEngine() {
    // When a new message arrives
    storyEngine.onMessage = (chatId, message) => {
        if (currentViewingChat === chatId && shouldPlayMessageSound(message)) {
            audioEngine.playMessage();
        }

        // If we're viewing this chat, add message to view
        if (currentViewingChat === chatId && activeChatView) {
            activeChatView.addMessage(message, true);
            stateManager.markChatRead(chatId);
        }

        const currentScreen = screenManager.getCurrentScreen();
        if (currentScreen?.id === 'chatList') {
            window.dispatchEvent(new CustomEvent('harper:chat-list-refresh'));
        }
    };

    // When typing indicator should show/hide
    storyEngine.onTyping = (chatId, characterId, show) => {
        if (currentViewingChat === chatId && activeChatView) {
            if (show) {
                activeChatView.showTyping(characterId);
            } else {
                activeChatView.removeTyping();
            }
        }
    };

    // When choices are presented
    storyEngine.onChoice = (chatId, options, beatId, onChoose) => {
        if (currentViewingChat === chatId && activeChatView) {
            activeChatView.showChoices(options, onChoose);
        } else {
            audioEngine.playNotification();
            showNotificationToast('SMS', 'Нужен твой ответ', { chatId });
        }
    };

    // When a beat completes
    storyEngine.onBeatComplete = (beatId) => {
        // Refresh the current screen to update UI
        console.log(`Beat completed: ${beatId}`);
    };

    // When something unlocks
    storyEngine.onUnlock = (type, id) => {
        console.log(`Unlocked ${type}: ${id}`);
        // Unlocks are silent; actual incoming messages show the SMS banner.
        const currentScreen = screenManager.getCurrentScreen();
        if (type === 'chats' && currentScreen?.id === 'chatList') {
            window.dispatchEvent(new CustomEvent('harper:chat-list-refresh'));
        }
    };

    storyEngine.onLock = (type, id) => {
        console.log(`Locked ${type}: ${id}`);
        if (type === 'chats' && currentViewingChat === id) {
            if (activeChatView) {
                activeChatView.destroy();
                activeChatView = null;
            }
            currentViewingChat = null;
            screenManager.navigate('chatList');
        }
    };

    storyEngine.onNavigate = (screenId, params = {}) => {
        if (activeChatView) {
            activeChatView.destroy();
            activeChatView = null;
        }
        currentViewingChat = null;
        screenManager.navigate(screenId, params);
    };

    // Notification for messages not in current view
    storyEngine.onNotification = (from, text, chatId) => {
        if (currentViewingChat !== chatId) {
            // getCharacter is already imported at the top of this file
            import('./src/data/characters.js?v=124').then(({ getCharacter: gc }) => {
                const char = gc(from);
                const displayName = char ? char.name : from;
                audioEngine.playNotification();
                showNotificationToast('SMS', `${displayName}: ${formatNotificationText(text)}`, { chatId });
            });
        }
    };

    storyEngine.onAppNotification = (title, text, options = {}) => {
        audioEngine.playNotification();
        showNotificationToast(title, text, options);
    };

    // Glitch effect
    storyEngine.onGlitch = () => {
        triggerGlitch();
    };

    // Narrator
    storyEngine.onNarrator = (chatId, text) => {
        if (currentViewingChat === chatId && activeChatView) {
            // Already handled by onMessage
        }
    };
}

function shouldPlayMessageSound(message) {
    if (!message) return false;
    if (message.from === 'player' || message.from === 'gg') return false;
    return !['system', 'narrator', 'deleted'].includes(message.type);
}

// ---- Notification Toast ----
let notificationTimer = null;
let notificationHideTimer = null;
let lastNotificationKey = '';
let lastNotificationAt = 0;

function showNotificationToast(title, text, options = {}) {
    const toast = document.getElementById('notification-toast');
    if (!toast) return;

    const now = Date.now();
    const notificationKey = `${title}|${text}|${options.chatId || ''}|${options.app || ''}`;
    if (notificationKey === lastNotificationKey && now - lastNotificationAt < 1600) {
        return;
    }
    lastNotificationKey = notificationKey;
    lastNotificationAt = now;

    if (notificationHideTimer) {
        clearTimeout(notificationHideTimer);
        notificationHideTimer = null;
    }

    toast.querySelector('.notif-title').textContent = title;
    toast.querySelector('.notif-text').textContent = text;
    toast.classList.remove('hidden');

    // Force reflow
    toast.offsetHeight;
    toast.classList.add('visible');

    if (notificationTimer) {
        clearTimeout(notificationTimer);
        notificationTimer = null;
    }

    toast.onclick = () => {
        hideNotificationToast();
        if (options.chatId) {
            openChatFromNotification(options.chatId);
        } else if (options.app) {
            openAppFromNotification(options.app, options);
        }
    };

    // Auto-hide after 4 seconds
    notificationTimer = setTimeout(() => {
        hideNotificationToast();
    }, 4000);
}

function hideNotificationToast() {
    const toast = document.getElementById('notification-toast');
    if (!toast) return;

    if (notificationTimer) {
        clearTimeout(notificationTimer);
        notificationTimer = null;
    }

    toast.classList.remove('visible');
    notificationHideTimer = setTimeout(() => {
        toast.classList.add('hidden');
        notificationHideTimer = null;
    }, 500);
    toast.onclick = null;
}

function openChatFromNotification(chatId) {
    if (!chatId) return;
    const unlockedChats = stateManager.get('unlockedChats') || [];
    if (!unlockedChats.includes(chatId) || !CHATS[chatId]) return;
    if (currentViewingChat === chatId && activeChatView) return;

    screenManager.navigate('chat', { chatId });
}

function openAppFromNotification(appId, options = {}) {
    if (!appId) return;
    if (activeChatView) {
        activeChatView.destroy();
        activeChatView = null;
    }
    currentViewingChat = null;
    if (appId === 'social' && options.view === 'requests') {
        stateManager.setFlag('openRavenFeedRequests', true);
    }
    screenManager.navigate(appId);
}

function formatNotificationText(text) {
    if (!text) return '';
    return text.length > 58 ? `${text.slice(0, 57).trim()}...` : text;
}

// ---- Glitch Effect ----
function triggerGlitch() {
    const overlay = document.getElementById('glitch-overlay');
    if (!overlay) return;
    
    overlay.classList.remove('hidden');
    overlay.classList.add('active');
    
    // Also shake the phone frame
    const phone = document.getElementById('phone-frame');
    if (phone) {
        phone.style.animation = 'screenShake 0.3s linear';
        setTimeout(() => {
            phone.style.animation = '';
        }, 300);
    }
    
    setTimeout(() => {
        overlay.classList.remove('active');
        overlay.classList.add('hidden');
    }, 300);
}

// ---- Status Bar ----
function updateStatusBarTime() {
    const el = document.getElementById('status-time');
    if (el) {
        const now = new Date();
        el.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }
}

// ---- Start ----
document.addEventListener('DOMContentLoaded', init);


