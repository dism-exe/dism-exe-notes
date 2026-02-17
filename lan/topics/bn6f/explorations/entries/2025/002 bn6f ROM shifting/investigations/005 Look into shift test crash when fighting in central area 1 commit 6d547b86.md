---
parent: "[[002 bn6f ROM shifting]]"
spawned_by: "[[001 Wk 51 bn6f ROM Shifting]]"
context_type: investigation
status: todo
---

Parent: [[002 bn6f ROM shifting]]

Spawned by: [[001 Wk 51 bn6f ROM Shifting]]

Spawned in: [[001 Wk 51 bn6f ROM Shifting#^spawn-invst-63eeeb|^spawn-invst-63eeeb]]

# 1 Journal

2025-12-25 Wk 52 Thu - 15:36 +03:00

```
main:
  .incbin "data/compressed/CompCapcomLogoTilemap_86C3E94.lz77"
  .incbin "data/compressed/CompCapcomLogoTilemap_86C3E94.lz77"
  .incbin "data/compressed/CompCapcomLogoTilemap_86C3E94.lz77"
  .incbin "data/compressed/CompCapcomLogoTilemap_86C3E94.lz77"
  .incbin "data/compressed/CompCapcomLogoTilemap_86C3E94.lz77"
  .incbin "data/compressed/CompCapcomLogoTilemap_86C3E94.lz77"
  .include "asm/main.s"
```

```
main:
  .include "asm/main.s"
  .incbin "data/compressed/CompCapcomLogoTilemap_86C3E94.lz77"
  .incbin "data/compressed/CompCapcomLogoTilemap_86C3E94.lz77"
  .incbin "data/compressed/CompCapcomLogoTilemap_86C3E94.lz77"
  .incbin "data/compressed/CompCapcomLogoTilemap_86C3E94.lz77"
  .incbin "data/compressed/CompCapcomLogoTilemap_86C3E94.lz77"
  .incbin "data/compressed/CompCapcomLogoTilemap_86C3E94.lz77"
```

It happens in both cases.

2025-12-25 Wk 52 Thu - 15:39 +03:00

```
mgba bn6f.elf -g &; gdb-multiarch bn6f.elf -ex "target remote localhost:2345"
```

When we start a battle in Central Area 1, we get a crash here:

```
Program received signal SIGINT, Interrupt.
0x493a1840 in ?? ()
(gdb) bt
#0  0x493a1840 in ?? ()
#1  0x080289ec in sub_8028250 () at ./asm/asm03_0.s:3955
Backtrace stopped: previous frame identical to this frame (corrupt stack?)
```

Breaking at `sub_8028250`, and when triggered, we'll just do `n` until we crash.

We're crashing in the `bx` there, but no the first call. `asm/asm03_0.s:3955`

Breaking there we get

```
Breakpoint 1, sub_8028250 () at ./asm/asm03_0.s:3955
3955            bx r0
(gdb) info reg r0
r0             0x8028a05           134384133
r0             0x8028a05           134384133
r0             0x8028a05           134384133
r0             0x8028a05           134384133
r0             0x8028a05           134384133
r0             0x8028a91           134384273
r0             0x8028a91           134384273
r0             0x493a1840          1228544064
```

This is likely due to a false index from `getLocOfActiveChips_8027E1C`, which in this case just loads a value from `unk_20365C0`. 

```
(gdb) b asm/asm03_0.s:3955
(gdb) commands

# then type out (line by line)
info reg r0
x/10wx 0x20365C0
cont
end 
```

The data there doesn't change at all. It's always

```
(gdb) x/10wx 0x20365C0
0x20365c0:      0x010aff00      0x00000000      0x0203cdb0      0x0200ff00
0x20365d0:      0x00000000      0x0203cdb2      0x03010700      0x00000000
0x20365e0:      0x0203cdb4      0x0402ff00
```

Let's break at the `ldrb r0, [r4]` instead. This is the index that would be transformed then indexed by for the `bx`. 

The line after it, `lsl r0, r0, #2`, is at `asm/asm03_0.s:3951`

Let's look at the line just where it is about to be indexed, which has the multiplication by 4 transformation: `ldr r0, [r2,r0]` at `asm/asm03_0.s:3953`. Looking at the `ldrb r0, [r4]` line would be a bit early as we would see the value loaded. The break stops before executing the inst.

```
(gdb) b asm/asm03_0.s:3953
(gdb) commands

# then type out (line by line)
info reg r0 r4
cont
end 
```

```
Breakpoint 1, sub_8028250 () at ./asm/asm03_0.s:3953
3953            ldr r0, [r2,r0]
r0             0x0                 0
r4             0x20365c0           33777088

Breakpoint 1, sub_8028250 () at ./asm/asm03_0.s:3953
3953            ldr r0, [r2,r0]
r0             0x0                 0
r4             0x20365cc           33777100

Breakpoint 1, sub_8028250 () at ./asm/asm03_0.s:3953
3953            ldr r0, [r2,r0]
r0             0x0                 0
r4             0x20365d8           33777112

Breakpoint 1, sub_8028250 () at ./asm/asm03_0.s:3953
3953            ldr r0, [r2,r0]
r0             0x0                 0
r4             0x20365e4           33777124

Breakpoint 1, sub_8028250 () at ./asm/asm03_0.s:3953
3953            ldr r0, [r2,r0]
r0             0x0                 0
r4             0x20365f0           33777136

Breakpoint 1, sub_8028250 () at ./asm/asm03_0.s:3953
3953            ldr r0, [r2,r0]
r0             0x28                40
r4             0x20365fc           33777148

Breakpoint 1, sub_8028250 () at ./asm/asm03_0.s:3953
3953            ldr r0, [r2,r0]
r0             0x28                40
r4             0x2036608           33777160

Breakpoint 1, sub_8028250 () at ./asm/asm03_0.s:3953
3953            ldr r0, [r2,r0]
r0             0x228               552
r4             0x2036614           33777172
```

So r4 starts at `unk_20365C0` , and keeps incrementing by 12.  Eventually we get this `0x228` index which crashes us.

We do not know what writes to `unk_20365C0`, so let's try to find out with a watchpoint:

```
watch *0x20365C0
```

```
# In battle while viruses are being spawned in CentralArea1

Hardware watchpoint 1: *0x20365C0

Old value = 0
New value = 17433866
sub_8027E90 () at ./asm/asm03_0.s:3378
3378            str r0, [r2,#4]

Hardware watchpoint 1: *0x20365C0

Old value = 17433866
New value = 17433856
sub_8027EE8 () at ./asm/asm03_0.s:3434
3434            add r4, #0xc
```

`sub_8027E90` moves `r4` into `r2`, but `r4` originates from outside it.

`sub_8027EE8` similarly expects it from `r4` Before running `str r1, [r4,#8]` which is where the watchpoint triggered at `./asm/asm03_0.s:3433`. r4 also comes from outside it.

Both of those functions are called by `sub_8027E2C` which saves this to `r4`:

```C
mov r0, #0
bl getLocOfActiveChips_8027E1C // (int a1) -> void*
mov r4, r0
```

```C
// in ewram.s
unk_20365C0:: // 0x20365c0
	.space 160
```

It's probably 156 bytes, since that's divisible by 12 and yields 13 slots. 

```
# At crash
(gdb) x/12bx 0x20365C0+0*12
0x20365c0:      0x00    0xff    0x0a    0x01    0x00    0x00    0x00    0x00
0x20365c8:      0xb0    0xcd    0x03    0x02
(gdb) x/12bx 0x20365C0+1*12
0x20365cc:      0x00    0xff    0x00    0x02    0x00    0x00    0x00    0x00
0x20365d4:      0xb2    0xcd    0x03    0x02
(gdb) x/12bx 0x20365C0+2*12
0x20365d8:      0x00    0x07    0x01    0x03    0x00    0x00    0x00    0x00
0x20365e0:      0xb4    0xcd    0x03    0x02
(gdb) x/12bx 0x20365C0+3*12
0x20365e4:      0x00    0xff    0x02    0x04    0x00    0x00    0x00    0x00
0x20365ec:      0xb6    0xcd    0x03    0x02
(gdb) x/12bx 0x20365C0+4*12
0x20365f0:      0x00    0xff    0x03    0x0a    0x00    0x00    0x00    0x00
0x20365f8:      0xb8    0xcd    0x03    0x02
(gdb) x/12bx 0x20365C0+5*12
0x20365fc:      0x0a    0x00    0x0b    0x06    0x00    0x00    0x00    0x00
0x2036604:      0x00    0x00    0x00    0x00
(gdb) x/12bx 0x20365C0+6*12
0x2036608:      0x0a    0x01    0x05    0x07    0x00    0x00    0x00    0x00
0x2036610:      0x00    0x00    0x00    0x00
(gdb) x/12bx 0x20365C0+7*12
0x2036614:      0x8a    0xff    0x0a    0x0a    0x00    0x00    0x00    0x00
0x203661c:      0x00    0x00    0x00    0x00
```

Let's find out why there's a `0x8a` in `0x2036614`. 

```
watch *0x2036614
```

```
Hardware watchpoint 1: *0x2036614

Old value = 0
New value = 134613386 # 0x806098a
sub_8027E90 () at ./asm/asm03_0.s:3378
3378            str r0, [r2,#4]

# Then crash
```

2025-12-25 Wk 52 Thu - 16:34 +03:00

Let's monitor registers `r2` and `r0` here:

```
	thumb_local_start
sub_8027E90:
	push {r6,lr}
	mov r3, #0xc
	mov r2, r4
	ldr r1, off_8027EE4 // =dword_802A7CC 
loc_8027E98:
	ldr r0, [r1]
	str r0, [r2]
==>	mov r0, #0 # asm/asm03_0.s:3377
	str r0, [r2,#4]
```

```
(gdb) b asm/asm03_0.s:3377
(gdb) commands

# then type out (line by line)
info reg r2 r0
x/12bx 0x2036614
cont
end 
```

```
# At battle start on virus spawn

Breakpoint 1, sub_8027E90 () at ./asm/asm03_0.s:3377
3377            mov r0, #0
r2             0x2036608           33777160
r0             0x705010a           117768458
0x2036614:      0x00    0x00    0x00    0x00    0x00    0x00    0x00    0x00
0x203661c:      0x00    0x00    0x00    0x00

Breakpoint 1, sub_8027E90 () at ./asm/asm03_0.s:3377
3377            mov r0, #0
r2             0x2036614           33777172
r0             0x806098a           134613386
0x2036614:      0x8a    0x09    0x06    0x08    0x00    0x00    0x00    0x00
0x203661c:      0x00    0x00    0x00    0x00
```

This is where it was written.

Here are all of them:

```
Breakpoint 1, sub_8027E90 () at ./asm/asm03_0.s:3377
3377            mov r0, #0
r2             0x20365c0           33777088
r0             0x10a050a           17433866
0x2036614:      0x00    0x00    0x00    0x00    0x00    0x00    0x00    0x00
0x203661c:      0x00    0x00    0x00    0x00

Breakpoint 1, sub_8027E90 () at ./asm/asm03_0.s:3377
3377            mov r0, #0
r2             0x20365cc           33777100
r0             0x200060a           33555978
0x2036614:      0x00    0x00    0x00    0x00    0x00    0x00    0x00    0x00
0x203661c:      0x00    0x00    0x00    0x00

Breakpoint 1, sub_8027E90 () at ./asm/asm03_0.s:3377
3377            mov r0, #0
r2             0x20365d8           33777112
r0             0x301070a           50398986
0x2036614:      0x00    0x00    0x00    0x00    0x00    0x00    0x00    0x00
0x203661c:      0x00    0x00    0x00    0x00

Breakpoint 1, sub_8027E90 () at ./asm/asm03_0.s:3377
3377            mov r0, #0
r2             0x20365e4           33777124
r0             0x402080a           67241994
0x2036614:      0x00    0x00    0x00    0x00    0x00    0x00    0x00    0x00
0x203661c:      0x00    0x00    0x00    0x00

Breakpoint 1, sub_8027E90 () at ./asm/asm03_0.s:3377
3377            mov r0, #0
r2             0x20365f0           33777136
r0             0xa03090a           167971082
0x2036614:      0x00    0x00    0x00    0x00    0x00    0x00    0x00    0x00
0x203661c:      0x00    0x00    0x00    0x00

Breakpoint 1, sub_8027E90 () at ./asm/asm03_0.s:3377
3377            mov r0, #0
r2             0x20365fc           33777148
r0             0x60b000a           101384202
0x2036614:      0x00    0x00    0x00    0x00    0x00    0x00    0x00    0x00
0x203661c:      0x00    0x00    0x00    0x00

Breakpoint 1, sub_8027E90 () at ./asm/asm03_0.s:3377
3377            mov r0, #0
r2             0x2036608           33777160
r0             0x705010a           117768458
0x2036614:      0x00    0x00    0x00    0x00    0x00    0x00    0x00    0x00
0x203661c:      0x00    0x00    0x00    0x00

Breakpoint 1, sub_8027E90 () at ./asm/asm03_0.s:3377
3377            mov r0, #0
r2             0x2036614           33777172
r0             0x806098a           134613386
0x2036614:      0x8a    0x09    0x06    0x08    0x00    0x00    0x00    0x00
0x203661c:      0x00    0x00    0x00    0x00

Breakpoint 1, sub_8027E90 () at ./asm/asm03_0.s:3377
3377            mov r0, #0
r2             0x2036620           33777184
r0             0x907030b           151454475
0x2036614:      0x8a    0x09    0x06    0x08    0x00    0x00    0x00    0x00
0x203661c:      0x00    0x00    0x00    0x00

Breakpoint 1, sub_8027E90 () at ./asm/asm03_0.s:3377
3377            mov r0, #0
r2             0x203662c           33777196
r0             0xb08040b           185074699
0x2036614:      0x8a    0x09    0x06    0x08    0x00    0x00    0x00    0x00
0x203661c:      0x00    0x00    0x00    0x00

Breakpoint 1, sub_8027E90 () at ./asm/asm03_0.s:3377
3377            mov r0, #0
r2             0x2036638           33777208
r0             0x40b01             264961
0x2036614:      0x8a    0x09    0x06    0x08    0x00    0x00    0x00    0x00
0x203661c:      0x00    0x00    0x00    0x00

Breakpoint 1, sub_8027E90 () at ./asm/asm03_0.s:3377
3377            mov r0, #0
r2             0x2036644           33777220
r0             0x5090a0b           84478475
0x2036614:      0x8a    0x09    0x06    0x08    0x00    0x00    0x00    0x00
0x203661c:      0x00    0x00    0x00    0x00
```

Anyway, these were fetched from here:

```
dword_802A7CC:
	.word 0x10A050A
	.word 0x200060A
	.word 0x301070A
	.word 0x402080A
	.word 0xA03090A
	.word 0x60B000A
	.word 0x705010A
	.word byte_806020A
	.word 0x907030B
	.word 0xB08040B
	.word 0x40B01
	.word 0x5090A0B
```

See that out of place `byte_806020A`? It's a fake positive pointer. Removing `byte_806020A`. There's `loc_8030200+1` which we're also removing close to it.

Now battle no longer crashes, but it lags! And the machine gun tower enemies (`Gunner`) in Central Area 2 don't do anything... Normally if they see you in sight they send a marker to you, and when it reaches you it turns red and they shoot.

2025-12-25 Wk 52 Thu - 17:11 +03:00

lag issue persists even when relocating the shift to 

```
asm21:
	.include "asm/asm21.s"
  .incbin "data/compressed/CompCapcomLogoTilemap_86C3E94.lz77"
  .incbin "data/compressed/CompCapcomLogoTilemap_86C3E94.lz77"
  .incbin "data/compressed/CompCapcomLogoTilemap_86C3E94.lz77"
  .incbin "data/compressed/CompCapcomLogoTilemap_86C3E94.lz77"
  .incbin "data/compressed/CompCapcomLogoTilemap_86C3E94.lz77"
  .incbin "data/compressed/CompCapcomLogoTilemap_86C3E94.lz77"
```

Let's try with shift at

```
dat37:
  .incbin "data/compressed/CompCapcomLogoTilemap_86C3E94.lz77"
  .incbin "data/compressed/CompCapcomLogoTilemap_86C3E94.lz77"
  .incbin "data/compressed/CompCapcomLogoTilemap_86C3E94.lz77"
  .incbin "data/compressed/CompCapcomLogoTilemap_86C3E94.lz77"
  .incbin "data/compressed/CompCapcomLogoTilemap_86C3E94.lz77"
  .incbin "data/compressed/CompCapcomLogoTilemap_86C3E94.lz77"
	.include "data/dat37.s"
```

Here the lag persists *but* the gunner AI functionality works!

Trying to just send a break when I see lag to see if we stop anywhere interesting.

```
x1 ai_eventuallyRunsAIAttack_801AF44
x4 main_awaitFrame
x7 ply_note
x1 sub_814E260
x2 sub_814F3A4
x1 sub_814E528
x1 sub_3005EBA
```

2025-12-25 Wk 52 Thu - 17:52 +03:00

I sprinkled shifts all over `rom.s`. Then when fighting a random battle with `Gunner`, the game froze indefinitely. When I restarted, I found that I can no longer load my save.

You can find the shift pattern here:

Spawn [[002 rom.s shift pattern 6f1973]] ^spawn-entry-6f1973

The code state is

```
6d547b86
harcode byte_806020A and loc_8030200+1 next to it
apply shift pattern 6f1973 to rom.s
```

```diff
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
xxd bn6f.sav > a.diff
xxd ~/src/cloned/gh/dism-exe/bn6f/bn6f.sav > b.diff

diff -u a.diff b.diff

# out
--- a.diff      2025-12-25 17:51:10.404403073 +0300
+++ b.diff      2025-12-25 17:51:35.352644731 +0300
@@ -514,7 +514,7 @@
 00002010: d2d2 d2d2 d2d2 d2d2 d2d2 d2d2 d2d2 d2d2  ................
 00002020: d2d2 d2d2 d2d2 d2d2 d2d2 d2d2 d2d2 d2d2  ................
 00002030: d2d2 d2d2 d2d2 d2d2 d2d2 d2d2 d2d2 d2d2  ................
-00002040: d2d2 d2d2 d2d2 d2d2 52d2 d200 d2d2 d2d2  ........R.......
+00002040: d2d2 d2d2 d2d2 d2d2 52d2 d2d2 d2d2 d2d2  ........R.......
 00002050: d2d2 d2d2 d2d2 d2d2 d2d2 d2d2 d2d2 d2d2  ................
 00002060: d2d2 d2d2 d2d2 d2d2 dad2 dad6 d2d3 d252  ...............R
 00002070: d2d2 d2d2 d2d2 d2d2 d2d2 d2d2 2dd2 d2d2  ............-...
```

2025-12-25 Wk 52 Thu - 17:55 +03:00

```
# On battle with Gunner after selecting chips
Program received signal SIGILL, Illegal instruction.
0x00000004 in ?? ()
(gdb) bt
#0  0x00000004 in ?? ()
```

2025-12-25 Wk 52 Thu - 18:08 +03:00

```

26              mov r0, r10
(gdb)
27              ldr r0, [r0,#oToolkit_CurFramePtr]
(gdb)
28              ldrh r1, [r0]
(gdb)
29              add r1, #1
(gdb)
30              strh r1, [r0]
(gdb)
31        bl CapIncrementGameTimeFrames // () -> void
(gdb)


34              ldr r0, off_8000348 // =main_subsystemJumpTable
(gdb)
35              mov r1, r10
(gdb)
36              ldr r1, [r1,#oToolkit_MainJumptableIndexPtr]
(gdb)
37              ldrb r1, [r1]
(gdb)
38              ldr r0, [r0,r1]
(gdb)
39              mov lr, pc
(gdb)
40              bx r0
(gdb)


Program received signal SIGILL, Illegal instruction.
0x00000004 in ?? ()
(gdb)
Cannot find bounds of current function
(gdb)
```

This is the `bx` at `asm/main.s:40`.

```
# Pause at gunner battle after selecting chips, force break, and enter these:

(gdb) b asm/main.s:40
(gdb) commands

# then type out (line by line)
info reg r0
cont
end 
```

We don't get much info out of this, it's always `0x800586d` (`cbGameState_80050EC`). 

```
// This happens many times
Breakpoint 1, main_ () at ./asm/main.s:40
40              bx r0
r0             0x800586d           134240365

// Then this
Program received signal SIGILL, Illegal instruction.
0x00000004 in ?? ()
```

We can repeat the process for the dispatcher `cbGameState_80050EC`. 

```
# Pause at gunner battle after selecting chips, force break, and enter these:

(gdb) b asm/asm00_1.s:4082
(gdb) commands

# then type out (line by line)
info reg r0
cont
end 
```

It's always at `0x8005ae1` (`sub_8005360`).

```
Breakpoint 1, cbGameState_80050EC () at ./asm/asm00_1.s:4082
4082            bx r0
r0             0x8005ae1           134240993

Program received signal SIGILL, Illegal instruction.
0x00000004 in ?? ()
```

So `sub_8005360` will call the battle main, or otherwise await until we need to `EnterMap`. 

```sh
./replacep.sh "sub_8005360" "HandlesBattleMainUntilEndOfBattleThenTriggersEnterMap"
```

2025-12-25 Wk 52 Thu - 18:30 +03:00

Okay now we know `HandlesBattleMainUntilEndOfBattleThenTriggersEnterMap` is always triggered during battle.

`battle_main_8007800` also has a `bx` at `asm/asm00_1.s:8940`, so let's repeat the process there.

```
# Pause at gunner battle after selecting chips, force break, and enter these:

(gdb) b asm/asm00_1.s:8940
(gdb) commands

# then type out (line by line)
info reg r1
cont
end 
```

Note the issue does not reproduce if you just fight a battle with only metteurs.

In this case `0x80081c5` (`battle_update_8007A44`) is always triggered.

```
Breakpoint 1, battle_main_8007800 () at ./asm/asm00_1.s:8940
8940            bx r1
r1             0x80081c5           134250949

Program received signal SIGILL, Illegal instruction.
0x00000004 in ?? ()
```

`battle_update_8007A44` also has a `bx` at `asm/asm00_1.s:9306`. Repeating process.

```
# Pause at gunner battle after selecting chips, force break, and enter these:

(gdb) b asm/asm00_1.s:9306
(gdb) commands

# then type out (line by line)
info reg r0
cont
end 
```

```
Breakpoint 1, battle_update_8007A44 () at ./asm/asm00_1.s:9306
9306            bx r0
r0             0x80098d9           134256857

Program received signal SIGILL, Illegal instruction.
0x00000004 in ?? ()
```

`0x80098d9` (`sub_8009158`) is always triggered.

This has a `bx r1` at `asm/asm00_1.s:12280`.

```
# Pause at gunner battle after selecting chips, force break, and enter these:

(gdb) b asm/asm00_1.s:12280
(gdb) commands

# then type out (line by line)
info reg r1
cont
end 
```

```
Breakpoint 1, sub_8009158 () at ./asm/asm00_1.s:12280
12280           bx r1
r1             0x8009b0b           134257419

Program received signal SIGILL, Illegal instruction.
0x00000004 in ?? ()
```

`0x8009b0b` $\to$ `sub_800938A` which is always triggered.

It has dispatcher `sub_800801C` with a `bx r1` at `asm/asm00_1.s:9961`

Can also confirm via `sha1sum ~/src/cloned/gh/dism-exe/bn6f/bn6f.sav bn6f.sav` that the save file only changes very close or at the crash point.

```
96181d7c51178c0f6907cbb008488553cdedbf90  /home/lan/src/cloned/gh/dism-exe/bn6f/bn6f.sav
7bfe68683e5c3e3e27f4cb2b0529c5cf0e26f08b  bn6f.sav
```

2025-12-25 Wk 52 Thu - 18:55 +03:00

```
# Pause at gunner battle after selecting chips, force break, and enter these:

(gdb) b asm/asm00_1.s:9961
(gdb) commands

# then type out (line by line)
info reg r1
cont
end 
```

This one changes.

```
// Showing unique instances only

// x4
Breakpoint 1, sub_800801C () at ./asm/asm00_1.s:9961
9961            bx r1
r1             0x8008b8d           134253453

// many
Breakpoint 1, sub_800801C () at ./asm/asm00_1.s:9961
9961            bx r1
r1             0x80087e5           134252517

// x2
Breakpoint 1, sub_800801C () at ./asm/asm00_1.s:9961
9961            bx r1
r1             0x8008853           134252627

Program received signal SIGILL, Illegal instruction.
0x00000004 in ?? ()
```

`0x8008b8d` $\to$ `sub_800840C`, `0x80087e5` $\to$ `sub_8008064`, `0x8008853` $\to$ `sub_80080D2`.

`sub_80080D2` has some logic for pausing and unpausing battle.

Now that we know that it's from the second trigger of `sub_80080D2`, let's try to spam `s` after the second break of it, once we're in a battle with a gunner and selected chips. 

First trigger is right after `BATTLE START!`, 

Now we just spam `s` to step till we crash:

```
object_getPanelDataOffset () at ./asm/object.s:2151
2151            pop {pc}
(gdb)
sub_801A186 () at ./asm/asm00_2.s:21440
21440           tst r0, r0
(gdb)
21441           beq locret_801A1FA
(gdb)
21442           ldrb r0, [r0,#oPanelData_Type]
(gdb)
21443           cmp r0, #4
(gdb)
21444           bne loc_801A1CE
(gdb)
21461           mov r1, #0
(gdb)
21462           strb r1, [r7,#oCollisionData_PoisonPanelTimer]
(gdb)
21463           cmp r0, #6
(gdb)
21464           bne locret_801A1FA
(gdb)
^M
Program received signal SIGILL, Illegal instruction.
0x00000004 in ?? ()
```

And it seems to happen at `sub_801A186`, but nowhere there seems to indicate we should crash.

It's also reproducible (`N=2`). 

The functions encountered in the `s` mash (reversed, last first):

These are the functions encountered as we mashed `s` from `sub_80080D2` breakpoint 2nd trigger:

```
sub_8012DFC () at ./asm/asm00_2.s:8899
sub_8010022 () at ./asm/asm00_2.s:2631
battle_findPlayer () at ./asm/asm00_2.s:3128
sub_800F29C () at ./asm/asm00_2.s:711
sub_80182B4 () at ./asm/asm00_2.s:19796
sub_800F29C () at ./asm/asm00_2.s:713
battle_findPlayer () at ./asm/asm00_2.s:3142
sub_8010022 () at ./asm/asm00_2.s:2633
sub_8012DFC () at ./asm/asm00_2.s:8902
battle_isBattleOver () at ./asm/asm00_1.s:14539
sub_8012DFC () at ./asm/asm00_2.s:8904
GetBattleNaviStatsByte () at ./asm/asm00_2.s:10137
GetBattleNaviStatsAddr () at ./asm/asm00_2.s:10082
GetBattleNaviStatsByte () at ./asm/asm00_2.s:10140
sub_8012DFC () at ./asm/asm00_2.s:8909
battle_isTimeStop () at ./asm/asm00_1.s:14377
battle_getFlags () at ./asm/asm00_1.s:14746
battle_isTimeStop () at ./asm/asm00_1.s:14379
sub_8012DFC () at ./asm/asm00_2.s:8930
sub_80080D2 () at ./asm/asm00_1.s:10044
sub_8012DFC () at ./asm/asm00_2.s:8899
sub_8010022 () at ./asm/asm00_2.s:2631
battle_findPlayer () at ./asm/asm00_2.s:3128
sub_800F29C () at ./asm/asm00_2.s:711
sub_80182B4 () at ./asm/asm00_2.s:19796
sub_800F29C () at ./asm/asm00_2.s:713
battle_findPlayer () at ./asm/asm00_2.s:3142
sub_800F29C () at ./asm/asm00_2.s:711
sub_80182B4 () at ./asm/asm00_2.s:19796
sub_800F29C () at ./asm/asm00_2.s:713
battle_findPlayer () at ./asm/asm00_2.s:3142
sub_800F29C () at ./asm/asm00_2.s:711
sub_80182B4 () at ./asm/asm00_2.s:19796
sub_800F29C () at ./asm/asm00_2.s:713
battle_findPlayer () at ./asm/asm00_2.s:3142
sub_800F29C () at ./asm/asm00_2.s:711
sub_80182B4 () at ./asm/asm00_2.s:19796
sub_800F29C () at ./asm/asm00_2.s:713
battle_findPlayer () at ./asm/asm00_2.s:3142
sub_8010022 () at ./asm/asm00_2.s:2633
sub_8012DFC () at ./asm/asm00_2.s:8902
battle_isBattleOver () at ./asm/asm00_1.s:14539
sub_8012DFC () at ./asm/asm00_2.s:8904
GetBattleNaviStatsByte () at ./asm/asm00_2.s:10137
GetBattleNaviStatsAddr () at ./asm/asm00_2.s:10082
GetBattleNaviStatsByte () at ./asm/asm00_2.s:10140
sub_8012DFC () at ./asm/asm00_2.s:8909
battle_isTimeStop () at ./asm/asm00_1.s:14377
battle_getFlags () at ./asm/asm00_1.s:14746
battle_isTimeStop () at ./asm/asm00_1.s:14379
sub_8012DFC () at ./asm/asm00_2.s:8930
sub_80080D2 () at ./asm/asm00_1.s:10046
UnpauseBattle () at ./asm/asm00_1.s:14308
sub_80080D2 () at ./asm/asm00_1.s:10047
battle_setFlags () at ./asm/asm00_1.s:14724
sub_80080D2 () at ./asm/asm00_1.s:10049
sub_800AE0C () at ./asm/asm00_1.s:16451
sub_80080D2 () at ./asm/asm00_1.s:10050
sub_800A6A6 () at ./asm/asm00_1.s:15282
battle_isTimeStop () at ./asm/asm00_1.s:14377
battle_getFlags () at ./asm/asm00_1.s:14746
battle_isTimeStop () at ./asm/asm00_1.s:14379
sub_800A6A6 () at ./asm/asm00_1.s:15284
battle_isPaused () at ./asm/asm00_1.s:14317
sub_800A6A6 () at ./asm/asm00_1.s:15286
battle_isBattleOver () at ./asm/asm00_1.s:14539
sub_800A6A6 () at ./asm/asm00_1.s:15288
battle_getFlags () at ./asm/asm00_1.s:14746
sub_800A6A6 () at ./asm/asm00_1.s:15290
sub_80080D2 () at ./asm/asm00_1.s:10051
sub_800A97A () at ./asm/asm00_1.s:15756
GetBattleEffects () at ./asm/asm03_0.s:14225
GetBattleEffectsFromBattleSettings () at ./asm/asm03_0.s:14236
GetBattleEffects () at ./asm/asm03_0.s:14230
sub_800A97A () at ./asm/asm00_1.s:15758
sub_80080D2 () at ./asm/asm00_1.s:10052
sub_800A152 () at ./asm/asm00_1.s:14502
battle_isTimeStop () at ./asm/asm00_1.s:14377
battle_getFlags () at ./asm/asm00_1.s:14746
battle_isTimeStop () at ./asm/asm00_1.s:14379
sub_800A152 () at ./asm/asm00_1.s:14504
sub_80080D2 () at ./asm/asm00_1.s:10057
sub_800A046 () at ./asm/asm00_1.s:14326
battle_isBattleOver () at ./asm/asm00_1.s:14539
sub_800A046 () at ./asm/asm00_1.s:14328
battle_isTimeStop () at ./asm/asm00_1.s:14377
battle_getFlags () at ./asm/asm00_1.s:14746
battle_isTimeStop () at ./asm/asm00_1.s:14379
sub_800A046 () at ./asm/asm00_1.s:14333
sub_80080D2 () at ./asm/asm00_1.s:10092
sub_800A8F8 () at ./asm/asm00_1.s:15675
TestBattleFlag_0x40 () at ./asm/asm03_0.s:16046
battle_getFlags () at ./asm/asm00_1.s:14746
TestBattleFlag_0x40 () at ./asm/asm03_0.s:16048
sub_800A8F8 () at ./asm/asm00_1.s:15678
sub_80080D2 () at ./asm/asm00_1.s:10102
sub_800A1D0 () at ./asm/asm00_1.s:14580
battle_isTimeStop () at ./asm/asm00_1.s:14377
battle_getFlags () at ./asm/asm00_1.s:14746
battle_isTimeStop () at ./asm/asm00_1.s:14379
sub_800A1D0 () at ./asm/asm00_1.s:14582
battle_isBattleOver () at ./asm/asm00_1.s:14539
sub_800A1D0 () at ./asm/asm00_1.s:14584
GetBattleNaviStatsByte () at ./asm/asm00_2.s:10137
GetBattleNaviStatsAddr () at ./asm/asm00_2.s:10082
GetBattleNaviStatsByte () at ./asm/asm00_2.s:10140
sub_800A1D0 () at ./asm/asm00_1.s:14589
GetBattleNaviStatsByte () at ./asm/asm00_2.s:10137
GetBattleNaviStatsAddr () at ./asm/asm00_2.s:10082
GetBattleNaviStatsByte () at ./asm/asm00_2.s:10140
sub_800A1D0 () at ./asm/asm00_1.s:14596
battle_getFlags () at ./asm/asm00_1.s:14746
sub_800A1D0 () at ./asm/asm00_1.s:14607
sub_80080D2 () at ./asm/asm00_1.s:10105
sub_800801C () at ./asm/asm00_1.s:9962
sub_802DE5C () at ./asm/asm03_0.s:15718
TestBattleFlag_0x40 () at ./asm/asm03_0.s:16046
battle_getFlags () at ./asm/asm00_1.s:14746
TestBattleFlag_0x40 () at ./asm/asm03_0.s:16048
sub_802DE5C () at ./asm/asm03_0.s:15720
sub_800801C () at ./asm/asm00_1.s:9963
sub_800938A () at ./asm/asm00_1.s:12580
someChipHandValidationHappensHere_800B090 () at ./asm/asm00_1.s:16823
TestBattleFlag_0x40 () at ./asm/asm03_0.s:16046
battle_getFlags () at ./asm/asm00_1.s:14746
TestBattleFlag_0x40 () at ./asm/asm03_0.s:16048
someChipHandValidationHappensHere_800B090 () at ./asm/asm00_1.s:16828
getBattleHandAddr_8010018 () at ./asm/asm00_2.s:2622
someChipHandValidationHappensHere_800B090 () at ./asm/asm00_1.s:16834
someChipHandValidationHappensHere_800B090 () at ./asm/asm00_1.s:16876
sub_800938A () at ./asm/asm00_1.s:12581
sub_8009158 () at ./asm/asm00_1.s:12281
GetBattleEffects () at ./asm/asm03_0.s:14225
GetBattleEffectsFromBattleSettings () at ./asm/asm03_0.s:14236
GetBattleEffects () at ./asm/asm03_0.s:14230
sub_8009158 () at ./asm/asm00_1.s:12282
battle_update_8007A44 () at ./asm/asm00_1.s:9307
RunBattleObjectLogic () at ./asm/asm00_1.s:69
object_Clear3RAMBytes_800371A () at ./asm/asm00_1.s:923
RunBattleObjectLogic () at ./asm/asm00_1.s:72
battle_isTimeStop () at ./asm/asm00_1.s:14377
battle_getFlags () at ./asm/asm00_1.s:14746
battle_isTimeStop () at ./asm/asm00_1.s:14379
RunBattleObjectLogic () at ./asm/asm00_1.s:95
RunBattleObjectLogic () at ./asm/asm00_1.s:110
t1_0x0_80B81EC () at ./asm/asm31.s:5
playerObject_main_80EA460 () at ./asm/asm31.s:107031
playerObject_update_80EA484 () at ./asm/asm31.s:107050
sub_8012E74 () at ./asm/asm00_2.s:8964
battle_isBattleOver () at ./asm/asm00_1.s:14539
sub_8012E74 () at ./asm/asm00_2.s:8967
battle_isPaused () at ./asm/asm00_1.s:14317
sub_8012E74 () at ./asm/asm00_2.s:8970
sub_8012EA0 () at ./asm/asm00_2.s:8987
pwrAtkRelated_readsFromJoypad_8012FC8 () at ./asm/asm00_2.s:9166
GetAIData_Unk_44_Flag () at ./asm/asm00_2.s:2601
pwrAtkRelated_readsFromJoypad_8012FC8 () at ./asm/asm00_2.s:9169
battle_isTimeStop () at ./asm/asm00_1.s:14377
battle_getFlags () at ./asm/asm00_1.s:14746
battle_isTimeStop () at ./asm/asm00_1.s:14379
pwrAtkRelated_readsFromJoypad_8012FC8 () at ./asm/asm00_2.s:9171
sub_800A8F8 () at ./asm/asm00_1.s:15675
TestBattleFlag_0x40 () at ./asm/asm03_0.s:16046
battle_getFlags () at ./asm/asm00_1.s:14746
TestBattleFlag_0x40 () at ./asm/asm03_0.s:16048
sub_800A8F8 () at ./asm/asm00_1.s:15678
pwrAtkRelated_readsFromJoypad_8012FC8 () at ./asm/asm00_2.s:9198
GetBattleMode () at ./asm/asm03_0.s:14208
GetBattleModeFromBattleSettings () at ./asm/asm03_0.s:14218
GetBattleMode () at ./asm/asm03_0.s:14213
pwrAtkRelated_readsFromJoypad_8012FC8 () at ./asm/asm00_2.s:9225
GetAIDataUnk0x48Flag () at ./asm/asm00_2.s:3050
pwrAtkRelated_readsFromJoypad_8012FC8 () at ./asm/asm00_2.s:9229
battle_getFlags () at ./asm/asm00_1.s:14746
pwrAtkRelated_readsFromJoypad_8012FC8 () at ./asm/asm00_2.s:9233
GetAIData_Unk_44_Flag () at ./asm/asm00_2.s:2601
pwrAtkRelated_readsFromJoypad_8012FC8 () at ./asm/asm00_2.s:9265
sub_801336C () at ./asm/asm00_2.s:9649
pwrAtkRelated_readsFromJoypad_8012FC8 () at ./asm/asm00_2.s:9269
sub_8013396 () at ./asm/asm00_2.s:9673
returnBoolIfAIDataFlagsAreSet_8012F3E () at ./asm/asm00_2.s:9080
GetAIData_Unk_44_Flag () at ./asm/asm00_2.s:2601
returnBoolIfAIDataFlagsAreSet_8012F3E () at ./asm/asm00_2.s:9083
GetAIDataUnk0x48Flag () at ./asm/asm00_2.s:3050
returnBoolIfAIDataFlagsAreSet_8012F3E () at ./asm/asm00_2.s:9087
sub_8013396 () at ./asm/asm00_2.s:9679
pwrAtkRelated_readsFromJoypad_8012FC8 () at ./asm/asm00_2.s:9278
GetBattleMode () at ./asm/asm03_0.s:14208
GetBattleModeFromBattleSettings () at ./asm/asm03_0.s:14218
GetBattleMode () at ./asm/asm03_0.s:14213
pwrAtkRelated_readsFromJoypad_8012FC8 () at ./asm/asm00_2.s:9423
sub_800A772 () at ./asm/asm00_1.s:15418
sub_800A772 () at ./asm/asm00_1.s:15424
sub_800A772 () at ./asm/asm00_1.s:15426
sub_800139A () at ./asm/asm00_0.s:2345
sub_800A772 () at ./asm/asm00_1.s:15427
sub_800A772 () at ./asm/asm00_1.s:15432
pwrAtkRelated_readsFromJoypad_8012FC8 () at ./asm/asm00_2.s:9434
getCurChipInBattleHand_8010004 () at ./asm/asm00_2.s:2608
getBattleHandAddr_8010018 () at ./asm/asm00_2.s:2622
getCurChipInBattleHand_8010004 () at ./asm/asm00_2.s:2612
pwrAtkRelated_readsFromJoypad_8012FC8 () at ./asm/asm00_2.s:9440
sub_8012EA0 () at ./asm/asm00_2.s:8989
sub_8012E74 () at ./asm/asm00_2.s:8972
sub_8012EBC () at ./asm/asm00_2.s:9007
battle_isTimeStop () at ./asm/asm00_1.s:14377
battle_getFlags () at ./asm/asm00_1.s:14746
battle_isTimeStop () at ./asm/asm00_1.s:14379
sub_8012EBC () at ./asm/asm00_2.s:9010
returnBoolIfAIDataFlagsAreSet_8012F3E () at ./asm/asm00_2.s:9080
GetAIData_Unk_44_Flag () at ./asm/asm00_2.s:2601
returnBoolIfAIDataFlagsAreSet_8012F3E () at ./asm/asm00_2.s:9083
GetAIDataUnk0x48Flag () at ./asm/asm00_2.s:3050
returnBoolIfAIDataFlagsAreSet_8012F3E () at ./asm/asm00_2.s:9087
sub_8012EBC () at ./asm/asm00_2.s:9012
sub_8012E74 () at ./asm/asm00_2.s:8974
playerObject_update_80EA484 () at ./asm/asm31.s:107052
sub_8013DA0 () at ./asm/asm00_2.s:11127
battle_isPaused () at ./asm/asm00_1.s:14317
sub_8013DA0 () at ./asm/asm00_2.s:11130
GetBattleNaviStatsByte_AllianceFromBattleObject () at ./asm/asm00_2.s:10265
GetBattleNaviStatsAddr () at ./asm/asm00_2.s:10082
GetBattleNaviStatsByte_AllianceFromBattleObject () at ./asm/asm00_2.s:10269
sub_8013DA0 () at ./asm/asm00_2.s:11133
sub_8013DA0 () at ./asm/asm00_2.s:11198
playerObject_update_80EA484 () at ./asm/asm31.s:107053
sub_801AC6C () at ./asm/asm00_2.s:22888
sprite_clearFinalPalette () at ./asm/sprite.s:1169
sub_801AC6C () at ./asm/asm00_2.s:22890
battle_getFlags () at ./asm/asm00_1.s:14746
sub_801AC6C () at ./asm/asm00_2.s:22892
object_removeCollisionData () at ./asm/asm00_2.s:21173
_object_removeCollisionData () at ./asm/asm38.s:3649
object_getFlipDirection () at ./asm/object.s:4649
_object_removeCollisionData () at ./asm/asm38.s:3664
object_isValidPanel () at ./asm/object.s:2654
_object_removeCollisionData () at ./asm/asm38.s:3683
sub_3007880 () at ./asm/asm38.s:4103
_object_removeCollisionData () at ./asm/asm38.s:3687
_object_updatePanelParameters () at ./asm/asm38.s:4160
_object_getPanelDataOffset () at ./asm/asm38.s:4208
_object_updatePanelParameters () at ./asm/asm38.s:4164
sub_3007978 () at ./asm/asm38.s:4233
_object_updatePanelParameters () at ./asm/asm38.s:4188
_object_removeCollisionData () at ./asm/asm38.s:3690
sub_30075FC () at ./asm/asm38.s:3738
battle_isPaused () at ./asm/asm00_1.s:14317
sub_30075FC () at ./asm/asm38.s:3743
sub_30075FC () at ./asm/asm38.s:3744
_object_removeCollisionData () at ./asm/asm38.s:3694
sub_3007708 () at ./asm/asm38.s:3895
battle_isPaused () at ./asm/asm00_1.s:14317
sub_3007708 () at ./asm/asm38.s:3900
sub_3007708 () at ./asm/asm38.s:3902
_object_getPanelDataOffset () at ./asm/asm38.s:4208
sub_3007708 () at ./asm/asm38.s:3907
_object_removeCollisionData () at ./asm/asm38.s:3699
_object_removeCollisionData () at ./asm/asm38.s:3731
object_removeCollisionData () at ./asm/asm00_2.s:21177
sub_801AC6C () at ./asm/asm00_2.s:22896
battle_isBattleOver () at ./asm/asm00_1.s:14539
sub_801AC6C () at ./asm/asm00_2.s:22897
object_getFlag () at ./asm/asm00_2.s:21396
sub_801AC6C () at ./asm/asm00_2.s:22900
sub_801A802 () at ./asm/asm00_2.s:22387
battle_isPaused () at ./asm/asm00_1.s:14317
sub_801A802 () at ./asm/asm00_2.s:22389
sub_801AC6C () at ./asm/asm00_2.s:22905
sub_801A186 () at ./asm/asm00_2.s:21428
battle_isTimeStop () at ./asm/asm00_1.s:14377
battle_getFlags () at ./asm/asm00_1.s:14746
battle_isTimeStop () at ./asm/asm00_1.s:14379
sub_801A186 () at ./asm/asm00_2.s:21430
battle_isPaused () at ./asm/asm00_1.s:14317
sub_801A186 () at ./asm/asm00_2.s:21432
object_getPanelDataOffset () at ./asm/object.s:2147
_object_getPanelDataOffset () at ./asm/asm38.s:4208
object_getPanelDataOffset () at ./asm/object.s:2151
sub_801A186 () at ./asm/asm00_2.s:21440
battle_isTimeStop () at ./asm/asm00_1.s:14377
battle_getFlags () at ./asm/asm00_1.s:14746
battle_isTimeStop () at ./asm/asm00_1.s:14379
sub_801A186 () at ./asm/asm00_2.s:21430
battle_isPaused () at ./asm/asm00_1.s:14317
sub_801A186 () at ./asm/asm00_2.s:21432

object_getPanelDataOffset
_object_getPanelDataOffset
object_getPanelDataOffset
sub_801A186
```

Somewhere here, the issue happened. We can see `sub_801A186` is called 7 times before the crash happens.

Sometimes it crashes after 6 times, sometimes 5 times.

```
Breakpoint 1, sub_801A186 () at ./asm/asm00_2.s:21428
battle_isTimeStop () at ./asm/asm00_1.s:14377
battle_getFlags () at ./asm/asm00_1.s:14746
battle_isTimeStop () at ./asm/asm00_1.s:14379
sub_801A186 () at ./asm/asm00_2.s:21430
battle_isPaused () at ./asm/asm00_1.s:14317
sub_801A186 () at ./asm/asm00_2.s:21432
object_getPanelDataOffset () at ./asm/object.s:2147
_object_getPanelDataOffset () at ./asm/asm38.s:4208
object_getPanelDataOffset () at ./asm/object.s:2151
sub_801A186 () at ./asm/asm00_2.s:21440
Breakpoint 1, sub_801A186 () at ./asm/asm00_2.s:21428
battle_isTimeStop () at ./asm/asm00_1.s:14377
battle_getFlags () at ./asm/asm00_1.s:14746
battle_isTimeStop () at ./asm/asm00_1.s:14379
sub_801A186 () at ./asm/asm00_2.s:21430
battle_isPaused () at ./asm/asm00_1.s:14317
sub_801A186 () at ./asm/asm00_2.s:21432
object_getPanelDataOffset () at ./asm/object.s:2147
_object_getPanelDataOffset () at ./asm/asm38.s:4208
object_getPanelDataOffset () at ./asm/object.s:2151
sub_801A186 () at ./asm/asm00_2.s:21440
Breakpoint 1, sub_801A186 () at ./asm/asm00_2.s:21428
battle_isTimeStop () at ./asm/asm00_1.s:14377
battle_getFlags () at ./asm/asm00_1.s:14746
battle_isTimeStop () at ./asm/asm00_1.s:14379
sub_801A186 () at ./asm/asm00_2.s:21430
battle_isPaused () at ./asm/asm00_1.s:14317
sub_801A186 () at ./asm/asm00_2.s:21432
object_getPanelDataOffset () at ./asm/object.s:2147
_object_getPanelDataOffset () at ./asm/asm38.s:4208
object_getPanelDataOffset () at ./asm/object.s:2151
sub_801A186 () at ./asm/asm00_2.s:21440
Breakpoint 1, sub_801A186 () at ./asm/asm00_2.s:21428
battle_isTimeStop () at ./asm/asm00_1.s:14377
battle_getFlags () at ./asm/asm00_1.s:14746
battle_isTimeStop () at ./asm/asm00_1.s:14379
sub_801A186 () at ./asm/asm00_2.s:21430
battle_isPaused () at ./asm/asm00_1.s:14317
sub_801A186 () at ./asm/asm00_2.s:21432
object_getPanelDataOffset () at ./asm/object.s:2147
_object_getPanelDataOffset () at ./asm/asm38.s:4208
object_getPanelDataOffset () at ./asm/object.s:2151
sub_801A186 () at ./asm/asm00_2.s:21440
Breakpoint 1, sub_801A186 () at ./asm/asm00_2.s:21428
battle_isTimeStop () at ./asm/asm00_1.s:14377
battle_getFlags () at ./asm/asm00_1.s:14746
battle_isTimeStop () at ./asm/asm00_1.s:14379
sub_801A186 () at ./asm/asm00_2.s:21430
battle_isPaused () at ./asm/asm00_1.s:14317
sub_801A186 () at ./asm/asm00_2.s:21432
object_getPanelDataOffset () at ./asm/object.s:2147
_object_getPanelDataOffset () at ./asm/asm38.s:4208
object_getPanelDataOffset () at ./asm/object.s:2151
sub_801A186 () at ./asm/asm00_2.s:21440

```

one consistent thing is that it seems to always crash here:

```
	strb r1, [r7,#oCollisionData_PoisonPanelTimer]
	cmp r0, #6
	bne locret_801A1FA
```

This bne is at `asm/asm00_2.s:21464` Let's break there and examine some data.

```
# Pause at gunner battle after selecting chips, force break, and enter these:

(gdb) b asm/asm00_2.s:21464
(gdb) commands

# then type out (line by line)
info reg r0 r1 r7
cont
end 
```

```
// always
r0             0x2                 2
r1             0x0                 0

// changing (N=1)
r7             0x20384f0           33785072
r7             0x2038598           33785240
r7             0x2038640           33785408
r7             0x20386e8           33785576
r7             0x20384f0           33785072
r7             0x2038598           33785240

// changing (N=2)
r7             0x20384f0           33785072
r7             0x2038598           33785240
r7             0x2038640           33785408
r7             0x20386e8           33785576
r7             0x20384f0           33785072
r7             0x2038598           33785240

// changing (N=3)
r7             0x20384f0           33785072
r7             0x2038598           33785240
r7             0x2038640           33785408
r7             0x20384f0           33785072
r7             0x2038598           33785240
r7             0x2038640           33785408

```

2025-12-25 Wk 52 Thu - 20:02 +03:00

What if we try to disable `sub_801A186`? We reproduce the problem even when `sub_801A186` is disabled!

So now when you mash `S`, you find yourself in `sub_801A36A`. 

This issue is happening at a different thread or by hardware it seems.

We have some investigations into the save datasystem, though still incomplete. [[000 Exploring bn6f save data]]

There are ISRs at `off_3005CA0`, specifically `sub_3005CDA`  has a `bx r0` at `asm/asm38.s:148`. Let's see what this triggers.

```
# Pause at gunner battle after selecting chips, force break, and enter these:

(gdb) b asm/asm38.s:148
(gdb) commands

# then type out (line by line)
info reg r0
cont
end 
```

```
Breakpoint 1, sub_3005CDA () at ./asm/asm38.s:148
148             bx r0
r0             0x803e5f3           134473203

Program received signal SIGILL, Illegal instruction.
0x00000004 in ?? ()
```

Always `0x803e5f3` (`sub_803DE72`). 

This leads us to `sub_81445F8`. 

It has a `bx r0` at `asm/libs.s:793`

```
# Pause at gunner battle after selecting chips, force break, and enter these:

(gdb) b asm/libs.s:793
(gdb) commands

# then type out (line by line)
info reg r0
cont
end 
```

```
Breakpoint 1, sub_81445F8 () at ./asm/libs.s:793
793             bx r0
r0             0x803e601           134473217

Program received signal SIGILL, Illegal instruction.
0x00000004 in ?? ()
```

Always `0x803e601` (`locret_803DE80`). It does nothing.

Let's try to s mash from `sub_81445F8` after encountering the gunner and selecting chips.

```
loc_3005C6C () at ./asm/asm38.s:106
106             ldmfd sp!, {r0-r3,lr}
(gdb)
loc_3005C6C () at ./asm/asm38.s:107
107             strh r2, [r3]
(gdb)
108             strh r1, [r3,#8]
(gdb)
109             msr SPSR_cf, r0
(gdb)
110             bx lr
(gdb)
0x00000194 in ?? ()
```

It breaks here, but this crash seems to be because we're staying in the ISR too long, it's before the crash we're interested in, and the save was not corrupted yet.

We know also that `sub_3005D24` is always being called which is responsible for some DMA. 

it also does a `CopyWords` indirectly at `asm/asm38.s:211`. We can examine the parameters.

```
# Pause at gunner battle after selecting chips, force break, and enter these:

(gdb) b asm/asm38.s:211
(gdb) commands

# then type out (line by line)
info reg r0 r1 r2
cont
end 
```

Well seems we never get to that part.

Let's try `asm/asm38.s:190` which is right before a write to `DMA0SourceAddress`. 

```
# Pause at gunner battle after selecting chips, force break, and enter these:

(gdb) b asm/asm38.s:190
(gdb) commands

# then type out (line by line)
info reg r0 r1 r2
cont
end 
```

That also is never reached.

2025-12-25 Wk 52 Thu - 20:51 +03:00

Hmm.

```
	.equ DMA0SourceAddress, 0x40000B0
	.equ DMA0DestinationAddress, 0x40000B4
	.equ DMA1SourceAddress, 0x40000BC
	.equ DMA1DestinationAddress, 0x40000C0
	.equ DMA2SourceAddress, 0x40000C8
	.equ DMA2DestinationAddress, 0x40000CC
	.equ DMA3SourceAddress, 0x40000D4
	.equ DMA3DestinationAddress, 0x40000D8
	
	.equ DMA1Control, 0x40000C6
	.equ DMA2Control, 0x40000D2
```

Let's try to watch on some of these for writes.

```
watch *0x40000B0
watch *0x40000B4
watch *0x40000BC
watch *0x40000C0
watch *0x40000C8
watch *0x40000CC
watch *0x40000D4
watch *0x40000D8
```

Some trigger in the beginning of the game:

```
sub_814ECC8 () at ./asm/libs.s:22749
sub_814ECC8 () at ./asm/libs.s:22752
sub_814ECC8 () at ./asm/libs.s:22757
sub_814ECC8 () at ./asm/libs.s:22760
STWI_init_all () at ./asm/libs.s:17421
```

But none trigger around crash and save corruption time.

2025-12-25 Wk 52 Thu - 21:08 +03:00

Breaking at `sub_801A186` gets us right to the point where `BATTLE START` is fading, just before the crash.

Now we can find out how many times `sub_3005CDA` triggers from this point.

```
x1 sub_801A186 breakpoint is triggered: 6 times
x2 sub_3005CDA breakpoint is triggered: 1 times
x1 sub_803DE72 breakpoint is triggered: 1 times
```

I still can't step through `sub_3005CDA` without running into another crash that's unrelated to the sav corrupting one.

2025-12-26 Wk 52 Fri - 00:26 +03:00

If we disable `sub_80080D2`, then we don't crash, but we also can't move in the battle, and the gunners don't do anything, and the custom gauge doesn't fill, but the background keeps moving with lag.

If we disable `UnpauseBattle` in `sub_80080D2` we also don't crash. But this seems to disguise the other logic that does lead to the crash by disabling it.

2025-12-26 Wk 52 Fri - 00:55 +03:00

If we set `sub_80080D2` to just `UnpauseBattle` and then return, the save corrupting crash still happens. It also seems this makes metteur attacks pass through us without damaging us.

2025-12-26 Wk 52 Fri - 12:52 +03:00

We got mgba sort of working in [[000 Investigate mgba sav file format loading]], although there's still a bit of an issue with jagged up/down controls.

Spawn [[006 Attempt to modify mgba to get information on save corruption gunner issue]] ^spawn-invst-cd3046

2025-12-26 Wk 52 Fri - 13:16 +03:00

Also note that if you wait too long in the logo screen with sound, it starts screeching. The music playing gets weird too.

