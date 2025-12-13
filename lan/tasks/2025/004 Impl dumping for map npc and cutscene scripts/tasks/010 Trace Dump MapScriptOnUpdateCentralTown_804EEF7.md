---
parent: '[[004 Impl dumping for map npc and cutscene scripts]]'
spawned_by: '[[006 Dump scripts via script tracing]]'
context_type: task
status: done
---

Parent: [004 Impl dumping for map npc and cutscene scripts](../004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts.md)

Spawned by: [006 Dump scripts via script tracing](006%20Dump%20scripts%20via%20script%20tracing.md)

Spawned in: [<a name="spawn-task-a567d6" />^spawn-task-a567d6](006%20Dump%20scripts%20via%20script%20tracing.md#spawn-task-a567d6)

# 1 Journal

2025-11-11 Wk 46 Tue - 05:01 +03:00

So first we start with cutting and resolving boundaries according to the errors encountered.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script map trace MapScriptOnUpdateCentralTown_804EEF7
````

````
216 new_inst: Inst { name: "cs_jump", cmd: 21, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 134748243 })] }
221 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
222 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
223 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }

thread 'main' panicked at src/bin/dump_script.rs:105:9:
Failed to read cutscenescript instructions at Identifier { s: "cutscenescript_80817B8" }: Failed to route the command: No instruction schema found for position 224 and byte 0xF0
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

We can't treat this pattern of `cs_jump` and `cs_end_for_map_reload_maybe_8037c64` alone as terminating. Not even 3 in a row. `cutscenescript_8081D43` offers a counterexample, unless it's meant to be many scripts that we dumped as one.

Looking at `RunCutscene` which uses `CutsceneCommandJumptable`,

It executes each script until one gives a return signal:

````C
// loop if we haven't reached the return signal
bne .cutsceneCommandLoop
````

Many return `0`  or `1` conditionally, like `CutsceneCmd_pause`.

2025-11-11 Wk 46 Tue - 05:24 +03:00

We can also handle the exceptional cases themselves. On illegal instruction read, expect termination.

A majority of read instruction errors happened because we kept ignoring `cs_end_for_map_reload_maybe_8037c64` as a termination.

2025-11-11 Wk 46 Tue - 06:35 +03:00

I added logic to cut at end boundaries on failure to read next instruction if the last command was a terminating one.

````
221 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
222 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
223 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }

thread 'main' panicked at src/bin/dump_script.rs:133:33:
Failed to cut then mark new label: Failed to get lexon substring record: Failed to get the repo file for symbol Identifier { s: "cutscenescript_80817B8" }
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

This symbol `cutscenescript_80817B8` really doesn't exist yet.

2025-11-11 Wk 46 Tue - 06:48 +03:00

That's because we didn't build with the reset for `bn6f`, so it remained in `bn6f.sym`

2025-11-11 Wk 46 Tue - 06:52 +03:00

````
216 new_inst: Inst { name: "cs_jump", cmd: 21, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 134748243 })] }
221 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
222 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
223 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }

thread 'main' has overflowed its stack
fatal runtime error: stack overflow, aborting
[1]    3320631 IOT instruction (core dumped)  cargo run --release --bin dump_script map trace
````

A stack overflow...

We can see that we're automatically adding some boundary end labels now when we fail to read like `end_cutscenescript_8081898` after `cutscenescript_80817B8` after `byte_808178D`

2025-11-11 Wk 46 Tue - 07:25 +03:00

Fixed the issue with `display_symbol_data_as_directives` that adds an empty `.byte ` line.

The issue with the stack overflow seems to be due to an endlessly looping trace.

2025-11-11 Wk 46 Tue - 07:46 +03:00

All happening here:

````
Tracing cutscenescript Identifier { s: "cutscenescript_80817B8" }
````

`0x80817B8` $\to$ `134748088`

It is referred to once via

````
Tracing mapscript Identifier { s: "MapScript_804EF26" }
46 new_inst: Inst { name: "ms_start_cutscene", cmd: 38, opt_subcmd: None, fields: [Ptr("ptr1", Rom(RomEa { ea: 134748088 })), U32("word5", 0)] }
````

`0x804EF26` $\to$ `134541094`

````
Tracing mapscript Identifier { s: "MapScriptOnUpdateCentralTown_804EEF7" }
0 new_inst: Inst { name: "ms_jump_if_progress_in_range", cmd: 2, opt_subcmd: None, fields: [U8("byte1", 0), U8("byte2", 15), Dest("destination3", RomEa { ea: 134541094 })] }
````

2025-11-11 Wk 46 Tue - 07:59 +03:00

It doesn't look like it's looping, but this is the exact place where we did the boundary cut `end_cutscenescript_8081898`.

It's because the symbol data does not resemble the cut yet.

2025-11-11 Wk 46 Tue - 08:10 +03:00

````
Tracing ccs Identifier { s: "ccs_8084A18" }
0 new_inst: Inst { name: "ccs_wait", cmd: 12, opt_subcmd: None, fields: [U16("hword1", 32)] }
3 new_inst: Inst { name: "ccs_simple_scroll", cmd: 4, opt_subcmd: None, fields: [U16("hword1", 64), U16("hword3", 0), U16("hword5", 128), U16("hword7", 0)] }
12 new_inst: Inst { name: "ccs_end", cmd: 8, opt_subcmd: None, fields: [] }

thread 'main' panicked at src/bin/dump_script.rs:235:21:
Failed to read ccs instructions at Identifier { s: "ccs_8084A18" }: Inst InstSchema { name: "ccs_set_camera_pos", cmd: 0, opt_subcmd: None, fields: [U16("hword1"), U16("hword3"), U16("hword5")] } overflows buffer size 16 at position 13
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

~~This `ccs_set_camera_pos` is also a possible terminating condition.~~ It's not an end command, but `ccs_end` was right before it, and parsing it causes an error.

Wait but the last instruction was a `ccs_end`. We don't have to also add `ccs_set_camera_pos` which would be a fake instruction. It's just that this time we got an overflow error.

2025-11-11 Wk 46 Tue - 08:24 +03:00

````diff
+ccs_8084A18:
+       .word 0x0400200C, 0x00000040, 0x00000080
+       .byte 0x08
+
+end_ccs_8084A25:
+       .byte
+       .byte 0x00
+       .byte 0x00
+       .byte 0x00
````

Seems like there's another way we can get a `.byte `

````
Tracing ccs Identifier { s: "ccs_808AC69" }
0 new_inst: Inst { name: "ccs_simple_scroll", cmd: 4, opt_subcmd: None, fields: [U16("hword1", 200), U16("hword3", 65408), U16("hword5", 128), U16("hword7", 0)] }
9 new_inst: Inst { name: "ccs_end", cmd: 8, opt_subcmd: None, fields: [] }

./data/dat23.s: Assembler messages:
./data/dat23.s:437: Error: agbasm local label `end_ccs_808AC73.byte' was not defined within its scope
````

````
end_ccs_808AC73:
	.byte .byte 
	.byte 0x00
````

Two `.byte`s... Let's see if my fixes handle this.

2025-11-11 Wk 46 Tue - 08:51 +03:00

````
Dumping Identifier { s: "MapScriptOnUpdateCentralTown_804EEF7" }
./maps/CentralTown/data.s: Assembler messages:
./maps/CentralTown/data.s:510: Error: agbasm colonless label `ms_jump_if_progress_in_range' does not end with a newline, assuming not a label
````

Oh probably because I did a test manual dump there before.

