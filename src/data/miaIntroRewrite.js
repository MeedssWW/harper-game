const M = (text, delay = 900) => ({ from: "mia", text, delay });
const C = (options) => ({ type: "choice", options });
const option = (text, next, trust = 0) => ({
  text,
  loyalty: {},
  ...(trust ? { trust: { miaTrust: trust } } : {}),
  next
});

export const miaIntroRewriteBeats = [
  {
    id: "intro_mia_private",
    chat: "private_mia",
    trigger: "after:intro_olivia_common",
    unlock: [
      { type: "chats", id: "private_mia" },
      { type: "contacts", id: "mia" }
    ],
    identify: ["mia"],
    messages: [
      { type: "pause", delay: 4200 },
      { type: "system", text: "Миа в сети.", delay: 500, characterStatus: { id: "mia", online: true } },
      M("Привет."),
      M("Это Миа."),
      M("Из того очень удачного общего чата."),
      M("Слушай...", 750),
      M("Я хотела извиниться."),
      M("Я не на тебя злилась."),
      M("Просто там всё сразу навалилось."),
      C([
        option("Всё нормально.", "mia_intro_v2_not_guilty_first"),
        option("Спасибо.", "mia_intro_v2_bad_meeting_first"),
        option("Могла бы сказать это там, а не после того, как вышла.", "mia_intro_v2_should_say", -1)
      ])
    ]
  },
  {
    id: "mia_intro_v2_not_guilty_first",
    chat: "private_mia",
    trigger: "choice:intro_mia_private:0",
    messages: [C([option("Ты хотя бы не пыталась сделать меня виноватым.", "mia_intro_v2_not_guilty", 1)])]
  },
  {
    id: "mia_intro_v2_not_guilty",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_not_guilty_first:0",
    messages: [
      M("Потому что я вообще не понимаю, в чём тебя обвинять."),
      M("В том, что кто-то отправил твой номер?"),
      M("Как будто ты сам его туда вписал.")
    ]
  },
  {
    id: "mia_intro_v2_bad_meeting_first",
    chat: "private_mia",
    trigger: "choice:intro_mia_private:1",
    messages: [C([option("Не самое приятное знакомство получилось.", "mia_intro_v2_bad_meeting")])]
  },
  {
    id: "mia_intro_v2_bad_meeting",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_bad_meeting_first:0",
    messages: [
      M("Да уж."),
      M("Обычно я хотя бы сначала узнаю имя человека."),
      M("А уже потом оказываюсь с ним посреди чужого скандала.", 1050)
    ]
  },
  {
    id: "mia_intro_v2_should_say",
    chat: "private_mia",
    trigger: "choice:intro_mia_private:2",
    messages: [
      M("Могла бы."),
      M("Только там уже никто никого не слушал."),
      M("Но да.", 700),
      M("Понимаю, почему ты злишься.")
    ]
  },
  {
    id: "mia_intro_v2_overwhelmed",
    chat: "private_mia",
    trigger: "after:mia_intro_v2_not_guilty|mia_intro_v2_bad_meeting|mia_intro_v2_should_say",
    messages: [
      M("Я не из-за тебя вышла."),
      M("Просто мне в какой-то момент стало слишком много всего."),
      M("Дерек давит.", 750),
      M("Брук злится.", 750),
      M("Мейсон разговаривает так, будто мы уже все нарушили закон."),
      M("И всё это одновременно."),
      M("Я поняла, что ещё немного — и сама начну на кого-нибудь орать.", 1100),
      C([
        option("Я тоже уже хотел просто закрыть чат.", "mia_intro_v2_close_chat"),
        option("Они всегда так быстро начинают ругаться?", "mia_intro_v2_always_fight"),
        option("Похоже, мой номер просто вытащил наружу то, что у вас давно копилось.", "mia_intro_v2_old_tension")
      ])
    ]
  },
  {
    id: "mia_intro_v2_close_chat",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_overwhelmed:0",
    messages: [M("Честно?"), M("Я бы тебя поняла."), M("Я знаю их несколько лет и всё равно иногда хочу так сделать.", 1050)]
  },
  {
    id: "mia_intro_v2_always_fight",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_overwhelmed:1",
    messages: [
      M("Не всегда."),
      M("Но если Дерек начинает всеми командовать, а Брук это замечает...", 1050),
      M("Ну, дальше обычно ничего хорошего не происходит.")
    ]
  },
  {
    id: "mia_intro_v2_old_tension",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_overwhelmed:2",
    messages: [
      M("Да.", 650),
      M("Примерно так и есть."),
      M("Они и до этого друг на друга злились."),
      M("Просто никто нормально об этом не говорил."),
      M("А потом появился ты — и всё сразу полезло наружу.", 1050)
    ]
  },
  {
    id: "mia_intro_v2_not_your_fault",
    chat: "private_mia",
    trigger: "after:mia_intro_v2_close_chat|mia_intro_v2_always_fight|mia_intro_v2_old_tension",
    messages: [
      M("В общем, ты не развалил нашу компанию одним сообщением."),
      M("Если вдруг успел так подумать."),
      M("Там и без тебя всё было не очень."),
      C([
        option("Успокаивает.", "mia_intro_v2_little_first"),
        option("Я скорее думал, зачем Дерек вообще решил собрать всех вместе.", "mia_intro_v2_why_derek"),
        option("Мне всё равно неприятно, что всё началось из-за моего номера.", "mia_intro_v2_unpleasant")
      ])
    ]
  },
  {
    id: "mia_intro_v2_little_first",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_not_your_fault:0",
    messages: [C([option("Немного.", "mia_intro_v2_little")])]
  },
  {
    id: "mia_intro_v2_little",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_little_first:0",
    messages: [M("Я старалась."), M("Не очень получилось, но старалась.")]
  },
  {
    id: "mia_intro_v2_why_derek",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_not_your_fault:1",
    messages: [
      M("Он хотел быстро получить ответы."),
      M("А когда Дерек хочет что-то быстро, он обычно сначала делает."),
      M("А уже потом думает, стоило ли.")
    ]
  },
  {
    id: "mia_intro_v2_unpleasant",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_not_your_fault:2",
    messages: [
      M("Понимаю."),
      M("Ты просто сидел у себя дома."),
      M("А потом тебя внезапно добавили к шести незнакомым людям и начали требовать объяснений.", 1100),
      M("Я бы тоже чувствовала себя ужасно.")
    ]
  },
  {
    id: "mia_intro_v2_how_are_you",
    chat: "private_mia",
    trigger: "after:mia_intro_v2_little|mia_intro_v2_why_derek|mia_intro_v2_unpleasant",
    messages: [
      M("Ты вообще как?"),
      M("После всего этого."),
      C([
        option("Если честно, до сих пор не понимаю, что происходит.", "mia_intro_v2_confused"),
        option("Меня пугает, что кто-то нашёл именно мой номер.", "mia_intro_v2_scared_number"),
        option("Я просто хочу, чтобы меня оставили в покое.", "mia_intro_v2_left_alone")
      ])
    ]
  },
  {
    id: "mia_intro_v2_confused",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_how_are_you:0",
    messages: [M("Я тоже."), M("А я хотя бы знаю всех этих людей."), M("У тебя вообще никаких причин понимать нет.")]
  },
  {
    id: "mia_intro_v2_scared_number",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_how_are_you:1",
    messages: [
      M("Да.", 650),
      M("Вот это меня тоже пугает."),
      M("Твой номер ведь не мог просто сам появиться у Харпер."),
      M("Кто-то нашёл именно тебя."),
      M("А зачем — вообще непонятно.")
    ]
  },
  {
    id: "mia_intro_v2_left_alone",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_how_are_you:2",
    messages: [
      M("Понимаю."), M("Правда.", 700),
      M("Только не уверена, что после такого сообщения получится просто забыть обо всём.", 1050),
      M("Даже если больше никто не напишет.")
    ]
  },
  {
    id: "mia_intro_v2_explanations",
    chat: "private_mia",
    trigger: "after:mia_intro_v2_confused|mia_intro_v2_scared_number|mia_intro_v2_left_alone",
    messages: [
      M("Я всё время пытаюсь придумать нормальное объяснение."),
      M("Что это ошибка."),
      M("Или Харпер случайно отправила не тот контакт."),
      M("Но потом вспоминаю, что она отправила только номер."),
      M("Без имени."), M("Без объяснения."),
      M("И опять ничего не сходится."),
      C([
        option("Ты думаешь, это действительно отправила Харпер?", "mia_intro_v2_was_harper"),
        option("А ты сама мне веришь?", "mia_intro_v2_believes")
      ])
    ]
  },
  {
    id: "mia_intro_v2_was_harper",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_explanations:0",
    messages: [
      M("Не знаю."),
      M("Если это была она, то почему просто не написать, кто ты?"),
      M("Или зачем ты нужен?"),
      M("А если не она..."),
      M("Тогда её телефон у кого-то другого."),
      M("И этот вариант вообще мерзкий.")
    ]
  },
  {
    id: "mia_intro_v2_believes",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_explanations:1",
    messages: [
      M("Я тебя не знаю."),
      M("Но одного номера как-то маловато, чтобы решить, что ты виноват."),
      M("Особенно когда ты сам выглядишь так, будто хочешь получить ответы не меньше нашего.", 1100)
    ]
  },
  {
    id: "mia_intro_v2_no_answers",
    chat: "private_mia",
    trigger: "after:mia_intro_v2_was_harper|mia_intro_v2_believes",
    messages: [
      M("И самое неприятное, что ты, похоже, правда ничего не понимаешь."),
      M("То есть даже спросить нормально не у кого."),
      C([
        option("Поверь, меня это не радует.", "mia_intro_v2_not_happy"),
        option("Спасибо. Очень обнадёживает.", "mia_intro_v2_encouraging"),
        option("Может, меня вообще выбрали случайно.", "mia_intro_v2_random")
      ])
    ]
  },
  {
    id: "mia_intro_v2_not_happy",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_no_answers:0",
    messages: [M("Верю."), M("Прости."), M("Иногда я забываю, что для тебя всё это ещё страннее, чем для нас."), M("Мы хотя бы знаем Харпер.")]
  },
  {
    id: "mia_intro_v2_encouraging",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_no_answers:1",
    messages: [M("Да, я умею поддержать."), M("Обращайся."), M("Хотя нет."), M("Лучше не надо.")]
  },
  {
    id: "mia_intro_v2_random",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_no_answers:2",
    messages: [M("Может."), M("Но тогда кто-то зачем-то решил втянуть совершенно случайного человека.", 1050), M("Тоже не особо хороший вариант.")]
  },
  {
    id: "mia_intro_v2_harper_hated_chat",
    chat: "private_mia",
    trigger: "after:mia_intro_v2_not_happy|mia_intro_v2_encouraging|mia_intro_v2_random",
    messages: [
      M("Харпер бы, кстати, возненавидела тот чат."),
      M("Особенно то, что Дерек собрал всех и решил всё за остальных."),
      M("Она терпеть не могла, когда кто-то так делал."),
      C([
        option("Вы давно дружили?", "mia_intro_v2_friends_long"),
        option("Какой она была с тобой?", "mia_intro_v2_harper_with_mia"),
        option("Тебе нормально сейчас о ней говорить?", "mia_intro_v2_ok_talk", 1)
      ])
    ]
  },
  {
    id: "mia_intro_v2_friends_long",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_harper_hated_chat:0",
    messages: [M("Несколько лет."), M("Хотя с Харпер можно было неделю не разговаривать."), M("А потом она писала как ни в чём не бывало."), M("Будто мы закончили разговор пять минут назад.")]
  },
  {
    id: "mia_intro_v2_harper_with_mia",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_harper_hated_chat:1",
    messages: [
      M("Не знаю, как нормально объяснить."), M("Она могла полдня не отвечать на обычное сообщение."),
      M("А потом прислать фотографию какой-нибудь ужасной кружки из магазина."), M("И спросить, купить ли её мне."),
      M("Обычно я говорила нет."), M("Один раз она всё равно купила.")
    ]
  },
  {
    id: "mia_intro_v2_ok_talk",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_harper_hated_chat:2",
    messages: [M("Не очень."), M("Но когда говоришь про обычные вещи, становится немного легче."), M("Хотя бы на пару минут.")]
  },
  {
    id: "mia_intro_v2_random_things",
    chat: "private_mia",
    trigger: "after:mia_intro_v2_friends_long|mia_intro_v2_harper_with_mia|mia_intro_v2_ok_talk",
    messages: [
      M("Она вообще любила отправлять всякую ерунду."), M("Странные вывески."), M("Собак в одежде."),
      M("Людей, которые уснули в автобусе в какой-нибудь невозможной позе."),
      M("А потом могла исчезнуть на весь день и ничего не отвечать."), M("Раньше это не казалось странным."),
      M("А сейчас я каждый раз думаю, что, может, мы что-то пропустили.", 1050),
      C([
        option("Сейчас любая мелочь будет казаться важной.", "mia_intro_v2_every_detail"),
        option("Наверное, ты постоянно прокручиваешь последние разговоры.", "mia_intro_v2_replay"),
        option("Ты себя в чём-то винишь?", "mia_intro_v2_blame")
      ])
    ]
  },
  {
    id: "mia_intro_v2_every_detail",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_random_things:0",
    messages: [M("Да."), M("Я уже перечитывала нашу переписку."), M("Причём несколько раз."), M("И каждый раз нахожу что-то новое."), M("Хотя там, скорее всего, вообще ничего нет.")]
  },
  {
    id: "mia_intro_v2_replay",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_random_things:1",
    messages: [M("Постоянно."), M("Что она сказала."), M("Как посмотрела."), M("Почему поставила точку там, где обычно не ставила."), M("Звучит глупо, но я правда уже до этого дошла.")]
  },
  {
    id: "mia_intro_v2_blame",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_random_things:2",
    messages: [M("Не знаю."), M("Наверное."), M("Всё время кажется, что я должна была что-то заметить."), M("Хотя даже не понимаю что.")]
  },
  {
    id: "mia_intro_v2_waiting",
    chat: "private_mia",
    trigger: "after:mia_intro_v2_every_detail|mia_intro_v2_replay|mia_intro_v2_blame",
    messages: [
      M("Я всё ещё жду, что она напишет."), M("Что-нибудь совершенно обычное."),
      M("Типа у неё разрядился телефон."), M("Или она опять потеряла зарядку."),
      M("А потом вспоминаю, что прошло уже два дня."),
      C([
        option("Ты сама как?", "mia_intro_v2_mia_how", 1),
        option("Наверное, ожидание сейчас хуже всего.", "mia_intro_v2_wait_worst"),
        option("Она ещё может вернуться.", "mia_intro_v2_may_return")
      ])
    ]
  },
  {
    id: "mia_intro_v2_mia_how",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_waiting:0",
    messages: [M("Если честно?"), M("Не очень."), M("Я почти не спала."), M("Каждый раз, когда приходит сообщение, сначала думаю, что это она."), M("Спасибо, что спросил.")]
  },
  {
    id: "mia_intro_v2_wait_worst",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_waiting:1",
    messages: [M("Да."), M("Потому что ты вообще ничего не можешь сделать."), M("Просто смотришь на телефон."), M("Проверяешь, не пропустил ли сообщение."), M("Хотя точно знаешь, что не пропустил.")]
  },
  {
    id: "mia_intro_v2_may_return",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_waiting:2",
    messages: [M("Может."), M("Я стараюсь так думать."), M("Просто с каждым часом получается немного хуже.")]
  },
  {
    id: "mia_intro_v2_too_sad",
    chat: "private_mia",
    trigger: "after:mia_intro_v2_mia_how|mia_intro_v2_wait_worst|mia_intro_v2_may_return",
    messages: [
      M("Ладно."), M("Я не хотела делать этот разговор совсем грустным."),
      M("Вообще я писала, чтобы извиниться."), M("А теперь опять вывалила на тебя всё подряд."),
      C([
        option("Ничего.", "mia_intro_v2_understand_first"),
        option("Можешь говорить, если тебе от этого легче.", "mia_intro_v2_can_talk", 1),
        option("Сегодня все почему-то решили выговориться именно мне.", "mia_intro_v2_everyone_talk", -1)
      ])
    ]
  },
  {
    id: "mia_intro_v2_understand_first",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_too_sad:0",
    messages: [C([option("Мне лучше понимать, что происходит.", "mia_intro_v2_understand")])]
  },
  {
    id: "mia_intro_v2_understand",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_understand_first:0",
    messages: [M("Хорошо."), M("А то у нас пока после каждого разговора вопросов становится только больше."), M("Очень продуктивно.")]
  },
  {
    id: "mia_intro_v2_can_talk",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_too_sad:1",
    messages: [M("Спасибо."), M("Только ты скажи, если меня станет слишком много."), M("Я иногда сначала пишу всё подряд."), M("А уже потом понимаю, что можно было остановиться сообщений десять назад.", 1050)]
  },
  {
    id: "mia_intro_v2_everyone_talk",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_too_sad:2",
    messages: [M("Прости."), M("Наверное, потому что у тебя пока нет ни с кем из нас старых ссор."), M("Очень удобный человек."), M("Для нас, конечно.")]
  },
  {
    id: "mia_intro_v2_stay_connected",
    chat: "private_mia",
    trigger: "after:mia_intro_v2_understand|mia_intro_v2_can_talk|mia_intro_v2_everyone_talk",
    messages: [
      M("Ты вообще собираешься оставаться на связи?"), M("Не в смысле помогать нам искать Харпер."),
      M("Просто..."), M("Ты ведь можешь сейчас всех заблокировать."), M("И я бы даже не стала тебя винить."),
      C([
        option("Пока останусь.", "mia_intro_v2_stay_first"),
        option("Не знаю.", "mia_intro_v2_forget_first"),
        option("Если появится ещё один такой общий чат, тогда точно уйду.", "mia_intro_v2_another_group")
      ])
    ]
  },
  {
    id: "mia_intro_v2_stay_first",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_stay_connected:0",
    messages: [C([option("Я хочу понять, почему выбрали мой номер.", "mia_intro_v2_stay")])]
  },
  {
    id: "mia_intro_v2_stay",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_stay_first:0",
    messages: [M("Я бы тоже потом целыми днями об этом думала."), M("И проверяла телефон каждые пять минут, хотя сама не знала бы зачем.", 1050)]
  },
  {
    id: "mia_intro_v2_forget_first",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_stay_connected:1",
    messages: [C([option("Но просто забыть обо всём уже не получится.", "mia_intro_v2_forget")])]
  },
  {
    id: "mia_intro_v2_forget",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_forget_first:0",
    messages: [M("Да."), M("Даже если больше никто тебе не напишет, этот вопрос всё равно останется.", 1050)]
  },
  {
    id: "mia_intro_v2_another_group",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_stay_connected:2",
    messages: [M("Справедливо."), M("Если меня опять добавят без предупреждения, я, наверное, уйду вместе с тобой.", 1050), M("Хотя лучше пусть следующего раза вообще не будет.")]
  },
  {
    id: "mia_intro_v2_contact_us",
    chat: "private_mia",
    trigger: "after:mia_intro_v2_stay|mia_intro_v2_forget|mia_intro_v2_another_group",
    messages: [
      M("Если Дерек опять начнёт засыпать тебя сообщениями, можешь сначала написать мне.", 1050),
      M("Или Оливии."), M("Хотя бы поймём, он правда узнал что-то новое или опять просто паникует.", 1050),
      C([
        option("Хорошо.", "mia_intro_v2_write_first"),
        option("Посмотрим.", "mia_intro_v2_careful_first"),
        option("Оливии я пока доверяю немного больше.", "mia_intro_v2_trust_olivia")
      ])
    ]
  },
  {
    id: "mia_intro_v2_write_first",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_contact_us:0",
    messages: [C([option("Ты тоже можешь мне написать.", "mia_intro_v2_write")])]
  },
  {
    id: "mia_intro_v2_write",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_write_first:0",
    messages: [M("Хорошо."), M("Постараюсь в следующий раз начать разговор не с извинений.", 1000)]
  },
  {
    id: "mia_intro_v2_careful_first",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_contact_us:1",
    messages: [C([option("После сегодняшнего я осторожнее с новыми чатами.", "mia_intro_v2_careful")])]
  },
  {
    id: "mia_intro_v2_careful",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_careful_first:0",
    messages: [M("Правильно."), M("Особенно если там сразу семь незнакомых людей."), M("Это обычно плохой знак.")]
  },
  {
    id: "mia_intro_v2_trust_olivia",
    chat: "private_mia",
    trigger: "choice:mia_intro_v2_contact_us:2",
    messages: [M("Нормально."), M("Я бы тоже доверяла Оливии больше, чем человеку, который начал разговор со слов «я из того ужасного чата».", 1100), M("Планка опять не очень высокая.")]
  },
  {
    id: "intro_mia_goodnight",
    chat: "private_mia",
    trigger: "after:mia_intro_v2_write|mia_intro_v2_careful|mia_intro_v2_trust_olivia",
    setFlags: { introComplete: true },
    messages: [
      M("Ладно."), M("Я пойду попробую немного поспать."), M("Или хотя бы полежу и сделаю вид."),
      M("Я заварила чай ещё до того, как написала тебе."), M("Он теперь, наверное, ледяной."),
      M("В общем..."), M("Спасибо, что ответил."), M("И ещё раз извини за группу."),
      { type: "system", text: "Миа вышла из сети.", delay: 850, characterStatus: { id: "mia", online: false } }
    ]
  }
];
