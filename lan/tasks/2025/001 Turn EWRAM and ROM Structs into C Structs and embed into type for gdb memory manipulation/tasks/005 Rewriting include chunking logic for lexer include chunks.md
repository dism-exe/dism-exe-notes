---
parent: '[[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]'
spawned_by: '[[003 Map current lexer project files to include chunks]]'
context_type: task
status: todo
---

Parent: [001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation](../001%20Turn%20EWRAM%20and%20ROM%20Structs%20into%20C%20Structs%20and%20embed%20into%20type%20for%20gdb%20memory%20manipulation.md)

Spawned by: [003 Map current lexer project files to include chunks](003%20Map%20current%20lexer%20project%20files%20to%20include%20chunks.md)

Spawned in: [<a name="spawn-task-bed020" />^spawn-task-bed020](003%20Map%20current%20lexer%20project%20files%20to%20include%20chunks.md#spawn-task-bed020)

# 1 Journal

2025-07-17 Wk 29 Thu - 09:10

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release -- gen_debug_elf
````

````
thread 'main' panicked at src/lexer_include_chunks.rs:102:69:
index out of bounds: the len is 0 but the index is 0
````

This is a fault in `lexer_include_chunks.rs > split_by_include_directive`,

Specifically for `iwram_code.s`:

````sh
cat ~/src/cloned/gh/dism-exe/bn6f/iwram_code.s

# out
        .text
asm38:
        .include "asm/asm38.s"
````

````
path "/home/lan/data/apps/bn_repo_editor/lexer/iwram_code.lexer.ron"
chunks [([LexerRecord { lexon_type: Directive, lexon_data: Word("text"), capture: ".text\n" }, LexerRecord { lexon_type: ColonLabel, lexon_data: Word("asm38"), capture: "asm38:\n\t" }], Some(LexerRecord { lexon_type: Directive, lexon_data: Word("include"), capture: ".include " })), ([], Some(LexerRecord { lexon_type: String, lexon_data: Text("asm/asm38.s"), capture: "\"asm/asm38.s\"" }))]
cur_chunks [LexerRecord { lexon_type: Directive, lexon_data: Word("text"), capture: ".text\n" }, LexerRecord { lexon_type: ColonLabel, lexon_data: Word("asm38"), capture: "asm38:\n\t" }]
cur_sep LexerRecord { lexon_type: Directive, lexon_data: Word("include"), capture: ".include " }
nxt_chunks []
````

We can see `chunks` is a vector of records and optional separator. The first has the `.include` separator as expected, while the second chunk.

2025-07-17 Wk 29 Thu - 09:50

We're running into logical problems here because there are two tokens we're trying to split on. First the `.include` and its associated input. It would be cleaner to rewrite this such that we first join them together as a single cohesive unit. Then we just split by that cohesive unit.

2025-07-17 Wk 29 Thu - 10:40

Logic was rewritten to map into `Rec` or `Incl` variants, `Rec` being a normal record and `Incl` would have both the `.include` token and the string path token. Then it is just a matter of doing an inclusive split by this `Incl` variant, and unwrapping redundant `Rec`  for the other records.

Running into this issue now in the redundant unwrapping logic:

````
thread 'main' panicked at src/lexer_include_chunks.rs:69:50:
Did not expect Incl when unwrapping Rec
````

There is a scenario where a chunk seems to only include an `.include {path}` dual tokens.

2025-07-17 Wk 29 Thu - 11:07

Had to also ensure that we filter out the `{path}` tokens when mapping dual tokens, or they will remain there when we grab them as a next-record and yet process them next iteration.

````
thread 'main' panicked at src/lexer_include_chunks.rs:303:37:
Separators are includes only. Instead in "/home/lan/data/apps/bn_repo_editor/lexer/data/textscript/compressed/CompText87557A8.lexer.ron" got LexerRecord { lexon_type: Ident, lexon_data: Word("ts_end"), capture: "ts_end" }
````

2025-07-18 Wk 29 Fri - 20:35

````
sep is Rec(LexerRecord { lexon_type: Ident, lexon_data: Word("CompText876E538_unk100"), capture: "CompText876E538_unk100" })

thread 'main' panicked at src/lexer_include_chunks.rs:323:37:
Separators are includes only. Instead in "/home/lan/data/apps/bn_repo_editor/lexer/data/textscript/compressed/CompText876E538.lexer.ron" got LexerRecord { lexon_type: Ident, lexon_data: Word("CompText876E538_unk100"), capture: "CompText876E538_unk100" }
````

Error seems to have changed slightly...

````
SEP(>1): Rec(LexerRecord { lexon_type: Ident, lexon_data: Word("CompText87A39FC_unk4"), capture: "CompText87A39FC_unk4" })
````

The issue is because we assume all chunks with more than one element end with a separator. This is not the case. There can always be chunks that are not the last chunk, and that contain multiple records. But we can just directly check if it's an Incl variant.
