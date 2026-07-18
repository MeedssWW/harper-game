const choice = (text, next, extra = {}) => ({ text, loyalty: {}, next, ...extra });
const say = (from, text, delay = 760, extra = {}) => ({ from, text, delay, ...extra });

export const episode1LivingRewriteBeats = [
  {
    id: 'ep1_olivia_after_group',
    chat: 'private_olivia',
    trigger: 'after:intro_group_seven',
    identify: ['olivia'],
    messages: [
      { type: 'pause', delay: 2600 },
      { type: 'system', text: 'Оливия в сети.', delay: 450, characterStatus: { id: 'olivia', online: true } },
      say('olivia', 'Привет.'),
      say('olivia', 'Это Оливия.'),
      say('olivia', 'Хотя да, ты и так видишь 😅'),
      say('olivia', 'Я хотела извиниться за тот чат.'),
      say('olivia', 'Дерек не должен был добавлять тебя без спроса, а мы не должны были набрасываться всей толпой.'),
      { type: 'choice', options: [
        choice('Ничего. У вас подруга пропала, я понимаю.', 'ep1_olivia_apology_kind', { trust: { oliviaTrust: 1 } }),
        choice('Если честно, знакомство получилось так себе.', 'ep1_olivia_apology_dry'),
        choice('Ты хотя бы пыталась всех остановить.', 'ep1_olivia_apology_support')
      ] }
    ]
  },
  {
    id: 'ep1_olivia_apology_kind', chat: 'private_olivia', trigger: 'choice:ep1_olivia_after_group:0',
    messages: [say('olivia', 'Всё равно. Ты вообще не понимал, куда попал, а через минуту уже оправдывался перед незнакомыми людьми.')]
  },
  {
    id: 'ep1_olivia_apology_dry', chat: 'private_olivia', trigger: 'choice:ep1_olivia_after_group:1',
    messages: [say('olivia', 'Это очень мягко сказано.'), say('olivia', 'Со стороны там, наверное, был просто дурдом.')]
  },
  {
    id: 'ep1_olivia_apology_support', chat: 'private_olivia', trigger: 'choice:ep1_olivia_after_group:2',
    messages: [say('olivia', 'Не сразу.'), say('olivia', 'Сначала я просто смотрела, как всё летит в стену. Так что не знаю, считается ли.')]
  },
  {
    id: 'ep1_olivia_feed_offer',
    chat: 'private_olivia',
    trigger: 'after:ep1_olivia_apology_kind|ep1_olivia_apology_dry|ep1_olivia_apology_support',
    setFlags: { ravenFeedUnlocked: true },
    unlock: [{ type: 'apps', id: 'social' }],
    messages: [
      say('olivia', 'Ты ведь до сегодня вообще не слышал про Рейвенвуд?'),
      { type: 'choice', options: [
        choice('Вообще нет. Для меня это пока просто название.', 'ep1_olivia_city_unknown'),
        choice('После вашего чата ощущение, будто я уже всем там должен.', 'ep1_olivia_city_joke')
      ] }
    ]
  },
  { id: 'ep1_olivia_city_unknown', chat: 'private_olivia', trigger: 'choice:ep1_olivia_feed_offer:0', messages: [say('olivia', 'Вот. Я поэтому и подумала, что тебе нужен хоть какой-то контекст.')] },
  { id: 'ep1_olivia_city_joke', chat: 'private_olivia', trigger: 'choice:ep1_olivia_feed_offer:1', messages: [say('olivia', 'Поверь, это очень точное первое впечатление о Рейвенвуде.'), say('olivia', 'Но город не всегда такой.') ] },
  {
    id: 'ep1_olivia_feed_link',
    chat: 'private_olivia',
    trigger: 'after:ep1_olivia_city_unknown|ep1_olivia_city_joke',
    messages: [
      say('olivia', 'У нас есть RavenFeed. Что-то вроде местной соцсети.'),
      say('olivia', 'Там половина города спорит из-за парковки, а вторая половина выкладывает дождь, будто его никто раньше не видел.'),
      say('olivia', 'Я скинула приглашение. Посмотри, если хочешь.'),
      { from: 'olivia', type: 'app', title: 'RavenFeed', subtitle: 'Люди, места и новости Рейвенвуда', text: 'Открыть RavenFeed', documentId: 'ravenfeed_invite', delay: 650 },
      { type: 'choice', options: [
        choice('Открыть RavenFeed', 'ep1_open_ravenfeed_direct', { sendMessage: false }),
        choice('Сначала скажи: там про меня уже пишут?', 'ep1_feed_worry')
      ] }
    ]
  },
  { id: 'ep1_feed_worry', chat: 'private_olivia', trigger: 'choice:ep1_olivia_feed_link:1', messages: [say('olivia', 'Нет. И я очень надеюсь, что так и останется.'), say('olivia', 'Если что-то появится, я скажу.') , { type: 'choice', options: [choice('Ладно. Открою.', 'ep1_open_ravenfeed')] }] },
  {
    id: 'ep1_open_ravenfeed', chat: 'private_olivia', trigger: 'after:ep1_feed_worry',
    messages: [{ type: 'navigate', screen: 'social', delay: 250 }, { type: 'wait_flag', flag: 'ravenFeedOpened', delay: 300 }]
  },
  {
    id: 'ep1_open_ravenfeed_direct', chat: 'private_olivia', trigger: 'choice:ep1_olivia_feed_link:0',
    messages: [{ type: 'navigate', screen: 'social', delay: 250 }, { type: 'wait_flag', flag: 'ravenFeedOpened', delay: 300 }]
  },
  {
    id: 'ep1_ravenfeed_first_look',
    chat: 'private_olivia',
    trigger: 'after:ep1_open_ravenfeed|ep1_open_ravenfeed_direct',
    messages: [{ type: 'pause', delay: 2200 }]
  },
  {
    id: 'ep1_olivia_after_feed',
    chat: 'private_olivia',
    trigger: 'after:ep1_ravenfeed_first_look',
    setFlags: { brookeSearchPostLive: true },
    messages: [
      { type: 'pause', delay: 1700 },
      { type: 'app_notification', title: 'RavenFeed', text: 'Брук Хейз опубликовала объявление о поисках Харпер', options: { app: 'social' }, delay: 700 },
      say('olivia', 'Брук только что выложила объявление о поисках.'),
      say('olivia', 'Если будешь читать комментарии, не принимай каждую версию за факт.'),
      say('olivia', 'А вообще... ну как тебе город?'),
      { type: 'choice', options: [
        choice('Я уже переживаю за собаку в жёлтом дождевике.', 'ep1_feed_dog'),
        choice('Теперь Рейвенвуд хотя бы похож на настоящий город.', 'ep1_feed_city'),
        choice('Пока просто посмотрю, ладно?', 'ep1_olivia_feed_only')
      ] }
    ]
  },
  { id: 'ep1_feed_dog', chat: 'private_olivia', trigger: 'choice:ep1_olivia_after_feed:0', messages: [say('olivia', 'Это Пончик. За него можешь не переживать, он известнее мэра.'), say('olivia', 'У него, кажется, больше подписчиков, чем у меня.') ] },
  { id: 'ep1_feed_city', chat: 'private_olivia', trigger: 'choice:ep1_olivia_after_feed:1', messages: [say('olivia', 'Он и есть настоящий. Просто маленький, мокрый и все друг друга знают через одного.') ] },
  { id: 'ep1_olivia_feed_only', chat: 'private_olivia', trigger: 'choice:ep1_olivia_after_feed:2', messages: [say('olivia', 'Да, конечно.'), say('olivia', 'Не буду мешать.'), { type: 'system', text: 'Оливия не в сети.', delay: 700, characterStatus: { id: 'olivia', online: false } }] },
  {
    id: 'ep1_olivia_normal_end', chat: 'private_olivia', trigger: 'after:ep1_feed_dog|ep1_feed_city',
    messages: [
      say('olivia', 'Если нажмёшь на имя, откроется профиль. Только не листай мои старые фото слишком далеко, ладно?'),
      { type: 'choice', options: [
        choice('Теперь точно пролистаю.', 'ep1_olivia_profile_tease'),
        choice('Постараюсь вести себя прилично.', 'ep1_olivia_profile_polite', { trust: { oliviaTrust: 1 } })
      ] }
    ]
  },
  { id: 'ep1_olivia_profile_tease', chat: 'private_olivia', trigger: 'choice:ep1_olivia_normal_end:0', messages: [say('olivia', 'Зря я вообще это сказала 🙄'), { type: 'system', text: 'Оливия не в сети.', delay: 700, characterStatus: { id: 'olivia', online: false } }] },
  { id: 'ep1_olivia_profile_polite', chat: 'private_olivia', trigger: 'choice:ep1_olivia_normal_end:1', messages: [say('olivia', 'Очень подозрительный ответ.'), say('olivia', 'Ладно, до связи.'), { type: 'system', text: 'Оливия не в сети.', delay: 700, characterStatus: { id: 'olivia', online: false } }] },

  {
    id: 'ep1_mia_first_normal',
    chat: 'private_mia',
    trigger: 'after:ep1_olivia_profile_tease|ep1_olivia_profile_polite|ep1_olivia_feed_only',
    identify: ['mia'],
    messages: [
      { type: 'pause', delay: 2800 },
      { type: 'system', text: 'Миа в сети.', delay: 450, characterStatus: { id: 'mia', online: true } },
      say('mia', 'Привет ещё раз.'),
      say('mia', 'Вижу, Оливия уже подписалась на тебя в RavenFeed.'),
      say('mia', 'Значит, приглашение дошло.'),
      say('mia', 'Это она так извиняется. Обычно ссылками и кофе.'),
      { type: 'choice', options: [
        choice('Кофе пока не пришёл.', 'ep1_mia_coffee'),
        choice('Я уже познакомился с Пончиком.', 'ep1_mia_dog'),
        choice('Да. Там город выглядит спокойнее, чем в вашем чате.', 'ep1_mia_quiet')
      ] }
    ]
  },
  { id: 'ep1_mia_coffee', chat: 'private_mia', trigger: 'choice:ep1_mia_first_normal:0', messages: [say('mia', 'Значит, извинение ещё не закончено.'), say('mia', 'Можешь напомнить ей об этом. Я подтвержу.') ] },
  { id: 'ep1_mia_dog', chat: 'private_mia', trigger: 'choice:ep1_mia_first_normal:1', messages: [say('mia', 'Всё, можно считать, что ты видел главную достопримечательность.'), say('mia', 'Кинотеатр можно пропустить.') ] },
  { id: 'ep1_mia_quiet', chat: 'private_mia', trigger: 'choice:ep1_mia_first_normal:2', messages: [say('mia', 'Потому что там нельзя добавить семь человек без спроса.'), say('mia', 'Пока что это лучшая функция приложения.') ] },
  {
    id: 'ep1_mia_outfit', chat: 'private_mia', trigger: 'after:ep1_mia_coffee|ep1_mia_dog|ep1_mia_quiet',
    messages: [
      say('mia', 'Раз уж ты там, реши спор.'),
      say('mia', 'На последнем фото у меня куртка нормальная или я похожа на человека, который продаёт билеты на плохой концерт?'),
      { type: 'choice', options: [
        choice('Куртка нормальная. Концерт я бы тоже купил.', 'ep1_mia_outfit_good', { trust: { miaTrust: 1 } }),
        choice('Смотря насколько плохой концерт.', 'ep1_mia_outfit_joke'),
        choice('Промолчать.', 'ep1_mia_outfit_silent', { sendMessage: false })
      ] }
    ]
  },
  { id: 'ep1_mia_outfit_good', chat: 'private_mia', trigger: 'choice:ep1_mia_outfit:0', messages: [say('mia', 'Вот. Наконец-то объективное мнение незнакомца из другого города.'), say('mia', 'Засчитаю один голос в пользу куртки.') ] },
  { id: 'ep1_mia_outfit_joke', chat: 'private_mia', trigger: 'choice:ep1_mia_outfit:1', messages: [say('mia', 'Очень плохой. В подвале. Вокалист опоздал.'), say('mia', 'Ладно, убедил. Куртку оставляю.') ] },
  { id: 'ep1_mia_outfit_silent', chat: 'private_mia', trigger: 'choice:ep1_mia_outfit:2', messages: [say('mia', 'Поняла.'), say('mia', 'Настолько плохо.'), say('mia', 'Спасибо, это было жестоко 😭') ] },
  {
    id: 'ep1_mia_harper_memory', chat: 'private_mia', trigger: 'afterTrustFlag:ep1_mia_outfit_good|ep1_mia_outfit_joke|ep1_mia_outfit_silent:miaTrust:1::true',
    messages: [
      say('mia', 'Харпер её ненавидела, кстати.'),
      say('mia', 'Говорила, что в ней я похожа на мокрый пакет.'),
      say('mia', 'А потом сама один раз забрала её и не вернула неделю.'),
      { type: 'choice', options: [
        choice('Звучит так, будто куртка ей всё-таки нравилась.', 'ep1_mia_memory_warm'),
        choice('У неё всегда были такие точные сравнения?', 'ep1_mia_memory_fun')
      ] }
    ]
  },
  { id: 'ep1_mia_memory_warm', chat: 'private_mia', trigger: 'choice:ep1_mia_harper_memory:0', messages: [say('mia', 'Конечно нравилась.'), say('mia', 'Но признать это было бы слишком просто.') ] },
  { id: 'ep1_mia_memory_fun', chat: 'private_mia', trigger: 'choice:ep1_mia_harper_memory:1', messages: [say('mia', 'Постоянно.'), say('mia', 'Один раз сказала, что мой плейлист звучит как очередь в аптеке.'), say('mia', 'Я до сих пор не понимаю, что это значит.') ] },
  {
    id: 'ep1_mia_memory_skipped',
    chat: 'private_mia',
    trigger: 'afterNotTrustFlag:ep1_mia_outfit_good|ep1_mia_outfit_joke|ep1_mia_outfit_silent:miaTrust:1::true',
    messages: [say('mia', 'Ладно, спасибо за честный ответ.'), say('mia', 'Я ненадолго пропаду.'), { type: 'system', text: 'Миа не в сети.', delay: 650, characterStatus: { id: 'mia', online: false } }]
  },

  {
    id: 'ep1_notes_open',
    chat: 'private_mia',
    trigger: 'after:ep1_mia_memory_warm|ep1_mia_memory_fun|ep1_mia_memory_skipped',
    messages: [
      { type: 'note_auto', id: 'harper_intro_summary', title: 'Харпер Вэнс', text: 'Харпер Вэнс пропала два дня назад.\n\nСегодня с её телефона Дереку пришло сообщение, в котором был только мой номер. Неизвестно, кто отправил сообщение.\n\nЯ никогда не был в Рейвенвуде и не знаю Харпер. Группа «Семеро» распалась сразу после знакомства. Оливия прислала мне доступ к RavenFeed.', noteCompleteFlag: 'harperIntroNoteWritten', notificationText: 'Запиши только то, что известно точно', delay: 450 },
      { type: 'wait_flag', flag: 'harperIntroNoteWritten', delay: 400 }
    ]
  },

  {
    id: 'ep1_derek_photos',
    chat: 'private_derek',
    trigger: 'after:ep1_notes_open',
    messages: [
      { type: 'pause', delay: 2300 },
      { type: 'system', text: 'Дерек в сети.', delay: 450, characterStatus: { id: 'derek', online: true } },
      say('derek', 'Я нашёл ещё несколько фотографий Харпер.'),
      say('derek', 'Посмотри, пожалуйста. Вдруг лицо покажется знакомым.'),
      say('derek', 'Допрашивать тебя заново не буду.'),
      { from: 'derek', type: 'image', src: 'src/assets/harper_photos/harper_party_crown.webp?v=116', caption: 'Харпер на дне рождения', delay: 650 },
      { from: 'derek', type: 'image', src: 'src/assets/harper_photos/harper_mia_olivia_sun.webp?v=116', caption: 'Харпер, Миа и Оливия', delay: 650 },
      { from: 'derek', type: 'image', src: 'src/assets/harper_photos/harper_derek_blurred_selfie.webp?v=116', caption: 'Харпер и Дерек', delay: 650 },
      { from: 'derek', type: 'image', src: 'src/assets/harper_photos/harper_street_cat.webp?v=116', caption: 'Харпер и уличный кот', delay: 650 },
      { type: 'choice', options: [
        choice('Нет, я её не узнаю.', 'ep1_photos_no'),
        choice('Не узнаю, но теперь она хотя бы не просто имя.', 'ep1_photos_human', { trust: { derekTrust: 1 } }),
        choice('Я уже сказал, что не знаю её.', 'ep1_photos_boundary')
      ] }
    ]
  },
  { id: 'ep1_photos_no', chat: 'private_derek', trigger: 'choice:ep1_derek_photos:0', messages: [say('derek', 'Понял.'), say('derek', 'Стоило проверить.') ] },
  { id: 'ep1_photos_human', chat: 'private_derek', trigger: 'choice:ep1_derek_photos:1', messages: [say('derek', 'Да.'), say('derek', 'Она не просто имя.') ] },
  { id: 'ep1_photos_boundary', chat: 'private_derek', trigger: 'choice:ep1_derek_photos:2', messages: [say('derek', 'Знаю.'), say('derek', 'Извини. Больше не буду просить пересматривать фотографии.') ] },

  {
    id: 'ep1_derek_small_talk',
    chat: 'private_derek',
    trigger: 'after:ep1_photos_no|ep1_photos_human|ep1_photos_boundary',
    messages: [
      say('derek', 'Оливия дала тебе RavenFeed?'),
      { type: 'choice', options: [
        choice('Да. Теперь знаю, что ваш поезд всегда опаздывает.', 'ep1_derek_train'),
        choice('Да. И что ты играешь в футбол.', 'ep1_derek_football'),
        choice('Да. Но я сейчас не очень хочу болтать.', 'ep1_derek_not_now')
      ] }
    ]
  },
  { id: 'ep1_derek_train', chat: 'private_derek', trigger: 'choice:ep1_derek_small_talk:0', messages: [say('derek', 'Не всегда.'), say('derek', 'Только когда тебе куда-то надо.'), say('derek', 'В этом его талант.') ] },
  { id: 'ep1_derek_football', chat: 'private_derek', trigger: 'choice:ep1_derek_small_talk:1', messages: [say('derek', 'Играл.'), say('derek', 'Сейчас иногда выхожу с ребятами, если нужен кто-то на замену.'), say('derek', 'Это не так интересно, как выглядит в профиле.') ] },
  { id: 'ep1_derek_not_now', chat: 'private_derek', trigger: 'choice:ep1_derek_small_talk:2', messages: [say('derek', 'Понял.'), say('derek', 'Тогда не буду.'), say('derek', 'И за тот чат всё равно извини.'), { type: 'system', text: 'Дерек не в сети.', delay: 650, characterStatus: { id: 'derek', online: false } }] },
  {
    id: 'ep1_derek_soften', chat: 'private_derek', trigger: 'after:ep1_derek_train|ep1_derek_football',
    messages: [
      say('derek', 'И ещё... за тот чат извини.'),
      say('derek', 'Я думал, если соберу всех, мы спокойно разберёмся. Получилось наоборот.'),
      { type: 'choice', options: [
        choice('Ты испугался и поторопился. Бывает.', 'ep1_derek_accept', { trust: { derekTrust: 1 } }),
        choice('В следующий раз хотя бы спроси человека перед тем, как тащить его в такое.', 'ep1_derek_boundary'),
        choice('Промолчать.', 'ep1_derek_silence', { sendMessage: false })
      ] }
    ]
  },
  { id: 'ep1_derek_accept', chat: 'private_derek', trigger: 'choice:ep1_derek_soften:0', messages: [say('derek', 'Да.'), say('derek', 'Спасибо, что понимаешь.') ] },
  { id: 'ep1_derek_boundary', chat: 'private_derek', trigger: 'choice:ep1_derek_soften:1', messages: [say('derek', 'Спрошу.'), say('derek', 'Я правда не подумал, как это выглядит с твоей стороны.') ] },
  { id: 'ep1_derek_silence', chat: 'private_derek', trigger: 'choice:ep1_derek_soften:2', messages: [say('derek', 'Ладно.'), say('derek', 'Заслужил.') ] },
  { id: 'ep1_derek_end', chat: 'private_derek', trigger: 'after:ep1_derek_accept|ep1_derek_boundary|ep1_derek_silence', messages: [say('derek', 'Если полиция спросит про номер, я предупрежу.'), say('derek', 'А пока не буду тебя дёргать.'), { type: 'system', text: 'Дерек не в сети.', delay: 650, characterStatus: { id: 'derek', online: false } }] },

  {
    id: 'ep1_mia_phone_memory',
    chat: 'private_mia',
    trigger: 'after:ep1_derek_end|ep1_derek_not_now',
    setFlags: { oldPhoneRemembered: true },
    messages: [
      { type: 'pause', delay: 3200 },
      { type: 'system', text: 'Миа в сети.', delay: 450, characterStatus: { id: 'mia', online: true } },
      say('mia', 'Слушай.'),
      say('mia', 'После разговора про куртку я полезла искать старые фотографии.'),
      say('mia', 'И наткнулась на папку, которую переносила со старого телефона.'),
      say('mia', 'Тут я вспомнила одну вещь.'),
      say('mia', 'За несколько дней до исчезновения Харпер брала мой старый телефон.'),
      say('mia', 'У неё сел свой, и она сказала, что ей надо быстро кому-то написать.'),
      say('mia', 'Потом вернула и сказала, что удалила чат.'),
      { type: 'choice', options: [
        choice('Ты видела, кому она писала?', 'ep1_phone_saw'),
        choice('Тогда это могло вообще не показаться важным.', 'ep1_phone_understand', { trust: { miaTrust: 1 } }),
        choice('И только сейчас вспомнила?', 'ep1_phone_late')
      ] }
    ]
  },
  { id: 'ep1_phone_saw', chat: 'private_mia', trigger: 'choice:ep1_mia_phone_memory:0', messages: [say('mia', 'Нет. Она отошла на пару шагов.'), say('mia', 'Я не смотрела через плечо, потому что я нормальный человек.') ] },
  { id: 'ep1_phone_understand', chat: 'private_mia', trigger: 'choice:ep1_mia_phone_memory:1', messages: [say('mia', 'Вот именно.'), say('mia', 'Она держала его минуту. Я решила, что написала Дереку и всё.') ] },
  { id: 'ep1_phone_late', chat: 'private_mia', trigger: 'choice:ep1_mia_phone_memory:2', messages: [say('mia', 'Да. Я знаю, как это звучит.'), say('mia', 'Но тогда это была одна обычная минута, а не «улика, которую я обязана запомнить».') ] },
  {
    id: 'ep1_mia_backup_offer',
    chat: 'private_mia',
    trigger: 'after:ep1_phone_saw|ep1_phone_understand|ep1_phone_late',
    setFlags: { backupFound: true, oldPhoneReportedToPolice: true },
    messages: [
      say('mia', 'Сам телефон у меня дома. Я уже написала следователю и включать его не буду.'),
      say('mia', 'Но на ноутбуке осталась резервная копия. Она сделана уже после того дня.'),
      say('mia', 'Мне сейчас надо уходить, а программа упрямо показывает один удалённый чат.'),
      say('mia', 'Можешь посмотреть? Только то, что связано с Харпер. Там есть и мои переписки.'),
      { type: 'choice', options: [
        choice('Хорошо. В личное не полезу.', 'ep1_backup_accept', { setFlag: 'miaBackupAccessGranted', trust: { miaTrust: 1 } }),
        choice('Ты уверена, что хочешь дать доступ мне?', 'ep1_backup_unsure'),
        choice('Лучше дождаться полиции.', 'ep1_backup_decline', { setFlag: 'playerDeclinedBackupAccess' })
      ] }
    ]
  },
  { id: 'ep1_backup_unsure', chat: 'private_mia', trigger: 'choice:ep1_mia_backup_offer:1', messages: [say('mia', 'Вообще нет.'), say('mia', 'Но доступ только на просмотр, и я увижу, что ты открывал.'), { type: 'choice', options: [choice('Ладно. Присылай.', 'ep1_backup_accept_unsure', { setFlag: 'miaBackupAccessGranted' }), choice('Нет. Всё равно подожди.', 'ep1_backup_decline_unsure', { setFlag: 'playerDeclinedBackupAccess' })] }] },
  {
    id: 'ep1_backup_accept', chat: 'private_mia', trigger: 'choice:ep1_mia_backup_offer:0', setFlags: { miaBackupAccessGranted: true },
    messages: [say('mia', 'Спасибо.'), say('mia', 'Ссылка проживёт двадцать минут. Ничего скачать или изменить там нельзя.'), { from: 'mia', type: 'app', title: 'Резервная копия', subtitle: 'MIA-OLD · только просмотр', text: 'Открыть резервную копию', documentId: 'mia_remote_access', delay: 700 }, { type: 'wait_flag', flag: 'remoteSessionInterrupted', delay: 500 }]
  },
  {
    id: 'ep1_backup_accept_unsure', chat: 'private_mia', trigger: 'choice:ep1_backup_unsure:0', setFlags: { miaBackupAccessGranted: true },
    messages: [say('mia', 'Хорошо. И правда только Харпер, ладно?'), { from: 'mia', type: 'app', title: 'Резервная копия', subtitle: 'MIA-OLD · только просмотр', text: 'Открыть резервную копию', documentId: 'mia_remote_access', delay: 700 }, { type: 'wait_flag', flag: 'remoteSessionInterrupted', delay: 500 }]
  },
  {
    id: 'ep1_backup_decline', chat: 'private_mia', trigger: 'choice:ep1_mia_backup_offer:2', setFlags: { playerDeclinedBackupAccess: true },
    messages: [say('mia', 'Наверное, ты прав.'), say('mia', 'Закрываю копию и жду полицию.'), { type: 'pause', delay: 1200 }, { type: 'app_notification', title: 'Новое вложение', text: 'VID_1842.mp4 · отправитель не определён', options: {}, delay: 700 }, say('mia', 'Подожди. Это не я отправила.'), say('mia', 'Я вообще уже закрыла программу.'), { from: 'narrator', type: 'app', title: 'VID_1842.mp4', subtitle: 'Отправитель не определён · внешний сервер', text: 'Открыть вложение', documentId: 'mia_remote_access', delay: 700 }, { type: 'wait_flag', flag: 'remoteSessionInterrupted', delay: 500 }]
  },
  {
    id: 'ep1_backup_decline_unsure', chat: 'private_mia', trigger: 'choice:ep1_backup_unsure:1', setFlags: { playerDeclinedBackupAccess: true },
    messages: [say('mia', 'Ладно. Закрываю.'), { type: 'pause', delay: 1200 }, { type: 'app_notification', title: 'Новое вложение', text: 'VID_1842.mp4 · отправитель не определён', options: {}, delay: 700 }, say('mia', 'Это не я.'), say('mia', 'Серьёзно. Ничего не открывай у себя, если не хочешь.'), { from: 'narrator', type: 'app', title: 'VID_1842.mp4', subtitle: 'Отправитель не определён · внешний сервер', text: 'Открыть вложение', documentId: 'mia_remote_access', delay: 700 }, { type: 'wait_flag', flag: 'remoteSessionInterrupted', delay: 500 }]
  },

  {
    id: 'ep1_unknown_first',
    chat: 'private_unknown',
    trigger: 'flagAfter:remoteSessionInterrupted:ep1_backup_accept|ep1_backup_accept_unsure|ep1_backup_decline|ep1_backup_decline_unsure',
    identify: ['unknown'],
    messages: [
      { type: 'navigate', screen: 'chat', params: { chatId: 'private_unknown' }, delay: 350 },
      { type: 'system', text: 'Неизвестный в сети.', delay: 450, characterStatus: { id: 'unknown', online: true } },
      say('unknown', 'Не открывай ссылку снова.'),
      say('unknown', 'Я отозвал временный ключ.'),
      { type: 'choice', options: [
        choice('Кто ты?', 'ep1_unknown_who'),
        choice('Что сейчас произошло с моим телефоном?', 'ep1_unknown_what'),
        choice('Это ты включил камеру?', 'ep1_unknown_camera'),
        choice('Не отвечать.', 'ep1_unknown_silence', { sendMessage: false })
      ] }
    ]
  },
  { id: 'ep1_unknown_who', chat: 'private_unknown', trigger: 'choice:ep1_unknown_first:0', messages: [say('unknown', 'Сейчас это неважно.'), say('unknown', 'Важно, что внешний просмотрщик передал серверу служебный ключ твоего телефона.') ] },
  { id: 'ep1_unknown_what', chat: 'private_unknown', trigger: 'choice:ep1_unknown_first:1', messages: [say('unknown', 'Ты открыл не видео, а страницу во встроенном просмотрщике.'), say('unknown', 'Вместе с адресом она получила временный ключ RavenLink и запросила через него доступ к приложениям.') ] },
  { id: 'ep1_unknown_camera', chat: 'private_unknown', trigger: 'choice:ep1_unknown_first:2', messages: [say('unknown', 'Нет.'), say('unknown', 'Камеру запросил тот же внешний сеанс.'), say('unknown', 'Я появился позже и отозвал его ключ.') ] },
  { id: 'ep1_unknown_silence', chat: 'private_unknown', trigger: 'choice:ep1_unknown_first:3', messages: [say('unknown', 'Можешь не отвечать.'), say('unknown', 'Но ссылку второй раз не открывай.') ] },
  {
    id: 'ep1_unknown_explains', chat: 'private_unknown', trigger: 'after:ep1_unknown_who|ep1_unknown_what|ep1_unknown_camera|ep1_unknown_silence',
    messages: [
      say('unknown', 'В журнале видно три запроса: список чатов, заметки и камера.'),
      say('unknown', 'Ключ жил меньше минуты, но сервер успел начать передачу фотографии.'),
      { type: 'choice', options: [
        choice('Они сделали мою фотографию.', 'ep1_unknown_photo'),
        choice('Что они успели скопировать?', 'ep1_unknown_stolen'),
        choice('Почему ты вообще следил за этим сервером?', 'ep1_unknown_server')
      ] }
    ]
  },
  { id: 'ep1_unknown_photo', chat: 'private_unknown', trigger: 'choice:ep1_unknown_explains:0', messages: [say('unknown', 'Да.'), say('unknown', 'Я отозвал ключ на шестидесяти четырёх процентах.'), say('unknown', 'Это не значит, что сервер ничего не сохранил.') ] },
  { id: 'ep1_unknown_stolen', chat: 'private_unknown', trigger: 'choice:ep1_unknown_explains:1', messages: [say('unknown', 'Точно не скажу.'), say('unknown', 'Они прочитали названия чатов и последние сообщения.'), say('unknown', 'Заметку открыли целиком, а потом запросили камеру.') ] },
  { id: 'ep1_unknown_server', chat: 'private_unknown', trigger: 'choice:ep1_unknown_explains:2', messages: [say('unknown', 'Я следил за адресом из удалённого чата.'), say('unknown', 'Когда появился новый ключ, я увидел его в журнале и отозвал.'), say('unknown', 'Почему у меня есть доступ к журналу, пока не спрашивай.') ] },
  {
    id: 'ep1_unknown_warning', chat: 'private_unknown', trigger: 'after:ep1_unknown_photo|ep1_unknown_stolen|ep1_unknown_server',
    messages: [
      say('unknown', 'Заверши остальные сеансы мессенджера, а потом смени пароль.'),
      say('unknown', 'Ссылку никому не пересылай, даже если попросят показать файл.'),
      { type: 'choice', options: [
        choice('Почему я должен тебе верить?', 'ep1_unknown_trust'),
        choice('Миа должна знать, что произошло.', 'ep1_unknown_mia'),
        choice('Я всё ещё не понимаю, на чьей ты стороне.', 'ep1_unknown_side'),
        choice('Заблокировать контакт.', 'ep1_unknown_blocked', { sendMessage: false, setFlag: 'unknownBlocked' })
      ] }
    ]
  },
  { id: 'ep1_unknown_trust', chat: 'private_unknown', trigger: 'choice:ep1_unknown_warning:0', messages: [say('unknown', 'Не должен.'), say('unknown', 'Но журнал ты видел сам: ключ отозвали уже после запросов к приложениям.') ] },
  { id: 'ep1_unknown_mia', chat: 'private_unknown', trigger: 'choice:ep1_unknown_warning:1', messages: [say('unknown', 'Про внешний сеанс скажи, а про меня пока лучше промолчи.'), say('unknown', 'Если владелец сервера поймёт, что журнал читают, он его закроет.') ] },
  { id: 'ep1_unknown_side', chat: 'private_unknown', trigger: 'choice:ep1_unknown_warning:2', messages: [say('unknown', 'И правильно, после такого никому сразу не верь.'), say('unknown', 'Только не путай два подключения: сначала был внешний просмотрщик, потом я отозвал его ключ.') ] },
  { id: 'ep1_unknown_blocked', chat: 'private_unknown', trigger: 'choice:ep1_unknown_warning:3', messages: [{ type: 'system', text: 'Контакт заблокирован.', delay: 650 }, { type: 'system', text: 'Неизвестный не в сети.', delay: 500, characterStatus: { id: 'unknown', online: false } }] },
  { id: 'ep1_unknown_offline', chat: 'private_unknown', trigger: 'after:ep1_unknown_trust|ep1_unknown_mia|ep1_unknown_side', messages: [say('unknown', 'Я напишу, если пойму, кому принадлежит внешний узел.'), { type: 'system', text: 'Неизвестный не в сети.', delay: 650, characterStatus: { id: 'unknown', online: false } }] },

  {
    id: 'ep1_mia_after_hack', chat: 'private_mia', trigger: 'after:ep1_unknown_offline|ep1_unknown_blocked',
    messages: [
      { type: 'pause', delay: 1900 },
      { type: 'system', text: 'Миа в сети.', delay: 450, characterStatus: { id: 'mia', online: true } },
      say('mia', 'Что случилось?'),
      say('mia', 'Доступ оборвался, а программа закрылась.'),
      say('mia', 'Ты успел открыть ссылку?'),
      { type: 'choice', options: [
        choice('Да. Ссылка открыла чужой сеанс, а потом мне написал какой-то человек.', 'ep1_mia_tell_all', { setFlag: 'unknownRevealedToMia' }),
        choice('Да. Внешний просмотрщик получил доступ к приложениям.', 'ep1_mia_tell_hack'),
        choice('Нет. Просмотрщик просто завис и закрылся.', 'ep1_mia_hide_hack', { setFlag: 'playerHidHackFromMia' })
      ] }
    ]
  },
  { id: 'ep1_mia_tell_all', chat: 'private_mia', trigger: 'choice:ep1_mia_after_hack:0', setFlags: { miaKnowsAboutHack: true, unknownRevealedToMia: true }, messages: [say('mia', 'Какой ещё человек?'), say('mia', 'Ладно. Потом. Сначала закрой всё и смени пароль.'), say('mia', 'Господи, прости. Это всё из-за моей ссылки.') ] },
  { id: 'ep1_mia_tell_hack', chat: 'private_mia', trigger: 'choice:ep1_mia_after_hack:1', setFlags: { miaKnowsAboutHack: true }, messages: [say('mia', 'Подожди, к каким приложениям?'), say('mia', 'Чёрт. Я закрываю копию и пишу следователю прямо сейчас.'), say('mia', 'Прости. Я не должна была просить тебя открывать эту ссылку.') ] },
  { id: 'ep1_mia_hide_hack', chat: 'private_mia', trigger: 'choice:ep1_mia_after_hack:2', setFlags: { playerHidHackFromMia: true }, messages: [say('mia', 'И всё?'), say('mia', 'Ладно. Я всё равно закрываю доступ.'), say('mia', 'Если заметишь хоть что-то странное, скажи мне. Пожалуйста.') ] },
  {
    id: 'ep1_mia_after_hack_response', chat: 'private_mia', trigger: 'after:ep1_mia_tell_all|ep1_mia_tell_hack|ep1_mia_hide_hack',
    messages: [
      { type: 'choice', options: [
        choice('Ты не могла знать, что там ловушка.', 'ep1_mia_not_fault', { trust: { miaTrust: 1 } }),
        choice('Сейчас важнее закрыть доступ.', 'ep1_mia_close_access'),
        choice('Нам обоим не стоило открывать этот файл.', 'ep1_mia_shared_blame')
      ] }
    ]
  },
  { id: 'ep1_mia_not_fault', chat: 'private_mia', trigger: 'choice:ep1_mia_after_hack_response:0', messages: [say('mia', 'Всё равно ссылку дала я.'), say('mia', 'Но... спасибо.') ] },
  { id: 'ep1_mia_close_access', chat: 'private_mia', trigger: 'choice:ep1_mia_after_hack_response:1', messages: [say('mia', 'Уже закрыла.'), say('mia', 'Следователю отправила имя файла и скрин журнала, но не сам адрес.') ] },
  { id: 'ep1_mia_shared_blame', chat: 'private_mia', trigger: 'choice:ep1_mia_after_hack_response:2', messages: [say('mia', 'Да.'), say('mia', 'Пожалуй, это самый честный вариант.') ] },
  {
    id: 'ep1_mia_privacy_respected',
    chat: 'private_mia',
    trigger: 'flagsValueAfter:ep1_mia_not_fault|ep1_mia_close_access|ep1_mia_shared_blame:miaBackupAccessGranted:true:miaPrivateChatsOpened:false',
    messages: [
      say('mia', 'Доступ я закрыла.'),
      say('mia', 'И вижу историю.'),
      say('mia', 'Ты правда не полез в мои переписки.'),
      { type: 'choice', options: [
        choice('Ты попросила этого не делать.', 'ep1_mia_privacy_thanks', { trust: { miaTrust: 1 }, setFlag: 'miaRespectedPrivacy' }),
        choice('Они не относятся к Харпер.', 'ep1_mia_privacy_thanks', { trust: { miaTrust: 1 }, setFlag: 'miaRespectedPrivacy' })
      ] }
    ]
  },
  { id: 'ep1_mia_privacy_thanks', chat: 'private_mia', trigger: 'after:ep1_mia_privacy_respected', messages: [say('mia', 'Спасибо.'), say('mia', 'Серьёзно.')] },
  {
    id: 'ep1_mia_privacy_broken',
    chat: 'private_mia',
    trigger: 'flagsValueAfter:ep1_mia_not_fault|ep1_mia_close_access|ep1_mia_shared_blame:miaBackupAccessGranted:true:miaPrivateChatsOpened:true',
    messages: [
      say('mia', 'Подожди.'),
      say('mia', 'В истории написано, что ты открывал мои личные чаты.'),
      say('mia', 'Я же прямо попросила туда не заходить.'),
      { type: 'choice', options: [
        choice('Да. Это было неправильно. Извини.', 'ep1_mia_privacy_apology', { trust: { miaTrust: -2 }, setFlag: 'miaPrivacyViolated' }),
        choice('Ты сама дала мне доступ.', 'ep1_mia_privacy_defensive', { trust: { miaTrust: -3 }, setFlag: 'miaPrivacyViolated' })
      ] }
    ]
  },
  { id: 'ep1_mia_privacy_apology', chat: 'private_mia', trigger: 'choice:ep1_mia_privacy_broken:0', messages: [say('mia', 'Я услышала.'), say('mia', 'Но сейчас я не хочу об этом говорить.')] },
  { id: 'ep1_mia_privacy_defensive', chat: 'private_mia', trigger: 'choice:ep1_mia_privacy_broken:1', messages: [say('mia', 'К копии. Не к моей жизни.'), say('mia', 'Больше доступа не будет.')] },
  {
    id: 'ep1_mia_privacy_declined',
    chat: 'private_mia',
    trigger: 'flagValueAfter:ep1_mia_not_fault|ep1_mia_close_access|ep1_mia_shared_blame:playerDeclinedBackupAccess:true',
    messages: [say('mia', 'Доступ закрыла.'), say('mia', 'Больше эту ссылку не трогаю.')]
  },
  {
    id: 'ep1_false_calm', chat: 'private_mia', trigger: 'after:ep1_mia_privacy_thanks|ep1_mia_privacy_apology|ep1_mia_privacy_defensive|ep1_mia_privacy_declined',
    messages: [say('mia', 'Я немного отойду от телефона.'), say('mia', 'И ты тоже отойди. Серьёзно.'), { type: 'system', text: 'Миа не в сети.', delay: 650, characterStatus: { id: 'mia', online: false } }]
  },
  {
    id: 'ep1_public_frame_alert',
    chat: 'private_unknown',
    trigger: 'after:ep1_false_calm',
    setFlags: { act1ViralPost: true, playerFramedOnRavenFeed: true },
    messages: [
      { type: 'pause', delay: 3200 },
      { type: 'app_notification', title: 'RavenFeed', text: 'Ravenwood Truth отметил вас в публикации', options: { app: 'social' }, delay: 1000 },
      { type: 'wait_flag', flag: 'viralPostOpened', delay: 500 }
    ]
  },
  {
    id: 'ep1_olivia_final_high',
    chat: 'private_olivia',
    trigger: 'afterTrustFlag:ep1_public_frame_alert:oliviaTrust:1:act1ViralPost:true',
    messages: [
      { type: 'pause', delay: 1200 },
      { type: 'system', text: 'Оливия в сети.', delay: 450, characterStatus: { id: 'olivia', online: true } },
      say('olivia', 'Ты видел публикацию?'),
      say('olivia', 'Я не думаю, что ты сам отдал им это фото.'),
      say('olivia', 'Но откуда оно взялось?'),
      { type: 'choice', options: [
        choice('После открытия ссылки появился чужой сеанс.', 'ep1_olivia_final_high_explain', { setFlag: 'oliviaKnowsAboutHack' }),
        choice('Я сам пока понимаю не больше твоего.', 'ep1_olivia_final_high_uncertain')
      ] }
    ]
  },
  {
    id: 'ep1_olivia_final_low',
    chat: 'private_olivia',
    trigger: 'afterNotTrustFlag:ep1_public_frame_alert:oliviaTrust:1:act1ViralPost:true',
    messages: [
      { type: 'pause', delay: 1200 },
      { type: 'system', text: 'Оливия в сети.', delay: 450, characterStatus: { id: 'olivia', online: true } },
      say('olivia', 'Ты видел, что выложили?'),
      say('olivia', 'Я не собираюсь обвинять тебя из-за одного поста.'),
      say('olivia', 'Но там твоё лицо и список наших аккаунтов. Мне нужно понять, что произошло.'),
      { type: 'choice', options: [
        choice('Кто-то получил доступ к моему телефону.', 'ep1_olivia_final_low_explain', { setFlag: 'oliviaKnowsAboutHack' }),
        choice('Я ничего им не отправлял.', 'ep1_olivia_final_low_boundary')
      ] }
    ]
  },
  { id: 'ep1_olivia_final_high_explain', chat: 'private_olivia', trigger: 'choice:ep1_olivia_final_high:0', messages: [say('olivia', 'Хорошо.'), say('olivia', 'То есть фото появилось во время взлома, а публикация уже после.'), say('olivia', 'Я напишу об этом под постом. Без имени Неизвестного и без догадок.')] },
  { id: 'ep1_olivia_final_high_uncertain', chat: 'private_olivia', trigger: 'choice:ep1_olivia_final_high:1', messages: [say('olivia', 'Ладно.'), say('olivia', 'Тогда не буду вытягивать из тебя версию, которой пока нет.'), say('olivia', 'Но сохрани всё, что осталось после сбоя.')] },
  { id: 'ep1_olivia_final_low_explain', chat: 'private_olivia', trigger: 'choice:ep1_olivia_final_low:0', messages: [say('olivia', 'Поняла.'), say('olivia', 'Сохрани журнал подключений и ничего не удаляй.'), say('olivia', 'Я пока скажу только, что публикация ничего не доказывает.')] },
  { id: 'ep1_olivia_final_low_boundary', chat: 'private_olivia', trigger: 'choice:ep1_olivia_final_low:1', messages: [say('olivia', 'Я услышала.'), say('olivia', 'Просто сейчас это единственное объяснение, которое у меня есть от тебя.'), say('olivia', 'Я не буду делать выводы раньше времени.')] },

  {
    id: 'ep1_mia_final_high',
    chat: 'private_mia',
    trigger: 'afterTrustFlag:ep1_olivia_final_high_explain|ep1_olivia_final_high_uncertain|ep1_olivia_final_low_explain|ep1_olivia_final_low_boundary:miaTrust:1::true',
    messages: [
      { type: 'pause', delay: 900 },
      { type: 'system', text: 'Миа в сети.', delay: 450, characterStatus: { id: 'mia', online: true } },
      say('mia', 'На фото правда ты?'),
      say('mia', 'Я не спрашиваю, чтобы обвинить.'),
      say('mia', 'Просто скажи, что с тобой всё нормально.'),
      { type: 'choice', options: [
        choice('Да, это я. Фото сделали во время взлома.', 'ep1_mia_final_high_reveal', { setFlag: 'miaKnowsAboutHack' }),
        choice('Я сам пока не понимаю, что они успели сделать.', 'ep1_mia_final_high_overwhelmed')
      ] }
    ]
  },
  {
    id: 'ep1_mia_final_low',
    chat: 'private_mia',
    trigger: 'afterNotTrustFlag:ep1_olivia_final_high_explain|ep1_olivia_final_high_uncertain|ep1_olivia_final_low_explain|ep1_olivia_final_low_boundary:miaTrust:1::true',
    messages: [
      { type: 'pause', delay: 900 },
      { type: 'system', text: 'Миа в сети.', delay: 450, characterStatus: { id: 'mia', online: true } },
      say('mia', 'Это правда ты на фото?'),
      say('mia', 'Я не понимаю, откуда оно взялось.'),
      say('mia', 'После той ссылки мне уже страшно делать выводы.'),
      { type: 'choice', options: [
        choice('Да. Снимок сделали без моего разрешения.', 'ep1_mia_final_low_reveal', { setFlag: 'miaKnowsAboutHack' }),
        choice('Я пока не хочу это обсуждать.', 'ep1_mia_final_low_hold')
      ] }
    ]
  },
  { id: 'ep1_mia_final_high_reveal', chat: 'private_mia', trigger: 'choice:ep1_mia_final_high:0', messages: [say('mia', 'Чёрт.'), say('mia', 'Значит, это правда из-за ссылки.'), say('mia', 'Прости. Я знаю, что уже говорила, но всё равно.')] },
  { id: 'ep1_mia_final_high_overwhelmed', chat: 'private_mia', trigger: 'choice:ep1_mia_final_high:1', messages: [say('mia', 'Ладно.'), say('mia', 'Я рядом. То есть... в чате.'), say('mia', 'Просто не оставайся с этим совсем один.')] },
  { id: 'ep1_mia_final_low_reveal', chat: 'private_mia', trigger: 'choice:ep1_mia_final_low:0', messages: [say('mia', 'Хорошо.'), say('mia', 'Спасибо, что сказал.'), say('mia', 'Я напишу следователю, что фото могло уйти через ссылку.')] },
  { id: 'ep1_mia_final_low_hold', chat: 'private_mia', trigger: 'choice:ep1_mia_final_low:1', messages: [say('mia', 'Поняла.'), say('mia', 'Не буду давить.'), say('mia', 'Но ссылку я всё равно передам полиции как опасную.')] },

  {
    id: 'ep1_brooke_public_demand',
    chat: 'private_mia',
    trigger: 'after:ep1_mia_final_high_reveal|ep1_mia_final_high_overwhelmed|ep1_mia_final_low_reveal|ep1_mia_final_low_hold',
    setFlags: { brookeDemandedExplanation: true },
    messages: [
      { type: 'pause', delay: 850 },
      { type: 'app_notification', title: 'RavenFeed · Брук Хейз', text: '{player}, ответь. Откуда у Ravenwood Truth твоё фото и кто рассказал им про номер?', options: { app: 'social' }, delay: 1000 }
    ]
  },
  {
    id: 'ep1_chapter_end', chat: 'private_mia', trigger: 'after:ep1_brooke_public_demand', setFlags: { episode1LivingComplete: true },
    messages: [{ type: 'navigate', screen: 'chapterEnd', delay: 1400 }]
  }
];
