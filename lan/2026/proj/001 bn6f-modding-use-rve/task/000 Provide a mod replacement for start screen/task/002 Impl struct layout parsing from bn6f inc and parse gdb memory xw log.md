---
context_type: task
status: todo
---

Parent: [lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/000 Provide a mod replacement for start screen](../000%20Provide%20a%20mod%20replacement%20for%20start%20screen.md)

Spawned by: [lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/issue/001 bn6f build crashes at hook during startscr mod for fa07f00a](../issue/001%20bn6f%20build%20crashes%20at%20hook%20during%20startscr%20mod%20for%20fa07f00a.md)

Spawned in: [^spawn-task-c72093](../issue/001%20bn6f%20build%20crashes%20at%20hook%20during%20startscr%20mod%20for%20fa07f00a.md#spawn-task-c72093)

# Journal

2026-08-02 Wk 31 Sun - 11:15 +03:00

We got a snapshot of the memory of `eGameState` at a particular point here:

~~Number of words in `eGameState`: `python3 -c "print(0x35bc / 4)" # out { 3439.0 } `~~

--/ 2026-08-10 Wk 33 Mon - 23:39 +03:00

We estimated 3439 words for `eGameState`, but I dunno based on what. If you check `ewram.s` and `GameState.inc` The size should be only `0x80` bytes or 32 words.

It was based on this:

````asm
# in /home/lan/src/cloned/gh/dism-exe/bn6f/asm/asm00_1.s > fn RandomizeExtraToolkitPointers
// let size: u32; (r3_2)
ldr r2, ToolkitExtraPtrs_ToolkitExtraPtrsMemorySize_p // =0x35bc
````

So this covers the entire memory range from `eGameState` to `eToolkitExtraPtrsMemoryEnd`.

--/

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

But this isn't very useful to look at. We already have struct information, and we should be able to simply parse it out of these memory dumps.

2026-08-04 Wk 32 Tue - 11:23 +03:00

For the first pass, let's just be able to part `include/structs/GameState.inc` as-is without reference to how new data types can be defined.

2026-08-05 Wk 32 Wed - 08:32 +03:00

Spawn [000 List all traits implemented by a rust type from cli](../howto/000%20List%20all%20traits%20implemented%20by%20a%20rust%20type%20from%20cli.md) ^spawn-howto-869f14

2026-08-08 Wk 32 Sat - 18:32 +03:00

Spawn [lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/entry/001 Side notes for Impl struct layout parsing from bn6f inc and parse gdb memory xw log](../entry/001%20Side%20notes%20for%20Impl%20struct%20layout%20parsing%20from%20bn6f%20inc%20and%20parse%20gdb%20memory%20xw%20log.md) ^spawn-entry-a09d3b

2026-08-09 Wk 32 Sun - 00:56 +03:00

Spawn [lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/task/004 Impl parsing of bn6f struct inc files into memory layouts](004%20Impl%20parsing%20of%20bn6f%20struct%20inc%20files%20into%20memory%20layouts.md) ^spawn-task-683000

2026-08-10 Wk 33 Mon - 18:50 +03:00

Spawn [lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/task/005 Parse gdb session logs for memory dump data](005%20Parse%20gdb%20session%20logs%20for%20memory%20dump%20data.md) ^spawn-task-a99874

2026-08-11 Wk 33 Tue - 01:57 +03:00

When we're ready to make this an end-to-end general tool, the effort for this will be in [000 Wiki Proc gba-live-memory-interpreter](../../../../../microproj/st/idea/000%20gba-live-memory-interpreter/wikiproc/000%20Wiki%20Proc%20gba-live-memory-interpreter/000%20Wiki%20Proc%20gba-live-memory-interpreter.md).

2026-08-14 Wk 33 Fri - 03:43 +03:00

We're able to interpret a gdb memory dump as a JSON containing the struct fields now.

We can also switch between union alternatives by selecting in an overlay profile prior to interpretation.

````sh
# in /home/lan/src/cloned/cb/lan22h/bn-repo-editor
git commit # out { [main e727628] impl interpreting gdb dumps as struct }
````

2026-08-14 Wk 33 Fri - 13:36 +03:00

Currently two things are manually configured:

1. We give individual paths to structs, when they can all be processed from `include/structs/`.
1. We manually configure mapping an ea in ewram to a struct type, when it can be autodiscovered via `ewram.s`.

The implementation written in `main e727628` also should support array of structs at an ea, or array of tuples of types at an ea, but currently only tested for `GameState` which is only one struct at an ea. It also supports embedded structs, but `GameState` has none. It has pointers to other structs, and those currently only interpreted as symbols as we don't know the type and haven't annotated it generally (they are annotated as just `Ptr`)
