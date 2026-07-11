import { stateManager } from '../../engine/stateManager.js';

const TIP_TEXT = `В ночь исчезновения Харпер Вэнс возле служебного въезда Северного двора могла находиться тёмно-зелёная машина.

В районе старой станции стоит проверить записи камер, шлагбаум и въезд на территорию.`;

export function renderPoliceDecision({ onDone, mode } = {}) {
    const wrapper = document.createElement('div');
    wrapper.className = 'police-decision-screen';

    const showDecision = () => {
        wrapper.innerHTML = `
            <section class="police-decision-panel">
                <div class="police-decision-kicker">Дело Харпер Вэнс</div>
                <h1>Передать информацию</h1>
                <p>У вас есть детали, которые могут помочь полиции проверить район старой станции.</p>

                <div class="police-decision-options">
                    <button class="police-route-card" data-route="mason" type="button">
                        <strong>Через Мейсона</strong>
                        <span>Он передаст информацию официально и проследит, чтобы никто не поехал туда сам.</span>
                    </button>
                    <button class="police-route-card" data-route="anonymous" type="button">
                        <strong>Анонимная наводка</strong>
                        <span>Полиция получит место и описание машины, но не узнает, откуда информация.</span>
                    </button>
                    <button class="police-route-card" data-route="derek" type="button">
                        <strong>Дерек расскажет сам</strong>
                        <span>Он признается, что ехал за Харпер и видел машину у шлагбаума.</span>
                    </button>
                </div>
            </section>
        `;

        wrapper.querySelectorAll('.police-route-card').forEach(button => {
            button.addEventListener('click', () => {
                const route = button.dataset.route;
                if (route === 'anonymous') {
                    stateManager.setFlag('policeLeadRoute', 'anonymous');
                    stateManager.setFlag('policeLeadRouteAnonymous', true);
                    if (onDone) onDone();
                    return;
                }
                if (route === 'mason') {
                    stateManager.setFlag('policeLeadRoute', 'mason');
                    stateManager.setFlag('policeLeadRouteMason', true);
                }
                if (route === 'derek') {
                    stateManager.setFlag('policeLeadRoute', 'derek');
                    stateManager.setFlag('policeLeadRouteDerek', true);
                }
                if (onDone) onDone();
            });
        });
    };

    const showAnonymousForm = () => {
        wrapper.innerHTML = `
            <section class="police-tip-panel">
                <div class="police-decision-kicker">Полиция Рейвенвуда</div>
                <h1>Сообщить информацию</h1>
                <textarea readonly>${TIP_TEXT}</textarea>
                <button id="send-anonymous-tip" type="button">Отправить анонимно</button>
            </section>
        `;

        wrapper.querySelector('#send-anonymous-tip')?.addEventListener('click', () => {
            stateManager.setFlag('policeAnonymousTipSent', true);
            if (onDone) onDone();
        });
    };

    if (mode === 'anonymousForm') {
        showAnonymousForm();
    } else {
        showDecision();
    }
    return wrapper;
}
