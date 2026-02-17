---
parent: "[[002 bn6f ROM shifting]]"
spawned_by: "[[001 Investigate jacking in causing crash due to jump to invalid address]]"
context_type: task
status: todo
---

Parent: [[002 bn6f ROM shifting]]

Spawned by: [[001 Investigate jacking in causing crash due to jump to invalid address]]

Spawned in: [[001 Investigate jacking in causing crash due to jump to invalid address#^spawn-task-f72885|^spawn-task-f72885]]

# 1 Journal

2025-12-17 Wk 51 Wed - 16:40 +03:00

We dumped all mapscripts, but not direct cutscenes. We need to trace all data that is passed to `StartCutscene`.

```
byte_80990B8
byte_8099DC0
byte_8099E04
byte_8098BB8
byte_809AE68
byte_809895C
byte_8098384
byte_8098358
byte_809CAD8
byte_809AA34
byte_8099EA0
byte_809A8A8
CutsceneScript_80991F4
CutsceneScript_80988E4
byte_8098824
CutsceneScript_8098b1c
CutsceneScript_809b5ad
CutsceneScript_8098a2e
CutsceneScript_8098a78
CutsceneScript_8098a02
byte_809326C
0x8092C78
byte_8092A98
byte_80933B8
byte_8092DE8
byte_8093358
byte_808C004
byte_808C0F4
byte_808C2F0
dword_8089128
byte_80893CC
byte_8089554
byte_8089448
byte_809CEB4
byte_809C354
byte_809AFC0
byte_809B16C
byte_8089DF4
byte_808A128
byte_808C2F0
byte_8089FD8
byte_8089E44
byte_8089DD8

sub_8090104 routes some possible cutscenes:
byte_808F668
byte_808F67C
byte_808F728
byte_808F6EC
byte_808F690
byte_808F748
byte_808F788

byte_8086678+32

Unsure about the StartCutscene use in function sub_8086FD8, but the function has a lot of pointers to cut independently.

sub_808CC34 likely also routes some possible cutscenes:
byte_808C930
byte_808CA48
byte_808C428
byte_808C74C
```

2025-12-17 Wk 51 Wed - 17:02 +03:00

Be aware of scripts labeled `CutsceneScript` since I marked many of these before.

We need to cut some of those labels:

```
0x8092C78
byte_8086678+32 # 0x8086698
```

```sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 8092C78 -M "cutscenescript_8092C78"  
cargo run --bin expt000_read_symbol_data 8086698 -M "cutscenescript_8086698"  
```

```
# got turned into data after cutting cutscenescript_8092C78
cargo run --release --bin dump_script trace cutscene cutscenescript_8092C6F
```

```sh
#cargo run --release --bin dump_script trace cutscene byte_80990B8 &&
cargo run --release --bin dump_script trace cutscene byte_8099DC0 &&
cargo run --release --bin dump_script trace cutscene byte_8099E04 &&
#cargo run --release --bin dump_script trace cutscene byte_8098BB8 &&
cargo run --release --bin dump_script trace cutscene byte_809AE68 &&
cargo run --release --bin dump_script trace cutscene byte_809895C &&
cargo run --release --bin dump_script trace cutscene byte_8098384 &&
cargo run --release --bin dump_script trace cutscene byte_8098358 &&
cargo run --release --bin dump_script trace cutscene byte_809CAD8 &&
cargo run --release --bin dump_script trace cutscene byte_809AA34 &&
cargo run --release --bin dump_script trace cutscene byte_8099EA0 &&
cargo run --release --bin dump_script trace cutscene byte_809A8A8 &&
cargo run --release --bin dump_script trace cutscene CutsceneScript_80991F4 &&
cargo run --release --bin dump_script trace cutscene CutsceneScript_80988E4 &&
cargo run --release --bin dump_script trace cutscene byte_8098824 &&
cargo run --release --bin dump_script trace cutscene CutsceneScript_8098b1c &&
cargo run --release --bin dump_script trace cutscene CutsceneScript_809b5ad &&
cargo run --release --bin dump_script trace cutscene CutsceneScript_8098a2e &&
cargo run --release --bin dump_script trace cutscene CutsceneScript_8098a78 &&
cargo run --release --bin dump_script trace cutscene CutsceneScript_8098a02 &&
cargo run --release --bin dump_script trace cutscene byte_809326C &&
cargo run --release --bin dump_script trace cutscene cutscenescript_8092C78 &&
cargo run --release --bin dump_script trace cutscene byte_8092A98 &&
cargo run --release --bin dump_script trace cutscene byte_80933B8 &&
cargo run --release --bin dump_script trace cutscene byte_8092DE8 &&
cargo run --release --bin dump_script trace cutscene byte_8093358 &&
cargo run --release --bin dump_script trace cutscene byte_808C004 &&
cargo run --release --bin dump_script trace cutscene byte_808C0F4 &&
cargo run --release --bin dump_script trace cutscene byte_808C2F0 &&
cargo run --release --bin dump_script trace cutscene dword_8089128 &&
cargo run --release --bin dump_script trace cutscene byte_80893CC &&
cargo run --release --bin dump_script trace cutscene byte_8089554 &&
cargo run --release --bin dump_script trace cutscene byte_8089448 &&
cargo run --release --bin dump_script trace cutscene byte_809CEB4 &&
cargo run --release --bin dump_script trace cutscene byte_809C354 &&
cargo run --release --bin dump_script trace cutscene byte_809AFC0 &&
#cargo run --release --bin dump_script trace cutscene byte_809B16C &&
cargo run --release --bin dump_script trace cutscene byte_8089DF4 &&
cargo run --release --bin dump_script trace cutscene byte_808A128 &&
cargo run --release --bin dump_script trace cutscene byte_808C2F0 &&
cargo run --release --bin dump_script trace cutscene byte_8089FD8 &&
cargo run --release --bin dump_script trace cutscene byte_8089E44 &&
cargo run --release --bin dump_script trace cutscene byte_8089DD8 &&
cargo run --release --bin dump_script trace cutscene byte_808F668 &&
cargo run --release --bin dump_script trace cutscene byte_808F67C &&
cargo run --release --bin dump_script trace cutscene byte_808F728 &&
cargo run --release --bin dump_script trace cutscene byte_808F6EC &&
cargo run --release --bin dump_script trace cutscene byte_808F690 &&
cargo run --release --bin dump_script trace cutscene byte_808F748 &&
cargo run --release --bin dump_script trace cutscene byte_808F788 &&
cargo run --release --bin dump_script trace cutscene cutscenescript_8086698 &&

cargo run --release --bin dump_script trace cutscene byte_808C930 &&
cargo run --release --bin dump_script trace cutscene byte_808CA48 &&
cargo run --release --bin dump_script trace cutscene byte_808C428 &&
cargo run --release --bin dump_script trace cutscene byte_808C74C &&

cargo run --release --bin dump_script trace cutscene byte_80989C1 &&
```

2025-12-18 Wk 51 Thu - 03:31 +03:00

Reached an infinite recursion.

```
Running `target/release/dump_script trace cutscene byte_809AA34`
Tracing cutscenescript Identifier { s: "byte_809AA34" }
Tracing cutscenescript Identifier { s: "byte_809AA5F" }
Cutting 0x809AA44 "cutscenescript_809AA44"

Tracing cutscenescript Identifier { s: "byte_809AA5F" }
Tracing cutscenescript Identifier { s: "cutscenescript_809AA44" }
Tracing cutscenescript Identifier { s: "byte_809AA5F" }
Tracing cutscenescript Identifier { s: "cutscenescript_809AA44" }
Tracing cutscenescript Identifier { s: "byte_809AA5F" }
Tracing cutscenescript Identifier { s: "cutscenescript_809AA44" }
// ...
```

```
byte_809AA34:
	cs_lock_player_for_non_npc_dialogue_809e0b0
	cs_nop_80377d0
	cs_set_event_flag byte1=0xFF event16_2=EVENT_1731
	cs_offset_ow_player_fixed_anim_select_8037dac byte2=0xFF byte3=0x00
	cs_call_native_with_return_value ptr1=sub_809AAB8+1

cutscenescript_809AA44:
	.word 0x09AADD4B, 0x01081C08, byte_809AA5F
```

These used to be merged, so it started tracing `byte_809AA5F`. 

```sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script trace cutscene cutscenescript_809AA44
```

```
Tracing cutscenescript Identifier { s: "cutscenescript_809AA44" }
0 new_inst: Inst { name: "cs_call_native_with_return_value", cmd: 75, opt_subcmd: None, fields: [Ptr("ptr1", Rom(RomEa { ea: 0x0809AADD }))] }
5 new_inst: Inst { name: "cs_jump_if_var_equal", cmd: 28, opt_subcmd: None, fields: [U8("byte1", 8), U8("byte2", 1), Dest("destination3", RomEa { ea: 0x0809AA5F })] }

Tracing cutscenescript Identifier { s: "byte_809AA5F" }
0 new_inst: Inst { name: "cs_wait_chatbox", cmd: 4, opt_subcmd: None, fields: [U8("byte1", 8)] }
2 new_inst: Inst { name: "cs_call_native_with_return_value", cmd: 75, opt_subcmd: None, fields: [Ptr("ptr1", Rom(RomEa { ea: 0x0809AB21 }))] }
7 new_inst: Inst { name: "cs_jump_if_var_equal", cmd: 28, opt_subcmd: None, fields: [U8("byte1", 8), U8("byte2", 1), Dest("destination3", RomEa { ea: 0x0809AA44 })] }
14 new_inst: Inst { name: "cs_jump_if_var_equal", cmd: 28, opt_subcmd: None, fields: [U8("byte1", 8), U8("byte2", 3), Dest("destination3", RomEa { ea: 0x0809AA87 })] }
21 new_inst: Inst { name: "cs_jump_if_var_equal", cmd: 28, opt_subcmd: None, fields: [U8("byte1", 8), U8("byte2", 4), Dest("destination3", RomEa { ea: 0x0809AA50 })] }
28 new_inst: Inst { name: "cs_wait_chatbox", cmd: 4, opt_subcmd: None, fields: [U8("byte1", 8)] }
30 new_inst: Inst { name: "cs_call_native_with_return_value", cmd: 75, opt_subcmd: None, fields: [Ptr("ptr1", Rom(RomEa { ea: 0x0809AC71 }))] }
35 new_inst: Inst { name: "cs_jump", cmd: 21, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 0x0809AA50 })] }

Tracing cutscenescript Identifier { s: "cutscenescript_809AA44" }
// ...
```

```
Tracing cutscenescript Identifier { s: "byte_809AA5F" }
[src/bin/dump_script.rs:340:5] processed_items = [
    ScriptTraceRecord {
		/*...*/
        symbol_data: SymbolData {
            ea: RomEa { ea: 0x0809AA44 },
            label: Identifier {
                s: "cutscenescript_809AA44",
            },
            size: 12,
            data: [ /*...*/ ],
        },
		/*...*/
    },
]

Tracing cutscenescript Identifier { s: "cutscenescript_809AA44" }
[src/bin/dump_script.rs:340:5] processed_items = [
    ScriptTraceRecord {
		/*...*/
        symbol_data: SymbolData {
            ea: RomEa { ea: 0x0809AA5F },
            label: Identifier {
                s: "byte_809AA5F",
            },
            size: 40,
            data: [ /*...*/ ],
        },
		/*...*/
    },
]
```

We're failing to see the recursion because neither appears in the processed items of the other.

```rust
// in fn trace_read_insts_recur_or_cut_or_merge_or_fail(
    let mut mut_out = vec![ScriptTraceRecord {
        insts,
        symbol_data: symbol_data.clone(),
        script_type: script_type.clone(),
        script_labels: script_labels.clone(),
    }];

    // Process remaining scripts found in ext_dests and script_pointers except for textscript

    for (dest_ea, dest_ident) in script_labels.dests.iter() {
        if dest_ea.ea == symbol_data.ea.ea {
            // Recursive trace, just ignore it.
            continue;
        }
        
        let new_symbol_data = drivers::symbols::read_symbol_data(app_settings, &dest_ea)
            .unwrap_or_else(|e| {
                panic!("Failed to process new symbol data for ext_dest {dest_ident:?}: {e}")
            });

        mut_out.append(&mut trace_read_insts_recur_or_cut_or_merge_or_fail(
            app_settings,
            &new_symbol_data,
            script_type,
            cur_opt_inherited_gfx_anim_start_inst.clone(),
            ea_syms,
            &mut_out,
        ));
    }
```

Yeah we're not combining the processed items of our ancestors when we create `mut_out`.

```rust
// in fn trace_read_insts_recur_or_cut_or_merge_or_fail(
    let mut mut_processed_items_vec = processed_items.to_vec();

    for (dest_ea, dest_ident) in script_labels.dests.iter() {
		/*...*/

        let cur_processed_items = {
            let mut mut_vec = vec![];

            mut_vec.append(&mut mut_processed_items_vec);
            mut_vec.append(&mut mut_out);

            mut_vec
        };

        mut_out.append(&mut trace_read_insts_recur_or_cut_or_merge_or_fail(
            app_settings,
            &new_symbol_data,
            script_type,
            cur_opt_inherited_gfx_anim_start_inst.clone(),
            ea_syms,
            &cur_processed_items,
        ));
    }
```

This way we take account of what's already been processed more completely.

2025-12-18 Wk 51 Thu - 04:45 +03:00

```
cargo run --release --bin dump_script trace cutscene cutscenescript_809AA44

# out
Tracing cutscenescript Identifier { s: "cutscenescript_809AA44" }
Tracing cutscenescript Identifier { s: "byte_809AA5F" }
Tracing cutscenescript Identifier { s: "byte_809AA87" }
Tracing cutscenescript Identifier { s: "cutscenescript_809AA50" }
Tracing cutscenescript Identifier { s: "cutscenescript_809AA50" }
Tracing cutscenescript Identifier { s: "cutscenescript_809AA44" }
Tracing cutscenescript Identifier { s: "byte_809AA5F" }
Tracing cutscenescript Identifier { s: "byte_809AA87" }
Tracing cutscenescript Identifier { s: "cutscenescript_809AA50" }
Tracing cutscenescript Identifier { s: "cutscenescript_809AA50" }
Dumping Identifier { s: "cutscenescript_809AA50" }

```

But we ran into a different problem. We're tracing all these scripts but only dumping the last now.

```
[src/bin/dump_script.rs:803:5] &records = [
    ScriptTraceRecord { /*... for cutscenescript_809AA50*/ },
]
Dumping Identifier { s: "cutscenescript_809AA50" }
```

From the docs of `append`,

```rust
let mut vec = vec![1, 2, 3];
let mut vec2 = vec![4, 5, 6];
vec.append(&mut vec2);
assert_eq!(vec, [1, 2, 3, 4, 5, 6]);
assert_eq!(vec2, []);
```

It's a move operation. This is why it's `&mut`. We were emptying `mut_out` in the process to populate the processed items! So let's clone instead to not move the original items.

```rust
let cur_processed_items = {
	let mut mut_vec = vec![];

	mut_vec.append(&mut processed_items.to_vec());
	mut_vec.append(&mut mut_out.clone());

	mut_vec
};
```

2025-12-18 Wk 51 Thu - 09:35 +03:00

```
     Running `target/release/dump_script trace cutscene byte_809B16C`
Tracing cutscenescript Identifier { s: "byte_809B16C" }

thread 'main' panicked at src/bin/dump_script.rs:383:25:
No instructions read, and yet we fail to read cutscenescript instructions at Identifier { s: "byte_809B16C" }: Partial read Error. Original error: Failed to route the command: No instruction schema found for position 0 and byte 0x84. Parsed Instructions: [].

```

`cutscenescript_8098AFC` also seems suspect with all these ends.

`byte_809B16C` is not a `CutsceneScript`. 

```
byte_809B16C: // CutsceneScript
  .byte 0x84, 0x83, 0x9, 0x8, 0x2, 0x0, 0x1, 0x8
```

```
	ldr r0, byte_809B16C // =0x84
	ldr r1, byte_809B16C+4 // =0x2
	bl StartCutscene // (script: *const CutsceneScript, param: u32) -> ()

```

Its usage show it's a 2-tuple of a pointer to the script and a u32 parameter.

```
byte_809B16C:
  .word byte_8098384
  .word 0x08010002
```

This is already dumped.

2025-12-18 Wk 51 Thu - 13:41 +03:00

```
     Running `target/release/dump_script trace cutscene byte_808F788`
Tracing cutscenescript Identifier { s: "byte_808F788" }
0 new_inst: Inst { name: "cs_lock_player_for_non_npc_dialogue_809e0b0", cmd: 63, opt_subcmd: Some(U8(0)), fields: [] }
2 new_inst: Inst { name: "cs_nop_80377d0", cmd: 6, opt_subcmd: None, fields: [] }
3 new_inst: Inst { name: "cs_set_event_flag", cmd: 41, opt_subcmd: None, fields: [U8("byte1", 255), Event16("event16_2", 5937)] }
7 new_inst: Inst { name: "cs_set_event_flag", cmd: 41, opt_subcmd: None, fields: [U8("byte1", 255), Event16("event16_2", 3055)] }
11 new_inst: Inst { name: "cs_decomp_text_archive", cmd: 62, opt_subcmd: None, fields: [Ptr("ptr1", Rom(RomEa { ea: 0x087E1718 }))] }
16 new_inst: Inst { name: "cs_pause", cmd: 2, opt_subcmd: None, fields: [U8("byte1", 255), U8("byte2", 30)] }

thread 'main' panicked at src/bin/dump_script.rs:446:21:
No terminating command before failing to read cutscenescript instructions at Identifier { s: "byte_808F788" }: Partial read Error. Original error: Inst InstSchema { name: "cs_disable_cutscene_skip_script", cmd: 20, opt_subcmd: Some(U8(0)), fields: [Unused24("unused2")] } Failed to read fields at position 19: line 625: Unused parameter must be 0 but instead was 0x808F8 for field Unused24("unused2").. Parsed Instructions: /*...*/
```

`0x14 ptr1=0x0`  is supposed to be a helper macro. 

```C
// in include/bytecode/cutscene_script.inc
	enum cs_set_cutscene_skip_script_cmd // 0x14
// 0x14 ptr1
// set the script to execute for when a cutscene is skipped
// ptr1 - script to execute
	.macro cs_set_cutscene_skip_script ptr1:req
	.byte cs_set_cutscene_skip_script_cmd
	.word \ptr1
	.endm

// helper macro
// 0x14 ptr1=0x0
// clear the script that is run when a cutscene is skipped
// effectively disabling cutscene skip
	.macro cs_disable_cutscene_skip_script
	.byte cs_set_cutscene_skip_script_cmd
	.word NULL
	.endm
```

Of the 472 instances detected so far of `cs_set_cutscene_skip_script`, none of them had an address that ended with `00`.

```
byte_808F788::
	.byte 0x3F, 0x0, 0x6, 0x29, 0xFF, 0x31, 0x17, 0x29, 0xFF, 0xEF
	.byte 0xB, 0x3E, 0x18, 0x17, 0x7E, 0x8, 0x2, 0xFF, 0x1E
	
	.byte 0x14
	.word byte_808F800
```

But here we do. `byte_808F800` has the first byte of `0x00`. So technically the command of `0x14` and the subcommand of `0x00` match.

This was a cheat:

```rust
        InstSchema {
            name: "cs_disable_cutscene_skip_script".to_owned(),
            cmd: 0x14,
            opt_subcmd: Some(SubCmd::U8(0x00)),
            fields: vec![
                FieldSchema::Unused24("unused2".to_owned()) // remaining of NULL word
            ],
        },
```

Let's add a `SubCmd::U32` variant. The entire word is necessary for the routing after all:

```rust
        InstSchema {
            name: "cs_disable_cutscene_skip_script".to_owned(),
            cmd: 0x14,
            opt_subcmd: Some(SubCmd::U32(0x00000000)),
            fields: vec![
            ],
        },
```

This is also a bit of a hack since `cs_disable_cutscene_skip_script` is strictly just a different presentation of `cs_set_cutscene_skip_script` on `NULL`, but we wanted a way to favor a special variants of commands on `NULL`. 