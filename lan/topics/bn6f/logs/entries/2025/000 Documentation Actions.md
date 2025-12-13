2025-09-27 Wk 39 Sat - 08:27

# 1 Journal

2025-09-25 Wk 39 Thu - 06:15

````sh
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
````

Commited `ddc1c1e3`,

2025-09-27 Wk 39 Sat - 08:27

````sh
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
````

2025-10-08 Wk 41 Wed - 03:50 +03:00

From [000 What writes for startscreen_render_802F544 jumptable?](../../../functions/entries/2025/002%20startscreen_render_802F544/investigations/000%20What%20writes%20for%20startscreen_render_802F544%20jumptable%3F.md),

````sh
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
````

2025-10-08 Wk 41 Wed - 04:45 +03:00

Added `ctags -R ewram.s *.s asm/* data/dat* docs/decomp/*.c include/* maps/*` to `./replace.sh`

2025-10-08 Wk 41 Wed - 06:33 +03:00

````sh
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


````

Commited `a8ff8d2b`

2025-10-08 Wk 41 Wed - 10:29 +03:00

Added `replacep_rev.sh` for undoing `replacep.sh`.

````sh
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
````

2025-10-08 Wk 41 Wed - 12:09 +03:00

This `IsCutsceneScriptNonNull` does a `tst r0, r0` which does a logical AND check. The zero flag is set IF `r0` 's content is null. The flag is cleared (`!zf`) if it's not null then.

2025-10-08 Wk 41 Wed - 12:17 +03:00

````sh
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
````

2025-10-08 Wk 41 Wed - 15:37 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
git commit -m "doc map update loop and related"

# out
[master 69bd59bb] doc map update loop and related
 14 files changed, 363 insertions(+), 115 deletions(-)
 create mode 100755 replacep_rev.sh
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/dism-exe-notes
git commit

# out
[main 62f5228] notes on map trigger & cutscene tracing
 Date: Wed Oct 8 15:37:10 2025 +0300
 6 files changed, 337 insertions(+), 41 deletions(-)
````

2025-10-11 Wk 41 Sat - 06:51 +03:00

````sh
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
````

2025-10-11 Wk 41 Sat - 12:11 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
make clean && make -j$(nproc) assets && make -j$(nproc);

# out (relevant)
bn6f.gba: OK
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
git commit -m "doc map related functions and structs"

# out
[master 0b30a62f] doc map related functions and structs
 85 files changed, 1398 insertions(+), 1180 deletions(-)
 create mode 100644 include/structs/S2011E30.inc
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/dism-exe-notes
git commit -m "doc map related functions and structs"

# out
[main 44b0874] doc map related functions and structs
 10 files changed, 777 insertions(+), 9 deletions(-)
 create mode 100644 lan/topics/bn6f/explorations/entries/2025/001 Exploring bn6f CentralArea Map/issues/000 TryUpdateEachOverworldMapObject_80048D2.ret_8004920 was not defined within its scope.md
 create mode 100644 lan/topics/bn6f/explorations/entries/2025/001 Exploring bn6f CentralArea Map/tasks/001 Create Struct S2011E30 used in dispatch_80339CC.md
 create mode 100644 lan/topics/bn6f/explorations/entries/2025/001 Exploring bn6f CentralArea Map/tasks/002 Find what triggers via dispatch_80339CC.md
 create mode 100644 scripts/templater/data/lan/daily/2025/Summary-2025-10-11.md
````

2025-10-12 Wk 41 Sun - 06:23 +03:00

````sh
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
````

2025-10-14 Wk 42 Tue - 06:17 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
git commit -m "doc map related functions and structs"

# out
[master c609f71a] doc map related functions and structs
 41 files changed, 820 insertions(+), 803 deletions(-)
````

2025-10-15 Wk 42 Wed - 07:58 +03:00

````sh
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

````

2025-10-15 Wk 42 Wed - 12:37 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
git commit -m "map doc and partial dump of a mapscript"                                     
[master be0f03b2] map doc and partial dump of a mapscript
 47 files changed, 488 insertions(+), 317 deletions(-)
````

2025-10-15 Wk 42 Wed - 13:59 +03:00

````sh
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
````

2025-10-15 Wk 42 Wed - 19:32 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
git commit

# out
[master b74a9507] doc types for NPC and Map scripts for all maps
 49 files changed, 635 insertions(+), 406 deletions(-)
````

2025-10-16 Wk 42 Thu - 06:20 +03:00

````sh
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
````

2025-10-18 Wk 42 Sat - 15:29 +03:00

Retyping array types to be consistent with Rust-style `[T; N]`. It is also to make pointers to arrays unambiguous `*const [T; N]`. Arrays are strictly contiguous memory here, and are not doubling as pointers as is done with C.

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
tools/doc_scripts/replacesig_data.sh "dword_8143B1C" "[*const CutsceneScript; 2]"         
tools/doc_scripts/replacesig_data.sh "off_8143078" "[*const CutsceneScript; 2]"         

