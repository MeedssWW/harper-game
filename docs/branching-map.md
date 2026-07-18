# Episode 1 branching map

## Main route

`Derek private → Семеро → Olivia/RavenFeed → Mia everyday chat → Notes → Derek photos/everyday chat → old phone → backup/video → compromise → Unknown → Ravenwood Truth → Olivia → Mia → Brooke public demand → end`

All four QA routes must reach the same final publication without reactivating «Семеро».

## Optional and trust-gated scenes

- Olivia's post-RavenFeed everyday exchange can be declined with `ep1_olivia_feed_only`.
- `oliviaTrust >= 1` produces the warmer finale reaction; lower trust produces a careful request for an explanation.
- Mia always has the jacket conversation. `miaTrust >= 1` opens the additional harmless Harper memory; lower trust goes through `ep1_mia_memory_skipped`.
- `miaTrust >= 1` produces a supportive finale check-in. Lower trust remains cautious without becoming accusatory.
- The player may refuse Derek's small talk through `ep1_derek_not_now` without blocking the old-phone scene.

## Backup and privacy

- `miaBackupAccessGranted`: the player can browse the read-only backup.
- `playerDeclinedBackupAccess`: only the recovered attachment is exposed after an unsolicited file notification.
- `miaPrivateChatsOpened`: set by the backup UI when the player opens Mia's unrelated chats.
- Respecting privacy produces `miaRespectedPrivacy` and increases trust.
- Opening private chats produces `miaPrivacyViolated`, lowers trust and changes Mia's immediate response.

## Hack disclosure

- The recovered entry contains an external address, not a locally recovered playable video.
- The embedded viewer exposes a temporary RavenLink key; the visible log records app-index reads, a camera request and an interrupted photo transfer.
- The device does not perform a cinematic full reboot. The embedded viewer closes after the key is revoked and returns the player to Messenger.
- `miaKnowsAboutHack` is set only if the player tells Mia about the compromise, including a later finale disclosure.
- `unknownRevealedToMia` records whether Unknown was mentioned.
- `playerHidHackFromMia` records the lie that the program merely closed.
- `unknownBlocked` records the choice to block Unknown. The main plot still proceeds through Mia's interrupted session.

## RavenFeed progression

- `ravenFeedOpened`: first app render.
- `brookeSearchPostLive`: Brooke's search post becomes visible only after the first look.
- `act1ViralPost`: Ravenwood Truth publication becomes visible.
- `viralPostOpened`: opening that post releases the final reactions.
- `brookeDemandedExplanation`: the final public comment/notification has appeared.
