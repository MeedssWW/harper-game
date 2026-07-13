const M = (text, delay = 900) => ({ from: "mia", text, delay });
const O = (text, delay = 900) => ({ from: "olivia", text, delay });
const N = (text, delay = 700) => ({ from: "narrator", text, delay });
const C = (options) => ({ type: "choice", options });
const option = (text, next, trust = null) => ({ text, loyalty: {}, ...(trust ? { trust } : {}), next });
const B = (id, chat, trigger, messages, extra = {}) => ({ id, chat, trigger, ...extra, messages });
const image = { from: "olivia", type: "image", src: "src/assets/harper_photos/harper_larks_inside_olivia.jpg?v=118", caption: "Larks · четыре дня до исчезновения", delay: 900 };
const mapDocument = (from) => ({ from, type: "document", title: "Открыть карту", subtitle: "Larks · Riverwalk", text: "Две подтверждённые точки", documentId: "ravenwood_map", delay: 900 });

export const postOliviaRoutesRewriteBeats = [
  B("larks_group_start", "group_larks", "after:morning_olivia_larks_group", [
    N("Оливия создала группу «Larks»."), N("Оливия добавила Мию и {player}."),
    { type: "system", text: "Миа в сети.", delay: 700, characterStatus: { id: "mia", online: true } },
    M("Я здесь."), M("Оливия сказала, что нашла фотографию."), M("И что в этот раз в чате не будет ещё пяти человек."),
    O("Не будет."), M("Уже хорошо."),
    C([
      option("Привет ещё раз.", "larks_intro_hello"),
      option("Надеюсь, этот чат проживёт дольше прошлого.", "larks_intro_survive"),
      option("Главное, чтобы никто не начал кричать через две минуты.", "larks_intro_shout")
    ])
  ], { identify: ["mia", "olivia"] }),
  B("larks_intro_hello", "group_larks", "choice:larks_group_start:0", [M("Привет."), M("Уже гораздо спокойнее, чем в первый раз.")]),
  B("larks_intro_survive", "group_larks", "choice:larks_group_start:1", [M("Планка не очень высокая."), O("Постараемся её преодолеть.")]),
  B("larks_intro_shout", "group_larks", "choice:larks_group_start:2", [M("Я могу начать через три."), O("Миа."), M("Ладно."), M("Не буду.")]),

  B("larks_photo_context", "group_larks", "after:larks_intro_hello|larks_intro_survive|larks_intro_shout", [
    O("Я коротко объясню."), O("Фотография сделана в Larks."), O("За четыре дня до исчезновения Харпер."),
    O("Я нашла её в нашей старой переписке."), O("Следователю уже отправила."), M("Покажи."),
    N("Оливия отправила фотографию."), image,
    M("Она опять пьёт твой кофе?"), O("Да."), M("Тогда это точно Харпер."), O("Миа."),
    M("Я просто пытаюсь не думать сразу о плохом."), M("Но да."), M("Она явно смотрит куда-то на улицу."),
    O("В тот день она несколько раз отвлекалась."), O("Тогда я решила, что она просто задумалась."),
    C([
      option("Может, она смотрела на машину.", "larks_photo_car"),
      option("Рядом с машиной кто-то стоит.", "larks_photo_person"),
      option("На фото она выглядит напряжённой.", "larks_photo_tense")
    ])
  ]),
  B("larks_photo_car", "group_larks", "choice:larks_photo_context:0", [O("Может быть."), O("Но по фотографии точно не понять.")]),
  B("larks_photo_person", "group_larks", "choice:larks_photo_context:1", [M("Вижу."), M("Но там вообще ничего не разобрать."), O("Это мог быть обычный прохожий.")]),
  B("larks_photo_tense", "group_larks", "choice:larks_photo_context:2", [M("Мне тоже так кажется."), M("У неё был такой взгляд, когда она делала вид, что всё нормально."), O("Тогда я этого не заметила.")]),

  B("larks_sedan_reveal", "group_larks", "after:larks_photo_car|larks_photo_person|larks_photo_tense", [
    O("Я не хочу сразу решать, что на снимке обязательно есть улика."), O("Машина могла просто стоять возле кафе."),
    O("А Харпер могла смотреть вообще не на неё."), M("Подождите."), M("Эта машина тёмно-зелёная."), O("Да."),
    M("Харпер спрашивала меня про такую."), O("Когда?"), M("На следующий день."), M("Когда мы встретились у старого моста."),
    O("Она спросила именно про тёмно-зелёную машину?"), M("Да."), M("Спросила, не видела ли я рядом тёмно-зелёный седан."),
    M("Я тогда ещё подумала, что вопрос какой-то странный."),
    C([
      option("Она объяснила, почему спрашивает?", "larks_sedan_why"),
      option("Ты тогда видела машину?", "larks_sedan_seen"),
      option("Тебя сейчас саму это пугает?", "larks_sedan_scared")
    ])
  ]),
  B("larks_sedan_why", "group_larks", "choice:larks_sedan_reveal:0", [M("Нет."), M("Сказала, что вроде уже видела похожую."), M("А потом сразу сменила тему.")]),
  B("larks_sedan_seen", "group_larks", "choice:larks_sedan_reveal:1", [M("Нет."), M("Я посмотрела вокруг."), M("Ничего похожего уже не было.")]),
  B("larks_sedan_scared", "group_larks", "choice:larks_sedan_reveal:2", [M("Да."), M("До фотографии это был просто один странный вопрос."), M("А теперь возле Larks стоит машина такого же цвета.")]),

  B("larks_bridge_story", "group_larks", "after:larks_sedan_why|larks_sedan_seen|larks_sedan_scared", [
    O("Расскажи про встречу с самого начала."), M("Мы встретились у Риверуока."), M("Возле старого моста."),
    M("Харпер сама предложила туда прийти."), M("Когда я пришла, она уже была там."), M("И всё время смотрела по сторонам."),
    O("Она сказала, что случилось?"), M("Нет."), M("Я спросила, почему она такая дёрганая."), M("Она сказала, что просто устала."),
    M("Потом спросила про машину."), M("И ещё сказала, что пока не хочет идти домой."),
    C([
      option("Она сказала почему?", "larks_bridge_why_home"),
      option("Может, она кого-то ждала?", "larks_bridge_waiting"),
      option("Похоже, она хотела тебе что-то рассказать.", "larks_bridge_tell")
    ])
  ]),
  B("larks_bridge_why_home", "group_larks", "choice:larks_bridge_story:0", [M("Нет."), M("Я подумала, что она опять поругалась с Дереком."), M("Но спрашивать прямо не стала.")]),
  B("larks_bridge_waiting", "group_larks", "choice:larks_bridge_story:1", [M("Не похоже."), M("Она почти не смотрела в телефон."), M("Скорее следила за тем, что происходит вокруг.")]),
  B("larks_bridge_tell", "group_larks", "choice:larks_bridge_story:2", [M("Может быть."), M("Она несколько раз начинала что-то говорить."), M("А потом говорила: «Забей»."), M("Я не стала давить.")]),

  B("larks_police_omission", "group_larks", "after:larks_bridge_why_home|larks_bridge_waiting|larks_bridge_tell", [
    O("Ты рассказывала полиции про встречу у моста?"), M("Да."), M("Сказала, где мы были и примерно во сколько разошлись."),
    M("Но про машину не сказала."), O("Почему?"), M("Потому что вообще про неё не вспомнила."),
    M("Тогда это был один вопрос посреди обычного разговора."), M("Я даже не знала, что Харпер до этого говорила тебе про слежку."),
    C([
      option("Тогда это и правда могло показаться мелочью.", "larks_police_understand", { miaTrust: 1 }),
      option("Главное, что ты вспомнила сейчас.", "larks_police_now"),
      option("Такие вещи всё равно стоило рассказать.", "larks_police_should", { miaTrust: -1 })
    ])
  ]),
  B("larks_police_understand", "group_larks", "choice:larks_police_omission:0", [M("Да."), M("Я не пыталась ничего скрыть."), M("Просто вообще не связала это с исчезновением.")]),
  B("larks_police_now", "group_larks", "choice:larks_police_omission:1", [M("Наверное."), M("Всё равно неприятно, что только сейчас.")]),
  B("larks_police_should", "group_larks", "choice:larks_police_omission:2", [M("Я понимаю."), M("Но тогда я не перебирала в голове каждое слово Харпер."), M("Я не знала, что это станет важным.")]),

  B("larks_investigator_sent", "group_larks", "after:larks_police_understand|larks_police_now|larks_police_should", [
    M("Я сейчас напишу следователю."), M("Пока опять что-нибудь не вылетело из головы."), O("Напиши её точные слова."),
    O("Не только про цвет машины."), M("Да."), M("Уже пишу."), M("..."), M("Отправила."), O("Хорошо."),
    M("Подожди."), M("Ты сказала, что Харпер говорила тебе про слежку?"), O("Да."),
    O("В тот день в Larks она сказала, что ей иногда кажется, будто кто-то идёт за ней."), M("И ты мне не рассказывала?"),
    O("Я рассказала полиции."), O("Но Харпер никого конкретного не называла."), O("И сама сразу сказала, что, наверное, накручивает себя."),
    M("А про машину?"), O("Цвет или модель она не называла."), O("Сказала только, что иногда замечает рядом одних и тех же людей."),
    O("Или одну и ту же машину."), O("Но она сама не была уверена."),
    C([
      option("Получается, похожее случилось два раза.", "larks_twice"),
      option("Вы просто не знали, что она говорила каждой из вас.", "larks_didnt_know"),
      option("Если честно, мне уже не по себе.", "larks_uneasy")
    ])
  ]),
  B("larks_twice", "group_larks", "choice:larks_investigator_sent:0", [O("Похожие вещи случились два раза."), O("Но мы пока не знаем, связаны ли они.")]),
  B("larks_didnt_know", "group_larks", "choice:larks_investigator_sent:1", [M("Да."), M("Если бы я знала про разговор в Larks, я бы раньше вспомнила про машину."), O("А я не знала, что на следующий день она снова об этом заговорила.")]),
  B("larks_uneasy", "group_larks", "choice:larks_investigator_sent:2", [M("Мне тоже."), M("Особенно потому, что нам обеим она сказала, что всё нормально."), O("Понимаю."), O("Но давайте всё равно не будем решать, что за ней точно следили.")]),

  B("larks_known_summary", "group_larks", "after:larks_twice|larks_didnt_know|larks_uneasy", [
    O("Пока мы знаем только это."), O("В Larks Харпер несколько раз смотрела на улицу."),
    O("И сказала, что ей кажется, будто рядом повторяются одни и те же люди или машины."),
    M("На следующий день у старого моста она спросила меня про тёмно-зелёный седан."), M("И не хотела идти домой."),
    O("А на фотографии возле Larks стоит машина такого же цвета."), M("Может быть, та же."), O("Может быть."), O("Но пока это только версия."),
    C([
      option("Я вообще не понимаю, где находятся Larks и старый мост.", "larks_map_unknown"),
      option("Можете скинуть эти места?", "larks_map_names_first")
    ])
  ]),
  B("larks_map_unknown", "group_larks", "choice:larks_known_summary:0", [O("Точно."), O("Я всё время забываю, что ты никогда не был в Рейвенвуде.")]),
  B("larks_map_names_first", "group_larks", "choice:larks_known_summary:1", [C([option("Для меня это пока просто названия.", "larks_map_names")])]),
  B("larks_map_names", "group_larks", "choice:larks_map_names_first:0", [M("Да."), M("Сейчас будет понятнее.")]),

  B("larks_group_map_document", "group_larks", "after:larks_map_unknown|larks_map_names", [
    N("Оливия отправила местоположение: Larks · River Street · напротив старого кинотеатра Orpheum."),
    N("Миа отправила местоположение: Riverwalk · старый пешеходный мост."),
    O("Только это разные дни."), O("Не нужно соединять точки и решать, что Харпер шла из Larks к мосту."),
    M("Да."), M("Со мной она встретилась только на следующий день."), mapDocument("olivia")
  ], { setFlags: { activeMapRoute: "group" } }),

  B("larks_after_map", "group_larks", "flagAfter:ravenwoodMapAddedToCase:larks_group_map_document", [
    O("Получилось открыть?"),
    C([
      option("Да.", "larks_after_map_understand_first"),
      option("Да.", "larks_after_map_two_first"),
      option("Странно видеть всё это на карте настоящего города.", "larks_after_map_strange")
    ])
  ]),
  B("larks_after_map_understand_first", "group_larks", "choice:larks_after_map:0", [C([option("Теперь хотя бы понимаю, о каких местах вы говорите.", "larks_after_map_understand")])]),
  B("larks_after_map_understand", "group_larks", "choice:larks_after_map_understand_first:0", [M("А то мы говорим «старый мост», будто все обязаны его знать.")]),
  B("larks_after_map_two_first", "group_larks", "choice:larks_after_map:1", [C([option("Но две точки пока ничего не объясняют.", "larks_after_map_two")])]),
  B("larks_after_map_two", "group_larks", "choice:larks_after_map_two_first:0", [O("Согласна."), O("Пока это просто два места и два дня.")]),
  B("larks_after_map_strange", "group_larks", "choice:larks_after_map:2", [M("Для нас это обычные места."), M("Наверное, поэтому ещё неприятнее.")]),

  B("larks_pause_investigation", "group_larks", "after:larks_after_map_understand|larks_after_map_two|larks_after_map_strange", [
    O("Если появятся другие подтверждённые места, добавим их туда же."), O("Но только если точно будем знать, что Харпер там была."),
    M("А я ещё раз попробую вспомнить встречу у моста."), M("Нормально, по порядку."), O("Только не пытайся заполнить пробелы догадками."),
    M("Постараюсь."), M("Хотя теперь всё равно не перестану об этом думать."), O("Тогда пока остановимся."),
    O("Если следователь ответит по фотографии, я напишу."), M("И я скажу, если мне ответят про машину."),
    C([
      option("Хорошо.", "larks_end_questions_first"),
      option("Только попробуйте хотя бы немного отдохнуть.", "larks_end_rest"),
      option("Напишите, если появится что-то конкретное.", "larks_end_concrete")
    ])
  ]),
  B("larks_end_questions_first", "group_larks", "choice:larks_pause_investigation:0", [C([option("Пока вопросов всё равно больше, чем ответов.", "larks_end_questions")])]),
  B("larks_end_questions", "group_larks", "choice:larks_end_questions_first:0", [M("Наконец-то хоть что-то у нас стабильно.")]),
  B("larks_end_rest", "group_larks", "choice:larks_pause_investigation:1", [M("Не обещаю."), O("Я хотя бы попробую."), M("Предательница.")]),
  B("larks_end_concrete", "group_larks", "choice:larks_pause_investigation:2", [O("Напишем."), O("Без новых теорий из ничего.")]),
  B("larks_mia_steps_away", "group_larks", "after:larks_end_questions|larks_end_rest|larks_end_concrete", [
    M("Ладно."), M("Я ненадолго отойду."), M("Мне ещё нужно дождаться ответа от полиции."), O("Хорошо."),
    { type: "system", text: "Миа не в сети.", delay: 700, characterStatus: { id: "mia", online: false } }
  ]),

  B("larks_old_phone_start", "group_larks", "after:larks_mia_steps_away", [
    { type: "pause", delay: 5200 }, { type: "system", text: "Миа в сети.", delay: 600, characterStatus: { id: "mia", online: true } },
    M("Вы здесь?"), O("Я здесь."), M("Я всё это время прокручивала встречу у моста."), M("Прямо по порядку."),
    M("Как пришла."), M("О чём мы говорили."), M("Когда Харпер ушла."), M("И вспомнила ещё одну вещь."),
    C([
      option("Что именно?", "larks_phone_what"), option("Это опять про машину?", "larks_phone_car"),
      option("По такому началу уже ничего хорошего не жду.", "larks_phone_bad")
    ])
  ]),
  B("larks_phone_what", "group_larks", "choice:larks_old_phone_start:0", [M("Про телефон.")]),
  B("larks_phone_car", "group_larks", "choice:larks_old_phone_start:1", [M("Нет."), M("Кажется, это может быть важнее.")]),
  B("larks_phone_bad", "group_larks", "choice:larks_old_phone_start:2", [M("Не знаю."), M("Может, там вообще ничего нет."), M("Но сказать нужно.")]),

  B("larks_phone_story", "group_larks", "after:larks_phone_what|larks_phone_car|larks_phone_bad", [
    M("В тот день я была со старым телефоном."), O("Почему со старым?"), M("Мой основной был в ремонте."), M("Я разбила экран."),
    M("У Харпер к концу встречи почти разрядился телефон."), M("Потом вообще выключился."), M("Она попросила мой."),
    O("Чтобы позвонить?"), M("Нет."), M("Сказала, что ей нужно быстро отправить одно сообщение."), M("Я дала ей телефон."),
    M("Она отошла на несколько шагов."), M("Что-то написала."), M("Потом вернула его и сказала, что удалила чат."),
    C([
      option("Она прямо сказала, что удалила переписку?", "larks_phone_deleted"),
      option("Ты видела, кому она писала?", "larks_phone_recipient"), option("И это только сейчас вспомнилось?", "larks_phone_only_now")
    ])
  ]),
  B("larks_phone_deleted", "group_larks", "choice:larks_phone_story:0", [M("Да."), M("Сказала: «Я там удалила, ладно?»"), M("Будто это вообще ничего не значит.")]),
  B("larks_phone_recipient", "group_larks", "choice:larks_phone_story:1", [M("Нет."), M("Она отвернулась."), M("Я не стала смотреть через плечо.")]),
  B("larks_phone_only_now", "group_larks", "choice:larks_phone_story:2", [M("Да."), M("Я знаю, как это звучит."), M("Но она держала мой телефон примерно минуту."), M("Тогда это вообще не казалось важным.")]),

  B("larks_phone_at_home", "group_larks", "after:larks_phone_deleted|larks_phone_recipient|larks_phone_only_now", [
    M("Я решила, что она написала Дереку."), M("Или кому-то, кому не хотела писать со своего телефона."),
    M("Потом забрала основной из ремонта и убрала старый куда-то дома."), O("Он ещё у тебя?"), M("Должен быть."),
    M("Я его точно не выбрасывала."), M("Наверное, лежит в коробке с проводами."), M("Или в столе."),
    O("Ты полиции про него говорила?"), M("Нет."), M("Когда меня спрашивали про встречу, я про эту минуту с телефоном вообще не вспомнила."),
    C([
      option("Тогда это действительно могло показаться обычным сообщением.", "larks_phone_normal", { miaTrust: 1 }),
      option("Нужно рассказать полиции и найти телефон.", "larks_phone_police"),
      option("Миа, это уже слишком важная вещь, чтобы забыть.", "larks_phone_important", { miaTrust: -1 })
    ])
  ]),
  B("larks_phone_normal", "group_larks", "choice:larks_phone_at_home:0", [M("Да."), M("Спасибо."), M("Я сейчас и так чувствую себя ужасно.")]),
  B("larks_phone_police", "group_larks", "choice:larks_phone_at_home:1", [M("Расскажу."), M("И поищу, как только вернусь домой.")]),
  B("larks_phone_important", "group_larks", "choice:larks_phone_at_home:2", [M("Сейчас — да."), M("Тогда у меня не было причины запоминать каждое действие Харпер."), M("Я не специально это скрыла.")]),

  B("larks_phone_find", "group_larks", "after:larks_phone_normal|larks_phone_police|larks_phone_important", [
    M("Я сейчас не дома."), M("Вернусь через пару часов."), O("Когда найдёшь, ничего на нём не удаляй."),
    O("И лучше сначала напиши следователю."), M("Хорошо."), M("Найду."), M("Сфотографирую, в каком он состоянии."), M("И напишу им."),
    C([
      option("Главное, не потеряй теперь ещё и этот телефон.", "larks_phone_joke"),
      option("Напиши, когда найдёшь.", "larks_phone_write_first"), option("Надеюсь, сообщение ещё можно восстановить.", "larks_phone_restore")
    ])
  ]),
  B("larks_phone_joke", "group_larks", "choice:larks_phone_find:0", [M("Очень смешно."), M("Хотя я даже не знаю, в каком он ящике."), M("Ладно."), M("Заслужила.")]),
  B("larks_phone_write_first", "group_larks", "choice:larks_phone_find:1", [C([option("Даже если он не включится.", "larks_phone_write")])]),
  B("larks_phone_write", "group_larks", "choice:larks_phone_write_first:0", [M("Напишу."), M("Теперь всё равно не успокоюсь, пока не найду.")]),
  B("larks_phone_restore", "group_larks", "choice:larks_phone_find:2", [O("Может быть."), O("Но сначала нужно найти телефон."), M("Да."), M("А потом уже надеяться.")]),
  B("group_route_phone_end", "group_larks", "after:larks_phone_joke|larks_phone_write|larks_phone_restore", [
    M("Ладно."), M("Я поеду домой, как только освобожусь."), M("И проверю все ящики."), M("Даже коробку, которую я не открывала года два."),
    O("Напиши, когда найдёшь."), M("Напишу."), { type: "system", text: "Миа не в сети.", delay: 700, characterStatus: { id: "mia", online: false } }
  ]),

  B("separate_mia_car_start", "private_mia", "after:morning_olivia_decline_end", [
    { type: "pause", delay: 3600 }, { type: "system", text: "Миа в сети.", delay: 600, characterStatus: { id: "mia", online: true } },
    M("Привет ещё раз."), M("Оливия показала мне фотографию из Larks."), M("И я, кажется, вспомнила кое-что важное."),
    C([
      option("Что именно?", "separate_car_what"), option("Это про машину на фотографии?", "separate_car_photo"),
      option("Надеюсь, не ещё один странный номер.", "separate_car_number")
    ])
  ]),
  B("separate_car_what", "private_mia", "choice:separate_mia_car_start:0", [M("Про зелёную машину.")]),
  B("separate_car_photo", "private_mia", "choice:separate_mia_car_start:1", [M("Да."), M("Харпер спрашивала меня про похожую.")]),
  B("separate_car_number", "private_mia", "choice:separate_mia_car_start:2", [M("Нет."), M("Одного нам пока хватает."), M("Это про машину на фотографии.")]),

  B("separate_bridge_car", "private_mia", "after:separate_car_what|separate_car_photo|separate_car_number", [
    M("На следующий день после Larks я встретилась с Харпер у старого моста."), M("Она была какая-то дёрганая."),
    M("Постоянно смотрела по сторонам."), M("А потом спросила, не видела ли я рядом тёмно-зелёный седан."),
    C([
      option("Ты тогда видела машину?", "separate_car_seen"), option("Она объяснила, почему спрашивает?", "separate_car_why"),
      option("Тебя сейчас саму это пугает?", "separate_car_scared")
    ])
  ]),
  B("separate_car_seen", "private_mia", "choice:separate_bridge_car:0", [M("Нет."), M("Я посмотрела вокруг."), M("Ничего похожего уже не было.")]),
  B("separate_car_why", "private_mia", "choice:separate_bridge_car:1", [M("Сказала только, что вроде уже видела такую."), M("А потом сразу сменила тему.")]),
  B("separate_car_scared", "private_mia", "choice:separate_bridge_car:2", [M("Да."), M("До фотографии это был просто один странный вопрос."), M("А теперь возле Larks стоит машина такого же цвета.")]),

  B("separate_police_car", "private_mia", "after:separate_car_seen|separate_car_why|separate_car_scared", [
    M("Про встречу у моста я полиции рассказывала."), M("Но про машину вообще не вспомнила."),
    M("Тогда я ни с чем этот вопрос не связала."), M("Сейчас уже написала следователю."),
    C([
      option("Хорошо, что ты сразу сообщила.", "separate_police_good"),
      option("Тогда ты и правда не могла знать, что это важно.", "separate_police_understand", { miaTrust: 1 }),
      option("Такие детали лучше больше не откладывать.", "separate_police_details", { miaTrust: -1 })
    ])
  ]),
  B("separate_police_good", "private_mia", "choice:separate_police_car:0", [M("Да."), M("Не хочу потом опять вспоминать что-то через два дня.")]),
  B("separate_police_understand", "private_mia", "choice:separate_police_car:1", [M("Спасибо."), M("Я сейчас и так перебираю в голове каждое её слово.")]),
  B("separate_police_details", "private_mia", "choice:separate_police_car:2", [M("Я не откладывала."), M("Я правда только сейчас вспомнила.")]),

  B("separate_following_info", "private_mia", "after:separate_police_good|separate_police_understand|separate_police_details", [
    M("Оливия сказала, что Харпер и ей говорила про слежку."), M("Я вообще об этом не знала."),
    M("Если бы знала, вопрос про машину не показался бы таким случайным."),
    C([
      option("Что ещё было у старого моста?", "separate_bridge_more"), option("Харпер сказала, кого именно боится?", "separate_bridge_afraid"),
      option("Она выглядела испуганной?", "separate_bridge_tense")
    ])
  ]),
  B("separate_bridge_more", "private_mia", "choice:separate_following_info:0", [M("Она не хотела идти домой."), M("И несколько раз начинала что-то говорить."), M("А потом говорила: «Забей».")]),
  B("separate_bridge_afraid", "private_mia", "choice:separate_following_info:1", [M("Нет."), M("Она вообще не сказала, что кого-то боится."), M("Просто всё время смотрела по сторонам.")]),
  B("separate_bridge_tense", "private_mia", "choice:separate_following_info:2", [M("Скорее напряжённой."), M("Будто ждала, что снова что-то заметит.")]),

  B("separate_riverwalk_location", "private_mia", "after:separate_bridge_more|separate_bridge_afraid|separate_bridge_tense", [
    M("Ты ведь вообще не знаешь город."), M("Старый мост тебе, наверное, тоже ничего не говорит."),
    C([option("Вообще ничего.", "separate_place_nothing"), option("Можешь скинуть место?", "separate_place_send")])
  ]),
  B("separate_place_nothing", "private_mia", "choice:separate_riverwalk_location:0", [M("Тогда сейчас покажу.")]),
  B("separate_place_send", "private_mia", "choice:separate_riverwalk_location:1", [M("Да.")]),
  B("separate_mia_location_sent", "private_mia", "after:separate_place_nothing|separate_place_send", [
    N("Миа отправила местоположение: Riverwalk · старый пешеходный мост."), M("Это было за три дня до исчезновения."),
    M("Только не соединяй его с Larks как один маршрут."), M("Мы встречались там на следующий день."),
    M("Оливия отдельно скинет тебе кафе."), M("Так будет понятнее.")
  ]),

  B("separate_olivia_location_start", "private_olivia", "after:separate_mia_location_sent", [
    O("Миа уже рассказала тебе про старый мост?"),
    C([
      option("Да. И прислала место.", "separate_olivia_yes"), option("Да.", "separate_olivia_car_first"), option("Да.", "separate_olivia_coincidence_first")
    ])
  ]),
  B("separate_olivia_yes", "private_olivia", "choice:separate_olivia_location_start:0", [O("Хорошо.")]),
  B("separate_olivia_car_first", "private_olivia", "choice:separate_olivia_location_start:1", [C([option("Теперь машина возле Larks выглядит уже не совсем случайной.", "separate_olivia_car")])]),
  B("separate_olivia_car", "private_olivia", "choice:separate_olivia_car_first:0", [O("Возможно."), O("Но мы всё ещё не знаем, была ли это одна машина.")]),
  B("separate_olivia_coincidence_first", "private_olivia", "choice:separate_olivia_location_start:2", [C([option("Но пока это всё равно только совпадение.", "separate_olivia_coincidence", { oliviaTrust: 1 })])]),
  B("separate_olivia_coincidence", "private_olivia", "choice:separate_olivia_coincidence_first:0", [O("Да."), O("Пока именно так.")]),

  B("separate_map_document", "private_olivia", "after:separate_olivia_yes|separate_olivia_car|separate_olivia_coincidence", [
    O("Тогда скину тебе Larks."), N("Оливия отправила местоположение: Larks · River Street · напротив старого кинотеатра Orpheum."),
    O("Эти события произошли в разные дни."), O("Пока это просто две подтверждённые точки."), O("Не маршрут Харпер."),
    mapDocument("olivia")
  ], { setFlags: { activeMapRoute: "separate" } }),

  B("separate_after_map", "private_olivia", "flagAfter:ravenwoodMapAddedToCase:separate_map_document", [
    O("Получилось открыть?"),
    C([
      option("Да.", "separate_map_where_first"), option("Да.", "separate_map_two_first"), option("Да.", "separate_map_city_first")
    ])
  ]),
  B("separate_map_where_first", "private_olivia", "choice:separate_after_map:0", [C([option("Теперь хотя бы понимаю, где всё происходило.", "separate_map_where")])]),
  B("separate_map_where", "private_olivia", "choice:separate_map_where_first:0", [O("Хорошо."), O("А то для нас эти названия привычные.")]),
  B("separate_map_two_first", "private_olivia", "choice:separate_after_map:1", [C([option("Но две точки пока ничего не объясняют.", "separate_map_two")])]),
  B("separate_map_two", "private_olivia", "choice:separate_map_two_first:0", [O("Согласна."), O("Пока это просто два места и два разных дня.")]),
  B("separate_map_city_first", "private_olivia", "choice:separate_after_map:2", [C([option("Рейвенвуд начинает казаться менее чужим.", "separate_map_city")])]),
  B("separate_map_city", "private_olivia", "choice:separate_map_city_first:0", [O("Не уверена, что это лучший способ знакомиться с городом.")]),
  B("separate_after_map_end", "private_olivia", "after:separate_map_where|separate_map_two|separate_map_city", [
    O("Если появятся другие подтверждённые места, добавим их туда же."), O("Я напишу, если следователь ответит по фотографии."),
    O("И спасибо, что не стал сразу делать выводы про машину.")
  ]),

  B("separate_old_phone_start", "private_mia", "after:separate_after_map_end", [
    { type: "pause", delay: 5200 }, { type: "system", text: "Миа в сети.", delay: 600, characterStatus: { id: "mia", online: true } }, M("Ты здесь?"),
    C([
      option("Да. Что случилось?", "separate_phone_happened"), option("Ты опять что-то вспомнила?", "separate_phone_again"),
      option("По этому сообщению уже понимаю, что да.", "separate_phone_predictable")
    ])
  ]),
  B("separate_phone_happened", "private_mia", "choice:separate_old_phone_start:0", [M("Я опять прокручивала встречу у моста.")]),
  B("separate_phone_again", "private_mia", "choice:separate_old_phone_start:1", [M("Да."), M("И теперь мне ещё хуже от того, сколько всего я не вспомнила сразу.")]),
  B("separate_phone_predictable", "private_mia", "choice:separate_old_phone_start:2", [M("Настолько предсказуемо?"), M("Но да.")]),

  B("separate_phone_request", "private_mia", "after:separate_phone_happened|separate_phone_again|separate_phone_predictable", [
    M("В тот день я была со старым телефоном."), M("Мой основной тогда был в ремонте."), M("Я разбила экран."),
    M("У Харпер к концу встречи почти разрядился телефон."), M("Потом вообще выключился."), M("Она попросила мой."),
    M("Сказала, что ей нужно быстро отправить одно сообщение."),
    C([
      option("Ты видела, кому она писала?", "separate_phone_who"), option("Что было потом?", "separate_phone_after"),
      option("Она не могла просто зарядить свой телефон?", "separate_phone_charge")
    ])
  ]),
  B("separate_phone_who", "private_mia", "choice:separate_phone_request:0", [M("Нет."), M("Она отошла на несколько шагов."), M("Я не стала смотреть через плечо.")]),
  B("separate_phone_after", "private_mia", "choice:separate_phone_request:1", [M("Она вернула телефон."), M("И сказала, что удалила чат.")]),
  B("separate_phone_charge", "private_mia", "choice:separate_phone_request:2", [M("У моста?"), M("Нет."), M("Мы были на улице."), M("Поэтому она попросила мой.")]),

  B("separate_phone_deleted", "private_mia", "after:separate_phone_who|separate_phone_after|separate_phone_charge", [
    M("Она прямо сказала: «Я там удалила, ладно?»"), M("Я решила, что она написала Дереку."),
    M("Или кому-то, кому не хотела писать со своего телефона."), M("Не спросила."),
    C([
      option("И только сейчас вспомнила?", "separate_phone_now"),
      option("Тогда это могло показаться обычным сообщением.", "separate_phone_normal", { miaTrust: 1 }),
      option("Ты уже сказала Оливии?", "separate_phone_olivia")
    ])
  ]),
  B("separate_phone_now", "private_mia", "choice:separate_phone_deleted:0", [M("Да."), M("Она держала мой телефон примерно минуту."), M("Тогда это вообще не выглядело важным.")]),
  B("separate_phone_normal", "private_mia", "choice:separate_phone_deleted:1", [M("Да."), M("Именно."), M("Спасибо.")]),
  B("separate_phone_olivia", "private_mia", "choice:separate_phone_deleted:2", [M("Да."), M("Написала ей перед тем, как написать тебе."), M("Она сказала найти телефон и ничего на нём не трогать.")]),

  B("separate_phone_home", "private_mia", "after:separate_phone_now|separate_phone_normal|separate_phone_olivia", [
    M("Телефон должен быть дома."), M("Я его не выбрасывала."), M("Наверное, лежит в коробке с проводами."), M("Или в столе."),
    M("Сейчас я не дома."), M("Вернусь через пару часов и поищу."),
    C([
      option("Напиши, когда найдёшь.", "separate_phone_write"), option("Сначала сообщи полиции.", "separate_phone_police"),
      option("Главное, не потеряй теперь ещё и этот телефон.", "separate_phone_joke")
    ])
  ]),
  B("separate_phone_write", "private_mia", "choice:separate_phone_home:0", [M("Напишу."), M("Даже если он не включится.")]),
  B("separate_phone_police", "private_mia", "choice:separate_phone_home:1", [M("Сообщу."), M("Я уже написала, что вспомнила про него."), M("Теперь нужно найти сам телефон.")]),
  B("separate_phone_joke", "private_mia", "choice:separate_phone_home:2", [M("Очень смешно."), M("Хотя я даже не знаю, где он лежит."), M("Ладно."), M("Заслужила.")]),
  B("separate_route_phone_end", "private_mia", "after:separate_phone_write|separate_phone_police|separate_phone_joke", [
    M("В общем, как только вернусь домой — проверю все ящики."), M("И напишу тебе."), M("Оливии тоже."),
    M("Теперь я всё равно не успокоюсь, пока его не найду.")
  ]),

  B("larks_olivia_goodbye", "private_mia", "after:group_route_phone_end|separate_route_phone_end", [])
];
