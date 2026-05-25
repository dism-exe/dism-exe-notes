---
parent: "[[002 bn6f ROM shifting]]"
spawned_by: "[[001 Wk 51 bn6f ROM Shifting]]"
context_type: investigation
status: todo
---

Parent: [[002 bn6f ROM shifting]]

Spawned by: [[001 Wk 51 bn6f ROM Shifting]]

Spawned in: [[001 Wk 51 bn6f ROM Shifting#^spawn-invst-94bd41|^spawn-invst-94bd41]]

# 1 Journal

2025-12-17 Wk 51 Wed - 09:51 +03:00

Jacking in to Lan's PC gives the error:

```
The game has crashed with the following error:

Jumped to invalid address: FC10F7FE
```

I also get the error with `5011801C`

2025-12-17 Wk 51 Wed - 14:01 +03:00

```sh
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
mgba bn6f.elf -g &; gdb-multiarch bn6f.elf -ex "target remote localhost:2345"
```

2025-12-17 Wk 51 Wed - 14:22 +03:00

```
(gdb) bt
#0  0x310c7ca8 in ?? ()
#1  0x08038544 in RunCutscene () at ./asm/map_script_cutscene.s:6181

(gdb) info reg
r0             0x310c7ca9          822901929
r1             0x0                 0
r2             0x20                32
r3             0xffffffff          4294967295
r4             0x20                32
r5             0x2011c50           33627216
r6             0x803749c           134444188
r7             0x2                 2
r8             0x20                32
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x803749c           134444188
sp             0x3007dac           0x3007dac
lr             0x8038544           134448452
pc             0x310c7ca8          0x310c7ca8
cpsr           0x3f                63
```

Breaking at `RunCutscene` when trying to jack in to Lan's PC, and pressing `n` continuously after the break to reach the point of crash:

```
RunCutscene () at ./asm/map_script_cutscene.s:6184
6184            bne .cutsceneCommandLoop
(gdb)
6172            mov r6, r12
(gdb)
6175            ldrb r0, [r7]
(gdb)
6176            lsl r0, r0, #2
(gdb)
6179            ldr r0, [r6,r0]
(gdb)
6180            mov lr, pc
(gdb)
6181            bx r0
(gdb)
0x310c7ca8 in ?? ()
```

This is `bx r0` for `RunCutscene`. 

```
(gdb) b asm/map_script_cutscene.s:6181
```

9 continues to crash.

After 8 continues:

```
(gdb) info reg
r0             0x310c7ca9          822901929
r1             0x0                 0
r2             0x20                32
r3             0xffffffff          4294967295
r4             0x20                32
r5             0x2011c50           33627216
r6             0x803749c           134444188
r7             0x2                 2
r8             0x20                32
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x803749c           134444188
sp             0x3007dac           0x3007dac
lr             0x8038544           134448452
pc             0x8038542           0x8038542 <RunCutscene+38>
cpsr           0x3f                63

(gdb) bt
#0  RunCutscene () at ./asm/map_script_cutscene.s:6181
#1  0x08034c0c in cutscene_8034BB8 () at ./asm/asm03_1_0.s:1916
#2  0x08005272 in gamestate_OnMapUpdate_8005268 () at ./asm/asm00_1.s:4253
#3  0x080050fc in cbGameState_80050EC () at ./asm/asm00_1.s:4082
```

Before the 9th encounter:

```
# 2nd encounter
(gdb) info reg
r0             0x8037b09           134445833
r1             0x2001b80           33561472
r2             0x16d0              5840
r3             0x2001f6f           33562479
r4             0x0                 0
r5             0x2011c50           33627216
r6             0x803749c           134444188
r7             0x8098824           134842404
r8             0x1c                28
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x803749c           134444188
sp             0x3007dac           0x3007dac
lr             0x8038544           134448452
pc             0x8038542           0x8038542 <RunCutscene+38>
cpsr           0x3f                63

# 3rd encounter
(gdb) info reg
r0             0x80377d1           134445009
r1             0x8                 8
r2             0x16d0              5840
r3             0x2001f6a           33562474
r4             0x0                 0
r5             0x2011c50           33627216
r6             0x803749c           134444188
r7             0x8098826           134842406
r8             0x1c                28
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x803749c           134444188
sp             0x3007dac           0x3007dac
lr             0x8038544           134448452
pc             0x8038542           0x8038542 <RunCutscene+38>
cpsr           0x3f                63

# 4th encounter, after which there's a longer pause
(gdb) info reg
r0             0x8037ab7           134445751
r1             0x8                 8
r2             0x16d0              5840
r3             0x2001f6a           33562474
r4             0x0                 0
r5             0x2011c50           33627216
r6             0x803749c           134444188
r7             0x8098827           134842407
r8             0x1c                28
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x803749c           134444188
sp             0x3007dac           0x3007dac
lr             0x8038544           134448452
pc             0x8038542           0x8038542 <RunCutscene+38>
cpsr           0x3f                63

# 5th encounter
(gdb) info reg
r0             0x8035dd7           134438359
r1             0x22d7233           36532787
r2             0x16d0              5840
r3             0x0                 0
r4             0x887385cc          2289272268
r5             0x2011c50           33627216
r6             0x803749c           134444188
r7             0x809882c           134842412
r8             0x1c                28
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x803749c           134444188
sp             0x3007dac           0x3007dac
lr             0x8038544           134448452
pc             0x8038542           0x8038542 <RunCutscene+38>
cpsr           0x3f                63

# 6th encounter
(gdb) info reg
r0             0x8038029           134447145
r1             0x2                 2
r2             0x16d0              5840
r3             0x2e3               739
r4             0x171e              5918
r5             0x2011c50           33627216
r6             0x803749c           134444188
r7             0x8098830           134842416
r8             0x1c                28
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x803749c           134444188
sp             0x3007dac           0x3007dac
lr             0x8038544           134448452
pc             0x8038542           0x8038542 <RunCutscene+38>
cpsr           0x3f                63

# 7th encounter
(gdb) info reg
r0             0x8037a43           134445635
r1             0x0                 0
r2             0x0                 0
r3             0x2e3               739
r4             0x80988cd           134842573
r5             0x2011c50           33627216
r6             0x803749c           134444188
r7             0x8098835           134842421
r8             0x1c                28
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x803749c           134444188
sp             0x3007dac           0x3007dac
lr             0x8038544           134448452
pc             0x8038542           0x8038542 <RunCutscene+38>
cpsr           0x3f                63

# 8th encounter
(gdb) info reg
r0             0x80376f5           134444789
r1             0x3001710           50337552
r2             0x20                32
r3             0xffffffff          4294967295
r4             0x5                 5
r5             0x2011c50           33627216
r6             0x803749c           134444188
r7             0x8098837           134842423
r8             0x1c                28
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x803749c           134444188
sp             0x3007dac           0x3007dac
lr             0x8038544           134448452
pc             0x8038542           0x8038542 <RunCutscene+38>
cpsr           0x3f                63

(gdb) bt
#0  RunCutscene () at ./asm/map_script_cutscene.s:6181
#1  0x08034c0c in cutscene_8034BB8 () at ./asm/asm03_1_0.s:1916
#2  0x08005272 in gamestate_OnMapUpdate_8005268 () at ./asm/asm00_1.s:4253
#3  0x080050fc in cbGameState_80050EC () at ./asm/asm00_1.s:4082
Backtrace stopped: previous frame identical to this frame (corrupt stack?)
```

```
	// read command pointer and execute
	ldr r0, [r6,r0]
	mov lr, pc
	bx r0
```


Notice that `r6` is consistent across all encounters:

```
r6             0x803749c           134444188
```

This is

```
0803749c l 00000000 CutsceneCommandJumptable
```

No issue with this. So the problem probably happens right at that ldr, to the index `r0`, and not the indexed command.

via [stackoverflow post](https://stackoverflow.com/questions/6517423/how-to-do-an-specific-action-when-a-certain-breakpoint-is-hit-in-gdb), 

```
(gdb) b asm/map_script_cutscene.s:6179
(gdb) commands

# then type out (line by line)
info reg
cont
end 
```

```
# encounter 1
Breakpoint 1, RunCutscene () at ./asm/map_script_cutscene.s:6179
6179            ldr r0, [r6,r0]
r0             0xfc                252
r1             0x2001b80           33561472
r2             0x16d0              5840
r3             0x2001f6f           33562479
r4             0x0                 0
r5             0x2011c50           33627216
r6             0x803749c           134444188
r7             0x8098824           134842404
r8             0x1c                28
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x803749c           134444188
sp             0x3007dac           0x3007dac
lr             0x8034c0d           134433805
pc             0x803853e           0x803853e <RunCutscene+34>
cpsr           0x3f                63

# encounter 2
Breakpoint 1, RunCutscene () at ./asm/map_script_cutscene.s:6179
6179            ldr r0, [r6,r0]
r0             0x18                24
r1             0x8                 8
r2             0x16d0              5840
r3             0x2001f6a           33562474
r4             0x0                 0
r5             0x2011c50           33627216
r6             0x803749c           134444188
r7             0x8098826           134842406
r8             0x1c                28
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x803749c           134444188
sp             0x3007dac           0x3007dac
lr             0x809e0af           134865071
pc             0x803853e           0x803853e <RunCutscene+34>
cpsr           0x3f                63

# encounter 3
Breakpoint 1, RunCutscene () at ./asm/map_script_cutscene.s:6179
6179            ldr r0, [r6,r0]
r0             0xf8                248
r1             0x8                 8
r2             0x16d0              5840
r3             0x2001f6a           33562474
r4             0x0                 0
r5             0x2011c50           33627216
r6             0x803749c           134444188
r7             0x8098827           134842407
r8             0x1c                28
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x803749c           134444188
sp             0x3007dac           0x3007dac
lr             0x80377d7           134445015
pc             0x803853e           0x803853e <RunCutscene+34>
cpsr           0x3f                63

# encounter 4
Breakpoint 1, RunCutscene () at ./asm/map_script_cutscene.s:6179
6179            ldr r0, [r6,r0]
r0             0xa8                168
r1             0x22d7233           36532787
r2             0x16d0              5840
r3             0x0                 0
r4             0x887385cc          2289272268
r5             0x2011c50           33627216
r6             0x803749c           134444188
r7             0x809882c           134842412
r8             0x1c                28
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x803749c           134444188
sp             0x3007dac           0x3007dac
lr             0x8037ae1           134445793
pc             0x803853e           0x803853e <RunCutscene+34>
cpsr           0x3f                63

# encounter 5
Breakpoint 1, RunCutscene () at ./asm/map_script_cutscene.s:6179
6179            ldr r0, [r6,r0]
r0             0x12c               300
r1             0x2                 2
r2             0x16d0              5840
r3             0x2e3               739
r4             0x171e              5918
r5             0x2011c50           33627216
r6             0x803749c           134444188
r7             0x8098830           134842416
r8             0x1c                28
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x803749c           134444188
sp             0x3007dac           0x3007dac
lr             0x8035df3           134438387
pc             0x803853e           0x803853e <RunCutscene+34>
cpsr           0x3f                63

# encounter 6
Breakpoint 1, RunCutscene () at ./asm/map_script_cutscene.s:6179
6179            ldr r0, [r6,r0]
r0             0xe8                232
r1             0x0                 0
r2             0x0                 0
r3             0x2e3               739
r4             0x80988cd           134842573
r5             0x2011c50           33627216
r6             0x803749c           134444188
r7             0x8098835           134842421
r8             0x1c                28
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x803749c           134444188
sp             0x3007dac           0x3007dac
lr             0x8038034           134447156
pc             0x803853e           0x803853e <RunCutscene+34>
cpsr           0x3f                63

# encounter 7
Breakpoint 1, RunCutscene () at ./asm/map_script_cutscene.s:6179
6179            ldr r0, [r6,r0]
r0             0x8                 8
r1             0x3001710           50337552
r2             0x20                32
r3             0xffffffff          4294967295
r4             0x5                 5
r5             0x2011c50           33627216
r6             0x803749c           134444188
r7             0x8098837           134842423
r8             0x1c                28
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x803749c           134444188
sp             0x3007dac           0x3007dac
lr             0x800095d           134220125
pc             0x803853e           0x803853e <RunCutscene+34>
cpsr           0x3f                63

# encounter 8
Breakpoint 1, RunCutscene () at ./asm/map_script_cutscene.s:6179
6179            ldr r0, [r6,r0]
r0             0x10                16
r1             0x0                 0
r2             0x20                32
r3             0xffffffff          4294967295
r4             0x1                 1
r5             0x2011c50           33627216
r6             0x803749c           134444188
r7             0x0                 0
r8             0x20                32
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x803749c           134444188
sp             0x3007dac           0x3007dac
lr             0x803771d           134444829
pc             0x803853e           0x803853e <RunCutscene+34>
cpsr           0x3f                63

# encounter 9
Breakpoint 1, RunCutscene () at ./asm/map_script_cutscene.s:6179
6179            ldr r0, [r6,r0]
r0             0x280               640
r1             0x0                 0
r2             0x20                32
r3             0xffffffff          4294967295
r4             0x20                32
r5             0x2011c50           33627216
r6             0x803749c           134444188
r7             0x2                 2
r8             0x20                32
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x803749c           134444188
sp             0x3007dac           0x3007dac
lr             0x80377a1           134444961
pc             0x803853e           0x803853e <RunCutscene+34>
cpsr           0x3f                63
```

```
# encounter 8
r7             0x0                 0
```

This is bad. `r0` for the command index comes from r7:

```
	// read current command byte
	ldrb r0, [r7]
	lsl r0, r0, #2
```

but it is NULL there. 

We need to check `r5` since it we are loading the data from there and it is always `0x2011c50` (`eCutsceneState`)

```
```

```
.executeCutsceneScriptsLoop
	ldr r6, =CutsceneCommandJumptable
	mov r12, r6
	mov r7, r8
==>	ldr r7, [r5,r7]

(gdb) b asm/map_script_cutscene.s:6168
(gdb) commands

# then type out (line by line)
info reg r7
cont
end 
```

```
Breakpoint 1, RunCutscene () at ./asm/map_script_cutscene.s:6168
6168            ldr r7, [r5,r7]
r7             0x1c                28

Breakpoint 1, RunCutscene () at ./asm/map_script_cutscene.s:6168
6168            ldr r7, [r5,r7]
r7             0x20                32
```

```C
// in include/structs/CutsceneState.inc
	ptr CutsceneScriptPos // loc=0x1c
	ptr CutsceneScriptPos2 // loc=0x20
```

```
.executeCutsceneScriptsLoop
	ldr r6, =CutsceneCommandJumptable
	mov r12, r6
	mov r7, r8
==>	ldr r7, [r5,r7]

(gdb) b asm/map_script_cutscene.s:6168
(gdb) commands

# then type out (line by line)
x/1w 0x2011c50+0x1c
x/1w 0x2011c50+0x20
cont
end 
```

```
Breakpoint 1, RunCutscene () at ./asm/map_script_cutscene.s:6168
6168            ldr r7, [r5,r7]
0x2011c6c:      134842404
0x2011c70:      134444688

Breakpoint 1, RunCutscene () at ./asm/map_script_cutscene.s:6168
6168            ldr r7, [r5,r7]
0x2011c6c:      134842423
0x2011c70:      0
```

It already had NULL at `CutsceneScriptPos2`. 

This is set by `cutscene_8036EFE`, `cutscene_8036ED4` and `StartCutscene`. Let's see which one breaks here.

```
b cutscene_8036EFE
b cutscene_8036ED4
b StartCutscene
```

```
Breakpoint 3, StartCutscene () at ./asm/map_script_cutscene.s:2433
2433            push {r5,lr}
(gdb) info reg
r0             0x8098824           134842404
r1             0x1                 1
r2             0x16d0              5840
r3             0x2001f62           33562466
r4             0x0                 0
r5             0x2001b80           33561472
r6             0x0                 0
r7             0x804e9f0           134539760
r8             0x0                 0
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x421               1057
sp             0x3007db4           0x3007db4
lr             0x8034d41           134434113
pc             0x8036e90           0x8036e90 <StartCutscene>
cpsr           0x3f                63
```

It's not set to NULL here and it's only called once. The others aren't being referenced during Jack in, though they appear before on game reset and load.

```
(gdb) watch *(0x2011c50+0x20)
Hardware watchpoint 1: *(0x2011c50+0x20)
```

```
Old value = 134444688
New value = 0
0x0000023c in ?? ()
(gdb) bt
#0  0x0000023c in ?? ()
#1  0x000000a4 in ?? ()
Backtrace stopped: previous frame identical to this frame (corrupt stack?)
(gdb) info reg
r0             0x3007d90           50363792
r1             0x2011c74           33627252
r2             0x5000024           83886116
r3             0x0                 0
r4             0x2011ce0           33627360
r5             0x2011c50           33627216
r6             0x0                 0
r7             0x804e9f0           134539760
r8             0x0                 0
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x1f                31
r12            0x3007d8c           50363788
sp             0x3007d78           0x3007d78
lr             0xa4                164
pc             0x23c               0x23c
cpsr           0x8000001f          -2147483617

```

```
Hardware watchpoint 1: *(0x2011c50+0x20)

Old value = 0
New value = 134444688
StartCutscene () at ./asm/map_script_cutscene.s:2447
2447            str r0, [r5,#oCutsceneState_CutsceneScriptPos4] // s_02011C50.ptr_28

```

Then it crashes? Why wasn't there a watchpoint trigger back to NULL?

```
(gdb) x/1wx 0x2011c50+0x20
0x2011c70:      0x00000000
```

But it is set to zero somehow...

2025-12-17 Wk 51 Wed - 15:54 +03:00

```
CutsceneCmd_decomp_text_archive () at ./asm/map_script_cutscene.s:4455

(gdb)
4461            bl DecompressTextArchiveForCutscene // (CompText *archive) -> TextScriptArchive*
(gdb) x/1wx 0x2011c50+0x20
0x2011c70:      0x08037690
(gdb) n
x/1wx 0x2011c50+0x204463                str r0, [r5,#oCutsceneState_TextArchivePtr]
(gdb) x/1wx 0x2011c50+0x20
0x2011c70:      0x00000000
(gdb)
```

```
(gdb) x/10x 0x2011c50
0x2011c50:      0x00000000      0x00000000      0x00000000      0x00000000
0x2011c60:      0x00000000      0x00000000      0x00000000      0x00000000
0x2011c70:      0x00000000      0x00000000
```

So something weird happened at this `DecompressTextArchiveForCutscene`.

```
(gdb) b DecompressTextArchiveForCutscene

# On jack in
Breakpoint 1, DecompressTextArchiveForCutscene () at ./asm/map_script_cutscene.s:4471
4471            push {lr}

(gdb) info reg
r0             0x887385cc          2289272268
r1             0x8                 8
r2             0x16d0              5840
r3             0x2001f6a           33562474
r4             0x887385cc          2289272268
r5             0x2011c50           33627216
r6             0xcc                204
r7             0x8098827           134842407
r8             0x1c                28
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x803749c           134444188
sp             0x3007da8           0x3007da8
lr             0x8037ac9           134445769
pc             0x8037ad0           0x8037ad0 <DecompressTextArchiveForCutscene>
cpsr           0xa000003f          -1610612673
```

```
087385cc g 00000000 CompText87385CC
```

This has

```
	def_text_script CompText87385CC_unk9
	ts_control_lock
	ts_text_speed delay=0x1
	ts_mugshot_show mugshot=0x0
	ts_msg_open
	.string "Jack in!"
	ts_wait frames=0xA
	.string "\n"
	.string "MegaMan,"
	ts_wait frames=0xA
	.string "\n"
	.string "Execute!!"
	ts_wait frames=0x1E
	ts_control_unlock
	ts_end
```

And other Jack in related text.

```
4478            bl SWI_LZ77UnCompReadNormalWrite8bit // (src: *const LZ77Compressed<T>, mut_dest: *mut T -> ()
(gdb) x/1wx 0x2011c50+0x20
0x2011c70:      0x08037690
(gdb) n
4479            ldr r0, =eDecompressionBuf2034A00
(gdb) x/1wx 0x2011c50+0x20
0x2011c70:      0x00000000
```

```
(gdb)
4478            bl SWI_LZ77UnCompReadNormalWrite8bit // (src: *const LZ77Compressed<T>, mut_dest: *mut T -> ()
(gdb) info reg
r0             0x87385cc           141788620
r1             0x2034a00           33769984
```

```
eDecompressionBuf2034A00:: // 0x2034a00
    .space 4
```

```
(gdb) x/1wx 0x2034a00
0x2034a00:      0x00000000
```

So the data at `0x2011c50` is somehow getting corrupted in

```
x/10x 0x2011c50
```

```
	ldr r1, =eDecompressionBuf2034A00
	bl SWI_LZ77UnCompReadNormalWrite8bit // (src: *const LZ77Compressed<T>, mut_dest: *mut T -> ()
```

Which is just `svc 0x11`. 

Let's see what happens in a matching ROM for this behvior.

```
(gdb) b DecompressTextArchiveForCutscene

# On JackIn
Breakpoint 1, DecompressTextArchiveForCutscene () at ./asm/map_script_cutscene.s:4471
4471            push {lr}
(gdb) info reg
r0             0x887385cc          2289272268
r1             0x8                 8
r2             0x16d0              5840
r3             0x2001f6a           33562474
r4             0x887385cc          2289272268
r5             0x2011c50           33627216
r6             0xcc                204
r7             0x8098827           134842407
r8             0x1c                28
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x803749c           134444188
sp             0x3007da8           0x3007da8
lr             0x8037ac9           134445769
pc             0x8037ad0           0x8037ad0 <DecompressTextArchiveForCutscene>
cpsr           0xa000003f          -1610612673

(gdb) x/10x 0x2011c50
0x2011c50:      0x00000000      0x00000001      0x00000000      0x00000000
0x2011c60:      0x00000000      0x00000000      0x00000000      0x08098824
0x2011c70:      0x08037690      0x08037690

4478            bl SWI_LZ77UnCompReadNormalWrite8bit // (src: *const LZ77Compressed<T>, mut_dest: *mut T -> ()
(gdb) info reg r0 r1
r0             0x87385cc           141788620
r1             0x2034a00           33769984

# after bl SWI_LZ77UnCompReadNormalWrite8bit
x/10x 0x2011c50
0x2011c50:      0x00000000      0x00000001      0x00000000      0x00000000
0x2011c60:      0x00000000      0x00000000      0x00000000      0x08098824
0x2011c70:      0x08037690      0x08037690

(gdb) info reg
r0             0x87388a7           141789351
r1             0x2034f4e           33771342
r2             0x16d0              5840
r3             0x0                 0
r4             0x887385cc          2289272268
r5             0x2011c50           33627216
r6             0xcc                204
r7             0x8098827           134842407
r8             0x1c                28
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x803749c           134444188
sp             0x3007da4           0x3007da4
lr             0x8037ae1           134445793
pc             0x8037ae0           0x8037ae0 <DecompressTextArchiveForCutscene+16>
cpsr           0x3f                63

(gdb) x/1wx 0x2011c50+0x20
0x2011c70:      0x08037690

```


We have not been building `bn6f.sym` due to `&&` and it a failed checksum fails that. This is the updated ea:

```
08738d4c g 00000000 CompText87385CC
```

But yet in both cases of the OK ROM and the failing ROM, we were accessing `0x87385CC`. Could be due to a formatting problem, `SWI_LZ77UnCompReadNormalWrite8bit` might be zeroing out RAM to signal error, or it ran off on accessing an invalid asset.

So we know we have a false negative on `CompText87385CC` somewhere. Since we came from a cutscene, probably from an undumped cutscene.

Now back to shift2 added after dat37.s:

```
(gdb) b CutsceneCmd_decomp_text_archive

4456            mov r6, #1
(gdb)
4457            bl ReadMapScriptWord
(gdb)
4458            mov r0, r4
(gdb) info reg r4
r4             0x887385cc          2289272268
```

This data is loaded from `r7`:

```
r7             0x8098827           134842407
```

This is undumped:

```
byte_8098824:: // CutsceneScript
  .byte 0x3F, 0x0, 0x6, 0x3E, 0xCC, 0x85, 0x73, 0x88, 0x2A, 0xFF
	.byte 0x1E, 0x17, 0x4B, 0xCD, 0x88, 0x9, 0x8, 0x3A, 0x5, 0x2
	.byte 0xFF, 0x1, 0x17, 0xFF, 0x1E, 0x17, 0x56, 0x88, 0x9, 0x8
	.byte 0x29, 0xFF, 0x1, 0x17, 0x47, 0x0, 0xFF, 0x4, 0x40, 0x4
	.byte 0xFF, 0x4, 0x4D, 0x75, 0x0, 0x15, 0x59, 0x88, 0x9, 0x8
	.byte 0x4D, 0x69, 0x0, 0x4, 0x80, 0x17, 0xFF, 0x1E, 0x17, 0xC0
	.byte 0x88, 0x9, 0x8, 0x36
	.word byte_8098458
	.byte 0x36, 0x90, 0x84, 0x9, 0x8, 0x2, 0xFF, 0xA, 0x49, 0x10, 0x0
	.byte 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x14, 0x0, 0x0, 0x0, 0x47
	.byte 0x0, 0xFF, 0x19, 0x2, 0xFF, 0x1, 0x5, 0x1, 0x4D, 0xB7, 0x0
	.byte 0x5, 0x2, 0x49, 0x30, 0x49, 0x10, 0x0, 0x0, 0x0, 0x0, 0x0
	.byte 0x0, 0x0, 0xB2, 0x0, 0x0, 0x0, 0x2, 0xFF, 0x3, 0x4E, 0x63
	.byte 0x0, 0x4D, 0x77, 0x0, 0x5, 0x80, 0x2, 0xFF, 0x14, 0x27, 0xFF
	.byte 0x4, 0x10, 0x7, 0x2A, 0xFF, 0x3, 0x17, 0x2, 0xFF, 0xF, 0x4C
	.byte 0x81, 0x0, 0x0, 0x0, 0x0, 0x0, 0x15
	.word byte_80988C4
	.word 0x171EFF2A
```

```
	ldr r0, off_8034D60 // =byte_8098824 // CutsceneScript
	bl StartCutscene // (script: *const CutsceneScript, param: u32) -> ()
```

We need to dump all direct uses of `StartCutscene`. 

Spawn [[000 Dump all cutscene scripts that directly use StartCutscene]] ^spawn-task-f72885

2025-12-18 Wk 51 Thu - 15:03 +03:00

Spawn [[003 Look into dumping undumped code with methods outside IDA]] ^spawn-invst-85604d
