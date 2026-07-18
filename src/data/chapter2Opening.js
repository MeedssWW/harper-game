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
      say('detective', 'Мне нужно уточнить несколько вещей по сообщению с телефона Харпер и сегодняшней публикации.'),
      { type: 'choice', options: [
        choice('Хорошо. Спрашивайте.', 'ep2_police_ready'),
        choice('Сначала скажите, я в чём-то подозреваюсь?', 'ep2_police_status'),
        choice('Я уже всё объяснял Дереку.', 'ep2_police_already_told')
      ] }
    ]
  },
  {
    id: 'ep2_police_ready',
    chat: 'private_detective',
    trigger: 'choice:ep2_police_contact:0',
    messages: [say('detective', 'Хорошо.')]
  },
  {
    id: 'ep2_police_status',
    chat: 'private_detective',
    trigger: 'choice:ep2_police_contact:1',
    messages: [
      say('detective', 'Нет. Пока мы просто проверяем, почему ваш номер отправили с телефона Харпер.'),
      say('detective', 'И откуда Ravenwood Truth получил вашу фотографию.')
    ]
  },
  {
    id: 'ep2_police_already_told',
    chat: 'private_detective',
    trigger: 'choice:ep2_police_contact:2',
    messages: [
      say('detective', 'Я видел сообщения, которые передал Дерек.'),
      say('detective', 'Но мне нужны ваши ответы, а не его пересказ.')
    ]
  },
  {
    id: 'ep2_police_statement',
    chat: 'private_detective',
    trigger: 'after:ep2_police_ready|ep2_police_status|ep2_police_already_told',
    messages: [
      say('detective', 'Тогда начнём с главного.'),
      say('detective', 'Вы подтверждаете, что никогда не были в Рейвенвуде и раньше не общались с Харпер Вэнс?'),
      { type: 'choice', options: [
        choice('Да. Я никогда там не был и Харпер не знаю.', 'ep2_police_statement_plain', { setFlag: 'policeStatementConfirmed' }),
        choice('Да. Уже не знаю, как ещё это повторить.', 'ep2_police_statement_tired', { setFlag: 'policeStatementConfirmed' }),
        choice('Если бы я её знал, я бы так и сказал.', 'ep2_police_statement_direct', { setFlag: 'policeStatementConfirmed' })
      ] }
    ]
  },
  {
    id: 'ep2_police_statement_plain',
    chat: 'private_detective',
    trigger: 'choice:ep2_police_statement:0',
    messages: [say('detective', 'Принял.')]
  },
  {
    id: 'ep2_police_statement_tired',
    chat: 'private_detective',
    trigger: 'choice:ep2_police_statement:1',
    messages: [say('detective', 'Понимаю. Я должен зафиксировать это отдельно.')]
  },
  {
    id: 'ep2_police_statement_direct',
    chat: 'private_detective',
    trigger: 'choice:ep2_police_statement:2',
    messages: [say('detective', 'Хорошо. Я это зафиксировал.')]
  },
  {
    id: 'ep2_police_photo',
    chat: 'private_detective',
    trigger: 'after:ep2_police_statement_plain|ep2_police_statement_tired|ep2_police_statement_direct',
    messages: [
      say('detective', 'Теперь про фотографию из публикации.'),
      say('detective', 'Её сделал ваш телефон?'),
      { type: 'choice', options: [
        choice('Да. Камера включилась во время взлома.', 'ep2_police_photo_hack', { setFlag: 'policeKnowsPhotoWasStolen' }),
        choice('Да, но я никому её не отправлял.', 'ep2_police_photo_not_sent', { setFlag: 'policeKnowsPhotoWasStolen' }),
        choice('Я пока не хочу об этом говорить.', 'ep2_police_photo_withheld', { setFlag: 'playerWithheldHackFromPolice' })
      ] }
    ]
  },
  {
    id: 'ep2_police_photo_hack',
    chat: 'private_detective',
    trigger: 'choice:ep2_police_photo:0',
    messages: [
      say('detective', 'Понял.'),
      say('detective', 'После взлома вам кто-нибудь писал?')
    ]
  },
  {
    id: 'ep2_police_photo_not_sent',
    chat: 'private_detective',
    trigger: 'choice:ep2_police_photo:1',
    messages: [
      say('detective', 'Хорошо.'),
      say('detective', 'После этого вам кто-нибудь писал?')
    ]
  },
  {
    id: 'ep2_police_photo_withheld',
    chat: 'private_detective',
    trigger: 'choice:ep2_police_photo:2',
    messages: [
      say('detective', 'Хорошо. Отмечу, что вы не захотели обсуждать обстоятельства.'),
      say('detective', 'После этого вам кто-нибудь писал?')
    ]
  },
  {
    id: 'ep2_police_unknown',
    chat: 'private_detective',
    trigger: 'after:ep2_police_photo_hack|ep2_police_photo_not_sent|ep2_police_photo_withheld',
    messages: [
      { type: 'choice', options: [
        choice('Да. Неизвестный контакт сказал, что остановил подключение.', 'ep2_police_unknown_told', { setFlag: 'unknownReportedToPolice' }),
        choice('Я сам увидел чужое подключение в журнале.', 'ep2_police_log_told', { setFlag: 'unknownHiddenFromPolice' }),
        choice('Об этом я тоже пока не хочу говорить.', 'ep2_police_unknown_withheld', { setFlag: 'unknownHiddenFromPolice' })
      ] }
    ]
  },
  {
    id: 'ep2_police_unknown_told',
    chat: 'private_detective',
    trigger: 'choice:ep2_police_unknown:0',
    messages: [say('detective', 'Пришлите сюда скриншоты переписки с этим контактом. Ничего не удаляйте.')]
  },
  {
    id: 'ep2_police_log_told',
    chat: 'private_detective',
    trigger: 'choice:ep2_police_unknown:1',
    messages: [say('detective', 'Пришлите журнал подключений. Желательно без обрезки.')]
  },
  {
    id: 'ep2_police_unknown_withheld',
    chat: 'private_detective',
    trigger: 'choice:ep2_police_unknown:2',
    messages: [say('detective', 'Понял. Если передумаете, напишите сюда.')]
  },
  {
    id: 'ep2_police_finish',
    chat: 'private_detective',
    trigger: 'after:ep2_police_unknown_told|ep2_police_log_told|ep2_police_unknown_withheld',
    setFlags: { policeChatCompleted: true },
    messages: [
      say('detective', 'На этом пока всё.'),
      say('detective', 'Если Ravenwood Truth снова что-нибудь выложит или вам напишут с угрозами, сохраните сообщения и сообщите мне.'),
      { type: 'system', text: 'Дэниел Рид не в сети.', delay: 420, characterStatus: { id: 'detective', online: false } }
    ]
  },

  {
    id: 'ep2_derek_checks_in',
    chat: 'private_derek',
    trigger: 'after:ep2_police_finish',
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
  { id: 'ep2_derek_mason_leave', chat: 'private_derek', trigger: 'choice:ep2_derek_mason:0', setFlags: { derekRespectedMasonBoundary: true }, messages: [say('derek', 'Ладно, не полезу.'), say('derek', 'Если снова начнёт, просто не отвечай ему.')] },
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
    messages: [
      { type: 'pause', delay: 950 },
      { type: 'system', text: 'Оливия в сети.', delay: 350, characterStatus: { id: 'olivia', online: true } },
      say('olivia', 'Вижу, пост про North Lot уже удалили.'),
      say('olivia', 'Извиняться они, конечно, не стали.'),
      say('olivia', 'А комментарии под первым постом так и висят.'),
      say('olivia', 'Ты как?'),
      { type: 'choice', options: [
        choice('Злюсь, потому что они выложили моё лицо, а потом ещё придумали, что я был у вас.', 'ep2_olivia_reaction_angry'),
        choice('Если честно, я уже не понимаю, чему удивляться.', 'ep2_olivia_reaction_tired'),
        choice('Всё отлично, осталось обвинить меня в краже городской вывески.', 'ep2_olivia_reaction_joke')
      ] }
    ]
  },
  {
    id: 'ep2_olivia_reaction_angry',
    chat: 'private_olivia',
    trigger: 'choice:ep2_olivia_city_break:0',
    messages: [
      say('olivia', 'Я бы тоже злилась, особенно потому, что они просто удалили пост и сделали вид, что его не было.')
    ]
  },
  {
    id: 'ep2_olivia_reaction_tired',
    chat: 'private_olivia',
    trigger: 'choice:ep2_olivia_city_break:1',
    messages: [
      say('olivia', 'Понимаю, на тебя тут уже свалилось больше, чем на большинство людей здесь за год.')
    ]
  },
  {
    id: 'ep2_olivia_reaction_joke',
    chat: 'private_olivia',
    trigger: 'choice:ep2_olivia_city_break:2',
    messages: [
      say('olivia', 'Только не подсказывай им, у нас как раз недавно пропала табличка с автобусной остановки.')
    ]
  },
  {
    id: 'ep2_olivia_walk_offer',
    chat: 'private_olivia',
    trigger: 'after:ep2_olivia_reaction_angry|ep2_olivia_reaction_tired|ep2_olivia_reaction_joke',
    messages: [
      say('olivia', 'Я сейчас вышла пройтись, потому что дома уже надоело сидеть.'),
      say('olivia', 'Ты ведь Рейвенвуд видел только в RavenFeed.'),
      say('olivia', 'Могу показать, как он выглядит без Ravenwood Truth и чужих комментариев.'),
      { type: 'choice', options: [
        choice('Давай, хочу увидеть хоть что-нибудь нормальное.', 'ep2_olivia_walk_normal'),
        choice('Показывай, а то пока ваш город состоит из одних скандалов.', 'ep2_olivia_walk_scandals'),
        choice('Если это попытка меня отвлечь, то она работает.', 'ep2_olivia_walk_distraction', { trust: { oliviaTrust: 1 } })
      ] }
    ]
  },
  {
    id: 'ep2_olivia_walk_normal',
    chat: 'private_olivia',
    trigger: 'choice:ep2_olivia_walk_offer:0',
    messages: [say('olivia', 'Тогда начнём с центра.')]
  },
  {
    id: 'ep2_olivia_walk_scandals',
    chat: 'private_olivia',
    trigger: 'choice:ep2_olivia_walk_offer:1',
    messages: [say('olivia', 'Не только из скандалов, хотя иногда кажется, что именно из них.')]
  },
  {
    id: 'ep2_olivia_walk_distraction',
    chat: 'private_olivia',
    trigger: 'choice:ep2_olivia_walk_offer:2',
    messages: [say('olivia', 'Я на это и рассчитывала.')]
  },
  {
    id: 'ep2_olivia_river_street',
    chat: 'private_olivia',
    trigger: 'after:ep2_olivia_walk_normal|ep2_olivia_walk_scandals|ep2_olivia_walk_distraction',
    messages: [
      { from: 'olivia', type: 'image', src: 'src/assets/story/ravenwood_walk/river_street_orpheum.webp', caption: 'River Street · Orpheum', delay: 700 },
      say('olivia', 'Это River Street, здесь у нас центр.'),
      say('olivia', 'И да, это почти весь центр.'),
      say('olivia', 'А это Orpheum, он закрыт столько, что я вообще не помню его открытым.'),
      { type: 'choice', options: [
        choice('По фото город выглядит спокойнее, чем по комментариям.', 'ep2_olivia_center_calm'),
        choice('И вы всё это называете центром?', 'ep2_olivia_center_small'),
        choice('У вас правда всё мокрое.', 'ep2_olivia_center_rain')
      ] }
    ]
  },
  {
    id: 'ep2_olivia_center_calm',
    chat: 'private_olivia',
    trigger: 'choice:ep2_olivia_river_street:0',
    messages: [say('olivia', 'Потому что на фотографии никто не пишет.')]
  },
  {
    id: 'ep2_olivia_center_small',
    chat: 'private_olivia',
    trigger: 'choice:ep2_olivia_river_street:1',
    messages: [say('olivia', 'Не начинай, у нас есть ещё две улицы.')]
  },
  {
    id: 'ep2_olivia_center_rain',
    chat: 'private_olivia',
    trigger: 'choice:ep2_olivia_river_street:2',
    messages: [say('olivia', 'У нас дождь обычно ненадолго прекращается.')]
  },
  {
    id: 'ep2_olivia_route_choice',
    chat: 'private_olivia',
    trigger: 'after:ep2_olivia_center_calm|ep2_olivia_center_small|ep2_olivia_center_rain',
    messages: [
      say('olivia', 'Я дошла до перекрёстка и могу свернуть к Riverwalk, к старому переезду или пройти через обычный жилой квартал.'),
      say('olivia', 'Выбирай.'),
      { type: 'choice', options: [
        choice('Покажи место, которое нравится тебе.', 'ep2_olivia_route_favorite', { trust: { oliviaTrust: 1 } }),
        choice('Давай старый переезд, звучит хотя бы странно.', 'ep2_olivia_route_crossing'),
        choice('Покажи обычный район без достопримечательностей.', 'ep2_olivia_route_ordinary')
      ] }
    ]
  },
  {
    id: 'ep2_olivia_route_favorite',
    chat: 'private_olivia',
    trigger: 'choice:ep2_olivia_route_choice:0',
    setFlags: { ep2OliviaRouteFavorite: true },
    messages: [
      { from: 'olivia', type: 'image', src: 'src/assets/story/ravenwood_walk/riverwalk_steps.webp', caption: 'Riverwalk', delay: 700 },
      say('olivia', 'Это ступени у Riverwalk, я прихожу сюда, когда дома уже не сидится.'),
      say('olivia', 'Летом здесь шумно, а после дождя почти никого.')
    ]
  },
  {
    id: 'ep2_olivia_route_crossing',
    chat: 'private_olivia',
    trigger: 'choice:ep2_olivia_route_choice:1',
    setFlags: { ep2SawCrossingSeven: true },
    messages: [
      { from: 'olivia', type: 'image', src: 'src/assets/story/ravenwood_walk/crossing_n7.webp', caption: 'Переезд N7', delay: 700 },
      say('olivia', 'Это переезд номер семь, но все зовут его N7.'),
      say('olivia', 'Поезда здесь проходят редко, но шлагбаум иногда закрывается просто так, по крайней мере, так все говорят.')
    ]
  },
  {
    id: 'ep2_olivia_route_ordinary',
    chat: 'private_olivia',
    trigger: 'choice:ep2_olivia_route_choice:2',
    setFlags: { ep2OliviaRouteOrdinary: true },
    messages: [
      { from: 'olivia', type: 'image', src: 'src/assets/story/ravenwood_walk/ordinary_block.webp', caption: 'Maple Avenue', delay: 700 },
      say('olivia', 'Вот обычный Рейвенвуд, здесь пекарня, прачечная и остановка, где автобус приходит когда хочет.'),
      say('olivia', 'А те двое впереди уже минут пять обсуждают цену на кофе.')
    ]
  },
  {
    id: 'ep2_olivia_overlook',
    chat: 'private_olivia',
    trigger: 'after:ep2_olivia_route_favorite|ep2_olivia_route_crossing|ep2_olivia_route_ordinary',
    setFlags: { ep2CityWalkCompleted: true },
    messages: [
      say('olivia', 'Я поднялась к старой смотровой.'),
      { from: 'olivia', type: 'image', src: 'src/assets/story/ravenwood_walk/town_overlook.webp', caption: 'Рейвенвуд со старой смотровой', delay: 700 },
      say('olivia', 'Отсюда почти весь город видно, внизу River Street, справа река, а пути уходят за холм.'),
      say('olivia', 'Небольшой, да?'),
      { type: 'choice', options: [
        choice('Спасибо, теперь хотя бы понимаю, где вы все живёте.', 'ep2_olivia_walk_end_places', { trust: { oliviaTrust: 1 } }),
        choice('Красиво, жаль, что познакомился с ним через весь этот бред.', 'ep2_olivia_walk_end_bad_start'),
        choice('Ну всё, теперь я почти местный.', 'ep2_olivia_walk_end_local')
      ] }
    ]
  },
  {
    id: 'ep2_olivia_walk_end_places',
    chat: 'private_olivia',
    trigger: 'choice:ep2_olivia_overlook:0',
    messages: [say('olivia', 'Вот и хорошо, а то мы говорим названиями улиц, будто ты обязан их знать.')]
  },
  {
    id: 'ep2_olivia_walk_end_bad_start',
    chat: 'private_olivia',
    trigger: 'choice:ep2_olivia_overlook:1',
    messages: [say('olivia', 'Мне тоже жаль, но теперь ты видел хотя бы не только посты о себе.')]
  },
  {
    id: 'ep2_olivia_walk_end_local',
    chat: 'private_olivia',
    trigger: 'choice:ep2_olivia_overlook:2',
    messages: [say('olivia', 'Не спеши, тебя ещё не ругал водитель автобуса N4.')]
  },
  {
    id: 'ep2_olivia_walk_close',
    chat: 'private_olivia',
    trigger: 'after:ep2_olivia_walk_end_places|ep2_olivia_walk_end_bad_start|ep2_olivia_walk_end_local',
    setFlags: { episode2OpeningComplete: true },
    messages: [
      say('olivia', 'Я ещё немного пройдусь, а если Ravenwood Truth снова что-нибудь выложит, сначала напиши мне.'),
      { type: 'system', text: 'Оливия не в сети.', delay: 420, characterStatus: { id: 'olivia', online: false } }
    ]
  }
];

export const chapter2 = {
  id: 'act2',
  title: 'Эпизод 2: Чужое лицо',
  beats: chapter2OpeningBeats
};
