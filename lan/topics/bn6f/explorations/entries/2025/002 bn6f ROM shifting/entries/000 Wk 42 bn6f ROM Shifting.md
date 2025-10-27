---
parent: '[[002 bn6f ROM Shifting]]'
spawned_by: '[[002 bn6f ROM Shifting]]'
context_type: entry
---

Parent: [002 bn6f ROM Shifting](../002%20bn6f%20ROM%20Shifting.md)

Spawned by: [002 bn6f ROM Shifting](../002%20bn6f%20ROM%20Shifting.md)

Spawned in: [<a name="spawn-entry-cdd243" />^spawn-entry-cdd243](../002%20bn6f%20ROM%20Shifting.md#spawn-entry-cdd243)

# 1 Journal

2025-10-17 Wk 42 Fri - 08:50 +03:00

I added some no-ops for a shift test in `bn6f@tmp`:

````diff
// in fn main_
  bl main_static_80003E4

+  add r0, r0, #0
+  add r0, r0, #0
````

In the start screen there's messed up graphics being loaded, but no crash. The first crash we're detecting from gdb in `RunContinuousMapScript`

````sh
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
mgba bn6f.elf -g &; gdb-multiarch bn6f.elf -ex "target remote localhost:2345"

# in gdb
b RunContinuousMapScript
c

# Breaks on PRESS START > CONTINUE, black screen

s # ...

# src
.mapScriptCommandLoop
	mov r6, r12
	ldrb r0, [r7]
	lsl r0, r0, #2
	ldr r0, [r6,r0]
	mov lr, pc
==>	bx r0
# /src

info reg

# first iteration

# out
r0             0x8035937           134437175
r1             0x2011c50           33627216
r2             0x0                 0
r3             0x3005ffb           50356219
r4             0x4210              16912
r5             0x2011e60           33627744
r6             0x803580c           134436876
r7             0x804eefb           134541051
r8             0x0                 0
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x803580c           134436876
sp             0x3007db0           0x3007db0
lr             0x8036060           134439008
pc             0x803605e           0x803605e <RunContinuousMapScript+26>
# /out

# first command MapScriptCutsceneCmd_jump_if_progress_in_range is OK

info reg

# second iteration

# out
r0             0xfaa8f000          4205375488
r1             0x0                 0
r2             0x0                 0
r3             0x3005ffb           50356219
r4             0x804ef26           134541094
r5             0x2011e60           33627744
r6             0x803580c           134436876
r7             0x804ef26           134541094
r8             0x0                 0
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x803580c           134436876
sp             0x3007db0           0x3007db0
lr             0x8036060           134439008
pc             0x803605e           0x803605e <RunContinuousMapScript+26>
# /out

n

# 2nd iteration mgba reports 
# "The game has crashed with the following error: "
# "Jumped to invalid address: FAA8F000"
````

So the first shifting critical error is due to an index written to `oMapScriptState_ContinuousMapScriptPtr`.

````C
// in fn RunContinuousMapScript
.mapScriptCommandLoop
	mov r6, r12
	ldrb r0, [r7]
==>	lsl r0, r0, #2
````

````sh
# 2nd iteration
info reg

# out
r0             0xd0                208
r1             0x0                 0
r2             0x0                 0
r3             0x3005ffb           50356219
r4             0x804ef26           134541094
r5             0x2011e60           33627744
r6             0x803580c           134436876
r7             0x804ef26           134541094
r8             0x0                 0
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x803580c           134436876
sp             0x3007db0           0x3007db0
lr             0x803595b           134437211
pc             0x8036058           0x8036058 <RunContinuousMapScript+20>
cpsr           0x3f                63
````

This `0xd0` index is the issue.

The shift also messed up the graphics in the start screen:

![Pasted image 20251017092511.png](../../../../../../../../attachments/Pasted%20image%2020251017092511.png)

![Pasted image 20251017092536.png](../../../../../../../../attachments/Pasted%20image%2020251017092536.png)

![Pasted image 20251017092618.png](../../../../../../../../attachments/Pasted%20image%2020251017092618.png)

Breaking on `StoreMapScriptsThenRunOnInitMapScript`, we get

````sh
info reg

# out
r0             0x804ea2c           134539820
r1             0x804eefb           134541051
r2             0xff                255
r3             0x0                 0
r4             0x80345f0           134432240
r5             0x2001b80           33561472
r6             0xfc00              64512
r7             0x4                 4
r8             0x0                 0
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x4210              16912
sp             0x3007dc8           0x3007dc8
lr             0x8034ba1           134433697
pc             0x8036012           0x8036012 <StoreMapScriptsThenRunOnInitMapScript>
cpsr           0x3f                63
````

`0x804ea2c` is the 4-byte shifted `MapScriptOnInitCentralTown_804EA28` and `0x804eefb` refers to `MapScriptOnUpdateCentralTown_804EEF7`

2025-10-17 Wk 42 Fri - 09:37 +03:00

Breaking on `RunContinuousMapScript`

````C
RunContinuousMapScript:
	push {r4-r7,lr}
	mov r4, r12
	push {r4}
	ldr r5, off_8036090 // =eMapScriptState
	ldr r0, [r5,#oMapScriptState_ContinuousMapScriptPtr] // (dword_2011E6C - 0x2011e60)
==>	ldr r6, off_803608C // =MapScriptCommandJumptable
````

````sh
# First iteration
info reg

# out
r0             0x804eefb           134541051
r1             0x2011c50           33627216
r2             0x0                 0
r3             0x3005ffb           50356219
r4             0x4210              16912
r5             0x2011e60           33627744
r6             0xfc00              64512
r7             0x2                 2
r8             0x0                 0
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x4210              16912
sp             0x3007db0           0x3007db0
lr             0x8034bd1           134433745
pc             0x803604e           0x803604e <RunContinuousMapScript+10>
cpsr           0x4000003f          1073741887
````

`r0` is put in `r7` and in the first command `MapScriptCutsceneCmd_jump_if_progress_in_range` then changes `r7` from `0x804eefb` to `0x804ef26`

`0xd0` then is the first byte in `0x804ef26` which should be a command. ~~Since we're 4-byte shifted, we expect that there is a script at `0x804ef22`~~ It's actually still in `0x804ef26` because we have not shifted it.

This script would be a label between `MapScriptOnUpdateCentralTown_804EEF7` and `byte_804EF62` which does not yet exist.

In `MapScriptOnUpdateCentralTown_804EEF7` the first command is `.byte 0x2, 0x0, 0xF, 0x26, 0xEF, 0x4` corresponding to `ms_jump_if_progress_in_range`

~~`0x26, 0xEF, 0x4` constructs the word3 `04EF26`~~, No there was a `0x8` after. It just is an address.

So those `destination3` fragments will need to be encoded somehow from labels.

`0x804ef26 - 0x804EEF7 = 47`

Maybe:

````
.hword MapScript_804EF26 & 0x0000FFFF
.byte MapScript_804EF26 & 0x00FF0000
````

2025-10-17 Wk 42 Fri - 10:13 +03:00

````
MapScriptOnUpdateCentralTown_804EEF7:: // MapScript
  // 00
  .byte 0x2, 0x0, 0xF
  .hword (0x804EF26 & 0x0000FFFF)
  .byte ((0x804EF26 & 0x00FF0000) >> 16 )
  .byte 0x8, 0x2, 0x10, 0x1F
````

This gives OK, but it's not allowing to turn them to labels straight out:

````
./maps/CentralTown/data.s:390: Error: invalid operands (.text and *ABS* sections) for `&'
./maps/CentralTown/data.s:391: Error: invalid operands (.text and *ABS* sections) for `&'
````

Actually even though they are in `destination3` they are treated as a `.word` for some reason:

````
// in include/bytecode/map_script.inc

// shared command
	enum ms_jump_if_progress_in_range_cmd // 0x02
// 0x02/0x16 byte1 byte2 destination3
// jump if byte1 <= progress byte <= byte2
// byte1 - lower bound for progress byte
// byte2 - upper bound for progress byte
// destination3 - script to jump to
	.macro ms_jump_if_progress_in_range byte1:req, byte2:req, destination3:req
	.byte ms_jump_if_progress_in_range_cmd
	.byte \byte1, \byte2
	.word \destination3
	.endm
````

The `N` in `destination` is not an indication of 3-byte, it's just the 3rd argument.

2025-10-17 Wk 42 Fri - 10:28 +03:00

Actually seems I'm just wrong. There was an extra `0x8`. It is simply just a normal 32-bit address. but it seems they were missed in dumping as they are only referred to by scripts.

This OKs:

````C
MapScriptOnUpdateCentralTown_804EEF7:: // MapScript
  ms_jump_if_progress_in_range [
    byte1: 0x0,
    byte2: 0xF,
    destination3: MapScript_804EF26
  ]  
  //.byte 0x2, 0x0, 0xF, 0x26, 0xEF, 0x4, 0x8
````

2025-10-17 Wk 42 Fri - 10:45 +03:00

All those need to be dumped and uncovered in [004 Impl dumping for map npc and cutscene scripts](../../../../../../../tasks/2025/004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts/004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts.md)

But the first sign of discrepancy is graphical and non-crashing.
