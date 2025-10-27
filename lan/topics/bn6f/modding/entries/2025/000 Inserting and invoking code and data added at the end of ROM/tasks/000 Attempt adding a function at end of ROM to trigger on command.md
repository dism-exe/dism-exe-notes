---
parent: '[[000 Inserting and invoking code and data added at the end of ROM]]'
spawned_by: '[[000 Inserting and invoking code and data added at the end of ROM]]'
context_type: task
status: done
---

Parent: [000 Inserting and invoking code and data added at the end of ROM](../000%20Inserting%20and%20invoking%20code%20and%20data%20added%20at%20the%20end%20of%20ROM.md)

Spawned by: [000 Inserting and invoking code and data added at the end of ROM](../000%20Inserting%20and%20invoking%20code%20and%20data%20added%20at%20the%20end%20of%20ROM.md)

Spawned in: [<a name="spawn-task-bf0177" />^spawn-task-bf0177](../000%20Inserting%20and%20invoking%20code%20and%20data%20added%20at%20the%20end%20of%20ROM.md#spawn-task-bf0177)

# 1 Journal

2025-10-12 Wk 41 Sun - 08:02 +03:00

````C
// in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/rom.s
  thumb_func_start end_rom_tmp_1
end_rom_tmp_1:
  push {lr}

  ldr r0, =TextScriptBattleRunDialog
  bl chatbox_runScript // (archive: *const TextScriptArchive, script_idx: u8) -> ()

  pop {pc}
  .pool
  thumb_func_end end_rom_tmp_1
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
make clean && make -j$(nproc) assets && make -j$(nproc);
````

Even adding content at the end of the ROM produces white screen on reset

2025-10-12 Wk 41 Sun - 08:19 +03:00

````diff
// in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/ld_script.ld
MEMORY
{
    ewram_region (w!x) : ORIGIN = 0x02000000, LENGTH = 0x40000
    iwram_region (w!x) : ORIGIN = 0x03000000, LENGTH = 0x8000
-    rom_region (rx) : ORIGIN = 0x08000000, LENGTH = 0x800000
+    rom_region (rx) : ORIGIN = 0x08000000, LENGTH = 0x1600000
}
````

We can increase this, but it won't affect the white screen on adding content to the end of ROM.

2025-10-12 Wk 41 Sun - 08:23 +03:00

````C
// in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/ld_script.ld
.rodata :
ALIGN(4)
{
	data.o(.rodata);
} >rom_region
````

We should be at the end of `data.s` not `rom.s`.

````C
// in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/data.s
  thumb_func_start end_rom_tmp_1
end_rom_tmp_1:
  push {lr}

  ldr r0, =TextScriptBattleRunDialog
  bl chatbox_runScript // (archive: *const TextScriptArchive, script_idx: u8) -> ()

  pop {pc}
  .pool
  thumb_func_end end_rom_tmp_1
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
make clean && make -j$(nproc) assets && make -j$(nproc);

# out (error, relevant)
tools/binutils/bin/arm-none-eabi-ld -Map bn6f.map -o bn6f.elf -T ld_script.ld rom.o data.o ewram.o iwram.o
tools/binutils/bin/arm-none-eabi-ld: data.o: in function `end_rom_tmp_1':
/home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/data.s:901:(.data+0x138b64): relocation truncated to fit: R_ARM_THM_CALL against symbol `chatbox_runScript' defined in .text section in rom.o
make: *** [Makefile:55: %.elf] Error 1
(
````

2025-10-12 Wk 41 Sun - 08:28 +03:00

Hmm. Let's add our own modding region as text

````C
// in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/ld_script.ld
.modding_text :
{
	modding.o(.text);
} >rom_region
````

````C
// in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/modding.s
	.include "include/macros.inc"
	.include "constants/constants.inc"

	.text
	
	.syntax divided

  thumb_func_start end_rom_tmp_1
end_rom_tmp_1:
  push {lr}

  ldr r0, =TextScriptBattleRunDialog
  bl chatbox_runScript // (archive: *const TextScriptArchive, script_idx: u8) -> ()

  pop {pc}
  .pool
  thumb_func_end end_rom_tmp_1
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
make clean && make -j$(nproc) assets && make -j$(nproc);

# out (error, relevant)
tools/binutils/bin/arm-none-eabi-ld -Map bn6f.map -o bn6f.elf -T ld_script.ld rom.o data.o ewram.o iwram.o 
tools/binutils/bin/arm-none-eabi-ld: cannot find modding.o
````

````diff
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/Makefile
-SFILES = rom.s data.s ewram.s iwram.s
+SFILES = rom.s data.s ewram.s iwram.s modding.s
````

2025-10-12 Wk 41 Sun - 08:38 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
make clean && make -j$(nproc) assets && make -j$(nproc);
````

It loads!

2025-10-12 Wk 41 Sun - 09:06 +03:00

We can follow a similar hooking process to [gh LanHikari22/bn6f-modding main.s hook](https://github.com/LanHikari22/bn6f-modding/blob/9c17160b15ecb648eb5496a426e3f8d7da2d152b/asm/main.s#L31) for making this work with C again, but for now, we want to simply call `end_rom_tmp_1`, which we will rename to `main_hook`, which will be like in [gh LanHikari22/bn6f-modding mainHook.s ](https://github.com/LanHikari22/bn6f-modding/blob/9c17160b15ecb648eb5496a426e3f8d7da2d152b/asm/mainHook.s)

2025-10-12 Wk 41 Sun - 09:21 +03:00

````C
// in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/modding.s
  thumb_func_start main_hook
main_hook:
    // Do Overwritten Code
    ldr r0, =main_jt_subsystem
    mov r1, r10
    ldr r1, [r1]
    ldrb r1, [r1]
    ldr r0, [r0,r1]
    mov lr, pc
    bx r0

    // Link elsewhere!
  	push {r0-r7}
  	ldr r0, =modding_main
    mov r1, pc
    add r1, #5
    mov lr, r1
  	bx r0
  	pop {r0-r7}

  	pop {pc} // Bye!
thumb_func_end main_hook
````

Hmm, why was it made as a section though

````
.section .mainHook, "ax"
````

From [developer.arm.com Section directives](https://developer.arm.com/documentation/dui0774/i/armclang-Integrated-Assembler-Directives/Section-directives?lang=en),

|Flag|Meaning|
|----|-------|
|`a`|SHF_ALLOC: the section is allocatable.|
|`x`|SHF_EXECINSTR: the section is executable.|

2025-10-12 Wk 41 Sun - 09:37 +03:00

````C
// in @tmp fn main_
// hook to modding.s
    ldr r1, =main_hook+1
    mov lr, pc
    bx r1
    b main_endHook
    .pool
main_endHook:
// (*main_subsystemJumptable[*tk->oToolkit_MainJumptableIndexPtr])()
//	ldr r0, off_8000348 // =main_subsystemJumpTable
//	mov r1, r10
//	ldr r1, [r1,#oToolkit_MainJumptableIndexPtr]
//	ldrb r1, [r1]
//	ldr r0, [r0,r1]
//	mov lr, pc
//	bx r0

// in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/modding.s
	.include "include/macros.inc"
	.include "constants/constants.inc"

	.text
	
	.syntax divided

  thumb_func_start main_hook
main_hook:
  // Do Overwritten Code
  // *main_subsystemJumptable[*tk->oToolkit_MainJumptableIndexPtr])()
  ldr r0, =main_subsystemJumpTable
  mov r1, r10
  ldr r1, [r1,#oToolkit_MainJumptableIndexPtr]
  ldrb r1, [r1]
  ldr r0, [r0,r1]
  mov lr, pc
  bx r0

  // Link elsewhere!
  push {r0-r7}
  ldr r0, =modding_main+1
  mov r1, pc
  add r1, #5
  mov lr, r1
  bx r0
  pop {r0-r7}

  pop {pc} // Bye!
  .pool
  thumb_func_end main_hook


  thumb_func_start modding_main
modding_main:

  push {lr}

  //ldr r0, =TextScriptBattleRunDialog
  //bl chatbox_runScript // (archive: *const TextScriptArchive, script_idx: u8) -> ()

  pop {pc}
  .pool
  thumb_func_end modding_main
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
make clean && make -j$(nproc) assets && make -j$(nproc);
````

We're back to white screen on reset.

2025-10-12 Wk 41 Sun - 09:46 +03:00

Adding filler `add r0, r0, #0` after hook doesn't help, and after 4, mgba report invalid jump errors.

````C
// in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/bn6f.map
 .text          0x086c5818       0x18 modding.o
                0x086c5818                main_hook
                0x086c582c                modding_main
````

Instead of using the pool, maybe we can construct the `main_hook+1` address in `main.s`

Though it just adds `.pool` right at `main_endHook` so it's not necessary.

2025-10-12 Wk 41 Sun - 10:00 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
mgba bn6f.elf -g &; gdb-multiarch bn6f.elf -ex "target remote localhost:2345"

# in gdb

b main_
c

# out
Breakpoint 1, main_ () at ./asm/main.s:4
4               bl main_initToolkitAndOtherSubsystems // () -> ()
# /out

# stepping through main_

# src
// hook to modding.s
ldr r0, =main_hook+1
mov lr, pc
==> bx r0
# /src

n

# out
Program received signal SIGILL, Illegal instruction.
0x00000004 in ?? ()
# /out


# src
// hook to modding.s
ldr r0, =main_hook+1
==> mov lr, pc
bx r0
# /src

info reg

# out
r0             0x86c580d           141318157
r1             0x14988f0           21596400
r2             0x0                 0
r3             0x2001c04           33561604
r4             0xfffffc00          4294966272
r5             0xffffffff          4294967295
r6             0x0                 0
r7             0x1                 1
r8             0x0                 0
r9             0x0                 0
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x449f0             281072
sp             0x3007e00           0x3007e00
lr             0x800030f           134218511
pc             0x8000310           0x8000310 <main_+84>
cpsr           0x8000003f          -2147483585
# /out

# src
// hook to modding.s
ldr r0, =main_hook+1
mov lr, pc
==> bx r0
# /src

s

# out
main_hook () at modding.s:12
12        ldr r0, =main_subsystemJumpTable
# /out

# src
main_hook:
  // Do Overwritten Code
  // *main_subsystemJumptable[*tk->oToolkit_MainJumptableIndexPtr])()
  ldr r0, =main_subsystemJumpTable
  mov r1, r10
  ldr r1, [r1,#oToolkit_MainJumptableIndexPtr]
  ldrb r1, [r1]
  ldr r0, [r0,r1]
  mov lr, pc
  bx r0

==>  pop {pc} // Bye!
# /src

info reg

# out
r0             0xb3                179
r1             0x12                18
r2             0x46a               1130
r3             0x86c41d0           141312464
r4             0xfffffc00          4294966272
r5             0xffffffff          4294967295
r6             0x0                 0
r7             0x1                 1
r8             0x0                 0
r9             0x0                 0
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x449f0             281072
sp             0x3007e00           0x3007e00
lr             0x803e94b           134474059
pc             0x86c581a           0x86c581a <main_hook+14>
cpsr           0x2000003f          536870975
# /out

````

````C
// in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/bn6f.map
 .text          0x086c580c       0x18 modding.o
                0x086c580c                main_hook
                0x086c5820                modding_main
````

2025-10-12 Wk 41 Sun - 10:21 +03:00

We're doing a `pop {pc}` and forgot to do a `push {lr}`.

````diff
// in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/modding.s
  thumb_func_start main_hook
main_hook:
+  push {lr} // Hi!

  // Do Overwritten Code
  // *main_subsystemJumptable[*tk->oToolkit_MainJumptableIndexPtr])()
  ldr r0, =main_subsystemJumpTable
  mov r1, r10
  ldr r1, [r1,#oToolkit_MainJumptableIndexPtr]
  ldrb r1, [r1]
  ldr r0, [r0,r1]
  mov lr, pc
  bx r0

  // Link elsewhere!
  push {r0-r7}
  ldr r0, =modding_main+1
  mov r1, pc
  add r1, #5
  mov lr, r1
  bx r0
  pop {r0-r7}

  pop {pc} // Bye!

  .pool
  thumb_func_end main_hook
````

2025-10-12 Wk 41 Sun - 10:27 +03:00

Now the hook works!

Let's do something cool on pressing `L`.

We can follow a similar process to [gh LanHikari22/bn6f-modding cMain](https://github.com/LanHikari22/bn6f-modding/blob/9c17160b15ecb648eb5496a426e3f8d7da2d152b/src/main.c#L39) for triggering with `toolkit->joystick->keyPress`

2025-10-12 Wk 41 Sun - 10:41 +03:00

Find the `enum JoypadFlags` flags in [gh dism-exe/bn6f Joypad.inc JoypadFlags](https://github.com/dism-exe/bn6f/blob/0b30a62f68f2e80546686ba1e03ee51ba317191b/include/structs/Joypad.inc#L2)

2025-10-12 Wk 41 Sun - 10:49 +03:00

````
modding.s:42: Error: lo register required -- `ldr r5,[r10,#oToolKit_JoypadPtr]'
````

Yeah that's why they always move `r10` into a low register.

2025-10-12 Wk 41 Sun - 11:12 +03:00

Actually, our hook is crashing on Jacking in to Lan's HP (Homepage!).

Let's check the address of `main_subsystemJumpTable`, it should remain the same across `bn6f` and `bn6f@tmp`.

````C
// in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/bn6f.map
0x0800034c                main_subsystemJumpTable

// in /home/lan/src/cloned/gh/dism-exe/bn6f/bn6f.map
[nothing]
````

Right, bad example since `main_subsystemJumpTable` is private in `bn6f`

````C
// in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/bn6f.map
0x080005ac                call_m4aSoundMain

// in /home/lan/src/cloned/gh/dism-exe/bn6f/bn6f.map
0x080005ac                call_m4aSoundMain
````

They're identical!

So it's likely not due to shifting that we crash.

It's interesting the map works, and we only crash on jack in or entering a menu on the map, or trigger some `EnterMap` event in some way.

2025-10-12 Wk 41 Sun - 11:33 +03:00

Actually, leaving the room does not trigger it even though that's changing the map.

After the crash, gdb points to `sub_3005CDA` as the last thing in the backtrace. This function runs on update.

Might be a false signal, we do not get this from gdb when crashing again on PET enter menu.

There's no backtrace to discern there, though we find `0x3005b30` in `$lr`.

2025-10-13 Wk 42 Mon - 03:47 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
mgba bn6f.elf -g &; gdb-multiarch bn6f.elf -ex "target remote localhost:2345"

# in gdb

b loc_800032A
c

info reg

# out
r0             0x0                 0
r1             0x1                 1
r2             0x10                16
r3             0x1                 1
r4             0xfffffc00          4294966272
r5             0xffffffff          4294967295
r6             0x0                 0
r7             0x1                 1
r8             0x0                 0
r9             0x0                 0
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x449f0             281072
sp             0x3007e00           0x3007e00
lr             0x80064bd           134243517
pc             0x800032a           0x800032a <main_+110>
cpsr           0x6000003f          1610612799
# /out
````

2025-10-13 Wk 42 Mon - 03:56 +03:00

By breaking on `SubMenuControl` and then on a called `sub_812345C` we learned that a sigill due to an illegal instruction happens at `chipFolder_initGfx_812386C`, and from there in `decompAndCopyData`

2025-10-13 Wk 42 Mon - 04:02 +03:00

Spawn [000 Unable to put modding text after data.o](../issues/000%20Unable%20to%20put%20modding%20text%20after%20data.o.md) <a name="spawn-issue-398756" />^spawn-issue-398756

2025-10-13 Wk 42 Mon - 13:11 +03:00

Spawn [002 Find Unused RAM locations for modding](002%20Find%20Unused%20RAM%20locations%20for%20modding.md) <a name="spawn-task-4b4a27" />^spawn-task-4b4a27

2025-10-13 Wk 42 Mon - 13:52 +03:00

Awesome! Our first mod of triggering asm on a command works! If you now press SELECT SELECT, MegaMan asks you if you want to Run, no matter where you are.

This means that asm modding is available again. Let's put the content of `bn6f@tmp` in `bn6f-modding`,

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn6f-modding
rm -rf *
cp -r ~/src/cloned/gh/dism-exe/branches/bn6f@tmp/* ~/src/cloned/gh/LanHikari22/bn6f-modding
cp -r ~/src/cloned/gh/dism-exe/branches/bn6f@tmp/.gitignore ~/src/cloned/gh/LanHikari22/bn6f-modding
````

![Pasted image 20251013140049.png](../../../../../../../../attachments/Pasted%20image%2020251013140049.png)

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn6f-modding
[master 9e6579a] Modding back online with latest bn6f dism source                              
 2103 files changed, 1552374 insertions(+), 475018 deletions(-)
````

2025-10-13 Wk 42 Mon - 15:27 +03:00

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn6f-modding
git checkout -b expt000_code_on_command_s
````

Modified to add `_s`.  since this is an asm mod. This is to distinguish from `_c` for C mods and `_rs` for Rust mods.

2025-10-13 Wk 42 Mon - 16:46 +03:00

````
# in /home/lan/src/cloned/gh/LanHikari22/bn6f-modding
git commit -m "update README.md with experiment desc"

# out
[expt000_code_on_command_s b0eaeda] update README.md with experiment desc
 1 file changed, 7 insertions(+)
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22
cp -r bn6f-modding branches/bn6f-modding@expt000_code_on_command_s
````
