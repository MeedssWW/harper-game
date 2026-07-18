const say = (from, text, delay = 760, extra = {}) => ({ from, text, delay, ...extra });
const choice = (text, next, extra = {}) => ({ text, next, loyalty: {}, ...extra });

export const chapter2OpeningBeats = [
  {
    id: 'ep2_feed_aftershock',
    chat: 'private_derek',
    trigger: 'flag:chapter2Started',
    setFlags: { episode2AftershockLive: true, ravenFeedRequestsLive: true },
    messages: [
      { type: 'pause', delay: 1100 },
      { type: 'app_notification', title: 'RavenFeed', text: 'Вас отметили в новых комментариях', options: { app: 'social' }, delay: 800 },
      { type: 'wait_flag', flag: 'ep2PublicResponseResolved', delay: 350 }
    ]
  },

  {
    id: 'ep2_mason_confronts',
    chat: 'private_mason',
    trigger: 'after:ep2_feed_aftershock',
    identify: ['mason'],
    messages: [
      { type: 'pause', delay: 900 },
      { type: 'system', text: 'Мейсон в сети.', delay: 350, characterStatus: { id: 'mason', online: true } },
      say('mason', 'Что ты сделал с Харпер?'),
      say('mason', 'И даже не начинай опять рассказывать, что ты её не знаешь.'),
      { type: 'choice', options: [
        choice('Да отвали ты от меня, Мейсон.', 'ep2_mason_back_off', { loyalty: { mason: -2 } }),
        choice('Я Харпер не трогал. Сколько раз ещё повторить?', 'ep2_mason_repeat'),
        choice('И что ты сделаешь, если найдёшь меня?', 'ep2_mason_challenge', { loyalty: { mason: -3 } }),
        choice('Заблокировать Мейсона.', 'ep2_mason_blocked', { sendMessage: false, setFlag: 'masonBlocked' })
      ] }
    ]
  },
  {
    id: 'ep2_mason_back_off',
    chat: 'private_mason',
    trigger: 'choice:ep2_mason_confronts:0',
    messages: [
      say('mason', 'Не отвалю.'),
      say('mason', 'После такого поста? Нет.')
    ]
  },
  {
    id: 'ep2_mason_repeat',
    chat: 'private_mason',
    trigger: 'choice:ep2_mason_confronts:1',
    messages: [
      say('mason', 'А вокруг тебя всё равно слишком много совпадений.'),
      say('mason', 'С её телефона отправили твой номер, а потом с твоего телефона вытащили фото.'),
      say('mason', 'Ты бы сам в это поверил?')
    ]
  },
  {
    id: 'ep2_mason_challenge',
    chat: 'private_mason',
    trigger: 'choice:ep2_mason_confronts:2',
    messages: [
      say('mason', 'Найду и спрошу уже не через экран.'),
      say('mason', 'Если ты хоть как-то к этому причастен, я всё равно узнаю.')
    ]
  },
  {
    id: 'ep2_mason_threat',
    chat: 'private_mason',
    trigger: 'after:ep2_mason_back_off|ep2_mason_repeat|ep2_mason_challenge',
    messages: [
      say('mason', 'Если выяснится, что ты был в Рейвенвуде и всё это время врал, я тебя найду.'),
      { type: 'choice', options: [
        choice('Я там не был. Можешь верить или нет.', 'ep2_mason_unmoved'),
        choice('Если ты пришёл только поугрожать, разговор закончен.', 'ep2_mason_done'),
        choice('Очень страшно.', 'ep2_mason_mock', { loyalty: { mason: -2 } }),
        choice('Заблокировать Мейсона.', 'ep2_mason_blocked', { sendMessage: false, setFlag: 'masonBlocked' })
      ] }
    ]
  },
  {
    id: 'ep2_mason_unmoved',
    chat: 'private_mason',
    trigger: 'choice:ep2_mason_threat:0',
    setFlags: { masonOpenlyHostile: true },
    messages: [say('mason', 'Посмотрим.'), { type: 'system', text: 'Мейсон не в сети.', delay: 420, characterStatus: { id: 'mason', online: false } }]
  },
  {
    id: 'ep2_mason_done',
    chat: 'private_mason',
    trigger: 'choice:ep2_mason_threat:1',
    setFlags: { masonOpenlyHostile: true },
    messages: [say('mason', 'Тогда закончен.'), { type: 'system', text: 'Мейсон не в сети.', delay: 420, characterStatus: { id: 'mason', online: false } }]
  },
  {
    id: 'ep2_mason_mock',
    chat: 'private_mason',
    trigger: 'choice:ep2_mason_threat:2',
    setFlags: { masonOpenlyHostile: true },
    messages: [say('mason', 'Зря смеёшься.'), { type: 'system', text: 'Мейсон не в сети.', delay: 420, characterStatus: { id: 'mason', online: false } }]
  },
  {
    id: 'ep2_mason_blocked',
    chat: 'private_mason',
    trigger: 'flag:masonBlocked',
    setFlags: { masonBlocked: true, masonOpenlyHostile: true },
    messages: [
      { type: 'system', text: 'Контакт «Мейсон Коул» заблокирован.', delay: 500 },
      { type: 'system', text: 'Мейсон не в сети.', delay: 300, characterStatus: { id: 'mason', online: false } }
    ]
  },

  {
    id: 'ep2_north_lot_claim',
    chat: 'private_mason',
    trigger: 'after:ep2_mason_unmoved|ep2_mason_done|ep2_mason_mock|ep2_mason_blocked',
    setFlags: { northLotClaimLive: true },
    messages: [
      { type: 'pause', delay: 1200 },
      { type: 'app_notification', title: 'Ravenwood Truth', text: 'Публикация обновлена: «Его видели у North Lot?»', options: { app: 'social' }, delay: 800 },
      { type: 'wait_flag', flag: 'northLotClaimOpened', delay: 350 }
    ]
  },
  {
    id: 'ep2_june_request',
    chat: 'private_mason',
    trigger: 'after:ep2_north_lot_claim',
    setFlags: { juneRequestLive: true },
    messages: [
      { type: 'pause', delay: 700 },
      { type: 'app_notification', title: 'RavenFeed · запрос', text: 'Джун Пак: фотография с North Lot старая', options: { app: 'social', view: 'requests' }, delay: 800 },
      { type: 'wait_flag', flag: 'northLotDebunked', delay: 350 }
    ]
  },

  {
    id: 'ep2_police_contact',
    chat: 'private_detective',
    trigger: 'after:ep2_june_request',
    identify: ['detective'],
    messages: [
      { type: 'pause', delay: 900 },
      { type: 'system', text: 'Подтверждённый служебный контакт.', delay: 350 },
      say('detective', 'Здравствуйте, {player}. Меня зовут Дэниел Рид, я занимаюсь делом Харпер Вэнс.'),
      say('detective', 'Ваш номер нам передал Дерек Миллер.'),
      say('detective', 'Нужно поговорить о сообщении с телефона Харпер и о сегодняшней публикации. Когда вам будет удобно принять звонок?'),
      { type: 'choice', options: [
        choice('Можете звонить сейчас.', 'ep2_police_call_now', { setFlag: 'policeCallRequested' }),
        choice('Сначала скажите, я в чём-то подозреваюсь?', 'ep2_police_status'),
        choice('Сейчас не могу. Напишите позже.', 'ep2_police_defer', { setFlag: 'policeCallDeferred' })
      ] }
    ]
  },
  {
    id: 'ep2_police_status',
    chat: 'private_detective',
    trigger: 'choice:ep2_police_contact:1',
    messages: [
      say('detective', 'Нет. Сейчас мы просто проверяем, почему ваш номер отправили с телефона Харпер.'),
      say('detective', 'И откуда Ravenwood Truth получил вашу фотографию.'),
      { type: 'choice', options: [
        choice('Ладно. Звоните.', 'ep2_police_call_now', { setFlag: 'policeCallRequested' }),
        choice('Тогда позже. Сейчас не могу говорить.', 'ep2_police_defer', { setFlag: 'policeCallDeferred' })
      ] }
    ]
  },
  {
    id: 'ep2_police_call_now',
    chat: 'private_detective',
    trigger: 'flag:policeCallRequested',
    messages: [
      say('detective', 'Хорошо. Сейчас наберу.'),
      { type: 'pause', delay: 500 },
      { type: 'navigate', screen: 'policeCall', delay: 400 },
      { type: 'wait_flag', flag: 'policeCallCompleted', delay: 300 }
    ]
  },
  {
    id: 'ep2_police_defer',
    chat: 'private_detective',
    trigger: 'flag:policeCallDeferred',
    setFlags: { policeCallDeferred: true },
    messages: [say('detective', 'Хорошо. Напишите сюда, когда сможете говорить.')]
  },

  {
    id: 'ep2_derek_checks_in',
    chat: 'private_derek',
    trigger: 'after:ep2_police_call_now|ep2_police_defer',
    messages: [
      { type: 'pause', delay: 850 },
      { type: 'system', text: 'Дерек в сети.', delay: 350, characterStatus: { id: 'derek', online: true } },
      say('derek', 'Ты видел, что пост про North Lot уже удалили?'),
      { type: 'choice', options: [
        choice('Видел. Мейсон перед этим уже успел мне поугрожать.', 'ep2_derek_mason'),
        choice('Видел. Мне в вашем городе уже придумали целую жизнь.', 'ep2_derek_city'),
        choice('Да, но сейчас не хочу это обсуждать.', 'ep2_derek_not_now')
      ] }
    ]
  },
  {
    id: 'ep2_derek_mason',
    chat: 'private_derek',
    trigger: 'choice:ep2_derek_checks_in:0',
    messages: [
      say('derek', 'Он тебе написал?'),
      say('derek', 'Блин.'),
      say('derek', 'Я с ним поговорю.'),
      { type: 'choice', options: [
        choice('Не надо. Я сам с ним разберусь.', 'ep2_derek_mason_leave'),
        choice('Поговори. Может, тебя он хотя бы услышит.', 'ep2_derek_mason_talk')
      ] }
    ]
  },
  { id: 'ep2_derek_mason_leave', chat: 'private_derek', trigger: 'choice:ep2_derek_mason:0', setFlags: { derekRespectedMasonBoundary: true }, messages: [say('derek', 'Ладно. Не полезу.'), say('derek', 'Если снова начнёт — просто не отвечай ему.')] },
  { id: 'ep2_derek_mason_talk', chat: 'private_derek', trigger: 'choice:ep2_derek_mason:1', setFlags: { derekWillConfrontMason: true }, messages: [say('derek', 'Хорошо.'), say('derek', 'Но не обещаю, что он меня услышит.')] },
  { id: 'ep2_derek_city', chat: 'private_derek', trigger: 'choice:ep2_derek_checks_in:1', messages: [say('derek', 'Да уж.'), say('derek', 'Ты здесь никогда не был, но тебя уже успели «увидеть» у North Lot.')] },
  { id: 'ep2_derek_not_now', chat: 'private_derek', trigger: 'choice:ep2_derek_checks_in:2', messages: [say('derek', 'Понял.'), say('derek', 'Просто знай, я в ту фотографию не верю.')] },
  {
    id: 'ep2_derek_truth_context',
    chat: 'private_derek',
    trigger: 'after:ep2_derek_mason_leave|ep2_derek_mason_talk|ep2_derek_city|ep2_derek_not_now',
    messages: [
      say('derek', 'С Ravenwood Truth такое уже было.'),
      say('derek', 'Они что-нибудь выкладывают, весь город начинает орать, а потом пост просто исчезает.'),
      { type: 'choice', options: [
        choice('Удобно устроились.', 'ep2_derek_truth_scheme'),
        choice('Похоже, сейчас им нужен не ответ, а я.', 'ep2_derek_truth_target'),
        choice('И всё равно им продолжают верить.', 'ep2_derek_truth_belief')
      ] }
    ]
  },
  { id: 'ep2_derek_truth_scheme', chat: 'private_derek', trigger: 'choice:ep2_derek_truth_context:0', messages: [say('derek', 'Ага. Особенно когда отвечать потом никому не нужно.')] },
  { id: 'ep2_derek_truth_target', chat: 'private_derek', trigger: 'choice:ep2_derek_truth_context:1', messages: [say('derek', 'У меня то же чувство.'), say('derek', 'Только я не понимаю, почему именно ты.')] },
  { id: 'ep2_derek_truth_belief', chat: 'private_derek', trigger: 'choice:ep2_derek_truth_context:2', messages: [say('derek', 'Потому что иногда они правда что-то находят.'), say('derek', 'И этого людям хватает, чтобы поверить в остальное.')] },

  {
    id: 'ep2_olivia_city_break',
    chat: 'private_olivia',
    trigger: 'after:ep2_derek_truth_scheme|ep2_derek_truth_target|ep2_derek_truth_belief',
    setFlags: { ep2CityGuideLive: true },
    messages: [
      { type: 'pause', delay: 950 },
      { type: 'system', text: 'Оливия в сети.', delay: 350, characterStatus: { id: 'olivia', online: true } },
      say('olivia', 'Вижу, пост про North Lot уже удалили.'),
      say('olivia', 'Не знаю, кто им написал, но хоть одна ложь сегодня прожила недолго.'),
      say('olivia', 'И раз тебе уже приписали поездку в Рейвенвуд, держи нормальную версию города.'),
      { from: 'olivia', type: 'app', title: 'RavenFeed', subtitle: 'Люди и места без Ravenwood Truth', text: 'Открыть городскую ленту', documentId: 'ravenfeed_city_guide', delay: 650 },
      { type: 'choice', options: [
        choice('Поздно. Я уже знаю про Пончика.', 'ep2_olivia_dog'),
        choice('Только без анонимных разоблачений.', 'ep2_olivia_no_truth'),
        choice('Спасибо. Сейчас посмотрю.', 'ep2_olivia_thanks', { trust: { oliviaTrust: 1 } })
      ] }
    ]
  },
  { id: 'ep2_olivia_dog', chat: 'private_olivia', trigger: 'choice:ep2_olivia_city_break:0', setFlags: { episode2OpeningComplete: true }, messages: [say('olivia', 'Тогда главное ты уже видел.'), say('olivia', 'Остальное можно не открывать.')] },
  { id: 'ep2_olivia_no_truth', chat: 'private_olivia', trigger: 'choice:ep2_olivia_city_break:1', setFlags: { episode2OpeningComplete: true }, messages: [say('olivia', 'Обещаю.'), say('olivia', 'Там максимум кофе, собака и вечные жалобы на N7.')] },
  { id: 'ep2_olivia_thanks', chat: 'private_olivia', trigger: 'choice:ep2_olivia_city_break:2', setFlags: { episode2OpeningComplete: true }, messages: [say('olivia', 'Не за что.'), say('olivia', 'После сегодняшнего тебе пригодится что-нибудь обычное.')] }
];

export const chapter2 = {
  id: 'act2',
  title: 'Эпизод 2: Чужое лицо',
  beats: chapter2OpeningBeats
};
