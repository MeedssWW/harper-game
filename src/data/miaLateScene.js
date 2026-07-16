export const miaLateSceneBeats = [
  {
    id: "mia_late_evening_start",
    chat: "private_mia",
    trigger: "afterTrustFlag:postleak_mason_police|postleak_mason_climb|postleak_mason_trust:miaTrust:2:miaPrivacyViolated:false",
    identify: ["mia"],
    messages: [
      { type: "pause", delay: 6500 },
      { type: "pause", delay: 500 },
      { type: "system", text: "Миа в сети.", delay: 500, characterStatus: { id: "mia", online: true } },
      { from: "mia", text: "я дома наконец", delay: 900 },
      { from: "mia", text: "Ты как? Только честно.", delay: 900 },
      {
        type: "choice",
        options: [
          { text: "Честно? Не очень.", loyalty: {}, next: "mia_late_player_not_good" },
          { text: "Нормально. Ты сама как?", loyalty: {}, trust: { miaTrust: 1 }, next: "mia_late_player_normal" },
          { text: "Как будто всё время жду, что снова что-то случится.", loyalty: {}, next: "mia_late_player_waiting" }
        ]
      }
    ]
  },
  {
    id: "mia_late_player_not_good",
    chat: "private_mia",
    trigger: "choice:mia_late_evening_start:0",
    messages: [
      { from: "mia", text: "угу", delay: 800 },
      { from: "mia", text: "я тоже не очень", delay: 900 }
    ]
  },
  {
    id: "mia_late_player_normal",
    chat: "private_mia",
    trigger: "choice:mia_late_evening_start:1",
    messages: [
      { from: "mia", text: "Устала.", delay: 800 },
      { from: "mia", text: "Голова гудит. Как будто этот день всё ещё не закончился.", delay: 1000 }
    ]
  },
  {
    id: "mia_late_player_waiting",
    chat: "private_mia",
    trigger: "choice:mia_late_evening_start:2",
    messages: [
      { from: "mia", text: "вот да", delay: 800 },
      { from: "mia", text: "Я каждые две минуты смотрю на телефон. Даже когда он в руке.", delay: 900 }
    ]
  },
  {
    id: "mia_late_quiet_common",
    chat: "private_mia",
    trigger: "after:mia_late_player_not_good|mia_late_player_normal|mia_late_player_waiting",
    messages: [
      { from: "mia", text: "Самое противное — когда наконец тихо.", delay: 1000 },
      { from: "mia", text: "Вроде можно выдохнуть, а мозг такой: нет, держи ещё двадцать мыслей.", delay: 1200 },
      { from: "mia", text: "Можно мы хотя бы пять минут поговорим не о Харпер?", delay: 1000 },
      { from: "mia", text: "Ни файлов, ни станции. Вообще ничего такого.", delay: 1100 },
      {
        type: "choice",
        options: [
          { text: "Давай. Как смена прошла?", loyalty: {}, next: "mia_late_shift" },
          { text: "Можно. О чём хочешь поговорить?", loyalty: {}, next: "mia_late_topic" },
          { text: "Можем просто посидеть тут.", loyalty: {}, next: "mia_late_sit" }
        ]
      }
    ]
  },
  {
    id: "mia_late_shift",
    chat: "private_mia",
    trigger: "choice:mia_late_quiet_common:0",
    messages: [
      { from: "mia", text: "У нас терминал завис перед закрытием.", delay: 1000 },
      { from: "mia", text: "И все смотрели на меня так, будто это я лично отключила оплату во всём городе.", delay: 1300 },
      { from: "mia", text: "Один мужчина минут десять убеждал меня, что его карта работает.", delay: 1200 },
      { from: "mia", text: "я вообще с ним не спорила 😭", delay: 900 }
    ]
  },
  {
    id: "mia_late_topic",
    chat: "private_mia",
    trigger: "choice:mia_late_quiet_common:1",
    messages: [
      { from: "mia", text: "Не знаю.", delay: 800 },
      { from: "mia", text: "О чём-нибудь, где никто не пропал и нам не надо ничего расследовать.", delay: 1100 },
      { from: "mia", text: "Высокая планка, знаю.", delay: 850 }
    ]
  },
  {
    id: "mia_late_sit",
    chat: "private_mia",
    trigger: "choice:mia_late_quiet_common:2",
    messages: [
      { from: "mia", text: "Можно.", delay: 800 },
      { from: "mia", text: "Мне даже так легче.", delay: 800 }
    ]
  },
  {
    id: "mia_late_dog_intro",
    chat: "private_mia",
    trigger: "after:mia_late_shift|mia_late_topic|mia_late_sit",
    messages: [
      { from: "mia", text: "По дороге домой видела собаку в жёлтом дождевике.", delay: 1000 },
      { from: "mia", text: "И минут пять думала только о том, кто утром решает: да, сегодня моей собаке нужен именно жёлтый.", delay: 1300 },
      { from: "mia", text: "глупость, короче", delay: 900 }
    ]
  },
  {
    id: "mia_late_dog_photo_unlock",
    chat: "private_mia",
    trigger: "afterTrustFlag:mia_late_dog_intro:miaTrust:2:miaPrivateChatsOpened:false",
    messages: [
      { from: "mia", text: "Я даже сфотографировала 😅", delay: 900 },
      { from: "mia", text: "Только не смейся.", delay: 800 },
      { from: "mia", type: "image", src: "src/assets/story/mia_raincoat_dog.png", caption: "Собака в жёлтом дождевике", delay: 900 },
      {
        type: "choice",
        options: [
          { text: "Это лучшее, что я видел за сегодня.", loyalty: {}, trust: { miaTrust: 1 }, next: "mia_late_dog_best" },
          { text: "Вообще-то это очень серьёзный дождевик.", loyalty: {}, next: "mia_late_dog_serious" },
          { text: "Теперь понятно, почему ты пять минут о нём думала.", loyalty: {}, next: "mia_late_dog_meeting" }
        ]
      }
    ]
  },
  {
    id: "mia_late_dog_best",
    chat: "private_mia",
    trigger: "choice:mia_late_dog_photo_unlock:0",
    messages: [
      { from: "mia", text: "правда?", delay: 800 },
      { from: "mia", text: "Хотя это больше говорит о нашем дне, чем о собаке.", delay: 900 }
    ]
  },
  {
    id: "mia_late_dog_serious",
    chat: "private_mia",
    trigger: "choice:mia_late_dog_photo_unlock:1",
    messages: [
      { from: "mia", text: "вот", delay: 700 },
      { from: "mia", text: "Наконец-то человек, который понимает серьёзность ситуации.", delay: 900 }
    ]
  },
  {
    id: "mia_late_dog_meeting",
    chat: "private_mia",
    trigger: "choice:mia_late_dog_photo_unlock:2",
    messages: [
      { from: "mia", text: "Он выглядел так, будто опаздывал на очень важную встречу.", delay: 1000 }
    ]
  },
  {
    id: "mia_late_dog_photo_end",
    chat: "private_mia",
    trigger: "after:mia_late_dog_best|mia_late_dog_serious|mia_late_dog_meeting",
    setFlags: { miaSentRaincoatDogPhoto: true },
    messages: [
      { from: "mia", text: "Ладно, теперь можешь смеяться.", delay: 900 },
      { from: "mia", text: "Но дождевик всё равно хороший.", delay: 800 }
    ]
  },
  {
    id: "mia_late_dog_no_photo",
    chat: "private_mia",
    trigger: "afterNotTrustFlag:mia_late_dog_intro:miaTrust:2:miaPrivateChatsOpened:false",
    messages: [
      {
        type: "choice",
        options: [
          { text: "Не глупо. Иногда надо цепляться за обычные вещи.", loyalty: {}, next: "mia_late_ordinary_things" },
          { text: "Жёлтый дождевик — вполне нормальная причина отвлечься.", loyalty: {}, next: "mia_late_yellow_reason" },
          { text: "Лучше думать о собаке, чем снова обо всём этом.", loyalty: {}, next: "mia_late_better_dog" }
        ]
      }
    ]
  },
  {
    id: "mia_late_ordinary_things",
    chat: "private_mia",
    trigger: "choice:mia_late_dog_no_photo:0",
    messages: [
      { from: "mia", text: "Наверное, да.", delay: 800 },
      { from: "mia", text: "А то я уже скоро начну искать скрытый смысл в собачьих дождевиках.", delay: 900 }
    ]
  },
  {
    id: "mia_late_yellow_reason",
    chat: "private_mia",
    trigger: "choice:mia_late_dog_no_photo:1",
    messages: [
      { from: "mia", text: "Спасибо, что поддержал эту важную тему.", delay: 900 }
    ]
  },
  {
    id: "mia_late_better_dog",
    chat: "private_mia",
    trigger: "choice:mia_late_dog_no_photo:2",
    messages: [
      { from: "mia", text: "Да.", delay: 800 },
      { from: "mia", text: "Хотя бы пять минут.", delay: 900 }
    ]
  },
  {
    id: "mia_late_sleep_prompt",
    chat: "private_mia",
    trigger: "after:mia_late_dog_photo_end|mia_late_ordinary_things|mia_late_yellow_reason|mia_late_better_dog",
    messages: [
      { from: "mia", text: "Ладно, мне правда пора в душ и спать.", delay: 1000 },
      { from: "mia", text: "И ты не сиди до утра, ладно?", delay: 1000 },
      {
        type: "choice",
        options: [
          { text: "Постараюсь.", loyalty: {}, next: "mia_late_try_sleep" },
          { text: "Ты тоже попробуй поспать.", loyalty: {}, next: "mia_late_you_sleep" },
          { text: "Напиши, если не сможешь уснуть.", loyalty: {}, trust: { miaTrust: 1 }, next: "mia_late_write_if_awake" }
        ]
      }
    ]
  },
  {
    id: "mia_late_try_sleep",
    chat: "private_mia",
    trigger: "choice:mia_late_sleep_prompt:0",
    messages: [
      { from: "mia", text: "Ловлю на слове.", delay: 900 }
    ]
  },
  {
    id: "mia_late_you_sleep",
    chat: "private_mia",
    trigger: "choice:mia_late_sleep_prompt:1",
    messages: [
      { from: "mia", text: "Попробую.", delay: 800 },
      { from: "mia", text: "Но ничего не обещаю.", delay: 900 }
    ]
  },
  {
    id: "mia_late_write_if_awake",
    chat: "private_mia",
    trigger: "choice:mia_late_sleep_prompt:2",
    messages: [
      { from: "mia", text: "Хорошо.", delay: 800 }
    ]
  },
  {
    id: "mia_late_first_goodnight",
    chat: "private_mia",
    trigger: "after:mia_late_try_sleep|mia_late_you_sleep|mia_late_write_if_awake",
    messages: [
      { from: "mia", text: "Спокойной ночи.", delay: 900 },
      { type: "system", text: "Миа вышла из сети.", delay: 900, characterStatus: { id: "mia", online: false } },
      { type: "pause", delay: 1600 },
      { type: "system", text: "Миа в сети.", delay: 500, characterStatus: { id: "mia", online: true } },
      { from: "mia", text: "стой", delay: 800 },
      { from: "mia", text: "Я сейчас легла и кое-что вспомнила про мост.", delay: 1000 },
      {
        type: "choice",
        options: [
          { text: "Что именно?", loyalty: {}, next: "mia_late_memory_what" },
          { text: "Это про Харпер?", loyalty: {}, next: "mia_late_memory_harper" },
          { text: "Не торопись. Напиши ровно то, что помнишь.", loyalty: {}, next: "mia_late_memory_slow" }
        ]
      }
    ]
  },
  {
    id: "mia_late_memory_what",
    chat: "private_mia",
    trigger: "choice:mia_late_first_goodnight:0",
    messages: [
      { from: "mia", text: "Перед тем как она ушла.", delay: 900 }
    ]
  },
  {
    id: "mia_late_memory_harper",
    chat: "private_mia",
    trigger: "choice:mia_late_first_goodnight:1",
    messages: [
      { from: "mia", text: "Да.", delay: 800 }
    ]
  },
  {
    id: "mia_late_memory_slow",
    chat: "private_mia",
    trigger: "choice:mia_late_first_goodnight:2",
    messages: [
      { from: "mia", text: "ладно. пытаюсь", delay: 900 }
    ]
  },
  {
    id: "mia_late_derek_argument",
    chat: "private_mia",
    trigger: "after:mia_late_memory_what|mia_late_memory_harper|mia_late_memory_slow",
    messages: [
      { from: "mia", text: "Я спросила, написать ли Дереку. Чтобы он забрал её или хотя бы позвонил.", delay: 1100 },
      { from: "mia", text: "Она сразу: «Не надо. Мы поссорились. Я не хочу сейчас с ним разговаривать».", delay: 1300 },
      { from: "mia", text: "Я решила, что это их обычная ссора, и... не полезла.", delay: 1000 },
      {
        type: "choice",
        options: [
          { text: "Она сказала, из-за чего они поссорились?", loyalty: {}, next: "mia_late_why_argued" },
          { text: "Если ты первая назвала Дерека, она могла иметь в виду кого-то ещё.", loyalty: {}, next: "mia_late_sure_derek" },
          { text: "Она сказала это со злостью? Или просто устала?", loyalty: {}, next: "mia_late_how_said" }
        ]
      }
    ]
  },
  {
    id: "mia_late_why_argued",
    chat: "private_mia",
    trigger: "choice:mia_late_derek_argument:0",
    messages: [
      { from: "mia", text: "Нет. Я спросила, но она сказала: «не хочу об этом». И всё.", delay: 1000 }
    ]
  },
  {
    id: "mia_late_sure_derek",
    chat: "private_mia",
    trigger: "choice:mia_late_derek_argument:1",
    messages: [
      { from: "mia", text: "Я первая назвала Дерека, и она не поправила меня." , delay: 950 },
      { from: "mia", text: "Я знаю, это всё равно не сто процентов. Но я почти уверена.", delay: 900 }
    ]
  },
  {
    id: "mia_late_how_said",
    chat: "private_mia",
    trigger: "choice:mia_late_derek_argument:2",
    messages: [
      { from: "mia", text: "Очень тихо. Без злости даже." , delay: 850 },
      { from: "mia", text: "Будто она уже всё решила и просто не хотела снова это обсуждать.", delay: 1000 }
    ]
  },
  {
    id: "mia_late_derek_possible_context",
    chat: "private_mia",
    trigger: "after:mia_late_why_argued|mia_late_sure_derek|mia_late_how_said",
    messages: [
      { from: "mia", text: "Я не говорю, что Дерек что-то с ней сделал. Пожалуйста, не так." , delay: 1100 },
      { from: "mia", text: "Просто он мог знать, куда она собиралась. Или почему не хотела домой.", delay: 1000 },
      {
        type: "choice",
        options: [
          { text: "Я не собираюсь сразу винить Дерека.", loyalty: {}, trust: { miaTrust: 1 }, next: "mia_late_no_conclusions" },
          { text: "Я попробую спросить его спокойно.", loyalty: {}, next: "mia_late_ask_calmly" },
          { text: "Спасибо, что вернулась и сказала.", loyalty: {}, trust: { miaTrust: 1 }, next: "mia_late_thanks_memory" }
        ]
      }
    ]
  },
  {
    id: "mia_late_no_conclusions",
    chat: "private_mia",
    trigger: "choice:mia_late_derek_possible_context:0",
    messages: [
      { from: "mia", text: "спасибо", delay: 800 },
      { from: "mia", text: "Я боялась, что сейчас опять начнётся: «значит, это Дерек».", delay: 1000 }
    ]
  },
  {
    id: "mia_late_ask_calmly",
    chat: "private_mia",
    trigger: "choice:mia_late_derek_possible_context:1",
    messages: [
      { from: "mia", text: "Только правда спокойно." , delay: 800 },
      { from: "mia", text: "Если начать с обвинения, он просто закроется.", delay: 1000 }
    ]
  },
  {
    id: "mia_late_thanks_memory",
    chat: "private_mia",
    trigger: "choice:mia_late_derek_possible_context:2",
    messages: [
      { from: "mia", text: "Я должна была вспомнить раньше." , delay: 900 },
      { from: "mia", text: "Знаю, что это уже звучит как моя любимая фраза.", delay: 1000 }
    ]
  },
  {
    id: "mia_late_final_action",
    chat: "private_mia",
    trigger: "after:mia_late_no_conclusions|mia_late_ask_calmly|mia_late_thanks_memory",
    setFlags: { miaRememberedDerekArgument: true },
    messages: [
      { from: "mia", text: "Всё. Теперь правда ухожу спать." , delay: 900 },
      { from: "mia", text: "спокойной ночи ещё раз", delay: 900 },
      { type: "system", text: "Миа вышла из сети.", delay: 900, characterStatus: { id: "mia", online: false } },
      {
        type: "choice",
        options: [
          { text: "Открыть чат с Дереком", loyalty: {}, sendMessage: false, setFlag: "derekConversationUnlocked" }
        ]
      }
    ]
  },
  {
    id: "mia_late_low_trust_olivia",
    chat: "private_olivia",
    trigger: "afterNotTrustFlag:postleak_mason_police|postleak_mason_climb|postleak_mason_trust:miaTrust:2:miaPrivacyViolated:false",
    setFlags: { miaRememberedDerekArgument: true, oliviaWillQuestionDerek: true },
    messages: [
      { type: "pause", delay: 4200 },
      { type: "system", text: "Оливия в сети.", delay: 500, characterStatus: { id: "olivia", online: true } },
      { from: "olivia", text: "Миа только что вспомнила ещё кое-что.", delay: 850 },
      { from: "olivia", text: "Перед мостом Харпер поссорилась с Дереком и не хотела, чтобы он ей звонил.", delay: 1000 },
      { type: "choice", options: [
        { text: "Лучше поговори с Дереком ты. Миа сейчас не до споров.", loyalty: {}, next: "mia_late_low_who" },
        { text: "Тогда мы даже не знаем, кому Харпер писала с телефона Мии.", loyalty: {}, next: "mia_late_low_message" },
        { text: "Похоже, Миа опять винит себя, что вспомнила не сразу.", loyalty: {}, next: "mia_late_low_memory" }
      ] }
    ]
  },
  { id: "mia_late_low_who", chat: "private_olivia", trigger: "choice:mia_late_low_trust_olivia:0", messages: [
    { from: "olivia", text: "Да. Она сейчас точно не захочет с ним спорить.", delay: 900 },
    { from: "olivia", text: "Я напишу ему сама.", delay: 800 },
    { type: "choice", options: [{ text: "Открыть чат с Дереком", loyalty: {}, sendMessage: false, setFlag: "derekConversationUnlocked" }] }
  ] },
  { id: "mia_late_low_message", chat: "private_olivia", trigger: "choice:mia_late_low_trust_olivia:1", messages: [
    { from: "olivia", text: "Да. Раньше Миа была уверена в обратном.", delay: 900 },
    { from: "olivia", text: "Я спрошу Дерека о ссоре.", delay: 850 },
    { type: "choice", options: [{ text: "Открыть чат с Дереком", loyalty: {}, sendMessage: false, setFlag: "derekConversationUnlocked" }] }
  ] },
  { id: "mia_late_low_memory", chat: "private_olivia", trigger: "choice:mia_late_low_trust_olivia:2", messages: [
    { from: "olivia", text: "Да. И каждый раз винит себя, что не вспомнила раньше.", delay: 950 },
    { from: "olivia", text: "Я спрошу Дерека о ссоре. Без обвинений.", delay: 850 },
    { type: "choice", options: [{ text: "Открыть чат с Дереком", loyalty: {}, sendMessage: false, setFlag: "derekConversationUnlocked" }] }
  ] }
];
