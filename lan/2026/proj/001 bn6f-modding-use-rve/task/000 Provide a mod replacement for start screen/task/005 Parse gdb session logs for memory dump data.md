---
context_type: task
status: todo
---

Parent: [[lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/000 Provide a mod replacement for start screen]]

Spawned by: [[lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/task/002 Impl struct layout parsing from bn6f inc and parse gdb memory xw log]]

Spawned in: [[lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/task/002 Impl struct layout parsing from bn6f inc and parse gdb memory xw log#^spawn-task-a99874|^spawn-task-a99874]]

# Journal

2026-08-10 Wk 33 Mon - 19:15 +03:00

The data is generated with 

```sh
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
```

And the output looks like

```
Continuing.

Breakpoint 1, RandomizeExtraToolkitPointers () at ./asm/asm00_1.s:7475
Continuing.

Breakpoint 1, RandomizeExtraToolkitPointers () at ./asm/asm00_1.s:7475
Continuing.

Breakpoint 1, RandomizeExtraToolkitPointers () at ./asm/asm00_1.s:7475
Continuing.

Program received signal SIGINT, Interrupt.
main_awaitFrame () at ./asm/main.s:145
Continuing.

Breakpoint 1, RandomizeExtraToolkitPointers () at ./asm/asm00_1.s:7475
Continuing.

Breakpoint 1, RandomizeExtraToolkitPointers () at ./asm/asm00_1.s:7475
Continuing.

Breakpoint 1, RandomizeExtraToolkitPointers () at ./asm/asm00_1.s:7475
0x2001b80:	0x00000018	0x01040080	0x00000000	0x10000080
0x2001b90:	0x00ff0000	0x10080001	0x02009f40	0x00000000
0x2001ba0:	0x08066988	0x010b8000	0xff898000	0x00000000
[...]
```

We should ignore `Continuing.`, empty lines, and `Breakpoint ...` lines, and this leaves us exactly with `addr: values` lines. 

For now expect the format to be `xw` (hexadecimal words).

Actually, rather than ignoring what we want, use regex to get *only* what we want from the haystack. Only take valid lines. Or this is simply enough, no need to use regex.

