---
parent: '[[004 Impl dumping for map npc and cutscene scripts]]'
spawned_by: '[[006 Dump scripts via script tracing]]'
context_type: task
status: done
---

Parent: [004 Impl dumping for map npc and cutscene scripts](../004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts.md)

Spawned by: [006 Dump scripts via script tracing](006%20Dump%20scripts%20via%20script%20tracing.md)

Spawned in: [<a name="spawn-task-5b302f" />^spawn-task-5b302f](006%20Dump%20scripts%20via%20script%20tracing.md#spawn-task-5b302f)

# 1 Journal

2025-12-11 Wk 50 Thu - 04:27 +03:00

Through `RealWorldMapScriptPointers` those would be scripts via `map00_ACDC_804D0A4` and `off_804D0AC` :

````
MapScriptACDC804D104
byte_804D334
MapScript804D2A0
dword_804D3B0
````

Then the NPC range block starting from `off_804D3B4`, assuming to the end of `maps/ACDCTown/data.s` `byte_804E374`.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script map trace MapScriptACDC804D104 &&
cargo run --release --bin dump_script map trace byte_804D334 &&
cargo run --release --bin dump_script map trace MapScript804D2A0 &&
cargo run --release --bin dump_script map trace dword_804D3B0
````

2025-12-11 Wk 50 Thu - 04:39 +03:00

````
Tracing npcscript Identifier { s: "byte_804D905" }
0 new_inst: Inst { name: "ns_set_active_and_visible", cmd: 8, opt_subcmd: None, fields: [] }
// ...
25 new_inst: Inst { name: "ns_set_animation", cmd: 22, opt_subcmd: None, fields: [U8("byte1", 5)] }
27 new_inst: Inst { name: "ns_jump_with_link", cmd: 54, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 134870732 })] }
32 new_inst: Inst { name: "ns_end", cmd: 0, opt_subcmd: None, fields: [] }
33 new_inst: Inst { name: "ns_end", cmd: 0, opt_subcmd: None, fields: [] }
34 new_inst: Inst { name: "ns_end", cmd: 0, opt_subcmd: None, fields: [] }
35 new_inst: Inst { name: "ns_write_cutscene_var", cmd: 60, opt_subcmd: None, fields: [U8("byte1", 217), U8("byte2", 4)] }
38 new_inst: Inst { name: "ns_set_active_and_visible", cmd: 8, opt_subcmd: None, fields: [] }


