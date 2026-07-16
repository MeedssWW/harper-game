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
    D("Что за Larks?"), D("Брук скинула мне скрин."), D("Там ты, Оливия и Миа."), D("Вы создали отдельный чат про Харпер?"),
    choice([
      option("Нет, это не «тайный штаб».", "postleak_derek_larks_not_secret"),
      option("В отличие от тебя, Оливия сначала спросила.", "postleak_derek_larks_asked"),
      option("Тебе прислали скрин с моего телефона. Это сейчас не главнее?", "postleak_derek_larks_source")
    ])
  ], { identify: ["derek"] }),
  B("postleak_derek_larks_not_secret", "private_derek", "choice:postleak_derek_larks:0", [D("Тогда что?"), D("Потому что со стороны именно так и выглядит.")]),
  B("postleak_derek_larks_asked", "private_derek", "choice:postleak_derek_larks:1", [D("И это всё меняет?"), D("Почему вообще отдельно?")]),
  B("postleak_derek_larks_source", "private_derek", "choice:postleak_derek_larks:2", [D("Пугает."), D("Ей его прислали с незнакомого номера."), D("Но я всё равно хочу знать, что за чат.")]),

  B("postleak_derek_separate", "private_derek", "flagsValueAfter:brooke_after_call_end:larksCreated:false:brookeReceivedLeak:true", [
    { type: "pause", delay: 2500 }, { type: "system", text: "Дерек в сети.", delay: 450, characterStatus: { id: "derek", online: true } },
    D("Брук прислала мне скрин твоих чатов."), D("Оливия."), D("Миа."), D("Обе наверху."), D("Что у вас происходит?"),
    choice([
      option("Они сами мне написали.", "postleak_derek_sep_wrote"),
      option("Они писали мне отдельно. Никакого заговора нет.", "postleak_derek_sep_talks"),
      option("Кто-то залез в мой телефон. Вот что меня волнует.", "postleak_derek_sep_source")
    ])
  ], { identify: ["derek"] }),
  B("postleak_derek_sep_wrote", "private_derek", "choice:postleak_derek_separate:0", [D("И обе — про Харпер?"), D("Тебе? Человеку, которого мы вообще не знаем?")]),
  B("postleak_derek_sep_talks", "private_derek", "choice:postleak_derek_separate:1", [D("Назови как хочешь."), D("Брук узнала об этом от анонима. Это нормально?")]),
  B("postleak_derek_sep_source", "private_derek", "choice:postleak_derek_separate:2", [D("Меня тоже, ясно?"), D("Но что было в чатах, я тоже хочу знать.")]),

  B("postleak_derek_what_found", "private_derek", "after:postleak_derek_larks_not_secret|postleak_derek_larks_asked|postleak_derek_larks_source|postleak_derek_sep_wrote|postleak_derek_sep_talks|postleak_derek_sep_source", [
    D("Ладно. Что вы нашли?"), choice([
      option("Оливия нашла старую фотографию Харпер.", "postleak_derek_photo"),
      option("Оливия и Миа сравнили, что Харпер говорила им в разные дни.", "postleak_derek_meetings"),
      option("Сначала перестань говорить со мной как с предателем.", "postleak_derek_stop_accusing")
    ])
  ]),
  B("postleak_derek_photo", "private_derek", "choice:postleak_derek_what_found:0", [D("Какую фотографию?")]),
  B("postleak_derek_meetings", "private_derek", "choice:postleak_derek_what_found:1", [D("Какие ещё встречи?")]),
  B("postleak_derek_stop_accusing", "private_derek", "choice:postleak_derek_what_found:2", [D("Я вообще не знаю, что вы сделали."), D("Вот поэтому и завёлся."), D("Ладно... рассказывай.")]),
  B("postleak_derek_sedan", "private_derek", "after:postleak_derek_photo|postleak_derek_meetings|postleak_derek_stop_accusing", [
    choice([
      option("На фотографии возле Larks стоит тёмно-зелёный седан.", "postleak_derek_sedan_photo"),
      option("Миа вспомнила, что Харпер спрашивала её про зелёную машину.", "postleak_derek_sedan_mia"),
      option("Похоже, Харпер замечала одну зелёную машину не один день.", "postleak_derek_sedan_days")
    ])
  ]),
  B("postleak_derek_sedan_photo", "private_derek", "choice:postleak_derek_sedan:0", [D("Тёмно-зелёный?")]),
  B("postleak_derek_sedan_mia", "private_derek", "choice:postleak_derek_sedan:1", [D("Какую?"), D("Седан?")]),
  B("postleak_derek_sedan_days", "private_derek", "choice:postleak_derek_sedan:2", [D("Какого цвета?"), D("Чёрт.")]),
  B("postleak_derek_reaction", "private_derek", "after:postleak_derek_sedan_photo|postleak_derek_sedan_mia|postleak_derek_sedan_days", [
    D("Где она стояла?"), choice([
      option("Возле Larks. Почему тебя так зацепил цвет?", "postleak_derek_colour"),
      option("Ты говоришь так, будто уже видел её.", "postleak_derek_seen"),
      option("Я не обвиняю. Просто скажи, что вспомнил.", "postleak_derek_remembered")
    ])
  ]),
  B("postleak_derek_colour", "private_derek", "choice:postleak_derek_reaction:0", [D("Потому что это хоть что-то конкретное."), D("Не начинай.")]),
  B("postleak_derek_seen", "private_derek", "choice:postleak_derek_reaction:1", [D("Нет."), D("Я пытаюсь понять, что именно вы видели.")]),
  B("postleak_derek_remembered", "private_derek", "choice:postleak_derek_reaction:2", [D("Ничего."), D("Вы увидели машину и уже почти сделали её виноватой.")]),
  B("postleak_derek_police", "private_derek", "after:postleak_derek_colour|postleak_derek_seen|postleak_derek_remembered", [
    D("Полиция знает?"), choice([
      option("Да. Оливия и Миа уже написали следователю.", "postleak_derek_police_yes"),
      option("Да. От полиции никто это не скрывал.", "postleak_derek_police_hint"),
      option("Знает. Они не стали ждать твоего разрешения, если ты об этом.", "postleak_derek_police_sharp", { trust: { derekTrust: -1 } })
    ])
  ]),
  B("postleak_derek_police_yes", "private_derek", "choice:postleak_derek_police:0", [D("Хорошо.")]),
  B("postleak_derek_police_hint", "private_derek", "choice:postleak_derek_police:1", [D("На что ты намекаешь?")]),
  B("postleak_derek_police_sharp", "private_derek", "choice:postleak_derek_police:2", [D("На что ты намекаешь?")]),
  B("postleak_derek_boundaries", "private_derek", "after:postleak_derek_police_yes|postleak_derek_police_hint|postleak_derek_police_sharp", [
    D("Оливия могла написать мне сама."), D("И Миа."), D("Почему я узнаю об этом от Брук со скрином?"),
    choice([
      option("Они тебе ничего не должны.", "postleak_derek_report"),
      option("Может, потому что с тобой сейчас невозможно говорить?", "postleak_derek_choice"),
      option("Вот поэтому. Снова начинается ссора.", "postleak_derek_fight")
    ])
  ]),
  B("postleak_derek_report", "private_derek", "choice:postleak_derek_boundaries:0", [D("Это моя девушка."), D("Я не прошу отчёт. Я прошу не оставлять меня последним.")]),
  B("postleak_derek_choice", "private_derek", "choice:postleak_derek_boundaries:1", [D("А я тогда кто?"), D("Тот, кому лучше ничего не говорить, потому что он опять сорвётся?")]),
  B("postleak_derek_fight", "private_derek", "choice:postleak_derek_boundaries:2", [D("Я злюсь не ради ссоры."), D("Я второй день просыпаюсь и всё ещё не знаю, жива ли она.")]),
  B("postleak_derek_end", "private_derek", "after:postleak_derek_report|postleak_derek_choice|postleak_derek_fight", [
    D("Ладно."), D("Я сам напишу Оливии."), D("Если будет что-то настоящее... просто скажите мне. Хорошо?"),
    choice([
      option("Если это не будет чужим секретом — скажу.", "postleak_derek_end_secret"),
      option("Скажу. Но перестань допрашивать каждого, кто тебе пишет.", "postleak_derek_end_suspects"),
      option("Если что-то знаешь — сейчас не время молчать.", "postleak_derek_end_truth")
    ])
  ]),
  B("postleak_derek_end_secret", "private_derek", "choice:postleak_derek_end:0", [D("Ладно."), { type: "system", text: "Дерек не в сети.", delay: 550, characterStatus: { id: "derek", online: false } }]),
  B("postleak_derek_end_suspects", "private_derek", "choice:postleak_derek_end:1", [D("Я постараюсь."), D("Больше ничего обещать не могу."), { type: "system", text: "Дерек не в сети.", delay: 550, characterStatus: { id: "derek", online: false } }]),
  B("postleak_derek_end_truth", "private_derek", "choice:postleak_derek_end:2", [D("Я ничего не прячу."), D("По крайней мере... ничего важного."), { type: "system", text: "Дерек не в сети.", delay: 550, characterStatus: { id: "derek", online: false } }]),

  B("postleak_olivia", "private_olivia", "after:postleak_derek_end_secret|postleak_derek_end_suspects|postleak_derek_end_truth", [
    { type: "pause", delay: 1800 }, { type: "system", text: "Оливия в сети.", delay: 450, characterStatus: { id: "olivia", online: true } },
    O("Брук прислала мне тот скрин."), O("Тот же, что и тебе."), O("Я до сих пор не понимаю, откуда он взялся."), O("Это правда экран твоего телефона?"),
    choice([
      option("Да. Когда я открыл видео, телефон перехватили.", "postleak_olivia_hack"),
      option("Да. Кто-то успел открыть мои чаты и сделать скрин.", "postleak_olivia_access"),
      option("Я пока не могу рассказать всё. Но скрин отправлял не я.", "postleak_olivia_private", { trust: { oliviaTrust: -1 } })
    ])
  ]),
  B("postleak_olivia_hack", "private_olivia", "choice:postleak_olivia:0", [O("Что?"), O("Подожди. Тебя взломали — и ты ничего не сказал?")]),
  B("postleak_olivia_access", "private_olivia", "choice:postleak_olivia:1", [O("Тогда скрин могли сделать в тот момент."), O("И мы даже не знаем, что ещё они видели.")]),
  B("postleak_olivia_private", "private_olivia", "choice:postleak_olivia:2", [O("Ладно. Давить не буду."), O("Но пойми: теперь там и наши переписки.")]),
  B("postleak_olivia_derek", "private_olivia", "after:postleak_olivia_hack|postleak_olivia_access|postleak_olivia_private", [
    O("Дерек уже написал."), O("Я рассказала только про фото и машину."), O("Про телефон Мии и видео — нет."), O("Это не мне рассказывать."),
    choice([
      option("Спасибо, что не рассказала за Мию.", "postleak_olivia_thanks", { trust: { oliviaTrust: 1 } }),
      option("На словах «тёмно-зелёный седан» Дерек заметно дёрнулся.", "postleak_olivia_derek_react"),
      option("Мне кажется, кто-то специально пытается перессорить вас.", "postleak_olivia_divide")
    ])
  ]),
  B("postleak_olivia_thanks", "private_olivia", "choice:postleak_olivia_derek:0", [O("Конечно. Она сама решит, кому об этом говорить.")]),
  B("postleak_olivia_derek_react", "private_olivia", "choice:postleak_olivia_derek:1", [O("Дёрнулся как?"), O("Ладно. Спрошу сама — спокойно.")]),
  B("postleak_olivia_divide", "private_olivia", "choice:postleak_olivia_derek:2", [O("Возможно."), O("Скрин отправили именно Брук — человеку, который точно разозлится.")]),
  B("postleak_olivia_end", "private_olivia", "after:postleak_olivia_thanks|postleak_olivia_derek_react|postleak_olivia_divide", [
    O("Всех снова собирать не буду."), O("Будет что-то настоящее — скажем тем, кто может помочь."), O("И следователю сразу."), O("Я на связи.")
  ]),

  B("postleak_unknown_video", "private_unknown", "after:postleak_olivia_end", [
    { type: "pause", delay: 3500 }, { type: "system", text: "Неизвестный в сети.", delay: 450, characterStatus: { id: "unknown", online: true } },
    U("Достал начало файла."), U("Три секунды."), U("Пока всё."),
    choice([
      option("Отправляй.", "postleak_unknown_send"),
      option("Стой. Это точно уже не та заражённая ссылка?", "postleak_unknown_safe"),
      option("После прошлого раза кнопка «открыть видео» звучит как угроза.", "postleak_unknown_wary")
    ])
  ]),
  B("postleak_unknown_send", "private_unknown", "choice:postleak_unknown_video:0", [U("Сейчас.")]),
  B("postleak_unknown_safe", "private_unknown", "choice:postleak_unknown_video:1", [U("Точно. Локальная копия, не ссылка.")]),
  B("postleak_unknown_wary", "private_unknown", "choice:postleak_unknown_video:2", [U("И правильно."), U("Я вырезал фрагмент. Внешнего кода в нём нет."), U("К серверу он не полезет.")]),
  B("postleak_video_fragment", "private_unknown", "after:postleak_unknown_send|postleak_unknown_safe|postleak_unknown_wary", [
    { from: "unknown", type: "video", title: "VID_1842_PART.mp4", duration: "00:03", src: "src/assets/videos/vid_1842_fragment.mp4?v=120", poster: "src/assets/videos/vid_1842_fragment_poster.jpg?v=120", caption: "Восстановленный безопасный фрагмент · 00:03", orientation: "vertical", analysisAction: "frame_analysis", delay: 900 },
    U("Тёмно-зелёный седан. Мокрая дорога. Металлическое ограждение."), U("На заднем стекле — светлая прямоугольная наклейка."),
    choice([
      option("Опять зелёный седан...", "postleak_video_green"),
      option("Если машина та же, Харпер правда её замечала.", "postleak_video_same"),
      option("Всего три секунды. А мне уже хуже, чем было.", "postleak_video_worse")
    ])
  ], { setFlags: { cleanVideoFragmentReceived: true, videoPartialRestored: true } }),
  B("postleak_video_green", "private_unknown", "choice:postleak_video_fragment:0", [U("Похожа. Но номер не виден.")]),
  B("postleak_video_same", "private_unknown", "choice:postleak_video_fragment:1", [U("Если это та же машина. Пока только совпадают цвет и форма.")]),
  B("postleak_video_worse", "private_unknown", "choice:postleak_video_fragment:2", [U("Потому что теперь она не только на чужих словах.")]),
  B("postleak_video_still", "private_unknown", "after:postleak_video_green|postleak_video_same|postleak_video_worse", [
    U("Сохрани кадр с наклейкой."), U("Старую ссылку никому."), U("Пересылай только картинку."),
    { from: "unknown", type: "image", src: "src/assets/case/still_1842.png?v=120", caption: "still_1842.png", delay: 700 },
    { type: "system", text: "Кадр добавлен в материалы дела.", delay: 550 }
  ], { setFlags: { stickerStillAddedToCase: true, sedanStickerLeadUnlocked: true } }),

  B("postleak_still_larks", "group_larks", "flagsValueAfter:postleak_video_still:larksCreated:true:stickerStillAddedToCase:true", [
    { type: "system", text: "Миа в сети.", delay: 450, characterStatus: { id: "mia", online: true } },
    { from: "player", type: "image", src: "src/assets/case/still_1842.png?v=120", caption: "still_1842.png", delay: 650 },
    M("Это из того видео?"), O("Оно безопасное?"),
    choice([
      option("Да. Только картинка — без ссылки и видео.", "postleak_still_larks_safe"),
      option("Старую ссылку я не трогал и никому не отправлял.", "postleak_still_larks_link"),
      option("Проверил: это обычное изображение, никуда не подключается.", "postleak_still_larks_checked")
    ])
  ]),
  B("postleak_still_larks_safe", "group_larks", "choice:postleak_still_larks:0", [O("Хорошо.")]),
  B("postleak_still_larks_link", "group_larks", "choice:postleak_still_larks:1", [M("Спасибо. Одного взлома нам достаточно.")]),
  B("postleak_still_larks_checked", "group_larks", "choice:postleak_still_larks:2", [O("Тогда посмотрим.")]),
  B("postleak_still_larks_read", "group_larks", "after:postleak_still_larks_safe|postleak_still_larks_link|postleak_still_larks_checked", [
    M("Чёрт. Она правда похожа. И цвет тот же."), O("Номера всё равно не видно."), M("Зато на стекле что-то есть."), O("Похоже на пропуск."), O("Тайлер может узнать такие."), M("Точно. Он вечно мотается по складам и служебным дорогам.")
  ]),
  B("postleak_still_separate", "private_olivia", "flagsValueAfter:postleak_video_still:larksCreated:false:stickerStillAddedToCase:true", [
    { from: "player", type: "image", src: "src/assets/case/still_1842.png?v=120", caption: "still_1842.png", delay: 650 }, O("Это кадр из видео?"),
    choice([
      option("Да. Но это только картинка, не старая ссылка.", "postleak_still_sep_safe"),
      option("Да. Старую ссылку я никому не пересылаю.", "postleak_still_sep_link"),
      option("На ней та же зелёная машина или очень похожая.", "postleak_still_sep_car")
    ])
  ]),
  B("postleak_still_sep_safe", "private_olivia", "choice:postleak_still_separate:0", [O("Хорошо.")]),
  B("postleak_still_sep_link", "private_olivia", "choice:postleak_still_separate:1", [O("Правильно.")]),
  B("postleak_still_sep_car", "private_olivia", "choice:postleak_still_separate:2", [O("Очень похожа. Но «та же» я пока не скажу.")]),
  B("postleak_still_sep_read", "private_olivia", "after:postleak_still_sep_safe|postleak_still_sep_link|postleak_still_sep_car", [
    O("Я показала кадр Мие. Только снимок, без ссылки."), O("Она тоже узнала похожую машину."), O("И заметила наклейку на заднем стекле."), O("Тут я вспомнила про Тайлера — он постоянно ездит по служебным дорогам.")
  ]),
  B("postleak_tyler_offer", "private_olivia", "after:postleak_still_larks_read|postleak_still_sep_read", [
    O("Можно попросить Тайлера глянуть."), O("Не втягивать его в расследование."), O("Просто такие пропуска он мог видеть."), O("Я сама напишу."), O("Что ему лучше отправить?"),
    choice([
      option("Отправь только вырезку с наклейкой.", "postleak_tyler_crop", { setFlag: "tylerReceivedCroppedStill" }),
      option("Покажи весь кадр, но про телефон Мии не рассказывай.", "postleak_tyler_full", { setFlag: "tylerReceivedFullStill" }),
      option("Сначала спроси его. Не кидай снимок без предупреждения.", "postleak_tyler_ask", { setFlag: "tylerAskedBeforeStill" })
    ])
  ]),
  B("postleak_tyler_crop", "private_olivia", "choice:postleak_tyler_offer:0", [O("Хорошо. Машину целиком показывать не буду.")]),
  B("postleak_tyler_full", "private_olivia", "choice:postleak_tyler_offer:1", [O("Конечно. Только скажу, что снимок про Харпер.")]),
  B("postleak_tyler_ask", "private_olivia", "choice:postleak_tyler_offer:2", [O("Да, так лучше. Сначала объясню, что вообще прошу.")]),
  B("postleak_tyler_ready", "private_olivia", "after:postleak_tyler_crop|postleak_tyler_full|postleak_tyler_ask", [
    O("Написала."), { type: "pause", delay: 1500 }, O("Согласился."), O("Сказал, что лучше сам тебе напишет."),
    { type: "contacts", id: "tyler" }, { type: "system", text: "Тайлер в сети.", delay: 450, characterStatus: { id: "tyler", online: true } }
  ], { unlock: [{ type: "contacts", id: "tyler" }, { type: "chats", id: "private_tyler" }] }),

  B("postleak_tyler_start", "private_tyler", "after:postleak_tyler_ready", [
    T("Привет."), T("Оливия сказала, у тебя кадр с какой-то наклейкой на машине."), T("Она уже прислала."), T("Секунду, увеличу."),
    choice([
      option("Знакомая наклейка?", "postleak_tyler_recognize"),
      option("Там мыло вместо половины кадра. Не торопись.", "postleak_tyler_quality"),
      option("Если не узнаёшь — так и скажи. Не надо угадывать.", "postleak_tyler_honest")
    ])
  ], { identify: ["tyler"] }),
  B("postleak_tyler_recognize", "private_tyler", "choice:postleak_tyler_start:0", [T("Вроде знакомая. Сейчас нормально рассмотрю.")]),
  B("postleak_tyler_quality", "private_tyler", "choice:postleak_tyler_start:1", [T("Вижу. Поэтому и не говорю точно.")]),
  B("postleak_tyler_honest", "private_tyler", "choice:postleak_tyler_start:2", [T("Я не собираюсь угадывать. Подожди.")]),
  B("postleak_tyler_pass", "private_tyler", "after:postleak_tyler_recognize|postleak_tyler_quality|postleak_tyler_honest", [
    T("Похоже на временный пропуск North Yard."), T("Светлый прямоугольник, тёмная полоса сбоку."), T("Наверху обычно буквы N-Y."), T("И здесь будто они. Но кадр паршивый."),
    choice([
      option("North Yard — это что вообще?", "postleak_tyler_what"),
      option("Если по-честному: насколько уверен?", "postleak_tyler_sure"),
      option("А обычная парковочная наклейка так выглядеть не может?", "postleak_tyler_parking")
    ])
  ]),
  B("postleak_tyler_what", "private_tyler", "choice:postleak_tyler_pass:0", [T("Старые склады на севере города."), T("Заезд через дорогу у старой станции.")]),
  B("postleak_tyler_sure", "private_tyler", "choice:postleak_tyler_pass:1", [T("Процентов семьдесят."), T("Половины не видно, так что да — могу ошибиться.")]),
  B("postleak_tyler_parking", "private_tyler", "choice:postleak_tyler_pass:2", [T("Теоретически да."), T("Но форма и полоса очень похожи на пропуск North Yard.")]),
  B("postleak_tyler_limits", "private_tyler", "after:postleak_tyler_what|postleak_tyler_sure|postleak_tyler_parking", [
    T("Их выдают курьерам, техникам, подрядчикам — всем временным."), T("Но эту машину по кадру не найдёшь. Номер пропуска не читается."),
    choice([
      option("Без номера это просто похожая наклейка, да?", "postleak_tyler_no_id"),
      option("Но машина хотя бы могла заезжать в North Yard.", "postleak_tyler_could"),
      option("Не хочу, чтобы все через час уже считали это фактом.", "postleak_tyler_mistake")
    ])
  ]),
  B("postleak_tyler_no_id", "private_tyler", "choice:postleak_tyler_limits:0", [T("По этому кадру — нет.")]),
  B("postleak_tyler_could", "private_tyler", "choice:postleak_tyler_limits:1", [T("Могла. Или водитель просто не снял старую наклейку.")]),
  B("postleak_tyler_mistake", "private_tyler", "choice:postleak_tyler_limits:2", [T("Вот поэтому я и говорю: «похоже». Не «это оно».")]),
  B("postleak_tyler_warning", "private_tyler", "after:postleak_tyler_no_id|postleak_tyler_could|postleak_tyler_mistake", [
    T("И сразу: сами туда не едьте."), T("North Yard наполовину закрыт."), T("Старые пути, склады, охрана."), T("А у станции ограждение местами просто сгнило."),
    choice([
      option("Тайлер, я вообще в другом городе.", "postleak_tyler_city"),
      option("Я не собирался никого туда отправлять.", "postleak_tyler_nobody"),
      option("Ты говоришь это больше для Мии, да?", "postleak_tyler_mia")
    ])
  ]),
  B("postleak_tyler_city", "private_tyler", "choice:postleak_tyler_warning:0", [T("Я знаю. Я говорю про остальных.")]),
  B("postleak_tyler_nobody", "private_tyler", "choice:postleak_tyler_warning:1", [T("Вот и хорошо.")]),
  B("postleak_tyler_mia", "private_tyler", "choice:postleak_tyler_warning:2", [T("В основном. Она может сначала поехать, а потом решить, хорошая ли это была идея.")]),
  B("postleak_tyler_end", "private_tyler", "after:postleak_tyler_city|postleak_tyler_nobody|postleak_tyler_mia", [
    T("Кадр отправьте полиции."), T("Напишите: наклейка может быть от North Yard."), T("Именно «может»."), T("С таким качеством точнее не скажу."),
    choice([
      option("Хорошо. Так и напишем: «может быть».", "postleak_tyler_end_ok"),
      option("Спасибо, что не говоришь «точно», когда не уверен.", "postleak_tyler_end_fact"),
      option("Оливии сам напишешь? Или мне пересказать?", "postleak_tyler_end_olivia")
    ])
  ]),
  B("postleak_tyler_end_ok", "private_tyler", "choice:postleak_tyler_end:0", [T("Вот. Так честно.")]),
  B("postleak_tyler_end_fact", "private_tyler", "choice:postleak_tyler_end:1", [T("А смысл угадывать? Потом все запомнят только то, что я якобы был уверен.")]),
  B("postleak_tyler_end_olivia", "private_tyler", "choice:postleak_tyler_end:2", [T("Сам напишу. Она мне кадр и прислала.")]),
  B("postleak_tyler_reports", "private_tyler", "after:postleak_tyler_end_ok|postleak_tyler_end_fact|postleak_tyler_end_olivia", [
    T("Сейчас напишу Оливии, что смог разобрать."), T("Коротко. Без телефона Мии и остального."), T("Пусть приложит к сообщению следователю."),
    T("Если ещё будет что-то по дорогам или пропускам — кидайте."), T("Но на North Yard сами не суйтесь. Я серьёзно."),
    { type: "system", text: "Тайлер не в сети.", delay: 550, characterStatus: { id: "tyler", online: false } }
  ], { setFlags: { tylerIdentifiedPossibleNorthYardPass: true, tylerReportedFindingToOlivia: true } }),

  B("postleak_olivia_report_larks", "group_larks", "flagsValueAfter:postleak_tyler_reports:larksCreated:true:tylerReportedFindingToOlivia:true", [
    { type: "system", text: "Оливия в сети.", delay: 450, characterStatus: { id: "olivia", online: true } }, O("Тайлер ответил."), O("Говорит, наклейка похожа на временный пропуск North Yard."), M("Это у старой станции?"), O("Рядом. Дорога к складам проходит прямо возле неё."), O("Но он не уверен. Кадр слишком плохой.")
  ]),
  B("postleak_olivia_report_sep", "private_olivia", "flagsValueAfter:postleak_tyler_reports:larksCreated:false:tylerReportedFindingToOlivia:true", [
    { type: "system", text: "Оливия в сети.", delay: 450, characterStatus: { id: "olivia", online: true } }, O("Тайлер ответил."), O("Он тебе уже написал?"),
    choice([
      option("Да. По его словам, это похоже на пропуск North Yard.", "postleak_olivia_sep_same"),
      option("Да. Но сам несколько раз сказал, что может ошибаться.", "postleak_olivia_sep_unsure"),
      option("Да. Он обещал сам переслать тебе вывод.", "postleak_olivia_sep_forward")
    ])
  ]),
  B("postleak_olivia_sep_same", "private_olivia", "choice:postleak_olivia_report_sep:0", [O("Мне он написал то же самое.")]),
  B("postleak_olivia_sep_unsure", "private_olivia", "choice:postleak_olivia_report_sep:1", [O("Да. Он несколько раз это подчеркнул.")]),
  B("postleak_olivia_sep_forward", "private_olivia", "choice:postleak_olivia_report_sep:2", [O("Уже переслал.")]),
  B("postleak_police_send", "private_olivia", "after:postleak_olivia_report_larks|postleak_olivia_sep_same|postleak_olivia_sep_unsure|postleak_olivia_sep_forward", [
    O("Отправляю следователю кадр."), O("И сообщение Тайлера."), O("Добавлю время файла и фото из Larks — пусть сравнят."), O("Но писать, что машина точно была у North Yard, не стану."),
    choice([
      option("Да. Отправляй всё как есть — пусть проверяют.", "postleak_police_check"),
      option("Только подчеркни, что с пропуском Тайлер не уверен.", "postleak_police_not_confirmed"),
      option("И напиши, что седан похож на тот, что был у Larks.", "postleak_police_compare")
    ])
  ]),
  B("postleak_police_check", "private_olivia", "choice:postleak_police_send:0", [O("Хорошо.")]),
  B("postleak_police_not_confirmed", "private_olivia", "choice:postleak_police_send:1", [O("Конечно. Напишу его формулировкой: «похоже, но могу ошибаться».")]),
  B("postleak_police_compare", "private_olivia", "choice:postleak_police_send:2", [O("Добавлю. Именно как возможное совпадение.")]),
  B("postleak_map_update", "private_olivia", "after:postleak_police_check|postleak_police_not_confirmed|postleak_police_compare", [
    O("Всё. Отправила кадр, время файла, фото из Larks и слова Тайлера."), O("Теперь это у тех, кто может проверить нормально."),
    { type: "case_entry", id: "thread_north_yard", entryType: "thread", title: "NORTH YARD — ВОЗМОЖНАЯ СВЯЗЬ", text: "На кадре виден тёмно-зелёный седан со светлой наклейкой. Тайлер считает, что она похожа на временный пропуск North Yard. Номер не читается; машина и место съёмки не подтверждены.", delay: 300 },
    { type: "case_entry", id: "question_old_station", entryType: "question", title: "СТАРАЯ СТАНЦИЯ — НЕ ПОДТВЕРЖДЕНО", text: "Служебная дорога к North Yard проходит рядом со старой железнодорожной станцией.", delay: 300 },
    { type: "system", text: "Карта дела обновлена.", delay: 600 }
  ], { setFlags: { northYardStillSentToPolice: true, northYardAddedToMap: true } }),

  B("postleak_mason", "private_mason", "after:postleak_map_update", [
    { type: "pause", delay: 1800 }, { type: "system", text: "Мейсон в сети.", delay: 450, characterStatus: { id: "mason", online: true } },
    S("Тайлер сказал, у вас всплыл North Yard."), S("Сразу: никто туда не едет."),
    choice([
      option("Мейсон, я вообще в другом городе.", "postleak_mason_city"),
      option("Спокойно. Никто никуда не собирался.", "postleak_mason_nobody"),
      option("Первое личное сообщение от тебя — и сразу запрет.", "postleak_mason_first")
    ])
  ], { identify: ["mason"] }),
  B("postleak_mason_city", "private_mason", "choice:postleak_mason:0", [S("Знаю. Но остальные тебя слушают.")]),
  B("postleak_mason_nobody", "private_mason", "choice:postleak_mason:1", [S("Отлично. Вот и не начинайте.")]),
  B("postleak_mason_first", "private_mason", "choice:postleak_mason:2", [S("Да. Потому что это закрытая территория.")]),
  B("postleak_mason_end", "private_mason", "after:postleak_mason_city|postleak_mason_nobody|postleak_mason_first", [
    S("Кадр уже у полиции?"), S("И ничего не удаляйте. Ни время, ни переписку с Тайлером."), S("Машину сами не ищите."), S("В North Yard не звоните."), S("Вообще не трогайте людей оттуда, ясно?"),
    choice([
      option("Кадр уже у полиции.", "postleak_mason_police"),
      option("Ты правда думаешь, что кто-то из нас туда полезет?", "postleak_mason_climb"),
      option("Ты вообще никому из нас не доверяешь, да?", "postleak_mason_trust")
    ])
  ]),
  B("postleak_mason_police", "private_mason", "choice:postleak_mason_end:0", [S("Хорошо. Тогда ждите. И да, я серьёзно."), { type: "system", text: "Мейсон не в сети.", delay: 550, characterStatus: { id: "mason", online: false } }], { setFlags: { postLeakMasonComplete: true } }),
  B("postleak_mason_climb", "private_mason", "choice:postleak_mason_end:1", [S("После всего с файлом? Да, думаю."), { type: "system", text: "Мейсон не в сети.", delay: 550, characterStatus: { id: "mason", online: false } }], { setFlags: { postLeakMasonComplete: true } }),
  B("postleak_mason_trust", "private_mason", "choice:postleak_mason_end:2", [S("Возле заброшенных путей? Вообще никому."), { type: "system", text: "Мейсон не в сети.", delay: 550, characterStatus: { id: "mason", online: false } }], { setFlags: { postLeakMasonComplete: true } })
];