tools/doc_scripts/replacesig_data.sh "NPCScriptsForCentralTown_804F9D8" "[*const NPCScript; 16]"            
tools/doc_scripts/replacesig_data.sh "NPCScriptsForLanRoom_8051B5C"     "[*const NPCScript; 1]"         
tools/doc_scripts/replacesig_data.sh "NPCScriptsForBathroom_8051F48"    "[*const NPCScript; 2]"        
tools/doc_scripts/replacesig_data.sh "NPCScriptsForAsterland_8051FB0"   "[*const NPCScript; 9]"       

tools/doc_scripts/replacesig_data.sh "NPCScriptsACDC_804D0B4"          "[*const [*const NPCScript]; ACDC_TOWN_NUM_MAPS]"  
tools/doc_scripts/replacesig_data.sh "NPCScriptsCentralTown_804E954"   "[*const [*const NPCScript]; CENTRAL_TOWN_NUM_MAPS]"               
tools/doc_scripts/replacesig_data.sh "NPCScriptsCyberAcademy_8052DE0"  "[*const [*const NPCScript]; CYBER_ACADEMY_NUM_MAPS]"                     
tools/doc_scripts/replacesig_data.sh "NPCScriptsSeasideTown_8059D70"   "[*const [*const NPCScript]; SEASIDE_TOWN_NUM_MAPS]"                  
tools/doc_scripts/replacesig_data.sh "NPCScriptsGreenTown_805E184"     "[*const [*const NPCScript]; GREEN_TOWN_NUM_MAPS]"               
tools/doc_scripts/replacesig_data.sh "NPCScriptsSkyTown_806065C"       "[*const [*const NPCScript]; SKY_TOWN_NUM_MAPS]"                    
tools/doc_scripts/replacesig_data.sh "NPCScriptsExpoSite_8062F78"      "[*const [*const NPCScript]; EXPO_SITE_NUM_MAPS]"                   

tools/doc_scripts/replacesig_data.sh "NPCScriptsRobotControlComp_80665B4"      "[*const [*const NPCScript]; ROBOT_CONTROL_COMP_NUM_MAPS]"            
tools/doc_scripts/replacesig_data.sh "NPCScriptsAquariumComp_8067DE0"          "[*const [*const NPCScript]; AQUARIUM_COMP_NUM_MAPS]"             
tools/doc_scripts/replacesig_data.sh "NPCScriptsJudgetreeComp_8069310"         "[*const [*const NPCScript]; JUDGETREE_COMP_NUM_MAPS]"           
tools/doc_scripts/replacesig_data.sh "NPCScriptsMrWeather_806A278"             "[*const [*const NPCScript]; MR_WEATHER_COMP_NUM_MAPS]"         
tools/doc_scripts/replacesig_data.sh "NPCScriptsPvavilionComp_806AE30"         "[*const [*const NPCScript]; PAVILION_COMP_NUM_MAPS]"           
tools/doc_scripts/replacesig_data.sh "NPCScriptsHomePages_806C7E8"             "[*const [*const NPCScript]; HOMEPAGES_NUM_MAPS]"               
tools/doc_scripts/replacesig_data.sh "NPCScriptsComps_806E030"                 "[*const [*const NPCScript]; COMPS_NUM_MAPS]"                   
tools/doc_scripts/replacesig_data.sh "NPCScriptsComps2_80702AC"                "[*const [*const NPCScript]; COMPS_2_NUM_MAPS]"                 
tools/doc_scripts/replacesig_data.sh "NPCScriptsCentralArea_8071EC8"           "[*const [*const NPCScript]; CENTRAL_AREA_NUM_MAPS]"            
tools/doc_scripts/replacesig_data.sh "NPCScriptsSeasideArea_80758B8"           "[*const [*const NPCScript]; SEASIDE_AREA_NUM_MAPS]"            
tools/doc_scripts/replacesig_data.sh "NPCScriptsGreenArea_8078114"             "[*const [*const NPCScript]; GREEN_AREA_NUM_MAPS]"              
tools/doc_scripts/replacesig_data.sh "NPCScriptsUnderground_807953C"           "[*const [*const NPCScript]; UNDERGROUND_NUM_MAPS]"             
tools/doc_scripts/replacesig_data.sh "NPCScriptsSkyACDCArea_807AE04"           "[*const [*const NPCScript]; SKY_ACDC_AREA_NUM_MAPS]"           
tools/doc_scripts/replacesig_data.sh "NPCScriptsUndernet_807D310"              "[*const [*const NPCScript]; UNDERNET_NUM_MAPS]"                
tools/doc_scripts/replacesig_data.sh "NPCScriptsGraveyardImmortalArea_807F210" "[*const [*const NPCScript]; GRAVEYARD_NUM_MAPS]"                   

tools/doc_scripts/replacesig_data.sh "NPCScriptsHomePages_806C7E8"             "[Nullable<*const [*const NPCScript]>]; HOMEPAGES_NUM_MAPS]"       
tools/doc_scripts/replacesig_data.sh "NPCScriptsUndernet_807D310"              "[Nullable<*const [*const NPCScript]>]; UNDERNET_NUM_MAPS]"      
tools/doc_scripts/replacesig_data.sh "NPCScriptsGraveyardImmortalArea_807F210" "[Nullable<*const [*const NPCScript]>]; GRAVEYARD_NUM_MAPS]"                   