````C
MapScriptOnUpdateCentralTown_804EEF7:: // MapScript
  // 00
  ms_jump_if_progress_in_range [
    byte1: 0x0,
    byte2: 0xF,
    destination3: MapScript_804EF26
  ]  
  .byte 0x2, 0x10, 0x1F
````

We need to handle multiline macros as well in `get_data_lexon_replace_record` $\to$ `encountered_significant_new_content`

2025-11-11 Wk 46 Tue - 09:07 +03:00

````
+ccs_8084A18:
+       .word 0x0400200C, 0x00000040, 0x00000080
+       .byte 0x08
+
+end_ccs_8084A25:
+       .byte
+       .byte 0x00
+       .byte 0x00
+       .byte 0x00
````

Still an empty `.byte `...

````rust
// in fn display_symbol_data_as_directives
} if sym_data.data.len() < 4 {
	match data_directive {
		DataDirectives::Bytes => mut_data_s += ".byte ",
		DataDirectives::HWords => mut_data_s += ".hword ",
		DataDirectives::Words => mut_data_s += ".byte ",
	}
````

Didn't handle this case, on `Words` it should not add an empty `.byte `

2025-11-11 Wk 46 Tue - 09:10 +03:00

````
Dumping Identifier { s: "byte_804EF62" }

./maps/CentralTown/data.s: Assembler messages:
./maps/CentralTown/data.s:523: Error: Parameter named `byte1' does not exist for macro `ms_jump_if_flag_range_clear'
./maps/CentralTown/data.s:523: Error: Parameter named `event16_2' does not exist for macro `ms_jump_if_flag_range_clear'
./maps/CentralTown/data.s:523: Error: Parameter named `destination4' does not exist for macro `ms_jump_if_flag_range_clear'
````

Yup missing parameters.

````
	.macro ms_jump_if_flag_range_clear
	.byte ms_jump_if_flag_range_clear_cmd
	.byte \byte1
	.hword \event16_2
	.word \destination4
	.endm
````

2025-11-11 Wk 46 Tue - 09:46 +03:00

````
Dumping Identifier { s: "cutscenescript_80817B8" }

./data/dat21.s: Assembler messages:
./data/dat21.s:140: Error: Parameter named `signedhword4' does not exist for macro `cs_spawn_ow_map_object_rel_to_ow_npc'
./data/dat21.s:140: Error: Parameter named `signedhword6' does not exist for macro `cs_spawn_ow_map_object_rel_to_ow_npc'
./data/dat21.s:140: Error: Parameter named `signedhword8' does not exist for macro `cs_spawn_ow_map_object_rel_to_ow_npc'
./data/dat21.s:140: Error: Missing value for required parameter `hword4' of macro `cs_spawn_ow_map_object_rel_to_ow_npc'
./data/dat21.s:140: Error: Missing value for required parameter `hword6' of macro `cs_spawn_ow_map_object_rel_to_ow_npc'
./data/dat21.s:140: Error: Missing value for required parameter `hword8' of macro `cs_spawn_ow_map_object_rel_to_ow_npc'
````

2025-11-11 Wk 46 Tue - 10:03 +03:00

````
Dumping Identifier { s: "cutscenescript_80817B8" }

./data/dat21.s: Assembler messages:
./data/dat21.s:140: Error: invalid operands (*ABS* and *UND* sections) for `|'
./data/dat21.s:145: Error: invalid operands (*ABS* and *UND* sections) for `|'
./data/dat21.s:146: Error: invalid operands (*ABS* and *UND* sections) for `|'
````

It should also be parsing graphics anim via

````
cutscenescript_80817B8:
[...]
cs_load_gfx_anim ptr1=byte_8098458
````

The anims one needs special handling

````
cutscenescript_809495A:
[...]
cs_load_gfx_anims ptr1=off_80348FC
````

Since it's many of them terminated by `0xFF`.

What's the issue with `|`... `cs_spawn_ow_map_object_rel_to_ow_npc` uses

````
.macro nybble high:req, low:req
.byte (\high << 4) | \low
.endm
````

````
cs_spawn_ow_map_object_rel_to_ow_npc nybble1=0x00 byte2=0x20 byte3=0x20 signedhword4=0x0000 signedhword6=0x0000 signedhword8=0x0000 word10=0x00000000
````

````
	.macro cs_spawn_ow_map_object_rel_to_ow_npc nybble1:req byte2:req byte3:req signedhword4:req signedhword6:req signedhword8:req word10:req
	.byte cs_spawn_free_ow_map_object_specials_cmd
	nybble cs_spawn_ow_map_object_rel_to_ow_npc_subcmd, nybble1
	.byte \byte2
	.byte \byte3
	.hword \signedhword4
	.hword \signedhword6
	.hword \signedhword8
	.word \word10
	.endm
````

We can add `+` instead  of OR `|` for nybble.

But then we get:

````
tools/binutils/bin/arm-none-eabi-ld: rom.o: in function `cutscenescript_80817B8':
/home/lan/src/cloned/gh/dism-exe/bn6f/./asm/asm21.s:544: undefined reference to `nybble1'
tools/binutils/bin/arm-none-eabi-ld: /home/lan/src/cloned/gh/dism-exe/bn6f/./asm/asm21.s:544: undefined reference to `nybble1'
tools/binutils/bin/arm-none-eabi-ld: /home/lan/src/cloned/gh/dism-exe/bn6f/./asm/asm21.s:544: undefined reference to `nybble1'
````

2025-11-11 Wk 46 Tue - 10:18 +03:00

So `cutscenescript_80817B8` is right when the robodog is attacking Iris in the beginning of the game. and `end_cutscenescript_8081898` is undumped code...

From

````
cutscenescript_80817B8:
[...]
cs_call_native_with_return_value ptr1=end_cutscenescript_8081898+1
````

2025-11-11 Wk 46 Tue - 11:05 +03:00

It seems we missed `cs_load_gfx_anims` and `cs_load_gfx_anim` in our processing of script pointers. We included only the `ms_` variant.

2025-11-11 Wk 46 Tue - 11:22 +03:00

Added logic to handle fetching all the pointers if there are many behind an FF-terminated array. Let's run this again on `MapScriptOnInitCentralTown_804EA28` to dump the gfx anim scripts we missed.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script map trace MapScriptOnInitCentralTown_804EA28
````

2025-11-11 Wk 46 Tue - 11:48 +03:00

Spawn [000 Investigate parsing gfx anim scripts](../investigations/000%20Investigate%20parsing%20gfx%20anim%20scripts.md) <a name="spawn-invst-b48fb7" />^spawn-invst-b48fb7

2025-11-15 Wk 46 Sat - 14:29 +03:00

OK, `MapScriptOnUpdateCentralTown_804EEF7` dumps as well!

`mapscript_804EF39` calls

````
ms_start_cutscene ptr1=CutsceneScriptIrisAttackedByRoboDog word5=0x00000000
````

After some game progress routing for Central town on map update script!

Let's trace dump `NPCScriptsForCentralTown_804F9D8`

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script npc trace dword_804FA1C &&
cargo run --release --bin dump_script npc trace byte_804FAF9 &&
cargo run --release --bin dump_script npc trace byte_804FB83 &&
cargo run --release --bin dump_script npc trace byte_804FD3A &&
cargo run --release --bin dump_script npc trace byte_804FF4A &&
cargo run --release --bin dump_script npc trace dword_8050120 &&
cargo run --release --bin dump_script npc trace byte_80502B6 &&
cargo run --release --bin dump_script npc trace byte_8050326 &&
cargo run --release --bin dump_script npc trace byte_805037B &&
cargo run --release --bin dump_script npc trace byte_8050397 &&
cargo run --release --bin dump_script npc trace byte_80503AA &&
cargo run --release --bin dump_script npc trace byte_80503DB &&
cargo run --release --bin dump_script npc trace byte_805040D &&
cargo run --release --bin dump_script npc trace byte_805043E &&
cargo run --release --bin dump_script npc trace dword_8050538 &&
cargo run --release --bin dump_script npc trace byte_805060B
````

Another duplicate symbol error, this time with `npcscript_804FAF8`.

````
Dumping Identifier { s: "byte_804FAD8" }

./maps/CentralTown/data.s: Assembler messages:
./maps/CentralTown/data.s:1027: Error: symbol `npcscript_804FAF8' is already defined
````

````C
byte_804FAD8::
	ns_jump_if_flag_set event16_1=EVENT_E16 destination3=npcscript_804FAF8
	ns_jump_if_flag_clear event16_1=EVENT_E14 destination3=npcscript_804FAF8
	ns_set_sprite byte1=0x11
	ns_set_text_script_index byte1=0x15
	ns_set_coords hword1=0x004A hword3=0xFFE4 hword5=0x0000
	ns_set_animation byte1=0x03
	ns_jump_with_link destination1=byte_809F6CC
npcscript_804FAF8:
	ns_free_and_end

npcscript_804FAF8:
	.byte 0x03
````

Before dumping:

````C
byte_804FAD8::
	.byte 0x4, 0x16, 0xE, 0xF8, 0xFA, 0x4, 0x8, 0x5, 0x14, 0xE, 0xF8
	.byte 0xFA, 0x4, 0x8, 0x17, 0x11, 0x18, 0x15, 0x14, 0x4A, 0x0, 0xE4
	.byte 0xFF, 0x0, 0x0, 0x16, 0x3, 0x36
	.word byte_809F6CC
	.byte 0x3
````

`ns_free_and_end` is `0x03`.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script npc trace byte_804FAD8
````

This doesn't reproduce the double label for `npcscript_804FAF8`...

But it does reproduce this issue:

````diff
 byte_809F6CC::
+byte_809F6CC:
        ns_pause byte1=0x01
````

It might be because `npcscript_804FAF8` was an ext label and int label at once, and based on the queue, it dumped it internally from symbol data and externally as another script's dependency.

````rust
// in fn replace_repo_content_for_data
dbg!(&lexon_replace_rec);
dbg!(&new_content);

// out
[src/drivers/symbols.rs:1118:5] &lexon_replace_rec = DataLexonReplaceRecord {
    substring: "byte_809F6CC::\n\tns_pause byte1=0x01\n\tns_jump destination1=byte_809F6CC\n\tns_end\n\n",
    label: "byte_809F6CC::",
    sym_repo_path: "/home/lan/src/cloned/gh/dism-exe/bn6f/asm/npc.s",
}
[src/drivers/symbols.rs:1119:5] &new_content = "byte_809F6CC::\nbyte_809F6CC:\n\tns_pause byte1=0x01\n\tns_jump destination1=byte_809F6CC\n\tns_end\n\n"
````

It happens in `dump`:

````rust
let opt_labeled_ea = script_labels
	.int_dests
	.iter()
	.find(|(rom_ea, _)| rom_ea.ea == *mut_cur_ea);
````

It is because the internal destination is in fact the symbol itself. It's recursive. Let's filter out the case for the internal dest being the symbol being dumped, since we don't want to put a label at the beginning.

2025-11-15 Wk 46 Sat - 15:59 +03:00

Removing the internal/external distinction of destinations. This way they will all be cut beforehand to ensure we don't run into the internal label being referred to externally issue.

2025-11-15 Wk 46 Sat - 16:13 +03:00

````
Tracing npcscript Identifier { s: "byte_809F6CC" }
0 new_inst: Inst { name: "ns_pause", cmd: 16, opt_subcmd: None, fields: [U8("byte1", 1)] }
2 new_inst: Inst { name: "ns_jump", cmd: 2, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 134870732 })] }
7 new_inst: Inst { name: "ns_end", cmd: 0, opt_subcmd: None, fields: [] }
Tracing npcscript Identifier { s: "byte_809F6CC" }
0 new_inst: Inst { name: "ns_pause", cmd: 16, opt_subcmd: None, fields: [U8("byte1", 1)] }
2 new_inst: Inst { name: "ns_jump", cmd: 2, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 134870732 })] }
7 new_inst: Inst { name: "ns_end", cmd: 0, opt_subcmd: None, fields: [] }
Tracing npcscript Identifier { s: "byte_809F6CC" }
0 new_inst: Inst { name: "ns_pause", cmd: 16, opt_subcmd: None, fields: [U8("byte1", 1)] }
2 new_inst: Inst { name: "ns_jump", cmd: 2, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 134870732 })] }
7 new_inst: Inst { name: "ns_end", cmd: 0, opt_subcmd: None, fields: [] }

