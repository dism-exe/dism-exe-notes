---
parent: '[[004 Impl dumping for map npc and cutscene scripts]]'
spawned_by: '[[006 Dump scripts via script tracing]]'
context_type: task
status: done
---

Parent: [004 Impl dumping for map npc and cutscene scripts](../004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts.md)

Spawned by: [006 Dump scripts via script tracing](006%20Dump%20scripts%20via%20script%20tracing.md)

Spawned in: [<a name="spawn-task-4cb046" />^spawn-task-4cb046](006%20Dump%20scripts%20via%20script%20tracing.md#spawn-task-4cb046)

# 1 Journal

2025-11-08 Wk 45 Sat - 07:34 +03:00

Let's start by only testing repo changes before rebuild. The repository currently has no changes so we can git reset it safely.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin dump_script map trace MapScriptOnInitCentralTown_804EA28

# out (error, relevant)
thread 'main' panicked at src/bin/dump_script.rs:101:41:
Failed to cut then mark new label: Failed to cut label data: Expected cut position to be after symbol ea but 0x098bb8 <= 0x098bb8
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

2025-11-08 Wk 45 Sat - 07:44 +03:00

````rust
// in fn cut_then_mark_new_label
let (symbol_data1, symbol_data2) =
	cut_label_data(rom_ea_low.ea, new_label.clone(), &symbol_data_to_cut)?;
````

`rom_ea_low.ea` here is wrong. It should be the ea that we want to cut, not the triangulation result:

````rust
// in fn cut_then_mark_new_label
let (symbol_data1, symbol_data2) =
	cut_label_data(rom_ea.ea, new_label.clone(), &symbol_data_to_cut)?;
````

2025-11-08 Wk 45 Sat - 07:46 +03:00

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin dump_script map trace MapScriptOnInitCentralTown_804EA28

# out (error, relevant)
Debugging!
````

We get to the end after rewriting data in the repo!

But we add `\t` then `\n` instead of `\n\t` so we need to fix that. It also seems to have added the wrong data at ` byte_8094850`.

We can `git reset --hard` for the repo to revert these changes and then investigate.

2025-11-08 Wk 45 Sat - 07:51 +03:00

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
git commit -m "implementing repo editing for marking new labels"

# out
[main e96173e] implementing repo editing for marking new labels
 13 files changed, 1767 insertions(+), 406 deletions(-)
 create mode 100644 src/bytecode/gfx_anim_script.rs
 create mode 100644 src/drivers/build.rs
````

2025-11-08 Wk 45 Sat - 08:00 +03:00

The data attempted to being cut right now is

````C
byte_8094850::
	.byte 0x0, 0x20, 0x5, 0x80, 0xFC, 0x0, 0x0, 0x8
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin dump_script map trace MapScriptOnInitCentralTown_804EA28

# out (error, relevant)
Debugging! RomEa { ea: 134847724 } SymbolData { ea: RomEa { ea: 134843320 }, label: Identifier { s: "byte_8098BB8" }, size: 11868, data: 
[...]
````

`byte_8098BB8` is the last of `data/dat27.s` in

````C
dat27:
	.include "data/dat27.s"
asm28_0:
	.include "asm/asm28_0.s"
````

The next symbol in `asm28_0.s` is `sub_8098BE8`.

`bn6f.map` shows this instead:

````
0x08098bb8                byte_8098BB8
0x0809ba14                sub_809BA14
````

````sh
python3 -c "print(0x0809ba14 - 0x08098bb8)"

# out
11868
````

This `11868` is the data size it read.

But this is wrong. There are many local symbols in between them. We shouldn't use the map file for triangulation since it will mess up on local symbols.

`bn6f.sym` shows this:

````
08098bb8 g 00000000 byte_8098BB8
08098be8 l 00000630 sub_8098BE8
08098be8 l 00000000 asm28_0
````

Which would have lead to the correct data block. Note that `bn6f.sym` does not generate on its own, so we have to rebuild it, in addition to the project:

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
make bn6f.sym

# out
tools/binutils/bin/arm-none-eabi-objdump -t bn6f.elf | sort -u | grep -E "^0[2389]" | perl -p -e 's/^(\w{8}) (\w).{6} \S+\t(\w{8}) (\S+)$/\1 \2 \3 \4/g' > bn6f.sym
````

2025-11-08 Wk 45 Sat - 08:57 +03:00

Now we're parsing the syms file instead. It's probably lucky that generated `bn6f.sym`, since I only recently learned about using capture groups with `\N`! And in here he does it with `perl`!

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin dump_script map trace MapScriptOnInitCentralTown_804EA28

# out
thread 'main' panicked at src/bin/dump_script.rs:188:44:
Failed to read sym file: TokenNotAnIdentifier(HasSymbols("copyTo_iObjectAttr3001D70_3006814.loop1"))
````

Hmm. Local dot labels also... Let's filter these out

2025-11-08 Wk 45 Sat - 09:06 +03:00

````
Debugging! RomEa { ea: 134767056 } SymbolData {
  ea: RomEa { ea: 0808615c }
  label: Identifier { s: "byte_808615C" }
  size: 325
````

There's no way to have `byte_8081454`, `mapscript_80861D0`, `byte_8081479`!

`80861D0` is after all of them!

Let's include the label also in our search and replace just in case the substring hasn't been found anywhere else.

2025-11-08 Wk 45 Sat - 09:19 +03:00

````
substring_to_replace: "byte_8081454::\n\t.byte 0x0, 0x0, 0xFC, 0x80, 0x0, 0x0, 0x0\n\t.byte 0x8, 0x4, 0xD0, 0x0, 0x80, 0x0, 0x0, 0x0, 0x0, 0x0, 0x8\n\t.byte 0x4, 0x40, 0x0, 0x80, 0xFF, 0x0, 0x0, 0x0, 0x0, 0x4, 0x80\n\t.byte 0x0, 0x80, 0xFF, 0x80, 0x0, 0x0, 0x0, 0x8\n"
````

We should not be replacing this.

````
Debugging! RomEa { ea: 134767056 } Identifier { s: "byte_808615C" }
````

It should be `byte_808615C`.

````
sym_repo_path: "/home/lan/src/cloned/gh/dism-exe/bn6f/data/dat21.s"
match_lexon_type: DoubleColonLabel
````

2025-11-08 Wk 45 Sat - 09:28 +03:00

We need to skip while `!is_label_data || !is_label_lexon_type` not `!is_label_data && !is_label_lexon_type`. This is the inverse of when we finally get the target label match.

It replaces in `byte_808615C` now, and get OK on build!

Although the new data now hardcodes values instead of pointers. We will dump a lot of things, so this will be resolved, however there may be some leftovers. Let's err towards putting labels when cutting.

2025-11-08 Wk 45 Sat - 09:57 +03:00

Okay! Still builds OK, and we do not lose labels that are aligned by 4 at the symbol block start!

Now let's do the rest: building the project and regenerating the relevant lexer files, and repeating the cutting process whenever an ea that is not in the sym file is found.

2025-11-08 Wk 45 Sat - 10:02 +03:00

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin dump_script map trace MapScriptOnInitCentralTown_804EA28

# out (error, relevant)
thread 'main' panicked at src/bin/dump_script.rs:126:41:
Failed to cut then mark new label: Failed to run process: IO Error: No such file or directory (os error 2)
````

With a more clarified error,

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin dump_script map trace MapScriptOnInitCentralTown_804EA28

# out (error, relevant)
thread 'main' panicked at src/bin/dump_script.rs:126:41:
Failed to cut then mark new label: Failed to run process: Got an IO Error while attempting to run build process: No such file or directory (os error 2)
````

2025-11-08 Wk 45 Sat - 10:19 +03:00

(HowTo) to remove a `/` at the end of a path, we can use `path.pop()` , via llm in search and [programming-idioms 2297](https://programming-idioms.org/idiom/150/remove-trailing-slash/2297/rust)

````rust
// This code is wrong. It was meant for strings
let repo_dir = {
	if app_settings.bn_repo_dir.ends_with("/") {
		let mut mut_path = app_settings.bn_repo_dir.clone();

		mut_path.pop();

		mut_path
	} else {
		app_settings.bn_repo_dir.clone()
	}
};
````

But this still seems to not work.

They actually meant for strings:

````rust
let repo_dir = {
	let mut mut_bn_repo_dir = app_settings.bn_repo_dir.to_string_lossy().to_string();

	if mut_bn_repo_dir.ends_with("/") {
		mut_bn_repo_dir.pop();

		mut_bn_repo_dir
	} else {
		mut_bn_repo_dir
	}
};
````

Still.

````
"/home/lan/src/cloned/gh/dism-exe/bn6f"

Failed to cut then mark new label: Failed to run process: Got an IO Error while attempting to run build process: No such file or directory (os error 2)
````

But this directory does exist.

2025-11-08 Wk 45 Sat - 10:31 +03:00

Hmm. It did say it expected a program for `Command::new`. That is likely the problem.

2025-11-08 Wk 45 Sat - 10:40 +03:00

Okay we're running the command `bash`, with the arguments `-c $command` instead.

````
bn6f.gba: OK
tools/binutils/bin/arm-none-eabi-objdump -t bn6f.elf | sort -u | grep -E "^0[2389]" | perl -p -e 's/^(\w{8}) (\w).{6} \S+\t(\w{8}) (\S+)$/\1 \2 \3 \4/g' > bn6f.sym
[659719::ThreadId(1)] <exhaustively_process_using_scanners>
[659719::ThreadId(1)] </exhaustively_process_using_scanners 933.521173ms #items: 1215>
````

Okay!

````
thread 'main' panicked at src/bin/dump_script.rs:126:41:
Failed to cut then mark new label: Failed to read Lexer file for symbol Identifier { s: "byte_80876E6" }: No such file or directory (os error 2)
````

Hmm. We didn't capture what file that was, but looking in `/home/lan/data/apps/bn_repo_editor/lexer/bn6f.lexer.syms.ron`,

It corresponds to

````
("/home/lan/src/cloned/gh/dism-exe/bn6f/data/dat22.s.lexer.ron", DoubleColonLabel, "byte_80876E6")
````

And this file no longer exists!

````
("/home/lan/src/cloned/gh/dism-exe/bn6f/data/dat21.s.lexer.ron", DoubleColonLabel, "byte_808615C")
````

This was the file we processed.

2025-11-08 Wk 45 Sat - 10:59 +03:00

Those paths are all wrong! They're in `repo_dir` but with `lexer` extensions!

That must have happened when we ran `regenerate_lexer_syms_file`.

2025-11-08 Wk 45 Sat - 11:16 +03:00

Created this command to run the lexer on just a single file and also update the lexer syms:

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin bn_repo_editor lexer_once "/home/lan/src/cloned/gh/dism-exe/bn6f/data/dat21.s"
````

2025-11-08 Wk 45 Sat - 11:20 +03:00

````
lexer_file_path: "/home/lan/data/apps/bn_repo_editor/lexer/include/structs/CutsceneState.inc.lexer.ron"
repo_file_path: "/home/lan/src/cloned/gh/dism-exe/bn6f/include/structs/CutsceneState.inc.lexer.ron"
````

Yep this conversion is faulty in `lexer_file_path_to_repo_file_path`.

2025-11-08 Wk 45 Sat - 11:34 +03:00

````rust
let ext = mut_new
	.extension()
	.ok_or("File should have extension".to_owned())?
	.to_string_lossy()
	.replace(&format!(".{EXT_LEXER}"), "");
````

This won't work. `.extension()` here gives `.ron` instead of `.lexer.ron`.

![Pasted image 20251108113606.png](../../../../../attachments/Pasted%20image%2020251108113606.png)

There's an `Infallible` type!

2025-11-08 Wk 45 Sat - 11:40 +03:00

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin dump_script map trace MapScriptOnInitCentralTown_804EA28

# out (error, relevant)
bn6f.gba: FAILED
thread 'main' panicked at src/bin/dump_script.rs:126:41:
Failed to cut then mark new label: Failed to run process: "make clean && make -j$(nproc) assets && make -j$(nproc)": Process exited with status code: make clean && make -j$(nproc) assets && 
````

It ran 3 times, and then failed.

Fixed that error message to be `{1}` instead of `{0}`. It should show the exit status code.

`887B0614` should have parsed as the label `CompText87B0614` but it's still `0x887B0614`.

And we should avoid these:

````
02000000 l 00000000 OBJECT_FLAGS_AFFECTED_BY_ICE
08000000 l 00000000 OBJECT_FLAGS_UNAFFECTED_BY_POISON
````

`locret_808FF26+1` is strange. I dunno if it's wrong yet.

2025-11-08 Wk 45 Sat - 12:00 +03:00

````rust
// in fn Ea::new
} else if ea >= 0x88000000 && ea < 0x89000000 {
	Ok(Ea::RomCompressed(CompressedRomEa { ea: ea & !0x8000000 }))
````

This is wrong, it should be

````rust
} else if ea >= 0x88000000 && ea < 0x89000000 {
	Ok(Ea::RomCompressed(CompressedRomEa { ea: ea & !0x80000000 }))
````

with an extra zero!

2025-11-08 Wk 45 Sat - 14:01 +03:00

Or we could do

````rust
} else if ea >= 0x88000000 && ea < 0x89000000 {
	Ok(Ea::RomCompressed(CompressedRomEa { ea: ea & 0x0FFFFFFF }))
````

2025-11-08 Wk 45 Sat - 12:11 +03:00

Between runs we don't fully recover state if something fails. We may have to rebuild `bn6f.syms` and recover whatever ron files were changed in successive cuts. So far this was sufficient:

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
make bn6f.sym

# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin bn_repo_editor lexer_once "/home/lan/src/cloned/gh/dism-exe/bn6f/data/dat21.s"
cargo run --release --bin bn_repo_editor lexer_once "/home/lan/src/cloned/gh/dism-exe/bn6f/data/dat22.s"
cargo run --release --bin bn_repo_editor lexer_once "/home/lan/src/cloned/gh/dism-exe/bn6f/data/dat23.s"
cargo run --release --bin bn_repo_editor lexer_once "/home/lan/src/cloned/gh/dism-exe/bn6f/data/dat24.s"
````

More suspicious pointers: `sub_8090308`. I'm flagging it because it's a function and wasn't referred to as odd.

2025-11-08 Wk 45 Sat - 13:13 +03:00

I can also use git version control to reset back changed ron files on a fail instead of reprocessing each time.

````
Failed to read cutscenescript instructions at Identifier { s: "mapscript_808DB30" }: Invalid Ea processed in byte 99 for Inst InstSchema { name: "cs_init_eStruct200a6a0", cmd: 88, opt_subcmd: None, fields: [Ptr("ptr1"), Ptr("ptr5"), Ptr("ptr9")] } and Field Ptr("ptr9"): InvalidEa(1024)
````

Also `cs_init_eStruct200a6a0` probably has a `word9`, not `ptr9`.

````
// 0x38/0x58 ptr1 ptr5 word9
// call Initialize_eStruct200a6a0 with r0=ptr1, r1=ptr5, r2=word9
MapScriptCutsceneCmd_init_eStruct200a6a0:
````

Yup.

2025-11-08 Wk 45 Sat - 13:34 +03:00

````
thread 'main' panicked at src/bin/dump_script.rs:126:41:
Failed to cut then mark new label: Failed to triangulate ea: ea exists in map. No need to triangulate "Rom(RomEa { ea: 142338680 })". It has the symbol "Identifier { s: "CompText87BEA78" }"
````

It's not restarting from the beginning for some reason.

````
# in bn6f.sym
080876e6 g 00000000 byte_80876E6
00000NaN l 00000000 mapscript_8087714
08087874 g 00000000 byte_8087874
````

Those symbols are wrong.

````
# in bn6f.sym
080876e6 g 00000000 byte_80876E6
08087874 g 00000000 byte_8087874
080878c9 g 00000000 byte_80878C9
````

It did disappear after regenerating. It might be I regenerated syms before build.

Until our current error, those are the files modified:

````
modified:   apps/bn_repo_editor/lexer/bn6f.lexer.syms.ron
modified:   apps/bn_repo_editor/lexer/data/dat21.s.lexer.ron
modified:   apps/bn_repo_editor/lexer/data/dat22.s.lexer.ron
modified:   apps/bn_repo_editor/lexer/data/dat24.s.lexer.ron
````

2025-11-08 Wk 45 Sat - 13:49 +03:00

In `process_script_labels` we only process `RomEa` when compressed is also possible.

Even so we should trigger errors like

````rust
_ => Err(FnErr::ScriptPtrIsNotRomEa(ea.clone(), inst.clone()))
````

Pointers are allowed to be ea.

2025-11-08 Wk 45 Sat - 14:06 +03:00

Also the first that is cut in our tests is `byte_808615C`. `887AE030` in it should be `CompText87AE030` but we're still not giving it a label. It should have ` + COMPRESSED_PTR_FLAG`

2025-11-08 Wk 45 Sat - 14:15 +03:00

Okay when cutting we're labeling compressed pointers now!

````
compressed ea: 0x87BEA78
compressed ea: 0x87BEA78
````

I'm getting traces for a compressed ea from `ea.get_raw_pointer()`, so we know we're storing them alright without the compressed flag.

2025-11-08 Wk 45 Sat - 14:22 +03:00

````
Err(PointerNotInMap(Identifier { s: "mapscript_808DB30" }, 142338680))

thread 'main' panicked at src/bin/dump_script.rs:128:41:
Failed to cut then mark new label: Failed to triangulate ea: ea exists in map. No need to triangulate "Rom(RomEa { ea: 142338680 })". It has the symbol "Identifier { s: "CompText87BEA78" }"
````

So the error comes from processing script labels for `mapscript_808DB30`

````rust
// in fn process_script_labels
let opt_label = ea_syms.iter().find(|(map_ea, _, _)| *map_ea == ea);
````

Might be best to use `get_raw_pointer`

That did change outcomes.

````
thread 'main' panicked at src/bin/dump_script.rs:102:9:
Failed to read cutscenescript instructions at Identifier { s: "cutscenescript_808DC58" }: Failed to route the command: NoInstSchema(32)
````

With a more clarified error,

````
thread 'main' panicked at src/bin/dump_script.rs:102:9:
Failed to read cutscenescript instructions at Identifier { s: "cutscenescript_808DC58" }: Failed to route the command: No instruction schema found for position 32
````

````
thread 'main' panicked at src/bin/dump_script.rs:102:9:
Failed to read cutscenescript instructions at Identifier { s: "cutscenescript_808DC58" }: Failed to route the command: No instruction schema found for position 32 and byte 0xFF
````

2025-11-08 Wk 45 Sat - 14:47 +03:00

````
new_inst: Inst { name: "cs_wait_chatbox", cmd: 4, opt_subcmd: None, fields: [U8("byte1", 120)] }
new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }

thread 'main' panicked at src/bin/dump_script.rs:102:9:
Failed to read cutscenescript instructions at Identifier { s: "cutscenescript_808DC58" }: Failed to route the command: No instruction schema found for position 32 and byte 0xFF
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

2025-11-08 Wk 45 Sat - 15:05 +03:00

It might be we went out of the script bounds. There is no way to know if we don't have the proper size of the script. We could know if we encounter an `end` command, but it's possible that a jump goes beyond it. Not sure if I want to apply this heuristic yet. We compute the labels only after correct reading... We can also consult lucky's dump to see if we've hit an end script here. ~~Let's clarify the command to tell us the exact ea of a read failure.~~ We don't have the info passed for exact ea reconstruction, but ee can see the position, and the script ea, so it's just adding them up like `cutscenescript_808DC58 + 32`.

From [001 Model mapscript bytecode and dump once > <a name="reminder-215779" />^reminder-215779](001%20Model%20mapscript%20bytecode%20and%20dump%20once.md#reminder-215779),

 > 
 > Here is also lucky's [dump](https://gist.github.com/luckytyphlosion/e3601b623b56403ce4891059553698e9) for reference which didn't make it in the repo.

Hmm it only goes up to `ExpoSite_CutsceneNPCScript_8063d0e`.

````
byte_808DBF9::
	.word 0x00000014, 0x0CFF2700, 0xFF290708, 0xFF290A9C, 0xFF290A9B, 0x0C390A9C, 0x07320D39, 0x54034A43
	.word 0x04403B01, 0x004701FF, 0x004101FF, 0xFE0001FF, 0x000010A0, 0xFF29303F, 0xE66B0A11, 0xE76B011C
	.word 0xFF02011C, 0xFFFF4E3C, 0x04C70158, 0x04C71D08, 0x00000008, 0x08FF2700, 0x183F0708
	.byte 0x3F
	.byte 0x04
	.byte 0x00

cutscenescript_808DC58:
	.word 0x1540003C, byte_808DBF9, 0x0057D450, 0x010C0802, 0x00400400, 0x00000100, 0x78040000, 0x00000000
end_cutscenescript_808DC58:
	.word 0x040000FF, 0xFF00002C, 0x00000000, 0x00000008
````

Let's add an end to that cutscene at the `32` mark.

2025-11-08 Wk 45 Sat - 15:38 +03:00

````
thread 'main' panicked at src/bin/dump_script.rs:135:18:
Failed to process script labels: Script pointer must be in ROM but Null is not. Instruction: Inst { name: "cs_set_cutscene_skip_script", cmd: 20, opt_subcmd: None, fields: [Ptr("ptr1", Null)
````

We made it to `CentralTown/data.s`!

````
modified:   apps/bn_repo_editor/lexer/bn6f.lexer.syms.ron
modified:   apps/bn_repo_editor/lexer/data/dat21.s.lexer.ron
modified:   apps/bn_repo_editor/lexer/data/dat22.s.lexer.ron
modified:   apps/bn_repo_editor/lexer/data/dat24.s.lexer.ron
modified:   apps/bn_repo_editor/lexer/maps/CentralTown/data.s.lexer.ron
````

Starting from `MapScriptOnInitCentralTown_804EA28` which is also in `CentralTown` but I guess we went to many different scripts.

2025-11-08 Wk 45 Sat - 15:49 +03:00

````
new_inst: Inst { name: "cs_enable_ow_player_wall_collision_809e248", cmd: 63, opt_subcmd: Some(U8(24)), fields: [] }
new_inst: Inst { name: "cs_unlock_player_after_non_npc_dialogue_809e122", cmd: 63, opt_subcmd: Some(U8(4)), fields: [] }
new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }

thread 'main' panicked at src/bin/dump_script.rs:135:18:
Failed to process script labels: Expected instruction to only have one script pointer
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

````
Failed to process script labels: Expected instruction to only have one script pointer: Inst { name: "cs_set_cutscene_skip_script", cmd: 20, opt_subcmd: None, fields: [Ptr("ptr1", Null)] }
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

````
thread 'main' panicked at src/bin/dump_script.rs:135:18:
Failed to process script labels: Expected instruction to only have one script pointer: Inst { name: "cs_set_cutscene_skip_script", cmd: 20, opt_subcmd: None, fields: [Ptr("ptr1", Null)] }, but got script_fields "[]"
````

2025-11-08 Wk 45 Sat - 16:01 +03:00

````
thread 'main' panicked at src/bin/dump_script.rs:102:9:
Failed to read cutscenescript instructions at Identifier { s: "byte_8099CEC" }: Failed to route the command: No instruction schema found for position 46 and byte 0x80
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

This is near `RunLMessageTextScript`

````
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
git commit -m "added label cutting impl"

# out
[main 2b6ffd5] added label cutting impl
 10 files changed, 583 insertions(+), 278 deletions(-)
````

Let's put an end script at

````sh
python3 -c "print(hex(0x8099CEC + 46))"

# out
0x8099d1a
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data byte_8099CEC --label -mmm -w 32 -c $(python3 -c "print(0x8099d1a)")
````

There's a pointer there `80CFF27` which cuts somewhere in `sub_80CFEE4`...

````
python3 -c "print(0x80CFF27 - 0x80CFEE4)"
python3 -c "print(0x80CFF5C - 0x80CFF27)"

# out
67
53
````

````
080cff1a g 00000000 AAAAAA
````

````
AAAAAA::
	push {r0}
	bl object_getFrontDirection // () -> int
	neg r2, r0
````

````
080cff28 g 00000000 AAAAAA
````

````
	lsl r1, r1, #0x10
AAAAAA::
	str r1, [r5,#oBattleObject_Z]
````

Okay it's just one instruction less at that `lsl`.

````C
end_cutscenescript_8099d1a:
	.word 0x1EFF0280, call_80CFF26+1
	.byte 0x07
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
make bn6f.sym

# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin bn_repo_editor lexer_once "/home/lan/src/cloned/gh/dism-exe/bn6f/asm/asm28_0.s"
cargo run --release --bin bn_repo_editor lexer_once "/home/lan/src/cloned/gh/dism-exe/bn6f/asm/asm31.s"
cargo run --release --bin bn_repo_editor lexer_once "/home/lan/src/cloned/gh/dism-exe/bn6f/data/dat24.s"
````

`asm31.s` is way too big for this. It'll take a while.

Anyway `call_80CFF26` looks suspicious. There's no clues this should be a pointer, so let's revert it.

2025-11-08 Wk 45 Sat - 16:42 +03:00

````
./data/dat21.s: Assembler messages:
./data/dat21.s:2132: Error: junk at end of line, first unrecognized character is `+'
./data/dat21.s:2476: Error: invalid offset, target not word aligned (0x00086CC2)
./data/dat21.s:2476: Error: invalid offset, value too big (0x00000006)
make: *** [Makefile:58: rom.o] Error 1
````

````sh
cutscenescript_8086299:
	.word 0x1540003C, 0x0808625B
+ COMPRESSED_PTR_FLAG, 0x5401FF02, 0x0861C800, 0x3C024A08, 0x3F080509, 0x271C3F34, 0x070808FF
	.word 0x08629914, 0x1EFF0208, 0x0400FF3A, 0x1EFF0280, 0x09010835, 0xFF020208, 0x03FF3A1E, 0xFF028004
	.word 0x0308351E, 0x02040809, 0xFF3A1EFF, 0x02800404, 0x08351EFF, 0x06080905, 0x3A1EFF02, 0x800407FF
	.word 0x143CFF02, 0x00000000, 0x020CFF27, 0x021F0850, 0x5307B4FF, 0xFF2700FF, 0x1407FF1C, byte_80862A1
	.word 0x3A5AFF02, 0x800408FF, 0x143CFF02, 0x00000000, 0x080CFF27, 0x390E3907, 0x00FF290F, 0x54034A05
	.word 0x04403B01, 0x004707FF, 0x004107FF, 0x050001FF, 0x0000FE80, 0xFF53303F, 0x5AFF0201, 0x27FFFF4E
	.word 0x070808FF, 0x043F183F, 0x40003C00, 0x08625B15
	.byte 0x08
````

Hmm. how did this happen

````rust
// in fn display_symbol_data_as_directives_with_labels
// Possible compressed pointer
let (_, _, label) = ea_syms
	.iter()
	.find(|(ea, _, _)| ea.get_raw_pointer() == (word & 0x0FFFFFFF))?;

Some((word, format!("{} + COMPRESSED_PTR_FLAG", label.s)))
````

Can this yield empty strings?

` byte_808615C` is cut with `cutscenescript_8086299` and ends in ` byte_80862A1`

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data byte_808615C --label -mmm -w 32 -c $(python3 -c "print(0x8086299)")

# out
label.s: "CompText87AE030", ea: 0x887AE030
.word 0x00000014, 0x0CFF2700, 0xFF020702, 0xFF0440B4, 0xFF004704, 0xFF004104, 0x00000001, 0x3F000000
.word 0x37FF2930, 0x01FF5305, 0x4CFFFF28, 0x61B80000, 0x3F3B0808, 0x00043F18, 0x1540003C, byte_808615C
.word 0x3740003C, off_80348FC, 0xFF18FF27, 0x01FF0207, 0x080CFF27, 0x615C1507, 0x00000808, 0x04000001
.word 0x00000000, 0x00000000, 0x00000000, 0xC0050000, 0x080000FD, 0x3E06003F, CompText87AE030 + COMPRESSED_PTR_FLAG, 0x5401FF02
.word 0x0861C800, 0x3C024A08, 0x3F080509, 0x271C3F34, 0x070808FF, 0x08629914, 0x1EFF0208, 0x0400FF3A
.word 0x1EFF0280, 0x09010835, 0xFF020208, 0x03FF3A1E, 0xFF028004, 0x0308351E, 0x02040809, 0xFF3A1EFF
.word 0x02800404, 0x08351EFF, 0x06080905, 0x3A1EFF02, 0x800407FF, 0x143CFF02, 0x00000000, 0x020CFF27
.word 0x021F0850, 0x5307B4FF, 0xFF2700FF, 0x1407FF1C, byte_80862A1, 0x3A5AFF02, 0x800408FF, 0x143CFF02
.word 0x00000000, 0x080CFF27, 0x390E3907, 0x00FF290F, 0x54034A05, 0x04403B01, 0x004707FF, 0x004107FF
.word 0x050001FF, 0x0000FE80, 0xFF53303F, 0x5AFF0201, 0x27FFFF4E, 0x070808FF, 0x043F183F
.byte 0x00

CUT:
.word 0x1540003C, 0x0808625B
````

Hmm.

````
+cutscenescript_8086299:
+       .word 0x1540003C, 0x0808625B
++ COMPRESSED_PTR_FLAG, 0x5401FF02, 0x0861C800, 0x3C024A08, 0x3F080509, 0x271C3F34, 0x070808FF
+       .word 0x08629914, 0x1EFF0208, 0x0400FF3A, 0x1EFF0280, 0x09010835, 0xFF020208, 0x03FF3A1E, 0xFF028004
+       .word 0x0308351E, 0x02040809, 0xFF3A1EFF, 0x02800404, 0x08351EFF, 0x06080905, 0x3A1EFF02, 0x800407FF
+       .word 0x143CFF02, 0x00000000, 0x020CFF27, 0x021F0850, 0x5307B4FF, 0xFF2700FF, 0x1407FF1C, byte_80862A1
+       .word 0x3A5AFF02, 0x800408FF, 0x143CFF02, 0x00000000, 0x080CFF27, 0x390E3907, 0x00FF290F, 0x54034A05
+       .word 0x04403B01, 0x004707FF, 0x004107FF, 0x050001FF, 0x0000FE80, 0xFF53303F, 0x5AFF0201, 0x27FFFF4E
+       .word 0x070808FF, 0x043F183F, 0x40003C00, 0x08625B15
+       .byte 0x08

````

Is it a search and replace issue?

````
substring_to_replace: "mapscript_80861D0:\n\t.word 0x3E06003F, CompText87AE030 "
new_content: "mapscript_80861D0:\n\t.word 0x3E06003F, CompText87AE030 + COMPRESSED_PTR_FLAG, 0x5401FF02, 0x0861C800, 0x3C024A08, 0x3F080509, 0x271C3F34, 0x070808FF\n\t.word 0x08629914, 0x1EFF0208, 0x0400FF3A, 0x1EFF0280, 0x09010835, 0xFF020208, 0x03FF3A1E, 0xFF028004\n\t.word 0x0308351E, 0x02040809, 0xFF3A1EFF, 0x02800404, 0x08351EFF, 0x06080905, 0x3A1EFF02, 0x800407FF\n\t.word 0x143CFF02, 0x00000000, 0x020CFF27, 0x021F0850, 0x5307B4FF, 0xFF2700FF, 0x1407FF1C, byte_80862A1\n\t.word 0x3A5AFF02, 0x800408FF, 0x143CFF02, 0x00000000, 0x080CFF27, 0x390E3907, 0x00FF290F, 0x54034A05\n\t.word 0x04403B01, 0x004707FF, 0x004107FF, 0x050001FF, 0x0000FE80, 0xFF53303F, 0x5AFF0201, 0x27FFFF4E\n\t.word 0x070808FF, 0x043F183F\n\t.byte 0x00\n\ncutscenescript_8086299:\n\t.word 0x1540003C, 0x0808625B\n"
````

That seems to to be it. This is a pretty wrong search and replace.

````
(lexon_type: DataBlock, lexon_data: DataBlockBuf([(Word, [1040580671])]), capture: ".word 0x3E06003F, ")
(lexon_type: Ident, lexon_data: Ident("CompText87AE030"), capture: "CompText87AE030 ")
(lexon_type: Plus, lexon_data: Sign, capture: "+ ")
(lexon_type: Ident, lexon_data: Ident("COMPRESSED_PTR_FLAG"), capture: "COMPRESSED_PTR_FLAG")
(lexon_type: Comma, lexon_data: Sign, capture: ", ")
(lexon_type: UHex, lexon_data: UHex(1409416962), capture: "0x5401FF02")
(lexon_type: Comma, lexon_data: Sign, capture: ", ")
(lexon_type: UHex, lexon_data: UHex(140625920), capture: "0x0861C800")
(lexon_type: Comma, lexon_data: Sign, capture: ", ")
(lexon_type: UHex, lexon_data: UHex(1006782984), capture: "0x3C024A08")
(lexon_type: Comma, lexon_data: Sign, capture: ", ")
(lexon_type: UHex, lexon_data: UHex(1057490185), capture: "0x3F080509")
(lexon_type: Comma, lexon_data: Sign, capture: ", ")
(lexon_type: UHex, lexon_data: UHex(656162612), capture: "0x271C3F34")
(lexon_type: Comma, lexon_data: Sign, capture: ", ")
(lexon_type: UHex, lexon_data: UHex(117967103), capture: "0x070808FF\n\t")
(lexon_type: DataBlock, lexon_data: DataBlockBuf([(Word, [140679444, 520028680, 67174202, 520028800, 151062581, 4278321672, 67058206, 4278353924]), (Word, [50869534, 33818633, 4281999103, 41944068, 137699071, 101189893, 975109890, 2147747839]), (Word, [339541762, 0, 34406183, 35588176, 1393014015, 4280746239, 336068380])]), capture: ".word 0x08629914, 0x1EFF0208, 0x0400FF3A, 0x1EFF0280, 0x09010835, 0xFF020208, 0x03FF3A1E, 0xFF028004\n\t.word 0x0308351E, 0x02040809, 0xFF3A1EFF, 0x02800404, 0x08351EFF, 0x06080905, 0x3A1EFF02, 0x800407FF\n\t.word 0x143CFF02, 0x00000000, 0x020CFF27, 0x021F0850, 0x5307B4FF, 0xFF2700FF, 0x1407FF1C, ")
(lexon_type: Ident, lexon_data: Word("byte_80862A1"), capture: "byte_80862A1\n\t")
````

We're not taking a plus.

````rust
// in fn cut_then_mark_new_label
.take_while(|(i, lexer_record)| {
	let encountered_significant_new_content = {
		if *i == 0 {
			return true;
		}

		match lexer_record.lexon_type {
			crate::lexer::LexonType::DataBlock
			| crate::lexer::LexonType::UHex
			| crate::lexer::LexonType::Comma
			| crate::lexer::LexonType::Directive
			| crate::lexer::LexonType::Ident
			| crate::lexer::LexonType::UInt
			| crate::lexer::LexonType::NegInt
			| crate::lexer::LexonType::NegHex => false,
			_ => true,
		}
	};

	!encountered_significant_new_content
})
````

2025-11-08 Wk 45 Sat - 17:44 +03:00

That resolved the issue.

````
new_inst: Inst { name: "ccs_set_camera_pos", cmd: 0, opt_subcmd: None, fields: [U16("hword1", 1280), U16("hword3", 64960), U16("hword5", 0)] }
new_inst: Inst { name: "ccs_end", cmd: 8, opt_subcmd: None, fields: [] }
new_inst: Inst { name: "cs_set_chatbox_flags", cmd: 60, opt_subcmd: Some(U8(0)), fields: [U8("byte2", 64)] }
new_inst: Inst { name: "cs_jump", cmd: 21, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 134767195 })] }

thread 'main' panicked at src/bin/dump_script.rs:151:17:
Failed to process new symbol data for ext_dest Identifier { s: "cutscenescript_808625B" }: Effective address RomEa { ea: 134767195 } is not in sym file
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

This is for `0x808625b`.  The fact that we got here means we processed all `script_labels` finally for this.

This should be between `mapscript_80861D0` and `cutscenescript_8086299`.  `encoding::process_script_labels` does not ensure that `ext_dest`s exist in map.

2025-11-08 Wk 45 Sat - 18:00 +03:00

It seems sloppy how we're handling script type. Let's ensure that when we err for cutting that we have a script type value to use for the prefix.

For `ext_dest` values, that script type would be identical to the script.

2025-11-08 Wk 45 Sat - 18:35 +03:00

````
-byte_804EB59:: // MapScript
+byte_804EB59::
+       .word 0x0557FF05, byte_804EEF6, 0x0558FF03, byte_804EEF6, 0xEB84010B, 0xFF1F0804, 0x0C1E0558, 0x9CEC26FF
+       .word 0x00000809, 0xF6010000, 0x200804EE, 0x1E0557FF, 0xEC26FF0C, 0x0108099C, 0x01000000, byte_804EEF6
+       .word 0x011EA829, 0x030C0202, 0xF2FF1F08, 0x1EB42916, 0x0B020201, 0xFF1F0805, 0xFF0516F5, 0xEEF60537
+       .word 0xFF030804, 0xEEF60538, 0xFF1F0804, 0x0C1E0538, 0x63042BFF, 0x0861D026, 0x00000008, 0xEEF60100
+       .byte
+       .byte 0x04
+       .byte 0x08
+
+mapscript_804EBDB:
+       .word 0xEE212102, 0x020804EB, 0xEC132222, 0xF6010804, 0x050804EE, 0xF60609FF, 0x030804EE, 0xF6060AFF
+       .word 0x1F0804EE, 0x1E060AFF, 0x1426FF0C, 0x00080877, 0x01000000, byte_804EEF6, 0x0611FF05, byte_804EEF6
+       .word 0x0612FF03, byte_804EEF6, 0x0612FF1F, 0x2BFF0C1E, 0x98266304, 0x0008087F, 0x01000000, byte_804EEF6
+       .word 0x4E323202, 0x020804EC, 0xEC683333, 0xF6010804, 0x030804EE, 0xF6086CFF, 0x290804EE, unk_2011EB4
+       .word 0x08051402, 0x16F5FF1F, 0x04EEF601, 0x21FF0508, 0x04EEF608, 0x22FF0308, 0x04EEF608, 0x22FF1F08
+       .word 0xFF0C1E08, 0x08B6F026, 0x00000008, 0xEEF60100, 0x43020804, 0x04EC9943, 0xEEF60108
+       .byte 0x04
+       .byte 0x08
+// MapScript
   .byte 0x5, 0xFF, 0x57, 0x5, 0xF6, 0xEE, 0x4, 0x8, 0x3, 0xFF, 0x58
        .byte 0x5, 0xF6, 0xEE, 0x4, 0x8, 0xB, 0x1, 0x84, 0xEB, 0x4, 0x8
        .byte 0x1F, 0xFF, 0x58, 0x5, 0x1E, 0xC, 0xFF, 0x26, 0xEC, 0x9C, 0x9
````

The comments are not handled?

````
substring_to_replace: "byte_804EB59:: "
new_content: "byte_804EB59::\n\t.word 0x0557FF05, byte_804EEF6, 0x0558FF03, byte_804EEF6, 0xEB84010B, 0xFF1F0804, 0x0C1E0558, 0x9CEC26FF\n\t.word 0x00000809, 0xF6010000, 0x200804EE, 0x1E0557FF, 0xEC26FF0C, 0x0108099C, 0x01000000, byte_804EEF6\n\t.word 0x011EA829, 0x030C0202, 0xF2FF1F08, 0x1EB42916, 0x0B020201, 0xFF1F0805, 0xFF0516F5, 0xEEF60537\n\t.word 0xFF030804, 0xEEF60538, 0xFF1F0804, 0x0C1E0538, 0x63042BFF, 0x0861D026, 0x00000008, 0xEEF60100\n\t.byte \n\t.byte 0x04\n\t.byte 0x08\n\nmapscript_804EBDB:\n\t.word 0xEE212102, 0x020804EB, 0xEC132222, 0xF6010804, 0x050804EE, 0xF60609FF, 0x030804EE, 0xF6060AFF\n\t.word 0x1F0804EE, 0x1E060AFF, 0x1426FF0C, 0x00080877, 0x01000000, byte_804EEF6, 0x0611FF05, byte_804EEF6\n\t.word 0x0612FF03, byte_804EEF6, 0x0612FF1F, 0x2BFF0C1E, 0x98266304, 0x0008087F, 0x01000000, byte_804EEF6\n\t.word 0x4E323202, 0x020804EC, 0xEC683333, 0xF6010804, 0x030804EE, 0xF6086CFF, 0x290804EE, unk_2011EB4\n\t.word 0x08051402, 0x16F5FF1F, 0x04EEF601, 0x21FF0508, 0x04EEF608, 0x22FF0308, 0x04EEF608, 0x22FF1F08\n\t.word 0xFF0C1E08, 0x08B6F026, 0x00000008, 0xEEF60100, 0x43020804, 0x04EC9943, 0xEEF60108\n\t.byte 0x04\n\t.byte 0x08\n"
````

Right a comment is considered significant and so it stops parsing.

2025-11-08 Wk 45 Sat - 18:46 +03:00

It seems we have to at least include inline comments since we can encounter type comments...

````
substring_to_replace: "byte_804EB59:: // MapScript\n  .byte 0x5, 0xFF, 0x57, 0x5, 0xF6, 0xEE, 0x4, 0x8, 0x3, 0xFF, 0x58\n\t.byte 0x5, 0xF6, 0xEE, 0x4, 0x8, 0xB, 0x1, 0x84, 0xEB, 0x4, 0x8\n\t.byte 0x1F, 0xFF, 0x58, 0x5, 0x1E, 0xC, 0xFF, 0x26, 0xEC, 0x9C, 0x9\n\t.byte 0x8, 0x0, 0x0, 0x0, 0x0, 0x1\n\t.word byte_804EEF6 // MapScript\n\t.byte 0x20, 0xFF, 0x57, 0x5, 0x1E, 0xC, 0xFF, 0x26\n\t.word byte_8099CEC\n\t.byte 0x1, 0x0, 0x0, 0x0, 0x1, 0xF6, 0xEE, 0x4, 0x8, 0x29, 0xA8, 0x1E\n\t.byte 0x1, 0x2, 0x2, 0xC, 0x3, 0x8, 0x1F, 0xFF, 0xF2, 0x16, 0x29, 0xB4\n\t.byte 0x1E, 0x1, 0x2, 0x2, 0xB, 0x5, 0x8, 0x1F, 0xFF, 0xF5, 0x16, 0x5\n\t.byte 0xFF, 0x37, 0x5, 0xF6, 0xEE, 0x4, 0x8, 0x3, 0xFF, 0x38, 0x5, 0xF6\n\t.byte 0xEE, 0x4, 0x8, 0x1F, 0xFF, 0x38, 0x5, 0x1E, 0xC, 0xFF, 0x2B, 0x4\n\t.byte 0x63, 0x26, 0xD0, 0x61, 0x8, 0x8, 0x0, 0x0, 0x0, 0x0, 0x1, 0xF6\n\t.byte 0xEE, 0x4, 0x8, 0x2, 0x21, 0x21, 0xEE, 0xEB, 0x4, 0x8, 0x2, 0x22\n\t.byte 0x22, 0x13, 0xEC, 0x4, 0x8, 0x1, 0xF6, 0xEE, 0x4, 0x8, 0x5, 0xFF\n\t.byte 0x9, 0x6, 0xF6, 0xEE, 0x4, 0x8, 0x3, 0xFF, 0xA, 0x6, 0xF6, 0xEE\n\t.byte 0x4, 0x8, 0x1F, 0xFF, 0xA, 0x6, 0x1E, 0xC, 0xFF, 0x26, 0x14, 0x77\n\t.byte 0x8, 0x8, 0x0, 0x0, 0x0, 0x0, 0x1, 0xF6, 0xEE, 0x4, 0x8, 0x5\n\t.byte 0xFF, 0x11, 0x6, 0xF6, 0xEE, 0x4, 0x8, 0x3, 0xFF, 0x12, 0x6, 0xF6\n\t.byte 0xEE, 0x4, 0x8, 0x1F, 0xFF, 0x12, 0x6, 0x1E, 0xC, 0xFF, 0x2B, 0x4\n\t.byte 0x63, 0x26, 0x98, 0x7F, 0x8, 0x8, 0x0, 0x0, 0x0, 0x0, 0x1, 0xF6\n\t.byte 0xEE, 0x4, 0x8, 0x2, 0x32, 0x32, 0x4E, 0xEC, 0x4, 0x8, 0x2, 0x33\n\t.byte 0x33, 0x68, 0xEC, 0x4, 0x8, 0x1, 0xF6, 0xEE, 0x4, 0x8, 0x3, 0xFF\n\t.byte 0x6C, 0x8, 0xF6, 0xEE, 0x4, 0x8, 0x29, 0xB4, 0x1E, 0x1, 0x2, 0x2\n\t.byte 0x14, 0x5, 0x8, 0x1F, 0xFF, 0xF5, 0x16, 0x1\n\t.word byte_804EEF6 // MapScript\n\t.word 0x821FF05\n\t.word byte_804EEF6 // MapScript\n\t.word 0x822FF03\n\t.word byte_804EEF6 // MapScript\n\t.word 0x822FF1F\n\t.word 0x26FF0C1E\n\t.word byte_808B6F0\n\t.word 0x0\n\t.word 0x4EEF601\n\t.word 0x43430208\n\t.word byte_804EC99 // MapScript\n\t.word 0x4EEF601\n\t.byte 0x8\n"

new_content: "byte_804EB59::\n\t.word 0x0557FF05, 0x0804F00B, 0x0558FF03, 0x0804F00B, 0xEB84010B, 0xFF1F0804, 0x0C1E0558, 0x9CEC26FF\n\t.word 0x00000809, 0xF6010000, 0x200804EE, 0x1E0557FF, 0xEC26FF0C, 0x0108099C, 0x01000000, 0x0804F00B\n\t.word 0x011EA829, 0x030C0202, 0xF2FF1F08, 0x1EB42916, 0x0B020201, 0xFF1F0805, 0xFF0516F5, 0xEEF60537\n\t.word 0xFF030804, 0xEEF60538, 0xFF1F0804, 0x0C1E0538, 0x63042BFF, 0x0861D026, 0x00000008, 0xEEF60100\n\t.byte \n\t.byte 0x04\n\t.byte 0x08\n\nmapscript_804EBDB:\n\t.word 0xEE212102, 0x020804EB, 0xEC132222, 0xF6010804, 0x050804EE, 0xF60609FF, 0x030804EE, 0xF6060AFF\n\t.word 0x1F0804EE, 0x1E060AFF, 0x1426FF0C, 0x00080877, 0x01000000, 0x0804F00B, 0x0611FF05, 0x0804F00B\n\t.word 0x0612FF03, 0x0804F00B, 0x0612FF1F, 0x2BFF0C1E, 0x98266304, 0x0008087F, 0x01000000, 0x0804F00B\n\t.word 0x4E323202, 0x020804EC, 0xEC683333, 0xF6010804, 0x030804EE, 0xF6086CFF, 0x290804EE, unk_2011EB4\n\t.word 0x08051402, 0x16F5FF1F, 0x04EEF601, 0x21FF0508, 0x04EEF608, 0x22FF0308, 0x04EEF608, 0x22FF1F08\n\t.word 0xFF0C1E08, 0x08B6F026, 0x00000008, 0xEEF60100, 0x43020804, 0x04EC9943, 0xEEF60108\n\t.byte 0x04\n\t.byte 0x08\n"
````

Even in `new_content` it says `.byte \n\t`. But why?

2025-11-08 Wk 45 Sat - 19:10 +03:00

````
+unk_805093C:
+       .word byte_8050948, byte_805095E, 0x000000FF
 byte_8050948::
        .byte 0x8, 0x1F, 0x27, 0x17, 0x0, 0x14, 0x50, 0x0, 0xE8, 0xFF
````

Nice, data!

````
new_inst: Inst { name: "cs_jump", cmd: 21, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 134767195 })] }
new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
new_inst: Inst { name: "cs_init_scenario_effect", cmd: 96, opt_subcmd: None, fields: [U8("byte1", 14)] }

thread 'main' panicked at src/bin/dump_script.rs:102:9:
Failed to read cutscenescript instructions at Identifier { s: "byte_80862A1" }: Failed to route the command: No instruction schema found for position 30 and byte 0x80
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

There's a jump to `'0x808625b`, so that might be the end of the script in there.

Let's assume it ends at the `jump`.

````
byte_80862A1::
	.byte 0x3C, 0x0, 0x40, 0x37, 0xFC, 0x48, 0x3, 0x8, 0x27, 0xFF
	.byte 0x18, 0xFF, 0x7, 0x2, 0xFF, 0x1, 0x27, 0xFF, 0xC, 0x8
	.byte 0x7, 0x15, 0x5B, 0x62, 0x8, 0x8
end_cutscenescript_80862C5::
  .byte 0x0, 0x0, 0x60, 0xE
	.byte 0x80, 0xF4, 0x0, 0x0, 0x8, 0x18, 0x9C, 0xFF, 0xC4, 0xFF
	.byte 0x0, 0x0, 0x20, 0x0, 0x8, 0x18, 0x5E, 0x0, 0xC6, 0x0
	.byte 0x0, 0x0, 0x20, 0x0, 0x8, 0x0, 0x20, 0xFC, 0xA0, 0xE6
	.byte 0x0, 0x0, 0x8, 0x18, 0x44, 0x0, 0xAE, 0xFF, 0x0, 0x0
	.byte 0x20, 0x0, 0x8, 0x18, 0xC2, 0x0, 0x1E, 0x0, 0x0, 0x0
	.byte 0x20, 0x0, 0x8, 0x0, 0x20, 0xF7, 0xE0, 0xE6, 0x0, 0x0
	.byte 0x8, 0x18, 0x32, 0x0, 0xC4, 0xFE, 0x0, 0x0, 0x20, 0x0
	.byte 0x8, 0x18, 0x32, 0x0, 0x4E, 0x0, 0x0, 0x0, 0x20, 0x0
	.byte 0x8
````

2025-11-08 Wk 45 Sat - 19:38 +03:00

````
new_inst: Inst { name: "cs_pause", cmd: 2, opt_subcmd: None, fields: [U8("byte1", 255), U8("byte2", 1)] }
new_inst: Inst { name: "cs_set_screen_fade", cmd: 39, opt_subcmd: None, fields: [U8("byte1", 255), U8("byte2", 12), U8("byte3", 8)] }
new_inst: Inst { name: "cs_wait_screen_fade", cmd: 7, opt_subcmd: None, fields: [] }
new_inst: Inst { name: "cs_jump", cmd: 21, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 134767195 })] }
628 0x808625B

thread 'main' panicked at src/bin/dump_script.rs:139:41:
Failed to cut then mark new label: Failed to cut label data: Expected 0x08625b to be within range of 0x8b bytes of 0x0861d0
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

`cutscenescript_808625B` already exists. Need to add logic to check again for duplicates that were already handled.

2025-11-08 Wk 45 Sat - 19:52 +03:00

````
new_inst: Inst { name: "cs_end_for_map_reload_maybe_80376dc", cmd: 1, opt_subcmd: None, fields: [] }
new_inst: Inst { name: "cs_add_request_range", cmd: 120, opt_subcmd: None, fields: [] }
new_inst: Inst { name: "cs_end_scenario_effect", cmd: 97, opt_subcmd: None, fields: [] }

thread 'main' panicked at src/bin/dump_script.rs:102:9:
Failed to read cutscenescript instructions at Identifier { s: "cutscenescript_8087714" }: Invalid Ea processed in byte 299 for Inst InstSchema { name: "cs_jump_if_hword_equals", cmd: 27, opt_subcmd: Some(U8(1)), fields: [U32("word2"), Dest("destination6"), U16("hword10")] } and Field Dest("destination6"): Effective address 18572152 is invalid.
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

````sh
python3 -c "print(hex(0x8087714 + 299))"

# out
0x808783f
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data cutscenescript_8087714 --label -mmm -w 32 -c $(python3 -c "print(0x808783f)")
````

2025-11-08 Wk 45 Sat - 20:32 +03:00

````
new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
new_inst: Inst { name: "cs_wait_chatbox", cmd: 4, opt_subcmd: None, fields: [U8("byte1", 200)] }
new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
new_inst: Inst { name: "cs_end_for_map_reload_maybe_80376dc", cmd: 1, opt_subcmd: None, fields: [] }
new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }

thread 'main' panicked at src/bin/dump_script.rs:102:9:
Failed to read cutscenescript instructions at Identifier { s: "cutscenescript_8087F98" }: Failed to route the command: No instruction schema found for position 213 and byte 0xFF
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

The last instruction that makes sense here is

````
new_inst: Inst { name: "cs_jump", cmd: 21, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 134774768 })] }
````

