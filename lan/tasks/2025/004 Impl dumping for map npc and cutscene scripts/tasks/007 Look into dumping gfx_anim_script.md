---
parent: '[[004 Impl dumping for map npc and cutscene scripts]]'
spawned_by: '[[006 Dump scripts via script tracing]]'
context_type: task
status: todo
---

Parent: [004 Impl dumping for map npc and cutscene scripts](../004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts.md)

Spawned by: [006 Dump scripts via script tracing](006%20Dump%20scripts%20via%20script%20tracing.md)

Spawned in: [<a name="spawn-task-e566ac" />^spawn-task-e566ac](006%20Dump%20scripts%20via%20script%20tracing.md#spawn-task-e566ac)

# 1 Journal

2025-11-06 Wk 45 Thu - 12:31 +03:00

This is the remaining script we haven't created a schema for in Rust. It is being spawned by other script types. Let's see if  `include/bytecode/gfx_anim_script.inc` is complete or if there's any missing work.

2025-11-06 Wk 45 Thu - 12:43 +03:00

Not sure where these are used or where their jump table is.

````
// in include/bytecode/map_script.inc
enum ms_load_gfx_anim_cmd // 0x2c
````

Let's look at this command and see where it leads us.

`MapScriptCutsceneCmd_load_gfx_anim` calls `LoadGFXAnim`

The commands are at `off_8001C24`.  They reflect the names of the commands in `include/bytecode/gfx_anim_script.inc` too. There's not many, only 7 commands. We can register them in rust manually.

````C
off_8001C24:
	.word sub_8001C44+1 // 0x0 copy palette
	.word sub_8001C94+1 // 0x4 copy 0x20 sized tiles
	.word sub_8001C52+1 // 0x8 ???
	.word sub_8002310+1 // 0xc manual palette transform
	.word sub_800232A+1 // 0x10 play sound effect
	.word sub_8002338+1 // 0x14 set or clear event flag
	.word sub_8001CFC+1 // 0x18 copy 0x40 sized tiles
````

2025-11-06 Wk 45 Thu - 13:06 +03:00

````
enum GFX_ANIM_UNK_08 // 0x08
// no macro until I can find ROM data which uses this command
````

We probably should still create for this even if there is no use.

2025-11-06 Wk 45 Thu - 14:07 +03:00

The commands at `off_8001C24` are also used by `ProcessGFXAnims`

`include/structs/GFXAnimState.inc` structs are used for `eGFXAnimStates` and they are indexed for which state to use in `r7` in `LoadGFXAnim`. This is the `r7` used by commands at `off_8001C24`

2025-11-06 Wk 45 Thu - 15:14 +03:00

Yeah it's unclear for now what sets `oGFXAnimState_Param3`. It's not being set by `ProcessGFXAnim`.

2025-11-07 Wk 45 Fri - 02:58 +03:00

    `GFXAnimState` can serve as a good test example for parsing unions in structs later
    
