---
parent: '[[002 bn6f ROM shifting]]'
spawned_by: '[[003 Look into dumping undumped code with methods outside IDA]]'
context_type: task
status: done
---

Parent: [002 bn6f ROM shifting](../002%20bn6f%20ROM%20shifting.md)

Spawned by: [003 Look into dumping undumped code with methods outside IDA](../investigations/003%20Look%20into%20dumping%20undumped%20code%20with%20methods%20outside%20IDA.md)

Spawned in: [^spawn-task-7d5260](../investigations/003%20Look%20into%20dumping%20undumped%20code%20with%20methods%20outside%20IDA.md#spawn-task-7d5260)

# 1 Journal

2025-12-19 Wk 51 Fri - 07:32 +03:00

We want to interpret

````C
	// bl 0x3dd98
	//.byte 0x3D, 0xF0, 0xC1, 0xFE
````

Why did `arm-none-eabi-objdump` assume `bl 0x3dd98` from `.byte 0x3D, 0xF0, 0xC1, 0xFE`?

From [ARM7TDMI docs](https://www.dwedit.org/files/ARM7TDMI.pdf) section `4.4 Branch and Branch with Link (B, BL)`,

````
[Cond     ] [101   ][L] [Offset                                                               ]
31 30 29 28 27 26 25 24 23 22 21 20 19 18 17 16 15 14 13 12 11 10 09 08 07 06 05 04 03 02 01 00
````

As a little endian u32, `.byte 0x3D, 0xF0, 0xC1, 0xFE` would be `.word 0xFEC1F03D` with the bit pattern `0b1111 1110 1100 0001 1111 0000 0011 1101` distributed as:

````
[Cond     ] [101   ][L] [Offset                                                               ]
31 30 29 28 27 26 25 24 23 22 21 20 19 18 17 16 15 14 13 12 11 10 09 08 07 06 05 04 03 02 01 00
1  1  1  1  1  1  1  0  1  1  0  0  0  0  0  1  1  1  1  1  0  0  0  0  0  0  1  1  1  1  0  1
````

This would not match the magic.

What if we try big endian u32? `.byte 0x3D, 0xF0, 0xC1, 0xFE` would be `.word 0x3DF0C1FE` with the bit pattern `0b0011 1101 1111 0000 1100 0001 1111 1110`

````
[Cond     ] [101   ][L] [Offset                                                               ]
31 30 29 28 27 26 25 24 23 22 21 20 19 18 17 16 15 14 13 12 11 10 09 08 07 06 05 04 03 02 01 00
0  0  1  1  1  1  0  1  1  1  1  1  0  0  0  0  1  1  0  0  0  0  0  1  1  1  1  1  1  1  1  0
````

Still not matching the magic.

2025-12-19 Wk 51 Fri - 07:57 +03:00

Could be I'm referring to the wrong specs. If you check [GBATEK thumb ISA summary](https://problemkaputt.de/gbatek.htm#thumbinstructionsummary), then they present `BL`'s bitpattern as this:

````
 Form|_15|_14|_13|_12|_11|_10|_9_|_8_|_7_|_6_|_5_|_4_|_3_|_2_|_1_|_0_|
 _19_|_1___1___1___1_|_H_|______________Offset_Low/High______________|BL,BLX
````

Though this seems to only show the first u16. Treat it as the upper u16 of `.word 0xFEC1F03D` to get `.hword 0xF03D, 0xFEC1 ` with `0xFEC1 ` being `0b1111 1110 1100 0001` distributed on:

````
 Form|_15|_14|_13|_12|_11|_10|_9_|_8_|_7_|_6_|_5_|_4_|_3_|_2_|_1_|_0_|
 _19_|_1___1___1___1_|_H_|______________Offset_Low/High______________|BL,BLX
       1   1   1   1   1   1   1   0   1   1   0   0   0   0   0   1
````

The mask for the offset would be `0b0000 0111 1111 1111` or `0x07FF`:

````sh
python3 -c "print(hex(0xFEC1 & 0x07FF))" # 0x6c1
````

~~So we have `0x6c1` and `0xF03D`.  can we get `0x3dd98` from this?~~

I am expecting `0b1101 1000 001`,  but `0x6c1` is `0b0110 1100 0001`. that representation introduces an extra `0` to the left because 11 bits is not divisible by 4.

We need to interpret it as a 11+16=27 bit field: `0b1101`

`0b1101 1000 001` concat `0b1111 0000 0011 1101` $\to$ `0b1101 1000 0011 1110 0000 0111 101`

It is not divisible by 4, so we have to add 0:

`0b0110 1100 0001 1111 0000 0011 1101` $\to$ `0x6C1F03D`, but this is not `0x3dd98`.

`0b1111 0000 0011 1101` concat `0b1101 1000 001`  $\to$ `0b0111 1000 0001 1110 0110 1100 0001` $\to$ `0x781E6C1`

We can also try to interpret `0xF03D` first, since it is the first little endian `u16` with bit pattern `0b1111 0000 0011 1101` distributed:

````
 Form|_15|_14|_13|_12|_11|_10|_9_|_8_|_7_|_6_|_5_|_4_|_3_|_2_|_1_|_0_|
 _19_|_1___1___1___1_|_H_|______________Offset_Low/High______________|BL,BLX
       1   1   1   1   0   0   0   0   0   0   1   1   1   1   0   1
````

This gives us an offset `0b1111 01` to concatenate with.

`0b1111 01` concat `0xFEC1`/`0b1111 1110 1100 0001` $\to$ `0b0011 1101 1111 1110 1100 0001 `/\`0x3DFEC1

`0b1111 01` concat `0xFEC1`/`0b1111 1110 1100 0001` $\to$ `0b0011 1111 1011 0000 0111 1101`/

So the idea is that the cpu when it reads a bit stream will read little endian u16 at a time, hence  `.byte 0x3D, 0xF0, 0xC1, 0xFE`

````
0       1     2     3
0x3D,   0xF0, 0xC1, 0xFE
0xF03D,       0xFEC1
0xFEC1F03D
````

In strictly increasing order, `0x3D` would be `0b0011 1101` mirrored: `1011 1100`

`10111100000` concat `0xFEC1`/`0b1111 1110 1100 0001` $\to$ `111 1111 0110 0000 1101 1110 0000`

2025-12-19 Wk 51 Fri - 09:18 +03:00

This was the original dump:

````sh
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
````

This is if we skip to the instruction just before:

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
dd skip=$(python3 -c "print(0x61B7C)") count=$(python3 -c "print(0x8061B84 - 0x8061B7C)") if=bn6f.gba of=a.bin bs=1
arm-none-eabi-objdump -D -bbinary -marm7tdmi -Mforce-thumb a.bin

# out (relevant)
00000000 <.data>:
   0:   67b8            str     r0, [r7, #120]  ; 0x78
   2:   f03d fec1       bl      0x3dd88
   6:   bdf0            pop     {r4, r5, r6, r7, pc}
````

`0x3dd98` changed to `0x3dd88`. This value tracks also where we're dumping from, and not just the last instruction.

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
dd skip=$(python3 -c "print(0x61B7E)") count=$(python3 -c "print(0x8061B84 - 0x8061B7E)") if=bn6f.gba of=a.bin bs=1
arm-none-eabi-objdump -D -bbinary -marm7tdmi -Mforce-thumb a.bin

# out (relevant)
00000000 <.data>:
   0:   f03d fec1       bl      0x3dd86
   4:   bdf0            pop     {r4, r5, r6, r7, pc}
````

2025-12-19 Wk 51 Fri - 09:34 +03:00

We can consider this again

````
 thumb_local_start
  sub_8034CB6:
    push {r4-r7,lr}
    bl IsNotSlipRunningAndNotInCutscene
	// ...
````

````
08034c9c l 0000001a IsNotSlipRunningAndNotInCutscene
````

````sh
dd skip=$(python3 -c "print(0x34CB6)") count=$(python3 -c "print(6)") if=bn6f.gba of=a.bin bs=1
arm-none-eabi-objdump -D -bbinary -marm7tdmi -Mforce-thumb a.bin

# out (relevant)
00000000 <.data>:
   0:   b5f0            push    {r4, r5, r6, r7, lr}
   2:   f7ff fff0       bl      0xffffffe6
````

That `bl` is at ea `8034CB8` and it's referencing a function at `8034c9c`.

````sh
python3 -c "print(hex(0x8034CB8 - 0x8034c9c))" # 0x1c
````

And that difference is `0x1c`.

````
python3 -c "print(hex(0x100000000 - 0x1c))" # 0xffffffe4
````

Which is encoded as a signed `0xffffffe4`.

````sh
dd skip=$(python3 -c "print(0x34CB8)") count=$(python3 -c "print(6)") if=bn6f.gba of=a.bin bs=1
arm-none-eabi-objdump -D -bbinary -marm7tdmi -Mforce-thumb a.bin

00000000 <.data>:
   0:   f7ff fff0       bl      0xffffffe4
````

This is what we would see if dumped right from that `bl`. But what about its internal representation `f7ff fff0` (`.byte 0xFF, 0xF7, 0xF0, 0xFF`/`.hword 0xF7FF, 0xFFF0`)?

2025-12-19 Wk 51 Fri - 09:45 +03:00

We can manipulate this data directly.

````sh
echo "ff f7 f0 ff" | xxd -r -ps > a.bin

arm-none-eabi-objdump -D -bbinary -marm7tdmi -Mforce-thumb a.bin

# out (relevant)
00000000 <.data>:
   0:   f7ff fff0       bl      0xffffffe4
````

2025-12-19 Wk 51 Fri - 10:14 +03:00

````sh
echo "00 f0 00 f0" | xxd -r -ps > a.bin

arm-none-eabi-objdump -D -bbinary -marm7tdmi -Mforce-thumb a.bin

# out (relevant)
00000000 <.data>:
   0:   f000 f000       bl      0x400004
````

Seems changing either `f` here would result in `arm-none-eabi-objdump` no longer recognizing this as a `bl`.

````sh
echo "AA f0 00 f0" | xxd -r -ps > a.bin && arm-none-eabi-objdump -D -bbinary -marm7tdmi -Mforce-thumb a.bin

# out (relevant)
00000000 <.data>:
   0:   f0aa f000       bl      0x4aa004
````

The byte `AA` looks like it tracks over as is, but our previous case brings a counterexample with `dd` instead of `3d`.

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
dd skip=$(python3 -c "print(0x61B7E)") count=$(python3 -c "print(0x8061B84 - 0x8061B7E)") if=bn6f.gba of=a.bin bs=1
arm-none-eabi-objdump -D -bbinary -marm7tdmi -Mforce-thumb a.bin

# out (relevant)
00000000 <.data>:
   0:   f03d fec1       bl      0x3dd86
````

````sh
echo "3d f0 c1 fe" | xxd -r -ps > a.bin && arm-none-eabi-objdump -D -bbinary -marm7tdmi -Mforce-thumb a.bin

# out (relevant)
00000000 <.data>:
   0:   f03d fec1       bl      0x3dd86
````

````sh
echo "cc f0 c1 fe" | xxd -r -ps > a.bin && arm-none-eabi-objdump -D -bbinary -marm7tdmi -Mforce-thumb a.bin

# out (relevant)
00000000 <.data>:
   0:   f0cc fec1       bl      0xccd86
````

So it does still track, it's just  in this case the first byte without the 4 in the beginning.

````sh
echo "AA f0 00 f7" | xxd -r -ps > a.bin && arm-none-eabi-objdump -D -bbinary -marm7tdmi -Mforce-thumb a.bin

# out (relevant)
0:   f0aa f700       bl      0x4aae04
# /out

echo "AA f0 00 f8" | xxd -r -ps > a.bin && arm-none-eabi-objdump -D -bbinary -marm7tdmi -Mforce-thumb a.bin

# out (relevant)
   0:   f0aa f800       bl      0xaa004
# /out
````

This seems the lowest value:

````sh
echo "AA f0 00 f8" | xxd -r -ps > a.bin && arm-none-eabi-objdump -D -bbinary -marm7tdmi -Mforce-thumb a.bin

# out (relevant)
   0:   f000 f800       bl      0x4
````

````sh
echo "00 f0 01 f8" | xxd -r -ps > a.bin && arm-none-eabi-objdump -D -bbinary -marm7tdmi -Mforce-thumb a.bin

# out (relevant)
  0:   f000 f801       bl      0x6
````

And this is the next lowest.

Incrementing the values, it seems the pattern is `"MM fQ NN fP"` it would be `+ 2*NN + 0x100 * MM ` and `Q <= 8` for it to be recognized as `bl`.  `P >= 8` for positive values.

`4 + 2*NN + 0x100 * MM + (P-8) * 0x200 + Q * 0x100000`

So for example with

````
0:   f03d fec1       bl      0x3dd86
````

`3d f0 c1 fe` $\to$

It's also tipping around some values, as it's a signed number.

2025-12-20 Wk 51 Sat - 04:05 +03:00

Let's check again from [ARM7TDMI docs](https://www.dwedit.org/files/ARM7TDMI.pdf), section `5.19 Format 19: long branch with link`,

So it clarifies that it is a 23-bit signed word split between two instructions with the same magic but differing `H`. first with `H=0` and then with `H=1`, and also with bit 0 must be 0 in the second instruction. The first 11 bits of the first instruction are shifted by 12, and the second insrtruction's 11 bits are left shifted by 1 and added to the first.

````
|_15|_14|_13|_12|_11|_10|_9_|_8_|_7_|_6_|_5_|_4_|_3_|_2_|_1_|_0_|
|_1___1___1___1_|_1_|______________Offset_Low/High______________|

|_15|_14|_13|_12|_11|_10|_9_|_8_|_7_|_6_|_5_|_4_|_3_|_2_|_1_|_0_|
|_1___1___1___1_|_0_|______________Offset_Low/High__________|_0_|
````

The instructions need to appeal to this format.

Let's try again with `ff f7 f0 ff`:

````sh
dd skip=$(python3 -c "print(0x34CB8)") count=$(python3 -c "print(6)") if=bn6f.gba of=a.bin bs=1
arm-none-eabi-objdump -D -bbinary -marm7tdmi -Mforce-thumb a.bin

00000000 <.data>:
   0:   f7ff fff0       bl      0xffffffe4
````

````
# .hword 0xf7ff
|_15|_14|_13|_12|_11|_10|_9_|_8_|_7_|_6_|_5_|_4_|_3_|_2_|_1_|_0_|
|_1___1___1___1_|_0_|______________Offset_Low/High______________|
  1   1   1   1   0   1   1   1   1   1   1   1   1   1   1   1

# .hword 0xfff0
|_15|_14|_13|_12|_11|_10|_9_|_8_|_7_|_6_|_5_|_4_|_3_|_2_|_1_|_0_|
|_1___1___1___1_|_1_|______________Offset_Low/High__________|_0_|
  1   1   1   1   1   1   1   1   1   1   1   1   0   0   0   0
````

(update)

2025-12-20 Wk 51 Sat - 05:48 +03:00

The last bit in the second instruction can be 0 or 1, not just 0. They meant bit 0 is ignored/zero probably because of the shift `<<1` and not in the format. So the format specifies the later 22-bits

(/update)

`0b11111111111 << 12`  + `11111110000 << 1` = `0b11111111111111111100000` = `0b[1 *1]111 1111 1111 1111 1110 0000` = `0xffffe0`

`*1`:  left extension of a signed number is `1`, and not `0`.

They also explain

````
The branch offset must take account of the prefetch operation, which causes the PC
to be 1 word (4 bytes) ahead of the current instruction
````

so it could be `0xffffe0 + 4` = `0xffffe4`, or if extended to an i32 `0xffffffe4`

````sh
python3 -c "print(hex(0xffffffe0 - 0x100000000))" # -0x20
python3 -c "print(hex(0xffffffe4 - 0x100000000))" # -0x1c
````

We could also compute this with

````sh
python3 -c "print(hex(((0xf7ff & 0x07ff) << 12) | ((0xfff0 & 0x07ff) << 1) + 4))" # 0x7fffe4
````

Keeping in mind that the `7` in the end is due to false 0 extension in the case of a negative value.

2025-12-20 Wk 51 Sat - 04:56 +03:00

So what about this case for `3d f0 c1 fe`:

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
dd skip=$(python3 -c "print(0x61B7E)") count=$(python3 -c "print(0x8061B84 - 0x8061B7E)") if=bn6f.gba of=a.bin bs=1
arm-none-eabi-objdump -D -bbinary -marm7tdmi -Mforce-thumb a.bin

# out (relevant)
00000000 <.data>:
   0:   f03d fec1       bl      0x3dd86
   4:   bdf0            pop     {r4, r5, r6, r7, pc}
````

````sh
python3 -c "print(hex(((0xf03d & 0x07ff) << 12) | ((0xfec1 & 0x07ff) << 1) + 4))" # 0x3dd86
````

We get the same value!

Now we just have to account for the presentation of that value being shifted based on our choice of dumping ea.

Like in this case, the `bl` occurs in position `0x12`.

````sh
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
````

````sh
python3 -c "print(hex(((0xf03d & 0x07ff) << 12) | ((0xfec1 & 0x07ff) << 1) + 4 + 0x12))" # 0x3dd98
````

2025-12-20 Wk 51 Sat - 05:15 +03:00

So now we can consider the case from the point of view of the instruction rather than its representation. So rather than `0x3dd98`, shift by the ea of the instruction to get

````sh
python3 -c "print(hex(0x3dd98 - 0x12))" # 0x3dd86
````

Now we ask if `0x3dd86` is positive or negative. There's a nice intuition about 2's compliment in this [class notes](https://www.cs.cornell.edu/~tomf/notes/cps104/twoscomp.html) and as mentioned in this [post](https://builtin.com/articles/twos-complement) for an n-bit signed integer system, its values range from $-2^{n-1}$ to $2^{n-1}-1$ . So this can give us the boundary. We know that we have a 23-bit signed integer here, so its boundary is at $2^{22}$  = `'0x400000'`

So we have `0x7fffe4 > 0x400000` hence we conclude that `0x7fffe4` is a negative number, and we can get its value via $2^{23}$  - `0x7fffe4` which corresponds to negative `0x1c`.

2025-12-20 Wk 51 Sat - 05:38 +03:00

`0x3dd86` is not greater than $2^{22}$ so it has to be positive

But this would mean that we are pointing to

````sh
python3 -c "print(hex(0x8061B84 + 0x12 + 0x3dd86))" # 0x809f91c
````

(remove)
2025-12-20 Wk 51 Sat - 05:46 +03:00

~~which is greater than `.fill`:~~

````
087fe36c l 00000000 .fill
````

~~So what's happening?~~

````
  12:   f03d fec1       bl      0x3dd98
````

````
# .hword 0xf03d
|_15|_14|_13|_12|_11|_10|_9_|_8_|_7_|_6_|_5_|_4_|_3_|_2_|_1_|_0_|
|_1___1___1___1_|_0_|______________Offset_Low/High______________|
  1   1   1   1   0   0   0   0   0   0   1   1   1   1   0   1

# .hword 0xfec1
|_15|_14|_13|_12|_11|_10|_9_|_8_|_7_|_6_|_5_|_4_|_3_|_2_|_1_|_0_|
|_1___1___1___1_|_1_|______________Offset_Low/High______________|
  1   1   1   1   1   1   1   0   1   1   0   0   0   0   0   1
````

`00000111101` `11011000001` `0` $\to$ `[0]000 0011 1101 1101 1000 0010`  $\to$ `0x03dd82`

So in the format also there's no indication this should be negative. The greatest symbol we have is `dword_87FB2F4`

(/remove)

2025-12-20 Wk 51 Sat - 06:09 +03:00

Okay so I just misread the values. `0x809f91c` \< `0x087fe36c` so we have no problem.
