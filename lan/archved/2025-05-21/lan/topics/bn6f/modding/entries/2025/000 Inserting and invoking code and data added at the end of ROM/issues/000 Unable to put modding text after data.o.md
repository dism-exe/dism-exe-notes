---
parent: "[[000 Inserting and invoking code and data added at the end of ROM]]"
spawned_by: "[[000 Attempt adding a function at end of ROM to trigger on command]]"
context_type: issue
status: done
---

Parent: [[000 Inserting and invoking code and data added at the end of ROM]]

Spawned by: [[000 Attempt adding a function at end of ROM to trigger on command]]

Spawned in: [[000 Attempt adding a function at end of ROM to trigger on command#^spawn-issue-398756|^spawn-issue-398756]]

# 1 Journal

2025-10-13 Wk 42 Mon - 04:02 +03:00

```sh
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
diff -u bn6f.map ~/src/cloned/gh/dism-exe/bn6f/bn6f.map | less
```

This shows that many data symbols have changed

```diff
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
diff -u bn6f.map ~/src/cloned/gh/dism-exe/bn6f/bn6f.map | grep TextScriptNetworkEnterFolderName1

# out
+                0x087f2654                TextScriptNetworkEnterFolderName1
-                0x087f2674                TextScriptNetworkEnterFolderName1
```

2025-10-13 Wk 42 Mon - 04:11 +03:00

```diff
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
diff -u bn6f.map ~/src/cloned/gh/dism-exe/bn6f/bn6f.map | less

# out (relevant)
- .text          0x086c580c       0x20 modding.o
-                0x086c580c                main_hook
-                0x086c5824                modding_main
-                0x086c5828                modding_on_command
```

These are added *before* data when they should be after.

2025-10-13 Wk 42 Mon - 04:16 +03:00

```C
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/ld_script.ld
/* start of ROM */

.text :
{
	rom.o(.text);
} >rom_region

iwram_text :
{
	iwram.o(.text);
} >iwram_region AT>rom_region

.rodata :
ALIGN(4)
{
	data.o(.rodata);
} >rom_region

.modding_text :
{
	modding.o(.text);
} >rom_region

.fill :
{
	FILL(0xff);
	. = ORIGIN(rom_region) + LENGTH(rom_region) - 1;
	BYTE(0xff);
} >rom_region
```

This might be because of `(.text)` placing things out of order.

`.modding_text` instead of `.text` in `modding.s` gives 

```
modding.s:4: Error: unknown pseudo-op: `.modding_text'
```

but `.section modding_text` works

```diff
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/ld_script.ld
.modding_text :
{
-	modding.o(.text);
+	modding.o(.modding_text);
} >rom_region

# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/modding.s
-  .text
+  .section modding_text
```

```sh
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
make clean && make -j$(nproc) assets && make -j$(nproc)
```

```sh
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
diff -u bn6f.map ~/src/cloned/gh/dism-exe/bn6f/bn6f.map | grep TextScriptNetworkEnterFolderName1

# out
[nothing]
```

```diff
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
diff -u bn6f.map ~/src/cloned/gh/dism-exe/bn6f/bn6f.map | less

# out
-modding_text    0x00000000       0x20
- modding_text   0x00000000       0x20 modding.o
-                0x00000000                main_hook
-                0x00000018                modding_main
-                0x0000001c                modding_on_command
```

These have bad addresses now.

2025-10-13 Wk 42 Mon - 04:37 +03:00

```diff
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/ld_script.ld
-.modding_text :
+modding_text :
{
-	modding.o(.modding_text);
+	modding.o(modding_text);
} >rom_region
```

```diff
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
diff -u bn6f.map ~/src/cloned/gh/dism-exe/bn6f/bn6f.map | less

# out (relevant)
- modding_text   0x087fe36c       0x20 modding.o
-                0x087fe36c                main_hook
-                0x087fe384                modding_main
-                0x087fe388                modding_on_command
```

The addresses are fine now, but we still get white screen on reset again.

Again a sigill signal on `bx r0` for `main_hook`. 

Stepping on `bx r0` with `r0` being `0x87fe36d` gives a SIGILL signal, illegal instruction

2025-10-13 Wk 42 Mon - 05:00 +03:00

```sh
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
tools/binutils/bin/arm-none-eabi-objdump -d bn6f.elf | grep 'main_hook'

# out
[nothing]
```

This would show up if `modding.s` is put in section `.text`:

```sh
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
tools/binutils/bin/arm-none-eabi-objdump -d bn6f.elf | grep 'main_hook'

# out
081d6000 <main_hook>:
 81d6002:       4804            ldr     r0, [pc, #16]   ; (81d6014 <main_hook+0x14>)
```

2025-10-13 Wk 42 Mon - 05:24 +03:00

(llm ChatGPT 5)
Missing ".ax"
(/llm)

Right, in [gh LanHikari22/bn6f-modding src/mainHook.s](https://github.com/LanHikari22/bn6f-modding/blob/9c17160b15ecb648eb5496a426e3f8d7da2d152b/src/mainHook.s) we have used

```
.section .mainHook, "ax"
```


```sh
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/modding.s
.section modding_text, "ax"
```

```sh
tools/binutils/bin/arm-none-eabi-objdump -d bn6f.elf | grep 'main_hook'

# out
086c580c <main_hook>:
```

2025-10-13 Wk 42 Mon - 05:31 +03:00

But this is an issue again:

```diff
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
diff -u bn6f.map ~/src/cloned/gh/dism-exe/bn6f/bn6f.map | grep TextScriptNetworkEnterFolderName1

# out
+                0x087f2654                TextScriptNetworkEnterFolderName1
-                0x087f2674                TextScriptNetworkEnterFolderName1
```

Interestingly on `"x"` instead of `"ax"` we both see `main_hook` through objdump and no difference to data for `bn6f.map` yet we're stuck at reset white screen

2025-10-13 Wk 42 Mon - 05:47 +03:00

(llm ChatGPT 5)
Can fix addresses with `.modding_text 0x08900000`
(/llm)

Using 

```C
// in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/ld_script.ld
.modding_text 0x08900000 :
{
	modding.o(.modding_text);
} >rom_region
```

We're able to make that section appear at exactly `0x08900000`

```sh
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
tools/binutils/bin/arm-none-eabi-objdump -d bn6f.elf | grep 'main_hook'

# out
08900000 <main_hook>:
 8900002:       4804            ldr     r0, [pc, #16]   ; (8900014 <main_hook+0x14>)
```

This messes up the rodata section addresses more:

```diff
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
diff -u bn6f.map ~/src/cloned/gh/dism-exe/bn6f/bn6f.map | grep TextScriptNetworkEnterFolderName1

# out
+                0x087f2654                TextScriptNetworkEnterFolderName1
-                0x08a2ce68                TextScriptNetworkEnterFolderName1
```

But we can try to fix that section too to force our order.

```diff
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
diff -u bn6f.map ~/src/cloned/gh/dism-exe/bn6f/bn6f.map | grep data.o

# out (relevant)
+ .data          0x086c580c   0x138b60 data.o
- .data          0x08900020   0x138b60 data.o
```

```C
// in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/ld_script.ld
.rodata 0x086c580c :
ALIGN(4)
{
	data.o(.rodata);
} >rom_region
```

```
tools/binutils/bin/arm-none-eabi-ld: section .modding_text LMA [08900000,0890001f] overlaps section .rodata LMA [086c580c,08bb3017]
```

```
.modding_text 0x08f00000 :
{
	modding.o(.modding_text);
} >rom_region
```

```diff
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
diff -u bn6f.map ~/src/cloned/gh/dism-exe/bn6f/bn6f.map | grep data.o

# out (relevant)
- .rodata        0x086c580c   0x4ed80c data.o
+ .rodata        0x081d8000   0x4ed80c data.o
+ .data          0x086c580c   0x138b60 data.o
- .data          0x08f00020   0x138b60 data.o
```

Still messing with the addressing there.

2025-10-13 Wk 42 Mon - 06:12 +03:00

[sourceware ld -Trodata-segment=org](https://sourceware.org/binutils/docs/ld/Options.html#index-rodata-segment-origin_002c-cmd-line) has an option that sets the address for rodata

Even if we set `data.s` to section `.text` the ordering problem still occurs.

2025-10-13 Wk 42 Mon - 06:22 +03:00

Apparently this is the [paper](https://inria.hal.science/hal-01589162/file/final.pdf) that introduced ldscripts. There's also more ldscript documentation to be found [here](https://ftp.gnu.org/old-gnu/Manuals/ld-2.9.1/html_chapter/ld_toc.html).

2025-10-13 Wk 42 Mon - 11:43 +03:00

With both `data.s` and `modding.s` in `.text`, we end up getting a linker error:

```
tools/binutils/bin/arm-none-eabi-ld: bn6f.elf section `.data' will not fit in region `iwram_region'
tools/binutils/bin/arm-none-eabi-ld: region `iwram_region' overflowed by 1279584 bytes
```

2025-10-13 Wk 42 Mon - 12:00 +03:00

The placement of `data.o` does not seem to have an effect. 

But if `data.o` is set to `rodata 0x086c580c`, `TextScriptNetworkEnterFolderName1` is put in `0x08cdfe60`

2025-10-13 Wk 42 Mon - 12:15 +03:00

Placement of `modding.o` before `rom.o` does matter as `main_hook` becomes at `08000000`. Before `iwram.o` it becomes `081d6000`. Before `data.o` it becomes `081d8000` and after `data.o` it becomes `086c580c`. 

When `modding.o` is placed before `data.o`,

```diff
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
diff -u bn6f.map ~/src/cloned/gh/dism-exe/bn6f/bn6f.map | grep "data.o"; tools/binutils/bin/arm-none-eabi-objdump -d bn6f.elf | grep 'main_hook'

# out
  .bss           0x03005b00        0x0 data.o
  .text          0x081d6000        0x0 data.o
  data.o(.rodata)
- .rodata        0x081d8020   0x4ed80c data.o
+ .rodata        0x081d8000   0x4ed80c data.o
- .data          0x086c582c   0x138b60 data.o
+ .data          0x086c580c   0x138b60 data.o
 LOAD data.o
-                0x00000068       0x1a data.o
+                0x0000004e       0x1a data.o
081d8000 <main_hook>:
 81d8002:       4804            ldr     r0, [pc, #16]   ; (81d8014 <main_hook+0x14>)
```

Its location `081d8000` is tracking the start location


```C
// in /home/lan/src/cloned/gh/dism-exe/bn6f/bn6f.map
.data           0x086c580c   0x138b60
 .data          0x086c580c        0x0 ewram.o
 .data          0x086c580c        0x0 rom.o
 .data          0x086c580c   0x138b60 data.o
                0x086c67e4                TextScriptLottery86C67E4
```

I'm not seeing anything different about `TextScriptLottery86C67E4` or `dat38_65` which includes it

But many compressed textscripts, and `include/bytecode/text_script.inc` refer to `.data` rather than `.rodata`, and `include/bytecode/text_script.inc` reads `.data` directly.

We changed `data.s` in `bn6f` from `.section .rodata` to `.section .data` to reflect this. It still `OK`s.

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
git add ld_script.ld
git commit

# out
[master dff90687] put data.s in .data since textscript refers to it
 1 file changed, 2 insertions(+), 2 deletions(-)
```

Now with `modding.o` placed before `data.o` we get

```diff
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
diff -u bn6f.map ~/src/cloned/gh/dism-exe/bn6f/bn6f.map | grep "data.o"; tools/binutils/bin/arm-none-eabi-objdump -d bn6f.elf | grep 'main_hook'

# out (relevant)
- .data          0x081d8020   0x62636c data.o
+ .data          0x081d8000   0x62636c data.o
081d8000 <main_hook>:
 81d8002:       4804            ldr     r0, [pc, #16]   ; (81d8014 <main_hook+0x14>)
```

2025-10-13 Wk 42 Mon - 12:49 +03:00

Now with `modding.o` placed after `data.o` we get

```diff
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
diff -u bn6f.map ~/src/cloned/gh/dism-exe/bn6f/bn6f.map | grep "data.o"; tools/binutils/bin/arm-none-eabi-objdump -d bn6f.elf | grep 'main_hook'

# out (relevant)
087fe36c <main_hook>:
 87fe36e:       4804            ldr     r0, [pc, #16]   ; (87fe380 <main_hook+0x14>)
```

```diff
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
diff -u bn6f.map ~/src/cloned/gh/dism-exe/bn6f/bn6f.map | grep TextScriptNetworkEnterFolderName1

# out
[nothing]
```

Seems like that was our anomaly. 

Now we should have

```C
// in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/ld_script.ld
.data :
ALIGN(4)
{
	data.o(.data);
} >rom_region

.modding_text :
{
	modding.o(.modding_text);
} >rom_region

// in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/modding.s
.section .modding_text, "ax"
```

We're able to enter the PET and jack in and everything!

2025-10-13 Wk 42 Mon - 12:59 +03:00

Although it really should be in `.rodata`, so its everything else, like the text script related files, that should refer to `.rodata` instead of `.data`

Spawn [[001 Change data.o back to .rodata in bn6f by any manipulation of .data in its assembly]] ^spawn-task-b57d68
