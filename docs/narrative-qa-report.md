# Narrative QA report

## Problems found and fixed

- Tyler referred to a screenshot before the active scene showed it. Derek now shares the screenshot visibly before Tyler comments.
- The player's pre-group reply sounded like a plot summary. It now asks Derek to tell the others that the player has never heard of Harper.
- Notes blocked the story before «Семеро». They now open after Mia's everyday conversations.
- Derek's required photo scene was absent from the new route. Four non-clue photos are now active before his optional small talk.
- Brooke's search post existed before the player entered RavenFeed and was authored by a generic page. It is now a later post from Brooke.
- Mia's second everyday memory was mandatory. It is now trust-gated, with a clean low-trust bypass.
- Mia's private-chat boundary had no narrative consequence. The access history now changes trust and her response.
- The compromise animation displayed dialogue about a map and two old clue locations. Those legacy lines were replaced with current RavenFeed, Olivia and Derek content.
- Mia publicly claimed a hack even when the player hid it. Her RavenFeed comment now depends on `miaKnowsAboutHack`.
- The finale jumped from Ravenwood Truth back to Unknown. It now gives Olivia and Mia trust-sensitive reactions and ends on Brooke's public demand.
- Mason and Tyler have no messages after the final publication.

## Active implementation

- `src/data/introRewrite.js`: Derek and «Семеро».
- `src/data/episode1LivingRewrite.js`: post-group episode route.
- `src/screens/social/social.js`: RavenFeed posts, profiles and finale publication.
- `src/screens/miaPhone/miaPhone.js`: backup, deleted chat, attachment and compromise UI.
- `src/data/chapter1.js`: exposes only the current active beat list.
- `scripts/narrative-qa.mjs`: graph, order, legacy-content and four-route checks.

## Legacy material retained but disconnected

The archived `legacyChapter1` data inside `src/data/chapter1.js` is no longer spread into the exported chapter. The following files are retained as reference/assets but are not imported into the active route:

- `src/data/miaLateScene.js`
- `src/data/chapter1Finale.js`
- `src/data/chapter1FinaleRewrite.js`
- `src/data/derekMorningRewrite.js`
- `src/data/oliviaIntroFinal.js`
- `src/data/miaIntroRewrite.js`
- `src/data/oliviaIntroRewrite.js`
- `src/data/oliviaMorningRewrite.js`
- `src/data/postOliviaRoutesRewrite.js`
- `src/data/backupFoundRewrite.js`
- `src/data/postLeakRewrite.js`

Their images and reusable UI assets were not deleted.

## Remaining limitations

- Browser camera permission is controlled by the device/browser. If automatic capture is denied, the existing manual capture fallback remains required.
- Refusing backup access preserves the choice, but the main plot still requires the player to open the later unsolicited attachment to reach the mandatory compromise.
- Legacy dialogue remains physically present for reference; automated QA prevents its banned events from entering the exported episode.
