import { miaLateSceneBeats } from './miaLateScene.js?v=70';
import { chapter1FinaleBeats } from './chapter1Finale.js?v=70';
import { introRewriteBeats } from './introRewrite.js?v=1';
import { oliviaIntroFinalBeats } from './oliviaIntroFinal.js?v=1';
import { miaIntroRewriteBeats } from './miaIntroRewrite.js?v=1';
import { derekMorningRewriteBeats } from './derekMorningRewrite.js?v=1';
import { oliviaMorningRewriteBeats } from './oliviaMorningRewrite.js?v=1';
import { postOliviaRoutesRewriteBeats } from './postOliviaRoutesRewrite.js?v=1';
import { backupFoundRewriteBeats } from './backupFoundRewrite.js?v=1';

const legacyChapter1 = {
  id: "act1",
  title: "Акт 1: Номер Харпер",
  beats: [
    {
      id: "intro_derek_opener",
      chat: "private_derek",
      trigger: "auto",
      unlock: [
        { type: "contacts", id: "derek" }
      ],
      identify: ["derek"],
      messages: [
        { from: "derek", text: "Привет", delay: 900 },
        { from: "derek", text: "Это может показаться странным но", delay: 1100 },
        { from: "derek", text: "Ты не знаешь Харпер Вэнс?", delay: 1200 },
        { type: "choice", options: [
          { text: "Привет. Я не понимаю, кто это.", loyalty: {}, next: "intro_derek_no_idea" },
          { text: "Стоп. Откуда у тебя мой номер?", loyalty: {}, next: "intro_derek_number_question" }
        ]}
      ]
    },
    {
      id: "intro_derek_no_idea",
      chat: "private_derek",
      trigger: "choice:intro_derek_opener:0",
      messages: [
        { from: "derek", text: "Да.", delay: 700 },
        { from: "derek", text: "Я понял.", delay: 700 },
        { from: "derek", text: "Прости, я с этого и должен был начать.", delay: 1100 }
      ]
    },
    {
      id: "intro_derek_number_question",
      chat: "private_derek",
      trigger: "choice:intro_derek_opener:1",
      messages: [
        { from: "derek", text: "Я знаю, как это выглядит.", delay: 900 },
        { from: "derek", text: "Я бы на твоём месте тоже спросил.", delay: 1100 },
        { from: "derek", text: "Но номер пришёл не от меня.", delay: 1100 }
      ]
    },
    {
      id: "intro_derek_explains",
      chat: "private_derek",
      trigger: "after:intro_derek_no_idea|intro_derek_number_question",
      messages: [
        { from: "derek", text: "Дело в том, что", delay: 900 },
        { from: "derek", text: "Я её парень.", delay: 900 },
        { from: "derek", text: "И она пропала два дня назад.", delay: 1200 },
        { from: "derek", text: "А сегодня она написала мне одно сообщение", delay: 1300 },
        { from: "derek", text: "Твой номер.", delay: 1000 },
        { type: "choice", options: [
          { text: "Это какая-то ошибка. Я даже не знаю Харпер.", loyalty: {}, next: "intro_number_error" },
          { text: "И что я должен с этим делать?", loyalty: {}, next: "intro_number_question" }
        ]}
      ]
    },
    {
      id: "intro_number_error",
      chat: "private_derek",
      trigger: "choice:intro_derek_explains:0",
      messages: [
        { from: "derek", text: "Я тоже сначала решил, что ошибка.", delay: 1100 },
        { from: "derek", text: "Очень хотел так решить.", delay: 1100 },
        { from: "derek", text: "Но это её телефон.", delay: 1000 },
        { from: "derek", text: "И сообщение было одно.", delay: 1000 }
      ]
    },
    {
      id: "intro_number_question",
      chat: "private_derek",
      trigger: "choice:intro_derek_explains:1",
      messages: [
        { from: "derek", text: "Не знаю.", delay: 800 },
        { from: "derek", text: "Серьёзно.", delay: 700 },
        { from: "derek", text: "Я не жду, что ты сейчас бросишь всё и начнёшь искать её.", delay: 1400 },
        { from: "derek", text: "Я просто пытаюсь понять, почему она отправила именно тебя.", delay: 1400 }
      ]
    },
    {
      id: "intro_only_lead",
      chat: "private_derek",
      trigger: "after:intro_number_error|intro_number_question",
      messages: [
        { from: "derek", text: "Послушай.", delay: 800 },
        { from: "derek", text: "Я не обвиняю тебя.", delay: 1000 },
        { from: "derek", text: "Но это единственная зацепка, которая у меня есть.", delay: 1300 },
        { type: "choice", options: [
          { text: "Я всё ещё думаю, что вы ошиблись.", loyalty: {}, next: "intro_lead_help" },
          { text: "Это уже звучит не просто странно.", loyalty: {}, next: "intro_lead_scared" },
          { text: "С этим надо идти в полицию, не ко мне.", loyalty: {}, next: "intro_lead_police" }
        ]}
      ]
    },
    {
      id: "intro_lead_help",
      chat: "private_derek",
      trigger: "choice:intro_only_lead:0",
      messages: [
        { from: "derek", text: "Может быть.", delay: 900 },
        { from: "derek", text: "Я не спорю.", delay: 800 },
        { from: "derek", text: "Просто у меня больше нет нормальных объяснений.", delay: 1200 }
      ]
    },
    {
      id: "intro_lead_scared",
      chat: "private_derek",
      trigger: "choice:intro_only_lead:1",
      messages: [
        { from: "derek", text: "Да.", delay: 700 },
        { from: "derek", text: "Прости.", delay: 800 },
        { from: "derek", text: "Я пишу человеку, которого вообще не знаю.", delay: 1300 },
        { from: "derek", text: "И сам понимаю, как это звучит.", delay: 1200 }
      ]
    },
    {
      id: "intro_lead_police",
      chat: "private_derek",
      trigger: "choice:intro_only_lead:2",
      messages: [
        { from: "derek", text: "Мы уже обращались.", delay: 1000 },
        { from: "derek", text: "Я не пытаюсь сделать из тебя копа.", delay: 1200 },
        { from: "derek", text: "Просто им нужен факт.", delay: 900 },
        { from: "derek", text: "А у меня пока только этот номер.", delay: 1100 }
      ]
    },
    {
      id: "intro_police_common",
      chat: "private_derek",
      trigger: "after:intro_lead_help|intro_lead_scared|intro_lead_police",
      messages: [
        { from: "derek", text: "Они сказали ждать.", delay: 900 },
        { from: "derek", text: "Что она могла уйти сама.", delay: 1100 },
        { from: "derek", text: "А я знаю Харпер.", delay: 1000 },
        { from: "derek", text: "Она не исчезла бы вот так.", delay: 1100 },
        { from: "derek", text: "Не без телефона. Не без слова.", delay: 1200 },
        { from: "derek", text: "Прости, если гружу тебя.", delay: 1100 },
        { type: "choice", options: [
          { text: "Все нормально. Расскажи подробнее.", loyalty: {}, next: "intro_details_ok" },
          { text: "Может она сама ушла?", loyalty: {}, next: "intro_maybe_left" }
        ]}
      ]
    },
    {
      id: "intro_details_ok",
      chat: "private_derek",
      trigger: "choice:intro_police_common:0",
      messages: [
        { from: "derek", text: "Спасибо.", delay: 900 }
      ]
    },
    {
      id: "intro_maybe_left",
      chat: "private_derek",
      trigger: "choice:intro_police_common:1",
      messages: [
        { from: "derek", text: "Нет.", delay: 800 },
        { from: "derek", text: "Если бы она хотела уйти", delay: 1000 },
        { from: "derek", text: "Она хотя бы написала матери.", delay: 1100 },
        { from: "derek", text: "Или мне.", delay: 900 }
      ]
    },
    {
      id: "intro_harper_story",
      chat: "private_derek",
      trigger: "after:intro_details_ok|intro_maybe_left",
      messages: [
        { from: "derek", text: "Последней ее видела подруга", delay: 1100 },
        { from: "derek", text: "Они сидели в кафе.", delay: 1000 },
        { from: "derek", text: "Потом Харпер кто-то позвонил.", delay: 1100 },
        { from: "derek", text: "Она сразу изменилась в лице.", delay: 1200 },
        { from: "derek", text: "Сказала только: «Мне нужно кое с кем встретиться.»", delay: 1400 },
        { from: "derek", text: "И ушла. С тех пор ее никто не видел.", delay: 1300 },
        { from: "derek", type: "image", src: "src/assets/harper_photos/harper_cafe.jpg", caption: "Харпер Вэнс", delay: 900 },
        { from: "derek", text: "Ты точно никогда ее не видел?", delay: 1000 },
        { type: "choice", options: [
          { text: "Нет. Я вижу ее впервые.", loyalty: {}, next: "intro_never_seen" },
          { text: "Мне кажется, я где-то ее видел...", loyalty: {}, next: "intro_maybe_seen" }
        ]}
      ]
    },
    {
      id: "intro_never_seen",
      chat: "private_derek",
      trigger: "choice:intro_harper_story:0",
      messages: [
        { from: "derek", text: "Ясно.", delay: 900 },
        { from: "derek", text: "Честно говоря, я надеялся, что ты скажешь обратное.", delay: 1300 }
      ]
    },
    {
      id: "intro_maybe_seen",
      chat: "private_derek",
      trigger: "choice:intro_harper_story:1",
      messages: [
        { from: "derek", text: "Правда?", delay: 700 },
        { from: "derek", text: "Где?", delay: 700 },
        { type: "choice", options: [
          { text: "Не знаю. Это как вспышка, и всё.", loyalty: {}, next: "intro_seen_unclear" },
          { text: "Может, мне просто показалось.", loyalty: {}, next: "intro_seen_maybe_wrong" }
        ]}
      ]
    },
    {
      id: "intro_seen_unclear",
      chat: "private_derek",
      trigger: "choice:intro_maybe_seen:0",
      messages: [
        { from: "derek", text: "Ладно.", delay: 800 },
        { from: "derek", text: "Если всплывёт хоть что-то ещё — напиши.", delay: 1100 }
      ]
    },
    {
      id: "intro_seen_maybe_wrong",
      chat: "private_derek",
      trigger: "choice:intro_maybe_seen:1",
      messages: [
        { from: "derek", text: "Понял.", delay: 800 },
        { from: "derek", text: "Прости. Я просто цепляюсь за каждое слово.", delay: 1200 }
      ]
    },
    {
      id: "intro_derek_signoff",
      chat: "private_derek",
      trigger: "after:intro_never_seen|intro_seen_unclear|intro_seen_maybe_wrong",
      messages: [
        { from: "derek", text: "В любом случае скину тебе ещё ее фотографии позже.", delay: 1200 },
        { from: "derek", text: "Может ты вспомнишь ее", delay: 1100 },
        { from: "derek", text: "Прости. Я почти не спал последние два дня.", delay: 1300 },
        { from: "derek", text: "Мне нужно немного прийти в себя.", delay: 1100 },
        { type: "system", text: "Дерек вышел из сети", delay: 900, characterStatus: { id: "derek", online: false } },
        { type: "note_auto", id: "harper_intro_summary", title: "Харпер Вэнс", text: "Харпер Вэнс пропала два дня назад.\n\nЕё парень Дерек сказал, что сегодня она отправила ему только одно сообщение — мой номер.\n\nПоследней Харпер видела её подруга. Они сидели в кафе, когда Харпер кто-то позвонил. После звонка она сказала, что ей нужно срочно с кем-то встретиться, и ушла.\n\nС тех пор её никто не видел.\n\nДерек уверен, что она не могла просто сбежать.", noteCompleteFlag: "harperIntroNoteWritten", delay: 500 },
        { type: "wait_flag", flag: "harperIntroNoteWritten", delay: 800 },
        { type: "system", text: "Дерек в сети", delay: 1200, characterStatus: { id: "derek", online: true } },
        { from: "derek", text: "Ты еще здесь?", delay: 900 },
        { from: "derek", text: "Я написал друзьям Харпер.", delay: 1000 },
        { from: "derek", text: "Рассказал им про твой номер.", delay: 1000 },
        { from: "derek", text: "Оливия хочет сказать кое-что о вечере, когда Харпер пропала.", delay: 1400 },
        { from: "derek", text: "Но она сказала, что будет говорить только при всех.", delay: 1200 },
        { from: "derek", text: "Не все рады, что я добавляю тебя.", delay: 1100 },
        { from: "derek", text: "Но ты единственная зацепка, которая у нас есть.", delay: 1200 }
      ]
    },
    {
      id: "intro_group_seven",
      chat: "group_main",
      trigger: "after:intro_derek_signoff",
      unlock: [
        { type: "chats", id: "group_main" },
        { type: "contacts", id: "mason" },
        { type: "contacts", id: "brooke" },
        { type: "contacts", id: "mia" },
        { type: "contacts", id: "olivia" },
        { type: "contacts", id: "tyler" }
      ],
      identify: ["mason", "brooke", "mia", "olivia", "tyler"],
      messages: [
        { type: "pause", delay: 5000 },
        { from: "narrator", text: "Дерек создал группу «Семеро»", delay: 900 },
        { from: "narrator", text: "Дерек добавил {player}", delay: 900 },
        { from: "mason", text: "Нет.", delay: 700 },
        { from: "mason", text: "Я в этом не участвую.", delay: 900 },
        { from: "derek", text: "Мейсон, подожди.", delay: 800 },
        { from: "mason", text: "Ты добавил сюда человека, которого никто не знает.", delay: 1200 },
        { from: "brooke", text: "И который почему-то оказался последним сообщением Харпер.", delay: 1200 },
        { from: "derek", text: "Именно поэтому он здесь.", delay: 900 },
        { from: "brooke", text: "Или именно поэтому его здесь быть не должно.", delay: 1100 },
        { from: "mia", text: "Ребят, он только вошел.", delay: 900 },
        { from: "mason", text: "А нам уже надо делать вид, что это нормально?", delay: 1100 },
        { from: "derek", text: "Никто не делает вид.", delay: 900 },
        { from: "olivia", text: "Может, дадим ему хотя бы сказать?", delay: 1000 },
        { from: "brooke", text: "А что он скажет?", delay: 800 },
        { from: "brooke", text: "«Я ничего не знаю»?", delay: 900 },
        { from: "mason", text: "Полиция должна этим заниматься.", delay: 1000 },
        { from: "derek", text: "Полиция считает, что Харпер сбежала.", delay: 1100 },
        { from: "mason", text: "Тогда доказывай полиции, что это не так.", delay: 1100 },
        { from: "mason", text: "Но я не буду сидеть в чате с неизвестным человеком и ждать, пока случится ещё что-нибудь.", delay: 1500 },
        { type: "system", text: "Мейсон вышел из группы", delay: 900 },
        { from: "mia", text: "Мейсон...", delay: 800 },
        { from: "brooke", text: "Он прав.", delay: 800 },
        { from: "brooke", text: "Дерек, ты не можешь решать за всех.", delay: 1100 },
        { from: "derek", text: "Я просто пытаюсь найти Харпер.", delay: 1000 },
        { from: "brooke", text: "Тогда ищи.", delay: 800 },
        { from: "brooke", text: "Но без меня.", delay: 800 },
        { type: "system", text: "Брук вышла из группы", delay: 900 },
        { from: "mia", text: "Всё, хватит.", delay: 800 },
        { from: "mia", text: "Я уже не могу.", delay: 900 },
        { type: "system", text: "Миа вышла из группы", delay: 900 },
        { from: "derek", text: "Отлично.", delay: 800 },
        { from: "derek", text: "Просто отлично.", delay: 900 },
        { from: "olivia", text: "Дерек...", delay: 800 },
        { from: "derek", text: "Нет, Оливия.", delay: 900 },
        { from: "derek", text: "Я закрою чат.", delay: 900 },
        { from: "derek", text: "Прости, {player}. Это была плохая идея.", delay: 1100 },
        { from: "narrator", text: "Дерек удалил группу «Семеро»", delay: 1200 },
        { type: "lock", targetType: "chats", id: "group_main", delay: 300 }
      ]
    },
    {
      id: "intro_olivia_private",
      chat: "private_olivia",
      trigger: "after:intro_group_seven",
      unlock: [
        { type: "chats", id: "private_olivia" },
        { type: "contacts", id: "olivia" }
      ],
      identify: ["olivia"],
      messages: [
        { type: "pause", delay: 5000 },
        { from: "olivia", text: "Привет.", delay: 900 },
        { from: "olivia", text: "Прости за них.", delay: 900 },
        { from: "olivia", text: "Я должна была что-то сказать в группе.", delay: 1100 },
        { from: "olivia", text: "Но не смогла.", delay: 900 },
        { from: "olivia", text: "Я не думаю, что ты связан с исчезновением Харпер.", delay: 1300 },
        { from: "olivia", text: "Мне кажется, она хотела, чтобы ты ей помог.", delay: 1200 },
        { from: "olivia", text: "Только я пока не понимаю почему.", delay: 1100 },
        { type: "choice", options: [
          { text: "Почему ты вообще решила мне написать?", loyalty: {}, next: "intro_olivia_branch_why" },
          { text: "Ты хотела что-то сказать в группе?", loyalty: {}, next: "intro_olivia_branch_group" },
          { text: "Я тоже ничего не понимаю.", loyalty: {}, trust: { oliviaTrust: 1 }, next: "intro_olivia_branch_same" }
        ]}
      ]
    },
    {
      id: "intro_olivia_branch_why",
      chat: "private_olivia",
      trigger: "choice:intro_olivia_private:0",
      messages: [
        { from: "olivia", text: "Не знаю.", delay: 800 },
        { from: "olivia", text: "Наверное, потому что никто даже не дал тебе нормально ответить.", delay: 1300 },
        { from: "olivia", text: "Это было неправильно.", delay: 1000 }
      ]
    },
    {
      id: "intro_olivia_branch_group",
      chat: "private_olivia",
      trigger: "choice:intro_olivia_private:1",
      messages: [
        { from: "olivia", text: "Да.", delay: 800 },
        { from: "olivia", text: "Я хотела защитить тебя.", delay: 1100 },
        { from: "olivia", text: "Не потому что я тебе доверяю.", delay: 1200 },
        { from: "olivia", text: "Просто они сорвались на тебя, а ты даже не понял, куда попал.", delay: 1500 },
        { from: "olivia", text: "А я промолчала.", delay: 1000 }
      ]
    },
    {
      id: "intro_olivia_branch_same",
      chat: "private_olivia",
      trigger: "choice:intro_olivia_private:2",
      messages: [
        { from: "olivia", text: "Хорошо, что не только я.", delay: 1000 },
        { from: "olivia", text: "Потому что последние два дня я чувствую себя так, будто все вокруг знают больше меня.", delay: 1500 }
      ]
    },
    {
      id: "intro_olivia_common",
      chat: "private_olivia",
      trigger: "after:intro_olivia_branch_why|intro_olivia_branch_group|intro_olivia_branch_same",
      messages: [
        { from: "olivia", text: "Прости.", delay: 900 },
        { from: "olivia", text: "Я не хочу давить на тебя или делать вид, что мы уже знакомы.", delay: 1300 },
        { from: "olivia", text: "Просто… если тебе понадобится с кем-то поговорить не в этом сумасшедшем чате — можешь написать мне.", delay: 1600 },
        { from: "olivia", text: "И не слушай Брук слишком близко к сердцу.", delay: 1200 },
        { from: "olivia", text: "Она не всегда говорит то, что думает.", delay: 1100 },
        { from: "olivia", text: "Спокойной ночи.", delay: 1000 },
        { type: "system", text: "Оливия вышла из сети", delay: 900, characterStatus: { id: "olivia", online: false } }
      ]
    },
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
        { type: "pause", delay: 5000 },
        { from: "mia", text: "Ты не спишь?", delay: 900 },
        { from: "mia", text: "Я всё думаю про этот чат.", delay: 1100 },
        { from: "mia", text: "Странно вышло.", delay: 900 },
        { from: "mia", text: "Дерек просто добавил тебя, и через минуту все уже начали орать.", delay: 1500 },
        { from: "mia", text: "Ты правда раньше не слышал про Харпер?", delay: 1200 },
        { type: "choice", options: [
          { text: "Нет. Дерек впервые сказал мне о ней.", loyalty: {}, next: "intro_mia_never_heard" },
          { text: "А ты думаешь, я вру?", loyalty: {}, next: "intro_mia_lie_question" },
          { text: "Почему ты спрашиваешь?", loyalty: {}, next: "intro_mia_why_ask" }
        ]}
      ]
    },
    {
      id: "intro_mia_never_heard",
      chat: "private_mia",
      trigger: "choice:intro_mia_private:0",
      messages: [
        { from: "mia", text: "Ладно.", delay: 800 },
        { from: "mia", text: "Просто это слишком странное совпадение.", delay: 1200 },
        { from: "mia", text: "Харпер пропадает.", delay: 900 },
        { from: "mia", text: "Потом с её телефона отправляют твой номер.", delay: 1300 },
        { from: "mia", text: "И Дерек сразу решает, что надо собрать всех вместе.", delay: 1400 },
        { from: "mia", text: "Наверное, поэтому всё так быстро и сорвалось.", delay: 1300 }
      ]
    },
    {
      id: "intro_mia_lie_question",
      chat: "private_mia",
      trigger: "choice:intro_mia_private:1",
      messages: [
        { from: "mia", text: "Не знаю.", delay: 800 },
        { from: "mia", text: "Я тебя вообще не знаю.", delay: 1100 },
        { from: "mia", text: "Но и обвинять тебя с порога не хочу.", delay: 1200 }
      ]
    },
    {
      id: "intro_mia_why_ask",
      chat: "private_mia",
      trigger: "choice:intro_mia_private:2",
      messages: [
        { from: "mia", text: "Потому что никто не понимает, что происходит.", delay: 1300 },
        { from: "mia", text: "И все почему-то решили, что надо спорить друг с другом.", delay: 1400 }
      ]
    },
    {
      id: "intro_mia_common_first",
      chat: "private_mia",
      trigger: "after:intro_mia_never_heard|intro_mia_lie_question|intro_mia_why_ask",
      messages: [
        { from: "mia", text: "Я не хотела оставаться там.", delay: 1100 },
        { from: "mia", text: "Когда Брук и Дерек начинают спорить, лучше не лезть.", delay: 1400 },
        { from: "mia", text: "Всё равно никто никого не слышит.", delay: 1200 },
        { type: "choice", options: [
          { text: "Они часто так ссорятся?", loyalty: {}, next: "intro_mia_fights_often" },
          { text: "Ты на стороне Дерека или Брук?", loyalty: {}, next: "intro_mia_side_question" },
          { text: "Почему ты сама вышла?", loyalty: {}, next: "intro_mia_left_why" }
        ]}
      ]
    },
    {
      id: "intro_mia_fights_often",
      chat: "private_mia",
      trigger: "choice:intro_mia_common_first:0",
      messages: [
        { from: "mia", text: "Иногда.", delay: 800 },
        { from: "mia", text: "Но раньше это не выглядело так серьёзно.", delay: 1200 },
        { from: "mia", text: "После исчезновения Харпер всё стало хуже.", delay: 1200 }
      ]
    },
    {
      id: "intro_mia_side_question",
      chat: "private_mia",
      trigger: "choice:intro_mia_common_first:1",
      messages: [
        { from: "mia", text: "Ни на чьей.", delay: 800 },
        { from: "mia", text: "Брук иногда перегибает.", delay: 1000 },
        { from: "mia", text: "Дерек тоже.", delay: 900 },
        { from: "mia", text: "Просто по-разному.", delay: 1000 }
      ]
    },
    {
      id: "intro_mia_left_why",
      chat: "private_mia",
      trigger: "choice:intro_mia_common_first:2",
      messages: [
        { from: "mia", text: "Потому что они опять начали говорить друг с другом так, будто Харпер уже не важна.", delay: 1600 },
        { from: "mia", text: "Я это ненавижу.", delay: 1000 }
      ]
    },
    {
      id: "intro_mia_goodnight",
      chat: "private_mia",
      trigger: "after:intro_mia_fights_often|intro_mia_side_question|intro_mia_left_why",
      setFlags: {
        introComplete: true
      },
      messages: [
        { from: "mia", text: "Ладно.", delay: 900 },
        { from: "mia", text: "Не знаю, зачем вообще тебе написала.", delay: 1300 },
        { from: "mia", text: "Наверное, потому что ты единственный, кто пока никого из нас не знает.", delay: 1500 },
        { from: "mia", text: "И это может быть даже хорошо.", delay: 1200 },
        { from: "mia", text: "Спокойной ночи.", delay: 1000 },
        { type: "system", text: "Миа вышла из сети", delay: 1200, characterStatus: { id: "mia", online: false } }
      ]
    },
    {
      id: "intro_case_sort_task",
      chat: "private_mia",
      trigger: "after:intro_mia_goodnight",
      setFlags: {
        notesMechanicPending: true,
        notesUnread: true
      },
      messages: [
        { type: "pause", delay: 1800 },
        { type: "navigate", screen: "home", delay: 500 }
      ]
    },
    {
      id: "intro_post_case_notes",
      chat: "private_mia",
      trigger: "flag:nextMorningUnlocked",
      messages: [
        { type: "navigate", screen: "transition", params: { title: "07:42", lines: ["Ночь прошла.", "Следующее утро."], duration: 4200 }, delay: 4400 },
        { type: "navigate", screen: "home", delay: 700 }
      ]
    },
    {
      id: "morning_derek_photos",
      chat: "private_derek",
      trigger: "after:intro_post_case_notes",
      messages: [
        { type: "system", text: "Дерек в сети", delay: 700, characterStatus: { id: "derek", online: true } },
        { from: "derek", text: "Доброе утро.", delay: 900 },
        { from: "derek", text: "Ты, наверное, спишь ещё.", delay: 1100 },
        { from: "derek", text: "Но я обещал отправить фотографии Харпер.", delay: 1200 },
        { from: "derek", text: "Нашёл несколько в телефоне.", delay: 1000 },
        { from: "narrator", text: "Дерек отправил 3 фотографии.", delay: 800 },
        { from: "derek", type: "image", src: "src/assets/harper_photos/harper_street_selfie.jpg", caption: "Фото 1", delay: 900 },
        { from: "derek", type: "image", src: "src/assets/harper_photos/harper_with_friends.jpg", caption: "Фото 2", delay: 900 },
        { from: "derek", type: "image", src: "src/assets/harper_photos/harper_larks_window.jpg", caption: "Фото 3", delay: 900 },
        { from: "derek", text: "Посмотри внимательно.", delay: 900 },
        { from: "derek", text: "Вдруг что-то покажется знакомым.", delay: 1100 },
        { type: "choice", options: [
          { text: "Нет. Я всё ещё вижу её впервые.", loyalty: {}, next: "morning_derek_photos_never_seen" },
          { text: "На третьей фотографии что-то знакомое.", loyalty: {}, next: "morning_derek_photos_familiar" },
          { text: "Ты уверен, что это все фотографии?", loyalty: {}, next: "morning_derek_photos_all" }
        ]}
      ]
    },
    {
      id: "morning_derek_photos_never_seen",
      chat: "private_derek",
      trigger: "choice:morning_derek_photos:0",
      messages: [
        { from: "derek", text: "Понял.", delay: 800 },
        { from: "derek", text: "Прости.", delay: 800 },
        { from: "derek", text: "Я просто хватаюсь за всё подряд.", delay: 1100 }
      ]
    },
    {
      id: "morning_derek_photos_familiar",
      chat: "private_derek",
      trigger: "choice:morning_derek_photos:1",
      messages: [
        { from: "derek", text: "Что именно?", delay: 800 },
        { type: "choice", options: [
          { text: "Не могу понять. Может, место.", loyalty: {}, next: "morning_derek_photos_place" },
          { text: "Наверное, мне просто показалось.", loyalty: {}, next: "morning_derek_photos_mistake" }
        ]}
      ]
    },
    {
      id: "morning_derek_photos_place",
      chat: "private_derek",
      trigger: "choice:morning_derek_photos_familiar:0",
      messages: [
        { from: "derek", text: "Место уже что-то.", delay: 900 },
        { from: "derek", text: "Даже если не уверен.", delay: 900 },
        { from: "derek", text: "Если вспомнишь — сразу напиши.", delay: 1000 }
      ]
    },
    {
      id: "morning_derek_photos_mistake",
      chat: "private_derek",
      trigger: "choice:morning_derek_photos_familiar:1",
      messages: [
        { from: "derek", text: "Может.", delay: 800 },
        { from: "derek", text: "Но если нет — не дави на себя.", delay: 1000 },
        { from: "derek", text: "Я и так слишком давлю на всех вокруг.", delay: 1200 }
      ]
    },
    {
      id: "morning_derek_photos_all",
      chat: "private_derek",
      trigger: "choice:morning_derek_photos:2",
      messages: [
        { from: "derek", text: "Нет.", delay: 700 },
        { from: "derek", text: "У неё их тысячи.", delay: 900 },
        { from: "derek", text: "Я просто выбрал те, что были сделаны недавно.", delay: 1200 }
      ]
    },
    {
      id: "morning_derek_photos_common",
      chat: "private_derek",
      trigger: "after:morning_derek_photos_never_seen|morning_derek_photos_place|morning_derek_photos_mistake|morning_derek_photos_all",
      messages: [
        { from: "derek", text: "Я сегодня ещё попробую поговорить с полицией.", delay: 1100 },
        { from: "derek", text: "И с Оливией.", delay: 900 },
        { from: "derek", text: "Может, она вспомнит что-то ещё.", delay: 1100 },
        { from: "derek", text: "Спасибо, что не отмахнулся от меня вчера.", delay: 1200 },
        { from: "derek", text: "Я напишу позже.", delay: 900 },
        { type: "system", text: "Дерек вышел из сети", delay: 900, characterStatus: { id: "derek", online: false } }
      ]
    },
    {
      id: "morning_olivia_cafe_photo",
      chat: "private_olivia",
      trigger: "after:morning_derek_photos_common",
      unlock: [
        { type: "chats", id: "private_olivia" },
        { type: "contacts", id: "olivia" }
      ],
      identify: ["olivia"],
      messages: [
        { type: "pause", delay: 4500 },
        { type: "system", text: "Оливия в сети", delay: 600, characterStatus: { id: "olivia", online: true } },
        { from: "olivia", text: "Ты тут?", delay: 900 },
        { from: "olivia", text: "Я снова открыла чат с Харпер.", delay: 1200 },
        { from: "olivia", text: "И нашла кое-что, о чём совсем забыла.", delay: 1200 },
        { type: "choice", options: [
          { text: "Что ты нашла?", loyalty: {}, next: "morning_olivia_photo_found" },
          { text: "Это связано с её исчезновением?", loyalty: {}, next: "morning_olivia_photo_related" },
          { text: "Ты в порядке?", loyalty: {}, trust: { oliviaTrust: 1 }, next: "morning_olivia_photo_careful" }
        ]}
      ]
    },
    {
      id: "morning_olivia_photo_found",
      chat: "private_olivia",
      trigger: "choice:morning_olivia_cafe_photo:0",
      messages: [
        { from: "olivia", text: "Фотографию.", delay: 900 },
        { from: "olivia", text: "Старую.", delay: 900 }
      ]
    },
    {
      id: "morning_olivia_photo_related",
      chat: "private_olivia",
      trigger: "choice:morning_olivia_cafe_photo:1",
      messages: [
        { from: "olivia", text: "Не знаю.", delay: 800 },
        { from: "olivia", text: "Она сделана ещё до того вечера.", delay: 1100 }
      ]
    },
    {
      id: "morning_olivia_photo_careful",
      chat: "private_olivia",
      trigger: "choice:morning_olivia_cafe_photo:2",
      messages: [
        { from: "olivia", text: "Не очень.", delay: 900 },
        { from: "olivia", text: "Но я пишу не поэтому.", delay: 1100 }
      ]
    },
    {
      id: "morning_olivia_photo_common",
      chat: "private_olivia",
      trigger: "after:morning_olivia_photo_related|morning_olivia_photo_found|morning_olivia_photo_careful",
      messages: [
        { from: "olivia", text: "Я сделала фотку за четыре дня до того, как Харпер пропала.", delay: 1300 },
        { from: "olivia", text: "Мы сидели в Larks.", delay: 1000 },
        { from: "olivia", text: "Потом Харпер попросила меня не удалять фотографию.", delay: 1300 },
        { from: "olivia", text: "Сказала: «Оставь. Вдруг понадобится».", delay: 1300 },
        { from: "olivia", text: "Я спросила, зачем.", delay: 900 },
        { from: "olivia", text: "Она ответила: «Потом объясню».", delay: 1100 },
        { from: "olivia", text: "Но так и не объяснила.", delay: 1100 },
        { from: "olivia", text: "Сейчас отправлю.", delay: 900 },
        { from: "narrator", text: "Оливия отправила фотографию.", delay: 700 },
        { from: "olivia", type: "image", src: "src/assets/harper_photos/harper_larks_inside_olivia.jpg", caption: "Larks", delay: 900 },
        { from: "olivia", text: "Ты ведь не из Рейвенвуда?", delay: 1100 },
        { type: "choice", options: [
          { text: "Нет. Я из другого города.", loyalty: {}, next: "morning_olivia_ravenwood_other_city" },
          { text: "Нет. А почему ты спросила?", loyalty: {}, next: "morning_olivia_ravenwood_why" },
          { text: "Я вообще никогда не был в Рейвенвуде.", loyalty: {}, next: "morning_olivia_ravenwood_never" }
        ]}
      ]
    },
    {
      id: "morning_olivia_ravenwood_other_city",
      chat: "private_olivia",
      trigger: "choice:morning_olivia_photo_common:0",
      messages: [
        { from: "olivia", text: "Тогда ты, наверное, не знаешь это место.", delay: 1100 }
      ]
    },
    {
      id: "morning_olivia_ravenwood_why",
      chat: "private_olivia",
      trigger: "choice:morning_olivia_photo_common:1",
      messages: [
        { from: "olivia", text: "Просто стало интересно.", delay: 1000 }
      ]
    },
    {
      id: "morning_olivia_ravenwood_never",
      chat: "private_olivia",
      trigger: "choice:morning_olivia_photo_common:2",
      messages: [
        { from: "olivia", text: "Поняла.", delay: 800 },
        { from: "olivia", text: "Здесь почти все хотя бы раз были в Larks.", delay: 1200 }
      ]
    },
    {
      id: "morning_olivia_place_common",
      chat: "private_olivia",
      trigger: "after:morning_olivia_ravenwood_other_city|morning_olivia_ravenwood_why|morning_olivia_ravenwood_never",
      messages: [
        { from: "olivia", text: "Это кафе на Ривер-стрит.", delay: 1000 },
        { from: "olivia", text: "Напротив старого кинотеатра.", delay: 1000 },
        { from: "olivia", text: "В Рейвенвуде всё рядом.", delay: 1000 },
        { from: "olivia", text: "Иногда от этого даже не по себе.", delay: 1100 },
        { from: "olivia", text: "Кажется, будто от людей невозможно спрятаться.", delay: 1300 },
        { from: "olivia", text: "На этом фото Харпер смотрит на улицу.", delay: 1200 },
        { from: "olivia", text: "И мне кажется, весь вечер она постоянно туда поглядывала.", delay: 1400 },
        { from: "olivia", text: "Я думала, она просто отвлеклась.", delay: 1100 },
        { from: "olivia", text: "Но теперь уже не уверена.", delay: 1000 },
        { type: "choice", options: [
          { text: "Зелёная машина стояла там всё время?", loyalty: {}, next: "morning_olivia_clue_car" },
          { text: "А человек на другой стороне улицы?", loyalty: {}, next: "morning_olivia_clue_person" },
          { text: "Может, это вообще не связано с её исчезновением?", loyalty: {}, next: "morning_olivia_clue_unrelated" }
        ]}
      ]
    },
    {
      id: "morning_olivia_clue_car",
      chat: "private_olivia",
      trigger: "choice:morning_olivia_place_common:0",
      messages: [
        { from: "olivia", text: "Кажется, да.", delay: 900 },
        { from: "olivia", text: "Она уже стояла напротив, когда мы пришли.", delay: 1200 },
        { from: "olivia", text: "И когда уходили — тоже.", delay: 1100 }
      ]
    },
    {
      id: "morning_olivia_clue_person",
      chat: "private_olivia",
      trigger: "choice:morning_olivia_place_common:1",
      messages: [
        { from: "olivia", text: "Я его тогда не заметила.", delay: 1000 },
        { from: "olivia", text: "Только сейчас, когда снова открыла фотографию.", delay: 1200 },
        { from: "olivia", text: "Но там слишком далеко. Лица всё равно не видно.", delay: 1300 }
      ]
    },
    {
      id: "morning_olivia_clue_unrelated",
      chat: "private_olivia",
      trigger: "choice:morning_olivia_place_common:2",
      messages: [
        { from: "olivia", text: "Может.", delay: 800 },
        { from: "olivia", text: "Я очень хочу, чтобы так и было.", delay: 1100 },
        { from: "olivia", text: "Но Харпер не просто так попросила сохранить фотографию.", delay: 1300 }
      ]
    },
    {
      id: "morning_olivia_followed_common",
      chat: "private_olivia",
      trigger: "after:morning_olivia_clue_car|morning_olivia_clue_person|morning_olivia_clue_unrelated",
      messages: [
        { from: "olivia", text: "В тот вечер я спросила, всё ли у неё нормально.", delay: 1200 },
        { from: "olivia", text: "Она сказала, что ей показалось, будто за ней кто-то следит.", delay: 1400 },
        { from: "olivia", text: "А потом сразу перевела разговор.", delay: 1100 },
        { from: "olivia", text: "Я решила, что она просто устала.", delay: 1100 },
        { from: "olivia", text: "Теперь мне кажется, что я должна была отнестись к этому серьёзнее.", delay: 1500 },
        { type: "choice", options: [
          { text: "Почему ты не сказала об этом раньше?", loyalty: {}, next: "morning_olivia_why_silent" },
          { text: "Похоже, Харпер правда кого-то заметила.", loyalty: {}, trust: { oliviaTrust: 1 }, next: "morning_olivia_harper_noticed" },
          { text: "Ты уверена, что она говорила серьёзно?", loyalty: {}, next: "morning_olivia_was_serious" }
        ]}
      ]
    },
    {
      id: "morning_olivia_why_silent",
      chat: "private_olivia",
      trigger: "choice:morning_olivia_followed_common:0",
      messages: [
        { from: "olivia", text: "Потому что я сама не поняла, насколько это серьёзно.", delay: 1300 },
        { from: "olivia", text: "А потом Харпер пропала.", delay: 1000 },
        { from: "olivia", text: "И я испугалась, что все решат, будто я могла что-то предотвратить.", delay: 1500 }
      ]
    },
    {
      id: "morning_olivia_harper_noticed",
      chat: "private_olivia",
      trigger: "choice:morning_olivia_followed_common:1",
      messages: [
        { from: "olivia", text: "Возможно.", delay: 800 },
        { from: "olivia", text: "И от этого мне становится только хуже.", delay: 1200 }
      ]
    },
    {
      id: "morning_olivia_was_serious",
      chat: "private_olivia",
      trigger: "choice:morning_olivia_followed_common:2",
      messages: [
        { from: "olivia", text: "Нет.", delay: 800 },
        { from: "olivia", text: "Она улыбалась, когда это сказала.", delay: 1100 },
        { from: "olivia", text: "Но Харпер всегда так делала, когда нервничала.", delay: 1300 }
      ]
    },
    {
      id: "morning_olivia_next_step_common",
      chat: "private_olivia",
      trigger: "after:morning_olivia_why_silent|morning_olivia_harper_noticed|morning_olivia_was_serious",
      messages: [
        { from: "olivia", text: "Я не хочу сразу отправлять это всем.", delay: 1200 },
        { from: "olivia", text: "Брук увидит машину и сразу решит, что уже знает, кто виноват.", delay: 1400 },
        { from: "olivia", text: "А Дерек...", delay: 900 },
        { from: "olivia", text: "Он и так хватается за любую мелочь.", delay: 1100 },
        { from: "olivia", text: "Но Миа, возможно, сможет помочь.", delay: 1200 },
        { from: "olivia", text: "На следующий день после этой встречи она виделась с Харпер.", delay: 1300 },
        { from: "olivia", text: "Может, заметила, что Харпер вела себя странно.", delay: 1200 },
        { from: "olivia", text: "Или Харпер что-то ей сказала.", delay: 1000 },
        { type: "choice", options: [
          { text: "Добавь Мию. Посмотрим на фото втроём.", loyalty: {}, trust: { oliviaTrust: 1 }, next: "morning_olivia_add_mia" },
          { text: "Сначала надо показать это Дереку.", loyalty: {}, next: "morning_olivia_show_derek" },
          { text: "Пока не надо подключать Дерека и Брук.", loyalty: {}, next: "morning_olivia_avoid_derek_brooke" }
        ]}
      ]
    },
    {
      id: "morning_olivia_add_mia",
      chat: "private_olivia",
      trigger: "choice:morning_olivia_next_step_common:0",
      messages: [
        { from: "olivia", text: "Хорошо.", delay: 900 }
      ]
    },
    {
      id: "morning_olivia_show_derek",
      chat: "private_olivia",
      trigger: "choice:morning_olivia_next_step_common:1",
      messages: [
        { from: "olivia", text: "Я понимаю.", delay: 900 },
        { from: "olivia", text: "Но если я отправлю это ему сейчас, он начнёт звонить всем подряд.", delay: 1400 },
        { from: "olivia", text: "Давай сначала спросим Мию.", delay: 1100 },
        { from: "olivia", text: "Потом решим, что говорить Дереку.", delay: 1200 }
      ]
    },
    {
      id: "morning_olivia_avoid_derek_brooke",
      chat: "private_olivia",
      trigger: "choice:morning_olivia_next_step_common:2",
      messages: [
        { from: "olivia", text: "Да.", delay: 800 },
        { from: "olivia", text: "Тогда сначала поговорим с Мией.", delay: 1100 }
      ]
    },
    {
      id: "morning_olivia_larks_group",
      chat: "private_olivia",
      trigger: "after:morning_olivia_add_mia|morning_olivia_show_derek|morning_olivia_avoid_derek_brooke",
      unlock: [
        { type: "chats", id: "group_larks" }
      ],
      messages: [
        { from: "olivia", text: "Я создам маленький чат.", delay: 1000 },
        { from: "olivia", text: "Только ты, я и Миа.", delay: 1000 },
        { from: "olivia", text: "Без догадок.", delay: 900 },
        { from: "olivia", text: "Просто посмотрим, кто что помнит.", delay: 1200 }
      ]
    },
    {
      id: "larks_group_start",
      chat: "group_larks",
      trigger: "after:morning_olivia_larks_group",
      identify: ["mia", "olivia"],
      messages: [
        { from: "narrator", text: "Оливия создала группу «Larks».", delay: 900 },
        { from: "narrator", text: "Оливия добавила {player}.", delay: 700 },
        { from: "narrator", text: "Оливия добавила Миа.", delay: 700 },
        { type: "system", text: "Миа в сети", delay: 800, characterStatus: { id: "mia", online: true } },
        { from: "mia", text: "Оливия?", delay: 800 },
        { from: "mia", text: "Привет, {player}.", delay: 900 },
        { from: "mia", text: "Что за чат?", delay: 900 },
        { from: "olivia", text: "Я нашла фотографию Харпер.", delay: 1100 },
        { from: "olivia", text: "Подумала, что ты можешь кое-что вспомнить.", delay: 1200 },
        { from: "mia", text: "Хорошо.", delay: 800 },
        { from: "mia", text: "Покажи.", delay: 800 },
        { type: "choice", options: [
          { text: "Привет, Миа.", loyalty: {}, next: "larks_group_greet_mia" },
          { text: "Ты как после вчерашнего?", loyalty: {}, trust: { miaTrust: 1 }, next: "larks_group_ask_mia" },
          { text: "Оливия нашла фото из Larks.", loyalty: {}, next: "larks_group_larks_photo" }
        ]}
      ]
    },
    {
      id: "larks_group_greet_mia",
      chat: "group_larks",
      trigger: "choice:larks_group_start:0",
      messages: [
        { from: "mia", text: "Привет.", delay: 800 },
        { from: "mia", text: "Давай посмотрим, что там.", delay: 1000 }
      ]
    },
    {
      id: "larks_group_ask_mia",
      chat: "group_larks",
      trigger: "choice:larks_group_start:1",
      messages: [
        { from: "mia", text: "Нормально.", delay: 800 },
        { from: "mia", text: "Ну, насколько сейчас вообще можно быть нормально.", delay: 1300 },
        { from: "mia", text: "Спасибо, что спросил.", delay: 900 }
      ]
    },
    {
      id: "larks_group_larks_photo",
      chat: "group_larks",
      trigger: "choice:larks_group_start:2",
      messages: [
        { from: "mia", text: "Из Larks?", delay: 900 },
        { from: "mia", text: "Тогда показывай.", delay: 900 }
      ]
    },
    {
      id: "larks_group_photo_common",
      chat: "group_larks",
      trigger: "after:larks_group_greet_mia|larks_group_ask_mia|larks_group_larks_photo",
      messages: [
        { from: "olivia", text: "Сейчас.", delay: 800 },
        { from: "narrator", text: "Оливия отправила фотографию.", delay: 700 },
        { from: "olivia", type: "image", src: "src/assets/harper_photos/harper_larks_inside_olivia.jpg", caption: "Larks", delay: 900 },
        { from: "mia", text: "Это было за несколько дней до исчезновения?", delay: 1200 },
        { from: "olivia", text: "За четыре дня.", delay: 900 },
        { from: "mia", text: "Я помню этот день.", delay: 1000 },
        { from: "olivia", text: "Ты видела Харпер на следующий день после этого.", delay: 1200 },
        { from: "mia", text: "Да.", delay: 700 },
        { from: "mia", text: "Мы случайно встретились у Риверуока.", delay: 1100 },
        { type: "choice", options: [
          { text: "Она сама туда пришла?", loyalty: {}, next: "larks_group_riverwalk_came" },
          { text: "Она выглядела нормально?", loyalty: {}, next: "larks_group_riverwalk_looked" },
          { text: "Риверуок — это набережная?", loyalty: {}, next: "larks_group_riverwalk_place" }
        ]}
      ]
    },
    {
      id: "larks_group_riverwalk_came",
      chat: "group_larks",
      trigger: "choice:larks_group_photo_common:0",
      messages: [
        { from: "mia", text: "Да.", delay: 700 },
        { from: "mia", text: "Сказала, что не хочет сразу идти домой.", delay: 1200 }
      ]
    },
    {
      id: "larks_group_riverwalk_looked",
      chat: "group_larks",
      trigger: "choice:larks_group_photo_common:1",
      messages: [
        { from: "mia", text: "Сначала — да.", delay: 900 },
        { from: "mia", text: "Просто немного уставшей.", delay: 1000 }
      ]
    },
    {
      id: "larks_group_riverwalk_place",
      chat: "group_larks",
      trigger: "choice:larks_group_photo_common:2",
      messages: [
        { from: "mia", text: "Да.", delay: 700 },
        { from: "mia", text: "У старого моста.", delay: 900 },
        { from: "mia", text: "Там обычно тихо, особенно вечером.", delay: 1200 }
      ]
    },
    {
      id: "larks_group_walk_common",
      chat: "group_larks",
      trigger: "after:larks_group_riverwalk_came|larks_group_riverwalk_looked|larks_group_riverwalk_place",
      messages: [
        { from: "mia", text: "Мы немного прошлись вдоль реки.", delay: 1100 },
        { from: "mia", text: "Потом она купила кофе из автомата.", delay: 1100 },
        { from: "mia", text: "И сказала, что он всё равно хуже, чем в Larks.", delay: 1200 },
        { from: "olivia", text: "Но всё равно выпила?", delay: 900 },
        { from: "mia", text: "До последней капли.", delay: 900 },
        { type: "choice", options: [
          { text: "Похоже, она была упрямой.", loyalty: {}, trust: { miaTrust: 1 }, next: "larks_group_stubborn" },
          { text: "Вы часто там гуляли?", loyalty: {}, next: "larks_group_walk_often" },
          { text: "Она говорила о том, что за ней следят?", loyalty: {}, next: "larks_group_followed" }
        ]}
      ]
    },
    {
      id: "larks_group_stubborn",
      chat: "group_larks",
      trigger: "choice:larks_group_walk_common:0",
      messages: [
        { from: "mia", text: "Очень.", delay: 800 },
        { from: "mia", text: "Иногда это раздражало.", delay: 1000 },
        { from: "mia", text: "Но чаще было смешно.", delay: 1000 }
      ]
    },
    {
      id: "larks_group_walk_often",
      chat: "group_larks",
      trigger: "choice:larks_group_walk_common:1",
      messages: [
        { from: "mia", text: "Иногда.", delay: 800 },
        { from: "mia", text: "В Рейвенвуде не так много мест, где можно просто побыть одной.", delay: 1400 },
        { from: "mia", text: "У воды хотя бы спокойно.", delay: 1000 }
      ]
    },
    {
      id: "larks_group_followed",
      chat: "group_larks",
      trigger: "choice:larks_group_walk_common:2",
      messages: [
        { from: "mia", text: "Не прямо.", delay: 800 },
        { from: "mia", text: "Но потом она спросила кое-что странное.", delay: 1200 }
      ]
    },
    {
      id: "larks_group_sedan_common",
      chat: "group_larks",
      trigger: "after:larks_group_stubborn|larks_group_walk_often|larks_group_followed",
      messages: [
        { from: "mia", text: "Она спросила, не замечала ли я возле старого моста тёмно-зелёный седан.", delay: 1500 },
        { from: "olivia", text: "Такой, как на фотографии?", delay: 1000 },
        { from: "mia", text: "Не знаю.", delay: 800 },
        { from: "mia", text: "Она не сказала марку.", delay: 1000 },
        { from: "mia", text: "Просто спросила, видела ли я его раньше.", delay: 1200 },
        { type: "choice", options: [
          { text: "На фото возле Larks тоже стоит зелёный седан.", loyalty: {}, next: "larks_group_same_car" },
          { text: "Может, это была другая машина.", loyalty: {}, next: "larks_group_other_car" },
          { text: "Что ты ей ответила?", loyalty: {}, next: "larks_group_what_answer" }
        ]}
      ]
    },
    {
      id: "larks_group_same_car",
      chat: "group_larks",
      trigger: "choice:larks_group_sedan_common:0",
      messages: [
        { from: "mia", text: "Тогда это уже не так похоже на совпадение.", delay: 1200 }
      ]
    },
    {
      id: "larks_group_other_car",
      chat: "group_larks",
      trigger: "choice:larks_group_sedan_common:1",
      messages: [
        { from: "mia", text: "Может.", delay: 800 },
        { from: "mia", text: "Я очень хочу, чтобы так и было.", delay: 1100 }
      ]
    },
    {
      id: "larks_group_what_answer",
      chat: "group_larks",
      trigger: "choice:larks_group_sedan_common:2",
      messages: []
    },
    {
      id: "larks_group_phone_common",
      chat: "group_larks",
      trigger: "after:larks_group_same_car|larks_group_other_car|larks_group_what_answer",
      messages: [
        { from: "mia", text: "Я сказала, что не помню.", delay: 1000 },
        { from: "mia", text: "Она посмотрела на дорогу.", delay: 1000 },
        { from: "mia", text: "Потом сказала: «Ладно. Забудь».", delay: 1100 },
        { from: "mia", text: "И больше про машину не говорила.", delay: 1200 },
        { from: "olivia", text: "Значит, она могла заметить её дважды.", delay: 1200 },
        { from: "mia", text: "Или просто решила, что это одна и та же машина.", delay: 1200 },
        { from: "mia", text: "Не знаю.", delay: 800 },
        { from: "mia", text: "После этого её телефон разрядился.", delay: 1100 },
        { from: "olivia", text: "Она пользовалась твоим?", delay: 900 },
        { from: "mia", text: "Да.", delay: 700 },
        { from: "mia", text: "Попросила отправить одно сообщение.", delay: 1100 },
        { from: "olivia", text: "Ты видела, кому?", delay: 900 },
        { from: "mia", text: "Нет.", delay: 700 },
        { from: "mia", text: "Она отправила его и почти сразу всё удалила.", delay: 1200 },
        { from: "player", text: "У тебя остался этот телефон?", delay: 900 },
        { from: "mia", text: "Да.", delay: 700 },
        { from: "mia", text: "Он дома.", delay: 800 },
        { from: "mia", text: "Я смогу посмотреть его только вечером.", delay: 1100 },
        { from: "mia", text: "Но пока можно попробовать собрать на карте места, где Харпер была в последние дни.", delay: 1500 },
        { from: "mia", text: "Мы всё знаем кусками.", delay: 1000 },
        { from: "mia", text: "Может, если увидеть это на карте, станет понятнее, куда она ходила.", delay: 1400 },
        { type: "choice", options: [
          { text: "Давай. Попробую собрать всё, что мы знаем.", loyalty: {}, next: "larks_group_map_yes" },
          { text: "А если это ничего не даст?", loyalty: {}, next: "larks_group_map_doubt" },
          { text: "С чего начать?", loyalty: {}, next: "larks_group_map_start" }
        ]}
      ]
    },
    {
      id: "larks_group_map_yes",
      chat: "group_larks",
      trigger: "choice:larks_group_phone_common:0",
      messages: [
        { from: "mia", text: "Начни с того, что мы знаем точно.", delay: 1100 }
      ]
    },
    {
      id: "larks_group_map_doubt",
      chat: "group_larks",
      trigger: "choice:larks_group_phone_common:1",
      messages: [
        { from: "mia", text: "Тогда хотя бы перестанем путаться в том, что уже известно.", delay: 1300 }
      ]
    },
    {
      id: "larks_group_map_start",
      chat: "group_larks",
      trigger: "choice:larks_group_phone_common:2",
      messages: [
        { from: "mia", text: "С Larks и Риверуока.", delay: 1000 },
        { from: "mia", text: "Там Харпер точно была.", delay: 1000 }
      ]
    },
    {
      id: "larks_group_map_task_common",
      chat: "group_larks",
      trigger: "after:larks_group_map_yes|larks_group_map_doubt|larks_group_map_start",
      messages: [
        { from: "olivia", text: "Я скину карту Рейвенвуда.", delay: 1100 },
        { from: "olivia", text: "Отмечай только подтверждённые места.", delay: 1100 },
        { from: "olivia", text: "Без догадок.", delay: 900 },
        { from: "olivia", text: "У меня сейчас дела, я не смогу сидеть в чате.", delay: 1300 },
        { from: "olivia", text: "Но ты справишься?", delay: 900 },
        { type: "choice", options: [
          { text: "Да. Разберусь.", loyalty: {}, next: "larks_group_map_ready" },
          { text: "Скидывай карту.", loyalty: {}, next: "larks_group_map_send" },
          { text: "Постараюсь ничего не перепутать.", loyalty: {}, next: "larks_group_map_careful" }
        ]}
      ]
    },
    {
      id: "larks_group_map_ready",
      chat: "group_larks",
      trigger: "choice:larks_group_map_task_common:0",
      messages: [
        { from: "olivia", text: "Хорошо.", delay: 800 }
      ]
    },
    {
      id: "larks_group_map_send",
      chat: "group_larks",
      trigger: "choice:larks_group_map_task_common:1",
      messages: [
        { from: "olivia", text: "Уже отправляю.", delay: 900 }
      ]
    },
    {
      id: "larks_group_map_careful",
      chat: "group_larks",
      trigger: "choice:larks_group_map_task_common:2",
      messages: [
        { from: "olivia", text: "Просто держись того, что мы знаем наверняка.", delay: 1200 }
      ]
    },
    {
      id: "larks_group_map_document",
      chat: "group_larks",
      trigger: "after:larks_group_map_ready|larks_group_map_send|larks_group_map_careful",
      messages: [
        { from: "narrator", text: "Оливия отправила документ.", delay: 800 },
        { from: "olivia", type: "document", title: "Карта Рейвенвуда", subtitle: "Документ · открыть карту", text: "Карта Рейвенвуда", documentId: "ravenwood_map", delay: 900 },
        { from: "mia", text: "Я напишу, когда доберусь до телефона.", delay: 1200 },
        { from: "mia", text: "До вечера.", delay: 900 },
        { type: "system", text: "Миа вышла из сети", delay: 800, characterStatus: { id: "mia", online: false } },
        { from: "olivia", text: "До связи.", delay: 900 },
        { type: "system", text: "Оливия вышла из сети", delay: 800, characterStatus: { id: "olivia", online: false } }
      ]
    },
    {
      id: "larks_evening_update_note",
      chat: "group_larks",
      trigger: "flag:ravenwoodMapAddedToCase",
      messages: [
        { type: "pause", delay: 900 },
        { type: "note_auto", id: "harper_larks_timeline", appendTo: "harper_intro_summary", title: "Харпер Вэнс", time: "18:37", text: "18:37 — карта обновлена\n\nКАРТА\n• Larks: Харпер была там с Оливией за четыре дня до исчезновения.\n• Riverwalk: на следующий день Миа встретила Харпер у старого моста.\n\nОБЩАЯ ДЕТАЛЬ\n• На фото из Larks виден тёмно-зелёный седан.\n• Позже Харпер спрашивала Мию о похожей машине возле моста.\n\nПОКА НЕЯСНО\n• Это один и тот же седан?\n• Почему Харпер не хотела идти домой?\n• Кому она написала с телефона Мии?\n\nСЛЕДУЮЩЕЕ\n\nМиа вечером проверит старый телефон.", noteCompleteFlag: "larksEveningUpdateWritten", notificationText: "Обновить хронологию", skipIfFlag: "larksEveningUpdateWritten", delay: 700 },
        { type: "wait_flag", flag: "larksEveningUpdateWritten", delay: 900 }
      ]
    },
    {
      id: "larks_olivia_after_map_start",
      chat: "private_olivia",
      trigger: "after:larks_evening_update_note",
      messages: [
        { type: "system", text: "Оливия в сети", delay: 1200, characterStatus: { id: "olivia", online: true } },
        { from: "olivia", text: "Я заглянула на минуту.", delay: 1000 },
        { from: "olivia", text: "Увидела, что ты закончил с картой.", delay: 1100 },
        { from: "olivia", text: "Спасибо.", delay: 900 },
        { type: "choice", options: [
          { text: "Ты сама сказала отмечать только то, что мы знаем точно.", loyalty: {}, trust: { oliviaTrust: 1 }, next: "larks_olivia_map_exact" },
          { text: "Пока это всего две точки.", loyalty: {}, next: "larks_olivia_map_two_points" },
          { text: "Надеюсь, Миа найдёт что-то в телефоне.", loyalty: {}, next: "larks_olivia_map_mia_phone" }
        ]}
      ]
    },
    {
      id: "larks_olivia_map_exact",
      chat: "private_olivia",
      trigger: "choice:larks_olivia_after_map_start:0",
      messages: [
        { from: "olivia", text: "Просто обычно люди хватаются за первую версию, которая кажется понятной.", delay: 1400 },
        { from: "olivia", text: "А ты не стал делать выводы раньше времени.", delay: 1200 }
      ]
    },
    {
      id: "larks_olivia_map_two_points",
      chat: "private_olivia",
      trigger: "choice:larks_olivia_after_map_start:1",
      messages: [
        { from: "olivia", text: "Но раньше у нас не было даже этого.", delay: 1100 }
      ]
    },
    {
      id: "larks_olivia_map_mia_phone",
      chat: "private_olivia",
      trigger: "choice:larks_olivia_after_map_start:2",
      messages: [
        { from: "olivia", text: "Я тоже.", delay: 800 },
        { from: "olivia", text: "Только боюсь, что там может быть что-то, к чему мы не готовы.", delay: 1400 }
      ]
    },
    {
      id: "larks_olivia_places_common",
      chat: "private_olivia",
      trigger: "after:larks_olivia_map_exact|larks_olivia_map_two_points|larks_olivia_map_mia_phone",
      messages: [
        { from: "olivia", text: "Странно смотреть на эти места со стороны.", delay: 1200 },
        { from: "olivia", text: "Larks. Потом Риверуок.", delay: 1000 },
        { from: "olivia", text: "Обычные места.", delay: 900 },
        { from: "olivia", text: "Мы там были столько раз.", delay: 1000 },
        { from: "olivia", text: "А теперь кажется, будто в них всё изменилось.", delay: 1300 },
        { type: "choice", options: [
          { text: "Тебе тяжело туда возвращаться мыслями?", loyalty: {}, trust: { oliviaTrust: 1 }, next: "larks_olivia_hard_to_return" },
          { text: "Ты не могла заранее понять, что что-то случится.", loyalty: {}, next: "larks_olivia_not_your_fault" },
          { text: "Теперь хотя бы видно, где искать дальше.", loyalty: {}, next: "larks_olivia_where_to_search" }
        ]}
      ]
    },
    {
      id: "larks_olivia_hard_to_return",
      chat: "private_olivia",
      trigger: "choice:larks_olivia_places_common:0",
      messages: [
        { from: "olivia", text: "Да.", delay: 800 },
        { from: "olivia", text: "Особенно к Larks.", delay: 1000 },
        { from: "olivia", text: "Я всё прокручиваю тот вечер и думаю, что могла заметить раньше.", delay: 1400 }
      ]
    },
    {
      id: "larks_olivia_not_your_fault",
      chat: "private_olivia",
      trigger: "choice:larks_olivia_places_common:1",
      messages: [
        { from: "olivia", text: "Наверное.", delay: 800 },
        { from: "olivia", text: "Но от этого не становится легче.", delay: 1100 }
      ]
    },
    {
      id: "larks_olivia_where_to_search",
      chat: "private_olivia",
      trigger: "choice:larks_olivia_places_common:2",
      messages: [
        { from: "olivia", text: "Возможно.", delay: 800 },
        { from: "olivia", text: "Просто мне страшно, что мы найдём не то, на что надеемся.", delay: 1300 }
      ]
    },
    {
      id: "larks_olivia_harper_secret_common",
      chat: "private_olivia",
      trigger: "after:larks_olivia_hard_to_return|larks_olivia_not_your_fault|larks_olivia_where_to_search",
      messages: [
        { from: "olivia", text: "Я была уверена, что знаю Харпер.", delay: 1200 },
        { from: "olivia", text: "Но последние дни...", delay: 1000 },
        { from: "olivia", text: "Она будто что-то решила сама и никому не сказала.", delay: 1300 },
        { type: "choice", options: [
          { text: "Она могла не хотеть втягивать вас.", loyalty: {}, next: "larks_olivia_harper_protecting" },
          { text: "Ты говорила, что она часто всё держала в себе.", loyalty: {}, next: "larks_olivia_harper_closed" },
          { text: "Может, она сама не понимала, что происходит.", loyalty: {}, next: "larks_olivia_harper_confused" }
        ]}
      ]
    },
    {
      id: "larks_olivia_harper_protecting",
      chat: "private_olivia",
      trigger: "choice:larks_olivia_harper_secret_common:0",
      messages: [
        { from: "olivia", text: "Да.", delay: 800 },
        { from: "olivia", text: "Харпер часто так делала.", delay: 1000 },
        { from: "olivia", text: "Решала, что справится одна.", delay: 1000 }
      ]
    },
    {
      id: "larks_olivia_harper_closed",
      chat: "private_olivia",
      trigger: "choice:larks_olivia_harper_secret_common:1",
      messages: [
        { from: "olivia", text: "Да.", delay: 800 },
        { from: "olivia", text: "Особенно когда боялась, что кто-то начнёт переживать за неё.", delay: 1300 }
      ]
    },
    {
      id: "larks_olivia_harper_confused",
      chat: "private_olivia",
      trigger: "choice:larks_olivia_harper_secret_common:2",
      messages: [
        { from: "olivia", text: "Я тоже об этом думала.", delay: 1000 },
        { from: "olivia", text: "И почему-то от этой мысли ещё страшнее.", delay: 1200 }
      ]
    },
    {
      id: "larks_olivia_outsider_common",
      chat: "private_olivia",
      trigger: "after:larks_olivia_harper_protecting|larks_olivia_harper_closed|larks_olivia_harper_confused",
      messages: [
        { from: "olivia", text: "Ты ведь вообще не из Рейвенвуда.", delay: 1200 },
        { from: "olivia", text: "Тебе, наверное, всё это кажется чужим.", delay: 1200 },
        { type: "choice", options: [
          { text: "Как будто я оказался внутри чужой истории.", loyalty: {}, next: "larks_olivia_outsider_story" },
          { text: "Я не знаю вас так, как знаете друг друга вы.", loyalty: {}, next: "larks_olivia_outsider_distance" },
          { text: "Чужим — да. Но не безразличным.", loyalty: {}, trust: { oliviaTrust: 1 }, next: "larks_olivia_outsider_care" }
        ]}
      ]
    },
    {
      id: "larks_olivia_outsider_story",
      chat: "private_olivia",
      trigger: "choice:larks_olivia_outsider_common:0",
      messages: [
        { from: "olivia", text: "Понимаю.", delay: 800 },
        { from: "olivia", text: "Наверное, так и есть.", delay: 1000 }
      ]
    },
    {
      id: "larks_olivia_outsider_distance",
      chat: "private_olivia",
      trigger: "choice:larks_olivia_outsider_common:1",
      messages: [
        { from: "olivia", text: "Может, поэтому ты иногда замечаешь то, к чему мы уже привыкли.", delay: 1300 }
      ]
    },
    {
      id: "larks_olivia_outsider_care",
      chat: "private_olivia",
      trigger: "choice:larks_olivia_outsider_common:2",
      messages: [
        { from: "olivia", text: "Я знаю.", delay: 800 },
        { from: "olivia", text: "Наверное, поэтому я тогда тебе и написала.", delay: 1200 }
      ]
    },
    {
      id: "larks_olivia_goodbye",
      chat: "private_olivia",
      trigger: "after:larks_olivia_outsider_story|larks_olivia_outsider_distance|larks_olivia_outsider_care",
      messages: [
        { from: "olivia", text: "Ладно.", delay: 900 },
        { from: "olivia", text: "Мне правда пора.", delay: 900 },
        { from: "olivia", text: "Когда Миа доберётся до телефона, она напишет в Larks.", delay: 1300 },
        { from: "olivia", text: "И спасибо, что не сделал вид, будто это просто чужая история.", delay: 1400 },
        { type: "system", text: "Оливия вышла из сети", delay: 900, characterStatus: { id: "olivia", online: false } }
      ]
    },
    {
      id: "mia_remote_phone_start",
      chat: "private_mia",
      trigger: "after:larks_olivia_goodbye",
      messages: [
        { type: "pause", delay: 2200 },
        { type: "system", text: "Миа в сети", delay: 800, characterStatus: { id: "mia", online: true } },
        { from: "mia", text: "Я дома.", delay: 900 },
        { from: "mia", text: "Нашла старый телефон.", delay: 1000 },
        { from: "mia", text: "Но я ненадолго.", delay: 900 },
        { from: "mia", text: "Мне нужно уходить, я уже опаздываю.", delay: 1200 },
        { type: "choice", options: [
          { text: "Ты успела что-нибудь посмотреть?", loyalty: {}, next: "mia_remote_checked" },
          { text: "Куда ты так торопишься?", loyalty: {}, next: "mia_remote_hurry" },
          { text: "Спасибо, что вообще решила его проверить.", loyalty: {}, trust: { miaTrust: 1 }, next: "mia_remote_thanks" }
        ]}
      ]
    },
    {
      id: "mia_remote_checked",
      chat: "private_mia",
      trigger: "choice:mia_remote_phone_start:0",
      messages: [
        { from: "mia", text: "Только включить и зарядить.", delay: 1100 },
        { from: "mia", text: "В обычной переписке с Харпер ничего нового нет.", delay: 1300 }
      ]
    },
    {
      id: "mia_remote_hurry",
      chat: "private_mia",
      trigger: "choice:mia_remote_phone_start:1",
      messages: [
        { from: "mia", text: "На смену.", delay: 900 },
        { from: "mia", text: "Я думала, что успею быстро посмотреть телефон до неё.", delay: 1300 },
        { from: "mia", text: "Но там слишком много всего.", delay: 1100 }
      ]
    },
    {
      id: "mia_remote_thanks",
      chat: "private_mia",
      trigger: "choice:mia_remote_phone_start:2",
      messages: [
        { from: "mia", text: "Я должна была сделать это раньше.", delay: 1100 },
        { from: "mia", text: "Но лучше поздно, чем вообще никогда.", delay: 1100 }
      ]
    },
    {
      id: "mia_remote_access_common",
      chat: "private_mia",
      trigger: "after:mia_remote_checked|mia_remote_hurry|mia_remote_thanks",
      messages: [
        { from: "mia", text: "Я не успею нормально всё просмотреть.", delay: 1200 },
        { from: "mia", text: "Но на телефоне осталось приложение для удалённого доступа.", delay: 1300 },
        { from: "mia", text: "Я могу дать тебе доступ.", delay: 1000 },
        { from: "mia", text: "Ты посмотришь спокойно, пока меня не будет.", delay: 1200 },
        { type: "choice", options: [
          { text: "Ты уверена? Это всё-таки твой телефон.", loyalty: {}, trust: { miaTrust: 1 }, next: "mia_remote_are_you_sure" },
          { text: "Я открою только то, что связано с Харпер.", loyalty: {}, trust: { miaTrust: 1 }, next: "mia_remote_only_harper" },
          { text: "Давай. Посмотрю, что смогу найти.", loyalty: {}, next: "mia_remote_accept" }
        ]}
      ]
    },
    {
      id: "mia_remote_are_you_sure",
      chat: "private_mia",
      trigger: "choice:mia_remote_access_common:0",
      messages: [
        { from: "mia", text: "Не совсем.", delay: 900 },
        { from: "mia", text: "Но я больше не хочу ждать и делать вид, что ничего не могу.", delay: 1400 }
      ]
    },
    {
      id: "mia_remote_only_harper",
      chat: "private_mia",
      trigger: "choice:mia_remote_access_common:1",
      messages: [
        { from: "mia", text: "Хорошо.", delay: 800 },
        { from: "mia", text: "Спасибо.", delay: 800 }
      ]
    },
    {
      id: "mia_remote_accept",
      chat: "private_mia",
      trigger: "choice:mia_remote_access_common:2",
      messages: [
        { from: "mia", text: "Хорошо.", delay: 800 },
        { from: "mia", text: "Может, там осталось что-то важное.", delay: 1100 }
      ]
    },
    {
      id: "mia_remote_privacy_common",
      chat: "private_mia",
      trigger: "after:mia_remote_are_you_sure|mia_remote_only_harper|mia_remote_accept",
      messages: [
        { from: "mia", text: "Там есть личные чаты.", delay: 1100 },
        { from: "mia", text: "Не заходи в них просто так, ладно?", delay: 1200 },
        { type: "choice", options: [
          { text: "Обещаю.", loyalty: {}, next: "mia_remote_promise" },
          { text: "Только Харпер и всё, что связано с тем днём.", loyalty: {}, trust: { miaTrust: 1 }, next: "mia_remote_only_case" },
          { text: "Без причины не буду.", loyalty: {}, next: "mia_remote_no_reason" }
        ]}
      ]
    },
    {
      id: "mia_remote_promise",
      chat: "private_mia",
      trigger: "choice:mia_remote_privacy_common:0",
      messages: [
        { from: "mia", text: "Хорошо.", delay: 800 }
      ]
    },
    {
      id: "mia_remote_only_case",
      chat: "private_mia",
      trigger: "choice:mia_remote_privacy_common:1",
      messages: [
        { from: "mia", text: "Этого достаточно.", delay: 1000 }
      ]
    },
    {
      id: "mia_remote_no_reason",
      chat: "private_mia",
      trigger: "choice:mia_remote_privacy_common:2",
      messages: [
        { from: "mia", text: "Спасибо.", delay: 800 }
      ]
    },
    {
      id: "mia_remote_document",
      chat: "private_mia",
      trigger: "after:mia_remote_promise|mia_remote_only_case|mia_remote_no_reason",
      messages: [
        { from: "mia", text: "Я включаю доступ.", delay: 1000 },
        { from: "mia", text: "Если найдёшь что-то важное, напиши сразу.", delay: 1300 },
        { from: "mia", text: "И ничего никому не пересылай без меня.", delay: 1200 },
        { type: "choice", options: [
          { text: "Хорошо.", loyalty: {}, next: "mia_remote_document_sent" }
        ]}
      ]
    },
    {
      id: "mia_remote_document_sent",
      chat: "private_mia",
      trigger: "choice:mia_remote_document:0",
      messages: [
        { type: "system", text: "Миа отправила приглашение.", delay: 700 },
        { from: "mia", type: "app", title: "Удалённый доступ", subtitle: "Приложение · подключиться к устройству", text: "Удалённый доступ к устройству", documentId: "mia_remote_access", delay: 900 },
        { from: "mia", text: "Мне пора.", delay: 900 },
        { from: "mia", text: "Я буду иногда смотреть сообщения.", delay: 1000 },
        { from: "mia", text: "Удачи.", delay: 900 },
        { type: "system", text: "Миа вышла из сети", delay: 800, characterStatus: { id: "mia", online: false } }
      ]
    },
    {
      id: "unknown_after_hack_start",
      chat: "private_unknown",
      trigger: "flag:remoteSessionInterrupted",
      messages: [
        { type: "system", text: "Перезагрузка устройства…", delay: 500 },
        { type: "system", text: "Устройство включено.", delay: 900 },
        { type: "system", text: "Новое сообщение.", delay: 900 },
        { from: "unknown", text: "Не открывай файл снова.", delay: 900 },
        { from: "unknown", text: "Я оборвал подключение.", delay: 850 },
        { type: "choice", options: [
          { text: "Кто ты?", loyalty: {}, next: "unknown_after_hack_who" },
          { text: "Что только что произошло?", loyalty: {}, next: "unknown_after_hack_phone" },
          { text: "Это ты залез в мой телефон?", loyalty: {}, next: "unknown_after_hack_inside" }
        ]}
      ]
    },
    {
      id: "unknown_after_hack_who",
      chat: "private_unknown",
      trigger: "choice:unknown_after_hack_start:0",
      messages: [
        { from: "unknown", text: "Сейчас это неважно.", delay: 900 }
      ]
    },
    {
      id: "unknown_after_hack_phone",
      chat: "private_unknown",
      trigger: "choice:unknown_after_hack_start:1",
      messages: [
        { from: "unknown", text: "Оборвал подключение.", delay: 900 }
      ]
    },
    {
      id: "unknown_after_hack_inside",
      chat: "private_unknown",
      trigger: "choice:unknown_after_hack_start:2",
      messages: [
        { from: "unknown", text: "Не так, как ты думаешь.", delay: 900 }
      ]
    },
    {
      id: "unknown_after_hack_intrusion",
      chat: "private_unknown",
      trigger: "after:unknown_after_hack_who|unknown_after_hack_phone|unknown_after_hack_inside",
      messages: [
        { from: "unknown", text: "Я вмешался уже после того, как подключение началось.", delay: 1200 },
        { from: "unknown", text: "До этого кто-то пытался получить доступ к твоему устройству.", delay: 1300 },
        { type: "choice", options: [
          { text: "То есть меня пытались взломать?", loyalty: {}, next: "unknown_after_hack_hacked" },
          { text: "Что они успели сделать?", loyalty: {}, next: "unknown_after_hack_what_done" },
          { text: "Камеру тоже открыли они?", loyalty: {}, next: "unknown_after_hack_camera" }
        ]}
      ]
    },
    {
      id: "unknown_after_hack_hacked",
      chat: "private_unknown",
      trigger: "choice:unknown_after_hack_intrusion:0",
      messages: [
        { from: "unknown", text: "Да.", delay: 700 },
        { from: "unknown", text: "И успели получить часть данных.", delay: 1000 }
      ]
    },
    {
      id: "unknown_after_hack_what_done",
      chat: "private_unknown",
      trigger: "choice:unknown_after_hack_intrusion:1",
      messages: [
        { from: "unknown", text: "Открыть часть переписок.", delay: 900 },
        { from: "unknown", text: "Заметки.", delay: 700 },
        { from: "unknown", text: "Возможно, контакты.", delay: 900 }
      ]
    },
    {
      id: "unknown_after_hack_camera",
      chat: "private_unknown",
      trigger: "choice:unknown_after_hack_intrusion:2",
      messages: [
        { from: "unknown", text: "Да.", delay: 700 },
        { from: "unknown", text: "Фото сделал не я.", delay: 1000 }
      ]
    },
    {
      id: "unknown_after_hack_file_start",
      chat: "private_unknown",
      trigger: "after:unknown_after_hack_hacked|unknown_after_hack_what_done|unknown_after_hack_camera",
      messages: [
        { from: "unknown", text: "Я заметил подключение, когда началась загрузка файла.", delay: 1200 },
        { from: "unknown", text: "Он не должен был открываться.", delay: 1000 },
        { type: "choice", options: [
          { text: "Что значит — не должен был?", loyalty: {}, next: "unknown_after_hack_file_meaning" },
          { text: "Его кто-то изменил?", loyalty: {}, next: "unknown_after_hack_file_changed" },
          { text: "Это была ловушка?", loyalty: {}, next: "unknown_after_hack_file_trap" }
        ]}
      ]
    },
    {
      id: "unknown_after_hack_file_meaning",
      chat: "private_unknown",
      trigger: "choice:unknown_after_hack_file_start:0",
      messages: [
        { from: "unknown", text: "Вложение изменили уже после того, как его удалили.", delay: 1100 }
      ]
    },
    {
      id: "unknown_after_hack_file_changed",
      chat: "private_unknown",
      trigger: "choice:unknown_after_hack_file_start:1",
      messages: [
        { from: "unknown", text: "Да.", delay: 700 },
        { from: "unknown", text: "Уже после удаления.", delay: 900 }
      ]
    },
    {
      id: "unknown_after_hack_file_trap",
      chat: "private_unknown",
      trigger: "choice:unknown_after_hack_file_start:2",
      messages: [
        { from: "unknown", text: "Похоже на то.", delay: 900 }
      ]
    },
    {
      id: "unknown_after_hack_trap_common",
      chat: "private_unknown",
      trigger: "after:unknown_after_hack_file_meaning|unknown_after_hack_file_changed|unknown_after_hack_file_trap",
      messages: [
        { from: "unknown", text: "Внутри файла оставили способ подключиться к тому, кто попытается его открыть.", delay: 1300 },
        { from: "unknown", text: "Ловушка была не для Мии.", delay: 1000 },
        { from: "unknown", text: "Для того, кто начнёт искать.", delay: 1000 },
        { type: "choice", options: [
          { text: "Кто-то знал, что мы полезем в телефон Мии?", loyalty: {}, next: "unknown_after_hack_knew" },
          { text: "Файл точно связан с Харпер?", loyalty: {}, next: "unknown_after_hack_harper_file" },
          { text: "Ты знаешь, кто это сделал?", loyalty: {}, next: "unknown_after_hack_knows_who" }
        ]}
      ]
    },
    {
      id: "unknown_after_hack_knew",
      chat: "private_unknown",
      trigger: "choice:unknown_after_hack_trap_common:0",
      messages: [
        { from: "unknown", text: "Или знал заранее.", delay: 900 },
        { from: "unknown", text: "Или следил за тем, что вы делаете.", delay: 1000 }
      ]
    },
    {
      id: "unknown_after_hack_harper_file",
      chat: "private_unknown",
      trigger: "choice:unknown_after_hack_trap_common:1",
      messages: [
        { from: "unknown", text: "Он был отправлен с телефона Мии в тот вечер.", delay: 1100 },
        { from: "unknown", text: "Этого достаточно, чтобы не игнорировать его.", delay: 1100 }
      ]
    },
    {
      id: "unknown_after_hack_knows_who",
      chat: "private_unknown",
      trigger: "choice:unknown_after_hack_trap_common:2",
      messages: [
        { from: "unknown", text: "Пока нет.", delay: 900 }
      ]
    },
    {
      id: "unknown_after_hack_saved_data",
      chat: "private_unknown",
      trigger: "after:unknown_after_hack_knew|unknown_after_hack_harper_file|unknown_after_hack_knows_who",
      messages: [
        { from: "unknown", text: "Я успел сохранить часть данных до обрыва.", delay: 1200 },
        { type: "choice", options: [
          { text: "Тогда покажи мне файл.", loyalty: {}, next: "unknown_after_hack_show_file" },
          { text: "Ты сможешь его восстановить?", loyalty: {}, next: "unknown_after_hack_restore_file" },
          { text: "Почему ты вообще вмешался?", loyalty: {}, next: "unknown_after_hack_why_help" }
        ]}
      ]
    },
    {
      id: "unknown_after_hack_show_file",
      chat: "private_unknown",
      trigger: "choice:unknown_after_hack_saved_data:0",
      messages: [
        { from: "unknown", text: "Не сейчас.", delay: 900 }
      ]
    },
    {
      id: "unknown_after_hack_restore_file",
      chat: "private_unknown",
      trigger: "choice:unknown_after_hack_saved_data:1",
      messages: [
        { from: "unknown", text: "Не полностью.", delay: 900 }
      ]
    },
    {
      id: "unknown_after_hack_why_help",
      chat: "private_unknown",
      trigger: "choice:unknown_after_hack_saved_data:2",
      messages: [
        { from: "unknown", text: "Потому что ты оказался в чужой ловушке.", delay: 1100 },
        { from: "unknown", text: "И она уже начала срабатывать.", delay: 1000 }
      ]
    },
    {
      id: "unknown_after_hack_clean_file",
      chat: "private_unknown",
      trigger: "after:unknown_after_hack_show_file|unknown_after_hack_restore_file|unknown_after_hack_why_help",
      messages: [
        { from: "unknown", text: "В файле всё ещё есть код, через который к тебе подключились.", delay: 1300 },
        { from: "unknown", text: "Я не буду отправлять его обратно, пока не уберу это.", delay: 1200 },
        { type: "choice", options: [
          { text: "Ты можешь это убрать?", loyalty: {}, next: "unknown_after_hack_can_clean" },
          { text: "Почему я должен тебе верить?", loyalty: {}, next: "unknown_after_hack_trust" },
          { text: "Что будет, если открыть файл ещё раз?", loyalty: {}, next: "unknown_after_hack_open_again" }
        ]}
      ]
    },
    {
      id: "unknown_after_hack_can_clean",
      chat: "private_unknown",
      trigger: "choice:unknown_after_hack_clean_file:0",
      messages: [
        { from: "unknown", text: "Уже убираю.", delay: 900 }
      ]
    },
    {
      id: "unknown_after_hack_trust",
      chat: "private_unknown",
      trigger: "choice:unknown_after_hack_clean_file:1",
      messages: [
        { from: "unknown", text: "Не должен.", delay: 900 }
      ]
    },
    {
      id: "unknown_after_hack_open_again",
      chat: "private_unknown",
      trigger: "choice:unknown_after_hack_clean_file:2",
      messages: [
        { from: "unknown", text: "Не проверяй.", delay: 900 }
      ]
    },
    {
      id: "unknown_after_hack_warning",
      chat: "private_unknown",
      trigger: "after:unknown_after_hack_can_clean|unknown_after_hack_trust|unknown_after_hack_open_again",
      messages: [
        { from: "unknown", text: "Не открывай вложение снова.", delay: 1000 },
        { from: "unknown", text: "Не подключайся к телефону Мии с другого устройства.", delay: 1200 },
        { from: "unknown", text: "И скажи ей пока не трогать старый телефон.", delay: 1200 },
        { type: "choice", options: [
          { text: "Они успели что-то узнать?", loyalty: {}, next: "unknown_after_hack_what_they_know" },
          { text: "Они видели мои чаты?", loyalty: {}, next: "unknown_after_hack_saw_chats" },
          { text: "Ты вернёшься?", loyalty: {}, next: "unknown_after_hack_return" }
        ]}
      ]
    },
    {
      id: "unknown_after_hack_what_they_know",
      chat: "private_unknown",
      trigger: "choice:unknown_after_hack_warning:0",
      messages: [
        { from: "unknown", text: "Возможно.", delay: 800 },
        { from: "unknown", text: "Они увидели, что вы ищете Харпер.", delay: 1100 },
        { from: "unknown", text: "И этого уже достаточно, чтобы стать осторожнее.", delay: 1200 }
      ]
    },
    {
      id: "unknown_after_hack_saw_chats",
      chat: "private_unknown",
      trigger: "choice:unknown_after_hack_warning:1",
      messages: [
        { from: "unknown", text: "Часть.", delay: 800 },
        { from: "unknown", text: "Какие именно — пока не знаю.", delay: 1100 }
      ]
    },
    {
      id: "unknown_after_hack_return",
      chat: "private_unknown",
      trigger: "choice:unknown_after_hack_warning:2",
      messages: [
        { from: "unknown", text: "Когда смогу безопасно отправить то, что осталось от файла.", delay: 1200 }
      ]
    },
    {
      id: "unknown_after_hack_silence",
      chat: "private_unknown",
      trigger: "after:unknown_after_hack_what_they_know|unknown_after_hack_saw_chats|unknown_after_hack_return",
      messages: [
        { from: "unknown", text: "И пока никому не говори обо мне.", delay: 1100 },
        { type: "choice", options: [
          { text: "Почему?", loyalty: {}, next: "unknown_after_hack_why_silent" },
          { text: "Ты хочешь, чтобы я соврал Мие?", loyalty: {}, next: "unknown_after_hack_lie_mia" },
          { text: "А если она спросит, что произошло?", loyalty: {}, next: "unknown_after_hack_if_mia_asks" }
        ]}
      ]
    },
    {
      id: "unknown_after_hack_why_silent",
      chat: "private_unknown",
      trigger: "choice:unknown_after_hack_silence:0",
      messages: [
        { from: "unknown", text: "Потому что ты не знаешь, кто читает ваши сообщения.", delay: 1100 }
      ]
    },
    {
      id: "unknown_after_hack_lie_mia",
      chat: "private_unknown",
      trigger: "choice:unknown_after_hack_silence:1",
      messages: [
        { from: "unknown", text: "Я хочу, чтобы ты не называл меня в чате, который могли увидеть.", delay: 1200 }
      ]
    },
    {
      id: "unknown_after_hack_if_mia_asks",
      chat: "private_unknown",
      trigger: "choice:unknown_after_hack_silence:2",
      messages: [
        { from: "unknown", text: "Скажи, что доступ оборвался.", delay: 1000 }
      ]
    },
    {
      id: "unknown_after_hack_end",
      chat: "private_unknown",
      trigger: "after:unknown_after_hack_why_silent|unknown_after_hack_lie_mia|unknown_after_hack_if_mia_asks",
      messages: [
        { from: "unknown", text: "Остальное решай сам.", delay: 1000 },
        { from: "unknown", text: "Будь осторожен.", delay: 1100 },
        { type: "system", text: "Неизвестный вышел из сети.", delay: 900, characterStatus: { id: "unknown", online: false } }
      ]
    },
    {
      id: "mia_after_hack_start",
      chat: "private_mia",
      trigger: "after:unknown_after_hack_end",
      messages: [
        { type: "system", text: "Несколько секунд спустя.", delay: 1600 },
        { type: "system", text: "Миа в сети.", delay: 900, characterStatus: { id: "mia", online: true } },
        { from: "mia", text: "Что случилось?", delay: 800 },
        { from: "mia", text: "Доступ резко оборвался.", delay: 850 },
        { from: "mia", text: "У меня программа закрылась.", delay: 850 },
        { from: "mia", text: "Ты успел открыть видео?", delay: 900 },
        { type: "choice", options: [
          { text: "Да. Файл взломал мой телефон. Потом написал человек, который остановил подключение.", loyalty: {}, next: "mia_after_hack_reveal_unknown" },
          { text: "Да. Файл взломал телефон, но я не знаю, кто это сделал.", loyalty: {}, trust: { miaTrust: 1 }, next: "mia_after_hack_attack" },
          { text: "Нет. Просто всё зависло и закрылось.", loyalty: {}, trust: { miaTrust: -1 }, next: "mia_after_hack_cover_story" }
        ]}
      ]
    },
    {
      id: "mia_after_hack_reveal_unknown",
      chat: "private_mia",
      trigger: "choice:mia_after_hack_start:0",
      messages: [
        { from: "mia", text: "Что?", delay: 800 },
        { from: "mia", text: "Какой незнакомец?", delay: 900 },
        { from: "player", text: "Он сказал, что файл был ловушкой.", delay: 700 },
        { from: "mia", text: "Подожди.", delay: 800 },
        { from: "mia", text: "То есть кто-то специально оставил его в моём телефоне?", delay: 1200 },
        { from: "mia", text: "И этот человек просто написал тебе после этого?", delay: 1200 },
        { type: "choice", options: [
          { text: "Он появился сразу после перезагрузки.", loyalty: {}, trust: { miaTrust: 1 }, next: "mia_after_hack_unknown_reboot" },
          { text: "Он сказал, что оборвал подключение.", loyalty: {}, next: "mia_after_hack_unknown_cut" },
          { text: "Я не знаю, можно ли ему верить.", loyalty: {}, trust: { miaTrust: 1 }, next: "mia_after_hack_unknown_trust" }
        ]}
      ]
    },
    {
      id: "mia_after_hack_unknown_reboot",
      chat: "private_mia",
      trigger: "choice:mia_after_hack_reveal_unknown:0",
      messages: [
        { from: "mia", text: "Это вообще не делает ситуацию лучше.", delay: 1000 }
      ]
    },
    {
      id: "mia_after_hack_unknown_cut",
      chat: "private_mia",
      trigger: "choice:mia_after_hack_reveal_unknown:1",
      messages: [
        { from: "mia", text: "И ты ему поверил?", delay: 1000 },
        { type: "choice", options: [
          { text: "Не знаю. Но он знал про файл.", loyalty: {}, trust: { miaTrust: 1 }, next: "mia_after_hack_unknown_knew_file" },
          { text: "Нет. Просто он появился сразу после перезагрузки.", loyalty: {}, trust: { miaTrust: 1 }, next: "mia_after_hack_unknown_after_reboot" },
          { text: "Я не верю ему. Но и игнорировать это нельзя.", loyalty: {}, trust: { miaTrust: 1 }, next: "mia_after_hack_unknown_cant_ignore" }
        ]}
      ]
    },
    {
      id: "mia_after_hack_unknown_knew_file",
      chat: "private_mia",
      trigger: "choice:mia_after_hack_unknown_cut:0",
      messages: [
        { from: "mia", text: "Тогда он либо видел всё сам...", delay: 1000 },
        { from: "mia", text: "Либо знает намного больше, чем говорит.", delay: 1100 }
      ]
    },
    {
      id: "mia_after_hack_unknown_after_reboot",
      chat: "private_mia",
      trigger: "choice:mia_after_hack_unknown_cut:1",
      messages: [
        { from: "mia", text: "Это всё равно очень странно.", delay: 1000 }
      ]
    },
    {
      id: "mia_after_hack_unknown_cant_ignore",
      chat: "private_mia",
      trigger: "choice:mia_after_hack_unknown_cut:2",
      messages: [
        { from: "mia", text: "Да.", delay: 700 },
        { from: "mia", text: "Наверное, ты прав.", delay: 900 }
      ]
    },
    {
      id: "mia_after_hack_unknown_trust",
      chat: "private_mia",
      trigger: "choice:mia_after_hack_reveal_unknown:2",
      messages: [
        { from: "mia", text: "Тогда почему он вообще знает про мой телефон?", delay: 1100 },
        { type: "choice", options: [
          { text: "Не знаю. Он появился сразу после перезагрузки.", loyalty: {}, next: "mia_after_hack_unknown_trust_reboot" },
          { text: "Может, он увидел то же подключение, что и тот, кто нас взломал.", loyalty: {}, next: "mia_after_hack_unknown_trust_more" },
          { text: "Я пытаюсь это понять.", loyalty: {}, next: "mia_after_hack_unknown_trust_understand" }
        ]}
      ]
    },
    {
      id: "mia_after_hack_unknown_trust_reboot",
      chat: "private_mia",
      trigger: "choice:mia_after_hack_unknown_trust:0",
      messages: [
        { from: "mia", text: "Как будто этого уже недостаточно.", delay: 1000 }
      ]
    },
    {
      id: "mia_after_hack_unknown_trust_more",
      chat: "private_mia",
      trigger: "choice:mia_after_hack_unknown_trust:1",
      messages: [
        { from: "mia", text: "То есть их может быть больше одного?", delay: 1100 }
      ]
    },
    {
      id: "mia_after_hack_unknown_trust_understand",
      chat: "private_mia",
      trigger: "choice:mia_after_hack_unknown_trust:2",
      messages: [
        { from: "mia", text: "Ладно.", delay: 800 },
        { from: "mia", text: "Просто не делай вид, что всё под контролем.", delay: 1100 }
      ]
    },
    {
      id: "mia_after_hack_reveal_common",
      chat: "private_mia",
      trigger: "after:mia_after_hack_unknown_reboot|mia_after_hack_unknown_knew_file|mia_after_hack_unknown_after_reboot|mia_after_hack_unknown_cant_ignore|mia_after_hack_unknown_trust_reboot|mia_after_hack_unknown_trust_more|mia_after_hack_unknown_trust_understand",
      setFlags: { unknownRevealedToMia: true, miaKnowsAboutHack: true },
      messages: [
        { from: "mia", text: "Мне это совсем не нравится.", delay: 1000 }
      ]
    },
    {
      id: "mia_after_hack_attack",
      chat: "private_mia",
      trigger: "choice:mia_after_hack_start:1",
      messages: [
        { from: "mia", text: "Из-за старого телефона?", delay: 900 },
        { from: "player", text: "Похоже на то.", delay: 700 },
        { from: "mia", text: "Чёрт.", delay: 800 },
        { from: "mia", text: "Ты успел что-нибудь увидеть?", delay: 1000 },
        { type: "choice", options: [
          { text: "Только странный чат и файл.", loyalty: {}, next: "mia_after_hack_attack_chat_file" },
          { text: "Файл начал загружаться, а потом всё сорвалось.", loyalty: {}, next: "mia_after_hack_attack_download" },
          { text: "Телефон начал сам открывать чаты.", loyalty: {}, next: "mia_after_hack_attack_phone_self" }
        ]}
      ]
    },
    {
      id: "mia_after_hack_attack_chat_file",
      chat: "private_mia",
      trigger: "choice:mia_after_hack_attack:0",
      messages: [
        { from: "mia", text: "Значит, Харпер правда что-то оставила.", delay: 1100 }
      ]
    },
    {
      id: "mia_after_hack_attack_download",
      chat: "private_mia",
      trigger: "choice:mia_after_hack_attack:1",
      messages: [
        { from: "mia", text: "И просто отключилось?", delay: 900 },
        { type: "choice", options: [
          { text: "Да. Будто кто-то оборвал подключение.", loyalty: {}, next: "mia_after_hack_attack_cut" },
          { text: "Да. Слишком резко, чтобы это было обычной ошибкой.", loyalty: {}, next: "mia_after_hack_attack_too_fast" },
          { text: "Да. И после этого телефон начал глючить.", loyalty: {}, next: "mia_after_hack_attack_glitched" }
        ]}
      ]
    },
    {
      id: "mia_after_hack_attack_cut",
      chat: "private_mia",
      trigger: "choice:mia_after_hack_attack_download:0",
      messages: [
        { from: "mia", text: "Тогда это точно не похоже на сбой.", delay: 1000 }
      ]
    },
    {
      id: "mia_after_hack_attack_too_fast",
      chat: "private_mia",
      trigger: "choice:mia_after_hack_attack_download:1",
      messages: [
        { from: "mia", text: "Согласна.", delay: 900 }
      ]
    },
    {
      id: "mia_after_hack_attack_glitched",
      chat: "private_mia",
      trigger: "choice:mia_after_hack_attack_download:2",
      messages: [
        { from: "mia", text: "Что?", delay: 700 },
        { from: "mia", text: "Это уже совсем не похоже на ошибку.", delay: 1100 }
      ]
    },
    {
      id: "mia_after_hack_attack_phone_self",
      chat: "private_mia",
      trigger: "choice:mia_after_hack_attack:2",
      messages: [
        { from: "mia", text: "Что значит — сам?", delay: 900 },
        { type: "choice", options: [
          { text: "Открыл мои переписки и заметки.", loyalty: {}, next: "mia_after_hack_attack_notes" },
          { text: "Будто кто-то листал всё вместо меня.", loyalty: {}, next: "mia_after_hack_attack_scrolled" },
          { text: "Я сам не до конца понимаю, что это было.", loyalty: {}, next: "mia_after_hack_attack_dont_know" }
        ]}
      ]
    },
    {
      id: "mia_after_hack_attack_notes",
      chat: "private_mia",
      trigger: "choice:mia_after_hack_attack_phone_self:0",
      messages: [
        { from: "mia", text: "Это уже похоже на взлом.", delay: 1000 }
      ]
    },
    {
      id: "mia_after_hack_attack_scrolled",
      chat: "private_mia",
      trigger: "choice:mia_after_hack_attack_phone_self:1",
      messages: [
        { from: "mia", text: "Чёрт.", delay: 700 },
        { from: "mia", text: "Мне это не нравится.", delay: 900 }
      ]
    },
    {
      id: "mia_after_hack_attack_dont_know",
      chat: "private_mia",
      trigger: "choice:mia_after_hack_attack_phone_self:2",
      messages: [
        { from: "mia", text: "Тогда лучше не пытаться подключиться снова.", delay: 1100 }
      ]
    },
    {
      id: "mia_after_hack_attack_common",
      chat: "private_mia",
      trigger: "after:mia_after_hack_attack_chat_file|mia_after_hack_attack_cut|mia_after_hack_attack_too_fast|mia_after_hack_attack_glitched|mia_after_hack_attack_notes|mia_after_hack_attack_scrolled|mia_after_hack_attack_dont_know",
      setFlags: { unknownKeptSecret: true, miaKnowsAboutAttack: true, miaKnowsAboutHack: true, unknownRevealedToMia: false },
      messages: [
        { from: "mia", text: "Значит, телефон пока лучше не трогать.", delay: 1000 }
      ]
    },
    {
      id: "mia_after_hack_cover_story",
      chat: "private_mia",
      trigger: "choice:mia_after_hack_start:2",
      setFlags: { unknownKeptSecret: true, miaKnowsAboutAttack: false, miaKnowsAboutHack: false, unknownRevealedToMia: false, playerHidHackFromMia: true },
      messages: [
        { from: "mia", text: "Странно.", delay: 800 },
        { from: "mia", text: "Он же работал всего минуту назад.", delay: 1000 },
        { from: "mia", text: "Может, приложение просто старое.", delay: 1000 },
        { from: "mia", text: "Или телефон совсем умирает.", delay: 1000 }
      ]
    },
    {
      id: "mia_after_hack_phone_warning",
      chat: "private_mia",
      trigger: "after:mia_after_hack_reveal_common|mia_after_hack_attack_common|mia_after_hack_cover_story",
      messages: [
        { type: "choice", options: [
          { text: "Пока не включай старый телефон снова.", loyalty: {}, next: "mia_after_hack_dont_turn_on" },
          { text: "Убери телефон и не трогай его до завтра.", loyalty: {}, next: "mia_after_hack_put_away" },
          { text: "Не подключайся к нему больше, пока не станет понятно, что произошло.", loyalty: {}, next: "mia_after_hack_no_more_access" }
        ]}
      ]
    },
    {
      id: "mia_after_hack_dont_turn_on",
      chat: "private_mia",
      trigger: "choice:mia_after_hack_phone_warning:0",
      messages: [
        { from: "mia", text: "Хорошо.", delay: 800 },
        { from: "mia", text: "Я и сама пока не хочу к нему прикасаться.", delay: 1100 }
      ]
    },
    {
      id: "mia_after_hack_put_away",
      chat: "private_mia",
      trigger: "choice:mia_after_hack_phone_warning:1",
      messages: [
        { from: "mia", text: "Ладно.", delay: 800 },
        { from: "mia", text: "Выключу его и уберу в ящик.", delay: 1000 }
      ]
    },
    {
      id: "mia_after_hack_no_more_access",
      chat: "private_mia",
      trigger: "choice:mia_after_hack_phone_warning:2",
      messages: [
        { from: "mia", text: "Хорошо.", delay: 800 },
        { from: "mia", text: "Больше не буду его включать.", delay: 1000 }
      ]
    },
    {
      id: "mia_after_hack_shift",
      chat: "private_mia",
      trigger: "after:mia_after_hack_dont_turn_on|mia_after_hack_put_away|mia_after_hack_no_more_access",
      messages: [
        { from: "mia", text: "Мне уже пора на смену.", delay: 1000 },
        { type: "choice", options: [
          { text: "Будь осторожна по дороге.", loyalty: {}, trust: { miaTrust: 1 }, next: "mia_after_hack_careful" },
          { text: "Напиши, когда доберёшься.", loyalty: {}, trust: { miaTrust: 1 }, next: "mia_after_hack_write_arrive" },
          { text: "Не вини себя из-за этого.", loyalty: {}, next: "mia_after_hack_no_blame" }
        ]}
      ]
    },
    {
      id: "mia_after_hack_careful",
      chat: "private_mia",
      trigger: "choice:mia_after_hack_shift:0",
      messages: [
        { from: "mia", text: "Буду.", delay: 800 },
        { from: "mia", text: "Спасибо.", delay: 800 }
      ]
    },
    {
      id: "mia_after_hack_write_arrive",
      chat: "private_mia",
      trigger: "choice:mia_after_hack_shift:1",
      messages: [
        { from: "mia", text: "Хорошо.", delay: 800 }
      ]
    },
    {
      id: "mia_after_hack_no_blame",
      chat: "private_mia",
      trigger: "choice:mia_after_hack_shift:2",
      messages: [
        { from: "mia", text: "Я постараюсь.", delay: 900 },
        { from: "mia", text: "Просто это мой телефон.", delay: 900 },
        { from: "mia", text: "И Харпер держала его в руках.", delay: 1000 }
      ]
    },
    {
      id: "mia_after_hack_end",
      chat: "private_mia",
      trigger: "after:mia_after_hack_careful|mia_after_hack_write_arrive|mia_after_hack_no_blame",
      messages: [
        { from: "mia", text: "Напиши, если поймёшь, что там произошло.", delay: 1100 },
        { from: "mia", text: "И пожалуйста...", delay: 900 },
        { from: "mia", text: "Не лезь в это один.", delay: 1000 },
        { type: "system", text: "Миа вышла из сети.", delay: 900, characterStatus: { id: "mia", online: false } }
      ]
    },
    {
      id: "mia_privacy_respected",
      chat: "private_mia",
      trigger: "flagsValueAfter:mia_after_hack_end:miaBackupAccessGranted:true:miaPrivateChatsOpened:false",
      setFlags: { miaRespectedPrivacy: true },
      messages: [
        { from: "mia", text: "И... я вижу историю доступа.", delay: 800 },
        { from: "mia", text: "Ты правда не полез в мои личные переписки.", delay: 850 },
        { type: "choice", options: [
          { text: "Ты попросила этого не делать.", loyalty: {}, trust: { miaTrust: 1 }, next: "mia_privacy_good_request" },
          { text: "Они не относятся к Харпер.", loyalty: {}, trust: { miaTrust: 1 }, next: "mia_privacy_good_case" },
          { text: "Я вообще-то умею соблюдать чужие границы.", loyalty: {}, trust: { miaTrust: 1 }, next: "mia_privacy_good_boundaries" }
        ] }
      ]
    },
    { id: "mia_privacy_good_request", chat: "private_mia", trigger: "choice:mia_privacy_respected:0", messages: [{ from: "mia", text: "Да. Просто не все останавливаются после просьбы.", delay: 900 }] },
    { id: "mia_privacy_good_case", chat: "private_mia", trigger: "choice:mia_privacy_respected:1", messages: [{ from: "mia", text: "Спасибо. Серьёзно.", delay: 850 }] },
    { id: "mia_privacy_good_boundaries", chat: "private_mia", trigger: "choice:mia_privacy_respected:2", messages: [{ from: "mia", text: "Хорошо. Буду знать.", delay: 850 }] },
    {
      id: "mia_privacy_violated",
      chat: "private_mia",
      trigger: "flagsValueAfter:mia_after_hack_end:miaBackupAccessGranted:true:miaPrivateChatsOpened:true",
      setFlags: { miaPrivacyViolated: true, miaRemoteAccessBlocked: true },
      messages: [
        { from: "mia", text: "Подожди.", delay: 650 },
        { from: "mia", text: "В истории доступа написано, что ты открывал мои переписки.", delay: 950 },
        { from: "mia", text: "Не чат с Харпер. Мои.", delay: 800 },
        { type: "choice", options: [
          { text: "Я хотел проверить, не писала ли Харпер с твоего аккаунта кому-то ещё.", loyalty: {}, trust: { miaTrust: -2 }, next: "mia_privacy_bad_excuse" },
          { text: "Да. Я открыл их. Извини.", loyalty: {}, trust: { miaTrust: -2 }, next: "mia_privacy_bad_apology" },
          { text: "Ты всё равно дала мне доступ.", loyalty: {}, trust: { miaTrust: -3 }, next: "mia_privacy_bad_entitled" }
        ] }
      ]
    },
    { id: "mia_privacy_bad_excuse", chat: "private_mia", trigger: "choice:mia_privacy_violated:0", messages: [{ from: "mia", text: "В чате с моей мамой? Серьёзно? Не надо придумывать оправдание.", delay: 1050 }] },
    { id: "mia_privacy_bad_apology", chat: "private_mia", trigger: "choice:mia_privacy_violated:1", messages: [{ from: "mia", text: "Я прямо попросила тебя не лезть туда. Я не хочу сейчас продолжать этот разговор.", delay: 1100 }] },
    { id: "mia_privacy_bad_entitled", chat: "private_mia", trigger: "choice:mia_privacy_violated:2", messages: [{ from: "mia", text: "К копии. Не к моей личной жизни. Больше доступа не будет.", delay: 1100 }] },
    { id: "mia_privacy_not_applicable", chat: "private_mia", trigger: "flagAfter:playerDeclinedBackupAccess:mia_after_hack_end", messages: [] },
    {
      id: "mia_after_hack_case_update",
      chat: "private_mia",
      trigger: "after:mia_privacy_good_request|mia_privacy_good_case|mia_privacy_good_boundaries|mia_privacy_bad_excuse|mia_privacy_bad_apology|mia_privacy_bad_entitled|mia_privacy_not_applicable",
      messages: [
        { type: "pause", delay: 1200 },
        { type: "note_auto", id: "harper_mia_phone_hack", appendTo: "harper_intro_summary", title: "Харпер Вэнс", time: "21:24", text: "21:24 — НОВЫЕ СВЕДЕНИЯ\n\nПОДТВЕРЖДЕНО\n• На ноутбуке Мии сохранилась резервная копия старого телефона.\n• Копия создана после встречи у старого моста.\n• Найден удалённый чат с неизвестным контактом.\n• Чат создан в период, когда телефон находился у Харпер.\n• В чате было вложение VID_1842.mp4.\n• Сохранилась ссылка на внешний сервер, а не сам видеофайл.\n• После открытия ссылки кто-то получил доступ к чатам, заметкам и фронтальной камере игрока.\n• Создан файл playerHackPhoto.jpg.\n\nПОКАЗАНИЯ\n• Миа говорит, что телефоном в это время пользовалась Харпер.\n• Миа не видела получателя и содержимое сообщения.\n• Неизвестный утверждает, что остановил подключение и сохранил часть видео.\n\nПОКА ТОЛЬКО ВЕРСИЯ\n• Удалённый чат создала Харпер.\n• Харпер отправила VID_1842.mp4.\n• Получатель видео связан с исчезновением.\n• Неизвестный действительно пытался помочь.\n• Фотография игрока успела попасть к нападавшему.\n\nНОВЫЕ ВОПРОСЫ\n• Что находится на VID_1842.mp4?\n• Кому Харпер отправила видео?\n• Почему она использовала телефон Мии?\n• Кто изменил ссылку?\n• Кто такой Неизвестный?\n• Что успели скопировать?", noteCompleteFlag: "miaHackUpdateWritten", notificationText: "Добавлены сведения о резервной копии", skipIfFlag: "miaHackUpdateWritten", delay: 700 },
        { type: "wait_flag", flag: "miaHackUpdateWritten", delay: 300 },
        { type: "pause", delay: 15000 },
        { type: "navigate", screen: "unknownCall", delay: 300 }
      ]
    },
    {
      id: "unknown_call_report_start",
      chat: "private_unknown",
      trigger: "flag:unknownContactedAfterCall",
      messages: [
        { type: "pause", delay: 700 },
        { type: "system", text: "Неизвестный не в сети.", delay: 500, characterStatus: { id: "unknown", online: false } },
        {
          type: "choice",
          options: [
            { text: "Рассказать о звонке.", sendMessage: false, loyalty: {}, next: "unknown_call_report_tell_1" },
            { text: "Спросить, связан ли звонок с файлом.", sendMessage: false, loyalty: {}, next: "unknown_call_report_file_1" },
            { text: "Спросить, пытаются ли меня запугать.", sendMessage: false, loyalty: {}, next: "unknown_call_report_scare_1" }
          ]
        }
      ]
    },
    {
      id: "unknown_call_report_tell_1",
      chat: "private_unknown",
      trigger: "choice:unknown_call_report_start:0",
      messages: [
        { type: "choice", options: [{ text: "Мне только что звонили с неизвестного номера.", loyalty: {}, next: "unknown_call_report_tell_2" }] }
      ]
    },
    {
      id: "unknown_call_report_tell_2",
      chat: "private_unknown",
      trigger: "choice:unknown_call_report_tell_1:0",
      messages: [
        { type: "choice", options: [{ text: "В трубке молчали.", loyalty: {}, next: "unknown_call_report_tell_3" }] }
      ]
    },
    {
      id: "unknown_call_report_tell_3",
      chat: "private_unknown",
      trigger: "choice:unknown_call_report_tell_2:0",
      messages: [
        { type: "choice", options: [{ text: "Был слышен только шум дороги.", loyalty: {}, setFlag: "unknownCallReportedToUnknown" }] }
      ]
    },
    {
      id: "unknown_call_report_file_1",
      chat: "private_unknown",
      trigger: "choice:unknown_call_report_start:1",
      messages: [
        { type: "choice", options: [{ text: "Мне только что звонили с неизвестного номера.", loyalty: {}, next: "unknown_call_report_file_2" }] }
      ]
    },
    {
      id: "unknown_call_report_file_2",
      chat: "private_unknown",
      trigger: "choice:unknown_call_report_file_1:0",
      messages: [
        { type: "choice", options: [{ text: "Это связано с файлом?", loyalty: {}, setFlag: "unknownCallReportedToUnknown" }] }
      ]
    },
    {
      id: "unknown_call_report_scare_1",
      chat: "private_unknown",
      trigger: "choice:unknown_call_report_start:2",
      messages: [
        { type: "choice", options: [{ text: "Мне только что звонили с неизвестного номера.", loyalty: {}, next: "unknown_call_report_scare_2" }] }
      ]
    },
    {
      id: "unknown_call_report_scare_2",
      chat: "private_unknown",
      trigger: "choice:unknown_call_report_scare_1:0",
      messages: [
        { type: "choice", options: [{ text: "Кто-то пытается меня запугать?", loyalty: {}, setFlag: "unknownCallReportedToUnknown" }] }
      ]
    },
    {
      id: "brooke_after_call_separate_start",
      chat: "private_brooke",
      trigger: "flagsValueAfter:mia_after_hack_case_update:separateChatsRoute:true:callDispositionChosen:true",
      identify: ["brooke"],
      messages: [
        { type: "pause", delay: 4500 },
        { type: "system", text: "Брук в сети.", delay: 500, characterStatus: { id: "brooke", online: true } },
        { from: "brooke", text: "Это что?", delay: 700 },
        { from: "brooke", text: "Значит, отдельную группу вы не создали.", delay: 850 },
        { from: "brooke", text: "Просто решили обсуждать Харпер с тобой по личкам.", delay: 950 },
        { from: "brooke", text: "Намного лучше.", delay: 650 },
        { type: "choice", options: [
          { text: "Они сами мне написали.", loyalty: {}, next: "brooke_separate_they_wrote" },
          { text: "Мы не обсуждаем ничего за вашей спиной.", loyalty: {}, next: "brooke_separate_not_behind" },
          { text: "Откуда у тебя этот скриншот?", loyalty: {}, next: "brooke_separate_source" }
        ] }
      ]
    },
    { id: "brooke_separate_they_wrote", chat: "private_brooke", trigger: "choice:brooke_after_call_separate_start:0", messages: [{ from: "brooke", text: "И ты, конечно, просто случайно оказался в центре всего.", delay: 950 }] },
    { id: "brooke_separate_not_behind", chat: "private_brooke", trigger: "choice:brooke_after_call_separate_start:1", messages: [{ from: "brooke", text: "Тогда почему я узнаю об этих разговорах из анонимного сообщения?", delay: 1000 }] },
    { id: "brooke_separate_source", chat: "private_brooke", trigger: "choice:brooke_after_call_separate_start:2", messages: [
      { from: "brooke", text: "Его прислали с неизвестного номера.", delay: 850 },
      { from: "brooke", text: "Без текста. Только картинка.", delay: 800 }
    ] },
    {
      id: "brooke_after_call_start",
      chat: "private_brooke",
      trigger: "flagsValueAfter:mia_after_hack_case_update:larksCreated:true:callDispositionChosen:true",
      identify: ["brooke"],
      messages: [
        { type: "pause", delay: 4500 },
        { type: "system", text: "Брук в сети.", delay: 500, characterStatus: { id: "brooke", online: true } },
        { from: "brooke", text: "Мне прислали скрин.", delay: 900 },
        { from: "brooke", text: "У вас есть отдельный чат.", delay: 900 },
        { from: "brooke", text: "Ты, Оливия и Миа.", delay: 900 },
        { from: "brooke", text: "Что это вообще такое?", delay: 900 },
        {
          type: "choice",
          options: [
            { text: "Какое тебе дело?", loyalty: { brooke: -1 }, next: "brooke_after_call_your_business" },
            { text: "Кто скинул тебе мой список чатов?", loyalty: { brooke: 1 }, next: "brooke_after_call_who_sent" },
            { text: "Ты из-за одного скрина решила мне писать?", loyalty: {}, next: "brooke_after_call_one_screen" }
          ]
        }
      ]
    },
    {
      id: "brooke_after_call_your_business",
      chat: "private_brooke",
      trigger: "choice:brooke_after_call_start:0",
      messages: [
        { from: "brooke", text: "Потому что речь о Харпер.", delay: 900 },
        { from: "brooke", text: "И потому что вы обсуждаете её без остальных.", delay: 1100 }
      ]
    },
    {
      id: "brooke_after_call_who_sent",
      chat: "private_brooke",
      trigger: "choice:brooke_after_call_start:1",
      messages: [
        { from: "brooke", text: "Не знаю.", delay: 800 },
        { from: "brooke", text: "Номер не определился.", delay: 900 },
        { from: "brooke", text: "Поэтому я и пишу тебе, а не ему.", delay: 1000 }
      ]
    },
    {
      id: "brooke_after_call_one_screen",
      chat: "private_brooke",
      trigger: "choice:brooke_after_call_start:2",
      messages: [
        { from: "brooke", text: "Да.", delay: 700 },
        { from: "brooke", text: "Потому что вчера ты даже не знал, кто такая Харпер.", delay: 1200 }
      ]
    },
    {
      id: "brooke_after_call_common_one",
      chat: "private_brooke",
      trigger: "after:brooke_after_call_your_business|brooke_after_call_who_sent|brooke_after_call_one_screen|brooke_separate_they_wrote|brooke_separate_not_behind|brooke_separate_source",
      messages: [
        { from: "brooke", text: "Я не знаю, что именно вы там обсуждаете.", delay: 1000 },
        { from: "brooke", text: "Но со стороны это выглядит так, будто часть людей уже решила говорить отдельно.", delay: 1300 },
        { from: "brooke", text: "И да, меня это напрягает.", delay: 900 },
        {
          type: "choice",
          options: [
            { text: "Мы ничего тебе не должны объяснять.", loyalty: { brooke: -1 }, next: "brooke_after_call_owe_nothing" },
            { text: "Ты видела один скрин и уже всё решила.", loyalty: {}, next: "brooke_after_call_decided" },
            { text: "Не делай выводов по названию чата.", loyalty: { brooke: 1 }, next: "brooke_after_call_chat_name" }
          ]
        }
      ]
    },
    {
      id: "brooke_after_call_owe_nothing",
      chat: "private_brooke",
      trigger: "choice:brooke_after_call_common_one:0",
      messages: [
        { from: "brooke", text: "Вот это и бесит.", delay: 900 },
        { from: "brooke", text: "Все говорят, что хотят найти Харпер, а потом начинают закрываться друг от друга.", delay: 1400 }
      ]
    },
    {
      id: "brooke_after_call_decided",
      chat: "private_brooke",
      trigger: "choice:brooke_after_call_common_one:1",
      messages: [
        { from: "brooke", text: "Я увидела достаточно, чтобы спросить.", delay: 1000 }
      ]
    },
    {
      id: "brooke_after_call_chat_name",
      chat: "private_brooke",
      trigger: "choice:brooke_after_call_common_one:2",
      messages: [
        { from: "brooke", text: "Тогда не заставляй меня их делать.", delay: 1000 }
      ]
    },
    {
      id: "brooke_after_call_common_two",
      chat: "private_brooke",
      trigger: "after:brooke_after_call_owe_nothing|brooke_after_call_decided|brooke_after_call_chat_name",
      messages: [
        { from: "brooke", text: "Я не знаю, что вы там обсуждали.", delay: 1000 },
        { from: "brooke", text: "Но мне не нравится, что Оливия и Миа теперь пишут тебе отдельно.", delay: 1300 },
        { from: "brooke", text: "И мне не нравится, что ты оказался в центре всего этого через один день.", delay: 1300 },
        {
          type: "choice",
          options: [
            { text: "Я никого не заставлял мне писать.", loyalty: {}, next: "brooke_after_call_didnt_force" },
            { text: "Они сами решают, с кем говорить.", loyalty: {}, next: "brooke_after_call_their_choice" },
            { text: "Ты сейчас злишься не на меня.", loyalty: { brooke: 1 }, next: "brooke_after_call_not_at_me" }
          ]
        }
      ]
    },
    {
      id: "brooke_after_call_didnt_force",
      chat: "private_brooke",
      trigger: "choice:brooke_after_call_common_two:0",
      messages: [
        { from: "brooke", text: "Может, и нет.", delay: 900 },
        { from: "brooke", text: "Но ты мог не соглашаться.", delay: 900 }
      ]
    },
    {
      id: "brooke_after_call_their_choice",
      chat: "private_brooke",
      trigger: "choice:brooke_after_call_common_two:1",
      messages: [
        { from: "brooke", text: "Да.", delay: 700 },
        { from: "brooke", text: "И я надеюсь, что они понимают, во что ввязываются.", delay: 1200 }
      ]
    },
    {
      id: "brooke_after_call_not_at_me",
      chat: "private_brooke",
      trigger: "choice:brooke_after_call_common_two:2",
      messages: [
        { from: "brooke", text: "Я злюсь на всех, кто решил, что может разрулить это без последствий.", delay: 1300 }
      ]
    },
    {
      id: "brooke_after_call_common_three",
      chat: "private_brooke",
      trigger: "after:brooke_after_call_didnt_force|brooke_after_call_their_choice|brooke_after_call_not_at_me",
      messages: [
        { from: "brooke", text: "Харпер пропала.", delay: 900 },
        { from: "brooke", text: "А вы уже делите информацию на “для своих” и “не для своих”.", delay: 1300 },
        { from: "brooke", text: "Это плохо кончится.", delay: 900 },
        {
          type: "choice",
          options: [
            { text: "Ты сама не хочешь участвовать.", loyalty: { brooke: -1 }, next: "brooke_after_call_you_left" },
            { text: "А что, по-твоему, надо делать?", loyalty: { brooke: 1 }, next: "brooke_after_call_what_to_do" },
            { text: "Мы пока вообще ничего не нашли.", loyalty: {}, next: "brooke_after_call_found_nothing" }
          ]
        }
      ]
    },
    {
      id: "brooke_after_call_you_left",
      chat: "private_brooke",
      trigger: "choice:brooke_after_call_common_three:0",
      messages: [
        { from: "brooke", text: "Я не хочу играть в следователя.", delay: 1000 },
        { from: "brooke", text: "Это разные вещи.", delay: 800 }
      ]
    },
    {
      id: "brooke_after_call_what_to_do",
      chat: "private_brooke",
      trigger: "choice:brooke_after_call_common_three:1",
      messages: [
        { from: "brooke", text: "Не создавать новые проблемы.", delay: 900 },
        { from: "brooke", text: "И не хвататься за всё подряд, потому что страшно сидеть без дела.", delay: 1400 }
      ]
    },
    {
      id: "brooke_after_call_found_nothing",
      chat: "private_brooke",
      trigger: "choice:brooke_after_call_common_three:2",
      messages: [
        { from: "brooke", text: "Тогда тем более не понимаю, зачем всё это.", delay: 1100 }
      ]
    },
    {
      id: "brooke_after_call_end",
      chat: "private_brooke",
      trigger: "after:brooke_after_call_you_left|brooke_after_call_what_to_do|brooke_after_call_found_nothing",
      setFlags: { brookeConfrontedPrivateChats: true, brookeReceivedLeak: true, derekKnowsAboutPrivateCoordination: true },
      messages: [
        { from: "brooke", text: "Я уже отправила скрин Дереку.", delay: 1100 },
        { from: "brooke", text: "Не потому что хочу устроить ссору.", delay: 1000 },
        { from: "brooke", text: "Просто он всё равно узнает.", delay: 1000 },
        { from: "brooke", text: "И лучше не от кого-то ещё.", delay: 900 },
        { type: "system", text: "Брук вышла из сети.", delay: 900, characterStatus: { id: "brooke", online: false } }
      ]
    },
    {
      id: "derek_after_brooke_start",
      chat: "private_derek",
      trigger: "after:brooke_after_call_end",
      identify: ["derek"],
      messages: [
        { type: "pause", delay: 5000 },
        { type: "system", text: "Дерек в сети.", delay: 500, characterStatus: { id: "derek", online: true } },
        { from: "derek", text: "Брук сказала, что у вас есть отдельный чат.", delay: 1000 },
        { from: "derek", text: "Это правда?", delay: 900 },
        { from: "derek", text: "Вы что-то нашли?", delay: 900 },
        {
          type: "choice",
          options: [
            { text: "Чат есть. Но Брук явно всё представила по-своему.", loyalty: {}, next: "derek_after_brooke_brooke_version" },
            { text: "Она сказала тебе, что именно мы там обсуждали?", loyalty: { derek: 1 }, next: "derek_after_brooke_what_said" },
            { text: "Ты сейчас решил спросить у меня, а не у Оливии и Мии?", loyalty: {}, next: "derek_after_brooke_ask_me" }
          ]
        }
      ]
    },
    {
      id: "derek_after_brooke_brooke_version",
      chat: "private_derek",
      trigger: "choice:derek_after_brooke_start:0",
      messages: [
        { from: "derek", text: "Она сказала только, что вы общаетесь без остальных.", delay: 1000 },
        { from: "derek", text: "И что это связано с Харпер.", delay: 900 }
      ]
    },
    {
      id: "derek_after_brooke_what_said",
      chat: "private_derek",
      trigger: "choice:derek_after_brooke_start:1",
      messages: [
        { from: "derek", text: "Нет.", delay: 700 },
        { from: "derek", text: "Только что в нём ты, Оливия и Миа.", delay: 1000 }
      ]
    },
    {
      id: "derek_after_brooke_ask_me",
      chat: "private_derek",
      trigger: "choice:derek_after_brooke_start:2",
      messages: [
        { from: "derek", text: "Потому что ты там тоже.", delay: 900 },
        { from: "derek", text: "И потому что я не хочу снова врываться к ним с вопросами.", delay: 1200 }
      ]
    },
    {
      id: "derek_after_brooke_common_one",
      chat: "private_derek",
      trigger: "after:derek_after_brooke_brooke_version|derek_after_brooke_what_said|derek_after_brooke_ask_me",
      messages: [
        { from: "derek", text: "Я не собираюсь требовать, чтобы меня добавили.", delay: 1100 },
        { from: "derek", text: "Просто хочу знать, если вы нашли что-то важное.", delay: 1100 },
        {
          type: "choice",
          options: [
            { text: "Пока ничего, что можно назвать уликой.", loyalty: {}, next: "derek_after_brooke_no_evidence" },
            { text: "Есть вещи, которые нужно сначала проверить.", loyalty: { derek: 1 }, next: "derek_after_brooke_need_check" },
            { text: "После вчерашнего ты правда ждёшь, что тебе всё скажут сразу?", loyalty: {}, next: "derek_after_brooke_after_yesterday" }
          ]
        }
      ]
    },
    {
      id: "derek_after_brooke_no_evidence",
      chat: "private_derek",
      trigger: "choice:derek_after_brooke_common_one:0",
      messages: [
        { from: "derek", text: "Ладно.", delay: 700 },
        { from: "derek", text: "Значит, Брук действительно сделала из этого больше, чем есть.", delay: 1200 }
      ]
    },
    {
      id: "derek_after_brooke_need_check",
      chat: "private_derek",
      trigger: "choice:derek_after_brooke_common_one:1",
      messages: [
        { from: "derek", text: "Понял.", delay: 700 },
        { from: "derek", text: "Я не буду выпытывать, что именно.", delay: 900 }
      ]
    },
    {
      id: "derek_after_brooke_after_yesterday",
      chat: "private_derek",
      trigger: "choice:derek_after_brooke_common_one:2",
      messages: [
        { from: "derek", text: "Нет.", delay: 700 },
        { from: "derek", text: "Я понимаю, почему вы не хотите.", delay: 900 }
      ]
    },
    {
      id: "derek_after_brooke_common_two",
      chat: "private_derek",
      trigger: "after:derek_after_brooke_no_evidence|derek_after_brooke_need_check|derek_after_brooke_after_yesterday",
      messages: [
        { from: "derek", text: "Вчера я решил, что если соберу всех вместе, станет легче.", delay: 1200 },
        { from: "derek", text: "Вышло наоборот.", delay: 800 },
        { from: "derek", text: "Я только заставил всех сорваться друг на друга.", delay: 1100 },
        {
          type: "choice",
          options: [
            { text: "Ты правда решил всё за остальных.", loyalty: {}, next: "derek_after_brooke_decided_for_all" },
            { text: "Ты просто был напуган.", loyalty: { derek: 1 }, next: "derek_after_brooke_scared" },
            { text: "Сейчас важнее Харпер.", loyalty: {}, next: "derek_after_brooke_harper_first" }
          ]
        }
      ]
    },
    {
      id: "derek_after_brooke_decided_for_all",
      chat: "private_derek",
      trigger: "choice:derek_after_brooke_common_two:0",
      messages: [
        { from: "derek", text: "Да.", delay: 700 },
        { from: "derek", text: "И это было неправильно.", delay: 900 }
      ]
    },
    {
      id: "derek_after_brooke_scared",
      chat: "private_derek",
      trigger: "choice:derek_after_brooke_common_two:1",
      messages: [
        { from: "derek", text: "Был.", delay: 700 },
        { from: "derek", text: "И до сих пор.", delay: 900 }
      ]
    },
    {
      id: "derek_after_brooke_harper_first",
      chat: "private_derek",
      trigger: "choice:derek_after_brooke_common_two:2",
      messages: [
        { from: "derek", text: "Да.", delay: 700 },
        { from: "derek", text: "Ты прав.", delay: 800 }
      ]
    },
    {
      id: "derek_after_brooke_common_three",
      chat: "private_derek",
      trigger: "after:derek_after_brooke_decided_for_all|derek_after_brooke_scared|derek_after_brooke_harper_first",
      messages: [
        { from: "derek", text: "Я не хочу снова лезть туда, куда меня не зовут.", delay: 1200 },
        { from: "derek", text: "Но если появится что-то, что действительно может ей помочь...", delay: 1200 },
        { from: "derek", text: "Не держите это между собой слишком долго.", delay: 1100 },
        {
          type: "choice",
          options: [
            { text: "Если появится что-то надёжное, ты узнаешь.", loyalty: {}, trust: { derekTrust: 1 }, next: "derek_after_brooke_reliable" },
            { text: "Сначала нужно понять, что это вообще значит.", loyalty: {}, next: "derek_after_brooke_understand_first" },
            { text: "Я ничего не могу обещать.", loyalty: {}, next: "derek_after_brooke_no_promise" }
          ]
        }
      ]
    },
    {
      id: "derek_after_brooke_reliable",
      chat: "private_derek",
      trigger: "choice:derek_after_brooke_common_three:0",
      messages: [
        { from: "derek", text: "Хорошо.", delay: 800 }
      ]
    },
    {
      id: "derek_after_brooke_understand_first",
      chat: "private_derek",
      trigger: "choice:derek_after_brooke_common_three:1",
      messages: [
        { from: "derek", text: "Ладно.", delay: 700 },
        { from: "derek", text: "Просто не рискуйте зря.", delay: 900 }
      ]
    },
    {
      id: "derek_after_brooke_no_promise",
      chat: "private_derek",
      trigger: "choice:derek_after_brooke_common_three:2",
      messages: [
        { from: "derek", text: "Понял.", delay: 800 }
      ]
    },
    {
      id: "derek_after_brooke_end",
      chat: "private_derek",
      trigger: "after:derek_after_brooke_reliable|derek_after_brooke_understand_first|derek_after_brooke_no_promise",
      setFlags: { derekAskedAboutPrivateChat: true },
      messages: [
        { from: "derek", text: "Я не стану писать Оливии и Мие из-за этого.", delay: 1100 },
        { from: "derek", text: "И с Брук попробую поговорить.", delay: 1000 },
        { from: "derek", text: "Хотя она сейчас вряд ли кого-то послушает.", delay: 1100 },
        { from: "derek", text: "Прости, что полез.", delay: 900 },
        { from: "derek", text: "Я просто не знаю, что ещё делать.", delay: 1100 },
        { type: "system", text: "Дерек вышел из сети.", delay: 900, characterStatus: { id: "derek", online: false } }
      ]
    },
    {
      id: "unknown_after_derek_file_start",
      chat: "private_unknown",
      trigger: "after:derek_after_brooke_end",
      identify: ["unknown"],
      messages: [
        { type: "pause", delay: 7000 },
        { type: "system", text: "Неизвестный в сети.", delay: 500, characterStatus: { id: "unknown", online: true } },
        { from: "unknown", text: "Видел твои сообщения о звонке.", delay: 1000 },
        { from: "unknown", text: "Номер был подменён.", delay: 900 },
        { from: "unknown", text: "По нему ничего не найти.", delay: 900 },
        { from: "unknown", text: "Но голосовое не удаляй.", delay: 900 },
        { from: "unknown", text: "Я закончил с файлом.", delay: 1000 },
        {
          type: "choice",
          options: [
            { text: "Ты смог что-то восстановить?", loyalty: {}, next: "unknown_after_derek_recovered" },
            { text: "Его теперь можно открыть?", loyalty: {}, next: "unknown_after_derek_can_open" },
            { text: "Ты говорил, что там осталось всего несколько секунд.", loyalty: {}, next: "unknown_after_derek_three_seconds" }
          ]
        }
      ]
    },
    {
      id: "unknown_after_derek_recovered",
      chat: "private_unknown",
      trigger: "choice:unknown_after_derek_file_start:0",
      messages: [
        { from: "unknown", text: "Часть.", delay: 800 },
        { from: "unknown", text: "Не весь файл.", delay: 900 }
      ]
    },
    {
      id: "unknown_after_derek_can_open",
      chat: "private_unknown",
      trigger: "choice:unknown_after_derek_file_start:1",
      messages: [
        { from: "unknown", text: "Эту копию — да.", delay: 900 },
        { from: "unknown", text: "Я убрал из неё всё, через что к тебе подключились.", delay: 1200 }
      ]
    },
    {
      id: "unknown_after_derek_three_seconds",
      chat: "private_unknown",
      trigger: "choice:unknown_after_derek_file_start:2",
      messages: [
        { from: "unknown", text: "Три.", delay: 800 },
        { from: "unknown", text: "Остальное повреждено.", delay: 900 }
      ]
    },
    {
      id: "unknown_after_derek_file_common",
      chat: "private_unknown",
      trigger: "after:unknown_after_derek_recovered|unknown_after_derek_can_open|unknown_after_derek_three_seconds",
      setFlags: { videoAnalysisAvailable: true },
      messages: [
        { from: "unknown", text: "Отправляю очищенный фрагмент.", delay: 1000 },
        { from: "narrator", text: "Неизвестный отправил файл.", delay: 800 },
        { from: "narrator", text: "Воспроизведение файла.", delay: 1000 },
        { from: "unknown", type: "video", title: "VID_1842_fragment.mp4", duration: "00:03", src: "src/assets/videos/vid_1842_fragment.mp4?v=90", poster: "src/assets/videos/vid_1842_fragment_poster.jpg?v=90", caption: "Очищенный фрагмент · 00:03", orientation: "vertical", analysisAction: "frame_analysis", delay: 1200 },
        { from: "unknown", text: "Та же машина.", delay: 1100 },
        {
          type: "choice",
          options: [
            { text: "Откуда ты знаешь про машину?", loyalty: {}, next: "unknown_after_derek_how_car" },
            { text: "Ты видел фото из Larks?", loyalty: {}, next: "unknown_after_derek_saw_larks" },
            { text: "Ты читал мои заметки?", loyalty: {}, next: "unknown_after_derek_read_notes" }
          ]
        }
      ]
    },
    {
      id: "unknown_after_derek_how_car",
      chat: "private_unknown",
      trigger: "choice:unknown_after_derek_file_common:0",
      messages: [
        { from: "unknown", text: "Пока прерывал подключение, я увидел больше, чем должен был.", delay: 1200 }
      ]
    },
    {
      id: "unknown_after_derek_saw_larks",
      chat: "private_unknown",
      trigger: "choice:unknown_after_derek_file_common:1",
      messages: [
        { from: "unknown", text: "Видел.", delay: 800 },
        { from: "unknown", text: "И этого хватило, чтобы заметить совпадение.", delay: 1100 }
      ]
    },
    {
      id: "unknown_after_derek_read_notes",
      chat: "private_unknown",
      trigger: "choice:unknown_after_derek_file_common:2",
      messages: [
        { from: "unknown", text: "Часть.", delay: 800 },
        { from: "unknown", text: "Иначе я бы не понял, что зелёный седан уже появлялся рядом с Харпер.", delay: 1300 }
      ]
    },
    {
      id: "unknown_after_derek_car_common",
      chat: "private_unknown",
      trigger: "after:unknown_after_derek_how_car|unknown_after_derek_saw_larks|unknown_after_derek_read_notes",
      messages: [
        { from: "unknown", text: "Эта машина была у Larks.", delay: 1000 },
        { from: "unknown", text: "Потом Харпер заметила похожую у старого моста.", delay: 1100 },
        { from: "unknown", text: "Теперь она есть в видео с телефона Мии.", delay: 1100 },
        { from: "unknown", text: "Это ещё не доказательство.", delay: 900 },
        { from: "unknown", text: "Но случайностью уже не выглядит.", delay: 1000 },
        {
          type: "choice",
          options: [
            { text: "На стекле какая-то наклейка.", loyalty: {}, next: "unknown_after_derek_sticker" },
            { text: "Можно понять, где это снято?", loyalty: {}, next: "unknown_after_derek_location" },
            { text: "Ты знаешь, кому принадлежит машина?", loyalty: {}, next: "unknown_after_derek_owner" }
          ]
        }
      ]
    },
    {
      id: "unknown_after_derek_sticker",
      chat: "private_unknown",
      trigger: "choice:unknown_after_derek_car_common:0",
      messages: [
        { from: "unknown", text: "Похожа на пропуск.", delay: 900 },
        { from: "unknown", text: "Или разрешение на въезд.", delay: 900 },
        { from: "unknown", text: "Текст слишком размытый.", delay: 900 }
      ]
    },
    {
      id: "unknown_after_derek_location",
      chat: "private_unknown",
      trigger: "choice:unknown_after_derek_car_common:1",
      messages: [
        { from: "unknown", text: "Не точно.", delay: 800 },
        { from: "unknown", text: "Но кто-то, кто хорошо знает Рейвенвуд, может узнать место или наклейку.", delay: 1300 }
      ]
    },
    {
      id: "unknown_after_derek_owner",
      chat: "private_unknown",
      trigger: "choice:unknown_after_derek_car_common:2",
      messages: [
        { from: "unknown", text: "Нет.", delay: 800 },
        { from: "unknown", text: "Пока нет.", delay: 800 }
      ]
    },
    {
      id: "unknown_after_derek_warning_common",
      chat: "private_unknown",
      trigger: "after:unknown_after_derek_sticker|unknown_after_derek_location|unknown_after_derek_owner",
      messages: [
        { from: "unknown", text: "Не пересылай фрагмент целиком.", delay: 1000 },
        { from: "unknown", text: "Если решишь кому-то его показать, отправь только стоп-кадр с наклейкой.", delay: 1300 },
        { from: "unknown", text: "И не говори, откуда у тебя файл.", delay: 1000 },
        {
          type: "choice",
          options: [
            { text: "Почему?", loyalty: {}, next: "unknown_after_derek_why_silent" },
            { text: "Ты всё ещё хочешь, чтобы я молчал о тебе?", loyalty: {}, next: "unknown_after_derek_still_silent" },
            { text: "А если меня спросят?", loyalty: {}, next: "unknown_after_derek_if_asked" }
          ]
        }
      ]
    },
    {
      id: "unknown_after_derek_why_silent",
      chat: "private_unknown",
      trigger: "choice:unknown_after_derek_warning_common:0",
      messages: [
        { from: "unknown", text: "Потому что никто не знает, кто ещё видит ваши сообщения.", delay: 1200 }
      ]
    },
    {
      id: "unknown_after_derek_still_silent",
      chat: "private_unknown",
      trigger: "choice:unknown_after_derek_warning_common:1",
      messages: [
        { from: "unknown", text: "Да.", delay: 800 }
      ]
    },
    {
      id: "unknown_after_derek_if_asked",
      chat: "private_unknown",
      trigger: "choice:unknown_after_derek_warning_common:2",
      messages: [
        { from: "unknown", text: "Скажи, что файл удалось восстановить.", delay: 1000 },
        { from: "unknown", text: "Остальное не обязательно объяснять.", delay: 1000 }
      ]
    },
    {
      id: "unknown_after_derek_end",
      chat: "private_unknown",
      trigger: "after:unknown_after_derek_why_silent|unknown_after_derek_still_silent|unknown_after_derek_if_asked",
      setFlags: { cleanVideoFragmentReceived: true, sedanStickerLeadUnlocked: true },
      messages: [
        { from: "unknown", text: "Сначала разберись с наклейкой.", delay: 1000 },
        { from: "unknown", text: "Потом решай, кому можно доверить остальное.", delay: 1100 },
        { from: "unknown", text: "Пока.", delay: 800 },
        { type: "system", text: "Неизвестный вышел из сети.", delay: 900, characterStatus: { id: "unknown", online: false } }
      ]
    },
    {
      id: "sticker_larks_open",
      chat: "group_larks",
      trigger: "flag:stickerStillAddedToCase",
      setFlags: { requiredPlayerMessageFlowEnabled: true },
      messages: [
        { type: "navigate", screen: "chat", params: { chatId: "group_larks" }, delay: 250 },
        {
          type: "choice",
          options: [
            { text: "Я сохранил один кадр из файла.", loyalty: {}, next: "sticker_larks_player_glass" }
          ]
        }
      ]
    },
    {
      id: "sticker_larks_player_glass",
      chat: "group_larks",
      trigger: "choice:sticker_larks_open:0",
      messages: [
        {
          type: "choice",
          options: [
            { text: "Посмотрите на наклейку на стекле.", loyalty: {}, next: "sticker_larks_player_send" }
          ]
        }
      ]
    },
    {
      id: "sticker_larks_player_send",
      chat: "group_larks",
      trigger: "choice:sticker_larks_player_glass:0",
      messages: [
        {
          type: "choice",
          options: [
            { text: "Отправить стоп-кадр", loyalty: {}, sendMessage: false, next: "sticker_larks_image_sent" }
          ]
        }
      ]
    },
    {
      id: "sticker_larks_image_sent",
      chat: "group_larks",
      trigger: "choice:sticker_larks_player_send:0",
      setFlags: { stickerStillSharedToLarks: true, oliviaSawStickerStill: true },
      messages: [
        { from: "narrator", text: "Изображение отправлено.", delay: 500 },
        { from: "player", type: "image", src: "src/assets/case/still_1842_sticker.png?v=90", caption: "Стоп-кадр с наклейкой", delay: 700 },
        { from: "olivia", text: "Похоже на какой-то пропуск.", delay: 1000 },
        { from: "olivia", text: "Но я таких не видела.", delay: 900 },
        { type: "system", text: "Миа в сети.", delay: 800, characterStatus: { id: "mia", online: true } },
        { from: "mia", text: "Я на перерыве.", delay: 900 },
        { from: "mia", text: "Это точно та машина, которую Харпер видела у моста?", delay: 1100 },
        {
          type: "choice",
          options: [
            { text: "Похоже. Цвет и форма совпадают.", loyalty: {}, next: "sticker_larks_car_matches" },
            { text: "Не уверен. Но наклейку стоит проверить.", loyalty: {}, next: "sticker_larks_check_sticker" },
            { text: "Сначала посмотрите на стекло. Это может быть важнее самой машины.", loyalty: {}, next: "sticker_larks_glass_first" }
          ]
        }
      ]
    },
    {
      id: "sticker_larks_car_matches",
      chat: "group_larks",
      trigger: "choice:sticker_larks_image_sent:0",
      messages: [
        { from: "olivia", text: "Тогда она появлялась рядом с Харпер не один раз.", delay: 1100 }
      ]
    },
    {
      id: "sticker_larks_check_sticker",
      chat: "group_larks",
      trigger: "choice:sticker_larks_image_sent:1",
      messages: [
        { from: "mia", text: "Да.", delay: 700 },
        { from: "mia", text: "Может, по ней можно понять, куда ездила машина.", delay: 1100 }
      ]
    },
    {
      id: "sticker_larks_glass_first",
      chat: "group_larks",
      trigger: "choice:sticker_larks_image_sent:2",
      messages: [
        { from: "olivia", text: "Согласна.", delay: 800 }
      ]
    },
    {
      id: "sticker_larks_tyler_idea",
      chat: "group_larks",
      trigger: "after:sticker_larks_car_matches|sticker_larks_check_sticker|sticker_larks_glass_first",
      setFlags: { miaSawStickerStill: true },
      messages: [
        { from: "mia", text: "Это не обычный парковочный талон.", delay: 1000 },
        { from: "mia", text: "Похоже на что-то служебное.", delay: 1000 },
        { from: "olivia", text: "Кто может такое узнать?", delay: 900 },
        { from: "mia", text: "Тайлер.", delay: 800 },
        { from: "olivia", text: "Почему он?", delay: 800 },
        { from: "mia", text: "Он подрабатывает курьером.", delay: 900 },
        { from: "mia", text: "Постоянно ездит по городу.", delay: 900 },
        { from: "mia", text: "И знает все эти служебные въезды, парковки и объезды.", delay: 1200 },
        { from: "olivia", text: "Можно показать ему только стоп-кадр.", delay: 1000 },
        { from: "olivia", text: "Не видео.", delay: 800 },
        {
          type: "choice",
          options: [
            { text: "Напишу Тайлеру.", loyalty: {}, next: "sticker_larks_write_tyler" },
            { text: "Сначала хочу понять, можно ли ему доверять.", loyalty: {}, next: "sticker_larks_trust_tyler" },
            { text: "Не хочу втягивать ещё одного человека.", loyalty: {}, next: "sticker_larks_no_more_people" }
          ]
        }
      ]
    },
    {
      id: "sticker_larks_write_tyler",
      chat: "group_larks",
      trigger: "choice:sticker_larks_tyler_idea:0",
      messages: [
        { from: "olivia", text: "Хорошо.", delay: 800 },
        { from: "olivia", text: "Отправь только кадр.", delay: 900 }
      ]
    },
    {
      id: "sticker_larks_trust_tyler",
      chat: "group_larks",
      trigger: "choice:sticker_larks_tyler_idea:1",
      messages: [
        { from: "mia", text: "Он не болтун.", delay: 900 },
        { from: "mia", text: "Но решай сам.", delay: 800 }
      ]
    },
    {
      id: "sticker_larks_no_more_people",
      chat: "group_larks",
      trigger: "choice:sticker_larks_tyler_idea:2",
      messages: [
        { from: "olivia", text: "Понимаю.", delay: 800 },
        { from: "olivia", text: "Но сами мы наклейку не узнаем.", delay: 1000 }
      ]
    },
    {
      id: "sticker_larks_tyler_action",
      chat: "group_larks",
      trigger: "after:sticker_larks_write_tyler|sticker_larks_trust_tyler|sticker_larks_no_more_people",
      unlock: [
        { type: "contacts", id: "tyler" },
        { type: "chats", id: "private_tyler" }
      ],
      setFlags: { tylerContactUnlocked: true },
      messages: [
        { type: "system", text: "Новое действие.", delay: 700 },
        {
          type: "choice",
          options: [
            { text: "Написать Тайлеру", loyalty: {}, sendMessage: false, next: "tyler_sticker_start" }
          ]
        }
      ]
    },
    {
      id: "tyler_sticker_start",
      chat: "private_tyler",
      trigger: "choice:sticker_larks_tyler_action:0",
      identify: ["tyler"],
      messages: [
        { type: "navigate", screen: "chat", params: { chatId: "private_tyler" }, delay: 250 },
        { type: "system", text: "Тайлер в сети.", delay: 500, characterStatus: { id: "tyler", online: true } },
        { from: "tyler", text: "Ты был в том чате у Дерека.", delay: 1000 },
        { from: "tyler", text: "Что тебе нужно?", delay: 900 },
        {
          type: "choice",
          options: [
            { text: "Привет. Это {player}. Нужна помощь с одним кадром.", loyalty: {}, next: "tyler_sticker_intro" },
            { text: "Миа сказала, что ты можешь узнать служебный пропуск.", loyalty: {}, next: "tyler_sticker_mia_said" },
            { text: "Можешь посмотреть одну деталь? Без лишней истории.", loyalty: {}, next: "tyler_sticker_short" }
          ]
        }
      ]
    },
    {
      id: "tyler_sticker_intro",
      chat: "private_tyler",
      trigger: "choice:tyler_sticker_start:0",
      messages: [
        { from: "tyler", text: "Смотря с каким.", delay: 900 }
      ]
    },
    {
      id: "tyler_sticker_mia_said",
      chat: "private_tyler",
      trigger: "choice:tyler_sticker_start:1",
      messages: [
        { from: "tyler", text: "Она уже решила, что это пропуск?", delay: 1000 },
        { from: "tyler", text: "Ладно. Показывай.", delay: 900 }
      ]
    },
    {
      id: "tyler_sticker_short",
      chat: "private_tyler",
      trigger: "choice:tyler_sticker_start:2",
      messages: [
        { from: "tyler", text: "Уже звучит подозрительно.", delay: 900 },
        { from: "tyler", text: "Отправляй.", delay: 800 }
      ]
    },
    {
      id: "tyler_sticker_send_frame",
      chat: "private_tyler",
      trigger: "after:tyler_sticker_intro|tyler_sticker_mia_said|tyler_sticker_short",
      messages: [
        {
          type: "choice",
          options: [
            { text: "Отправить стоп-кадр с наклейкой", loyalty: {}, sendMessage: false, next: "tyler_sticker_analyzes" }
          ]
        }
      ]
    },
    {
      id: "tyler_sticker_analyzes",
      chat: "private_tyler",
      trigger: "choice:tyler_sticker_send_frame:0",
      messages: [
        { from: "narrator", text: "Изображение отправлено.", delay: 500 },
        { from: "player", type: "image", src: "src/assets/case/still_1842_sticker.png?v=90", caption: "Стоп-кадр с наклейкой", delay: 700 },
        { from: "tyler", text: "Подожди.", delay: 900 },
        { from: "narrator", text: "Тайлер просматривает изображение.", delay: 1200 },
        { from: "tyler", text: "Похоже на временный пропуск Северного двора.", delay: 1200 },
        { from: "tyler", text: "Но качество плохое. На сто процентов не скажу.", delay: 1100 },
        { from: "tyler", text: "Северный двор — это служебная зона за старой станцией.", delay: 1200 },
        { from: "tyler", text: "Там склады, тупик у путей и въезд через шлагбаум.", delay: 1200 },
        { from: "tyler", text: "Такие пропуска бывают у подрядчиков, ночных доставок и тех, кто работает на территории.", delay: 1400 },
        { from: "tyler", text: "По одной наклейке машину не найти.", delay: 1000 },
        {
          type: "choice",
          options: [
            { text: "То есть машина могла туда заезжать?", loyalty: {}, next: "tyler_sticker_car_could_enter" },
            { text: "Ты часто бываешь у Северного двора?", loyalty: {}, next: "tyler_sticker_work_area" },
            { text: "Харпер могла оказаться в той зоне?", loyalty: {}, next: "tyler_sticker_harper_there" }
          ]
        }
      ]
    },
    {
      id: "tyler_sticker_car_could_enter",
      chat: "private_tyler",
      trigger: "choice:tyler_sticker_analyzes:0",
      messages: [
        { from: "tyler", text: "Могла.", delay: 800 },
        { from: "tyler", text: "Но такой пропуск могут выдать и на один въезд.", delay: 1000 }
      ]
    },
    {
      id: "tyler_sticker_work_area",
      chat: "private_tyler",
      trigger: "choice:tyler_sticker_analyzes:1",
      messages: [
        { from: "tyler", text: "Иногда по работе.", delay: 900 },
        { from: "tyler", text: "Но ночью туда почти никто не ездит просто так.", delay: 1100 }
      ]
    },
    {
      id: "tyler_sticker_harper_there",
      chat: "private_tyler",
      trigger: "choice:tyler_sticker_analyzes:2",
      messages: [
        { from: "tyler", text: "Не знаю.", delay: 800 },
        { from: "tyler", text: "Туда можно пройти пешком, но место неприятное.", delay: 1000 }
      ]
    },
    {
      id: "tyler_sticker_end",
      chat: "private_tyler",
      trigger: "after:tyler_sticker_car_could_enter|tyler_sticker_work_area|tyler_sticker_harper_there",
      setFlags: { tylerContacted: true, northYardLeadUnlocked: true },
      messages: [
        { from: "tyler", text: "Я не хочу становиться частью очередного расследования в чате.", delay: 1200 },
        { from: "tyler", text: "Но кадр сохрани.", delay: 900 },
        { from: "tyler", text: "И не рассылай его всем подряд.", delay: 900 },
        { from: "tyler", text: "Если это правда связано с Харпер, лучше не испортить то, что у вас есть.", delay: 1300 },
        { type: "system", text: "Тайлер вышел из сети.", delay: 900, characterStatus: { id: "tyler", online: false } }
      ]
    },
    {
      id: "north_yard_case_update",
      chat: "private_tyler",
      trigger: "after:tyler_sticker_end",
      setFlags: { northYardAddedToMap: true, northYardNoteWritten: true },
      messages: [
        { type: "system", text: "Дело обновлено.", delay: 700 },
        { type: "system", text: "Карта Рейвенвуда обновлена.", delay: 700 },
        { type: "case_entry", id: "thread_north_yard", entryType: "thread", title: "Северный двор", text: "Наклейка на лобовом стекле седана может быть временным пропуском для служебного въезда за старой станцией.", delay: 300 },
        { type: "case_entry", id: "question_north_yard_unknowns", entryType: "question", title: "НЕИЗВЕСТНО", text: "Принадлежит ли наклейка именно этой машине? Была ли машина у Северного двора? Связано ли это место с Харпер?", delay: 300 },
        { type: "note_update", appendTo: "harper_intro_summary", title: "Харпер Вэнс", text: "────────────\n\nНовая деталь\n\nНа стекле зелёного седана видна наклейка.\n\nТайлер считает, что это может быть временный пропуск Северного двора — служебной зоны за старой станцией.\n\nНо это не доказывает, что машина действительно была там.", delay: 300 }
      ]
    },
    {
      id: "mason_after_tyler_start",
      chat: "private_mason",
      trigger: "after:north_yard_case_update",
      identify: ["mason"],
      messages: [
        { type: "pause", delay: 8000 },
        { type: "system", text: "Мейсон в сети.", delay: 500, characterStatus: { id: "mason", online: true } },
        { from: "mason", text: "Мне прислали скрин.", delay: 900 },
        { from: "mason", text: "Ты отправил что-то Тайлеру.", delay: 1000 },
        { from: "mason", text: "Это связано с Харпер?", delay: 900 },
        {
          type: "choice",
          options: [
            { text: "Да. Но я отправил только один кадр.", loyalty: {}, next: "mason_after_tyler_one_frame" },
            { text: "Ты тоже получил скрин с моего телефона?", loyalty: {}, next: "mason_after_tyler_screenshot" },
            { text: "Почему ты вообще спрашиваешь?", loyalty: {}, next: "mason_after_tyler_why_ask" }
          ]
        }
      ]
    },
    {
      id: "mason_after_tyler_one_frame",
      chat: "private_mason",
      trigger: "choice:mason_after_tyler_start:0",
      messages: [
        { from: "mason", text: "Один кадр тоже может быть уликой.", delay: 1000 }
      ]
    },
    {
      id: "mason_after_tyler_screenshot",
      chat: "private_mason",
      trigger: "choice:mason_after_tyler_start:1",
      messages: [
        { from: "mason", text: "Не знаю.", delay: 800 },
        { from: "mason", text: "Но это не меняет сути.", delay: 900 }
      ]
    },
    {
      id: "mason_after_tyler_why_ask",
      chat: "private_mason",
      trigger: "choice:mason_after_tyler_start:2",
      messages: [
        { from: "mason", text: "Потому что вы начали пересылать материалы друг другу.", delay: 1000 }
      ]
    },
    {
      id: "mason_after_tyler_warning_one",
      chat: "private_mason",
      trigger: "after:mason_after_tyler_one_frame|mason_after_tyler_screenshot|mason_after_tyler_why_ask",
      messages: [
        { from: "mason", text: "Вы не знаете, откуда взялся этот файл.", delay: 1100 },
        { from: "mason", text: "Не знаете, изменяли ли его.", delay: 1000 },
        { from: "mason", text: "И не знаете, кто уже получил копии.", delay: 1000 },
        { from: "mason", text: "Остановитесь.", delay: 900 },
        {
          type: "choice",
          options: [
            { text: "Мы не собираемся ехать к станции.", loyalty: {}, next: "mason_after_tyler_no_station" },
            { text: "А ты предлагаешь просто ждать?", loyalty: {}, next: "mason_after_tyler_wait" },
            { text: "Я ничего не собираюсь удалять.", loyalty: {}, next: "mason_after_tyler_no_delete" }
          ]
        }
      ]
    },
    {
      id: "mason_after_tyler_no_station",
      chat: "private_mason",
      trigger: "choice:mason_after_tyler_warning_one:0",
      messages: [
        { from: "mason", text: "Хорошо.", delay: 800 },
        { from: "mason", text: "Потому что туда вам ехать не нужно.", delay: 1000 }
      ]
    },
    {
      id: "mason_after_tyler_wait",
      chat: "private_mason",
      trigger: "choice:mason_after_tyler_warning_one:1",
      messages: [
        { from: "mason", text: "Я предлагаю передать то, что у вас есть, полиции.", delay: 1100 }
      ]
    },
    {
      id: "mason_after_tyler_no_delete",
      chat: "private_mason",
      trigger: "choice:mason_after_tyler_warning_one:2",
      messages: [
        { from: "mason", text: "И правильно.", delay: 800 },
        { from: "mason", text: "Сохрани оригиналы и не редактируй их.", delay: 1000 }
      ]
    },
    {
      id: "mason_after_tyler_end",
      chat: "private_mason",
      trigger: "after:mason_after_tyler_no_station|mason_after_tyler_wait|mason_after_tyler_no_delete",
      setFlags: { masonReceivedNewScreenshot: true, masonWarnedPlayer: true },
      messages: [
        { from: "mason", text: "Не втягивай Тайлера, Оливию и Мию дальше.", delay: 1100 },
        { from: "mason", text: "У вас есть возможная улика.", delay: 900 },
        { from: "mason", text: "Отнесите её тем, кто умеет с этим работать.", delay: 1100 },
        { from: "mason", text: "И не пытайтесь сами ехать к Северному двору.", delay: 1100 },
        { type: "system", text: "Мейсон вышел из сети.", delay: 900, characterStatus: { id: "mason", online: false } }
      ]
    },
    ...miaLateSceneBeats,
    ...chapter1FinaleBeats
  ]
};

const firstPostMiaBeat = legacyChapter1.beats.findIndex(beat => beat.id === 'intro_case_sort_task');
const firstLegacyDerekMorningBeat = legacyChapter1.beats.findIndex(beat => beat.id === 'morning_derek_photos');
const firstMiaRemoteBeat = legacyChapter1.beats.findIndex(beat => beat.id === 'mia_remote_phone_start');
const firstUnknownAfterHackBeat = legacyChapter1.beats.findIndex(beat => beat.id === 'unknown_after_hack_start');

export const chapter1 = {
  ...legacyChapter1,
  title: "Акт 1: Номер Харпер",
  beats: [
    ...introRewriteBeats,
    ...oliviaIntroFinalBeats,
    ...miaIntroRewriteBeats,
    ...legacyChapter1.beats.slice(firstPostMiaBeat, firstLegacyDerekMorningBeat),
    ...derekMorningRewriteBeats,
    ...oliviaMorningRewriteBeats,
    ...postOliviaRoutesRewriteBeats,
    ...backupFoundRewriteBeats,
    ...legacyChapter1.beats.slice(firstUnknownAfterHackBeat)
  ]
};