thread 'main' has overflowed its stack
fatal runtime error: stack overflow, aborting
````

Since it's calling itself, we need to prevent recurring tracing. We do not propagate state over in `trace_read_insts_recur_or_cut_or_fail` to check for encountering recursion in the general case, but we should be able to not trace ourselves again.

Cutting undid dumping of npc script `byte_804FE42` but it might dump it again.

`byte_809F6EC` got defined and then dumped twice... or maybe three times, third without a label. Although it was already duplicated before dumping, so let's remove that.

2025-11-15 Wk 46 Sat - 17:03 +03:00

````
No terminating command before failing to read npcscript instructions at Identifier { s: "npcscript_80500DC" }: Partial read Error. Original error: Inst InstSchema { name: "ns_set_coords", cmd: 20, opt_subcmd: None, fields: [U16("hword1"), U16("hword3"), U16("hword5")] } overflows buffer size 38 at position 32. Parsed Instructions: [Inst { name: "ns_jump_if_flag_set", cmd: 4, opt
````

`byte_8050102` is a fake pointer. Let's remove it.

2025-11-15 Wk 46 Sat - 17:19 +03:00

````
Dumping Identifier { s: "byte_805010A" }
bn6f.gba: FAILED
````

````C
byte_805010A::
	ns_set_sprite byte1=0x0E
	ns_set_text_script_index byte1=0x0C
	ns_set_coords hword1=0xFF9A hword3=0x005E hword5=0x0000
	ns_set_animation byte1=0x05
	ns_init_movement byte1=0x05 byte2=0x06 byte3=0x08 destination4=byte_809F71C
	ns_free_and_end // removing this makes it OK. It's duplicate of .byte 0x03 below

npcscript_805011F:
	.byte 0x03
````

It's outdated symbol data again, because it was cut later on. We need to run the tracing stage twice to ensure that this does not happen.

2025-11-15 Wk 46 Sat - 18:41 +03:00

````
Tracing npcscript Identifier { s: "byte_805043E" }

22 new_inst: Inst { name: "ns_jump_if_progress_in_range", cmd: 59, opt_subcmd: None, fields: [U8("byte1", 80), U8("byte2", 80), Dest("destination3", RomEa { ea: 134546524 })] }
29 new_inst: Inst { name: "ns_free_and_end", cmd: 3, opt_subcmd: None, fields: [] }

Failed to read npcscript instructions at Identifier { s: "byte_805043E" }: Other error: Encountered an unknown parameter that is not 0
````

This should also be added for fallback end boundary cutting with `PartialReadError`.

2025-11-16 Wk 46 Sun - 08:37 +03:00

What remains is

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script npc trace byte_805043E &&
cargo run --release --bin dump_script npc trace dword_8050538 &&
cargo run --release --bin dump_script npc trace byte_805060B
````

Needed to also add `ns_free_and_end` to `is_terminating_inst` in `fn trace_read_insts_recur_or_cut_or_fail`

````
No instructions read, and yet we fail to read npcscript instructions at Identifier { s: "end_npcscript_805045C" }: Partial read Error. Original error: line 656: Encountered an unknown parameter that is not 0. Parsed Instructions: []
````

Nothing shows that it should parse `end_npcscript_805045C`... Actually it's in

````
Tracing npcscript Identifier { s: "byte_805043E" }

22 new_inst: Inst { name: "ns_jump_if_progress_in_range", cmd: 59, opt_subcmd: None, fields: [U8("byte1", 80), U8("byte2", 80), Dest("destination3", RomEa { ea: 134546524 })] }
````

2025-11-16 Wk 46 Sun - 09:03 +03:00

More clarified error,

````
No instructions read, and yet we fail to read npcscript instructions at Identifier { s: "end_npcscript_805045C" }: Partial read Error. Original error: line 656: Unused parameter must be 0 but instead was 0x8050466 for Inst InstSchema { name: "ns_jump_alt", cmd: 77, opt_subcmd: None, fields: [Unused32("unusedword1"), Dest("destination5")] } and Field Unused32("unusedword1"). Parsed Instructions: []
````

`NPCCommandsJumptable` $\to$ `NPCCommand_jump_alt`

It really only reads destination5, and yet, it has a valid pointer at unusedword1...

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 8050466

# out
RomEa { ea: 134546534 } is not in map. But it is between Identifier { s: "end_npcscript_805045C" } and Identifier { s: "byte_80504AA" }
````

It should be an unused destination, but typed as a dest nonetheless. There is valid script there.

Need to redump things. Some are still just data blocks like `npcscript_804FB1E`, `npcscript_804FD1C`, `byte_8050202`, `npcscript_8050298`,  `byte_8050302`, `byte_805030B`, `npcscript_805051A`, `npcscript_80505ED`, `npcscript_8050659`, `byte_8050703`, `byte_805083F`, `byte_8050D2B`, `byte_8050D87`, `byte_8050E94`, `byte_8051002`, `byte_8051007`, `byte_8051009`,

NPC Script Lists `end_npcscript_80507F4`, `unk_8050994`, `unk_8050C7C`, `unk_8050EBC`, `unk_8051070`, `byte_80515E3`

Then we reach `NPCScriptsForLanHouse_8051624`

Actually from `NPCScriptsForCentralTown_804F9D8` all the way down to end of `npc_script_8052227` is all npc related. It could be parsed as a range.

2025-11-16 Wk 46 Sun - 11:17 +03:00

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script npc range NPCScriptsForCentralTown_804F9D8 npc_script_8052227
````

This should do both a trace for all scripts encountered, and also parse a range of all symbol data in a block, taking into account that some are FFStop lists, and others are scripts.

most of the maps also follow the same pattern

````C
asm04:
	.include "maps/CentralTown/warps_gfx_anims.s"
	.include "maps/CentralTown/loader.s"
	.include "maps/CentralTown/data.s"
````

From `MapScriptOnInitCentralTown_804EA28` to `MapScriptOnUpdateAsterLand_804F9C5` looks like a continguous block of map scripts. Unlike NPC, there are no lists. They're all just maps, which range should also be able to handle.

This will get all the central town map scripts, as it will trace for each one.

After we trace the known pointers from the lists, we can then run a range dump to make sure we don't miss anything once all the cutting has settled things, otherwise it is also possible to have labels that shouldn't exist like fake labels, and those would not be scripts.

2025-11-16 Wk 46 Sun - 11:52 +03:00

We also have to redump the lists themselves as they could be outdated after cutting.

2025-11-16 Wk 46 Sun - 12:24 +03:00

`npcscript_804FD1C` so far has no uses. So with range we may be able to at least not skip unused scripts. But it was marked `npcscript`.... Similarly for `npcscript_805051A`

2025-11-16 Wk 46 Sun - 12:38 +03:00

Right now the bottleneck seems to be redumping the same scripts that make no difference to the repo. Let's put a check that if the content dumped is identical to the existent content, no rebuild or content change triggers.

2025-11-16 Wk 46 Sun - 13:07 +03:00

````
Process in range: byte_8051002
Tracing npcscript Identifier { s: "byte_8051002" }
0 new_inst: Inst { name: "ns_set_animation", cmd: 22, opt_subcmd: None, fields: [U8("byte1", 9)] }

No terminating command before failing to read npcscript instructions at Identifier { s: "byte_8051002" }: Partial read Error. Original error: Inst InstSchema { name: "ns_move_in_direction", cmd: 21, opt_subcmd: None, fields: [U8("byte1"), U8("byte2"), U8("byte3")] } overflows buffer size 5 at position 2. Parsed Instructions: [Inst { name: "ns_set_animation", cmd: 22, opt_subcmd: None, fields: [U8("byte1", 9)] }]
````

`RealWorldMapScriptPointers` $\to$ `off_8052DB4` $\to$ `byte_8053A49` $\to$ `byte_8053A63` $\to$ `byte_8051002`

It overflows `byte_8051007` There's only one use of that. Removing that label.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script npc range byte_8051002 npc_script_8052227
````

````
No terminating command before failing to read npcscript instructions at Identifier { s: "byte_8051002" }: Partial read Error. Original error: Inst InstSchema { name: "ns_set_animation", cmd: 22, opt_subcmd: None, fields: [U8("byte1")] } overflows buffer size 7 at position 6. Parsed Instructions: [Inst { name: "ns_set_animation", cmd: 22, opt_subcmd: None, fields: [U8("byte1", 9)] }, Inst { name: "ns_move_in_direction", cmd: 21, opt_subcmd: None, fields: [U8("byte1", 1), U8("byte2", 8), U8("byte3", 2)] }]
````

Seems `byte_8051009` is fake also. Removing all of its uses and it.

2025-11-16 Wk 46 Sun - 13:37 +03:00

````
Process in range: byte_8051990
Tracing npcscript Identifier { s: "byte_8051990" }

53 new_inst: Inst { name: "ns_set_animation", cmd: 22, opt_subcmd: None, fields: [U8("byte1", 5)] }
55 new_inst: Inst { name: "ns_write_cutscene_var", cmd: 60, opt_subcmd: None, fields: [U8("byte1", 8), U8("byte2", 4)] }

No terminating command before failing to read npcscript instructions at Identifier { s: "byte_8051990" }: Partial read Error. Original error: Inst InstSchema { name: "ns_wait_cutscene_var", cmd: 63, opt_subcmd: None, fields: [U8("byte1"), U8("byte2")] } overflows buffer size 60 at position 58. 
````

`byte_80519CC` has no use. Removing.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script npc range byte_8051990 npc_script_8052227
````

````
Process in range: byte_8051A1E
Tracing npcscript Identifier { s: "byte_8051A1E" }

72 new_inst: Inst { name: "ns_set_active_and_invisible", cmd: 9, opt_subcmd: None, fields: [] }
73 new_inst: Inst { name: "ns_end_secondary_script", cmd: 52, opt_subcmd: None, fields: [] }

thread 'main' panicked at src/bin/dump_script.rs:237:25:
No terminating command before failing to read npcscript instructions at Identifier { s: "byte_8051A1E" }: Partial read Error. Original error: Failed to route the command: No instruction schema found for position 74 and byte 0x70. Parsed Instructions: [Inst { name: "ns_set_active_and_visible", cmd: 8, opt_subcmd: None, fields: [] }, Inst { name: "ns_disable_collision", cmd: 31, o
````

````sh
python3 -c "print(hex(0x8051A1E + 74))"

# out
0x8051a68
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 8051a68 -M "end_npcscript_8051A68"
````

There was an npc list in the middle there.

````C
end_npcscript_8051A68:
	.word byte_8051A70, 0x000000FF
````

These would likely have been used the mapscripts and their dependencies and hence marked.

Let's try to first dump the rest of the map scripts for central town:

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script map trace MapScriptOnInitLanHouse_804F1D4 &&
cargo run --release --bin dump_script map trace MapScriptOnInitLanRoom_804F4F0 &&
cargo run --release --bin dump_script map trace MapScriptOnInitBathroom_804F934 &&
cargo run --release --bin dump_script map trace MapScriptOnInitAsterLand_804F998 &&
cargo run --release --bin dump_script map trace MapScriptOnUpdateLanHouse_804F3F0 &&
cargo run --release --bin dump_script map trace MapScriptOnUpdateLanRoom_804F744 &&
cargo run --release --bin dump_script map trace MapScriptOnUpdateBathroom_804F96E &&
cargo run --release --bin dump_script map trace MapScriptOnUpdateAsterLand_804F9C5
````

It's also in the map script block `MapScriptOnInitCentralTown_804EA28` to `MapScriptOnUpdateAsterLand_804F9C5` inclusive.

2025-11-16 Wk 46 Sun - 14:05 +03:00

````diff
 dat24:
-       .include "data/dat24.s"
+       .byte 0x00
+       .byte 0x00
+
+ccs_808D268:
+       .word 0x80FCE000, 0x080000FA
+"data/dat24.s"
````

No label at the beginning of `dat24.s`. Let's add `byte_808D266`.

2025-11-16 Wk 46 Sun - 14:17 +03:00

````
Tracing gfx_anim_script Identifier { s: "gfx_anim_script_804E4D0" }

thread 'main' panicked at src/bin/dump_script.rs:257:21:
Failed to read gfx_anim_script instructions at Identifier { s: "gfx_anim_script_804E4D0" }: Other error: Invalid Ea processed in byte 0 for Inst InstSchema { name: "gfx_anim_8bit_tile_copy", cmd: 24, opt_subcmd: None, fields: [Ptr("gfx_src"), Ptr("gfx_dest"), U8("index"), U8("num_tiles"), U8("buffer_index")] } and Field Ptr("gfx_dest"): Effective address 100694464 is invalid.
````

````C
gfx_anim_script_804E4D0:
	.word dword_850D034, 0x060079C0, 0x0D0F0218, byte_804E55C, 0x00000001, 0x00000000
````

It's a VRAM destination `0x060079C0`. It is a valid pointer, but we have not been recognizing them because we do not label VRAM.

Adding a vram region to `ld_script.ld` and a `vram.s`. These pointers should be recognized wherever they are used.

From [GBATEK GBAMemoryMap](https://problemkaputt.de/gbatek.htm#gbamemorymap),

````
06000000-06017FFF   VRAM - Video RAM          (96 KBytes)
````

So the size is `18000`

Adding also to `Makefile`: `SFILES = rom.s data.s ewram.s iwram.s vram.s`

It follows the same procesure as with `ewram.s`, labels separated by `.space`

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
tools/binutils/bin/arm-none-eabi-objdump -t bn6f.elf | less

# out (relevant)
06000000 g       vram_6000000   00000000 byte_6000000
````

`make bn6f.sym` needs to be updated:

````diff
$(SYM): $(ELF)
-	$(OBJDUMP) -t $< | sort -u | grep -E "^0[2389]" | perl -p -e 's/^(\w{8}) (\w).{6} \S+\t(\w{8}) (\S+)$$/\1 \2 \3 \4/g' > $@
+	$(OBJDUMP) -t $< | sort -u | grep -E "^0[23689]" | perl -p -e 's/^(\w{8}) (\w).{6} \S+\t(\w{8}) (\S+)$$/\1 \2 \3 \4/g' > $@
````

Since we accept addresses `06000000` now.

Now we have `byte_60079C0`.

````
0600e000 l 00000000 vBGTileIds
06010000 l 00000000 vObjectTiles
````

These are not currently real labels but are read. Let's remove them from `constants/gba_constants.inc` and move them over to `vram.s`.

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
git commit -m "add vram.s for vram pointers"

# out
[master 148c789c] add vram.s for vram pointers
 4 files changed, 27 insertions(+), 6 deletions(-)
 create mode 100644 vram.s
````

Removing the pointer at `0x6018000`  since it is the end of the region should be invalid. Left it as a comment.

npc script `byte_8051990` was unset while cutting

````
Tracing ccs Identifier { s: "ccs_808DC66" }
0 new_inst: Inst { name: "ccs_wait", cmd: 12, opt_subcmd: None, fields: [U16("hword1", 1)] }
3 new_inst: Inst { name: "ccs_simple_scroll", cmd: 4, opt_subcmd: None, fields: [U16("hword1", 64), U16("hword3", 256), U16("hword5", 0), U16("hword7", 0)] }

thread 'main' panicked at src/bin/dump_script.rs:237:25:
No terminating command before failing to read ccs instructions at Identifier { s: "ccs_808DC66" }: Partial read Error. Original error: Inst InstSchema { name: "ccs_simple_scroll", cmd: 4, opt_subcmd: None, fields: [U16("hword1"), U16("hword3"), U16("hword5"), U16("hword7")] } overflows buffer size 18 at position 12. Parsed Instructions: [Inst { name: "ccs_wait", cmd: 12, opt_su
````

Removing `end_cutscenescript_808DC78` which was overflown.

2025-11-16 Wk 46 Sun - 15:45 +03:00

````
45 new_inst: Inst { name: "ns_set_npc_palette_index", cmd: 15, opt_subcmd: None, fields: [U8("byte1", 0)] }
47 new_inst: Inst { name: "ns_jump_with_link", cmd: 54, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 134870732 })] }

thread 'main' panicked at src/bin/dump_script.rs:237:25:
No terminating command before failing to read npcscript instructions at Identifier { s: "byte_8051BA8" }: Partial read Error. Original error: Failed to route the command: No instruction schema found for position 52 and byte 0xE4. Parsed Instructions: [Inst { name: "ns_set_active_and_visible", cmd: 8, opt_subcmd: None, fields: [] }, Inst { name: "ns_disable_collision", cmd: 31, 
````

Once again undiscovered npc lists. Let's label them.

````
08051bd8 l 00000000 AAAA0
08051c14 l 00000000 AAAA1
08051c68 l 00000000 AAAA2
08051cac l 00000000 AAAA3
08051d24 l 00000000 AAAA4
08051da4 l 00000000 AAAA5
````

Added NPC lists labels for them.

````
No terminating command before failing to read npcscript instructions at Identifier { s: "byte_8051BA8" }: Partial read Error. Original error: Inst InstSchema { name: "ns_jump_with_link", cmd: 54, opt_subcmd: None, fields: [Dest("destination1")] } overflows buffer size 48 at position 47. Parsed Instructions: [Inst { name: "ns_set_active_and_visible",
````

First two lists should be like

````C
	.word byte_809F6CC
npc_list_08051BDC:
	.word byte_8051BE4
	.word 0xFF
````

I included `byte_809F6CC` but it was part of the last instruction.

````
Tracing cutscenescript Identifier { s: "byte_8084D8E" }

13 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
14 new_inst: Inst { name: "cs_pause", cmd: 2, opt_subcmd: None, fields: [U8("byte1", 8), U8("byte2", 4)] }

thread 'main' panicked at src/bin/dump_script.rs:237:25:
No terminating command before failing to read cutscenescript instructions at Identifier { s: "byte_8084D8E" }: Partial read Error. Original error: Failed to route the command: No instruction schema found for position 17 and byte 0xA0. Parsed Instructions: [Inst { name: "cs_set_chatbox_flags", cmd: 60, opt_subcmd: Some(U8(0)), fields: [U8("byte2", 64)] }, Inst { name: "cs_jump",
````

````sh
python3 -c "print(hex(0x8084D8E + 14))"

# out
0x8084d9c
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 8084d9c -M "end_cutscenescript_8084D9C"
````

2025-11-16 Wk 46 Sun - 17:07 +03:00

````
164 new_inst: Inst { name: "cs_jump", cmd: 21, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 134775488 })] }
169 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
170 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
171 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
172 new_inst: Inst { name: "cs_end_for_map_reload_maybe_8037c64", cmd: 0, opt_subcmd: None, fields: [] }
173 new_inst: Inst { name: "cs_init_scenario_effect", cmd: 96, opt_subcmd: None, fields: [U8("byte1", 17)] }

thread 'main' panicked at src/bin/dump_script.rs:237:25:
No terminating command before failing to read cutscenescript instructions at Identifier { s: "byte_8088268" }: Partial read Error. Original error: Failed to route the command: No instruction schema found for position 175 and byte 0xC0. Parsed Instructions: [Inst { name: "cs_lock_player_for_non_npc_dialogue_809e0b0", cmd: 63, opt_subcmd: Some(U8(0)), fields: [] }, Inst { name: "cs_
````

````sh
python3 -c "print(hex(0x8088268 + 170))"

# out
0x8088312
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 8088312 -M "end_cutscenescript_8088312"
````

````
No terminating command before failing to read cutscenescript instructions at Identifier { s: "byte_80990DC" }: Partial read Error. Original error: Inst InstSchema { name: "cs_switch_case_from_chatbox_flags_bit0_to_2", cmd: 61, opt_subcmd: None, fields: [Dest("destination1"), Dest("destination5"), Dest("destination9"), Dest("destination13"), Dest("destination17"), Dest("destination21"), Dest("destination25"), Dest("destination29")] } overflows buffer size 56 at position 47. 
````

We're overflowing `dword_8099114` even though it looks like the script before it `byte_80990DC` refers to it... let's remove it.

````
No terminating command before failing to read cutscenescript instructions at Identifier { s: "byte_80990DC" }: Partial read Error. Original error: Inst InstSchema { name: "cs_switch_case_from_chatbox_flags_bit0_to_2", cmd: 61, opt_subcmd: None, fields: [Dest("destination1"), Dest("destination5"), Dest("destination9"), Dest("destination13"), Dest("destination17"), Dest("destination21"), Dest("destination25"), Dest("destination29")] } overflows buffer size 67 at position 47. Parsed Instructions: [Inst { name: "cs_lock_player_for_non_npc_dialogue_809e0b0", cmd: 63, o
````

Happened again with `byte_809911F` being the overflown but also in the script behind it `byte_80990DC`. But we will see once we dump them. Let's remove it.

Soon after there's a script `CutsceneScript_80991F4` that seems related to `RunLMessageTextScript`

````
Tracing cutscenescript Identifier { s: "byte_80990DC" }

No terminating command before failing to read cutscenescript instructions at Identifier { s: "byte_80990DC" }: Partial read Error. Original error: Invalid Ea processed in byte 47 for Inst InstSchema { name: "cs_switch_case_from_chatbox_flags_bit0_to_2", cmd: 61, opt_subcmd: None, fields: [Dest("destination1"), Dest("destination5"), Dest("destination9"), Dest("destination13"), Dest("destination17"), Dest("destination21"), Dest("destination25"), Dest("destination29")] } and Field Dest("destination9"): Effective address 1259667202 is invalid.. Parsed Instructions: [I
````

`1259667202` $\to$ `0x4b14ff02`

In the comments for the macro `cs_switch_case_from_chatbox_flags_bit0_to_2`  it says `the length of this command is unknown, but the max length should be 33`. This is command 0x3d `CutsceneCmd_switch_case_from_chatbox_flags_bit0_to_2`

The implementation really just reads an nth dest, and assumes it's been made to exist. It is a variable sized instruction that we can only determine on read, based on how many dests were read are valid eas.

2025-11-16 Wk 46 Sun - 19:00 +03:00

I added an implementation of variable sized `VarDests` field. The number actually read will then append to the command. Let's make corresponding macros for each count.

`cs_switch_case_from_chatbox_flags_bit0_to_2_1` to `cs_switch_case_from_chatbox_flags_bit0_to_2_8`

When checking for overflowing the buffer, we also need to check against the minimum possible size of the variable field instruction. We can't really know before reading otherwise. The minimum is 5 bytes, 1 for the command, and at least 1 dest.

2025-11-16 Wk 46 Sun - 19:38 +03:00

````
    Finished `release` profile [optimized + debuginfo] target(s) in 0.13s
     Running `target/release/dump_script map trace MapScriptOnInitLanRoom_804F4F0`
````

So `MapScriptOnInitLanHouse_804F1D4` is finished.

````
Dumping Identifier { s: "byte_80990DC" }
bn6f.gba: FAILED
````

It's the dumping of the var dest instruction. It's too long, need to make it a multi-line macro.

2025-12-10 Wk 50 Wed - 23:44 +03:00

We're dumping the multi-var macro wrong. You can find a correct format in `CentralTownObjectSpawns`:

````C
	map_object_spawn_data_struct [
		index: 0x0,
		x: -0x840000,
		y: -0x180000,
		z: 0x000000,
		object_id: 0x000073,
	]
````

But we are dumping in `byte_80990DC`:

````C
	cs_switch_case_from_chatbox_flags_bit0_to_2_8 [
		destination1:cutscenescript_8099114
			destination5:cutscenescript_8099114
			destination9:cutscenescript_8099114
			destination13:cutscenescript_8099114
			destination17:cutscenescript_8099114
			destination21:cutscenescript_8099114
			destination25:cutscenescript_8099114
			destination29:cutscenescript_8099114
]
````

The last we were dumping was:

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script map trace MapScriptOnInitLanHouse_804F1D4 &&
cargo run --release --bin dump_script map trace MapScriptOnInitLanRoom_804F4F0 &&
cargo run --release --bin dump_script map trace MapScriptOnInitBathroom_804F934 &&
cargo run --release --bin dump_script map trace MapScriptOnInitAsterLand_804F998 &&
cargo run --release --bin dump_script map trace MapScriptOnUpdateLanHouse_804F3F0 &&
cargo run --release --bin dump_script map trace MapScriptOnUpdateLanRoom_804F744 &&
cargo run --release --bin dump_script map trace MapScriptOnUpdateBathroom_804F96E &&
cargo run --release --bin dump_script map trace MapScriptOnUpdateAsterLand_804F9C5
````

As we test this, let's try to dump just `byte_80990DC` until we get this multi-var multi-line command to work:

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script cutscene trace byte_80990DC
````

Also remember to reset the lexer state after bn6f build since we did `git reset --hard` on bn6f:

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
git reset --hard
make clean && make -j$(nproc) assets && make -j$(nproc) && make bn6f.sym

# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
rm -rf ~/data/apps/bn_repo_editor/*
cargo run --release --bin bn_repo_editor lexer
````

2025-12-11 Wk 50 Thu - 00:07 +03:00

````diff
// in fn dump
// in let res_fields_s, VarDests variant

-field_s += &format!("\t{name}:{}\n", label.s);
+field_s += &format!("{name}: {},\n", label.s);
````

The formatting should be fixed now in `byte_80990DC`:

````C
	cs_switch_case_from_chatbox_flags_bit0_to_2_8 [
		destination1: cutscenescript_8099114,
		destination5: cutscenescript_8099114,
		destination9: cutscenescript_8099114,
		destination13: cutscenescript_8099114,
		destination17: cutscenescript_8099114,
		destination21: cutscenescript_8099114,
		destination25: cutscenescript_8099114,
		destination29: cutscenescript_8099114,
]
````

Well, the `]` should be tabbed.

````diff
// in fn dump
// in let joined_fields_s
-format!("[\n\t\t{}\n]", fields_s.join("").replace("\n", "\n\t\t"))
+format!("[\n\t\t{}\n\t]", fields_s.join("").replace("\n", "\n\t\t"))
````

2025-12-11 Wk 50 Thu - 00:31 +03:00

Noted in [005 Reminders noted during bn6f CentralArea Map Exploration](../../../../topics/bn6f/explorations/entries/2025/001%20Exploring%20bn6f%20CentralArea%20Map/entries/005%20Reminders%20noted%20during%20bn6f%20CentralArea%20Map%20Exploration.md) about encountered undisassembled code for `byte_80990DC`: `cs_call_native_with_return_value ptr1=unk_8099165`

2025-12-11 Wk 50 Thu - 00:41 +03:00

````C
byte_80990DC:
	.word 0x2906003F, 0x021731FF, 0x654B01FF, 0x02080991, 0xFF4E1EFF, 0x08FF27FF, 0x061C0708, 0x099114FF
	.word 0x1EFF0208, 0x8804063A, 0x1401081C, 0x3D080991, 0x08099114, 0x0809911F

cutscenescript_8099114:
	.word 0x4B14FF02, byte_809913D, 0x0200043F, 0xFF2714FF, 0x4B07080C, byte_80991E1, 0x1715FF2A, 0x273CFF02
	.word 0x070808FF, 0x0000043F
	.byte 0x00
byte_809913D:
	.byte 0xB5, 0xA8, 0x88, 0x71, 0xF7, 0xED, 0xFA, 0x1, 0x21
	// ...
````

the command for `cs_switch_case_from_chatbox_flags_bit0_to_2_cmd` is `0x3D`. I don't see indication of 8 entries in here.

After dumping:

````C
byte_80990DC:
	cs_lock_player_for_non_npc_dialogue_809e0b0
	cs_nop_80377d0
	cs_set_event_flag byte1=0xFF event16_2=EVENT_1731
	cs_pause byte1=0xFF byte2=0x01
	cs_call_native_with_return_value ptr1=unk_8099165
	cs_pause byte1=0xFF byte2=0x1E
	cs_play_music hword1=0xFFFF
	cs_set_screen_fade byte1=0xFF byte2=0x08 byte3=0x08
	cs_wait_screen_fade
	cs_jump_if_var_equal byte1=0x06 byte2=0xFF destination3=cutscenescript_8099114
	cs_pause byte1=0xFF byte2=0x1E
	cs_run_text_script_from_mem byte1=0x06
	cs_wait_chatbox byte1=0x88
	cs_jump_if_var_equal byte1=0x08 byte2=0x01 destination3=cutscenescript_8099114
	cs_switch_case_from_chatbox_flags_bit0_to_2_8 [
		destination1: cutscenescript_8099114,
		destination5: cutscenescript_8099114,
		destination9: cutscenescript_8099114,
		destination13: cutscenescript_8099114,
		destination17: cutscenescript_8099114,
		destination21: cutscenescript_8099114,
		destination25: cutscenescript_8099114,
		destination29: cutscenescript_8099114,
	]

cutscenescript_8099114:
````

````
enum cs_jump_if_var_equal_cmd // 0x1c
// 0x1c byte1 byte2 destination3
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data byte_80990DC -m

# out
.byte 0x3F, 0x00, 0x06, 0x29, 0xFF, 0x31, 0x17, 0x02, 0xFF, 0x01
.byte 0x4B, 0x65, 0x91, 0x09, 0x08, 0x02, 0xFF, 0x1E, 0x4E, 0xFF
.byte 0xFF, 0x27, 0xFF, 0x08, 0x08, 0x07, 0x1C, 0x06, 0xFF, 0x14
.byte 0x91, 0x09, 0x08, 0x02, 0xFF, 0x1E, 0x3A, 0x06, 0x04, 0x88
.byte 0x1C, 0x08, 0x01, 0x14, 0x91, 0x09, 0x08, 0x3D, 0x14, 0x91
.byte 0x09, 0x08, 0x1F, 0x91, 0x09, 0x08
````

````
.byte 0x3F, 0x00, 0x06, 0x29, 0xFF, 0x31, 0x17, 0x02, 0xFF, 0x01
.byte 0x4B, 0x65, 0x91, 0x09, 0x08, 0x02, 0xFF, 0x1E, 0x4E, 0xFF
.byte 0xFF, 0x27, 0xFF, 0x08, 0x08, 0x07, 0x1C, 0x06, 0xFF, 0x14
.byte 0x91, 0x09, 0x08, 0x02, 0xFF, 0x1E, 0x3A, 0x06, 0x04, 0x88
.byte 0x1C, <u8 0x08>, <u8 0x01>, <ea 0x14, 0x91, 0x09, 0x08>, 0x3D, <ea 0x14, 0x91
.byte 0x09, 0x08>, <ea 0x1F, 0x91, 0x09, 0x08>
````

So there should only be two dests.

We weren't taking advancing to the next ea, just reading the same ea. Since the first one is guaranteed to be valid, we just read it 8 times.

We build OK now. Let's continue with parsing

(commenting out ones that are confirmed done)

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
#cargo run --release --bin dump_script map trace MapScriptOnInitLanHouse_804F1D4 &&
#cargo run --release --bin dump_script map trace MapScriptOnInitLanRoom_804F4F0 &&
#cargo run --release --bin dump_script map trace MapScriptOnInitBathroom_804F934 &&
#cargo run --release --bin dump_script map trace MapScriptOnInitAsterLand_804F998 &&
#cargo run --release --bin dump_script map trace MapScriptOnUpdateLanHouse_804F3F0 &&
cargo run --release --bin dump_script map trace MapScriptOnUpdateLanRoom_804F744 &&
cargo run --release --bin dump_script map trace MapScriptOnUpdateBathroom_804F96E &&
cargo run --release --bin dump_script map trace MapScriptOnUpdateAsterLand_804F9C5
````

2025-12-11 Wk 50 Thu - 02:37 +03:00

````
./asm/asm28_0.s: Assembler messages:
./asm/asm28_0.s:2380: Error: agbasm colonless label `thumb_func_end' does not end with a newline, assuming not a label
make: *** [Makefile:58: rom.o] Error 1

thread 'main' panicked at src/bin/dump_script.rs:145:33:
Failed to cut then mark new label: Update Repo State Error: Failed to run process: "make clean && make -j$(nproc) assets && make -j$(nproc)": Process exited with status code: 2
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

Just gotta move the `thumb_func_end` up and tab it.

2025-12-11 Wk 50 Thu - 02:57 +03:00

````
./asm/asm28_0.s: Assembler messages:
./asm/asm28_0.s:2409: Error: symbol `thumb_local_start' is already defined
make: *** [Makefile:58: rom.o] Error 1
````

I think it keeps removing the tab which is necessary for these `thumb_local_start`, etc. It might also be because in lexing we don't consider whitespace as part of the lexon, and for these it is. We consume all white space after a lexon, and it consumes it here. Not sure of any trivial solution to this right now. It also says `thumb_local_start` is already defined... Might mean it's untabbed somewhere else? It's trivial enough to get OK by tabbing it for now.

2025-12-11 Wk 50 Thu - 03:09 +03:00

The issue repeats even after manual fix.

````diff
diff --git a/asm/asm28_0.s b/asm/asm28_0.s
index fa1a0970..8071a0f0 100644
--- a/asm/asm28_0.s
+++ b/asm/asm28_0.s
@@ -2406,7 +2406,7 @@ cutscenescript_809AD80:
        cs_unlock_player_after_non_npc_dialogue_809e122
        cs_end_for_map_reload_maybe_8037c64

-       thumb_local_start
+thumb_local_start
 sub_809ADA8:
        push {r4-r7,lr}
        bl sub_8136D8C
````

````
[src/drivers/symbols.rs:1129:5] &lexon_replace_rec = DataLexonReplaceRecord {
    substring: "cutscenescript_809AD80:\n\tcs_lock_player_for_non_npc_dialogue_809e0b0\n\tcs_nop_80377d0\n\tcs_set_event_flag byte1=0xFF event16_2=EVENT_1731\n\tcs_wait_screen_fade\n\tcs_pause byte1=0xFF byte2=0x14\n\tcs_decomp_text_archive ptr1=TextScriptCommError873B9E0\n\tcs_run_text_script_not_from_mem byte2=0x0F\n\tcs_wait_chatbox byte1=0x80\n\tcs_pause byte1=0xFF byte2=0x1E\n\tcs_set_screen_fade byte1=0xFF byte2=0x0C byte3=0x08\n\tcs_wait_screen_fade\n\tcs_pause byte1=0xFF byte2=0x1E\n\tcs_call_native_with_return_value ptr1=sub_809ADA8+1\n\tcs_unlock_player_after_non_npc_dialogue_809e122\n\tcs_end_for_map_reload_maybe_8037c64\n\n\t",
    label: "cutscenescript_809AD80:",
    sym_repo_path: "/home/lan/src/cloned/gh/dism-exe/bn6f/asm/asm28_0.s",
}
[src/drivers/symbols.rs:1130:5] &new_content = "cutscenescript_809AD80:\n\tcs_lock_player_for_non_npc_dialogue_809e0b0\n\tcs_nop_80377d0\n\tcs_set_event_flag byte1=0xFF event16_2=EVENT_1731\n\tcs_wait_screen_fade\n\tcs_pause byte1=0xFF byte2=0x14\n\tcs_decomp_text_archive ptr1=TextScriptCommError873B9E0\n\tcs_run_text_script_not_from_mem byte2=0x0F\n\tcs_wait_chatbox byte1=0x80\n\tcs_pause byte1=0xFF byte2=0x1E\n\tcs_set_screen_fade byte1=0xFF byte2=0x0C byte3=0x08\n\tcs_wait_screen_fade\n\tcs_pause byte1=0xFF byte2=0x1E\n\tcs_call_native_with_return_value ptr1=sub_809ADA8+1\n\tcs_unlock_player_after_non_npc_dialogue_809e122\n\tcs_end_for_map_reload_maybe_8037c64\n\n"
````

Note the new content ending with `\n\n` and the substring ending with `\n\n\t`.

We added a check for this `\t` in `replace_repo_content_for_data` so that we preserve it in case when we accumulate the string ends with `\t`.

2025-12-11 Wk 50 Thu - 03:31 +03:00

````
./asm/asm28_0.s: Assembler messages:
./asm/asm28_0.s:3596: Error: agbasm colonless label `bl' does not end with a newline, assuming not a label
make: *** [Makefile:58: rom.o] Error 1
````

````C
loc_809C050:
	.word 0xF839F765, 0xF7657D38, 0xF084F832, 0xF797FEC9, 0x2000FFBD, 0x0000BDF0

cutscenescript_809C068:
	.word 0x2906003F, 0x021731FF, 0x00471EFF, 0x044004FF, 0xE03E04FF, 0x070873B9, 0x02FF0553, 0xFF533EFF
	.word 0xC09D4B01, 0x043A0809, 0xFF2A8004, 0x043F173C, 0x00000000
bl writeCurPETNaviToS2001c04_Unk07_80010c6
	ldrb r0, [r7,#0x14]
````

That is not good. It's cutting at a function `sub_809C01C`.

````C
loc_809C050:
	bl writeCurPETNaviToS2001c04_Unk07_80010c6
	ldrb r0, [r7,#0x14]
	bl SetCurPETNavi
	bl reloadCurNaviBaseStats_8120df0
	bl sub_8033FDC
	mov r0, #0
	pop {r4-r7,pc}
	.balign 4, 0x00
	.byte 0x3F, 0x0, 0x6, 0x29, 0xFF, 0x31, 0x17, 0x2, 0xFF, 0x1E
	.byte 0x47, 0x0, 0xFF, 0x4, 0x40, 0x4, 0xFF, 0x4, 0x3E, 0xE0
	.byte 0xB9, 0x73, 0x8, 0x7, 0x53, 0x5, 0xFF, 0x2, 0xFF, 0x3E
	.byte 0x53, 0xFF, 0x1, 0x4B, 0x9D, 0xC0, 0x9, 0x8, 0x3A, 0x4
	.byte 0x4, 0x80, 0x2A, 0xFF, 0x3C, 0x17, 0x3F, 0x4, 0x0, 0x0
	.byte 0x0, 0x0
	thumb_func_end sub_809C01C

	thumb_local_start
sub_809C09C:
````

We can add the label `cutscenescript_809C068` ourselves right after `.balign 4, 0x00`.

2025-12-11 Wk 50 Thu - 03:43 +03:00

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
#cargo run --release --bin dump_script map trace MapScriptOnInitLanHouse_804F1D4 &&
#cargo run --release --bin dump_script map trace MapScriptOnInitLanRoom_804F4F0 &&
#cargo run --release --bin dump_script map trace MapScriptOnInitBathroom_804F934 &&
#cargo run --release --bin dump_script map trace MapScriptOnInitAsterLand_804F998 &&
#cargo run --release --bin dump_script map trace MapScriptOnUpdateLanHouse_804F3F0 &&
#cargo run --release --bin dump_script map trace MapScriptOnUpdateLanRoom_804F744 &&
#cargo run --release --bin dump_script map trace MapScriptOnUpdateBathroom_804F96E &&
#cargo run --release --bin dump_script map trace MapScriptOnUpdateAsterLand_804F9C5
````

 > 
 > It's also in the map script block `MapScriptOnInitCentralTown_804EA28` to `MapScriptOnUpdateAsterLand_804F9C5` inclusive.

Nothing was missed after tracing. Between these two labels is all scripts.

For npc scripts, the first bytes encountered are in `NPCScriptsForLanRoom_8051B5C`: `dword_8051B64` and then `NPCScriptsForAsterland_8051FB0`.

Let's run against the NPCScript block again as a range:

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script npc range NPCScriptsForCentralTown_804F9D8 npc_script_8052227
````

CentralTown related scripts should be good now.
