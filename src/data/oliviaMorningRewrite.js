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
      O("Я обещала не писать из-за каждой догадки."),
      O("Кажется, на этот раз есть что-то конкретное."),
      C([
        option("Ладно, только без пауз. Что нашла?", "morning_olivia_what_happened"),
        option("Это про Харпер?", "morning_olivia_about_harper"),
        option("Ты сейчас нагнетаешь или правда что-то нашла?", "morning_olivia_bad_start")
      ])
    ]
  },
  {
    id: "morning_olivia_what_happened",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_cafe_photo:0",
    messages: [O("Нет, всё спокойно."), O("Я просто нашла одну фотографию.")]
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
    messages: [O("Не специально."), O("Я сама пока не понимаю, нашла что-то важное или уже накручиваю себя.")]
  },
  {
    id: "morning_olivia_found_photo",
    chat: "private_olivia",
    trigger: "after:morning_olivia_what_happened|morning_olivia_about_harper|morning_olivia_bad_start",
    messages: [
      O("После нашего разговора полезла искать, в какой день мы с Харпер были в Larks."),
      O("Нашла нашу старую переписку."),
      O("Мы тогда кидали друг другу фотки, и одна там осталась."),
      C([
        option("Ты раньше не замечала, что там на фоне?", "morning_olivia_seen_before"),
        option("Что на нём?", "morning_olivia_whats_on_it")
      ])
    ]
  },
  {
    id: "morning_olivia_seen_before",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_found_photo:0",
    messages: [O("Я её и сделала."), O("Тогда это была просто фотка Харпер с моим кофе."), O("На фон я вообще не смотрела.")]
  },
  {
    id: "morning_olivia_whats_on_it",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_found_photo:1",
    messages: [O("Харпер у окна. На первый взгляд — ничего."), O("Только в камеру она не смотрит. Смотрит куда-то через стекло.")]
  },
  {
    id: "morning_olivia_sent_police",
    chat: "private_olivia",
    trigger: "after:morning_olivia_seen_before|morning_olivia_whats_on_it",
    messages: [
      O("Следователю я её уже отправила."),
      O("Может, там вообще пусто, но пусть лучше посмотрят они."),
      C([
        option("Правильно. Пусть фотография будет и у полиции.", "morning_olivia_police_photo", 1),
        option("Ты думаешь, там есть улика?", "morning_olivia_is_clue"),
        option("Хорошо, что ты не стала ждать.", "morning_olivia_didnt_wait")
      ])
    ]
  },
  {
    id: "morning_olivia_police_photo",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_sent_police:0",
    messages: [O("Вот и я так решила."), O("Лучше один бесполезный снимок, чем ещё одно «почему я сразу не сказала».")]
  },
  {
    id: "morning_olivia_is_clue",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_sent_police:1",
    messages: [O("Не знаю."), O("Я сейчас на всё смотрю как ненормальная. Поэтому и отправила следователю.")]
  },
  {
    id: "morning_olivia_didnt_wait",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_sent_police:2",
    messages: [O("Я уже один раз промолчала, потому что «вдруг неважно»."), O("Второй раз не хочу.")]
  },
  {
    id: "morning_olivia_send_photo",
    chat: "private_olivia",
    trigger: "after:morning_olivia_police_photo|morning_olivia_is_clue|morning_olivia_didnt_wait",
    messages: [
      O("Ладно. Смотри сам."),
      { from: "narrator", text: "Оливия отправила фотографию.", delay: 700 },
      { from: "olivia", type: "image", src: "src/assets/harper_photos/harper_larks_inside_olivia.jpg?v=117", caption: "Larks · четыре дня до исчезновения", delay: 900 },
      O("Видишь, как она отвернулась?"),
      O("И это было не один раз. Она весь разговор косилась на улицу."),
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
    messages: [O("Я тоже сначала только её и увидела."), O("Но по фото не поймёшь, смотрит Харпер на машину или вообще мимо.")]
  },
  {
    id: "morning_olivia_person_by_car",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_send_photo:1",
    messages: [O("Вижу."), O("Только там три пикселя и отражение. Это буквально может быть кто угодно.")]
  },
  {
    id: "morning_olivia_looks_tense",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_send_photo:2",
    messages: [O("Сейчас — да."), O("А тогда я решила, что она опять ушла в свои мысли. У неё бывало.")]
  },
  {
    id: "morning_olivia_held_back",
    chat: "private_olivia",
    trigger: "after:morning_olivia_green_car|morning_olivia_person_by_car|morning_olivia_looks_tense",
    messages: [
      O("Только давай пока без «это точно та машина»."),
      O("Но... есть ещё одна вещь."),
      O("Вчера я о ней промолчала."),
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
    messages: [O("Харпер в тот день сказала одну странную вещь.")]
  },
  {
    id: "morning_olivia_why_not_tell",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_held_back:1",
    messages: [O("Потому что не знала, имеет ли это значение."), O("И потому что вчера ты был для меня просто незнакомым номером в общем чате.")]
  },
  {
    id: "morning_olivia_deliberately_silent",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_held_back:2",
    messages: [O("Да, специально."), O("Ты был незнакомым человеком, которого Дерек только что притащил в нашу ссору."), O("Полиции сказала. Тебе — нет."), O("Если злишься — понимаю.")]
  },
  {
    id: "morning_olivia_followed",
    chat: "private_olivia",
    trigger: "after:morning_olivia_what_exactly|morning_olivia_why_not_tell|morning_olivia_deliberately_silent",
    messages: [
      O("Харпер сказала, что ей кажется, будто за ней ходят."),
      O("Не всё время. Несколько раз она замечала кого-то сзади... или одну и ту же машину рядом."),
      O("Потом сама же сказала, что просто не высыпается и накручивает себя."),
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
    messages: [O("Нет. Ни цвета, ни модели."), O("Так что привязать её слова именно к этой машине я не могу.")]
  },
  {
    id: "morning_olivia_told_police",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_followed:1",
    messages: [O("Сразу, на первом опросе."), O("Но описания не было. Харпер и сама не была уверена, что это не паранойя.")]
  },
  {
    id: "morning_olivia_hard_to_look",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_followed:2",
    messages: [O("Да."), O("Я сидела в метре от неё и думала только о том, что она опять пьёт мой кофе."), O("Теперь смотрю и думаю: почему я даже не обернулась?")]
  },
  {
    id: "morning_olivia_photo_meaning",
    chat: "private_olivia",
    trigger: "after:morning_olivia_specific_green_car|morning_olivia_told_police|morning_olivia_hard_to_look",
    messages: [
      O("Возможно, это обычная машина и обычный прохожий."),
      O("Я это понимаю. Правда."),
      O("Но теперь тот разговор не выходит из головы."),
      C([
        option("Она знала, что ты её снимаешь?", "morning_olivia_intentional_frame"),
        option("Пока это просто машина на фоне.", "morning_olivia_just_photo", 1),
        option("Она раньше тебе такое говорила?", "morning_olivia_often_followed")
      ])
    ]
  },
  {
    id: "morning_olivia_intentional_frame",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_photo_meaning:0",
    messages: [O("Не сразу. Я достала телефон раньше, чем она заметила."), O("Так что улицу в кадр Харпер точно не подстраивала.")]
  },
  {
    id: "morning_olivia_just_photo",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_photo_meaning:1",
    messages: [O("Да. Пока именно так."), O("Спасибо, что не назначил машину виновной за пять секунд.")]
  },
  {
    id: "morning_olivia_often_followed",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_photo_meaning:2",
    messages: [O("Со мной — впервые."), O("И почти сразу закрыла тему. Как будто пожалела, что вообще сказала.")]
  },
  {
    id: "morning_olivia_group_offer",
    chat: "private_olivia",
    trigger: "after:morning_olivia_intentional_frame|morning_olivia_just_photo|morning_olivia_often_followed",
    messages: [
      O("На следующий день Харпер виделась с Мией."),
      O("Надо показать фото ей. Вдруг Харпер и тогда оглядывалась."),
      O("Могу спросить лично. Но ты уже в курсе, и потом опять всё пересказывать..."),
      O("Короче. Маленький чат: ты, я и Миа. Ты не против?"),
      C([
        option("Да. Создавай.", "morning_olivia_group_yes"),
        option("Нет. Лучше спроси Мию сама и потом расскажи мне.", "morning_olivia_group_decline_first")
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
    id: "morning_olivia_group_decline_first",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_group_offer:1",
    messages: [O("Поняла.")]
  },
  {
    id: "morning_olivia_group_declined",
    chat: "private_olivia",
    trigger: "after:morning_olivia_group_decline_first",
    setFlags: { oliviaGroupInviteDeclined: true, larksCreated: false, separateChatsRoute: true },
    messages: [
      O("Спрошу её сама и напишу, только если всплывёт что-то конкретное."),
      C([
        option("Спасибо.", "morning_olivia_decline_thanks"),
        option("Просто после прошлого чата не хочется сразу лезть в новый.", "morning_olivia_decline_reason")
      ])
    ]
  },
  {
    id: "morning_olivia_decline_thanks",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_group_declined:0",
    messages: [O("Не за что. Я для этого и спросила, а не просто добавила тебя.")]
  },
  {
    id: "morning_olivia_decline_reason",
    chat: "private_olivia",
    trigger: "choice:morning_olivia_group_declined:1",
    messages: [O("После «Семеро» — справедливо."), O("Больше никаких внезапных добавлений.")]
  },
  {
    id: "morning_olivia_decline_end",
    chat: "private_olivia",
    trigger: "after:morning_olivia_decline_thanks|morning_olivia_decline_reason",
    messages: [O("Тогда я к Мие."), O("Напишу позже.")]
  },
  {
    id: "morning_olivia_larks_group",
    chat: "private_olivia",
    trigger: "after:morning_olivia_group_yes",
    setFlags: { larksCreated: true, oliviaGroupInviteDeclined: false, separateChatsRoute: false },
    unlock: [{ type: "chats", id: "group_larks" }],
    messages: [
      O("Секунду."),
      O("Назову Larks. Не хочу ещё десять минут думать над названием.")
    ]
  }
];
