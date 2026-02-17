---
parent: "[[002 bn6f ROM shifting]]"
spawned_by: "[[005 Look into shift test crash when fighting in central area 1 commit 6d547b86]]"
context_type: investigation
status: done
---

Parent: [[002 bn6f ROM shifting]]

Spawned by: [[005 Look into shift test crash when fighting in central area 1 commit 6d547b86]]

Spawned in: [[005 Look into shift test crash when fighting in central area 1 commit 6d547b86#^spawn-invst-cd3046|^spawn-invst-cd3046]]

# 1 Journal

2025-12-26 Wk 52 Fri - 12:53 +03:00

This investigation runs parallel to [[000 Investigate mgba sav file format loading]] in that both need to understand how save file changes occur in the emulator. For our investigation here, we need to also understand what about the source ran into this problem. If we can get an ea, or some information about the state in the time of corruption it might help us narrow it down.

2025-12-26 Wk 52 Fri - 15:02 +03:00

```
LAN - BL PC1=811316A, PC2=80017B2 LR=8113169
LAN - BL PC1=811318A, PC2=800EA4A LR=8113189
LAN - BL PC1=81131A2, PC2=80C6CDE LR=81131A1
LAN - BL PC1=80C6CEA, PC2=8003AD8 LR=80C6CE9
LAN - BL PC1=8003AEA, PC2=80039F8 LR=8003AE9
LAN - BL PC1=8003A38, PC2=8000B60 LR=8003A37
LAN - BL PC1=8000B78, PC2=814EDF8 LR=8000B77
LAN - BX PC=8000B76, rm=#E:8000B77
LAN - BL PC1=8003AF2, PC2=8003B80 LR=8003AF1
LAN - BL PC1=203AAB6, PC2=8004AEF LR=203AAB5
LAN - SRAMWrite1 PC=8004B14, addr=EFEA04B, val=0
GBA: Illegal opcode: 0000b1c9
```

For this SRAM write,

```
LAN - SRAMWrite1 PC=8004B14, addr=EFEA04B, val=0
```

`8004B14` is between

```
08004a48 l 00000000 T4BattleObjectJumptable
08004c90 l 00000080 sub_8004510
```

This also doesn't make sense:

```
LAN - BL PC1=203AAB6, PC2=8004AEF LR=203AAB5
```

We were executing in `203AAB6`? 

```
0203aab6 g 00000000 eT1BattleObject1_StaminaDamageCounterDisabler
08003af0 l 00000000 loc_8003370
08003b80 l 00000028 sub_8003400

// 8004AEF is between:
08004a48 l 00000000 T4BattleObjectJumptable
08004c90 l 00000080 sub_8004510
```

```
LAN - BL PC1=811316A, PC2=80017B2 LR=8113169
LAN - BL PC1=811318A, PC2=800EA4A LR=8113189
LAN - BL PC1=81131A2, PC2=80C6CDE LR=81131A1
LAN - BL PC1=80C6CEA, PC2=8003AD8 LR=80C6CE9
LAN - BL PC1=8003AEA, PC2=80039F8 LR=8003AE9
LAN - BL PC1=8003A38, PC2=8000B60 LR=8003A37
LAN - BL PC1=8000B78, PC2=814EDF8 LR=8000B77
LAN - BX PC=8000B76, rm=#E:8000B77
LAN - BL PC1=8003AF2, PC2=8003B80 LR=8003AF1
			 ^ loc_8003370
					      ^ sub_8003400
LAN - BL PC1=203AAB6, PC2=8004AEF LR=203AAB5
             ^ eT1BattleObject1_StaminaDamageCounterDisabler
LAN - SRAMWrite1 PC=8004B14, addr=EFEA04B, val=0
GBA: Illegal opcode: 0000b1c9
```

2025-12-26 Wk 52 Fri - 15:30 +03:00

```C
// in static inline void ThumbStep(struct ARMCore* cpu) {
if (cpu->gprs[ARM_PC] >= 0x08004a48 && cpu->gprs[ARM_PC] < 0x08004c90) {
	printf("LAN - ThumbStep PC=%X opcode=%X\n", cpu->gprs[ARM_PC], opcode);
}
cpu->gprs[ARM_PC] += WORD_SIZE_THUMB;
```

```
LAN - ThumbStep PC=8004AF0 opcode=80E
LAN - ThumbStep PC=8004AF2 opcode=4A01
// ...
LAN - ThumbStep PC=8004B12 opcode=5511
LAN - SRAMWrite1 PC=8004B14, addr=EFEA04B, val=0
LAN - ThumbStep PC=8004B14 opcode=80E
// ...
LAN - ThumbStep PC=8004C72 opcode=B1C9
GBA: Illegal opcode: 0000b1c9
```

```C
// in static inline void ThumbStep(struct ARMCore* cpu) {
if (cpu->gprs[ARM_PC] >= 0x02000000 && cpu->gprs[ARM_PC] < 0x03000000) {
	printf("LAN - ThumbStep PC=%X opcode=%X\n", cpu->gprs[ARM_PC], opcode);
}
cpu->gprs[ARM_PC] += WORD_SIZE_THUMB;
```

```
LAN - ThumbStep PC=203AA7A opcode=6928
// ...
LAN - ThumbStep PC=203AAB4 opcode=FFFF
LAN - BL PC1=203AAB6, PC2=8004AEF LR=203AAB5

```

```
203AA7A is between:
0203aa78 g 00000000 eT1BattleObject1_LinkedList_Prev
0203aa7c g 00000000 eT1BattleObject1_LinkedList_Next
```

2025-12-26 Wk 52 Fri - 16:08 +03:00

Changed `BX` log to come before we change PC, that might have added to the confusion.

2025-12-26 Wk 52 Fri - 16:36 +03:00

```
LAN - ThumbStep PC=81131A6 opcode=BDD0
LAN - ThumbStep PC=203AA7A opcode=6928
```

```
81131A6 is between:
081131a2 l 00000000 loc_8111C62 (in sub_8111BFE)
081131b0 l 00000000 off_8111C70

specifically:
pop {r4,r6,r7,pc}

```

```
LAN - ThumbStep PC=81131A6 opcode=BDD0
LAN - ThumbStep PC=203AA7A opcode=6928
```

We can try to debug in that `pop` line and see. It's in `asm/asm32.s:7786`

```
mgba bn6f.elf -g &; gdb-multiarch bn6f.elf -ex "target remote localhost:2345"

(gdb) b asm/asm32.s:7786
(gdb) commands

# then type out (line by line)
info reg
cont
end 
```

It triggers only once.

```
Breakpoint 1, sub_8111BFE () at ./asm/asm32.s:7786
7786            pop {r4,r6,r7,pc}
r0             0x1                 1
r1             0x4                 4
r2             0x203ab50           33794896
r3             0xc0000             786432
r4             0x32800             206848
r5             0x203aa88           33794696
r6             0x0                 0
r7             0x0                 0
r8             0x20384f0           33785072
r9             0x3005fc1           50356161
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x3                 3
sp             0x3007d84           0x3007d84
lr             0x8003af1           134232817
pc             0x81131a4           0x81131a4 <sub_8111BFE+102>
cpsr           0x3f                63

Program received signal SIGILL, Illegal instruction.
0x00000004 in ?? ()
```

I think the issue is more what the values on the stack are though.

```
Breakpoint 1, sub_8111BFE () at ./asm/asm32.s:7786
7786            pop {r4,r6,r7,pc}
(gdb) info reg
r0             0x1                 1
r1             0x4                 4
r2             0x203ab50           33794896
r3             0xc0000             786432
r4             0x4022800           67250176
r5             0x203aa88           33794696
r6             0x0                 0
r7             0x0                 0
r8             0x20384f0           33785072
r9             0x3005fc1           50356161
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x3                 3
sp             0x3007d84           0x3007d84
lr             0x8003af1           134232817
pc             0x81131a4           0x81131a4 <sub_8111BFE+102>
cpsr           0x3f                63
(gdb) x/10x $sp
0x3007d84:      0x0801baf5      0x081145b8      0x02001b80      0x0203aa78
0x3007d94:      0x0810a56f      0x02034180      0x0810a49c      0x080b973c
0x3007da4:      0x00000017      0x08003980
(gdb) s

Program received signal SIGILL, Illegal instruction.
0x00000004 in ?? ()
```

So we have the save ok up until that step, which pops from the stack a wrong PC, and bad after the step, where we know bogus code is executed in EWRAM which ends up also corrupting the save.

```
sha1sum ~/src/cloned/gh/dism-exe/bn6f/bn6f.sav bn6f.sav

# out
71f87bc841145a512a900934616e65f4d718a985  /home/lan/src/cloned/gh/dism-exe/bn6f/bn6f.sav
71f87bc841145a512a900934616e65f4d718a985  bn6f.sav
```

2025-12-26 Wk 52 Fri - 17:40 +03:00

a breakpoint on `sub_8111BFE` never actually hits. So it wasn't called.

```
LAN - ThumbStep PC=814EDFC opcode=4770
LAN - BX PC=814EDFE, rm=#E:8000B76
LAN - ThumbStep PC=8000B78 opcode=B001
LAN - ThumbStep PC=8000B7A opcode=BD0F
				   ^ (bw 08000b60 ZeroFillByWord and 08000b7c ZeroFillByWord.WordFillCpuSetMask_80008FC)
LAN - ThumbStep PC=8003A38 opcode=7BB8
				   ^ (bw 08003a26 loc_80032A6 and 08003a48 loc_80032C8 in SpawnBattleObjectCommon): bl ZeroFillByWord


LAN - ThumbStep PC=8003A4C opcode=BDD0
			       ^ off_80032CC (just before; eo SpawnBattleObjectCommon)
LAN - ThumbStep PC=8003AEA opcode=422D
				   ^ (bw 08003ad8 object_spawnType3 and 08003af0 loc_8003370): bl SpawnBattleObjectCommon

LAN - BL PC1=8003AF2, PC2=8003B80 LR=8003AF1
			 ^ loc_8003370+2 (just before; object_spawnType3 -> bl sub_8003400)
LAN - ThumbStep PC=8003B82 opcode=B500
				   ^sub_8003400+2


LAN - B PC1=8003BA0, PC2=8003BA2
LAN - ThumbStep PC=8003BA4 opcode=BD00
				   ^ off_8003424 (just before; eo sub_8003400)
LAN - ThumbStep PC=8003AF2 opcode=B005
LAN - ThumbStep PC=8003AF4 opcode=BD80
				   ^ sub_8003374 (just before; eo object_spawnType3)
LAN - ThumbStep PC=80C6CEA opcode=1C28
				   ^ (bw 080c6cde sub_80C579E and 080c6cfa locret_80C57BA)

LAN - ThumbStep PC=80C6CFC opcode=BD00
				   ^ dword_80C57BC (inst just before, in fn sub_80C579E)
LAN - ThumbStep PC=81131A2 opcode=2001
				   ^ loc_8111C62 (inst just before)
LAN - ThumbStep PC=81131A4 opcode=B006
LAN - ThumbStep PC=81131A6 opcode=BDD0
LAN - ThumbStep PC=203AA7A opcode=6928
```

2025-12-26 Wk 52 Fri - 19:36 +03:00

Created a filter to quickly visualize all of those values.

```
cat a | python3 ~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.py ea_to_sym_filter bn6f.sym --shift -2 > b.log

LAN - ThumbStep PC=SWI_CpuSet+2 opcode=4770
LAN - BX PC=SWI_Div, rm=#E:ZeroFillByWord+20
LAN - ThumbStep PC=ZeroFillByWord+22 opcode=B001
LAN - ThumbStep PC=ZeroFillByWord+24 opcode=BD0F
LAN - ThumbStep PC=loc_80032A6+16 opcode=7BB8


LAN - ThumbStep PC=loc_80032C8+2 opcode=BDD0
LAN - ThumbStep PC=object_spawnType3+16 opcode=422D

LAN - BL PC1=loc_8003370, PC2=loc_80033FC+2 LR=object_spawnType3+23
LAN - ThumbStep PC=sub_8003400 opcode=B500


LAN - B PC1=sub_8003400.loc_800341E, PC2=sub_8003400.loc_800341E+2
LAN - ThumbStep PC=sub_8003400.done opcode=BD00
LAN - ThumbStep PC=loc_8003370 opcode=B005
LAN - ThumbStep PC=loc_8003370+2 opcode=BD80
LAN - ThumbStep PC=sub_80C579E+10 opcode=1C28

LAN - ThumbStep PC=locret_80C57BA opcode=BD00
LAN - ThumbStep PC=loc_8111C1E+66 opcode=2001
LAN - ThumbStep PC=loc_8111C62 opcode=B006
LAN - ThumbStep PC=loc_8111C62+2 opcode=BDD0
LAN - ThumbStep PC=eT1BattleObject0_End opcode=6928
```


Anyway going to not do the `--shift -2` in here. Will just subtract -2 from the `ThumbStep` logs.

2025-12-26 Wk 52 Fri - 21:16 +03:00

```
LAN - BL PC1=loc_801B36E+4, PC2=RunAIAttack LR=loc_801B36E+7
LAN - BX PC=applyDamageToPlayer_801ba12, rm=#0:sub_8113124
```

These could be useful to look into. We know the issue is related to AI attacks, and also that damage is no longer being applied

2025-12-26 Wk 52 Fri - 21:26 +03:00

We could try to inspect frames, like logs between `battle_update_8007A44` calls

2025-12-26 Wk 52 Fri - 21:33 +03:00

```
LAN - BX PC=loc_3005F9C+10, rm=#4:dword_3005FB0+16
LAN - GBAStore16 PC=loc_3005F9C+12, addr=iPalette3001C80+164, val=7FFF
```

Seems we found two undumped code at `dword_3005FB0`!

2025-12-26 Wk 52 Fri - 23:24 +03:00

```
LAN - BX PC=loc_814CF38+4, rm=#0:byte_3000190+888
LAN - BL PC1=sub_803F6B0+50, PC2=byte_813DBC0 LR=sub_803F6B0+53
```

2025-12-27 Wk 52 Sat - 11:53 +03:00

Spawn [[004 Improve speed for ea_to_sym_filter]] ^spawn-task-30bc6f

2025-12-27 Wk 52 Sat - 16:27 +03:00

```
LAN - GBAStore32 PC=StartBattle+12, addr=eGameState_CurBattleDataPtr, val=byte_80B4C5C+16
```

There's some undumped struct there in `byte_80B4C5C`

2025-12-27 Wk 52 Sat - 16:36 +03:00

we found reference to `custMenuPressOK_8028D3A`, and we know that corruption starts from pressing OK, or there is a sign of it there, with the sound corruption and lag. There is a decompression happening in `decompressCoordEventData_8030aa4`.

2025-12-27 Wk 52 Sat - 16:59 +03:00

`sub_8108F74` seems to route by the name Id to a big list of AI data, something to look into.

2025-12-27 Wk 52 Sat - 17:20 +03:00

There is no indication that `sub_800318C` is used as a pointer and yet we have 

```
LAN - GBAStore32 PC=FreeAllObjectsOfSpecifiedTypes.loop+10, addr=end_file_3007B00+716, val=sub_800318C
LAN - GBAStore32 PC=FreeAllObjectsOfSpecifiedTypes.loop+10, addr=end_file_3007B00+700, val=sub_800318C
```

Another issue is that those `GBAStore32` PC addreses have cases of being inaccurate, like

```
LAN - GBAStore32 PC=battleObject_dispatch_8108F50+8, addr=40000A0, val=2FFFC00
LAN - GBAStore32 PC=battleObject_dispatch_8108F50+8, addr=40000A0, val=FFFFFF
LAN - GBAStore32 PC=battleObject_dispatch_8108F50+8, addr=40000A4, val=10F1708
```

Where they seem to happen simultaneous to the logic in there.

2025-12-27 Wk 52 Sat - 17:36 +03:00

We can check input to `SWI_LZ77UnCompReadNormalWrite8bit` via gdb in a shifted ROM, and see if any of it remains as before.

```
mgba bn6f.elf -g &; gdb-multiarch bn6f.elf -ex "target remote localhost:2345"

(gdb) b SWI_LZ77UnCompReadNormalWrite8bit
(gdb) commands

# then type out (line by line)
info reg r0 r1
cont
end 
```

Let's repeat this procedure for 3 ROMs, original, shifted by 16 bytes at the start, and shifted by 32 bytes at the start.

```C
main:
	.word 0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF
	.include "asm/main.s"
```

```C
main:
	.word 0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF
	.word 0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF
	.include "asm/main.s"
```

2025-12-27 Wk 52 Sat - 18:41 +03:00

```
LAN - BL PC=validateChipCode_8006EE8+20, PC2=asm02 R0=36 R1=B R2=19B R5=dword_20364C0

LAN - BL PC=checkThenStartBattle_8005A8C+92, PC2=StartBattle R0=byte_80B4C5C+80 R1=1 R2=1 R5=eToolkitExtraPtrsMemory
```

2025-12-29 Wk 1 Mon - 11:07 +03:00

So instead I tried to just compare `ROM GBALoad`s in both the original and 16-byte shift.

```
# For both the original and shifted
~/src/cloned/gh/mgba-emu/run_mgba.sh bn6f.elf > a.log
cat a.log | python3 ~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.py ea_to_sym_filter bn6f.sym > b.log
cat b.log | grep 'GBALoad' > b1.log
cat b1.log | sort -u > b2.log
```

This is clear sign that data itself changed at the same ROM location, and also by `0x10`, our shift amount. It is not necessarily that labels shouldn't shift but if we know them, then `ea_to_sym_filter` would have collapsed them to the same value. Although It might be that I did not add compressed pointer handling to it.

```diff
-LAN - ROM GBALoad32 PC=decompSprites_80029A8.loc_80029E8+24, addr=virusBattleSpritePtrs+4, val=88241EC4
-LAN - ROM GBALoad32 PC=decompSprites_80029A8.loc_80029E8+24, addr=virusBattleSpritePtrs+92, val=8825BFC4
+LAN - ROM GBALoad32 PC=decompSprites_80029A8.loc_80029E8+24, addr=virusBattleSpritePtrs+4, val=88241ED4
+LAN - ROM GBALoad32 PC=decompSprites_80029A8.loc_80029E8+24, addr=virusBattleSpritePtrs+92, val=8825BFD4
```

We can see that `virusBattleSpritePtrs` is all fully populated so that must be the case.

```diff
-LAN - ROM GBALoad32 PC=loc_3006184, addr=.data+24928, val=byte_8420000
+LAN - ROM GBALoad32 PC=loc_3006184, addr=.data+24928, val=sprite_841C9C4+13868

-LAN - ROM GBALoad32 PC=loc_8027E98, addr=dword_802A7CC+28, val=byte_80601B4+86
+LAN - ROM GBALoad32 PC=loc_8027E98, addr=dword_802A7CC+28, val=byte_80601B4+70
```

We've already removed what we suspected to be a the false pointer at `dword_802A7CC+28`: `.word 0x806020A`. It seems it's still being read though as a possibly valid pointer, and so its arithmetic doesn't take into account the `0x10` shift between the ROMs.

`.data+24928` would be `0x081d8000 + 24928` or `0x81de160`. 

```
081d8000 g 00000000 battleSpriteMegaMan
081d8000 l 00000000 .data
081df420 g 00000000 battleSpriteFlameCross
```

It would be between sprite data `*.spr`

Since the filter is not perfect, let's have it keep the original value. `orig:new`. 

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
cat a.log | grep 'GBALoad' > a1.log
cat a1.log | sort -u > a2.log
cat a2.log | python3 ~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.py ea_to_sym_filter bn6f.sym > b1.log

# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
diff -u ~/src/cloned/gh/dism-exe/bn6f/b1.log b1.log | less
```

Ok no having `orig:new` messes up diffing for `addr`... 

```diff
-LAN - ROM GBALoad32 PC=loop_processArr_8000B34, addr=initRefs_802FCD8, val=887F36A0
+LAN - ROM GBALoad32 PC=loop_processArr_8000B34, addr=initRefs_802FCD8, val=887F36B0
```

Compressed pointers still not showing up.

Also we're only interested to see loads that are identical up to `val=` but different otherwise. Let's make a custom diffing code to do this:

Spawn [[003 temp python script for diffing only changes after val=]] ^spawn-entry-0e0040

2025-12-29 Wk 1 Mon - 12:32 +03:00

`byte_819A760` is strange. It seems to reference itself, we do not know in the repo of any accesses to it, but the logs say it ends up accessed by all these functions:

```
LAN - ROM GBALoad8 PC=sub_814E0B4, addr=byte_819A760+191, val=1E
LAN - ROM GBALoad8 PC=sub_814E0D0.loc_814E0D2+4, addr=byte_819A760+8, val=0
LAN - ROM GBALoad8 PC=ply_goto.loc_814E0DE+12, addr=byte_819A760+197, val=A7
LAN - ROM GBALoad8 PC=sub_814E190+4, addr=byte_819A760+275, val=7
LAN - ROM GBALoad8 PC=sub_814E260.loc_814E326+2, addr=byte_819A760, val=D5
LAN - ROM GBALoad8 PC=ply_note+34, addr=byte_819A760+1, val=4A
```

```
LAN - GBAStore32 PC=sub_814E260.loc_814E332+2, addr=unk_2006EF8+4224, val=byte_819A760
LAN - BL PC=sub_814E260.loc_814E352+24, PC2=sub_814E4CC R0=off_2010890 R1=unk_2006EF8+4160 R2=byte_819A760 R5=unk_2006EF8+4160
```

Similar case for `byte_819CEEB`. 

2025-12-29 Wk 1 Mon - 13:04 +03:00

Fixed the issue with compression handling, it was because earlier I added a filter on range `0x2000000` and `0x9000000` for valid pointers, but that didn't yet into account the compresison flag `0x80000000`.

```diff
-LAN - ROM GBALoad32 PC=ToolkitExtraPtrsOffsetsEnd.loc_8006D8C+2, addr=off_8006DE0, val=ChipDataArr+9092
+LAN - ROM GBALoad32 PC=ToolkitExtraPtrsOffsetsEnd.loc_8006D8C+2, addr=off_8006DE0, val=ChipDataArr+9076
```

```C
# in fn encryption_initAll_8006d00
off_8006DE0:
	.word 0x802412C
off_8006DE4:
	.word dword_20018B8
off_8006DE8:
	.word 0x803ED90
```

It does `eor` to it, so they're not clear pointers.

2025-12-29 Wk 1 Mon - 13:21 +03:00

If we keep the `val=` values as hex, then we get many shifts that are fine, which is the same pointer, having a different value due to shift.

2025-12-29 Wk 1 Mon - 14:13 +03:00

Updated out differ to reverse the `val=` values back to eas, add the diff, and check if the values are identical or just different by the shift amount `0x10`, and in both cases, we filter these out. 

Because if the underlying value is the same, but only different by the shift amount, it's likely to just have been a pointer we already took into account. Similarly, if it's a hardcoded value that is ultimately identical, we expect the diff amount to change but not the underlying value.

2025-12-29 Wk 1 Mon - 14:47 +03:00

Maybe we should try to filter for possible cases of false negatives. This can happen if we're loading from the same address, at the same PC, across the original and shifted ROM.

```sh
python3 /home/lan/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/a.py ~/src/cloned/gh/dism-exe/bn6f/a2.log a2.log 0 | python3 ~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.py ea_to_sym_filter /home/lan/src/cloned/gh/dism-exe/bn6f/bn6f.sym | less
```

There's many results like

```diff
-LAN - ROM GBALoad16 PC=DoubleForLoop3005E90+18, addr=word_801EE14, val=D0AB
+LAN - ROM GBALoad16 PC=DoubleForLoop3005E90+18, addr=word_801EE14, val=D1B4 // <-- This symbol is not correct for the shifted ROM
```

Manually put together by applying the sym filter for the shifted line on the second line:

```diff
-LAN - ROM GBALoad16 PC=DoubleForLoop3005E90+18, addr=word_801EE14, val=D0AB
+LAN - ROM GBALoad16 PC=DoubleForLoop3005E90+18, addr=byte_801EDFC+8, val=D1B4
```

But I can't see an issue with this one.

```
LAN - ROM GBALoad32 PC=sub_801E1E4.loc_801E1F8+10, addr=off_801E220, val=word_801EE14
LAN - BL PC=sub_801E1E4.loc_801E20A+8, PC2=CopyBackgroundTiles R0=7 R1=2 R2=3 R5=2
LAN - ROM GBALoad32 PC=CopyBackgroundTiles+2, addr=off_80018CC, val=iCopyBackgroundTiles+1
LAN - BX PC=CopyBackgroundTiles+6, rm=#7:iCopyBackgroundTiles
```

It is expected in `off_801E220`. 

but this isn't how it is from the shifted ROM:

```
LAN - ROM GBALoad32 PC=sub_801E03E+10, addr=off_801E05C, val=byte_801EDFC
LAN - BL PC=sub_801E03E+18, PC2=CopyBackgroundTiles R0=0 R1=0 R2=3 R5=2
LAN - ROM GBALoad32 PC=CopyBackgroundTiles+2, addr=off_80018CC, val=iCopyBackgroundTiles+1
LAN - BX PC=CopyBackgroundTiles+6, rm=#7:iCopyBackgroundTiles
LAN - ROM GBALoad16 PC=DoubleForLoop3005E90+18, addr=byte_801EDFC, val=D1B6
LAN - GBAStore16 PC=DoubleForLoop3005E90+20, addr=iBGTileIdBlocks+6144
```

This time it's `byte_801EDFC` from `off_801E05C`

2025-12-29 Wk 1 Mon - 16:04 +03:00

There's way too many results with this filter. What if we make the shift higher? not `0x10` bytes, but  `0x1000` bytes.

On suggestion of this [stackexchange answer](https://unix.stackexchange.com/a/101334),

```sh
dd if=/dev/zero of=zeros.bin  bs=$(python3 -c "print(0x1000)")  count=1
```

```
main:
	.incbin "zeros.bin"
	.include "asm/main.s"
```

```sh
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
cat a.log | grep 'GBALoad' > a1.log
cat a1.log | sort -u > a2.log
python3 /home/lan/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/a.py ~/src/cloned/gh/dism-exe/bn6f/a2.log a2.log 0 | python3 ~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.py ea_to_sym_filter bn6f.sym > c2.log
python3 /home/lan/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/a.py ~/src/cloned/gh/dism-exe/bn6f/a2.log a2.log 0 | python3 ~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.py ea_to_sym_filter /home/lan/src/cloned/gh/dism-exe/bn6f/bn6f.sym > c1.log
```

There's still 39839 matches. With `:g/byte_3005700/d` (-37794 lines) and `:g/start_copyMemory/d` (-1898 lines) it narrows down to 147 lines.

All of these look either before we introduced `zeros.bin`, or just another bulk copy operation where eventually you will find it addressing the same pointer in both ROMs. No other case. `sub_3006F8C` has some bulk copying besides the others we filtered, but that's it for bulk copying.

2025-12-30 Wk 1 Tue - 14:03 +03:00

Spawn [[005 Create RAM struct dword_20364C0]] ^spawn-task-3838f9

2026-01-03 Wk 1 Sat - 16:20 +03:00

Spawn [[007 Create RAM Struct byte_200BC50]] ^spawn-task-dc2d18

2026-01-04 Wk 1 Sun - 14:22 +03:00

Spawn [[008 Image sprite categories and indices for sprite_load]] ^spawn-task-6aabf7

2026-01-04 Wk 1 Sun - 18:34 +03:00

Spawn [[009 Create RAM Struct Struct2035280]] ^spawn-task-a82dc9

2026-01-06 Wk 2 Tue - 23:50 +03:00

We don't have to sort. Using `cat a.log | sort -u --parallel=$(nproc) > a1.log` may speed it up, but we're still ordering a 5GB file and it's slow. We don't want to reorder, only to keep unique lines, so `cat a.log | awk '!seen[$0]++' > a1.log` is sufficient and much faster and also likely more informative because order matters with execution logs.

2026-01-07 Wk 2 Wed - 00:00 +03:00

`POP` and `POPR` for thumb instructions in mgba doesn't seem to detect all pop instructions for some reason? From [GBATEK Thumb ISA](https://problemkaputt.de/gbatek.htm#thumbinstructionsummary) `pop {pc, ...}` should correspond to 

```
1011 1101 XXXX XXXX
     _  _ r0-r7
	 ^ push/pop
	    ^ PC/LR
B    D

0xBDXX
```

So long as the opcode starts with `0xBD` in its upper, we should log it in `ThumbStep`. 

```C
// in fn static inline void ThumbStep(struct ARMCore* cpu) {
if ((opcode & 0xBD00) == 0xBD00) {
	printf("LAN - POPPC PC=%X, R0=%X R1=%X R2=%X R5=%X\n", cpu->gprs[ARM_PC] - 4, cpu->gprs[0], cpu->gprs[1], cpu->gprs[2], cpu->gprs[5]);
}
cpu->gprs[ARM_PC] += WORD_SIZE_THUMB;
```

This is so that we can log return values from functions, many of which have a `pop {pc}` for return.

We should also include `mov pc, lr`:

```
   2:   46f7            mov     pc, lr
```

```C
if (opcode == 0x46f7) {
	printf("LAN - MOVPCLR PC=%X, R0=%X R1=%X R2=%X R5=%X\n", cpu->gprs[ARM_PC] - 4, cpu->gprs[0], cpu->gprs[1], cpu->gprs[2], cpu->gprs[5]);
}
```

2026-01-07 Wk 2 Wed - 01:10 +03:00

We can get some false negatives from that `0xBD00` mask. Here's a counterexample at `locGotBattleSettings_80AA59E+0A`:

```
   a:   f756 fd85       bl      0xfff56b18
```

```sh
python3 -c "print(hex(0xfd85 & 0xbd00))" # 0xbd00
```

We need to be more strict, `(opcode >> 8) == 0xBD`

2026-01-09 Wk 2 Fri - 01:48 +03:00

While investigating gunner AI code in `ForGunner_8113078`, I found that there was some unlabeled code, and so there was a `BX` to a label I just inserted:

```
LAN - BX PC=sub_8113124+1C, rm=#1:dead_8113162
```

Our corruption when testing triggered with gunner AI.

Just before `dead_8113162` there is the suspicious `loc_8113148` which is loaded as a jumptable by `sub_8113124`:

```
ldr r1, off_8113144 // =loc_8113148
ldrb r0, [r6,#oAIState_Unk_00]
ldr r1, [r1,r0]
```

Yet it was dumped as code!

```
        thumb_local_start
loc_8113148:
   0:   3155            adds    r1, #85 ; 0x55
   2:   0811            lsrs    r1, r2, #32
   4:   3163            adds    r1, #99 ; 0x63
   6:   0811            lsrs    r1, r2, #32
   8:   31a3            adds    r1, #163        ; 0xa3
   a:   0811            lsrs    r1, r2, #32
   c:   7da0            ldrb    r0, [r4, #22]
   e:   2101            movs    r1, #1
  10:   4008            ands    r0, r1
  12:   0080            lsls    r0, r0, #2
  14:   3004            adds    r0, #4
  16:   7030            strb    r0, [r6, #0]
  18:   46f7            mov     pc, lr
        thumb_func_end loc_8113148
```

These are false negative pointers we missed and what likely caused the gunner AI to mess up.

```
GBALoad32 PC=sub_8113124+18, addr=locret_8113142.loc_8113148+04, val=dead_8113162+1 
GBALoad32 PC=sub_8113124+18, addr=loc_8113148, val=locret_8113142.loc_8113148+0D
```

This is one way to find those errors, we're loading a value from a supposed code location.

I also found this while looking through `CurAction` state transitions for the gunner AI

```sh
cat b1.log | grep 'Store' | grep 'eT1BattleObject1_CurAction' | grep -v 'SWI' | less
```

Due to the battle EWRAM state overlapping others, we remove `SWI_LZ77UnCompReadNormalWrite8bit`.

2026-01-09 Wk 2 Fri - 02:06 +03:00

Here's a test to find more faulty loads from code:

```sh
cat b1.log | grep 'Load' | grep 'addr=sub\|addr=loc' | grep -v 'PC=54,' |  less
```

`PC=54,` is the case for `svc 6` or `div`. But unfortunately couldn't find any other false negative pointers with this. 

with `b1.log` being generated from

```sh
cat a.ign | awk '!seen[$0]++' > a1.ign
cat a1.ign | python3 ~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.py ea_to_sym_filter bn6f.sym > b1.log
```

and `a.ign` is the logs from my modified mgba executable which output logs.

2026-01-09 Wk 2 Fri - 02:35 +03:00

Let's test that this fixes the issue with gunner.

```sh
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
dd if=/dev/zero of=zeros.bin  bs=$(python3 -c "print(0x1000)")  count=1

# in rom.s
main:
	.include "asm/main.s"
	.incbin "zeros.bin"
```

Music is still messed up, and we lag during battle, but the gunner-related crash is now gone.

2026-01-09 Wk 2 Fri - 03:09 +03:00

When shifting and looking at the logs, I notice we play music out of bogus addresses:

```
LAN - GBALoad8 PC=sub_814E260.loc_814E326+02, addr=3ECF6309, val
LAN - GBALoad8 PC=ply_note+22, addr=3ECF630A, val
LAN - GBALoad8 PC=ply_note+2C, addr=3ECF630B, val
```

Other suspicious ones

```
LAN - GBALoad32 PC=loc_814E73E, addr=asm38+64, val
LAN - GBALoad32 PC=sub_814E528.loc_814E554+02, addr=asm38.loc_3005BFC+18, val

# shifted
LAN - GBALoad8 PC=loc_30064B0, addr=npcSpriteMegaMan+941B, 
# non-shifted, similar
LAN - GBALoad8 PC=sub_3006594+10, addr=npcSpriteMegaMan+8C40, val=E5
```

2026-01-11 Wk 2 Sun - 20:31 +03:00

Hmm...

```
	.byte 0x24
byte_8158809::
	.byte 0x87, 0x1B, 0x8
```

This looks like a pointer, shifted by 1. It's also within the vicinity of neighboring pointers referenced. Issue is that there is a reference to `byte_8158809` in `off_81CA450` which I just marked. We need to understand `off_81CA450`. It seems to relate to the music glitches we encounter. I also marked some other pointers within the area:

```sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 81AABA0 -M "unk_81AABA0"
cargo run --bin expt000_read_symbol_data 8158519 -M "unk_8158519"
```

There's lots of data in that neighborhood like `byte_8150E41` which has uses we don't understand. 

Spawn [[007 Investigate sound data structures and off_81CA450]] ^spawn-invst-4ccb51
