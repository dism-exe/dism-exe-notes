---
parent: "[[004 Impl dumping for map npc and cutscene scripts]]"
spawned_by: "[[006 Dump scripts via script tracing]]"
context_type: task
status: done
---

Parent: [[004 Impl dumping for map npc and cutscene scripts]]

Spawned by: [[006 Dump scripts via script tracing]]

Spawned in: [[006 Dump scripts via script tracing#^spawn-task-c8e433|^spawn-task-c8e433]]

# 1 Journal

2025-12-13 Wk 50 Sat - 02:31 +03:00

As I list these, I need to also specify the NPC range, and go through the data myself and put any npc script list labels that are missing (list of pointers that is terminated with a 0xFF word ie. FFStop32). Can do that quickly by giving them a label like `AAAAAA{N}` and using bn6f.sym to fill in the addresses later. Need to also be aware that the lists sometime begin from the 2nd pointer, like with

```
	.word byte_809F6CC
	.word byte_8054CD8
	.word byte_8054CFF
	.word byte_8054D16
```

So look for contiguous set of addresses. They should be rising, and local to the region the list itself is in.

```
	# Items remaining to process... None!
```

```
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

```

```sh
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
```

*Listing 1* ^listing-1


```sh
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
```

*Listing 2* ^listing-2

2025-12-13 Wk 50 Sat - 04:26 +03:00

We ended up having up to `AAAAAA157`.  Now let's replace them all with correct labels.

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
cat bn6f.sym | grep AAAAAA > a

# in a 
:%s/0\([0-9A-Fa-f]*\) g 00000000 \([A-Za-z0-9]*\)/.\/replacep.sh "\2" "npc_list_\1"/g

# in /home/lan/src/cloned/gh/dism-exe/bn6f
chmod +x a
./a
rm a
```

Hmm it should be `npcscript_list_\1`. 

```
08051bdc l 00000000 npc_list_08051BDC
08051c18 l 00000000 npc_list_08051C18
08051c68 l 00000000 npc_list_08051C68
08051cac l 00000000 npc_list_08051CAC
08051d24 l 00000000 npc_list_08051D24
08051da4 l 00000000 npc_list_08051DA4
```

This was the list of `npc_list_\1` prior to builidng.

Let's rename all to `npcscript_list_\1`.`

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
cat bn6f.sym | grep npc_list_ > a

# in a 
:%s/0\([0-9A-Fa-f]*\) [gl] 00000000 \([A-Za-z0-9_]*\)/.\/replacep.sh "\2" "npcscript_list_\1"/g

# in /home/lan/src/cloned/gh/dism-exe/bn6f
chmod +x a
./a
rm a
```

2025-12-13 Wk 50 Sat - 04:49 +03:00

Saving [[#^listing-1|Listing 1]] to file `a`, then apply the transformation via vim:

```sh
:%s/.word \([A-Za-z0-9_]*\)/cargo run --release --bin dump_script trace map \1 \&\&/g
```

Saving [[#^listing-2|Listing 2]] to file `b`, then apply the transformation via vim:

```sh
# remove secondary comments
:g/\/\//d

# Transform struct dumping lines
:%s/structs \([A-Za-z0-9_]*\) to \([A-Za-z0-9_]*\)/cargo run --release --bin dump_script struct_range \1 \2 "Bn6f::MapObjectSpawnData" --stop ffstop32 \&\&/g

# Transform npcscript range dump lines
:%s/NPC \([A-Za-z0-9_]*\) to \([A-Za-z0-9_]*\)/cargo run --release --bin dump_script range npc \1 \2 \&\&/g
```

Now mix them together and remove the very last command `&&` and remove files `a` and `b`:

```sh
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
#cargo run --release --bin dump_script trace map byte_8054108 &&

#cargo run --release --bin dump_script trace map byte_8053371 &&
#cargo run --release --bin dump_script trace map byte_80535BA &&
#cargo run --release --bin dump_script trace map byte_8053642 &&
#cargo run --release --bin dump_script trace map byte_80536EA &&
#cargo run --release --bin dump_script trace map byte_80537C2 &&
#cargo run --release --bin dump_script trace map byte_80538A0 &&
#cargo run --release --bin dump_script trace map byte_8053A49 &&
#cargo run --release --bin dump_script trace map byte_8053D4A &&
#cargo run --release --bin dump_script trace map byte_8053EFF &&
#cargo run --release --bin dump_script trace map byte_8054041 &&
#cargo run --release --bin dump_script trace map byte_80541D3 &&

#cargo run --release --bin dump_script struct_range byte_8052834 dword_8052D84 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
#cargo run --release --bin dump_script range npc off_80542A0 byte_805927C &&

# SEASIDE_TOWN_NUM_MAPS
#cargo run --release --bin dump_script trace map dword_8059E34 &&
#cargo run --release --bin dump_script trace map byte_805A238 &&
#cargo run --release --bin dump_script trace map byte_805A414 &&
#cargo run --release --bin dump_script trace map byte_805A998 &&
#cargo run --release --bin dump_script trace map byte_805AB8C &&

#cargo run --release --bin dump_script trace map byte_805A06A &&
#cargo run --release --bin dump_script trace map byte_805A348 &&
#cargo run --release --bin dump_script trace map byte_805A802 &&
#cargo run --release --bin dump_script trace map byte_805AA76 &&
#cargo run --release --bin dump_script trace map byte_805AC10 &&
 
#cargo run --release --bin dump_script struct_range byte_80596F4 byte_8059D30 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
#cargo run --release --bin dump_script range npc off_805AC6C byte_805DB74 &&

# GREEN_TOWN_NUM_MAPS
#cargo run --release --bin dump_script trace map byte_805E248 &&
#cargo run --release --bin dump_script trace map byte_805E490 &&
#cargo run --release --bin dump_script trace map byte_805E6B8 &&
#cargo run --release --bin dump_script trace map byte_805E8E4 &&
#cargo run --release --bin dump_script trace map byte_805E940 &&
 
#cargo run --release --bin dump_script trace map off_805E36C &&
#cargo run --release --bin dump_script trace map byte_805E5FC &&
#cargo run --release --bin dump_script trace map byte_805E804 &&
#cargo run --release --bin dump_script trace map byte_805E93E &&
#cargo run --release --bin dump_script trace map byte_805E952 &&
 
#cargo run --release --bin dump_script struct_range byte_805E01C dword_805E158 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
#cargo run --release --bin dump_script range npc off_805E9AC byte_80600D8 &&

# SKY_TOWN_NUM_MAPS
#cargo run --release --bin dump_script trace map byte_80606FC &&
#cargo run --release --bin dump_script trace map byte_806096C &&
#cargo run --release --bin dump_script trace map byte_8060C9C &&
#cargo run --release --bin dump_script trace map byte_8060E30 &&

#cargo run --release --bin dump_script trace map dword_8060834 &&
#cargo run --release --bin dump_script trace map byte_8060B2F &&
#cargo run --release --bin dump_script trace map byte_8060D71 &&
#cargo run --release --bin dump_script trace map byte_8060F00 &&
 
#cargo run --release --bin dump_script struct_range byte_8060474 byte_80605E8 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
#cargo run --release --bin dump_script range npc off_8060F70 byte_8062710 &&

# EXPO_SITE_NUM_MAPS
#cargo run --release --bin dump_script trace map byte_806305C &&
#cargo run --release --bin dump_script trace map byte_8063244 &&
#cargo run --release --bin dump_script trace map byte_8063410 &&
#cargo run --release --bin dump_script trace map byte_8063500 &&
#cargo run --release --bin dump_script trace map byte_80635C8 &&
#cargo run --release --bin dump_script trace map byte_80636E0 &&
 
#cargo run --release --bin dump_script trace map byte_80631B0 &&
#cargo run --release --bin dump_script trace map byte_80633AC &&
#cargo run --release --bin dump_script trace map byte_80634C8 &&
#cargo run --release --bin dump_script trace map byte_806358F &&
#cargo run --release --bin dump_script trace map byte_80636A8 &&
#cargo run --release --bin dump_script trace map dword_80637B0 &&
 
#cargo run --release --bin dump_script struct_range byte_8062BFC byte_8062F1C "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
#cargo run --release --bin dump_script range npc off_80637B4 byte_8065FC9 &&

# ROBOT_CONTROL_COMP_NUM_MAPS
#cargo run --release --bin dump_script trace map byte_80665E8 &&
#cargo run --release --bin dump_script trace map byte_8066754 &&

#cargo run --release --bin dump_script trace map byte_8066639 &&
#cargo run --release --bin dump_script trace map byte_8066807 &&
 
#cargo run --release --bin dump_script struct_range byte_8066560 byte_8066578 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
#cargo run --release --bin dump_script range npc off_8066988 byte_80676BE &&

# AQUARIUM_COMP_NUM_MAPS
#cargo run --release --bin dump_script trace map byte_8067E2C &&
#cargo run --release --bin dump_script trace map dword_8067F24 &&
#cargo run --release --bin dump_script trace map dword_8067F74 &&

#cargo run --release --bin dump_script trace map byte_8067E8D &&
#cargo run --release --bin dump_script trace map byte_8067F4F &&
#cargo run --release --bin dump_script trace map byte_8067FDF &&
 
#cargo run --release --bin dump_script struct_range byte_8067D6C byte_8067D9C "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
#cargo run --release --bin dump_script range npc off_8068044 byte_8068CA4 &&

# JUDGETREE_COMP_NUM_MAPS
#cargo run --release --bin dump_script trace map byte_806935C &&
#cargo run --release --bin dump_script trace map byte_80693C8 &&
#cargo run --release --bin dump_script trace map byte_8069404 &&

#cargo run --release --bin dump_script trace map byte_806937A &&
#cargo run --release --bin dump_script trace map byte_80693E6 &&
#cargo run --release --bin dump_script trace map byte_8069462 &&
 
#cargo run --release --bin dump_script struct_range byte_8069224 byte_80692A4 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
#cargo run --release --bin dump_script range npc off_80694B8 byte_80698BF &&

# MR_WEATHER_COMP_NUM_MAPS
#cargo run --release --bin dump_script trace map byte_806A2C4 &&
#cargo run --release --bin dump_script trace map byte_806A3C4 &&
#cargo run --release --bin dump_script trace map byte_806A460 &&

#cargo run --release --bin dump_script trace map byte_806A35A &&
#cargo run --release --bin dump_script trace map byte_806A449 &&
#cargo run --release --bin dump_script trace map byte_806A54A &&
 
#cargo run --release --bin dump_script struct_range byte_806A204 byte_806A234 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
#cargo run --release --bin dump_script range npc off_806A5C0 byte_806A792 &&
 
# PAVILION_COMP_NUM_MAPS
#cargo run --release --bin dump_script trace map dword_806AEB0 &&
#cargo run --release --bin dump_script trace map byte_806AF3C &&
#cargo run --release --bin dump_script trace map byte_806AFF0 &&
#cargo run --release --bin dump_script trace map byte_806B10C &&
#cargo run --release --bin dump_script trace map byte_806B268 &&
 
#cargo run --release --bin dump_script trace map dword_806AED0 &&
#cargo run --release --bin dump_script trace map MapScript_806AF9A &&
#cargo run --release --bin dump_script trace map byte_806B0B5 &&
#cargo run --release --bin dump_script trace map byte_806B1E3 &&
#cargo run --release --bin dump_script trace map byte_806B2AC &&
 
#cargo run --release --bin dump_script struct_range byte_806AD2C dword_806AE04 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
#cargo run --release --bin dump_script range npc off_806B310 byte_806BFE0 &&

# COMPS_2_NUM_MAPS
#cargo run --release --bin dump_script trace map byte_807043C &&
#cargo run --release --bin dump_script trace map byte_8070498 &&
#cargo run --release --bin dump_script trace map byte_80704F4 &&
#cargo run --release --bin dump_script trace map byte_80705DC &&
#cargo run --release --bin dump_script trace map byte_8070704 &&
#cargo run --release --bin dump_script trace map byte_807081C &&
#cargo run --release --bin dump_script trace map byte_807086C &&
#cargo run --release --bin dump_script trace map byte_80708BC &&
#cargo run --release --bin dump_script trace map byte_807090C &&
#cargo run --release --bin dump_script trace map byte_8070918 &&
#cargo run --release --bin dump_script trace map byte_8070AFC &&
#cargo run --release --bin dump_script trace map byte_8070C84 &&
#cargo run --release --bin dump_script trace map byte_8070C90 &&
#cargo run --release --bin dump_script trace map byte_8070C9C &&
#cargo run --release --bin dump_script trace map byte_8070CA8 &&
#cargo run --release --bin dump_script trace map byte_8070CB4 &&
 
#cargo run --release --bin dump_script trace map byte_8070497 &&
#cargo run --release --bin dump_script trace map byte_80704F3 &&
#cargo run --release --bin dump_script trace map byte_80705C2 &&
#cargo run --release --bin dump_script trace map byte_80706CF &&
#cargo run --release --bin dump_script trace map byte_80707FB &&
#cargo run --release --bin dump_script trace map byte_807084B &&
#cargo run --release --bin dump_script trace map byte_807089B &&
#cargo run --release --bin dump_script trace map byte_80708EB &&
#cargo run --release --bin dump_script trace map byte_8070916 &&
#cargo run --release --bin dump_script trace map byte_8070A62 &&
#cargo run --release --bin dump_script trace map byte_8070C6A &&
#cargo run --release --bin dump_script trace map byte_8070C8E &&
#cargo run --release --bin dump_script trace map byte_8070C9A &&
#cargo run --release --bin dump_script trace map byte_8070CA6 &&
#cargo run --release --bin dump_script trace map byte_8070CB2 &&
#cargo run --release --bin dump_script trace map byte_8070CBE &&
 
#cargo run --release --bin dump_script struct_range byte_8070034 byte_8070214 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
#cargo run --release --bin dump_script range npc off_8070CC0 byte_8071577 &&

# SEASIDE_AREA_NUM_MAPS
#cargo run --release --bin dump_script trace map byte_8075908 &&
#cargo run --release --bin dump_script trace map byte_8075B24 &&
#cargo run --release --bin dump_script trace map byte_8075CA0 &&
 
#cargo run --release --bin dump_script trace map byte_8075A0C &&
#cargo run --release --bin dump_script trace map byte_8075C25 &&
#cargo run --release --bin dump_script trace map byte_8075D93 &&
 
#cargo run --release --bin dump_script struct_range byte_8075614 byte_807575C "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
#cargo run --release --bin dump_script range npc off_8075E24 byte_8077600 &&

# GREEN_AREA_NUM_MAPS
#cargo run --release --bin dump_script trace map byte_8078148 &&
#cargo run --release --bin dump_script trace map byte_80782F0 &&
 
#cargo run --release --bin dump_script trace map byte_807826F &&
#cargo run --release --bin dump_script trace map byte_807844C &&
 	
#cargo run --release --bin dump_script struct_range byte_8077EA4 byte_8077EF8 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
#cargo run --release --bin dump_script range npc off_8078598 byte_8079090 &&

# UNDERGROUND_NUM_MAPS
#cargo run --release --bin dump_script trace map byte_8079570 &&
#cargo run --release --bin dump_script trace map byte_807960C &&
 
#cargo run --release --bin dump_script trace map byte_80795C4 &&
#cargo run --release --bin dump_script trace map byte_8079706 &&

#cargo run --release --bin dump_script struct_range byte_80794AC byte_80794EC "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
#cargo run --release --bin dump_script range npc off_8079798 byte_8079F4F &&

# SKY_ACDC_AREA_NUM_MAPS
#cargo run --release --bin dump_script trace map byte_807AE54 &&
#cargo run --release --bin dump_script trace map byte_807B2AC &&
#cargo run --release --bin dump_script trace map byte_807B6EC &&
 
#cargo run --release --bin dump_script trace map byte_807B167 &&
#cargo run --release --bin dump_script trace map byte_807B5E9 &&
#cargo run --release --bin dump_script trace map byte_807B738 &&

#cargo run --release --bin dump_script struct_range byte_807AAFC byte_807ACA8 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
#cargo run --release --bin dump_script range npc off_807B7D4 byte_807C812 &&

# UNDERNET_NUM_MAPS
#cargo run --release --bin dump_script trace map byte_807D378 &&
#cargo run --release --bin dump_script trace map dword_807D588 &&
#cargo run --release --bin dump_script trace map byte_807D5E0 &&
 
#cargo run --release --bin dump_script trace map byte_807D48C &&
#cargo run --release --bin dump_script trace map byte_807D5B1 &&
#cargo run --release --bin dump_script trace map byte_807D80B &&
 
#cargo run --release --bin dump_script struct_range byte_807D024 byte_807D210 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
#cargo run --release --bin dump_script range npc off_807D918 byte_807EA56 &&

# GRAVEYARD_NUM_MAPS
#cargo run --release --bin dump_script trace map dword_807F26C &&

#cargo run --release --bin dump_script trace map byte_807F39F &&

#cargo run --release --bin dump_script struct_range byte_807EEB8 byte_807F1E0 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
cargo run --release --bin dump_script range npc off_807F4BC byte_807F67D
```

Also add at the end:

```
|| speaker-test -t sine -f 1000 -l 1
```

2025-12-13 Wk 50 Sat - 07:29 +03:00

```
Tracing npcscript Identifier { s: "byte_8055C16" }

No terminating command before failing to read npcscript instructions at Identifier { s: "byte_8055C16" }: Partial read Error. Original error: Failed to route the command: No instruction schema found for position 19 and byte 0x5C. Parsed Instructions: /*...*/
```

Missed npcscript list. Marking.

The addresses are lower case:

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
cat bn6f.sym | grep npcscript_list_ > a

# in a 
:%s/0\([0-9A-Fa-f]*\) [gl] 00000000 \([A-Za-z0-9_]*\)/.\/replacep.sh "\2" "npcscript_list_\1"/g

# Select the second column and use ~ on the address portion of using rectangular select to make it upper

# in /home/lan/src/cloned/gh/dism-exe/bn6f
chmod +x a
./a
rm a
```

2025-12-13 Wk 50 Sat - 07:48 +03:00

```
Tracing ccs Identifier { s: "ccs_808B078" }

thread 'main' panicked at src/bin/dump_script.rs:343:25:
No instructions read, and yet we fail to read ccs instructions at Identifier { s: "ccs_808B078" }: Partial read Error. Original error: Inst InstSchema { name: "ccs_set_camera_pos", cmd: 0, opt_subcmd: None, fields: [U16("hword1"), U16("hword3"), U16("hword5")] } overflows buffer size 1 at position 0. Parsed Instructions: []
```

Removing unreferenced `end_cutscenescript_808B079`.

2025-12-13 Wk 50 Sat - 08:02 +03:00

```
Tracing cutscenescript Identifier { s: "cutscenescript_80934D4" }

No terminating command before failing to read cutscenescript instructions at Identifier { s: "cutscenescript_80934D4" }: Partial read Error. Original error: Inst InstSchema { name: "cs_do_pet_effect", cmd: 83, opt_subcmd: None, fields: [U8("byte1"), U8("byte2")] } overflows buffer size 52 at position 51. Parsed Instructions: /*...*/
```

We're overflowing `byte_8093508` which has only one reference. Removing.

2025-12-13 Wk 50 Sat - 08:15 +03:00

```
Tracing cutscenescript Identifier { s: "cutscenescript_80949D0" }

thread 'main' panicked at src/bin/dump_script.rs:375:25:
No terminating command before failing to read cutscenescript instructions at Identifier { s: "cutscenescript_80949D0" }: Partial read Error. Original error: Inst InstSchema { name: "cs_pause", cmd: 2, opt_subcmd: None, fields: [U8("byte1"), U8("byte2")] } overflows buffer size 312 at position 311. Parsed Instructions: /*...*/
```

Only one uncertain reference for `byte_8094B08` overflown. Removing. Also removing `byte_8094D08`,  `byte_8095708`, `dword_8095F08`, `off_8096708`, `byte_8096F08` which are all used in the same place similarly and only have one reference.

2025-12-13 Wk 50 Sat - 08:33 +03:00

Accoding to this [stackoverflow answer](https://unix.stackexchange.com/a/163716), I can send a beep with this:

```sh
speaker-test -t sine -f 1000 -l 1
```

Just to know immediately when something breaks. Add it in the end after a `||`. 

2025-12-13 Wk 50 Sat - 09:38 +03:00

```
Tracing ccs Identifier { s: "ccs_8081EA4" }

thread 'main' panicked at src/bin/dump_script.rs:466:37:
script RomEa { ea: 134749908 } "cutscenescript_8081ED4": Failed to read FFStop List: Expected last pointer to be -1i32 or 0xFF: npcscript_805795C
```


```sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script trace cutscenecamera ccs_8081EA4 || speaker-test -t sine -f 1000 -l 1
```

This one is fine and builds

```sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script trace cutscene cutscenescript_8081ED4 || speaker-test -t sine -f 1000 -l 1
```

A more clarified error:

```
script RomEa { ea: 134749908 } "cutscenescript_8081ED4": Failed to read FFStop List: Expected last pointer to be -1i32 or 0xFF for symbol npcscript_805795C but processed 330 pointers with last being 0x0000008.
```

Okay need to reclarify this. There are no 330 pointers processed yet. Only words which are suspected to be pointers. We check the end condition first before ea validation.

Reclarified:

```
script RomEa { ea: 134749908 } "cutscenescript_8081ED4": Failed to read FFStop List: Expected last pointer to be -1i32 or 0xFF for symbol npcscript_805795C in buffer of 330 words with last being 0x0000008.
```

```
Tracing cutscenescript Identifier { s: "cutscenescript_8081ED4" }
0 new_inst: Inst { name: "cs_lock_player_for_non_npc_dialogue_809e0b0", cmd: 63, opt_subcmd: Some(U8(0)), fields: [] }
2 new_inst: Inst { name: "cs_nop_80377d0", cmd: 6, opt_subcmd: None, fields: [] }
3 new_inst: Inst { name: "cs_decomp_text_archive", cmd: 62, opt_subcmd: None, fields: [Ptr("ptr1", RomCompressed(CompressedRomEa { ea: 142234852 }))] }
8 new_inst: Inst { name: "cs_pause", cmd: 2, opt_subcmd: None, fields: [U8("byte1", 255), U8("byte2", 1)] }
11 new_inst: Inst { name: "cs_run_cutscene_camera_script", cmd: 84, opt_subcmd: Some(U8(0)), fields: [Ptr("ptr1", Rom(RomEa { ea: 134749860 }))] }
17 new_inst: Inst { name: "cs_spawn_ow_npc_objects_from_list", cmd: 74, opt_subcmd: Some(U8(2)), fields: [Ptr("ptr2", Rom(RomEa { ea: 134576476 }))] }
																												 npcscript_805795C ~~~^
// ...
```

2025-12-13 Wk 50 Sat - 10:22 +03:00

Oh that's just because this list is not properly cut.

```C
npcscript_805795C:
	.word 0x0805797C, 0x080579E4, 0x08057A44, 0x08057A9A, 0x08057B13, 0x08057B77, 0x08057C0D, 0x000000FF
	.word 0x17271F08, 0xFFC41400, 0xFFE0013C, byte_83F0716, 0x150F1601, 0x160C0807, 0x02083C07, 0x2203083F
```

```C
npcscript_list_805795C::
	.word 0x0805797C, 0x080579E4, 0x08057A44, 0x08057A9A, 0x08057B13, 0x08057B77, 0x08057C0D, 0x000000FF
end_npcscript_list_805797C::
	.word 0x17271F08, 0xFFC41400, 0xFFE0013C, byte_83F0716, 0x150F1601, 0x160C0807, 0x02083C07, 0x2203083F
```

There's more in its body.

```C
	.word 0x3601083F, byte_809F6CC, 0x08057C4C, 0x08057C76, 0x08057CCF, 0x08057CEA, 0x08057D1F, 0x08057D37
	.word 0x08057D4F, 0x08057D67, 0x08057D7F, 0x000000FF, 0x17271F08, 0xFFBC1400, 0x0000007C, 0x3F1A0116
	
	.word 0x090809F6, 0x0F25271F, 0xFFCC141C, 0x0000004A, byte_83F0316, 0xCC360809, 0x000809F6, 0x08057DB0
	.word 0x08057DE9, 0x08057E33, 0x08057E4D, 0x08057E67, 0x000000FF, 0x17271F08, 0xFF981400, 0x00000054

```

```C
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
```

2025-12-13 Wk 50 Sat - 10:40 +03:00

```
Tracing ccs Identifier { s: "ccs_8081EAB" }

thread 'main' panicked at src/bin/dump_script.rs:343:25:
No instructions read, and yet we fail to read ccs instructions at Identifier { s: "ccs_8081EAB" }: Partial read Error. Original error: Inst InstSchema { name: "ccs_simple_scroll", cmd: 4, opt_subcmd: None, fields: [U16("hword1"), U16("hword3"), U16("hword5"), U16("hword7")] } overflows buffer size 4 at position 0. Parsed Instructions: []

```

Removing overflown `end_cutscenescript_8081EAF`.

2025-12-13 Wk 50 Sat - 10:52 +03:00

```
Tracing gfx_anim_script Identifier { s: "byte_8052560" }

thread 'main' panicked at src/bin/dump_script.rs:375:25:
No terminating command before failing to read gfx_anim_script instructions at Identifier { s: "byte_8052560" }: Partial read Error. Original error: Invalid data encountered at position 56: 0xFFFF0100. Parsed commands: /*...*/
```

```C
byte_8052560::
	.word unk_3001A80, 0x00000020, 0xFFFF0100, byte_8527B28
	.word 0x00000018, byte_8527B48, 0x0000000C, byte_8527B68
	.word 0x00000018, byte_8527B48, 0x0000000C, 0x00000001
	.word unk_3001A80, 0x00000020, 0xFFFF0100, byte_8526A5C
	.word 0x00000001, 0x00000000
```

```C
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
```

It's two gfx_anim scripts:

```C
byte_8052560::
	.word unk_3001A80, 0x00000020, 0xFFFF0100, byte_8527B28
	.word 0x00000018, byte_8527B48, 0x0000000C, byte_8527B68
	.word 0x00000018, byte_8527B48, 0x0000000C, 0x00000001
gfx_anim_script_08052590::
	.word unk_3001A80, 0x00000020, 0xFFFF0100, byte_8526A5C
	.word 0x00000001, 0x00000000
```

2025-12-13 Wk 50 Sat - 11:25 +03:00

```
Tracing cutscenescript Identifier { s: "cutscenescript_80834FC" }

thread 'main' panicked at src/bin/dump_script.rs:375:25:
No terminating command before failing to read cutscenescript instructions at Identifier { s: "cutscenescript_80834FC" }: Partial read Error. Original error: Inst InstSchema { name: "cs_set_screen_fade", cmd: 39, opt_subcmd: None, fields: [U8("byte1"), U8("byte2"), U8("byte3")] } overflows buffer size 34 at position 33. Parsed Instructions: /*...*/
```

Unused overflown reference `byte_808351E`. Removing.

2025-12-13 Wk 50 Sat - 11:34 +03:00

```
Tracing npcscript Identifier { s: "npcscript_8058CAA" }

thread 'main' panicked at src/bin/dump_script.rs:375:25:
No terminating command before failing to read npcscript instructions at Identifier { s: "npcscript_8058CAA" }: Partial read Error. Original error: Inst InstSchema { name: "ns_wait_cutscene_var", cmd: 63, opt_subcmd: None, fields: [U8("byte1"), U8("byte2")] } overflows buffer size 18 at position 17. Parsed Instructions: /*...*/
```

Overflown reference `off_8058CBC` has no uses. Removing.

2025-12-13 Wk 50 Sat - 11:58 +03:00

```
Tracing ccs Identifier { s: "ccs_8092D20" }

thread 'main' panicked at src/bin/dump_script.rs:343:25:
No instructions read, and yet we fail to read ccs instructions at Identifier { s: "ccs_8092D20" }: Partial read Error. Original error: Inst InstSchema { name: "ccs_set_camera_pos", cmd: 0, opt_subcmd: None, fields: [U16("hword1"), U16("hword3"), U16("hword5")] } overflows buffer size 1 at position 0. Parsed Instructions: []
```

`end_cutscenescript_8092D21` has no references and is overflown. Removing.

2025-12-13 Wk 50 Sat - 12:10 +03:00

```
Tracing cutscenescript Identifier { s: "cutscenescript_808298C" }
Tracing gfx_anim_script Identifier { s: "byte_80525C0" }
Tracing gfx_anim_script Identifier { s: "byte_80525F0" }

thread 'main' panicked at src/bin/dump_script.rs:343:25:
No instructions read, and yet we fail to read gfx_anim_script instructions at Identifier { s: "byte_80525F0" }: Partial read Error. Original error: Could not route command 160. Parsed instructions: []
```

```sh
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

```

```sh
python3 -c "print(0x80525F0)"
python3 -c "print(134555120 - 134555100)"
python3 -c "print(hex(134555100))"

# out
134555120
20
0x80525dc
```

Why are we tracing `byte_80525F0`  instead of `0x80525dc` ?

```
byte_80525C0::
	.byte 0x4, 0x0, 0x0, 0x0, 0x60, 0x1B, 0x0, 0x3, 0xC, 0xC, 0xD, 0xFF
	.byte 0x60, 0xC, 0x0, 0x80, 0x1E, 0x0, 0x0, 0x0, 0x2, 0x0, 0x0, 0x0
	.word byte_80525F0
```

`byte_80525C0` seems to refer to it. 

```
byte_80525C0::
	.byte 0x4, 0x0, 0x0, 0x0, 0x60, 0x1B, 0x0, 0x3, 0xC, 0xC, 0xD, 0xFF
		  [common struct                                              ]
	.byte 0x60, 0xC, 0x0, 0x80, 0x1E, 0x0, 0x0, 0x0, 0x2, 0x0, 0x0, 0x0
		  [data                                    ] [jump            
	.word byte_80525F0
	                 ]
```

```
byte_80525F0::
	.word 0x80001080, 0x0000001E, 0x800014A0, 0x0000001E, 0x800018C0, 0x0000001E, 0x80001CE0, 0x0000001E
	.word 0x800018C0, 0x0000001E, 0x800014A0, 0x0000001E, 0x80001080, 0x0000001E, 0x00000002, byte_80525E8
```

```
byte_80525F0::
	.word 0x80001080, 0x0000001E, 0x800014A0, 0x0000001E, 0x800018C0, 0x0000001E, 0x80001CE0, 0x0000001E
	[data                                                                                              
	.word 0x800018C0, 0x0000001E, 0x800014A0, 0x0000001E, 0x80001080, 0x0000001E, 0x00000002, byte_80525E8
                                                                               ]  [jump                  ]
```

```
byte_80525E8::
	.byte 0x60, 0xC, 0x0, 0x80, 0x1E, 0x0, 0x0, 0x0
```

```
byte_80525E8::
	.byte 0x60, 0xC, 0x0, 0x80, 0x1E, 0x0, 0x0, 0x0
		  [data                                   ]
```

These jumps only apply to the data. The common struct being loaded does not change. This means that our current implementation for gfx anim is incorrect as it treats it as a Dest, and thus expects a full gfx_anim script to be loaded.

We shouldn't always do away with the common struct because it's necessary magic to reduce the number of false positives. This can only happen on destination scripts, so we need to have this distinction in mind, that we're processing a gfx_anim *destination* script rather than a source script. A source gfx_anim is either traced from other script types or directly. A destination gfx_anim can only be traced from another gfx_anim. 

2025-12-14 Wk 50 Sun - 03:02 +03:00

```
Tracing gfx_anim_script Identifier { s: "byte_80525F0" }

thread 'main' panicked at src/bin/dump_script.rs:404:21:
Failed to read gfx_anim_script instructions at Identifier { s: "byte_80525F0" }: Other error: line 406: Failed to read a u32 at position 64 for data delay
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

```
byte_80525F0::
	.word 0x80001080, 0x0000001E, 0x800014A0, 0x0000001E, 0x800018C0, 0x0000001E, 0x80001CE0, 0x0000001E
											              0x10                                         
	.word 0x800018C0, 0x0000001E, 0x800014A0, 0x0000001E, 0x80001080, 0x0000001E, 0x00000002, byte_80525E8
		  0x20                                            0x30
```

Clarifying the error by adding buf len,

```
Failed to read gfx_anim_script instructions at Identifier { s: "byte_80525F0" }: Other error: line 406: Failed to read a u32 at position 64 for buffer of length 64 for data delay
```

It really is of length 64 (0x40). But why are we trying to read a data delay?

```
Tracing gfx_anim_script Identifier { s: "byte_80525C0" }
12 new_inst: Inst { name: "gfx_anim_data", cmd: 0, opt_subcmd: None, fields: [U32("data", 2147486816), U32("delay", 30)] }
20 new_inst: Inst { name: "gfx_anim_jump", cmd: 2, opt_subcmd: None, fields: [Magic24("magic24_1", 0), Dest("dest", RomEa { ea: 134555120 })] }
Tracing gfx_anim_script Identifier { s: "byte_80525F0" }
12 new_inst: Inst { name: "gfx_anim_data", cmd: 0, opt_subcmd: None, fields: [U32("data", 30), U32("delay", 2147489984)] }
20 new_inst: Inst { name: "gfx_anim_data", cmd: 0, opt_subcmd: None, fields: [U32("data", 30), U32("delay", 2147491040)] }
28 new_inst: Inst { name: "gfx_anim_data", cmd: 0, opt_subcmd: None, fields: [U32("data", 30), U32("delay", 2147489984)] }
36 new_inst: Inst { name: "gfx_anim_data", cmd: 0, opt_subcmd: None, fields: [U32("data", 30), U32("delay", 2147488928)] }
44 new_inst: Inst { name: "gfx_anim_data", cmd: 0, opt_subcmd: None, fields: [U32("data", 30), U32("delay", 2147487872)] }
52 new_inst: Inst { name: "gfx_anim_data", cmd: 0, opt_subcmd: None, fields: [U32("data", 30), U32("delay", 2)] }
```

It's starting from position 12, assuming the first 3 words are the common struct, but this does not hold.

Also if we keep the first instruction as the common struct to all of these partial scripts, it will be dumped wrong, so we can't do that.

2025-12-14 Wk 50 Sun - 04:31 +03:00

```C
byte_80525C0::
	gfx_anim_manual_pal_transform transform_type=0x00000004 ptr5=iPalette3001B60 index=0x0C num_pals=0x0D
	gfx_anim_data data=0x80000C60 delay=0x0000001E
	gfx_anim_jump dest=byte_80525F0

// ...

byte_80525E8::
	gfx_anim_data data=0x80000C60 delay=0x0000001E

byte_80525F0::
	gfx_anim_data data=0x80001080 delay=0x0000001E
	gfx_anim_data data=0x800014A0 delay=0x0000001E
	gfx_anim_data data=0x800018C0 delay=0x0000001E
	gfx_anim_data data=0x80001CE0 delay=0x0000001E
	gfx_anim_data data=0x800018C0 delay=0x0000001E
	gfx_anim_data data=0x800014A0 delay=0x0000001E
	gfx_anim_data data=0x80001080 delay=0x0000001E
	gfx_anim_jump dest=byte_80525E8
```

OK, now we're able to represents jumps in gfx anim script.

2025-12-14 Wk 50 Sun - 04:38 +03:00

```
Tracing ccs Identifier { s: "ccs_80827A4" }

thread 'main' panicked at src/bin/dump_script.rs:352:25:
No instructions read, and yet we fail to read ccs instructions at Identifier { s: "ccs_80827A4" }: Partial read Error. Original error: Inst InstSchema { name: "ccs_simple_scroll", cmd: 4, opt_subcmd: None, fields: [U16("hword1"), U16("hword3"), U16("hword5"), U16("hword7")] } overflows buffer size 3 at position 0. Parsed Instructions: []
```

Removing overflown `end_cutscenescript_80827A7`.

2025-12-14 Wk 50 Sun - 04:49 +03:00

```
Tracing ccs Identifier { s: "ccs_808454C" }

thread 'main' panicked at src/bin/dump_script.rs:352:25:
No instructions read, and yet we fail to read ccs instructions at Identifier { s: "ccs_808454C" }: Partial read Error. Original error: Inst InstSchema { name: "ccs_set_camera_pos", cmd: 0, opt_subcmd: None, fields: [U16("hword1"), U16("hword3"), U16("hword5")] } overflows buffer size 1 at position 0. Parsed Instructions: []

```

Removing overflown `end_cutscenescript_808454D`. 

So far we've run into 8 instances of this issue. It is in a way systematic. We do not know there is a ccs script at a given boundary, and we are cutting a boundary label for a prior cutscene script. The information about the ccs boundary only comes later when the bad boundary label is already inserted, and it cannot be prevented beforehand because of command overlap between the two instruction sets. Elimination after the fact by merging the two data blocks  like `ccs_808454C` and `end_cutscenescript_808454D` is possible, but with only 8 instances so far, I am not sure this ad-hoc complexity is warranted. 

2025-12-14 Wk 50 Sun - 05:13 +03:00

```
Tracing ccs Identifier { s: "ccs_808B24C" }

thread 'main' panicked at src/bin/dump_script.rs:490:37:
script RomEa { ea: 134787676 } "cutscenescript_808B25C": Failed to read FFStop List: Expected last pointer to be -1i32 or 0xFF for symbol end_npcscript_8055EAC in buffer of 19 words with last being 0x9F6CC36.
```

```
end_npcscript_8055EAC:
	.word 0x08055EBC, byte_8055EF9, byte_8055F32, 0x000000FF, 0x17271F08, 0xFF741400, 0x0000FFEC, byte_83F0716
	.word 0x150F1601, 0x16020807, 0x02083C07, 0x1603083F, 0x20051509, 0x3F031602, 0x09160508, 0x02080115
	.word 0x083C0316, 0x07083F06, 0x09F6CC36
	.byte 0x08
```

2025-12-14 Wk 50 Sun - 07:11 +03:00

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
python3 tools/fdiff.py bn6f.ign bn6f.gba


# out
Found diff #0 @ 057CE4: bin1=0x83CC02A bin2=0x93CC02A
```

```sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 8057CE4

# out
RomEa { ea: 134577380 } is not in map. But it is between Identifier { s: "npcscript_8057C76" } and Identifier { s: "npcscript_list_8057D98" }
```

```
npcscript_8057CCF:
	.word 0x25271F09, 0xD4141C2C, 0xE00010FF, 0x3F0016FF, 0x2E080708, 0x3CC02A00, sub_8030808, 0x0F25271F
```

This use of `sub_8030808` is wrong.

2025-12-14 Wk 50 Sun - 07:35 +03:00

```
Tracing ccs Identifier { s: "ccs_8082B74" }

thread 'main' panicked at src/bin/dump_script.rs:352:25:
No instructions read, and yet we fail to read ccs instructions at Identifier { s: "ccs_8082B74" }: Partial read Error. Original error: Inst InstSchema { name: "ccs_set_camera_pos", cmd: 0, opt_subcmd: None, fields: [U16("hword1"), U16("hword3"), U16("hword5")] } overflows buffer size 1 at position 0. Parsed Instructions: []

```

Removing overflown `end_cutscenescript_8082B75`.

2025-12-14 Wk 50 Sun - 07:43 +03:00

```
Tracing ccs Identifier { s: "ccs_80874A4" }

thread 'main' panicked at src/bin/dump_script.rs:352:25:
No instructions read, and yet we fail to read ccs instructions at Identifier { s: "ccs_80874A4" }: Partial read Error. Original error: Inst InstSchema { name: "ccs_set_camera_pos", cmd: 0, opt_subcmd: None, fields: [U16("hword1"), U16("hword3"), U16("hword5")] } overflows buffer size 1 at position 0. Parsed Instructions: []
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

Removing overflown `end_cutscenescript_80874A5`.

2025-12-14 Wk 50 Sun - 08:07 +03:00

```
Cutting RomEa { ea: 134856650 }
./asm/asm28_0.s: Assembler messages:
./asm/asm28_0.s:3555: Error: agbasm colonless label `thumb_func_end' does not end with a newline, assuming not a label
```

`thumb_func_end sub_809BEC0` is located away from its function and it got untabbed, need to place it there. 

2025-12-14 Wk 50 Sun - 08:17 +03:00

```
Cutting 0x809BFE3 "cutscenescript_809BFE3"

./asm/asm28_0.s:3560: Error: symbol `thumb_local_start' is already defined
```

`thumb_local_start` needs a tab.

2025-12-14 Wk 50 Sun - 09:44 +03:00

```
Tracing npcscript Identifier { s: "byte_8056BE4" }

No terminating command before failing to read npcscript instructions at Identifier { s: "byte_8056BE4" }: Partial read Error. Original error: Inst InstSchema { name: "ns_jump_with_link", cmd: 54, opt_subcmd: None, fields: [Dest("destination1")] } overflows buffer size 16 at position 13. Parsed Instructions: /*...*/
```

Overflown `off_8056BF4` has no reference. Removing.

2025-12-14 Wk 50 Sun - 23:38 +03:00

```
Tracing ccs Identifier { s: "ccs_80856C0" }

thread 'main' panicked at src/bin/dump_script.rs:490:37:
script RomEa { ea: 134764264 } "cutscenescript_80856E8": Failed to read FFStop List: Expected last pointer to be -1i32 or 0xFF for symbol npcscript_805BA98 in buffer of 473 words with last being 0x0000809.
```

There were 7 npc lists unmarked inside `npcscript_805BA98`. 

Doing this for both `AAAAAA{n}` and `BBBBBB{n}`, but `end_npcscript_list_\1` for `BBBBBB` which I have to correct.

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
cat bn6f.sym | grep AAAAAA > a

# in a 
:%s/0\([0-9A-Fa-f]*\) g 00000000 \([A-Za-z0-9]*\)/.\/replacep.sh "\2" "npcscript_list_\1"/g

# Then rectangle select the ea part of the label and use ~ to make it capitalized

# in /home/lan/src/cloned/gh/dism-exe/bn6f
chmod +x a
./a
rm a
```

2025-12-15 Wk 51 Mon - 00:21 +03:00

```
Tracing cutscenescript Identifier { s: "dword_80857FC" }

thread 'main' panicked at src/bin/dump_script.rs:384:25:
No terminating command before failing to read cutscenescript instructions at Identifier { s: "dword_80857FC" }: Partial read Error. Original error: Failed to route the command: No instruction schema found for position 11 and byte 0xA0. Parsed Instructions: /*...*/
```

```sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script trace cutscene dword_80857FC

# out (relevant)
Tracing cutscenescript Identifier { s: "dword_80857FC" }
0 new_inst: Inst { name: "cs_set_chatbox_flags", cmd: 60, opt_subcmd: Some(U8(0)), fields: [U8("byte2", 64)] }
3 new_inst: Inst { name: "cs_jump", cmd: 21, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 134764485 })] }
8 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
9 new_inst: Inst { name: "cs_init_scenario_effect", cmd: 96, opt_subcmd: None, fields: [U8("byte1", 244)] }
```

```sh
python3 -c "print(hex(96))" # 0x60
```

Let's put a boundary after `0x0`:

```
dword_80857FC::
	.word 0x1540003C
	.word byte_80857C5
	.byte 0x0, 0x60, 0xF4, 0xA0, 0xF5, 0x0, 0x0, 0x8
```

```
dword_80857FC::
	.word 0x1540003C
	.word byte_80857C5
	.byte 0x0
end_cutscenescript_8085805::
	.byte 0x60, 0xF4, 0xA0, 0xF5, 0x0, 0x0, 0x8
```

2025-12-15 Wk 51 Mon - 00:42 +03:00

```
Tracing ccs Identifier { s: "ccs_8091234" }

thread 'main' panicked at src/bin/dump_script.rs:352:25:
No instructions read, and yet we fail to read ccs instructions at Identifier { s: "ccs_8091234" }: Partial read Error. Original error: Inst InstSchema { name: "ccs_set_camera_pos", cmd: 0, opt_subcmd: None, fields: [U16("hword1"), U16("hword3"), U16("hword5")] } overflows buffer size 6 at position 0. Parsed Instructions: []
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

Removing overflown `end_cutscenescript_809123A`. 

2025-12-15 Wk 51 Mon - 01:02 +03:00

```
Tracing ccs Identifier { s: "ccs_8084D98" }

thread 'main' panicked at src/bin/dump_script.rs:352:25:
No instructions read, and yet we fail to read ccs instructions at Identifier { s: "ccs_8084D98" }: Partial read Error. Original error: Inst InstSchema { name: "ccs_write_camera_field_03_14", cmd: 80, opt_subcmd: None, fields: [Ptr("ptr1")] } overflows buffer size 4 at position 0. Parsed Instructions: []
```

Removing overflown `end_cutscenescript_8084D9C`.

2025-12-15 Wk 51 Mon - 01:05 +03:00

```
Tracing ccs Identifier { s: "ccs_8084D98" }

thread 'main' panicked at src/bin/dump_script.rs:490:37:
script RomEa { ea: 134761916 } "cutscenescript_8084DBC": Failed to read FFStop List: Expected last pointer to be -1i32 or 0xFF for symbol npcscript_805C860 in buffer of 182 words with last being 0x0000034.
```

3 NPC Lists here. Marked `AAAAAA{n}` for the list, and `BBBBBB{n}` for its end boundary.

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
cat bn6f.sym | grep AAAAAA > a
cat bn6f.sym | grep BBBBBB >> a

# in a 
:%s/0\([0-9A-Fa-f]*\) g 00000000 \(AAAAAA[0-9]*\)/.\/replacep.sh "\2" "npcscript_list_\1"/g
:%s/0\([0-9A-Fa-f]*\) g 00000000 \(BBBBBB[0-9]*\)/.\/replacep.sh "\2" "end_npcscript_list_\1"/g

# Then rectangle select the ea part of the label and use ~ to make it capitalized

# in /home/lan/src/cloned/gh/dism-exe/bn6f
chmod +x a
./a
rm a
```

2025-12-15 Wk 51 Mon - 01:48 +03:00

```
Tracing ccs Identifier { s: "ccs_8092694" }

thread 'main' panicked at src/bin/dump_script.rs:490:37:
script RomEa { ea: 134817436 } "cutscenescript_809269C": Failed to read FFStop List: Expected last pointer to be -1i32 or 0xFF for symbol npcscript_805D404 in buffer of 18 words with last being 0x0000809.
```

Marking some npc script list boundary ends  and npc script list in `npcscript_805D404` and `byte_805D1DC`.

2025-12-15 Wk 51 Mon - 02:41 +03:00

```
Cutting 0x805D750 "npcscript_805D750"

bn6f.gba: FAILED
```

`sub_8030808+1` again. I'd blacklist this as a fake pointer in `display_symbol_data_as_directives_with_labels` but it does have genuine uses.

It seems the incorrect use is in `npcscript_805D750` which was `sub_8030808` but maybe not `byte_805D470` which had `sub_8030808+1` which builds.

Also marking npc script lists and end boundaries near `npcscript_805D750`.

2025-12-15 Wk 51 Mon - 03:02 +03:00

```
Cutting 0x805D79F "npcscript_805D79F"

bn6f.gba: FAILED
```

`sub_8030808` also appears in `npcscript_805D79F`. Hardcoding. I will blacklist it for now since everytime this is cut this will happen.

2025-12-15 Wk 51 Mon - 03:21 +03:00

```
Tracing ccs Identifier { s: "ccs_8085E00" }

thread 'main' panicked at src/bin/dump_script.rs:490:37:
script RomEa { ea: 134766108 } "cutscenescript_8085E1C": Failed to read FFStop List: Expected last pointer to be -1i32 or 0xFF for symbol npcscript_805DCA4 in buffer of 32 words with last being 0x809F6CC.
```

Marking npc script lists and their boundaries around `npcscript_805DCA4`.

2025-12-15 Wk 51 Mon - 03:40 +03:00

```
Tracing ccs Identifier { s: "ccs_8085804" }

thread 'main' panicked at src/bin/dump_script.rs:352:25:
No instructions read, and yet we fail to read ccs instructions at Identifier { s: "ccs_8085804" }: Partial read Error. Original error: Inst InstSchema { name: "ccs_set_camera_pos", cmd: 0, opt_subcmd: None, fields: [U16("hword1"), U16("hword3"), U16("hword5")] } overflows buffer size 1 at position 0. Parsed Instructions: []
```

Removing overflown unused `end_cutscenescript_8085805`.

2025-12-15 Wk 51 Mon - 03:44 +03:00

```
Tracing cutscenescript Identifier { s: "byte_80858A3" }

thread 'main' panicked at src/bin/dump_script.rs:384:25:
No terminating command before failing to read cutscenescript instructions at Identifier { s: "byte_80858A3" }: Partial read Error. Original error: Failed to route the command: No instruction schema found for position 16 and byte 0x8C. Parsed Instructions: /*...*/
```

```sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script trace cutscene byte_80858A3

# out (relevant)
Tracing cutscenescript Identifier { s: "byte_80858A3" }
0 new_inst: Inst { name: "cs_set_chatbox_flags", cmd: 60, opt_subcmd: Some(U8(0)), fields: [U8("byte2", 64)] }
3 new_inst: Inst { name: "cs_jump", cmd: 21, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 134764649 })] }
8 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
9 new_inst: Inst { name: "cs_sound_cmd_803810e", cmd: 80, opt_subcmd: None, fields: [U8("byte1", 172), U8("byte2", 88)] }
12 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
13 new_inst: Inst { name: "cs_pause", cmd: 2, opt_subcmd: None, fields: [U8("byte1", 8), U8("byte2", 4)] }
```

Should cut this at `python3 -c "print(hex(80))" # 0x50` inclusive. Nothing after is certain.

```C
byte_80858A3::
	.byte 0x3C, 0x0, 0x40, 0x15, 0x69, 0x58, 0x8, 0x8, 0x0
end_cutscenescript_80858AC::
	.byte 0x50, 0xAC
	.byte 0x58, 0x0, 0x2, 0x8, 0x4, 0x8C, 0x0, 0x0, 0x1, 0x0, 0xFF
	.byte 0x0, 0x0, 0x8, 0x50, 0xD4, 0x57, 0x0, 0x2, 0x8, 0x0, 0x0
```

2025-12-15 Wk 51 Mon - 04:10 +03:00

```
Tracing cutscenescript Identifier { s: "byte_8091707" }

thread 'main' panicked at src/bin/dump_script.rs:352:25:
No instructions read, and yet we fail to read cutscenescript instructions at Identifier { s: "byte_8091707" }: Partial read Error. Original error: Failed to route the command: Expected a next byte in the buffer to process a subcmd but found none. Parsed Instructions: []
```

We're overflowing `byte_8091708` which has only one uncertain reference in `byte_8091F08`. Removing `byte_8091708`.

2025-12-15 Wk 51 Mon - 04:19 +03:00

```
Tracing ccs Identifier { s: "ccs_8091412" }

thread 'main' panicked at src/bin/dump_script.rs:352:25:
No instructions read, and yet we fail to read ccs instructions at Identifier { s: "ccs_8091412" }: Partial read Error. Original error: Inst InstSchema { name: "ccs_simple_scroll", cmd: 4, opt_subcmd: None, fields: [U16("hword1"), U16("hword3"), U16("hword5"), U16("hword7")] } overflows buffer size 8 at position 0. Parsed Instructions: []
```

Removing overflown unused `end_cutscenescript_809141A`.

2025-12-15 Wk 51 Mon - 06:28 +03:00

Added logic to handle overflown unused references by merging, and to cut an end boundary for FFStop terminated script lists. We already handled cutting the list from it's starting point before, but not adding an end boundary label. We have run into 16 instances of the unused reference problem, so the issue is systematic. 

2025-12-15 Wk 51 Mon - 06:44 +03:00

```diff
 dat26:
-       .include "data/dat26.s"
+       .word 0x40000000, 0x00F780F5
+       .byte 0xFC
+       .byte 0x08
+
+cutscenescript_80924E4:
+       .word 0x0206003F, 0xFF271EFF, 0x3E07080C, CompText87CABC8 + COMPRESSED_PTR_FLAG, 0x24DC0054, 0x024A0809, npcscript_list_805D3CC, 0x1C3F343F
+       .word 0x271EFF02, 0x070808FF, 0x09256514, 0x1EFF0208, 0x0400FF3A, 0x3CFF0280, 0x00000014, 0x0CFF2700
+       .word 0x00760708, 0x0A017600, 0x1715FF2A, 0x0CE0FF29, 0x0154034A, 0xFF04403B, 0xFF004701, 0xFF004101
+       .word 0x80F4C001, 0x3FFC00F7, 0xA2FF2930, 0xA4FF290C, 0x3CFF020C, 0x27FFFF4E, 0x070808FF, 0x043F183F
+       .word 0x40003C00, 0x09251C15, 0x00000008, 0x40F9C000, 0x080000FF, 0x3E06003F, CompText87CAE68 + COMPRESSED_PTR_FLAG, 0x5401FF02
+       .word 0x09257000, 0x58024A08, 0x3F08070D, 0x021C3F34, 0xFF271EFF, 0x14070800, dword_80925E0, 0x3A1EFF02
+       .word 0x800400FF
+       .byte 0x02
+       .byte 0xFF
+       .byte 0x3C
+"data/dat26.s"
```

Cutting in `rom.s`... `dat26.s` does not have a label at the beginning of the file.

2025-12-15 Wk 51 Mon - 06:57 +03:00

Seems we're looping here:

```
Tracing ccs Identifier { s: "ccs_808538C" }
No instructions read, and yet we fail to read ccs instructions at Identifier { s: "ccs_808538C" }: Partial read Error. Original error: Inst InstSchema { name: "ccs_write_camera_field_03_14", cmd: 80, opt_subcmd: None, fields: [Ptr("ptr1")] } overflows buffer size 4 at position 0. Parsed Instructions: []. Attempting to merge.
Merging Identifier { s: "ccs_808538C" } Identifier { s: "end_cutscenescript_8085390" }
[src/drivers/symbols.rs:1207:5] &merged_string_to_replace = "ccs_808538C:\n\t.word 0x0057D450\nend_cutscenescript_8085390:\n\tend_cutscenescript_8085390:\n\t.byte 0x02\n\t.byte 0x08\n"
[src/drivers/symbols.rs:1208:5] &new_content = "ccs_808538C:\n\t.word 0x0057D450\n\t.byte 0x02\n\t.byte 0x08\n"
```

We're trying to merge this:

```
ccs_808538C:
	.word 0x0057D450
end_cutscenescript_8085390:
	.byte 0x02
	.byte 0x08
```

```
ccs_808538C:
	.word 0x0057D450
end_cutscenescript_8085390:
	.byte 0x02
	.byte 0x08
```

With tabs clarified:

```
ccs_808538C:
<TAB>.word 0x0057D450
end_cutscenescript_8085390:
<TAB>.byte 0x02
<TAB>.byte 0x08
```

```
[src/drivers/symbols.rs:1207:5] &merged_string_to_replace = "ccs_808538C:\n\t.word 0x0057D450\nend_cutscenescript_8085390:\n\tend_cutscenescript_8085390:\n\t.byte 0x02\n\t.byte 0x08\n"
```

This part has `end_cutscenescript_8085390` repeated twice. `ccs_808538C` shouldn't have been included but it was. I made a mistake assuming `DataLexonReplaceRecord`'s `substring` does not include label, but it does.

2025-12-15 Wk 51 Mon - 07:13 +03:00

```
Tracing ccs Identifier { s: "ccs_808538C" }
No instructions read, and yet we fail to read ccs instructions at Identifier { s: "ccs_808538C" }: Partial read Error. Original error: Inst InstSchema { name: "ccs_write_camera_field_03_14", cmd: 80, opt_subcmd: None, fields: [Ptr("ptr1")] } overflows buffer size 4 at position 0. Parsed Instructions: []. Attempting to merge.
Merging Identifier { s: "ccs_808538C" } with Identifier { s: "end_cutscenescript_8085390" }
[src/drivers/symbols.rs:1209:5] &merged_string_to_replace = "ccs_808538C:\n\t.word 0x0057D450\nend_cutscenescript_8085390:\n\t.byte 0x02\n\t.byte 0x08\n"
[src/drivers/symbols.rs:1210:5] &new_content = "ccs_808538C:\n\t.word 0x0057D450\n\t.byte 0x02\n\t.byte 0x08\n"
[3824711::ThreadId(1)] <exhaustively_process_using_scanners>
[3824711::ThreadId(1)] </exhaustively_process_using_scanners 159.463652ms #items: 5383>
Tracing ccs Identifier { s: "ccs_808538C" }
Cutting 0x805D0C8 "end_npcscript_list_805D0C8"
[3824711::ThreadId(1)] <exhaustively_process_using_scanners>
[3824711::ThreadId(1)] </exhaustively_process_using_scanners 103.620727ms #items: 3445>
```

```
ccs_808538C:
	.word 0x0057D450
	.byte 0x02
	.byte 0x08
```

It merged them!

```
npcscript_805D0A4:
	.word 0x0805D0C8, 0x0805D125, 0x0805D13B, 0x0805D159, 0x0805D177, 0x0805D195, 0x0805D1AC, 0x0805D1C4
	.word 0x000000FF

end_npcscript_list_805D0C8:
	.word 0x17271F08, 0xFFCC1400, 0xFFF4FFF8, byte_83F0716, 0x15111601, 0x16061001, 0x02083C01, 0x1603083F
	.word 0x10031513, 0x15111608, 0x160A1001, 0x04083C01, 0x1605083F, 0x06083C07, 0x1407083F, 0xFFF40050
	.word 0x17160000, 0x18100715, 0x083C0116, 0x09083F08, 0x083C0316, 0x0B083F0A, 0x09F6CC36
	.byte 0x08
```

And it added a boundary end condition for the lists on its own!

That's two class of problems out.

2025-12-15 Wk 51 Mon - 07:38 +03:00

```
Tracing cutscenescript Identifier { s: "cutscenescript_8085A60" }

No terminating command before failing to read cutscenescript instructions at Identifier { s: "cutscenescript_8085A60" }: Partial read Error. Original error: Failed to route the command: No instruction schema found for position 15 and byte 0x8C. Parsed Instructions: /*...*/
```

```sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
bn_repo_editor ➜ cargo run --release --bin dump_script trace cutscene cutscenescript_8085A60

# out
Tracing cutscenescript Identifier { s: "cutscenescript_8085A60" }
0 new_inst: Inst { name: "cs_set_chatbox_flags", cmd: 60, opt_subcmd: Some(U8(0)), fields: [U8("byte2", 64)] }
3 new_inst: Inst { name: "cs_jump", cmd: 21, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 0x08085A25 })] }
8 new_inst: Inst { name: "cs_sound_cmd_803810e", cmd: 80, opt_subcmd: None, fields: [U8("byte1", 212), U8("byte2", 87)] }
11 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
12 new_inst: Inst { name: "cs_pause", cmd: 2, opt_subcmd: None, fields: [U8("byte1", 8), U8("byte2", 4)] }
```

We should stop at byte 12 since we have a termination.

```C
cutscenescript_8085A60:
	.word 0x1540003C, byte_8085A25, 0x0057D450
end_cutscenescript_8085A6C::
	.word 0x8C040802, 0x00000000, 0x040000FF, 0xFF80002A, 0x0000FF80
	.byte 0x08
```

2025-12-15 Wk 51 Mon - 10:20 +03:00

```
Tracing ccs Identifier { s: "ccs_808AEF0" }

thread 'main' panicked at src/bin/dump_script.rs:298:29:
Failed to cut then mark new label: Unsafe and currently unsupported to merge away a symbol with references, but RomEa { ea: 0x0808AEF1 } had 2 grep occurances.
```

This should say `Failed to merge data` not `Failed to cut then mark new label`. 

`end_cutscenescript_808AEF1` should have only 1 reference but:

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
grep 'end_cutscenescript_808AEF1:' $(find -regex ".*\(.s\|.inc\)" -type f)

# out
./tags:end_cutscenescript_808AEF1       data/dat23.s    /^end_cutscenescript_808AEF1:$/;"       l
./data/dat23.s:end_cutscenescript_808AEF1:
```

Why is `./tags` included? ~~Oh. Because it ends with an `s`... ~~

~~Let's be explicit it has to end with `.*.s`:~~

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
grep 'end_cutscenescript_808AEF1:' $(find -regex ".*\(.*\.s\|.*\.inc\)" -type f)

# out
./data/dat23.s:end_cutscenescript_808AEF1:
```

The issue was likely just that `.` is interpreted as any character. We want `\.`:

```sh
grep 'end_cutscenescript_808AEF1:' $(find -regex ".*\(\.s\|\.inc\)" -type f)
```

2025-12-15 Wk 51 Mon - 10:31 +03:00

```
Tracing ccs Identifier { s: "ccs_808AEF0" }

thread 'main' panicked at src/bin/dump_script.rs:519:37:
script RomEa { ea: 0x0808AF0C } "cutscenescript_808AF0C": Failed to read FFStop List: Expected pointers to be -1i32 terminated or FF terminated, not empty: npcscript_805F9EC
```

```sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script trace cutscene cutscenescript_808AF0C

# out (relevant)
Tracing cutscenescript Identifier { s: "cutscenescript_808AF0C" }
0 new_inst: Inst { name: "cs_lock_player_for_non_npc_dialogue_809e0b0", cmd: 63, opt_subcmd: Some(U8(0)), fields: [] }
2 new_inst: Inst { name: "cs_nop_80377d0", cmd: 6, opt_subcmd: None, fields: [] }
3 new_inst: Inst { name: "cs_decomp_text_archive", cmd: 62, opt_subcmd: None, fields: [Ptr("ptr1", RomCompressed(CompressedRomEa { ea: 0x087B83EC }))] }
8 new_inst: Inst { name: "cs_pause", cmd: 2, opt_subcmd: None, fields: [U8("byte1", 255), U8("byte2", 1)] }
11 new_inst: Inst { name: "cs_run_cutscene_camera_script", cmd: 84, opt_subcmd: Some(U8(0)), fields: [Ptr("ptr1", Rom(RomEa { ea: 0x0808AEF0 }))] }
17 new_inst: Inst { name: "cs_spawn_ow_npc_objects_from_list", cmd: 74, opt_subcmd: Some(U8(2)), fields: [Ptr("ptr2", Rom(RomEa { ea: 0x0805F9EC }))] }
// ...
```

```
npcscript_805F9EC:
	.byte 0x00
end_npcscript_805F9ED:
	.word 0x1D0805FA, 0x510805FA, 0x8D0805FA, 0xFF0805FA, 0x09000000, 0x0017271F, 0x48FF2E14, 0x16000000
```

Notice that it looks like eas alignment shifted by a byte. Once again speculative boundary labels we put like `end_npcscript_805F9ED` here are doing us a disservice. 

Removing `end_npcscript_805F9ED`. 

2025-12-15 Wk 51 Mon - 10:52 +03:00

```
Tracing npcscript Identifier { s: "npcscript_805FDF0" }

No terminating command before failing to read npcscript instructions at Identifier { s: "npcscript_805FDF0" }: Partial read Error. Original error: Failed to route the command: No instruction schema found for position 120 and byte 0x78. Parsed Instructions: /*...*/
```

```sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script trace npc npcscript_805FDF0

# out (relevant)
Tracing npcscript Identifier { s: "npcscript_805FDF0" }
0 new_inst: Inst { name: "ns_set_active_and_visible", cmd: 8, opt_subcmd: None, fields: [] }
// ...
107 new_inst: Inst { name: "ns_set_animation", cmd: 22, opt_subcmd: None, fields: [U8("byte1", 0)] }
109 new_inst: Inst { name: "ns_write_cutscene_var", cmd: 60, opt_subcmd: None, fields: [U8("byte1", 8), U8("byte2", 17)] }
112 new_inst: Inst { name: "ns_wait_cutscene_var", cmd: 63, opt_subcmd: None, fields: [U8("byte1", 8), U8("byte2", 18)] }
115 new_inst: Inst { name: "ns_jump_with_link", cmd: 54, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 0x0809F6CC })] }
```

It ends with an `ns_jump_with_link`. Let's cut it at position 120.

```sh
python3 -c "print(hex(0x805FDF0 + 120))" # 0x805fe68
```

```sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 805fe68 -M "end_npcscript_805FE68"  
```

```
end_npcscript_805FE68:
	.word 0x0805FE78, 0x0805FE8E, 0x0805FEA4, 0x000000FF, 0x17271F08, 0xFFD21415, 0x0000004C, byte_83F0116
```

We can see it's a list. The process should be able to cut its end boundary on its own now.

2025-12-15 Wk 51 Mon - 13:13 +03:00

```
Tracing cutscenescript Identifier { s: "dword_808F2A8" }

thread 'main' panicked at src/bin/dump_script.rs:413:25:
No terminating command before failing to read cutscenescript instructions at Identifier { s: "dword_808F2A8" }: Partial read Error. Original error: Failed to route the command: No instruction schema found for position 15 and byte 0xFF. Parsed Instructions: /*...*/
```

```sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script trace cutscene dword_808F2A8

# out (relevant)
Tracing cutscenescript Identifier { s: "dword_808F2A8" }
0 new_inst: Inst { name: "cs_set_chatbox_flags", cmd: 60, opt_subcmd: Some(U8(0)), fields: [U8("byte2", 64)] }
3 new_inst: Inst { name: "cs_jump", cmd: 21, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 0x0808F253 })] }
8 new_inst: Inst { name: "cs_wait_if_player_sprite_cur_frame_not_equal_maybe", cmd: 5, opt_subcmd: None, fields: [U8("byte1", 0)] }
10 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
11 new_inst: Inst { name: "cs_wait_screen_fade", cmd: 7, opt_subcmd: None, fields: [] }
12 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
13 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
14 new_inst: Inst { name: "cs_nop_8038256", cmd: 92, opt_subcmd: None, fields: [] }
```
Let's end it at position 13. 

```sh
python3 -c "print(hex(0x808F2A8 + 13))" # 0x808f2b5
```

```sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 808f2b5 -M "end_cutscenescript_808F2B5"  
```

2025-12-15 Wk 51 Mon - 15:08 +03:00

```
Tracing cutscenescript Identifier { s: "cutscenescript_808E3E0" }

thread 'main' panicked at src/bin/dump_script.rs:413:25:
No terminating command before failing to read cutscenescript instructions at Identifier { s: "cutscenescript_808E3E0" }: Partial read Error. Original error: Failed to route the command: No instruction schema found for position 15 and byte 0x80. Parsed Instructions: /*...*/
```

2025-12-15 Wk 51 Mon - 15:22 +03:00

Added logic to check the last four commands, early-first, for terminating instructions. In this case and previous, the termination came 2-3 commands before and not strictly the last.

2025-12-15 Wk 51 Mon - 16:12 +03:00

```
Tracing mapscript Identifier { s: "dword_8060834" }

thread 'main' panicked at src/bin/dump_script.rs:444:21:
No terminating command before failing to read mapscript instructions at Identifier { s: "dword_8060834" }: Partial read Error. Original error: Inst InstSchema { name: "ms_start_cutscene", cmd: 38, opt_subcmd: None, fields: [Ptr("ptr1"), U32("word5")] } overflows buffer size 11 at position 8. Parsed Instructions: [Inst { name: "ms_jump_if_flag_clear", cmd: 5, opt_subcmd: None, fields: [U8("byte1", 255), Event16("event16_2", 2748), Dest("destination4", RomEa { ea: 0x0806084A })] }]
```

This case does parse partially but still runs into an overflow of an unreferenced label. So we're extending the merging logic to apply here too.

2025-12-15 Wk 51 Mon - 16:43 +03:00

```
Cutting 0x808E914 "cutscenescript_808E914"

./data/dat24.s: Assembler messages:
./data/dat24.s:1229: Error: symbol `thumb_local_start' is already defined
```

Tabbed `thumb_local_start`. I think the issue is that the rule added to preserve the `\t` ending was not added to `cut_then_mark_new_label`, only `replace_repo_content_for_data`. I also added it to `merge_datablock_with_next_unused`.

2025-12-16 Wk 51 Tue - 01:20 +03:00

```
Process in range: end_npcscript_8061408
Tracing npcscript Identifier { s: "end_npcscript_8061408" }

thread 'main' panicked at src/bin/dump_script.rs:383:25:
No instructions read, and yet we fail to read npcscript instructions at Identifier { s: "end_npcscript_8061408" }: Partial read Error. Original error: Failed to route the command: No instruction schema found for position 0 and byte 0xF0. Parsed Instructions: []. Attempting to merge.
```

There is code in the middle of that range so it needs to be split starting from `off_8061448` to continue.

```
cargo run --release --bin dump_script range npc off_8061448 byte_8061780 &&
cargo run --release --bin dump_script range npc npcscript_list_8061C5C byte_8062710 || speaker-test -t sine -f 1000 -l 1
```

```
grep 'byte_8061622:' $(find -regex ".*\(.*\.s\|.*\.inc\)" -type f)
```

This command is wrong for including a `:`. A reference wouldn't have that, so we ended up merging this label when we shouldn't in

```
Merging Identifier { s: "byte_8061600" } with Identifier { s: "byte_8061622" }
```

But it has one use that is disputable so we're removing it. Same with `byte_8061416` in `byte_80191C8`. 

2025-12-16 Wk 51 Tue - 03:06 +03:00

```diff
 dat27:
-       .include "data/dat27.s"
+       .word 0x80FB4000, 0x080400F1
+
+cutscenescript_8094788:
+       .word 0x3E06003F, CompText87D109C + COMPRESSED_PTR_FLAG, 0x5401FF02, 0x09478000, 0xBC024A08, 0x3F08063D, 0x271C3F34, 0x070808FF
+       .word 0x09483714, 0x1EFF0208, 0x0400FF3A, 0x1EFF0280, 0x09010835, 0xFF020208, 0x01FF3A1E, 0x08358004
+       .word 0x10FF0203, 0x02040835, 0x083510FF, 0x10FF0205, 0x02060835, 0x083510FF, 0x10FF0207, 0x02080835
+       .word 0x083510FF, 0x10FF0209, 0x020A0835, 0x083510FF, 0x10FF020B, 0x020C0835, 0x0014F0FF, 0x27000000
+       .word 0x07080CFF, 0x405AFF02, 0x4704FF04, 0x4104FF00, 0x0001FF00, 0x00000000, 0x29303F00, 0x280E1DFF
+       .word 0x004CFFFF, 0x09484000, 0x183F3B08, 0x3C00043F, 0x02154000, 0x00080948, 0x04000001, 0x00000000
+       .word 0x00000000, 0x00000000
+"data/dat27.s"
 asm28_0:

```

Need to add labels in the files themselves so it doesn't replace here.

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
cat bn6f.sym | grep AAAAAA > a

# in a 
:%s/0\([0-9A-Fa-f]*\) g 00000000 \(AAAAAA[0-9]*\)/.\/replacep.sh "\2" "unk_\1"/g

# Then rectangle select the ea part of the label and use ~ to make it capitalized

# in /home/lan/src/cloned/gh/dism-exe/bn6f
chmod +x a
./a
rm a
```

To fill some other dat files without a label at the start (dat27, dat35, dat37).

2025-12-16 Wk 51 Tue - 04:00 +03:00

```
byte_80933D4::
	.word 0x0057D450
	.byte 0x02
	.byte 0x08

end_ccs_80933DA:
	.byte 0x00
	.byte 0x00

cutscenescript_80933DC:
	.word 0x3E06003F, CompText87CCC70 + COMPRESSED_PTR_FLAG, 0x5301FF02, 0x005400FF, byte_80933D4, 0x41B0024A, 0x343F0806, 0x024E1C3F
	.word 0x08FF2700, 0x81140702, 0x02080934, 0xFF3A1EFF, 0x02800400, 0x08353CFF, 0x02080901, 0x3A3CFF02
	.word 0x800401FF, 0x351EFF02, 0x08090308, 0x1EFF0204, 0x0402FF3A, 0x1EFF0280, 0x09050835, 0xFF020608
	.word 0x03FF3A3C, 0xFF028004
	.byte 0x3C
```

No error but this is an interesting case. Command 0x00 here would be interpreted as `ccs_set_camera_pos_cmd`, which requires 7 bytes. This initially made `byte_80933D4` merge with `cutscenescript_80933DC` because the buffer was not enough to exhaust the script. But once merged, it ran into a schema error parsing  the portion in `cutscenescript_80933DC`, which initiated another correction to cut at the last known end command earliest from 4 commands, and this is the correct 0x08 where `end_ccs_80933DA` is likely inserted. Then  via tracing `cutscenescript_80933DC` is cut again.

These various measures to correct interacted in a dance and brought about a correct end result in the end.

2025-12-16 Wk 51 Tue - 04:41 +03:00

```
Dumping Identifier { s: "byte_8062908" }

/home/lan/src/cloned/gh/dism-exe/bn6f/./maps/SkyTown/data.s:1987: undefined reference to `unk_8582244'
tools/binutils/bin/arm-none-eabi-ld: /home/lan/src/cloned/gh/dism-exe/bn6f/./maps/SkyTown/data.s:1987: undefined reference to `unk_8582284'
tools/binutils/bin/arm-none-eabi-ld: /home/lan/src/cloned/gh/dism-exe/bn6f/./maps/SkyTown/data.s:1987: undefined reference to `unk_8582264'
tools/binutils/bin/arm-none-eabi-ld: /home/lan/src/cloned/gh/dism-exe/bn6f/./maps/SkyTown/data.s:1987: undefined reference to `unk_85822A4'
```

These should be global identifiers rather than local.

Made all these global:

```C
unk_8582244::
	.word 0x7EB1739C, 0x6A0C6A0C, 0x6A0C7E8A, 0x7EAE7E8A, 0x7F167ED2, 0x1E0E0379, 0x007F279E, 0x21080058

unk_8582264::
	.word 0x77787E8A, 0x7E8A7E8A, 0x6A0C739C, 0x7E8A7F16, 0x7ED27EAE, 0x1F2E7D13, 0x0A1F259E, 0x2108093A
unk_8582284::
	.word 0x7EB1739C, 0x6A0C6A0C, 0x6A0C7E8A, 0x7F167ED2, 0x7EAE7E8A, 0x1E0E0379, 0x007F279E, 0x21080058

unk_85822A4::
	.word 0x77787E8A, 0x7E8A7E8A, 0x6A0C739C, 0x7ED27EAE, 0x7E8A7F16, 0x1F2E7D13, 0x0A1F259E, 0x2108093A
	.word 0x00000100

unk_85822C8::
	.word 0x7EB1739C, 0x6A0C6A0C, 0x6A0C7E8A, 0x7EAE7E8A, 0x7F167ED2, 0x1E0E0379, 0x007F279E, 0x00310058

unk_85822E8::
	.word 0x7EB1739C, 0x6A0C6A0C, 0x6A0C7E8A, 0x7EAE7E8A, 0x7F167ED2, 0x1E0E0379, 0x007F279E, 0x009F0058
```

Also removed some EWRAM labels introduced in `dword_8580F08` after cutting. There's no evidence they should be there.

```C
byte_8062908::
	gfx_anim_pal_copy dest=unk_3001A40 size=0x00000020 index=0x00
	gfx_anim_data_ptr ptr=unk_8582244 delay=0x0000000C
	gfx_anim_data_ptr ptr=unk_8582284 delay=0x0000000C
	gfx_anim_data_ptr ptr=unk_8582264 delay=0x0000000C
	gfx_anim_data_ptr ptr=unk_85822A4 delay=0x0000000C
	gfx_anim_loop
```

These are graphics anim data pointers! Something to explore later.

2025-12-16 Wk 51 Tue - 05:45 +03:00

```
Cutting 0x80964A1 "ccs_80964A1"

bn6f.gba: FAILED
```

It got fake pointer `getCurChipInBattleHand_8010004`. 

2025-12-16 Wk 51 Tue - 05:58 +03:00

```
Cutting 0x80964A9 "ccs_80964A9"

bn6f.gba: FAILED
```

Because `ccs_80964A1` was cut again. Hardcoding `getCurChipInBattleHand_8010004`.

I also added the remaining maps to dump to a script starting with 

```sh
#!/bin/bash

pushd /home/lan/src/cloned/gh/dism-exe/bn6f &&
make clean > /dev/null && make -j$(nproc) assets > /dev/null && make -j$(nproc) && make bn6f.sym &&
popd &&
rm -rf ~/data/apps/bn_repo_editor/* && cargo run --release --bin bn_repo_editor lexer &&

// ...

cargo run --release --bin dump_script trace map byte_807F39F &&

cargo run --release --bin dump_script struct_range byte_807EEB8 byte_807F1E0 "Bn6f::MapObjectSpawnData" --stop ffstop32 &&
cargo run --release --bin dump_script range npc off_807F4BC byte_807F67D || speaker-test -t sine -f 1000 -l 1
```

So that all artifacts are in sync instead of running each command seperately.

2025-12-16 Wk 51 Tue - 06:03 +03:00

```
Merging Identifier { s: "ccs_80964A9" } with Identifier { s: "cutscenescript_80964C0" }
// ...
Failed to process new symbol data for script Cutscene Identifier { s: "cutscenescript_80964C0" }: Effective address RomEa { ea: 0x080964C0 } is not in sym file
```

We weren't fortunate with this case.

```sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 80964C0 -M "cutscenescript_80964C0"  
```

```C
ccs_80964A9:
	.word 0x00004004, 0x40FF8000, 0x00400400, 0xFF800000
	.byte 0x00
	.byte 0x00
	.byte 0x08

end_ccs_80964BC:
	.word 0x00000008

cutscenescript_80964C0:
	.word 0x3E06003F, CompText87D3798 + COMPRESSED_PTR_FLAG, 0x5401FF02, 0x0963E800, 0x74024A08, 0x3F08065A, 0x351C3F34, 0xFF270108
	// ...
```

2025-12-16 Wk 51 Tue - 07:00 +03:00

```
Process in range: undumped_code_80652A0
Tracing npcscript Identifier { s: "undumped_code_80652A0" }
```

Range dumping hit code.

Dumping only from after:

```
cargo run --release --bin dump_script range npc off_80652EC byte_8065FC9 &&
```

2025-12-16 Wk 51 Tue - 07:24 +03:00

```
Tracing mapscript Identifier { s: "mapscript_8066634" }
Tracing gfx_anim_script Identifier { s: "byte_8140BAC" }
Tracing gfx_anim_script Identifier { s: "byte_8140BF0" }

thread 'main' panicked at src/bin/dump_script.rs:452:21:
Failed to read gfx_anim_script instructions at Identifier { s: "byte_8140BF0" }: Other error: Failed to read gfx anim script data commands: line 488: Failed to read a u32 at position 36 for buffer of length 36 for data delay
```

```sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script trace map mapscript_8066634
```

It's a non-issue. And neither is `byte_8140BAC`. 

```sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script trace gfx_anim byte_8140BF0

# out
Tracing gfx_anim_script Identifier { s: "byte_8140BF0" }
0 new_inst: Inst { name: "gfx_anim_data", cmd: 0, opt_subcmd: None, fields: [U32("data", 2147485824), U32("delay", 10)] }
8 new_inst: Inst { name: "gfx_anim_jump", cmd: 2, opt_subcmd: None, fields: [Magic24("magic24_1", 0), Dest("dest", RomEa { ea: 0x08140BC0 })] }
16 new_inst: Inst { name: "gfx_anim_data", cmd: 0, opt_subcmd: None, fields: [U32("data", 4), U32("delay", 50338656)] }
24 new_inst: Inst { name: "gfx_anim_data", cmd: 0, opt_subcmd: None, fields: [U32("data", 4279045644), U32("delay", 2147490048)] }
```

There's another one I marked:

```C
byte_8140BF0:
	.byte 0x4, 0x0, 0x0, 0x0, 0x50, 0x17, 0x0, 0x3, 0xC, 0xF, 0xC, 0xFF
	.byte 0x80, 0x8, 0x0, 0x80, 0xA, 0x0, 0x0, 0x0, 0x2, 0x0, 0x0, 0x0
	.word byte_8140BC0
gfx_anim_8140C0C::
	.byte 0x4, 0x0, 0x0, 0x0, 0x60, 0x1B, 0x0, 0x3, 0xC, 0xE, 0xD, 0xFF
	.byte 0x0, 0x19, 0x0, 0x80, 0xA, 0x0, 0x0, 0x0
```

2025-12-16 Wk 51 Tue - 07:56 +03:00

```
Tracing ccs Identifier { s: "byte_8082DA8" }
0 new_inst: Inst { name: "ccs_write_camera_field_03_14", cmd: 80, opt_subcmd: None, fields: [Ptr("ptr1", Ewram(EwramEa { ea: 0x020057D4 }))] }
5 new_inst: Inst { name: "ccs_end", cmd: 8, opt_subcmd: None, fields: [] }

thread 'main' panicked at src/bin/dump_script.rs:532:33:
Failed to process new symbol data for script Cutscene Identifier { s: "cutscenescript_8082DB0" }: Effective address RomEa { ea: 0x08082DB0 } is not in sym file
```

2025-12-16 Wk 51 Tue - 08:30 +03:00

```
Tracing gfx_anim_script Identifier { s: "gfx_anim_script_8082E58" }

thread 'main' panicked at src/bin/dump_script.rs:452:21:
Failed to read gfx_anim_script instructions at Identifier { s: "gfx_anim_script_8082E58" }: Other error: Failed to read gfx anim script start command: Failed to read gfx anim data common struct: Expected buffer of size 12 but got 4
```

```
gfx_anim_script_8082E58:
	.word 0x00000000
end_cutscenescript_8082E5C:
	.word iPalette3001B60, 0xFF0D0E0C, 0x80000004, 0x0000001E
```

Removing `end_cutscenescript_8082E5C`.

2025-12-16 Wk 51 Tue - 09:08 +03:00

```
Cutting 0x8086E71 "unk_8086E71"

bn6f.gba: FAILED
```

```diff
loc_8086E60::
        bl sub_8086F5C
        mov r0, #0
 locret_8086E6A::
+       .word 0x013BBD20
+       .byte 0x00
+       .byte 0x00
+       .byte 0x00
+
+unk_8086E71:
+       .word 0x004818B5, 0x941C0568, 0x31F77921, 0xF22005FD, 0x53F7A821, 0x412016F9, 0x41F7A821, 0x422016F9
+       .word 0x3DF7A821, 0x432016F9, 0x39F7A821, 0x442016F9, 0x35F7A821, 0xF0BD00F9, 0x2D4D0AB5, 0x47F00068
+       .word 0x012800F9, 0x65F000D0, 0x8DF000F9, 0xED2005F8, 0x4FF7A821, 0x00D001F9, 0x00F928F0, 0xF0F992F0
+       .byte 0xBD
+       .byte 0x00
+       .byte 0x00
        pop {r5,pc}
```

It's cut at a function.

Added a new label it should cut from:

```C
locret_8086E6A::
	pop {r5,pc}
	thumb_func_end sub_8086DF8

unk_8086E6C::
	.byte 0x3B, 0x1, 0x0, 0x0, 0x0, 0xB5, 0x18, 0x48, 0x0, 0x68, 0x5, 0x1C
	.byte 0x94, 0x21, 0x79, 0xF7, 0x31, 0xFD, 0x5, 0x20, 0xF2, 0x21, 0xA8, 0xF7
```

2025-12-16 Wk 51 Tue - 09:27 +03:00

```
Tracing cutscenescript Identifier { s: "cutscenescript_8085BDC" }
Tracing cutscenescript Identifier { s: "cutscenescript_8085C24" }

thread 'main' panicked at src/bin/dump_script.rs:298:29:
Failed to merge data: Unsafe and currently unsupported to merge away a symbol with references, but RomEa { ea: 0x08085C32 } had 2 grep occurances.
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace

```

`byte_8085C32` seems to be referenced in its own block... removing. (Bad decision but It was still identified later as `ccs_8085C32`)

2025-12-16 Wk 51 Tue - 10:23 +03:00

```
Tracing cutscenescript Identifier { s: "cutscenescript_808B9B0" }
Tracing cutscenescript Identifier { s: "cutscenescript_808B9F8" }

thread 'main' panicked at src/bin/dump_script.rs:298:29:
Failed to merge data: Unsafe and currently unsupported to merge away a symbol with references, but RomEa { ea: 0x0808BA08 } had 2 grep occurances.
```

`byte_808BA08`'s use seems legitimate.

```sh
# in  /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script trace cutscene cutscenescript_808B9F8

# out (relevant)
Tracing cutscenescript Identifier { s: "cutscenescript_808B9F8" }
0 new_inst: Inst { name: "cs_set_chatbox_flags", cmd: 60, opt_subcmd: Some(U8(0)), fields: [U8("byte2", 64)] }
3 new_inst: Inst { name: "cs_jump", cmd: 21, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 0x0808B9D5 })] }
8 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
9 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
```

This should be cut. Adding `end_cutscenescript_808BA00` and `unk_808BA02`:

```C
cutscenescript_808B9F8:
	.word 0x1540003C, byte_808B9D5
end_cutscenescript_808BA00::
	.byte 0x00, 0x00
unk_808BA02::
	.byte 0x17, 0xC0
	.word 0x08FFC0F0
```

2025-12-16 Wk 51 Tue - 11:19 +03:00

```
Process in range: byte_806957D
Tracing npcscript Identifier { s: "byte_806957D" }

thread 'main' panicked at src/bin/dump_script.rs:383:25:
No instructions read, and yet we fail to read npcscript instructions at Identifier { s: "byte_806957D" }: Partial read Error. Original error: Failed to route the command: No instruction schema found for position 0 and byte 0xB5. Parsed Instructions: [].
```

Renaming to `undumped_code_806957D`.  Need to not dump it in range.

2025-12-16 Wk 51 Tue - 11:26 +03:00

```
Tracing npcscript Identifier { s: "byte_8069635" }

thread 'main' panicked at src/bin/dump_script.rs:383:25:
No instructions read, and yet we fail to read npcscript instructions at Identifier { s: "byte_8069635" }: Partial read Error. Original error: Failed to route the command: No instruction schema found for position 0 and byte 0xB5. Parsed Instructions: [].
```

Renaming `byte_8069635` to `undumped_code_8069635` with selecting all instances in quickfix then `:cdo %s/byte_8069635/undumped_code_8069635/g` though in this case it's in the same file.

`byte_806971D` is also undumped code

2025-12-16 Wk 51 Tue - 11:57 +03:00

```
Cutting 0x808EA88 "cutscenescript_808EA88"

rom.s: Error: unaligned opcodes detected in executable segment
```

Cut at a function.

2025-12-16 Wk 51 Tue - 12:52 +03:00

```
Cutting 0x8096B24 "ccs_8096B24"

bn6f.gba: FAILED
```

Use of `sub_80180EC` and `off_8008000` is fake. Hardcoding. Happened again in cutting, so hardcoding again x2.

2025-12-16 Wk 51 Tue - 13:57 +03:00

```
Process in range: byte_806B829
Tracing npcscript Identifier { s: "byte_806B829" }

thread 'main' panicked at src/bin/dump_script.rs:383:25:
No instructions read, and yet we fail to read npcscript instructions at Identifier { s: "byte_806B829" }: Partial read Error. Original error: Failed to route the command: No instruction schema found for position 0 and byte 0xB5. Parsed Instructions: [].
```

Need to avoid `byte_806B829`. It's undumped code. Renaming to `undumped_code_806B829`



Also some more data to look into: `cs_warp_cmd_8038040_2 byte1=0x0 byte2=0x00 ptr3=byte_809679C`

2025-12-16 Wk 51 Tue - 15:15 +03:00

Removing `byte_8070102` unused pointer in the middle of structs and also `byte_8070202`

2025-12-16 Wk 51 Tue - 16:00 +03:00

```
Process in range: byte_80714F2
Tracing npcscript Identifier { s: "byte_80714F2" }
Tracing npcscript Identifier { s: "byte_809F6CC" }
Tracing npcscript Identifier { s: "byte_80714F2" }
Tracing npcscript Identifier { s: "byte_809F6CC" }
Dumping Identifier { s: "byte_80714F2" }
Dumping Identifier { s: "byte_809F6CC" }

thread 'main' panicked at src/bin/dump_script.rs:873:33:
Failed to process symbol data for script Npc RomEa { ea: 0x08071503 }: Effective address RomEa { ea: 0x08071503 } is not in sym file
```

`0x08071503` doesn't seem existent.  It cuts at this instruction:

```
byte_80714F2::
	ns_set_active_and_visible
	ns_set_sprite byte1=0x3C
	ns_set_text_script_index_and_ptr_to_decomp_buffer byte1=0x05
	ns_set_coords hword1=0x004E hword3=0xFF34 hword5=0x0000
	ns_set_animation byte1=0x03
	ns_jump_with_link destination1=byte_809F6CC
	^~~~

byte_8071505::
	ns_set_active_and_visible
	ns_set_sprite_with_category byte1=0x02 byte2=0x1C
	ns_init_mystery_data hword1=0x163A
	ns_wait_mystery_data_taken hword1=0x163A
```

There was also a merging record on it:

```
Merging Identifier { s: "byte_80714F2" } with Identifier { s: "byte_8071503" }
```

So it likely stayed as an artifact despite being a false label. Rerunning resolves this.Go

2025-12-16 Wk 51 Tue - 16:13 +03:00

```diff
dat23:
	.word 0x0206003F, 0x1C3E1EFF, 0x47087DCE, 0x4004FF00, 0x3F04FF04, 0x9DCD141C, 0xFF020808, 0x08FF3A1E
	.word 0xFF028004, 0x9DAE151E, 0x00000808

cutscenescript_8089D84:
	.word 0x3E06003F, TextScript87DCE1C, 0x4701FF02, 0x4004FF00, 0x3F04FF04, 0x08FF271C, 0xCD140704, 0x0208089D
	.word 0xFF3A1EFF, 0x02800408, 0x00141EFF, 0x27000000, 0x07080CFF, 0x0154034A, 0x3CFF023B, 0x27FFFF4E
	.word 0x070808FF, 0x043F183F, 0x40003C00, 0x089DAE15, 0x00000008
"data/dat23.s"
```

More cuts in rom.s...

Added `unk_8089D58` to beginning of `dat23.s`.

2025-12-16 Wk 51 Tue - 17:09 +03:00

```
Cutting 0x80763CE "npcscript_80763CE"

bn6f.gba: FAILED
```

Need to hardcode fake pointer `sub_8143C18`.  x2

2025-12-17 Wk 51 Wed - 02:13 +03:00

```
Tracing mapscript Identifier { s: "mapscript_8078173" }
1016 33627852

thread 'main' panicked at src/bin/dump_script.rs:215:15:
script RomEa { ea: 0x08078173 } "mapscript_8078173": We can only cut in ROM EAs: Ewram(EwramEa { ea: 0x02011ECC })
```

```
unk_2011EC0:: // 0x2011ec0
	.space 4
unk_2011EC4:: // 0x2011ec4
	.space 4
unk_2011EC8:: // 0x2011ec8
	.space 4
unk_2011ECC:: // 0x2011ecc
	.space 20
```

2025-12-17 Wk 51 Wed - 04:51 +03:00

```
Tracing cutscenescript Identifier { s: "cutscenescript_8090EFC" }

thread 'main' panicked at src/bin/dump_script.rs:298:29:
Failed to merge data: Unsafe and currently unsupported to merge away a symbol with references, but RomEa { ea: 0x08090F1E } had 2 grep occurances.
```

`byte_8090F1E` looks real.

```sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script trace cutscene cutscenescript_8090EFC

# out (relevant)
Tracing cutscenescript Identifier { s: "cutscenescript_8090EFC" }
0 new_inst: Inst { name: "cs_set_chatbox_flags", cmd: 60, opt_subcmd: Some(U8(0)), fields: [U8("byte2", 64)] }
3 new_inst: Inst { name: "cs_load_gfx_anims", cmd: 55, opt_subcmd: None, fields: [Ptr("ptr1", Rom(RomEa { ea: 0x08034938 }))] }
8 new_inst: Inst { name: "cs_set_screen_fade", cmd: 39, opt_subcmd: None, fields: [U8("byte1", 255), U8("byte2", 32), U8("byte3", 255)] }
12 new_inst: Inst { name: "cs_wait_screen_fade", cmd: 7, opt_subcmd: None, fields: [] }
13 new_inst: Inst { name: "cs_pause", cmd: 2, opt_subcmd: None, fields: [U8("byte1", 255), U8("byte2", 1)] }
16 new_inst: Inst { name: "cs_set_screen_fade", cmd: 39, opt_subcmd: None, fields: [U8("byte1", 255), U8("byte2", 12), U8("byte3", 8)] }
20 new_inst: Inst { name: "cs_wait_screen_fade", cmd: 7, opt_subcmd: None, fields: [] }
21 new_inst: Inst { name: "cs_jump", cmd: 21, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 0x08090EB3 })] }
26 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
27 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
28 new_inst: Inst { name: "cs_sound_cmd_803810e", cmd: 80, opt_subcmd: None, fields: [U8("byte1", 212), U8("byte2", 87)] }
31 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
```

Let's cut it at position 26.

```sh
python3 -c "print(hex(0x8090EFC + 26))" # 0x8090f16
```

```sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 8090f16 -M "end_cutscenescript_8090F16"  
```

2025-12-17 Wk 51 Wed - 09:15 +03:00

We're done!
