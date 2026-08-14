---
context_type: task
status: todo
---

Parent: [[lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/000 Provide a mod replacement for start screen]]

Spawned by: [[lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/entry/000 Spawns for Provide a mod replacement for start screen]]

Spawned in: [[lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/entry/000 Spawns for Provide a mod replacement for start screen#^spawn-task-f562a4|^spawn-task-f562a4]]

# Journal

2026-07-30 Wk 31 Thu - 10:52 +03:00

--/ 2026-07-30 Wk 31 Thu - 12:06 +03:00
`issue[t:status=todo t:topic=build]` `make -j$(nproc)` may fail to use the latest build changes. Currently we need to do a full `make clean && make -j$(nproc) assets && make -j$(nproc)`.
--/

Currently failing to get `OK` on build, despite disabling modding.

Reverted back to 

```diff
rom_region (rx) : ORIGIN = 0x08000000, LENGTH = 0x0800000
```

and now it's OK. It was `0x1600000` but it should be `0x1000000` for modding to double.

We need to figure out how to have our use flags in the ld script too.

https://stackoverflow.com/questions/35796465/conditional-statements-for-linker-command-language-ld#53693001

CPP preprocessing is suggested. We do need to generate both the ldscript and `include/use_flags.inc` from the same source, otherwise we're duplicating flags.

For now let's go with the cheapest solution, to use an `ld_script.ld.cpp` instead of `ld_script.ld`, then update

```sh
# in Makefile
%.elf: $(OFILES)
    $(LD) $(LDFLAGS) -o $(ELF) -T ld_script.ld $(OFILES) $(LIB)
```

to

```sh
# in Makefile
%.elf: $(OFILES)
    $(LD) $(LDFLAGS) -o $(ELF) -T <($(cpp -p ld_script.ld.pp)) $(OFILES) $(LIB)
```

That doesn't work. But this does:

```make
CPP = cpp

# Preprocess ld_script which can contain ifdefs.
ld_script.ld: ld_script.ld.pp
	$(CPP) -P $< > $@

%.elf: $(OFILES) ld_script.ld
	$(LD) $(LDFLAGS) -o $(ELF) -T ld_script.ld $(OFILES) $(LIB)
	
clean:
	rm ld_script.ld # now a build artifact generated from ld_script.ld.pp.
```

`-p` has some `#` lines at the start which `-P` removes. From `man cpp`:

```
-P  Inhibit generation of linemarkers in the output from the preprocessor.  This might be useful when running the preprocessor on something that is not C code, and will be sent to a program which might be
           confused by the linemarkers.
```

Now we can include `use_flags.pp` which we could also generate `include/use_flag.inc` from if necessary.

Ok it is responding to `use_flags.pp` as expected:

```sh
# in ld_scripts.ld.pp

#include "use_flags.pp"

OUTPUT_FORMAT("elf32-littlearm", "elf32-bigarm", "elf32-littlearm")
OUTPUT_ARCH(arm)

MEMORY
{
    ewram_region (w!x) : ORIGIN = 0x02000000, LENGTH = 0x40000
    iwram_region (w!x) : ORIGIN = 0x03000000, LENGTH = 0x8000
    vram_region (w!x) : ORIGIN = 0x06000000, LENGTH = 0x18000
#ifdef USE_MOD
    rom_region (rx) : ORIGIN = 0x08000000, LENGTH = 0x1000000
#else
    rom_region (rx) : ORIGIN = 0x08000000, LENGTH = 0x0800000
#endif
}

#ifdef USE_MOD
    .modding_text :
    {
        modding.o(.text);
    } >rom_region
#endif
```

```sh
# in /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve
git commit

# out (relevant)
[use-rve 8387666] add cpp preprocessing for ld_script and use flags
```

2026-07-30 Wk 31 Thu - 16:16 +03:00

Now the basic mod we have is running. Enable `USE_MOD` in `include/use_flags.inc` and `use_flags.pp` and you will be able to get the chatbox run anywhere with select.

Now we're ready to work on `USE_MODULE_START_SCREEN_ASM_MOD`.

We're able to use `modding/asm/start_screen.s` within `modding.s`. Now let's use its symbols within `asm/main.s` to replace callbacks with calls to our mod.

~~Currently `modding.s` have access to `rom.s` symbols, but `rom.s` does not have access.~~ No, a function just had the wrong label in `thumb_func_start` and `thumb_func_end`.

It is freezing. Let's debug it and see where this happens.

Command to one used in [[000 Attempt adding a function at end of ROM to trigger on command]]

```sh
# in /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
mgba bn6f.elf -g &
gdb bn6f.elf -ex "target remote localhost:2345"

# in gdb
b mod_ss_render
c
```

Seems able to run the function alright:

```
Breakpoint 3, mod_ss_render () at ./modding/asm/start_screen.s:15
⚠️ warning: Source file is more recent than executable.
15          push {lr}
(gdb) s
17          ldr r0, =startscreen_render_802F544+1
(gdb)
18          bx r0
(gdb)
startscreen_render_802F544 () at ./asm/asm03_0.s:18959
18959           push {r4-r7,lr}
(gdb) s
18961           bl startScreen_AnimatePressStart_803E938
(gdb) n
18963           ldr r5, off_802F570 // =eStartScreen
(gdb)
```

We eventually break somewhere else:

```
33          pop {r0-r7}
(gdb)
main_hook () at modding.s:35
35          pop {r0-r7, pc} // Bye!
(gdb)
GBA: Illegal opcode: 0000ea00
```

It fails with

```asm
# in modding/asm/start_screen.s > fn mod_ss_render
    ldr r4, =startscreen_render_802F544+1
    bx r4
```

but succeeds with

```asm
# in modding/asm/start_screen.s > fn mod_ss_render
    bl startscreen_render_802F544
```

This works:

```asm
    thumb_func_start mod_ss_render
mod_ss_render:
    push {r0, lr}

    ldr r0, =startscreen_render_802F544
    mov lr, pc
    bx r0

    //bl startscreen_render_802F544

    pop {r0, pc}
    .pool
    thumb_func_end mod_ss_render
```

Don't forget to back up the registers, and `bx` doesn't link like `bl`. We don't have a `blx` so back up the link register.

2026-07-31 Wk 31 Fri - 00:59 +03:00

```
modding.s: Assembler messages:
modding.s: Error: .size expression for mod_starscr_render does not evaluate to a constant
modding.s: Error: .size expression for mod_starscr_init_gfx does not evaluate to a constant
modding.s: Error: .size expression for mod_starscr_off04 does not evaluate to a constant
modding.s: Error: .size expression for mod_starscr_off08 does not evaluate to a constant
modding.s: Error: .size expression for mod_starscr_load_game does not evaluate to a constant
make: *** [Makefile:63: modding.o] Error 1
make: *** Waiting for unfinished jobs....
```

They each had a typo in their `thumb_func_start` and `thumb_func_end`: `star -> start`. Also `mod_startscr_off04` was referred with `starscr` in a `.word`.

```
tools/binutils/bin/arm-none-eabi-ld: modding.o: in function `mod_startscr_init_gfx':
/home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f/./modding/asm/start_screen.s:42: undefined reference to `startScreen_initGfx_802F574'
tools/binutils/bin/arm-none-eabi-ld: modding.o: in function `mod_startscr_off04':
/home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f/./modding/asm/start_screen.s:55: undefined reference to `startscreen_802F60C'
tools/binutils/bin/arm-none-eabi-ld: modding.o: in function `mod_startscr_off08':
/home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f/./modding/asm/start_screen.s:68: undefined reference to `ho_802F63C'
tools/binutils/bin/arm-none-eabi-ld: modding.o: in function `mod_startscr_load_game':
/home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f/./modding/asm/start_screen.s:80: undefined reference to `load_game_802F756'
make: *** [Makefile:60: %.elf] Error 1
```

They are local in the unmodded version, so they need an ifdef for modding to be made global. For example:

```asm
    .ifdef USE_MOD
        thumb_func_start load_game_802F756
    .else
        thumb_local_start
    .endif
```

2026-08-01 Wk 31 Sat - 10:21 +03:00

Spawn [[lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/issue/000 dump_code silently drops extra instructions through the compute_pool_usage map]] ^spawn-issue-a29dcd

Spawn [[lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/issue/001 bn6f build crashes at hook during startscr mod for fa07f00a]] ^spawn-issue-a1bd8d