byte `0x15` and `0x8087ff0`

````
174 new_inst: Inst { name: "cs_jump", cmd: 21, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 134774768 })] }
179 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
````

It's at position `174` and the next which looks like junk is at `179`, so let's cut there.

````sh
python3 -c "print(hex(0x8087F98 + 179))"

# out
0x808804b
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data cutscenescript_8087F98 --label -mmm -w 32 -c $(python3 -c "print(0x808804b)")
````

2025-11-08 Wk 45 Sat - 20:52 +03:00

````
170 new_inst: Inst { name: "ms_set_event_flag", cmd: 31, opt_subcmd: None, fields: [U8("byte1", 255), Event16("event16_2", 5877)] }
174 new_inst: Inst { name: "ms_write_word", cmd: 41, opt_subcmd: None, fields: [Ptr("ptr1", Ewram(EwramEa { ea: 33627816 })), U32("word5", 134423554)] }
183 new_inst: Inst { name: "ms_set_event_flag", cmd: 31, opt_subcmd: None, fields: [U8("byte1", 255), Event16("event16_2", 5874)] }
187 new_inst: Inst { name: "ms_write_word", cmd: 41, opt_subcmd: None, fields: [Ptr("ptr1", Ewram(EwramEa { ea: 33627812 })), U32("word5", 134554882)] }
196 new_inst: Inst { name: "ms_set_event_flag", cmd: 31, opt_subcmd: None, fields: [U8("byte1", 255), Event16("event16_2", 5873)] }
200 new_inst: Inst { name: "ms_write_word", cmd: 41, opt_subcmd: None, fields: [Ptr("ptr1", Ewram(EwramEa { ea: 33627824 })), U32("word5", 134424066)] }
209 new_inst: Inst { name: "ms_set_event_flag", cmd: 31, opt_subcmd: None, fields: [U8("byte1", 255), Event16("event16_2", 5876)] }
213 new_inst: Inst { name: "ms_start_cutscene", cmd: 38, opt_subcmd: None, fields: [Ptr("ptr1", Rom(RomEa { ea: 134809804 })), U32("word5", 0)] }
222 new_inst: Inst { name: "ms_jump", cmd: 1, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 134541046 })] }
658 33627824