tools/doc_scripts/replacesig_data.sh "off_8051624" "[*const NPCScript; 5]"

tools/doc_scripts/replacesig_data.sh "NPCList_maps00" "[*const [*const [*const NPCScript]]; REAL_WORLD_NUM_GROUPS]"
tools/doc_scripts/replacesig_data.sh "NPCList_maps80" "[Nullable<*const [*const [*const NPCScript]]>; INTERNET_NUM_GROUPS]"
tools/doc_scripts/replacesig.sh "npc_freeAllObjectsThenSpawnObjectsFromList" "(ptr: [*const NPCScript]) -> ()"
tools/doc_scripts/replacesig.sh "npc_spawnObjectThenSetUnk10_TempAnimScriptPtr_8030a8c" "(_l: *const [*const NPCScript], which: isize, script: *const NPCScript) -> ()"

tools/doc_scripts/replacesig_data.sh "off_8051624" "[*const NPCScript; 5]"

tools/doc_scripts/replacesig_data.sh "inRealWorld_8044520" "[*const [*const LZ77Compressed<TextScriptArchive>]; REAL_WORLD_NUM_GROUPS]"
tools/doc_scripts/replacesig_data.sh "inInternet_8044520" "[Nullable<*const [*const LZ77Compressed<TextScriptArchive>]>; INTERNET_NUM_GROUPS]"

tools/doc_scripts/replacesig_data.sh "off_internet_804457C" "[Nullable<*const [*const LZ77Compressed<TextScriptArchive>]>; INTERNET_NUM_GROUPS]"

tools/doc_scripts/replacesig_data.sh "off_8044D2C" "[*const [*const LZ77Compressed<TextScriptArchive>; 5]; 16]"
tools/doc_scripts/replacesig_data.sh "off_8044AB8" "[*const [*const LZ77Compressed<TextScriptArchive>; 5]; 3]"
tools/doc_scripts/symbol_list_replacesig_data_same.sh \
	"off_8044AEC off_8044AC4 off_8044AD8 off_8044D6C" \
	"[*const LZ77Compressed<TextScriptArchive>; 5]"
tools/doc_scripts/symbol_list_replacesig_data_same.sh \
	"off_8044D80 off_8044D94 off_8044DA8 off_8044DBC off_8044DD0 off_8044DE4 off_8044DF8 off_8044E0C off_8044E20 off_8044E34 off_8044E48 off_8044E5C off_8044E70 off_8044E84 off_8044E98" \
	"[*const LZ77Compressed<TextScriptArchive>; 5]"
tools/doc_scripts/replacesig_data.sh "off_8044EAC" "[*const LZ77Compressed<TextScriptArchive>; 16]"
tools/doc_scripts/replacesig_data.sh "off_8044EEC" "[*const LZ77Compressed<TextScriptArchive>; 4]"
tools/doc_scripts/replacesig_data.sh "off_internet_80444C4" "[Nullable<*const [*const [*const LZ77Compressed<TextScriptArchive>; 5]]>; INTERNET_NUM_GROUPS]"
tools/doc_scripts/replacesig_data.sh "off_realWorld_8044470" "[*const [*const [*const LZ77Compressed<TextScriptArchive; 5]]; REAL_WORLD_NUM_GROUPS]"


tools/doc_scripts/replacesig_data.sh "RealWorldMapScriptPointers" "[*const [*const [*const MapScript]; 2]; REAL_WORLD_NUM_GROUPS]"
tools/doc_scripts/replacesig_data.sh "InternetMapScriptPointers" "[*const [*const [*const MapScript]; 2]; INTERNET_NUM_GROUPS]"


tools/doc_scripts/replacesig_data.sh "byte_804E6AC" "[SpriteLoadData; 8]"
tools/doc_scripts/replacesig_data.sh "dword_804E6BE" "[SpriteLoadData; 1]"
tools/doc_scripts/replacesig_data.sh "dword_804E6C2" "[SpriteLoadData; 1]"
tools/doc_scripts/replacesig_data.sh "byte_804E6C6" "[SpriteLoadData; 0]"
tools/doc_scripts/replacesig_data.sh "byte_804E6C8" "[SpriteLoadData; 3]"
tools/doc_scripts/replacesig_data.sh "off_804E698" "[*const SpriteLoadData; CENTRAL_TOWN_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_807ED34" "[*const SpriteLoadData; 3]"
tools/doc_scripts/replacesig_data.sh "CentralTownObjectSpawns" "[MapObjectSpawnData; 15]]"
tools/doc_scripts/replacesig_data.sh "LansHouseObjectSpawns" "[MapObjectSpawnData; 4]"
tools/doc_scripts/replacesig_data.sh "LansRoomObjectSpawns" "[MapObjectSpawnData; 0]"
tools/doc_scripts/replacesig_data.sh "BathroomObjectSpawns" "[MapObjectSpawnData; 0]"
tools/doc_scripts/replacesig_data.sh "AsterLandObjectSpawns" "[MapObjectSpawnData; 4]"
tools/doc_scripts/replacesig_data.sh "off_804E738" "[*const MapObjectSpawnData; CENTRAL_TOWN_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "ChipDataArr_8021DA8" "[*const ChipData; 206]"
````

