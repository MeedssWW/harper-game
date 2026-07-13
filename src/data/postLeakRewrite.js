const option = (text, next, extra = {}) => ({ text, loyalty: {}, next, ...extra });
const choice = options => ({ type: "choice", options });
const D = (text, delay = 760) => ({ from: "derek", text, delay });
const O = (text, delay = 760) => ({ from: "olivia", text, delay });
const M = (text, delay = 760) => ({ from: "mia", text, delay });
const U = (text, delay = 760) => ({ from: "unknown", text, delay });
const T = (text, delay = 760) => ({ from: "tyler", text, delay });
const S = (text, delay = 760) => ({ from: "mason", text, delay });
const B = (id, chat, trigger, messages, extra = {}) => ({ id, chat, trigger, messages, ...extra });

export const postLeakRewriteBeats = [
  B("postleak_derek_larks", "private_derek", "flagsValueAfter:brooke_after_call_end:larksCreated:true:brookeReceivedLeak:true", [
    { type: "pause", delay: 2500 }, { type: "system", text: "Дерек в сети.", delay: 450, characterStatus: { id: "derek", online: true } },
    D("Что за Larks?"), D("Брук только что прислала мне скрин."), D("Ты, Оливия и Миа."), D("Отдельная группа про Харпер."),
    choice([
      option("Это не тайное расследование.", "postleak_derek_larks_not_secret"),
      option("Меня сначала спросили, прежде чем добавить.", "postleak_derek_larks_asked"),
      option("Сначала лучше спроси, откуда у Брук скрин моего телефона.", "postleak_derek_larks_source")
    ])
  ], { identify: ["derek"] }),
  B("postleak_derek_larks_not_secret", "private_derek", "choice:postleak_derek_larks:0", [D("А что тогда?"), D("Потому что выглядит именно так.")]),
  B("postleak_derek_larks_asked", "private_derek", "choice:postleak_derek_larks:1", [D("И это должно всё объяснить?"), D("Почему вы вообще решили обсуждать Харпер отдельно?")]),
  B("postleak_derek_larks_source", "private_derek", "choice:postleak_derek_larks:2", [D("Я уже спросил."), D("Ей прислали его с неизвестного номера."), D("Теперь отвечай ты.")]),

  B("postleak_derek_separate", "private_derek", "flagsValueAfter:brooke_after_call_end:larksCreated:false:brookeReceivedLeak:true", [
    { type: "pause", delay: 2500 }, { type: "system", text: "Дерек в сети.", delay: 450, characterStatus: { id: "derek", online: true } },
    D("Брук прислала мне скрин твоих чатов."), D("Оливия."), D("Миа."), D("Обе наверху списка."), D("Что вы обсуждаете?"),
    choice([
      option("Они сами мне написали.", "postleak_derek_sep_wrote"),
      option("Это были отдельные разговоры, а не какой-то заговор.", "postleak_derek_sep_talks"),
      option("Меня больше волнует, кто сделал скрин моего телефона.", "postleak_derek_sep_source")
    ])
  ], { identify: ["derek"] }),
  B("postleak_derek_sep_wrote", "private_derek", "choice:postleak_derek_separate:0", [D("И обе решили обсуждать с тобой Харпер?"), D("С человеком, которого никто из нас не знает?")]),
  B("postleak_derek_sep_talks", "private_derek", "choice:postleak_derek_separate:1", [D("Неважно, как вы это называете."), D("Брук узнала обо всём из анонимного сообщения.")]),
  B("postleak_derek_sep_source", "private_derek", "choice:postleak_derek_separate:2", [D("Меня тоже."), D("Но сначала я хочу понять, что было в этих чатах.")]),

  B("postleak_derek_what_found", "private_derek", "after:postleak_derek_larks_not_secret|postleak_derek_larks_asked|postleak_derek_larks_source|postleak_derek_sep_wrote|postleak_derek_sep_talks|postleak_derek_sep_source", [
    D("Что вы там нашли?"), choice([
      option("Оливия нашла старую фотографию Харпер.", "postleak_derek_photo"),
      option("Мы пытались сравнить две её последние встречи.", "postleak_derek_meetings"),
      option("Я расскажу, но перестань говорить так, будто мы что-то сделали против тебя.", "postleak_derek_stop_accusing")
    ])
  ]),
  B("postleak_derek_photo", "private_derek", "choice:postleak_derek_what_found:0", [D("Какую фотографию?")]),
  B("postleak_derek_meetings", "private_derek", "choice:postleak_derek_what_found:1", [D("Какие ещё встречи?")]),
  B("postleak_derek_stop_accusing", "private_derek", "choice:postleak_derek_what_found:2", [D("Я не знаю, что вы сделали."), D("В этом и проблема."), D("Ладно. Рассказывай.")]),
  B("postleak_derek_sedan", "private_derek", "after:postleak_derek_photo|postleak_derek_meetings|postleak_derek_stop_accusing", [
    choice([
      option("На фотографии возле Larks стоит тёмно-зелёный седан.", "postleak_derek_sedan_photo"),
      option("Миа вспомнила, что Харпер спрашивала её про зелёную машину.", "postleak_derek_sedan_mia"),
      option("Речь идёт о машине, которую Харпер могла замечать несколько дней.", "postleak_derek_sedan_days")
    ])
  ]),
  B("postleak_derek_sedan_photo", "private_derek", "choice:postleak_derek_sedan:0", [D("Тёмно-зелёный?")]),
  B("postleak_derek_sedan_mia", "private_derek", "choice:postleak_derek_sedan:1", [D("Какую именно?"), D("Седан?")]),
  B("postleak_derek_sedan_days", "private_derek", "choice:postleak_derek_sedan:2", [D("Какого цвета?"), D("Чёрт.")]),
  B("postleak_derek_reaction", "private_derek", "after:postleak_derek_sedan_photo|postleak_derek_sedan_mia|postleak_derek_sedan_days", [
    D("Где она стояла?"), choice([
      option("Возле Larks. Почему ты так быстро зацепился за цвет?", "postleak_derek_colour"),
      option("Ты сейчас говоришь так, будто уже видел её.", "postleak_derek_seen"),
      option("Дерек, я тебя не обвиняю. Но ты явно что-то вспомнил.", "postleak_derek_remembered")
    ])
  ]),
  B("postleak_derek_colour", "private_derek", "choice:postleak_derek_reaction:0", [D("Потому что это единственная конкретная деталь."), D("Не придумывай.")]),
  B("postleak_derek_seen", "private_derek", "choice:postleak_derek_reaction:1", [D("Нет."), D("Я просто пытаюсь понять, о чём вы говорите.")]),
  B("postleak_derek_remembered", "private_derek", "choice:postleak_derek_reaction:2", [D("Ничего я не вспомнил."), D("Вы нашли машину и уже решили, что она следила за Харпер.")]),
  B("postleak_derek_police", "private_derek", "after:postleak_derek_colour|postleak_derek_seen|postleak_derek_remembered", [
    D("Полиция знает?"), choice([
      option("Да. Оливия и Миа уже всё сообщили.", "postleak_derek_police_yes"),
      option("Да. Они не стали скрывать это от полиции.", "postleak_derek_police_hint"),
      option("Знает. В отличие от тебя, они рассказали всё, что вспомнили.", "postleak_derek_police_sharp", { trust: { derekTrust: -1 } })
    ])
  ]),
  B("postleak_derek_police_yes", "private_derek", "choice:postleak_derek_police:0", [D("Хорошо.")]),
  B("postleak_derek_police_hint", "private_derek", "choice:postleak_derek_police:1", [D("На что ты намекаешь?")]),
  B("postleak_derek_police_sharp", "private_derek", "choice:postleak_derek_police:2", [D("Ты вообще ничего обо мне не знаешь.")]),
  B("postleak_derek_boundaries", "private_derek", "after:postleak_derek_police_yes|postleak_derek_police_hint|postleak_derek_police_sharp", [
    D("Оливия могла написать мне сама."), D("Миа тоже."), D("Не понимаю, почему я должен узнавать это от Брук."),
    choice([
      option("Не все обязаны сначала отчитываться перед тобой.", "postleak_derek_report"),
      option("Они сами решают, с кем им говорить.", "postleak_derek_choice"),
      option("Они боялись ещё одной ссоры. И, судя по этому разговору, не зря.", "postleak_derek_fight")
    ])
  ]),
  B("postleak_derek_report", "private_derek", "choice:postleak_derek_boundaries:0", [D("Речь о моей девушке."), D("Хотя бы это ты понимаешь?")]),
  B("postleak_derek_choice", "private_derek", "choice:postleak_derek_boundaries:1", [D("А я тогда кто?"), D("Просто человек, которому можно ничего не говорить?")]),
  B("postleak_derek_fight", "private_derek", "choice:postleak_derek_boundaries:2", [D("Я злюсь не потому, что хочу с кем-то ругаться."), D("Я два дня ничего не понимаю.")]),
  B("postleak_derek_end", "private_derek", "after:postleak_derek_report|postleak_derek_choice|postleak_derek_fight", [
    D("Ладно."), D("Я напишу Оливии."), D("Если найдёте что-то настоящее, а не очередную догадку — скажите мне."),
    choice([
      option("Если это не будет чужим секретом — скажу.", "postleak_derek_end_secret"),
      option("Сначала перестань обращаться со всеми как с подозреваемыми.", "postleak_derek_end_suspects"),
      option("Хорошо. Но ты тоже должен говорить правду.", "postleak_derek_end_truth")
    ])
  ]),
  B("postleak_derek_end_secret", "private_derek", "choice:postleak_derek_end:0", [D("Ладно."), { type: "system", text: "Дерек не в сети.", delay: 550, characterStatus: { id: "derek", online: false } }]),
  B("postleak_derek_end_suspects", "private_derek", "choice:postleak_derek_end:1", [D("Я постараюсь."), D("Больше ничего обещать не могу."), { type: "system", text: "Дерек не в сети.", delay: 550, characterStatus: { id: "derek", online: false } }]),
  B("postleak_derek_end_truth", "private_derek", "choice:postleak_derek_end:2", [D("Я говорю."), D("Всё, что имеет значение."), { type: "system", text: "Дерек не в сети.", delay: 550, characterStatus: { id: "derek", online: false } }]),

  B("postleak_olivia", "private_olivia", "after:postleak_derek_end_secret|postleak_derek_end_suspects|postleak_derek_end_truth", [
    { type: "pause", delay: 1800 }, { type: "system", text: "Оливия в сети.", delay: 450, characterStatus: { id: "olivia", online: true } },
    O("Брук прислала мне скрин."), O("Тот же, который отправила тебе."), O("Я не понимаю, откуда он взялся."), O("Он правда сделан с твоего телефона?"),
    choice([
      option("Да. Во время открытия видео телефон взломали.", "postleak_olivia_hack"),
      option("Похоже на то. Кто-то получил доступ к моим чатам.", "postleak_olivia_access"),
      option("Я пока не хочу рассказывать всё. Но скрин отправлял не я.", "postleak_olivia_private", { trust: { oliviaTrust: -1 } })
    ])
  ]),
  B("postleak_olivia_hack", "private_olivia", "choice:postleak_olivia:0", [O("Что?"), O("Почему ты сразу не сказал?")]),
  B("postleak_olivia_access", "private_olivia", "choice:postleak_olivia:1", [O("Тогда скрин могли сделать в тот момент."), O("И мы даже не знаем, что ещё они видели.")]),
  B("postleak_olivia_private", "private_olivia", "choice:postleak_olivia:2", [O("Хорошо. Я не буду давить."), O("Просто теперь это касается и наших переписок.")]),
  B("postleak_olivia_derek", "private_olivia", "after:postleak_olivia_hack|postleak_olivia_access|postleak_olivia_private", [
    O("Дерек написал мне."), O("Я рассказала ему только про фотографию и машину."), O("Про телефон Мии и видео ничего не говорила."), O("Это не моя информация."),
    choice([
      option("Спасибо, что не рассказала за Мию.", "postleak_olivia_thanks", { trust: { oliviaTrust: 1 } }),
      option("Дерек слишком странно отреагировал на цвет машины.", "postleak_olivia_derek_react"),
      option("Мне кажется, кто-то специально пытается перессорить вас.", "postleak_olivia_divide")
    ])
  ]),
  B("postleak_olivia_thanks", "private_olivia", "choice:postleak_olivia_derek:0", [O("Конечно. Она сама решит, кому об этом говорить.")]),
  B("postleak_olivia_derek_react", "private_olivia", "choice:postleak_olivia_derek:1", [O("Что именно он сказал?"), O("Ладно. Я сама у него спрошу.")]),
  B("postleak_olivia_divide", "private_olivia", "choice:postleak_olivia_derek:2", [O("Возможно."), O("Скрин отправили именно Брук — человеку, который точно разозлится.")]),
  B("postleak_olivia_end", "private_olivia", "after:postleak_olivia_thanks|postleak_olivia_derek_react|postleak_olivia_divide", [
    O("Я не хочу сейчас снова собирать всех вместе."), O("Если появится что-то конкретное, будем говорить с теми, кто действительно может помочь."), O("И сразу передавать полиции."), O("Я буду на связи.")
  ]),

  B("postleak_unknown_video", "private_unknown", "after:postleak_olivia_end", [
    { type: "pause", delay: 3500 }, { type: "system", text: "Неизвестный в сети.", delay: 450, characterStatus: { id: "unknown", online: true } },
    U("Восстановил начало файла."), U("Три секунды."), U("Больше пока нет."),
    choice([
      option("Отправляй.", "postleak_unknown_send"),
      option("Это безопасно открывать?", "postleak_unknown_safe"),
      option("После прошлого файла я не очень хочу снова нажимать на видео.", "postleak_unknown_wary")
    ])
  ]),
  B("postleak_unknown_send", "private_unknown", "choice:postleak_unknown_video:0", [U("Сейчас.")]),
  B("postleak_unknown_safe", "private_unknown", "choice:postleak_unknown_video:1", [U("Да. Это локальная копия. Не ссылка.")]),
  B("postleak_unknown_wary", "private_unknown", "choice:postleak_unknown_video:2", [U("Нормально."), U("Я вырезал фрагмент и убрал внешний код."), U("Соединения с сервером не будет.")]),
  B("postleak_video_fragment", "private_unknown", "after:postleak_unknown_send|postleak_unknown_safe|postleak_unknown_wary", [
    { from: "unknown", type: "video", title: "VID_1842_PART.mp4", duration: "00:03", src: "src/assets/videos/vid_1842_fragment.mp4?v=120", poster: "src/assets/videos/vid_1842_fragment_poster.jpg?v=120", caption: "Восстановленный безопасный фрагмент · 00:03", orientation: "vertical", analysisAction: "frame_analysis", delay: 900 },
    U("На кадре тёмно-зелёный седан, мокрая дорога и металлическое ограждение."), U("На заднем стекле видна светлая прямоугольная наклейка."),
    choice([
      option("Это снова зелёная машина.", "postleak_video_green"),
      option("Если это та же машина, Харпер не просто себя накручивала.", "postleak_video_same"),
      option("Три секунды, а ощущение такое, будто стало только хуже.", "postleak_video_worse")
    ])
  ], { setFlags: { cleanVideoFragmentReceived: true, videoPartialRestored: true } }),
  B("postleak_video_green", "private_unknown", "choice:postleak_video_fragment:0", [U("Похожа. Но номер не виден.")]),
  B("postleak_video_same", "private_unknown", "choice:postleak_video_fragment:1", [U("Если это та же машина. Пока только совпадают цвет и форма.")]),
  B("postleak_video_worse", "private_unknown", "choice:postleak_video_fragment:2", [U("Потому что теперь у машины есть ещё одна точка появления.")]),
  B("postleak_video_still", "private_unknown", "after:postleak_video_green|postleak_video_same|postleak_video_worse", [
    U("Сохрани кадр с наклейкой."), U("Не пересылай старую ссылку."), U("Только отдельное изображение."),
    { from: "unknown", type: "image", src: "src/assets/case/still_1842.png?v=120", caption: "still_1842.png", delay: 700 },
    { type: "system", text: "Кадр добавлен в материалы дела.", delay: 550 }
  ], { setFlags: { stickerStillAddedToCase: true, sedanStickerLeadUnlocked: true } }),

  B("postleak_still_larks", "group_larks", "flagsValueAfter:postleak_video_still:larksCreated:true:stickerStillAddedToCase:true", [
    { type: "system", text: "Миа в сети.", delay: 450, characterStatus: { id: "mia", online: true } },
    { from: "player", type: "image", src: "src/assets/case/still_1842.png?v=120", caption: "still_1842.png", delay: 650 },
    M("Это из того видео?"), O("Оно безопасное?"),
    choice([
      option("Да. Это отдельный сохранённый кадр.", "postleak_still_larks_safe"),
      option("Старую ссылку я не пересылал.", "postleak_still_larks_link"),
      option("Проверил. Он больше никуда не подключается.", "postleak_still_larks_checked")
    ])
  ]),
  B("postleak_still_larks_safe", "group_larks", "choice:postleak_still_larks:0", [O("Хорошо.")]),
  B("postleak_still_larks_link", "group_larks", "choice:postleak_still_larks:1", [M("Спасибо. Одного взлома нам достаточно.")]),
  B("postleak_still_larks_checked", "group_larks", "choice:postleak_still_larks:2", [O("Тогда посмотрим.")]),
  B("postleak_still_larks_read", "group_larks", "after:postleak_still_larks_safe|postleak_still_larks_link|postleak_still_larks_checked", [
    M("Машина правда похожа. Цвет точно такой же."), O("Но номера не видно."), M("На стекле что-то есть."), O("Похоже на пропуск."), O("Тайлер может узнать."), M("Точно. Он постоянно ездит по складам и служебным дорогам.")
  ]),
  B("postleak_still_separate", "private_olivia", "flagsValueAfter:postleak_video_still:larksCreated:false:stickerStillAddedToCase:true", [
    { from: "player", type: "image", src: "src/assets/case/still_1842.png?v=120", caption: "still_1842.png", delay: 650 }, O("Это кадр из видео?"),
    choice([
      option("Да. Отдельная безопасная копия.", "postleak_still_sep_safe"),
      option("Да. Старую ссылку я никому не пересылаю.", "postleak_still_sep_link"),
      option("На ней та же зелёная машина или очень похожая.", "postleak_still_sep_car")
    ])
  ]),
  B("postleak_still_sep_safe", "private_olivia", "choice:postleak_still_separate:0", [O("Хорошо.")]),
  B("postleak_still_sep_link", "private_olivia", "choice:postleak_still_separate:1", [O("Правильно.")]),
  B("postleak_still_sep_car", "private_olivia", "choice:postleak_still_separate:2", [O("Да. Уверенно сказать нельзя.")]),
  B("postleak_still_sep_read", "private_olivia", "after:postleak_still_sep_safe|postleak_still_sep_link|postleak_still_sep_car", [
    O("Я показала кадр Мие. Только сам снимок, не ссылку."), O("Она тоже считает, что машина похожа."), O("И заметила наклейку на заднем стекле."), O("Я подумала о Тайлере. Он постоянно ездит по служебным дорогам.")
  ]),
  B("postleak_tyler_offer", "private_olivia", "after:postleak_still_larks_read|postleak_still_sep_read", [
    O("Можно попросить его посмотреть."), O("Не потому, что он будет что-то расследовать."), O("Просто он мог видеть такие пропуска."), O("Я сама ему напишу."), O("Как лучше показать кадр?"),
    choice([
      option("Отправь только вырезку с наклейкой.", "postleak_tyler_crop", { setFlag: "tylerReceivedCroppedStill" }),
      option("Можно показать весь кадр, но без подробностей про телефон Мии.", "postleak_tyler_full", { setFlag: "tylerReceivedFullStill" }),
      option("Сначала спроси, готов ли он посмотреть, а потом отправляй.", "postleak_tyler_ask", { setFlag: "tylerAskedBeforeStill" })
    ])
  ]),
  B("postleak_tyler_crop", "private_olivia", "choice:postleak_tyler_offer:0", [O("Хорошо. Машину целиком показывать не буду.")]),
  B("postleak_tyler_full", "private_olivia", "choice:postleak_tyler_offer:1", [O("Конечно. Скажу только, что это связано с Харпер.")]),
  B("postleak_tyler_ask", "private_olivia", "choice:postleak_tyler_offer:2", [O("Хорошо. Не хочу просто скидывать ему это без объяснения.")]),
  B("postleak_tyler_ready", "private_olivia", "after:postleak_tyler_crop|postleak_tyler_full|postleak_tyler_ask", [
    O("Написала."), { type: "pause", delay: 1500 }, O("Он согласился посмотреть."), O("Сказал, что лучше напишет тебе сам."),
    { type: "contacts", id: "tyler" }, { type: "system", text: "Тайлер в сети.", delay: 450, characterStatus: { id: "tyler", online: true } }
  ], { unlock: [{ type: "contacts", id: "tyler" }, { type: "chats", id: "private_tyler" }] }),

  B("postleak_tyler_start", "private_tyler", "after:postleak_tyler_ready", [
    T("Привет."), T("Оливия сказала, у тебя есть кадр с наклейкой на машине."), T("Она уже скинула изображение."), T("Секунду. Увеличиваю."),
    choice([
      option("Узнаёшь её?", "postleak_tyler_recognize"),
      option("Не торопись. Качество плохое.", "postleak_tyler_quality"),
      option("Скажи честно, даже если она тебе ничего не напоминает.", "postleak_tyler_honest")
    ])
  ], { identify: ["tyler"] }),
  B("postleak_tyler_recognize", "private_tyler", "choice:postleak_tyler_start:0", [T("Вроде да. Но сейчас посмотрю нормально.")]),
  B("postleak_tyler_quality", "private_tyler", "choice:postleak_tyler_start:1", [T("Вижу. Поэтому и не говорю точно.")]),
  B("postleak_tyler_honest", "private_tyler", "choice:postleak_tyler_start:2", [T("Я не собираюсь угадывать. Подожди.")]),
  B("postleak_tyler_pass", "private_tyler", "after:postleak_tyler_recognize|postleak_tyler_quality|postleak_tyler_honest", [
    T("Похоже на временный пропуск North Yard."), T("Они светлые, с тёмной полосой сбоку."), T("Сверху обычно стоит N-Y."), T("На этом кадре как раз что-то похожее."),
    choice([
      option("Что такое North Yard?", "postleak_tyler_what"),
      option("Насколько ты уверен?", "postleak_tyler_sure"),
      option("Это может быть обычная парковочная наклейка?", "postleak_tyler_parking")
    ])
  ]),
  B("postleak_tyler_what", "private_tyler", "choice:postleak_tyler_pass:0", [T("Старые склады на севере города."), T("Заезд через дорогу у старой станции.")]),
  B("postleak_tyler_sure", "private_tyler", "choice:postleak_tyler_pass:1", [T("Процентов на семьдесят."), T("Половины наклейки не видно. Могу ошибаться.")]),
  B("postleak_tyler_parking", "private_tyler", "choice:postleak_tyler_pass:2", [T("Теоретически да."), T("Но форма и полоса очень похожи на пропуск North Yard.")]),
  B("postleak_tyler_limits", "private_tyler", "after:postleak_tyler_what|postleak_tyler_sure|postleak_tyler_parking", [
    T("Такие клеят временно курьерам, техникам и машинам подрядчиков."), T("По этому кадру конкретную машину не найти. Номер пропуска не читается."),
    choice([
      option("То есть по наклейке нельзя найти конкретную машину?", "postleak_tyler_no_id"),
      option("Но она могла заезжать на территорию North Yard.", "postleak_tyler_could"),
      option("Если ты ошибся, мы опять зацепимся не за то.", "postleak_tyler_mistake")
    ])
  ]),
  B("postleak_tyler_no_id", "private_tyler", "choice:postleak_tyler_limits:0", [T("По этому кадру — нет.")]),
  B("postleak_tyler_could", "private_tyler", "choice:postleak_tyler_limits:1", [T("Могла. Или водитель просто не снял старую наклейку.")]),
  B("postleak_tyler_mistake", "private_tyler", "choice:postleak_tyler_limits:2", [T("Поэтому я и говорю «похоже». Не «точно».")]),
  B("postleak_tyler_warning", "private_tyler", "after:postleak_tyler_no_id|postleak_tyler_could|postleak_tyler_mistake", [
    T("Только никто не едет туда сам."), T("North Yard частично закрыт."), T("Там старые пути, склады и охрана."), T("А возле станции половина ограждений сгнила."),
    choice([
      option("Я вообще в другом городе.", "postleak_tyler_city"),
      option("Я не собирался никого туда отправлять.", "postleak_tyler_nobody"),
      option("Ты говоришь это больше для Мии, да?", "postleak_tyler_mia")
    ])
  ]),
  B("postleak_tyler_city", "private_tyler", "choice:postleak_tyler_warning:0", [T("Я знаю. Я говорю про остальных.")]),
  B("postleak_tyler_nobody", "private_tyler", "choice:postleak_tyler_warning:1", [T("Хорошо. Просто лучше сказать сразу.")]),
  B("postleak_tyler_mia", "private_tyler", "choice:postleak_tyler_warning:2", [T("В основном. Она может сначала поехать, а потом решить, хорошая ли это была идея.")]),
  B("postleak_tyler_end", "private_tyler", "after:postleak_tyler_city|postleak_tyler_nobody|postleak_tyler_mia", [
    T("И кадр обязательно передайте полиции."), T("Вместе с тем, что наклейка может быть от North Yard."), T("Только напишите именно «может быть»."), T("По такому качеству я не могу сказать точно."),
    choice([
      option("Хорошо. Так и передадим.", "postleak_tyler_end_ok"),
      option("Спасибо, что не стал выдавать догадку за факт.", "postleak_tyler_end_fact"),
      option("Ты сам напишешь Оливии или мне пересказать?", "postleak_tyler_end_olivia")
    ])
  ]),
  B("postleak_tyler_end_ok", "private_tyler", "choice:postleak_tyler_end:0", [T("Нормально.")]),
  B("postleak_tyler_end_fact", "private_tyler", "choice:postleak_tyler_end:1", [T("А смысл угадывать? Потом все запомнят только то, что я якобы был уверен.")]),
  B("postleak_tyler_end_olivia", "private_tyler", "choice:postleak_tyler_end:2", [T("Сам напишу. Она мне кадр и прислала.")]),
  B("postleak_tyler_reports", "private_tyler", "after:postleak_tyler_end_ok|postleak_tyler_end_fact|postleak_tyler_end_olivia", [
    T("Я сейчас отправлю Оливии то, что смог разобрать."), T("Коротко. Без подробностей про телефон Мии и видео."), T("Пусть приложит это к сообщению следователю."),
    T("Если ещё что-то понадобится по дорогам или пропускам — можете спросить."), T("Но на North Yard сами не суйтесь."),
    { type: "system", text: "Тайлер не в сети.", delay: 550, characterStatus: { id: "tyler", online: false } }
  ], { setFlags: { tylerIdentifiedPossibleNorthYardPass: true, tylerReportedFindingToOlivia: true } }),

  B("postleak_olivia_report_larks", "group_larks", "flagsValueAfter:postleak_tyler_reports:larksCreated:true:tylerReportedFindingToOlivia:true", [
    { type: "system", text: "Оливия в сети.", delay: 450, characterStatus: { id: "olivia", online: true } }, O("Тайлер мне написал."), O("Сказал, что наклейка похожа на временный пропуск North Yard."), M("Это где старая станция?"), O("Рядом. Служебная дорога к складам проходит возле неё."), O("Но Тайлер не уверен. Из-за качества кадра может ошибаться.")
  ]),
  B("postleak_olivia_report_sep", "private_olivia", "flagsValueAfter:postleak_tyler_reports:larksCreated:false:tylerReportedFindingToOlivia:true", [
    { type: "system", text: "Оливия в сети.", delay: 450, characterStatus: { id: "olivia", online: true } }, O("Тайлер мне ответил."), O("Он уже успел поговорить с тобой?"),
    choice([
      option("Да. Сказал, что наклейка похожа на пропуск North Yard.", "postleak_olivia_sep_same"),
      option("Да. Но он не уверен.", "postleak_olivia_sep_unsure"),
      option("Да. Он обещал сам переслать тебе вывод.", "postleak_olivia_sep_forward")
    ])
  ]),
  B("postleak_olivia_sep_same", "private_olivia", "choice:postleak_olivia_report_sep:0", [O("Мне он написал то же самое.")]),
  B("postleak_olivia_sep_unsure", "private_olivia", "choice:postleak_olivia_report_sep:1", [O("Да. Он несколько раз это подчеркнул.")]),
  B("postleak_olivia_sep_forward", "private_olivia", "choice:postleak_olivia_report_sep:2", [O("Уже переслал.")]),
  B("postleak_police_send", "private_olivia", "after:postleak_olivia_report_larks|postleak_olivia_sep_same|postleak_olivia_sep_unsure|postleak_olivia_sep_forward", [
    O("Я отправлю следователю сам кадр."), O("И сообщение Тайлера."), O("Добавлю время создания файла и фотографию из Larks для сравнения."), O("Без вывода, что машина точно была возле North Yard."),
    choice([
      option("Да. Пусть проверят сами.", "postleak_police_check"),
      option("Главное, не называй это подтверждённым пропуском.", "postleak_police_not_confirmed"),
      option("Добавь, что на видео машина похожа на седан с фотографии из Larks.", "postleak_police_compare")
    ])
  ]),
  B("postleak_police_check", "private_olivia", "choice:postleak_police_send:0", [O("Хорошо.")]),
  B("postleak_police_not_confirmed", "private_olivia", "choice:postleak_police_send:1", [O("Не назову. Напишу: «может быть похожа».")]),
  B("postleak_police_compare", "private_olivia", "choice:postleak_police_send:2", [O("Добавлю. Но тоже как возможное совпадение.")]),
  B("postleak_map_update", "private_olivia", "after:postleak_police_check|postleak_police_not_confirmed|postleak_police_compare", [
    O("Отправила. Кадр, время файла, фотографию из Larks и объяснение Тайлера."), O("Теперь пусть этим занимаются они."),
    { type: "case_entry", id: "thread_north_yard", entryType: "thread", title: "NORTH YARD — ВОЗМОЖНАЯ СВЯЗЬ", text: "На кадре виден тёмно-зелёный седан со светлой наклейкой. Тайлер считает, что она похожа на временный пропуск North Yard. Номер не читается; машина и место съёмки не подтверждены.", delay: 300 },
    { type: "case_entry", id: "question_old_station", entryType: "question", title: "СТАРАЯ СТАНЦИЯ — НЕ ПОДТВЕРЖДЕНО", text: "Служебная дорога к North Yard проходит рядом со старой железнодорожной станцией.", delay: 300 },
    { type: "system", text: "Карта дела обновлена.", delay: 600 }
  ], { setFlags: { northYardStillSentToPolice: true, northYardAddedToMap: true } }),

  B("postleak_mason", "private_mason", "after:postleak_map_update", [
    { type: "pause", delay: 1800 }, { type: "system", text: "Мейсон в сети.", delay: 450, characterStatus: { id: "mason", online: true } },
    S("Тайлер сказал, вы нашли возможную связь с North Yard."), S("Никто туда не едет."),
    choice([
      option("Я нахожусь в другом городе, Мейсон.", "postleak_mason_city"),
      option("Никто пока и не собирался.", "postleak_mason_nobody"),
      option("Ты впервые написал мне только для того, чтобы что-то запретить.", "postleak_mason_first")
    ])
  ], { identify: ["mason"] }),
  B("postleak_mason_city", "private_mason", "choice:postleak_mason:0", [S("Я знаю. Через тебя информация идёт к остальным.")]),
  B("postleak_mason_nobody", "private_mason", "choice:postleak_mason:1", [S("Хорошо. Пусть так и останется.")]),
  B("postleak_mason_first", "private_mason", "choice:postleak_mason:2", [S("Да. Потому что это закрытая территория.")]),
  B("postleak_mason_end", "private_mason", "after:postleak_mason_city|postleak_mason_nobody|postleak_mason_first", [
    S("Передайте кадр полиции."), S("Сохраните исходное время и переписку с Тайлером."), S("Не ищите машину самостоятельно."), S("Не звоните на North Yard."), S("И не предупреждайте никого, кто там работает."),
    choice([
      option("Кадр уже у полиции.", "postleak_mason_police"),
      option("Ты думаешь, кто-то из нас реально полез бы туда?", "postleak_mason_climb"),
      option("Похоже, ты нам вообще не доверяешь.", "postleak_mason_trust")
    ])
  ]),
  B("postleak_mason_police", "private_mason", "choice:postleak_mason_end:0", [S("Хорошо. Тогда ждите."), { type: "system", text: "Мейсон не в сети.", delay: 550, characterStatus: { id: "mason", online: false } }], { setFlags: { postLeakMasonComplete: true } }),
  B("postleak_mason_climb", "private_mason", "choice:postleak_mason_end:1", [S("Да. Поэтому и пишу."), { type: "system", text: "Мейсон не в сети.", delay: 550, characterStatus: { id: "mason", online: false } }], { setFlags: { postLeakMasonComplete: true } }),
  B("postleak_mason_trust", "private_mason", "choice:postleak_mason_end:2", [S("В вопросах закрытых промышленных территорий — нет. И это не личное."), { type: "system", text: "Мейсон не в сети.", delay: 550, characterStatus: { id: "mason", online: false } }], { setFlags: { postLeakMasonComplete: true } })
];
