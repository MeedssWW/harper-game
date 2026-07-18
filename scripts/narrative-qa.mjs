import fs from 'node:fs';
import { chapter1 } from '../src/data/chapter1.js';
import { chapter2 } from '../src/data/chapter2Opening.js';

const beats = chapter1.beats;
const ids = beats.map(beat => beat.id);
const idSet = new Set(ids);
const failures = [];

const fail = message => failures.push(message);
const assert = (condition, message) => { if (!condition) fail(message); };

assert(idSet.size === ids.length, 'В активной главе есть повторяющиеся id сцен.');

const chapter2Beats = chapter2.beats || [];
const chapter2Ids = chapter2Beats.map(beat => beat.id);
const chapter2IdSet = new Set(chapter2Ids);
assert(chapter2IdSet.size === chapter2Ids.length, 'Во втором эпизоде есть повторяющиеся id сцен.');

for (const beat of beats) {
  for (const message of beat.messages || []) {
    for (const option of Array.isArray(message.options) ? message.options : []) {
      if (option.next) assert(idSet.has(option.next), `${beat.id} ведёт в отсутствующую сцену ${option.next}.`);
    }
  }

  for (const ref of triggerBeatIds(beat.trigger)) {
    assert(idSet.has(ref), `${beat.id} ожидает отсутствующую сцену ${ref}.`);
  }
}

for (const beat of chapter2Beats) {
  for (const message of beat.messages || []) {
    for (const option of Array.isArray(message.options) ? message.options : []) {
      if (option.next) assert(chapter2IdSet.has(option.next), `${beat.id} ведёт в отсутствующую сцену второго эпизода ${option.next}.`);
    }
  }
  for (const ref of triggerBeatIds(beat.trigger)) {
    assert(chapter2IdSet.has(ref), `${beat.id} ожидает отсутствующую сцену второго эпизода ${ref}.`);
  }
}

const canonicalOrder = [
  'intro_derek_opener_v2',
  'intro_group_seven_start',
  'intro_group_seven',
  'ep1_olivia_after_group',
  'ep1_open_ravenfeed_direct',
  'ep1_olivia_after_feed',
  'ep1_mia_first_normal',
  'ep1_notes_open',
  'ep1_derek_photos',
  'ep1_mia_phone_memory',
  'ep1_mia_backup_offer',
  'ep1_unknown_first',
  'ep1_public_frame_alert',
  'ep1_brooke_public_demand',
  'ep1_chapter_end'
];

let previous = -1;
for (const id of canonicalOrder) {
  const index = ids.indexOf(id);
  assert(index >= 0, `Не найдена обязательная сцена ${id}.`);
  assert(index > previous, `Нарушен порядок около сцены ${id}.`);
  previous = index;
}

const activeText = JSON.stringify(beats).toLowerCase();
for (const stale of ['north yard', 'тёмно-зелён', 'старый мост', 'две точки', 'закончил с картой']) {
  assert(!activeText.includes(stale), `В активном маршруте осталось старое событие: ${stale}.`);
}

const frameIndex = ids.indexOf('ep1_public_frame_alert');
for (const beat of beats.slice(frameIndex + 1)) {
  const senders = (beat.messages || []).map(message => message.from).filter(Boolean);
  assert(!senders.includes('mason'), `Мейсон пишет после финальной публикации: ${beat.id}.`);
  assert(!senders.includes('tyler'), `Тайлер пишет после финальной публикации: ${beat.id}.`);
  assert(!senders.includes('unknown'), `Неизвестный перехватывает финал после публикации: ${beat.id}.`);
}

const miaPhoneSource = fs.readFileSync(new URL('../src/screens/miaPhone/miaPhone.js', import.meta.url), 'utf8').toLowerCase();
for (const stale of ['закончил с картой', 'всего две точки', 'north yard', 'тёмно-зелён']) {
  assert(!miaPhoneSource.includes(stale), `В интерфейсе взлома остался старый сюжет: ${stale}.`);
}
for (const required of ['временный ключ ravenlink', 'messages.index', 'notes.index', 'camera.capture', 'передача 64%']) {
  assert(miaPhoneSource.includes(required), `В новой сцене взлома отсутствует обязательный след: ${required}.`);
}
for (const cinematic of ['access breach', 'session killed', 'перезагрузка устройства']) {
  assert(!miaPhoneSource.includes(cinematic), `В сцене взлома остался неправдоподобный эффект: ${cinematic}.`);
}

