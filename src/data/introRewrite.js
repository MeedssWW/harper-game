// Approved opening: Derek's first private conversation and the group "Seven".
// Kept separate from chapter1.js so the long branching scene stays maintainable.

export const introRewriteBeats = [
  {
    id: "intro_derek_opener_v2",
    chat: "private_derek",
    trigger: "auto",
    unlock: [{ type: "contacts", id: "derek" }],
    identify: ["derek"],
    messages: [
      { type: "system", text: "Дерек в сети.", delay: 500, characterStatus: { id: "derek", online: true } },
      { from: "derek", text: "Привет.", delay: 800 },
      { from: "derek", text: "Слушай, ты меня не знаешь.", delay: 950 },
      { from: "derek", text: "Меня зовут Дерек.", delay: 850 },
      { from: "derek", text: "Ты знаешь Харпер Вэнс?", delay: 1100 },
      { type: "choice", options: [
        { text: "Нет. Впервые слышу это имя.", loyalty: {}, next: "intro_derek_never_heard" },
        { text: "Сначала скажи, откуда у тебя мой номер.", loyalty: {}, next: "intro_derek_number_source" }
      ] }
    ]
  },
  {
    id: "intro_derek_never_heard",
    chat: "private_derek",
    trigger: "choice:intro_derek_opener_v2:0",
    messages: [
      { from: "derek", text: "Точно?", delay: 700 },
      { from: "derek", text: "Может, она писала тебе с другого номера?", delay: 1050 },
      { type: "choice", options: [
        { text: "Нет. Я бы запомнил.", loyalty: {}, next: "intro_derek_would_remember" },
        { text: "Кто она вообще?", loyalty: {}, next: "intro_derek_who_is_she" }
      ] }
    ]
  },
  {
    id: "intro_derek_would_remember",
    chat: "private_derek",
    trigger: "choice:intro_derek_never_heard:0",
    messages: [
      { from: "derek", text: "Ладно.", delay: 700 },
      { from: "derek", text: "Тогда я вообще ничего не понимаю.", delay: 1000 }
    ]
  },
  {
    id: "intro_derek_who_is_she",
    chat: "private_derek",
    trigger: "choice:intro_derek_never_heard:1",
    messages: [
      { from: "derek", text: "Моя девушка.", delay: 750 },
      { from: "derek", text: "Сейчас объясню.", delay: 850 }
    ]
  },
  {
    id: "intro_derek_number_source",
    chat: "private_derek",
    trigger: "choice:intro_derek_opener_v2:1",
    messages: [
      { from: "derek", text: "С телефона Харпер.", delay: 850 },
      { from: "derek", text: "Поэтому я и написал.", delay: 900 }
    ]
  },
  {
    id: "intro_derek_explains_v2",
    chat: "private_derek",
    trigger: "after:intro_derek_would_remember|intro_derek_who_is_she|intro_derek_number_source",
    messages: [
      { from: "derek", text: "Харпер — моя девушка.", delay: 900 },
      { from: "derek", text: "Она пропала два дня назад.", delay: 1000 },
      { from: "derek", text: "Её телефон почти всё это время был недоступен.", delay: 1100 },
      { from: "derek", text: "А сегодня с её номера вдруг пришло сообщение.", delay: 1150 },
      { from: "derek", text: "Внутри был только твой номер.", delay: 1000 },
      { from: "derek", text: "И всё.", delay: 700 },
      { type: "choice", options: [
        { text: "Я правда её не знаю.", loyalty: {}, next: "intro_derek_error_first" },
        { text: "Ты уверен, что сообщение пришло именно от неё?", loyalty: {}, next: "intro_derek_sender_uncertain" },
        { text: "Телефон Харпер мог быть у кого-то другого?", loyalty: {}, next: "intro_derek_phone_other" }
      ] }
    ]
  },
  {
    id: "intro_derek_error_first",
    chat: "private_derek",
    trigger: "choice:intro_derek_explains_v2:0",
    messages: [
      { type: "choice", options: [
        { text: "Может, номер отправили по ошибке?", loyalty: {}, next: "intro_derek_error_answer" }
      ] }
    ]
  },
  {
    id: "intro_derek_error_answer",
    chat: "private_derek",
    trigger: "choice:intro_derek_error_first:0",
    messages: [
      { from: "derek", text: "Может.", delay: 750 },
      { from: "derek", text: "Я сначала тоже так подумал.", delay: 950 },
      { from: "derek", text: "Но в сообщении был именно твой номер.", delay: 1050 },
      { from: "derek", text: "Я несколько раз проверил.", delay: 950 }
    ]
  },
  {
    id: "intro_derek_sender_uncertain",
    chat: "private_derek",
    trigger: "choice:intro_derek_explains_v2:1",
    messages: [
      { from: "derek", text: "Нет.", delay: 700 },
      { from: "derek", text: "Я уверен только в том, что оно пришло с её номера.", delay: 1100 },
      { from: "derek", text: "Кто держал телефон — понятия не имею.", delay: 1000 }
    ]
  },
  {
    id: "intro_derek_phone_other",
    chat: "private_derek",
    trigger: "choice:intro_derek_explains_v2:2",
    messages: [
      { from: "derek", text: "Мог.", delay: 700 },
      { from: "derek", text: "Полиция его до сих пор не нашла.", delay: 1000 },
      { from: "derek", text: "Поэтому, короче, вариантов не так много.", delay: 1050 },
      { from: "derek", text: "Либо это была она.", delay: 850 },
      { from: "derek", text: "Либо кто-то хотел, чтобы я увидел твой номер.", delay: 1150 }
    ]
  },
  {
    id: "intro_derek_ravenwood",
    chat: "private_derek",
    trigger: "after:intro_derek_error_answer|intro_derek_sender_uncertain|intro_derek_phone_other",
    messages: [
      { from: "derek", text: "Ты когда-нибудь был в Рейвенвуде?", delay: 1050 },
      { type: "choice", options: [
        { text: "Нет. Я вообще из другого города.", loyalty: {}, next: "intro_derek_other_city" },
        { text: "Нет. До твоего сообщения я даже не слышал о нём.", loyalty: {}, next: "intro_derek_never_ravenwood" }
      ] }
    ]
  },
  {
    id: "intro_derek_other_city",
    chat: "private_derek",
    trigger: "choice:intro_derek_ravenwood:0",
    messages: [{ from: "derek", text: "Тогда вы вряд ли могли просто где-то пересечься.", delay: 1050 }]
  },
  {
    id: "intro_derek_never_ravenwood",
    chat: "private_derek",
    trigger: "choice:intro_derek_ravenwood:1",
    messages: [{ from: "derek", text: "Тогда тем более не понимаю, откуда у неё твой номер.", delay: 1100 }]
  },
  {
    id: "intro_derek_strange_contacts",
    chat: "private_derek",
    trigger: "after:intro_derek_other_city|intro_derek_never_ravenwood",
    messages: [
      { from: "derek", text: "За последние пару дней тебе никто странный не писал?", delay: 1100 },
      { from: "derek", text: "Может, звонили с незнакомого номера?", delay: 950 },
      { type: "choice", options: [
        { text: "Нет. Ничего необычного не было.", loyalty: {}, next: "intro_derek_nothing_odd" },
        { text: "Нет. Такое я бы точно запомнил.", loyalty: {}, next: "intro_derek_sure_remember" }
      ] }
    ]
  },
  {
    id: "intro_derek_nothing_odd",
    chat: "private_derek",
    trigger: "choice:intro_derek_strange_contacts:0",
    messages: [{ from: "derek", text: "Ясно.", delay: 750 }]
  },
  {
    id: "intro_derek_sure_remember",
    chat: "private_derek",
    trigger: "choice:intro_derek_strange_contacts:1",
    messages: [
      { from: "derek", text: "Да.", delay: 650 },
      { from: "derek", text: "Глупый вопрос.", delay: 800 }
    ]
  },
  {
    id: "intro_derek_group_offer",
    chat: "private_derek",
    trigger: "after:intro_derek_nothing_odd|intro_derek_sure_remember",
    messages: [
      { from: "derek", text: "Прости, что я так на тебя накинулся с вопросами.", delay: 1100 },
      { from: "derek", text: "Я почти не спал с тех пор, как Харпер пропала.", delay: 1150 },
      { from: "derek", text: "Просто пытаюсь найти хоть что-нибудь.", delay: 950 },
      { from: "derek", text: "У неё есть друзья.", delay: 850 },
      { from: "derek", text: "Они знают её лучше меня во многих вещах.", delay: 1050 },
      { from: "derek", text: "Может, кто-то из них поймёт, почему Харпер отправила твой номер.", delay: 1200 },
      { from: "derek", text: "Я хочу добавить тебя в чат с ними.", delay: 1000 },
      { type: "choice", options: [
        { text: "Подожди.", loyalty: {}, next: "intro_derek_privacy_first" },
        { text: "Только сразу скажи им, что я вообще не в курсе происходящего.", loyalty: {}, next: "intro_derek_warn_them" }
      ] }
    ]
  },
  {
    id: "intro_derek_privacy_first",
    chat: "private_derek",
    trigger: "choice:intro_derek_group_offer:0",
    messages: [{ type: "choice", options: [
      { text: "Не скидывай мой номер кому попало.", loyalty: {}, next: "intro_derek_privacy_answer" }
    ] }]
  },
  {
    id: "intro_derek_privacy_answer",
    chat: "private_derek",
    trigger: "choice:intro_derek_privacy_first:0",
    messages: [
      { from: "derek", text: "Я не буду отдельно его рассылать.", delay: 950 },
      { from: "derek", text: "Просто добавлю тебя в один чат.", delay: 950 },
      { from: "derek", text: "Там только люди, которые знают Харпер.", delay: 1050 }
    ]
  },
  {
    id: "intro_derek_warn_them",
    chat: "private_derek",
    trigger: "choice:intro_derek_group_offer:1",
    messages: [
      { from: "derek", text: "Скажу.", delay: 700 },
      { from: "derek", text: "Хотя они всё равно, скорее всего, начнут спрашивать сами.", delay: 1100 }
    ]
  },
  {
    id: "intro_derek_stay_request",
    chat: "private_derek",
    trigger: "after:intro_derek_privacy_answer|intro_derek_warn_them",
    messages: [
      { from: "derek", text: "Не выходи оттуда сразу, ладно?", delay: 950 },
      { from: "derek", text: "Хотя бы послушай, что они скажут.", delay: 950 },
      { type: "choice", options: [
        { text: "Ладно. Но я ничего не обещаю.", loyalty: {}, next: "intro_derek_no_promises" },
        { text: "Хорошо. Посмотрим, что они знают.", loyalty: {}, next: "intro_derek_agree" }
      ] }
    ]
  },
  {
    id: "intro_derek_no_promises",
    chat: "private_derek",
    trigger: "choice:intro_derek_stay_request:0",
    messages: [
      { from: "derek", text: "Хорошо.", delay: 700 },
      { from: "derek", text: "Этого хватит.", delay: 800 }
    ]
  },
  {
    id: "intro_derek_agree",
    chat: "private_derek",
    trigger: "choice:intro_derek_stay_request:1",
    messages: [{ from: "derek", text: "Спасибо.", delay: 750 }]
  },
  {
    id: "intro_derek_signoff",
    chat: "private_derek",
    trigger: "after:intro_derek_no_promises|intro_derek_agree",
    messages: [
      { from: "derek", text: "Сейчас добавлю.", delay: 850 },
      { type: "note_auto", id: "harper_intro_summary", title: "Харпер Вэнс", text: "Харпер Вэнс пропала два дня назад.\n\nСегодня с её телефона Дереку пришло сообщение, в котором был только мой номер. Телефон Харпер полиция пока не нашла.\n\nЯ никогда не был в Рейвенвуде и не знаю Харпер. Дерек собирается добавить меня в общий чат с её друзьями.", noteCompleteFlag: "harperIntroNoteWritten", delay: 350 },
      { type: "wait_flag", flag: "harperIntroNoteWritten", delay: 400 }
    ]
  },
  {
    id: "intro_group_seven_start",
    chat: "group_main",
    trigger: "after:intro_derek_signoff",
    unlock: [
      { type: "chats", id: "group_main" },
      { type: "contacts", id: "mason" },
      { type: "contacts", id: "brooke" },
      { type: "contacts", id: "mia" },
      { type: "contacts", id: "olivia" },
      { type: "contacts", id: "tyler" }
    ],
    identify: ["mason", "brooke", "mia", "olivia", "tyler"],
    messages: [
      { type: "pause", delay: 2600 },
      { from: "narrator", text: "Дерек создал группу «Семеро».", delay: 750 },
      { from: "narrator", text: "Дерек добавил Оливию, Мию, Брук, Мейсона, Тайлера и {player}.", delay: 900 },
      { type: "system", text: "Мейсон в сети.", delay: 450, characterStatus: { id: "mason", online: true } },
      { from: "mason", text: "Дерек, ты серьёзно?", delay: 750 },
      { type: "system", text: "Брук в сети.", delay: 450, characterStatus: { id: "brooke", online: true } },
      { from: "brooke", text: "Что это вообще?", delay: 700 },
      { from: "brooke", text: "Ты просто взял и добавил сюда незнакомого человека?", delay: 1050 },
      { type: "system", text: "Миа в сети.", delay: 450, characterStatus: { id: "mia", online: true } },
      { from: "mia", text: "Это тот номер?", delay: 750 },
      { from: "mia", text: "Который пришёл с телефона Харпер?", delay: 900 },
      { from: "derek", text: "Да.", delay: 600 },
      { from: "derek", text: "Тот самый.", delay: 700 },
      { from: "mia", text: "И он правда ничего не знает?", delay: 900 },
      { from: "derek", text: "По его словам — нет.", delay: 850 },
      { type: "system", text: "Оливия в сети.", delay: 450, characterStatus: { id: "olivia", online: true } },
      { from: "olivia", text: "Подождите.", delay: 700 },
      { from: "olivia", text: "Давайте хотя бы не будем сразу на него набрасываться.", delay: 1100 },
      { from: "brooke", text: "Я не набрасываюсь.", delay: 800 },
      { from: "brooke", text: "Я хочу понять, почему какой-то незнакомец теперь сидит в нашем чате.", delay: 1200 },
      { from: "derek", text: "Потому что Харпер отправила его номер.", delay: 950 },
      { from: "mason", text: "Ты не знаешь, что именно Харпер отправила его номер.", delay: 1150 },
      { from: "mason", text: "Телефон мог быть у кого угодно.", delay: 950 },
      { from: "mia", text: "Но зачем кому-то отправлять именно его?", delay: 1000 },
      { from: "brooke", text: "Может, чтобы мы сейчас делали ровно то, что делаем.", delay: 1100 },
      { from: "derek", text: "И что именно мы делаем?", delay: 850 },
      { from: "brooke", text: "Паникуем.", delay: 700 },
      { from: "brooke", text: "И тащим сюда людей, о которых ничего не знаем.", delay: 1050 },
      { type: "system", text: "Тайлер в сети.", delay: 450, characterStatus: { id: "tyler", online: true } },
      { from: "tyler", text: "Дерек скинул мне скрин сообщения.", delay: 950 },
      { from: "tyler", text: "Номер совпадает.", delay: 750 },
      { from: "mason", text: "Это ничего не доказывает.", delay: 850 },
      { from: "derek", text: "Я и не говорил, что доказывает.", delay: 850 },
      { from: "derek", text: "{player}, скажи им сам.", delay: 850 },
      { type: "choice", options: [
        { text: "Я Харпер не знаю.", loyalty: {}, next: "intro_group_dont_know_first" },
        { text: "Я сам не понимаю, зачем мой номер оказался у Харпер.", loyalty: {}, next: "intro_group_same_question" }
      ] }
    ]
  },
  {
    id: "intro_group_dont_know_first",
    chat: "group_main",
    trigger: "choice:intro_group_seven_start:0",
    messages: [{ type: "choice", options: [
      { text: "Дерек написал мне несколько минут назад.", loyalty: {}, next: "intro_group_dont_know_answer" }
    ] }]
  },
  {
    id: "intro_group_dont_know_answer",
    chat: "group_main",
    trigger: "choice:intro_group_dont_know_first:0",
    messages: [
      { from: "brooke", text: "И ты сразу решил остаться в чате её друзей?", delay: 1000 },
      { type: "choice", options: [
        { text: "Дерек попросил не выходить сразу.", loyalty: {}, next: "intro_group_derek_asked" },
        { text: "Я тоже хочу понять, что происходит.", loyalty: {}, next: "intro_group_want_understand" }
      ] }
    ]
  },
  {
    id: "intro_group_derek_asked",
    chat: "group_main",
    trigger: "choice:intro_group_dont_know_answer:0",
    messages: [
      { from: "brooke", text: "Ну да.", delay: 650 },
      { from: "brooke", text: "Конечно попросил.", delay: 750 }
    ]
  },
  {
    id: "intro_group_want_understand",
    chat: "group_main",
    trigger: "choice:intro_group_dont_know_answer:1",
    messages: [{ from: "mia", text: "Это хотя бы честно.", delay: 800 }]
  },
  {
    id: "intro_group_same_question",
    chat: "group_main",
    trigger: "choice:intro_group_seven_start:1",
    messages: [
      { from: "derek", text: "Вот поэтому я тебя сюда и добавил.", delay: 900 },
      { from: "brooke", text: "Да, Дерек.", delay: 700 },
      { from: "brooke", text: "Мы уже поняли, что у тебя на всё один ответ.", delay: 950 }
    ]
  },
  {
    id: "intro_group_ravenwood",
    chat: "group_main",
    trigger: "after:intro_group_derek_asked|intro_group_want_understand|intro_group_same_question",
    messages: [
      { from: "olivia", text: "Ты когда-нибудь был в Рейвенвуде?", delay: 950 },
      { type: "choice", options: [
        { text: "Нет. Я живу в другом городе.", loyalty: {}, next: "intro_group_other_city" },
        { text: "Нет. До сегодняшнего дня я даже не слышал о Рейвенвуде.", loyalty: {}, next: "intro_group_never_heard_city" }
      ] }
    ]
  },
  {
    id: "intro_group_other_city",
    chat: "group_main",
    trigger: "choice:intro_group_ravenwood:0",
    messages: [{ from: "tyler", text: "Тогда случайно встретиться с Харпер ты вряд ли мог.", delay: 1000 }]
  },
  {
    id: "intro_group_never_heard_city",
    chat: "group_main",
    trigger: "choice:intro_group_ravenwood:1",
    messages: [
      { from: "brooke", text: "Очень удобно.", delay: 750 },
      { from: "olivia", text: "Брук.", delay: 650 },
      { from: "brooke", text: "А что?", delay: 650 },
      { from: "brooke", text: "Мы вообще ничего о нём не знаем.", delay: 900 }
    ]
  },
  {
    id: "intro_group_argument",
    chat: "group_main",
    trigger: "after:intro_group_other_city|intro_group_never_heard_city",
    messages: [
      { from: "mason", text: "Вот поэтому этот разговор и не должен происходить здесь.", delay: 1100 },
      { from: "mason", text: "У нас есть сообщение с телефона Харпер.", delay: 950 },
      { from: "mason", text: "И номер человека, которого никто из нас не знает.", delay: 1000 },
      { from: "mason", text: "Всё это нужно передать полиции.", delay: 900 },
      { from: "derek", text: "Я уже передал.", delay: 750 },
      { from: "mason", text: "Тогда зачем этот чат?", delay: 800 },
      { from: "derek", text: "Потому что полиция считает, что Харпер могла просто уехать.", delay: 1150 },
      { from: "mia", text: "Она бы сказала.", delay: 700 },
      { from: "mia", text: "Хотя бы кому-нибудь из нас.", delay: 850 },
      { from: "brooke", text: "Оливии точно сказала бы.", delay: 850 },
      { from: "olivia", text: "Не обязательно.", delay: 750 },
      { from: "brooke", text: "Ты серьёзно?", delay: 700 },
      { from: "olivia", text: "Я говорю только то, что мы не можем знать наверняка.", delay: 1050 },
      { from: "derek", text: "Мне бы она сказала.", delay: 850 },
      { from: "mason", text: "Вот именно из-за таких фраз вы сейчас и начинаете придумывать версии.", delay: 1200 },
      { from: "derek", text: "Я ничего не придумываю.", delay: 800 },
      { from: "derek", text: "Она исчезла на два дня.", delay: 850 },
      { from: "derek", text: "Потом с её телефона приходит номер незнакомого человека.", delay: 1050 },
      { from: "derek", text: "И я должен просто сидеть?", delay: 900 },
      { from: "mason", text: "Ты должен дать полиции делать свою работу.", delay: 1000 },
      { from: "derek", text: "Они её даже нормально не ищут.", delay: 850 },
      { from: "mason", text: "Ты этого не знаешь.", delay: 750 },
      { from: "derek", text: "Я с ними разговаривал.", delay: 800 },
      { from: "derek", text: "Они всё сводят к тому, что она могла уйти сама.", delay: 1000 },
      { from: "mia", text: "Харпер не стала бы вот так исчезать.", delay: 900 },
      { from: "mason", text: "Вы сейчас говорите не фактами.", delay: 850 },
      { from: "mason", text: "Вы говорите тем, во что хотите верить.", delay: 950 },
      { from: "derek", text: "А ты, значит, у нас самый умный?", delay: 850 },
      { from: "mason", text: "Нет.", delay: 600 },
      { from: "mason", text: "Я просто не хочу, чтобы вы окончательно всё испортили.", delay: 1050 },
      { from: "mia", text: "Можно вы хотя бы две минуты не будете друг на друга орать?", delay: 1100 },
      { from: "derek", text: "Я не ору.", delay: 700 },
      { from: "brooke", text: "Конечно.", delay: 650 },
      { from: "brooke", text: "Ты просто создал чат без предупреждения, добавил сюда незнакомца и теперь со всеми споришь.", delay: 1250 },
      { from: "derek", text: "Я пытаюсь найти Харпер.", delay: 850 },
      { from: "brooke", text: "А мы, по-твоему, нет?", delay: 800 },
      { from: "derek", text: "Тогда почему вы только рассказываете мне, что я всё делаю неправильно?", delay: 1150 },
      { from: "brooke", text: "Потому что ты опять решил всё за остальных.", delay: 1000 },
      { from: "derek", text: "Я никого ни к чему не заставлял.", delay: 850 },
      { from: "brooke", text: "Ты даже не спросил, прежде чем добавить его сюда.", delay: 1000 },
      { from: "brooke", text: "Это и называется решить за остальных.", delay: 950 },
      { type: "choice", options: [
        { text: "Я могу выйти, если из-за меня всё это началось.", loyalty: {}, next: "intro_group_offer_leave" },
        { text: "Может, сначала разберёмся хотя бы с тем, что известно точно?", loyalty: {}, next: "intro_group_stick_to_facts" }
      ] }
    ]
  },
  {
    id: "intro_group_offer_leave",
    chat: "group_main",
    trigger: "choice:intro_group_argument:0",
    messages: [
      { from: "derek", text: "Нет.", delay: 650 },
      { from: "derek", text: "Подожди ещё немного.", delay: 800 },
      { from: "brooke", text: "Господи.", delay: 650 },
      { from: "brooke", text: "Сначала добавить без спроса.", delay: 800 },
      { from: "brooke", text: "Потом уговаривать не уходить.", delay: 850 },
      { from: "derek", text: "Брук, хватит.", delay: 750 }
    ]
  },
  {
    id: "intro_group_stick_to_facts",
    chat: "group_main",
    trigger: "choice:intro_group_argument:1",
    messages: [
      { from: "mason", text: "Нет.", delay: 650 },
      { from: "mason", text: "Мы не будем обсуждать личные вещи Харпер с человеком, которого впервые видим.", delay: 1200 },
      { from: "olivia", text: "Он прав.", delay: 700 },
      { from: "olivia", text: "Пока мы даже не знаем, у кого был её телефон.", delay: 1000 }
    ]
  },
  {
    id: "intro_group_falls_apart",
    chat: "group_main",
    trigger: "after:intro_group_offer_leave|intro_group_stick_to_facts",
    messages: [
      { from: "tyler", text: "Короче, мы всё равно ничего сейчас не выясним.", delay: 1000 },
      { from: "tyler", text: "Только окончательно переругаемся.", delay: 850 },
      { from: "mason", text: "Я в этом участвовать не буду.", delay: 850 },
      { from: "mason", text: "Дерек, скинь полиции номер и само сообщение.", delay: 1000 },
      { from: "mason", text: "И больше ничего сам не предпринимай.", delay: 950 },
      { from: "derek", text: "Ты вот так просто уйдёшь?", delay: 800 },
      { from: "mason", text: "Да.", delay: 600 },
      { from: "mason", text: "Потому что этот чат уже был плохой идеей.", delay: 950 },
      { type: "system", text: "Мейсон вышел из чата.", delay: 700, characterStatus: { id: "mason", online: false } },
      { from: "mia", text: "Отлично.", delay: 650 },
      { from: "mia", text: "Теперь ещё и Мейсон ушёл.", delay: 800 },
      { from: "brooke", text: "Потому что он единственный здесь думает головой.", delay: 950 },
      { from: "derek", text: "Тогда зачем ты сама ещё здесь?", delay: 850 },
      { from: "brooke", text: "Чтобы ты хотя бы раз услышал, что тебе говорят.", delay: 1000 },
      { from: "derek", text: "Я услышал.", delay: 700 },
      { from: "brooke", text: "Нет.", delay: 600 },
      { from: "brooke", text: "Ты уже решил, что этот человек как-то поможет.", delay: 950 },
      { from: "brooke", text: "Хотя вчера он даже не знал, кто такая Харпер.", delay: 950 },
      { from: "derek", text: "Я такого не говорил.", delay: 750 },
      { from: "brooke", text: "Но ведёшь себя именно так.", delay: 800 },
      { from: "olivia", text: "Брук, остановись.", delay: 750 },
      { from: "brooke", text: "Да пожалуйста.", delay: 650 },
      { from: "brooke", text: "Разбирайтесь сами.", delay: 750 },
      { type: "system", text: "Брук вышла из чата.", delay: 700, characterStatus: { id: "brooke", online: false } },
      { from: "mia", text: "Ну зачем она так?", delay: 750 },
      { from: "olivia", text: "Она напугана.", delay: 750 },
      { from: "derek", text: "Мы все напуганы.", delay: 750 },
      { from: "mia", text: "Я знаю.", delay: 650 },
      { from: "mia", text: "Но мне и так страшно.", delay: 800 },
      { from: "mia", text: "А читать, как вы друг на друга кидаетесь, только хуже.", delay: 1050 },
      { from: "olivia", text: "Миа.", delay: 650 },
      { from: "mia", text: "Я просто выйду, ладно?", delay: 800 },
      { from: "mia", text: "Мне нужно немного успокоиться.", delay: 850 },
      { type: "system", text: "Миа вышла из чата.", delay: 700, characterStatus: { id: "mia", online: false } },
      { from: "tyler", text: "Хороший чат получился.", delay: 750 },
      { from: "derek", text: "Тайлер, не начинай.", delay: 750 },
      { from: "tyler", text: "Я и не начинал.", delay: 700 },
      { from: "tyler", text: "Ты собрал всех без предупреждения.", delay: 850 },
      { from: "tyler", text: "Ну и чего ты ждал?", delay: 750 },
      { from: "derek", text: "Что мы нормально поговорим.", delay: 850 },
      { from: "tyler", text: "Серьёзно?", delay: 650 },
      { from: "tyler", text: "Брук, Мейсон и ты в одном чате?", delay: 850 },
      { from: "tyler", text: "Нормально поговорим?", delay: 750 },
      { from: "derek", text: "Очень смешно.", delay: 700 },
      { from: "tyler", text: "Я не шучу.", delay: 700 },
      { from: "tyler", text: "Я всё равно ничего полезного здесь не скажу.", delay: 900 },
      { from: "tyler", text: "Отправь всё полиции.", delay: 750 },
      { type: "system", text: "Тайлер вышел из чата.", delay: 700, characterStatus: { id: "tyler", online: false } },
      { from: "olivia", text: "Дерек.", delay: 650 },
      { from: "olivia", text: "Удали группу.", delay: 750 },
      { from: "derek", text: "И что потом?", delay: 700 },
      { from: "olivia", text: "Потом дай всем немного успокоиться.", delay: 900 },
      { from: "derek", text: "А с номером что делать?", delay: 800 },
      { from: "olivia", text: "Пока ничего.", delay: 700 },
      { from: "olivia", text: "Не скидывай его больше никому.", delay: 850 },
      { from: "olivia", text: "И не дави на {player}.", delay: 800 },
      { from: "derek", text: "Я не давлю.", delay: 700 },
      { from: "olivia", text: "Ты попросил незнакомого человека остаться в чате, где на него сразу все накинулись.", delay: 1200 },
      { from: "olivia", text: "Даже если ты не хотел давить, именно так это и выглядит.", delay: 1100 },
      { from: "derek", text: "Ладно.", delay: 650 },
      { from: "derek", text: "Понял.", delay: 700 },
      { type: "choice", options: [
        { text: "Если мне придёт что-то странное, я напишу.", loyalty: {}, next: "intro_group_report_strange" },
        { text: "Я тоже хочу понять, почему мой номер оказался у Харпер.", loyalty: {}, next: "intro_group_want_answer" }
      ] }
    ]
  },
  {
    id: "intro_group_report_strange",
    chat: "group_main",
    trigger: "choice:intro_group_falls_apart:0",
    messages: [
      { from: "olivia", text: "Хорошо.", delay: 700 },
      { from: "olivia", text: "Пока этого достаточно.", delay: 800 },
      { from: "derek", text: "Спасибо.", delay: 700 }
    ]
  },
  {
    id: "intro_group_want_answer",
    chat: "group_main",
    trigger: "choice:intro_group_falls_apart:1",
    messages: [
      { from: "derek", text: "Тогда не пропадай.", delay: 750 },
      { from: "olivia", text: "Дерек.", delay: 650 },
      { from: "derek", text: "Что?", delay: 600 },
      { from: "olivia", text: "Ты опять.", delay: 650 },
      { from: "derek", text: "Ладно.", delay: 650 },
      { from: "derek", text: "Прости.", delay: 700 }
    ]
  },
  {
    id: "intro_group_olivia_leaves",
    chat: "group_main",
    trigger: "after:intro_group_report_strange|intro_group_want_answer",
    messages: [
      { from: "olivia", text: "Я напишу тебе позже.", delay: 800 },
      { from: "olivia", text: "Когда здесь всё немного уляжется.", delay: 850 },
      { type: "system", text: "Оливия вышла из чата.", delay: 700, characterStatus: { id: "olivia", online: false } },
      { from: "derek", text: "Ну вот.", delay: 650 },
      { from: "derek", text: "В итоге все ушли.", delay: 750 },
      { from: "derek", text: "Прости за это.", delay: 750 },
      { from: "derek", text: "Я правда думал, что если соберу всех вместе, мы хоть что-то поймём.", delay: 1150 },
      { from: "derek", text: "А получилось только хуже.", delay: 850 },
      { type: "choice", options: [
        { text: "Ты просто слишком резко всё сделал.", loyalty: {}, trust: { derekTrust: 1 }, next: "intro_group_too_sudden" },
        { text: "Лучше правда удали группу.", loyalty: {}, next: "intro_group_delete_it" }
      ] }
    ]
  },
  {
    id: "intro_group_too_sudden",
    chat: "group_main",
    trigger: "choice:intro_group_olivia_leaves:0",
    messages: [
      { from: "derek", text: "Да.", delay: 650 },
      { from: "derek", text: "Теперь уже вижу.", delay: 750 },
      { from: "derek", text: "Надо было хотя бы предупредить остальных.", delay: 900 }
    ]
  },
  {
    id: "intro_group_delete_it",
    chat: "group_main",
    trigger: "choice:intro_group_olivia_leaves:1",
    messages: [
      { from: "derek", text: "Удалю.", delay: 700 },
      { from: "derek", text: "Здесь всё равно уже никого не осталось.", delay: 900 }
    ]
  },
  {
    id: "intro_group_seven",
    chat: "group_main",
    trigger: "after:intro_group_too_sudden|intro_group_delete_it",
    messages: [
      { from: "derek", text: "Если Харпер отправила твой номер не случайно…", delay: 950 },
      { from: "derek", text: "Надеюсь, мы поймём зачем.", delay: 850 },
      { from: "narrator", text: "Дерек удалил группу «Семеро».", delay: 1000 },
      { type: "lock", targetType: "chats", id: "group_main", delay: 300 }
    ]
  }
];
