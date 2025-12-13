---
parent: '[[001 Exploring bn6f CentralArea Map]]'
spawned_by: '[[001 Exploring bn6f CentralArea Map]]'
context_type: entry
---

Parent: [001 Exploring bn6f CentralArea Map](../001%20Exploring%20bn6f%20CentralArea%20Map.md)

Spawned by: [001 Exploring bn6f CentralArea Map](../001%20Exploring%20bn6f%20CentralArea%20Map.md)

Spawned in: [<a name="spawn-entry-f550c2" />^spawn-entry-f550c2](../001%20Exploring%20bn6f%20CentralArea%20Map.md#spawn-entry-f550c2)

# 1 Journal

2025-10-08 Wk 41 Wed - 08:47 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
mgba bn6f.elf -g &; gdb-multiarch bn6f.elf -ex "target remote localhost:2345"

# in gdb

b CentralArea_EnterMapGroup

# breaks on entering Central Area, on screen transition being black

bt

# out
#0  CentralArea_EnterMapGroup () at ./maps/CentralArea/loader.s:4
#1  0x08030a20 in EnterMap_RunMapGroupAsmFunction_8030A00 () at ./asm/asm03_0.s:20692
Backtrace stopped: previous frame identical to this frame (corrupt stack?)
# /out
````

`EnterMap_RunMapGroupAsmFunction_8030A00` is called by `EnterMap`

2025-10-08 Wk 41 Wed - 08:59 +03:00

But what triggered `EnterMap` in this instance?

Recall [<a name="recall-87aae1" />^recall-87aae1](../../../../../functions/entries/2025/002%20startscreen_render_802F544/investigations/000%20What%20writes%20for%20startscreen_render_802F544%20jumptable%3F.md#recall-87aae1) in  [000 What writes for startscreen_render_802F544 jumptable?](../../../../../functions/entries/2025/002%20startscreen_render_802F544/investigations/000%20What%20writes%20for%20startscreen_render_802F544%20jumptable%3F.md)

We had those candidates:

(update)

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
mgba bn6f.elf -g &; gdb-multiarch bn6f.elf -ex "target remote localhost:2345"

# in gdb

b sub_8005360
b sub_811F728
b sub_8004D48
b sub_8005C04
b sub_803578C

# when breaking on entering CentralArea1 from Lan's HP

bt

# out
#0  sub_8005C04 () at ./asm/asm00_1.s:4974
#1  0x080053da in sub_800536E () at ./asm/asm00_1.s:4164
#2  0x080050fc in cbGameState_80050EC () at ./asm/asm00_1.s:3904
Backtrace stopped: previous frame identical to this frame (corrupt stack?)
# /out
````

2025-10-08 Wk 41 Wed - 13:28 +03:00

Reproduced

(/update)

So in this case we're interested in `sub_8005C04`. It triggered `EnterMap` when we entered `CentralArea1`.

Spawn [000 Document fields for S2001c04](../tasks/000%20Document%20fields%20for%20S2001c04.md) <a name="spawn-task-f6b548" />^spawn-task-f6b548

2025-10-08 Wk 41 Wed - 10:36 +03:00

`sub_800536E` calls `map_triggerEnterMapOnWarp_8005C04` , but what triggers `sub_800536E` in this case? It should be `0x10` in `GameStateJumptable` and via `oGameState_SubsystemIndex` (via `cbGameState_80050EC`).

The candidates are:

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
mgba bn6f.elf -g &; gdb-multiarch bn6f.elf -ex "target remote localhost:2345"

# in gdb
b warp_setSubsystemIndexTo0x10AndOthers_8005f00
b sub_8005A50
b sub_8005A28
b sub_8005990
b sub_800596C

# when breaking once on entering CentralArea1 from Lan's HP

bt

# out
#0  warp_setSubsystemIndexTo0x10AndOthers_8005f00 () at ./asm/asm00_1.s:5351
#1  0x080380a0 in CutsceneCmd_warp_cmd_8038040 () at ./asm/map_script_cutscene.s:5172
#2  0x08038544 in RunCutscene () at ./asm/map_script_cutscene.s:5990
Backtrace stopped: previous frame identical to this frame (corrupt stack?)
# /out
````

`sub_8005A50 sub_8005A28 sub_8005990 sub_800596C` are all through the callback `sub_80058D0` and there is documentation there in the jumptable.

2025-10-08 Wk 41 Wed - 11:36 +03:00

`CutsceneCmd_warp_cmd_8038040` itself is called from a jumptable `CutsceneCommandJumptable` processed by `RunCutscene`

So what triggers `CutsceneCmd_warp_cmd_8038040` in this case? This is index `0x140`.

2025-10-08 Wk 41 Wed - 12:00 +03:00

`CutsceneState.inc` has example of constant documentation inline with the struct member with `struct_const` and use of `flags32`

2025-10-08 Wk 41 Wed - 12:18 +03:00

We find ourselves back in `gamestate_8005268` coming from `cutscene_8034BB8` this time.

`gamestate_8005268` is at index `0x04` of `GameStateJumptable` via `oGameState_SubsystemIndex` and `cbGameState_80050EC`

`gamestate_8005268` is triggered by `EnterMap`.

2025-10-08 Wk 41 Wed - 12:35 +03:00

Let's try to capture where we are so far.

Breaking on entering `CentralArea1` from `Lan's HP`, but also mixing Warp on jack in to `Lan's HP`:

* `CentralArea_EnterMapGroup`
  * (called_by) `EnterMap_RunMapGroupAsmFunction_8030A00`
    * (called_by) `EnterMap`
      * (triggered_by) `map_triggerEnterMapOnWarp_8005C04`
        * (called_by) `sub_800536E`
          * (triggered_by) `warp_setSubsystemIndexTo0x10AndOthers_8005f00`
            * (called_by) `CutsceneCmd_warp_cmd_8038040`
              * (dispatched_by) `RunCutscene`
                * (called_by) `cutscene_8034BB8`
                  * (called_by) `gamestate_8005268`
                    * (triggered_by) `EnterMap`

It's a cycle. `EnterMap` is triggered by `map_triggerEnterMapOnWarp_8005C04`which is eventually triggered by `EnterMap`

2025-10-08 Wk 41 Wed - 13:12 +03:00

But yet by breakpoint, we know that on entering `CentralArea1` from `Lan's HP`, `EnterMap` is only called once with backtrace

````
#0  EnterMap () at ./asm/asm00_1.s:3932
#1  0x080050fc in cbGameState_80050EC () at ./asm/asm00_1.s:3904
Backtrace stopped: previous frame identical to this frame (corrupt stack?)
````

We were mixing two events, jack in and going to `CentralArea1`. Let's trace only for `CentralArea1`:

2025-10-08 Wk 41 Wed - 13:37 +03:00

`cutscene_8034BB8` is called constantly, likely on every frame while in `Lan's HP`.

````
#0  cutscene_8034BB8 () at ./asm/asm03_1_0.s:1658
#1  0x08005272 in gamestate_8005268 () at ./asm/asm00_1.s:4039
#2  0x080050fc in cbGameState_80050EC () at ./asm/asm00_1.s:3905
Backtrace stopped: previous frame identical to this frame (corrupt stack?)
````

Likewise with `gamestate_8005268`

2025-10-08 Wk 41 Wed - 13:41 +03:00

So we can't know if `gamestate_on_update_8005268` runs only on entering `CentralArea1` from `Lan's HP`.

This is as far as we go until we figure out how `CutsceneCmd_warp_cmd_8038040` is triggered. What script is loaded?

* `CentralArea_EnterMapGroup`
  * (called_by) `EnterMap_RunMapGroupAsmFunction_8030A00`
    * (called_by) `EnterMap`
      * (dispatched_by) `cbGameState_80050EC`
      * (triggered_by) `map_triggerEnterMapOnWarp_8005C04`
        * (called_by) `sub_800536E`
          * (triggered_by) `warp_setSubsystemIndexTo0x10AndOthers_8005f00`
            * (called_by) `CutsceneCmd_warp_cmd_8038040`
              * (dispatched_by) `RunCutscene`
              * (script_started_by) `sub_80059B4`
                * (dispatched_by) `sub_80058D0`
                  * (called_by) `gamestate_on_map_update_8005268`

2025-10-08 Wk 41 Wed - 14:02 +03:00

In `gamestate_on_update_8005268` (calls) $\to$ `cutscene_8034BB8` (calls) $\to$ `IsCutsceneScriptNonNull`,

Let's check `oCutsceneState_CutsceneScriptPos` on `RunCutscene` when breaking on entering `CentralArea1` from `Lan's HP`

````sh
# in CutsceneState.inc
ptr CutsceneScriptPos // loc=0x1c
	struct_const CUTSCENE_SCRIPT_UNK_MAGIC_SCRIPT_VALUE_0x1, 0x1
	
# in ewram.s
eCutsceneState:: // 0x2011c50
	cutscene_state_struct eCutsceneState
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
mgba bn6f.elf -g &; gdb-multiarch bn6f.elf -ex "target remote localhost:2345"

b RunCutscene

# when breaking once on entering CentralArea1 from Lan's HP

x/1wx 0x2011c50+0x1c

# out
0x2011c6c:      0x08098a02
# /out
````

This is `CutsceneScript_8098a02` which is set by `sub_80059B4`.

````C
// in fn sub_80059B4
ldr r0, off_8005A78 // =CutsceneScript_8098a02
mov r1, #0
bl StartCutscene
````

````
# in /home/lan/src/cloned/gh/dism-exe/bn6f
mgba bn6f.elf -g &; gdb-multiarch bn6f.elf -ex "target remote localhost:2345"

b sub_80059B4

# breaks before any screen fade in Lan's HP as MegaMan's feet touches the pink portal

# out
#0  sub_80059B4 () at ./asm/asm00_1.s:4760
#1  0x0800593c in sub_80058D0 () at ./asm/asm00_1.s:4685
Backtrace stopped: previous frame identical to this frame (corrupt stack?)
# /out
````

2025-10-08 Wk 41 Wed - 14:25 +03:00

Again we return to `gamestate_on_map_update_8005268`.

2025-10-08 Wk 41 Wed - 14:37 +03:00

So the reason why we have the cycle, is because `EnterMap` triggers the update loop `gamestate_on_map_update_8005268`, which on some events (like stepping on a pink warp) which triggers `sub_800536E` which calls `map_triggerEnterMapOnWarp_8005C04` which triggers `EnterMap` at a much later time to start a new map.

We can't trace back to a main from this, because that would assume that there's a call hierarchy within a single frame, but this happens later arbitrarily at some other frame.

2025-10-08 Wk 41 Wed - 15:04 +03:00

Disabling the `StartCutscene` in `sub_80059B4` causes only the warps in `Lan's HP` to deactivate, and not in other places! Though I've only tried RoboDogComp

2025-10-08 Wk 41 Wed - 15:10 +03:00

To trace `sub_80059B4`, we need to know how it is triggered. It is dispatched by `sub_80058D0` but this is structurally incomplete:

````sh
// in fn sub_80058D0
ldrb r0, [r2,#oWarpData_warpType_02]
ldr r1, off_8005944 // =JumpTable8005948
ldr r0, [r0,r1]
````

Since we don't detect writes on `oWarpData_warpType_02`.  This is data being fetched through `oWarp2011bb0_WarpDataPtr`.

2025-10-08 Wk 41 Wed - 15:16 +03:00

Since we know `sub_80058D0` dispatches `sub_80059B4`,  we can find out the `WarpData` pointer at `r2` by breaking on `sub_80059B4` when going to pink portal in Lan's HP.

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
mgba bn6f.elf -g &; gdb-multiarch bn6f.elf -ex "target remote localhost:2345"

b sub_80059B4

# breaks when stepping into pink portal in Lan's HP

info reg

# out
r0             0x80059b5           134240693
r1             0x8005948           134240584
r2             0x806c024           134660132
r3             0x2001f66           33562470
r4             0x10                16
r5             0x2001b80           33561472
r6             0x4                 4
r7             0x4                 4
r8             0x1                 1
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x421               1057
sp             0x3007de0           0x3007de0
lr             0x800593c           134240572
pc             0x80059b4           0x80059b4 <sub_80059B4>
cpsr           0x3f                63
# /out

````

The closest is `r2`'s value of `0x806c024` is `byte_806C014` which is referenced by `off_806BFF8`  which is referenced by `HomePages_EnterMapGroup`.

`HomePages_EnterMapGroup` is dispatched through `EnterMap_InternetMapGroupJumptable` via `EnterMap_RunMapGroupAsmFunction_8030A00` just like `CentralArea_EnterMapGroup` that we started with.

2025-10-11 Wk 41 Sat - 07:00 +03:00

Not sure if `LoadBGAnimData` is an example of polymorphism in bn6f, where `$r5` is casted. It might be just that references to `BGAnimData` is stored in structs

2025-10-11 Wk 41 Sat - 07:34 +03:00

`sub_80059B4` looks like it loads cutscene scripts for home pages

2025-10-11 Wk 41 Sat - 07:43 +03:00

Lots of map scripts to be found in `MapScriptCommandJumptable` which is used by `RunSecondaryContinuousMapScript`, `RunContinuousMapScript`, `StoreMapScriptsThenRunOnInitMapScript`

2025-10-11 Wk 41 Sat - 08:19 +03:00

What's

````
// in fn sub_8003BA2
add r5, #0xc8
````

I can see `$r5` is supposed to be a `overworld_player_object_struct` which starts with `object_header_struct`

````C
// in include/structs/OverworldPlayerObject.inc
u0 Size // loc=0xc8
````

Ok

````diff
// in fn sub_8003BA2
-add r5, #0xc8
+add r5, #oOWPlayerObject_Size
````

2025-10-11 Wk 41 Sat - 08:24 +03:00

````
// in fn sub_8003BA2
mov r1, #1
ldrb r0, [r5]
````

This interacts with the object header, and those are flags!

2025-10-11 Wk 41 Sat - 09:02 +03:00

````C
// in fn TryUpdateEachOverworldNPCObject_800461E
// branch if !OBJECT_FLAG_PAUSE_UPDATE
mov r1, #OBJECT_FLAG_PAUSE_UPDATE
tst r0, r1
beq .endcheck_8004662
````

Why would it do this? This avoids the callback, so I would think that it would do a `bne` to avoid it if pause is set

2025-10-11 Wk 41 Sat - 09:32 +03:00

Spawn [001 Create Struct S2011E30 used in dispatch_80339CC](../tasks/001%20Create%20Struct%20S2011E30%20used%20in%20dispatch_80339CC.md) <a name="spawn-task-aec1e0" />^spawn-task-aec1e0

2025-10-11 Wk 41 Sat - 10:38 +03:00

Spawn [002 Find what triggers via dispatch_80339CC](../tasks/002%20Find%20what%20triggers%20via%20dispatch_80339CC.md) <a name="spawn-task-84f66e" />^spawn-task-84f66e

2025-10-15 Wk 42 Wed - 04:50 +03:00

Let's sweep triggers

````C
// in /home/lan/src/cloned/gh/LanHikari22/branches/bn6f-modding@expt000_code_on_command_s/modding.s
  thumb_func_start modding_on_command
modding_on_command:
  push {lr}

  mov r0, #{sweep}
  strb r0, [r5,#oGameState_SubsystemIndex]

  pop {pc}
  .pool
  thumb_func_end modding_on_command
````

2025-10-15 Wk 42 Wed - 06:12 +03:00

````C
// in /home/lan/src/cloned/gh/LanHikari22/branches/bn6f-modding@expt001_sweep_on_command_s/modding.s
  thumb_func_start modding_on_command
modding_on_command:
  push {lr}

  ldr r0, =g_modding_sweep_counter
  ldrb r2, [r0]

  mov r5, r10
  ldr r5, [r5,#oToolkit_GameStatePtr]

  mov r0, r2
  strb r0, [r5,#oGameState_SubsystemIndex]

  // Increment the counter
  ldr r0, =g_modding_sweep_counter
  ldrb r1, [r0]
  add r1, r1, #1
  strb r1, [r0]

  pop {pc}
  .pool
  thumb_func_end modding_on_command
````

Yeah sweeping this just crashes the game after map glitches for `EnterMap (0)`.

2025-10-15 Wk 42 Wed - 07:45 +03:00

`02001C1C` has a rapid counter, which is written by `CapIncrementGameTimeFrames` as discovered through watch in

````
str r0, [r3,#oS2001c04_GameTimeFrames]
````

2025-10-15 Wk 42 Wed - 08:49 +03:00

````C
off_804E738: // (*const MapObjectSpawnData)[5]
	// <endpool>
	.word CentralTownObjectSpawns // MapObjectSpawnData[15]
	.word LansHouseObjectSpawns // MapObjectSpawnData[4]
	.word LansRoomObjectSpawns // MapObjectSpawnData[0]
	.word BathroomObjectSpawns // MapObjectSpawnData[0]
	.word AsterLandObjectSpawns // MapObjectSpawnData[4]
````

So `5` here has a real meaning, this is how many rooms there are in this map group.

we can update `constants/enums/GameAreas.inc` with

````
.equiv CENTRAL_TOWN_NUM_ROOMS, 5
````

And do so for the rest

2025-10-15 Wk 42 Wed - 09:01 +03:00

Will call it `NUM_ROOMS` instead of `NUM_AREAS` to not confuse it with the concept of Areas from the game. Or since we're calling them maps, `NUM_MAPS`

2025-10-15 Wk 42 Wed - 09:20 +03:00

Added guards to `tools/doc_scripts/replacesig_data.sh` to not just remove data in case of `label: .word {another_label}`

2025-10-15 Wk 42 Wed - 10:10 +03:00

![Pasted image 20251015101001.png](../../../../../../../../attachments/Pasted%20image%2020251015101001.png)

When disabling `initMapTilesState_803037c` in `CentralTown_EnterMapGroup`

This is after leaving from CentralArea, starting the game there causes a crash and messed up sound noise

2025-10-15 Wk 42 Wed - 11:03 +03:00

Spawn [000 Look into RunContinuousMapScript with relation to CentralArea](../investigations/000%20Look%20into%20RunContinuousMapScript%20with%20relation%20to%20CentralArea.md) <a name="spawn-invst-4c4475" />^spawn-invst-4c4475

2025-10-15 Wk 42 Wed - 13:58 +03:00

For `CutsceneScript`,  they pass through `StartCutscene`

`byte_80990B8` is a popular cutscene, used in a bunch of internet areas

`chatbox_selectCompTextByMap_80407C8` might have some invariant to avoid dereferencing null, a selective set of maps?

2025-10-15 Wk 42 Wed - 15:25 +03:00

Spawn [001 Look into NPCScript loading](../investigations/001%20Look%20into%20NPCScript%20loading.md) <a name="spawn-invst-762452" />^spawn-invst-762452

2025-10-16 Wk 42 Thu - 06:32 +03:00

`CutsceneScript_80991F4` references `RunLMessageTextScript`

* [ ] Cutscene list in in `dword_8143B1C`, and it's incomplete!

````C
dword_8143B1C: 
  .word 0x8092C78
	.word byte_8092A98
````

[002 Suspicious pointers encountered during CentralArea Map Exploring](002%20Suspicious%20pointers%20encountered%20during%20CentralArea%20Map%20Exploring.md)

2025-10-16 Wk 42 Thu - 07:02 +03:00

* [ ] Check if assembly

Might be assembly:

````
// in data/dat26.s
	.byte 0x0, 0x40, 0xF5, 0x80, 0xF7, 0x0, 0xFC, 0x8, 0x3F, 0x0, 0x6
	.byte 0x2, 0xFF, 0x1E, 0x27, 0xFF, 0xC, 0x8, 0x7, 0x3E, 0xC8, 0xAB
	.byte 0x7C, 0x88, 0x54, 0x0, 0xDC, 0x24, 0x9, 0x8, 0x4A, 0x2, 0xCC
	.byte 0xD3, 0x5, 0x8, 0x3F, 0x34, 0x3F, 0x1C, 0x2, 0xFF, 0x1E, 0x27
	.byte 0xFF, 0x8, 0x8, 0x7, 0x14, 0x65, 0x25, 0x9, 0x8, 0x2, 0xFF
	.byte 0x1E, 0x3A, 0xFF, 0x0, 0x4, 0x80, 0x2, 0xFF, 0x3C, 0x14, 0x0
````

2025-10-16 Wk 42 Thu - 07:07 +03:00

* [ ] Bad pointer arithmetic

````
dword_8089128: 
  .word 0x4B06003F
	.word byte_8089130+0x11
````

````
byte_80893CC: // CutsceneScript
  .byte 0x3F, 0x0, 0x6, 0x2, 0xFF, 0x1E, 0x27, 0xFF, 0xC, 0x8, 0x7, 0x4B
	.word byte_80893DC+0x19
````

````
	ldr r0, off_808713C // =byte_8086678+32 
loc_8087130:
	bl StartCutscene // (script: *const CutsceneScript, param: u32) -> ()
````

2025-10-16 Wk 42 Thu - 07:24 +03:00

`sub_8086FD8`, `sub_808FE74`, `sub_808CB0C` start cutscenes generally

2025-10-17 Wk 42 Fri - 07:52 +03:00

There is also `include/bytecode/cutscene_camera_script.inc`. ~~The jump table for those commands is at~~ Seems to be used by commands in `MapScriptCommandJumptable`

A Jumptable for cutscene camera scripts is at `CutsceneCameraCommandJumptable` but it doesn't seem to cover everything. The general one for cutscenes is at `CutsceneCommandJumptable` and used by `RunCutsceneCameraCommand` which itself is used only by `RunCutscene`.

The cutscene camera scripts are loaded from `oCutsceneState_CutsceneCameraScriptPtr` in `RunCutscene`.

That address itself gets set by `CutsceneCmd_run_or_stop_cutscene_camera_script` (`0x54 0x0 ptr32`).

2025-10-17 Wk 42 Fri - 08:26 +03:00

Some notes on things lucky said

Lucky said a lot of things about cutscenes, which can be found in pret searching `in: mmbn1-6 cutscene`

arm code in asm38.s... It still ends with a bunch of bytes

Lucky put some TREZ documention in [pastebin](https://pastebin.com/raw/Segtfz9M) for cutscene commands

So it was thought that big obstacles to ROM shifting are bytecode dumping, fake pointers, and whatever remains as non-disassembled code.

bulk data: dat38 and above, focus on dat03-dat27 and end of asm03_2 to asm27

2025-10-19 Wk 42 Sun - 08:55 +03:00

Spawn [003 Find how general cutscene functions encode cutscenes](../tasks/003%20Find%20how%20general%20cutscene%20functions%20encode%20cutscenes.md) <a name="spawn-task-2fab74" />^spawn-task-2fab74
