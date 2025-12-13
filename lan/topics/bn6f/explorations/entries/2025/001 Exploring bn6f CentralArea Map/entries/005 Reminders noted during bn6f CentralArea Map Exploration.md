---
parent: '[[001 Exploring bn6f CentralArea Map]]'
spawned_by: '[[001 Exploring bn6f CentralArea Map]]'
context_type: entry
---

Parent: [001 Exploring bn6f CentralArea Map](../001%20Exploring%20bn6f%20CentralArea%20Map.md)

Spawned by: [001 Exploring bn6f CentralArea Map](../001%20Exploring%20bn6f%20CentralArea%20Map.md)

Spawned in: [<a name="spawn-entry-7080bc" />^spawn-entry-7080bc](../001%20Exploring%20bn6f%20CentralArea%20Map.md#spawn-entry-7080bc)

# 1 Journal

2025-10-27 Wk 44 Mon - 05:00 +03:00

* [x] Resolved

From [004 Marking pointers to data passed to decompAndCopyData](../tasks/004%20Marking%20pointers%20to%20data%20passed%20to%20decompAndCopyData.md),

Look into graphics pointers saved to `unk_20096E0` for initialization

2025-10-27 Wk 44 Mon - 05:09 +03:00

* [ ] Resolved

Look into [004 Marking pointers to data passed to decompAndCopyData > <a name="reminder-9381d0" />^reminder-9381d0](../tasks/004%20Marking%20pointers%20to%20data%20passed%20to%20decompAndCopyData.md#reminder-9381d0)

Similar pattern of many compressed text scripts.

2025-10-27 Wk 44 Mon - 06:29 +03:00

* [ ] Resolved

Look into [004 Marking pointers to data passed to decompAndCopyData > <a name="reminder-23aa66" />^reminder-23aa66](../tasks/004%20Marking%20pointers%20to%20data%20passed%20to%20decompAndCopyData.md#reminder-23aa66)

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

2025-12-11 Wk 50 Thu - 00:27 +03:00

* [ ] Resolved

During [010 Trace Dump MapScriptOnUpdateCentralTown_804EEF7](../../../../../../../tasks/2025/004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts/tasks/010%20Trace%20Dump%20MapScriptOnUpdateCentralTown_804EEF7.md),

Found code that was not dumped in `byte_80990DC`:

````
cs_call_native_with_return_value ptr1=unk_8099165
````

There can be other cases we will need to handle and dump the disassembly of.

2025-12-13 Wk 50 Sat - 03:04 +03:00

There's also disassembled code in:

* `undumped_code_8061B6C`, `undumped_code_8061B84`, `undumped_code_8061BE6`,  `undumped_code_80652A0`
