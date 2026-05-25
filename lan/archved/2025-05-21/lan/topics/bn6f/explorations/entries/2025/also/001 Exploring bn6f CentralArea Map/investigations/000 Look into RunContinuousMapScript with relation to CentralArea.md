---
parent: "[[001 Exploring bn6f CentralArea Map]]"
spawned_by: "[[000 Wk 41 Exploring bn6f CentralArea Map]]"
context_type: investigation
status: todo
---

Parent: [[001 Exploring bn6f CentralArea Map]]

Spawned by: [[000 Wk 41 Exploring bn6f CentralArea Map]]

Spawned in: [[000 Wk 41 Exploring bn6f CentralArea Map#^spawn-invst-4c4475|^spawn-invst-4c4475]]

# 1 Journal

2025-10-15 Wk 42 Wed - 11:03 +03:00

- `RunContinuousMapScript`
	- (called_by) `cutscene_8034BB8`
		- (called_by) `gamestate_OnMapUpdate_8005268`
			- (triggered_by) `EnterMap`
			- (dispatched_by) `cbGameState_80050EC`
				- (dispatched_by) `main_`

2025-10-15 Wk 42 Wed - 11:09 +03:00

`RunContinuousMapScript` runs based on the state in `eMapScriptState`

`eMapScriptState` is initialized by `StoreMapScriptsThenRunOnInitMapScript`

2025-10-15 Wk 42 Wed - 11:14 +03:00

- `StoreMapScriptsThenRunOnInitMapScript`
	- (called_by) `map_8034B4C`
	- (called_by) `EnterMap`

So we're interested in `RealWorldMapScriptPointers` and `InternetMapScriptPointers` referenced by `map_8034B4C`

We created

```C
// in GameAreas.inc
  .equiv REAL_WORLD_NUM_GROUPS, 7
  .equiv INTERNET_NUM_GROUPS, 20
```

Because we expect the types

```sh
tools/doc_scripts/replacesig_data.sh "RealWorldMapScriptPointers" "(* const ?)[2][REAL_WORLD_NUM_GROUPS]"
tools/doc_scripts/replacesig_data.sh "InternetMapScriptPointers" "(* const ?)[2][INTERNET_NUM_GROUPS]"
```

After the `[2]` it indexes by the map number:

```sh
tools/doc_scripts/replacesig_data.sh "RealWorldMapScriptPointers" "(* const MapScript)[][2][REAL_WORLD_NUM_GROUPS]"
tools/doc_scripts/replacesig_data.sh "InternetMapScriptPointers" "(* const MapScript)[][2][INTERNET_NUM_GROUPS]"
```

Our assumption seems correct for `REAL_WORLD_NUM_GROUPS` but `InternetMapScriptPointers` counts 23 and not 20. Let's take that as the ground of truth and update.

Counting again in `GameAreas`, it *is* 23. But I missed some `new_group` put on the same spacing.

2025-10-15 Wk 42 Wed - 12:22 +03:00

Okay, we get the idea with `MapScriptOnInitCentralTown_804EA28` and got OK on some partial dumping:

```C
MapScriptOnInitCentralTown_804EA28:: // MapScript
  ms_set_event_flag byte1=0xFF hword2=0x16D0
  ms_jump_if_flag_clear byte1=0xFF hword2=0x0A9B destination4=byte_804EA41
	.byte 0x38, 0x1, 0xC7, 0x4, 0x8, 0x1D, 0xC7, 0x4, 0x8, 0x0, 0x0, 0x0, 0x0
```

Now let's automate this. Let's create a binary `dump_mapscript` in [gh bn_repo_editor](https://github.com/LanHikari22/bn_repo_editor). Given a single address, it should have enough information to know the size (until next label or dump error) 

See [[004 Impl dumping for map npc and cutscene scripts]] ^refer-2e12fe