const scenarios = [
  {
    name: 'доверчивый',
    privacyOpened: false,
    choices: {
      ep1_olivia_after_group: 0,
      ep1_olivia_after_feed: 0,
      ep1_olivia_normal_end: 1,
      ep1_mia_outfit: 0,
      ep1_derek_photos: 1,
      ep1_derek_small_talk: 1,
      ep1_derek_soften: 0,
      ep1_mia_phone_memory: 1,
      ep1_mia_backup_offer: 0,
      ep1_unknown_first: 1,
      ep1_unknown_warning: 0,
      ep1_mia_after_hack: 0,
      ep1_mia_after_hack_response: 0,
      ep1_mia_privacy_respected: 0,
      ep1_olivia_final_high: 0,
      ep1_mia_final_high: 0
    }
  },
  {
    name: 'недоверчивый',
    privacyOpened: false,
    choices: {
      ep1_olivia_after_group: 1,
      ep1_olivia_after_feed: 2,
      ep1_mia_outfit: 1,
      ep1_derek_photos: 2,
      ep1_derek_small_talk: 2,
      ep1_mia_phone_memory: 2,
      ep1_mia_backup_offer: 1,
      ep1_backup_unsure: 1,
      ep1_unknown_first: 0,
      ep1_unknown_warning: 2,
      ep1_mia_after_hack: 2,
      ep1_mia_after_hack_response: 2,
      ep1_olivia_final_low: 1,
      ep1_mia_final_low: 1
    }
  },
  {
    name: 'резкий',
    privacyOpened: true,
    choices: {
      intro_group_argument: 1,
      ep1_olivia_after_group: 1,
      ep1_olivia_after_feed: 1,
      ep1_olivia_normal_end: 0,
      ep1_mia_outfit: 1,
      ep1_derek_photos: 2,
      ep1_derek_small_talk: 1,
      ep1_derek_soften: 1,
      ep1_mia_phone_memory: 2,
      ep1_mia_backup_offer: 0,
      ep1_unknown_first: 2,
      ep1_unknown_warning: 2,
      ep1_mia_after_hack: 1,
      ep1_mia_after_hack_response: 2,
      ep1_mia_privacy_broken: 1,
      ep1_olivia_final_low: 0,
      ep1_mia_final_low: 0
    }
  },
  {
    name: 'молчаливый',
    privacyOpened: false,
    choices: {
      intro_group_olivia_leaves: 0,
      ep1_olivia_after_feed: 2,
      ep1_mia_outfit: 2,
      ep1_derek_photos: 0,
      ep1_derek_small_talk: 2,
      ep1_mia_backup_offer: 2,
      ep1_unknown_first: 3,
      ep1_unknown_warning: 3,
      ep1_mia_after_hack: 2,
      ep1_mia_after_hack_response: 1,
      ep1_olivia_final_low: 1,
      ep1_mia_final_low: 1
    }
  }
];

for (const scenario of scenarios) {
  const result = simulate(scenario);
  assert(result.completed.has('ep1_chapter_end'), `Маршрут «${scenario.name}» не дошёл до финала. Последние сцены: ${[...result.completed].slice(-8).join(', ')}.`);
  assert(!result.unlockedChats.has('group_main'), `В маршруте «${scenario.name}» группа «Семеро» осталась доступна.`);
  assert(result.flags.act1ViralPost === true, `В маршруте «${scenario.name}» не появилась публикация Ravenwood Truth.`);
}

const chapter2Scenarios = [
  {
    name: 'резко отвечает Мейсону и рассказывает следователю всё',
    choices: {
      ep2_mason_confronts: 0,
      ep2_mason_threat: 0,
      ep2_police_contact: 0,
      ep2_police_statement: 0,
      ep2_police_photo: 0,
      ep2_police_unknown: 0,
      ep2_derek_checks_in: 0,
      ep2_derek_mason: 1,
      ep2_derek_truth_context: 1,
      ep2_olivia_city_break: 0
    }
  },
  {
    name: 'блокирует Мейсона и скрывает детали взлома',
    choices: {
      ep2_mason_confronts: 3,
      ep2_police_contact: 2,
      ep2_police_statement: 1,
      ep2_police_photo: 2,
      ep2_police_unknown: 2,
      ep2_derek_checks_in: 2,
      ep2_derek_truth_context: 0,
      ep2_olivia_city_break: 2
    }
  },
  {
    name: 'провоцирует Мейсона и спрашивает о статусе',
    choices: {
      ep2_mason_confronts: 2,
      ep2_mason_threat: 2,
      ep2_police_contact: 1,
      ep2_police_statement: 2,
      ep2_police_photo: 1,
      ep2_police_unknown: 1,
      ep2_derek_checks_in: 1,
      ep2_derek_truth_context: 2,
      ep2_olivia_city_break: 1
    }
  }
];

