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
