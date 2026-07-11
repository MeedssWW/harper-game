export const chapter1FinaleBeats = [
  {
    id: "derek_station_question_start",
    chat: "private_derek",
    trigger: "flag:derekConversationUnlocked",
    identify: ["derek"],
    messages: [
      { type: "system", text: "Дерек в сети.", delay: 600, characterStatus: { id: "derek", online: true } },
      { from: "derek", text: "Ты хотел что-то спросить?", delay: 900 },
      { type: "choice", options: [
        { text: "Миа вспомнила, что вы с Харпер ссорились.", loyalty: {}, next: "derek_station_argued" },
        { text: "Харпер не хотела с тобой разговаривать в тот вечер.", loyalty: {}, next: "derek_station_no_talk" },
        { text: "Нужно уточнить кое-что про Харпер.", loyalty: {}, next: "derek_station_about_harper" }
      ]}
    ]
  },
  {
    id: "derek_station_argued",
    chat: "private_derek",
    trigger: "choice:derek_station_question_start:0",
    messages: [
      { from: "derek", text: "Да.", delay: 700 },
      { from: "derek", text: "Мы поссорились.", delay: 900 }
    ]
  },
  {
    id: "derek_station_no_talk",
    chat: "private_derek",
    trigger: "choice:derek_station_question_start:1",
    messages: [
      { from: "derek", text: "Я знаю.", delay: 700 },
      { from: "derek", text: "Она прямо сказала, что хочет побыть одна.", delay: 1000 }
    ]
  },
  {
    id: "derek_station_about_harper",
    chat: "private_derek",
    trigger: "choice:derek_station_question_start:2",
    messages: [
      { from: "derek", text: "Если это про тот вечер — да.", delay: 1000 },
      { from: "derek", text: "Мы поругались.", delay: 800 }
    ]
  },
  {
    id: "derek_station_argument_common",
    chat: "private_derek",
    trigger: "after:derek_station_argued|derek_station_no_talk|derek_station_about_harper",
    messages: [
      { from: "derek", text: "Я давил на неё.", delay: 900 },
      { from: "derek", text: "Пытался понять, что с ней происходит.", delay: 1000 },
      { from: "derek", text: "Она сказала, что ей нужно время.", delay: 900 },
      { from: "derek", text: "Я не думал, что она просто исчезнет.", delay: 1000 },
      { type: "choice", options: [
        { text: "Она сказала, куда собирается?", loyalty: {}, next: "derek_station_where" },
        { text: "Ты пытался ей потом написать?", loyalty: {}, next: "derek_station_texted" },
        { text: "Из-за чего вы поссорились?", loyalty: {}, next: "derek_station_why_argued" }
      ]}
    ]
  },
  {
    id: "derek_station_where",
    chat: "private_derek",
    trigger: "choice:derek_station_argument_common:0",
    messages: [
      { from: "derek", text: "Нет.", delay: 700 },
      { from: "derek", text: "Только что хочет пройтись одна.", delay: 900 }
    ]
  },
  {
    id: "derek_station_texted",
    chat: "private_derek",
    trigger: "choice:derek_station_argument_common:1",
    messages: [
      { from: "derek", text: "Да.", delay: 700 },
      { from: "derek", text: "Она не отвечала.", delay: 900 }
    ]
  },
  {
    id: "derek_station_why_argued",
    chat: "private_derek",
    trigger: "choice:derek_station_argument_common:2",
    messages: [
      { from: "derek", text: "Не из-за чего-то одного.", delay: 900 },
      { from: "derek", text: "Я хотел, чтобы она рассказала мне всё.", delay: 1000 },
      { from: "derek", text: "Она не хотела.", delay: 800 }
    ]
  },
  {
    id: "derek_station_lead_common",
    chat: "private_derek",
    trigger: "after:derek_station_where|derek_station_texted|derek_station_why_argued",
    messages: [
      { from: "derek", text: "Почему ты спрашиваешь?", delay: 900 },
      { type: "choice", options: [
        { text: "Мы нашли нитку, которая ведёт к старой станции.", loyalty: {}, next: "derek_station_old_station" },
        { text: "На машине рядом с Харпер была служебная наклейка.", loyalty: {}, next: "derek_station_sticker" },
        { text: "Возможно, машина могла заезжать в Северный двор.", loyalty: {}, next: "derek_station_north_yard" }
      ]}
    ]
  },
  {
    id: "derek_station_old_station",
    chat: "private_derek",
    trigger: "choice:derek_station_lead_common:0",
    messages: [
      { from: "derek", text: "Кто сказал вам про старую станцию?", delay: 1100 }
    ]
  },
  {
    id: "derek_station_sticker",
    chat: "private_derek",
    trigger: "choice:derek_station_lead_common:1",
    messages: [
      { from: "derek", text: "Зачем вы вообще полезли в Северный двор?", delay: 1100 }
    ]
  },
  {
    id: "derek_station_north_yard",
    chat: "private_derek",
    trigger: "choice:derek_station_lead_common:2",
    messages: [
      { from: "derek", text: "Кто вам вообще сказал про это место?", delay: 1100 }
    ]
  },
  {
    id: "derek_station_warning_common",
    chat: "private_derek",
    trigger: "after:derek_station_old_station|derek_station_sticker|derek_station_north_yard",
    messages: [
      { from: "derek", text: "Вы туда не собираетесь, надеюсь?", delay: 900 },
      { from: "derek", text: "Там нечего делать.", delay: 800 },
      { from: "derek", text: "Особенно вечером.", delay: 800 },
      { type: "choice", options: [
        { text: "Ты там был?", loyalty: {}, next: "derek_station_been_there" },
        { text: "Почему ты так резко отреагировал?", loyalty: {}, next: "derek_station_reacted" },
        { text: "Мы не собираемся туда ехать.", loyalty: {}, next: "derek_station_not_going" }
      ]}
    ]
  },
  {
    id: "derek_station_been_there",
    chat: "private_derek",
    trigger: "choice:derek_station_warning_common:0",
    messages: [
      { from: "derek", text: "Это сейчас неважно.", delay: 900 }
    ]
  },
  {
    id: "derek_station_reacted",
    chat: "private_derek",
    trigger: "choice:derek_station_warning_common:1",
    messages: [
      { from: "derek", text: "Потому что я знаю этот район.", delay: 900 },
      { from: "derek", text: "И знаю, что там легко попасть в неприятности.", delay: 1000 }
    ]
  },
  {
    id: "derek_station_not_going",
    chat: "private_derek",
    trigger: "choice:derek_station_warning_common:2",
    messages: [
      { from: "derek", text: "Хорошо.", delay: 800 }
    ]
  },
  {
    id: "derek_station_end",
    chat: "private_derek",
    trigger: "after:derek_station_been_there|derek_station_reacted|derek_station_not_going",
    setFlags: {
      derekConfirmedArgument: true,
      derekReactedToOldStation: true,
      derekStationConversationCompleted: true
    },
    messages: [
      { from: "derek", text: "Просто не лезьте туда сами.", delay: 900 },
      { from: "derek", text: "Пожалуйста.", delay: 800 },
      { from: "derek", text: "Мне надо идти.", delay: 800 },
      { type: "system", text: "Дерек вышел из сети.", delay: 800, characterStatus: { id: "derek", online: false } },
      { type: "case_entry", id: "question_derek_old_station", entryType: "question", title: "НОВЫЙ ВОПРОС", text: "Дерек странно отреагировал на упоминание старой станции. Он знает этот район, но не объяснил почему. Это может ничего не значить.", delay: 250 }
    ]
  },
  {
    id: "larks_after_derek_start",
    chat: "group_larks",
    trigger: "after:derek_station_end",
    messages: [
      { from: "olivia", text: "Он ответил?", delay: 1400 },
      { type: "choice", options: [
        { text: "Он подтвердил, что они с Харпер ссорились.", loyalty: {}, next: "larks_after_derek_argument" },
        { text: "Он знает район старой станции.", loyalty: {}, next: "larks_after_derek_knows_station" },
        { text: "Он ничего прямо не сказал, но явно что-то скрывает.", loyalty: {}, next: "larks_after_derek_hiding" }
      ]}
    ]
  },
  {
    id: "larks_after_derek_argument",
    chat: "group_larks",
    trigger: "choice:larks_after_derek_start:0",
    messages: [
      { from: "mia", text: "Я не хотела, чтобы он подумал, будто я его обвиняю.", delay: 1000 },
      { from: "olivia", text: "Мы пока никого не обвиняем.", delay: 900 }
    ]
  },
  {
    id: "larks_after_derek_knows_station",
    chat: "group_larks",
    trigger: "choice:larks_after_derek_start:1",
    messages: [
      { from: "olivia", text: "Это странно.", delay: 800 },
      { from: "mia", text: "Но это ещё не значит, что он сделал что-то Харпер.", delay: 1000 }
    ]
  },
  {
    id: "larks_after_derek_hiding",
    chat: "group_larks",
    trigger: "choice:larks_after_derek_start:2",
    messages: [
      { from: "olivia", text: "Возможно.", delay: 800 },
      { from: "olivia", text: "Только не нужно делать выводы раньше времени.", delay: 1000 }
    ]
  },
  {
    id: "larks_after_derek_common",
    chat: "group_larks",
    trigger: "after:larks_after_derek_argument|larks_after_derek_knows_station|larks_after_derek_hiding",
    messages: [
      { from: "mia", text: "Может, он просто испугался.", delay: 900 },
      { from: "olivia", text: "Или не хочет говорить о чём-то личном.", delay: 1000 },
      { from: "olivia", text: "Пока у нас нет доказательств.", delay: 900 }
    ]
  },
  {
    id: "derek_confession_start",
    chat: "private_derek",
    trigger: "after:larks_after_derek_common",
    messages: [
      { type: "pause", delay: 15000 },
      { type: "system", text: "Дерек в сети.", delay: 500, characterStatus: { id: "derek", online: true } },
      { from: "derek", text: "Я соврал.", delay: 1000 },
      { from: "derek", text: "Я был возле старой станции в ту ночь.", delay: 1100 },
      { type: "choice", options: [
        { text: "Зачем ты соврал?", loyalty: {}, next: "derek_confess_why_lied" },
        { text: "Ты поехал за Харпер?", loyalty: {}, next: "derek_confess_followed" },
        { text: "Что ты там видел?", loyalty: {}, next: "derek_confess_what_saw" }
      ]}
    ]
  },
  {
    id: "derek_confess_why_lied",
    chat: "private_derek",
    trigger: "choice:derek_confession_start:0",
    messages: [
      { from: "derek", text: "Потому что это выглядело бы ужасно.", delay: 1000 }
    ]
  },
  {
    id: "derek_confess_followed",
    chat: "private_derek",
    trigger: "choice:derek_confession_start:1",
    messages: [
      { from: "derek", text: "Да.", delay: 700 },
      { from: "derek", text: "Поехал.", delay: 800 }
    ]
  },
  {
    id: "derek_confess_what_saw",
    chat: "private_derek",
    trigger: "choice:derek_confession_start:2",
    messages: [
      { from: "derek", text: "Подожди.", delay: 700 },
      { from: "derek", text: "Я сначала должен объяснить.", delay: 900 }
    ]
  },
  {
    id: "derek_confess_follow_common",
    chat: "private_derek",
    trigger: "after:derek_confess_why_lied|derek_confess_followed|derek_confess_what_saw",
    messages: [
      { from: "derek", text: "После нашей ссоры я поехал к Риверуоку.", delay: 1000 },
      { from: "derek", text: "Я знал, что Харпер иногда ходила туда, когда хотела побыть одна.", delay: 1300 },
      { from: "derek", text: "Я увидел её издалека у дороги.", delay: 1000 },
      { from: "derek", text: "Она ушла в сторону сервисной дороги.", delay: 1000 },
      { from: "derek", text: "Я не подошёл.", delay: 800 },
      { from: "derek", text: "Подумал, что если снова полезу с разговором, она просто уйдёт ещё дальше.", delay: 1300 },
      { from: "derek", text: "Я поехал следом.", delay: 900 },
      { from: "derek", text: "И потерял её у развязки.", delay: 900 },
      { type: "choice", options: [
        { text: "Почему ты не вышел из машины?", loyalty: {}, next: "derek_confess_why_not_leave" },
        { text: "Ты видел, куда она пошла дальше?", loyalty: {}, next: "derek_confess_where_next" },
        { text: "Ты видел там ещё кого-то?", loyalty: {}, next: "derek_confess_someone_else" }
      ]}
    ]
  },
  {
    id: "derek_confess_why_not_leave",
    chat: "private_derek",
    trigger: "choice:derek_confess_follow_common:0",
    messages: [
      { from: "derek", text: "Потому что испугался, что она скажет мне уйти.", delay: 1000 },
      { from: "derek", text: "И я правда уйду.", delay: 800 }
    ]
  },
  {
    id: "derek_confess_where_next",
    chat: "private_derek",
    trigger: "choice:derek_confess_follow_common:1",
    messages: [
      { from: "derek", text: "Нет.", delay: 700 },
      { from: "derek", text: "В какой-то момент я просто потерял её из виду.", delay: 1000 }
    ]
  },
  {
    id: "derek_confess_someone_else",
    chat: "private_derek",
    trigger: "choice:derek_confess_follow_common:2",
    messages: [
      { from: "derek", text: "Не человека.", delay: 800 },
      { from: "derek", text: "Машину.", delay: 800 }
    ]
  },
  {
    id: "derek_confess_car_common",
    chat: "private_derek",
    trigger: "after:derek_confess_why_not_leave|derek_confess_where_next|derek_confess_someone_else",
    messages: [
      { from: "derek", text: "Я доехал до станции.", delay: 900 },
      { from: "derek", text: "У шлагбаума стояла машина.", delay: 900 },
      { from: "derek", text: "Тёмно-зелёная. Кажется.", delay: 900 },
      { from: "derek", text: "Я видел её только несколько секунд.", delay: 900 },
      { from: "derek", text: "Номера не видел.", delay: 800 },
      { from: "derek", text: "И не видел, кто был внутри.", delay: 900 },
      { type: "choice", options: [
        { text: "Почему ты не сказал об этом сразу?", loyalty: {}, next: "derek_confess_why_silent" },
        { text: "Ты видел Харпер рядом с машиной?", loyalty: {}, next: "derek_confess_harper_car" },
        { text: "Ты уверен, что машина была зелёной?", loyalty: {}, next: "derek_confess_green_sure" }
      ]}
    ]
  },
  {
    id: "derek_confess_why_silent",
    chat: "private_derek",
    trigger: "choice:derek_confess_car_common:0",
    messages: [
      { from: "derek", text: "Потому что пришлось бы признаться, что я следил за ней.", delay: 1100 },
      { from: "derek", text: "И что я ничего не сделал.", delay: 900 }
    ]
  },
  {
    id: "derek_confess_harper_car",
    chat: "private_derek",
    trigger: "choice:derek_confess_car_common:1",
    messages: [
      { from: "derek", text: "Нет.", delay: 700 },
      { from: "derek", text: "Если бы видел — я бы не молчал.", delay: 900 }
    ]
  },
  {
    id: "derek_confess_green_sure",
    chat: "private_derek",
    trigger: "choice:derek_confess_car_common:2",
    messages: [
      { from: "derek", text: "Нет.", delay: 700 },
      { from: "derek", text: "Было темно.", delay: 800 },
      { from: "derek", text: "Но после того кадра я вспомнил цвет.", delay: 1000 }
    ]
  },
  {
    id: "derek_confess_police_decision",
    chat: "private_derek",
    trigger: "after:derek_confess_why_silent|derek_confess_harper_car|derek_confess_green_sure",
    messages: [
      { from: "derek", text: "Я должен был сказать полиции раньше.", delay: 1000 },
      { from: "derek", text: "Я понимаю это.", delay: 800 },
      { from: "derek", text: "Просто я боялся, что они решат, будто я причастен.", delay: 1100 },
      { type: "navigate", screen: "policeDecision", delay: 700 }
    ]
  },
  {
    id: "police_route_mason_msg1",
    chat: "private_derek",
    trigger: "flag:policeLeadRouteMason",
    messages: [
      { type: "choice", options: [
        { text: "Передай всё Мейсону.", loyalty: {}, next: "police_route_mason_msg2" }
      ]}
    ]
  },
  {
    id: "police_route_mason_msg2",
    chat: "private_derek",
    trigger: "choice:police_route_mason_msg1:0",
    messages: [
      { type: "choice", options: [
        { text: "Он сможет отнести это в полицию нормально.", loyalty: {}, next: "police_route_mason_derek" }
      ]}
    ]
  },
  {
    id: "police_route_mason_derek",
    chat: "private_derek",
    trigger: "choice:police_route_mason_msg2:0",
    messages: [
      { from: "derek", text: "Хорошо.", delay: 800 },
      { from: "derek", text: "Я напишу ему.", delay: 900 }
    ]
  },
  {
    id: "police_route_mason_mason",
    chat: "private_mason",
    trigger: "after:police_route_mason_derek",
    identify: ["mason"],
    messages: [
      { type: "pause", delay: 3500 },
      { type: "system", text: "Мейсон в сети.", delay: 500, characterStatus: { id: "mason", online: true } },
      { from: "mason", text: "Дерек написал мне.", delay: 900 },
      { from: "mason", text: "Я передам это полиции.", delay: 900 },
      { from: "mason", text: "И никто никуда сам не поедет.", delay: 900 },
      { type: "system", text: "Мейсон вышел из сети.", delay: 800, characterStatus: { id: "mason", online: false } }
    ]
  },
  {
    id: "police_route_anonymous_msg1",
    chat: "private_derek",
    trigger: "flag:policeLeadRouteAnonymous",
    messages: [
      { type: "choice", options: [
        { text: "Можно передать это без имён.", loyalty: {}, next: "police_route_anonymous_msg2" }
      ]}
    ]
  },
  {
    id: "police_route_anonymous_msg2",
    chat: "private_derek",
    trigger: "choice:police_route_anonymous_msg1:0",
    messages: [
      { from: "derek", text: "Анонимно?", delay: 800 },
      { type: "choice", options: [
        { text: "Да. Пусть хотя бы проверят место и въезд.", loyalty: {}, next: "police_route_anonymous_form" }
      ]}
    ]
  },
  {
    id: "police_route_anonymous_form",
    chat: "private_derek",
    trigger: "choice:police_route_anonymous_msg2:0",
    messages: [
      { from: "derek", text: "Ладно.", delay: 800 },
      { type: "navigate", screen: "policeDecision", params: { mode: "anonymousForm" }, delay: 600 },
      { type: "wait_flag", flag: "policeAnonymousTipSent", delay: 300 }
    ]
  },
  {
    id: "police_route_anonymous_end",
    chat: "private_derek",
    trigger: "flag:policeAnonymousTipSent",
    messages: [
      { from: "derek", text: "Надеюсь, этого хватит, чтобы они хотя бы посмотрели туда.", delay: 1000 }
    ]
  },
  {
    id: "police_route_derek_msg1",
    chat: "private_derek",
    trigger: "flag:policeLeadRouteDerek",
    messages: [
      { type: "choice", options: [
        { text: "Ты должен рассказать полиции сам.", loyalty: {}, next: "police_route_derek_msg2" }
      ]}
    ]
  },
  {
    id: "police_route_derek_msg2",
    chat: "private_derek",
    trigger: "choice:police_route_derek_msg1:0",
    messages: [
      { type: "choice", options: [
        { text: "Полностью.", loyalty: {}, next: "police_route_derek_end" }
      ]}
    ]
  },
  {
    id: "police_route_derek_end",
    chat: "private_derek",
    trigger: "choice:police_route_derek_msg2:0",
    messages: [
      { from: "derek", text: "Да.", delay: 700 },
      { from: "derek", text: "Я позвоню.", delay: 800 },
      { from: "derek", text: "Сейчас.", delay: 800 },
      { type: "system", text: "Дерек вышел из сети.", delay: 800, characterStatus: { id: "derek", online: false } }
    ]
  },
  {
    id: "police_lead_common_update",
    chat: "private_derek",
    trigger: "after:police_route_mason_mason|police_route_anonymous_end|police_route_derek_end",
    setFlags: {
      derekConfessedFollowingHarper: true,
      derekSawPossibleGreenSedan: true,
      policeLeadSubmitted: true
    },
    messages: [
      { type: "case_entry", id: "police_lead_submitted", entryType: "fact", title: "ПЕРЕДАНО ПОЛИЦИИ", text: "Район старой станции и Северный двор. Возможная тёмно-зелёная машина у шлагбаума. Дерек признался, что следовал за Харпер после ссоры и видел машину в районе станции.", delay: 300 }
    ]
  },
  {
    id: "late_larks_waiting",
    chat: "group_larks",
    trigger: "after:police_lead_common_update",
    messages: [
      { type: "pause", delay: 10000 },
      { from: "mia", text: "Не могу уснуть.", delay: 900 },
      { from: "olivia", text: "Пожалуйста, напишите, если кто-то что-то узнает.", delay: 1100 },
      { type: "pause", delay: 12000 },
      { type: "app_notification", title: "Ravenwood Police", text: "Поиски Харпер Вэнс завершены.", delay: 4000 },
      { type: "system", text: "Оливия в сети.", delay: 500, characterStatus: { id: "olivia", online: true } },
      { from: "olivia", text: "Мне позвонили.", delay: 900 },
      { from: "olivia", text: "Её нашли.", delay: 900 },
      { from: "olivia", text: "Харпер мертва.", delay: 1100 },
      { type: "system", text: "Миа в сети.", delay: 500, characterStatus: { id: "mia", online: true } },
      { from: "mia", text: "Нет.", delay: 800 },
      { from: "mia", text: "Нет, нет.", delay: 900 }
    ],
    setFlags: { harperFoundDead: true }
  },
  {
    id: "unknown_ravenfeed_instruction",
    chat: "private_unknown",
    trigger: "flag:harperFoundDead",
    identify: ["unknown"],
    messages: [
      { type: "pause", delay: 12000 },
      { type: "system", text: "Неизвестный в сети.", delay: 500, characterStatus: { id: "unknown", online: true } },
      { from: "unknown", text: "Не отвечай на новые сообщения.", delay: 900 },
      { from: "unknown", text: "Зайди в браузер.", delay: 900 },
      { from: "unknown", text: "Вбей в поиск ravenfeed.", delay: 900 },
      { from: "unknown", text: "И пока ничего не пиши в Larks.", delay: 900 }
    ]
  },
  {
    id: "unknown_after_ravenfeed_start",
    chat: "private_unknown",
    trigger: "flag:ravenwatchPostPublished",
    messages: [
      { from: "unknown", text: "Фото сделали во время подключения к твоему телефону.", delay: 1000 },
      { type: "choice", options: [
        { text: "Это та фотография, которую сделали через мою камеру?", loyalty: {}, next: "unknown_ravenfeed_same_photo" },
        { text: "Они выложили мой номер.", loyalty: {}, next: "unknown_ravenfeed_number" },
        { text: "Кто ведёт этот аккаунт?", loyalty: {}, next: "unknown_ravenfeed_account" }
      ]}
    ]
  },
  {
    id: "unknown_ravenfeed_same_photo",
    chat: "private_unknown",
    trigger: "choice:unknown_after_ravenfeed_start:0",
    messages: [
      { from: "unknown", text: "Да.", delay: 700 },
      { from: "unknown", text: "Та, которую ты видел перед перезагрузкой.", delay: 1000 }
    ]
  },
  {
    id: "unknown_ravenfeed_number",
    chat: "private_unknown",
    trigger: "choice:unknown_after_ravenfeed_start:1",
    messages: [
      { from: "unknown", text: "Им нужно, чтобы люди сами решили, что ты связан с исчезновением.", delay: 1200 }
    ]
  },
  {
    id: "unknown_ravenfeed_account",
    chat: "private_unknown",
    trigger: "choice:unknown_after_ravenfeed_start:2",
    messages: [
      { from: "unknown", text: "Пока не знаю.", delay: 800 },
      { from: "unknown", text: "Но пост отправили не случайно.", delay: 900 }
    ]
  },
  {
    id: "unknown_ravenfeed_common_one",
    chat: "private_unknown",
    trigger: "after:unknown_ravenfeed_same_photo|unknown_ravenfeed_number|unknown_ravenfeed_account",
    messages: [
      { from: "unknown", text: "Не отвечай в комментариях.", delay: 900 },
      { from: "unknown", text: "Не оправдывайся публично.", delay: 900 },
      { from: "unknown", text: "Сохрани время публикации и сам пост.", delay: 1000 },
      { type: "choice", options: [
        { text: "Ты можешь удалить этот пост?", loyalty: {}, next: "unknown_ravenfeed_delete" },
        { text: "Мне сказать Оливии и Мие?", loyalty: {}, next: "unknown_ravenfeed_tell_friends" },
        { text: "Что мне теперь делать?", loyalty: {}, next: "unknown_ravenfeed_what_now" }
      ]}
    ]
  },
  {
    id: "unknown_ravenfeed_delete",
    chat: "private_unknown",
    trigger: "choice:unknown_ravenfeed_common_one:0",
    messages: [
      { from: "unknown", text: "Не быстро.", delay: 800 },
      { from: "unknown", text: "Его уже могли скопировать.", delay: 900 }
    ]
  },
  {
    id: "unknown_ravenfeed_tell_friends",
    chat: "private_unknown",
    trigger: "choice:unknown_ravenfeed_common_one:1",
    messages: [
      { from: "unknown", text: "Скажи, что кто-то опубликовал твой номер.", delay: 1000 },
      { from: "unknown", text: "Не упоминай меня.", delay: 800 }
    ]
  },
  {
    id: "unknown_ravenfeed_what_now",
    chat: "private_unknown",
    trigger: "choice:unknown_ravenfeed_common_one:2",
    messages: [
      { from: "unknown", text: "Не давать им больше информации, чем они уже получили.", delay: 1100 }
    ]
  },
  {
    id: "unknown_ravenfeed_end",
    chat: "private_unknown",
    trigger: "after:unknown_ravenfeed_delete|unknown_ravenfeed_tell_friends|unknown_ravenfeed_what_now",
    messages: [
      { from: "unknown", text: "Тебя пытаются сделать частью этой истории.", delay: 1000 },
      { from: "unknown", text: "И теперь это увидит весь Рейвенвуд.", delay: 1000 },
      { type: "system", text: "Неизвестный вышел из сети.", delay: 900, characterStatus: { id: "unknown", online: false } },
      { type: "navigate", screen: "chapterEnd", delay: 1200 }
    ]
  }
];
