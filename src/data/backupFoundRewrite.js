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
      { from: "mia", text: "Он лежал в коробке с проводами.", delay: 850 },
      { from: "mia", text: "Причём прямо сверху.", delay: 700 },
      { from: "mia", text: "Я сначала проверила стол.", delay: 650 },
      { from: "mia", text: "Потом шкаф.", delay: 600 },
      { from: "mia", text: "Потом почему-то кухню.", delay: 750 },
      { from: "olivia", text: "Почему кухню?", delay: 650 },
      { from: "mia", text: "Не знаю.", delay: 550 },
      { from: "mia", text: "Я была в отчаянии.", delay: 750 },
      { type: "choice", options: [
        choice("Главное, что нашла.", "backup_larks_found_ok"),
        choice("Ты его уже включила?", "backup_larks_power"),
        choice("Пожалуйста, скажи, что он хотя бы похож на рабочий.", "backup_larks_condition")
      ] }
    ]
  },
  { id: "backup_larks_found_ok", chat: "group_larks", trigger: "choice:backup_found_larks:0", messages: [
    { from: "mia", text: "Да.", delay: 550 }, { from: "mia", text: "Я уже начала думать, что случайно его выбросила.", delay: 900 }
  ] },
  { id: "backup_larks_power", chat: "group_larks", trigger: "choice:backup_found_larks:1", messages: [
    { from: "mia", text: "Нет.", delay: 550 }, { from: "mia", text: "Даже зарядку не подключала.", delay: 800 }
  ] },
  { id: "backup_larks_condition", chat: "group_larks", trigger: "choice:backup_found_larks:2", messages: [
    { from: "mia", text: "Ну...", delay: 600 }, { from: "mia", text: "Экран треснут.", delay: 600 },
    { from: "mia", text: "Корпус весь поцарапан.", delay: 650 }, { from: "mia", text: "Но он и раньше так выглядел.", delay: 750 }
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
      { from: "mia", text: "Он ответил, чтобы я его не включала и утром привезла в участок.", delay: 1000 },
      { from: "olivia", text: "Тогда не трогай его.", delay: 700 },
      { from: "mia", text: "Не трогаю.", delay: 650 },
      { from: "mia", text: "Но я вспомнила ещё кое-что.", delay: 750 },
      { from: "mia", text: "Когда я ходила с этим телефоном, я делала резервную копию на ноутбук.", delay: 1100 },
      { from: "olivia", text: "Ты уверена, что она сделана после встречи с Харпер?", delay: 950 },
      { from: "mia", text: "Сейчас проверю.", delay: 650 },
      { from: "mia", text: "...", delay: 900 },
      { from: "mia", text: "Да.", delay: 550 },
      { from: "mia", text: "Дата — следующий вечер после нашей встречи у моста.", delay: 950 },
      { from: "mia", text: "Значит, Харпер уже пользовалась телефоном.", delay: 850 },
      { type: "choice", options: [
        choice("Ты сообщила полиции и про копию?", "backup_larks_police_copy"),
        choice("В ней могут остаться удалённые данные.", "backup_larks_deleted_data"),
        choice("Только ничего пока не меняй внутри.", "backup_larks_dont_change")
      ] }
    ]
  },
  { id: "backup_larks_police_copy", chat: "group_larks", trigger: "choice:backup_larks_report:0", messages: [
    { from: "mia", text: "Только что написала.", delay: 700 }, { from: "mia", text: "Пока не ответили.", delay: 700 }
  ] },
  { id: "backup_larks_deleted_data", chat: "group_larks", trigger: "choice:backup_larks_report:1", messages: [
    { from: "olivia", text: "Могут.", delay: 600 }, { from: "olivia", text: "Но могут и не остаться.", delay: 700 },
    { from: "mia", text: "Всё равно нужно проверить.", delay: 750 }
  ] },
  { id: "backup_larks_dont_change", chat: "group_larks", trigger: "choice:backup_larks_report:2", messages: [
    { from: "mia", text: "Да.", delay: 550 }, { from: "mia", text: "Я просто открыла папку и посмотрела дату.", delay: 750 },
    { from: "mia", text: "Больше ничего не трогала.", delay: 650 }
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
        choice("Только не говори, что он всё это время лежал на виду.", "backup_sep_visible"),
        choice("Он включается?", "backup_sep_power")
      ] }
    ]
  },
  { id: "backup_sep_phone", chat: "private_mia", trigger: "choice:backup_found_separate:0", messages: [
    { from: "mia", text: "Да.", delay: 550 }, { from: "mia", text: "Старый.", delay: 550 }
  ] },
  { id: "backup_sep_visible", chat: "private_mia", trigger: "choice:backup_found_separate:1", messages: [
    { from: "mia", text: "Лежал.", delay: 550 }, { from: "mia", text: "Прямо сверху в коробке с проводами.", delay: 800 },
    { from: "mia", text: "Я сначала обыскала всю квартиру.", delay: 850 }
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
      { from: "mia", text: "Он сказал не включать телефон и утром привезти его в участок.", delay: 950 },
      { from: "mia", text: "Так что я даже зарядку не подключала.", delay: 850 },
      { from: "mia", text: "Но у меня на ноутбуке осталась его резервная копия.", delay: 950 },
      { from: "mia", text: "Она сделана на следующий вечер после встречи с Харпер.", delay: 900 },
      { from: "mia", text: "То есть уже после того, как она брала мой телефон.", delay: 900 },
      { from: "mia", text: "Я написала следователю и про копию. Пока не ответили.", delay: 950 }
    ]
  },
  {
    id: "backup_offer_high",
    chat: "private_mia",
    trigger: "afterTrustFlag:backup_larks_police_copy|backup_larks_deleted_data|backup_larks_dont_change|backup_separate_report:miaTrust:2:backupFound:true",
    messages: [
      { from: "mia", text: "Программа открывает копию, но некоторые разделы отображаются странно.", delay: 950 },
      { from: "mia", text: "Я могу дать тебе временный доступ. Только для просмотра.", delay: 950 },
      { from: "mia", text: "Я тебе доверяю.", delay: 650 },
      { from: "mia", text: "Ну... достаточно, чтобы дать доступ.", delay: 750 },
      { from: "mia", text: "Но там остались и мои переписки. Не открывай их, если они не связаны с Харпер.", delay: 1050 },
      { type: "choice", options: [
        choice("Хорошо. Открою только то, что связано с Харпер.", "backup_access_accept", { setFlag: "miaBackupAccessGranted" }),
        choice("Ты точно уверена, что хочешь дать доступ именно мне?", "backup_access_unsure"),
        choice("Лучше не надо. Дождись ответа полиции.", "backup_access_decline", { setFlag: "playerDeclinedBackupAccess" })
      ] }
    ]
  },
  {
    id: "backup_offer_low",
    chat: "private_mia",
    trigger: "afterNotTrustFlag:backup_larks_police_copy|backup_larks_deleted_data|backup_larks_dont_change|backup_separate_report:miaTrust:2:backupFound:true",
    messages: [
      { from: "mia", text: "Программа открывает копию, но некоторые разделы отображаются странно.", delay: 950 },
      { from: "mia", text: "Я могу дать тебе временный доступ. Только к копии и только для просмотра.", delay: 950 },
      { from: "mia", text: "Я даю его не потому, что вдруг начала тебе полностью доверять.", delay: 900 },
      { from: "mia", text: "Просто ты уже в этом участвуешь и можешь заметить то, что я пропущу.", delay: 1000 },
      { from: "mia", text: "Не открывай ничего личного. Я увижу историю доступа.", delay: 900 },
      { type: "choice", options: [
        choice("Хорошо. Открою только то, что связано с Харпер.", "backup_access_accept", { setFlag: "miaBackupAccessGranted" }),
        choice("Ты точно уверена, что хочешь дать доступ именно мне?", "backup_access_unsure"),
        choice("Лучше не надо. Дождись ответа полиции.", "backup_access_decline", { setFlag: "playerDeclinedBackupAccess" })
      ] }
    ]
  },
  {
    id: "backup_access_unsure", chat: "private_mia", trigger: "choice:backup_offer_high:1",
    messages: [
      { from: "mia", text: "Нет. Вообще не уверена.", delay: 700 },
      { from: "mia", text: "Но доступ будет только для просмотра, и я смогу закрыть его в любой момент.", delay: 950 },
      { type: "choice", options: [
        choice("Тогда присылай.", "backup_access_accept", { setFlag: "miaBackupAccessGranted" }),
        choice("Нет. Всё равно лучше подождать.", "backup_access_decline", { setFlag: "playerDeclinedBackupAccess" })
      ] }
    ]
  },
  {
    id: "backup_access_unsure_low", chat: "private_mia", trigger: "choice:backup_offer_low:1",
    messages: [
      { from: "mia", text: "Нет. Вообще не уверена.", delay: 700 },
      { from: "mia", text: "Но доступ будет только для просмотра, и я смогу закрыть его в любой момент.", delay: 950 },
      { type: "choice", options: [
        choice("Тогда присылай.", "backup_access_accept", { setFlag: "miaBackupAccessGranted" }),
        choice("Нет. Всё равно лучше подождать.", "backup_access_decline", { setFlag: "playerDeclinedBackupAccess" })
      ] }
    ]
  },
  {
    id: "backup_access_accept", chat: "private_mia",
    trigger: "after:backup_access_unsure|backup_access_unsure_low",
    setFlags: { miaBackupAccessGranted: true },
    messages: [
      { from: "mia", text: "Хорошо.", delay: 600 },
      { from: "mia", text: "Сейчас придёт ссылка. Она будет работать двадцать минут.", delay: 850 },
      { from: "mia", text: "Ничего скачать или изменить там нельзя.", delay: 750 },
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
      { from: "mia", text: "Ссылка будет работать двадцать минут.", delay: 750 },
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
      { from: "mia", text: "Ссылка будет работать двадцать минут.", delay: 750 },
      { type: "system", text: "Миа отправила временный доступ к резервной копии.", delay: 650 },
      { from: "mia", type: "app", title: "Резервная копия", subtitle: "MIA-OLD · только просмотр", text: "Открыть резервную копию", documentId: "mia_remote_access", delay: 800 }
    ]
  },
  {
    id: "backup_access_decline", chat: "private_mia",
    trigger: "choice:backup_offer_high:2",
    setFlags: { miaBackupAccessGranted: false, playerDeclinedBackupAccess: true },
    messages: [
      { from: "mia", text: "Да. Хорошо.", delay: 650 },
      { from: "mia", text: "Я открыла только список удалённых данных. В чаты не заходила.", delay: 900 },
      { from: "mia", text: "Там есть удалённая переписка. Текст не сохранился, но осталось вложение.", delay: 1000 },
      { from: "mia", type: "app", title: "VID_1842.mp4", subtitle: "Неизвестный чат · 18:46", text: "Локальная копия отсутствует", documentId: "mia_remote_access", delay: 800 },
      { from: "mia", text: "В это время телефон был у Харпер. Я могу переслать ссылку тебе.", delay: 900 },
      { type: "choice", options: [
        choice("Присылай. Я попробую открыть.", "backup_declined_link_sent", { setFlag: "videoLinkSent" }),
        choice("Сначала пришли только данные файла.", "backup_declined_metadata"),
        choice("Нет. Лучше больше ничего не открывать.", "backup_declined_video_refused", { setFlag: "playerRefusedVideo" })
      ] }
    ]
  },
  { id: "backup_access_decline_low", chat: "private_mia", trigger: "choice:backup_offer_low:2", setFlags: { playerDeclinedBackupAccess: true }, messages: [
    { from: "mia", text: "Ладно. Наверное, так правильнее.", delay: 750 },
    { from: "mia", text: "Я открыла только список удалённых данных. Там есть удалённый чат и ссылка на VID_1842.mp4.", delay: 1050 },
    { from: "mia", type: "app", title: "VID_1842.mp4", subtitle: "Неизвестный чат · 18:46", text: "Открыть ссылку", documentId: "mia_remote_access", delay: 800 }
  ] },
  { id: "backup_declined_metadata", chat: "private_mia", trigger: "choice:backup_access_decline:1", messages: [
    { from: "mia", text: "Там почти ничего нет. Имя, время и адрес сервера.", delay: 800 },
    { from: "mia", text: "Сам файл всё равно загружается только по ссылке.", delay: 750 },
    { type: "choice", options: [choice("Ладно. Присылай ссылку.", "backup_declined_link_sent", { setFlag: "videoLinkSent" })] }
  ] },
  { id: "backup_declined_link_sent", chat: "private_mia", trigger: "choice:backup_access_decline:0", setFlags: { videoLinkSent: true }, messages: [
    { from: "mia", text: "Хорошо.", delay: 600 },
    { from: "mia", type: "app", title: "VID_1842.mp4", subtitle: "Источник: внешний сервер", text: "Открыть файл", documentId: "mia_remote_access", delay: 800 }
  ] },
  { id: "backup_declined_link_sent_after_meta", chat: "private_mia", trigger: "choice:backup_declined_metadata:0", setFlags: { videoLinkSent: true }, messages: [
    { from: "mia", type: "app", title: "VID_1842.mp4", subtitle: "Источник: внешний сервер", text: "Открыть файл", documentId: "mia_remote_access", delay: 800 }
  ] },
  { id: "backup_declined_video_refused", chat: "private_mia", trigger: "choice:backup_access_decline:2", setFlags: { playerRefusedVideo: true }, messages: [
    { from: "mia", text: "Да. Наверное.", delay: 650 }, { from: "mia", text: "Тогда сохраню скрин и дождусь полиции.", delay: 800 },
    { type: "pause", delay: 2400 }, { type: "system", text: "Новое вложение от неизвестного отправителя.", delay: 700 },
    { from: "unknown", type: "app", title: "VID_1842.mp4", subtitle: "Неизвестный отправитель", text: "Открыть файл", documentId: "mia_remote_access", delay: 800 },
    { from: "mia", text: "Это не я. Я ничего не отправляла.", delay: 850 }
  ] }
];
