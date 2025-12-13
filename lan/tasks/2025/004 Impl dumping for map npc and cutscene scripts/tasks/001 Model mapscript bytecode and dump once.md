---
parent: '[[004 Impl dumping for map npc and cutscene scripts]]'
spawned_by: '[[004 Impl dumping for map npc and cutscene scripts]]'
context_type: task
status: done
---

Parent: [004 Impl dumping for map npc and cutscene scripts](../004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts.md)

Spawned by: [004 Impl dumping for map npc and cutscene scripts](../004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts.md)

Spawned in: [<a name="spawn-task-1bb35f" />^spawn-task-1bb35f](../004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts.md#spawn-task-1bb35f)

# 1 Journal

2025-10-18 Wk 42 Sat - 12:45 +03:00

Thanks to [000 Impl expt000 to get symbol data at label or ea](000%20Impl%20expt000%20to%20get%20symbol%20data%20at%20label%20or%20ea.md) We can get the data at a label. Now we need to parse that according to bytecode.

But first we need to have the bytecode parser to begin with.

The bytecode is specified in `include/bytecode/map_script.inc` in `/home/lan/src/cloned/gh/dism-exe/bn6f`.

2025-10-18 Wk 42 Sat - 14:29 +03:00

![Pasted image 20251018142932.png](../../../../../attachments/Pasted%20image%2020251018142932.png)

Fun mix of syntax, `<<` expected to be for templates rather than logical shift left

2025-10-18 Wk 42 Sat - 14:48 +03:00

Compute of `dumped_fields` is a bit involved in `encoding::dump`:

````rust
FieldSchema::U32(name) => {
	Ok(Field::U32(name.clone(), 
		((buf[mut_i + field_off + *mut_j + 3] as u32) << 24) + 
		((buf[mut_i + field_off + *mut_j + 2] as u32) << 16) + 
		((buf[mut_i + field_off + *mut_j + 1] as u32) << 8) + 
		buf[mut_i + field_off + *mut_j] as u32))
},
````

since `buf` is a `&[u8]` there are bytes at the 8$^{\text{th}}$, 16$^\text{th}$, and 24$^\text{th}$ bits. We also have to treat them as `u32`.  We are at the `mut_i`$^\text{th}$ instruction, the field portion of it with `field_off`, and `mut_j` accumulates processed fields within that instruction.

We could also use `u32::from_le_bytes` as I noticed during an llm session.

2025-10-30 Wk 44 Thu - 03:24 +03:00

2025-10-30 Wk 44 Thu - 05:54 +03:00

One of the first scripts to dump is

````
MapScriptOnInitCentralTown_804EA28:: // MapScript
  ms_set_event_flag byte1=0xFF hword2=0x16D0
  ms_jump_if_flag_clear byte1=0xFF hword2=0x0A9B destination4=byte_804EA41
	.byte 0x38, 0x1, 0xC7, 0x4, 0x8, 0x1D, 0xC7, 0x4, 0x8, 0x0, 0x0, 0x0, 0x0
````

I've already done some partial manual dumping.

2025-10-30 Wk 44 Thu - 06:34 +03:00

Finished implementing the dump logic. Now testing.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin dump_mapscript once MapScriptOnInitCentralTown_804EA28

# out (relevant, error)
thread 'main' panicked at src/bin/dump_mapscript.rs:24:10:
Failed to read instructions: InvalidEa(InvalidEa(0))
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

2025-10-30 Wk 44 Thu - 06:44 +03:00

Clarified the error,

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin dump_mapscript once MapScriptOnInitCentralTown_804EA28

# out (relevant, error)
thread 'main' panicked at src/bin/dump_mapscript.rs:24:10:
Failed to read instructions: InvalidEa(12, InstSchema { name: "ms_init_eStruct200a6a0", cmd: 56, opt_subcmd: None, fields: [Ptr("ptr1"), Ptr("ptr5"), Ptr("ptr9")] }, Ptr("ptr9"), InvalidEa(0))
````

This could be a null pointer. We didn't implement support for those yet. Let's add a new variant to `Ea` being `Null`.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin dump_mapscript once MapScriptOnInitCentralTown_804EA28

# out (relevant, error)
thread 'main' panicked at src/bin/dump_mapscript.rs:27:29:
Failed to process script labels: Script refers to a pointer not in map: 0x0804C701
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 804C701

# out (relevant)
RomEa { ea: 134530817 } is not in map. But it is between Identifier { s: "sub_804C074" } and Identifier { s: "ACDCTown_EnterMapGroup" }
````

This triangulation isn't right. There's many functions after `sub_804C074`.

Anyway the function `sub_804C700` does exist. It is `+1` because it's a thumb function.

2025-10-30 Wk 44 Thu - 07:16 +03:00

Okay `sub_804C700` is actually not in `bn6f.map`. But you can find it in `bn6f.sym` after building with `make bn6f.sym`.

This is likely because it's marked a `thumb_local_start`. Change it to `thumb_func_start`.

2025-10-30 Wk 44 Thu - 07:20 +03:00

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin dump_mapscript once MapScriptOnInitCentralTown_804EA28

# out (relevant, error)
thread 'main' panicked at src/bin/dump_mapscript.rs:27:29:
Failed to process script labels: Script refers to a pointer not in map: 0x0804C71D
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 804C71D

# out (relevant)
RomEa { ea: 134530845 } is not in map. But it is between Identifier { s: "sub_804C700" } and Identifier { s: "ACDCTown_EnterMapGroup" }
````

Still within the same region of local functions. It's `sub_804C71C`. Make it a global function.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin dump_mapscript once MapScriptOnInitCentralTown_804EA28

# out (relevant, error)
thread 'main' panicked at src/bin/dump_mapscript.rs:27:29:
Failed to process script labels: Script refers to a pointer not in map: 0x00000000
````

We should not be checking the map with null. It does have a label: `NULL`.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin dump_mapscript once MapScriptOnInitCentralTown_804EA28

# out (relevant)
ms_set_event_flag byte1=0xFF hword2=0x16D0
ms_jump_if_flag_clear byte1=0xFF hword2=0x0A9B destination4=byte_804EA41
ms_init_eStruct200a6a0 ptr1=sub_804C700+1 ptr5=sub_804C71C+1 ptr9=NULL
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
make clean && make -j$(nproc) assets && make -j$(nproc)

# out (relevant)
bn6f.gba: OK
````

Awesome! We managed to dump our first symbol data block.

2025-10-30 Wk 44 Thu - 07:29 +03:00

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin dump_mapscript once byte_804EA41

# out (relevant, error)
thread 'main' panicked at src/bin/dump_mapscript.rs:27:29:
Failed to process script labels: Script refers to a pointer not in map: 0x0809BBE9
````

Added `unk_809BBE9`.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin dump_mapscript once byte_804EA41

# out (relevant, error)
thread 'main' panicked at src/bin/dump_mapscript.rs:27:29:
Failed to process script labels: Script refers to a pointer not in map: 0x02011EB4
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 2011EB4

# out (error, relevant)
thread 'main' panicked at src/drivers/symbols.rs:521:22:
Expected a ROM ea, not Ewram(EwramEa { ea: 33627828 })
````

Right this only works for ROM eas.

There is this:

````C
// in ewram.s
unk_2011EA4:: // 0x2011ea4
	.space 60
````

It seems to only be referenced by map scripts, only one so far that takes itself back to Central Town on update mapscript.

````C
// in ewram.s
unk_2011EA4:: // 0x2011ea4
	.space 16
unk_2011EB4:: // 0x2011eb4
	.space 44
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin dump_mapscript once byte_804EA41

# out (relevant, error)
thread 'main' panicked at src/bin/dump_mapscript.rs:27:29:
Failed to process script labels: Script refers to a pointer not in map: 0x08050402
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 8050402

# out (error, relevant)
RomEa { ea: 134546434 } is not in map. But it is between Identifier { s: "byte_80503DB" } and Identifier { s: "byte_805040D" }
````

`byte_80503DB` is an `NPCScript`...

Let's change `dump_mapscript.rs` to just `dump_script` and let it take an argument for which. It's a similar process for npc, cutscene, and cutscene camera scripts.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
git commit -m "impl dumping for mapscript"

# out
[main 9093820] impl dumping for mapscript
 9 files changed, 2730 insertions(+), 402 deletions(-)
````

2025-10-30 Wk 44 Thu - 09:20 +03:00

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin dump_script npc once byte_80503DB

# out
        ns_set_active_and_visible
        ns_jump_if_flag_set hword1=0x1C39 destination3=npcscript_805040C
        ns_jump_if_flag_set hword1=0x11CD destination3=npcscript_80503EB
npcscript_80503EB::
        ns_free_and_end
        ns_jump_if_flag_clear hword1=0x171D destination3=npcscript_805040C
        ns_jump_if_flag_set hword1=0x0163 destination3=npcscript_805040C
        ns_set_sprite byte1=0x0A
        ns_do_not_face_player_when_interacted
        ns_set_text_script_index_and_ptr_to_decomp_buffer byte1=0x82
        ns_set_coords hword1=0xFF7E hword3=0xFFFB hword5=0x0000
        ns_set_animation byte1=0x07
npcscript_805040C::
        ns_jump_with_link destination1=npcscript_809F6CC
        ns_free_and_end
````

`byte_809F6CC` exists but was local. Made it global.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin dump_script npc once byte_80503DB

# out
        ns_set_active_and_visible
        ns_jump_if_flag_set hword1=0x1C39 destination3=npcscript_805040C
        ns_jump_if_flag_set hword1=0x11CD destination3=npcscript_80503EB
npcscript_80503EB::
        ns_free_and_end
        ns_jump_if_flag_clear hword1=0x171D destination3=npcscript_805040C
        ns_jump_if_flag_set hword1=0x0163 destination3=npcscript_805040C
        ns_set_sprite byte1=0x0A
        ns_do_not_face_player_when_interacted
        ns_set_text_script_index_and_ptr_to_decomp_buffer byte1=0x82
        ns_set_coords hword1=0xFF7E hword3=0xFFFB hword5=0x0000
        ns_set_animation byte1=0x07
npcscript_805040C::
        ns_jump_with_link destination1=byte_809F6CC
        ns_free_and_end
````

2025-10-30 Wk 44 Thu - 09:36 +03:00

This fails build, but we can get OK by hardcoding the pointers:

````sh
        ns_set_active_and_visible
        ns_jump_if_flag_set hword1=0x1C39 destination3=0x805040C
        ns_jump_if_flag_set hword1=0x11CD destination3=0x80503EB
npcscript_80503EB::
        ns_free_and_end
        ns_jump_if_flag_clear hword1=0x171D destination3=0x805040C
        ns_jump_if_flag_set hword1=0x0163 destination3=0x805040C
````

So the issue seems to be the labels created.

````rust
// in fn dump
*mut_cur_ea += (inst.size_u4() / 2) as u32;

let opt_labeled_ea = script_labels
	.int_dests
	.iter()
	.find(|(rom_ea, _)| rom_ea.ea == *mut_cur_ea);
````

We should definitely not update the cur_ea before assigning the label!

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin dump_script npc once byte_80503DB

# out
        ns_set_active_and_visible
        ns_jump_if_flag_set hword1=0x1C39 destination3=npcscript_805040C
        ns_jump_if_flag_set hword1=0x11CD destination3=npcscript_80503EB
        ns_free_and_end
npcscript_80503EB::
        ns_jump_if_flag_clear hword1=0x171D destination3=npcscript_805040C
        ns_jump_if_flag_set hword1=0x0163 destination3=npcscript_805040C
        ns_set_sprite byte1=0x0A
        ns_do_not_face_player_when_interacted
        ns_set_text_script_index_and_ptr_to_decomp_buffer byte1=0x82
        ns_set_coords hword1=0xFF7E hword3=0xFFFB hword5=0x0000
        ns_set_animation byte1=0x07
        ns_jump_with_link destination1=byte_809F6CC
npcscript_805040C::
        ns_free_and_end
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
make clean && make -j$(nproc) assets && make -j$(nproc)

# out (relevant)
bn6f.gba: OK
````

Okay! It looks more logical now with the label placements and the end commands too! Anyway let's make the labels local by default. `:`. It's not apparent they need to be global.

2025-10-30 Wk 44 Thu - 09:54 +03:00

````C
byte_80503DB::
	.byte 0x08, 0x04, 0x39, 0x1C, 0x0C, 0x04, 0x05, 0x08, 0x04, 0xCD, 0x11, 0xEB, 0x03, 0x05, 0x08, 0x03
	.byte 0x05, 0x1D, 0x17, 0x0C, 0x04, 0x05, 0x08, 0x04, 0x63, 0x01, 0x0C, 0x04, 0x05, 0x08, 0x17, 0x0A
	.byte 0x13, 0x4C, 0x82, 0x14, 0x7E, 0xFF, 0xFB

unk_8050402::
	.byte 0xFF, 0x00, 0x00, 0x16, 0x07, 0x36, 0xCC, 0xF6, 0x09, 0x08, 0x03
````

I inserted a new label using

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data byte_80503DB -m -w 16 -c $(python3 -c "print(0x8050402)")
````

But this does not cut the npcscript cleanly...

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin dump_script npc once byte_80503DB

# out (error, relevant)
thread 'main' panicked at src/bin/dump_script.rs:39:10:
Failed to read instructions: InstOverflowsBufSize(InstSchema { name: "ns_set_coords", cmd: 20, opt_subcmd: None, fields: [U16("hword1"), U16("hword3"), U16("hword5")] }, 39, 35)
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin dump_script map once byte_804EA41

# out (relevant, error)
        ms_jump_if_flag_clear byte1=0xFF hword2=0x003A destination4=mapscript_804EA52
        ms_start_cutscene ptr1=unk_809BBE9 ptr5=NULL
mapscript_804EA52:
        ms_jump_if_progress_in_range byte1=0x00 byte2=0x0F destination3=mapscript_804EA88
        ms_jump_if_progress_in_range byte1=0x10 byte2=0x1F destination3=byte_804EB2D
        ms_jump_if_progress_in_range byte1=0x20 byte2=0x2F destination3=mapscript_804EBDB
        ms_jump_if_progress_in_range byte1=0x30 byte2=0x3F destination3=mapscript_804EC3B
        ms_jump_if_progress_in_range byte1=0x40 byte2=0x4F destination3=mapscript_804EC8D
        ms_jump_if_progress_in_range byte1=0x50 byte2=0x5F destination3=byte_804ECD6
        ms_jump_if_progress_in_range byte1=0x60 byte2=0x6F destination3=mapscript_804EDE1
        ms_jump destination1=byte_804EEF6
mapscript_804EA88:
        ms_set_event_flag byte1=0xFF hword2=0x16F4
        ms_write_word ptr1=unk_2011EB4 ptr5=unk_8050402
        ms_set_event_flag byte1=0xFF hword2=0x16F5
        ms_jump_if_progress_in_range byte1=0x00 byte2=0x00 destination3=byte_804EAAC
        ms_jump_if_progress_in_range byte1=0x01 byte2=0x01 destination3=mapscript_804EAC6
        ms_jump destination1=byte_804EEF6
````

````sh
ms_write_word ptr1=unk_2011EB4 ptr5=unk_8050402
````

It writes a word...?

2025-10-30 Wk 44 Thu - 19:37 +03:00

This seems to be also something lucky didn't dump. They're reading mid-instruction.

````sh
ms_write_word ptr1=unk_2011EB4 ptr5=unk_8050402
````

reads

````
ns_set_coords hword1=0xFF7E hword3=0xFFFB hword5=0x0000
									 ~~
````

That would be `160000FF`

It seems to be just a word. There's no evidence yet this is a pointer, so let's correct `ptr5` to `word5` for `0x29/0x31`.

Here is also lucky's [dump](https://gist.github.com/luckytyphlosion/e3601b623b56403ce4891059553698e9) for reference which didn't make it in the repo.

<a name="reminder-215779" />^reminder-215779

Spawn [005 Dump event flags being used for scripts](005%20Dump%20event%20flags%20being%20used%20for%20scripts.md) <a name="spawn-task-59c92c" />^spawn-task-59c92c

2025-10-31 Wk 44 Fri - 00:09 +03:00

Spawn [006 Dump scripts via script tracing](006%20Dump%20scripts%20via%20script%20tracing.md) <a name="spawn-task-a97099" />^spawn-task-a97099
