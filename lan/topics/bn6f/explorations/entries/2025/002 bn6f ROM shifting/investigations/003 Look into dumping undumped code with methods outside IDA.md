---
parent: "[[002 bn6f ROM shifting]]"
spawned_by: "[[001 Investigate jacking in causing crash due to jump to invalid address]]"
context_type: investigation
status: todo
---

Parent: [[002 bn6f ROM shifting]]

Spawned by: [[001 Investigate jacking in causing crash due to jump to invalid address]]

Spawned in: [[001 Investigate jacking in causing crash due to jump to invalid address#^spawn-invst-85604d|^spawn-invst-85604d]]

# 1 Journal

2025-12-18 Wk 51 Thu - 15:04 +03:00

[[005 Reminders noted during bn6f CentralArea Map Exploration#^undumped-code-list-1]] has a list we've been accumulating of undumped code. We need to dump these as they affect shifting.

We can test with `undumped_code_8061B6C` whose end lies in `undumped_code_8060B84`. 

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
dd skip=$(python3 -c "print(0x61B6C)") count=$(python3 -c "print(0x8061B84 - 0x8061B6C)") if=bn6f.gba of=a.bin bs=1
```

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
xxd a.bin

# out
00000000: f0b5 5746 3f69 0520 0004 7867 0120 c003  ..WF?i. ..xg. ..
00000010: b867 3df0 c1fe f0bd                      .g=.....
```

This [stackoverflow post](https://stackoverflow.com/a/14573973/6944447) shows how to disassemble a binary in ARM, so we can do:

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
arm-none-eabi-objdump -D -bbinary -marm a.bin

# out
a.bin:     file format binary


Disassembly of section .data:

00000000 <.data>:
   0:   4657b5f0                        ; <UNDEFINED> instruction: 0x4657b5f0
   4:   2005693f        andcs   r6, r5, pc, lsr r9
   8:   67780400        ldrbvs  r0, [r8, -r0, lsl #8]!
   c:   03c02001        biceq   r2, r0, #1
  10:   f03d67b8                        ; <UNDEFINED> instruction: 0xf03d67b8
  14:   bdf0fec1        ldcllt  14, cr15, [r0, #772]!   ; 0x304
```

But we do not want to do this in ARM, but in THUMB ISA.

```sh
arm-none-eabi-objdump --help | less

# out (relevant)
  -b, --target=BFDNAME           Specify the target object format as BFDNAME
  -m, --architecture=MACHINE     Specify the target architecture as MACHINE
```

In This [stackexchange post](https://reverseengineering.stackexchange.com/questions/31412/armv7-disassemble-thumb-instructions-from-raw-binary-snippet), the author specifies `-marmv7`. There is also suggestion to use capstone over python.

This works:

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
arm-none-eabi-objdump -D -bbinary -marmv7 -Mforce-thumb a.bin

a.bin:     file format binary


Disassembly of section .data:

00000000 <.data>:
   0:   b5f0            push    {r4, r5, r6, r7, lr}
   2:   4657            mov     r7, sl
   4:   693f            ldr     r7, [r7, #16]
   6:   2005            movs    r0, #5
   8:   0400            lsls    r0, r0, #16
   a:   6778            str     r0, [r7, #116]  ; 0x74
   c:   2001            movs    r0, #1
   e:   03c0            lsls    r0, r0, #15
  10:   67b8            str     r0, [r7, #120]  ; 0x78
  12:   f03d fec1       bl      0x3dd98
  16:   bdf0            pop     {r4, r5, r6, r7, pc}
```

2025-12-18 Wk 51 Thu - 15:49 +03:00

There is the description of the `bl` instruction in section 4.4 Branch and Branch with Link in [ARM7TDMI docs](https://www.dwedit.org/files/ARM7TDMI.pdf).

Let's experiment with a `bl` we know to see how the math works.

Take this function for instance:

```
 thumb_local_start
  sub_8034CB6:
  
  
    push {r4-r7,lr}
    bl IsNotSlipRunningAndNotInCutscene
	// ...
```

```
08034c9c l 0000001a IsNotSlipRunningAndNotInCutscene
```

```sh
dd skip=$(python3 -c "print(0x34CB6)") count=$(python3 -c "print(6)") if=bn6f.gba of=a.bin bs=1
arm-none-eabi-objdump -D -bbinary -marmv7 -Mforce-thumb a.bin

# out (relevant)
   0:   b5f0            push    {r4, r5, r6, r7, lr}
   2:   f7ff fff0       bl      0xffffffe6
```

`0xffffffe6` is a signed i32. 

```
python3 -c "print(hex(0x100000000 - 0xffffffe6))" # 0x1a
```

```
python3 -c "print(hex(0x08034c9c - 0x8034CB6))" # -0x1a
```

(update)
So our working hypothesis is this: ~~Pick the ea of the instruction just before the `bl`, add to it the signed 32-bit offset of the `bl`, and this is the ea of the destination of that `bl`.~~

2025-12-19 Wk 51 Fri - 09:32 +03:00

This value changes based on where you dump from

(/update)

```
python3 -c "print(hex(0x8034CB6 + -0x1a))" # 0x8034c9c
```

So for

```
  10:   67b8            str     r0, [r7, #120]  ; 0x78
  12:   f03d fec1       bl      0x3dd98
```

This bl would refer to 

```
python3 -c "print(hex(0x861B6C + 10 + 0x3dd98))" # 0x89f90e
```

but `.fill` is at

```
087fe36c l 00000000 .fill
```

2025-12-18 Wk 51 Thu - 16:08 +03:00

```
	thumb_local_start
undumped_code_8061B6C::
	push    {r4, r5, r6, r7, lr}
	mov     r7, sl
	ldr     r7, [r7, #16]
	movs    r0, #5
	lsls    r0, r0, #16
	str     r0, [r7, #116]  ; 0x74
	movs    r0, #1
	lsls    r0, r0, #15
	str     r0, [r7, #120]  ; 0x78
	bl      0x3dd98
	pop     {r4, r5, r6, r7, pc}
	thumb_func_end undumped_code_8061B6C
```

There's still a couple of problems with this and it won't compile as is.

The `lsls` instructions, the `sl` in `mov`...

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
dd skip=$(python3 -c "print(0x61B6C)") count=$(python3 -c "print(0x8061B84 - 0x8061B6C)") if=bn6f.gba of=a.bin bs=1
arm-none-eabi-objdump -D -bbinary -marm7tdmi -Mforce-thumb a.bin

# out (relevant)
   0:   b5f0            push    {r4, r5, r6, r7, lr}
   2:   4657            mov     r7, sl
   4:   693f            ldr     r7, [r7, #16]
   6:   2005            movs    r0, #5
   8:   0400            lsls    r0, r0, #16
   a:   6778            str     r0, [r7, #116]  ; 0x74
   c:   2001            movs    r0, #1
   e:   03c0            lsls    r0, r0, #15
  10:   67b8            str     r0, [r7, #120]  ; 0x78
  12:   f03d fec1       bl      0x3dd98
  16:   bdf0            pop     {r4, r5, r6, r7, pc}
```

It's the same for this even though we specify `arm7tdmi`. 

2025-12-19 Wk 51 Fri - 03:39 +03:00

Some rules to make it compatible with assembly in the project:

- `sl` $\to$ `r10`
- `movs/lsls` $\to$ `mov/lsl`
- indices $\to$ hex if > 9 else decimal, no zero padding
- consecutive rlist is collapsed with -
- instructions and their arguments only have a space between them

```
	thumb_local_start
undumped_code_8061B6C::
	push {r4-r7, lr}
	mov r7, r10
	ldr r7, [r7, #0x10]
	mov r0, #0x5
	lsl r0, r0, #0x10
	str r0, [r7, #0x74]
	mov r0, #1
	lsl r0, r0, #0xF
	str r0, [r7, #0x78]
	bl 0x3dd98
	pop {r4-r7, pc}
	thumb_func_end undumped_code_8061B6C
```


2025-12-19 Wk 51 Fri - 07:23 +03:00

All of this gives OK:

```C
	thumb_local_start
undumped_code_8061B6C::
	push {r4-r7, lr}
	mov r7, r10
	ldr r7, [r7, #0x10]
	mov r0, #5
	lsl r0, r0, #0x10
	str r0, [r7, #0x74]
	mov r0, #1
	lsl r0, r0, #0xF
	str r0, [r7, #0x78]
	// bl 0x3dd98
	.byte 0x3D, 0xF0, 0xC1, 0xFE
	pop {r4-r7, pc}
	thumb_func_end undumped_code_8061B6C
```

But that `bl` does not, and for some reason `python3 tools/fdiff.py bn6f.ign bn6f.gba` gives a non-localized error. 

Wheras this gives a localized error:

```C
	// bl 0x3dd98
	//.byte 0x3D, 0xF0, 0xC1, 0xFE
	bl sub_8005D88
```

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
python3 tools/fdiff.py bn6f.ign bn6f.gba

# out
Found diff #0 @ 061B7C: bin1=0xF03D67B8 bin2=0xF7A467B8
Found diff #1 @ 061B80: bin1=0xBDF0FEC1 bin2=0xBDF0F903
```

So the issue of a non-localized difference here has more to do with conditions with forms of `bl <CONST>`. 

2025-12-19 Wk 51 Fri - 07:32 +03:00

Spawn [[001 Interpret the bit pattern of the bl instruction for gba]] ^spawn-task-7d5260

2025-12-20 Wk 51 Sat - 06:11 +03:00

`809f91c`

```sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 809f91c

# out
RomEa { ea: 0x0809F91C } is not in map. But it is between Identifier { s: "sub_809F90C" } and Identifier { s: "locret_809F920" }
```

This is a new label we define as `call_809F91C` for an alternative call here:

```C
	thumb_func_start sub_809F90C
sub_809F90C:
	push {lr}
	movflag EVENT_1708
	bl TestEventFlagFromImmediate // (flag: u16) -> !zf
	bne locret_809F920
	ldr r0, off_809F9C4 // =byte_2000210 
	mov r1, #0
call_809F91C::
	strb r1, [r0]
	str r1, [r0,#0x8]
locret_809F920:
	pop {pc}
	thumb_func_end sub_809F90C
```

So now the function is

```C
	thumb_local_start
undumped_code_8061B6C::
	push {r4-r7, lr}
	mov r7, r10
	ldr r7, [r7, #0x10]
	mov r0, #5
	lsl r0, r0, #0x10
	str r0, [r7, #0x74]
	mov r0, #1
	lsl r0, r0, #0xF
	str r0, [r7, #0x78]
	bl call_809F91C
	pop {r4-r7, pc}
	thumb_func_end undumped_code_8061B6C
```

But we still got it wrong:

```sh
python3 tools/fdiff.py bn6f.ign bn6f.gba

# out
Found diff #0 @ 061B80: bin1=0xBDF0FEC1 bin2=0xBDF0FECD
```

We got this value from

```sh
python3 -c "print(hex(0x8061B84 + 0x12 + 0x3dd86))" # 0x809f91c
```

But the dump ea is `8061B6C`, so it should be 

```sh
python3 -c "print(hex(0x8061B6C + 0x12 + 0x3dd86))" # 0x809f904
```

which is just the prior function to `sub_809F90C`, `sub_809F904`. So we don't need to add `call_809F91C`.

```C
	thumb_local_start
undumped_code_8061B6C::
	push {r4-r7, lr}
	mov r7, r10
	ldr r7, [r7, #0x10]
	mov r0, #5
	lsl r0, r0, #0x10
	str r0, [r7, #0x74]
	mov r0, #1
	lsl r0, r0, #0xF
	str r0, [r7, #0x78]
	bl sub_809F904
	pop {r4-r7, pc}
	thumb_func_end undumped_code_8061B6C
```

This builds! so let's rename it from `undumped_code_8061B6C` to `sub_8061B6C`

Let's also fill in struct indices:

```C
	thumb_local_start
sub_8061B6C::
	push {r4-r7, lr}
	mov r7, r10
	ldr r7, [r7, #oToolkit_CutsceneStatePtr]
	mov r0, #5
	lsl r0, r0, #0x10
	str r0, [r7, #oToolkit_NaviStatsPtr]
	mov r0, #1
	lsl r0, r0, #0xF
	str r0, [r7, #oToolkit_Unk2004a8c_Ptr]
	bl sub_809F904
	pop {r4-r7, pc}
	thumb_func_end sub_8061B6C
```

2025-12-20 Wk 51 Sat - 06:51 +03:00

Let's look to dumping `undumped_code_8061B84` next.

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
dd skip=$(python3 -c "print(0x8061B84 - 0x8000000)") count=$(python3 -c "print(0x8061BB6 - 0x8061B84)") if=bn6f.gba of=a.bin bs=1
arm-none-eabi-objdump -D -bbinary -marm7tdmi -Mforce-thumb a.bin
rm a.bin

# out (relevant)
   0:   b5f0            push    {r4, r5, r6, r7, lr}
   2:   4657            mov     r7, sl
   4:   693f            ldr     r7, [r7, #16]
   6:   6ae8            ldr     r0, [r5, #44]   ; 0x2c
   8:   6f79            ldr     r1, [r7, #116]  ; 0x74
   a:   6fba            ldr     r2, [r7, #120]  ; 0x78
   c:   1a89            subs    r1, r1, r2
   e:   6779            str     r1, [r7, #116]  ; 0x74
  10:   1840            adds    r0, r0, r1
  12:   62e8            str     r0, [r5, #44]   ; 0x2c
  14:   2120            movs    r1, #32
  16:   4249            negs    r1, r1
  18:   0409            lsls    r1, r1, #16
  1a:   4288            cmp     r0, r1
  1c:   dd05            ble.n   0x2a
  1e:   6a68            ldr     r0, [r5, #36]   ; 0x24
  20:   2103            movs    r1, #3
  22:   03c9            lsls    r1, r1, #15
  24:   1a40            subs    r0, r0, r1
  26:   6268            str     r0, [r5, #36]   ; 0x24
  28:   bdf0            pop     {r4, r5, r6, r7, pc}
  2a:   62e9            str     r1, [r5, #44]   ; 0x2c
  2c:   f03d fea8       bl      0x3dd80
  30:   bdf0            pop     {r4, r5, r6, r7, pc}
```

Copying this output to `a`, we can apply the following rules to do the cleaning:

```
# sl is r10
:%s/sl$/r10/g

# str/ldr indices should just be the hex form
:%s/#\([0-9]*\)]\s*; 0x\([a-f0-9]*\)/#0x\2]/g

# get rid of the content prior to the instructions and make the instructiones \t padded
:%s/ *\([a-f0-9]*\): *\([a-f0-9]* \([a-f0-9]*\|\)\)\s*\(.*\)/\t\4/g

# get rid of the padded spacing after the instruction
:%s/\(\t[a-z.]*\) *\(.*\)/\1 \2/g

# Some instructions include an `s` in the end in the dump we do not want
:%s/\(sub\|lsl\|mov\|add\|neg\)s/\1/g

# Some jumps like ble.n should be ble
:%s/\(ble\).n/\1/g
```

^objdump-code-cleaning-listing1

now we get

```
 	push {r4, r5, r6, r7, lr}
 	mov r7, r10
 	ldr r7, [r7, #16]
 	ldr r0, [r5, #0x44]
 	ldr r1, [r7, #0x116]
 	ldr r2, [r7, #0x120]
 	sub r1, r1, r2
 	str r1, [r7, #0x116]
 	add r0, r0, r1
 	str r0, [r5, #0x44]
 	mov r1, #32
 	neg r1, r1
 	lsl r1, r1, #16
 	cmp r0, r1
 	ble.n 0x2a
 	ldr r0, [r5, #0x36]
 	mov r1, #3
 	lsl r1, r1, #15
 	sub r0, r0, r1
 	str r0, [r5, #0x36]
 	pop {r4, r5, r6, r7, pc}
 	str r1, [r5, #0x44]
 	bl 0x3dd80
 	pop {r4, r5, r6, r7, pc}
```

for `0x2a`, add a local label with ea 

```sh
python3 -c "print(hex(0x8061B84 + 0x2a))" # 0x8061bae`
```

`loc_8061BAE`

```
 	push {r4, r5, r6, r7, lr}
 	mov r7, r10
 	ldr r7, [r7, #16]
 	ldr r0, [r5, #0x44]
 	ldr r1, [r7, #0x116]
 	ldr r2, [r7, #0x120]
 	sub r1, r1, r2
 	str r1, [r7, #0x116]
 	add r0, r0, r1
 	str r0, [r5, #0x44]
 	mov r1, #32
 	neg r1, r1
 	lsl r1, r1, #16
 	cmp r0, r1
 	ble loc_8061BAE
 	ldr r0, [r5, #0x36]
 	mov r1, #3
 	lsl r1, r1, #15
 	sub r0, r0, r1
 	str r0, [r5, #0x36]
 	pop {r4, r5, r6, r7, pc}
loc_8061BAE:
 	str r1, [r5, #0x44]
 	bl 0x3dd80
 	pop {r4, r5, r6, r7, pc}
```

Now we calculate the `bl` jump,

```sh
python3 -c "print(hex(0x8061B84 + 0x2c + 0x3dd80))" # 0x809f930
```

```
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 809f930

# out
RomEa { ea: 0x0809F930 } is not in map. But it is between Identifier { s: "sub_809F922" } and Identifier { s: "locret_809F940" }
```

We also made a mistake in cleaning the indices, 

```diff
# str/ldr indices should just be the hex form
-:%s/#\([0-9]*\)]\s*; 0x\([a-f0-9]*\)/#0x\1]/g
+:%s/#\([0-9]*\)]\s*; 0x\([a-f0-9]*\)/#0x\2]/g
```

so reapplying the rules. 

So far we know this builds OK:

```C
	thumb_local_start
undumped_code_8061B84::
	push {r4, r5, r6, r7, lr}
	mov r7, r10
	ldr r7, [r7, #16]
	ldr r0, [r5, #0x2c]
	ldr r1, [r7, #0x74]
	ldr r2, [r7, #0x78]
	sub r1, r1, r2
	str r1, [r7, #0x74]
	add r0, r0, r1
	str r0, [r5, #0x2c]
	mov r1, #32
	neg r1, r1
	lsl r1, r1, #16
	cmp r0, r1
	ble loc_8061BAE
	ldr r0, [r5, #0x24]
	mov r1, #3
	lsl r1, r1, #15
	sub r0, r0, r1
	str r0, [r5, #0x24]
	pop {r4, r5, r6, r7, pc}
loc_8061BAE:
	str r1, [r5, #0x2c]
	.hword 0xf03d, 0xfea8
	//bl 0x3dd80
	pop {r4, r5, r6, r7, pc}
	thumb_func_end undumped_code_8061B84
```

We can add the label `call_809F930` for the bl:

```C
	thumb_local_start
sub_809F922:
	push {r4,r6,r7,lr}
	movflag EVENT_1708
	bl TestEventFlagFromImmediate // (flag: u16) -> !zf
	bne locret_809F940
	ldr r7, off_809F9C4 // =byte_2000210 
call_809F930::
	ldrb r6, [r7]
	cmp r6, #0x10
	bge locret_809F940
	add r4, r6, #1
	strb r4, [r7]
	lsl r6, r6, #2
	add r6, #0x10
	str r5, [r7,r6]
locret_809F940:
	pop {r4,r6,r7,pc}
	thumb_func_end sub_809F922
```

But this would not build:

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
python3 tools/fdiff.py bn6f.ign bn6f.gba

# out
Found diff #0 @ 061BB0: bin1=0xFEA8F03D bin2=0xFEBEF03D
```

Let's interpret the value from the instruction `.hword 0xf03d, 0xfea8`:

```sh
python3 -c "print(hex(((0xf03d & 0x07ff) << 12) | ((0xfea8 & 0x07ff) << 1) + 4 + 0x2c))" # 0x3dd80
```

you can see the `0x2c` offset is built into the instruction itself, and we're double adding it, since this is what produces that `0x3dd80` value. So the correct calculation for the ea is

```sh
python3 -c "print(hex(0x8061B84 + 0x3dd80))" # 0x809f904
```

which refers to an already existing function `sub_809F904`. Having this be the `bl` target causes it to build OK.

2025-12-20 Wk 51 Sat - 08:49 +03:00

Let's do another case for `undumped_code_8061BE6`. 

We're gonna silence `dd` and skip the first 8 line of `objdump` to just get the code we're interested in:

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
dd skip=$(python3 -c "print(0x8061BE6 - 0x8000000)") count=$(python3 -c "print(0x8061BFE - 0x8061BE6)") if=bn6f.gba of=a.bin bs=1 2>/dev/null
arm-none-eabi-objdump -D -bbinary -marm7tdmi -Mforce-thumb a.bin | tail -n +8
rm a.bin

# out
   0:   b5f0            push    {r4, r5, r6, r7, lr}
   2:   4657            mov     r7, sl
   4:   693f            ldr     r7, [r7, #16]
   6:   2000            movs    r0, #0
   8:   0400            lsls    r0, r0, #16
   a:   6778            str     r0, [r7, #116]  ; 0x74
   c:   2001            movs    r0, #1
   e:   03c0            lsls    r0, r0, #15
  10:   67b8            str     r0, [r7, #120]  ; 0x78
  12:   f03d fe84       bl      0x3dd1e
  16:   bdf0            pop     {r4, r5, r6, r7, pc}
```

Then we apply the cleanup steps in [[#^objdump-code-cleaning-listing1]] to get

```
	push {r4, r5, r6, r7, lr}
	mov r7, r10
	ldr r7, [r7, #16]
	mov r0, #0
	lsl r0, r0, #16
	str r0, [r7, #0x74]
	mov r0, #1
	lsl r0, r0, #15
	str r0, [r7, #0x78]
	bl 0x3dd1e
	pop {r4, r5, r6, r7, pc}
```

We calculate the `bl` target

```sh
python3 -c "print(hex(0x8061BE6 + 0x3dd1e))" # 0x809f904
```

which points to `sub_809F904`.  Then with some manual transformations currently we get:

```
	thumb_local_start
sub_8061BE6::
	push {r4-r7, lr}
	mov r7, r10
	ldr r7, [r7, #oToolkit_CutsceneStatePtr]
	mov r0, #0
	lsl r0, r0, #0x10
	str r0, [r7, #oToolkit_NaviStatsPtr]
	mov r0, #1
	lsl r0, r0, #0xF
	str r0, [r7, #oToolkit_Unk2004a8c_Ptr]
	bl sub_809F904
	pop {r4-r7, pc}
	thumb_func_end sub_8061BE6
```

2025-12-20 Wk 51 Sat - 09:21 +03:00

Next case is `undumped_code_80652A0`

2025-12-20 Wk 51 Sat - 12:05 +03:00

Corrected case of bad indices like `oToolkit_NaviStatsPtr` and `oToolkit_Unk2004a8c_Ptr`. We already were loading `oToolkit_CutsceneStatePtr` from r7 to r7, so we're no longer operating with `Toolkit`.

2025-12-20 Wk 51 Sat - 12:23 +03:00

Okay so we did some more automation for dumping code. to dump `undumped_code_80652A0` we can do

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
tools/misc_scripts/dump_code/dump_code.sh undumped_code_80652A0 0x80652A0 0x80652B8

# out
        thumb_local_start
undumped_code_80652A0:
        push {r4-r7, lr}
        mov r7, r10
        ldr r7, [r7, #0x10]
        mov r0, #4
        lsl r0, r0, #0x10
        str r0, [r7, #0x74]
        mov r0, #1
        lsl r0, r0, #0xF
        str r0, [r7, #0x78]
        bl sub_809F904
        pop {r4-r7, pc}
        thumb_func_start undumped_code_80652A0
```

The terminal replaces the tab with spaces though, so we should redo that in pasting for now.


It builds!

2025-12-20 Wk 51 Sat - 12:31 +03:00

Next case is `end_npcscript_8061408`.

`undumped_code_8061423` after it is wrongly labeled. It should be even and include the last byte in `end_npcscript_8061408`.

It dumped similar to the last. Moving on:

```
undumped_code_8061422
```

Added `.balign 4, 0` to functions ending with zeros. 

2025-12-20 Wk 51 Sat - 13:24 +03:00

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
python3 tools/fdiff.py bn6f.ign bn6f.gba

# out
Found diff #0 @ 060660: bin1=0x8061448 bin2=0x8061449
```

```sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 8060660

# out
RomEa { ea: 0x08060660 } is not in map. But it is between Identifier { s: "NPCScriptsSkyTown_806065C" } and Identifier { s: "off_806066C" }
```

This failure happened because we were mistakenly ending the functions with a `thumb_func_start` instead of `thumb_func_end`, which ended up making the next symbol after the function `off_8061448` be treated as a function.

2025-12-20 Wk 51 Sat - 13:29 +03:00

Next cases is `undumped_code_806957D` which also is cut wrong. It should be even and include the last byte from the previous buffer. There are similar cases after.

Tested and corrected signed offset of `bl` with undumped function `end_cutscenescript_8098370`. It's also the first instance we're dumping right now with pool usage.

```
        thumb_local_start
end_cutscenescript_8098370:
   0:   b5f0            push    {r4, r5, r6, r7, lr}
   2:   4803            ldr     r0, [pc, #12]   ; (0x10)
   4:   7929            ldrb    r1, [r5, #4]
   6:   f7a8 f805       bl      0xfffa8014
   a:   2000            mov     r0, #0
   c:   bdf0            pop     {r4, r5, r6, r7, pc}
   e:   0000            mov     r0, r0
  10:   3404            add     r4, #4
  12:   0203            lsl     r3, r0, #8
        thumb_func_end end_cutscenescript_8098370
```

We want to be able to automatically turn it into

```
	thumb_local_start
end_cutscenescript_8098370:
	push {r4-r7, lr}
	ldr r0, =eTextScript2033404
	ldrb r1, [r5, #4]
	bl chatbox_runScript
	mov r0, #0
	pop {r4-r7, pc}
	.pool
	thumb_func_end end_cutscenescript_8098370
```

which builds `OK`. 

2025-12-20 Wk 51 Sat - 20:22 +03:00

Found out with `undumped_code_80893F4` that we need to pass `-z` to not get the `...` from `arm-none-eabi-objdump` to get the zeros. This is because it can be necessary for pool.

```
Exception: no symbol found for ea 0x8035450
```

```sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 8035450

# out
RomEa { ea: 0x08035450 } is not in map. But it is between Identifier { s: "off_8035448" } and Identifier { s: "unk_8035451" }
```

This refers to `unk_8035451`, which should be `unk_8035450` instead.

2025-12-21 Wk 51 Sun - 07:51 +03:00

Encountering `unk_8099164` we find `movflag` usage:

```C
	mov r0, #0x17
	mov r1, #0x15
	bl ClearEventFlagFromImmediate
```

```C
# in include/macros.inc
	.macro movflag flag16:req
		mov r0, #\flag16 >> 8
		mov r1, #\flag16 & 0xFF
	.endm
```

These can happen before function calls like `ClearEventFlagFromImmediate`, `TestEventFlagFromImmediate`, `SetEventFlagFromImmediate`, `ToggleEventFlagFromImmediate`

in a similar form.

It can happen to `SetEventFlagRangeFromImmediate` , `ClearEventFlagRangeFromImmediate`, `ToggleEventFlagRangeFromImmediate`, `TestEventFlagRangeFromImmediate`,  in  a different form where there's also an `r2`. 

```
	movflag EVENT_1640
	mov r2, #0x40 
	bl SetEventFlagRangeFromImmediate // (u8 entryIdx, u8 byteFlagIdx, int numEntries) -> void
```

The list of events can be found in `constants/enums/ewram_flags.inc`.

`unk_8099164` also referenced `byte_8098E9C` which had multiple compressed asset pointers we just marked via `cargo run --bin expt000_read_symbol_data byte_8098E9C -mmm --label`

`byte_8098E9C` is some unidentified struct.

2025-12-21 Wk 51 Sun - 09:10 +03:00

We're failing build for `byte_8098E24`. 

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
python3 tools/fdiff.py bn6f.ign bn6f.gba

# out
Found diff #0 @ 098E50: bin1=0xF7961C00 bin2=0xF7963000
Found diff #1 @ 098E5C: bin1=0xF7961C00 bin2=0xF7963000
```

And it seems to be about the add:

```
  2c:   1c00            adds    r0, r0, #0
  2e:   f796 f95f       bl      0xfff962f0

  38:   1c00            adds    r0, r0, #0
  3a:   f796 f967       bl      0xfff9630c
```

`add r0, r0, #0` is being interpreted as `.hword 0x3000`.

I tried `add r0, #0` but still got `0x3000`. I tried `add r0, r0` but got `0x1800` but `mov r0, r0` gives `OK`. So we need to add filter to change specifically `1c00` `add r0, r0, #0` to a `mov r0, r0`

2025-12-21 Wk 51 Sun - 09:44 +03:00

Dumping `end_cutscenescript_8081898` and `unk_80818C8` together because they share the same pool. Would have to separate them as functions manually. 

Right now we assume the pool is part of the dumped region.  Note also in this case the first function makes use of the pool, but the second does not. To know to insert a pool, we need that information from the first function, but it can't be inserted in its own data region.

2025-12-21 Wk 51 Sun - 10:01 +03:00

From the dump of `unk_8097660`,

```
  26:   0000            movs    r0, r0
  28:   ffff 0000       vaddl.u<illegal width 64>       q8, d15, d0
```

When determining pool we need to handle this kind of case where it is thinking it found a u32 instruction instead of a u16. Need to make `get_pool32_values_per_location` more general here.

2025-12-22 Wk 52 Mon - 08:07 +03:00

`unk_808FC34` through `unk_808FCB0` use a shared pool. In case of a shared pool, we could try to use the same strategy as we do in the rest of the bn6f assembly, to make pool use explicit: `ldr r0, pool_label // =pool_label_value`.

We could also just have it refer to an unspecified pool in dumping, and so it's up to the user that it is connected to a `.pool` afterwards.

2025-12-22 Wk 52 Mon - 13:59 +03:00

The case with `unk_808FC34` seems to simultaneously use internal pool and external. So the internal would then trigger adding `.pool`, but the external would be out of reach. So it's best in global cases to defer to explicit label.

2025-12-23 Wk 52 Tue - 06:49 +03:00

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
cat bn6f.sym | grep AAAAAA > a
cat bn6f.sym | grep BBBBBB >> a

# in a 

# rectangle select the ea part of the label and use ~ to make it capitalized

:%s/0\([0-9A-Fa-f]*\) g 00000000 \(AAAAAA[0-9]*\)/.\/replacep.sh "\2" "undumped_code_\1"/g
:%s/0\([0-9A-Fa-f]*\) g 00000000 \(BBBBBB[0-9]*\)/.\/replacep.sh "\2" "unk_\1"/g


# in /home/lan/src/cloned/gh/dism-exe/bn6f
chmod +x a
./a
rm a
```

2025-12-23 Wk 52 Tue - 07:17 +03:00

The range `unk_8083C6C` to `byte_8083CD4` exclusive shows an example of shared pool use that would otherwise be registered as internal, but because the offsets are not ordered in increasing order, use of `.pool` would fail: `0x68, 0x58, 0x5C, 0x60` here `0x68` would fail this pattern.

2025-12-23 Wk 52 Tue - 08:08 +03:00

`undumped_code_8083F80` is the first we encounter that refers to function pointers by pool.

```
	ldr r0, off_8083FB8 // =0x804c059
	ldr r1, off_8083FBC // =0x804c075
```

This should be

```
	ldr r0, off_8083FB8 // =sub_804C058
	ldr r1, off_8083FBC // =sub_804C074
```

No need to add `+1` in here, the intent is that it refers to these functions.

All values in `off_8084040` and `off_8084054` are gfx anim scripts to be dumped, as discovered by `undumped_code_8083FC0`.

There are more that directly call `LoadGFXAnim` that need to be dumped.

2025-12-23 Wk 52 Tue - 10:00 +03:00

In dumping `unk_8096B00`, we put the wrong symbol into the pool: `sub_8030CAC` instead of `0xF6`, because grep caught on the third field.

```
08030cac l 000000f6 sub_8030CAC
```

2025-12-23 Wk 52 Tue - 10:17 +03:00

When dumping `unk_8086854`, there is values unused by the pool that are just ignored, causing a build error. They should be marked as pointers external. Alerting when we detect unprocessed values after pool.

2025-12-23 Wk 52 Tue - 11:02 +03:00

`unk_808A0BE` is the first function we encounter that repeats pool usage. `0x64, 0x64`

```
  10:   4c14            ldr     r4, [pc, #80]   ; (0x64)
  12:   5ee2            ldrsh   r2, [r4, r3]
  14:   8b28            ldrh    r0, [r5, #24]
  16:   08c0            lsrs    r0, r0, #3
  18:   4350            muls    r0, r2
  1a:   4c12            ldr     r4, [pc, #72]   ; (0x64)
```

We're hitting

```python
# in fn read_aligned_u32_in_rom
if ea1 % 4 != 0:
	raise Exception(f"Expected ea 0x{ea:X} to be word aligned.")
```

```
Exception: Expected ea 0x808A122 to be word aligned.
```

```
  10:   4c14            ldr     r4, [pc, #80]   ; (0x64)
```

```sh
python3 -c "print(hex(0x808A0BE + 0x64))" # 0x808a122
```

this is what we got before for the last bytes of the function:

```
  60:   0000            movs    r0, r0
  62:   65e0            str     r0, [r4, #92]   ; 0x5c
  64:   0800            lsrs    r0, r0, #32
  66:   6660            str     r0, [r4, #100]  ; 0x64
  68:   0800            lsrs    r0, r0, #32
        thumb_func_end unk_808A0BE
```

The issue is that `unk_808A0BE` is not aligned by 4, only by 2.

2025-12-23 Wk 52 Tue - 11:29 +03:00

```
	ldr r4, off_808A120 // =math_sinTable
	ldrsh r2, [r4, r3]
	ldrh r0, [r5, #0x18]
	lsr r0, r0, #3
	mul r0, r2
	ldr r4, off_808A124 // =math_cosTable
```

So this builds `OK`. 

It was referring to different values. And yet it was not inferrable from `0x64` here:

```
  10:   4c14            ldr     r4, [pc, #80]   ; (0x64)
  12:   5ee2            ldrsh   r2, [r4, r3]
  14:   8b28            ldrh    r0, [r5, #24]
  16:   08c0            lsrs    r0, r0, #3
  18:   4350            muls    r0, r2
  1a:   4c12            ldr     r4, [pc, #72]   ; (0x64)
```

This seems an issue with the 0x64 encoding here. It is not discerning actually different values. 

2025-12-23 Wk 52 Tue - 12:09 +03:00

```rust
// in fn _app_dump_trace_or_fail
    let records = {
        let mut mut_i = 0;

        loop {
            let ea_syms = read_sym_file(&sym_path).expect("Failed to read sym file");

            let rom_ea = drivers::symbols::symbol_to_rom_ea_or_fail(&app_settings, symbol);

            let symbol_data = drivers::symbols::read_symbol_data(&app_settings, &rom_ea)
                .expect("Failed to process symbol data");

            let out = trace_read_insts_recur_or_cut_or_merge_or_fail(app_settings, &symbol_data, script_type, None, &ea_syms, &vec![]);

            // Run it twice so that we ensure there is no out of sync data due to cutting. Otherwise symbol data previously traced can be compromised.
            if mut_i == 1 {
                break out;
            } else {
                mut_i += 1;
            }
        }
    };
```

Running this twice now means that a label could be cut and then ignored later on because it cannot be reached via trace. Due to this there could not be undumped script in various places, as we found in `dword_8089128`.  We could possibly search for these instances by searching for last instruction in a label block pattern, making sure it's not an end, or a jump, etc. I fixed a few that I happen to encounter while dumping code.

2025-12-23 Wk 52 Tue - 12:16 +03:00

Disabling the 2-looping part still reproduces the problem:

```
dword_8089128:
	cs_lock_player_for_non_npc_dialogue_809e0b0
	cs_nop_80377d0
	cs_call_native_with_return_value ptr1=dispatch_8089140+1

cutscenescript_8089130:
	.word 0x0747FF2A, 0x3C00043F, 0x30154000, 0x00080891
```

`cutscenescript_8089130` is cut but not dumped.

Issue might be because use of `cut_new_label_and_trace_again_or_fail` does not propagate the processed items, so let's change that.

No the problem persists. The issue is that once we cut this label, we lost it. It's as if we never had to process it.

```C
dword_8089128:
	cs_lock_player_for_non_npc_dialogue_809e0b0
	cs_nop_80377d0
	cs_call_native_with_return_value ptr1=dispatch_8089140+1

cutscenescript_8089130:
	cs_clear_event_flag byte1=0xFF event16_2=EVENT_747
	cs_unlock_player_after_non_npc_dialogue_809e122
	cs_end_for_map_reload_maybe_8037c64
	cs_set_chatbox_flags byte2=0x40
	cs_jump destination1=cutscenescript_8089130
	cs_end_for_map_reload_maybe_8037c64
```

I relied on the assumption that all cut labels can be discovered again, but `cutscenescript_8089130` breaks this assumption since it refers to itself, is not a main label that can be traced to again, and so it cut itself out of processing consideration.

No easy fix for this right now. I think one way would be that we have to track the cumulative script typed cuts we make, and ensure they are also dumped.

I put a note.

```rust
// in fn trace_read_insts_recur_or_cut_or_merge_or_fail
// FIXME: the ea we just cut is potentially lost to processing. Ex: cutscenescript_8089130 where
// it is part of an earlier script dword_8089128 ends up recursing and cutting itself out from processing.
// We need to ensure that all eas cut saved with script type and ensure to dump them too.
return cut_new_label_and_trace_again_or_fail(
	app_settings,
	symbol_data,
	script_type,
	ea,
	&new_label,
	processed_items,
);
```

2025-12-23 Wk 52 Tue - 12:41 +03:00

I finished dumping all the code I could trace through scripts for now. But you can find more undumped code. If you just search for the pattern of `B5` and `F0` you can find some. I found 5. I thought we heuristics of matching `push/pop` for function discovery before.

```
undumped_code_810EBF4
undumped_code_810EC13
undumped_code_811019C
undumped_code_8120568
undumped_code_81311C8
```

`undumped_code_810EC13` is not code, so that filter can produce false positives. You can also see that it's an `0xF0, 0xB5` at an odd address, which should not be possible for the first instruction of a function, but it is part of `undumped_code_810EBF4` which looks correct.

2025-12-23 Wk 52 Tue - 13:15 +03:00

Also had issue dumping `undumped_code_810EBF4` due to many zeros coming after that I had to label myself:

```
unk_810EC18::
	.word 0x00000000
	.word 0x00000000
```

This is many more zeros than we can consider as just alignment.

2025-12-23 Wk 52 Tue - 13:22 +03:00

Some more at

```
undumped_code_800FDA0
undumped_code_8140830
```

while looking for the pattern of `F0 BD`. 

2025-12-23 Wk 52 Tue - 13:33 +03:00

Now let's dump all scripts directly used by `LoadGFXAnim`

Spawn [[002 Dump all scripts directly used by LoadGFXAnim]] ^spawn-task-249edd

2025-12-25 Wk 52 Thu - 14:27 +03:00

There is undumped code at `byte_30079D0`. 

We need to know its location from the perspective of ROM.

```
# in ld_script.ld
    .text :
    {
        rom.o(.text);
    } >rom_region

    iwram_text :
    {
        iwram.o(.text);
    } >iwram_region AT>rom_region
```

Looking in `rom.s`, this should be from `IWRAMRoutinesROMLocation`, which is at `0x81d6000`. 

whereas the first routine in `asm38.s` is `sub_3005B00`, so to convert, zero the position reference by `0x3005B00` then add  `0x81D6000`

So for `byte_30079D0`, 

```sh
python3 -c "print(hex(0x30079D0 - 0x3005B00 + 0x81D6000))" # 0x81d7ed0
```

`end_func_30079F4` would be 

```sh
python3 -c "print(hex(0x30079F4 - 0x3005B00 + 0x81D6000))" # 0x81d7ef4
```

It expects on dumping a bl target at `0x81D7E04`. 

```sh
python3 -c "print(hex(0x81D7E04 + 0x3005B00 - 0x81D6000))" # 0x3007904
```

I'm trying to hack the script to support iwram code addresses so this might be related.

I added `call_3007904`

2025-12-25 Wk 52 Thu - 15:08 +03:00

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
python3 tools/fdiff.py bn6f.ign bn6f.gba

# out
Found diff #0 @ 1D7ED0: bin1=0x708 bin2=0x1C000708
```

We're failing to dump it at the pool use somehow. Actually no it happens to be similar to the pool data `0x780`. 

It doesn't just happen to be that, it's because that's the pool of the previous function.

```
        thumb_local_start
byte_30079D0:
   0:   0708            lsls    r0, r1, #28
   2:   0000            movs    r0, r0
```

Now we get `OK` after shifting the function start by 4 bytes and having a `0x708` `.pool` use for the funciton above.

2025-12-25 Wk 52 Thu - 15:18 +03:00

What about the data between `end_func_30079F8` and `end_file_3007B00`  at the end of the file?

```sh
python3 -c "print(hex(0x30079F8 - 0x3005B00 + 0x81D6000))" # 0x81d7ef8
python3 -c "print(hex(0x3007B00 - 0x3005B00 + 0x81D6000))" # 0x81d8000
```

None of it looks like valid code. So I don't know what it is.

2025-12-26 Wk 52 Fri - 21:37 +03:00

Code at `byte_3005FC0` ending in `byte_3005FFA`

```sh
python3 -c "print(hex(0x3005FC0 - 0x3005B00 + 0x81D6000))" # 0x81d64c0
python3 -c "print(hex(0x3005FFA - 0x3005B00 + 0x81D6000))" # 0x81d64fa
```

Code at `byte_3005FFA` ending in `sub_3006028`

```sh
python3 -c "print(hex(0x3005FFA - 0x3005B00 + 0x81D6000))" # 0x81d64fa
python3 -c "print(hex(0x3006028 - 0x3005B00 + 0x81D6000))" # 0x81d6528
```