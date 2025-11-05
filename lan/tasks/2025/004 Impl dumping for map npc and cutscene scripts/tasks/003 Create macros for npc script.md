---
parent: '[[004 Impl dumping for map npc and cutscene scripts]]'
spawned_by: '[[004 Impl dumping for map npc and cutscene scripts]]'
context_type: task
status: done
---

Parent: [004 Impl dumping for map npc and cutscene scripts](../004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts.md)

Spawned by: [004 Impl dumping for map npc and cutscene scripts](../004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts.md)

Spawned in: [<a name="spawn-task-f6c53d" />^spawn-task-f6c53d](../004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts.md#spawn-task-f6c53d)

# 1 Journal

2025-10-27 Wk 44 Mon - 16:12 +03:00

`NPCCommandsJumptable` has all the NPC commands. But we don't have bytecode for this under `include/bytecode/`.

Luckily they are all documented there, ending in `NPCCommand_jump_if_screen_fade_active (0x53)`

````sh
# in include/macros.inc
.include "include/bytecode/npc_script.inc"
````

2025-10-27 Wk 44 Mon - 18:02 +03:00

Attempting to automate the conversion. Got all the command functions from `0x21` onward in a file `b`

we can keep only comments starting with `0x` or labels:

````vim
# in b
# in vim
:v/\(\/\/ 0x.*$\)\|.*:/d
````

Remove other labels

````vim
# in b
# in vim
:g/\(off\|byte\|unk\|word\)_.*/d 
````

Do ensure to remove all but labels and comments. Regex refines to identifier, and always at start of line.

````vim
# in b
# in vim
:v/\(\/\/ 0x.*$\)\|^\([_A-Za-z][_A-Za-z0-9]*\):/d
````

Some missed exceptions (`0x0 -`, `TextScript` )

````vim
# in b
# in vim
:g/\/\/ 0x[0-9A-Fa-f] -/d
:g/TextScript/d
````

Let's apply this instead to all the npc scripts.

2025-10-27 Wk 44 Mon - 18:48 +03:00

Some labels were removed because they had `0x` in them. Put everything in `b`, then copy it to `b1` and apply the following transformations:

````
# in b1
# in vim

# Remove the exceptions
:g/\/\/ 0x[0-9A-Fa-f] -/d
:g/TextScript/d

# Remove unnecessary labels
:g/^\(off\|byte\|unk\|word\)_.*/d 

# Only keep comments starting with 0x or labels
:v/\(^\/\/ 0x.*$\)\|^\([_A-Za-z][_A-Za-z0-9]*\):/d
````

Now in `b1` we have 2 lines per command, if the cmd index skips values, we know there's an unused command. `byteN`, `hwordN`, `wordN`, `destinationN`, `signedbyteN` exist as possible types of commands, where `N` is the byte position of the argument in the command.

The label gives us the name. With that, we can generate both `include/bytecode/npc_script.inc` and the rust schema file.

2025-10-27 Wk 44 Mon - 20:13 +03:00

Okay we created postprocessing to generate both the inc and the rust equivalent for npc scripts.

Time to test.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt001_postproc_scripts scr000_npc_script_inc /home/lan/src/cloned/gh/dism-exe/bn6f/b1

# out (error, relevant)
thread 'main' panicked at src/bin/expt001_postproc_scripts.rs:196:33:
We must progress command bytes. They can't lower or stay steady: 0 <= 2
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

````diff
// in fn scr000_npc_script_inc
-if prev_cmd_byte <= cmd_byte {
+if cmd_byte <= prev_cmd_byte {
	panic!("We must progress command bytes. They can't lower or stay steady: {prev_cmd_byte} <= {cmd_byte}");
}
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt001_postproc_scripts scr000_npc_script_inc /home/lan/src/cloned/gh/dism-exe/bn6f/b1

# out (error, relevant)
thread 'main' panicked at src/bin/expt001_postproc_scripts.rs:114:26:
Failed to parse param: ParseInt(ParseIntError { kind: InvalidDigit })
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

Clarifying the error,

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt001_postproc_scripts scr000_npc_script_inc /home/lan/src/cloned/gh/dism-exe/bn6f/b1

# out (error, relevant)
thread 'main' panicked at src/bin/expt001_postproc_scripts.rs:114:45:
Failed to parse param for line "// 0x0c signedbyte1 signedbyte2 signedbyte3": ParseInt(ParseIntError { kind: InvalidDigit })
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

````rust
// in impl FromStr for Param
let num_s = s
	.replace("byte", "")
	.replace("signedbyte", "")
	.replace("hword", "")
	.replace("signedhword", "")
	.replace("word", "")
	.replace("signedword", "")
	.replace("destination", "");
````

Bad order of replaces. Will remove `byte` and leave `signed`.  Replacing with

````rust
// in impl FromStr for Param
let num_s = s
	.replace("signedbyte", "")
	.replace("signedhword", "")
	.replace("signedword", "")
	.replace("byte", "")
	.replace("hword", "")
	.replace("word", "")
	.replace("destination", "");
````

2025-10-27 Wk 44 Mon - 20:26 +03:00

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt001_postproc_scripts scr000_npc_script_inc /home/lan/src/cloned/gh/dism-exe/bn6f/b1

# out (error, relevant)
thread 'main' panicked at src/bin/expt001_postproc_scripts.rs:114:45:
Failed to parse param for line "// 0x4d unused1to4 destination5": ParseInt(ParseIntError { kind: InvalidDigit })
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

We don't know what to do with `unusued1to4`... Let's check that. Just replace with `unusedword1`  manually in `b1`.

This distinction of unused u8/u16/u32 needs to be recognized by the script and also rust dumping. Replaced it in the command docs too `NPCCommand_jump_alt` so that it would be there on a second parsing of `b` $\to$ `b1`.

2025-10-27 Wk 44 Mon - 20:39 +03:00

Okay support added for `unusedbyte`, `unusedhword`, `unusedword` with rust corresponding `Unused8`, `Unused16`, `Unused32`.

And just added this, which I forgot. There's no enum match protection on this replaces...

````rust
let num_s = s
	.replace("signedbyte", "")
	.replace("signedhword", "")
	.replace("signedword", "")
	.replace("unusedbyte", "")
	.replace("unusedhword", "")
	.replace("unusedword", "")
	.replace("byte", "")
	.replace("hword", "")
	.replace("word", "")
	.replace("destination", "")
;
````

Let's try again.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt001_postproc_scripts scr000_npc_script_inc /home/lan/src/cloned/gh/dism-exe/bn6f/b1 | less

# out (relevant)
        // 0x00
        enum ns_NPCCommand_end_cmd // 0x00
        .macro ns_NPCCommand_end

        .endm
        enum ns_unused_cmd_00 // 0x00
        enum ns_unused_cmd_01 // 0x01
        // 0x02
        enum ns_NPCCommand_jump_cmd // 0x02
        .macro ns_NPCCommand_jump destination1:req
        .word \destination1
        .endm
        enum ns_unused_cmd_02 // 0x02
        // 0x03
        enum ns_NPCCommand_free_and_end_cmd // 0x03
        .macro ns_NPCCommand_free_and_end
		[...]
````

It generates, but few things to fix

* `NPCCommand_` part should have been removed,
* The comment line should include the list of params,
* there shouldn't be empty lines inside a `.macro` `.endm`,
* There should be an empty line between each macro.
* Unused enums should also have a comment line
* Currently the unused counter is displaying an extra unused_cmd_00, when there's only unused_cmd_01
* Include the byte for the command itself

````rust
// in fn scr000_npc_script_inc
if !line2.starts_with("NPCCommand_") {
	panic!("Line must start with NPCCommand_: {line2}");
}

let ident = line2
	.replace(":", "")
	.replace("NPCCOMMAND_", "")
	.parse::<Identifier>()
	.expect("Failed to parse identifier");
````

Oops it's replacing `NPCCOMMAND_` instead of `NPCCommand_` for some reason.

2025-10-27 Wk 44 Mon - 20:54 +03:00

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt001_postproc_scripts scr000_npc_script_inc /home/lan/src/cloned/gh/dism-exe/bn6f/b1
````

Looks good now, and so does the rust generation:

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt001_postproc_scripts scr000_npc_script_inc /home/lan/src/cloned/gh/dism-exe/bn6f/b1 --for_rust
````

Now let's make sure they compile.

For the rust one, need to also add `.to_owned()` for the command names, and also for the param names (which we added in the wrong place)

And also a comma for each param!

2025-10-27 Wk 44 Mon - 21:21 +03:00

OK! Rust accepts it! And we get OK for bn6f as well, so the assembler accepts the inc one.

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
git commit -m "add npc_script macros"

# out
[master 40e958c1] add npc_script macros
 3 files changed, 591 insertions(+), 1 deletion(-)
 create mode 100644 include/bytecode/npc_script.inc
````
