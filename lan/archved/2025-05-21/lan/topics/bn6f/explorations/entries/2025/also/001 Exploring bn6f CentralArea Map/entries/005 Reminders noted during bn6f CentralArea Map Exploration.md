---
parent: '[[001 Exploring bn6f CentralArea Map]]'
spawned_by: '[[001 Exploring bn6f CentralArea Map]]'
context_type: entry
---

Parent: [001 Exploring bn6f CentralArea Map](../001%20Exploring%20bn6f%20CentralArea%20Map.md)

Spawned by: [001 Exploring bn6f CentralArea Map](../001%20Exploring%20bn6f%20CentralArea%20Map.md)

Spawned in: [^spawn-entry-7080bc](../001%20Exploring%20bn6f%20CentralArea%20Map.md#spawn-entry-7080bc)

# 1 Journal

2025-10-27 Wk 44 Mon - 05:00 +03:00

* [x] Resolved

From [004 Marking pointers to data passed to decompAndCopyData](../tasks/004%20Marking%20pointers%20to%20data%20passed%20to%20decompAndCopyData.md),

Look into graphics pointers saved to `unk_20096E0` for initialization

2025-10-27 Wk 44 Mon - 05:09 +03:00

* [ ] Resolved

Look into [004 Marking pointers to data passed to decompAndCopyData > ^reminder-9381d0](../tasks/004%20Marking%20pointers%20to%20data%20passed%20to%20decompAndCopyData.md#reminder-9381d0)

Similar pattern of many compressed text scripts.

2025-10-27 Wk 44 Mon - 06:29 +03:00

* [ ] Resolved

Look into [004 Marking pointers to data passed to decompAndCopyData > ^reminder-23aa66](../tasks/004%20Marking%20pointers%20to%20data%20passed%20to%20decompAndCopyData.md#reminder-23aa66)

`data/textscript/compressed/CompText86D0460.s` is said to be compressed yet there's a reference without compressed pointer flag?

Note it does it for other compressed scripts too.

````
byte_8127D38:
	.word CompText86D0460
	.word CompText86D0544
	.word CompText86D0544
	.word CompText86D0544
	.word CompText86D0544
	.word CompText86D0544
	.word CompText86D0544
	.word CompText86D0544
	.word CompText86D0544
	.word CompText86D0544
	.word CompText86D0544
	.word CompText86D0460
	.word CompText86D0544
````

2025-12-23 Wk 52 Tue - 08:30 +03:00

* [ ] Resolved

Dump all gfx anim scripts referenced directly through `LoadGFXAnim`

2025-12-11 Wk 50 Thu - 00:27 +03:00

* [ ] Resolved

During [010 Trace Dump MapScriptOnUpdateCentralTown_804EEF7](../../../../../../../../tasks/2025/also/004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts/tasks/010%20Trace%20Dump%20MapScriptOnUpdateCentralTown_804EEF7.md),

Found code that was not dumped in `byte_80990DC`:

````
cs_call_native_with_return_value ptr1=unk_8099165
````

There can be other cases we will need to handle and dump the disassembly of.

2025-12-13 Wk 50 Sat - 03:04 +03:00

Spawn [006 Dumped code in 25 Wk 50](006%20Dumped%20code%20in%2025%20Wk%2050.md) ^spawn-entry-014d1f

2025-12-25 Wk 52 Thu - 14:06 +03:00

* [ ] Resolved

Investigate `off_8039308` which seems to using invalid pointers into a compressed asset.

See [004 Investigate use of off_8039308 which seems to be invalidly pointing inside a compressed asset](../../002%20bn6f%20ROM%20shifting/investigations/004%20Investigate%20use%20of%20off_8039308%20which%20seems%20to%20be%20invalidly%20pointing%20inside%20a%20compressed%20asset.md).

2025-12-27 Wk 52 Sat - 17:00 +03:00

Notes on big indexed data to investigate

````
sub_8108F74 via off_8109050 indexes large ai data
````

2026-01-22 Wk 4 Thu - 03:01 +03:00

* [ ] Resolved

Spawn [007 Scripts that need redumping](007%20Scripts%20that%20need%20redumping.md) ^spawn-entry-6193b9

2026-01-22 Wk 4 Thu - 05:17 +03:00

* [ ] Resolved

Spawn [008 Look into cutscene param for CutsceneScriptEntranceInteract_8098384](008%20Look%20into%20cutscene%20param%20for%20CutsceneScriptEntranceInteract_8098384.md) ^spawn-entry-3dc09d