thread 'main' panicked at src/bin/dump_script.rs:118:26:
We can only cut in ROM EAs
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

````
222 new_inst: Inst { name: "ms_jump", cmd: 1, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 134541046 })] }
658 33627824

thread 'main' panicked at src/bin/dump_script.rs:118:27:
We can only cut in ROM EAs: Ewram(EwramEa { ea: 33627824 })
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

This is a RAM location `0x2011eb0`

2025-11-09 Wk 45 Sun - 02:10 +03:00

More clarified,

````
200 new_inst: Inst { name: "ms_write_word", cmd: 41, opt_subcmd: None, fields: [Ptr("ptr1", Ewram(EwramEa { ea: 33627824 })), U32("word5", 134424066)] }
209 new_inst: Inst { name: "ms_set_event_flag", cmd: 31, opt_subcmd: None, fields: [U8("byte1", 255), Event16("event16_2", 5876)] }
213 new_inst: Inst { name: "ms_start_cutscene", cmd: 38, opt_subcmd: None, fields: [Ptr("ptr1", Rom(RomEa { ea: 134809804 })), U32("word5", 0)] }
222 new_inst: Inst { name: "ms_jump", cmd: 1, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 134541046 })] }
658 33627824

thread 'main' panicked at src/bin/dump_script.rs:118:27:
script RomEa { ea: 134540502 } "byte_804ECD6": We can only cut in ROM EAs: Ewram(EwramEa { ea: 33627824 })
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