2025-10-19 Wk 42 Sun - 08:47 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
git lg

# out (relevant)
* 9de65bf2 (HEAD -> master) retype array types
````

2025-10-19 Wk 42 Sun - 09:26 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
tools/doc_scripts/replacesig.sh "_SetInterruptCallback" "(interrupt_idx: u8, callback: *const ()) -> ()"

./replacep.sh "byte_200F348" "eS200F348"
./replacep.sh "byte_200A290" "eS200A290"

tools/doc_scripts/replacesig_data.sh "eTextScript2033404" "TextScriptArchive"
tools/doc_scripts/replacesig_data.sh "reqBBS_eTextScript" "TextScriptArchive"
tools/doc_scripts/replacesig_data.sh "eTextScript202BA04" "TextScriptArchive"
tools/doc_scripts/replacesig_data.sh "eTextScript202DA04" "TextScriptArchive"

tools/doc_scripts/replacesig.sh "sub_803FB64" "(self: *mut S200F348 \$r5) -> ()"
tools/doc_scripts/replacesig.sh "playGameOver_803FB9C" "(self: *mut S200F348 \$r5) -> ()"

./replacep.sh "oBattleState_Unk_01" "oBattleState_Index_01" # also updated struct

tools/doc_scripts/replacesig.sh "sub_8007B9C" "(self: *mut BattleState \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_8007CA0" "(self: *mut BattleState \$r5) -> ()"

./replacep.sh "oBattleState_Unk_00" "oBattleState_Index_00" # also updated struct

tools/doc_scripts/replacesig.sh "sub_8007850" "(self: * BattleState \$r5) -> ()"
tools/doc_scripts/replacesig.sh "battle_update_8007A44" "(self: * BattleState \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_8007B80" "(self: * BattleState \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_8007E62" "(self: * BattleState \$r5) -> ()"
tools/doc_scripts/replacesig.sh "sub_8007F4E" "(self: * BattleState \$r5) -> ()"
tools/doc_scripts/replacesig.sh "removed_8007FEA" "(self: * BattleState \$r5) -> ()"


./replacep.sh "cb_803D1CA" "logoScreen_dispatch_803D1CA"
./replacep.sh "sub_803D2A6" "logoScreen_finish_803D2A6"
./replacep.sh "init_803D1A8" "logoScreen_init_803D1A8"

# Won't change it completely, also did "%s/S2011800/LogoScreenState/g" in asm03_1_1.s
./replace.sh "S2011800" "LogoScreenState"
./replace.sh "s_2011800_struct" "LogoScreenState_struct"
./replacep.sh "eS2011800" "eLogoScreenState" 
./replace.sh "oS2011800" "oLogoScreenState" # Won't change individual instances
mv include/structs/S2011800.inc include/structs/LogoScreenState.inc
````

Oops, I replaced `eS2011800` to `LogoScreenState`, so gotta replace where they are used, which is luckily not many.G

2025-10-19 Wk 42 Sun - 22:53 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
git commit -m "doc logo screen module"

# out
[master f3f0e6a4] doc logo screen module
 29 files changed, 553 insertions(+), 299 deletions(-)
 create mode 100644 include/structs/LogoScreenState.inc
 create mode 100644 include/structs/S200A290.inc
 create mode 100644 include/structs/S200F348.inc
 delete mode 100644 include/structs/S2011800.inc
````

2025-10-19 Wk 42 Sun - 23:42 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f

tools/doc_scripts/replacesig.sh "CopyBackgroundTiles" "(j: u32, i: u32, which_tile_block_32x32: u32, tile_ids: *const u16, j_size: u32, i_size: u32 ) -> ()"
````

2025-10-23 Wk 43 Thu - 15:31 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
./replacep.sh "copyTileData_803D2B8" "logoScreen_loadLogoTiles_803D2B8"
./replacep.sh "unk_2014A00" "eDecompBuffer2014A00"
./replacep.sh "byte_86C3C94" "CapcomLogoPalette_86C3C94"
./replacep.sh "byte_86C4194" "CapcomLogoLicensePalette_86C4194"
./replacep.sh "unk_3001980" "palette_3001980"
./replacep.sh "byte_86C3FD4" "CapcomLogoLicenseTileset_86C3FD4"
./replacep.sh "dword_86C41B4" "CapcomLogoLicenseTilemap_86C41B4"

./replacep.sh "comp_86C3528" "CompCapcomLogoTileset_86C3528"
./replacep.sh "comp_86C3E94" "CompCapcomLogoTilemap_86C3E94"
mv data/compressed/comp_86C3528.lz77 data/compressed/CompCapcomLogoTileset_86C3528.lz77
mv data/compressed/comp_86C3E94.lz77 data/compressed/CompCapcomLogoTilemap_86C3E94.lz77
````

2025-10-23 Wk 43 Thu - 23:13 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
git commit -m "doc logo screen tiles" 

