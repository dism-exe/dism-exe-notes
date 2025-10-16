2025-09-27 Wk 39 Sat - 08:27
# 1 Journal

2025-09-25 Wk 39 Thu - 06:15

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
tools/doc_scripts/replacesig.sh "CopyWords" "(src: *const u32, mut_dest: *mut u32, size: u32) -> ()"
tools/doc_scripts/replacesig.sh "CopyByEightWords" "(src: *const u32, mut_dest: *mut u32, size: u32) -> ()"
tools/doc_scripts/replacesig.sh "SWI_CpuFastSet" "(src: *const u32, mut_dest: *mut u32, mode: int) -> ()"
tools/doc_scripts/replacesig.sh "ZeroFillByByte" "(mut_mem: *mut (), num_bytes: usize) -> ()"
tools/doc_scripts/replacesig.sh "ZeroFillByWord" "(mut_mem: *mut (), num_bytes: usize) -> ()"
tools/doc_scripts/replacesig.sh "init_803D1A8" "() -> ()"
tools/doc_scripts/replacesig.sh "SetPrimaryToolkitPointers" "() -> ()"
tools/doc_scripts/replacesig.sh "RandomizeExtraToolkitPointers" "() -> ?"
tools/doc_scripts/replacesig.sh "clear_e201AD04" "() -> ()"
tools/doc_scripts/replacesig.sh "start_800023C" "() -> ()"
tools/doc_scripts/replacesig.sh "SubMenuControl" "() -> ()" 
tools/doc_scripts/replacesig.sh "sub_811FB84" "(a0: u32?, a1: usize) -> u32?"
tools/doc_scripts/replacesig.sh "sub_8123360" "() -> bool"

./replacep.sh "loc_80008B8" "loc_loop_80008B8"
./replacep.sh "loc_803D1AC" "call_803D1AC"
./replacep.sh "sub_803D1A8" "init_803D1A8"
./replacep.sh "isSameSubsystem_800A732" "notSameSubsystem_800A732"
./replacep.sh "main_static_8000454" "main_static_screen_fade_8000454"
./replacep.sh "saveMenu_8132CB8" "saveMenu_config_textscript_8132CB8"
./replacep.sh "sub_802F756" "load_game_802F756"
```

Commited `ddc1c1e3`,

2025-09-27 Wk 39 Sat - 08:27

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f

tools/doc_scripts/replacesig.sh "sub_803F838" "() -> \!zf"
tools/doc_scripts/replacesig.sh "GetTitleScreenIconCount" "() -> (u8, u16)"

./replacep.sh "sub_813D960" "zeroFill_813D960" 
./replacep.sh "loc_8002676" "call_8002676" 
./replacep.sh "sub_8002668" "copy_8002668"
./replacep.sh "sub_800260C" "copy_800260C"
./replacep.sh "sub_803E978" "anim_803E978"
./replacep.sh "anim_803E978" "startScreen_AnimatePressStart_803E978"
./replacep.sh "startScreen_802F574" "startScreen_initGfx_802F574"
```

2025-10-08 Wk 41 Wed - 03:50 +03:00

From [[000 What writes for startscreen_render_802F544 jumptable?]],

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
tools/doc_scripts/symbol_list_replacesig_same.sh "startScreen_initGfx_802F574 ho_802F63C load_game_802F756 startscreen_802F60C" "(self: * StartScreen \$r5) -> ()" tools/doc_scripts/symbol_list_replacesig_same.sh "startScreen_initGfx_802F574" "(self: *mut StartScreen \$r5) -> ()"

./replacep.sh "sub_802F624" "startscreen_render_trigger_802F624"
tools/doc_scripts/replacesig.sh "startscreen_render_trigger_802F624" "(self: *mut StartScreen \$r5) -> ()"

./replac

startscreen_render_trigger_802F624

tools/doc_scripts/replacesig.sh "sub_802F668" "(self: *mut StartScreen \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_802F6A4" "(self: *mut StartScreen \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_802F6B2" "(self: *mut StartScreen \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_802F704" "(self: *mut StartScreen \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_802F710" "(self: *mut StartScreen \$r5) -> ()"

./replacep.sh "sub_80005F2" "music_80005F2" 
tools/doc_scripts/replacesig.sh "music_80005F2" "(bg_music_indicator: u8) -> ()"

