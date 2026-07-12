import { oliviaIntroRewriteBeats as baseOliviaBeats } from './oliviaIntroRewrite.js?v=1';

const O = (text, delay = 900) => ({ from: "olivia", text, delay });
const C = (options) => ({ type: "choice", options });
const option = (text, next, trust = 0) => ({
  text,
  loyalty: {},
  ...(trust ? { trust: { oliviaTrust: trust } } : {}),
  next
});

const correctedTail = [
  {
    id: "olivia_intro_v2_want_why",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_want_why_first:0",
    messages: [
      O("Понимаю."),
      O("Я бы тоже не смогла просто сделать вид, что ничего не произошло.", 1050)
    ]
  },
  {
    id: "olivia_intro_v2_cant_forget_first",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_participate:1",
    messages: [C([option("Но забыть обо всём уже не получится.", "olivia_intro_v2_cant_forget")])]
  },
  {
    id: "olivia_intro_v2_cant_forget",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_cant_forget_first:0",
    messages: [
      O("Да.", 650),
      O("Наверное, тебе и не нужно решать прямо сейчас."),
      O("Можно просто немного подождать и посмотреть, что будет дальше.", 1050)
    ]
  },
  {
    id: "olivia_intro_v2_leave",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v2_participate:2",
    messages: [
      O("Я бы поняла."),
      O("Честно.", 700),
      O("После такого знакомства я бы сама, наверное, всех заблокировала.", 1050),
      O("И ты всё ещё можешь это сделать.")
    ]
  },
  {
    id: "olivia_intro_v3_boundaries",
    chat: "private_olivia",
    trigger: "after:olivia_intro_v2_want_why|olivia_intro_v2_cant_forget|olivia_intro_v2_leave",
    messages: [
      O("В любом случае, я не буду добавлять тебя куда-то без спроса."),
      O("И не стану писать каждый раз, когда мне что-то покажется странным.", 1050),
      O("Но если вспомню что-нибудь конкретное про Харпер, скажу тебе."),
      C([
        option("Спасибо, что написала.", "olivia_intro_v3_thanks", 1),
        option("Хорошо.", "olivia_intro_v3_write_first"),
        option("Я пока всё равно не знаю, могу ли вам доверять.", "olivia_intro_v3_distrust")
      ])
    ]
  },
  {
    id: "olivia_intro_v3_thanks",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v3_boundaries:0",
    messages: [
      O("Не за что."),
      O("Мне самой стало немного спокойнее после нормального разговора.", 1050)
    ]
  },
  {
    id: "olivia_intro_v3_write_first",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v3_boundaries:1",
    messages: [C([option("Ты тоже пиши, если что-нибудь изменится.", "olivia_intro_v3_write")])]
  },
  {
    id: "olivia_intro_v3_write",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v3_write_first:0",
    messages: [O("Хорошо.", 700), O("Напишу.", 700)]
  },
  {
    id: "olivia_intro_v3_distrust",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v3_boundaries:2",
    messages: [
      O("Понимаю."),
      O("Я ведь тоже почти тебя не знаю."),
      O("Наверное, сейчас это честно с обеих сторон.", 1000)
    ]
  },
  {
    id: "olivia_intro_v3_other_messages",
    chat: "private_olivia",
    trigger: "after:olivia_intro_v3_thanks|olivia_intro_v3_write|olivia_intro_v3_distrust",
    messages: [
      O("И если тебе ещё кто-нибудь напишет по поводу Харпер..."),
      O("Можешь сказать мне."),
      O("Только если сам захочешь."),
      C([
        option("Хорошо.", "olivia_intro_v3_agree"),
        option("Посмотрим.", "olivia_intro_v3_maybe")
      ])
    ]
  },
  {
    id: "olivia_intro_v3_agree",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v3_other_messages:0",
    messages: [O("Спасибо.", 750)]
  },
  {
    id: "olivia_intro_v3_maybe",
    chat: "private_olivia",
    trigger: "choice:olivia_intro_v3_other_messages:1",
    messages: [O("Ладно.", 700), O("Не буду давить.", 750)]
  },
  {
    id: "intro_olivia_common",
    chat: "private_olivia",
    trigger: "after:olivia_intro_v3_agree|olivia_intro_v3_maybe",
    messages: [
      O("Тогда до связи."),
      O("И ещё раз извини за группу.", 950)
    ]
  }
];

const correctedTailStart = baseOliviaBeats.findIndex(beat => beat.id === 'olivia_intro_v2_want_why');

export const oliviaIntroFinalBeats = [
  ...baseOliviaBeats.slice(0, correctedTailStart),
  ...correctedTail
];