# out
[master 9e71b5f9] doc logo screen tiles
 28 files changed, 396 insertions(+), 271 deletions(-)
 rename data/compressed/{comp_86C3E94.lz77 => CompCapcomLogoTilemap_86C3E94.lz77} (100%)
 rename data/compressed/{comp_86C3528.lz77 => CompCapcomLogoTileset_86C3528.lz77} (100%)
````

2025-10-25 Wk 43 Sat - 19:00 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
tools/doc_scripts/replacesig_data.sh "off_8032A20" "[MapBGDescriptor; ACDC_TOWN_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8032A38" "[MapBGDescriptor; CENTRAL_TOWN_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8032A74" "[MapBGDescriptor; CYBER_ACADEMY_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8032AF8" "[MapBGDescriptor; SEASIDE_TOWN_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8032B34" "[MapBGDescriptor; GREEN_TOWN_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8032B70" "[MapBGDescriptor; SKY_TOWN_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8032BA0" "[MapBGDescriptor; EXPO_SITE_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_80329A8" "[*const [MapBGDescriptor]; REAL_WORLD_NUM_GROUPS]"

tools/doc_scripts/replacesig_data.sh "off_80329C4" "[Nullable<*const [MapBGDescriptor]>; INTERNET_NUM_GROUPS]"
tools/doc_scripts/replacesig_data.sh "off_8032BE8" "[MapBGDescriptor; ROBOT_CONTROL_COMP_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8032C00" "[MapBGDescriptor; AQUARIUM_COMP_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8032C24" "[MapBGDescriptor; JUDGETREE_COMP_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8032C48" "[MapBGDescriptor; MR_WEATHER_COMP_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8032C6C" "[MapBGDescriptor; PAVILION_COMP_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8032CA8" "[MapBGDescriptor; HOMEPAGES_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8032CFC" "[MapBGDescriptor; COMPS_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8032DBC" "[MapBGDescriptor; COMPS_2_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8032E7C" "[MapBGDescriptor; CENTRAL_AREA_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8032EA0" "[MapBGDescriptor; SEASIDE_AREA_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8032EC4" "[MapBGDescriptor; GREEN_AREA_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8032EDC" "[MapBGDescriptor; UNDERGROUND_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8032EF4" "[MapBGDescriptor; SKY_ACDC_AREA_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8032F18" "[MapBGDescriptor; UNDERNET_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8032F48" "[MapBGDescriptor; GRAVEYARD_NUM_MAPS]"

tools/doc_scripts/replacesig_data.sh "off_8032F6C" "[*const [[*const Fn; 3]]; REAL_WORLD_NUM_GROUPS]"
tools/doc_scripts/replacesig_data.sh "off_8032FE4" "[[*const Fn; 3]; ACDC_TOWN_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8032FFC" "[[*const Fn; 3]; CENTRAL_TOWN_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8033038" "[[*const Fn; 3]; CYBER_ACADEMY_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_80330BC" "[[*const Fn; 3]; SEASIDE_TOWN_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_80330F8" "[[*const Fn; 3]; GREEN_TOWN_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8033134" "[[*const Fn; 3]; SKY_TOWN_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8033164" "[[*const Fn; 3]; EXPO_SITE_NUM_MAPS]"

