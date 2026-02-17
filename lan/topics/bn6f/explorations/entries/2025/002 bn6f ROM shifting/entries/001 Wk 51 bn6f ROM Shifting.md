---
parent: "[[002 bn6f ROM shifting]]"
spawned_by: "[[002 bn6f ROM shifting]]"
context_type: entry
---

Parent: [[002 bn6f ROM shifting]]

Spawned by: [[002 bn6f ROM shifting]]

Spawned in: [[002 bn6f ROM shifting#^spawn-entry-d9fef0|^spawn-entry-d9fef0]]

# 1 Journal

2025-12-17 Wk 51 Wed - 09:45 +03:00

We finished trace dumping map scripts, so we shouldn't crash due to shifting problems related to them: [[006 Dump scripts via script tracing]]

Let's trace any abnormalities after introducing some shifts:

```C
// in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
// in fn main_
main_gameRoutine:
  add r0, r0, #0
  add r0, r0, #0
  add r0, r0, #0
  add r0, r0, #0
  add r0, r0, #0
  add r0, r0, #0
  add r0, r0, #0
  add r0, r0, #0
  add r0, r0, #0
  add r0, r0, #0
```

*shift 1*

2025-12-17 Wk 51 Wed - 11:52 +03:00

We can also make the shift much more dramatic with this at the start of `main.s`:

```
  .incbin "data/compressed/CompCapcomLogoTilemap_86C3E94.lz77"
  .incbin "data/compressed/CompCapcomLogoTilemap_86C3E94.lz77"
  .incbin "data/compressed/CompCapcomLogoTilemap_86C3E94.lz77"
  .incbin "data/compressed/CompCapcomLogoTilemap_86C3E94.lz77"
  .incbin "data/compressed/CompCapcomLogoTilemap_86C3E94.lz77"
  .incbin "data/compressed/CompCapcomLogoTilemap_86C3E94.lz77"
```

*shift 2*

2025-12-17 Wk 51 Wed - 12:00 +03:00

We can also place this at different labels in `rom.s` to show if we reproduce the problems
# 2 Detected problems

**(crashes)**

2025-12-25 Wk 52 Thu - 15:33 +03:00

- [ ] Resolved

From `6d547b86`: 
- Reproduces with shift 2 added at:  `main`
- Does not reproduce with shift 2 added at: 
- Cannot test with shift 2 added at: 

Moving around and starting a battle in Central Area 1 causes a crash.


Spawn [[005 Look into shift test crash when fighting in central area 1 commit 6d547b86]] ^spawn-invst-63eeeb



2025-12-17 Wk 51 Wed - 09:50 +03:00

- [ ] Resolved

From `4b9ac0bd`:
- Reproduces with shift 2 added at:  `dat21`, `after dat37.s`, 
- Does not reproduce with shift 2 added at: 
	- `main`, `dat21`,  (It freezes instead)
- Cannot test with shift 2 added at: 

Attempting to jack in causes a crash

Spawn [[001 Investigate jacking in causing crash due to jump to invalid address]] ^spawn-invst-94bd41

2025-12-17 Wk 51 Wed - 10:08 +03:00

- [ ] Resolved

From `4b9ac0bd`:
- Reproduces with shift 2 added at: `main_`, 
- Does not reproduce with shift 2 added at: 
- Cannot test with shift 2 added at: 
	- `dat21` (freeze at load in CentralArea) , 
	- `after dat37.s` (freeze at load in CentralArea 1 or any internet map)

Game crashes when entering a random virus encounter in CentralArea 1, but only after all viruses successfully spawn.

2025-12-17 Wk 51 Wed - 13:13 +03:00

- [ ] Resolved

From `4b9ac0bd`:
- Reproduces with shift 2 added at: `main_`, 
- Does not reproduce with shift 2 added at: `after dat37.s`, 
- Cannot test with shift 2 added at: 
	- `dat21` (freeze when instructed to press R to jack in to Robodog)

Game crashes when starting tutorial robo dog battles.


2025-12-17 Wk 51 Wed - 09:54 +03:00

- [ ] Resolved

From `4b9ac0bd`:
- Reproduces with shift 2 added at: `main_`, `dat21`
- Does not reproduce with shift 2 added at: `after dat37.s`,
- Cannot test with shift 2 added at:

Trying to leave the house at the start of the game without talking to parents leads to crash

Spawn [[002 Investigate game crashing start of game when trying to leave house before talking to parents]] ^spawn-invst-2e9444

2025-12-17 Wk 51 Wed - 12:48 +03:00

- [ ] Resolved

From `4b9ac0bd`:
- Reproduces with shift 2 added at: `dat21`
- Does not reproduce with shift 2 added at: `main_`,  `after dat37.s`, 
- Cannot test with shift 2 added at: 

Starting the game, interact with any object in Lan's Room will lead to a crash.

2025-12-17 Wk 51 Wed - 12:40 +03:00

From `4b9ac0bd`:
- Reproduces with shift added at: `dat21`, 
- Does not reproduce with shift 2 added at: `main_`, 
	- `after dat37.s` (it freezes instead. See entry 09:57.)
- Cannot test with shift 2 added at:

Load game at Cental Area 1 leads to crash

**(/crashes)**

**(freezes)**

2025-12-17 Wk 51 Wed - 09:57 +03:00

- [ ] Resolved

From `4b9ac0bd`:
- Reproduces with shift 2 added at: `main_`, 
- Does not reproduce with shift 2 added at: `after dat37.s`, 
	- `dat21` (leads to crash instead. See entry 12:40),
- Cannot test with shift 2 added at:

Starting the game, interact with any object in Lan's Room. Lan will then be stuck in place and unable to move.

2025-12-17 Wk 51 Wed - 10:04 +03:00

- [ ] Resolved

From `4b9ac0bd`:
- Reproduces with shift 2 added at: `main_`
- Does not reproduce with shift 2 added at: `dat21`, `after dat37.s`, 
- Cannot test with shift 2 added at:

Game freezes after L message but no crash message just no interaction.

2025-12-17 Wk 51 Wed - 10:06 +03:00

- [ ] Resolved 

From `4b9ac0bd`:
- Reproduces with shift added at: `main_`
- Does not reproduce with shift 2 added at: 
- Cannot test with shift 2 added at:
	- `dat21` (can't make it to internet)
	- `after dat37.s` (freezes in Lan's HP as per entry 12:59)

Game freezes when moving from Lan's HP to CentralArea, MegaMan never spawns, Background continues animating.

2025-12-17 Wk 51 Wed - 12:14 +03:00

- [ ] Resolved

From `4b9ac0bd`:
- Reproduces with shift added at: `dat21`
- Does not reproduce with shift 2 added at: `main_`
- Cannot test with shift 2 added at:

Game freezes in first tutorial when instructed to press R to jack in to robo dog

2025-12-17 Wk 51 Wed - 12:59 +03:00

From `4b9ac0bd`:
- Reproduces with shift added at: `after dat37.s`, 
- Does not reproduce with shift 2 added at: `main_`, 
- Cannot test with shift 2 added at: 
	- `dat21` (game crashes as per entry 12:40), 

When loading game to Central Area 1, after a short period, whole game freezes. It can happen in the map, in L message dialog, etc. Music still works.

**(/freezes)**

**(glitchy)**

2025-12-17 Wk 51 Wed - 09:48 +03:00

- [ ] Resolved

From `4b9ac0bd`:
- Reproduces with shift 2 added at: `main_`, `dat21`, 
	- `after dat37.s` (the glitchy region looks different), 
- Does not reproduce with shift 2 added at: 
- Cannot test with shift 2 added at:

Main screen graphics is glitchy

Spawn [[000 Investigate glitchy main menu screen on shift]] ^spawn-invst-063d05

2025-12-17 Wk 51 Wed - 13:04 +03:00

- [ ] Resolved

From `4b9ac0bd`:
- Reproduces with shift 2 added at: `after dat37.s`, 
- Does not reproduce with shift 2 added at: `main_`
- Cannot test with shift 2 added at: 
	- `dat21` (cannot interact to jack in in cutscene as per entry 12:14), 

Robodog background glitchy animating graphics

2025-12-17 Wk 51 Wed - 14:26 +03:00

From `4b9ac0bd`:
- Reproduces with shift 2 added at: `dat21`,
- Does not reproduce with shift 2 added at: 
- Cannot test with shift 2 added at: 

Interacting with the school or the bus portal in Central Town causes a strange cutscene to play with `Lan! Let's pay close attention to what Mom is saying!`  playing multiple times, a white screen fade, and then starting a Bass battle with HP 1800 which plays slowly with lag but otherwise functional.

**(/glitchy)**