I can cut the RAM values myself for now. Hopefully there aren't many.

2025-11-09 Wk 45 Sun - 02:20 +03:00

````
0 new_inst: Inst { name: "cs_lock_player_for_non_npc_dialogue_809e0b0", cmd: 63, opt_subcmd: Some(U8(0)), fields: [] }
2 new_inst: Inst { name: "cs_nop_80377d0", cmd: 6, opt_subcmd: None, fields: [] }
3 new_inst: Inst { name: "cs_call_native_with_return_value", cmd: 75, opt_subcmd: None, fields: [Ptr("ptr1", Rom(RomEa { ea: 134843597 }))] }
8 new_inst: Inst { name: "cs_jump_if_var_equal", cmd: 28, opt_subcmd: None, fields: [U8("byte1", 5), U8("byte2", 255), Dest("destination3", RomEa { ea: 134843531 })] }
15 new_inst: Inst { name: "cs_run_text_script", cmd: 58, opt_subcmd: None, fields: [U8("byte1", 5), U8("byte2", 4)] }

thread 'main' panicked at src/bin/dump_script.rs:102:9:
Failed to read cutscenescript instructions at Identifier { s: "byte_8098C78" }: Failed to route the command: No instruction schema found for position 18 and byte 0x80
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
(
````

````
	enum cs_run_text_script_cmd // 0x3a
// 0x3a byte1 byte2
// run text script from pre-loaded text archive with the given index
// byte1 - memory param
// byte2 or mem - text script to run
// the length of the command is 2 if from mem, otherwise 3
	.macro cs_run_text_script byte1:req byte2:req
	.byte cs_run_text_script_cmd
	.byte \byte1
	.if \byte1 != 0xff
	.byte \byte2
	.endif
	.endm
````

This command is variable in size, but that shouldn't have triggered here. So there's `0x3a byte1` and there's `0x3a 0xFF byte2`.  It should fallback

to `0x3a byte1` if `byte1` doesn't match a subcmd of `0xFF`.

`CutsceneCmd_run_text_script` reads byte1, if it's `0xFF`, it then reads byte2. So it's from mem if it's not 0xFF.

So like this:

````
	.macro cs_run_text_script_from_mem byte1:req
	.byte cs_run_text_script_cmd
	.byte \byte1
	.endm

	.macro cs_run_text_script_not_from_mem byte2:req
	.byte cs_run_text_script_cmd
	.byte 0xff
	.byte \byte2
	.endm
````

2025-11-09 Wk 45 Sun - 03:02 +03:00

````
32 new_inst: Inst { name: "cs_pause", cmd: 2, opt_subcmd: None, fields: [U8("byte1", 255), U8("byte2", 30)] }
35 new_inst: Inst { name: "cs_set_screen_fade", cmd: 39, opt_subcmd: None, fields: [U8("byte1", 255), U8("byte2", 8), U8("byte3", 8)] }
39 new_inst: Inst { name: "cs_wait_screen_fade", cmd: 7, opt_subcmd: None, fields: [] }
40 new_inst: Inst { name: "cs_pause", cmd: 2, opt_subcmd: None, fields: [U8("byte1", 255), U8("byte2", 30)] }
43 new_inst: Inst { name: "cs_run_text_script_from_mem", cmd: 58, opt_subcmd: None, fields: [U8("byte1", 5)] }

thread 'main' panicked at src/bin/dump_script.rs:102:9:
Failed to read cutscenescript instructions at Identifier { s: "byte_8099CEC" }: Inst InstSchema { name: "cs_wait_chatbox", cmd: 4, opt_subcmd: None, fields: [U8("byte1")] } overflows buffer size 46 at position 45
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace

````

It invalidates `end_cutscenescript_8099d1a` now. Let's remove that.

````
54 new_inst: Inst { name: "cs_pause", cmd: 2, opt_subcmd: None, fields: [U8("byte1", 255), U8("byte2", 30)] }
57 new_inst: Inst { name: "cs_run_text_script_from_mem", cmd: 58, opt_subcmd: None, fields: [U8("byte1", 255)] }
59 new_inst: Inst { name: "cs_long_pause", cmd: 3, opt_subcmd: None, fields: [U8("byte1", 4), U16("hword2", 640)] }

thread 'main' panicked at src/bin/dump_script.rs:102:9:
Failed to read cutscenescript instructions at Identifier { s: "cutscenescript_80861D0" }: Failed to route the command: No instruction schema found for position 63 and byte 0xFF
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

This should have triggered reading of `cs_run_text_script_not_from_mem` instead of `cs_run_text_script_from_mem`. Reordering the schemas has no effect.

2025-11-09 Wk 45 Sun - 03:20 +03:00

Tracing through `route_inst` for `0x3A`,

````
command: 0x3A, possible_subcmd: 0xFF
fallbacks: [InstSchema { name: "cs_run_text_script_from_mem", cmd: 58, opt_subcmd: None, fields: [U8("byte1")] }]
inst_schema_with_subcmds: [(U8(255), InstSchema { name: "cs_run_text_script_not_from_mem", cmd: 58, opt_subcmd: Some(U8(255)), fields: [U8("byte2")] })]
remaining_possible_inst_schemas: [InstSchema { name: "cs_run_text_script_not_from_mem", cmd: 58, opt_subcmd: Some(U8(255)), fields: [U8("byte2")] }]
````

````rust
// Defer to the fallback if the subcmd routing failed
if fallbacks.len() == 1 {
	fallbacks[0].clone()
} else {
	(*remaining_possible_inst_schemas[0]).clone()
}
````

This does not seem right. It's returning to fallback even when there's only one remaining possible inst schema.

````
command: 0x3A, possible_subcmd: 0xFF
193 new_inst: Inst { name: "cs_run_text_script_not_from_mem", cmd: 58, opt_subcmd: Some(U8(255)), fields: [U8("byte2", 11)] }
196 new_inst: Inst { name: "cs_wait_chatbox", cmd: 4, opt_subcmd: None, fields: [U8("byte1", 128)] }
1
````

Fixed that to actually use the routed, and only defer on failure.

````
command: 0x3A, possible_subcmd: 0xFF
70 new_inst: Inst { name: "cs_run_text_script_not_from_mem", cmd: 58, opt_subcmd: Some(U8(255)), fields: [U8("byte2", 1)] }
73 new_inst: Inst { name: "cs_wait_chatbox", cmd: 4, opt_subcmd: None, fields: [U8("byte1", 128)] }

thread 'main' panicked at src/bin/dump_script.rs:102:9:
Failed to read cutscenescript instructions at Identifier { s: "byte_80905BC" }: Inst InstSchema { name: "cs_pause", cmd: 2, opt_subcmd: None, fields: [U8("byte1"), U8("byte2")] } overflows buffer size 76 at position 75
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

This is overflowing to `byte_8090608`.

Let's treat it as a fake pointer alongside `byte_8090A08`, `byte_8090808`, `byte_8090809`

2025-11-09 Wk 45 Sun - 03:53 +03:00

````
282 new_inst: Inst { name: "cs_jump", cmd: 21, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 134809211 })] }
287 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
288 new_inst: Inst { name: "cs_sound_cmd_803810e", cmd: 80, opt_subcmd: None, fields: [U8("byte1", 212), U8("byte2", 87)] }
291 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
292 new_inst: Inst { name: "cs_pause", cmd: 2, opt_subcmd: None, fields: [U8("byte1", 8), U8("byte2", 4)] }
295 new_inst: Inst { name: "cs_init_scenario_effect", cmd: 96, opt_subcmd: None, fields: [U8("byte1", 0)] }
297 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
298 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
299 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }

