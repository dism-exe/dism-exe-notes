---
parent: "[[001 Exploring bn6f CentralArea Map]]"
spawned_by: "[[001 Exploring bn6f CentralArea Map]]"
context_type: entry
---

Parent: [[001 Exploring bn6f CentralArea Map]]

Spawned by: [[001 Exploring bn6f CentralArea Map]]

Spawned in: [[001 Exploring bn6f CentralArea Map#^spawn-entry-f550c2|^spawn-entry-f550c2]]

# 1 Journal

2025-10-08 Wk 41 Wed - 08:47 +03:00

```sh
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
```

`EnterMap_RunMapGroupAsmFunction_8030A00` is called by `EnterMap`

2025-10-08 Wk 41 Wed - 08:59 +03:00

But what triggered `EnterMap` in this instance?

Recall [[000 What writes for startscreen_render_802F544 jumptable?#^recall-87aae1|^recall-87aae1]] in  [[000 What writes for startscreen_render_802F544 jumptable?]]

We had those candidates:

(update)

```sh
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
```

2025-10-08 Wk 41 Wed - 13:28 +03:00

Reproduced

(/update)

So in this case we're interested in `sub_8005C04`. It triggered `EnterMap` when we entered `CentralArea1`. 

Spawn [[000 Document fields for S2001c04]] ^spawn-task-f6b548

2025-10-08 Wk 41 Wed - 10:36 +03:00

`sub_800536E` calls `map_triggerEnterMapOnWarp_8005C04` , but what triggers `sub_800536E` in this case? It should be `0x10` in `GameStateJumptable` and via `oGameState_SubsystemIndex` (via `cbGameState_80050EC`). 

The candidates are:

```sh
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
```


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

- `CentralArea_EnterMapGroup`
	- (called_by) `EnterMap_RunMapGroupAsmFunction_8030A00`
		- (called_by) `EnterMap`
			- (triggered_by) `map_triggerEnterMapOnWarp_8005C04`
				- (called_by) `sub_800536E`
					- (triggered_by) `warp_setSubsystemIndexTo0x10AndOthers_8005f00`
						- (called_by) `CutsceneCmd_warp_cmd_8038040`
							- (dispatched_by) `RunCutscene`
								- (called_by) `cutscene_8034BB8`
									- (called_by) `gamestate_8005268`
										- (triggered_by) `EnterMap`


It's a cycle. `EnterMap` is triggered by `map_triggerEnterMapOnWarp_8005C04`which is eventually triggered by `EnterMap`

2025-10-08 Wk 41 Wed - 13:12 +03:00

But yet by breakpoint, we know that on entering `CentralArea1` from `Lan's HP`, `EnterMap` is only called once with backtrace

```
#0  EnterMap () at ./asm/asm00_1.s:3932
#1  0x080050fc in cbGameState_80050EC () at ./asm/asm00_1.s:3904
Backtrace stopped: previous frame identical to this frame (corrupt stack?)
```

We were mixing two events, jack in and going to `CentralArea1`. Let's trace only for `CentralArea1`:

2025-10-08 Wk 41 Wed - 13:37 +03:00

`cutscene_8034BB8` is called constantly, likely on every frame while in `Lan's HP`. 

```
#0  cutscene_8034BB8 () at ./asm/asm03_1_0.s:1658
#1  0x08005272 in gamestate_8005268 () at ./asm/asm00_1.s:4039
#2  0x080050fc in cbGameState_80050EC () at ./asm/asm00_1.s:3905
Backtrace stopped: previous frame identical to this frame (corrupt stack?)
```

Likewise with `gamestate_8005268`

2025-10-08 Wk 41 Wed - 13:41 +03:00

So we can't know if `gamestate_on_update_8005268` runs only on entering `CentralArea1` from `Lan's HP`. 

This is as far as we go until we figure out how `CutsceneCmd_warp_cmd_8038040` is triggered. What script is loaded?

- `CentralArea_EnterMapGroup`
	- (called_by) `EnterMap_RunMapGroupAsmFunction_8030A00`
		- (called_by) `EnterMap`
			- (dispatched_by) `cbGameState_80050EC`
			- (triggered_by) `map_triggerEnterMapOnWarp_8005C04`
				- (called_by) `sub_800536E`
					- (triggered_by) `warp_setSubsystemIndexTo0x10AndOthers_8005f00`
						- (called_by) `CutsceneCmd_warp_cmd_8038040`
							- (dispatched_by) `RunCutscene`
							- (script_started_by) `sub_80059B4`
								- (dispatched_by) `sub_80058D0`
									- (called_by) `gamestate_on_map_update_8005268`

2025-10-08 Wk 41 Wed - 14:02 +03:00

In `gamestate_on_update_8005268` (calls) $\to$ `cutscene_8034BB8` (calls) $\to$ `IsCutsceneScriptNonNull`, 

Let's check `oCutsceneState_CutsceneScriptPos` on `RunCutscene` when breaking on entering `CentralArea1` from `Lan's HP`

```sh
# in CutsceneState.inc
ptr CutsceneScriptPos // loc=0x1c
	struct_const CUTSCENE_SCRIPT_UNK_MAGIC_SCRIPT_VALUE_0x1, 0x1
	
# in ewram.s
eCutsceneState:: // 0x2011c50
	cutscene_state_struct eCutsceneState
```

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
mgba bn6f.elf -g &; gdb-multiarch bn6f.elf -ex "target remote localhost:2345"

b RunCutscene

# when breaking once on entering CentralArea1 from Lan's HP

x/1wx 0x2011c50+0x1c

# out
0x2011c6c:      0x08098a02
# /out
```

This is `CutsceneScript_8098a02` which is set by `sub_80059B4`.

```C
// in fn sub_80059B4
ldr r0, off_8005A78 // =CutsceneScript_8098a02
mov r1, #0
bl StartCutscene
```

```
# in /home/lan/src/cloned/gh/dism-exe/bn6f
mgba bn6f.elf -g &; gdb-multiarch bn6f.elf -ex "target remote localhost:2345"

b sub_80059B4

# breaks before any screen fade in Lan's HP as MegaMan's feet touches the pink portal

# out
#0  sub_80059B4 () at ./asm/asm00_1.s:4760
#1  0x0800593c in sub_80058D0 () at ./asm/asm00_1.s:4685
Backtrace stopped: previous frame identical to this frame (corrupt stack?)
# /out
```

2025-10-08 Wk 41 Wed - 14:25 +03:00

Again we return to `gamestate_on_map_update_8005268`. 

2025-10-08 Wk 41 Wed - 14:37 +03:00

So the reason why we have the cycle, is because `EnterMap` triggers the update loop `gamestate_on_map_update_8005268`, which on some events (like stepping on a pink warp) which triggers `sub_800536E` which calls `map_triggerEnterMapOnWarp_8005C04` which triggers `EnterMap` at a much later time to start a new map.

We can't trace back to a main from this, because that would assume that there's a call hierarchy within a single frame, but this happens later arbitrarily at some other frame.

2025-10-08 Wk 41 Wed - 15:04 +03:00

Disabling the `StartCutscene` in `sub_80059B4` causes only the warps in `Lan's HP` to deactivate, and not in other places! Though I've only tried RoboDogComp

2025-10-08 Wk 41 Wed - 15:10 +03:00

To trace `sub_80059B4`, we need to know how it is triggered. It is dispatched by `sub_80058D0` but this is structurally incomplete:

```sh
// in fn sub_80058D0
ldrb r0, [r2,#oWarpData_warpType_02]
ldr r1, off_8005944 // =JumpTable8005948
ldr r0, [r0,r1]
```

Since we don't detect writes on `oWarpData_warpType_02`.  This is data being fetched through `oWarp2011bb0_WarpDataPtr`. 

2025-10-08 Wk 41 Wed - 15:16 +03:00

Since we know `sub_80058D0` dispatches `sub_80059B4`,  we can find out the `WarpData` pointer at `r2` by breaking on `sub_80059B4` when going to pink portal in Lan's HP.

```sh
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

```

The closest is `r2`'s value of `0x806c024` is `byte_806C014` which is referenced by `off_806BFF8`  which is referenced by `HomePages_EnterMapGroup`.

`HomePages_EnterMapGroup` is dispatched through `EnterMap_InternetMapGroupJumptable` via `EnterMap_RunMapGroupAsmFunction_8030A00` just like `CentralArea_EnterMapGroup` that we started with.

	