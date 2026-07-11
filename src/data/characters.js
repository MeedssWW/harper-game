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
    relation: "Та, из-за чьей смерти всё началось",
    description: "Харпер умела собирать вокруг себя людей, которые в обычной жизни даже не сели бы за один стол. После ее смерти эта компания держится только на страхе."
  },
  derek: {
    id: "derek",
    name: "Дерек Миллер",
    avatarColor: "#3b82f6",
    avatarImage: "src/assets/avatars/avatar_derek_live.png",
    phone: "+1 (406) 555-0198",
    handle: "@derek.m",
    socialPhoto: "src/assets/avatars/avatar_derek_live.png",
    bio: "Футбол, семейный пикап, слишком чистая история про вчерашний вечер. Последний пост - фото с парковки у North Lot.",
    defaultLoyalty: 48,
    relation: "Бывший парень Харпер",
    description: "Сдержанный, упрямо правильный, говорит так, будто каждое слово может попасть в протокол. Не холодный, просто страшно боится сорваться.",
    secret: "В ночь смерти Дерек удалил один звонок от Харпер и до сих пор убеждает себя, что это ничего не значит."
  },
  tyler: {
    id: "tyler",
    name: "Тайлер Росс",
    avatarColor: "#0f766e",
    avatarImage: "src/assets/avatars/avatar_tyler_live.png",
    phone: "+1 (971) 555-0134",
    handle: "@tyler.ross",
    socialPhoto: "src/assets/avatars/avatar_tyler_live.png",
    bio: "Старые компьютеры, ночные смены, странная привычка сохранять всё в заметках. В профиле почти нет людей, кроме Харпер.",
    defaultLoyalty: 43,
    relation: "Друг компании",
    description: "Саркастичный, внимательный, всегда делает вид, что ему все равно. На самом деле замечает больше, чем говорит.",
    secret: "Тайлер видел, как Харпер села в чужую машину, но не уверен, кто был за рулем."
  },
  mason: {
    id: "mason",
    name: "Мейсон Коул",
    avatarColor: "#ef4444",
    avatarImage: "src/assets/avatars/avatar_mason_live.png",
    phone: "+1 (503) 555-0172",
    handle: "@mason.c",
    socialPhoto: "src/assets/avatars/avatar_mason_live.png",
    bio: "Пишет резко, удаляет сторис чаще, чем выкладывает. В ленте много ночных заправок и пустых дорог.",
    defaultLoyalty: 38,
    relation: "Старый друг Харпер",
    description: "Резкий, прямой, болезненно честный, пока речь не заходит о нем самом. За злостью часто прячет вину.",
    secret: "Мейсон обещал Харпер встретиться после вечеринки и не пришел."
  },
  olivia: {
    id: "olivia",
    name: "Оливия Грант",
    avatarColor: "#a855f7",
    avatarImage: "src/assets/avatars/avatar_olivia_live.png",
    phone: "+1 (360) 555-0116",
    handle: "@olivia.grant",
    socialPhoto: "src/assets/avatars/avatar_olivia_live.png",
    bio: "Кофе, дебаты, идеальные подписи без лишних эмоций. Вчера ночью закрыла профиль на двадцать минут.",
    defaultLoyalty: 50,
    relation: "Подруга Харпер",
    description: "Собранная, аккуратная, слишком хорошо умеет звучать спокойно. Ее первая реакция на любую беду - удержать всё от развала.",
    secret: "Оливия знала, что Харпер собиралась рассказать кому-то правду о компании, и просила ее подождать хотя бы сутки."
  },
  mia: {
    id: "mia",
    name: "Миа Картер",
    avatarColor: "#22c55e",
    avatarImage: "src/assets/avatars/avatar_mia_live.png",
    phone: "+1 (541) 555-0183",
    handle: "@mia.carter",
    socialPhoto: "src/assets/avatars/avatar_mia_live.png",
    bio: "Мягкие фото, тихие подписи, много старых снимков с Харпер. Последний онлайн был сразу после полуночи.",
    defaultLoyalty: 56,
    relation: "Близкая подруга Харпер",
    description: "Мягкая, тревожная, старается никого не ранить. Из-за этого часто молчит там, где молчать уже нельзя.",
    secret: "Миа последней получила голосовое от Харпер и не дослушала его до конца."
  },
  brooke: {
    id: "brooke",
    name: "Брук Хейз",
    avatarColor: "#64748b",
    avatarImage: "src/assets/avatars/avatar_brooke_live.png",
    phone: "+1 (458) 555-0107",
    handle: "@brooke.hayes",
    socialPhoto: "src/assets/avatars/avatar_brooke_live.png",
    bio: "Озеро, холодные подписи, почти нет отметок друзей. Харпер часто лайкала её старые фотографии.",
    defaultLoyalty: 44,
    relation: "Лучшая подруга Харпер",
    description: "Острая, закрытая, говорит неприятные вещи так спокойно, что от этого становится только хуже. Любила Харпер, но не всегда была на ее стороне.",
    secret: "Брук знает, что Харпер боялась не одного человека, а разговора, который все шестеро пытались забыть."
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
