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
      { from: "derek", text: "Привет", delay: 800 },
      { from: "derek", text: "Это может прозвучать странно, но", delay: 950 },
      { from: "derek", text: "Ты случайно не знаешь Харпер Вэнс?", delay: 1100 },
      { type: "choice", options: [
        { text: "Нет. Впервые слышу это имя.", loyalty: {}, next: "intro_derek_never_heard" },
        { text: "Ты, кажется, ошибся номером.", loyalty: {}, next: "intro_derek_number_source" }
      ] }
    ]
  },
  {
    id: "intro_derek_never_heard",
    chat: "private_derek",
    trigger: "choice:intro_derek_opener_v2:0",
    messages: [
      { from: "derek", text: "Точно?", delay: 700 },
      { from: "derek", text: "Может, имя просто не помнишь?", delay: 950 },
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
      { from: "derek", text: "Тогда я вообще ничего не понимаю.", delay: 1050 }
    ]
  },
  {
    id: "intro_derek_who_is_she",
    chat: "private_derek",
    trigger: "choice:intro_derek_never_heard:1",
    messages: [
      { from: "derek", text: "Сейчас.", delay: 750 },
      { from: "derek", text: "Сейчас объясню.", delay: 850 }
    ]
  },
  {
    id: "intro_derek_number_source",
    chat: "private_derek",
    trigger: "choice:intro_derek_opener_v2:1",
    messages: [
      { from: "derek", text: "Я тоже сначала так подумал.", delay: 850 },
      { from: "derek", text: "Но номер точно этот. Я проверил.", delay: 1000 }
    ]
  },
  {
    id: "intro_derek_explains_v2",
    chat: "private_derek",
    trigger: "after:intro_derek_would_remember|intro_derek_who_is_she|intro_derek_number_source",
    messages: [
      { from: "derek", text: "Короче, это моя девушка.", delay: 850 },
      { from: "derek", text: "Она пропала два дня назад, и её телефон почти всё это время был недоступен.", delay: 1150 },
      { from: "derek", text: "А сегодня с её номера пришло сообщение, и внутри был только твой номер.", delay: 1200 },
      { from: "derek", text: "Ни текста, ничего.", delay: 750 },
      { type: "choice", options: [
        { text: "Я её не знаю. Ты точно не ошибся в цифрах?", loyalty: {}, next: "intro_derek_error_answer" },
        { text: "Подожди. Ты уверен, что писала она?", loyalty: {}, next: "intro_derek_sender_uncertain" },
        { text: "А если её телефон сейчас у кого-то другого?", loyalty: {}, next: "intro_derek_phone_other" }
      ] }
    ]
  },
  {
    id: "intro_derek_error_answer",
    chat: "private_derek",
    trigger: "choice:intro_derek_explains_v2:0",
    messages: [
      { from: "derek", text: "Да, я несколько раз проверил.", delay: 900 },
      { from: "derek", text: "Всё совпадает.", delay: 800 },
      { from: "derek", text: "Это точно твой номер.", delay: 900 }
    ]
  },
  {
    id: "intro_derek_sender_uncertain",
    chat: "private_derek",
    trigger: "choice:intro_derek_explains_v2:1",
    messages: [
      { from: "derek", text: "Нет, я не уверен, что это писала Харпер.", delay: 950 },
      { from: "derek", text: "Я знаю только, что сообщение пришло с её номера, а у кого был телефон — понятия не имею.", delay: 1200 }
    ]
  },
  {
    id: "intro_derek_phone_other",
    chat: "private_derek",
    trigger: "choice:intro_derek_explains_v2:2",
    messages: [
      { from: "derek", text: "Вполне может быть, потому что телефон до сих пор не нашли.", delay: 1000 },
      { from: "derek", text: "Либо это была она, либо кто-то специально подсунул мне твой номер.", delay: 1150 }
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
        { text: "Нет. До твоего сообщения я даже не слышал о нём. Почему спрашиваешь?", loyalty: {}, next: "intro_derek_never_ravenwood" }
      ] }
    ]
  },
  {
    id: "intro_derek_other_city",
    chat: "private_derek",
    trigger: "choice:intro_derek_ravenwood:0",
    messages: [{ from: "derek", text: "То есть вы даже случайно пересечься не могли.", delay: 1050 }]
  },
  {
    id: "intro_derek_never_ravenwood",
    chat: "private_derek",
    trigger: "choice:intro_derek_ravenwood:1",
    messages: [{ from: "derek", text: "Тогда откуда у неё вообще взялся твой номер?", delay: 1100 }]
  },
  {
    id: "intro_derek_strange_contacts",
    chat: "private_derek",
    trigger: "after:intro_derek_other_city|intro_derek_never_ravenwood",
    messages: [
      { from: "derek", text: "Тебе в последние дни ничего странного не приходило?", delay: 1100 },
      { from: "derek", text: "Ну там сообщения или звонки с незнакомых номеров.", delay: 950 },
      { type: "choice", options: [
        { text: "Нет. Ничего необычного не было.", loyalty: {}, next: "intro_derek_nothing_odd" },
        { text: "Нет. И если бы что-то было, я бы уже сказал.", loyalty: {}, next: "intro_derek_sure_remember" }
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
      { from: "derek", text: "Понял.", delay: 650 },
      { from: "derek", text: "Я просто уже всё подряд проверяю.", delay: 900 }
    ]
  },
  {
    id: "intro_derek_group_offer",
    chat: "private_derek",
    trigger: "after:intro_derek_nothing_odd|intro_derek_sure_remember",
    messages: [
      { from: "derek", text: "Извини. Я сразу навалился с вопросами.", delay: 1050 },
      { from: "derek", text: "Я почти не спал.", delay: 1150 },
      { from: "derek", text: "Уже сам путаюсь, что проверил, а что нет.", delay: 950 },
      { from: "derek", text: "Хочу спросить её друзей.", delay: 850 },
      { from: "derek", text: "Может, они что-то знают.", delay: 950 },
      { from: "derek", text: "Вдруг хоть кто-то поймёт, откуда взялся твой номер.", delay: 1150 },
      { from: "derek", text: "Короче, добавлю тебя в наш чат.", delay: 950 },
      { type: "choice", options: [
        { text: "Подожди. Не раздавай мой номер кому попало. Только этот чат — и всё.", loyalty: {}, next: "intro_derek_privacy_answer" },
        { text: "Только сразу скажи им, что я вообще не в курсе происходящего.", loyalty: {}, next: "intro_derek_warn_them" }
      ] }
    ]
  },
  {
    id: "intro_derek_privacy_answer",
    chat: "private_derek",
    trigger: "choice:intro_derek_group_offer:0",
    messages: [
      { from: "derek", text: "Только один чат.", delay: 800 },
      { from: "derek", text: "Там пять её друзей. И я.", delay: 950 },
      { from: "derek", text: "Больше никому не отправлю.", delay: 900 }
    ]
  },
  {
    id: "intro_derek_warn_them",
    chat: "private_derek",
    trigger: "choice:intro_derek_group_offer:1",
    messages: [
      { from: "derek", text: "Скажу.", delay: 700 },
      { from: "derek", text: "Но вопросы всё равно будут. Сразу предупреждаю.", delay: 1050 }
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
      { from: "derek", text: "Ладно.", delay: 700 },
      { from: "derek", text: "И на том спасибо.", delay: 800 }
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
      { from: "mason", text: "Дерек, ты сейчас серьёзно?", delay: 750 },
      { type: "system", text: "Брук в сети.", delay: 450, characterStatus: { id: "brooke", online: true } },
      { from: "brooke", text: "О.", delay: 550 },
      { from: "brooke", text: "Новый человек.", delay: 650 },
      { from: "brooke", text: "Ты хоть кого-нибудь спросил, прежде чем его добавить?", delay: 1050 },
      { type: "system", text: "Миа в сети.", delay: 450, characterStatus: { id: "mia", online: true } },
      { from: "mia", text: "Подождите. Это тот номер?", delay: 850 },
      { from: "mia", text: "Из сообщения с её телефона?", delay: 850 },
      { from: "derek", text: "Да.", delay: 600 },
      { from: "derek", text: "Именно он.", delay: 650 },
      { from: "mia", text: "И он правда ничего не знает?", delay: 900 },
      { from: "derek", text: "Так говорит.", delay: 750 },
      { type: "system", text: "Оливия в сети.", delay: 450, characterStatus: { id: "olivia", online: true } },
      { from: "olivia", text: "Стоп.", delay: 650 },
      { from: "olivia", text: "Он сам не просил, чтобы его сюда добавляли.", delay: 1000 },
      { from: "brooke", text: "Я не набрасываюсь.", delay: 800 },
      { from: "brooke", text: "Мне просто интересно, почему незнакомец уже в нашем чате.", delay: 1100 },
      { from: "derek", text: "Потому что с телефона Харпер пришёл его номер.", delay: 1000 },
      { from: "mason", text: "И ты сразу притащил его сюда?", delay: 900 },
      { from: "mason", text: "Телефон мог быть у кого угодно.", delay: 900 },
      { from: "mia", text: "Но зачем кому-то отправлять именно его?", delay: 1000 },
      { from: "brooke", text: "Может, кто-то просто хотел, чтобы мы все запаниковали.", delay: 1000 },
      { from: "derek", text: "Ты сейчас серьёзно?", delay: 800 },
      { from: "brooke", text: "Мы уже все здесь. Как думаешь?", delay: 850 },
      { type: "system", text: "Тайлер в сети.", delay: 450, characterStatus: { id: "tyler", online: true } },
      { from: "tyler", text: "Скрин видел.", delay: 750 },
      { from: "tyler", text: "Номер совпадает.", delay: 750 },
      { from: "tyler", text: "И больше этот скрин ничего не доказывает.", delay: 900 },
      { from: "derek", text: "Я и не говорил, что больше.", delay: 800 },
      { from: "derek", text: "{player}, скажи сам.", delay: 800 },
      { type: "choice", options: [
        { text: "Я не знаю Харпер. До Дерека я даже имени её не слышал.", loyalty: {}, next: "intro_group_dont_know_answer" },
        { text: "Я сам ничего не понимаю. Пытаюсь выяснить, как мой номер туда попал.", loyalty: {}, next: "intro_group_same_question" }
      ] }
    ]
  },
  {
    id: "intro_group_dont_know_answer",
    chat: "group_main",
    trigger: "choice:intro_group_seven_start:0",
    messages: [
      { from: "brooke", text: "И всё равно решил остаться?", delay: 900 },
      { type: "choice", options: [
        { text: "Дерек попросил не выходить. Я пока просто слушаю.", loyalty: {}, next: "intro_group_derek_asked" },
        { text: "Потому что там мой номер. Я тоже хочу понять, какого чёрта происходит.", loyalty: {}, next: "intro_group_want_understand" }
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
    messages: [{ from: "mia", text: "Понимаю. Я бы тоже не смогла просто закрыть чат.", delay: 950 }]
  },
  {
    id: "intro_group_same_question",
    chat: "group_main",
    trigger: "choice:intro_group_seven_start:1",
    messages: [
      { from: "derek", text: "Вот поэтому я тебя сюда и добавил.", delay: 900 },
      { from: "brooke", text: "Да, Дерек. Мы поняли.", delay: 750 },
      { from: "brooke", text: "«Харпер прислала номер». А дальше что?", delay: 950 }
    ]
  },
  {
    id: "intro_group_ravenwood",
    chat: "group_main",
    trigger: "after:intro_group_derek_asked|intro_group_want_understand|intro_group_same_question",
    messages: [
      { from: "olivia", text: "Ладно. Ты вообще бывал в Рейвенвуде?", delay: 950 },
      { type: "choice", options: [
        { text: "Нет. Я живу в другом городе.", loyalty: {}, next: "intro_group_other_city" },
        { text: "Нет. До сегодня это название мне вообще ничего не говорило.", loyalty: {}, next: "intro_group_never_heard_city" }
      ] }
    ]
  },
  {
    id: "intro_group_other_city",
    chat: "group_main",
    trigger: "choice:intro_group_ravenwood:0",
    messages: [{ from: "tyler", text: "Тогда случайно пересечься вы вряд ли могли.", delay: 900 }]
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
      { from: "mason", text: "Вот поэтому какого чёрта мы обсуждаем это здесь?", delay: 1050 },
      { from: "mason", text: "У нас есть номер. Есть скрин. Всё.", delay: 900 },
      { from: "mason", text: "Пусть полиция разбирается.", delay: 850 },
      { from: "derek", text: "Я уже передал.", delay: 750 },
      { from: "mason", text: "Тогда зачем ты устроил этот чат?", delay: 850 },
      { from: "derek", text: "Потому что они говорят ждать.", delay: 850 },
      { from: "derek", text: "И что Харпер могла сама уехать.", delay: 950 },
      { from: "mia", text: "Она бы сказала.", delay: 700 },
      { from: "mia", text: "Ну хоть кому-нибудь.", delay: 800 },
      { from: "brooke", text: "Оливии точно сказала бы.", delay: 850 },
      { from: "olivia", text: "Не факт.", delay: 700 },
      { from: "brooke", text: "Ты серьёзно?", delay: 700 },
      { from: "olivia", text: "Да. Мы не можем знать, кому она бы что сказала.", delay: 1000 },
      { from: "derek", text: "Мне бы сказала.", delay: 800 },
      { from: "mason", text: "Вот именно. Ты опять решил за неё.", delay: 950 },
      { from: "derek", text: "Я ничего не придумываю.", delay: 800 },
      { from: "derek", text: "Её нет уже два дня, а потом с её телефона приходит номер какого-то незнакомца.", delay: 1150 },
      { from: "derek", text: "И я должен просто сидеть?", delay: 900 },
      { from: "mason", text: "Дай полиции работать, Дерек.", delay: 900 },
      { from: "derek", text: "Они её даже нормально не ищут.", delay: 850 },
      { from: "mason", text: "Ты не знаешь, что они делают.", delay: 800 },
      { from: "derek", text: "Я с ними разговаривал.", delay: 800 },
      { from: "derek", text: "Они всё сводят к тому, что она могла уйти сама.", delay: 1000 },
      { from: "mia", text: "Харпер не стала бы вот так исчезать.", delay: 900 },
      { from: "mason", text: "Это не факты.", delay: 750 },
      { from: "mason", text: "Вы просто повторяете то, во что хотите верить.", delay: 950 },
      { from: "derek", text: "А ты, значит, у нас самый умный?", delay: 850 },
      { from: "mason", text: "Нет.", delay: 600 },
      { from: "mason", text: "Я не хочу потом разгребать твой очередной «план».", delay: 1050 },
      { from: "mia", text: "Можно вы хотя бы две минуты не будете друг на друга орать?", delay: 1100 },
      { from: "derek", text: "Я не ору.", delay: 700 },
      { from: "brooke", text: "Конечно.", delay: 650 },
      { from: "brooke", text: "Ты просто без спроса создал чат, притащил сюда незнакомца и теперь орёшь, что не орёшь.", delay: 1250 },
      { from: "derek", text: "Я пытаюсь найти Харпер.", delay: 850 },
      { from: "brooke", text: "А мы, по-твоему, нет?", delay: 800 },
      { from: "derek", text: "Тогда помогите мне, а не рассказывайте, какой я идиот.", delay: 1050 },
      { from: "brooke", text: "Потому что ты опять всё решил за нас.", delay: 950 },
      { from: "derek", text: "Я никого не заставлял здесь сидеть.", delay: 850 },
      { from: "brooke", text: "Ты даже не спросил, прежде чем его добавить.", delay: 950 },
      { from: "brooke", text: "Вот об этом я и говорю.", delay: 800 },
      { type: "choice", options: [
        { text: "Если вам так проще, я выйду. Меня сюда вообще Дерек добавил.", loyalty: {}, next: "intro_group_offer_leave" },
        { text: "Эй. Я вообще-то здесь.", loyalty: {}, next: "intro_group_stick_to_facts" }
      ] }
    ]
  },
  {
    id: "intro_group_offer_leave",
    chat: "group_main",
    trigger: "choice:intro_group_argument:0",
    messages: [
      { from: "derek", text: "Нет.", delay: 650 },
      { from: "derek", text: "Не уходи пока.", delay: 800 },
      { from: "brooke", text: "Господи.", delay: 650 },
      { from: "brooke", text: "Сначала притащить без спроса.", delay: 800 },
      { from: "brooke", text: "Потом уговаривать не уходить. Отличный план 👍", delay: 900 },
      { from: "derek", text: "Брук, хватит.", delay: 750 }
    ]
  },
  {
    id: "intro_group_stick_to_facts",
    chat: "group_main",
    trigger: "choice:intro_group_argument:1",
    messages: [
      { from: "mason", text: "Справедливо.", delay: 700 },
      { from: "olivia", text: "Да. Хватит.", delay: 700 },
      { from: "olivia", text: "{player} тут вообще ни при чём.", delay: 850 },
      { from: "olivia", text: "Мы даже не знаем, у кого сейчас её телефон.", delay: 1000 }
    ]
  },
  {
    id: "intro_group_falls_apart",
    chat: "group_main",
    trigger: "after:intro_group_offer_leave|intro_group_stick_to_facts",
    messages: [
      { from: "tyler", text: "Всё. Сейчас мы уже ничего не выясним.", delay: 950 },
      { from: "tyler", text: "Ещё пять минут — и останется один Дерек.", delay: 900 },
      { from: "mason", text: "Я пас.", delay: 700 },
      { from: "mason", text: "Номер и скрин уже у полиции.", delay: 900 },
      { from: "mason", text: "Так не лезь дальше сам. Серьёзно.", delay: 950 },
      { from: "derek", text: "Ты вот так просто уйдёшь?", delay: 800 },
      { from: "mason", text: "Да.", delay: 600 },
      { from: "mason", text: "Потому что этот чат — хреновая идея.", delay: 850 },
      { type: "system", text: "Мейсон вышел из чата.", delay: 700, characterStatus: { id: "mason", online: false } },
      { from: "mia", text: "Ну вот.", delay: 650 },
      { from: "mia", text: "И Мейсон ушёл.", delay: 750 },
      { from: "brooke", text: "Потому что хоть кто-то здесь думает головой.", delay: 900 },
      { from: "derek", text: "Тогда зачем ты сама ещё здесь?", delay: 850 },
      { from: "brooke", text: "Жду, когда ты хотя бы раз услышишь слово «нет».", delay: 1000 },
      { from: "derek", text: "Я услышал.", delay: 700 },
      { from: "brooke", text: "Нет.", delay: 600 },
      { from: "brooke", text: "Ты уже решил, что он зачем-то тебе нужен.", delay: 900 },
      { from: "brooke", text: "Он пять минут назад даже имени Харпер не знал.", delay: 900 },
      { from: "derek", text: "Я такого не говорил.", delay: 750 },
      { from: "brooke", text: "Не говорил.", delay: 650 },
      { from: "brooke", text: "Но ведёшь себя именно так.", delay: 800 },
      { from: "olivia", text: "Брук, остановись.", delay: 750 },
      { from: "brooke", text: "Да пожалуйста.", delay: 650 },
      { from: "brooke", text: "Разбирайтесь сами.", delay: 750 },
      { type: "system", text: "Брук вышла из чата.", delay: 700, characterStatus: { id: "brooke", online: false } },
      { from: "mia", text: "Господи... Зачем она всё время так?", delay: 850 },
      { from: "olivia", text: "Потому что ей страшно.", delay: 750 },
      { from: "derek", text: "Нам всем страшно.", delay: 750 },
      { from: "mia", text: "Я знаю.", delay: 650 },
      { from: "mia", text: "Мне тоже.", delay: 700 },
      { from: "mia", text: "Но от этого чата только хуже.", delay: 850 },
      { from: "olivia", text: "Миа.", delay: 650 },
      { from: "mia", text: "Я выйду, ладно?", delay: 750 },
      { from: "mia", text: "Мне надо хоть немного выдохнуть.", delay: 850 },
      { type: "system", text: "Миа вышла из чата.", delay: 700, characterStatus: { id: "mia", online: false } },
      { from: "tyler", text: "Минус три человека.", delay: 700 },
      { from: "tyler", text: "Всё идёт отлично.", delay: 700 },
      { from: "derek", text: "Тайлер, не начинай.", delay: 750 },
      { from: "tyler", text: "Я не начинаю.", delay: 650 },
      { from: "tyler", text: "Ты собрал Брук, Мейсона и самого себя. И ждал спокойного разговора?", delay: 1150 },
      { from: "tyler", text: "Серьёзно?", delay: 650 },
      { from: "derek", text: "Что мы хотя бы поговорим.", delay: 850 },
      { from: "tyler", text: "Ага.", delay: 600 },
      { from: "derek", text: "Очень смешно.", delay: 700 },
      { from: "tyler", text: "Я не шучу.", delay: 700 },
      { from: "tyler", text: "От меня здесь толку нет.", delay: 800 },
      { from: "tyler", text: "Скрин у полиции. На этом всё.", delay: 850 },
      { type: "system", text: "Тайлер вышел из чата.", delay: 700, characterStatus: { id: "tyler", online: false } },
      { from: "olivia", text: "Дерек.", delay: 650 },
      { from: "olivia", text: "Удали группу.", delay: 750 },
      { from: "derek", text: "И что потом?", delay: 700 },
      { from: "olivia", text: "Потом дай всем немного успокоиться.", delay: 900 },
      { from: "derek", text: "А с номером что делать?", delay: 800 },
      { from: "olivia", text: "Пока ничего.", delay: 700 },
      { from: "olivia", text: "Номер больше никому не пересылай.", delay: 850 },
      { from: "olivia", text: "И перестань давить на {player}.", delay: 800 },
      { from: "derek", text: "Я не давлю.", delay: 700 },
      { from: "olivia", text: "Ты попросил его остаться, а потом все на него налетели.", delay: 1050 },
      { from: "olivia", text: "Может, ты этого не замечаешь. Но да, ты давишь.", delay: 1050 },
      { from: "derek", text: "Ладно.", delay: 650 },
      { from: "derek", text: "Понял.", delay: 700 },
      { type: "choice", options: [
        { text: "Если мне ещё что-то придёт, я напишу. Больше ничего не обещаю.", loyalty: {}, next: "intro_group_report_strange" },
        { text: "Я не собираюсь исчезать. Я тоже хочу понять, почему прислали мой номер.", loyalty: {}, next: "intro_group_want_answer" }
      ] }
    ]
  },
  {
    id: "intro_group_report_strange",
    chat: "group_main",
    trigger: "choice:intro_group_falls_apart:0",
    messages: [
      { from: "olivia", text: "Хорошо.", delay: 700 },
      { from: "olivia", text: "Пока больше и не надо.", delay: 800 },
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
      { from: "derek", text: "Не так сказал.", delay: 700 }
    ]
  },
  {
    id: "intro_group_olivia_leaves",
    chat: "group_main",
    trigger: "after:intro_group_report_strange|intro_group_want_answer",
    messages: [
      { from: "olivia", text: "Я напишу тебе потом.", delay: 800 },
      { from: "olivia", text: "Не здесь.", delay: 650 },
      { type: "system", text: "Оливия вышла из чата.", delay: 700, characterStatus: { id: "olivia", online: false } },
      { from: "derek", text: "Ну вот.", delay: 650 },
      { from: "derek", text: "Все ушли.", delay: 700 },
      { from: "derek", text: "Слушай... прости.", delay: 800 },
      { from: "derek", text: "Я правда думал: соберу всех — и хоть что-то станет понятнее.", delay: 1100 },
      { from: "derek", text: "А сделал только хуже.", delay: 800 },
      { type: "choice", options: [
        { text: "Промолчать.", sendMessage: false, loyalty: {}, trust: { derekTrust: 1 }, next: "intro_group_too_sudden" },
        { text: "Да. Удали группу. Всем сейчас лучше разойтись.", loyalty: {}, next: "intro_group_delete_it" }
      ] }
    ]
  },
  {
    id: "intro_group_too_sudden",
    chat: "group_main",
    trigger: "choice:intro_group_olivia_leaves:0",
    messages: [
      { from: "derek", text: "Я знаю.", delay: 700 },
      { from: "derek", text: "Слишком резко всё сделал.", delay: 800 },
      { from: "derek", text: "Надо было хотя бы предупредить остальных.", delay: 900 }
    ]
  },
  {
    id: "intro_group_delete_it",
    chat: "group_main",
    trigger: "choice:intro_group_olivia_leaves:1",
    messages: [
      { from: "derek", text: "Удалю.", delay: 700 },
      { from: "derek", text: "Здесь всё равно никого не осталось.", delay: 850 }
    ]
  },
  {
    id: "intro_group_seven",
    chat: "group_main",
    trigger: "after:intro_group_too_sudden|intro_group_delete_it",
    messages: [
      { from: "derek", text: "Если твой номер правда прислала Харпер...", delay: 950 },
      { from: "derek", text: "Надеюсь, мы поймём зачем.", delay: 850 },
      { from: "narrator", text: "Дерек удалил группу «Семеро».", delay: 1000 },
      { type: "lock", targetType: "chats", id: "group_main", delay: 300 }
    ]
  }
];
