---
parent: '[[001 Exploring bn6f CentralArea Map]]'
spawned_by: '[[005 Reminders noted during bn6f CentralArea Map Exploration]]'
context_type: entry
---

Parent: [001 Exploring bn6f CentralArea Map](../001%20Exploring%20bn6f%20CentralArea%20Map.md)

Spawned by: [005 Reminders noted during bn6f CentralArea Map Exploration](005%20Reminders%20noted%20during%20bn6f%20CentralArea%20Map%20Exploration.md)

Spawned in: [^spawn-entry-3dc09d](005%20Reminders%20noted%20during%20bn6f%20CentralArea%20Map%20Exploration.md#spawn-entry-3dc09d)

# 1 Journal

2026-01-22 Wk 4 Thu - 05:18 +03:00

~~This seems to get shifted parameters consistently, so there might be references we did not mark for this.~~

These are likely patterns and not pointers? But we have to check.

Here is how I am logging this:

````sh
mgba bn6f.elf -g &; gdb-multiarch bn6f.elf -ex "target remote localhost:2345" | tee a

# in gdb
(gdb) b StartCutscene
(gdb) commands
Type commands for breakpoint(s) 1, one per line.
End with a line saying just "end".
>info reg r0 r1
>cont
>end

# in another terminal
tail -f a | python3 ~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.py ea_to_sym_filter bn6f.sym
````

````
# After Story18 when trying to interact with robos throwing fire as Lan
Breakpoint 1, StartCutscene () at ./asm/map_script_cutscene.s:2433
2433            push {r5,lr}
r0             CutsceneScriptEntranceInteract_8098384           134841220
r1             byte_80700FC+06           134676738
````
