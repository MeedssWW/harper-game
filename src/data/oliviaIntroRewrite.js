const O = (text, delay = 900) => ({ from: "olivia", text, delay });
const C = (options) => ({ type: "choice", options });
const option = (text, next, trust = 0) => ({
  text,
  loyalty: {},
  ...(trust ? { trust: { oliviaTrust: trust } } : {}),
  next
});

export const oliviaIntroRewriteBeats = [
  {
    id: "intro_olivia_private",
    chat: "private_olivia",
    trigger: "after:intro_group_seven",
    unlock: [
      { type: "chats", id: "private_olivia" },
      { type: "contacts", id: "olivia" }
    ],
    identify: ["olivia"],
    messages: [
      { type: "pause", delay: 4200 },
      { type: "system", text: "Оливия в сети.", delay: 500, characterStatus: { id: "olivia", online: true } },
      O("Привет."),
      O("Это Оливия."),
      O("Хотя ты, наверное, и так понял."),
      O("Слушай...", 750),
      O("Извини за то, что было в группе."),
      O("Дерек не должен был добавлять тебя вот так, без предупреждения.", 1100),
      O("И остальные не должны были сразу на тебя накидываться.", 1050),
      C([
        option("Ничего. У вас пропала подруга, я понимаю.", "olivia_intro_v2_understand", 1),
        option("Если честно, всё это выглядело довольно дико.", "olivia_intro_v2_wild"),
        option("Ты хотя бы пыталась всех остановить.", "olivia_intro_v2_tried")
      ])
    ]
  },
  {
    id: "olivia_intro_v2_understand",
    chat: "private_olivia",
    trigger: "choice:intro_olivia_private:0",
    messages: [
      O("Всё равно.", 700),
      O("Ты вообще не знал, куда тебя добавляют."),
      O("А через минуту уже должен был объясняться перед шестью незнакомыми людьми.", 1150)
    ]
  },
  {
    id: "olivia_intro_v2_wild",
    chat: "private_olivia",
    trigger: "choice:intro_olivia_private:1",
    messages: [
      O("Да.", 650),
      O("Наверное, со стороны вообще был какой-то кошмар."),
      O("Пропавшая девушка, твой номер и куча людей, которые даже друг друга не слушают.", 1150)
    ]
  },
  {
    id: "olivia_intro_v2_tried",
    chat: "private_olivia",
    trigger: "choice:intro_olivia_private:2",
    messages: [
      O("Не сразу.", 700),
      O("Сначала я просто смотрела, как всё становится только хуже."),
      O("Так что не знаю, считается ли это.")
    ]
  },
  {
    id: "olivia_intro_v2_derek_explained",
    chat: "private_olivia",
    trigger: "after:olivia_intro_v2_understand|olivia_intro_v2_wild|olivia_intro_v2_tried",
    messages: [
      O("Я, вообще-то, не только извиниться хотела."),
      O("В той группе всё смешалось."),
      O("Я даже не поняла, успел ли ты нормально ответить хоть на один вопрос.", 1050),
      O("Дерек до группы что-нибудь тебе объяснил?"),
      C([
        option("Да.", "olivia_intro_v2_derek_yes_first"),
        option("Немного.", "olivia_intro_v2_derek_some_first")
      ])
    ]
  },
  {
    id: "olivia_intro_v2_derek_yes_first",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_derek_explained:0",
    messages: [C([option("Рассказал, что Харпер пропала и с её телефона пришёл мой номер.", "olivia_intro_v2_derek_yes")])]
  },
  {
    id: "olivia_intro_v2_derek_yes",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_derek_yes_first:0",
    messages: [
      O("Хорошо.", 700),
      O("А то я уже подумала, что он просто кинул тебя в группу и решил объяснять всё по ходу.", 1150)
    ]
  },
  {
    id: "olivia_intro_v2_derek_some_first",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_derek_explained:1",
    messages: [C([option("В основном спрашивал, знаю ли я Харпер.", "olivia_intro_v2_derek_some")])]
  },
  {
    id: "olivia_intro_v2_derek_some",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_derek_some_first:0",
    messages: [
      O("Да, это на него похоже."),
      O("Когда Дерек нервничает, он начинает задавать вопросы один за другим.", 1100),
      O("И иногда вообще не замечает, что ему уже ответили.", 1000)
    ]
  },
  {
    id: "olivia_intro_v2_before_derek",
    chat: "private_olivia",
    trigger: "after:olivia_intro_v2_derek_yes|olivia_intro_v2_derek_some",
    messages: [
      O("А до него тебе никто не писал?"),
      O("Ни Харпер, ни кто-то с незнакомого номера?"),
      C([
        option("Нет. Дерек был первым.", "olivia_intro_v2_first_contact"),
        option("Нет. Ничего странного до этого не было.", "olivia_intro_v2_nothing_strange")
      ])
    ]
  },
  {
    id: "olivia_intro_v2_first_contact",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_before_derek:0",
    messages: [
      O("Поняла.", 700),
      O("Значит, до сообщения с её телефона ты вообще никак не был связан со всем этим.", 1100)
    ]
  },
  {
    id: "olivia_intro_v2_nothing_strange",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_before_derek:1",
    messages: [
      O("Ладно.", 700),
      O("Тогда пока у нас есть только твой номер в сообщении."),
      O("И больше ничего.", 750)
    ]
  },
  {
    id: "olivia_intro_v2_belief",
    chat: "private_olivia",
    trigger: "after:olivia_intro_v2_first_contact|olivia_intro_v2_nothing_strange",
    messages: [C([
      option("Ты мне веришь?", "olivia_intro_v2_believes"),
      option("Ты тоже думаешь, что я как-то связан с Харпер?", "olivia_intro_v2_related")
    ])]
  },
  {
    id: "olivia_intro_v2_believes",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_belief:0",
    messages: [
      O("Я тебя совсем не знаю."),
      O("Было бы странно уже говорить, что верю."),
      O("Но считать тебя виноватым только из-за номера — тоже странно.", 1050)
    ]
  },
  {
    id: "olivia_intro_v2_related",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_belief:1",
    messages: [
      O("Не знаю.", 700),
      O("Может, связан."),
      O("А может, твой номер вообще отправил кто-то другой."),
      O("Пока мы знаем только то, что сообщение пришло с её телефона.", 1050)
    ]
  },
  {
    id: "olivia_intro_v2_phone_logic",
    chat: "private_olivia",
    trigger: "after:olivia_intro_v2_believes|olivia_intro_v2_related",
    messages: [
      O("Если это правда была Харпер, значит, зачем-то ей понадобился именно твой номер.", 1150),
      O("А если не она...", 750),
      O("Тогда у кого-то есть её телефон."),
      O("И этот человек зачем-то отправил Дереку именно тебя.", 1050),
      O("Если честно, второй вариант пугает меня сильнее."),
      C([
        option("Почему Харпер вообще могла отправить мой номер?", "olivia_intro_v2_why_number"),
        option("Она часто делала что-то и никому не объясняла?", "olivia_intro_v2_secretive")
      ])
    ]
  },
  {
    id: "olivia_intro_v2_why_number",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_phone_logic:0",
    messages: [
      O("Понятия не имею."),
      O("Я уже столько вариантов перебрала."),
      O("То думаю, что она хотела на что-то указать."),
      O("То — что сообщение вообще отправила не она."),
      O("Но если это всё-таки была Харпер..."),
      O("Значит, она почему-то не могла просто написать, что происходит.", 1050)
    ]
  },
  {
    id: "olivia_intro_v2_secretive",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_phone_logic:1",
    messages: [
      O("Иногда.", 700),
      O("Особенно если думала, что сама справится."),
      O("Она не любила грузить других своими проблемами.")
    ]
  },
  {
    id: "olivia_intro_v2_harper_help",
    chat: "private_olivia",
    trigger: "after:olivia_intro_v2_why_number|olivia_intro_v2_secretive",
    messages: [
      O("Харпер вообще почти никогда не просила о помощи."),
      O("Даже когда было видно, что ей плохо."),
      O("Спрашиваешь у неё, всё ли нормально."),
      O("Она говорит: «Да, конечно»."),
      O("А по лицу видно, что вообще ничего не нормально."),
      O("Я обычно не лезла."),
      O("Думала, захочет — сама расскажет."),
      O("Теперь вот постоянно думаю, может, всё-таки стоило надавить.", 1100),
      C([
        option("Ты не могла знать, что она пропадёт.", "olivia_intro_v2_not_your_fault", 1),
        option("Может, она просто не хотела, чтобы вы переживали.", "olivia_intro_v2_protected_you"),
        option("Она перед исчезновением сильно изменилась?", "olivia_intro_v2_changed")
      ])
    ]
  },
  {
    id: "olivia_intro_v2_not_your_fault",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_harper_help:0",
    messages: [
      O("Знаю.", 700),
      O("Ну, то есть понимаю это."),
      O("Но легче от этого почему-то не становится."),
      O("Наверное, потому что теперь я постоянно вспоминаю такие моменты.", 1050)
    ]
  },
  {
    id: "olivia_intro_v2_protected_you",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_harper_help:1",
    messages: [
      O("Скорее всего."),
      O("Это очень на неё похоже."),
      O("Только теперь мы переживаем ещё больше."),
      O("И я всё время думаю, сколько раз она делала вид, что всё нормально.", 1050)
    ]
  },
  {
    id: "olivia_intro_v2_changed",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_harper_help:2",
    messages: [
      O("Не сильно."),
      O("Просто стала немного дёрганой."),
      O("Часто отвлекалась."),
      O("Смотрела по сторонам, когда мы куда-то выходили."),
      O("Но знаешь..."),
      O("Сейчас очень легко взять любую мелочь и решить, что это был какой-то знак.", 1150),
      O("Я не хочу делать выводы только потому, что теперь всё кажется подозрительным.", 1150)
    ]
  },
  {
    id: "olivia_intro_v2_larks_memory",
    chat: "private_olivia",
    trigger: "after:olivia_intro_v2_not_your_fault|olivia_intro_v2_protected_you|olivia_intro_v2_changed",
    messages: [
      O("Харпер вообще умела делать вид, что всё обычно."),
      O("Даже когда явно о чём-то думала."),
      O("Мы могли сидеть в Larks, спорить, какой фильм хуже..."),
      O("А она в этот момент вообще будто была где-то в другом месте.", 1050),
      C([
        option("Larks — это кафе?", "olivia_intro_v2_larks_cafe"),
        option("Вы часто там бывали?", "olivia_intro_v2_larks_often")
      ])
    ]
  },
  {
    id: "olivia_intro_v2_larks_cafe",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_larks_memory:0",
    messages: [
      O("Да.", 650),
      O("Небольшое кафе возле старого кинотеатра."),
      O("Мы часто там сидели после учёбы или работы.")
    ]
  },
  {
    id: "olivia_intro_v2_larks_often",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_larks_memory:1",
    messages: [
      O("Довольно часто."),
      O("Харпер всегда брала чай."),
      O("А потом всё равно пила мой кофе."),
      O("Каждый раз говорила, что только попробует.")
    ]
  },
  {
    id: "olivia_intro_v2_apology",
    chat: "private_olivia",
    trigger: "after:olivia_intro_v2_larks_cafe|olivia_intro_v2_larks_often",
    messages: [
      O("Извини."),
      O("Я сейчас опять начинаю вспоминать всё подряд."),
      C([
        option("Не извиняйся.", "olivia_intro_v2_understand_harper_first"),
        option("Ничего.", "olivia_intro_v2_more_than_missing_first")
      ])
    ]
  },
  {
    id: "olivia_intro_v2_understand_harper_first",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_apology:0",
    messages: [C([option("Так я хотя бы начинаю понимать, какой она была.", "olivia_intro_v2_understand_harper", 1)])]
  },
  {
    id: "olivia_intro_v2_understand_harper",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_understand_harper_first:0",
    messages: [
      O("Наверное."),
      O("Просто странно рассказывать о ней человеку, которого она вроде бы знала...", 1050),
      O("Хотя ты её совсем не знаешь.")
    ]
  },
  {
    id: "olivia_intro_v2_more_than_missing_first",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_apology:1",
    messages: [C([option("Это лучше, чем знать о ней только то, что она пропала.", "olivia_intro_v2_more_than_missing")])]
  },
  {
    id: "olivia_intro_v2_more_than_missing",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_more_than_missing_first:0",
    messages: [
      O("Да.", 650),
      O("Не хочу, чтобы она для тебя была просто именем из сообщения Дерека.", 1000)
    ]
  },
  {
    id: "olivia_intro_v2_strange_question",
    chat: "private_olivia",
    trigger: "after:olivia_intro_v2_understand_harper|olivia_intro_v2_more_than_missing",
    messages: [
      O("Можно я задам тебе немного странный вопрос?"),
      C([
        option("После сегодняшнего меня уже сложно удивить.", "olivia_intro_v2_hard_to_surprise"),
        option("Задавай.", "olivia_intro_v2_ask")
      ])
    ]
  },
  {
    id: "olivia_intro_v2_hard_to_surprise",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_strange_question:0",
    messages: [O("Да.", 650), O("Справедливо.", 700)]
  },
  {
    id: "olivia_intro_v2_ask",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_strange_question:1",
    messages: [O("Хорошо.", 700)]
  },
  {
    id: "olivia_intro_v2_participate",
    chat: "private_olivia",
    trigger: "after:olivia_intro_v2_hard_to_surprise|olivia_intro_v2_ask",
    messages: [
      O("Ты вообще хочешь во всём этом участвовать?"),
      O("Я не пытаюсь тебя прогнать."),
      O("Просто...", 700),
      O("Ты нам ничего не должен."),
      O("Тебя вообще втянули сюда без твоего согласия."),
      C([
        option("Мой номер оказался у Харпер.", "olivia_intro_v2_want_why_first"),
        option("Пока не знаю.", "olivia_intro_v2_cant_forget_first"),
        option("После той группы я как раз думал просто выйти.", "olivia_intro_v2_leave")
      ])
    ]
  },
  {
    id: "olivia_intro_v2_want_why_first",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_participate:0",
    messages: [C([option("Я хочу понять почему.", "olivia_intro_v2_want_why")])]
  },
  {
    id: "olivia_intro_v2_want_why",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_want_why_first:0",
    messages: [
      O("Я бы на твоём месте тоже хотела."),
      O("Наверное, теперь это касается тебя не меньше, чем нас.", 1050)
    ]
  },
  {
    id: "olivia_intro_v2_cant_forget_first",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_participate:1",
    messages: [C([option("Но забыть обо всём уже не получится.", "olivia_intro_v2_cant_forget")])]
  },
  {
    id: "olivia_intro_v2_cant_forget",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_cant_forget_first:0",
    messages: [
      O("Да.", 650),
      O("После такого сообщения просто вернуться к обычной жизни было бы сложно.", 1050)
    ]
  },
  {
    id: "olivia_intro_v2_leave",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_participate:2",
    messages: [
      O("Я бы поняла."),
      O("Честно.", 700),
      O("После такого знакомства я бы сама, наверное, всех заблокировала.", 1050),
      O("Но раз ты всё ещё здесь..."),
      O("Я хотела кое-что предложить.")
    ]
  },
  {
    id: "olivia_intro_v2_larks_offer",
    chat: "private_olivia",
    trigger: "after:olivia_intro_v2_want_why|olivia_intro_v2_cant_forget|olivia_intro_v2_leave",
    messages: [
      O("Миа написала мне после того, как вышла из группы."),
      O("Ей неловко из-за всего этого."),
      O("И она хочет нормально с тобой поговорить."),
      O("Без Брук, Мейсона и спора на двадцать сообщений."),
      O("Я подумала создать маленький чат."),
      O("Ты, я и Миа."),
      C([
        option("А почему без Дерека?", "olivia_intro_v2_without_derek"),
        option("Что Миа хочет обсудить?", "olivia_intro_v2_mia_topic"),
        option("Хорошо. Только без ещё одного скандала.", "olivia_intro_v2_no_scandal")
      ])
    ]
  },
  {
    id: "olivia_intro_v2_without_derek",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_larks_offer:0",
    messages: [
      O("Потому что сейчас он цепляется за любую мелочь."),
      O("Даже если она вообще ничего не значит."),
      O("Я не хочу прятать от него что-то важное."),
      O("Просто сначала нужно понять, есть ли вообще что обсуждать.", 1050)
    ]
  },
  {
    id: "olivia_intro_v2_mia_topic",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_larks_offer:1",
    messages: [
      O("Она толком не объяснила."),
      O("Написала, что кое-что вспомнила про Харпер."),
      O("Но сама не уверена, важно ли это."),
      O("Поэтому я не хочу сразу собирать всех снова.", 1050)
    ]
  },
  {
    id: "olivia_intro_v2_no_scandal",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_larks_offer:2",
    messages: [
      O("Именно поэтому я и не добавляю остальных."),
      O("Если всё опять превратится в крик, я сама закрою чат.", 1050)
    ]
  },
  {
    id: "olivia_intro_v2_rules",
    chat: "private_olivia",
    trigger: "after:olivia_intro_v2_without_derek|olivia_intro_v2_mia_topic|olivia_intro_v2_no_scandal",
    messages: [
      O("Давай только сразу договоримся."),
      O("Никаких обвинений просто потому, что кто-то показался подозрительным.", 1100),
      O("И ничего не пересылаем остальным, пока не поймём, что это вообще значит.", 1150),
      O("Если найдём что-то действительно важное, тогда скажем."),
      C([
        option("Хорошо.", "olivia_intro_v2_facts_first"),
        option("Ладно. Создавай.", "olivia_intro_v2_create")
      ])
    ]
  },
  {
    id: "olivia_intro_v2_facts_first",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_rules:0",
    messages: [C([option("Сначала только то, что знаем точно.", "olivia_intro_v2_facts", 1)])]
  },
  {
    id: "olivia_intro_v2_facts",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_facts_first:0",
    messages: [O("Да.", 650), O("Именно так.", 750)]
  },
  {
    id: "olivia_intro_v2_create",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_rules:1",
    messages: [O("Хорошо.", 700)]
  },
  {
    id: "olivia_intro_v2_name",
    chat: "private_olivia",
    trigger: "after:olivia_intro_v2_facts|olivia_intro_v2_create",
    messages: [
      O("Только название надо придумать."),
      O("Хотя ладно.", 700),
      O("Назову Larks."),
      C([
        option("Почему Larks?", "olivia_intro_v2_why_larks"),
        option("Звучит лучше, чем «Семеро».", "olivia_intro_v2_better_name")
      ])
    ]
  },
  {
    id: "olivia_intro_v2_why_larks",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_name:0",
    messages: [
      O("Так называется то самое кафе."),
      O("Мы часто там сидели с Харпер."),
      O("Просто первое, что пришло в голову.")
    ]
  },
  {
    id: "olivia_intro_v2_better_name",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_name:1",
    messages: [O("Планка была не очень высокая.")]
  },
  {
    id: "intro_olivia_larks_created",
    chat: "private_olivia",
    trigger: "after:olivia_intro_v2_why_larks|olivia_intro_v2_better_name",
    unlock: [{ type: "chats", id: "group_larks" }],
    identify: ["mia", "olivia"],
    messages: [O("Сейчас добавлю Мию.")]
  },
  {
    id: "intro_olivia_larks_shell",
    chat: "group_larks",
    trigger: "after:intro_olivia_larks_created",
    setFlags: { introComplete: true, larksCreatedByOlivia: true },
    messages: [
      { from: "narrator", text: "Оливия создала группу «Larks».", delay: 850 },
      { from: "narrator", text: "Оливия добавила Мию и {player}.", delay: 900 }
    ]
  }
];