thread 'main' panicked at src/bin/dump_script.rs:102:9:
Failed to read cutscenescript instructions at Identifier { s: "byte_80905BC" }: Failed to route the command: No instruction schema found for position 300 and byte 0xFF
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

Let's cut it after `cs_jump` at 287.

````sh
python3 -c "print(hex(0x80905BC + 287))"

# out
0x80906db
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data byte_80905BC --label -mmm -w 32 -c $(python3 -c "print(0x80906db)")
````

Added `end_cutscenescript_80906db`.

2025-11-09 Wk 45 Sun - 04:05 +03:00

````
43 new_inst: Inst { name: "cs_pause", cmd: 2, opt_subcmd: None, fields: [U8("byte1", 255), U8("byte2", 60)] }
46 new_inst: Inst { name: "cs_disable_cutscene_skip_script", cmd: 20, opt_subcmd: Some(U8(0)), fields: [] }
48 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
49 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
50 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
51 new_inst: Inst { name: "cs_do_pet_effect", cmd: 83, opt_subcmd: None, fields: [U8("byte1", 255), U8("byte2", 1)] }
54 new_inst: Inst { name: "cs_set_screen_fade", cmd: 39, opt_subcmd: None, fields: [U8("byte1", 255), U8("byte2", 8), U8("byte3", 4)] }
58 new_inst: Inst { name: "cs_wait_screen_fade", cmd: 7, opt_subcmd: None, fields: [] }