thread 'main' panicked at src/bin/dump_script.rs:237:25:
No terminating command before failing to read npcscript instructions at Identifier { s: "byte_804D905" }: Partial read Error. Original error: Failed to route the command: No instruction schema found for position 39 and byte 0x97. Parsed Instructions: [Inst { name: "ns_set_active_and_visible", cmd: 8, opt_subcmd: None, fields: [] }, Inst { name: "ns_disable_collision", cmd: 31, opt_subcmd: None, fields: [] }, Inst { name: "ns_disable_collision_alternate", cmd: 39, opt_subcmd: None, fields: [] }, Inst { name: "ns_set_sprite", cmd: 23, opt_subcmd: None, fields: [U8("
````

````C
byte_804D905::
	.byte 0x8, 0x1F, 0x27, 0x17, 0xB, 0x14, 0x9E, 0x0, 0x60, 0x0, 0x0
	.byte 0x0, 0x16, 0x7, 0x3F, 0x8, 0xE, 0x10, 0x1, 0x16, 0xF, 0x15
	.byte 0x7, 0x8, 0x1, 0x16, 0x5, 0x36, 0xCC, 0xF6, 0x9, 0x8, 0x0
	.byte 0x0, 0x0
	.word byte_804D93C
	.word byte_804D997
	.word byte_804D9C4
	.word byte_804D9F6
	.word 0xFF
````

There's an npc script list here: `npcscript_list_804D928`.  As this is a range of npc script data, we can keep going down and identify this pattern again ourselves.

2025-12-11 Wk 50 Thu - 04:58 +03:00

````
Tracing cutscenescript Identifier { s: "cutscenescript_8090C04" }
0 new_inst: Inst { name: "cs_lock_player_for_non_npc_dialogue_809e0b0", cmd: 63, opt_subcmd: Some(U8(0)), fields: [] }
2 new_inst: Inst { name: "cs_nop_80377d0", cmd: 6, opt_subcmd: None, fields: [] }

thread 'main' panicked at src/bin/dump_script.rs:237:25:
No terminating command before failing to read cutscenescript instructions at Identifier { s: "cutscenescript_8090C04" }: Partial read Error. Original error: Inst InstSchema { name: "cs_decomp_text_archive", cmd: 62, opt_subcmd: None, fields: [Ptr("ptr1")] } overflows buffer size 4 at position 3. Parsed Instructions: [Inst { name: "cs_lock_player_for_non_npc_dialogue_809e0b0", cmd: 63, opt_subcmd: Some(U8(0)), fields: [] }, Inst { name: "cs_nop_80377d0", cmd: 6, opt_subcmd: None, fields: [] }]
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

We're overflowing label `byte_8090C08`.  Remove it and all references to it (there's one reference).

2025-12-11 Wk 50 Thu - 05:04 +03:00

````
Tracing npcscript Identifier { s: "byte_804D9F6" }

thread 'main' panicked at src/bin/dump_script.rs:237:25:
No terminating command before failing to read npcscript instructions at Identifier { s: "byte_804D9F6" }: Partial read Error. Original error: Inst InstSchema { name: "ns_jump_with_link", cmd: 54, opt_subcmd: None, fields: [Dest("destination1")] } overflows buffer size 46 at position 45. Parsed Instructions: [Inst { name: "ns_set_active_and_visible", cmd: 8, opt_subcmd: None, fields: [] }, Inst { name: "ns_disable_collision", cmd: 31, opt_subcmd: None, fields: [] }, Inst { name: "ns_disable_collision_alternate", cmd: 39, opt_subcmd: None, fields: [] }, Inst { name: "ns_set_sprite", cmd: 23, opt_subcmd: None, fields: [U8("byte1", 3)] }, Inst { name: "ns_set_coords", cmd: 20, opt_subcmd: None, fields: [U16("hword1", 65450), U16("hword3", 65444), U16("hword5", 0)] }, Inst { name: "ns_set_animation", cmd: 22, opt_subcmd: None, fields: [U8("byte1", 1)] }, Inst { name: "ns_wait_cutscene_var", cmd: 63, opt_subcmd: None, fields: [U8("byte1", 8),
````

We're overflowing `npcscript_list_804DA24` which we just added. The first pointer, `.word byte_809F6CC` is part of the last npc instruction.

2025-12-11 Wk 50 Thu - 05:53 +03:00

````
Tracing ccs Identifier { s: "ccs_8090D2C" }

thread 'main' panicked at src/bin/dump_script.rs:205:25:
No instructions read, and yet we fail to read ccs instructions at Identifier { s: "ccs_8090D2C" }: Partial read Error. Original error: Inst InstSchema { name: "ccs_set_camera_pos", cmd: 0, opt_subcmd: None, fields: [U16("hword1"), U16("hword3"), U16("hword5")] } overflows buffer size 1 at position 0. Parsed Instructions: []
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace

````

We're overflowing `end_cutscenescript_8090D2D` which we have added?

````
ccs_8090D2C:
	.byte 0x00
end_cutscenescript_8090D2D:
	.word 0x02200FC0
	.byte 0x00
	.byte 0x00
	.byte 0x08
````

For `ccs`, `0x00` is not an end script.

````
	enum ccs_set_camera_pos_cmd // 0x00
// 0x0 hword1 hword3 hword5
````

But it thought it was a cutscenescript when it added that.

2025-12-11 Wk 50 Thu - 06:24 +03:00

We trace dumped all the maps.

Some npc scripts were missing in the range `off_804D3B4` to `byte_804D738` and `byte_804E1E0`

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script npc trace byte_804E1E0 &&
cargo run --release --bin dump_script npc range off_804D3B4 byte_804D738
````

2025-12-11 Wk 50 Thu - 07:42 +03:00

````
Tracing npcscript Identifier { s: "npcscript_804D4F8" }
0 new_inst: Inst { name: "ns_set_sprite", cmd: 23, opt_subcmd: None, fields: [U8("byte1", 13)] }
2 new_inst: Inst { name: "ns_set_text_script_index", cmd: 24, opt_subcmd: None, fields: [U8("byte1", 3)] }
4 new_inst: Inst { name: "ns_set_coords", cmd: 20, opt_subcmd: None, fields: [U16("hword1", 180), U16("hword3", 160), U16("hword5", 0)] }
11 new_inst: Inst { name: "ns_set_animation", cmd: 22, opt_subcmd: None, fields: [U8("byte1", 7)] }

thread 'main' panicked at src/bin/dump_script.rs:237:25:
No terminating command before failing to read npcscript instructions at Identifier { s: "npcscript_804D4F8" }: Partial read Error. Original error: Inst InstSchema { name: "ns_jump_with_link", cmd: 54, opt_subcmd: None, fields: [Dest("destination1")] } overflows buffer size 16 at position 13. Parsed Instructions: [Inst { name: "ns_set_sprite", cmd: 23, opt_subcmd: None, fields: [U8("byte1", 13)] }, Inst { name: "ns_set_text_script_index", cmd: 24, opt_subcmd: None, fields: [U8("byte1", 3)] }, Inst { name: "ns_set_coords", cmd: 20, opt_subcmd: None, fields: [U16("hword1", 180), U16("hword3", 160), U16("hword5", 0)] }, Inst { name: "ns_set_animation", cmd: 22, opt_subcmd: None, fields: [U8("byte1", 7)] }]
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

We're overflowing `off_804D508`.  It has no references. Removing.

2025-12-11 Wk 50 Thu - 08:30 +03:00

Okay done for ACDC. Let's extend this to do other irl maps.

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

````
tools/doc_scripts/replacesig_data.sh "XXX"          "[*const MapScript; XXX]" 
tools/doc_scripts/replacesig_data.sh "XXX"          "[*const MapScript; XXX]"  
````

2025-12-11 Wk 50 Thu - 08:54 +03:00

Internet directly accessible in the beginning of the game is through `COMPS_NUM_MAPS`, `HOMEPAGES_NUM_MAPS`, `CENTRAL_AREA_NUM_MAPS`.

These correspond to

````sh
	.word off_806C7B0 // [*const MapScript; HOMEPAGES_NUM_MAPS]
	.word off_806C7CC // [*const MapScript; HOMEPAGES_NUM_MAPS]
	.word off_806DFB0 // [*const MapScript; COMPS_NUM_MAPS]
	.word off_806DFF0 // [*const MapScript; COMPS_NUM_MAPS]
	.word off_8071EB0 // [*const MapScript; CENTRAL_AREA_NUM_MAPS]
	.word off_8071EBC // [*const MapScript; CENTRAL_AREA_NUM_MAPS]
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
#cargo run --release --bin dump_script trace map byte_806C878 &&
#cargo run --release --bin dump_script trace map byte_806C8FC &&
#cargo run --release --bin dump_script trace map byte_806C970 &&
#cargo run --release --bin dump_script trace map byte_806CA6C &&
#cargo run --release --bin dump_script trace map byte_806CAE4 &&
													
#cargo run --release --bin dump_script trace map byte_806C8B9 &&
#cargo run --release --bin dump_script trace map byte_806C93C &&
#cargo run --release --bin dump_script trace map byte_806C9E8 &&
#cargo run --release --bin dump_script trace map byte_806CAB0 &&
#cargo run --release --bin dump_script trace map byte_806CAF6 &&

#cargo run --release --bin dump_script range npc off_806CAF8 byte_806D6A2 &&
#cargo run --release --bin dump_script struct_range byte_806C5D0 byte_806C748 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&

#cargo run --release --bin dump_script trace map byte_806E1C0 &&
#cargo run --release --bin dump_script trace map byte_806E384 &&
#cargo run --release --bin dump_script trace map byte_806E3CC &&
#cargo run --release --bin dump_script trace map byte_806E43C &&
#cargo run --release --bin dump_script trace map byte_806E554 &&
#cargo run --release --bin dump_script trace map byte_806E560 &&
#cargo run --release --bin dump_script trace map byte_806E56C &&
#cargo run --release --bin dump_script trace map byte_806E5DC &&
#cargo run --release --bin dump_script trace map byte_806E6B4 &&
#cargo run --release --bin dump_script trace map byte_806E788 &&
#cargo run --release --bin dump_script trace map byte_806E820 &&
#cargo run --release --bin dump_script trace map byte_806E87C &&
#cargo run --release --bin dump_script trace map byte_806E908 &&
#cargo run --release --bin dump_script trace map byte_806E994 &&
#cargo run --release --bin dump_script trace map byte_806EA20 &&
#cargo run --release --bin dump_script trace map byte_806EAAC &&
													
#cargo run --release --bin dump_script trace map byte_806E32F &&
#cargo run --release --bin dump_script trace map byte_806E3CB &&
#cargo run --release --bin dump_script trace map dword_806E438 &&
#cargo run --release --bin dump_script trace map byte_806E4DA &&
#cargo run --release --bin dump_script trace map byte_806E55E &&
#cargo run --release --bin dump_script trace map byte_806E56A &&
#cargo run --release --bin dump_script trace map dword_806E5D8 &&
#cargo run --release --bin dump_script trace map byte_806E65C &&
#cargo run --release --bin dump_script trace map byte_806E72D &&
#cargo run --release --bin dump_script trace map byte_806E7E6 &&
#cargo run --release --bin dump_script trace map byte_806E87B &&
#cargo run --release --bin dump_script trace map byte_806E8CE &&
#cargo run --release --bin dump_script trace map byte_806E95A &&
#cargo run --release --bin dump_script trace map byte_806E9E6 &&
#cargo run --release --bin dump_script trace map byte_806EA72 &&
#cargo run --release --bin dump_script trace map byte_806EB07 &&

#cargo run --release --bin dump_script range npc off_806EB08 byte_806FA80 &&
													
#cargo run --release --bin dump_script trace map byte_8071F18 &&
#cargo run --release --bin dump_script trace map byte_80723D0 &&
#cargo run --release --bin dump_script trace map byte_80726C0 &&
													
#cargo run --release --bin dump_script trace map byte_8072221 &&
#cargo run --release --bin dump_script trace map byte_807254C &&
#cargo run --release --bin dump_script trace map byte_80728DC &&

cargo run --release --bin dump_script range npc off_8072BC8 byte_8074F17
````

2025-12-11 Wk 50 Thu - 11:15 +03:00

````
Tracing npcscript Identifier { s: "byte_806CB40" }

thread 'main' panicked at src/bin/dump_script.rs:237:25:
No terminating command before failing to read npcscript instructions at Identifier { s: "byte_806CB40" }: Partial read Error. Original error: Failed to route the command: No instruction schema found for position 56 and byte 0x90. Parsed Instructions: [Inst { name: "ns_set_active_and_visible", cmd: 8, opt_subcmd: None, fields: [] }, Inst { name: "ns_disable_collision", cmd: 31, opt_subcmd: None, fields: [] }, Inst { name: "ns_disable_collision_alternate", cmd: 39, opt_subcmd: None, fields: [] }, Inst { name: "ns_set_sprite", cmd: 23, opt_subcmd: None, fields: [U8("byte1", 55)] }, Inst { name: "ns_set_coords", cmd: 20, opt_subcmd: None, fields: [U16("hword1", 10), U16("hword3", 65526), U16("hword5", 0)] }, Inst { name: "ns_set_animation", cmd: 22, opt_
````

Once again there are npc lists we need to identify.

2025-12-11 Wk 50 Thu - 14:23 +03:00

We can now dump structs that we encode manually.  For example:

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script struct byte_8071D14 "Bn6f::MapObjectSpawnData" --ffstop32
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
git commit -m "add ability to dump manual structs we encode with dump_script"

# out
[main 742f020] add ability to dump manual structs we encode with dump_script
 4 files changed, 541 insertions(+), 322 deletions(-)
 create mode 100644 src/bytecode/manual_structs.rs
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script struct byte_8071D7C "Bn6f::MapObjectSpawnData" --ffstop32 &&
cargo run --release --bin dump_script struct byte_8071DF8 "Bn6f::MapObjectSpawnData" --ffstop32 &&
cargo run --release --bin dump_script struct byte_804CFBC "Bn6f::MapObjectSpawnData" --ffstop32 &&
cargo run --release --bin dump_script struct byte_804CFD4 "Bn6f::MapObjectSpawnData" --ffstop32
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script struct_range byte_806DD2C byte_806DF70 "Bn6f::MapObjectSpawnData" --ffstop32
````

````
cargo run --release --bin dump_script struct XXXX "Bn6f::MapObjectSpawnData" --ffstop32 &&
````

Some structs can be rendered quickly via

````
:%s/u\([0-9]*\) *\([A-Za-z_][A-Za-z_0-9]*\), \\\([A-Za-z_][A-Za-z_0-9]*\).*/FieldSchema::U\1("\3".to_owned()),/g
````

If we're just looking at U8/U16/U32. ChipData.inc for example.

2025-12-11 Wk 50 Thu - 15:19 +03:00

Changed `--fstop32` to `--stop <STOP>`, with values ffstop32 and zstop32 right now.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script struct ChipDataArr_8021DA8 "Bn6f::ChipData"
````

`dword_802412C` is likely a fake pointer. It looked like it was used in `encryption_initAll_8006d00` but it's just used in EOR with RNG. Removing alongside with `loc_803ED90`.  now we can remove `chip_data_arr_8024110` and reprocess `ChipDataArr_8021DA8`.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script struct ChipDataArr_8021DA8 "Bn6f::ChipData" --stop zstop32
````

2025-12-12 Wk 50 Fri - 00:24 +03:00

````sh
cargo run --release --bin dump_script struct byte_8071D14 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
cargo run --release --bin dump_script struct byte_8071D7C "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
cargo run --release --bin dump_script struct byte_8071DF8 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
cargo run --release --bin dump_script struct byte_804CFBC "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
cargo run --release --bin dump_script struct byte_804CFD4 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
cargo run --release --bin dump_script struct_range byte_806DD2C byte_806DF70 "Bn6f::MapObjectSpawnData" --stop ffstop32
````

2025-12-12 Wk 50 Fri - 01:10 +03:00

````
Tracing npcscript Identifier { s: "byte_806D16C" }

No terminating command before failing to read npcscript instructions at Identifier { s: "byte_806D16C" }: Partial read Error. Original error: Inst InstSchema { name: "ns_wait_cutscene_var", cmd: 63, opt_subcmd: None, fields: [U8("byte1"), U8("byte2")] } overflows buffer size 16 at position 14. Parsed Instructions: [Inst { name: "ns_set_active_and_visible", cmd: 8, opt_subcmd: None, fields: [] }, Inst { name: "ns_disable_collision", cmd: 31, opt_subcmd: None, fields: [] }, Inst { name: "ns_disable_collision_alternate", cmd: 39, opt_subcmd: None, fields: [] }, Inst { name: "ns_set_sprite", cmd: 23, opt_subcmd: None, fields: [U8("byte1", 72)] }, Inst { name: "ns_set_coords", cmd: 20, opt_subcmd: None, fields: [U16("hword1", 70), U16("hword3", 82), U16("hword5", 0)] }, Inst { name: "ns_set_animation", cmd: 22, opt_subcmd: None, fields: [U8("byte1", 1)] }]
````

We're overflowing `byte_806D17C`, which has no reference. Removing.

2025-12-12 Wk 50 Fri - 01:56 +03:00

````
./data/dat21.s: Assembler messages:
./data/dat21.s:448: Error: Parameter named `byte1' does not exist for macro `cs_wait_if_player_sprite_cur_frame_not_equal_maybe'
````

````C
// in include/bytecode/cutscene_script.inc
	enum cs_wait_if_player_sprite_cur_frame_not_equal_maybe_cmd // 0x05
// 0x05 byte1
// wait script if the player sprite's current frame doesn't equal byte1
// byte1 - anim frame to compare
	.macro cs_wait_if_player_sprite_cur_frame_not_equal_maybe
	.byte cs_wait_if_player_sprite_cur_frame_not_equal_maybe_cmd
	.endm
````

It should have `byte1:req`:

````C
	.macro cs_wait_if_player_sprite_cur_frame_not_equal_maybe byte1:req
	.byte cs_wait_if_player_sprite_cur_frame_not_equal_maybe_cmd
	.byte \byte1
	.endm
````

^V tab in vim to force an actual tab character rather than spaces (if configured).

2025-12-12 Wk 50 Fri - 02:15 +03:00

````
Tracing npcscript Identifier { s: "byte_806CCD0" }

No terminating command before failing to read npcscript instructions at Identifier { s: "byte_806CCD0" }: Partial read Error. Original error: Inst InstSchema { name: "ns_jump_with_link", cmd: 54, opt_subcmd: None, fields: [Dest("destination1")] } overflows buffer size 32 at position 29. Parsed Instructions: /*...*/
````

We're overflowing `off_806CCF0`. Also points to nothing. Removing.

````
Tracing npcscript Identifier { s: "byte_806D144" }

thread 'main' panicked at src/bin/dump_script.rs:362:25:
No terminating command before failing to read npcscript instructions at Identifier { s: "byte_806D144" }: Partial read Error. Original error: Inst InstSchema { name: "ns_wait_mystery_data_taken", cmd: 69, opt_subcmd: None, fields: [U16("hword1")] } overflows buffer size 8 at position 7. Parsed Instructions: /*...*/
````

Overflowing `off_806D14C` which also refers to nothing. Removing.

2025-12-12 Wk 50 Fri - 05:22 +03:00

````
./asm/asm23.s: Assembler messages:
./asm/asm23.s:16: Error: agbasm colonless label `push' does not end with a newline, assuming not a label
````

````diff
        thumb_local_start
 sub_8088CA0:
-       push {lr}
+       .word 0xF77DB500, 0x2000F871, 0x0000BD00, 0x40010000, 0x08000002, 0x0206003F, 0xFF271EFF, 0x3E07080C
+       .word CompText87B330C + COMPRESSED_PTR_FLAG, 0x8CAC0054, 0x024A0808, 0x08059110, 0x1C3F343F, 0x271EFF02, 0x070808FF, 0x088D2F14
+       .word 0x1EFF0208, 0x0400FF3A, 0x3CFF0280, 0x00000014, 0x0CFF2700, 0x00520708, 0xFF2A0160, 0xFF291715
+       .word 0x034A0682, 0x403B0154, 0x4701FF04, 0x4101FF00, 0x4001FF00, 0x00024000, 0x29303F00, 0x02066CFF
+       .word 0xFF4E3CFF, 0x08FF27FF, 0x183F0708, 0x3C00043F, 0xEC154000, 0x0008088C, 0x40F9C000, 0x080000FF
+
+cutscenescript_8088D40:
+       .word 0x3E06003F, CompText87B36EC + COMPRESSED_PTR_FLAG, 0x5401FF02, 0x088D3800, 0xF4024A08, 0x3F0806EC, 0x021C3F34, 0xFF271EFF
+       .word 0x14070800, dword_8088DAC, 0x3A1EFF02, 0x800400FF
+       .byte 0x02
+       .byte 0xFF
+       .byte 0x3C
+push {lr}
````

Cut at a function. Need to handle manually.

````C
	thumb_local_start
sub_8088CA0:
  push {lr}
	bl sub_8005D88
	mov r0, #0
	pop {pc}
	.balign 4, 0
	thumb_func_end sub_8088CA0

end_func_8088CAC::
	.byte 0x0, 0x0, 0x1, 0x40, 0x2, 0x0, 0x0, 0x8, 0x3F, 0x0, 0x6, 0x2, 0xFF, 0x1E
	.byte 0x27, 0xFF, 0xC, 0x8, 0x7, 0x3E, 0xC, 0x33, 0x7B, 0x88, 0x54, 0x0, 0xAC, 0x8C
	// ...
````

2025-12-12 Wk 50 Fri - 07:08 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
python3 tools/fdiff.py bn6f.ign bn6f.gba

# out
Found diff #0 @ 09F86C: bin1=0x8007628 bin2=0x8007629
````

We get a failed build.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 809F86C

# out
thread 'main' panicked at src/bin/expt000_read_symbol_data.rs:124:25:
RomEa { ea: 134871148 } is not in map. But it is between Identifier { s: "npcscript_809F7F4" } and Identifier { s: "byte_809F878" }
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

````C
npcscript_809F86C:
	.word sub_8007628, 0xC02A002E, 0x00000003
````

````diff
-       .word 0x00390916, 0x04390D16, 0x0000003A, 0x00390F16, 0x04390B16, 0x0000003A, 0x08007628, 0xC02A002E
-       .word 0x00000003
+       .word 0x00390916, 0x04390D16, 0x0000003A, 0x00390F16, 0x04390B16, 0x0000003A
+
+npcscript_809F86C:
+       .word sub_8007628, 0xC02A002E, 0x00000003
````

`0x08007628` got turned into `sub_8007628`, and it seems this made it become an odd due to it being a sub... Regardless of whether you add `+1` or not, it's assembled into an odd value. Anyway this looks like a suspicious pointer too, hardcoding.

2025-12-12 Wk 50 Fri - 08:15 +03:00

````
Tracing ccs Identifier { s: "ccs_808DF8C" }

thread 'main' panicked at src/bin/dump_script.rs:330:25:
No instructions read, and yet we fail to read ccs instructions at Identifier { s: "ccs_808DF8C" }: Partial read Error. Original error: Inst InstSchema { name: "ccs_set_camera_pos", cmd: 0, opt_subcmd: None, fields: [U16("hword1"), U16("hword3"), U16("hword5")] } overflows buffer size 1 at position 0. Parsed Instructions: []
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

`end_cutscenescript_808DF8D` is being overflown. It was determined when the script `ccs_808DF8C` was not cut yet. Let's remove it.

2025-12-12 Wk 50 Fri - 09:07 +03:00

````
Tracing cutscenescript Identifier { s: "cutscenescript_808DF94" }
0 new_inst: Inst { name: "cs_lock_player_for_non_npc_dialogue_809e0b0", cmd: 63, opt_subcmd: Some(U8(0)), fields: [] }
2 new_inst: Inst { name: "cs_nop_80377d0", cmd: 6, opt_subcmd: None, fields: [] }
3 new_inst: Inst { name: "cs_decomp_text_archive", cmd: 62, opt_subcmd: None, fields: [Ptr("ptr1", RomCompressed(CompressedRomEa { ea: 142340052 }))] }
8 new_inst: Inst { name: "cs_pause", cmd: 2, opt_subcmd: None, fields: [U8("byte1", 255), U8("byte2", 1)] }
11 new_inst: Inst { name: "cs_run_cutscene_camera_script", cmd: 84, opt_subcmd: Some(U8(0)), fields: [Ptr("ptr1", Rom(RomEa { ea: 134799244 }))] }
																																  ^~~~ This is ccs_808DF8C
````

`ccs_808DF8C` overflows `cutscenescript_808DF94`... but `cutscenescript_808DF94` references `ccs_808DF8C`...

````
ccs_808DF8C:
	.byte 0x00
	.word 0xF40000C0
	.byte 0x00
	.byte 0x00
	.byte 0x08

cutscenescript_808DF94:
	.word 0x3E06003F, CompText87BEFD4 + COMPRESSED_PTR_FLAG, 0x5401FF02, 0x08DF8C00, 0x5C024A08, 0x3F0806F6, 0x291C3F34, 0x2A0088FF
	.word 0x270089FF, 0x070808FF, 0x08E02A14, 0x1EFF0208, 0x0400FF3A, 0x1EFF0280, 0x0088FF2A, 0x0089FF29
	.word 0x0201734D, 0x08353CFF, 0x02080901, 0x3A1EFF02, 0x800401FF
	.byte 0x02
	.byte 0xFF
	.byte 0x3C
````

````
Tracing mapscript Identifier { s: "byte_806E605" }
0 new_inst: Inst { name: "ms_jump_if_flag_clear", cmd: 5, opt_subcmd: None, fields: [U8("byte1", 255), Event16("event16_2", 2667), Dest("destination4", RomEa { ea: 134669878 })] }
8 new_inst: Inst { name: "ms_jump_if_flag_clear", cmd: 5, opt_subcmd: None, fields: [U8("byte1", 255), Event16("event16_2", 2583), Dest("destination4", RomEa { ea: 134669878 })] }
16 new_inst: Inst { name: "ms_jump_if_flag_set", cmd: 3, opt_subcmd: None, fields: [U8("byte1", 255), Event16("event16_2", 2584), Dest("destination4", RomEa { ea: 134669878 })] }
24 new_inst: Inst { name: "ms_set_event_flag", cmd: 31, opt_subcmd: None, fields: [U8("byte1", 255), Event16("event16_2", 2668)] }
28 new_inst: Inst { name: "ms_set_event_flag", cmd: 31, opt_subcmd: None, fields: [U8("byte1", 255), Event16("event16_2", 2584)] }
32 new_inst: Inst { name: "ms_set_enter_map_screen_fade", cmd: 30, opt_subcmd: None, fields: [U8("byte1", 12), U8("byte2", 255)] }
35 new_inst: Inst { name: "ms_start_cutscene", cmd: 38, opt_subcmd: None, fields: [Ptr("ptr1", Rom(RomEa { ea: 134799252 })), U32("word5", 0)] }
																											   ^~~~ this is cutscenescript_808DF94
44 new_inst: Inst { name: "ms_jump", cmd: 1, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 1346698
````

`byte_806E605` references `cutscenescript_808DF94`.

````C
// in include/bytecode/cutscene_camera_script.inc
	enum ccs_set_camera_pos_cmd // 0x00
// 0x0 hword1 hword3 hword5
// set the camera position
// hword1 - x coord
// hword3 - y coord
// hword5 - z coord
	.macro ccs_set_camera_pos hword1:req hword3:req hword5:req
	.byte ccs_set_camera_pos_cmd
	.hword \hword1
	.hword \hword3
	.hword \hword5
	.endm
````

Command `0x0` has size 7.

````
ccs_808DF8C:
	.byte 0x00       // 0
	.word 0xF40000C0 // 1
	.byte 0x00       // 5
	.byte 0x00       // 6
	.byte 0x08
````

It shouldn't be overflowing.

2025-12-12 Wk 50 Fri - 09:23 +03:00

Not sure what that was. It went on after clearing the cache again.

Oh actually it seems we're not building `bn6f.sym` with

````
make clean > /dev/null && make -j$(nproc) assets > /dev/null && make -j$(nproc)
````

As we were with

````
make clean && make -j$(nproc) assets && make -j$(nproc) && make bn6f.sym
````

So removing the previous label causing the overflow likely just didn't register.

2025-12-12 Wk 50 Fri - 09:34 +03:00

````diff
        thumb_local_start
 sub_808BEFC:
-       push {lr}
+       .word 0xF779B500, 0x2000FF43, 0x0000BD00, 0x40F9C000, 0x080000FF
+
+cutscenescript_808BF10:
+       .word 0x3E06003F, CompText87BBF74 + COMPRESSED_PTR_FLAG, 0x5401FF02, 0x08BF0800, 0xD0024A08, 0x3F0806F8, 0x021C3F34, 0xFF271EFF
+       .word 0x14070800, dword_808BF8C, 0x3A1EFF02, 0x800400FF
+       .byte 0x02
+       .byte 0xFF
+       .byte 0x3C
+push {lr}
        bl sub_8005D88
        mov r0, #0
        pop {pc}
````

Ambiguous data after function. Cutting at end of function:

````C
	thumb_local_start
sub_808BEFC:
	push {lr}
	bl sub_8005D88
	mov r0, #0
	pop {pc}
	thumb_func_end sub_808BEFC
	.balign 4, 0

end_func_808bf08:
	.byte 0x0, 0xC0, 0xF9, 0x40, 0xFF, 0x0, 0x0, 0x8, 0x3F, 0x0, 0x6, 0x3E
	.byte 0x74, 0xBF, 0x7B, 0x88, 0x2, 0xFF, 0x1, 0x54, 0x0, 0x8, 0xBF, 0x8
	// ...
````

2025-12-12 Wk 50 Fri - 18:25 +03:00

````
Tracing npcscript Identifier { s: "off_806F998" }

thread 'main' panicked at src/bin/dump_script.rs:330:25:
No instructions read, and yet we fail to read npcscript instructions at Identifier { s: "off_806F998" }: Partial read Error. Original error: Failed to route the command: No instruction schema found for position 0 and byte 0xA8. Parsed Instructions: []
````

Removing unreferenced `off_806F99C` in the middle of npc list `off_806F998`.

2025-12-12 Wk 50 Fri - 18:50 +03:00

````
script RomEa { ea: 134684576 } "mapscript_8071FA0": We can only cut in ROM EAs: Ewram(EwramEa { ea: 33627832 })
````

````sh
python3 -c "print(hex(33627832))"

# out
0x2011eb8
````

````C
# in ewram.s
unk_2011EB4:: // 0x2011eb4
	.space 44
````

````C
# in ewram.s
unk_2011EB4:: // 0x2011eb4
  .space 4
unk_2011EB8:: // 0x2011eb8
	.space 40
````

2025-12-12 Wk 50 Fri - 19:14 +03:00

````
./asm/asm28_0.s: Assembler messages:
./asm/asm28_0.s:613: Error: symbol `thumb_local_start' is already defined
````

Had to correct the instance at that location as its the first, but there's also

````
unk_8073EE5:
	.word 0x3F4657B5, 0x00200269, 0x01677804, 0xB8034020, 0x05F02B67
	.byte 0xFD
	.byte 0xF0
	.byte 0xBD
thumb_local_start
sub_8073EFC::
````

````
Tracing cutscenescript Identifier { s: "cutscenescript_8092C20" }

./asm/asm37_1.s:4059: Error: agbasm colonless label `mov' does not end with a newline, assuming not a label
./asm/asm37_1.s:4059: Error: immediate expression requires a # prefix -- `mov r0, #1'
````

````diff
        thumb_local_start
 sub_8143F38:
-       mov r0, #1
+       .word 0xE0002001
+       .byte 0x00
+
+unk_8143F3D:
+       .byte 0x20
+mov r0, #1
        b loc_8143F3E
        mov r0, #0
````

It should be

````C
	thumb_local_start
sub_8143F38:
	mov r0, #1
	b loc_8143F3E
call_8143F3C::
	mov r0, #0
loc_8143F3E:
````

2025-12-12 Wk 50 Fri - 20:02 +03:00

Seems we're looping.

````
Tracing cutscenescript Identifier { s: "byte_8099CEC" }
Tracing cutscenescript Identifier { s: "byte_8099D23" }
Tracing mapscript Identifier { s: "mapscript_80720EA" }
Tracing mapscript Identifier { s: "mapscript_807210A" }
Tracing mapscript Identifier { s: "mapscript_807212A" }
Tracing mapscript Identifier { s: "mapscript_807214A" }
Tracing mapscript Identifier { s: "mapscript_807216A" }
Tracing mapscript Identifier { s: "mapscript_807218A" }
Tracing mapscript Identifier { s: "mapscript_80721AA" }
Tracing mapscript Identifier { s: "mapscript_80721CA" }
Tracing mapscript Identifier { s: "mapscript_80721EA" }
Tracing mapscript Identifier { s: "byte_8072220" }
Tracing cutscenescript Identifier { s: "byte_8099CEC" }
Tracing cutscenescript Identifier { s: "byte_8099D23" }
Tracing mapscript Identifier { s: "byte_8072220" }
Tracing cutscenescript Identifier { s: "byte_80990B8" }
Tracing cutscenescript Identifier { s: "byte_80990CF" }
Tracing mapscript Identifier { s: "byte_8072220" }
Tracing cutscenescript Identifier { s: "byte_80990B8" }
Tracing cutscenescript Identifier { s: "byte_80990CF" }
Tracing mapscript Identifier { s: "byte_8072220" }
Tracing cutscenescript Identifier { s: "byte_80990B8" }
Tracing cutscenescript Identifier { s: "byte_80990CF" }
Tracing mapscript Identifier { s: "byte_8072220" }
Tracing cutscenescript Identifier { s: "byte_80990B8" }
Tracing cutscenescript Identifier { s: "byte_80990CF" }
Tracing mapscript Identifier { s: "byte_8072220" }
Tracing cutscenescript Identifier { s: "byte_80990B8" }
Tracing cutscenescript Identifier { s: "byte_80990CF" }
Tracing mapscript Identifier { s: "byte_8072220" }
Tracing cutscenescript Identifier { s: "byte_80990B8" }
Tracing cutscenescript Identifier { s: "byte_80990CF" }
Tracing mapscript Identifier { s: "byte_8072220" }
Tracing cutscenescript Identifier { s: "byte_80990B8" }
Tracing cutscenescript Identifier { s: "byte_80990CF" }
Tracing mapscript Identifier { s: "byte_8072220" }
Tracing cutscenescript Identifier { s: "byte_80990B8" }
Tracing cutscenescript Identifier { s: "byte_80990CF" }
Tracing mapscript Identifier { s: "byte_8072220" }
Tracing cutscenescript Identifier { s: "byte_80990B8" }
Tracing cutscenescript Identifier { s: "byte_80990CF" }
Tracing mapscript Identifier { s: "dword_80720BC" }
Tracing mapscript Identifier { s: "byte_8072220" }
Tracing mapscript Identifier { s: "mapscript_8072207" }
Tracing mapscript Identifier { s: "byte_8072220" }
Tracing cutscenescript Identifier { s: "byte_8099CEC" }
Tracing cutscenescript Identifier { s: "byte_8099D23" }
````

2025-12-12 Wk 50 Fri - 20:15 +03:00

Now propagating the processed traces into the recursive process so that any already processed items are skipped.

````rust
fn trace_read_insts_recur_or_cut_or_fail(
    app_settings: &AppSettings,
    symbol_data: &SymbolData,
    script_type: &ScriptType,
    ea_syms: &[(Ea, bool, Identifier)],
    processed_items: &[ScriptTraceRecord],
) -> Vec<ScriptTraceRecord> {
    let prefix = script_type_to_prefix_or_fail(script_type);

    // If we are part of the processed items, just skip.
    let in_processed_items = processed_items
        .iter()
        .map(|item| item.symbol_data.ea.ea)
        .any(|ea| ea == symbol_data.ea.ea);

    if in_processed_items {
        return vec![];
    }
````

We previously dealt with this case on direct recursion `A <-> A` but other forms of recursion can happen like `A -> B -> C -> A`.

2025-12-12 Wk 50 Fri - 20:21 +03:00

````
Dumping Identifier { s: "mapscript_8071F6B" }

bn6f.gba: FAILED
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
python3 tools/fdiff.py bn6f.ign bn6f.gba

# out
Found diff #0 @ 071F78: bin1=0x88011608 bin2=0x88001608
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 8071F78

# out
RomEa { ea: 134684536 } is not in map. But it is between Identifier { s: "mapscript_8071F6B" } and Identifier { s: "mapscript_8071F88" }
````

````C
mapscript_8071F6B:
	ms_jump_if_flag_clear byte1=0xFF event16_2=EVENT_2B destination4=mapscript_8071F88
	ms_run_secondary_continuous_map_script ptr2=mapscript_80723C6
	ms_jump_if_map_group_equals_last_map_group destination2=mapscript_8071F88
	ms_call_native_function ptr1=sub_8072BA4+1 ptr5=NULL
````

This is the first time `ms_run_secondary_continuous_map_script` and `ms_jump_if_map_group_equals_last_map_group` have been encountered.

````
Tracing mapscript Identifier { s: "mapscript_8071F6B" }
0 new_inst: Inst { name: "ms_jump_if_flag_clear", cmd: 5, opt_subcmd: None, fields: [U8("byte1", 255), Event16("event16_2", 43), Dest("destination4", RomEa { ea: 134684552 })] }
8 new_inst: Inst { name: "ms_run_secondary_continuous_map_script", cmd: 58, opt_subcmd: Some(U8(0)), fields: [Ptr("ptr2", Rom(RomEa { ea: 134685638 }))] }
14 new_inst: Inst { name: "ms_jump_if_map_group_not_equal_last_map_group", cmd: 22, opt_subcmd: Some(U8(0)), fields: [Dest("destination2", RomEa { ea: 134684552 })] }
20 new_inst: Inst { name: "ms_call_native_function", cmd: 37, opt_subcmd: None, fields: [Ptr("ptr1", Rom(RomEa { ea: 134687653 })), Ptr("ptr5", Null)] }
````

````sh
python3 -c "print(0x8071F78 - 0x8071F6B)"

# out
13
````

~~So the issue happened with `ms_run_secondary_continuous_map_script` since we are within its bounds 8-14.~~ (we cross instruction boundaries in that diff u32 compare)

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
xxd -g1 -s +$(python3 -c "print(0x71F6B)") bn6f.ign | less

# out (relevant)
00071f6b: 05 ff 2b 00 88 1f 07 08 3a 00 c6 23 07 08 16 01  ..+.....:..#....
00071f7b: 88 1f 07 08 25 a5 2b 07 08 00 00 00 00 02 21 21  ....%.+.......!!
````

````
00071f6b: 05 ff 2b 00 88 1f 07 08 3a 00 c6 23 07 08 16 01  ..+.....:..#....
		  c0                      c8                c14
00071f7b: 88 1f 07 08 25 a5 2b 07 08 00 00 00 00 02 21 21  ....%.+.......!!
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
xxd -g1 -s +$(python3 -c "print(0x71F6B)") bn6f.gba | less

# out (relevant)
00071f6b: 05 ff 2b 00 88 1f 07 08 3a 00 c6 23 07 08 16 00  ..+.....:..#....
00071f7b: 88 1f 07 08 25 a5 2b 07 08 00 00 00 00 02 21 21  ....%.+.......!!
````

````
00071f6b: 05 ff 2b 00 88 1f 07 08 3a 00 c6 23 07 08 16 00  ..+.....:..#....
		  c0                      c8                c14
00071f7b: 88 1f 07 08 25 a5 2b 07 08 00 00 00 00 02 21 21  ....%.+.......!!
````

Okay the byte mismatch is at `ms_jump_if_map_group_equals_last_map_group`.

````diff
// in include/bytecode/map_script.inc
	subenum ms_jump_if_map_group_equals_last_map_group_subcmd // 0x1
// 0x16 0x01 destination2
// jump if the current map group equals the last map group
// destination2 - script to jump to
	.macro ms_jump_if_map_group_equals_last_map_group destination2:req
	.byte ms_jump_if_map_group_compare_last_map_group_cmd
-	.byte ms_jump_if_map_group_not_equal_last_map_group_subcmd
+	.byte ms_jump_if_map_group_equals_last_map_group_subcmd
	.word \destination2
	.endm
````

2025-12-12 Wk 50 Fri - 20:59 +03:00

````
Tracing mapscript Identifier { s: "byte_80723D0" }
0 new_inst: Inst { name: "ms_set_event_flag_range", cmd: 33, opt_subcmd: None, fields: [U8("byte1", 24), Event16("event16_2", 5712)] }
4 new_inst: Inst { name: "ms_set_event_flag_range", cmd: 33, opt_subcmd: None, fields: [U8("byte1", 48), Event16("event16_2", 5744)] }
8 new_inst: Inst { name: "ms_jump_if_progress_in_range", cmd: 2, opt_subcmd: None, fields: [U8("byte1", 32), U8("byte2", 47), Dest("destination3", RomEa { ea: 134685682 })] }
15 new_inst: Inst { name: "ms_jump_if_progress_in_range", cmd: 2, opt_subcmd: None, fields: [U8("byte1", 80), U8("byte2", 95), Dest("destination3", RomEa { ea: 134685757 })] }
22 new_inst: Inst { name: "ms_jump_if_progress_in_range", cmd: 2, opt_subcmd: None, fields: [U8("byte1", 96), U8("byte2", 143), Dest("destination3", RomEa { ea: 134685823 })] }
29 new_inst: Inst { name: "ms_jump", cmd: 1, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 134685879 })] }
34 new_inst: Inst { name: "ms_jump_if_flag_clear", cmd: 5, opt_subcmd: None, fields: [U8("byte1", 255), Event16("event16_2", 43), Dest("destination4", RomEa { ea: 134685711 })] }
42 new_inst: Inst { name: "ms_run_secondary_continuous_map_script", cmd: 58, opt_subcmd: Some(U8(0)), fields: [Ptr("ptr2", Rom(RomEa { ea: 134686390 }))] }
48 new_inst: Inst { name: "ms_jump_if_map_group_equals_last_map_group", cmd: 22, opt_subcmd: Some(U8(1)), fields: [Dest("destination2", RomEa { ea: 134685711 })] }


No terminating command before failing to read mapscript instructions at Identifier { s: "byte_80723D0" }: Partial read Error. Original error: Inst InstSchema { name: "ms_call_native_function", cmd: 37, opt_subcmd: None, fields: [Ptr("ptr1"), Ptr("ptr5")] } Failed to read fields at position 54: Invalid Ea processed in field Ptr("ptr5"): Effective address 1 is invalid.. Parsed Instructions: /*...*/
````

````sh
python3 -c "print(hex(0x80723D0 + 54))"

# out
0x8072406
````

````
cargo run --bin expt000_read_symbol_data 8072406 -M "end_mapscript_8072406"
````

Actually all instances of `ms_call_native_function` we've encountered so far had `ptr5` set to NULL. We have probably been wrong about `ptr5`. We should change it to `word5` instead. Let's correct the existing instances manually to 0. and remove `end_mapscript_8072406`.

To fix, just select all uses of `ms_call_native_function` in quickfix in vim and run

````
:cdo :%s/ptr5=NULL/word5=0x00000000/g
````

2025-12-13 Wk 50 Sat - 01:57 +03:00

````
script RomEa { ea: 134686424 } "dword_80726D8": We can only cut in ROM EAs: Ewram(EwramEa { ea: 33627836 })
````

````sh
python3 -c "print(hex(33627836))"

# out
0x2011ebc
````

````
script RomEa { ea: 134686424 } "dword_80726D8": We can only cut in ROM EAs: Ewram(EwramEa { ea: 33627840 })
````

````C
# in ewram.s
unk_2011EB8:: // 0x2011eb8
	.space 4
unk_2011EBC:: // 0x2011ebc
	.space 4
unk_2011EC0:: // 0x2011ec0
	.space 32
````

2025-12-13 Wk 50 Sat - 02:18 +03:00

````
Tracing cutscenescript Identifier { s: "cutscenescript_8088B40" }

./data/dat22.s:1256: Error: agbasm colonless label `thumb_func_end' does not end with a newline, assuming not a label
````

Relocated end of function and tabbed it.

2025-12-13 Wk 50 Sat - 03:06 +03:00

````
Tracing ccs Identifier { s: "ccs_808478C" }

No instructions read, and yet we fail to read ccs instructions at Identifier { s: "ccs_808478C" }: Partial read Error. Original error: Inst InstSchema { name: "ccs_set_camera_pos", cmd: 0, opt_subcmd: None, fields: [U16("hword1"), U16("hword3"), U16("hword5")] } overflows buffer size 1 at position 0. Parsed Instructions: []
````

Removing overflown `end_cutscenescript_808478D`.

2025-12-13 Wk 50 Sat - 03:26 +03:00

````
Tracing ccs Identifier { s: "ccs_80880F0" }

No instructions read, and yet we fail to read ccs instructions at Identifier { s: "ccs_80880F0" }: Partial read Error. Original error: Inst InstSchema { name: "ccs_set_camera_pos", cmd: 0, opt_subcmd: None, fields: [U16("hword1"), U16("hword3"), U16("hword5")] } overflows buffer size 1 at position 0. Parsed Instructions: []
````

Removing overflown `end_cutscenescript_80880F1`.

2025-12-13 Wk 50 Sat - 03:35 +03:00

````
Tracing ccs Identifier { s: "ccs_8088ACC" }

No instructions read, and yet we fail to read ccs instructions at Identifier { s: "ccs_8088ACC" }: Partial read Error. Original error: Inst InstSchema { name: "ccs_set_camera_pos", cmd: 0, opt_subcmd: None, fields: [U16("hword1"), U16("hword3"), U16("hword5")] } overflows buffer size 1 at position 0. Parsed Instructions: []
````

Removing overflown `end_cutscenescript_8088ACD`.

2025-12-13 Wk 50 Sat - 04:42 +03:00

````
Tracing npcscript Identifier { s: "off_807360C" }

No instructions read, and yet we fail to read npcscript instructions at Identifier { s: "off_807360C" }: Partial read Error. Original error: Failed to route the command: No instruction schema found for position 0 and byte 0x7C. Parsed Instructions: []
````

`off_8073610` is an unused reference in the middle of an npc script list `off_807360C`. Removing `off_8073610`.

2025-12-13 Wk 50 Sat - 05:32 +03:00

````
Process in range: end_npcscript_8073EE4
Tracing npcscript Identifier { s: "end_npcscript_8073EE4" }

thread 'main' panicked at src/bin/dump_script.rs:343:25:
No instructions read, and yet we fail to read npcscript instructions at Identifier { s: "end_npcscript_8073EE4" }: Partial read Error. Original error: Failed to route the command: No instruction schema found for position 0 and byte 0xF0. Parsed Instructions: []

````

This is undumped code. Have to also correct references of `unk_8073EE5` to `undumped_code_8073EE4+1` and remove `unk_8073EE5`

We need to split the range around code. So to `byte_8073EB4` and from `off_8073F1C`.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
#cargo run --release --bin dump_script range npc off_8072BC8 byte_8073EB4 &&
cargo run --release --bin dump_script range npc off_8073F1C byte_8074F17
````

2025-12-13 Wk 50 Sat - 06:40 +03:00

````
Tracing npcscript Identifier { s: "byte_80746E2" }

bn6f.gba: FAILED
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
python3 tools/fdiff.py bn6f.ign bn6f.gba

# out
Found diff #0 @ 074704: bin1=0x88002E14 bin2=0x88002E15
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 8074704

# out
RomEa { ea: 134694660 } is not in map. But it is between Identifier { s: "byte_8074700" } and Identifier { s: "byte_8074767" }
````

````C
byte_8074700::
	.word 0x1B184117, sub_8002E14 + COMPRESSED_PTR_FLAG, 0x160000FF, 0xF6CC3603, 0x42170809, 0x0A0A2313, 0x26141E18, 0x00FFF8FF
	.word 0x362B1600, byte_809F6CC, 0x410C2004, 0x17080747, 0x142F1841, 0xFFE60078, 0x05160000, 0x09F6CC36
	.word 0x41171308, 0x78142F18, 0x00FFE600, 0x36051600, byte_809F6CC
````

`sub_8002E14 + COMPRESSED_PTR_FLAG` is wrong. This happens to be a correct ea with the `1<<31` set. Hardcoding.

Hardcoding it again, probably retriggered due to more cutting. x2.

2025-12-13 Wk 50 Sat - 07:04 +03:00

OK!