tools/doc_scripts/replacesig_data.sh "off_8032F88" "Nullable<[*const [[*const Fn; 3]]>; INTERNET_NUM_GROUPS]"
tools/doc_scripts/replacesig_data.sh "off_80331AC" "[[*const Fn; 3]; ROBOT_CONTROL_COMP_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_80331C4" "[[*const Fn; 3]; AQUARIUM_COMP_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_80331E8" "[[*const Fn; 3]; JUDGETREE_COMP_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_803320C" "[[*const Fn; 3]; MR_WEATHER_COMP_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8033230" "[[*const Fn; 3]; PAVILION_COMP_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_803326C" "[[*const Fn; 3]; HOMEPAGES_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "jt_big_80332C0" "[[*const Fn; 3]; COMPS_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8033380" "[[*const Fn; 3]; COMPS_2_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8033440" "[[*const Fn; 3]; CENTRAL_AREA_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8033464" "[[*const Fn; 3]; SEASIDE_AREA_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8033488" "[[*const Fn; 3]; GREEN_AREA_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_80334A0" "[[*const Fn; 3]; UNDERGROUND_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_80334B8" "[[*const Fn; 3]; SKY_ACDC_AREA_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_80334DC" "[[*const Fn; 3]; UNDERNET_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_803350C" "[[*const Fn; 3]; GRAVEYARD_NUM_MAPS]"

tools/doc_scripts/replacesig_data.sh "pt_8033530" "[*const [*const ([u32; 4]?, LZ77Compressed<?>)]; REAL_WORLD_NUM_GROUPS]"
tools/doc_scripts/replacesig_data.sh "off_80335A8" "[*const ([u32; 4]?, LZ77Compressed<?>); ACDC_TOWN_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_80335B4" "[*const ([u32; 4]?, LZ77Compressed<?>); CENTRAL_TOWN_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_80335C8" "[*const ([u32; 4]?, LZ77Compressed<?>); CYBER_ACADEMY_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_80335F4" "[*const ([u32; 4]?, LZ77Compressed<?>); SEASIDE_TOWN_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8033608" "[*const ([u32; 4]?, LZ77Compressed<?>); GREEN_TOWN_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_803361C" "[*const ([u32; 4]?, LZ77Compressed<?>); SKY_TOWN_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_803362C" "[*const ([u32; 4]?, LZ77Compressed<?>); EXPO_SITE_NUM_MAPS]"

tools/doc_scripts/replacesig_data.sh "pt_803354C" "Nullable<[*const [*const ([u32; 4]?, LZ77Compressed<?>)]>; INTERNET_NUM_GROUPS]"
tools/doc_scripts/replacesig_data.sh "off_8033644" "[*const ([u32; 4]?, LZ77Compressed<?>); ROBOT_CONTROL_COMP_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_803364C" "[*const ([u32; 4]?, LZ77Compressed<?>); AQUARIUM_COMP_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8033658" "[*const ([u32; 4]?, LZ77Compressed<?>); JUDGETREE_COMP_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8033664" "[*const ([u32; 4]?, LZ77Compressed<?>); MR_WEATHER_COMP_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8033670" "[*const ([u32; 4]?, LZ77Compressed<?>); PAVILION_COMP_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8033684" "[*const ([u32; 4]?, LZ77Compressed<?>); HOMEPAGES_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_80336A0" "[*const ([u32; 4]?, LZ77Compressed<?>); COMPS_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_80336E0" "[*const ([u32; 4]?, LZ77Compressed<?>); COMPS_2_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8033720" "[*const ([u32; 4]?, LZ77Compressed<?>); CENTRAL_AREA_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_803372C" "[*const ([u32; 4]?, LZ77Compressed<?>); SEASIDE_AREA_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8033738" "[*const ([u32; 4]?, LZ77Compressed<?>); GREEN_AREA_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8033740" "[*const ([u32; 4]?, LZ77Compressed<?>); UNDERGROUND_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8033748" "[*const ([u32; 4]?, LZ77Compressed<?>); SKY_ACDC_AREA_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8033754" "[*const ([u32; 4]?, LZ77Compressed<?>); UNDERNET_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "off_8033764" "[*const ([u32; 4]?, LZ77Compressed<?>); GRAVEYARD_NUM_MAPS]"

tools/doc_scripts/replacesig_data.sh "off_8033770" "[*const [u8]; REAL_WORLD_NUM_GROUPS]"
tools/doc_scripts/replacesig_data.sh "word_80337E8" "[u8; ACDC_TOWN_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_80337EA" "[u8; CENTRAL_TOWN_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_80337EF" "[u8; CYBER_ACADEMY_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_80337FA" "[u8; SEASIDE_TOWN_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_80337FF" "[u8; GREEN_TOWN_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "dword_8033804" "[u8; SKY_TOWN_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_8033808" "[u8; EXPO_SITE_NUM_MAPS]"

tools/doc_scripts/replacesig_data.sh "off_803378C" "[Nullable<*const [u8]>; REAL_WORLD_NUM_GROUPS]"
tools/doc_scripts/replacesig_data.sh "word_803380E" "[u8; ROBOT_CONTROL_COMP_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_8033810" "[u8; AQUARIUM_COMP_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_8033813" "[u8; JUDGETREE_COMP_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_8033816" "[u8; MR_WEATHER_COMP_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_8033819" "[u8; PAVILION_COMP_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_803381E" "[u8; HOMEPAGES_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_8033825" "[u8; COMPS_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_8033835" "[u8; COMPS_2_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_8033845" "[u8; CENTRAL_AREA_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_8033848" "[u8; SEASIDE_AREA_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_803384B" "[u8; GREEN_AREA_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "word_803384D" "[u8; UNDERGROUND_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_803384F" "[u8; SKY_ACDC_AREA_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "dword_8033852" "[u8; UNDERNET_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_8033856" "[u8; GRAVEYARD_NUM_MAPS]"

tools/doc_scripts/replacesig_data.sh "off_803385C" "[*const [u8]; REAL_WORLD_NUM_GROUPS]"
tools/doc_scripts/replacesig_data.sh "word_80338D4" "[u8; ACDC_TOWN_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_80338D6" "[u8; CENTRAL_TOWN_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_80338DB" "[u8; CYBER_ACADEMY_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_80338E6" "[u8; SEASIDE_TOWN_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_80338EB" "[u8; GREEN_TOWN_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "dword_80338F0" "[u8; SKY_TOWN_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_80338F4" "[u8; EXPO_SITE_NUM_MAPS]"

tools/doc_scripts/replacesig_data.sh "off_8033878" "[Nullable<*const [u8]>; REAL_WORLD_NUM_GROUPS]"
tools/doc_scripts/replacesig_data.sh "word_80338FA" "[u8; ROBOT_CONTROL_COMP_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_80338FC" "[u8; AQUARIUM_COMP_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_80338FF" "[u8; JUDGETREE_COMP_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_8033902" "[u8; MR_WEATHER_COMP_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_8033905" "[u8; PAVILION_COMP_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_803390A" "[u8; HOMEPAGES_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_8033911" "[u8; COMPS_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_8033921" "[u8; COMPS_2_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_8033931" "[u8; CENTRAL_AREA_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_8033934" "[u8; SEASIDE_AREA_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_8033937" "[u8; GREEN_AREA_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_8033939" "[u8; UNDERGROUND_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_803393B" "[u8; SKY_ACDC_AREA_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "dword_803393E" "[u8; UNDERNET_NUM_MAPS]"
tools/doc_scripts/replacesig_data.sh "byte_8033942" "[u8; GRAVEYARD_NUM_MAPS]"

./replacep.sh "unk_2027A00" "DecompBuf_2027A00"
````

2025-10-26 Wk 43 Sun - 06:43 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
git commit -m "doc map distributed graphics data"

# out
[master 77ed9e64] doc map distributed graphics data
 11 files changed, 1184 insertions(+), 679 deletions(-)
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
./replacep.sh "byte_86D372C" "comp_86D372C"
./replacep.sh "byte_86DB014" "comp_86DB014"
````

A lot of changes were done in [004 Marking pointers to data passed to decompAndCopyData](../../../explorations/entries/2025/001%20Exploring%20bn6f%20CentralArea%20Map/tasks/004%20Marking%20pointers%20to%20data%20passed%20to%20decompAndCopyData.md)

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
git commit

# out
[master 1785d754] mark all compressed and other pointers used by decompAndCopyData
 28 files changed, 1486 insertions(+), 1818 deletions(-)
````

2025-11-06 Wk 45 Thu - 14:15 +03:00

From [007 Look into dumping gfx_anim_script](../../../../../tasks/2025/004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts/tasks/007%20Look%20into%20dumping%20gfx_anim_script.md),

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
tools/doc_scripts/replacesig.sh "sub_8001C44" "(self: * GFXAnimState \$r7, params: * GFXAnimDataNext) -> ()"
tools/doc_scripts/replacesig.sh "sub_8001C94" "(self: * GFXAnimState \$r7, params: * GFXAnimDataNext) -> ()"
tools/doc_scripts/replacesig.sh "sub_8001C52" "(self: * GFXAnimState \$r7, params: * GFXAnimDataNext) -> ()"
tools/doc_scripts/replacesig.sh "sub_8002310" "(self: * GFXAnimState \$r7, params: * GFXAnimDataNext) -> ()"
tools/doc_scripts/replacesig.sh "sub_800232A" "(self: * GFXAnimState \$r7, params: * GFXAnimDataNext) -> ()"
tools/doc_scripts/replacesig.sh "sub_8002338" "(self: * GFXAnimState \$r7, params: * GFXAnimDataNext) -> ()"
tools/doc_scripts/replacesig.sh "sub_8001CFC" "(self: * GFXAnimState \$r7, params: * GFXAnimDataNext) -> ()"
tools/doc_scripts/replacesig.sh "LoadGFXAnim" "(script: * GFXAnimScript) -> ()"
tools/doc_scripts/replacesig.sh "LoadGFXAnims" "(gfx_anim_data_arr: * FFStop32<[GFXAnimScript]>) -> ()"
````

2025-12-11 Wk 50 Thu - 08:33 +03:00

From [011 Trace and Range dump through ACDC Real world scripts and others](../../../../../tasks/2025/004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts/tasks/011%20Trace%20and%20Range%20dump%20through%20ACDC%20Real%20world%20scripts%20and%20others.md),

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
tools/doc_scripts/replacesig_data.sh "map00_ACDC_804D0A4"   "[*const MapScript; ACDC_TOWN_NUM_MAPS]"  
tools/doc_scripts/replacesig_data.sh "off_804D0AC"          "[*const MapScript; ACDC_TOWN_NUM_MAPS]"  

tools/doc_scripts/replacesig_data.sh "off_804E92C"          "[*const MapScript; CENTRAL_TOWN_NUM_MAPS]"  
tools/doc_scripts/replacesig_data.sh "off_804E940"          "[*const MapScript; CENTRAL_TOWN_NUM_MAPS]"  

tools/doc_scripts/replacesig_data.sh "off_8052D88"          "[*const MapScript; CYBER_ACADEMY_NUM_MAPS]"  
tools/doc_scripts/replacesig_data.sh "off_8052DB4"          "[*const MapScript; CYBER_ACADEMY_NUM_MAPS]"  

tools/doc_scripts/replacesig_data.sh "off_8059D48"          "[*const MapScript; SEASIDE_TOWN_NUM_MAPS]"  
tools/doc_scripts/replacesig_data.sh "off_8059D5C"          "[*const MapScript; SEASIDE_TOWN_NUM_MAPS]"  

tools/doc_scripts/replacesig_data.sh "off_805E15C"          "[*const MapScript; GREEN_TOWN_NUM_MAPS]"  
tools/doc_scripts/replacesig_data.sh "off_805E170"          "[*const MapScript; GREEN_TOWN_NUM_MAPS]"  

tools/doc_scripts/replacesig_data.sh "off_806063C"          "[*const MapScript; SKY_TOWN_NUM_MAPS]"  
tools/doc_scripts/replacesig_data.sh "off_806064C"          "[*const MapScript; SKY_TOWN_NUM_MAPS]"  

tools/doc_scripts/replacesig_data.sh "off_8062F48"          "[*const MapScript; EXPO_SITE_NUM_MAPS]"  
tools/doc_scripts/replacesig_data.sh "off_8062F60"          "[*const MapScript; EXPO_SITE_NUM_MAPS]"  
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
tools/doc_scripts/replacesig_data.sh "off_80665A4"          "[*const MapScript; ROBOT_CONTROL_COMP_NUM_MAPS]" 
tools/doc_scripts/replacesig_data.sh "off_80665AC"          "[*const MapScript; ROBOT_CONTROL_COMP_NUM_MAPS]"  

tools/doc_scripts/replacesig_data.sh "off_8067DC8"          "[*const MapScript; AQUARIUM_COMP_NUM_MAPS]" 
tools/doc_scripts/replacesig_data.sh "off_8067DD4"          "[*const MapScript; AQUARIUM_COMP_NUM_MAPS]"  

tools/doc_scripts/replacesig_data.sh "off_80692F8"          "[*const MapScript; JUDGETREE_COMP_NUM_MAPS]" 
tools/doc_scripts/replacesig_data.sh "off_8069304"          "[*const MapScript; JUDGETREE_COMP_NUM_MAPS]"  

tools/doc_scripts/replacesig_data.sh "off_806A260"          "[*const MapScript; MR_WEATHER_COMP_NUM_MAPS]" 
tools/doc_scripts/replacesig_data.sh "off_806A26C"          "[*const MapScript; MR_WEATHER_COMP_NUM_MAPS]"  

tools/doc_scripts/replacesig_data.sh "off_806AE08"          "[*const MapScript; PAVILION_COMP_NUM_MAPS]" 
tools/doc_scripts/replacesig_data.sh "off_806AE1C"          "[*const MapScript; PAVILION_COMP_NUM_MAPS]"  

tools/doc_scripts/replacesig_data.sh "off_806C7B0"          "[*const MapScript; HOMEPAGES_NUM_MAPS]" 
tools/doc_scripts/replacesig_data.sh "off_806C7CC"          "[*const MapScript; HOMEPAGES_NUM_MAPS]"  

tools/doc_scripts/replacesig_data.sh "off_806DFB0"          "[*const MapScript; COMPS_NUM_MAPS]" 
tools/doc_scripts/replacesig_data.sh "off_806DFF0"          "[*const MapScript; COMPS_NUM_MAPS]"  

tools/doc_scripts/replacesig_data.sh "off_807022C"          "[*const MapScript; COMPS_2_NUM_MAPS]" 
tools/doc_scripts/replacesig_data.sh "off_807026C"          "[*const MapScript; COMPS_2_NUM_MAPS]"  

tools/doc_scripts/replacesig_data.sh "off_8071EB0"          "[*const MapScript; CENTRAL_AREA_NUM_MAPS]" 
tools/doc_scripts/replacesig_data.sh "off_8071EBC"          "[*const MapScript; CENTRAL_AREA_NUM_MAPS]"  

tools/doc_scripts/replacesig_data.sh "off_80758A0"          "[*const MapScript; SEASIDE_AREA_NUM_MAPS]" 
tools/doc_scripts/replacesig_data.sh "off_80758AC"          "[*const MapScript; SEASIDE_AREA_NUM_MAPS]"  

tools/doc_scripts/replacesig_data.sh "off_8078104"          "[*const MapScript; GREEN_AREA_NUM_MAPS]" 
tools/doc_scripts/replacesig_data.sh "off_807810C"          "[*const MapScript; GREEN_AREA_NUM_MAPS]"  

tools/doc_scripts/replacesig_data.sh "off_807952C"          "[*const MapScript; UNDERGROUND_NUM_MAPS]" 
tools/doc_scripts/replacesig_data.sh "off_8079534"          "[*const MapScript; UNDERGROUND_NUM_MAPS]"  

tools/doc_scripts/replacesig_data.sh "off_807ADEC"          "[*const MapScript; SKY_ACDC_AREA_NUM_MAPS]" 
tools/doc_scripts/replacesig_data.sh "off_807ADF8"          "[*const MapScript; SKY_ACDC_AREA_NUM_MAPS]"  

tools/doc_scripts/replacesig_data.sh "off_807D2F0"          "[*const MapScript; UNDERNET_NUM_MAPS]" 
tools/doc_scripts/replacesig_data.sh "off_807D300"          "[*const MapScript; UNDERNET_NUM_MAPS]"  

tools/doc_scripts/replacesig_data.sh "dword_807F1F8"          "[*const MapScript; GRAVEYARD_NUM_MAPS]" 
tools/doc_scripts/replacesig_data.sh "dword_807F204"          "[*const MapScript; GRAVEYARD_NUM_MAPS]"  
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
git commit -m "doc sig of all starting init and update map scripts"

# out
[master 2343100b] doc sig of all starting init and update map scripts
 23 files changed, 88 insertions(+), 88 deletions(-)
````
