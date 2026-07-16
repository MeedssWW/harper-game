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
    M("Я тут."), M("Оливия сказала, у неё нашлась какая-то фотография."), M("И что на этот раз без толпы."),
    O("Только мы трое."), M("Уже легче."),
    C([
      option("Привет ещё раз.", "larks_intro_hello"),
      option("Надеюсь, этот чат проживёт дольше прошлого.", "larks_intro_survive"),
      option("Главное, чтобы никто не начал кричать через две минуты.", "larks_intro_shout")
    ])
  ], { identify: ["mia", "olivia"] }),
  B("larks_intro_hello", "group_larks", "choice:larks_group_start:0", [M("Привет ещё раз."), M("Так уже как-то спокойнее.")]),
  B("larks_intro_survive", "group_larks", "choice:larks_group_start:1", [M("После прошлого? Это несложно."), O("Постараемся не опускать планку ещё ниже.")]),
  B("larks_intro_shout", "group_larks", "choice:larks_group_start:2", [M("Хорошо. Подожду хотя бы три."), O("Миа."), M("Всё-всё."), M("Молчу.")]),

  B("larks_photo_context", "group_larks", "after:larks_intro_hello|larks_intro_survive|larks_intro_shout", [
    O("Сейчас, коротко."), O("Это Larks."), O("За четыре дня до исчезновения Харпер."),
    O("Снимок остался в нашей старой переписке."), O("Следователю я его уже отправила."), M("Кидай сюда."),
    N("Оливия отправила фотографию."), image,
    M("Она опять пьёт твой кофе?"), O("Да."), M("Тогда это точно Харпер."), O("Миа."),
    M("Я просто... пытаюсь не начать сразу с худшего."), M("Но да."), M("Она явно смотрит куда-то на улицу."),
    O("В тот день она так отвлекалась несколько раз."), O("Я решила, что просто задумалась."),
    C([
      option("Может, она смотрела на машину.", "larks_photo_car"),
      option("Рядом с машиной кто-то стоит.", "larks_photo_person"),
      option("На фото она выглядит напряжённой.", "larks_photo_tense")
    ])
  ]),
  B("larks_photo_car", "group_larks", "choice:larks_photo_context:0", [O("Может."), O("Но по одному снимку я бы не стала это утверждать.")]),
  B("larks_photo_person", "group_larks", "choice:larks_photo_context:1", [M("Да, вижу."), M("Хотя там человек из трёх пикселей."), O("Это вообще мог быть прохожий.")]),
  B("larks_photo_tense", "group_larks", "choice:larks_photo_context:2", [M("Вот! Мне тоже."), M("У неё так лицо менялось, когда она делала вид, что всё ок."), O("А я тогда ничего не заметила.")]),

  B("larks_sedan_reveal", "group_larks", "after:larks_photo_car|larks_photo_person|larks_photo_tense", [
    O("Только не решайте сразу, что дело в машине."), O("Она могла просто стоять у кафе."),
    O("И Харпер могла смотреть вообще не на неё."), M("Стоп."), M("Она тёмно-зелёная."), O("Да..."),
    M("Харпер спрашивала меня про такую машину."), O("Когда?"), M("На следующий день."), M("У старого моста."),
    O("Она прямо сказала: тёмно-зелёная?"), M("Да."), M("Спросила, не видела ли я рядом тёмно-зелёный седан."),
    M("Я ещё подумала: с чего вдруг такой вопрос? И забыла."),
    C([
      option("Она сказала, зачем спрашивает?", "larks_sedan_why"),
      option("И ты оглянулась? Машины уже не было?", "larks_sedan_seen"),
      option("Тебя сейчас саму это пугает?", "larks_sedan_scared")
    ])
  ]),
  B("larks_sedan_why", "group_larks", "choice:larks_sedan_reveal:0", [M("Толком нет."), M("Сказала, что вроде уже видела похожую."), M("И сразу съехала с темы.")]),
  B("larks_sedan_seen", "group_larks", "choice:larks_sedan_reveal:1", [M("Нет."), M("Я даже оглянулась тогда."), M("Ничего похожего уже не было.")]),
  B("larks_sedan_scared", "group_larks", "choice:larks_sedan_reveal:2", [M("Очень."), M("До этой фотки это был просто странный вопрос."), M("А теперь вот она. Того же цвета.")]),

  B("larks_bridge_story", "group_larks", "after:larks_sedan_why|larks_sedan_seen|larks_sedan_scared", [
    O("Расскажи всё по порядку. Как помнишь."), M("Мы договорились встретиться у Риверуока."), M("У старого моста."),
    M("Это Харпер предложила."), M("Я пришла — она уже там."), M("И всё время оглядывается."),
    O("Сказала, что случилось?"), M("Нет."), M("Я спросила, чего она такая дёрганая."), M("Она: «Да просто устала»."),
    M("Потом спросила про машину."), M("И сказала, что домой пока не хочет."),
    C([
      option("И ты решила, что дело в Дереке?", "larks_bridge_why_home"),
      option("Она кого-то ждала или, наоборот, пряталась?", "larks_bridge_waiting"),
      option("Похоже, она хотела что-то сказать и передумала.", "larks_bridge_tell")
    ])
  ]),
  B("larks_bridge_why_home", "group_larks", "choice:larks_bridge_story:0", [M("Ага."), M("Подумала, они опять поругались."), M("И не стала лезть. Молодец, Миа.")]),
  B("larks_bridge_waiting", "group_larks", "choice:larks_bridge_story:1", [M("Скорее пряталась."), M("На телефон почти не смотрела."), M("Зато вокруг — постоянно.")]),
  B("larks_bridge_tell", "group_larks", "choice:larks_bridge_story:2", [M("Вот и мне теперь так кажется."), M("Пару раз начинала говорить..."), M("Потом: «Забей» — и всё."), M("Я не стала давить.")]),

  B("larks_police_omission", "group_larks", "after:larks_bridge_why_home|larks_bridge_waiting|larks_bridge_tell", [
    O("Про саму встречу полиции рассказывала?"), M("Да."), M("Где были, во сколько примерно разошлись."),
    M("А про машину — нет."), O("Не вспомнила?"), M("Вообще."),
    M("Тогда это был просто один странный вопрос посреди разговора."), M("Я же не знала, что до этого Харпер говорила тебе про слежку."),
    C([
      option("Тогда это и правда могло показаться мелочью.", "larks_police_understand", { miaTrust: 1 }),
      option("Главное, что ты вспомнила сейчас.", "larks_police_now"),
      option("Об этом всё-таки стоило сказать полиции. Даже если казалось мелочью.", "larks_police_should", { miaTrust: -1 })
    ])
  ]),
  B("larks_police_understand", "group_larks", "choice:larks_police_omission:0", [M("Вот именно."), M("Я не скрывала."), M("Правда не связала одно с другим.")]),
  B("larks_police_now", "group_larks", "choice:larks_police_omission:1", [M("Наверное."), M("Но всё равно паршиво, что только сейчас.")]),
  B("larks_police_should", "group_larks", "choice:larks_police_omission:2", [M("Мне тоже жаль."), M("Просто тогда я не записывала в голове каждое её слово как улику."), M("Я не знала, что придётся.")]),

  B("larks_investigator_sent", "group_larks", "after:larks_police_understand|larks_police_now|larks_police_should", [
    M("Сейчас напишу следователю."), M("Прямо сейчас, пока опять не забыла половину."), O("Напиши её словами."),
    O("Не только про цвет."), M("Ага."), M("Пишу."), M("..."), M("Всё. Отправила."), O("Хорошо."),
    M("Стоп."), M("Ты сказала, Харпер говорила тебе про слежку?"), O("Да."),
    O("В Larks она сказала, что иногда будто замечает кого-то за собой."), M("И ты мне не сказала?"),
    O("Полиции сказала."), O("Но Харпер никого не описала."), O("И тут же сама решила, что просто себя накрутила."),
    M("А машина?"), O("Ни цвет, ни модель она не назвала."), O("Только сказала: иногда рядом попадаются одни и те же люди."),
    O("Или одна и та же машина."), O("Но она и сама сомневалась."),
    C([
      option("То есть это повторилось. Не один раз.", "larks_twice"),
      option("Вы обе слышали половину. И не знали про вторую.", "larks_didnt_know"),
      option("Ладно... вот теперь мне правда не по себе.", "larks_uneasy")
    ])
  ]),
  B("larks_twice", "group_larks", "choice:larks_investigator_sent:0", [O("Похоже — да."), O("Но было ли это одним и тем же, мы не знаем.")]),
  B("larks_didnt_know", "group_larks", "choice:larks_investigator_sent:1", [M("Да."), M("Знай я про Larks, я бы про машину вспомнила сразу."), O("А я не знала, что на следующий день она опять об этом заговорила.")]),
  B("larks_uneasy", "group_larks", "choice:larks_investigator_sent:2", [M("Мне тоже."), M("Она нам обеим сказала, что всё нормально. Вот что хуже всего."), O("Понимаю."), O("Но всё равно: пока мы не знаем, следил ли за ней кто-то на самом деле.")]),

  B("larks_known_summary", "group_larks", "after:larks_twice|larks_didnt_know|larks_uneasy", [
    O("Давайте зафиксируем, пока всё не смешалось."), O("В Larks Харпер несколько раз смотрела на улицу."),
    O("И сказала, что ей мерещатся рядом одни и те же люди или машины."),
    M("На следующий день у моста она спросила меня про тёмно-зелёный седан."), M("И домой идти не хотела."),
    O("А на фотографии у Larks — машина такого же цвета."), M("Может, та же."), O("Может."), O("Но пока только может быть."),
    C([
      option("Подождите. Я вообще не представляю, где Larks и этот мост.", "larks_map_unknown"),
      option("Скиньте точки на карте. Для меня это пока просто названия.", "larks_map_names")
    ])
  ]),
  B("larks_map_unknown", "group_larks", "choice:larks_known_summary:0", [O("Точно..."), O("Я всё время забываю, что ты вообще не знаешь Рейвенвуд.")]),
  B("larks_map_names", "group_larks", "choice:larks_known_summary:1", [M("Сейчас."), M("На карте будет проще.")]),

  B("larks_group_map_document", "group_larks", "after:larks_map_unknown|larks_map_names", [
    N("Оливия отправила местоположение: Larks · River Street · напротив старого кинотеатра Orpheum."),
    N("Миа отправила местоположение: Riverwalk · старый пешеходный мост."),
    O("Только не соединяй их в маршрут."), O("Это разные дни."),
    M("Да."), M("У моста мы были только на следующий день."), mapDocument("olivia")
  ], { setFlags: { activeMapRoute: "group" } }),

  B("larks_after_map", "group_larks", "flagAfter:ravenwoodMapAddedToCase:larks_group_map_document", [
    O("Получилось открыть?"),
    C([
      option("Да. Теперь хотя бы понимаю, о чём вы говорите.", "larks_after_map_understand"),
      option("Да. Но пока это просто два места в разные дни.", "larks_after_map_two"),
      option("Странно видеть всё это на карте настоящего города.", "larks_after_map_strange")
    ])
  ]),
  B("larks_after_map_understand", "group_larks", "choice:larks_after_map:0", [M("А то мы говорим «старый мост», будто все обязаны его знать.")]),
  B("larks_after_map_two", "group_larks", "choice:larks_after_map:1", [O("Согласна."), O("Пока это просто два места и два дня.")]),
  B("larks_after_map_strange", "group_larks", "choice:larks_after_map:2", [M("Для нас это обычные места."), M("Наверное, поэтому ещё неприятнее.")]),

  B("larks_pause_investigation", "group_larks", "after:larks_after_map_understand|larks_after_map_two|larks_after_map_strange", [
    O("Если всплывёт ещё какое-то точное место, добавим."), O("Но только точное."),
    M("А я ещё раз прокручу встречу у моста."), M("По порядку, без паники. Ну, попробую."), O("Только не додумывай то, чего не помнишь."),
    M("Постараюсь."), M("Хотя голова уже сама это делает."), O("Тогда на сегодня хватит."),
    O("Если следователь ответит про фото — напишу."), M("И я, если ответят про машину."),
    C([
      option("Ладно. Пока всё равно одни вопросы.", "larks_end_questions"),
      option("Только попробуйте хотя бы немного отдохнуть.", "larks_end_rest"),
      option("Напишите, если появится что-то конкретное.", "larks_end_concrete")
    ])
  ]),
  B("larks_end_questions", "group_larks", "choice:larks_pause_investigation:0", [M("Наконец-то хоть что-то у нас стабильно.")]),
  B("larks_end_rest", "group_larks", "choice:larks_pause_investigation:1", [M("Не обещаю."), O("Я хотя бы попробую."), M("Предательница.")]),
  B("larks_end_concrete", "group_larks", "choice:larks_pause_investigation:2", [O("Напишем."), O("Без новых теорий из ничего.")]),
  B("larks_mia_steps_away", "group_larks", "after:larks_end_questions|larks_end_rest|larks_end_concrete", [
    M("Ладно."), M("Я ненадолго отойду."), M("Мне ещё нужно дождаться ответа от полиции."), O("Хорошо."),
    { type: "system", text: "Миа не в сети.", delay: 700, characterStatus: { id: "mia", online: false } }
  ]),

  B("larks_old_phone_start", "group_larks", "after:larks_mia_steps_away", [
    { type: "pause", delay: 5200 }, { type: "system", text: "Миа в сети.", delay: 600, characterStatus: { id: "mia", online: true } },
    M("Вы тут?"), O("Да."), M("Я всё это время прокручивала встречу у моста."), M("Прямо по минутам."),
    M("Как пришла."), M("О чём говорили."), M("Как она ушла."), M("И... я ещё кое-что вспомнила."),
    C([
      option("Что на этот раз?", "larks_phone_what"), option("Это опять про машину?", "larks_phone_car"),
      option("Миа, ты меня сейчас пугаешь.", "larks_phone_bad")
    ])
  ]),
  B("larks_phone_what", "group_larks", "choice:larks_old_phone_start:0", [M("Про телефон.")]),
  B("larks_phone_car", "group_larks", "choice:larks_old_phone_start:1", [M("Нет."), M("И, кажется... это хуже.")]),
  B("larks_phone_bad", "group_larks", "choice:larks_old_phone_start:2", [M("Прости."), M("Может, это вообще пустяк."), M("Но промолчать я уже не могу.")]),

  B("larks_phone_story", "group_larks", "after:larks_phone_what|larks_phone_car|larks_phone_bad", [
    M("В тот день я ходила со старым телефоном."), O("А основной?"), M("Был в ремонте."), M("Я экран разбила."),
    M("У Харпер под конец почти сел телефон."), M("Потом выключился совсем."), M("И она попросила мой."),
    O("Позвонить?"), M("Нет."), M("Сказала: «Мне одно сообщение, быстро»."), M("Ну я и дала."),
    M("Она отошла чуть подальше."), M("Что-то написала."), M("Вернула телефон и сказала, что удалила чат."),
    C([
      option("Погоди. Она сама сказала, что всё удалила?", "larks_phone_deleted"),
      option("Ты видела, кому она писала?", "larks_phone_recipient"), option("И это только сейчас вспомнилось?", "larks_phone_only_now")
    ])
  ]),
  B("larks_phone_deleted", "group_larks", "choice:larks_phone_story:0", [M("Да."), M("Прямо так: «Я там удалила, ладно?»"), M("Будто речь про открытый браузер.")]),
  B("larks_phone_recipient", "group_larks", "choice:larks_phone_story:1", [M("Нет."), M("Она отвернулась."), M("Я не стала смотреть через плечо.")]),
  B("larks_phone_only_now", "group_larks", "choice:larks_phone_story:2", [M("Да."), M("Знаю, звучит ужасно."), M("Но телефон был у неё минуту, может меньше."), M("Тогда я вообще не зацепилась за это.")]),

  B("larks_phone_at_home", "group_larks", "after:larks_phone_deleted|larks_phone_recipient|larks_phone_only_now", [
    M("Я решила, что она написала Дереку."), M("Ну или кому-то, кому не хотела писать со своего."),
    M("Потом мне вернули основной, а старый я куда-то убрала."), O("Он ещё у тебя?"), M("Должен быть."),
    M("Я его точно не выбрасывала."), M("Либо в коробке с проводами."), M("Либо в столе. Наверное."),
    O("Полиции про него говорила?"), M("Нет."), M("На опросе я эту минуту вообще не вспомнила."),
    C([
      option("Тогда это действительно могло показаться обычным сообщением.", "larks_phone_normal", { miaTrust: 1 }),
      option("Сейчас главное — написать следователю и найти телефон.", "larks_phone_police"),
      option("Чёрт, Миа. Вот это уже правда могло быть важным.", "larks_phone_important", { miaTrust: -1 })
    ])
  ]),
  B("larks_phone_normal", "group_larks", "choice:larks_phone_at_home:0", [M("Да."), M("Спасибо."), M("Потому что сейчас я чувствую себя просто отвратительно.")]),
  B("larks_phone_police", "group_larks", "choice:larks_phone_at_home:1", [M("Расскажу."), M("И поищу, как только вернусь домой.")]),
  B("larks_phone_important", "group_larks", "choice:larks_phone_at_home:2", [M("Сейчас я тоже это понимаю."), M("Тогда это была просто минута с моим телефоном."), M("Я не скрывала. Я правда забыла.")]),

  B("larks_phone_find", "group_larks", "after:larks_phone_normal|larks_phone_police|larks_phone_important", [
    M("Я сейчас не дома."), M("Буду через пару часов."), O("Если найдёшь — вообще ничего не нажимай."),
    O("Сначала следователю."), M("Да, поняла."), M("Найду."), M("Сначала сфотографирую, как он лежал."), M("Потом напишу им."),
    C([
      option("Главное, не потеряй теперь ещё и этот телефон.", "larks_phone_joke"),
      option("Напиши, когда найдёшь. Даже если он не включится.", "larks_phone_write"), option("Надеюсь, от того сообщения хоть что-то осталось.", "larks_phone_restore")
    ])
  ]),
  B("larks_phone_joke", "group_larks", "choice:larks_phone_find:0", [M("Очень смешно."), M("Хотя я даже не знаю, в каком он ящике."), M("Ладно."), M("Заслужила.")]),
  B("larks_phone_write", "group_larks", "choice:larks_phone_find:1", [M("Напишу."), M("Теперь всё равно не успокоюсь, пока не найду.")]),
  B("larks_phone_restore", "group_larks", "choice:larks_phone_find:2", [O("Может быть."), O("Но сначала нужно найти телефон."), M("Да."), M("А потом уже надеяться.")]),
  B("group_route_phone_end", "group_larks", "after:larks_phone_joke|larks_phone_write|larks_phone_restore", [
    M("Ладно."), M("Как освобожусь — сразу домой."), M("Перетрясу всё."), M("Даже ту коробку, которую два года боялась открывать."),
    O("Напиши, когда найдёшь."), M("Напишу."), { type: "system", text: "Миа не в сети.", delay: 700, characterStatus: { id: "mia", online: false } }
  ]),

  B("separate_mia_car_start", "private_mia", "after:morning_olivia_decline_end", [
    { type: "pause", delay: 3600 }, { type: "system", text: "Миа в сети.", delay: 600, characterStatus: { id: "mia", online: true } },
    M("Привет ещё раз."), M("Оливия показала фото из Larks."), M("И у меня сейчас кое-что щёлкнуло."),
    C([
      option("Что вспомнила?", "separate_car_what"), option("Это про машину на фотографии?", "separate_car_photo"),
      option("Только не говори, что там ещё один странный номер.", "separate_car_number")
    ])
  ]),
  B("separate_car_what", "private_mia", "choice:separate_mia_car_start:0", [M("Про зелёную машину.")]),
  B("separate_car_photo", "private_mia", "choice:separate_mia_car_start:1", [M("Да."), M("Харпер спрашивала меня про похожую.")]),
  B("separate_car_number", "private_mia", "choice:separate_mia_car_start:2", [M("Нет."), M("Одного нам пока хватает."), M("Это про машину на фотографии.")]),

  B("separate_bridge_car", "private_mia", "after:separate_car_what|separate_car_photo|separate_car_number", [
    M("На следующий день после Larks мы встретились у старого моста."), M("Харпер была какая-то... дёрганая."),
    M("Всё время оглядывалась."), M("А потом спросила, не видела ли я рядом тёмно-зелёный седан."),
    C([
      option("Ты оглянулась? Машины уже не было?", "separate_car_seen"), option("Она сказала, зачем спрашивает?", "separate_car_why"),
      option("Тебя сейчас саму это пугает?", "separate_car_scared")
    ])
  ]),
  B("separate_car_seen", "private_mia", "choice:separate_bridge_car:0", [M("Нет."), M("Я посмотрела вокруг."), M("Ничего похожего уже не было.")]),
  B("separate_car_why", "private_mia", "choice:separate_bridge_car:1", [M("Сказала только, что вроде уже видела такую."), M("А потом сразу сменила тему.")]),
  B("separate_car_scared", "private_mia", "choice:separate_bridge_car:2", [M("Ага."), M("До фото это был просто странный вопрос."), M("А теперь у Larks стоит машина того же цвета.")]),

  B("separate_police_car", "private_mia", "after:separate_car_seen|separate_car_why|separate_car_scared", [
    M("Про встречу у моста полиции я рассказывала."), M("А про машину — вообще ни слова. Не вспомнила."),
    M("Тогда этот вопрос ни с чем не связывался."), M("Сейчас уже написала следователю."),
    C([
      option("Хорошо, что ты сразу сообщила.", "separate_police_good"),
      option("Тогда ты и правда не могла знать, что это важно.", "separate_police_understand", { miaTrust: 1 }),
      option("Миа, такое надо было сказать полиции сразу.", "separate_police_details", { miaTrust: -1 })
    ])
  ]),
  B("separate_police_good", "private_mia", "choice:separate_police_car:0", [M("Да."), M("Не хочу потом опять вспоминать что-то через два дня.")]),
  B("separate_police_understand", "private_mia", "choice:separate_police_car:1", [M("Спасибо."), M("Я сейчас и так перебираю в голове каждое её слово.")]),
  B("separate_police_details", "private_mia", "choice:separate_police_car:2", [M("Да."), M("Второй раз я уже точно ждать не буду.")]),

  B("separate_following_info", "private_mia", "after:separate_police_good|separate_police_understand|separate_police_details", [
    M("Оливия сказала, Харпер и ей говорила, будто за ней следят."), M("Я вообще этого не знала."),
    M("Если бы знала... тот вопрос про машину я бы точно не забыла."),
    C([
      option("Кроме машины — что ещё тебе сейчас вспоминается?", "separate_bridge_more"), option("Она хоть намекнула, кого боялась?", "separate_bridge_afraid"),
      option("Это был страх? Или просто нервы?", "separate_bridge_tense")
    ])
  ]),
  B("separate_bridge_more", "private_mia", "choice:separate_following_info:0", [M("Она не хотела идти домой."), M("И несколько раз начинала что-то говорить."), M("А потом говорила: «Забей».")]),
  B("separate_bridge_afraid", "private_mia", "choice:separate_following_info:1", [M("Нет."), M("Она вообще не сказала, что кого-то боится."), M("Просто всё время смотрела по сторонам.")]),
  B("separate_bridge_tense", "private_mia", "choice:separate_following_info:2", [M("Скорее напряжённой."), M("Будто ждала, что снова что-то заметит.")]),

  B("separate_riverwalk_location", "private_mia", "after:separate_bridge_more|separate_bridge_afraid|separate_bridge_tense", [
    M("Ты же город вообще не знаешь."), M("Я говорю «старый мост», будто тебе это что-то объясняет."),
    C([option("Вообще ничего.", "separate_place_nothing"), option("Можешь скинуть место?", "separate_place_send")])
  ]),
  B("separate_place_nothing", "private_mia", "choice:separate_riverwalk_location:0", [M("Тогда сейчас покажу.")]),
  B("separate_place_send", "private_mia", "choice:separate_riverwalk_location:1", [M("Да.")]),
  B("separate_mia_location_sent", "private_mia", "after:separate_place_nothing|separate_place_send", [
    N("Миа отправила местоположение: Riverwalk · старый пешеходный мост."), M("Это за три дня до исчезновения."),
    M("И только не рисуй линию от Larks к мосту."), M("Это было уже на следующий день."),
    M("Оливия отдельно скинет кафе."), M("Тогда карта хоть не будет выглядеть как моя теория заговора.")
  ]),

  B("separate_olivia_location_start", "private_olivia", "after:separate_mia_location_sent", [
    O("Миа уже рассказала тебе про старый мост?"),
    C([
      option("Да. И прислала место.", "separate_olivia_yes"), option("Да. После слов Мии машина уже не выглядит случайной.", "separate_olivia_car"), option("Да. Но одного цвета пока мало — это всё ещё может быть совпадением.", "separate_olivia_coincidence", { oliviaTrust: 1 })
    ])
  ]),
  B("separate_olivia_yes", "private_olivia", "choice:separate_olivia_location_start:0", [O("Хорошо.")]),
  B("separate_olivia_car", "private_olivia", "choice:separate_olivia_location_start:1", [O("Возможно."), O("Но мы всё ещё не знаем, была ли это одна машина.")]),
  B("separate_olivia_coincidence", "private_olivia", "choice:separate_olivia_location_start:2", [O("Да."), O("Пока именно так.")]),

  B("separate_map_document", "private_olivia", "after:separate_olivia_yes|separate_olivia_car|separate_olivia_coincidence", [
    O("Тогда скину тебе Larks."), N("Оливия отправила местоположение: Larks · River Street · напротив старого кинотеатра Orpheum."),
    O("И ещё раз: это разные дни."), O("Две точки."), O("Не маршрут Харпер."),
    mapDocument("olivia")
  ], { setFlags: { activeMapRoute: "separate" } }),

  B("separate_after_map", "private_olivia", "flagAfter:ravenwoodMapAddedToCase:separate_map_document", [
    O("Получилось открыть?"),
    C([
      option("Да. Теперь хотя бы понимаю, где это всё.", "separate_map_where"), option("Да. Но это просто два места в разные дни.", "separate_map_two"), option("Да. Странный способ знакомиться с Рейвенвудом.", "separate_map_city")
    ])
  ]),
  B("separate_map_where", "private_olivia", "choice:separate_after_map:0", [O("Хорошо."), O("А то для нас эти названия привычные.")]),
  B("separate_map_two", "private_olivia", "choice:separate_after_map:1", [O("Согласна."), O("Пока это просто два места и два разных дня.")]),
  B("separate_map_city", "private_olivia", "choice:separate_after_map:2", [O("Не уверена, что это лучший способ знакомиться с городом.")]),
  B("separate_after_map_end", "private_olivia", "after:separate_map_where|separate_map_two|separate_map_city", [
    O("Если всплывёт ещё какое-то точное место — добавим."), O("И я напишу, если следователь ответит про фото."),
    O("Спасибо, что не объявил машину уликой после одного снимка.")
  ]),

  B("separate_old_phone_start", "private_mia", "after:separate_after_map_end", [
    { type: "pause", delay: 5200 }, { type: "system", text: "Миа в сети.", delay: 600, characterStatus: { id: "mia", online: true } }, M("Ты здесь?"),
    C([
      option("Да. Что такое?", "separate_phone_happened"), option("Ты ещё что-то вспомнила?", "separate_phone_again"),
      option("Судя по «ты здесь?» — да.", "separate_phone_predictable")
    ])
  ]),
  B("separate_phone_happened", "private_mia", "choice:separate_old_phone_start:0", [M("Я опять прокручивала встречу у моста.")]),
  B("separate_phone_again", "private_mia", "choice:separate_old_phone_start:1", [M("Да."), M("И мне всё хуже от того, сколько всего всплывает только сейчас.")]),
  B("separate_phone_predictable", "private_mia", "choice:separate_old_phone_start:2", [M("Настолько предсказуемо?"), M("Но да.")]),

  B("separate_phone_request", "private_mia", "after:separate_phone_happened|separate_phone_again|separate_phone_predictable", [
    M("В тот день у меня был старый телефон."), M("Основной лежал в ремонте."), M("Я разбила экран."),
    M("У Харпер под конец почти сел телефон."), M("Потом выключился совсем."), M("И она попросила мой."),
    M("Сказала, ей нужно быстро кинуть одно сообщение."),
    C([
      option("Ты видела, кому она писала?", "separate_phone_who"), option("И она что-то отправила?", "separate_phone_after"),
      option("У моста, я так понимаю, зарядить свой она не могла.", "separate_phone_charge")
    ])
  ]),
  B("separate_phone_who", "private_mia", "choice:separate_phone_request:0", [M("Нет."), M("Она отошла на несколько шагов."), M("Я не стала смотреть через плечо.")]),
  B("separate_phone_after", "private_mia", "choice:separate_phone_request:1", [M("Она вернула телефон."), M("И сказала, что удалила чат.")]),
  B("separate_phone_charge", "private_mia", "choice:separate_phone_request:2", [M("У моста?"), M("Ага."), M("Розеток там пока не завезли."), M("Поэтому и попросила мой.")]),

  B("separate_phone_deleted", "private_mia", "after:separate_phone_who|separate_phone_after|separate_phone_charge", [
    M("Она прямо сказала: «Я там удалила, ладно?»"), M("Я решила, что написала Дереку."),
    M("Ну или кому-то, кому не хотела писать со своего."), M("И не спросила."),
    C([
      option("И только сейчас вспомнила?", "separate_phone_now"),
      option("Тогда это могло показаться обычным сообщением.", "separate_phone_normal", { miaTrust: 1 }),
      option("Ты уже сказала Оливии?", "separate_phone_olivia")
    ])
  ]),
  B("separate_phone_now", "private_mia", "choice:separate_phone_deleted:0", [M("Да."), M("Он был у неё минуту, может меньше."), M("Тогда это вообще не выглядело чем-то важным.")]),
  B("separate_phone_normal", "private_mia", "choice:separate_phone_deleted:1", [M("Да."), M("Именно."), M("Спасибо.")]),
  B("separate_phone_olivia", "private_mia", "choice:separate_phone_deleted:2", [M("Да."), M("Написала ей перед тем, как написать тебе."), M("Она сказала найти телефон и ничего на нём не трогать.")]),

  B("separate_phone_home", "private_mia", "after:separate_phone_now|separate_phone_normal|separate_phone_olivia", [
    M("Телефон должен быть дома."), M("Я его точно не выбрасывала."), M("Либо коробка с проводами."), M("Либо стол."),
    M("Я сейчас не дома."), M("Через пару часов вернусь и всё перерою."),
    C([
      option("Напиши, когда найдёшь. Даже если он мёртвый.", "separate_phone_write"), option("И следователю напиши до того, как что-то включать.", "separate_phone_police"),
      option("Главное, не потеряй теперь ещё и этот телефон.", "separate_phone_joke")
    ])
  ]),
  B("separate_phone_write", "private_mia", "choice:separate_phone_home:0", [M("Напишу."), M("Даже если он не включится.")]),
  B("separate_phone_police", "private_mia", "choice:separate_phone_home:1", [M("Сообщу."), M("Уже написала, что вспомнила про него."), M("Теперь бы найти сам телефон.")]),
  B("separate_phone_joke", "private_mia", "choice:separate_phone_home:2", [M("Очень смешно."), M("Хотя я даже не знаю, где он лежит."), M("Ладно."), M("Заслужила.")]),
  B("separate_route_phone_end", "private_mia", "after:separate_phone_write|separate_phone_police|separate_phone_joke", [
    M("В общем, приду домой — проверю все ящики."), M("Напишу тебе."), M("И Оливии."),
    M("Потому что теперь я всё равно не усну, пока его не найду.")
  ]),

  B("larks_olivia_goodbye", "private_mia", "after:group_route_phone_end|separate_route_phone_end", [])
];
