const choice = (text, next, extra = {}) => ({ text, loyalty: {}, next, ...extra });

export const backupFoundRewriteBeats = [
  {
    id: "backup_found_larks",
    chat: "group_larks",
    trigger: "flagAfter:larksCreated:larks_olivia_goodbye",
    setFlags: { oldPhoneFound: true, oldPhoneStillPoweredOff: true },
    messages: [
      { type: "pause", delay: 4200 },
      { type: "system", text: "Миа в сети.", delay: 500, characterStatus: { id: "mia", online: true } },
      { from: "mia", text: "Нашла.", delay: 700 },
      { from: "olivia", text: "Телефон?", delay: 650 },
      { from: "mia", text: "Да.", delay: 550 },
      { from: "mia", text: "В коробке с проводами.", delay: 850 },
      { from: "mia", text: "Прямо. Сверху.", delay: 700 },
      { from: "mia", text: "Я сначала проверила стол.", delay: 650 },
      { from: "mia", text: "Потом шкаф.", delay: 600 },
      { from: "mia", text: "Потом почему-то кухню.", delay: 750 },
      { from: "olivia", text: "Почему кухню?", delay: 650 },
      { from: "mia", text: "Не знаю 😭", delay: 550 },
      { from: "mia", text: "На каком-то этапе я просто перестала мыслить.", delay: 750 },
      { type: "choice", options: [
        choice("Главное, что нашла.", "backup_larks_found_ok"),
        choice("Ты его уже включила?", "backup_larks_power"),
        choice("Скажи хотя бы, что он не развалился в коробке.", "backup_larks_condition")
      ] }
    ]
  },
  { id: "backup_larks_found_ok", chat: "group_larks", trigger: "choice:backup_found_larks:0", messages: [
    { from: "mia", text: "Да.", delay: 550 }, { from: "mia", text: "Я уже всерьёз думала, что выбросила его и забыла.", delay: 900 }
  ] },
  { id: "backup_larks_power", chat: "group_larks", trigger: "choice:backup_found_larks:1", messages: [
    { from: "mia", text: "Нет.", delay: 550 }, { from: "mia", text: "Даже зарядку не подключала.", delay: 800 }
  ] },
  { id: "backup_larks_condition", chat: "group_larks", trigger: "choice:backup_found_larks:2", messages: [
    { from: "mia", text: "Ну...", delay: 600 }, { from: "mia", text: "Экран треснут.", delay: 600 },
    { from: "mia", text: "Корпус весь в царапинах.", delay: 650 }, { from: "mia", text: "Но, честно, он и раньше выглядел как после войны.", delay: 750 }
  ] },
  {
    id: "backup_larks_report",
    chat: "group_larks",
    trigger: "after:backup_larks_found_ok|backup_larks_power|backup_larks_condition",
    setFlags: { oldPhoneReportedToPolice: true, backupFound: true },
    messages: [
      { type: "system", text: "Миа отправила фотографию старого телефона: экран выключен, в верхнем углу длинная трещина.", delay: 700 },
      { from: "olivia", text: "Ты написала следователю?", delay: 750 },
      { from: "mia", text: "Да.", delay: 550 },
      { from: "mia", text: "Сказал не включать и утром привезти в участок.", delay: 1000 },
      { from: "olivia", text: "Тогда вообще его не трогай.", delay: 700 },
      { from: "mia", text: "Не трогаю. Даже зарядку рядом убрала.", delay: 650 },
      { from: "mia", text: "Но... есть ещё кое-что.", delay: 750 },
      { from: "mia", text: "Когда я с ним ходила, то делала копию на ноутбук.", delay: 1100 },
      { from: "olivia", text: "После встречи с Харпер?", delay: 950 },
      { from: "mia", text: "Сейчас проверю.", delay: 650 },
      { from: "mia", text: "...", delay: 900 },
      { from: "mia", text: "Да.", delay: 550 },
      { from: "mia", text: "Следующий вечер после моста.", delay: 950 },
      { from: "mia", text: "То есть Харпер к тому моменту уже брала телефон.", delay: 850 },
      { type: "choice", options: [
        choice("Ты сообщила полиции и про копию?", "backup_larks_police_copy"),
        choice("Если повезёт, в копии осталось то, что Харпер удалила.", "backup_larks_deleted_data"),
        choice("Только не открывай пока ничего внутри.", "backup_larks_dont_change")
      ] }
    ]
  },
  { id: "backup_larks_police_copy", chat: "group_larks", trigger: "choice:backup_larks_report:0", messages: [
    { from: "mia", text: "Только что написала.", delay: 700 }, { from: "mia", text: "Пока не ответили.", delay: 700 }
  ] },
  { id: "backup_larks_deleted_data", chat: "group_larks", trigger: "choice:backup_larks_report:1", messages: [
    { from: "olivia", text: "Может быть.", delay: 600 }, { from: "olivia", text: "А может, там уже пусто.", delay: 700 },
    { from: "mia", text: "Но теперь я не смогу просто не проверить.", delay: 750 }
  ] },
  { id: "backup_larks_dont_change", chat: "group_larks", trigger: "choice:backup_larks_report:2", messages: [
    { from: "mia", text: "Да.", delay: 550 }, { from: "mia", text: "Я только открыла папку и глянула дату.", delay: 750 },
    { from: "mia", text: "Внутрь не лезла.", delay: 650 }
  ] },
  {
    id: "backup_found_separate",
    chat: "private_mia",
    trigger: "flagAfter:separateChatsRoute:larks_olivia_goodbye",
    setFlags: { oldPhoneFound: true, oldPhoneStillPoweredOff: true, oldPhoneReportedToPolice: true, backupFound: true },
    messages: [
      { type: "pause", delay: 4200 },
      { type: "system", text: "Миа в сети.", delay: 500, characterStatus: { id: "mia", online: true } },
      { from: "mia", text: "Нашла.", delay: 700 },
      { type: "choice", options: [
        choice("Телефон?", "backup_sep_phone"),
        choice("Только не говори, что он всё это время лежал сверху.", "backup_sep_visible"),
        choice("Он включается?", "backup_sep_power")
      ] }
    ]
  },
  { id: "backup_sep_phone", chat: "private_mia", trigger: "choice:backup_found_separate:0", messages: [
    { from: "mia", text: "Да.", delay: 550 }, { from: "mia", text: "Старый.", delay: 550 }
  ] },
  { id: "backup_sep_visible", chat: "private_mia", trigger: "choice:backup_found_separate:1", messages: [
    { from: "mia", text: "Лежал 😐", delay: 550 }, { from: "mia", text: "Сверху. В коробке с проводами.", delay: 800 },
    { from: "mia", text: "А я до этого успела обыскать всю квартиру.", delay: 850 }
  ] },
  { id: "backup_sep_power", chat: "private_mia", trigger: "choice:backup_found_separate:2", messages: [
    { from: "mia", text: "Не знаю.", delay: 550 }, { from: "mia", text: "Я его пока не трогала.", delay: 700 }
  ] },
  {
    id: "backup_separate_report",
    chat: "private_mia",
    trigger: "after:backup_sep_phone|backup_sep_visible|backup_sep_power",
    messages: [
      { type: "system", text: "Миа отправила фотографию старого телефона: экран выключен, в верхнем углу длинная трещина.", delay: 700 },
      { from: "mia", text: "Я уже написала следователю.", delay: 750 },
      { from: "mia", text: "Сказал не включать и утром привезти в участок.", delay: 950 },
      { from: "mia", text: "Так что зарядку я даже не доставала.", delay: 850 },
      { from: "mia", text: "Но на ноутбуке осталась его копия.", delay: 950 },
      { from: "mia", text: "Дата — следующий вечер после встречи с Харпер.", delay: 900 },
      { from: "mia", text: "То есть после того, как телефон был у неё.", delay: 900 },
      { from: "mia", text: "Про копию следователю тоже написала. Пока тишина.", delay: 950 }
    ]
  },
  {
    id: "backup_offer_high",
    chat: "private_mia",
    trigger: "afterTrustFlag:backup_larks_police_copy|backup_larks_deleted_data|backup_larks_dont_change|backup_separate_report:miaTrust:2:backupFound:true",
    messages: [
      { from: "mia", text: "Копия открывается, но половина разделов выглядит криво.", delay: 950 },
      { from: "mia", text: "Я могу кинуть тебе временный доступ. Только посмотреть.", delay: 950 },
      { from: "mia", text: "Я тебе доверяю.", delay: 650 },
      { from: "mia", text: "Ну... настолько, насколько сейчас вообще умею.", delay: 750 },
      { from: "mia", text: "Там могут быть мои переписки. Пожалуйста, не лезь в них, если они не про Харпер.", delay: 1050 },
      { type: "choice", options: [
        choice("Хорошо. Только Харпер — больше ничего не открою.", "backup_access_accept_direct", { setFlag: "miaBackupAccessGranted" }),
        choice("Миа, мы знакомы пару дней. Ты точно хочешь дать доступ мне?", "backup_access_unsure"),
        choice("Нет. Лучше закрой папку и дождись ответа следователя.", "backup_access_decline", { setFlag: "playerDeclinedBackupAccess" })
      ] }
    ]
  },
  {
    id: "backup_offer_low",
    chat: "private_mia",
    trigger: "afterNotTrustFlag:backup_larks_police_copy|backup_larks_deleted_data|backup_larks_dont_change|backup_separate_report:miaTrust:2:backupFound:true",
    messages: [
      { from: "mia", text: "Копия открывается, но половина разделов какая-то кривая.", delay: 950 },
      { from: "mia", text: "Могу дать временный доступ. Посмотреть, не менять.", delay: 950 },
      { from: "mia", text: "И нет, это не значит, что я вдруг тебе полностью доверяю.", delay: 900 },
      { from: "mia", text: "Просто ты уже в это влез. Может, заметишь то, что я пропущу.", delay: 1000 },
      { from: "mia", text: "Личное не открывай. Я потом увижу историю.", delay: 900 },
      { type: "choice", options: [
        choice("Хорошо. Открою только то, что связано с Харпер.", "backup_access_accept_direct_low", { setFlag: "miaBackupAccessGranted" }),
        choice("Ты сама себе сейчас веришь? Почему доступ именно мне?", "backup_access_unsure_low"),
        choice("Нет. Закрой папку и дождись ответа полиции.", "backup_access_decline", { setFlag: "playerDeclinedBackupAccess" })
      ] }
    ]
  },
  {
    id: "backup_access_unsure", chat: "private_mia", trigger: "choice:backup_offer_high:1",
    messages: [
      { from: "mia", text: "Нет. Вообще.", delay: 700 },
      { from: "mia", text: "Но ты сможешь только смотреть. И я в любой момент закрою доступ.", delay: 950 },
      { type: "choice", options: [
        choice("Тогда присылай.", "backup_access_accept", { setFlag: "miaBackupAccessGranted" }),
        choice("Нет. Всё равно закрой всё и подожди.", "backup_access_decline", { setFlag: "playerDeclinedBackupAccess" })
      ] }
    ]
  },
  {
    id: "backup_access_unsure_low", chat: "private_mia", trigger: "choice:backup_offer_low:1",
    messages: [
      { from: "mia", text: "Нет. Вообще.", delay: 700 },
      { from: "mia", text: "Но ты сможешь только смотреть. И я в любой момент закрою доступ.", delay: 950 },
      { type: "choice", options: [
        choice("Тогда присылай.", "backup_access_accept", { setFlag: "miaBackupAccessGranted" }),
        choice("Нет. Всё равно закрой всё и подожди.", "backup_access_decline", { setFlag: "playerDeclinedBackupAccess" })
      ] }
    ]
  },
  {
    id: "backup_access_accept", chat: "private_mia",
    trigger: "after:backup_access_unsure|backup_access_unsure_low",
    setFlags: { miaBackupAccessGranted: true },
    messages: [
      { from: "mia", text: "Хорошо.", delay: 600 },
      { from: "mia", text: "Сейчас придёт ссылка. Через двадцать минут умрёт.", delay: 850 },
      { from: "mia", text: "Скачать или изменить там ничего нельзя.", delay: 750 },
      { type: "system", text: "Миа отправила временный доступ к резервной копии.", delay: 650 },
      { from: "mia", type: "app", title: "Резервная копия", subtitle: "MIA-OLD · только просмотр", text: "Открыть резервную копию", documentId: "mia_remote_access", delay: 800 }
    ]
  },
  {
    id: "backup_access_accept_direct", chat: "private_mia",
    trigger: "choice:backup_offer_high:0",
    setFlags: { miaBackupAccessGranted: true },
    messages: [
      { from: "mia", text: "Спасибо.", delay: 600 },
      { from: "mia", text: "Ссылка проживёт двадцать минут.", delay: 750 },
      { type: "system", text: "Миа отправила временный доступ к резервной копии.", delay: 650 },
      { from: "mia", type: "app", title: "Резервная копия", subtitle: "MIA-OLD · только просмотр", text: "Открыть резервную копию", documentId: "mia_remote_access", delay: 800 }
    ]
  },
  {
    id: "backup_access_accept_direct_low", chat: "private_mia",
    trigger: "choice:backup_offer_low:0",
    setFlags: { miaBackupAccessGranted: true },
    messages: [
      { from: "mia", text: "Хорошо.", delay: 600 },
      { from: "mia", text: "Ссылка проживёт двадцать минут.", delay: 750 },
      { type: "system", text: "Миа отправила временный доступ к резервной копии.", delay: 650 },
      { from: "mia", type: "app", title: "Резервная копия", subtitle: "MIA-OLD · только просмотр", text: "Открыть резервную копию", documentId: "mia_remote_access", delay: 800 }
    ]
  },
  {
    id: "backup_access_decline", chat: "private_mia",
    trigger: "choice:backup_offer_high:2",
    setFlags: { miaBackupAccessGranted: false, playerDeclinedBackupAccess: true },
    messages: [
      { from: "mia", text: "Ладно. Ты прав.", delay: 650 },
      { from: "mia", text: "Я только глянула список удалённого. В чаты не заходила.", delay: 900 },
      { from: "mia", text: "Там одна удалённая переписка. Текста нет, но осталось вложение.", delay: 1000 },
      { from: "mia", type: "app", title: "VID_1842.mp4", subtitle: "Неизвестный чат · 18:46", text: "Локальная копия отсутствует", documentId: "mia_remote_access", delay: 800 },
      { from: "mia", text: "В 18:46 телефон был у Харпер." , delay: 900 },
      { type: "choice", options: [
        choice("Если решим открывать — присылай. Я попробую у себя.", "backup_declined_link_sent", { setFlag: "videoLinkSent" }),
        choice("Сначала пришли только данные файла. Потом решу, открывать ссылку или нет.", "backup_declined_metadata"),
        choice("Нет. Лучше больше ничего не открывать.", "backup_declined_video_refused", { setFlag: "playerRefusedVideo" })
      ] }
    ]
  },
  { id: "backup_declined_metadata", chat: "private_mia", trigger: "choice:backup_access_decline:1", messages: [
    { from: "mia", text: "Там почти пусто. Имя файла, время, адрес сервера.", delay: 800 },
    { from: "mia", text: "Само видео всё равно только по ссылке.", delay: 750 },
    { type: "choice", options: [
      choice("Понял. Тогда присылай ссылку — попробую открыть.", "backup_declined_link_sent_after_meta", { setFlag: "videoLinkSent" }),
      choice("Нет, этих данных хватит. Дождёмся полиции.", "backup_declined_video_refused", { setFlag: "playerRefusedVideo" })
    ] }
  ] },
  { id: "backup_declined_link_sent", chat: "private_mia", trigger: "choice:backup_access_decline:0", setFlags: { videoLinkSent: true }, messages: [
    { from: "mia", text: "Хорошо.", delay: 600 },
    { from: "mia", type: "app", title: "VID_1842.mp4", subtitle: "Источник: внешний сервер", text: "Открыть файл", documentId: "mia_remote_access", delay: 800 }
  ] },
  { id: "backup_declined_link_sent_after_meta", chat: "private_mia", trigger: "choice:backup_declined_metadata:0", setFlags: { videoLinkSent: true }, messages: [
    { from: "mia", text: "Ладно.", delay: 600 },
    { from: "mia", type: "app", title: "VID_1842.mp4", subtitle: "Источник: внешний сервер", text: "Открыть файл", documentId: "mia_remote_access", delay: 800 }
  ] },
  { id: "backup_declined_video_refused", chat: "private_mia", trigger: "choice:backup_access_decline:2", setFlags: { playerRefusedVideo: true }, messages: [
    { from: "mia", text: "Да. Всё, хватит с нас.", delay: 650 }, { from: "mia", text: "Сохраню скрин и дождусь полиции.", delay: 800 },
    { type: "pause", delay: 2400 }, { type: "system", text: "Новое вложение от неизвестного отправителя.", delay: 700 },
    { from: "unknown", type: "app", title: "VID_1842.mp4", subtitle: "Неизвестный отправитель", text: "Открыть файл", documentId: "mia_remote_access", delay: 800 },
    { from: "mia", text: "Это не я.", delay: 850 }
  ] }
];