./replacep.sh "sub_802FD3C" "copyBGTiles_802FD3C" 
```

2025-10-08 Wk 41 Wed - 04:45 +03:00

Added `ctags -R ewram.s *.s asm/* data/dat* docs/decomp/*.c include/* maps/*` to `./replace.sh`

2025-10-08 Wk 41 Wed - 06:33 +03:00

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
tools/doc_scripts/replacesig.sh "sub_802F8D8" "(self: *mut StartScreen \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_802FC9C" "(self: *const StartScreen \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_802FC70" "(self: *const StartScreen \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_802FB64" "(self: *const StartScreen \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_802FB90" "(self: *const StartScreen \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_802FBB4" "(self: *const StartScreen \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_802FBD8" "(self: *const StartScreen \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_802FBFC" "(self: *const StartScreen \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_802FC28" "(self: *const StartScreen \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_802FC4C" "(self: *const StartScreen \$r5) -> ()"

tools/doc_scripts/replacesig.sh "sub_802FD54" "(self: *mut StartScreen \$r5) -> ()"

./replacep.sh "sub_802FA44" "dead_802FA44"
tools/doc_scripts/replacesig.sh "dead_802FA44" "(self: *const StartScreen? \$r5) -> ()"

./replacep.sh "byte_2011800" "eS2011800"

tools/doc_scripts/replacesig.sh "sub_803D1FC" "(self: *mut S2011800 \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_803D24C" "(self: *mut S2011800 \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_803D274" "(self: *mut S2011800 \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_803D298" "(self: *mut S2011800 \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_803D2A6" "(self: *const S2011800 \$r5) -> ()"


```

Commited `a8ff8d2b`

2025-10-08 Wk 41 Wed - 10:29 +03:00

Added `replacep_rev.sh` for undoing `replacep.sh`. 

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
./replacep.sh "sub_8005C04" "map_triggerEnterMapOnWarp_8005C04"

tools/doc_scripts/replacesig.sh "checkCoordinateTrigger_8031a7a" "(coords: * ?) -> ?" 

tools/doc_scripts/replacesig.sh "sub_800596C" "(self: * GameState \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_8005990" "(self: * GameState \$r5) -> ()" 
tools/doc_scripts/replacesig.sh "sub_80059B4" "(self: * GameState \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_80059D0" "(self: * GameState \$r5) -> ()" 
tools/doc_scripts/replacesig.sh "sub_80059EC" "(self: * GameState \$r5) -> ()" 
tools/doc_scripts/replacesig.sh "sub_8005A00" "(self: * GameState \$r5) -> ()" 
tools/doc_scripts/replacesig.sh "sub_8005A0C" "(self: * GameState \$r5) -> ()" 
tools/doc_scripts/replacesig.sh "sub_8005A28" "(self: * GameState \$r5) -> ()" 
tools/doc_scripts/replacesig.sh "sub_8005A50" "(self: * GameState \$r5) -> ()" 

./replacep.sh "loc_8034C2C" ".ret"

tools/doc_scripts/replacesig.sh "IsCutsceneScriptNonNull" "() -> \!zf"
```

2025-10-08 Wk 41 Wed - 12:09 +03:00

This `IsCutsceneScriptNonNull` does a `tst r0, r0` which does a logical AND check. The zero flag is set IF `r0` 's content is null. The flag is cleared (`!zf`) if it's not null then.

2025-10-08 Wk 41 Wed - 12:17 +03:00

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
./replacep.sh "sub_8034BB8" "cutscene_8034BB8"

tools/doc_scripts/replacesig.sh "EnterMap" "(self: * GameState \$r5) -> ()"
tools/doc_scripts/replacesig.sh "gamestate_8005268" "(self: * GameState \$r5) -> ()"
tools/doc_scripts/replacesig.sh "battle_80052D8" "(self: * GameState \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_8005360" "(self: * GameState \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_800536E" "(self: * GameState \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_80053E4" "(self: * GameState \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_8005462" "(self: * GameState \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_800555A" "(self: * GameState \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_8005642" "(self: * GameState \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_80056B8" "(self: * GameState \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_800572C" "(self: * GameState \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_80057A0" "(self: * GameState \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_80055CE" "(self: * GameState \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_8005814" "(self: * GameState \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_800585A" "(self: * GameState \$r5) -> ()"

./replacep.sh "gamestate_8005268" "gamestate_on_map_update_8005268"
./replacep.sh "off_8005948" "JumpTable8005948"
```

2025-10-08 Wk 41 Wed - 15:37 +03:00

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
git commit -m "doc map update loop and related"

# out
[master 69bd59bb] doc map update loop and related
 14 files changed, 363 insertions(+), 115 deletions(-)
 create mode 100755 replacep_rev.sh
```

```sh
# in /home/lan/src/cloned/gh/dism-exe/dism-exe-notes
git commit

# out
[main 62f5228] notes on map trigger & cutscene tracing
 Date: Wed Oct 8 15:37:10 2025 +0300
 6 files changed, 337 insertions(+), 41 deletions(-)
```

2025-10-11 Wk 41 Sat - 06:51 +03:00

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f

tools/doc_scripts/replacesig.sh "SetRenderInfoLCDControl" "(a_00: u16) -> ()"
tools/doc_scripts/replacesig.sh "GetRenderInfoLCDControl" "() -> u16"
tools/doc_scripts/replacesig.sh "renderInfo_8001788" "() -> ()"
tools/doc_scripts/replacesig.sh "renderInfo_80017A0" "() -> ()"
tools/doc_scripts/replacesig.sh "zeroFillVRAM" "() -> ()"
tools/doc_scripts/replacesig.sh "LoadBGAnimData" "(bg_anim_data: BGAnimData) -> ()"
tools/doc_scripts/replacesig.sh "HomePages_LoadBGAnim" "() -> ()"
tools/doc_scripts/replacesig.sh "initMapTilesState_803037c" "(map_group: u8, map_number: u8) -> ()"
tools/doc_scripts/replacesig.sh "decompressCoordEventData_8030aa4" "(map_group: u8, map_number: u8) -> ()"
tools/doc_scripts/replacesig.sh "camera_802FF4C" "(player_x: u32, player_y: u32, player_z: u32, map_group: u8, map_number: u8) -> ()"
tools/doc_scripts/replacesig.sh "decompAndCopyMapTiles_8030472" "() -> ()"
tools/doc_scripts/replacesig.sh "initUncompSpriteState_80028d4" "(a0: *const ?) -> ()"
tools/doc_scripts/replacesig.sh "uncompSprite_8002906" "(sprite_load_data: *const SpriteLoadData) -> bool"
tools/doc_scripts/replacesig.sh "SWI_LZ77UnCompReadNormalWrite8bit" "(src: *const (), mut_dest: *mut ()) -> ()"
tools/doc_scripts/replacesig.sh "StartCutscene" "(script: *const (), param: u32) -> ()"
tools/doc_scripts/replacesig.sh "PlayMusic" "(song: u8) -> ()"
tools/doc_scripts/replacesig.sh "PlayMapMusic" "() -> ()"
tools/doc_scripts/replacesig.sh "map_8034B4C" "(map_group: u8, map_number: u8) -> ()"
tools/doc_scripts/replacesig.sh "map_8001708" "(map_group: u8, map_number: u8) -> ()"
tools/doc_scripts/replacesig.sh "LoadGFXAnimsForMapGroup" "(map_group: u8, map_number: u8) -> ()"
tools/doc_scripts/replacesig.sh "TestEventFlagFromImmediate" "(event_group_off: u8, byte_and_flag_off: u8) -> \!zf"
tools/doc_scripts/replacesig.sh "ZeroFillObjectInteractionAreas_800378C" "() -> ()"
tools/doc_scripts/replacesig.sh "TryUpdateEachOWPlayerObject_8003BA2" "() -> ()"
tools/doc_scripts/replacesig.sh "TryUpdateEachOverworldNPCObject_800461E" "() -> ()"
tools/doc_scripts/replacesig.sh "TryUpdateEachOverworldMapObject_80048D2" "() -> ()"
tools/doc_scripts/replacesig.sh "sub_809F942" "() -> * nullable ?"
tools/doc_scripts/replacesig.sh "dispatch_80339CC" "() -> ()"

tools/doc_scripts/replacesig.sh "stub_8033A7C" "(self: *const S2011E30 \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_8033A80" "(self: * S2011E30 \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_8033A96" "(self: * S2011E30 \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_8033AB0" "(self: * S2011E30 \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_8033AC4" "(self: * S2011E30 \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_8033ADC" "(self: * S2011E30 \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_8033AF0" "(self: * S2011E30 \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_8033A96" "(self: * S2011E30 \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_8033A96" "(self: * S2011E30 \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_8033A80" "(self: * S2011E30 \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_8033A80" "(self: * S2011E30 \$r5) -> ()"

tools/doc_scripts/replacesig.sh "sub_8033B08" "(self: * S2011E30 \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_8033B0C" "(self: * S2011E30 \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_8033B1E" "(self: * S2011E30 \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_8033B30" "(self: * S2011E30 \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_8033B46" "(self: * S2011E30 \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_8033B5C" "(self: * S2011E30 \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_8033B6E" "(self: * S2011E30 \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_8033B1E" "(self: * S2011E30 \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_8033B1E" "(self: * S2011E30 \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_8033B0C" "(self: * S2011E30 \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_8033B0C" "(self: * S2011E30 \$r5) -> ()"

tools/doc_scripts/replacesig.sh "QueueUnk00GFXTransfer" "(queued_src: *const (), mut_queued_dest: *mut (), queued_size: u32) -> ()"
tools/doc_scripts/replacesig.sh "QueueByteAlignedGFXTransfer" "(queued_src: *const (), mut_queued_dest: *mut (), queued_size: u32) -> ()"
tools/doc_scripts/replacesig.sh "QueueHwordAlignedGFXTransfer" "(queued_src: *const (), mut_queued_dest: *mut (), queued_size: u32) -> ()"
tools/doc_scripts/replacesig.sh "QueueWordAlignedGFXTransfer" "(queued_src: *const (), mut_queued_dest: *mut (), queued_size: u32) -> ()"
tools/doc_scripts/replacesig.sh "QueueEightWordAlignedGFXTransfer" "(queued_src: *const (), mut_queued_dest: *mut (), queued_size: u32) -> ()"
tools/doc_scripts/replacesig.sh "loc_8000ACA" "(queued_src: *const (), mut_queued_dest: *mut (), queued_size: u32, copy_type: int) -> ()"
tools/doc_scripts/replacesig.sh "gfxTransfer_8033DA0" "(a0: u32?) -> ()"
tools/doc_scripts/replacesig.sh "gfxTransfer_8033978" "() -> ()"

./replacep.sh "off_806C394" "JumpTable806C394"
./replacep.sh "camera_802FF4C" "camera_init_802FF4C"
./replacep.sh "sub_800378C" "ZeroFillObjectInteractionAreas_800378C"
./replacep.sh "sub_8003BA2" "TryUpdateEachOWPlayerObject_8003BA2"
./replacep.sh "npc_800461E" "TryUpdateEachOverworldNPCObject_800461E"
./replacep.sh "gamestate_on_map_update_8005268" "gamestate_OnMapUpdate_8005268"
./replacep.sh "sub_80048D2" "TryUpdateEachOverworldMapObject_80048D2"
./replacep.sh "sub_80339CC" "dispatch_80339CC"
./replacep.sh "off_8033A1C" "JumpTable8033A1C"
./replacep.sh "off_8033A4C" "JumpTableInternet8033A4C"
./replacep.sh "unk_2011E30" "S2011E30"
./replacep.sh "sub_8033A7C" "noop_8033A7C"
./replacep.sh "sub_8033978" "gfxTransfer_8033978"
./replacep.sh "sub_8033DA0" "gfxTransfer_8033DA0"
./replacep.sh "sub_8033B08" "noop_8033B08"
./replacep.sh "sub_8033B1E" "onUpdate_8033B1E"
./replacep.sh "sub_8033A96" "onUpdate_8033A96"
```

2025-10-11 Wk 41 Sat - 12:11 +03:00

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
make clean && make -j$(nproc) assets && make -j$(nproc);

# out (relevant)
bn6f.gba: OK
```

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
git commit -m "doc map related functions and structs"

# out
[master 0b30a62f] doc map related functions and structs
 85 files changed, 1398 insertions(+), 1180 deletions(-)
 create mode 100644 include/structs/S2011E30.inc
```

```sh
# in /home/lan/src/cloned/gh/dism-exe/dism-exe-notes
git commit -m "doc map related functions and structs"

# out
[main 44b0874] doc map related functions and structs
 10 files changed, 777 insertions(+), 9 deletions(-)
 create mode 100644 lan/topics/bn6f/explorations/entries/2025/001 Exploring bn6f CentralArea Map/issues/000 TryUpdateEachOverworldMapObject_80048D2.ret_8004920 was not defined within its scope.md
 create mode 100644 lan/topics/bn6f/explorations/entries/2025/001 Exploring bn6f CentralArea Map/tasks/001 Create Struct S2011E30 used in dispatch_80339CC.md
 create mode 100644 lan/topics/bn6f/explorations/entries/2025/001 Exploring bn6f CentralArea Map/tasks/002 Find what triggers via dispatch_80339CC.md
 create mode 100644 scripts/templater/data/lan/daily/2025/Summary-2025-10-11.md
```

2025-10-12 Wk 41 Sun - 06:23 +03:00

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f

./replacep.sh "sub_8033948" "sub_8033948"
./replacep.sh "sub_80010D4" "GetMaxAndCurHPForCurPETNavi_80010D4"
./replacep.sh "oS2011E30_Unk_08" "oS2011E30_CurPETNaviMaxHP"
./replacep.sh "onUpdate_8033B1E" "onUpdateInInternet_8033B1E"
./replacep.sh "onUpdate_8033A96" "onUpdateInRealWorld_8033A96"
./replacep.sh "sub_8033948" "triggerSomeUpdateForInternetOrRealWorld_8033948"


tools/doc_scripts/replacesig.sh "GetCurPETNaviStatsHword" "(which_navi: u8, which_stat: u8) -> u16"
tools/doc_scripts/replacesig.sh "GetMaxAndCurHPForCurPETNavi_80010D4" "(which_navi: u8) -> (u16, u16)"
tools/doc_scripts/replacesig.sh "ClearEventFlagFromImmediate" "(flag: u16) -> ()"
tools/doc_scripts/replacesig.sh "TestEventFlagFromImmediate" "(flag: u16) -> \!zf"
tools/doc_scripts/replacesig.sh "TestEventFlag" "(flag: u16) -> \!zf"
tools/doc_scripts/replacesig.sh "chatbox_runScript" "(archive: *const TextScriptArchive, script_idx: u8) -> ()"
```

2025-10-14 Wk 42 Tue - 06:17 +03:00

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
git commit -m "doc map related functions and structs"

# out
[master c609f71a] doc map related functions and structs
 41 files changed, 820 insertions(+), 803 deletions(-)
```

2025-10-15 Wk 42 Wed - 07:58 +03:00

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
tools/doc_scripts/replacesig_data.sh "byte_804E6AC" "SpriteLoadData[8]"
tools/doc_scripts/replacesig_data.sh "dword_804E6BE" "SpriteLoadData[1]"
tools/doc_scripts/replacesig_data.sh "dword_804E6C2" "SpriteLoadData[1]"
tools/doc_scripts/replacesig_data.sh "byte_804E6C6" "SpriteLoadData[0]"
tools/doc_scripts/replacesig_data.sh "byte_804E6C8" "SpriteLoadData[3]"
tools/doc_scripts/replacesig_data.sh "off_804E698" "(*const SpriteLoadData)[CENTRAL_TOWN_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_807ED34" "(*const SpriteLoadData)[3]"
tools/doc_scripts/replacesig_data.sh "CentralTownObjectSpawns" "MapObjectSpawnData[15]"
tools/doc_scripts/replacesig_data.sh "LansHouseObjectSpawns" "MapObjectSpawnData[4]"
tools/doc_scripts/replacesig_data.sh "LansRoomObjectSpawns" "MapObjectSpawnData[0]"
tools/doc_scripts/replacesig_data.sh "BathroomObjectSpawns" "MapObjectSpawnData[0]"
tools/doc_scripts/replacesig_data.sh "AsterLandObjectSpawns" "MapObjectSpawnData[4]"
tools/doc_scripts/replacesig_data.sh "off_804E738" "(*const MapObjectSpawnData)[CENTRAL_TOWN_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "ChipDataArr_8021DA8" "(*const ChipData)[206]"
tools/doc_scripts/replacesig_data.sh "eTextScript2033404" "*mut TextScriptArchive"
tools/doc_scripts/replacesig_data.sh "reqBBS_eTextScript" "*mut TextScriptArchive"
tools/doc_scripts/replacesig_data.sh "eTextScript202BA04" "*mut TextScriptArchive"
tools/doc_scripts/replacesig_data.sh "eTextScript202DA04" "*mut TextScriptArchive"

tools/doc_scripts/replacesig.sh "SpawnObjectsFromList" "(data: *const MapObjectSpawnData) -> i32"
tools/doc_scripts/replacesig.sh "getChip8021DA8" "(which_chip: i32) -> *const ChipData"
tools/doc_scripts/replacesig.sh "StoreMapScriptsThenRunOnInitMapScript" "(on_init: *const MapScript, on_update: *const MapScript) -> ()"


tools/doc_scripts/replacesig_data.sh "RealWorldMapScriptPointers" "(*const MapScript)[][2][REAL_WORLD_NUM_GROUPS]"
tools/doc_scripts/replacesig_data.sh "InternetMapScriptPointers" "(*const MapScript)[][2][INTERNET_NUM_GROUPS]"
tools/doc_scripts/replacesig_data.sh "off_804E92C" "(*const MapScript)[CENTRAL_TOWN_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_804E940" "(*const MapScript)[CENTRAL_TOWN_NUM_MAPS]"

tools/doc_scripts/replacesig_data.sh "byte_804EA28" "MapScript"
tools/doc_scripts/replacesig_data.sh "dword_804F1D4" "MapScript"
tools/doc_scripts/replacesig_data.sh "byte_804F4F0" "MapScript"
tools/doc_scripts/replacesig_data.sh "byte_804F934" "MapScript"
tools/doc_scripts/replacesig_data.sh "dword_804F998" "MapScript"
tools/doc_scripts/replacesig_data.sh "byte_804EEF7" "MapScript"
tools/doc_scripts/replacesig_data.sh "byte_804F3F0" "MapScript"
tools/doc_scripts/replacesig_data.sh "byte_804F744" "MapScript"
tools/doc_scripts/replacesig_data.sh "byte_804F96E" "MapScript"
tools/doc_scripts/replacesig_data.sh "byte_804F9C5" "MapScript"

./replacep.sh "byte_804EA28"  "MapScriptOnInitCentralTown_804EA28" 
./replacep.sh "dword_804F1D4" "MapScriptOnInitLanHouse_804F1D4"
./replacep.sh "byte_804F4F0"  "MapScriptOnInitLanRoom_804F4F0" 
./replacep.sh "byte_804F934"  "MapScriptOnInitBathroom_804F934"  
./replacep.sh "dword_804F998" "MapScriptOnInitAsterLand_804F998"

./replacep.sh "byte_804EEF7"  "MapScriptOnUpdateCentralTown_804EEF7" 
./replacep.sh "byte_804F3F0"  "MapScriptOnUpdateLanHouse_804F3F0" 
./replacep.sh "byte_804F744"  "MapScriptOnUpdateLanRoom_804F744" 
./replacep.sh "byte_804F96E"  "MapScriptOnUpdateBathroom_804F96E" 
./replacep.sh "byte_804F9C5"  "MapScriptOnUpdateAsterLand_804F9C5" 

tools/doc_scripts/replacesig_data.sh "byte_804EA41" "MapScript"
tools/doc_scripts/replacesig_data.sh "byte_804EAAC" "MapScript"
tools/doc_scripts/replacesig_data.sh "byte_804EB2D" "MapScript"
tools/doc_scripts/replacesig_data.sh "dword_804EB44" "MapScript"
tools/doc_scripts/replacesig_data.sh "byte_804EB59" "MapScript"
tools/doc_scripts/replacesig_data.sh "byte_804EC99" "MapScript"
tools/doc_scripts/replacesig_data.sh "byte_804ECD6" "MapScript"
tools/doc_scripts/replacesig_data.sh "byte_804EDB9" "MapScript"
tools/doc_scripts/replacesig_data.sh "byte_804EDFB" "MapScript"
tools/doc_scripts/replacesig_data.sh "byte_804EED1" "MapScript"
tools/doc_scripts/replacesig_data.sh "byte_804EEF6" "MapScript"

```

2025-10-15 Wk 42 Wed - 12:37 +03:00

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
git commit -m "map doc and partial dump of a mapscript"                                     
[master be0f03b2] map doc and partial dump of a mapscript
 47 files changed, 488 insertions(+), 317 deletions(-)
```

2025-10-15 Wk 42 Wed - 13:59 +03:00

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
tools/doc_scripts/replacesig.sh "StartCutscene" "(script: *const CutsceneScript, param: u32) -> ()"
tools/doc_scripts/replacesig_data.sh "byte_80893CC" "CutsceneScript"
tools/doc_scripts/replacesig_data.sh "byte_80990B8" "CutsceneScript"
tools/doc_scripts/replacesig_data.sh "byte_8099DC0" "CutsceneScript"
tools/doc_scripts/replacesig_data.sh "off_8044D2C" "(*const LZ77Compressed<TextScriptArchive>)[5][16]"
tools/doc_scripts/replacesig_data.sh "off_8044AB8" "(*const LZ77Compressed<TextScriptArchive>)[5][3]"
tools/doc_scripts/symbol_list_replacesig_data_same.sh \
	"off_8044AEC off_8044AC4 off_8044AD8 off_8044D6C" \
	"(*const LZ77Compressed<TextScriptArchive>)[5]"
tools/doc_scripts/symbol_list_replacesig_data_same.sh \
	"off_8044D80 off_8044D94 off_8044DA8 off_8044DBC off_8044DD0 off_8044DE4 off_8044DF8 off_8044E0C off_8044E20 off_8044E34 off_8044E48 off_8044E5C off_8044E70 off_8044E84 off_8044E98" \
	"(*const LZ77Compressed<TextScriptArchive>)[5]"
tools/doc_scripts/symbol_list_replacesig_data_same.sh \
	"" \
	"(*const LZ77Compressed<TextScriptArchive>)[5]"
tools/doc_scripts/replacesig_data.sh "off_8044EAC" "(*const LZ77Compressed<TextScriptArchive>)[16]"
tools/doc_scripts/replacesig_data.sh "off_8044EEC" "(*const LZ77Compressed<TextScriptArchive>)[4]"
tools/doc_scripts/replacesig_data.sh "off_internet_80444C4" "Nullable<(*const LZ77Compressed<TextScriptArchive>)[5][]>[INTERNET_NUM_GROUPS]"
tools/doc_scripts/replacesig_data.sh "off_realWorld_8044470" "(*const LZ77Compressed<TextScriptArchive>)[5][][REAL_WORLD_NUM_GROUPS]"

tools/doc_scripts/replacesig.sh "sub_809F942" "() -> Nullable<* ?>"
tools/doc_scripts/replacesig.sh "chatbox_selectCompTextByMap_80407C8" "() -> *const LZ77Compressed<TextScriptArchive>"
tools/doc_scripts/replacesig.sh "SWI_LZ77UnCompReadNormalWrite8bit" "(src: *const LZ77Compressed<T>, mut_dest: *mut T -> ()"

./replacep.sh "off_804448C"  "inRealWorld_8044520" 
./replacep.sh "off_8044520"  "inInternet_8044520" 

tools/doc_scripts/replacesig_data.sh "inRealWorld_8044520" "(*const LZ77Compressed<TextScriptArchive>)[][REAL_WORLD_NUM_GROUPS]"
	tools/doc_scripts/replacesig_data.sh "inInternet_8044520" "Nullable<(*const LZ77Compressed<TextScriptArchive>)[]>[INTERNET_NUM_GROUPS]"

tools/doc_scripts/replacesig_data.sh "off_internet_804457C" "Nullable<(*const LZ77Compressed<TextScriptArchive>)[]>[INTERNET_NUM_GROUPS]"

./replacep.sh "sub_809F506"  "setNPCScript_809F506" 
./replacep.sh "sub_800467C"  "npc_init_800467C" 

tools/doc_scripts/replacesig.sh "npc_809E570" "(self: * OverworldNPCObject \$r5) -> ()"

tools/doc_scripts/replacesig.sh "npc_init_809E590" "(self: *mut OverworldNPCObject \$r5) -> ()"
tools/doc_scripts/replacesig.sh "npc_standard_809E5E2" "(self: * OverworldNPCObject \$r5) -> ()"
tools/doc_scripts/replacesig.sh "npc_inChatbox_809EADA" "(self: * OverworldNPCObject \$r5) -> ()"

tools/doc_scripts/replacesig.sh "setNPCScript_809F506" "(self: *mut OverworldNPCObject \$r5, script: *const NPCScript) -> ()"

./replacep.sh "npc_809E570"  "npc_dispatch_809E570" 

tools/doc_scripts/replacesig_data.sh "byte_805163C" "NPCScript"
tools/doc_scripts/replacesig_data.sh "byte_806CB04" "NPCScript"
tools/doc_scripts/replacesig_data.sh "byte_805183C" "NPCScript"
tools/doc_scripts/replacesig_data.sh "npc_script_805176f" "NPCScript"
tools/doc_scripts/replacesig_data.sh "off_8051624" "(*const NPCScript)[5]"

tools/doc_scripts/replacesig_data.sh "NPCList_maps00" "(*const NPCScript)[][][REAL_WORLD_NUM_GROUPS]"
tools/doc_scripts/replacesig_data.sh "NPCList_maps80" "Nullable<(*const NPCScript)[][]>[INTERNET_NUM_GROUPS]"
tools/doc_scripts/replacesig.sh "npc_freeAllObjectsThenSpawnObjectsFromList" "(ptr: (*const NPCScript)[]) -> ()"
tools/doc_scripts/replacesig.sh "npc_spawnObjectThenSetUnk10_TempAnimScriptPtr_8030a8c" "(_l: (*const NPCScript)[], which: isize, script: *const NPCScript) -> ()"


./replacep.sh "oOverworldNPCObject_Unk_10"  "oOverworldNPCObject_WhichNPCScript" # and change in OverworldNPCObject.inc too

./replacep.sh "npc_map00_ACDC_804D0B4" "NPCScriptsACDC_804D0B4"      
./replacep.sh "npc_map00_804E954"      "NPCScriptsCentralTown_804E954"                
./replacep.sh "off_8052DE0"            "NPCScriptsCyberAcademy_8052DE0"                       
./replacep.sh "off_8059D70"            "NPCScriptsSeasideTown_8059D70"                     
./replacep.sh "off_805E184"            "NPCScriptsGreenTown_805E184"                    
./replacep.sh "off_806065C"            "NPCScriptsSkyTown_806065C"                           
./replacep.sh "off_8062F78"            "NPCScriptsExpoSite_8062F78"                         

./replace.sh "off_80665B4"   "NPCScriptsRobotControlComp_80665B4"                                                    
./replace.sh "off_8067DE0"   "NPCScriptsAquariumComp_8067DE0"                                                         
./replace.sh "off_8069310"   "NPCScriptsJudgetreeComp_8069310"                                                      
./replace.sh "off_806A278"   "NPCScriptsMrWeather_806A278"                                                      
./replace.sh "off_806AE30"   "NPCScriptsPvavilionComp_806AE30"                                                      
./replace.sh "off_806C7E8"   "NPCScriptsHomePages_806C7E8"                                                      
./replace.sh "off_806E030"   "NPCScriptsComps_806E030"                                                      
./replace.sh "off_80702AC"   "NPCScriptsComps2_80702AC"                                                      
./replace.sh "off_8071EC8"   "NPCScriptsCentralArea_8071EC8"                                                      
./replace.sh "off_80758B8"   "NPCScriptsSeasideArea_80758B8"                                                      
./replace.sh "off_8078114"   "NPCScriptsGreenArea_8078114"                                                      
./replace.sh "off_807953C"   "NPCScriptsUnderground_807953C"                                                      
./replace.sh "off_807AE04"   "NPCScriptsSkyACDCArea_807AE04"                                                      
./replace.sh "off_807D310"   "NPCScriptsUndernet_807D310"                                                      
./replace.sh "dword_807F210" "NPCScriptsGraveyardImmortalArea_807F210"                                                      

tools/doc_scripts/replacesig_data.sh "NPCScriptsACDC_804D0B4"          "(*const NPCScript)[][ACDC_TOWN_NUM_MAPS]"  
tools/doc_scripts/replacesig_data.sh "NPCScriptsCentralTown_804E954"   "(*const NPCScript)[][CENTRAL_TOWN_NUM_MAPS]"               
tools/doc_scripts/replacesig_data.sh "NPCScriptsCyberAcademy_8052DE0"  "(*const NPCScript)[][CYBER_ACADEMY_NUM_MAPS]"                     
tools/doc_scripts/replacesig_data.sh "NPCScriptsSeasideTown_8059D70"   "(*const NPCScript)[][SEASIDE_TOWN_NUM_MAPS]"                  
tools/doc_scripts/replacesig_data.sh "NPCScriptsGreenTown_805E184"     "(*const NPCScript)[][GREEN_TOWN_NUM_MAPS]"               
tools/doc_scripts/replacesig_data.sh "NPCScriptsSkyTown_806065C"       "(*const NPCScript)[][SKY_TOWN_NUM_MAPS]"                    
tools/doc_scripts/replacesig_data.sh "NPCScriptsExpoSite_8062F78"      "(*const NPCScript)[][EXPO_SITE_NUM_MAPS]"                   

tools/doc_scripts/replacesig_data.sh "NPCScriptsRobotControlComp_80665B4"      "(*const NPCScript)[][ROBOT_CONTROL_COMP_NUM_MAPS]"            
tools/doc_scripts/replacesig_data.sh "NPCScriptsAquariumComp_8067DE0"          "(*const NPCScript)[][AQUARIUM_COMP_NUM_MAPS]"             
tools/doc_scripts/replacesig_data.sh "NPCScriptsJudgetreeComp_8069310"         "(*const NPCScript)[][JUDGETREE_COMP_NUM_MAPS]"           
tools/doc_scripts/replacesig_data.sh "NPCScriptsMrWeather_806A278"             "(*const NPCScript)[][MR_WEATHER_COMP_NUM_MAPS]"         
tools/doc_scripts/replacesig_data.sh "NPCScriptsPvavilionComp_806AE30"         "(*const NPCScript)[][PAVILION_COMP_NUM_MAPS]"           
tools/doc_scripts/replacesig_data.sh "NPCScriptsHomePages_806C7E8"             "(*const NPCScript)[][HOMEPAGES_NUM_MAPS]"               
tools/doc_scripts/replacesig_data.sh "NPCScriptsComps_806E030"                 "(*const NPCScript)[][COMPS_NUM_MAPS]"                   
tools/doc_scripts/replacesig_data.sh "NPCScriptsComps2_80702AC"                "(*const NPCScript)[][COMPS_2_NUM_MAPS]"                 
tools/doc_scripts/replacesig_data.sh "NPCScriptsCentralArea_8071EC8"           "(*const NPCScript)[][CENTRAL_AREA_NUM_MAPS]"            
tools/doc_scripts/replacesig_data.sh "NPCScriptsSeasideArea_80758B8"           "(*const NPCScript)[][SEASIDE_AREA_NUM_MAPS]"            
tools/doc_scripts/replacesig_data.sh "NPCScriptsGreenArea_8078114"             "(*const NPCScript)[][GREEN_AREA_NUM_MAPS]"              
tools/doc_scripts/replacesig_data.sh "NPCScriptsUnderground_807953C"           "(*const NPCScript)[][UNDERGROUND_NUM_MAPS]"             
tools/doc_scripts/replacesig_data.sh "NPCScriptsSkyACDCArea_807AE04"           "(*const NPCScript)[][SKY_ACDC_AREA_NUM_MAPS]"           
tools/doc_scripts/replacesig_data.sh "NPCScriptsUndernet_807D310"              "(*const NPCScript)[][UNDERNET_NUM_MAPS]"                
tools/doc_scripts/replacesig_data.sh "NPCScriptsGraveyardImmortalArea_807F210" "(*const NPCScript)[][GRAVEYARD_NUM_MAPS]"                   

tools/doc_scripts/replacesig_data.sh "NPCScriptsHomePages_806C7E8"             "Nullable<(*const NPCScript)[]>[HOMEPAGES_NUM_MAPS]"       
tools/doc_scripts/replacesig_data.sh "NPCScriptsUndernet_807D310"              "Nullable<(*const NPCScript)[]>[UNDERNET_NUM_MAPS]"      
tools/doc_scripts/replacesig_data.sh "NPCScriptsGraveyardImmortalArea_807F210" "Nullable<(*const NPCScript)[]>[GRAVEYARD_NUM_MAPS]"                   

./replace.sh "off_804F9D8" "NPCScriptsForCentralTown_804F9D8"
./replace.sh "off_8051624" "NPCScriptsForLanHouse_8051624"
./replace.sh "off_8051B5C" "NPCScriptsForLanRoom_8051B5C"
./replace.sh "off_8051F48" "NPCScriptsForBathroom_8051F48"
./replace.sh "off_8051FB0" "NPCScriptsForAsterland_8051FB0"

tools/doc_scripts/replacesig_data.sh "NPCScriptsForCentralTown_804F9D8" "(*const NPCScript)[16]"            
tools/doc_scripts/replacesig_data.sh "NPCScriptsForLanRoom_8051B5C"     "(*const NPCScript)[1]"         
tools/doc_scripts/replacesig_data.sh "NPCScriptsForBathroom_8051F48"    "(*const NPCScript)[2]"        
tools/doc_scripts/replacesig_data.sh "NPCScriptsForAsterland_8051FB0"   "(*const NPCScript)[9]"       
```

2025-10-15 Wk 42 Wed - 19:32 +03:00

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
git commit

# out
[master b74a9507] doc types for NPC and Map scripts for all maps
 49 files changed, 635 insertions(+), 406 deletions(-)
```

2025-10-16 Wk 42 Thu - 06:20 +03:00

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f

tools/doc_scripts/symbol_list_replacesig_data_same.sh \
	"byte_8099E04 byte_8098BB8 byte_809AE68 byte_809895C byte_80989C1 byte_8098384 byte_8098358 byte_809CAD8 byte_809AA34 byte_8099EA0 byte_809A8A8 CutsceneScript_80991F4 CutsceneScript_80988E4 byte_8098824 byte_809CEB4 byte_809C354 byte_809AFC0 byte_809B16C CutsceneScript_8098b1c CutsceneScript_809b5ad CutsceneScript_8098a2e CutsceneScript_8098a78 CutsceneScript_8098a02 byte_809326C byte_80933B8 byte_8092DE8 byte_8093358 byte_808C2F0 dword_8089128 byte_8089554 byte_8089448 byte_8089DF4 byte_808A128 byte_808C2F0 byte_8089FD8 byte_8089E44 byte_8089DD8" \
	"CutsceneScript"

# after byte_809326C
tools/doc_scripts/replacesig_data.sh "dword_8143B1C" "(*const CutsceneScript)[2]"         

# after byte_8093358
tools/doc_scripts/replacesig_data.sh "off_8143078" "(*const CutsceneScript)[2]"         

# after dword_8089128, byte_80893CC is already labeled
# after byte_8089DD8, byte_8086678+32 is not formed yet
# after byte_8086678+32, `sub_8086FD8`, `sub_808FE74`, `sub_808CB0C` start cutscenes generally
```

