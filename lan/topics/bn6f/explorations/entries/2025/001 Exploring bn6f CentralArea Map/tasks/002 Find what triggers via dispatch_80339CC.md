---
parent: '[[001 Exploring bn6f CentralArea Map]]'
spawned_by: '[[000 Wk 41 Exploring bn6f CentralArea Map]]'
context_type: task
status: done
---

Parent: [001 Exploring bn6f CentralArea Map](../001%20Exploring%20bn6f%20CentralArea%20Map.md)

Spawned by: [000 Wk 41 Exploring bn6f CentralArea Map](../entries/000%20Wk%2041%20Exploring%20bn6f%20CentralArea%20Map.md)

Spawned in: [<a name="spawn-task-84f66e" />^spawn-task-84f66e](../entries/000%20Wk%2041%20Exploring%20bn6f%20CentralArea%20Map.md#spawn-task-84f66e)

# 1 Journal

2025-10-11 Wk 41 Sat - 10:46 +03:00

Triggers should be using `eS2011E30`. This is loaded in the pool of

````
doPETEffect_8033fc0
dispatch_80339CC
sub_8033978
sub_8033948
````

2025-10-11 Wk 41 Sat - 10:49 +03:00

````c
// in fn doPETEffect_8033fc0
// trigger ? via dispatch_80339CC
mov r1, #0
strb r1, [r5,#oS2011E30_Unk_07]
strb r0, [r5,#oS2011E30_Idx_04]
````

2025-10-11 Wk 41 Sat - 11:04 +03:00

````C
// in fn gfxTransfer_8033978
// Doesn't do anything with this
ldr r5, off_8033A78 // =eS2011E30
````

2025-10-11 Wk 41 Sat - 11:06 +03:00

(update)
So the only external trigger we found is `doPETEffect_8033fc0`

2025-10-11 Wk 41 Sat - 11:45 +03:00

No I found another

````C
// in fn sub_8033948
// trigger ? via dispatch_80339CC if internet
// trigger sub_8033A96 via dispatch_80339CC if real world
mov r0, #1
strb r0, [r5,#oS2011E30_Idx_04]
````

(/update)

If we're in the real world and not an internet map,

````C
// in fn dispatch_80339CC
ldrb r4, [r5,#oS2011E30_Idx_04]
cmp r4, #0
beq loc_8033A00
````

This would have to be true, so it goes to

````C
// in fn dispatch_80339CC
ldr r0, off_8033A18 // =JumpTable8033A1C
ldr r0, [r0,r4]
mov lr, pc
bx r0
````

which loads the first callback, an empty stub that does nothing.

But if we're in the internet,

````C
// in fn dispatch_80339CC
ldr r0, off_8033A48 // =JumpTableInternet8033A4C
ldrb r1, [r5,#oS2011E30_Idx_04]
lsl r1, r1, #3
ldr r0, [r0,r1]
mov lr, pc
bx r0
````

`r1` would be 0, so it would have to call `sub_8033B08`

2025-10-11 Wk 41 Sat - 11:13 +03:00

````diff
// in fn doPETEffect_8033fc0
-// trigger ? via dispatch_80339CC
+// trigger sub_8033B08 via dispatch_80339CC
mov r1, #0
strb r1, [r5,#oS2011E30_Unk_07]
strb r0, [r5,#oS2011E30_Idx_04]
````

This `doPETEffect_8033fc0` is pretty popular...

This `sub_8033B08` is also a stub. It does nothing!

2025-10-11 Wk 41 Sat - 11:18 +03:00

Let's break on all the callbacks of `dispatch_80339CC` and see when they break.

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
mgba bn6f.elf -g &; gdb-multiarch bn6f.elf \
	-ex "target remote localhost:2345" \
	-ex "b noop_8033A7C" \
	-ex "b sub_8033A80" \
	-ex "b sub_8033A96" \
	-ex "b sub_8033AB0" \
	-ex "b sub_8033AC4" \
	-ex "b sub_8033ADC" \
	-ex "b sub_8033AF0" \
	-ex "b sub_8033A96" \
	-ex "b sub_8033A96" \
	-ex "b sub_8033A80" \
	-ex "b sub_8033A80" \
	-ex "b noop_8033B08" \
	-ex "b sub_8033B0C" \
	-ex "b sub_8033B1E" \
	-ex "b sub_8033B30" \
	-ex "b sub_8033B46" \
	-ex "b sub_8033B5C" \
	-ex "b sub_8033B6E" \
	-ex "b sub_8033B1E" \
	-ex "b sub_8033B1E" \
	-ex "b sub_8033B0C" \
	-ex "b sub_8033B0C" \
	-ex "c"
	
# in gdb

# Breaks after pressing "Continue" in start screen, on black screen (save with MegaMan in Lan's HP)

# out
Breakpoint 14, sub_8033B1E () at ./asm/asm03_1_0.s:365
365             push {lr}
(gdb) bt
#0  sub_8033B1E () at ./asm/asm03_1_0.s:365
#1  0x08033a16 in dispatch_80339CC () at ./asm/asm03_1_0.s:237
Backtrace stopped: previous frame identical to this frame (corrupt stack?)
# /out

c

# sub_8033B1E breaks indefinitely
````

2025-10-11 Wk 41 Sat - 11:34 +03:00

Let's also check for writes to `oS2011E30_Idx_04` which is at

````sh
python3 -c "print(hex(0x2011E30 + 0x4))"

# out
0x2011e34
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
mgba bn6f.elf -g &; gdb-multiarch bn6f.elf \
	-ex "target remote localhost:2345" \
	-ex "b noop_8033A7C" \
	-ex "b sub_8033A80" \
	-ex "b sub_8033A96" \
	-ex "b sub_8033AB0" \
	-ex "b sub_8033AC4" \
	-ex "b sub_8033ADC" \
	-ex "b sub_8033AF0" \
	-ex "b sub_8033A96" \
	-ex "b sub_8033A96" \
	-ex "b sub_8033A80" \
	-ex "b sub_8033A80" \
	-ex "b noop_8033B08" \
	-ex "b sub_8033B0C" \
	-ex "b sub_8033B1E" \
	-ex "b sub_8033B30" \
	-ex "b sub_8033B46" \
	-ex "b sub_8033B5C" \
	-ex "b sub_8033B6E" \
	-ex "b sub_8033B1E" \
	-ex "b sub_8033B1E" \
	-ex "b sub_8033B0C" \
	-ex "b sub_8033B0C" \
	-ex "watch *0x2011e34" \
	-ex "c"
	
# in gdb

# Breaks after pressing "Continue" in start screen, on black screen (save with MegaMan in Lan's HP)

# out
Old value = 0
New value = 1
sub_8033948 () at ./asm/asm03_1_0.s:137
137             bl gfxTransfer_8033978 // () -> ()
# /out

bt

# This is on a trigger I missed in sub_8033948

# out
#0  sub_8033948 () at ./asm/asm03_1_0.s:137
#1  0x0800520a in EnterMap () at ./asm/asm00_1.s:4061
#2  0x080050fc in cbGameState_80050EC () at ./asm/asm00_1.s:3952
Backtrace stopped: previous frame identical to this frame (corrupt stack?)
# /out

c

# out
Breakpoint 3, sub_8033A96 () at ./asm/asm03_1_0.s:290
290             push {lr}
# /out

# breaks indefinitely on sub_8033A96
````

2025-10-11 Wk 41 Sat - 11:56 +03:00

Let's exclude `onUpdate_8033B1E` and `onUpdate_8033A96`, both of which duplicate 3 times.

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
make clean && make -j$(nproc) assets && make -j$(nproc);

# out (relevant)
bn6f.gba: OK
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
mgba bn6f.elf -g &; gdb-multiarch bn6f.elf \
	-ex "target remote localhost:2345" \
	-ex "b noop_8033A7C" \
	-ex "b sub_8033A80" \
	-ex "b sub_8033AB0" \
	-ex "b sub_8033AC4" \
	-ex "b sub_8033ADC" \
	-ex "b sub_8033AF0" \
	-ex "b sub_8033A80" \
	-ex "b sub_8033A80" \
	-ex "b noop_8033B08" \
	-ex "b sub_8033B0C" \
	-ex "b sub_8033B30" \
	-ex "b sub_8033B46" \
	-ex "b sub_8033B5C" \
	-ex "b sub_8033B6E" \
	-ex "b sub_8033B0C" \
	-ex "b sub_8033B0C" \
	-ex "watch *0x2011e34" \
	-ex "c"
	
# in gdb

# Breaks after pressing "Continue" in start screen, on black screen (save with MegaMan in Lan's HP)

# out
Hardware watchpoint 17: *0x2011e34

Old value = 0
New value = 1
sub_8033948 () at ./asm/asm03_1_0.s:141
141             bl gfxTransfer_8033978 // () -> ()
# /out

c

# Breaks when leaving Lan's Room, on black screen

# out
Hardware watchpoint 17: *0x2011e34

Old value = 1
New value = 0
0x0000023c in ?? ()
# /out

bt

# out
#0  0x0000023c in ?? ()
#1  0x000000a4 in ?? ()
Backtrace stopped: previous frame identical to this frame (corrupt stack?)
# /out

# When breaking on Jack in to Lan's HP, white screen &&
# When going out of a menu back to Lan's HP &&
# When going out progman mail back to Lan's HP &&
# When going to a warp

# out
Hardware watchpoint 17: *0x2011e34

Old value = 0
New value = 1
0x08033974 in sub_8033948 () at ./asm/asm03_1_0.s:141
141             bl gfxTransfer_8033978 // () -> ()
# /out

bt

# out
#0  0x08033974 in sub_8033948 () at ./asm/asm03_1_0.s:141
#1  0x0800520a in EnterMap () at ./asm/asm00_1.s:4061
#2  0x080050fc in cbGameState_80050EC () at ./asm/asm00_1.s:3952
Backtrace stopped: previous frame identical to this frame (corrupt stack?)
# /out
````
