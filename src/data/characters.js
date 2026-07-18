// ============================================
// Characters Database
// ============================================

export const charactersMap = {
  unknown: {
    id: "unknown",
    name: "Неизвестный",
    avatarColor: "#111827",
    avatarImage: "src/assets/avatars/avatar_harper_live.png",
    defaultLoyalty: 0,
    relation: "Неизвестный номер",
    description: "Пишет с чужого телефона. Не отвечает на лишние вопросы и ведет разговор так, будто заранее знает, где у каждого больное место."
  },
  harper: {
    id: "harper",
    name: "Харпер Вэнс",
    avatarColor: "#b45309",
    avatarImage: "src/assets/avatars/avatar_harper_live.png",
    defaultLoyalty: 0,
    relation: "Пропавшая девушка из Рейвенвуда",
    description: "Харпер умела собирать вокруг себя людей, которые в обычной жизни даже не сели бы за один стол. Теперь каждый из них по-своему пытается понять, куда она исчезла."
  },
  derek: {
    id: "derek",
    name: "Дерек Миллер",
    avatarColor: "#3b82f6",
    avatarImage: "src/assets/social_profiles/v3/derek/life-4.webp",
    phone: "+1 (406) 555-0198",
    handle: "@derek.m",
    socialPhoto: "src/assets/social_profiles/v3/derek/life-3.webp",
    gallery: ["life-1.webp", "life-2.webp", "life-3.webp", "life-4.webp"].map(file => `src/assets/social_profiles/v3/derek/${file}`),
    bio: "Футбол, старый пикап и дороги после полуночи. Если не отвечаю — значит, снова в гараже.",
    defaultLoyalty: 48,
    relation: "Парень Харпер",
    description: "Сдержанный, упрямо правильный, говорит так, будто каждое слово может попасть в протокол. Не холодный, просто страшно боится сорваться.",
    secret: "В ночь смерти Дерек удалил один звонок от Харпер и до сих пор убеждает себя, что это ничего не значит."
  },
  tyler: {
    id: "tyler",
    name: "Тайлер Росс",
    avatarColor: "#0f766e",
    avatarImage: "src/assets/social_profiles/v3/tyler/life-3.webp",
    phone: "+1 (971) 555-0134",
    handle: "@tyler.ross",
    socialPhoto: "src/assets/social_profiles/v3/tyler/life-2.webp",
    gallery: ["life-1.webp", "life-2.webp", "life-3.webp", "life-4.webp"].map(file => `src/assets/social_profiles/v3/tyler/${file}`),
    bio: "Чиню технику, которую все остальные уже выбросили. Ночью работается лучше. Сообщения читаю, отвечаю — не всегда.",
    defaultLoyalty: 43,
    relation: "Друг компании",
    description: "Саркастичный, внимательный, всегда делает вид, что ему все равно. На самом деле замечает больше, чем говорит.",
    secret: "Тайлер видел, как Харпер села в чужую машину, но не уверен, кто был за рулем."
  },
  mason: {
    id: "mason",
    name: "Мейсон Коул",
    avatarColor: "#ef4444",
    avatarImage: "src/assets/social_profiles/v3/mason/life-4.webp",
    phone: "+1 (503) 555-0172",
    handle: "@mason.c",
    socialPhoto: "src/assets/social_profiles/v3/mason/life-1.webp",
    gallery: ["life-1.webp", "life-2.webp", "life-3.webp", "life-4.webp"].map(file => `src/assets/social_profiles/v3/mason/${file}`),
    bio: "Ночные дороги, дешёвый кофе и машины, которые проще понять, чем людей.",
    defaultLoyalty: 38,
    relation: "Старый друг Харпер",
    description: "Резкий, прямой, болезненно честный, пока речь не заходит о нем самом. За злостью часто прячет вину.",
    secret: "Мейсон обещал Харпер встретиться после вечеринки и не пришел."
  },
  olivia: {
    id: "olivia",
    name: "Оливия Грант",
    avatarColor: "#a855f7",
    avatarImage: "src/assets/social_profiles/v3/olivia/life-2.webp",
    phone: "+1 (360) 555-0116",
    handle: "@olivia.grant",
    socialPhoto: "src/assets/social_profiles/v3/olivia/life-3.webp",
    gallery: ["life-1.webp", "life-2.webp", "life-3.webp", "life-4.webp"].map(file => `src/assets/social_profiles/v3/olivia/${file}`),
    bio: "Пью кофе остывшим, спорю до последнего и фотографирую город, когда он почти пуст.",
    defaultLoyalty: 50,
    relation: "Подруга Харпер",
    description: "Собранная, аккуратная, слишком хорошо умеет звучать спокойно. Ее первая реакция на любую беду - удержать всё от развала.",
    secret: "Оливия знала, что Харпер собиралась рассказать кому-то правду о компании, и просила ее подождать хотя бы сутки."
  },
  mia: {
    id: "mia",
    name: "Миа Картер",
    avatarColor: "#22c55e",
    avatarImage: "src/assets/social_profiles/v3/mia/life-3.webp",
    phone: "+1 (541) 555-0183",
    handle: "@mia.carter",
    socialPhoto: "src/assets/social_profiles/v3/mia/life-4.webp",
    gallery: ["life-1.webp", "life-2.webp", "life-3.webp", "life-4.webp"].map(file => `src/assets/social_profiles/v3/mia/${file}`),
    bio: "Рисую, собираю плейлисты и всегда беру дождевик. Иногда слишком долго думаю перед тем, как нажать «отправить».",
    defaultLoyalty: 56,
    relation: "Близкая подруга Харпер",
    description: "Мягкая, тревожная, старается никого не ранить. Из-за этого часто молчит там, где молчать уже нельзя.",
    secret: "Миа последней получила голосовое от Харпер и не дослушала его до конца."
  },
  brooke: {
    id: "brooke",
    name: "Брук Хейз",
    avatarColor: "#64748b",
    avatarImage: "src/assets/social_profiles/v3/brooke/life-4.webp",
    phone: "+1 (458) 555-0107",
    handle: "@brooke.hayes",
    socialPhoto: "src/assets/social_profiles/v3/brooke/life-3.webp",
    gallery: ["life-1.webp", "life-2.webp", "life-3.webp", "life-4.webp"].map(file => `src/assets/social_profiles/v3/brooke/${file}`),
    bio: "Озеро лучше людей. Музыка громче разговоров. Личные вопросы оставляйте при себе.",
    defaultLoyalty: 44,
    relation: "Лучшая подруга Харпер",
    description: "Острая, закрытая, говорит неприятные вещи так спокойно, что от этого становится только хуже. Любила Харпер, но не всегда была на ее стороне.",
    secret: "Брук знает, что Харпер боялась не одного человека, а разговора, который все шестеро пытались забыть."
  },
  detective: {
    id: "detective",
    name: "Дэниел Рид",
    avatarColor: "#1d4ed8",
    avatarImage: "src/assets/icons/lucide/shield-check.svg",
    phone: "+1 (406) 555-0141",
    handle: "Полиция Рейвенвуда",
    defaultLoyalty: 50,
    relation: "Детектив полиции Рейвенвуда",
    description: "Ведёт дело Харпер Вэнс. Не обсуждает детали расследования в сообщениях и просит отделять увиденное от пересказов."
  }
};

export const characters = Object.values(charactersMap).filter(c => !['unknown', 'harper'].includes(c.id));

export function getCharacter(id) {
    return charactersMap[id];
}

export function getCharacterColor(id) {
    const char = charactersMap[id];
    return char ? char.avatarColor : null;
}

export default characters;
