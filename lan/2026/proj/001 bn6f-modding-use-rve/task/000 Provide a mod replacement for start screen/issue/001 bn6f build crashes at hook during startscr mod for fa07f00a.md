---
context_type: issue
status: todo
---

Parent: [lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/000 Provide a mod replacement for start screen](../000%20Provide%20a%20mod%20replacement%20for%20start%20screen.md)

Spawned by: [lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/task/000 Replace Start Screen module with a module that reports via chatbox unimplemented in asm](../task/000%20Replace%20Start%20Screen%20module%20with%20a%20module%20that%20reports%20via%20chatbox%20unimplemented%20in%20asm.md)

Spawned in: [^spawn-issue-a1bd8d](../task/000%20Replace%20Start%20Screen%20module%20with%20a%20module%20that%20reports%20via%20chatbox%20unimplemented%20in%20asm.md#spawn-issue-a1bd8d)

# Resolution

We used `bl` for mod targets which were too far, and that caused the assembly to generate `__funcname_veneer` functions. In particular in our case, from `bn6f.sym`:

````
081d6000 g 00000000 IWRAMRoutines
081d6000 g 00000000 IWRAMRoutinesROMLocation
081d6000 l 00000010 __mod_startscr_init_veneer
````

This caused a shift added right at the end of `rom.s`. The `fa07f00a` crash is due to erratic behavior by the emulator, which started at an earlier place in `RandomizeExtraToolkitPointers -> copyWords_80014EC` which copies game state.

The exact false positive/negative pointers causing this shift problem are unknown. The crash itself can be prevented by replacing the `bl` with a `bx` for uses of `startscr_init_veneer`.

TODO

# Journal

2026-08-01 Wk 31 Sat - 10:16 +03:00

Now we build but immediately crash

````sh
# in /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
mgba bn6f.elf

# out (error)
GBA Memory: Jumped to invalid address: FA07F00A
GBA: Illegal opcode: e710b710
GBA Memory: Jumped to invalid address: FA07F00A
GBA: Illegal opcode: e710b710
GBA Memory: Jumped to invalid address: FA07F00A
GBA: Illegal opcode: e710b710
The game crashed!
````

````sh
# in /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
mgba bn6f.elf -g &
gdb bn6f.elf \
	-ex "target remote localhost:2345" \
	-ex "b mod_startscr_init" \
	-ex "b mod_startscr_render" \
	-ex "b mod_startscr_init_gfx" \
	-ex "b mod_startscr_off04" \
	-ex "b mod_startscr_off08" \
	-ex "b mod_startscr_load_game"

# in gdb
c
````

````
(gdb) c
Continuing.
GBA Memory: Jumped to invalid address: FA07F00A
The game crashed!
Debugger: > $W00#b7
[Inferior 1 (Remote target) exited normally]
````

Even before we reach any of them

````sh
# in /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
mgba bn6f.elf -g &
gdb bn6f.elf \
	-ex "target remote localhost:2345" \
	-ex "b main_"

# in gdb
c
s # step until error
````

We hang here:

````
# in asm/main.s > fn main_
(gdb)
34                        ldr r0, =main_hook+1
(gdb)
````

and I end up having to process kill mgba.

````
# in bn6f.map
                0x087fe3f0                main_hook
````

Modified it so it gets objdump from the repo and also added `RAW_DUMP` envvar.

2026-08-01 Wk 31 Sat - 10:16 +03:00

So where can we find `FA07F00A` in snippet below?

````
GBA Memory: Jumped to invalid address: FA07F00A
````

This requires installation of checkpipe:

````sh
source ~/.venv/venv_main/bin/activate # must use with source

# in venv_main > /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
export RAW_DUMP=1
~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.sh bn6f.gba bn6f.sym 'None' 'sym:main_' 'sym:off_8000348'

export RAW_DUMP=0
~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.sh bn6f.gba bn6f.sym 'None' 'sym:main_' 'sym:off_8000348'

# out (relevant)
5c:   e3f1            b.n     0x842
5e:   087f            lsrs    r7, r7, #1
60:   f001 f916       bl      0x1290
64:   f00a fa07       bl      0xa476
68:   d001            beq.n   0x6e

         b loc_800031c
        .pool
loc_800031c:
        bl GetRNGSecondary
        bl isSameSubsystem_800A732
        beq loc_800032a
````

It seems to correspond to `64:` or `bl isSameSubsystem_800A732`.

2026-08-01 Wk 31 Sat - 11:02 +03:00

It's more convenient to use `layout asm` in gdb. You can scroll with arrows. and once you did `n`  (next) once, just press `Enter` to advance, unless you want to do something else like `s` (step).

````sh
# in /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
mgba bn6f.elf -g &
gdb bn6f.elf \
	-ex "target remote localhost:2345" \
	-ex "layout asm" \
	-ex "b main_" \
	-ex "c"
````

````
>0x8000314 <main_+88> b.n 0x800031c <main_+96>
0x8000316 <main_+90> mvns r0, #0
0x800031a <main_+94> @ <UNDEFINED> instruction: 0xf001087f │
0x800031e <main_+98> pli [r6, r10] │
0x8000322 <main_+102> @ <UNDEFINED> instruction: 0xfa07d001 │
0x8000326 <main_+106> bl 0x800630a <subsystem_triggerTransition_800630A> │
````

Also I learned you can remove extra spaces easily with `%s/ +/ /g`!

Ok so for example

````
│ 0x800030a <main_+78> bl 0x8000e10 <CapIncrementGameTimeFrames> │
````

Is at `main_+78`, which is `python3 -c "print(hex(78))" # out { 0x4e }`,   which corresponds in our dump to

````sh
source ~/.venv/venv_main/bin/activate # must use with source

# in venv_main > /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
export RAW_DUMP=1
~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.sh bn6f.gba bn6f.sym 'None' 'sym:main_' 'sym:off_8000348'

export RAW_DUMP=0
~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.sh bn6f.gba bn6f.sym 'None' 'sym:main_' 'sym:off_8000348'

# out (relevant)
4e:   f000 fd81       bl      0xb54

bl CapIncrementGameTimeFrames
````

The branch at `main_+88` (`python3 -c "print(hex(88))" # out { 0x58 }`)  should have taken us to `main_+96` (`python3 -c "print(hex(96))" # out { 0x60 }`):

````sh
source ~/.venv/venv_main/bin/activate # must use with source

# in venv_main > /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
export RAW_DUMP=1
~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.sh bn6f.gba bn6f.sym 'None' 'sym:main_' 'sym:off_8000348'

export RAW_DUMP=0
~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.sh bn6f.gba bn6f.sym 'None' 'sym:main_' 'sym:off_8000348'

# out (relevant)
60:   f001 f916       bl      0x1290
64:   f00a fa07       bl      0xa476

        .pool
loc_800031c:
        bl GetRNGSecondary
        bl isSameSubsystem_800A732
````

In here, gdb started skipping every other instruction for some reason:

````
│ >0x8000300 <main_+68> mov r0, r10 │
│ 0x8000302 <main_+70> ldr r0, [r0, #36] @ 0x24 │
│ 0x8000304 <main_+72> ldrh r1, [r0, #0] │
````

We can also do `tui layout src`.

`r0` is not being populated as we expect.

````asm
# in /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f/asm/main.s > fn main_
// advance cur frame
mov r0, r10
````

This is supposed to update `r0` to the value of `0x20093b0` but it does not.

This strange stepping and register non-updating problem does not happen when building with `USE_MODULE_START_SCREEN_ORIG` instead of `USE_MODULE_START_SCREEN_ASM_MOD`, and the game boots fine.

Seems we have to break somewhere, we can't step right from boot:

````sh
# in /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
mgba bn6f.elf -g &
gdb bn6f.elf \
	-ex "target remote localhost:2345" \
	-ex "layout src" \
	-ex "layout reg" \
	-ex "b GameEntryPoint" \
	-ex "c"
````

(interesting)

When you run `finish` in `GameEntryPoint` you get:

````
❌️ "finish" not meaningful in the outermost frame.
````

(/interesting)

Reached `start_800023C`, and when I did `fin` the game crashed with an invalid address `FA07F00A`. I was able to use `fin` fine before.

````sh
# in /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
mgba bn6f.elf -g &
gdb bn6f.elf \
	-ex "target remote localhost:2345" \
	-ex "layout src" \
	-ex "layout reg" \
	-ex "b start_800023C" \
	-ex "c"
````

In fact, right away at this point it seems to already be broken. We are not able to step into a `bl` anymore. So it must have broken prior.

````
# in /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f/asm/start.s
bl start_copyMemory // (void *src, void *dest, int size) -> void
ldr r0, off_8000214 // =SetPrimaryToolkitPointers+1 
mov lr, pc
bx r0
ldr r0, off_8000218 // =RandomizeExtraToolkitPointers+1 
mov lr, pc
bx r0
ldr r0, off_800021C // =start_800023C+1 
mov lr, pc
bx r0
````

````sh
# in /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
mgba bn6f.elf -g &
gdb bn6f.elf \
	-ex "target remote localhost:2345" \
	-ex "layout src" \
	-ex "layout reg" \
	-ex "b GameEntryPoint" \
	-ex "c"
````

We can't `fin` from `RandomizeExtraToolkitPointers -> copyWords_80014EC`

````sh
# in /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
mgba bn6f.elf -g &
gdb bn6f.elf \
	-ex "target remote localhost:2345" \
	-ex "layout src" \
	-ex "layout reg" \
	-ex "b RandomizeExtraToolkitPointers" \
	-ex "c"
````

````asm
# in /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
	// let src: *const u32;
	ldr r0, ToolkitExtraPtrs_eToolkitExtraPtrsMemory_p
	add r0, r0, r3 // src

	// let mut_dest: *mut u32;
	ldr r1, ToolkitExtraPtrs_eToolkitExtraPtrsMemory_p
	add r1, r1, r4

	// let size: u32;
	ldr r2, ToolkitExtraPtrs_ToolkitExtraPtrsMemorySize_p // =0x35bc
  
	// copyWords_80014EC(&sGameState, &sGameState, 0x35BC);
	ldr r3, ToolkitExtraPtrs_copyWords_80014EC_p // =copyWords_80014EC+1
	mov lr, pc
	bx r3
````

So something here is probably responding to the ROM being shifted. Let's test if it was shifted:

Compare `bn6f.sym` against one we know is `OK`:

````sh
# in /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
diff -u bn6f.sym ~/src/cloned/gh/dism-exe/bn6f/bn6f.sym --color=always | less -R

# out (relevant)
-081d6000 l 00000010 __mod_startscr_init_veneer
[+nothing]

-081d8010 g 00000000 battleSpriteMegaMan
+081d8000 g 00000000 battleSpriteMegaMan

-08204118 g 00000000 battleSprite_8204108
+08204108 g 00000000 battleSprite_8204108
````

Treating the lines in both files as a set of lines, let's get the compliment of the intersection of both sets:

````sh
# in /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
export set_orig="$(cat ~/src/cloned/gh/dism-exe/bn6f/bn6f.sym | uniq)"
export set_mod="$(cat bn6f.sym | uniq)"
````

--/ 2026-08-01 Wk 31 Sat - 16:09 +03:00
`entry[t:status=none]` Strange behavior when an export is really long in gentoo linux giving argument list too long

In gentoo linux, when I run

````sh
# in /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
export set_orig="$(cat ~/src/cloned/gh/dism-exe/bn6f/bn6f.sym | uniq)"
````

Then I do an `ls` in the same terminal, I get

````
-bash: /usr/bin/ls: Argument list too long
````

--/

https://stackoverflow.com/a/19214329

We can use `comm` to suppress suppress lines that appear in both files!

````sh
# in /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f

# Suppress (unique-to 1st) and suppress intersect (ie. keep (unique-to 2nd))
comm -13 <(sort bn6f.sym) <(sort ~/src/cloned/gh/dism-exe/bn6f/bn6f.sym) | less
````

Let's obtain a full raw disassembly of the original and modded, and diff.

````sh
source ~/.venv/venv_main/bin/activate # must use with source

# in venv_main > /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f {
export RAW_DUMP=1
~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.sh bn6f.gba bn6f.sym 'None' 'sym:GameEntryPoint' 'sym:.fill' > ~/a
# }

# in venv_main > /home/lan/src/cloned/gh/dism-exe/bn6f {
export RAW_DUMP=1
~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.sh bn6f.gba bn6f.sym 'None' 'sym:GameEntryPoint' 'sym:.fill' > ~/b
# }

diff -u ~/a ~/b --color=always | less -R
````

It includes many single-line diffs, which are often just pointer shift adjustments.

Spawn [lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/task/001 Impl comm-cmds diff-suppress-single-changes](../task/001%20Impl%20comm-cmds%20diff-suppress-single-changes.md) ^spawn-task-1ad42e

2026-08-01 Wk 31 Sat - 18:27 +03:00

Spawn [Python regex does not allow matching by backslash e but accepts backslash x 1b](Python%20regex%20does%20not%20allow%20matching%20by%20backslash%20e%20but%20accepts%20backslash%20x%201b.md) ^spawn-issue-9e0c0a

````sh
source /home/lan/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/comm_cmds.sh
diff -u ~/a ~/b --color=always | comm-cmds diff-suppress-single-changes | less -R
````

Yeah it's not quite enough to suppress the one-line changes and associated changesets. Some get grouped together into multi lines.

What we need to do is specifically parse all changes, look for negative/positive second/third column u16 and u32 data matches, check that one or the other is off by exactly the shift amount, and filter those changes out, and if the changeset only has neutral lines, then filter the entire changeset out.

https://stackoverflow.com/questions/71153978/regex-to-match-x-repeated-exactly-n-times-in-a-row

Back reference with quantifier for repeating regex: `(...)\N{M}`, where `N` starts at 1. But I'm already using capture groups...

something to be aware of: https://www.regular-expressions.info/captureall.html.

We don't need the group. We can just do

````sh
pat = re.compile(r'([0-9a-f]*): *([0-9a-f]{4}) ([0-9a-f]{4})')
pat.match('000: 0000 000f').groups() # out { ('000', '0000', '000f') }
````

````sh
source /home/lan/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/comm_cmds.sh
diff -u ~/a ~/b --color=always | comm-cmds diff-dump-code-remove-pointer-shift-changes 0x10 | less -R
````

Needed to correct the regex to account for the `-/+` at the start:

````python
line1 = DiffOutput.filter_out_color_ansi(line).replace('+', '').replace('-', '').strip()
````

````
Exception: Failed to parse (neg-line -     30e: 4802            ldr     r0, [pc, #8]    ; (0x318))
````

Refining error

````
Exception: Failed to parse (neg-line -     30e: 4802            ldr     r0, [pc, #8]    ; (0x318)) (as-bytes [27, 91, 51, 49, 109, 45, 32, 32, 32, 32, 32, 51, 48, 101, 58, 9, 52, 56, 48, 50, 32, 32, 32, 32, 32, 32, 9, 108, 100, 114, 9, 114, 48, 44, 32, 91, 112, 99, 44, 32, 35, 56, 93, 9, 59, 32, 40, 48, 120, 51, 49, 56, 41, 27, 91, 48, 109])
````

````python
import re

arr = [27, 91, 51, 49, 109, 45, 32, 32, 32, 32, 32, 51, 48, 101, 58, 9, 52, 56, 48, 50, 32, 32, 32, 32, 32, 32, 9, 108, 100, 114, 9, 114, 48, 44, 32, 91, 112, 99, 44, 32, 35, 56, 93, 9, 59, 32, 40, 48, 120, 51, 49, 56, 41, 27, 91, 48, 109]
bstr = bytes(arr)
s = bstr.decode('ascii')
s # out { '\x1b[31m-     30e:\t4802      \tldr\tr0, [pc, #8]\t; (0x318)\x1b[0m' }

pat = re.compile(r'([0-9a-f]*): *([0-9a-f]{4})')

pat.match(s) # out { [nothing] }
````

It's ansi-colored, it cannot be matched on as-is.

````
(ansi-filtered -     30e:       4802            ldr     r0, [pc, #8]    ; (0x318)) (as-bytes [45, 32, 32, 32, 32, 32, 51, 48, 101, 58, 9, 52, 56, 48, 50, 32, 32, 32, 32, 32, 32, 9, 108, 100, 114, 9, 114, 48, 44, 32, 91, 112, 99, 44, 32, 35, 56, 93, 9, 59, 32, 40, 48, 120, 51, 49, 56, 41]
````

````python
import re

arr = [45, 32, 32, 32, 32, 32, 51, 48, 101, 58, 9, 52, 56, 48, 50, 32, 32, 32, 32, 32, 32, 9, 108, 100, 114, 9, 114, 48, 44, 32, 91, 112, 99, 44, 32, 35, 56, 93, 9, 59, 32, 40, 48, 120, 51, 49, 56, 41]
bstr = bytes(arr)
s = bstr.decode('ascii'); s # out { '-     30e:\t4802      \tldr\tr0, [pc, #8]\t; (0x318)' }
s1 = s.replace('-', '').replace('+', '').strip(); s1 # out { '30e:\t4802      \tldr\tr0, [pc, #8]\t; (0x318)' }

pat = re.compile(r'([0-9a-f]*):\s*([0-9a-f]{4})')

pat.match(s) # out { ('30e', '4802') }
````

Some still slip through:

````
-   9806a:      243e            movs    r4, #62 ; 0x3e
+   9806a:      143e            asrs    r6, r7, #16
````

This time the difference is not `0x10` but `0x1000` (`0x10 << 8`)

And then there are also thumb offset changes:

````
-   92766:      083e            lsrs    r6, r7, #32
-   92768:      7cb4            ldrb    r4, [r6, #18]
+   92766:      f83e 7cb3                       ; <UNDEFINED> instruction: 0xf83e7cb3

-   81bd2:      043e            lsls    r6, r7, #16
-   81bd4:      7a4f            ldrb    r7, [r1, #9]
+   81bd2:      f43e 7a4e                       ; <UNDEFINED> instruction: 0xf43e7a4e
````

which we can gaurd against by checking a difference of 1.

These ones are strange:

````
-   81bd2:      043e            lsls    r6, r7, #16
-   81bd4:      7a4f            ldrb    r7, [r1, #9]
+   81bd2:      f43e 7a4e                       ; <UNDEFINED> instruction: 0xf43e7a4e

-   950e6:      0c3e            lsrs    r6, r7, #16
-   950e8:      7d1d            ldrb    r5, [r3, #20]
+   950e6:      fc3e 7d1c                       ; <UNDEFINED> instruction: 0xfc3e7d1c
````

The first big chunk in the diff is at `081d6000`

````
081d6000 g 00000000 IWRAMRoutines
081d6000 g 00000000 IWRAMRoutinesROMLocation
081d6000 l 00000010 __mod_startscr_init_veneer
````

````
081d6000 l 00000010 __mod_startscr_init_veneer
081d8010 g 00000000 battleSpriteMegaMan
````

It seems to be this `__mod_startscr_init_veneer` that's causing the shift.

````sh
# in /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
source ~/.venv/venv_main/bin/activate # must use with source

export RAW_CODE=1 # getting issue here with non-raw
~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.sh bn6f.gba bn6f.sym 'None' 'sym:__mod_startscr_init_veneer' 'hex:0x081d6010'

# out
        thumb_local_start
__mod_startscr_init_veneer:
   0:   4778            bx      pc
   2:   46c0            nop                     ; (mov r8, r8)
   4:   c000            stmia   r0!, {}
   6:   e59f            b.n     0xfffffb48
   8:   ff1c e12f                       ; <UNDEFINED> instruction: 0xff1ce12f
   c:   e391            b.n     0x732
   e:   087f            lsrs    r7, r7, #1
        thumb_func_end __mod_startscr_init_veneer
````

These might be added automatically when targets are out of `bl` range.

````sh

# in /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
source ~/.venv/venv_main/bin/activate # must use with source

export RAW_CODE=0
~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.sh bn6f.gba bn6f.sym 'None' 'sym:sub_8039630' 'sym:sub_8039658'

# out
        thumb_local_start
sub_8039630:
        push {r4-r7, lr}
        bl IsScreenFadeActive
        beq loc_8039652
        bl zeroFillVRAM
        bl ZeroFillGFX30025c0
        bl copyMemory_8001850
        bl chatbox_8040818
        bl localfn_81d6000
        ldr r0, =0x40
        bl SetRenderInfoLCDControl
loc_8039652:
        pop {r4-r7, pc}
        .pool
        thumb_func_end sub_8039630
````

It calls some `localfn_81d6000`. This is a label `dump_code` gives when it cannot determine the a symbol name, and it is corresponding with `__mod_startscr_init_veneer`.

It was supposed to go to `mod_startscr_init`:

````asm
	thumb_local_start
sub_8039630:
	[...]
	bl chatbox_8040818

    .ifdef USE_MODULE_START_SCREEN
        .ifdef USE_MODULE_START_SCREEN_ORIG
            bl startScreen_init_802F530 // () -> void
        .else
            .ifdef USE_MODULE_START_SCREEN_ASM_MOD
                bl mod_startscr_init
            .endif // USE_MODULE_START_SCREEN_ASM_MOD
        .endif // USE_MODULE_START_SCREEN_ORIG
    .endif // USE_MODULE_START_SCREEN
````

Anyway let's switch to `bx` with manual lr copy for `mod_startscr_init`.

There is also this, but it's at the very end of ROM and might not cause problems:

````
087fe488 l 00000010 __chatbox_runScript_veneer
````

````asm
ldr r0, =mod_startscr_init
mov lr, pc
bx r0
````

````
./asm/asm03_1_1.s:9104: Error: invalid offset, value too big (0x00000BD8)
````

These misleading errors get resolved with `.pool`.

````
ldr r0, =mod_startscr_init
mov lr, pc
bx r0
b .end_pool
.pool
.end_pool:
````

Now we no longer crash.  This should cause a shift.

2026-08-02 Wk 31 Sun - 10:37 +03:00

````sh
# in /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve
git commit

# out
[use-rve c836381] Add use flags to begin extracting startscr
````

2026-08-02 Wk 31 Sun - 10:52 +03:00

We can try to inspect the data being copied that could have lead to the corruption

https://stackoverflow.com/questions/5941158/gdb-print-to-file-instead-of-stdout

https://darkdust.net/files/GDB%20Cheat%20Sheet.pdf

Number of words in `eGameState`: `python3 -c "print(0x35bc / 4)" # out { 3439.0 } `

`gdb` creates a file `gdb.txt` if you don't first specify `set logging file {filename}` before `set logging enabled on`.

````
# in asm/asm00_1.s > fn RandomizeExtraToolkitPointers
 // copyWords_80014EC(&sGameState, &sGameState, 0x35BC);
    ldr r3, ToolkitExtraPtrs_copyWords_80014EC_p // =copyWords_80014EC+1
    mov lr, pc
    bx r3 # line 7475
````

````sh
# in /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
mgba bn6f.elf -g &
gdb bn6f.elf \
	-ex "target remote localhost:2345" \
	-ex "layout src" \
	-ex "layout reg" \
	-ex "b ./asm/asm00_1.s:7475" \
	-ex "set logging file gdb_log.log" \
	-ex "set logging enabled on" \
	-ex "c" \
	-ex "c" \
	-ex "c" \
	-ex "x/3439xw 0x2001b80"
````

First 2 breaks, All zeros. Third break has data. There are only 3 breaks until player gets interactivity with the start screen.

Spawn [lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/task/002 Impl struct layout parsing from bn6f inc and parse gdb memory xw log](../task/002%20Impl%20struct%20layout%20parsing%20from%20bn6f%20inc%20and%20parse%20gdb%20memory%20xw%20log.md) ^spawn-task-c72093