thread 'main' panicked at src/bin/dump_script.rs:102:9:
Failed to read cutscenescript instructions at Identifier { s: "byte_80908CC" }: Failed to route the command: Expected a next byte in the buffer to process a subcmd but found none
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

It ends in another suspicious label `off_8090908`

2025-11-09 Wk 45 Sun - 04:16 +03:00

````
69 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
0 new_inst: Inst { name: "ccs_write_camera_field_03_14", cmd: 80, opt_subcmd: None, fields: [Ptr("ptr1", Ewram(EwramEa { ea: 33576916 }))] }
5 new_inst: Inst { name: "ccs_end", cmd: 8, opt_subcmd: None, fields: [] }
6 new_inst: Inst { name: "ccs_set_camera_pos", cmd: 0, opt_subcmd: None, fields: [U16("hword1", 16128), U16("hword3", 1536), U16("hword5", 14398)] }

thread 'main' panicked at src/bin/dump_script.rs:102:9:
Failed to read ccs instructions at Identifier { s: "ccs_80909B4" }: Failed to route the command: No instruction schema found for position 13 and byte 0x36
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

````sh
python3 -c "print(hex(0x80909B4 + 6))"

# out
0x80909ba
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data ccs_80909B4 --label -mmm -w 32 -c $(python3 -c "print(0x80909ba)")
````

