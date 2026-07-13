const O = (text, delay = 900) => ({ from: "olivia", text, delay });
const C = (options) => ({ type: "choice", options });
const option = (text, next, trust = 0) => ({
  text,
  loyalty: {},
  ...(trust ? { trust: { oliviaTrust: trust } } : {}),
  next
});

export const oliviaMorningRewriteBeats = [
  {
    id: "morning_olivia_cafe_photo",
    chat: "private_olivia",
    trigger: "after:morning_derek_photos_common",
    unlock: [
      { type: "chats", id: "private_olivia" },
      { type: "contacts", id: "olivia" }
    ],
    identify: ["olivia"],
    messages: [
      { type: "pause", delay: 4200 },
      { type: "system", text: "Оливия в сети.", delay: 500, characterStatus: { id: "olivia", online: true } },
      O("Привет."),
      O("Я обещала написать, если вспомню что-нибудь конкретное."),
      O("Кажется, вспомнила."),
      C([
        option("Что случилось?", "morning_olivia_what_happened"),
        option("Это про Харпер?", "morning_olivia_about_harper"),
        option("После такого начала я уже жду чего-то плохого.", "morning_olivia_bad_start")
      ])
    ]
  },
  {
    id: "morning_olivia_what_happened",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_cafe_photo:0",
    messages: [O("Пока ничего не случилось."), O("Просто я нашла одну фотографию.")]
  },
  {
    id: "morning_olivia_about_harper",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_cafe_photo:1",
    messages: [O("Да."), O("Про тот день, когда мы были в Larks.")]
  },
  {
    id: "morning_olivia_bad_start",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_cafe_photo:2",
    messages: [O("Прости."), O("Не хотела тебя пугать."), O("Я и сама пока не понимаю, важно ли это.")]
  },
  {
    id: "morning_olivia_found_photo",
    chat: "private_olivia",
    trigger: "after:morning_olivia_what_happened|morning_olivia_about_harper|morning_olivia_bad_start",
    messages: [
      O("После нашего разговора я пыталась вспомнить, в какой именно день мы с Харпер были в Larks."),
      O("Полезла в нашу переписку."),
      O("Мы тогда перекидывались фотографиями."),
      O("И там остался один снимок."),
      C([
        option("Ты раньше его не видела?", "morning_olivia_seen_before"),
        option("Что на нём?", "morning_olivia_whats_on_it")
      ])
    ]
  },
  {
    id: "morning_olivia_seen_before",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_found_photo:0",
    messages: [O("Видела."), O("Я сама его сделала."), O("Просто тогда это была обычная фотография."), O("Я вообще не смотрела, что там на заднем плане.")]
  },
  {
    id: "morning_olivia_whats_on_it",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_found_photo:1",
    messages: [O("Харпер сидит у окна."), O("Ничего особенного."), O("Но сейчас я заметила, куда она смотрит.")]
  },
  {
    id: "morning_olivia_sent_police",
    chat: "private_olivia",
    trigger: "after:morning_olivia_seen_before|morning_olivia_whats_on_it",
    messages: [
      O("Я уже отправила снимок следователю."),
      O("Не знаю, найдут ли они там что-нибудь."),
      O("Но решила, что лучше отправить."),
      C([
        option("Да.", "morning_olivia_police_photo_first"),
        option("Ты думаешь, там есть улика?", "morning_olivia_is_clue"),
        option("Хорошо, что ты не стала ждать.", "morning_olivia_didnt_wait")
      ])
    ]
  },
  {
    id: "morning_olivia_police_photo_first",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_sent_police:0",
    messages: [C([option("Пусть у полиции тоже будет фотография.", "morning_olivia_police_photo", 1)])]
  },
  {
    id: "morning_olivia_police_photo",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_police_photo_first:0",
    messages: [O("Я тоже так подумала."), O("Даже если там ничего нет.")]
  },
  {
    id: "morning_olivia_is_clue",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_sent_police:1",
    messages: [O("Не знаю."), O("Может быть, я просто теперь слишком внимательно смотрю на каждую мелочь.")]
  },
  {
    id: "morning_olivia_didnt_wait",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_sent_police:2",
    messages: [O("Да."), O("Я не хочу потом снова думать, что могла сказать раньше.")]
  },
  {
    id: "morning_olivia_send_photo",
    chat: "private_olivia",
    trigger: "after:morning_olivia_police_photo|morning_olivia_is_clue|morning_olivia_didnt_wait",
    messages: [
      O("Я тебе тоже скину."),
      { from: "narrator", text: "Оливия отправила фотографию.", delay: 700 },
      { from: "olivia", type: "image", src: "src/assets/harper_photos/harper_larks_inside_olivia.jpg?v=117", caption: "Larks · четыре дня до исчезновения", delay: 900 },
      O("Видишь?"),
      O("Она смотрит куда-то на улицу."),
      O("Причём я помню, что она отвлекалась не один раз."),
      C([
        option("Может, она смотрела на зелёную машину.", "morning_olivia_green_car"),
        option("Рядом с машиной кто-то стоит.", "morning_olivia_person_by_car"),
        option("На фотографии она выглядит напряжённой.", "morning_olivia_looks_tense")
      ])
    ]
  },
  {
    id: "morning_olivia_green_car",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_send_photo:0",
    messages: [O("Может быть."), O("Она довольно заметная."), O("Но я не могу точно сказать, куда смотрит Харпер.")]
  },
  {
    id: "morning_olivia_person_by_car",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_send_photo:1",
    messages: [O("Да."), O("Но там почти ничего не видно."), O("Это мог быть кто угодно.")]
  },
  {
    id: "morning_olivia_looks_tense",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_send_photo:2",
    messages: [O("Мне тоже так кажется."), O("Хотя тогда я решила, что она просто задумалась.")]
  },
  {
    id: "morning_olivia_held_back",
    chat: "private_olivia",
    trigger: "after:morning_olivia_green_car|morning_olivia_person_by_car|morning_olivia_looks_tense",
    messages: [
      O("Я не хочу сейчас решить, что она точно смотрела на машину."),
      O("Только потому, что она первая бросается в глаза."),
      O("Но есть ещё кое-что."),
      O("Вчера я тебе этого не рассказала."),
      C([
        option("Чего именно?", "morning_olivia_what_exactly"),
        option("Почему не рассказала?", "morning_olivia_why_not_tell"),
        option("Ты специально решила промолчать?", "morning_olivia_deliberately_silent", -1)
      ])
    ]
  },
  {
    id: "morning_olivia_what_exactly",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_held_back:0",
    messages: [O("О том, что Харпер сказала в тот день.")]
  },
  {
    id: "morning_olivia_why_not_tell",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_held_back:1",
    messages: [O("Потому что сама не знала, имеет ли это значение."), O("И мы с тобой только познакомились.")]
  },
  {
    id: "morning_olivia_deliberately_silent",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_held_back:2",
    messages: [O("Да."), O("Но не потому, что хотела что-то от тебя скрыть."), O("Просто не хотела пересказывать незнакомому человеку каждую тревожную фразу Харпер."), O("Полиции я об этом говорила.")]
  },
  {
    id: "morning_olivia_followed",
    chat: "private_olivia",
    trigger: "after:morning_olivia_what_exactly|morning_olivia_why_not_tell|morning_olivia_deliberately_silent",
    messages: [
      O("Харпер тогда сказала, что ей кажется, будто за ней кто-то ходит."),
      O("Не постоянно."),
      O("Просто несколько раз ей казалось, что она замечает кого-то позади."),
      O("Или одну и ту же машину рядом."),
      O("А потом сама отмахнулась."),
      O("Сказала, что почти не спала и, наверное, просто себя накручивает."),
      C([
        option("Она говорила именно про зелёную машину?", "morning_olivia_specific_green_car"),
        option("И ты рассказала это полиции?", "morning_olivia_told_police"),
        option("Тебе, наверное, теперь тяжело смотреть на это фото.", "morning_olivia_hard_to_look", 1)
      ])
    ]
  },
  {
    id: "morning_olivia_specific_green_car",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_followed:0",
    messages: [O("Нет."), O("Ни цвет, ни модель она не называла."), O("Поэтому я не знаю, связана ли машина на фотографии с тем разговором.")]
  },
  {
    id: "morning_olivia_told_police",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_followed:1",
    messages: [O("Да."), O("Ещё когда меня впервые опрашивали."), O("Но Харпер никого не описывала."), O("И сама не была уверена, что за ней правда кто-то следит.")]
  },
  {
    id: "morning_olivia_hard_to_look",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_followed:2",
    messages: [O("Да."), O("Я сидела прямо напротив неё."), O("И вообще ничего не заметила."), O("Хотя понимаю, что тогда не могла знать, чем всё закончится.")]
  },
  {
    id: "morning_olivia_photo_meaning",
    chat: "private_olivia",
    trigger: "after:morning_olivia_specific_green_car|morning_olivia_told_police|morning_olivia_hard_to_look",
    messages: [
      O("Может, фотография вообще ничего не значит."),
      O("Машина могла просто стоять возле кафе."),
      O("Человек рядом мог быть обычным прохожим."),
      O("Но теперь я не могу перестать думать о том разговоре."),
      C([
        option("Может, Харпер специально сфотографировалась так, чтобы в кадр попала улица.", "morning_olivia_intentional_frame"),
        option("Пока это просто фото машины возле кафе.", "morning_olivia_just_photo", 1),
        option("Она часто говорила, что за ней кто-то следит?", "morning_olivia_often_followed")
      ])
    ]
  },
  {
    id: "morning_olivia_intentional_frame",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_photo_meaning:0",
    messages: [O("Не думаю."), O("Я сама решила её сфотографировать."), O("Она даже не сразу заметила камеру.")]
  },
  {
    id: "morning_olivia_just_photo",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_photo_meaning:1",
    messages: [O("Да."), O("И мне нравится, что ты не пытаешься сразу сделать из этого доказательство.")]
  },
  {
    id: "morning_olivia_often_followed",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_photo_meaning:2",
    messages: [O("Нет."), O("Со мной она заговорила об этом впервые."), O("А потом сразу сменила тему.")]
  },
  {
    id: "morning_olivia_group_offer",
    chat: "private_olivia",
    trigger: "after:morning_olivia_intentional_frame|morning_olivia_just_photo|morning_olivia_often_followed",
    messages: [
      O("Миа виделась с Харпер на следующий день."),
      O("Я хочу показать фотографию ей."),
      O("Может, Харпер и при ней постоянно оглядывалась."),
      O("Или тоже говорила про машину."),
      O("Я могу написать ей отдельно."),
      O("Но тогда придётся пересказывать всё сначала."),
      O("И ты уже тоже видел фотографию."),
      O("Поэтому я подумала..."),
      O("Можно создать небольшой чат?"),
      O("Ты, я и Миа."),
      C([
        option("Да. Создавай.", "morning_olivia_group_yes"),
        option("А почему не спросить Мию без меня?", "morning_olivia_group_why_me"),
        option("Хорошо.", "morning_olivia_group_warn_first")
      ])
    ]
  },
  {
    id: "morning_olivia_group_yes",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_group_offer:0",
    messages: [O("Хорошо.")]
  },
  {
    id: "morning_olivia_group_why_me",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_group_offer:1",
    messages: [
      O("Можно и без тебя."),
      O("Просто если она вспомнит что-то важное, потом всё равно придётся рассказывать тебе отдельно."),
      O("Но я не буду добавлять тебя, если ты не хочешь."),
      C([
        option("Ладно. Добавляй.", "morning_olivia_group_add_after_all"),
        option("Нет. Лучше потом просто расскажи.", "morning_olivia_group_declined")
      ])
    ]
  },
  {
    id: "morning_olivia_group_add_after_all",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_group_why_me:0",
    messages: [O("Хорошо.")]
  },
  {
    id: "morning_olivia_group_declined",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_group_why_me:1",
    setFlags: { oliviaGroupInviteDeclined: true },
    messages: [O("Ладно."), O("Тогда сначала поговорю с ней сама.")]
  },
  {
    id: "morning_olivia_group_warn_first",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_group_offer:2",
    messages: [C([option("Только никого больше без предупреждения.", "morning_olivia_group_warn")])]
  },
  {
    id: "morning_olivia_group_warn",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_group_warn_first:0",
    messages: [O("Не добавлю."), O("Я как раз поэтому сначала спрашиваю.")]
  },
  {
    id: "morning_olivia_larks_group",
    chat: "private_olivia",
    trigger: "after:morning_olivia_group_yes|morning_olivia_group_add_after_all|morning_olivia_group_warn",
    unlock: [{ type: "chats", id: "group_larks" }],
    messages: [
      O("Тогда сейчас создам."),
      O("Назову Larks."),
      O("Чтобы долго не думать.")
    ]
  }
];
