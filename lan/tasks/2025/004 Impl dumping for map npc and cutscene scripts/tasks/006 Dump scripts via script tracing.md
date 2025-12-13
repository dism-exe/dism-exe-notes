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

2025-11-06 Wk 45 Thu - 12:03 +03:00

It seems like we have access to way more labels now in `bn6f.lexer.syms.ron`.

We want to dump other scripts types referenced by a script too:

````
// in include/bytecode/map_script.inc
enum ms_start_cutscene_cmd // 0x26
enum ms_load_gfx_anim_cmd // 0x2c
subenum ms_run_secondary_continuous_map_script_subcmd // 0x3a 0x0
// multiple:
enum ms_load_gfx_anims_cmd // 0x2d

// in include/bytecode/cutscene_script.inc
enum cs_spawn_cutscene_process_cmd // 0x12
enum cs_set_cutscene_skip_script_cmd // 0x14
subenum cs_run_cutscene_camera_script_subcmd // 0x54 0x0
subenum cs_cutscene_run_secondary_continuous_map_script_subcmd // 0x75 0x0

// in include/bytecode/cutscene_camera_script.inc
enum ccs_run_text_script_cmd // 0x28
````

Spawn [007 Look into dumping gfx_anim_script](007%20Look%20into%20dumping%20gfx_anim_script.md) <a name="spawn-task-e566ac" />^spawn-task-e566ac

2025-11-08 Wk 45 Sat - 02:18 +03:00

Right now we try to process recursively all the external labels to a symbol data block as well as all script pointers encountered (except for text). We expect this to fail because of missing symbol data blocks which would require data block cutting to fix.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin dump_script map trace MapScriptOnInitCentralTown_804EA28

# out (error, relevant)
thread 'main' panicked at src/bin/dump_script.rs:88:29:
Failed to process script labels: Script pointer must be in ROM: Null
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

Clarifying the error,

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin dump_script map trace MapScriptOnInitCentralTown_804EA28

# out (error, relevant)
Failed to process script labels: Script pointer must be in ROM but Null is not. Instruction: Inst { name: "ms_start_cutscene", cmd: 38, opt_subcmd: None, fields: [Ptr("ptr1", Rom(RomEa { ea: 134855657 })), Ptr("word5", Null)] }
````

`word5` should not be a pointer but a u32. Updating the schema.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin dump_script map trace MapScriptOnInitCentralTown_804EA28

# out (error, relevant)
thread 'main' panicked at src/bin/dump_script.rs:88:29:
Failed to process script labels: Script refers to a pointer not in map: 0x08099CEC
````

Okay. When we get a `PointerNotInMap` error variant for `ProcessScriptLabelsError`, we need to triangulate to find the label to cut, cut, add the new label, build, get an OK, and try again, all automatically.

Let's clarify the error to know which script caused this issue:

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin dump_script map trace MapScriptOnInitCentralTown_804EA28

# out (error, relevant)
thread 'main' panicked at src/bin/dump_script.rs:88:29:
Failed to process script labels: Script Identifier { s: "byte_804EB59" } refers to a pointer not in map: 0x08099CEC
````

(HowTo) Running a cli command via rust at a directory. Via search llm,

````rust
use std::process::Command;

Command::new("your_command")
    .current_dir("path/to/directory")
    .status()
    .expect("failed to execute process");
````

In `ExitStatus`'s documentation they say it's a wait status and not just simply an exit status...

Use `exit_status.success()` and `exit_status.code()`.

From `exit_status.code()`,

````rust
match status.code() {  
	Some(code) => println!("Exited with status code: {code}"),  
	None => println!("Process terminated by signal")  
}
````

Used this to create `build_proj`.

2025-11-08 Wk 45 Sat - 04:08 +03:00

In addition to retriggering build, we also need to retrigger lexing for the file that is modified. There can be successive cuts at the same ea which would require this.

2025-11-08 Wk 45 Sat - 07:30 +03:00

`cut_then_mark_new_label` is implemented. It should change the repository directly, and rebuild and process relevant lexer files that change. Let's test it.

Spawn [008 Test fn cut_then_mark_new_label](008%20Test%20fn%20cut_then_mark_new_label.md) <a name="spawn-task-4cb046" />^spawn-task-4cb046

2025-11-09 Wk 45 Sun - 05:24 +03:00

Cutting for `MapScriptOnInitCentralTown_804EA28` is done! Let's dump now!

2025-11-09 Wk 45 Sun - 06:11 +03:00

Implemented `replace_repo_content_for_data`. Time to test dumping of `MapScriptOnInitCentralTown_804EA28`!

Spawn [009 Test dumping scripts for trace MapScriptOnInitCentralTown_804EA28](009%20Test%20dumping%20scripts%20for%20trace%20MapScriptOnInitCentralTown_804EA28.md) <a name="spawn-task-bf8aa7" />^spawn-task-bf8aa7

2025-11-11 Wk 46 Tue - 05:01 +03:00

Let's next do `MapScriptOnUpdateCentralTown_804EEF7`

Spawn [010 Trace Dump MapScriptOnUpdateCentralTown_804EEF7](010%20Trace%20Dump%20MapScriptOnUpdateCentralTown_804EEF7.md) <a name="spawn-task-a567d6" />^spawn-task-a567d6

2025-12-11 Wk 50 Thu - 04:27 +03:00

Spawn [011 Trace and Range dump through ACDC Real world scripts and others](011%20Trace%20and%20Range%20dump%20through%20ACDC%20Real%20world%20scripts%20and%20others.md) <a name="spawn-task-5b302f" />^spawn-task-5b302f

2025-12-13 Wk 50 Sat - 02:31 +03:00

Spawn [012 Trace and range dump remaining maps](012%20Trace%20and%20range%20dump%20remaining%20maps.md) <a name="spawn-task-c8e433" />^spawn-task-c8e433