for (const scenario of chapter2Scenarios) {
  const result = simulateChapter2(scenario);
  assert(result.completed.has('ep2_olivia_city_break'), `Второй эпизод, маршрут «${scenario.name}», не дошёл до Оливии.`);
  assert(result.flags.episode2OpeningComplete === true, `Второй эпизод, маршрут «${scenario.name}», не завершил вступление.`);
  assert(result.flags.policeChatCompleted === true, `Второй эпизод, маршрут «${scenario.name}», не завершил переписку со следователем.`);
  assert(!result.unlockedChats.has('group_main'), `Во втором эпизоде маршрут «${scenario.name}» снова открыл «Семеро».`);
}

const chapter2Text = JSON.stringify(chapter2Beats).toLowerCase();
for (const unwanted of ['сохрани оригинал', 'покажи оригинал', 'этот чат увидит полиция', 'принять звонок', 'сейчас наберу']) {
  assert(!chapter2Text.includes(unwanted), `Во втором эпизоде осталась неестественная формулировка: ${unwanted}.`);
}

if (failures.length) {
  console.error(`Narrative QA: ${failures.length} problem(s)`);
  for (const problem of failures) console.error(`- ${problem}`);
  process.exit(1);
}

console.log(`Narrative QA passed: ${beats.length} episode-one scenes, ${chapter2Beats.length} episode-two opening scenes, ${scenarios.length + chapter2Scenarios.length} complete routes.`);

function triggerBeatIds(trigger = '') {
  const parts = trigger.split(':');
  let raw = '';
  if (trigger.startsWith('after:')) raw = trigger.slice(6);
  else if (trigger.startsWith('choice:')) raw = parts[1] || '';
  else if (trigger.startsWith('flagAfter:')) raw = parts[2] || '';
  else if (trigger.startsWith('flagValueAfter:') || trigger.startsWith('flagsValueAfter:') || trigger.startsWith('afterTrustFlag:') || trigger.startsWith('afterNotTrustFlag:')) raw = parts[1] || '';
  return raw.split('|').map(value => value.trim()).filter(Boolean);
}

function simulate(scenario) {
  const state = {
    completed: new Set(),
    choices: new Map(),
    flags: {},
    trust: { oliviaTrust: 0, miaTrust: 0, derekTrust: 0 },
    unlockedChats: new Set(['private_derek'])
  };

  let progressed = true;
  let guard = 0;
  while (progressed && guard++ < 1000) {
    progressed = false;
    for (const beat of beats) {
      if (state.completed.has(beat.id) || !canPlay(beat, state)) continue;
      progressed = true;

      for (const unlock of beat.unlock || []) {
        if (unlock.type === 'chats') state.unlockedChats.add(unlock.id);
      }
      for (const [flag, value] of Object.entries(beat.setFlags || {})) state.flags[flag] = value;

      const choiceMessage = (beat.messages || []).find(message => message.type === 'choice' && Array.isArray(message.options));
      if (choiceMessage) {
        const requested = scenario.choices[beat.id] ?? 0;
        const index = Math.min(requested, choiceMessage.options.length - 1);
        const chosen = choiceMessage.options[index];
        state.choices.set(beat.id, index);
        for (const [key, delta] of Object.entries(chosen.trust || {})) state.trust[key] = (state.trust[key] || 0) + delta;
        if (chosen.setFlag) state.flags[chosen.setFlag] = true;
      }

      for (const message of beat.messages || []) {
        if (message.type === 'lock' && (message.targetType || 'chats') === 'chats') state.unlockedChats.delete(message.id);
        if (message.type === 'note_auto' && message.noteCompleteFlag) state.flags[message.noteCompleteFlag] = true;
        if (message.type === 'wait_flag') {
          state.flags[message.flag] = true;
          if (message.flag === 'remoteSessionInterrupted') {
            if (scenario.privacyOpened && state.flags.miaBackupAccessGranted) state.flags.miaPrivateChatsOpened = 1;
            state.flags.playerHackPhotoCreated = true;
          }
        }
      }

      state.completed.add(beat.id);
    }
  }

  return state;
}

