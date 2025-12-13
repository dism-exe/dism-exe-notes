---
parent: '[[004 Impl dumping for map npc and cutscene scripts]]'
spawned_by: '[[004 Impl dumping for map npc and cutscene scripts]]'
context_type: task
status: done
---

Parent: [004 Impl dumping for map npc and cutscene scripts](../004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts.md)

Spawned by: [004 Impl dumping for map npc and cutscene scripts](../004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts.md)

Spawned in: [<a name="spawn-task-677ee6" />^spawn-task-677ee6](../004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts.md#spawn-task-677ee6)

# 1 Journal

2025-10-27 Wk 44 Mon - 22:06 +03:00

Similar to [003 Create macros for npc script](003%20Create%20macros%20for%20npc%20script.md),

Let's automate generating the rest of the schemas.

Let's start with mapscripts. The commands are in `MapScriptCommandJumptable`.

There are shared commands, so we have to separate them. We can know by the name. If it's `MapScriptCmd`, `CutsceneCmd`, or `MapScriptCutsceneCmd`.

These get distinct macros, and have their own bytes. We will need to parse the first for map script and the second for cutscene script.

Let's put in a file `a` the portion from `MapScriptCmd_end`'s `thumb_local_start` to `MapScriptCutsceneCmd_rush_food_cmd_80384A8`'s `thumb_func_end`.

Seems not to be continuous. it stops at `0x40 MapScriptCmd_spawn_or_free_objects`.

Then continues from `MapScriptCutsceneCmd_add_bbs_message_range` to `0x45 MapScriptCutsceneCmd_rush_food_cmd_80384A8` except with a bunch that are only cutscene specific in the middle we need to filter out.

Let's get both portions to `a` and copy it to `a1` then apply the following transformations:

````vim
# in /home/lan/src/cloned/gh/dism-exe/bn6f/a1
# in vim

# Only keep comments starting with 0x or labels
:v/\(^\/\/ 0x.*$\)\|^\([_A-Za-z][_A-Za-z0-9]*\):/d

# Remove unnecessary labels
:g/^\(off\|byte\|unk\|word\|loc\)_.*/d 

# Only keep the first in a choice of command bytes of shared commands
:%s/\/\/ 0x\([0-9A-Fa-f][0-9A-Fa-f]\)\/0x\([0-9A-Fa-f][0-9A-Fa-f]\)\(.*\)/\/\/ 0x\1\3/g

# Remove comments in label lines
:%s/^\([_A-Za-z][_A-Za-z0-9]*\):.*/\1:/g

# Remove 0xff comment lines as it's just a semantic distinction
:g/\/\/ 0x[0-9A-Fa-f][0-9A-Fa-f] 0xff/d
````

This has some new patterns:

Subcommands:

````
// 0x07 0x00 word2 destination6 byte10
// 0x07 0x01 word2 destination6 hword10
// 0x07 0x02 word2 destination6 word10
MapScriptCutsceneCmd_jump_if_mem_equals:

// 0x16 0x00 destination2
// 0x16 0x01 destination2
MapScriptCmd_jump_if_map_group_compare_last_map_group:
````

~~FFStop~~

Special `0xFF` value:

````
// 0x2f byte1
// 0x2f 0xff
MapScriptCutsceneCmd_terminate_one_or_all_gfx_anims:
````

2025-10-28 Wk 44 Tue - 00:18 +03:00

The 0xFF is a semantic distinction, so let's remove that comment.

There's another `unused1to3` Let's just change it to `unusedbyte1 unusedbyte2 unusedbyte3`

2025-10-28 Wk 44 Tue - 02:52 +03:00

Now we can get the schema for map scripts with

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt001_postproc_scripts scr001_process_map_script_cmds /home/lan/src/cloned/gh/dism-exe/bn6f/a1 
````

2025-10-28 Wk 44 Tue - 03:04 +03:00

Actually ~~we need to modify initial regex filtering.~~ We must skip `CutsceneCmd_` only scripts. And keep only `MapScriptCmd_` and `MapScriptCutsceneCmd_`

This is easier done in Rust now. Just filter anything with those labels out. Anything starting with `CutsceneCmd_`.

2025-10-28 Wk 44 Tue - 02:57 +03:00

Next is cutscene commnds.

2025-10-28 Wk 44 Tue - 05:44 +03:00

Copy after `enum_start` of `cutscene_script.inc` into `a`. Then copy it into `a1` and apply those transformations:

````vim
# in /home/lan/src/cloned/gh/dism-exe/bn6f/a1
# in vim

# filter for comments starting with 0x or enum lines
:v/\(^\/\/ 0x.*$\)\|^\tenum /d

# Only keep the second in a choice of command bytes of shared commands
:%s/\/\/ 0x\([0-9A-Fa-f][0-9A-Fa-f]\)\/0x\([0-9A-Fa-f][0-9A-Fa-f]\)\(.*\)/\/\/ 0x\2\3/g
:%s/\/\/ 0x\([0-9A-Fa-f]\)\/0x\([0-9A-Fa-f][0-9A-Fa-f]\)\(.*\)/\/\/ 0x\2\3/g

# filter out comments on indices of the form "// byte - "
:g/\/\/ 0x[0-9A-Fa-f]\([0-9A-Fa-f]\|\) - /d

# filter out comments with indices at the end of an enum line
:%s/\tenum \([A-Za-z_][A-Za-z0-9_]*\) \/\/ 0x\([A-Fa-f0-9][A-Fa-f0-9]\)/\tenum \1/g

# Process each individual unused byte
:%s/unused1to3/unusedbyte1 unusedbyte2 unusedbyte3/g

# Filter out 0x14 word1=0x0 since this also is a helper macro and introduces ambiguity at this stage
:g/0x14 word1=0x0/d

# Fill in the blanks for 0x3d
:%s/... (up to 8 destinations)/destination13 destination17 destination21 destination25 destination29/g

# Remove 0x49 commentary line
:g/0x49 byte1 .../d
````

Need to look at `0x41`, which has some `0x0-0xc` options

2025-10-28 Wk 44 Tue - 06:40 +03:00

````
# in include/bytecode/cutscene_script.inc

	enum cs_spawn_free_ow_map_object_specials_cmd // 0x49
	subenum_start
// 0x49 byte1 ...
// run special related to spawning or freeing OW map objects
// subcommands documented below
// byte1 - upper nybble is subcommand to run (multiple of 1)
//       - lower nybble is index of array of map objects spawned by these subcommands

	subenum cs_spawn_ow_map_object_subcmd // 0x0
// 0x49 0x0X byte2 hword3 hword5 hword7 word9

````

nybbles too...

2025-10-29 Wk 44 Wed - 03:01 +03:00

````
// shared command
	enum cs_rush_food_cmd_80384A8_cmd // 0x79
// 0x45/0x79 unused1to3 destination4
// appears to be "jump_if_has_rush_food_and_a_pressed"
// but it isn't triggered when using a piece of rush food
// unused1to3 - unused
// destination4 - script to jump to
	.macro cs_rush_food_cmd_80384A8 destination4:req
	.byte cs_rush_food_cmd_80384A8_cmd
	.byte 0, 0, 0
	.word \destination4
	.endm
````

Those unused bytes are set to zero instead. We should assume in dumping that we read values of zero to see if this holds. If it does, then when converting the instructions to text format, we omit the unused parameters from the macro as is done here.

2025-10-29 Wk 44 Wed - 03:45 +03:00

````
	enum cs_set_cutscene_skip_script_cmd // 0x14
// 0x14 word1
// set the script to execute for when a cutscene is skipped
// word1 - script to execute
	.macro cs_set_cutscene_skip_script word1:req
	.byte cs_set_cutscene_skip_script_cmd
	.word \word1
	.endm

// helper macro
// 0x14 word1=0x0
// clear the script that is run when a cutscene is skipped
// effectively disabling cutscene skip
	.macro cs_disable_cutscene_skip_script
	.byte cs_set_cutscene_skip_script_cmd
	.word 0x0
	.endm
````

We can't substitute `word1=0x0` for `0x0`... if there is a subcmd it must be consistent, and one doesn't have. This introduces an ambiguity since either can be used. Let's remove this for now.

2025-10-29 Wk 44 Wed - 03:50 +03:00

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt001_postproc_scripts scr002_process_cutscene_script_cmds /home/lan/src/cloned/gh/dism-exe/bn6f/a1

# out (error, relevant)
thread 'main' panicked at src/scripts/scr002_process_cutscene_script_cmds.rs:264:22:
Failed to parse comment line: ParamFromStr("// 0x1d byte1 byte2 byte3 destination", ParseInt(ParseIntError { kind: Empty }))
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

That should be destination4. Fixing manually in both `include/bytecode/cutscene_script.inc` and `a1`.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt001_postproc_scripts scr002_process_cutscene_script_cmds /home/lan/src/cloned/gh/dism-exe/bn6f/a1

# out (error, relevant)
thread 'main' panicked at src/scripts/scr002_process_cutscene_script_cmds.rs:264:22:
Failed to parse comment line: ParseInt("// 0xb/0x20 byte1 destination2", ParseIntError { kind: InvalidDigit })
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

We need to filter single `0xN` not just `0xNN`

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt001_postproc_scripts scr002_process_cutscene_script_cmds /home/lan/src/cloned/gh/dism-exe/bn6f/a1

# out (error, relevant)
thread 'main' panicked at src/scripts/scr002_process_cutscene_script_cmds.rs:264:22:
Failed to parse comment line: ParamFromStr("// 0x3d destination1 destination5 destination9 ... (up to 8 destinations)", ParseInt(ParseIntError { kind: InvalidDigit }))
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

Replace for this also to fill in the blanks.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt001_postproc_scripts scr002_process_cutscene_script_cmds /home/lan/src/cloned/gh/dism-exe/bn6f/a1

# out (error, relevant)
thread 'main' panicked at src/scripts/scr002_process_cutscene_script_cmds.rs:264:22:
Failed to parse comment line: ParamFromStr("// 0x49 byte1 ...", ParseInt(ParseIntError { kind: InvalidDigit }))
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

Just remove this line, it's commentary and subcommands are coming after.

2025-10-29 Wk 44 Wed - 04:06 +03:00

````
	enum cs_warp_cmd_8038040_cmd // 0x4c
// the following commands are related to warping
// 0x4c &0x40
// literal interpretation: call warp_8005f32 and warp_setSubsystemIndexTo0x10AndOthers_8005f00
	.macro cs_warp_cmd_8038040_0
	.byte cs_warp_cmd_8038040_cmd
	.byte 0x40
	.endm

// 0x4c &0x20 word2
// literal interpretation: [eCutsceneState_Unk_34] = word2
// word2 - warp related pointer
	.macro cs_warp_cmd_8038040_1 word2:req
	.byte cs_warp_cmd_8038040_cmd
	.byte 0x20
	.word \word2
	.endm

// 0x4c !&0x60 byte2 word3
// literal interpretation:
// if bit7 of byte1 is set, word3 = [eCutsceneState_Unk_34]
// if bit0 of byte1 is set:
// call warp_setSubsystemIndexTo0x14AndOthers_8005f14 with r0=word3, r1=0, r2=byte2
// else:
// call warp_setSubsystemIndexTo0x10AndOthers_8005f00 with r0=word3, r1=0, r2=byte2
	.macro cs_warp_cmd_8038040_2 byte1:req byte2:req word3:req
	.byte cs_warp_cmd_8038040_cmd
	.byte \byte1
	.byte \byte2
	.word \word3
	.endm
````

This command responds to flags. This breaks the assumption that subcommand routing is complete over the command. Meaning there is a way to invoke `0x4c` with a subcommand (`0x40, 0x20`) and also without (just `0x4c` and some byte without `0x40` or `0x20` set)

This can be expanded to `0x20`, `0x40`, `0x60`, and `!0x60` flag subcommands, each check would ensure only `0x20` is set, or only `0x40`, or both, or neither.

2025-10-29 Wk 44 Wed - 04:32 +03:00

We need to also redo mapscript schema. We didn't grab the different names for subcommands...  We need to preserve those for cutscene as well after. comments in `asm/map_script_cutscene.s` don't give us the different subcommand names, but we can get them from `map_script.inc`. We should preserve `.macro` and not `enum` to see those for cutscene script as well.

2025-10-29 Wk 44 Wed - 06:29 +03:00

Put everything after `enum_start` from `include/bytecode/map_script.inc` in `b`. Copy it to `b1` and apply the following transformations:

````vim
# in /home/lan/src/cloned/gh/dism-exe/bn6f/b1
# in vim

# filter for comments starting with 0x or .macro
:v/\(^\/\/ 0x.*$\)\|^\t.macro /d

# Only keep the first in a choice of command bytes of shared commands
:%s/\/\/ 0x\([0-9A-Fa-f][0-9A-Fa-f]*\)\/0x\([0-9A-Fa-f][0-9A-Fa-f]*\)\(.*\)/\/\/ 0x\1\3/g

# Only keep .macro {label}
:%s/^\t.macro \([A-Za-z_][A-Za-z_0-9]*\)\(.*\)/\t.macro \1/g

# replace unused1to3 with unusedU24_1
:%s/unused1to3/unusedU24_1/g
````

2025-10-29 Wk 44 Wed - 07:41 +03:00

````
// 0x2f byte1
	.macro ms_terminate_gfx_anim
// 0x2f 0xff
	.macro ms_terminate_all_gfx_anims
````

Let's try to keep it since it's a different macro here. We can treat it as a `0xFF` `U8` subcmd and we can relax the assumption that a subcmd must be present in all cases.

2025-10-29 Wk 44 Wed - 22:13 +03:00

Fallback subcmd routing is implemented for `0xFF`,  `unusedU24_`, and also not mask commands later for the cutscenes, though they need to be tested.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt001_postproc_scripts scr001_process_map_script_cmds /home/lan/src/cloned/gh/dism-exe/bn6f/b1

# out (relevant, error)
thread 'main' panicked at src/scripts/scr001_process_map_script_cmds.rs:140:22:
Failed to parse comment line: ParamFromStr("// 0x08 byte1 byte2 byte3 destination", ParseInt(ParseIntError { kind: Empty }))
````

Needs to be labled `destination4`. Fixing manually in `b1` and the source `include/bytecode/map_script.inc`

2025-10-29 Wk 44 Wed - 22:36 +03:00

`0x3A`'s param is mislabeled. ~~It should be `destination2`~~ not `word2`.  Correcting in both `MapScriptCmd_run_or_end_secondary_continuous_map_script` and `include/bytecode/map_script.inc` and also manually in `b1`.

It seems lucky used `destination` not to mean pointer generically, but only for jumps. So there are a bunch of `wordN` that needs to be renamed to `ptrN` because they're more significant than just a u32 in dumping (they require a label). Let's rename `0x3A` and `0x40`'s `word2` to `ptr2`.

This distinction of being an external pointer vs a jump pointer can be useful for dumping, so let's register this difference.

Similarly correcting (for mapscript) `0x2d, 0x2c, 0x29-0x23, 0x07, 0x38`

Similarly correcting (for npcscript) `0x32, 0x35, 0x44`

Similarly correcting (for cutscenescript) `0x1b, 0x2d, 0x2e, 0x2f, 0x30, 0x31, 0x36, 0x37, 0x12, 0x14, 0x3e, 0x44, 0x4a 0x0, 0x4a 0x2, 0x4b, 0x4c &0x20, 0x4c !&0x60, 0x54, 0x58, 0x75 0x0`

Similarly correcting (for cutscenecamerascript) `0x28, 0x30, 0x34, 0x50`

It's unclear if `0x38/0x58`'s `word9` is a pointer. I haven't seen it used as such. It is stored as a `u32` to `eStruct200a6a0` position `0xc` but then it reads a `u8` only from `0xd`. There might be usages I haven't uncovered yet. `0x43/0x6c` is also unclear.

2025-10-30 Wk 44 Thu - 00:43 +03:00

Okay most `word` $\to$ `ptr` distinctions were updated.

We need to create rust schema for cutscene script and cutscenecamera script next

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
cp include/bytecode/cutscene_script.inc a
````

Then apply the following transformations to `a`:

````vim
# in /home/lan/src/cloned/gh/dism-exe/bn6f/a
# in vim

# filter for comments starting with 0x or .macro
:v/\(^\/\/ 0x.*$\)\|^\t.macro /d

# Only keep the second in a choice of command bytes of shared commands
:%s/\/\/ 0x\([0-9A-Fa-f][0-9A-Fa-f]*\)\/0x\([0-9A-Fa-f][0-9A-Fa-f]*\)\(.*\)/\/\/ 0x\2\3/g

# Only keep .macro {label} in the macro line
:%s/^\t.macro \([A-Za-z_][A-Za-z_0-9]*\)\(.*\)/\t.macro \1/g

# replace unused1to3 with unusedU24_1
:%s/unused1to3/unusedU24_1/g

# Treat &0x40 and &0x20 as regular subcommands
:%s/&0x\([24]\)0/0x\10/g

# Turn 0x14 word1=0x0 into a subcommand. If it doesn't work, it will fallback to just 0x14
:%s/0x14 word1=0x0/0x14 0x00/g

# Fill in the blanks for 0x3d
:%s/... (up to 8 destinations)/destination13 destination17 destination21 destination25 destination29/g

# Remove 0x49 commentary line
:g/0x49 byte1 .../d

# Remove commentary lines 0xN -
:g/\/\/ 0x[A-Fa-f0-9][A-Fa-f0-9]* - /d
````

`.macro cs_offset_ow_player_fixed_anim_select_8037dac` doesn't have a comment in `include/bytecode/cutscene_script.inc`, let's add one. `0x47` in there should be `0x47 0x0`.

2025-10-30 Wk 44 Thu - 01:26 +03:00

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt001_postproc_scripts scr002_process_cutscene_script_cmds /home/lan/src/cloned/gh/dism-exe/bn6f/a 
````

We were able to generate the rust schema for cutscenescript. This is in `bytecode/cutscenescript.rs`. Now cameracutscenescript.

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
cp include/bytecode/cutscene_camera_script.inc a
````

Apply the following transformations to `a` in vim:

````vim
# filter for comments starting with 0x or .macro
:v/\(^\/\/ 0x.*$\)\|^\t.macro /d

# Only keep .macro {label} in the macro line
:%s/^\t.macro \([A-Za-z_][A-Za-z_0-9]*\)\(.*\)/\t.macro \1/g

# Replace unused1to6 with unusedU24_1 unusedU24_4
:%s/unused1to6/unusedU24_1 unusedU24_4/g

````

2025-10-30 Wk 44 Thu - 01:56 +03:00

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt001_postproc_scripts scr002_process_cutscene_script_cmds /home/lan/src/cloned/gh/dism-exe/bn6f/a

# out (error, relevant)
thread 'main' panicked at src/scripts/scr002_process_cutscene_script_cmds.rs:277:22:
Failed to parse comment line: ParamFromStr("// 0x20 unusedU24_1 unusedU24_4 hword7", InvalidParamType("unusedU2_"))
````

````sh
# in impl FromStr for Param {
let num = num_s.parse::<u32>()?;

let ty_s = s.replace(&num_s, "");
````

This method doesn't quite work for this. It replaced `4` out, leaving us with `unusedU2_`.  We can just use `starts_with` for this. Do mind the order matters. Do `signedbyte` before `byte` for example.

Okay! Now we get cutscene camera scripts!

2025-10-30 Wk 44 Thu - 02:06 +03:00

All that's left now is `include/bytecode/gfx_anim_script.inc`, but this doesn't look done. So this is okay for now.
