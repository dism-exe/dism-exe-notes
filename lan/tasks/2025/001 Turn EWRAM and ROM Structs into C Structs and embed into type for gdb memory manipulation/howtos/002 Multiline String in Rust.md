---
parent: '[[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]'
spawned_by: '[[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]'
context_type: howto
status: done
---

Parent: [001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation](../001%20Turn%20EWRAM%20and%20ROM%20Structs%20into%20C%20Structs%20and%20embed%20into%20type%20for%20gdb%20memory%20manipulation.md)

Spawned by: [001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation](../001%20Turn%20EWRAM%20and%20ROM%20Structs%20into%20C%20Structs%20and%20embed%20into%20type%20for%20gdb%20memory%20manipulation.md)

Spawned in: [<a name="spawn-howto-6df57b" />^spawn-howto-6df57b](../001%20Turn%20EWRAM%20and%20ROM%20Structs%20into%20C%20Structs%20and%20embed%20into%20type%20for%20gdb%20memory%20manipulation.md#spawn-howto-6df57b)

# 1 Journal

2025-07-18 Wk 29 Fri - 23:27

For my unit tests, I would like to be able to write multiline strings that preserve the indentation I want.

I have done something for this before...

Yes! In my dbmint work.

Like this:

````rust
r#"
    @   thumb_func_start call_m4aSoundMain
    call_m4aSoundMain:
    @   push {lr}
    @   bl m4aSoundMain
    @   pop {pc}
    @   .word unk_2006840
    @   .word dword_80005BC
    @   .balign 4, 0
    dword_80005BC: .hword 0x121c
    @   .asciz "%D"
    @   .balign 4, 0
    @   thumb_func_end call_m4aSoundMain
"#//_
	.replace("    ", "")
	.replace("@", " "),
````

This way indentation is preserved how I want it, and the code itself is hygienic and doesn't  mess around with the indent level of the function content.