Added `end_css_80909BA`

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin bn_repo_editor lexer_once "/home/lan/src/cloned/gh/dism-exe/bn6f/data/dat25.s"
````

Saving as checkpoint with `git commit --amend .` for both `bn6f` and the lexer data.

2025-11-09 Wk 45 Sun - 04:31 +03:00

````
0 new_inst: Inst { name: "ccs_simple_scroll", cmd: 4, opt_subcmd: None, fields: [U16("hword1", 62), U16("hword3", 256), U16("hword5", 0), U16("hword7", 0)] }
9 new_inst: Inst { name: "ccs_simple_scroll", cmd: 4, opt_subcmd: None, fields: [U16("hword1", 108), U16("hword3", 256), U16("hword5", 65280), U16("hword7", 0)] }
18 new_inst: Inst { name: "ccs_end", cmd: 8, opt_subcmd: None, fields: [] }

thread 'main' panicked at src/bin/dump_script.rs:102:9:
Failed to read ccs instructions at Identifier { s: "ccs_809487F" }: Inst InstSchema { name: "ccs_set_camera_pos", cmd: 0, opt_subcmd: None, fields: [U16("hword1"), U16("hword3"), U16("hword5")] } overflows buffer size 21 at position 19
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

There's a `cutscenescript_8094894` right after, so it likely doesn't overflow, and we've seen a `ccs_end` command. We need to cut this at position 19

