export const miaLateSceneBeats = [
  {
    id: "mia_late_evening_start",
    chat: "private_mia",
    trigger: "after:mason_after_tyler_end",
    identify: ["mia"],
    messages: [
      { type: "pause", delay: 6500 },
      { type: "system", text: "Поздний вечер.", delay: 500 },
      { type: "system", text: "Миа в сети.", delay: 500, characterStatus: { id: "mia", online: true } },
      { from: "mia", text: "Я дома.", delay: 900 },
      { from: "mia", text: "Наконец-то.", delay: 900 },
      { from: "mia", text: "Ты как вообще?", delay: 900 },
      {
        type: "choice",
        options: [
          { text: "Честно? Не очень.", loyalty: {}, sendMessage: false, next: "mia_late_player_not_good" },
          { text: "Нормально. Ты сама как?", loyalty: {}, trust: { miaTrust: 1 }, sendMessage: false, next: "mia_late_player_normal" },
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
      { from: "player", text: "Честно?", delay: 300 },
      { from: "player", text: "Не очень.", delay: 500 },
      { from: "mia", text: "Да.", delay: 800 },
      { from: "mia", text: "У меня примерно так же.", delay: 900 }
    ]
  },
  {
    id: "mia_late_player_normal",
    chat: "private_mia",
    trigger: "choice:mia_late_evening_start:1",
    messages: [
      { from: "player", text: "Нормально.", delay: 300 },
      { from: "player", text: "Ты сама как?", delay: 500 },
      { from: "mia", text: "Устала.", delay: 800 },
      { from: "mia", text: "И голова гудит от всего, что было сегодня.", delay: 1000 }
    ]
  },
  {
    id: "mia_late_player_waiting",
    chat: "private_mia",
    trigger: "choice:mia_late_evening_start:2",
    messages: [
      { from: "mia", text: "Вот.", delay: 800 },
      { from: "mia", text: "Я тоже постоянно проверяю телефон.", delay: 900 }
    ]
  },
  {
    id: "mia_late_quiet_common",
    chat: "private_mia",
    trigger: "after:mia_late_player_not_good|mia_late_player_normal|mia_late_player_waiting",
    messages: [
      { from: "mia", text: "Самое противное — когда становится тихо.", delay: 1000 },
      { from: "mia", text: "И ты вроде бы должен отдохнуть.", delay: 1000 },
      { from: "mia", text: "Но вместо этого просто сидишь и думаешь обо всём подряд.", delay: 1200 },
      { from: "mia", text: "Можно хотя бы пару минут не о Харпер?", delay: 1000 },
      { from: "mia", text: "Без файлов, скринов, станции и всего остального.", delay: 1100 },
      {
        type: "choice",
        options: [
          { text: "Давай. Как смена прошла?", loyalty: {}, sendMessage: false, next: "mia_late_shift" },
          { text: "Можно. О чём хочешь поговорить?", loyalty: {}, sendMessage: false, next: "mia_late_topic" },
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
      { from: "player", text: "Давай.", delay: 300 },
      { from: "player", text: "Как смена прошла?", delay: 500 },
      { from: "mia", text: "У нас терминал завис перед закрытием.", delay: 1000 },
      { from: "mia", text: "И все смотрели на меня так, будто я лично отключила оплату во всём городе.", delay: 1300 },
      { from: "mia", text: "Один мужик минут десять доказывал, что его карта работает.", delay: 1200 },
      { from: "mia", text: "Будто я спорила.", delay: 900 }
    ]
  },
  {
    id: "mia_late_topic",
    chat: "private_mia",
    trigger: "choice:mia_late_quiet_common:1",
    messages: [
      { from: "player", text: "Можно.", delay: 300 },
      { from: "player", text: "О чём хочешь поговорить?", delay: 500 },
      { from: "mia", text: "Не знаю.", delay: 800 },
      { from: "mia", text: "О чём-нибудь, где никто не исчез и никого не нужно искать.", delay: 1100 }
    ]
  },
  {
    id: "mia_late_sit",
    chat: "private_mia",
    trigger: "choice:mia_late_quiet_common:2",
    messages: [
      { from: "mia", text: "Это тоже вариант.", delay: 800 },
      { from: "mia", text: "Спасибо.", delay: 800 }
    ]
  },
  {
    id: "mia_late_dog_intro",
    chat: "private_mia",
    trigger: "after:mia_late_shift|mia_late_topic|mia_late_sit",
    messages: [
      { from: "mia", text: "По дороге домой я увидела собаку в жёлтом дождевике.", delay: 1000 },
      { from: "mia", text: "И почему-то минут пять думала только о том, кто вообще покупает собаке дождевик.", delay: 1300 },
      { from: "mia", text: "Наверное, это глупо.", delay: 900 }
    ]
  },
  {
    id: "mia_late_dog_photo_unlock",
    chat: "private_mia",
    trigger: "afterTrustFlag:mia_late_dog_intro:miaTrust:2:miaPrivateChatsOpened:false",
    messages: [
      { from: "mia", text: "Я даже сфотографировала.", delay: 900 },
      { from: "mia", text: "Не смейся.", delay: 800 },
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
      { from: "mia", text: "Правда?", delay: 800 },
      { from: "mia", text: "Тогда день был совсем ужасный.", delay: 900 }
    ]
  },
  {
    id: "mia_late_dog_serious",
    chat: "private_mia",
    trigger: "choice:mia_late_dog_photo_unlock:1",
    messages: [
      { from: "mia", text: "Вот.", delay: 700 },
      { from: "mia", text: "Наконец-то кто-то понимает.", delay: 900 }
    ]
  },
  {
    id: "mia_late_dog_meeting",
    chat: "private_mia",
    trigger: "choice:mia_late_dog_photo_unlock:2",
    messages: [
      { from: "mia", text: "Он выглядел так, будто у него важная встреча.", delay: 1000 }
    ]
  },
  {
    id: "mia_late_dog_photo_end",
    chat: "private_mia",
    trigger: "after:mia_late_dog_best|mia_late_dog_serious|mia_late_dog_meeting",
    setFlags: { miaSentRaincoatDogPhoto: true },
    messages: [
      { from: "mia", text: "Ладно.", delay: 700 },
      { from: "mia", text: "Теперь можешь смеяться.", delay: 900 }
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
          { text: "Не глупо. Иногда надо цепляться за обычные вещи.", loyalty: {}, sendMessage: false, next: "mia_late_ordinary_things" },
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
      { from: "player", text: "Не глупо.", delay: 300 },
      { from: "player", text: "Иногда надо цепляться за обычные вещи.", delay: 500 },
      { from: "mia", text: "Наверное.", delay: 800 },
      { from: "mia", text: "Иначе совсем можно сойти с ума.", delay: 900 }
    ]
  },
  {
    id: "mia_late_yellow_reason",
    chat: "private_mia",
    trigger: "choice:mia_late_dog_no_photo:1",
    messages: [
      { from: "mia", text: "Спасибо.", delay: 800 },
      { from: "mia", text: "Я тоже решила, что это важная тема.", delay: 900 }
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
      { from: "mia", text: "Ладно.", delay: 800 },
      { from: "mia", text: "Мне правда уже надо в душ и спать.", delay: 1000 },
      { from: "mia", text: "Ты тоже не сиди до утра, хорошо?", delay: 1000 },
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
      { type: "system", text: "Несколько секунд спустя.", delay: 1600 },
      { type: "system", text: "Миа в сети.", delay: 500, characterStatus: { id: "mia", online: true } },
      { from: "mia", text: "Стой.", delay: 800 },
      { from: "mia", text: "Я кое-что вспомнила про тот вечер у моста.", delay: 1000 },
      {
        type: "choice",
        options: [
          { text: "Что именно?", loyalty: {}, next: "mia_late_memory_what" },
          { text: "Это про Харпер?", loyalty: {}, next: "mia_late_memory_harper" },
          { text: "Не спеши. Вспоминай, как было.", loyalty: {}, sendMessage: false, next: "mia_late_memory_slow" }
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
      { from: "player", text: "Не спеши.", delay: 300 },
      { from: "player", text: "Вспоминай, как было.", delay: 500 },
      { from: "mia", text: "Я пытаюсь.", delay: 900 }
    ]
  },
  {
    id: "mia_late_derek_argument",
    chat: "private_mia",
    trigger: "after:mia_late_memory_what|mia_late_memory_harper|mia_late_memory_slow",
    messages: [
      { from: "mia", text: "Я спросила её, не написать ли Дереку.", delay: 1000 },
      { from: "mia", text: "Чтобы он заехал за ней.", delay: 900 },
      { from: "mia", text: "Или хотя бы поговорил с ней.", delay: 900 },
      { from: "mia", text: "Она сказала: «Не надо. Мы поссорились. Я не хочу сейчас с ним разговаривать».", delay: 1300 },
      { from: "mia", text: "Я тогда решила, что это обычная ссора.", delay: 1000 },
      { from: "mia", text: "И не стала лезть.", delay: 900 },
      {
        type: "choice",
        options: [
          { text: "Она сказала, из-за чего они поссорились?", loyalty: {}, next: "mia_late_why_argued" },
          { text: "Ты уверена, что она говорила именно о Дереке?", loyalty: {}, next: "mia_late_sure_derek" },
          { text: "Как она это сказала?", loyalty: {}, next: "mia_late_how_said" }
        ]
      }
    ]
  },
  {
    id: "mia_late_why_argued",
    chat: "private_mia",
    trigger: "choice:mia_late_derek_argument:0",
    messages: [
      { from: "mia", text: "Нет.", delay: 800 },
      { from: "mia", text: "Я спросила.", delay: 800 },
      { from: "mia", text: "Она только сказала, что не хочет это обсуждать.", delay: 1000 }
    ]
  },
  {
    id: "mia_late_sure_derek",
    chat: "private_mia",
    trigger: "choice:mia_late_derek_argument:1",
    messages: [
      { from: "mia", text: "Да.", delay: 800 },
      { from: "mia", text: "Я сама первая назвала его.", delay: 900 },
      { from: "mia", text: "И она не стала спорить.", delay: 900 }
    ]
  },
  {
    id: "mia_late_how_said",
    chat: "private_mia",
    trigger: "choice:mia_late_derek_argument:2",
    messages: [
      { from: "mia", text: "Тихо.", delay: 800 },
      { from: "mia", text: "Будто уже решила, что не хочет с ним разговаривать.", delay: 1000 }
    ]
  },
  {
    id: "mia_late_derek_possible_context",
    chat: "private_mia",
    trigger: "after:mia_late_why_argued|mia_late_sure_derek|mia_late_how_said",
    messages: [
      { from: "mia", text: "Я не думаю, что Дерек обязательно сделал с ней что-то.", delay: 1100 },
      { from: "mia", text: "Просто он мог знать, куда она собиралась.", delay: 1000 },
      { from: "mia", text: "Или почему она не хотела ехать домой.", delay: 1000 },
      {
        type: "choice",
        options: [
          { text: "Я не буду делать из этого выводы.", loyalty: {}, trust: { miaTrust: 1 }, next: "mia_late_no_conclusions" },
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
      { from: "mia", text: "Спасибо.", delay: 800 },
      { from: "mia", text: "Я не хочу, чтобы все сразу решили, что он виноват.", delay: 1000 }
    ]
  },
  {
    id: "mia_late_ask_calmly",
    chat: "private_mia",
    trigger: "choice:mia_late_derek_possible_context:1",
    messages: [
      { from: "mia", text: "Хорошо.", delay: 800 },
      { from: "mia", text: "Только не пиши так, будто мы уже всё про него решили.", delay: 1000 }
    ]
  },
  {
    id: "mia_late_thanks_memory",
    chat: "private_mia",
    trigger: "choice:mia_late_derek_possible_context:2",
    messages: [
      { from: "mia", text: "Я должна была сказать раньше.", delay: 900 },
      { from: "mia", text: "Но тогда мне правда казалось, что это ничего не значит.", delay: 1000 }
    ]
  },
  {
    id: "mia_late_final_action",
    chat: "private_mia",
    trigger: "after:mia_late_no_conclusions|mia_late_ask_calmly|mia_late_thanks_memory",
    setFlags: { miaRememberedDerekArgument: true },
    messages: [
      { from: "mia", text: "Мне правда пора.", delay: 900 },
      { from: "mia", text: "На этот раз точно.", delay: 900 },
      { from: "mia", text: "Спокойной ночи.", delay: 900 },
      { type: "system", text: "Миа вышла из сети.", delay: 900, characterStatus: { id: "mia", online: false } },
      {
        type: "choice",
        options: [
          { text: "Написать Дереку", loyalty: {}, sendMessage: false, setFlag: "derekConversationUnlocked" }
        ]
      }
    ]
  }
];
