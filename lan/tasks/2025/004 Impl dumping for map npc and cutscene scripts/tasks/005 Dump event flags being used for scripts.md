---
parent: '[[004 Impl dumping for map npc and cutscene scripts]]'
spawned_by: '[[001 Model mapscript bytecode and dump once]]'
context_type: task
status: done
---

Parent: [004 Impl dumping for map npc and cutscene scripts](../004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts.md)

Spawned by: [001 Model mapscript bytecode and dump once](001%20Model%20mapscript%20bytecode%20and%20dump%20once.md)

Spawned in: [<a name="spawn-task-59c92c" />^spawn-task-59c92c](001%20Model%20mapscript%20bytecode%20and%20dump%20once.md#spawn-task-59c92c)

# 1 Journal

2025-10-30 Wk 44 Thu - 19:58 +03:00

We need to include events instead of hwords. Let's introduce a new field type `event16_`.

We need to correct any `hwordN` to `event16_N`

For NPC Scripts, `0x04-0x07`

All of the events are documented in `constants/enums/ewram_flags.inc`.

2025-10-30 Wk 44 Thu - 22:32 +03:00

Wrote the new logic for dumping enums. Testing.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin dump_script map once byte_804EA41

# out (error, relevant)
thread 'main' panicked at src/bin/dump_script.rs:28:10:
Failed to read event flags: EnumLineMustHaveOneToken("\tenum EVENT_1716 // constantly written")
````

Need to strip comments

2025-10-30 Wk 44 Thu - 22:41 +03:00

Continuing to change `hwordN` to `event16_N`,

Seems we have to also update textscript eventually with event flags and also mutshot constants...

For Map Scripts, `0x03-0x06, 0x1f-0x22`

For Cutscene Scripts, `0x0d-0x0e, 0x17-0x1a, 0x29-0x2c`

For Cutscene Camera Scripts, `0x40, 0x44, `

2025-10-30 Wk 44 Thu - 23:23 +03:00

Now we dump events!

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin dump_script map once MapScriptOnInitCentralTown_804EA28

# out
        ms_set_event_flag byte1=0xFF event16_2=EVENT_16D0
        ms_jump_if_flag_clear byte1=0xFF event16_2=EVENT_A9B destination4=byte_804EA41
        ms_init_eStruct200a6a0 ptr1=sub_804C700+1 ptr5=sub_804C71C+1 ptr9=NULL
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin dump_script map once byte_804EA41

# out
        ms_jump_if_flag_clear byte1=0xFF event16_2=EVENT_3A destination4=mapscript_804EA52
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
        ms_set_event_flag byte1=0xFF event16_2=EVENT_16F4
        ms_write_word ptr1=unk_2011EB4 word5=0x08050402
        ms_set_event_flag byte1=0xFF event16_2=EVENT_16F5
        ms_jump_if_progress_in_range byte1=0x00 byte2=0x00 destination3=byte_804EAAC
        ms_jump_if_progress_in_range byte1=0x01 byte2=0x01 destination3=mapscript_804EAC6
        ms_jump destination1=byte_804EEF6
````

OK