````sh
python3 -c "print(hex(0x809487F + 19))"

# out
0x8094892
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data ccs_809487F --label -mmm -w 32 -c $(python3 -c "print(0x8094892)")

# out
.word 0x00003E04, 0x00000001, 0x006C0400, 0xFF000100
.byte 0x00
.byte 0x00
.byte 0x08

CUT:
.byte
.byte 0x00
.byte 0x00
````

Need to fix this empty `.byte` at some point, but it doesn't hurt us to remove currently.

This was for data

````
ccs_809487F:
    .word 0x00003E04, 0x00000001, 0x006C0400, 0xFF000100, 0x00080000
    .byte 0x00
````

Added `end_ccs_8094892`

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin bn_repo_editor lexer_once "/home/lan/src/cloned/gh/dism-exe/bn6f/data/dat27.s"
````

And again

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin dump_script map trace MapScriptOnInitCentralTown_804EA28
````

It seems we have to intervene a lot to make a judgment about when cutscene and cutscenecamera scripts end.

2025-11-09 Wk 45 Sun - 04:42 +03:00

````
0 new_inst: Inst { name: "ccs_simple_scroll", cmd: 4, opt_subcmd: None, fields: [U16("hword1", 62), U16("hword3", 256), U16("hword5", 0), U16("hword7", 0)] }
9 new_inst: Inst { name: "ccs_simple_scroll", cmd: 4, opt_subcmd: None, fields: [U16("hword1", 108), U16("hword3", 256), U16("hword5", 65280), U16("hword7", 0)] }
18 new_inst: Inst { name: "ccs_end", cmd: 8, opt_subcmd: None, fields: [] }
0 new_inst: Inst { name: "ms_jump_if_flag_set", cmd: 3, opt_subcmd: None, fields: [U8("byte1", 255), Event16("event16_2", 3638), Dest("destination4", RomEa { ea: 134540861 })] }
8 new_inst: Inst { name: "ms_write_word", cmd: 41, opt_subcmd: None, fields: [Ptr("ptr1", Ewram(EwramEa { ea: 33627820 })), U32("word5", 134424578)] }
17 new_inst: Inst { name: "ms_set_event_flag", cmd: 31, opt_subcmd: None, fields: [U8("byte1", 255), Event16("event16_2", 5875)] }
21 new_inst: Inst { name: "ms_jump", cmd: 1, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 134540861 })] }
666 33627820

thread 'main' panicked at src/bin/dump_script.rs:118:27:
script RomEa { ea: 134540835 } "mapscript_804EE23": We can only cut in ROM EAs: Ewram(EwramEa { ea: 33627820 })
````

This is `0x2011eac`

````diff
// in ewram.s
-unk_2011EA8:: // 0x2011ea8
-	.space 8
+unk_2011EA8:: // 0x2011ea8
+	.space 4
+unk_2011EAC:: // 0x2011eac
+	.space 4
````

2025-11-09 Wk 45 Sun - 04:51 +03:00

````
28 new_inst: Inst { name: "cs_unlock_player_after_non_npc_dialogue_809e122", cmd: 63, opt_subcmd: Some(U8(4)), fields: [] }
30 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
0 new_inst: Inst { name: "ccs_simple_scroll", cmd: 4, opt_subcmd: None, fields: [U16("hword1", 24), U16("hword3", 128), U16("hword5", 128), U16("hword7", 0)] }
9 new_inst: Inst { name: "ccs_end", cmd: 8, opt_subcmd: None, fields: [] }

thread 'main' panicked at src/bin/dump_script.rs:102:9:
Failed to read ccs instructions at Identifier { s: "ccs_8081C78" }: Inst InstSchema { name: "ccs_set_camera_pos", cmd: 0, opt_subcmd: None, fields: [U16("hword1"), U16("hword3"), U16("hword5")] } overflows buffer size 12 at position 10
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
(
````

````sh
python3 -c "print(hex(0x8081C78 + 10))"

# out
0x8081c82
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data ccs_8081C78 --label -mmm -w 32 -c $(python3 -c "print(0x8081c82)")
````

Added `end_ccs_8081C82`.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin bn_repo_editor lexer_once "/home/lan/src/cloned/gh/dism-exe/bn6f/data/dat21.s"
````

2025-11-09 Wk 45 Sun - 05:08 +03:00

````
+ccs_809BBD4:
+       .word 0xD6FF4C18, 0x200020FE, 0x64180800, 0x60FF38FF, sub_8002000
+       .byte 0x08
````

More suspicious pointers. This failed build but OK'd once we replaced `sub_8002000` with `0x08002000`

2025-11-09 Wk 45 Sun - 05:17 +03:00

It finally finished through `MapScriptOnInitCentralTown_804EA28`!

2025-11-09 Wk 45 Sun - 05:23 +03:00

`ccs` doesn't have jumps, so it might be safe to auto-terminate with them on command 0x8...

Well we're finally done with this context. Next is trace dumping of `MapScriptOnInitCentralTown_804EA28`!
