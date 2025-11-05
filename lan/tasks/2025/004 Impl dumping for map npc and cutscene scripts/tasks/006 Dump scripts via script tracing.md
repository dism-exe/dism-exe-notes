---
parent: '[[004 Impl dumping for map npc and cutscene scripts]]'
spawned_by: '[[001 Model mapscript bytecode and dump once]]'
context_type: task
status: todo
---

Parent: [004 Impl dumping for map npc and cutscene scripts](../004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts.md)

Spawned by: [001 Model mapscript bytecode and dump once](001%20Model%20mapscript%20bytecode%20and%20dump%20once.md)

Spawned in: [<a name="spawn-task-a97099" />^spawn-task-a97099](001%20Model%20mapscript%20bytecode%20and%20dump%20once.md#spawn-task-a97099)

# 1 Objective

We're able to dump scripts once and get OK, but scripts can fork out outside the entry symbol data block.

So those jumps would contain invalid labels until those labels are also dumped.

This means we can't manually input the dumped script either. It needs to interact with the repository and dump automatically from an entrypoint.

# 2 Journal

2025-10-31 Wk 44 Fri - 00:09 +03:00

Some things we need:

* [ ] Map Symbol to repo file tokens
* [ ] Ability to replace Symbol in file with new content
* [ ] Before dumping, trace all external dests until we have a self-complete set of file symbol data.

2025-11-02 Wk 44 Sun - 05:10 +03:00

We're now generating `data/apps/bn_repo_editor/lexer/bn6f.lexer.syms.ron` for all the symbols parsed by lexers. This gives us the mapping to files. Though there are some false positives, colon parameters are treated as colon labels. but they're both `{ident}:` so it's hard to tell them apart without further context.

Since we're using this data for search off of symbols we already know via `bn6f.map` or `bn6f.sym`, it should not affect us. We can remove a lot of false positives by ignoring `*.inc` files for this. There are still missing symbols to investigate. We're only finding 169 `ThumbFuncStart`, when grepping for `thumb_func_start` gives 2765 results.

`RunContinuousMapScript` is an example of a missing label in `asm/map_script_cutscene.s"`.  Checking the corresponding `/home/lan/data/apps/bn_repo_editor/lexer/asm/map_script_cutscene.s.lexer.ron`,

We find

````
(lexon_type: ThumbFuncStart, lexon_data: Sign, capture: "thumb_func_start ")
(lexon_type: Ident, lexon_data: Word("RunContinuousMapScript"), capture: "RunContinuousMapScript\n")
````

We've updated the `lexon_data` from `Sign` to `Ident`. Might have been cached. Let's clear everything and rerun:

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
rm -rf /home/lan/data/apps/bn_repo_editor/lexer
cargo run --release --bin bn_repo_editor lexer
````

2025-11-03 Wk 45 Mon - 22:37 +03:00

Scanning took `</build_scanner_or_fail 15354.411425704s>`  for `dat38_60.s` on release.  Need to know why. This file is full of data, 100176 lines currently. Each comma separated token repeats the scanning process.

See [001 Investigating slow bn repo lexer](../../001%20Turn%20EWRAM%20and%20ROM%20Structs%20into%20C%20Structs%20and%20embed%20into%20type%20for%20gdb%20memory%20manipulation/investigations/001%20Investigating%20slow%20bn%20repo%20lexer.md)
