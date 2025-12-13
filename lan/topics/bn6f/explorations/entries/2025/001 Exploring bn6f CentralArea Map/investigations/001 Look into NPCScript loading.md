---
parent: '[[001 Exploring bn6f CentralArea Map]]'
spawned_by: '[[000 Wk 41 Exploring bn6f CentralArea Map]]'
context_type: investigation
status: done
---

Parent: [001 Exploring bn6f CentralArea Map](../001%20Exploring%20bn6f%20CentralArea%20Map.md)

Spawned by: [000 Wk 41 Exploring bn6f CentralArea Map](../entries/000%20Wk%2041%20Exploring%20bn6f%20CentralArea%20Map.md)

Spawned in: [<a name="spawn-invst-762452" />^spawn-invst-762452](../entries/000%20Wk%2041%20Exploring%20bn6f%20CentralArea%20Map.md#spawn-invst-762452)

# 1 Journal

2025-10-15 Wk 42 Wed - 15:25 +03:00

We need to also look into `NPCCommandsJumptable` referenced by `npc_runPrimaryScript_809ebdc` and `npc_runSecondaryScriptMaybe_809ebf8`

It should be set in `oOverworldNPCObject_AnimationScriptPtr`.

2025-10-15 Wk 42 Wed - 15:57 +03:00

`TryUpdateEachOverworldNPCObject_800461E` sets `r5` to `OverworldNPCObject`

2025-10-15 Wk 42 Wed - 16:06 +03:00

````C
// in fn npc_init_809E590
ldr r0, [r5,#oOverworldNPCObject_UnkFlags_60]
bl setNPCScript_809F506 // (self: *mut OverworldNPCObject $r5, script: *const NPCScript) -> ()
````

Not sure why this is called `UnkFlags`, but it seems it needs to be a `*const NPCScript`.  But yet grepping it, you can see there are flag tests being done against it.

2025-10-15 Wk 42 Wed - 16:17 +03:00

````C
// in include/structs/OverworldNPCObject.inc
ptr AnimationScriptPtr // loc=0x4c

// in ewram.s
eOverworldMapObjects:: // 0x2011ee0
	overworld_map_object_struct eOverworldMapObject0
	overworld_map_object_struct eOverworldMapObject1
	overworld_map_object_struct eOverworldMapObject2
	overworld_map_object_struct eOverworldMapObject3
	[...]
````

````sh
python3 -c "print(hex(0x2011ee0 + 0x4c))"

# out
0x2011f2c
````

Gdb Watching `watch *0x2011f2c`,

Lan's Room $\to$ Lan's House: watch breaks on `sub_300631C` with `x/1wx 0x2011f2c` yielding `0x0000005e`.

watch breaks in `sub_300631C` on key press with `x/1wx 0x2011f2c` yielding `0x8d8d005d`

2025-10-15 Wk 42 Wed - 16:23 +03:00

Breaking on `npc_init_809E590`,

Lan's Room $\to$ Lan's House breaks. `x/1wx 0x2011f2c` yields `0x00000000`

It triggers 5 times,

Breaking on `npc_runPrimaryScript_809ebdc`,

Lan's Room $\to$ Lan's House breaks. `x/1wx 0x2011f2c` yields `0x00000000`

I think because we're triggering off of `eOverworldMapObject0` which is not necesarily being used.

````C
// in fn npc_runPrimaryScript_809ebdc
ldr r6, [r5,#oOverworldNPCObject_AnimationScriptPtr]
==> ldrb r0, [r6]
````

````
info reg

# out
r0             0x0                 0
r1             0x0                 0
r2             0x84e0a60           139332192
r3             0x84e05d4           139331028
r4             0x0                 0
r5             0x20057b0           33576880
r6             0x805163c           134551100
r7             0x809e591           134866321
r8             0x0                 0
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x4210              16912
sp             0x3007db0           0x3007db0
lr             0x809e5f5           134866421
pc             0x809ebe6           0x809ebe6 <npc_runPrimaryScript_809ebdc+10>
cpsr           0x4000003f          1073741887
````

`805163c` points to `byte_805163C` which is of type `NPCScript`.

Iterating, we also get `0x805176f`, `0x805183c`, `0x8051935`, `0x805191a`, `0x809f6ce`, and continues in `0x809f6ce` for a while.

Not finding `805176f`, but there is a `byte_805174C+0x23`

````
python3 -c "print(hex(0x805174C + 0x23))"

# out
0x805176f
````

This is a script of its own, let's make it `npc_script_805176f`

Let's find some more

2025-10-15 Wk 42 We - 16:33 +03:00d

Also, `npc_runPrimaryScript_809ebdc` is always running in Lan's Home.

When Jacking in to Lan's HP:

````C
// in fn npc_runPrimaryScript_809ebdc
ldr r6, [r5,#oOverworldNPCObject_AnimationScriptPtr]
==> ldrb r0, [r6]
````

````
info reg

# out
r0             0x0                 0
r1             0x0                 0
r2             0x84e0a60           139332192
r3             0x84e05d4           139331028
r4             0x0                 0
r5             0x20057b0           33576880
r6             0x806cb04           134662916
r7             0x809e591           134866321
r8             0x0                 0
r9             0x3005fc1           50356161
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x10                16
sp             0x3007db0           0x3007db0
lr             0x809e5f5           134866421
pc             0x809ebe6           0x809ebe6 <npc_runPrimaryScript_809ebdc+10>
cpsr           0x4000003f          1073741887
````

`806cb04` points to `byte_806CB04` which is of type `NPCScript`.

Iterating, we get for `r6`: `0x806cb17`, `0x809f6ce`, then it repeats `0x809f6ce` a while.

2025-10-15 Wk 42 Wed - 16:52 +03:00

When we wrote,

 > 
 > `805163c` points to `byte_805163C` which is of type `NPCScript`.
 > Iterating, we also get `0x805176f`, `0x805183c`, `0x8051935`, `0x805191a`, `0x809f6ce`, and continues in `0x809f6ce` for a while.

`805163c`, `0x805176f`, `0x805183c`, `0x8051935`, `0x805191a` are exactly in order from `off_8051624`, and then `0x809f6ce` is from somewhere else.

`off_8051624` is referenced by `npc_map00_804E954`

2025-10-15 Wk 42 Wed - 17:05 +03:00

`off_8051624` $\to$ `npc_map00_804E954` $\to$ `NPCList_maps00` $\to$ `npc_spawnOverworldNPCObjectsForMap`

2025-10-15 Wk 42 Wed - 17:17 +03:00

````sh
// in fn npc_spawnObjectThenSetUnk10_TempAnimScriptPtr_8030a8c
git blame "asm/asm03_0.s"

# out (relevant)
926529257 (luckytyphlosion   2019-05-26 13:36:52 -0400 20774)   str r2, [r5,#oOverworldNPCObject_UnkFlags_60] // this is actually temp storage for the animation script pointer
````

Right.

2025-10-15 Wk 42 Wed - 17:20 +03:00

````
tools/doc_scripts/replacesig.sh "npc_freeAllObjectsThenSpawnObjectsFromList" "(ptr: * ?) -> ()"
````

We still need proof this is `NPCScript` or related.

````C
// in npc_freeAllObjectsThenSpawnObjectsFromList
ldr r2, [r0]
cmp r2, #0xff
beq .done
````

This is proof it is still not `NPCScript`. So

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
tools/doc_scripts/replacesig_data.sh "NPCList_maps00" "(* ?)[][][REAL_WORLD_NUM_GROUPS]"
tools/doc_scripts/replacesig_data.sh "NPCList_maps80" "(* ?)[][][INTERNET_NUM_GROUPS]"
tools/doc_scripts/replacesig.sh "npc_freeAllObjectsThenSpawnObjectsFromList" "(ptr: (* ?)[]) -> ()"
tools/doc_scripts/replacesig.sh "npc_spawnObjectThenSetUnk10_TempAnimScriptPtr_8030a8c" "(l: (* ?)[], which: isize, ptr: * ?) -> ()"
````

2025-10-15 Wk 42 Wed - 17:34 +03:00

This is it, the proof:

````C
// in fn npc_spawnObjectThenSetUnk10_TempAnimScriptPtr_8030a8c

// This gets set by npc_init_809E590
str r2, [r5,#oOverworldNPCObject_UnkFlags_60] // this is actually temp storage for the animation script pointer

// in fn npc_init_809E590

// This gets written by npc_spawnObjectThenSetUnk10_TempAnimScriptPtr_8030a8c
ldr r0, [r5,#oOverworldNPCObject_UnkFlags_60]
bl setNPCScript_809F506 // (self: *mut OverworldNPCObject $r5, script: *const NPCScript) -> ()
````

This means that `?` is `*const NPCScript` and we can propagate that!

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
tools/doc_scripts/replacesig_data.sh "NPCList_maps00" "(*const NPCScript)[][][REAL_WORLD_NUM_GROUPS]"
tools/doc_scripts/replacesig_data.sh "NPCList_maps80" "(*const NPCScript)[][][INTERNET_NUM_GROUPS]"
tools/doc_scripts/replacesig.sh "npc_freeAllObjectsThenSpawnObjectsFromList" "(ptr: (*const NPCScript)[]) -> ()"
tools/doc_scripts/replacesig.sh "npc_spawnObjectThenSetUnk10_TempAnimScriptPtr_8030a8c" "(_l: (*const NPCScript)[], which: isize, script: *const NPCScript) -> ()"
````

We also know what this field is:

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
./replacep.sh "oOverworldNPCObject_Unk_10"  "oOverworldNPCObject_WhichNPCScript" # and change in OverworldNPCObject.inc too
````

2025-10-15 Wk 42 Wed - 17:44 +03:00

Now we can work our way backwards

2025-10-15 Wk 42 Wed - 17:53 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
tools/doc_scripts/replacesig_data.sh "NPCList_maps80" "Nullable<(*const NPCScript)[][]>[INTERNET_NUM_GROUPS]"
````

This has NULLs in it. Some invariant would need to be maintained elsewhere to not dereference null.

2025-10-15 Wk 42 Wed - 18:06 +03:00

The invariant may have to do with unused map groups.

````C
# in constants/enums/GameAreas.inc
	new_group PAVILION_COMP // 0x85
	map_enum PAVILION_COMP1 // 0x00
	map_enum PAVILION_COMP2 // 0x01
	map_enum PAVILION_COMP3 // 0x02
	map_enum PAVILION_COMP4 // 0x03
	map_enum COPYBOT_COMP // 0x04
  .equiv PAVILION_COMP_NUM_MAPS, 5

	new_group UNUSED_85 // 0x85
````

This is wrong, how can they both be `0x85`?  Let's use `NPCList_maps80` as the ground truth.

We added `UNUSED_8F` and removed `UNUSED_85` in accordance with the gaps in `NPCList_maps80`.

````C
# in constants/enums/GameAreas.inc
new_group UNUSED_8F // 0x8F
````

2025-10-15 Wk 42 Wed - 18:15 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
./replace.sh "off_80665B4"   "NPCScriptsRobotControlComp_80665B4"                                                    
./replace.sh "off_8067DE0"   "NPCScriptsAquariumComp_8067DE0"                                                         
./replace.sh "off_8069310"   "NPCScriptsJudgetreeComp_8069310"                                                      
./replace.sh "off_806A278"   "NPCScriptsMrWeather_806A278"                                                      
// NULL
./replace.sh "off_806AE30"   "NPCScriptsPvavilionComp_806AE30"                                                      
// NULL
// NULL
./replace.sh "off_806C7E8"   "NPCScriptsHomePages_806C7E8"                                                      
// NULL
// NULL
// NULL
./replace.sh "off_806E030"   "NPCScriptsComps_806E030"                                                      
./replace.sh "off_80702AC"   "NPCScriptsComps2_80702AC"                                                      
// NULL
// NULL
./replace.sh "off_8071EC8"   "NPCScriptsCentralArea_8071EC8"                                                      
./replace.sh "off_80758B8"   "NPCScriptsSeasideArea_80758B8"                                                      
./replace.sh "off_8078114"   "NPCScriptsGreenArea_8078114"                                                      
./replace.sh "off_807953C"   "NPCScriptsUnderground_807953C"                                                      
./replace.sh "off_807AE04"   "NPCScriptsSkyACDCArea_807AE04"                                                      
./replace.sh "off_807D310"   "NPCScriptsUndernet_807D310"                                                      
./replace.sh "dword_807F210" "NPCScriptsGraveyardImmortalArea_807F210"                                                      
````

2025-10-15 Wk 42 Wed - 18:20 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
./replacep.sh "npc_map00_ACDC_804D0B4" "NPCScriptsACDC_804D0B4"      
./replacep.sh "npc_map00_804E954"      "NPCScriptsCentralTown_804E954"                
./replacep.sh "off_8052DE0"            "NPCScriptsCyberAcademy_8052DE0"                       
./replacep.sh "off_8059D70"            "NPCScriptsSeasideTown_8059D70"                     
./replacep.sh "off_805E184"            "NPCScriptsGreenTown_805E184"                    
./replacep.sh "off_806065C"            "NPCScriptsSkyTown_806065C"                           
./replacep.sh "off_8062F78"            "NPCScriptsExpoSite_8062F78"                         

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
````

2025-10-15 Wk 42 Wed - 18:40 +03:00

Some are nullable:

````C
NPCScriptsUndernet_807D310:: // (*const NPCScript)[][UNDERNET_NUM_MAPS]
  .word off_807D918
	.word off_807DF40
	.word off_807E19C
	.word NULL
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f

tools/doc_scripts/replacesig_data.sh "NPCScriptsHomePages_806C7E8"             "Nullable<(*const NPCScript)[]>[HOMEPAGES_NUM_MAPS]"                                        
tools/doc_scripts/replacesig_data.sh "NPCScriptsUndernet_807D310"              "Nullable<(*const NPCScript)[]>[UNDERNET_NUM_MAPS]"                                       
tools/doc_scripts/replacesig_data.sh "NPCScriptsGraveyardImmortalArea_807F210" "Nullable<(*const NPCScript)[]>[GRAVEYARD_NUM_MAPS]"                                                    
````

Spawn [002 Look into where the null dereference invariants for NPC group and maps are maintained](002%20Look%20into%20where%20the%20null%20dereference%20invariants%20for%20NPC%20group%20and%20maps%20are%20maintained.md) <a name="spawn-invst-0c5179" />^spawn-invst-0c5179

2025-10-15 Wk 42 Wed - 18:49 +03:00

Let's rename the script labels for CentralTown for now,

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
./replace.sh "off_804F9D8" "NPCScriptsForCentralTown_804F9D8"
./replace.sh "off_8051624" "NPCScriptsForLanHouse_8051624"
./replace.sh "off_8051B5C" "NPCScriptsForLanRoom_8051B5C"
./replace.sh "off_8051F48" "NPCScriptsForBathroom_8051F48"
./replace.sh "off_8051FB0" "NPCScriptsForAsterland_8051FB0"
````

2025-10-15 Wk 42 Wed - 19:05 +03:00

We need to define `NPCScript`s `byte_8051F54+0x23`, `byte_805209D+0x42`, `byte_8052134+0x43`, `byte_80521F4+0x33`

And replace for `npc_script_8051F77`, `npc_script_80520DF`, `npc_script_8052177`, `npc_script_8052227`

Corresponding to

````
python3 -c "print(hex(0x8051F54 + 0x23))"
python3 -c "print(hex(0x805209D + 0x42))"
python3 -c "print(hex(0x8052134 + 0x43))"
python3 -c "print(hex(0x80521F4 + 0x33))"

python3 -c "print(0x23)"
python3 -c "print(0x42)"
python3 -c "print(0x43)"
python3 -c "print(0x33)"

# out
0x8051f77
0x80520df
0x8052177
0x8052227

35
66
67
51
````

`npc_script_8051F77` is failing checksum, let's check it. It's off by 3.

Okay. This stuff should be done automatically since it's just aligning pointers and cutting data directives.

Next would be to dump the NPC Scripts corresponding to Central Town here.

We already have [004 Impl dumping for map npc and cutscene scripts](../../../../../../../tasks/2025/004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts/004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts.md), we will also need `dump_npcscript`.  We generalized the note cluster from just concerning with map script to all mapscript, npcscript, and cutscene scripts. They are all documented bytecodes, so there should be a lot of shared internal work, besides configured bytecode commands.

All those commands are also documented in [000 Documentation Actions](../../../../../logs/entries/2025/000%20Documentation%20Actions.md).
