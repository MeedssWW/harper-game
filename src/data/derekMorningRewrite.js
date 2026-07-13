const D = (text, delay = 900) => ({ from: "derek", text, delay });
const C = (options) => ({ type: "choice", options });
const option = (text, next, trust = 0) => ({
  text,
  loyalty: {},
  ...(trust ? { trust: { derekTrust: trust } } : {}),
  next
});

export const derekMorningRewriteBeats = [
  {
    id: "morning_derek_photos",
    chat: "private_derek",
    trigger: "after:intro_post_case_notes",
    messages: [
      { type: "system", text: "Дерек в сети.", delay: 600, characterStatus: { id: "derek", online: true } },
      D("Ты не спишь?"),
      C([
        option("Уже нет. Что случилось?", "morning_derek_wake_news"),
        option("Ты так написал, будто что-то нашли.", "morning_derek_wake_found"),
        option("Дерек, если новостей нет, дай мне хотя бы проснуться.", "morning_derek_wake_sleep")
      ])
    ]
  },
  {
    id: "morning_derek_wake_news",
    chat: "private_derek",
    trigger: "choice:morning_derek_photos:0",
    messages: [D("Ничего."), D("То есть ничего нового пока не нашли.")]
  },
  {
    id: "morning_derek_wake_found",
    chat: "private_derek",
    trigger: "choice:morning_derek_photos:1",
    messages: [D("Нет."), D("Я бы сразу сказал, если бы нашли.")]
  },
  {
    id: "morning_derek_wake_sleep",
    chat: "private_derek",
    trigger: "choice:morning_derek_photos:2",
    messages: [D("Ладно."), D("Извини."), D("Я сам почти не спал.")]
  },
  {
    id: "morning_derek_more_photos",
    chat: "private_derek",
    trigger: "after:morning_derek_wake_news|morning_derek_wake_found|morning_derek_wake_sleep",
    messages: [
      D("Я нашёл ещё несколько фотографий Харпер."),
      D("Вчера ты видел только одну."),
      D("Посмотри остальные."),
      D("Внимательно, ладно?"),
      C([
        option("Присылай. Я посмотрю.", "morning_derek_send_now"),
        option("Ты всё ещё надеешься, что я вдруг её узнаю?", "morning_derek_still_hoping"),
        option("Я посмотрю.", "morning_derek_no_justify_first")
      ])
    ]
  },
  {
    id: "morning_derek_send_now",
    chat: "private_derek",
    trigger: "choice:morning_derek_more_photos:0",
    messages: [D("Сейчас.")]
  },
  {
    id: "morning_derek_still_hoping",
    chat: "private_derek",
    trigger: "choice:morning_derek_more_photos:1",
    messages: [D("Я не знаю."), D("Может, на другой фотографии она покажется знакомой."), D("Я просто пытаюсь проверить всё, что могу.")]
  },
  {
    id: "morning_derek_no_justify_first",
    chat: "private_derek",
    trigger: "choice:morning_derek_more_photos:2",
    messages: [C([option("Но не хочу опять оправдываться за то, что её не знаю.", "morning_derek_no_justify")])]
  },
  {
    id: "morning_derek_no_justify",
    chat: "private_derek",
    trigger: "choice:morning_derek_no_justify_first:0",
    messages: [D("Хорошо."), D("Я не буду опять тебя расспрашивать."), D("Просто посмотри.")]
  },
  {
    id: "morning_derek_photo_set",
    chat: "private_derek",
    trigger: "after:morning_derek_send_now|morning_derek_still_hoping|morning_derek_no_justify",
    messages: [
      { from: "narrator", text: "Дерек отправил несколько фотографий.", delay: 700 },
      { from: "derek", type: "image", src: "src/assets/harper_photos/harper_party_crown.webp?v=116", caption: "Харпер на дне рождения", delay: 800 },
      { from: "derek", type: "image", src: "src/assets/harper_photos/harper_mia_olivia_sun.webp?v=116", caption: "Харпер, Миа и Оливия", delay: 800 },
      { from: "derek", type: "image", src: "src/assets/harper_photos/harper_derek_blurred_selfie.webp?v=116", caption: "Харпер и Дерек", delay: 800 },
      { from: "derek", type: "image", src: "src/assets/harper_photos/harper_street_cat.webp?v=116", caption: "Харпер и уличный кот", delay: 800 },
      { from: "derek", type: "image", src: "src/assets/harper_photos/harper_morrow_brooke.webp?v=116", caption: "Morrow, вечер исчезновения", delay: 900 },
      D("Ну?"),
      C([
        option("Нет. Я её не узнаю.", "morning_derek_dont_recognize"),
        option("Нет.", "morning_derek_not_name_first"),
        option("Нет.", "morning_derek_awkward_first")
      ])
    ]
  },
  {
    id: "morning_derek_dont_recognize",
    chat: "private_derek",
    trigger: "choice:morning_derek_photo_set:0",
    messages: [D("Чёрт."), D("Ладно.")]
  },
  {
    id: "morning_derek_not_name_first",
    chat: "private_derek",
    trigger: "choice:morning_derek_photo_set:1",
    messages: [C([option("Но теперь она хотя бы не кажется мне просто именем.", "morning_derek_not_name")])]
  },
  {
    id: "morning_derek_not_name",
    chat: "private_derek",
    trigger: "choice:morning_derek_not_name_first:0",
    messages: [D("Да."), D("Она не была просто..."), D("Ладно."), D("Я понял, что ты имеешь в виду.")]
  },
  {
    id: "morning_derek_awkward_first",
    chat: "private_derek",
    trigger: "choice:morning_derek_photo_set:2",
    messages: [C([option("И мне уже неловко постоянно повторять одно и то же.", "morning_derek_awkward")])]
  },
  {
    id: "morning_derek_awkward",
    chat: "private_derek",
    trigger: "choice:morning_derek_awkward_first:0",
    messages: [D("Тебе не должно быть неловко."), D("Это я продолжаю спрашивать."), D("Просто я всё ещё надеялся, что хоть что-нибудь совпадёт.")]
  },
  {
    id: "morning_derek_morrow",
    chat: "private_derek",
    trigger: "after:morning_derek_dont_recognize|morning_derek_not_name|morning_derek_awkward",
    messages: [
      D("Последнюю фотографию сделала Брук."),
      D("В вечер исчезновения."),
      D("Когда полиция попросила последние снимки Харпер, Брук отправила её им."),
      D("И потом переслала мне."),
      D("Они сидели в кафе Morrow на Центральной улице."),
      D("Это не Larks."),
      D("Харпер иногда заходила туда с Брук."),
      D("Через несколько минут после фотографии ей кто-то позвонил."),
      D("Она вышла поговорить."),
      D("Потом вернулась и сказала, что ей нужно кое с кем встретиться."),
      D("С кем — не объяснила."),
      C([
        option("Брук, наверное, теперь постоянно прокручивает этот вечер в голове.", "morning_derek_brooke_replays"),
        option("После звонка Харпер выглядела испуганной?", "morning_derek_harper_afraid"),
        option("Ты рассказываешь так подробно, будто сам там был.", "morning_derek_not_there")
      ])
    ]
  },
  {
    id: "morning_derek_brooke_replays",
    chat: "private_derek",
    trigger: "choice:morning_derek_morrow:0",
    messages: [D("Думаю, да."), D("Она почти ничего не говорит об этом."), D("Но каждый раз злится, когда кто-то снова начинает спрашивать.")]
  },
  {
    id: "morning_derek_harper_afraid",
    chat: "private_derek",
    trigger: "choice:morning_derek_morrow:1",
    messages: [D("Брук сказала, что скорее напряжённой."), D("Будто торопилась и одновременно не хотела уходить."), D("Но это уже её слова.")]
  },
  {
    id: "morning_derek_not_there",
    chat: "private_derek",
    trigger: "choice:morning_derek_morrow:2",
    messages: [D("Меня там не было."), D("Брук несколько раз рассказывала всё полиции."), D("И потом ещё мне."), D("Я просто запомнил.")]
  },
  {
    id: "morning_derek_left_cafe",
    chat: "private_derek",
    trigger: "after:morning_derek_brooke_replays|morning_derek_harper_afraid|morning_derek_not_there",
    messages: [
      D("Брук спросила, всё ли нормально."),
      D("Харпер сказала, что да."),
      D("Потом забрала сумку и ушла одна."),
      D("Телефон был у неё."),
      D("Полиция уже знает про звонок."),
      D("Они запросили записи с камер кафе и данные по звонкам."),
      D("Но нам пока ничего не говорят."),
      C([
        option("Брук винит себя за то, что не остановила её?", "morning_derek_brooke_blames"),
        option("Харпер тебе что-нибудь написала после кафе?", "morning_derek_after_cafe_message"),
        option("Она часто уходила вот так, ничего не объяснив?", "morning_derek_often_left")
      ])
    ]
  },
  {
    id: "morning_derek_brooke_blames",
    chat: "private_derek",
    trigger: "choice:morning_derek_left_cafe:0",
    messages: [D("Наверное."), D("Но она никогда этого не скажет."), D("Скорее начнёт злиться на того, кто спросил.")]
  },
  {
    id: "morning_derek_after_cafe_message",
    chat: "private_derek",
    trigger: "choice:morning_derek_left_cafe:1",
    messages: [D("Нет."), D("Я писал ей сам."), D("Она не ответила."), D("Потом телефон стал недоступен.")]
  },
  {
    id: "morning_derek_often_left",
    chat: "private_derek",
    trigger: "choice:morning_derek_left_cafe:2",
    messages: [D("Иногда."), D("Если злилась или не хотела разговаривать."), D("Но потом всё равно писала."), D("Хотя бы коротко.")]
  },
  {
    id: "morning_derek_not_voluntary",
    chat: "private_derek",
    trigger: "after:morning_derek_brooke_blames|morning_derek_after_cafe_message|morning_derek_often_left",
    messages: [
      D("Она могла исчезнуть на несколько часов."),
      D("Могла не брать трубку."),
      D("Но не на два дня."),
      D("И не так, чтобы вообще никто не знал, где она."),
      D("Поэтому я не верю, что она просто решила уехать."),
      C([
        option("Я понимаю, почему ты за всё цепляешься.", "morning_derek_understand", 1),
        option("Но ты всё равно не можешь знать наверняка.", "morning_derek_not_sure"),
        option("Тебя больше пугает, что с ней что-то случилось, или что она сама решила исчезнуть?", "morning_derek_biggest_fear")
      ])
    ]
  },
  {
    id: "morning_derek_understand",
    chat: "private_derek",
    trigger: "choice:morning_derek_not_voluntary:0",
    messages: [D("А что мне ещё делать?"), D("Просто сидеть и ждать?"), D("Я уже два дня только это и делаю.")]
  },
  {
    id: "morning_derek_not_sure",
    chat: "private_derek",
    trigger: "choice:morning_derek_not_voluntary:1",
    messages: [D("Знаю."), D("Мне это уже все сказали."), D("Полиция."), D("Друзья."), D("Теперь ты.")]
  },
  {
    id: "morning_derek_biggest_fear",
    chat: "private_derek",
    trigger: "choice:morning_derek_not_voluntary:2",
    messages: [D("Что с ней что-то случилось."), D("Если бы она просто не хотела меня видеть..."), D("Ладно."), D("Главное, чтобы она была жива.")]
  },
  {
    id: "morning_derek_police_number",
    chat: "private_derek",
    trigger: "after:morning_derek_understand|morning_derek_not_sure|morning_derek_biggest_fear",
    messages: [
      D("Я вчера передал полиции твой номер."),
      D("И скрин сообщения."),
      D("Они сказали, что проверят."),
      C([
        option("Правильно. Я бы сделал то же самое.", "morning_derek_police_right", 1),
        option("Понимаю.", "morning_derek_police_unpleasant_first"),
        option("Ты мог хотя бы предупредить меня.", "morning_derek_should_warn", -1)
      ])
    ]
  },
  {
    id: "morning_derek_police_right",
    chat: "private_derek",
    trigger: "choice:morning_derek_police_number:0",
    messages: [D("Хорошо."), D("Я не знал, как ты отреагируешь.")]
  },
  {
    id: "morning_derek_police_unpleasant_first",
    chat: "private_derek",
    trigger: "choice:morning_derek_police_number:1",
    messages: [C([option("Но мне всё равно неприятно, что мой номер теперь у полиции.", "morning_derek_police_unpleasant")])]
  },
  {
    id: "morning_derek_police_unpleasant",
    chat: "private_derek",
    trigger: "choice:morning_derek_police_unpleasant_first:0",
    messages: [D("Да."), D("Наверное, мне стоило написать тебе до этого."), D("Просто я не мог не передать им сообщение.")]
  },
  {
    id: "morning_derek_should_warn",
    chat: "private_derek",
    trigger: "choice:morning_derek_police_number:2",
    messages: [D("А что бы это изменило?"), D("Я всё равно должен был им всё показать."), D("Это единственное сообщение с телефона Харпер.")]
  },
  {
    id: "morning_derek_not_accusing",
    chat: "private_derek",
    trigger: "after:morning_derek_police_right|morning_derek_police_unpleasant|morning_derek_should_warn",
    messages: [
      D("Они спросили, знаю ли я тебя."),
      D("Я сказал, что нет."),
      D("Если им понадобится, они сами с тобой свяжутся."),
      D("Я не пытаюсь сделать тебя виноватым."),
      D("Ладно?"),
      D("Я просто не понимаю, почему Харпер отправила именно твой номер."),
      C([
        option("Я знаю.", "morning_derek_only_lead_first"),
        option("Иногда всё равно кажется, что ты ждёшь от меня какого-то признания.", "morning_derek_confession"),
        option("Я тоже хочу понять, почему выбрали именно меня.", "morning_derek_same_question")
      ])
    ]
  },
  {
    id: "morning_derek_only_lead_first",
    chat: "private_derek",
    trigger: "choice:morning_derek_not_accusing:0",
    messages: [C([option("Ты просто хватаешься за единственное, что у тебя есть.", "morning_derek_only_lead", 1)])]
  },
  {
    id: "morning_derek_only_lead",
    chat: "private_derek",
    trigger: "choice:morning_derek_only_lead_first:0",
    messages: [D("Да."), D("Наверное."), D("Просто больше ничего нового нет.")]
  },
  {
    id: "morning_derek_confession",
    chat: "private_derek",
    trigger: "choice:morning_derek_not_accusing:1",
    messages: [D("Я не жду признания."), D("Я хочу услышать хоть какое-то объяснение."), D("Но понимаю, что у тебя его нет.")]
  },
  {
    id: "morning_derek_same_question",
    chat: "private_derek",
    trigger: "choice:morning_derek_not_accusing:2",
    messages: [D("Тогда мы хотя бы в этом согласны."), D("Потому что я уже не знаю, что ещё проверять.")]
  },
  {
    id: "morning_derek_police_contact",
    chat: "private_derek",
    trigger: "after:morning_derek_only_lead|morning_derek_confession|morning_derek_same_question",
    messages: [
      D("Если полиция тебе напишет или позвонит, скажи мне."),
      D("Не обязательно пересказывать всё."),
      D("Просто скажи, связались они с тобой или нет."),
      C([
        option("Если это будет касаться Харпер — скажу.", "morning_derek_will_tell"),
        option("Сначала я поговорю с ними сам.", "morning_derek_talk_first"),
        option("Хорошо.", "morning_derek_sleep_first")
      ])
    ]
  },
  {
    id: "morning_derek_will_tell",
    chat: "private_derek",
    trigger: "choice:morning_derek_police_contact:0",
    messages: [D("Хорошо."), D("Спасибо.")]
  },
  {
    id: "morning_derek_talk_first",
    chat: "private_derek",
    trigger: "choice:morning_derek_police_contact:1",
    messages: [D("Ладно."), D("Я не прошу тебя отправлять мне весь разговор."), D("Просто хочу знать, проверяют ли они твой номер.")]
  },
  {
    id: "morning_derek_sleep_first",
    chat: "private_derek",
    trigger: "choice:morning_derek_police_contact:2",
    messages: [C([option("А ты хотя бы попробуй немного поспать.", "morning_derek_try_sleep", 1)])]
  },
  {
    id: "morning_derek_try_sleep",
    chat: "private_derek",
    trigger: "choice:morning_derek_sleep_first:0",
    messages: [D("Не думаю, что получится."), D("Но ладно."), D("Попробую.")]
  },
  {
    id: "morning_derek_photos_common",
    chat: "private_derek",
    trigger: "after:morning_derek_will_tell|morning_derek_talk_first|morning_derek_try_sleep",
    messages: [
      D("И..."),
      D("Спасибо, что посмотрел фотографии."),
      D("Не знаю, почему я так надеялся, что ты её узнаешь."),
      D("Просто хотелось, чтобы хоть что-то стало понятнее."),
      { type: "system", text: "Дерек не в сети.", delay: 800, characterStatus: { id: "derek", online: false } }
    ]
  }
];