function simulateChapter2(scenario) {
  const state = {
    completed: new Set(),
    choices: new Map(),
    flags: { chapter2Started: true },
    trust: { oliviaTrust: 1, miaTrust: 1, derekTrust: 1 },
    unlockedChats: new Set(['private_derek', 'private_olivia', 'private_mia', 'private_unknown'])
  };

  let progressed = true;
  let guard = 0;
  while (progressed && guard++ < 500) {
    progressed = false;
    for (const beat of chapter2Beats) {
      if (state.completed.has(beat.id) || !canPlayIn(beat, state, chapter2Beats)) continue;
      progressed = true;
      state.unlockedChats.add(beat.chat);
      for (const [flag, value] of Object.entries(beat.setFlags || {})) state.flags[flag] = value;

      const choiceMessage = (beat.messages || []).find(message => message.type === 'choice' && Array.isArray(message.options));
      if (choiceMessage) {
        const requested = scenario.choices[beat.id] ?? 0;
        const index = Math.min(requested, choiceMessage.options.length - 1);
        const chosen = choiceMessage.options[index];
        state.choices.set(beat.id, index);
        if (chosen.setFlag) state.flags[chosen.setFlag] = true;
      }

      for (const message of beat.messages || []) {
        if (message.type === 'wait_flag') state.flags[message.flag] = true;
      }
      state.completed.add(beat.id);
    }
  }
  return state;
}

function canPlay(beat, state) {
  const trigger = beat.trigger || '';
  if (!trigger) return true;
  if (trigger === 'auto') return state.completed.size === 0 && beats[0]?.id === beat.id;
  if (trigger.startsWith('after:')) return triggerBeatIds(trigger).some(id => state.completed.has(id));
  if (trigger.startsWith('choice:')) {
    const [, beatId, rawIndex] = trigger.split(':');
    return state.choices.get(beatId) === Number(rawIndex);
  }
  if (trigger.startsWith('flagAfter:')) {
    const [, flag] = trigger.split(':');
    return Boolean(state.flags[flag]) && triggerBeatIds(trigger).some(id => state.completed.has(id));
  }
  if (trigger.startsWith('flagValueAfter:')) {
    const parts = trigger.split(':');
    const expected = parts[3] !== 'false';
    return triggerBeatIds(trigger).some(id => state.completed.has(id)) && Boolean(state.flags[parts[2]]) === expected;
  }
  if (trigger.startsWith('flagsValueAfter:')) {
    const parts = trigger.split(':');
    if (!triggerBeatIds(trigger).some(id => state.completed.has(id))) return false;
    for (let i = 2; i < parts.length; i += 2) {
      if (Boolean(state.flags[parts[i]]) !== (parts[i + 1] !== 'false')) return false;
    }
    return true;
  }
  if (trigger.startsWith('afterTrustFlag:') || trigger.startsWith('afterNotTrustFlag:')) {
    const invert = trigger.startsWith('afterNotTrustFlag:');
    const parts = trigger.split(':');
    const after = triggerBeatIds(trigger).some(id => state.completed.has(id));
    const trust = (state.trust[parts[2]] || 0) >= Number(parts[3]);
    const flag = !parts[4] || Boolean(state.flags[parts[4]]) === (parts[5] !== 'false');
    const condition = after && trust && flag;
    return invert ? after && !condition : condition;
  }
  if (trigger.startsWith('flag:')) return Boolean(state.flags[trigger.slice(5)]);
  return false;
}

function canPlayIn(beat, state, actBeats) {
  const trigger = beat.trigger || '';
  if (!trigger) return true;
  if (trigger === 'auto') return state.completed.size === 0 && actBeats[0]?.id === beat.id;
  if (trigger.startsWith('after:')) return triggerBeatIds(trigger).some(id => state.completed.has(id));
  if (trigger.startsWith('choice:')) {
    const [, beatId, rawIndex] = trigger.split(':');
    return state.choices.get(beatId) === Number(rawIndex);
  }
  if (trigger.startsWith('flag:')) return Boolean(state.flags[trigger.slice(5)]);
  return canPlay(beat, state);
}
