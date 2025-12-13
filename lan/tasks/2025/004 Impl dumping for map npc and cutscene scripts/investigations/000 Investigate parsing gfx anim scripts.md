---
parent: '[[004 Impl dumping for map npc and cutscene scripts]]'
spawned_by: '[[010 Trace Dump MapScriptOnUpdateCentralTown_804EEF7]]'
context_type: investigation
status: done
---

Parent: [004 Impl dumping for map npc and cutscene scripts](../004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts.md)

Spawned by: [010 Trace Dump MapScriptOnUpdateCentralTown_804EEF7](../tasks/010%20Trace%20Dump%20MapScriptOnUpdateCentralTown_804EEF7.md)

Spawned in: [<a name="spawn-invst-b48fb7" />^spawn-invst-b48fb7](../tasks/010%20Trace%20Dump%20MapScriptOnUpdateCentralTown_804EEF7.md#spawn-invst-b48fb7)

# 1 Journal

2025-11-11 Wk 46 Tue - 11:48 +03:00

A full pass added a bunch of spaces for what I assume was internal dest pointers. But no dumping of any gfx anim scripts...

Let's try tracing just from `cutscenescript_809495A` to discover why. That one should immediately load some gfx anim scripts.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script cutscene trace cutscenescript_809495A
````

Also make sure to parse the right script. `cutscene` not `map`.

2025-11-11 Wk 46 Tue - 12:02 +03:00

Okay we didn't add the commands to `script_ptr_commands` in `fn process_script_labels`.

````
thread 'main' panicked at src/bin/dump_script.rs:298:17:
Expected last pointer to be 0xFF: off_80348FC
````

Oh it's `0xFFFFFFFF`

````
off_80348FC:
	.word dword_8034908
	.word dword_8034920
	.word 0xFFFFFFFF
````

2025-11-11 Wk 46 Tue - 12:10 +03:00

````
Tracing gfx_anim_script Identifier { s: "dword_8034908" }

thread 'main' panicked at src/bin/dump_script.rs:200:25:
No instructions read, and yet we fail to read gfx_anim_script instructions at Identifier { s: "dword_8034908" }: Failed to route the command: No instruction schema found for position 0 and byte 0xC. Parsed Instructions: []
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

Added macro `gfx_anim_manual_pal_transform` to the rust schema and corrected the cmd bytes for the rest in there.

2025-11-11 Wk 46 Tue - 12:21 +03:00

````
Tracing gfx_anim_script Identifier { s: "dword_8034908" }

thread 'main' panicked at src/bin/dump_script.rs:250:21:
Failed to read gfx_anim_script instructions at Identifier { s: "dword_8034908" }: Invalid Ea processed in byte 0 for Inst InstSchema { name: "gfx_anim_manual_pal_transform", cmd: 12, opt_subcmd: None, fields: [Ptr("transform_type"), Ptr("dest"), U8("index"), U8("num_pals")] } and Field Ptr("transform_type"): Effective address 1610612736 is invalid.
````

Oh this is just a U32.

````
Tracing gfx_anim_script Identifier { s: "dword_8034908" }

thread 'main' panicked at src/bin/dump_script.rs:250:21:
Failed to read gfx_anim_script instructions at Identifier { s: "dword_8034908" }: Invalid Ea processed in byte 0 for Inst InstSchema { name: "gfx_anim_manual_pal_transform", cmd: 12, opt_subcmd: None, fields: [U32("transform_type"), Ptr("dest"), U8("index"), U8("num_pals")] } and Field Ptr("dest"): Effective address 201523227 is invalid.
````

even `dest`? Let's rename it to `word5`.

From the commands at `off_8001C24` for gfx anim, `sub_8002310` is the command for `0xC`, passing to `sub_8002378`. And there's no evidence of the data being used as a pointer.

2025-11-11 Wk 46 Tue - 12:34 +03:00

````
Tracing gfx_anim_script Identifier { s: "dword_8034908" }
0 new_inst: Inst { name: "gfx_anim_manual_pal_transform", cmd: 12, opt_subcmd: None, fields: [U32("transform_type", 1610612736), U32("word5", 201523227), U8("index", 15), U8("num_pals", 14)] }

thread 'main' panicked at src/bin/dump_script.rs:230:25:
No terminating command before failing to read gfx_anim_script instructions at Identifier { s: "dword_8034908" }: Failed to route the command: No instruction schema found for position 11 and byte 0xFF. Parsed Instructions: [Inst { name: "gfx_anim_manual_pal_transform", cmd: 12, opt_subcmd: None, fields: [U32("transform_type", 1610612736), U32("word5", 201523227), U8("index", 15), U8("num_pals", 14)] }]
````

Okay, we should add a termination at a byte `0xFF` and for `gfx_anim_script`.

Let's add a command for it. For this we need to add `Magic` to the spec for hardcoded values

````C
  .macro gfx_anim_end_ff
  .word 0xFFFFFFFF
  .endm
````

2025-11-11 Wk 46 Tue - 12:59 +03:00

````
Tracing gfx_anim_script Identifier { s: "dword_8034908" }
0 new_inst: Inst { name: "gfx_anim_manual_pal_transform", cmd: 12, opt_subcmd: None, fields: [U32("transform_type", 1610612736), U32("word5", 201523227), U8("index", 15), U8("num_pals", 14)] }

thread 'main' panicked at src/bin/dump_script.rs:250:21:
Failed to read gfx_anim_script instructions at Identifier { s: "dword_8034908" }: Expected magic value 16777215 but got 16912 for inst InstSchema { name: "gfx_anim_end_ff", cmd: 255, opt_subcmd: None, fields: [Magic24("magic24_1", 16777215)] }
````

Wait this is wrong. The `0xFFFFFFFF` was just for the array of gfx anim scripts. We should reverse that command.

````
dword_8034908:
	.word 0xC
	.word iPalette3001B60
	.word 0xFF0E0F0C
	.word 0x80004210
	.word 0x1
	.word 0x0
````

Instead of bytes it's a whole word `0xC`...  We can add magic24 for this routing.

Jumptable `off_8001C24` $\to$ `LoadGFXAnim` loads a byte. So why is it a word in here? In `ProcessGFXAnims` and `GfxAnimState.inc` it's treated as a u32.

2025-11-11 Wk 46 Tue - 13:26 +03:00

````
0 new_inst: Inst { name: "gfx_anim_manual_pal_transform", cmd: 12, opt_subcmd: None, fields: [Magic24("magic24_1", 0), Ptr("transform_type", IwRam(IwramEa { ea: 50338656 })), U32("word5", 4279111436), U8("index", 16), U8("num_pals", 66)] }

thread 'main' panicked at src/bin/dump_script.rs:250:21:
Failed to read gfx_anim_script instructions at Identifier { s: "dword_8034908" }: Invalid Ea processed in byte 14 for Inst InstSchema { name: "gfx_anim_pal_copy", cmd: 0, opt_subcmd: None, fields: [Ptr("dest"), U32("size"), U8("index")] } and Field Ptr("dest"): Effective address 384 is invalid.
````

This is the data command `0`. It's a word, so we can treat it a subcmd `0x0 0x0` to treat the original `gfx_anim_pal_copy (0x0)` as fallback.

But that too would be a word `0x0`...

Let's add special handling for this, with a script generic macro. `end_script_0u32`.

2025-11-11 Wk 46 Tue - 13:49 +03:00

I added the special handling but this isn't where it's failing.

It's processing

````
.byte 0x00, 0x80
.word 0x1
.word 0x0
````

So it's expecting

````
.byte 0x00
.byte 0x80, 0x01, 0x00, 0x00 // 0X00000180
.byte 0x00, 0x00, 0x00, 0x00
.byte 0x00
````

384 is `0x180`

`sub_8001C44` loads the size in `Param1`

`GFXAnimData` has `Command` after `Param0` and `Param1`...

`sub_80353DA` loads data with `LoadGFXAnims` which expects a `NULLStop<T>` yet `off_80353FC` is terminated with `0xFFFFFF`

2025-11-11 Wk 46 Tue - 14:45 +03:00

`dword_8034908` $\to$ `InternetLoadBGAnimJumptable` $\to$  `LoadBGAnimForMapGroup`

Those are callable! Oh wait, there should be a label at the end of `InternetLoadBGAnimJumptable` before `dword_8034908`

`CutsceneCommandJumptable` $\to$ `MapScriptCutsceneCmd_load_gfx_anims` also just calls `LoadGFXAnims`

````C
// in fn LoadGFXAnims
cmp r0, #NULL
blt .done
````

It was actually comparing with less than 0, which -1 is, so it's wrong to say it's `NullStop`.

2025-11-11 Wk 46 Tue - 17:01 +03:00

It seems like this should be just a struct instead of a script, but lucky chose it this way. Maybe because of the variable parameters. The command is not at byte 0.

We'll make a specific `read` just for gfx anim script since the cmd routing is special.

2025-11-13 Wk 46 Thu - 03:33 +03:00

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script gfx_anim trace dword_8034908
````

This can parse the first 12-byte instruction but then it fails so far.

````
Tracing gfx_anim_script Identifier { s: "dword_8034908" }
0 24 []
12 24 [Inst { name: "gfx_anim_manual_pal_transform", cmd: 12, opt_subcmd: None, fields: [U32("transform_type", 12), Ptr("ptr5", IwRam(IwramEa { ea: 50338656 })), U8("index", 15), U8("num_pals", 14)] }]

thread 'main' panicked at src/bin/dump_script.rs:257:21:
Failed to read gfx_anim_script instructions at Identifier { s: "dword_8034908" }: Other error: Invalid Ea processed in byte 12 for Inst InstSchema { name: "gfx_anim_pal_copy", cmd: 0, opt_subcmd: None, fields: [Ptr("dest"), U32("size"), U8("index")] } and Field Ptr("dest"): Effective address 2147500560 is invalid.
````

````
dword_8034908:
	// inst 0
	.word 0xC // transform_type
	.word iPalette3001B60 // ptr5
	.byte 0x0C, 0x0F, 0x0E,     0xFF
	//    cmd   idx   num_pals  default
	
	.word 0x80004210
	.word 0x1
	.word 0x0
````

2025-11-13 Wk 46 Thu - 04:03 +03:00

So this might be data:

````
	.word 0x80004210, 0x1
	//    ptr         delay
	.word 0x0
	//    end
````

But `0x80004210` is not a valid pointer, so that can't be `gfx_anim_data`

````
	.word 0x80004210
	.word 0x1
	.byte 0x0, 0x0, 0x0,     0x0
	//    cmd  idx  num_pals 

````

2025-11-13 Wk 46 Thu - 04:39 +03:00

Added magic to the schema instructions so that we ensure a read is 0xFF when it should be for unused fields. For example:

````rust
        InstSchema {
            name: "gfx_anim_play_sound".to_owned(),
            cmd: 0x10,
            opt_subcmd: None,
            fields: vec![
                FieldSchema::Magic32("magic32_0".to_owned(), 0xFFFFFFFF),
                FieldSchema::Magic32("magic32_4".to_owned(), 0xFFFFFFFF),
                FieldSchema::U8("index".to_owned()),
                FieldSchema::Magic8("magic8_10".to_owned(), 0xFF),
                FieldSchema::Magic8("magic8_11".to_owned(), 0xFF),
            ],
        },
````

This is also why lucky was guessing values `FF`.

The `0x80004210` might just not be part of an anim gfx script. When that script is processed, it only reads one command. I need another example to test on that uses the data commands after the start command.

Lucky hinted with this:

````
// in include/bytecode/gfx_anim_script.inc
	// gfx_anim_pal_copy dest=0x3001a20, size=0x20, index=1
	// gfx_anim_data data=0x8594ad0, delay=6
	// ...
	// gfx_anim_end
	// gfx_anim_4bit_tile_copy gfx_src=dword_8617488, gfx_dest=0x6008040, index=0, num_tiles=36, buffer_index=8
	// gfx_anim_manual_pal_transform transform_type=0xc, dest=0x3001b60, index=0xf, num_pals=0xe
	// gfx_anim_8bit_tile_copy gfx_src=0x850d034, gfx_dest=0x60079c0, index=0x2, num_tiles=15, buffer_index=13
````

But I am not sure where this example is from.

Perhaps `byte_80662B8` by searching `0x8594ad0`:

````
byte_80662B8::
	.word 0x3001a20
	.word 0x20
	.word 0xffff0100
	.word 0x8594ad0
	.word 0x6
	.word 0x8594af0
	.word 0x6
	.word 0x8594b10
	.word 0x6
	.word 0x8594b30
	.word 0x6
	.word 0x1
````

It is referred to by `off_806AB54` which is `-1i32` terminated.

One thing to notice of the pointers in `off_806AB54` is that they're all terminated with `.word 0x1`.

`off_806AB54` $\to$ `off_806AABC` $\to$ `PavilionComp_LoadGFXAnims` which processes them via `LoadGFXAnims` after what seems to be like indexing by map number.

2025-11-13 Wk 46 Thu - 05:04 +03:00

````
byte_80662B8::
	.word 0x3001a20
	.word 0x20
	.byte 0x00, 0x01, 0xff, 0xff
	//    cmd   idx   #pals def2
	.word 0x8594ad0
	.word 0x6
	.word 0x8594af0
	.word 0x6
	.word 0x8594b10
	.word 0x6
	.word 0x8594b30
	.word 0x6
	.word 0x1
````

`cmd00` (`sub_8001C44`) further processes `ParamNext`, which is `0x8594ad0`, and delay (`0x6`) was already processed by `LoadGFXAnim`.

That's all that `LoadGFXAnim` processes here. There remains

````
	.word 0x8594af0
	.word 0x6
	.word 0x8594b10
	.word 0x6
	.word 0x8594b30
	.word 0x6
	.word 0x1
````

So how is it processed?

`oGFXAnimState_Command` is further processed in `ProcessGFXAnims` which is called by `main_`.

`oGFXAnimState_CommandPos` holds a pointer to the data just after the starter 12 bytes:

````
	.word 0x8594ad0
	.word 0x6
	.word 0x8594af0
	.word 0x6
	.word 0x8594b10
	.word 0x6
	.word 0x8594b30
	.word 0x6
	.word 0x1
````

`LoadGFXAnim` only processes the first one.

2025-11-13 Wk 46 Thu - 05:28 +03:00

`byte_8001C08` is indexed by `ProcessGFXAnims` by `oGFXAnimState_Command`, but it's always `0x8`. Maybe this corresponds to how many bytes were already processed? `0x8` would be the first 2 words.

Like `oGFXAnimState_CommandPos`, `oGFXAnimState_LoopAddress` is by default set to the start of the (data, delay) array. a `0x2` data command can override this.

Encountering a data command `0x1`  undoes skipping the first 8 bytes, since it will load from where `oGFXAnimState_LoopAddress` is set.

So this is why `0x1` can be treated as a return to the beginning of the array! Since there is no `0x0` in our example, this animation goes on forever.

Then `ProcessGFXAnims` will call the commands from `off_8001C24` on the same start defined command.

Correcting

````diff
-tools/doc_scripts/replacesig.sh "LoadGFXAnims" "(gfx_anim_data_arr: * NullStop<[GFXAnimData]>) -> ()"
+tools/doc_scripts/replacesig.sh "LoadGFXAnims" "(gfx_anim_data_arr: * FFStop32<[GFXAnimScript]>) -> ()"
````

````diff
-tools/doc_scripts/replacesig.sh "LoadGFXAnim" "(gfx_anim_data: * GFXAnimData) -> ()"
+tools/doc_scripts/replacesig.sh "LoadGFXAnim" "(script: * GFXAnimScript) -> ()"
````

2025-11-13 Wk 46 Thu - 06:39 +03:00

````
dword_8034908:
	// inst 0
	.word 0xC // transform_type
	.word iPalette3001B60 // ptr5
	.byte 0x0C, 0x0F, 0x0E,     0xFF
	//    cmd   idx   num_pals  default
	
	.word 0x80004210
	.word 0x1
	.word 0x0
````

Still what explains this?

It's a `0xC` command, so `sub_8002310` is called and processes `0x80004210` . `LoadGFXAnim` had already processed the word after it for dalay `0x1`.

````C
// in fn sub_8002310
ldr r1, [r0,#oGFXAnimData_ParamNext - oGFXAnimData_ParamNext]
lsl r1, r1, #1
lsr r1, r1, #1
````

It does a processing to it that removes most significant u32 bit: `0x8000000`

`r0` corresponds here to `0xC` the transform type, `r2` to `num_pals`,  `r3` to the index, and `r4` to `ptr5` dest.

2025-11-13 Wk 46 Thu - 06:53 +03:00

Anyway it seems we need a command for data that is non-pointer.

Maybe I'm wrong. I assumed those are pointers because of values like `0x8594ad0`, but I have not seen any valid pointer there.

But cmd 0x00 (`sub_8001C44`)  passes the parameter as a pointer to `QueueEightWordAlignedGFXTransfer` where it is later processed via  `ProcessGFXTransferQueue` which uses `memory_80009CC` to load it via some DMA channel, in this case `DMA3SourceAddress`

So for cmd 00 then we *do* expect a pointer, even if we have not marked it yet.

* cmd 0x04 (`sub_8001C94`) also expects a pointer for `ParamNext`.
* cmd 0x08 (`sub_8001C52`) expects an index, so non-pointer.
* cmd 0x0C (`sub_8002310`) which we started with expects a param.
* cmd 0x10 (`sub_800232A`) expects a sound index or FFs,
* cmd 0x14 (`sub_8002338`) expects an event flag
* cmd 0x18 (`sub_8001CFC`) expects a pointer

So the only ones that expect a pointer are commands `0x00`, `0x04`, and `0x18`.

The ones that do not are `0x08, 0x0C, 0x10, 0x14`

2025-11-13 Wk 46 Thu - 07:31 +03:00

We should also mark the event flag one, since events are structural

2025-11-13 Wk 46 Thu - 07:53 +03:00

Implemented in distinctions for data with sound effect byte enums or event flags.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script gfx_anim trace dword_8034908

# out (error)
Tracing gfx_anim_script Identifier { s: "dword_8034908" }

thread 'main' panicked at src/bin/dump_script.rs:257:21:
Failed to read gfx_anim_script instructions at Identifier { s: "dword_8034908" }: Other error: Failed to read a u32 at position 20
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

How come? It is of size 24 bytes!

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data dword_8034908

# out
SymbolData {
  ea: RomEa { ea: 08034908 }
  label: Identifier { s: "dword_8034908" }
  size: 24
  data: [0c, 00, 00, 00, 60, 1b, 00, 03, 0c, 0f,
         0e, ff, 10, 42, 00, 80, 01, 00, 00, 00,
         00, 00, 00, 00, ]
}
````

````rust
// in fn read_u32
if buf.len() <= i + 4 {
	return None;
}
````

It should be `<` not `<=`. This can happen at the very last u32 in the script.

2025-11-13 Wk 46 Thu - 08:51 +03:00

````
dword_8034908:
	gfx_anim_manual_pal_transform transform_type=0x0000000C ptr5=iPalette3001B60 index=0x0F num_pals=0x0E
	gfx_anim_data data=0x80004210 delay=0x00000001
	gfx_anim_end
````

It parses!

````
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script gfx_anim trace byte_80662B8
````

This touches `data/dat38_60.s` which is the second slowest file to process in the repo to define `unk_8594AD0`, and then again for `unk_8594AF0`

First time took

````
[2953102::ThreadId(1)] </exhaustively_process_using_scanners 1909.308244408s #items: 10322>
````

See [001 Investigating slow bn repo lexer](../../001%20Turn%20EWRAM%20and%20ROM%20Structs%20into%20C%20Structs%20and%20embed%20into%20type%20for%20gdb%20memory%20manipulation/investigations/001%20Investigating%20slow%20bn%20repo%20lexer.md)

2025-11-13 Wk 46 Thu - 14:07 +03:00

Should be down from `1909s` to ~`300ms`

2025-11-13 Wk 46 Thu - 14:16 +03:00

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin bn_repo_editor lexer_once "/home/lan/src/cloned/gh/dism-exe/bn6f/data/dat38_60.s"

# out (relevant)
[323293::ThreadId(1)] </exhaustively_process_using_scanners 237.814341ms #items: 10330>
````

Whole repository lexing now takes 7 seconds!

````
Repository Lexing stage took 7.093197279s
````

2025-11-13 Wk 46 Thu - 14:42 +03:00

Let's dump the remaining gfx anim scripts for `MapScriptOnInitCentralTown_804EA28`

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script map trace MapScriptOnInitCentralTown_804EA28
````

````
Tracing gfx_anim_script Identifier { s: "dword_8034908" }
Tracing gfx_anim_script Identifier { s: "dword_8034920" }

thread 'main' panicked at src/bin/dump_script.rs:345:53:
called `Result::unwrap()` on an `Err` value: InvalidEa(4294967295)
````

That's `0xFFFFFFFF`. Why?

Might be `off_80348FC` terminating. Yup. We do not skip the last entry even after checking it is `0xFFFFFFFF`

2025-11-13 Wk 46 Thu - 15:18 +03:00

Breaking on `StartCutscene`,

````
8081490

#0  StartCutscene () at ./asm/map_script_cutscene.s:2404
#1  0x08035ea4 in MapScriptCmd_start_cutscene () at ./asm/map_script_cutscene.s:1045
#2  0x08036038 in StoreMapScriptsThenRunOnInitMapScript () at ./asm/map_script_cutscene.s:1351
Backtrace stopped: previous frame identical to this frame (corrupt stack?)
````

The first cutscene is at `0x8081490`

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 8081490

# out
RomEa { ea: 134747280 } is not in map. But it is between Identifier { s: "byte_8081479" } and Identifier { s: "byte_8081534" }
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data byte_8081479 --label -mmm -w 32 -c $(python3 -c "print(0x8081490)")
````

Giving this the label `CutsceneScriptNewGame`

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script cutscene trace CutsceneScriptNewGame
````

2025-11-13 Wk 46 Thu - 15:39 +03:00

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
git commit -m "add gfx anim script parsing and improve lexer speed"

# out
[main 690dbe0] add gfx anim script parsing and improve lexer speed
 6 files changed, 1048 insertions(+), 263 deletions(-)
````

````diff
 dat21:
-       .include "data/dat21.s"
+       .word 0x80FC0000, 0x08000000
+
+ccs_808145C:
+       .word 0x8000D004, 0x00000000, 0x40040800, 0x00FF8000, 0x04000000, 0xFF800080, 0x00000080
+       .byte 0x08
+"data/dat21.s"
````

`dat21.s` does have a symbol at the start of the file: `byte_8081454`, but this time it comes first:

````
08081454 g 00000000 byte_8081454
08081454 l 00000000 dat21
````

Because `dat21` is local.

`byte_8081454` so far has no references, so let's make it local. With it being local, order is prioritized by which one appears last.

````
08081454 l 00000000 byte_8081454
08081454 l 00000000 dat21
````

2025-11-13 Wk 46 Thu - 15:51 +03:00

Modified `read_sym_file` to remove duplicates, keeping last. I thought that logic was already there.

````
Dumping Identifier { s: "cutscenescript_8081580" }

./data/dat21.s:110: Error: bad instruction `end_script_0u32'
````

This is near `dword_8081578`

I removed `end_script_0u32` from the code since we no longer needed it, but now it can be used as an indication of when to manually intervene.

If you disable `CutsceneScriptNewGame` you can use the chatbox with the L message to get `"Dummy Text"` and you'd be in class 6-A, you can move around once you open the PET and enter folder and leave, which triggers map reload.

2025-11-13 Wk 46 Thu - 16:24 +03:00

2nd cutscene is at `0x80815b4`

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 80815b4 # ACDC 1
cargo run --bin expt000_read_symbol_data 8081704 # Arriving at Central Town
cargo run --bin expt000_read_symbol_data 8098384 # byte_8098384; Attempting to leave the house before talking to Parents
												 # also attempting to jack in in Lan's room
cargo run --bin expt000_read_symbol_data 8098358 # byte_8098358; Checking the fridge or other items in Lan's House and room.
												 # Also Asterland
cargo run --bin expt000_read_symbol_data 80817b8 # Iris attacked by RoboDog
cargo run --bin expt000_read_symbol_data 80818ec # Jack in into RoboDog to fight 3 meteor
cargo run --bin expt000_read_symbol_data 80819bc # After tutorial first battle
cargo run --bin expt000_read_symbol_data 8081a88 # After tutorial second battle
cargo run --bin expt000_read_symbol_data 8081b60 # After tutorial third battle
cargo run --bin expt000_read_symbol_data 8081c84 # byte_8081C84; Jack out from RoboDog after tutorial to check on Iris


# Talking to Mom and Dad triggers no cutscene

# out (relevant)
RomEa { ea: 134747572 } is not in map. But it is between Identifier { s: "byte_80815AC" } and Identifier { s: "byte_8081692" }
RomEa { ea: 134747908 } is not in map. But it is between Identifier { s: "byte_80816FC" } and Identifier { s: "byte_808178D" }
RomEa { ea: 134748088 } is not in map. But it is between Identifier { s: "byte_808178D" } and Identifier { s: "byte_8081963" }
RomEa { ea: 134748396 } is not in map. But it is between Identifier { s: "byte_808178D" } and Identifier { s: "byte_8081963" }
RomEa { ea: 134748604 } is not in map. But it is between Identifier { s: "byte_8081963" } and Identifier { s: "dword_8081A60" }
RomEa { ea: 134748808 } is not in map. But it is between Identifier { s: "byte_8081A76" } and Identifier { s: "dword_8081B2C" }
RomEa { ea: 134749024 } is not in map. But it is between Identifier { s: "byte_8081B54" } and Identifier { s: "byte_8081C1F" }
````

2025-11-13 Wk 46 Thu - 16:47 +03:00

Okay let's mark all these.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 80815b4 -M "CutsceneScriptNewGameAcdc"  
cargo run --bin expt000_read_symbol_data 8081704 -M "CutsceneScriptNewGameArriveCentralTown"  
cargo run --bin expt000_read_symbol_data 80817b8 -M "CutsceneScriptIrisAttackedByRoboDog"  
cargo run --bin expt000_read_symbol_data 80818ec -M "CutsceneScriptTutJackInRoboDog"  
cargo run --bin expt000_read_symbol_data 80819bc -M "CutsceneScriptTutSecondBattle"  
cargo run --bin expt000_read_symbol_data 8081a88 -M "CutsceneScriptTutThirdBattle"  
cargo run --bin expt000_read_symbol_data 8081b60 -M "CutsceneScriptTutAfterThirdBattle"  
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
./replacep.sh "byte_8081C84" "CutsceneScriptEndTutCheckOnIris"
````

2025-11-13 Wk 46 Thu - 17:18 +03:00

Will need to also trace dump `byte_8098384`, and `byte_8098358` besides the clearly labeled ones.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script cutscene trace CutsceneScriptNewGameAcdc
````

Need to also see what is using `unk_804D75C`. These are of `0xFF` terminated pointers, which should all be marked. We've been missing some here and there.

Okay it's

````
cs_spawn_ow_npc_objects_from_list ptr2=unk_804D75C
````

An example is `byte_8050E00`

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script npc trace byte_8050E00
````

They are npc scripts!!

2025-11-13 Wk 46 Thu - 17:35 +03:00

Now we should include parsing the NPC scripts as well. Need to sync from the beginning.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script map trace MapScriptOnInitCentralTown_804EA28
````

````
Tracing npcscript Identifier { s: "byte_805079A" }

83 new_inst: Inst { name: "ns_jump_with_link", cmd: 54, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 134870732 })] }
88 new_inst: Inst { name: "ns_end", cmd: 0, opt_subcmd: None, fields: [] }
89 new_inst: Inst { name: "ns_end", cmd: 0, opt_subcmd: None, fields: [] }

thread 'main' panicked at src/bin/dump_script.rs:257:21:
Failed to read npcscript instructions at Identifier { s: "byte_805079A" }: Other error: Invalid Ea processed in byte 90 for Inst InstSchema { name: "ns_jump_if_flag_set", cmd: 4, opt_subcmd: None, fields: [Event16("event16_1"), Dest("destination3")] } and Field Dest("destination3"): Effective address 84427528 is invalid.
````

Need to add `ns_end` to terminating insts for automatic recovery and cutting at end boundaries.

2025-11-13 Wk 46 Thu - 17:57 +03:00

````
24 new_inst: Inst { name: "ns_jump", cmd: 2, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 134870740 })] }
29 new_inst: Inst { name: "ns_end", cmd: 0, opt_subcmd: None, fields: [] }
30 new_inst: Inst { name: "ns_end", cmd: 0, opt_subcmd: None, fields: [] }
31 new_inst: Inst { name: "ns_end", cmd: 0, opt_subcmd: None, fields: [] }

thread 'main' panicked at src/bin/dump_script.rs:355:41:
Failed to process new symbol data for pointer 0x8050A27 through script Npc Identifier { s: "unk_8050994" }: Effective address RomEa { ea: 134548007 } is not in sym file
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

We need to also mark new labels from the list of pointers to scripts processed if they don't exist

2025-11-13 Wk 46 Thu - 18:01 +03:00

````
Tracing npcscript Identifier { s: "byte_8050ADB" }

50 new_inst: Inst { name: "ns_write_cutscene_var", cmd: 60, opt_subcmd: None, fields: [U8("byte1", 8), U8("byte2", 11)] }
53 new_inst: Inst { name: "ns_free_and_end", cmd: 3, opt_subcmd: None, fields: [] }
54 new_inst: Inst { name: "ns_end", cmd: 0, opt_subcmd: None, fields: [] }
55 new_inst: Inst { name: "ns_end", cmd: 0, opt_subcmd: None, fields: [] }
56 new_inst: Inst { name: "ns_end", cmd: 0, opt_subcmd: None, fields: [] }
57 new_inst: Inst { name: "ns_play_sound", cmd: 40, opt_subcmd: None, fields: [U16("hword1", 1291)] }
60 new_inst: Inst { name: "ns_set_active_and_visible", cmd: 8, opt_subcmd: None, fields: [] }
61 new_inst: Inst { name: "ns_do_camera_shake", cmd: 74, opt_subcmd: None, fields: [U8("byte1", 11), U16("hword2", 2053)] }

thread 'main' panicked at src/bin/dump_script.rs:238:25:
No terminating command before failing to read npcscript instructions at Identifier { s: "byte_8050ADB" }: Partial read Error. Original error: Failed to route the command: No instruction schema found for position 65 and byte 0xD4. Parsed Instructions: [Inst { name: "ns_set_active_and_visible", cmd: 8, opt_subcmd: None, fields: [] }, Inst { name: "ns_disable_collision", cmd: 31, 
````

We need to mark an end boundary at `byte_8050ADB+55`

````sh
python3 -c "print(hex(0x8050ADB+55))"

# out
0x8050b12
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 8050b12 -M "end_npcscript_8050B12"  
````

````
Tracing npcscript Identifier { s: "byte_8050B9A" }

14 new_inst: Inst { name: "ns_wait_cutscene_var", cmd: 63, opt_subcmd: None, fields: [U8("byte1", 8), U8("byte2", 1)] }
17 new_inst: Inst { name: "ns_jump_with_link", cmd: 54, opt_subcmd: None, fields: [Dest("destination1", RomEa { ea: 134870732 })] }

thread 'main' panicked at src/bin/dump_script.rs:238:25:
No terminating command before failing to read npcscript instructions at Identifier { s: "byte_8050B9A" }: Partial read Error. Original error: Failed to route the command: No instruction schema found for position 22 and byte 0xC4. Parsed Instructions: [Inst { name: "ns_set_active_and_visible", cmd: 8, opt_subcmd: None, fields: [] }, Inst { name: "ns_disable_collision", cmd: 31, 
````

````sh
python3 -c "print(hex(0x8050B9A+22))"

# out
0x8050bb0
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 8050bb0 -M "end_npcscript_8050BB0"  
````

2025-11-13 Wk 46 Thu - 18:14 +03:00

````
Tracing npcscript Identifier { s: "byte_8051118" }

17 new_inst: Inst { name: "ns_pause", cmd: 16, opt_subcmd: None, fields: [U8("byte1", 30)] }
19 new_inst: Inst { name: "ns_set_animation", cmd: 22, opt_subcmd: None, fields: [U8("byte1", 13)] }

thread 'main' panicked at src/bin/dump_script.rs:238:25:
No terminating command before failing to read npcscript instructions at Identifier { s: "byte_8051118" }: Partial read Error. Original error: Inst InstSchema { name: "ns_move_in_direction", cmd: 21, opt_subcmd: None, fields: [U8("byte1"), U8("byte2"), U8("byte3")] } overflows buffer size 24 at position 21. Parsed Instructions: [Inst { name: "ns_set_active_and_visible", cmd: 8, 
````

`byte_8051130` has no reference. Removing it.

````
Tracing npcscript Identifier { s: "byte_8050EE8" }

5 new_inst: Inst { name: "ns_set_coords", cmd: 20, opt_subcmd: None, fields: [U16("hword1", 64), U16("hword3", 65494), U16("hword5", 0)] }
12 new_inst: Inst { name: "ns_set_animation", cmd: 22, opt_subcmd: None, fields: [U8("byte1", 1)] }

thread 'main' panicked at src/bin/dump_script.rs:238:25:
No terminating command before failing to read npcscript instructions at Identifier { s: "byte_8050EE8" }: Partial read Error. Original error: Inst InstSchema { name: "ns_wait_cutscene_var", cmd: 63, opt_subcmd: None, fields: [U8("byte1"), U8("byte2")] } overflows buffer size 16 at position 14. Parsed Instructions: [Inst { name: "ns_set_active_and_visible", cmd: 8, opt_subcmd:
````

`byte_8050EF8` also has no reference. Removing it. Same as `byte_8050FCC`

2025-11-13 Wk 46 Thu - 19:04 +03:00

`byte_805150D` was referred to but turned out to not be a real pointer in `byte_8051118`. Also with `byte_83F0516` and `loc_803150A+1` in `npcscript_805113B`

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin dump_script map trace MapScriptOnUpdateCentralTown_804EEF7
````

````
thread 'main' panicked at src/bin/dump_script.rs:92:15:
script RomEa { ea: 134841488 } "byte_8098490": We can only cut in ROM EAs: IwRam(IwramEa { ea: 50337648 })
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

Hmm at `0x3001770`. Added new label.

2025-11-13 Wk 46 Thu - 19:20 +03:00

````
65 new_inst: Inst { name: "ns_run_secondary_script", cmd: 50, opt_subcmd: None, fields: [Ptr("ptr1", Rom(RomEa { ea: 134547736 }))] }
70 new_inst: Inst { name: "ns_set_animation", cmd: 22, opt_subcmd: None, fields: [U8("byte1", 9)] }
72 new_inst: Inst { name: "ns_move_in_direction", cmd: 21, opt_subcmd: None, fields: [U8("byte1", 1), U8("byte2", 8), U8("byte3", 2)] }

thread 'main' panicked at src/bin/dump_script.rs:238:25:
No terminating command before failing to read npcscript instructions at Identifier { s: "npcscript_8050843" }: Partial read Error. Original error: Inst InstSchema { name: "ns_write_cutscene_var", cmd: 60, opt_subcmd: None, fields: [U8("byte1"), U8("byte2")] } overflows buffer size 77 at position 76. Parsed Instructions: [Inst { name: "ns_set_active_and_visible", cmd: 8, opt_subc
````

I didn't register `ns_run_secondary_script` for tracing. Luckily this is the first time we encounter it.

There's also `ns_set_text_script_index_and_ptr` (0x44). `NPCCommand_set_text_script_index_and_ptr` confirms it's a `TextScriptPtr`.

2025-11-13 Wk 46 Thu - 19:32 +03:00

Another unused pointer `off_8050890`. Deleting.

`npcscript_8050893` cutting here fails build. Seems to be due to lexer report falling out of sync.

````
thread 'main' panicked at src/bin/dump_script.rs:339:17:
Expected last pointer to be -1i32 or 0xFF: npcscript_805139C
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

`npcscript_805139C` is a list, not  a script.

````
Tracing npcscript Identifier { s: "byte_80514E7" }

thread 'main' panicked at src/bin/dump_script.rs:238:25:
No terminating command before failing to read npcscript instructions at Identifier { s: "byte_80514E7" }: Partial read Error. Original error: Inst InstSchema { name: "ns_pause", cmd: 16, opt_subcmd: None, fields: [U8("byte1")] } overflows buffer size 38 at position 37. Parsed Instructions: [Inst { name: "ns_set_active_and_visible", cmd: 8, opt_subcmd: None, fields: [] }, Inst {
````

`byte_805150D` looks suspicious, and now that we're overflowing it that's extra confirmation. Need to remove all of its instances.

Same with `loc_803150A` and `loc_8011508` and `byte_83F2916`

2025-11-14 Wk 46 Fri - 07:10 +03:00

We need to add in the encoding a distinction of a Terminal command. internal dests should also be cut instead of left to be handled by dumping so that whatever is dumped is more trustworthy to be reachable by the actual code.

Also not only `end` commands are terminal, but also unconditional jumps. This is because to reach beyond an unconditional jump you have to trace prior jump destinations.

2025-11-14 Wk 46 Fri - 07:37 +03:00

Let's not for now, the script is able to infer labels after jumps with the current setup, although there's a risk with reading junk at the end, there also can be a chance of dumping script that is left unlabeled, even if is technically unreachable by the current execution context. An example can be found in `npcscript_8050DB8`,

````
	ns_jump destination1=npcscript_8050DB8
	ns_jump_with_link destination1=byte_809F6CC
````

That `ns_jump_with_link` might have been dead code left by the developers. Being too strict about following execution context would leave it undumped.

2025-11-14 Wk 46 Fri - 07:51 +03:00

````
dword_804F1D0::
	end_script_0u32
````

So there's a real use for `end_script_0u32` I guess. This is a dead mapscript, but mapscript should be able to handle this, so let's disable this for now.

2025-11-14 Wk 46 Fri - 08:07 +03:00

````
Dumping Identifier { s: "CutsceneScriptIrisAttackedByRoboDog" }
bn6f.gba: FAILED
````

We fail even when we reverse the dumping for that. Likely because I didn't also undo the internal dest.

````
	cs_end_for_map_reload_maybe_8037c64
	cs_set_chatbox_flags byte2=0x40
	cs_jump destination1=cutscenescript_8081853
````

An end but then a jump in `cutscenescript_8081853`...

2025-11-14 Wk 46 Fri - 08:42 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
cp ~/src/cloned/gh/dism-exe/branches/bn6f@tmp/bn6f.gba bn6f.ign
````

Had to change Makefile `PY` to `python3`, but then we can do

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
make fdiff

# out
python3 tools/fdiff.py bn6f.ign bn6f.gba -s2
Found diff #0 @ 081824: bin1=0x20 bin2=0x2020
Found diff #1 @ 081826: bin1=0x0 bin2=0x20
Found diff #2 @ 08182C: bin1=0x1400 bin2=0x0
Found diff #3 @ 081844: bin1=0x0 bin2=0x2020
Found diff #4 @ 08184C: bin1=0xB2 bin2=0x0
Found diff #5 @ 081852: bin1=0x141E bin2=0x14FF
Found diff #6 @ 08185A: bin1=0x1004 bin2=0x404
Found diff #7 @ 08185E: bin1=0xFF04 bin2=0x404
Found diff #8 @ 081860: bin1=0x4704 bin2=0x47FF
Found diff #9 @ 081868: bin1=0x1 bin2=0x1FF
Found diff #10 @ 08186A: bin1=0x0 bin2=0x100
Found diff #11 @ 081878: bin1=0x4C0F bin2=0x4CFF
Found diff #12 @ 081882: bin1=0x409 bin2=0x9FF
Found diff #13 @ 081886: bin1=0x1703 bin2=0x3FF
````

We can just use this `fdiff.py` instead of needing to change `PY`.

2025-11-14 Wk 46 Fri - 08:55 +03:00

`CutsceneScriptIrisAttackedByRoboDog` is at `0817B8`. The first diff occurs at `081824`:

````sh
python3 -c "print(0x081824 - 0x0817B8)"

# out
108
````

````
Tracing cutscenescript Identifier { s: "CutsceneScriptIrisAttackedByRoboDog" }

107 new_inst: Inst { name: "cs_spawn_ow_map_object_rel_to_ow_npc", cmd: 73, opt_subcmd: Some(U4(2)), fields: [U4("nybble1", 0), U8("byte2", 32), U8("byte3", 32), I16("signedhword4", 0), I16("signedhword6", 0), I16("signedhword8", 0), U32("word10", 0)] }
121 new_inst: Inst { name: "cs_wait_chatbox", cmd: 4, opt_subcmd: None, fields: [U8("byte1", 128)] }
````

This is the first encounter of `cs_spawn_ow_map_object_rel_to_ow_npc` as we suspect.

````
cs_spawn_ow_map_object_rel_to_ow_npc nybble1=0x00 byte2=0x20 byte3=0x20 signedhword4=0x0000 signedhword6=0x0000 signedhword8=0x0000 word10=0x00000000
````

So something is wrong about this.

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
# -e for little endian
xxd -e bn6f.ign | less

# out (relevant)
00081820: 490aff02 00000020 00000000 00001400  ...I ...........
00081830: 36800400 08098458 09849036 0d080908  ...6X...6.......
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
xxd -e bn6f.gba | less

# out (relevant)
00081820: 490aff02 00202020 00000000 00000000  ...I   .........
00081830: 36800400 08098458 09849036 0d080908  ...6X...6.......
````

2025-11-14 Wk 46 Fri - 10:55 +03:00

Why does it say that `byte2` and `byte3` are `0x20`? They should be both `0x00`.

2025-11-15 Wk 46 Sat - 13:58 +03:00

I cleaned up the logic for U4 processing. We know this can only occur in our case in one place, so we just handle this special case.

2025-11-15 Wk 46 Sat - 14:07 +03:00

````
byte_809F6CC::
byte_809F6CC:
	ns_pause byte1=0x01
	ns_jump destination1=byte_809F6CC
	ns_end
````

It builds even though there are these duplicate symbols. Gotta remove the local. There was failure related to this, but removed and rebuilding for now.

````diff
 byte_809F6CC::
+byte_809F6CC:
        ns_pause byte1=0x01
        ns_jump destination1=byte_809F6CC
        ns_end
+
````

It added it again...

So the handling of duplicates was in `get_data_lexon_replace_record`:

````rust
// Duplicates are possible, but should still reside in the same file. Just get the first.
let (sym_repo_path, match_lexon_type, _) = sym_repo_path_matches[0].clone();
````

2025-11-15 Wk 46 Sat - 14:29 +03:00

It dumps!
