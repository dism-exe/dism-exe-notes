---
parent: '[[004 Impl dumping for map npc and cutscene scripts]]'
spawned_by: '[[006 Dump scripts via script tracing]]'
context_type: task
status: todo
---

Parent: [004 Impl dumping for map npc and cutscene scripts](../004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts.md)

Spawned by: [006 Dump scripts via script tracing](006%20Dump%20scripts%20via%20script%20tracing.md)

Spawned in: [<a name="spawn-task-c8e433" />^spawn-task-c8e433](006%20Dump%20scripts%20via%20script%20tracing.md#spawn-task-c8e433)

# 1 Journal

2025-12-13 Wk 50 Sat - 02:31 +03:00

As I list these, I need to also specify the NPC range, and go through the data myself and put any npc script list labels that are missing (list of pointers that is terminated with a 0xFF word ie. FFStop32). Can do that quickly by giving them a label like `AAAAAA{N}` and using bn6f.sym to fill in the addresses later. Need to also be aware that the lists sometime begin from the 2nd pointer, like with

````
	.word byte_809F6CC
	.word byte_8054CD8
	.word byte_8054CFF
	.word byte_8054D16
````

So look for contiguous set of addresses. They should be rising, and local to the region the list itself is in.

````
	# Items remaining to process... None!
````

````
	.word off_8052D88 // [*const MapScript; CYBER_ACADEMY_NUM_MAPS]
	.word off_8052DB4 // [*const MapScript; CYBER_ACADEMY_NUM_MAPS]

	.word off_8059D48 // [*const MapScript; SEASIDE_TOWN_NUM_MAPS]
	.word off_8059D5C // [*const MapScript; SEASIDE_TOWN_NUM_MAPS]
	
	.word off_805E15C // [*const MapScript; GREEN_TOWN_NUM_MAPS]
	.word off_805E170 // [*const MapScript; GREEN_TOWN_NUM_MAPS]

	.word off_806063C // [*const MapScript; SKY_TOWN_NUM_MAPS]
	.word off_806064C // [*const MapScript; SKY_TOWN_NUM_MAPS]

	.word off_8062F48 // [*const MapScript; EXPO_SITE_NUM_MAPS]
	.word off_8062F60 // [*const MapScript; EXPO_SITE_NUM_MAPS]
	
	.word off_80665A4 // [*const MapScript; ROBOT_CONTROL_COMP_NUM_MAPS]
	.word off_80665AC // [*const MapScript; ROBOT_CONTROL_COMP_NUM_MAPS]

	.word off_8067DC8 // [*const MapScript; AQUARIUM_COMP_NUM_MAPS]
	.word off_8067DD4 // [*const MapScript; AQUARIUM_COMP_NUM_MAPS]
	
	.word off_80692F8 // [*const MapScript; JUDGETREE_COMP_NUM_MAPS]
	.word off_8069304 // [*const MapScript; JUDGETREE_COMP_NUM_MAPS]

	.word off_806A260 // [*const MapScript; MR_WEATHER_COMP_NUM_MAPS]
	.word off_806A26C // [*const MapScript; MR_WEATHER_COMP_NUM_MAPS]

	.word off_806AE08 // [*const MapScript; PAVILION_COMP_NUM_MAPS]
	.word off_806AE1C // [*const MapScript; PAVILION_COMP_NUM_MAPS]
	
	.word off_807022C // [*const MapScript; COMPS_2_NUM_MAPS]
	.word off_807026C // [*const MapScript; COMPS_2_NUM_MAPS]
	
	.word off_80758A0 // [*const MapScript; SEASIDE_AREA_NUM_MAPS]
	.word off_80758AC // [*const MapScript; SEASIDE_AREA_NUM_MAPS]
	
	.word off_8078104 // [*const MapScript; GREEN_AREA_NUM_MAPS]
	.word off_807810C // [*const MapScript; GREEN_AREA_NUM_MAPS]

	.word off_807952C // [*const MapScript; UNDERGROUND_NUM_MAPS]
	.word off_8079534 // [*const MapScript; UNDERGROUND_NUM_MAPS]
	
	.word off_807ADEC // [*const MapScript; SKY_ACDC_AREA_NUM_MAPS]
	.word off_807ADF8 // [*const MapScript; SKY_ACDC_AREA_NUM_MAPS]

	.word off_807D2F0 // [*const MapScript; UNDERNET_NUM_MAPS]
	.word off_807D300 // [*const MapScript; UNDERNET_NUM_MAPS]
	
	.word dword_807F1F8 // [*const MapScript; GRAVEYARD_NUM_MAPS]
	.word dword_807F204 // [*const MapScript; GRAVEYARD_NUM_MAPS]

````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor

	# CYBER_ACADEMY_NUM_MAPS
	.word byte_8052F90
	.word byte_805356C
	.word byte_80535F4
	.word byte_805367C
	.word byte_8053724
	.word byte_80537C4
	.word byte_80538A8
	.word byte_8053B4C
	.word byte_8053E54
	.word byte_8053F44
	.word byte_8054108

    .word byte_8053371
	.word byte_80535BA
	.word byte_8053642
	.word byte_80536EA
	.word byte_80537C2
	.word byte_80538A0
	.word byte_8053A49
	.word byte_8053D4A
	.word byte_8053EFF
	.word byte_8054041
	.word byte_80541D3

	# SEASIDE_TOWN_NUM_MAPS
	.word dword_8059E34
	.word byte_805A238
	.word byte_805A414
	.word byte_805A998
	.word byte_805AB8C

	.word byte_805A06A
	.word byte_805A348
	.word byte_805A802
	.word byte_805AA76
	.word byte_805AC10

	# GREEN_TOWN_NUM_MAPS
    .word byte_805E248
	.word byte_805E490
	.word byte_805E6B8
	.word byte_805E8E4
	.word byte_805E940

	.word off_805E36C
	.word byte_805E5FC
	.word byte_805E804
	.word byte_805E93E
	.word byte_805E952

	# SKY_TOWN_NUM_MAPS
	.word byte_80606FC
	.word byte_806096C
	.word byte_8060C9C
	.word byte_8060E30

    .word dword_8060834
	.word byte_8060B2F
	.word byte_8060D71
	.word byte_8060F00

	# EXPO_SITE_NUM_MAPS
    .word byte_806305C
	.word byte_8063244
	.word byte_8063410
	.word byte_8063500
	.word byte_80635C8
	.word byte_80636E0

    .word byte_80631B0
	.word byte_80633AC
	.word byte_80634C8
	.word byte_806358F
	.word byte_80636A8
	.word dword_80637B0

	# ROBOT_CONTROL_COMP_NUM_MAPS
	.word byte_80665E8
	.word byte_8066754

	.word byte_8066639
	.word byte_8066807

	# AQUARIUM_COMP_NUM_MAPS
	.word byte_8067E2C
	.word dword_8067F24
	.word dword_8067F74

	.word byte_8067E8D
	.word byte_8067F4F
	.word byte_8067FDF

	# JUDGETREE_COMP_NUM_MAPS
	.word byte_806935C
	.word byte_80693C8
	.word byte_8069404

	.word byte_806937A
	.word byte_80693E6
	.word byte_8069462

	# MR_WEATHER_COMP_NUM_MAPS
	.word byte_806A2C4
	.word byte_806A3C4
	.word byte_806A460

    .word byte_806A35A
	.word byte_806A449
	.word byte_806A54A

	# PAVILION_COMP_NUM_MAPS
	.word dword_806AEB0
	.word byte_806AF3C
	.word byte_806AFF0
	.word byte_806B10C
	.word byte_806B268

    .word dword_806AED0
	.word MapScript_806AF9A
	.word byte_806B0B5
	.word byte_806B1E3
	.word byte_806B2AC

	# COMPS_2_NUM_MAPS
	.word byte_807043C
	.word byte_8070498
	.word byte_80704F4
	.word byte_80705DC
	.word byte_8070704
	.word byte_807081C
	.word byte_807086C
	.word byte_80708BC
	.word byte_807090C
	.word byte_8070918
	.word byte_8070AFC
	.word byte_8070C84
	.word byte_8070C90
	.word byte_8070C9C
	.word byte_8070CA8
	.word byte_8070CB4

	.word byte_8070497
	.word byte_80704F3
	.word byte_80705C2
	.word byte_80706CF
	.word byte_80707FB
	.word byte_807084B
	.word byte_807089B
	.word byte_80708EB
	.word byte_8070916
	.word byte_8070A62
	.word byte_8070C6A
	.word byte_8070C8E
	.word byte_8070C9A
	.word byte_8070CA6
	.word byte_8070CB2
	.word byte_8070CBE

	# SEASIDE_AREA_NUM_MAPS
	.word byte_8075908
	.word byte_8075B24
	.word byte_8075CA0

	.word byte_8075A0C
	.word byte_8075C25
	.word byte_8075D93

	# GREEN_AREA_NUM_MAPS
	.word byte_8078148
	.word byte_80782F0

	.word byte_807826F
	.word byte_807844C
	
	# UNDERGROUND_NUM_MAPS
	.word byte_8079570
	.word byte_807960C

	.word byte_80795C4
	.word byte_8079706

	# SKY_ACDC_AREA_NUM_MAPS
	.word byte_807AE54
	.word byte_807B2AC
	.word byte_807B6EC

	.word byte_807B167
	.word byte_807B5E9
	.word byte_807B738

	# UNDERNET_NUM_MAPS
	.word byte_807D378
	.word dword_807D588
	.word byte_807D5E0
	
	.word byte_807D48C
	.word byte_807D5B1
	.word byte_807D80B

	# GRAVEYARD_NUM_MAPS
	.word dword_807F26C

	.word byte_807F39F
````

*Listing 1* <a name="listing-1" />^listing-1

````sh
# CYBER_ACADEMY_NUM_MAPS
structs byte_8052834 to dword_8052D84
NPC off_80542A0 to byte_805927C

# SEASIDE_TOWN_NUM_MAPS
structs byte_80596F4 to byte_8059D30
NPC off_805AC6C to byte_805DB74

# GREEN_TOWN_NUM_MAPS
structs byte_805E01C to dword_805E158
NPC off_805E9AC to byte_80600D8
// Did not find FFStop32 NPC lists initially

# SKY_TOWN_NUM_MAPS
structs byte_8060474 to byte_80605E8
NPC off_8060F70 to byte_8062710

# EXPO_SITE_NUM_MAPS
structs byte_8062BFC to byte_8062F1C
NPC off_80637B4 to byte_8065FC9

# ROBOT_CONTROL_COMP_NUM_MAPS
structs byte_8066560 to byte_8066578
NPC off_8066988 to byte_80676BE

# AQUARIUM_COMP_NUM_MAPS
structs byte_8067D6C to byte_8067D9C
NPC off_8068044 to byte_8068CA4

# JUDGETREE_COMP_NUM_MAPS
structs byte_8069224 to byte_80692A4
NPC off_80694B8 to byte_80698BF

# MR_WEATHER_COMP_NUM_MAPS
structs byte_806A204 to byte_806A234
NPC off_806A5C0 to byte_806A792

# PAVILION_COMP_NUM_MAPS
structs byte_806AD2C to dword_806AE04
NPC off_806B310 to byte_806BFE0

# COMPS_2_NUM_MAPS
structs byte_8070034 to byte_8070214
NPC off_8070CC0 to byte_8071577

# SEASIDE_AREA_NUM_MAPS
structs byte_8075614 to byte_807575C
NPC off_8075E24 to byte_8077600

# GREEN_AREA_NUM_MAPS
structs byte_8077EA4 to byte_8077EF8
NPC off_8078598 to byte_8079090
// Did not find FFStop32 NPC lists initially (besides initial which is correctly labeled)

# UNDERGROUND_NUM_MAPS
structs byte_80794AC to byte_80794EC
NPC off_8079798 to byte_8079F4F

# SKY_ACDC_AREA_NUM_MAPS
structs byte_807AAFC to byte_807ACA8
NPC off_807B7D4 to byte_807C812

# UNDERNET_NUM_MAPS
structs byte_807D024 to byte_807D210
NPC off_807D918 to byte_807EA56

# GRAVEYARD_NUM_MAPS
structs byte_807EEB8 to byte_807F1E0
NPC off_807F4BC to byte_807F67D
````

*Listing 2* <a name="listing-2" />^listing-2

2025-12-13 Wk 50 Sat - 04:26 +03:00

We ended up having up to `AAAAAA157`.  Now let's replace them all with correct labels.

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
cat bn6f.sym | grep AAAAAA > a

# in a 
:%s/0\([0-9A-Fa-f]*\) g 00000000 \([A-Za-z0-9]*\)/.\/replacep.sh "\2" "npc_list_\1"/g

# in /home/lan/src/cloned/gh/dism-exe/bn6f
chmod +x a
./a
rm a
````

Hmm it should be `npcscript_list_\1`.

````
08051bdc l 00000000 npc_list_08051BDC
08051c18 l 00000000 npc_list_08051C18
08051c68 l 00000000 npc_list_08051C68
08051cac l 00000000 npc_list_08051CAC
08051d24 l 00000000 npc_list_08051D24
08051da4 l 00000000 npc_list_08051DA4
````

This was the list of `npc_list_\1` prior to builidng.

Let's rename all to `npcscript_list_\1`.\`

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
cat bn6f.sym | grep npc_list_ > a

# in a 
:%s/0\([0-9A-Fa-f]*\) [gl] 00000000 \([A-Za-z0-9_]*\)/.\/replacep.sh "\2" "npcscript_list_\1"/g

# in /home/lan/src/cloned/gh/dism-exe/bn6f
chmod +x a
./a
rm a
````

2025-12-13 Wk 50 Sat - 04:49 +03:00

Saving [Listing 1](012%20Trace%20and%20range%20dump%20remaining%20maps.md#listing-1) to file `a`, then apply the transformation via vim:

````sh
:%s/.word \([A-Za-z0-9_]*\)/cargo run --release --bin dump_script trace map \1 \&\&/g
````

Saving [Listing 2](012%20Trace%20and%20range%20dump%20remaining%20maps.md#listing-2) to file `b`, then apply the transformation via vim:

````sh
# remove secondary comments
:g/\/\//d

# Transform struct dumping lines
:%s/structs \([A-Za-z0-9_]*\) to \([A-Za-z0-9_]*\)/cargo run --release --bin dump_script struct_range \1 \2 "Bn6f::MapObjectSpawnData" --stop ffstop32 \&\&/g

# Transform npcscript range dump lines
:%s/NPC \([A-Za-z0-9_]*\) to \([A-Za-z0-9_]*\)/cargo run --release --bin dump_script range npc \1 \2 \&\&/g
````

Now mix them together and remove the very last command `&&` and remove files `a` and `b`:

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor

# CYBER_ACADEMY_NUM_MAPS
#cargo run --release --bin dump_script trace map byte_8052F90 &&
#cargo run --release --bin dump_script trace map byte_805356C &&
#cargo run --release --bin dump_script trace map byte_80535F4 &&
#cargo run --release --bin dump_script trace map byte_805367C &&
#cargo run --release --bin dump_script trace map byte_8053724 &&
#cargo run --release --bin dump_script trace map byte_80537C4 &&
#cargo run --release --bin dump_script trace map byte_80538A8 &&
#cargo run --release --bin dump_script trace map byte_8053B4C &&
#cargo run --release --bin dump_script trace map byte_8053E54 &&
#cargo run --release --bin dump_script trace map byte_8053F44 &&
cargo run --release --bin dump_script trace map byte_8054108 &&

cargo run --release --bin dump_script trace map byte_8053371 &&
cargo run --release --bin dump_script trace map byte_80535BA &&
cargo run --release --bin dump_script trace map byte_8053642 &&
cargo run --release --bin dump_script trace map byte_80536EA &&
cargo run --release --bin dump_script trace map byte_80537C2 &&
cargo run --release --bin dump_script trace map byte_80538A0 &&
cargo run --release --bin dump_script trace map byte_8053A49 &&
cargo run --release --bin dump_script trace map byte_8053D4A &&
cargo run --release --bin dump_script trace map byte_8053EFF &&
cargo run --release --bin dump_script trace map byte_8054041 &&
cargo run --release --bin dump_script trace map byte_80541D3 &&

cargo run --release --bin dump_script struct_range byte_8052834 dword_8052D84 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
cargo run --release --bin dump_script range npc off_80542A0 byte_805927C &&

# SEASIDE_TOWN_NUM_MAPS
cargo run --release --bin dump_script trace map dword_8059E34 &&
cargo run --release --bin dump_script trace map byte_805A238 &&
cargo run --release --bin dump_script trace map byte_805A414 &&
cargo run --release --bin dump_script trace map byte_805A998 &&
cargo run --release --bin dump_script trace map byte_805AB8C &&

cargo run --release --bin dump_script trace map byte_805A06A &&
cargo run --release --bin dump_script trace map byte_805A348 &&
cargo run --release --bin dump_script trace map byte_805A802 &&
cargo run --release --bin dump_script trace map byte_805AA76 &&
cargo run --release --bin dump_script trace map byte_805AC10 &&

cargo run --release --bin dump_script struct_range byte_80596F4 byte_8059D30 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
cargo run --release --bin dump_script range npc off_805AC6C byte_805DB74 &&

# GREEN_TOWN_NUM_MAPS
cargo run --release --bin dump_script trace map byte_805E248 &&
cargo run --release --bin dump_script trace map byte_805E490 &&
cargo run --release --bin dump_script trace map byte_805E6B8 &&
cargo run --release --bin dump_script trace map byte_805E8E4 &&
cargo run --release --bin dump_script trace map byte_805E940 &&

cargo run --release --bin dump_script trace map off_805E36C &&
cargo run --release --bin dump_script trace map byte_805E5FC &&
cargo run --release --bin dump_script trace map byte_805E804 &&
cargo run --release --bin dump_script trace map byte_805E93E &&
cargo run --release --bin dump_script trace map byte_805E952 &&

cargo run --release --bin dump_script struct_range byte_805E01C dword_805E158 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
cargo run --release --bin dump_script range npc off_805E9AC byte_80600D8 &&

# SKY_TOWN_NUM_MAPS
cargo run --release --bin dump_script trace map byte_80606FC &&
cargo run --release --bin dump_script trace map byte_806096C &&
cargo run --release --bin dump_script trace map byte_8060C9C &&
cargo run --release --bin dump_script trace map byte_8060E30 &&

cargo run --release --bin dump_script trace map dword_8060834 &&
cargo run --release --bin dump_script trace map byte_8060B2F &&
cargo run --release --bin dump_script trace map byte_8060D71 &&
cargo run --release --bin dump_script trace map byte_8060F00 &&

cargo run --release --bin dump_script struct_range byte_8060474 byte_80605E8 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
cargo run --release --bin dump_script range npc off_8060F70 byte_8062710 &&

# EXPO_SITE_NUM_MAPS
cargo run --release --bin dump_script trace map byte_806305C &&
cargo run --release --bin dump_script trace map byte_8063244 &&
cargo run --release --bin dump_script trace map byte_8063410 &&
cargo run --release --bin dump_script trace map byte_8063500 &&
cargo run --release --bin dump_script trace map byte_80635C8 &&
cargo run --release --bin dump_script trace map byte_80636E0 &&

cargo run --release --bin dump_script trace map byte_80631B0 &&
cargo run --release --bin dump_script trace map byte_80633AC &&
cargo run --release --bin dump_script trace map byte_80634C8 &&
cargo run --release --bin dump_script trace map byte_806358F &&
cargo run --release --bin dump_script trace map byte_80636A8 &&
cargo run --release --bin dump_script trace map dword_80637B0 &&

cargo run --release --bin dump_script struct_range byte_8062BFC byte_8062F1C "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
cargo run --release --bin dump_script range npc off_80637B4 byte_8065FC9 &&

# ROBOT_CONTROL_COMP_NUM_MAPS
cargo run --release --bin dump_script trace map byte_80665E8 &&
cargo run --release --bin dump_script trace map byte_8066754 &&

cargo run --release --bin dump_script trace map byte_8066639 &&
cargo run --release --bin dump_script trace map byte_8066807 &&

cargo run --release --bin dump_script struct_range byte_8066560 byte_8066578 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
cargo run --release --bin dump_script range npc off_8066988 byte_80676BE &&

# AQUARIUM_COMP_NUM_MAPS
cargo run --release --bin dump_script trace map byte_8067E2C &&
cargo run --release --bin dump_script trace map dword_8067F24 &&
cargo run --release --bin dump_script trace map dword_8067F74 &&

cargo run --release --bin dump_script trace map byte_8067E8D &&
cargo run --release --bin dump_script trace map byte_8067F4F &&
cargo run --release --bin dump_script trace map byte_8067FDF &&

cargo run --release --bin dump_script struct_range byte_8067D6C byte_8067D9C "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
cargo run --release --bin dump_script range npc off_8068044 byte_8068CA4 &&

# JUDGETREE_COMP_NUM_MAPS
cargo run --release --bin dump_script trace map byte_806935C &&
cargo run --release --bin dump_script trace map byte_80693C8 &&
cargo run --release --bin dump_script trace map byte_8069404 &&

cargo run --release --bin dump_script trace map byte_806937A &&
cargo run --release --bin dump_script trace map byte_80693E6 &&
cargo run --release --bin dump_script trace map byte_8069462 &&

cargo run --release --bin dump_script struct_range byte_8069224 byte_80692A4 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
cargo run --release --bin dump_script range npc off_80694B8 byte_80698BF &&

# MR_WEATHER_COMP_NUM_MAPS
cargo run --release --bin dump_script trace map byte_806A2C4 &&
cargo run --release --bin dump_script trace map byte_806A3C4 &&
cargo run --release --bin dump_script trace map byte_806A460 &&

cargo run --release --bin dump_script trace map byte_806A35A &&
cargo run --release --bin dump_script trace map byte_806A449 &&
cargo run --release --bin dump_script trace map byte_806A54A &&

cargo run --release --bin dump_script struct_range byte_806A204 byte_806A234 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
cargo run --release --bin dump_script range npc off_806A5C0 byte_806A792 &&

# PAVILION_COMP_NUM_MAPS
cargo run --release --bin dump_script trace map dword_806AEB0 &&
cargo run --release --bin dump_script trace map byte_806AF3C &&
cargo run --release --bin dump_script trace map byte_806AFF0 &&
cargo run --release --bin dump_script trace map byte_806B10C &&
cargo run --release --bin dump_script trace map byte_806B268 &&

cargo run --release --bin dump_script trace map dword_806AED0 &&
cargo run --release --bin dump_script trace map MapScript_806AF9A &&
cargo run --release --bin dump_script trace map byte_806B0B5 &&
cargo run --release --bin dump_script trace map byte_806B1E3 &&
cargo run --release --bin dump_script trace map byte_806B2AC &&

cargo run --release --bin dump_script struct_range byte_806AD2C dword_806AE04 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
cargo run --release --bin dump_script range npc off_806B310 byte_806BFE0 &&

# COMPS_2_NUM_MAPS
cargo run --release --bin dump_script trace map byte_807043C &&
cargo run --release --bin dump_script trace map byte_8070498 &&
cargo run --release --bin dump_script trace map byte_80704F4 &&
cargo run --release --bin dump_script trace map byte_80705DC &&
cargo run --release --bin dump_script trace map byte_8070704 &&
cargo run --release --bin dump_script trace map byte_807081C &&
cargo run --release --bin dump_script trace map byte_807086C &&
cargo run --release --bin dump_script trace map byte_80708BC &&
cargo run --release --bin dump_script trace map byte_807090C &&
cargo run --release --bin dump_script trace map byte_8070918 &&
cargo run --release --bin dump_script trace map byte_8070AFC &&
cargo run --release --bin dump_script trace map byte_8070C84 &&
cargo run --release --bin dump_script trace map byte_8070C90 &&
cargo run --release --bin dump_script trace map byte_8070C9C &&
cargo run --release --bin dump_script trace map byte_8070CA8 &&
cargo run --release --bin dump_script trace map byte_8070CB4 &&

cargo run --release --bin dump_script trace map byte_8070497 &&
cargo run --release --bin dump_script trace map byte_80704F3 &&
cargo run --release --bin dump_script trace map byte_80705C2 &&
cargo run --release --bin dump_script trace map byte_80706CF &&
cargo run --release --bin dump_script trace map byte_80707FB &&
cargo run --release --bin dump_script trace map byte_807084B &&
cargo run --release --bin dump_script trace map byte_807089B &&
cargo run --release --bin dump_script trace map byte_80708EB &&
cargo run --release --bin dump_script trace map byte_8070916 &&
cargo run --release --bin dump_script trace map byte_8070A62 &&
cargo run --release --bin dump_script trace map byte_8070C6A &&
cargo run --release --bin dump_script trace map byte_8070C8E &&
cargo run --release --bin dump_script trace map byte_8070C9A &&
cargo run --release --bin dump_script trace map byte_8070CA6 &&
cargo run --release --bin dump_script trace map byte_8070CB2 &&
cargo run --release --bin dump_script trace map byte_8070CBE &&

cargo run --release --bin dump_script struct_range byte_8070034 byte_8070214 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
cargo run --release --bin dump_script range npc off_8070CC0 byte_8071577 &&

# SEASIDE_AREA_NUM_MAPS
cargo run --release --bin dump_script trace map byte_8075908 &&
cargo run --release --bin dump_script trace map byte_8075B24 &&
cargo run --release --bin dump_script trace map byte_8075CA0 &&

cargo run --release --bin dump_script trace map byte_8075A0C &&
cargo run --release --bin dump_script trace map byte_8075C25 &&
cargo run --release --bin dump_script trace map byte_8075D93 &&

cargo run --release --bin dump_script struct_range byte_8075614 byte_807575C "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
cargo run --release --bin dump_script range npc off_8075E24 byte_8077600 &&

# GREEN_AREA_NUM_MAPS
cargo run --release --bin dump_script trace map byte_8078148 &&
cargo run --release --bin dump_script trace map byte_80782F0 &&

cargo run --release --bin dump_script trace map byte_807826F &&
cargo run --release --bin dump_script trace map byte_807844C &&
	
cargo run --release --bin dump_script struct_range byte_8077EA4 byte_8077EF8 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
cargo run --release --bin dump_script range npc off_8078598 byte_8079090 &&

# UNDERGROUND_NUM_MAPS
cargo run --release --bin dump_script trace map byte_8079570 &&
cargo run --release --bin dump_script trace map byte_807960C &&

cargo run --release --bin dump_script trace map byte_80795C4 &&
cargo run --release --bin dump_script trace map byte_8079706 &&

cargo run --release --bin dump_script struct_range byte_80794AC byte_80794EC "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
cargo run --release --bin dump_script range npc off_8079798 byte_8079F4F &&

# SKY_ACDC_AREA_NUM_MAPS
cargo run --release --bin dump_script trace map byte_807AE54 &&
cargo run --release --bin dump_script trace map byte_807B2AC &&
cargo run --release --bin dump_script trace map byte_807B6EC &&

cargo run --release --bin dump_script trace map byte_807B167 &&
cargo run --release --bin dump_script trace map byte_807B5E9 &&
cargo run --release --bin dump_script trace map byte_807B738 &&

cargo run --release --bin dump_script struct_range byte_807AAFC byte_807ACA8 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
cargo run --release --bin dump_script range npc off_807B7D4 byte_807C812 &&

# UNDERNET_NUM_MAPS
cargo run --release --bin dump_script trace map byte_807D378 &&
cargo run --release --bin dump_script trace map dword_807D588 &&
cargo run --release --bin dump_script trace map byte_807D5E0 &&

cargo run --release --bin dump_script trace map byte_807D48C &&
cargo run --release --bin dump_script trace map byte_807D5B1 &&
cargo run --release --bin dump_script trace map byte_807D80B &&

cargo run --release --bin dump_script struct_range byte_807D024 byte_807D210 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
cargo run --release --bin dump_script range npc off_807D918 byte_807EA56 &&

# GRAVEYARD_NUM_MAPS
cargo run --release --bin dump_script trace map dword_807F26C &&

cargo run --release --bin dump_script trace map byte_807F39F &&

cargo run --release --bin dump_script struct_range byte_807EEB8 byte_807F1E0 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
cargo run --release --bin dump_script range npc off_807F4BC byte_807F67D
````

Also add at the end:

````
|| speaker-test -t sine -f 1000 -l 1
````

2025-12-13 Wk 50 Sat - 07:29 +03:00

````
Tracing npcscript Identifier { s: "byte_8055C16" }

No terminating command before failing to read npcscript instructions at Identifier { s: "byte_8055C16" }: Partial read Error. Original error: Failed to route the command: No instruction schema found for position 19 and byte 0x5C. Parsed Instructions: /*...*/
````

Missed npcscript list. Marking.

The addresses are lower case:

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
cat bn6f.sym | grep npcscript_list_ > a

# in a 
:%s/0\([0-9A-Fa-f]*\) [gl] 00000000 \([A-Za-z0-9_]*\)/.\/replacep.sh "\2" "npcscript_list_\1"/g

# Select the second column and use ~ on the address portion of using rectangular select to make it upper

# in /home/lan/src/cloned/gh/dism-exe/bn6f
chmod +x a
./a
rm a
````

2025-12-13 Wk 50 Sat - 07:48 +03:00

````
Tracing ccs Identifier { s: "ccs_808B078" }

thread 'main' panicked at src/bin/dump_script.rs:343:25:
No instructions read, and yet we fail to read ccs instructions at Identifier { s: "ccs_808B078" }: Partial read Error. Original error: Inst InstSchema { name: "ccs_set_camera_pos", cmd: 0, opt_subcmd: None, fields: [U16("hword1"), U16("hword3"), U16("hword5")] } overflows buffer size 1 at position 0. Parsed Instructions: []
````

Removing unreferenced `end_cutscenescript_808B079`.

2025-12-13 Wk 50 Sat - 08:02 +03:00

````
Tracing cutscenescript Identifier { s: "cutscenescript_80934D4" }

No terminating command before failing to read cutscenescript instructions at Identifier { s: "cutscenescript_80934D4" }: Partial read Error. Original error: Inst InstSchema { name: "cs_do_pet_effect", cmd: 83, opt_subcmd: None, fields: [U8("byte1"), U8("byte2")] } overflows buffer size 52 at position 51. Parsed Instructions: /*...*/
````

We're overflowing `byte_8093508` which has only one reference. Removing.

2025-12-13 Wk 50 Sat - 08:15 +03:00

````
Tracing cutscenescript Identifier { s: "cutscenescript_80949D0" }

thread 'main' panicked at src/bin/dump_script.rs:375:25:
No terminating command before failing to read cutscenescript instructions at Identifier { s: "cutscenescript_80949D0" }: Partial read Error. Original error: Inst InstSchema { name: "cs_pause", cmd: 2, opt_subcmd: None, fields: [U8("byte1"), U8("byte2")] } overflows buffer size 312 at position 311. Parsed Instructions: /*...*/
````

Only one uncertain reference for `byte_8094B08` overflown. Removing. Also removing `byte_8094D08`,  `byte_8095708`, `dword_8095F08`, `off_8096708`, `byte_8096F08` which are all used in the same place similarly and only have one reference.

2025-12-13 Wk 50 Sat - 08:33 +03:00

Accoding to this [stackoverflow answer](https://unix.stackexchange.com/a/163716), I can send a beep with this:

````sh
speaker-test -t sine -f 1000 -l 1
````

Just to know immediately when something breaks. Add it in the end after a `||`.

2025-12-13 Wk 50 Sat - 09:38 +03:00

````
Tracing ccs Identifier { s: "ccs_8081EA4" }

thread 'main' panicked at src/bin/dump_script.rs:466:37:
script RomEa { ea: 134749908 } "cutscenescript_8081ED4": Failed to read FFStop List: Expected last pointer to be -1i32 or 0xFF: npcscript_805795C
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script trace cutscenecamera ccs_8081EA4 || speaker-test -t sine -f 1000 -l 1
````

This one is fine and builds

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script trace cutscene cutscenescript_8081ED4 || speaker-test -t sine -f 1000 -l 1
````

A more clarified error:

````
script RomEa { ea: 134749908 } "cutscenescript_8081ED4": Failed to read FFStop List: Expected last pointer to be -1i32 or 0xFF for symbol npcscript_805795C but processed 330 pointers with last being 0x0000008.
````

Okay need to reclarify this. There are no 330 pointers processed yet. Only words which are suspected to be pointers. We check the end condition first before ea validation.

Reclarified:

````
script RomEa { ea: 134749908 } "cutscenescript_8081ED4": Failed to read FFStop List: Expected last pointer to be -1i32 or 0xFF for symbol npcscript_805795C in buffer of 330 words with last being 0x0000008.
````

````
Tracing cutscenescript Identifier { s: "cutscenescript_8081ED4" }
0 new_inst: Inst { name: "cs_lock_player_for_non_npc_dialogue_809e0b0", cmd: 63, opt_subcmd: Some(U8(0)), fields: [] }
2 new_inst: Inst { name: "cs_nop_80377d0", cmd: 6, opt_subcmd: None, fields: [] }
3 new_inst: Inst { name: "cs_decomp_text_archive", cmd: 62, opt_subcmd: None, fields: [Ptr("ptr1", RomCompressed(CompressedRomEa { ea: 142234852 }))] }
8 new_inst: Inst { name: "cs_pause", cmd: 2, opt_subcmd: None, fields: [U8("byte1", 255), U8("byte2", 1)] }
11 new_inst: Inst { name: "cs_run_cutscene_camera_script", cmd: 84, opt_subcmd: Some(U8(0)), fields: [Ptr("ptr1", Rom(RomEa { ea: 134749860 }))] }
17 new_inst: Inst { name: "cs_spawn_ow_npc_objects_from_list", cmd: 74, opt_subcmd: Some(U8(2)), fields: [Ptr("ptr2", Rom(RomEa { ea: 134576476 }))] }
																												 npcscript_805795C ~~~^
// ...
````

2025-12-13 Wk 50 Sat - 10:22 +03:00

Oh that's just because this list is not properly cut.

````C
npcscript_805795C:
	.word 0x0805797C, 0x080579E4, 0x08057A44, 0x08057A9A, 0x08057B13, 0x08057B77, 0x08057C0D, 0x000000FF
	.word 0x17271F08, 0xFFC41400, 0xFFE0013C, byte_83F0716, 0x150F1601, 0x160C0807, 0x02083C07, 0x2203083F
````

````C
npcscript_list_805795C::
	.word 0x0805797C, 0x080579E4, 0x08057A44, 0x08057A9A, 0x08057B13, 0x08057B77, 0x08057C0D, 0x000000FF
end_npcscript_list_805797C::
	.word 0x17271F08, 0xFFC41400, 0xFFE0013C, byte_83F0716, 0x150F1601, 0x160C0807, 0x02083C07, 0x2203083F
````

There's more in its body.

````C
	.word 0x3601083F, byte_809F6CC, 0x08057C4C, 0x08057C76, 0x08057CCF, 0x08057CEA, 0x08057D1F, 0x08057D37
	.word 0x08057D4F, 0x08057D67, 0x08057D7F, 0x000000FF, 0x17271F08, 0xFFBC1400, 0x0000007C, 0x3F1A0116
	
	.word 0x090809F6, 0x0F25271F, 0xFFCC141C, 0x0000004A, byte_83F0316, 0xCC360809, 0x000809F6, 0x08057DB0
	.word 0x08057DE9, 0x08057E33, 0x08057E4D, 0x08057E67, 0x000000FF, 0x17271F08, 0xFF981400, 0x00000054

````

````C
npcscript_list_8057C24::
  .word 0x08057C4C, 0x08057C76, 0x08057CCF, 0x08057CEA, 0x08057D1F, 0x08057D37
	.word 0x08057D4F, 0x08057D67, 0x08057D7F, 0x000000FF
end_npcscript_list_8057C4C::
	.word 0x17271F08, 0xFFBC1400, 0x0000007C, 0x3F1A0116
	
npcscript_list_8057D98::
	.word 0x08057DB0
	.word 0x08057DE9, 0x08057E33, 0x08057E4D, 0x08057E67, 0x000000FF
end_npcscript_list_8057db0::
	.word 0x17271F08, 0xFF981400, 0x00000054
````

2025-12-13 Wk 50 Sat - 10:40 +03:00

````
Tracing ccs Identifier { s: "ccs_8081EAB" }

thread 'main' panicked at src/bin/dump_script.rs:343:25:
No instructions read, and yet we fail to read ccs instructions at Identifier { s: "ccs_8081EAB" }: Partial read Error. Original error: Inst InstSchema { name: "ccs_simple_scroll", cmd: 4, opt_subcmd: None, fields: [U16("hword1"), U16("hword3"), U16("hword5"), U16("hword7")] } overflows buffer size 4 at position 0. Parsed Instructions: []

````

Removing overflown `end_cutscenescript_8081EAF`.

2025-12-13 Wk 50 Sat - 10:52 +03:00

````
Tracing gfx_anim_script Identifier { s: "byte_8052560" }

thread 'main' panicked at src/bin/dump_script.rs:375:25:
No terminating command before failing to read gfx_anim_script instructions at Identifier { s: "byte_8052560" }: Partial read Error. Original error: Invalid data encountered at position 56: 0xFFFF0100. Parsed commands: /*...*/
````

````C
byte_8052560::
	.word unk_3001A80, 0x00000020, 0xFFFF0100, byte_8527B28
	.word 0x00000018, byte_8527B48, 0x0000000C, byte_8527B68
	.word 0x00000018, byte_8527B48, 0x0000000C, 0x00000001
	.word unk_3001A80, 0x00000020, 0xFFFF0100, byte_8526A5C
	.word 0x00000001, 0x00000000
````

````C
byte_8052560::
	.word unk_3001A80, 0x00000020, 0xFFFF0100, byte_8527B28
		  [common struct                    ]  [data 
	.word 0x00000018, byte_8527B48, 0x0000000C, byte_8527B68
	.word 0x00000018, byte_8527B48, 0x0000000C, 0x00000001
	                                         ]  [loop    ]
	.word unk_3001A80, 0x00000020, 0xFFFF0100, byte_8526A5C
	      [common struct                    ]  [data 
	.word 0x00000001, 0x00000000
	               ]  [end     ]
````

It's two gfx_anim scripts:

````C
byte_8052560::
	.word unk_3001A80, 0x00000020, 0xFFFF0100, byte_8527B28
	.word 0x00000018, byte_8527B48, 0x0000000C, byte_8527B68
	.word 0x00000018, byte_8527B48, 0x0000000C, 0x00000001
gfx_anim_script_08052590::
	.word unk_3001A80, 0x00000020, 0xFFFF0100, byte_8526A5C
	.word 0x00000001, 0x00000000
````

2025-12-13 Wk 50 Sat - 11:25 +03:00

````
Tracing cutscenescript Identifier { s: "cutscenescript_80834FC" }

thread 'main' panicked at src/bin/dump_script.rs:375:25:
No terminating command before failing to read cutscenescript instructions at Identifier { s: "cutscenescript_80834FC" }: Partial read Error. Original error: Inst InstSchema { name: "cs_set_screen_fade", cmd: 39, opt_subcmd: None, fields: [U8("byte1"), U8("byte2"), U8("byte3")] } overflows buffer size 34 at position 33. Parsed Instructions: /*...*/
````

Unused overflown reference `byte_808351E`. Removing.

2025-12-13 Wk 50 Sat - 11:34 +03:00

````
Tracing npcscript Identifier { s: "npcscript_8058CAA" }

thread 'main' panicked at src/bin/dump_script.rs:375:25:
No terminating command before failing to read npcscript instructions at Identifier { s: "npcscript_8058CAA" }: Partial read Error. Original error: Inst InstSchema { name: "ns_wait_cutscene_var", cmd: 63, opt_subcmd: None, fields: [U8("byte1"), U8("byte2")] } overflows buffer size 18 at position 17. Parsed Instructions: /*...*/
````

Overflown reference `off_8058CBC` has no uses. Removing.

2025-12-13 Wk 50 Sat - 11:58 +03:00

````
Tracing ccs Identifier { s: "ccs_8092D20" }

thread 'main' panicked at src/bin/dump_script.rs:343:25:
No instructions read, and yet we fail to read ccs instructions at Identifier { s: "ccs_8092D20" }: Partial read Error. Original error: Inst InstSchema { name: "ccs_set_camera_pos", cmd: 0, opt_subcmd: None, fields: [U16("hword1"), U16("hword3"), U16("hword5")] } overflows buffer size 1 at position 0. Parsed Instructions: []
````

`end_cutscenescript_8092D21` has no references and is overflown. Removing.

2025-12-13 Wk 50 Sat - 12:10 +03:00

````
Tracing cutscenescript Identifier { s: "cutscenescript_808298C" }
Tracing gfx_anim_script Identifier { s: "byte_80525C0" }
Tracing gfx_anim_script Identifier { s: "byte_80525F0" }

thread 'main' panicked at src/bin/dump_script.rs:343:25:
No instructions read, and yet we fail to read gfx_anim_script instructions at Identifier { s: "byte_80525F0" }: Partial read Error. Original error: Could not route command 160. Parsed instructions: []
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor

cargo run --release --bin dump_script trace cutscene cutscenescript_808298C || speaker-test -t sine -f 1000 -l 1

# out (relevant)
Tracing cutscenescript Identifier { s: "cutscenescript_808298C" }
0 new_inst: Inst { name: "cs_disable_cutscene_skip_script", cmd: 20, opt_subcmd: Some(U8(0)), fields: [Unused24("unused2", 0)] }
5 new_inst: Inst { name: "cs_set_screen_fade", cmd: 39, opt_subcmd: None, fields: [U8("byte1", 255), U8("byte2", 12), U8("byte3", 8)] }
9 new_inst: Inst { name: "cs_wait_screen_fade", cmd: 7, opt_subcmd: None, fields: [] }
10 new_inst: Inst { name: "cs_write_gamestate_byte", cmd: 50, opt_subcmd: None, fields: [U8("byte1", 6), U8("byte2", 3)] }
13 new_inst: Inst { name: "cs_write_gamestate_byte", cmd: 50, opt_subcmd: None, fields: [U8("byte1", 7), U8("byte2", 1)] }
16 new_inst: Inst { name: "cs_set_event_flag", cmd: 41, opt_subcmd: None, fields: [U8("byte1", 255), Event16("event16_2", 1165)] }
20 new_inst: Inst { name: "cs_set_event_flag", cmd: 41, opt_subcmd: None, fields: [U8("byte1", 255), Event16("event16_2", 1166)] }
24 new_inst: Inst { name: "cs_set_event_flag", cmd: 41, opt_subcmd: None, fields: [U8("byte1", 255), Event16("event16_2", 1168)] }
28 new_inst: Inst { name: "cs_set_event_flag", cmd: 41, opt_subcmd: None, fields: [U8("byte1", 255), Event16("event16_2", 1169)] }
32 new_inst: Inst { name: "cs_set_event_flag", cmd: 41, opt_subcmd: None, fields: [U8("byte1", 255), Event16("event16_2", 1170)] }
36 new_inst: Inst { name: "cs_clear_event_flag", cmd: 42, opt_subcmd: None, fields: [U8("byte1", 255), Event16("event16_2", 4)] }
40 new_inst: Inst { name: "cs_set_event_flag", cmd: 41, opt_subcmd: None, fields: [U8("byte1", 255), Event16("event16_2", 5)] }
44 new_inst: Inst { name: "cs_load_gfx_anim", cmd: 54, opt_subcmd: None, fields: [Ptr("ptr1", Rom(RomEa { ea: 134555072 }))] }
49 new_inst: Inst { name: "cs_load_gfx_anim", cmd: 54, opt_subcmd: None, fields: [Ptr("ptr1", Rom(RomEa { ea: 134555100 }))] }
// ...

````

````sh
python3 -c "print(0x80525F0)"
python3 -c "print(134555120 - 134555100)"
python3 -c "print(hex(134555100))"

# out
134555120
20
0x80525dc
````

Why are we tracing `byte_80525F0`  instead of `0x80525dc` ?

````
byte_80525C0::
	.byte 0x4, 0x0, 0x0, 0x0, 0x60, 0x1B, 0x0, 0x3, 0xC, 0xC, 0xD, 0xFF
	.byte 0x60, 0xC, 0x0, 0x80, 0x1E, 0x0, 0x0, 0x0, 0x2, 0x0, 0x0, 0x0
	.word byte_80525F0
````

`byte_80525C0` seems to refer to it.

````
byte_80525C0::
	.byte 0x4, 0x0, 0x0, 0x0, 0x60, 0x1B, 0x0, 0x3, 0xC, 0xC, 0xD, 0xFF
		  [common struct                                              ]
	.byte 0x60, 0xC, 0x0, 0x80, 0x1E, 0x0, 0x0, 0x0, 0x2, 0x0, 0x0, 0x0
		  [data                                    ] [jump            
	.word byte_80525F0
	                 ]
````

````
byte_80525F0::
	.word 0x80001080, 0x0000001E, 0x800014A0, 0x0000001E, 0x800018C0, 0x0000001E, 0x80001CE0, 0x0000001E
	.word 0x800018C0, 0x0000001E, 0x800014A0, 0x0000001E, 0x80001080, 0x0000001E, 0x00000002, byte_80525E8
````

````
byte_80525F0::
	.word 0x80001080, 0x0000001E, 0x800014A0, 0x0000001E, 0x800018C0, 0x0000001E, 0x80001CE0, 0x0000001E
	[data                                                                                              
	.word 0x800018C0, 0x0000001E, 0x800014A0, 0x0000001E, 0x80001080, 0x0000001E, 0x00000002, byte_80525E8
                                                                               ]  [jump                  ]
````

````
byte_80525E8::
	.byte 0x60, 0xC, 0x0, 0x80, 0x1E, 0x0, 0x0, 0x0
````

````
byte_80525E8::
	.byte 0x60, 0xC, 0x0, 0x80, 0x1E, 0x0, 0x0, 0x0
		  [data                                   ]
````

These jumps only apply to the data. The common struct being loaded does not change. This means that our current implementation for gfx anim is incorrect as it treats it as a Dest, and thus expects a full gfx_anim script to be loaded.

We shouldn't always do away with the common struct because it's necessary magic to reduce the number of false positives. This can only happen on destination scripts, so we need to have this distinction in mind, that we're processing a gfx_anim *destination* script rather than a source script. A source gfx_anim is either traced from other script types or directly. A destination gfx_anim can only be traced from another gfx_anim.
