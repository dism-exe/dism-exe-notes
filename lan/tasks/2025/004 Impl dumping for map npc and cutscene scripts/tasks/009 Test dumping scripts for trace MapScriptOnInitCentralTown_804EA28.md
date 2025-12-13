---
parent: '[[004 Impl dumping for map npc and cutscene scripts]]'
spawned_by: '[[006 Dump scripts via script tracing]]'
context_type: task
status: done
---

Parent: [004 Impl dumping for map npc and cutscene scripts](../004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts.md)

Spawned by: [006 Dump scripts via script tracing](006%20Dump%20scripts%20via%20script%20tracing.md)

Spawned in: [<a name="spawn-task-bf8aa7" />^spawn-task-bf8aa7](006%20Dump%20scripts%20via%20script%20tracing.md#spawn-task-bf8aa7)

# 1 Journal

2025-11-09 Wk 45 Sun - 06:13 +03:00

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin dump_script map trace MapScriptOnInitCentralTown_804EA28

# out (error, relevant)
./maps/CentralTown/data.s: Assembler messages:
./maps/CentralTown/data.s:246: Error: Parameter named `byte1' does not exist for macro `ms_init_estruct200a6a0'
./maps/CentralTown/data.s:246: Error: Parameter named `event16_2' does not exist for macro `ms_init_estruct200a6a0'
./maps/CentralTown/data.s:246: Error: junk at end of line, first unrecognized character is `m'
make: *** [Makefile:58: rom.o] Error 1
````

````diff
+++ b/maps/CentralTown/data.s
@@ -240,8 +240,10 @@ byte_804EA1C::
        .byte 0xB, 0xB, 0xB, 0xB, 0xB
 byte_804EA21::
   .byte 0x63, 0x4, 0x4, 0x4, 0x4, 0x0, 0x0
-MapScriptOnInitCentralTown_804EA28:: // MapScript
-  ms_set_event_flag byte1=0xFF event16_2=0x16D0
+MapScriptOnInitCentralTown_804EA28::
+       ms_set_event_flag byte1=0xFF event16_2=EVENT_16D0
+       ms_jump_if_flag_clear byte1=0xFF event16_2=EVENT_A9B destination4=byte_804EA41
+       ms_init_eStruct200a6a0 ptr1=sub_804C700+1 ptr5=sub_804C71C+1 word9=0x00000000ms_set_event_flag byte1=0xFF event16_2=0x16D0
   ms_jump_if_flag_clear byte1=0xFF event16_2=0x0A9B destination4=byte_804EA41
   ms_init_eStruct200a6a0 ptr1=sub_804C700+1 ptr5=sub_804C71C+1 word9=0x00000000
 byte_804EA41:: // MapScript
````

We probably need to add macros to our list of exceptions for `encountered_significant_new_content` in `fn get_data_lexon_replace_record`. This was already dumped and it's likely tripping on it expecting only data directives. Luckily, we added support for inline macros!

2025-11-09 Wk 45 Sun - 06:25 +03:00

````diff
+++ b/maps/CentralTown/data.s
@@ -240,11 +240,10 @@ byte_804EA1C::
        .byte 0xB, 0xB, 0xB, 0xB, 0xB
 byte_804EA21::
   .byte 0x63, 0x4, 0x4, 0x4, 0x4, 0x0, 0x0
-MapScriptOnInitCentralTown_804EA28:: // MapScript
-  ms_set_event_flag byte1=0xFF event16_2=0x16D0
-  ms_jump_if_flag_clear byte1=0xFF event16_2=0x0A9B destination4=byte_804EA41
-  ms_init_eStruct200a6a0 ptr1=sub_804C700+1 ptr5=sub_804C71C+1 word9=0x00000000
-byte_804EA41:: // MapScript
+MapScriptOnInitCentralTown_804EA28::
+       ms_set_event_flag byte1=0xFF event16_2=EVENT_16D0
+       ms_jump_if_flag_clear byte1=0xFF event16_2=EVENT_A9B destination4=byte_804EA41
+       ms_init_eStruct200a6a0 ptr1=sub_804C700+1 ptr5=sub_804C71C+1 word9=0x00000000byte_804EA41:: // MapScript
   .byte 0x5, 0xFF, 0x3A, 0x0, 0x52, 0xEA, 0x4, 0x8, 0x26, 0xE9, 0xBB
        .byte 0x9, 0x8, 0x0, 0x0, 0x0, 0x0, 0x2, 0x0, 0xF, 0x88, 0xEA
        .byte 0x4, 0x8, 0x2, 0x10, 0x1F
````

Need to add a new line after the content, or two!

````
thread 'main' panicked at src/bin/dump_script.rs:239:33:
Failed to dump: Unexpected invariant error: EaNotInScriptLabels(134855657)
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

That's `0x809bbe9`/ `unk_809BBE9`.

2025-11-09 Wk 45 Sun - 06:39 +03:00

In `encoding::dump` we haven't yet handled the new distinction of script pointers. It assumes everything collapses under `pointers`, so this might be why.

Added also handling for compressed pointers in dumping.

2025-11-09 Wk 45 Sun - 06:55 +03:00

````
./maps/CentralTown/data.s: Assembler messages:
./maps/CentralTown/data.s:250: Error: Parameter named `word5' does not exist for macro `ms_start_cutscene'
./maps/CentralTown/data.s:250: Error: Missing value for required parameter `ptr5' of macro `ms_start_cutscene'
./maps/CentralTown/data.s:250: Error: bad expression
./maps/CentralTown/data.s:250: Error: junk at end of line, first unrecognized character is `w'
make: *** [Makefile:58: rom.o] Error 1
````

````C
	enum ms_start_cutscene_cmd // 0x26
// 0x26 ptr1 wort5
// start a cutscene
// ptr1 - cutscene script to start
// word5 - cutscene parameter
	.macro ms_start_cutscene ptr1:req ptr5:req
	.byte ms_start_cutscene_cmd
	.word \ptr1
	.word \word5
	.endm
````

Oops. Forgot to change `ptr5` in the macro param list. Also `word5`, not `wort5`!

2025-11-09 Wk 45 Sun - 07:04 +03:00

````
./asm/asm28_0.s: Assembler messages:
./asm/asm28_0.s:519: Error: Parameter named `byte2' does not exist for macro `cs_offset_ow_player_fixed_anim_select_8037dac'
./asm/asm28_0.s:519: Error: Parameter named `byte3' does not exist for macro `cs_offset_ow_player_fixed_anim_select_8037dac'
./asm/asm28_0.s:519: Error: bad expression
./asm/asm28_0.s:519: Error: junk at end of line, first unrecognized character is `b'
./asm/asm28_0.s:519: Error: bad expression
./asm/asm28_0.s:519: Error: junk at end of line, first unrecognized character is `b'
make: *** [Makefile:58: rom.o] Error 1
````

2025-11-09 Wk 45 Sun - 07:10 +03:00

Had to make sure to trim instructions with no parameters not to add an extra space.

````
// 0x47 0x1 byte2 byte3
	subenum cs_offset_ow_player_fixed_anim_select_8037dac_subcmd // 0x1
	.macro cs_offset_ow_player_fixed_anim_select_8037dac
	.byte cs_write_or_offset_ow_player_fixed_anim_select_8037dac_cmd
	.byte cs_offset_ow_player_fixed_anim_select_8037dac_subcmd
	.byte \byte2
	.byte \byte3
	.endm
````

It's not given a parameter list.

2025-11-09 Wk 45 Sun - 07:22 +03:00

````
./data/dat21.s: Assembler messages:
./data/dat21.s:264: Error: Parameter named `byte1' does not exist for macro `cs_wait_var_equal'
./data/dat21.s:264: Error: Parameter named `byte2' does not exist for macro `cs_wait_var_equal'
````

````
	enum cs_wait_var_equal_cmd // 0x09
// 0x09 byte1 byte2
// wait for cutscene variable to be equal to byte2
// byte1 - cutscene variable to read from
// byte2 - value to compare cutscene variable with
	.macro cs_wait_var_equal
	.byte cs_wait_var_equal_cmd byte1:req byte2:req
	.byte \byte1
	.byte \byte2
	.endm
````

And this time the parameter list is one line down!

2025-11-09 Wk 45 Sun - 07:45 +03:00

There is a build failure with just a checksum difference. But which script? We need to trace the order of scripts being dumped, since we ensure we get OK after each individual dump.

````
Dumping Identifier { s: "cutscenescript_8081D0C" }
bn6f.gba: FAILED
sha1sum: WARNING: 1 computed checksum did NOT match
````

2025-11-09 Wk 45 Sun - 07:59 +03:00

````rust
InstSchema {
	name: "cs_disable_cutscene_skip_script".to_owned(),
	cmd: 0x14,
	opt_subcmd: Some(SubCmd::U8(0x00)),
	fields: vec![

	],
},
````

````C
// helper macro
// 0x14 ptr1=0x0
// clear the script that is run when a cutscene is skipped
// effectively disabling cutscene skip
	.macro cs_disable_cutscene_skip_script
	.byte cs_set_cutscene_skip_script_cmd
	.word NULL
	.endm
````

I modeled it with a U8 Fallback, but it's a whole `.word NULL`.  We can `Unused24`. It's a bit of a hack but it should not appear in the command.

2025-11-09 Wk 45 Sun - 08:21 +03:00

````
Dumping Identifier { s: "byte_8099D23" }
./asm/asm28_0.s: Assembler messages:
./asm/asm28_0.s:548: Error: agbasm colonless label `thumb_func_end' does not end with a newline, assuming not a label
make: *** [Makefile:58: rom.o] Error 1
````

````
 byte_8099D23:
-       .byte 0x4B
-       .word sub_8099DAC+1
-       .byte 0x2A, 0xFF, 0x15, 0x17, 0x2A, 0xFF, 0xC, 0x1, 0x4A, 0x5
-       .byte 0x4A, 0x3, 0x2, 0xFF, 0x3C, 0x27, 0xFF, 0x8, 0x8, 0x7
-       .byte 0x3F, 0x18, 0x3F, 0x4, 0x0, 0x0, 0x0, 0x0
-       thumb_func_end RunLMessageTextScript
+       cs_call_native_with_return_value ptr1=sub_8099DAC+1
````

We should fix this `thumb_func_end`

````
Dumping Identifier { s: "cutscenescript_8087813" }
./data/dat22.s: Assembler messages:
./data/dat22.s:320: Error: Missing value for required parameter `hword1' of macro `cs_add_request_range'
./data/dat22.s:320: Error: Missing value for required parameter `byte3' of macro `cs_add_request_range'
./data/dat22.s:323: Error: Missing value for required parameter `hword1' of macro `cs_add_request_range'
./data/dat22.s:323: Error: Missing value for required parameter `byte3' of macro `cs_add_request_range'
````

2025-11-09 Wk 45 Sun - 09:03 +03:00

````rust
InstSchema {
	name: "cs_add_request_range".to_owned(),
	cmd: 0x78,
	opt_subcmd: None,
	fields: vec![

	],
},
````

They shouldn't be missing parameters. Need to fix this for cs `0x78` and ms `0x44`

````
36 new_inst: Inst { name: "cs_make_ow_player_visible", cmd: 63, opt_subcmd: Some(U8(48)), fields: [] }
38 new_inst: Inst { name: "cs_add_request_range", cmd: 120, opt_subcmd: None, fields: [U16("hword1", 7008), U8("byte3", 1)] }

thread 'main' panicked at src/bin/dump_script.rs:104:9:
Failed to read cutscenescript instructions at Identifier { s: "cutscenescript_8087813" }: Inst InstSchema { name: "cs_add_request_range", cmd: 120, opt_subcmd: None, fields: [U16("hword1"), U8("byte3")] } overflows buffer size 44 at position 42
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

So `end_cutscenescript_808783F` was due to this read error. Let's remove it.

2025-11-09 Wk 45 Sun - 09:47 +03:00

````
Dumping Identifier { s: "cutscenescript_808B720" }
./data/dat23.s: Assembler messages:
./data/dat23.s:725: Error: Missing value for required parameter `byte1' of macro `cs_warp_cmd_8038040_2'
````

````rust
InstSchema {
	name: "cs_warp_cmd_8038040_2".to_owned(),
	cmd: 0x4C,
	opt_subcmd: Some(SubCmd::NotMask(0x60)),
	fields: vec![
		FieldSchema::U8("byte2".to_owned()),
		FieldSchema::Ptr("ptr3".to_owned()),
	],
},
````

This `NotMask` should also be given a name. `byte1`.

2025-11-09 Wk 45 Sun - 10:15 +03:00

It also takes a slot where on reading it records the actual subcmd value, and it's used in dumping as a parameter.

2025-11-09 Wk 45 Sun - 10:43 +03:00

````
Dumping Identifier { s: "cutscenescript_808DB30" }
tools/binutils/bin/arm-none-eabi-ld: rom.o: in function `cutscenescript_808DB30':
/home/lan/src/cloned/gh/dism-exe/bn6f/./asm/asm24.s:1331: undefined reference to `cs_init_eStruct200a6a0_cmd'
tools/binutils/bin/arm-none-eabi-ld: /home/lan/src/cloned/gh/dism-exe/bn6f/./asm/asm24.s:1331: undefined reference to `cs_init_eStruct200a6a0_cmd'
````

````
// shared command
	enum cs_init_eStruct201a6a0_cmd // 0x58
// 0x38/0x58 ptr1 ptr5 word9
// call Initialize_eStruct200a6a0 with r0=ptr1, r1=ptr5, r2=ptr9
	.macro cs_init_eStruct200a6a0 ptr1:req ptr5:req word9:req
	.byte cs_init_eStruct200a6a0_cmd
	.word \ptr1
	.word \ptr5
	.word \word9
	.endm
````

Seems like that enum got accidentally incremented to `201a6a0`.

2025-11-09 Wk 45 Sun - 11:39 +03:00

````
Dumping Identifier { s: "byte_809094A" }
./data/dat25.s: Assembler messages:
./data/dat25.s:303: Error: Parameter named `byte1' does not exist for macro `cs_take_item'
````

` cutscenescript_8081DA1` has 3 `.byte 0x0` that look like aligns. They should be cut out since they're giving fake commands after a jump.

`cutscenescript_808DC58` looks suspicious also, cut at the jump.

````
 cutscenescript_808DC58:
-       .word 0x1540003C, byte_808DBF9, 0x0057D450, 0x010C0802, 0x00400400, 0x00000100, 0x78040000, 0x00000000
+       cs_set_chatbox_flags byte2=0x40
+       cs_jump destination1=byte_808DBF9
+       cs_sound_cmd_803810e byte1=0xD4 byte2=0x57
````

````
 cutscenescript_8090998:
-       .word 0x3740003C, off_80348FC, 0xFF18FF27, 0x01FF0207, 0x080CFF27, 0x094A1507, 0x00000809

+       cs_jump destination1=byte_809094A
+       cs_end_for_map_reload_maybe_8037c64
+       cs_end_for_map_reload_maybe_8037c64
````

2025-11-09 Wk 45 Sun - 11:49 +03:00

````
	subenum cs_take_item_subcmd // 0x1
// 0x35/0x52 byte1 byte2 byte3
// take items
// byte2 - item to take
// byte3 - quantity of item
	.macro cs_take_item byte2:req byte3:req
	.byte cs_give_or_take_item_cmd
	.byte cs_take_item_subcmd
	.byte \byte2
	.byte \byte3
	.endm
````

2025-11-09 Wk 45 Sun - 14:21 +03:00

````
Dumping Identifier { s: "mapscript_804EE3D" }
./maps/CentralTown/data.s: Assembler messages:
./maps/CentralTown/data.s:490: Error: symbol `mapscript_804EE62' is already defined
./maps/CentralTown/data.s:497: Error: symbol `mapscript_804EE87' is already defined
./maps/CentralTown/data.s:504: Error: symbol `mapscript_804EEAC' is already defined
````

It seems to have dumped twice at ` mapscript_804EE3D`...

2025-11-10 Wk 46 Mon - 02:34 +03:00

Probably due to it being encountered multiple times and duplicated in `Vec<ScriptTraceRecord>` as a result. Ensured that the entries are unique before dumping.

````C
cutscenescript_8081DA1:
	.word 0x1540003C, 0x08081D82
end_cutscenescript_8081DA9:
  .align 2, 0
byte_8081DAC::
	.byte 0x0, 0x80, 0xFF, 0x0, 0x1, 0x0, 0x0, 0x8
````

Seems I can't make that `.align 4, 0` or the build checksum fails, even though `byte_8081DAC` is supposed to be divisible by 4. But it is originally adding three zero bytes. Oh it seems $2^n$ for `.align n, 0` and $n$ for `.balign n, 0`. See [arm docs on align](https://developer.arm.com/documentation/dui0473/m/directives-reference/align)

Ensure to keep the lexer up to date with our manual fixes before commiting its state:

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin bn_repo_editor lexer_once "/home/lan/src/cloned/gh/dism-exe/bn6f/data/dat21.s"
cargo run --release --bin bn_repo_editor lexer_once "/home/lan/src/cloned/gh/dism-exe/bn6f/data/dat24.s"
cargo run --release --bin bn_repo_editor lexer_once "/home/lan/src/cloned/gh/dism-exe/bn6f/data/dat25.s"
````

2025-11-10 Wk 46 Mon - 03:49 +03:00

````
Dumping Identifier { s: "byte_809BD8E" }
./asm/asm28_0.s: Assembler messages:
./asm/asm28_0.s:3312: Error: agbasm colonless label `thumb_func_end' does not end with a newline, assuming not a label
````

````
thumb_func_end sub_809BA14
````

`byte_809BD8E` ends with two zero bytes that should be taken out.

````
byte_809BD8E
````

2025-11-11 Wk 46 Tue - 04:07 +03:00

`byte_809BD8E` was causing issue with the `thumb_local_start` after it being untabbed. Adding the end cutscene at the alignment.

2025-11-11 Wk 46 Tue - 04:42 +03:00

It's done!

Putting some end touches like with aligns

````sh
cargo run --release --bin bn_repo_editor lexer_once "/home/lan/src/cloned/gh/dism-exe/bn6f/asm/asm28_0.s"
````

2025-11-11 Wk 46 Tue - 04:54 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
git commit -m "dump scripts tracing MapScriptOnInitCentralTown_804EA28"

# out
[master 297c7516] dump scripts tracing MapScriptOnInitCentralTown_804EA28
 8 files changed, 1134 insertions(+), 347 deletions(-)
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
git commit -m "added script dumping impl"

# out
[main 9b5c7d7] added script dumping impl
 7 files changed, 339 insertions(+), 213 deletions(-)
````

OK!
