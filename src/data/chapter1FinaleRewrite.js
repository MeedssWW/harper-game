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
    D("Мне написали."), D("Про нашу с Харпер ссору. И про вашу версию со станцией."), D("Сразу говорю: не суйтесь туда."),
    choice([
      option("Никто не собирается туда ехать.", "finale_derek_nobody"),
      option("Почему тебя так волнует именно станция?", "finale_derek_station"),
      option("Ты сейчас слишком уверенно говоришь для человека, который там не был.", "finale_derek_knows")
    ])
  ], { identify: ["derek"] }),
  B("finale_derek_nobody", "private_derek", "choice:finale_derek_confusion:0", [D("Хорошо."), D("Просто не ездите. Серьёзно.")]),
  B("finale_derek_station", "private_derek", "choice:finale_derek_confusion:1", [D("Потому что станция закрыта лет десять. Там всё сыпется."), D("И потому что я там был.")]),
  B("finale_derek_knows", "private_derek", "choice:finale_derek_confusion:2", [D("Да."), D("Потому что я там был.")]),
  B("finale_derek_entrance", "private_derek", "after:finale_derek_nobody|finale_derek_station|finale_derek_knows", [
    choice([
      option("Вот теперь честно: почему тебя так трясёт из-за этой станции?", "finale_derek_not_told"),
      option("Что ты там видел?", "finale_derek_how"),
      option("Дерек, ты явно что-то недоговариваешь.", "finale_derek_what_seen")
    ])
  ]),
  B("finale_derek_not_told", "private_derek", "choice:finale_derek_entrance:0", [D("..."), D("Ладно. Я был рядом.")]),
  B("finale_derek_how", "private_derek", "choice:finale_derek_entrance:1", [D("Не на самой станции."), D("Рядом.")]),
  B("finale_derek_what_seen", "private_derek", "choice:finale_derek_entrance:2", [D("На территории — ничего."), D("Я был рядом.")]),
  B("finale_derek_followed", "private_derek", "after:finale_derek_not_told|finale_derek_how|finale_derek_what_seen", [
    D("Это было не в ночь исчезновения."), D("За три дня до. После её встречи с Мией."),
    choice([
      option("Ты следил за ней?", "finale_derek_follow_yes"),
      option("Ты был возле старого моста?", "finale_derek_bridge"),
      option("Ты всё это время знал, куда она пошла после встречи с Мией?", "finale_derek_knew_way")
    ])
  ]),
  B("finale_derek_follow_yes", "private_derek", "choice:finale_derek_followed:0", [D("Да."), D("Недолго, но да. Следил.")]),
  B("finale_derek_bridge", "private_derek", "choice:finale_derek_followed:1", [D("Не у самого моста. Я держался дальше.")]),
  B("finale_derek_knew_way", "private_derek", "choice:finale_derek_followed:2", [D("Я не знал, куда она пошла. Видел только часть дороги.")]),
  B("finale_derek_story", "private_derek", "after:finale_derek_follow_yes|finale_derek_bridge|finale_derek_knew_way", [
    D("Мы утром поссорились. Она ушла и перестала отвечать."), D("Я накрутил себя, что у неё кто-то есть."), D("И поехал следом."), D("Можешь не говорить. Я знаю, как это звучит."),
    choice([
      option("Звучит так, будто ты ей не доверял.", "finale_derek_distrust"),
      option("Звучит плохо. Но продолжай.", "finale_derek_continue"),
      option("Она знала, что ты за ней едешь?", "finale_derek_did_know")
    ])
  ]),
  B("finale_derek_distrust", "private_derek", "choice:finale_derek_story:0", [D("Не доверял."), D("Тогда мне казалось, что я имею право знать. Не имел.")]),
  B("finale_derek_continue", "private_derek", "choice:finale_derek_story:1", [D("После встречи с Мией Харпер пошла вдоль Риверуока.")]),
  B("finale_derek_did_know", "private_derek", "choice:finale_derek_story:2", [D("Нет. Я держался далеко. Не хотел, чтобы она меня увидела.")]),
  B("finale_derek_sedan", "private_derek", "after:finale_derek_distrust|finale_derek_continue|finale_derek_did_know", [
    D("Когда Миа ушла, Харпер пошла к дороге за мостом. Оттуда можно выйти к станции."), D("У служебного въезда стоял тёмно-зелёный седан."), D("Он медленно проехал мимо неё и встал у ограждения."),
    choice([
      option("Харпер заметила машину?", "finale_derek_harper_saw"),
      option("Ты видел водителя?", "finale_derek_driver"),
      option("Ты видел машину, следил за Харпер — и промолчал полиции?", "finale_derek_silent")
    ])
  ]),
  B("finale_derek_harper_saw", "private_derek", "choice:finale_derek_sedan:0", [D("Да. Замерла на пару секунд."), D("Потом всё равно пошла дальше.")]),
  B("finale_derek_driver", "private_derek", "choice:finale_derek_sedan:1", [D("Нет. Стёкла были тёмные. Номер тоже не запомнил.")]),
  B("finale_derek_silent", "private_derek", "choice:finale_derek_sedan:2", [D("Не сказал."), D("Трус, да. Можешь написать.")]),
  B("finale_derek_returned", "private_derek", "after:finale_derek_harper_saw|finale_derek_driver|finale_derek_silent", [
    D("В машину она не садилась. Просто пошла дальше."), D("А я уехал."), D("В тот вечер она вернулась домой. Через три дня пропала."),
    choice([
      option("Ты видел, что её что-то пугает, и всё равно промолчал.", "finale_derek_blame", { trust: { derekTrust: -1 } }),
      option("Ты больше боялся выглядеть виноватым, чем хотел помочь.", "finale_derek_afraid"),
      option("Я понимаю, почему тебе было стыдно. Но полиции это нужно знать.", "finale_derek_understand", { trust: { derekTrust: 1 } })
    ])
  ]),
  B("finale_derek_blame", "private_derek", "choice:finale_derek_returned:0", [D("Тогда я видел не её страх. Я видел только то, что она мне не отвечает."), D("Мерзко. Знаю.")]),
  B("finale_derek_afraid", "private_derek", "choice:finale_derek_returned:1", [D("Да."), D("Я знал, что первым проверять будут меня. И заткнулся.")]),
  B("finale_derek_understand", "private_derek", "choice:finale_derek_returned:2", [D("Я знаю. Сейчас уже знаю.")]),
  B("finale_derek_report", "private_derek", "after:finale_derek_blame|finale_derek_afraid|finale_derek_understand", [
    D("Полиции я рассказал про ссору."), D("Про слежку и машину — нет."),
    choice([
      option("Позвони им сам. Сейчас.", "finale_derek_reports_self", { trust: { derekTrust: 1 }, setFlag: "derekReportsHimself" }),
      option("Я сохраню этот разговор и передам Оливии. Тебе я уже не доверяю.", "finale_derek_player_reports", { trust: { derekTrust: -1 }, setFlag: "playerReportedDerekStatement" }),
      option("Расскажи всё при Мейсоне. Чтобы потом никто ничего не переврал.", "finale_derek_witness", { setFlag: "derekStatementWitnessed" })
    ])
  ]),
  B("finale_derek_reports_self", "private_derek", "choice:finale_derek_report:0", [D("Ладно."), D("Звоню."), { type: "pause", delay: 1500 }, D("Всё рассказал."), D("Сказали ехать в участок.")]),
  B("finale_derek_player_reports", "private_derek", "choice:finale_derek_report:1", [D("Даже шанса самому сказать не дашь?"), D("Ладно. Я заслужил."), { type: "system", text: "Оливия получила скриншоты признания и передала их следователю.", delay: 700 }]),
  B("finale_derek_witness", "private_derek", "choice:finale_derek_report:2", [D("Мейсон меня ненавидит. Но ладно."), { type: "system", text: "Мейсон присутствовал при звонке Дерека следователю.", delay: 700 }]),
  B("finale_derek_end", "private_derek", "after:finale_derek_reports_self|finale_derek_player_reports|finale_derek_witness", [
    D("Я должен был сказать сразу."), D("И да — я думаю об этом каждую грёбаную минуту."),
    choice([
      option("Я не думаю, что ты хотел, чтобы с ней что-то случилось.", "finale_derek_end_death"),
      option("Сейчас уже важнее, что полиция знает.", "finale_derek_end_police"),
      option("Я не знаю, что о тебе думать.", "finale_derek_end_unsure")
    ])
  ]),
  B("finale_derek_end_death", "private_derek", "choice:finale_derek_end:0", [D("Я хотел только понять, почему она меня избегает."), D("А сделал всё хуже."), D("Мне надо в участок."), { type: "system", text: "Дерек не в сети.", delay: 550, characterStatus: { id: "derek", online: false } }]),
  B("finale_derek_end_police", "private_derek", "choice:finale_derek_end:1", [D("Да. Наверное."), D("Мне нужно ехать в участок."), { type: "system", text: "Дерек не в сети.", delay: 550, characterStatus: { id: "derek", online: false } }]),
  B("finale_derek_end_unsure", "private_derek", "choice:finale_derek_end:2", [D("Нормально. Я сам не знаю."), D("Мне нужно ехать в участок."), { type: "system", text: "Дерек не в сети.", delay: 550, characterStatus: { id: "derek", online: false } }]),

  B("finale_case_update", "private_derek", "after:finale_derek_end_death|finale_derek_end_police|finale_derek_end_unsure", [
    { type: "note_update", appendTo: "harper_intro_summary", title: "Харпер Вэнс", text: "НОВЫЕ ПОКАЗАНИЯ ДЕРЕКА\n\nПОДТВЕРЖДЕНО\n• Дерек передал полиции дополнительные показания.\n• В них упоминаются путь Харпер после моста, служебный въезд и тёмно-зелёный седан.\n\nПОКАЗАНИЯ ДЕРЕКА\n• За три дня до исчезновения он поссорился с Харпер.\n• После её встречи с Мией он поехал за ней.\n• По его словам, Харпер пошла в сторону старой станции.\n• По его словам, у служебного въезда стоял тёмно-зелёный седан.\n• Дерек утверждает, что Харпер заметила машину, а вечером вернулась домой.\n\nПОКА ТОЛЬКО ВЕРСИЯ\n• Это та же машина, что возле Larks и на VID_1842.mp4.\n• Машина следила за Харпер.\n• Видео снято возле North Yard.", delay: 300 },
    { type: "case_entry", id: "police_search_station", entryType: "fact", title: "ПОЛИЦЕЙСКАЯ ПРОВЕРКА", text: "Полиция получила кадр, предположение о пропуске North Yard, показания Дерека и сведения о служебной дороге возле старой станции.", delay: 300 },
    { type: "pause", delay: 8500 },
    { type: "system", text: "Дерек в сети.", delay: 450, characterStatus: { id: "derek", online: true } },
    { type: "pause", delay: 900 }, { type: "system", text: "Дерек не в сети.", delay: 450, characterStatus: { id: "derek", online: false } }
  ], { setFlags: { derekConfessedFollowingHarper: true, greenSedanSeenByDerek: true, derekStatementSentToPolice: true, policeSearchNorthYard: true } }),

  B("finale_found_larks", "group_larks", "flagsValueAfter:finale_case_update:larksCreated:true:policeSearchNorthYard:true", [
    { type: "pause", delay: 6500 }, { type: "system", text: "Оливия в сети.", delay: 450, characterStatus: { id: "olivia", online: true } }, { type: "system", text: "Миа в сети.", delay: 350, characterStatus: { id: "mia", online: true } },
    O("Мне только что позвонил Дерек."), O("Полиция нашла Харпер."), M("где"), O("У старой станции."), M("она жива?"), { type: "pause", delay: 1300 }, O("Нет."), M("нет"), M("подожди"), M("нет пожалуйста"),
    choice([
      option("Мне очень жаль.", "finale_found_larks_sorry"),
      option("Миа, ты сейчас одна?", "finale_found_larks_alone"),
      option("Я не знаю, что сказать.", "finale_found_larks_words")
    ])
  ], { setFlags: { harperFoundDead: true, harperFoundAtOldStation: true } }),
  B("finale_found_larks_sorry", "group_larks", "choice:finale_found_larks:0", [O("Спасибо."), M("я не верю")]),
  B("finale_found_larks_alone", "group_larks", "choice:finale_found_larks:1", [M("да"), M("Бублик рядом"), M("я не знаю зачем я это написала")]),
  B("finale_found_larks_words", "group_larks", "choice:finale_found_larks:2", [O("Не нужно ничего говорить. Я тоже не знаю.")]),
  B("finale_found_larks_end", "group_larks", "after:finale_found_larks_sorry|finale_found_larks_alone|finale_found_larks_words", [
    M("они точно уверены?"), O("Да. Её опознали."), M("я вчера ей писала"), M("знала что она не ответит и всё равно писала"), O("Миа."), M("не надо сейчас"), M("пожалуйста"),
    { type: "system", text: "Миа не в сети.", delay: 500, characterStatus: { id: "mia", online: false } },
    O("Её нашли за ограждением возле станции. Больше мне ничего не сказали."), O("Я позвоню Мие. И Брук ещё не знает."), O("Я позже напишу."),
    { type: "system", text: "Оливия не в сети.", delay: 500, characterStatus: { id: "olivia", online: false } }
  ]),
  B("finale_found_separate", "private_olivia", "flagsValueAfter:finale_case_update:larksCreated:false:policeSearchNorthYard:true", [
    { type: "pause", delay: 6500 }, { type: "system", text: "Оливия в сети.", delay: 450, characterStatus: { id: "olivia", online: true } }, O("Ты здесь?"),
    choice([
      option("Да. Что случилось?", "finale_found_sep_what"),
      option("Я здесь. По твоему сообщению уже понятно, что случилось плохое.", "finale_found_sep_bad"),
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
  B("finale_found_sep_sorry", "private_olivia", "choice:finale_found_sep_end:0", [O("Спасибо."), O("Я поеду к Мие."), O("Брук ещё не знает."), { type: "system", text: "Оливия не в сети.", delay: 500, characterStatus: { id: "olivia", online: false } }]),
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
  B("finale_mia_grief_end", "private_mia", "after:finale_mia_here|finale_mia_silent|finale_mia_call", [M("я всё думаю про мост"), M("она сидела рядом со мной"), M("а я ничего не поняла"), M("Оливия приехала"), M("я потом ладно"), { type: "system", text: "Миа не в сети.", delay: 500, characterStatus: { id: "mia", online: false } }]),
  B("finale_mia_grief_low", "private_olivia", "afterNotTrustFlag:finale_found_larks_end|finale_found_sep_sorry|finale_found_sep_alone|finale_found_sep_words:miaTrust:2:miaPrivacyViolated:false", [
    { type: "pause", delay: 2200 }, { type: "system", text: "Оливия в сети.", delay: 450, characterStatus: { id: "olivia", online: true } }, O("Я добралась до Мии."), O("Она сейчас не хочет ни с кем переписываться."), O("Я останусь с ней.")
  ]),
  B("finale_emotional_pause", "private_unknown", "after:finale_mia_grief_end|finale_mia_grief_low", [
    { type: "pause", delay: 9000 }, { type: "case_entry", id: "harper_found_station", entryType: "fact", title: "СТАРАЯ СТАНЦИЯ — ХАРПЕР НАЙДЕНА", text: "Другие подробности недоступны.", delay: 300 },
    { type: "system", text: "Неизвестный в сети.", delay: 450, characterStatus: { id: "unknown", online: true } }, U("RavenFeed."), U("Открой. Сейчас."),
    choice([
      option("Что там?", "finale_ravenfeed_what"),
      option("После сегодняшнего я не хочу открывать ещё что-то.", "finale_ravenfeed_wary"),
      option("Это связано с Харпер?", "finale_ravenfeed_harper")
    ])
  ]),
  B("finale_ravenfeed_what", "private_unknown", "choice:finale_emotional_pause:0", [U("Пост о тебе.")]),
  B("finale_ravenfeed_wary", "private_unknown", "choice:finale_emotional_pause:1", [U("Не файл."), U("Публичная страница. Но тебе нужно это увидеть.")]),
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
  B("finale_ravenfeed_photo", "private_unknown", "choice:finale_ravenfeed_reaction:0", [U("Значит, фото всё-таки ушло."), U("Я оборвал передачу слишком поздно.")]),
  B("finale_ravenfeed_number", "private_unknown", "choice:finale_ravenfeed_reaction:1", [U("Номер сменишь потом."), U("Сейчас — скрин поста и комментариев.")]),
  B("finale_ravenfeed_frame", "private_unknown", "choice:finale_ravenfeed_reaction:2", [U("Именно."), U("Они не обвиняют. Они оставляют толпе додумать.")]),
  B("finale_ravenfeed_threats", "private_unknown", "after:finale_ravenfeed_photo|finale_ravenfeed_number|finale_ravenfeed_frame", [
    { type: "system", text: "Новые сообщения: «Это ты убил её?» · «Зачем она отправила твой номер?» · «Мы знаем, как ты выглядишь»", delay: 700 },
    choice([
      option("Кто стоит за этой страницей?", "finale_ravenfeed_who"),
      option("Можно удалить публикацию?", "finale_ravenfeed_delete"),
      option("Они ждали, пока Харпер найдут.", "finale_ravenfeed_waited")
    ])
  ]),
  B("finale_ravenfeed_who", "private_unknown", "choice:finale_ravenfeed_threats:0", [U("Не знаю."), U("Аккаунт старый. Следы публикации подчистили.")]),
  B("finale_ravenfeed_delete", "private_unknown", "choice:finale_ravenfeed_threats:1", [U("Можно отправить жалобу. Но копии уже расходятся.")]),
  B("finale_ravenfeed_waited", "private_unknown", "choice:finale_ravenfeed_threats:2", [U("Похоже на то. До этого пост не дал бы нужной реакции.")]),
  B("finale_ravenfeed_end", "private_unknown", "after:finale_ravenfeed_who|finale_ravenfeed_delete|finale_ravenfeed_waited", [
    U("Никому не отвечай. Ссылки не открывай."), U("Сохрани пост, сообщения, историю звонков. Всё."), U("Раньше у них был номер."), U("Теперь есть твоё лицо."),
    choice([
      option("Ты поможешь?", "finale_ravenfeed_help"),
      option("После всего этого ты всё ещё не скажешь, кто ты?", "finale_ravenfeed_identity"),
      option("Я не позволю им сделать меня виноватым.", "finale_ravenfeed_fight")
    ])
  ]),
  B("finale_ravenfeed_help", "private_unknown", "choice:finale_ravenfeed_end:0", [U("Пока могу."), { type: "system", text: "Неизвестный не в сети.", delay: 500, characterStatus: { id: "unknown", online: false } }, { type: "navigate", screen: "chapterEnd", delay: 1000 }]),
  B("finale_ravenfeed_identity", "private_unknown", "choice:finale_ravenfeed_end:1", [U("Нет. Но я не публиковал фотографию."), { type: "system", text: "Неизвестный не в сети.", delay: 500, characterStatus: { id: "unknown", online: false } }, { type: "navigate", screen: "chapterEnd", delay: 1000 }]),
  B("finale_ravenfeed_fight", "private_unknown", "choice:finale_ravenfeed_end:2", [U("Тогда не подари им ошибку."), U("Сначала сохрани всё."), { type: "system", text: "Неизвестный не в сети.", delay: 500, characterStatus: { id: "unknown", online: false } }, { type: "navigate", screen: "chapterEnd", delay: 1000 }])
];
