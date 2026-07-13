const option = (text, next, extra = {}) => ({ text, loyalty: {}, next, ...extra });
const choice = options => ({ type: "choice", options });
const D = text => ({ from: "derek", text, delay: 780 });
const O = text => ({ from: "olivia", text, delay: 780 });
const M = text => ({ from: "mia", text, delay: 780 });
const U = text => ({ from: "unknown", text, delay: 780 });
const B = (id, chat, trigger, messages, extra = {}) => ({ id, chat, trigger, messages, ...extra });

export const chapter1FinaleRewriteBeats = [
  B("finale_derek_confusion", "private_derek", "flag:derekConversationUnlocked", [
    { type: "pause", delay: 1800 }, { type: "system", text: "Дерек в сети.", delay: 450, characterStatus: { id: "derek", online: true } },
    D("Миа написала мне."), D("Про нашу ссору."), D("И про старую станцию."), D("Не ездите туда."),
    choice([
      option("Никто не собирается туда ехать.", "finale_derek_nobody"),
      option("Почему тебя так волнует именно станция?", "finale_derek_station"),
      option("Ты опять говоришь так, будто знаешь это место лучше нас.", "finale_derek_knows")
    ])
  ], { identify: ["derek"] }),
  B("finale_derek_nobody", "private_derek", "choice:finale_derek_confusion:0", [D("Хорошо. Особенно не лезьте через старый служебный въезд.")]),
  B("finale_derek_station", "private_derek", "choice:finale_derek_confusion:1", [D("Потому что она закрыта. Там опасно."), D("И не надо идти через старый служебный въезд.")]),
  B("finale_derek_knows", "private_derek", "choice:finale_derek_confusion:2", [D("Все местные знают, где она."), D("Только не лезьте через служебный въезд.")]),
  B("finale_derek_entrance", "private_derek", "after:finale_derek_nobody|finale_derek_station|finale_derek_knows", [
    choice([
      option("Никто не говорил тебе про служебный въезд.", "finale_derek_not_told"),
      option("Откуда ты знаешь, через какой въезд туда можно попасть?", "finale_derek_how"),
      option("Дерек. Хватит. Что ты там видел?", "finale_derek_what_seen")
    ])
  ]),
  B("finale_derek_not_told", "private_derek", "choice:finale_derek_entrance:0", [D("Тайлер мог сказать."), D("Ладно. Неважно.")]),
  B("finale_derek_how", "private_derek", "choice:finale_derek_entrance:1", [D("Потому что я был рядом.")]),
  B("finale_derek_what_seen", "private_derek", "choice:finale_derek_entrance:2", [D("Я не был на территории. Только рядом.")]),
  B("finale_derek_followed", "private_derek", "after:finale_derek_not_told|finale_derek_how|finale_derek_what_seen", [
    D("Это было не в ночь, когда Харпер исчезла."), D("За три дня до этого."), D("В тот день, когда она встретилась с Мией."),
    choice([
      option("Ты следил за ней?", "finale_derek_follow_yes"),
      option("Ты был возле старого моста?", "finale_derek_bridge"),
      option("Ты всё это время знал, куда она пошла после встречи с Мией?", "finale_derek_knew_way")
    ])
  ]),
  B("finale_derek_follow_yes", "private_derek", "choice:finale_derek_followed:0", [D("Да. Недолго.")]),
  B("finale_derek_bridge", "private_derek", "choice:finale_derek_followed:1", [D("Не у самого моста. Я держался дальше.")]),
  B("finale_derek_knew_way", "private_derek", "choice:finale_derek_followed:2", [D("Я не знал, куда она пошла. Видел только часть дороги.")]),
  B("finale_derek_story", "private_derek", "after:finale_derek_follow_yes|finale_derek_bridge|finale_derek_knew_way", [
    D("Мы поссорились утром."), D("Она ушла и не отвечала мне."), D("Я решил, что она встречается с кем-то."), D("Поэтому поехал за ней."), D("Да. Я знаю, как это звучит."),
    choice([
      option("Звучит так, будто ты ей не доверял.", "finale_derek_distrust"),
      option("Звучит плохо. Но продолжай.", "finale_derek_continue"),
      option("Она знала, что ты за ней едешь?", "finale_derek_did_know")
    ])
  ]),
  B("finale_derek_distrust", "private_derek", "choice:finale_derek_story:0", [D("Не доверял. В тот момент — нет. Я был зол.")]),
  B("finale_derek_continue", "private_derek", "choice:finale_derek_story:1", [D("После встречи с Мией Харпер пошла вдоль Риверуока.")]),
  B("finale_derek_did_know", "private_derek", "choice:finale_derek_story:2", [D("Нет. Я держался далеко. Не хотел, чтобы она меня увидела.")]),
  B("finale_derek_sedan", "private_derek", "after:finale_derek_distrust|finale_derek_continue|finale_derek_did_know", [
    D("После того как Миа ушла, Харпер пошла к дороге за мостом."), D("Там можно выйти к старой станции."), D("Возле служебного въезда стоял тёмно-зелёный седан."), D("Машина медленно проехала мимо неё и остановилась возле ограждения."),
    choice([
      option("Харпер заметила машину?", "finale_derek_harper_saw"),
      option("Ты видел водителя?", "finale_derek_driver"),
      option("И после всего этого ты ничего не сказал полиции?", "finale_derek_silent")
    ])
  ]),
  B("finale_derek_harper_saw", "private_derek", "choice:finale_derek_sedan:0", [D("Да. Она остановилась и посмотрела на неё. Потом пошла дальше.")]),
  B("finale_derek_driver", "private_derek", "choice:finale_derek_sedan:1", [D("Нет. Стёкла были тёмные. Номер тоже не запомнил.")]),
  B("finale_derek_silent", "private_derek", "choice:finale_derek_sedan:2", [D("Нет. Не сказал.")]),
  B("finale_derek_returned", "private_derek", "after:finale_derek_harper_saw|finale_derek_driver|finale_derek_silent", [
    D("Я не видел, чтобы она садилась в машину."), D("Она просто прошла дальше. Я уехал."), D("Вечером она вернулась домой."), D("А через три дня исчезла."),
    choice([
      option("Ты видел, что её что-то пугает, и всё равно промолчал.", "finale_derek_blame", { trust: { derekTrust: -1 } }),
      option("Ты больше боялся выглядеть виноватым, чем хотел помочь.", "finale_derek_afraid"),
      option("Я понимаю, почему тебе было стыдно. Но полиции это нужно знать.", "finale_derek_understand", { trust: { derekTrust: 1 } })
    ])
  ]),
  B("finale_derek_blame", "private_derek", "choice:finale_derek_returned:0", [D("Тогда я думал только о том, с кем она встречается."), D("Да. Это было отвратительно.")]),
  B("finale_derek_afraid", "private_derek", "choice:finale_derek_returned:1", [D("Да. Наверное."), D("Если бы я рассказал, первым делом начали бы проверять меня.")]),
  B("finale_derek_understand", "private_derek", "choice:finale_derek_returned:2", [D("Я знаю. Сейчас уже знаю.")]),
  B("finale_derek_report", "private_derek", "after:finale_derek_blame|finale_derek_afraid|finale_derek_understand", [
    D("Я сказал полиции про ссору."), D("Но не сказал, что ехал за ней. И про машину не сказал."),
    choice([
      option("Позвони им сам. Сейчас.", "finale_derek_reports_self", { trust: { derekTrust: 1 }, setFlag: "derekReportsHimself" }),
      option("Я передам это Оливии, и она отправит следователю.", "finale_derek_player_reports", { trust: { derekTrust: -1 }, setFlag: "playerReportedDerekStatement" }),
      option("Расскажи всё при Мейсоне. Чтобы потом никто ничего не переврал.", "finale_derek_witness", { setFlag: "derekStatementWitnessed" })
    ])
  ]),
  B("finale_derek_reports_self", "private_derek", "choice:finale_derek_report:0", [D("Ладно. Я позвоню."), { type: "pause", delay: 1500 }, D("Я сказал. Про слежку, дорогу и машину."), D("Они попросили приехать в участок.")]),
  B("finale_derek_player_reports", "private_derek", "choice:finale_derek_report:1", [D("Даже не дашь мне самому сказать?"), D("Ладно. Делай что хочешь."), { type: "system", text: "Оливия получила скриншоты признания и передала их следователю.", delay: 700 }]),
  B("finale_derek_witness", "private_derek", "choice:finale_derek_report:2", [D("Мейсон меня ненавидит. Но ладно."), { type: "system", text: "Мейсон присутствовал при звонке Дерека следователю.", delay: 700 }]),
  B("finale_derek_end", "private_derek", "after:finale_derek_reports_self|finale_derek_player_reports|finale_derek_witness", [
    D("Я должен был сказать раньше."), D("Только не делай вид, что я не думаю об этом каждую минуту."),
    choice([
      option("Я не думаю, что ты хотел её смерти.", "finale_derek_end_death"),
      option("Сейчас уже важнее, что полиция знает.", "finale_derek_end_police"),
      option("Я не знаю, что о тебе думать.", "finale_derek_end_unsure")
    ])
  ]),
  B("finale_derek_end_death", "private_derek", "choice:finale_derek_end:0", [D("Конечно не хотел. Я просто хотел понять, почему она меня избегает."), D("Мне нужно ехать в участок."), { type: "system", text: "Дерек не в сети.", delay: 550, characterStatus: { id: "derek", online: false } }]),
  B("finale_derek_end_police", "private_derek", "choice:finale_derek_end:1", [D("Да. Наверное."), D("Мне нужно ехать в участок."), { type: "system", text: "Дерек не в сети.", delay: 550, characterStatus: { id: "derek", online: false } }]),
  B("finale_derek_end_unsure", "private_derek", "choice:finale_derek_end:2", [D("Нормально. Я сам не знаю."), D("Мне нужно ехать в участок."), { type: "system", text: "Дерек не в сети.", delay: 550, characterStatus: { id: "derek", online: false } }]),

  B("finale_case_update", "private_derek", "after:finale_derek_end_death|finale_derek_end_police|finale_derek_end_unsure", [
    { type: "note_update", appendTo: "harper_intro_summary", title: "Харпер Вэнс", text: "НОВЫЕ ПОКАЗАНИЯ ДЕРЕКА\n\nПОДТВЕРЖДЕНО\n• За три дня до исчезновения Харпер поссорилась с Дереком.\n• Дерек следил за ней после встречи с Мией.\n• Харпер пошла в сторону старой станции.\n• Дерек видел у служебного въезда тёмно-зелёный седан.\n• Харпер заметила машину.\n• В тот же вечер она вернулась домой.\n• Показания переданы полиции.\n\nНЕ ПОДТВЕРЖДЕНО\n• Это та же машина, что возле Larks и на VID_1842.mp4.\n• Машина следила за Харпер.\n• Видео снято возле North Yard.", delay: 300 },
    { type: "case_entry", id: "police_search_station", entryType: "fact", title: "ПОЛИЦЕЙСКАЯ ПРОВЕРКА", text: "Полиция получила кадр, предположение о пропуске North Yard, показания Дерека и сведения о служебной дороге возле старой станции.", delay: 300 },
    { type: "pause", delay: 8500 },
    { type: "system", text: "Дерек в сети.", delay: 450, characterStatus: { id: "derek", online: true } },
    { type: "pause", delay: 900 }, { type: "system", text: "Дерек не в сети.", delay: 450, characterStatus: { id: "derek", online: false } }
  ], { setFlags: { derekConfessedFollowingHarper: true, greenSedanSeenByDerek: true, derekStatementSentToPolice: true, policeSearchNorthYard: true } }),

  B("finale_found_larks", "group_larks", "flagsValueAfter:finale_case_update:larksCreated:true:policeSearchNorthYard:true", [
    { type: "pause", delay: 6500 }, { type: "system", text: "Оливия в сети.", delay: 450, characterStatus: { id: "olivia", online: true } },
    O("Дерек только что позвонил."), O("Полиция нашла Харпер."), M("Где?"), O("Возле старой станции."), M("Она жива?"), { type: "pause", delay: 1300 }, O("Нет."), M("нет"), M("подожди"), M("нет"),
    choice([
      option("Мне очень жаль.", "finale_found_larks_sorry"),
      option("Миа, ты сейчас одна?", "finale_found_larks_alone"),
      option("Я не знаю, что сказать.", "finale_found_larks_words")
    ])
  ], { setFlags: { harperFoundDead: true, harperFoundAtOldStation: true } }),
  B("finale_found_larks_sorry", "group_larks", "choice:finale_found_larks:0", [O("Да. Мне тоже."), M("я не верю")]),
  B("finale_found_larks_alone", "group_larks", "choice:finale_found_larks:1", [M("да"), M("Бублик рядом"), M("я не знаю зачем я это написала")]),
  B("finale_found_larks_words", "group_larks", "choice:finale_found_larks:2", [O("Не нужно ничего говорить. Я тоже не знаю.")]),
  B("finale_found_larks_end", "group_larks", "after:finale_found_larks_sorry|finale_found_larks_alone|finale_found_larks_words", [
    M("они точно уверены?"), O("Да. Дерек сказал, что её опознали."), M("я вчера ей писала"), M("хотя знала что она не ответит"), O("Миа."), M("не надо"), M("пожалуйста"),
    { type: "system", text: "Миа не в сети.", delay: 500, characterStatus: { id: "mia", online: false } },
    O("Полиция нашла её за ограждением возле старой станции. Больше подробностей нет."), O("Мне нужно написать Брук и позвонить Мие."), O("Я напишу позже."),
    { type: "system", text: "Оливия не в сети.", delay: 500, characterStatus: { id: "olivia", online: false } }
  ]),
  B("finale_found_separate", "private_olivia", "flagsValueAfter:finale_case_update:larksCreated:false:policeSearchNorthYard:true", [
    { type: "pause", delay: 6500 }, { type: "system", text: "Оливия в сети.", delay: 450, characterStatus: { id: "olivia", online: true } }, O("Ты здесь?"),
    choice([
      option("Да. Что случилось?", "finale_found_sep_what"),
      option("По сообщению уже понимаю, что что-то плохое.", "finale_found_sep_bad"),
      option("Я здесь.", "finale_found_sep_here")
    ])
  ], { setFlags: { harperFoundDead: true, harperFoundAtOldStation: true } }),
  B("finale_found_sep_what", "private_olivia", "choice:finale_found_separate:0", [O("Дерек только что позвонил.")]),
  B("finale_found_sep_bad", "private_olivia", "choice:finale_found_separate:1", [O("Да. Полиция нашла Харпер.")]),
  B("finale_found_sep_here", "private_olivia", "choice:finale_found_separate:2", [O("Полиция нашла Харпер.")]),
  B("finale_found_sep_end", "private_olivia", "after:finale_found_sep_what|finale_found_sep_bad|finale_found_sep_here", [
    O("Возле старой станции."), { type: "pause", delay: 1200 }, O("Она погибла."),
    choice([
      option("Мне очень жаль.", "finale_found_sep_sorry"),
      option("Ты сейчас одна?", "finale_found_sep_alone"),
      option("Чёрт... Я не знаю, что сказать.", "finale_found_sep_words")
    ])
  ]),
  B("finale_found_sep_sorry", "private_olivia", "choice:finale_found_sep_end:0", [O("Да. Спасибо."), O("Я собираюсь поехать к Мие."), O("Мне ещё нужно сообщить Брук."), { type: "system", text: "Оливия не в сети.", delay: 500, characterStatus: { id: "olivia", online: false } }]),
  B("finale_found_sep_alone", "private_olivia", "choice:finale_found_sep_end:1", [O("Да. Я собираюсь поехать к Мие."), O("Мне ещё нужно сообщить Брук."), { type: "system", text: "Оливия не в сети.", delay: 500, characterStatus: { id: "olivia", online: false } }]),
  B("finale_found_sep_words", "private_olivia", "choice:finale_found_sep_end:2", [O("Не нужно ничего придумывать. Я тоже не знаю."), O("Я поеду к Мие и сообщу Брук."), { type: "system", text: "Оливия не в сети.", delay: 500, characterStatus: { id: "olivia", online: false } }]),

  B("finale_mia_grief_high", "private_mia", "afterTrustFlag:finale_found_larks_end|finale_found_sep_sorry|finale_found_sep_alone|finale_found_sep_words:miaTrust:2:miaPrivacyViolated:false", [
    { type: "pause", delay: 2200 }, { type: "system", text: "Миа в сети.", delay: 450, characterStatus: { id: "mia", online: true } }, M("я не хочу сейчас быть одна"),
    choice([
      option("Я здесь.", "finale_mia_here"),
      option("Можем вообще ничего не говорить.", "finale_mia_silent"),
      option("Позвони Оливии. Она собирается к тебе.", "finale_mia_call")
    ])
  ]),
  B("finale_mia_here", "private_mia", "choice:finale_mia_grief_high:0", [M("хорошо"), M("просто не уходи пока")]),
  B("finale_mia_silent", "private_mia", "choice:finale_mia_grief_high:1", [M("да"), M("так лучше")]),
  B("finale_mia_call", "private_mia", "choice:finale_mia_grief_high:2", [M("знаю"), M("она написала")]),
  B("finale_mia_grief_end", "private_mia", "after:finale_mia_here|finale_mia_silent|finale_mia_call", [M("я всё думаю про мост"), M("что она сидела рядом"), M("а я вообще не поняла"), M("Оливия приехала"), M("я потом напишу"), { type: "system", text: "Миа не в сети.", delay: 500, characterStatus: { id: "mia", online: false } }]),
  B("finale_mia_grief_low", "private_olivia", "afterNotTrustFlag:finale_found_larks_end|finale_found_sep_sorry|finale_found_sep_alone|finale_found_sep_words:miaTrust:2:miaPrivacyViolated:false", [
    { type: "pause", delay: 2200 }, O("Я добралась до Мии."), O("Она сейчас не хочет ни с кем переписываться."), O("Я останусь с ней.")
  ]),
  B("finale_emotional_pause", "private_unknown", "after:finale_mia_grief_end|finale_mia_grief_low", [
    { type: "pause", delay: 9000 }, { type: "case_entry", id: "harper_found_station", entryType: "fact", title: "СТАРАЯ СТАНЦИЯ — ХАРПЕР НАЙДЕНА", text: "Другие подробности недоступны.", delay: 300 },
    { type: "system", text: "Неизвестный в сети.", delay: 450, characterStatus: { id: "unknown", online: true } }, U("Открой RavenFeed."), U("Сейчас."),
    choice([
      option("Что там?", "finale_ravenfeed_what"),
      option("После сегодняшнего я не хочу открывать ещё что-то.", "finale_ravenfeed_wary"),
      option("Это связано с Харпер?", "finale_ravenfeed_harper")
    ])
  ]),
  B("finale_ravenfeed_what", "private_unknown", "choice:finale_emotional_pause:0", [U("Пост о тебе.")]),
  B("finale_ravenfeed_wary", "private_unknown", "choice:finale_emotional_pause:1", [U("Это не файл. Обычная публичная страница.")]),
  B("finale_ravenfeed_harper", "private_unknown", "choice:finale_emotional_pause:2", [U("Да. И с фотографией, которую сделали во время атаки.")]),
  B("finale_ravenfeed_open", "private_unknown", "after:finale_ravenfeed_what|finale_ravenfeed_wary|finale_ravenfeed_harper", [
    choice([option("Открыть RavenFeed.", "finale_ravenfeed_wait", { sendMessage: false })])
  ], { setFlags: { act1ViralPost: true } }),
  B("finale_ravenfeed_wait", "private_unknown", "choice:finale_ravenfeed_open:0", [{ type: "navigate", screen: "browser", delay: 300 }]),
  B("finale_ravenfeed_reaction", "private_unknown", "flag:ravenwatchPostPublished", [
    choice([
      option("Это фото сделали во время взлома.", "finale_ravenfeed_photo"),
      option("Они выложили мой номер.", "finale_ravenfeed_number"),
      option("Они пытаются сделать вид, будто я знал Харпер.", "finale_ravenfeed_frame")
    ])
  ]),
  B("finale_ravenfeed_photo", "private_unknown", "choice:finale_ravenfeed_reaction:0", [U("Значит, передача всё-таки успела завершиться. Не вся. Но фотография ушла.")]),
  B("finale_ravenfeed_number", "private_unknown", "choice:finale_ravenfeed_reaction:1", [U("Смени номер позже. Сейчас сохрани публикацию и комментарии.")]),
  B("finale_ravenfeed_frame", "private_unknown", "choice:finale_ravenfeed_reaction:2", [U("Да. Не обвиняют прямо. Подталкивают остальных сделать вывод самим.")]),
  B("finale_ravenfeed_threats", "private_unknown", "after:finale_ravenfeed_photo|finale_ravenfeed_number|finale_ravenfeed_frame", [
    { type: "system", text: "Новые сообщения: «Это ты убил её?» · «Зачем она отправила твой номер?» · «Мы знаем, как ты выглядишь»", delay: 700 },
    choice([
      option("Кто стоит за этой страницей?", "finale_ravenfeed_who"),
      option("Можно удалить публикацию?", "finale_ravenfeed_delete"),
      option("Они ждали, пока Харпер найдут.", "finale_ravenfeed_waited")
    ])
  ]),
  B("finale_ravenfeed_who", "private_unknown", "choice:finale_ravenfeed_threats:0", [U("Пока не знаю. Аккаунт старый, но данные публикации скрыты.")]),
  B("finale_ravenfeed_delete", "private_unknown", "choice:finale_ravenfeed_threats:1", [U("Можно отправить жалобу. Но копии уже расходятся.")]),
  B("finale_ravenfeed_waited", "private_unknown", "choice:finale_ravenfeed_threats:2", [U("Похоже на то. До этого пост не дал бы нужной реакции.")]),
  B("finale_ravenfeed_end", "private_unknown", "after:finale_ravenfeed_who|finale_ravenfeed_delete|finale_ravenfeed_waited", [
    U("Не отвечай незнакомым людям. Не переходи по ссылкам. Сохрани всё."), U("Теперь ты не просто номер. У них есть лицо."), U("Не удаляй чаты, файл фотографии и историю звонков."), U("Тебе понадобится доказать, когда и как всё появилось."),
    choice([
      option("Ты поможешь?", "finale_ravenfeed_help"),
      option("После всего этого ты всё ещё не скажешь, кто ты?", "finale_ravenfeed_identity"),
      option("Я не позволю им сделать меня виноватым.", "finale_ravenfeed_fight")
    ])
  ]),
  B("finale_ravenfeed_help", "private_unknown", "choice:finale_ravenfeed_end:0", [U("Пока могу."), { type: "system", text: "Неизвестный не в сети.", delay: 500, characterStatus: { id: "unknown", online: false } }, { type: "navigate", screen: "chapterEnd", delay: 1000 }]),
  B("finale_ravenfeed_identity", "private_unknown", "choice:finale_ravenfeed_end:1", [U("Нет. Но я не публиковал фотографию."), { type: "system", text: "Неизвестный не в сети.", delay: 500, characterStatus: { id: "unknown", online: false } }, { type: "navigate", screen: "chapterEnd", delay: 1000 }]),
  B("finale_ravenfeed_fight", "private_unknown", "choice:finale_ravenfeed_end:2", [U("Тогда ничего не делай на эмоциях. Сначала сохрани доказательства."), { type: "system", text: "Неизвестный не в сети.", delay: 500, characterStatus: { id: "unknown", online: false } }, { type: "navigate", screen: "chapterEnd", delay: 1000 }])
];
