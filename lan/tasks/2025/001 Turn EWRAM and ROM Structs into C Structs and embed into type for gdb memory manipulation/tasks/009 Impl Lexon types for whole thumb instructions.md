---
parent: '[[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]'
spawned_by: '[[001 Investigating slow bn repo lexer]]'
context_type: task
status: todo
---

Parent: [001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation](../001%20Turn%20EWRAM%20and%20ROM%20Structs%20into%20C%20Structs%20and%20embed%20into%20type%20for%20gdb%20memory%20manipulation.md)

Spawned by: [001 Investigating slow bn repo lexer](../investigations/001%20Investigating%20slow%20bn%20repo%20lexer.md)

Spawned in: [<a name="spawn-task-c84e3d" />^spawn-task-c84e3d](../investigations/001%20Investigating%20slow%20bn%20repo%20lexer.md#spawn-task-c84e3d)

# 1 Journal

2025-11-04 Wk 45 Tue - 07:47 +03:00

From [GBATEK GBA Technical Data](https://problemkaputt.de/gbatek.htm#gbatechnicaldata), we can tell we're running `ARM7TDMI 32bit RISC CPU` with ISA summary in [GBATEK Thumb Instruction Summary](https://problemkaputt.de/gbatek.htm#thumbinstructionsummary).

There is also the [ARM ARM7TDMI Thumb ISA](https://developer.arm.com/documentation/ddi0210/c/Introduction/Instruction-set-summary/Thumb-instruction-summary) ARM docs.

Lucky also made some regex parsing of thumb opcodes in `tools/analyze_source/opcodes.py`

Let's try to reimplement it from lucky's work:

Spawn [001 Regex Transformations for Thumb ISA](../entries/001%20Regex%20Transformations%20for%20Thumb%20ISA.md) <a name="spawn-entry-2f8763" />^spawn-entry-2f8763

2025-11-04 Wk 45 Tue - 10:14 +03:00

All created. What remains is parsing the data for each format.

2025-11-04 Wk 45 Tue - 10:22 +03:00

Since rust compilation gives warnings, now we remove `_` and convert many of these to CamelCase.

````
warning: variant `Mov_flagPseudoThumbOpCode` should have an upper camel case name
   --> src/lexer.rs:314:5
    |
314 |     Mov_flagPseudoThumbOpCode,
    |     ^^^^^^^^^^^^^^^^^^^^^^^^^ help: convert the identifier to upper camel case: `MovFlagPseudoThumbOpCode`
````

2025-11-04 Wk 45 Tue - 10:26 +03:00

````
thread '<unnamed>' panicked at src/lexer.rs:821:49:
Failed to compile regex scanner: regex parse error:
    ^lsl ^(r[0-7]), *(r[0-7]), *(#[^,]+)(?!,)\s*
                                        ^^^
error: look-around, including look-ahead and look-behind, is not supported
````

The other problem is that lucky used look-ahead and look-behind which we cannot use. They also tend to have superlinear time complexity so we don't want them.

We need to change the patterns.

2025-11-04 Wk 45 Tue - 10:32 +03:00

[wiki regex](https://en.wikipedia.org/wiki/Regular_expression) shows the look-ahead/behind symbols in a table:

|Assertion|Lookbehind|Lookahead|
|---------|----------|---------|
|Positive|`(?<=pattern)`|`(?=pattern)`|
|Negative|`(?<!pattern)`|`(?!pattern)`|

All those must be replaced.

2025-11-04 Wk 45 Tue - 10:44 +03:00

````
const RD_LABEL_REGEX: &'static str        = r"^(r[0-7]), *(?! )(?!\[)(.+)";
													    ~~~~~~~
````

Why are we consuming all white space and then asserting the next character is not a space?

2025-11-04 Wk 45 Tue - 10:52 +03:00

````rust
const RHD_RHS_REGEX: &'static str         = r"^(r[0-9]|r1[0-2]|sp|lr|pc), *(r1[0-2]|r[0-9]|sp|lr|pc)";
const RD_RS_REGEX: &'static str           = r"^(r[0-7]), *(r[0-7])";
const RD_RS_IMM_REGEX: &'static str       = r"^(r[0-7]), *(r[0-7]), *(#[^,]+)";
const RD_RS_RN_REGEX: &'static str        = r"^(r[0-7]), *(r[0-7]), *(r[0-7])";
const RD_IMM_REGEX: &'static str          = r"^(r[0-7]), *(#[^,]+)";
const RD_SP_IMM_REGEX: &'static str       = r"^(r[0-7]), *sp, *(#[^,]+)";
const SP_OR_SP_SP_IMM_REGEX: &'static str = r"^(sp, *){1,2}(#[^,]+)";
const RHS_REGEX: &'static str             = r"^(r[0-9]|r1[0-2]|sp|lr|pc)";
const RD_LABEL_REGEX: &'static str        = r"^(r[0-7]), *([^\[]+)";
const RD_POOL_REGEX: &'static str         = r"^(r[0-7]), *=([^,]+)";
const RD_DEREF_RB_RO_REGEX: &'static str  = r"^(r[0-7]), *\[ *(r[0-7]), *(r[0-7]) *\]";
const RD_DEREF_RB_IMM_REGEX: &'static str = r"^(r[0-7]), *\[ *(r[0-7])(|, *(#[^\]]+)) *\]";
const RD_DEREF_SP_IMM_REGEX: &'static str = r"^(r[0-7]), *\[ *sp(|, *(#[^\]]+)) *\]";
const RLIST_REGEX: &'static str           = r"^({[^}]+})";
const RB_EXCL_RLIST_REGEX: &'static str   = r"^(r[0-7])!, *({[^}]+})";
const LABEL_OR_IMM_REGEX: &'static str    = r"^(.+)";
````

This is without look-ahead or look-behind. I just removed them though, so we have to test.

````
thread '<unnamed>' panicked at src/lexer.rs:822:49:
Failed to compile regex scanner: regex parse error:
    ^push ^({[^}]+})\s*
            ^
error: repetition operator missing expression
````

This is for

````rust
const RLIST_REGEX: &'static str           = r"^({[^}]+})";
````

which used to be

````rust
rlist_regex = re.compile(r"^({[^}]+})$")
````

We do have to remove the `^` since we're not in the beginning of the string:

````rust
const RHD_RHS_REGEX: &'static str         = r"(r[0-9]|r1[0-2]|sp|lr|pc), *(r1[0-2]|r[0-9]|sp|lr|pc)";
const RD_RS_REGEX: &'static str           = r"(r[0-7]), *(r[0-7])";
const RD_RS_IMM_REGEX: &'static str       = r"(r[0-7]), *(r[0-7]), *(#[^,]+)";
const RD_RS_RN_REGEX: &'static str        = r"(r[0-7]), *(r[0-7]), *(r[0-7])";
const RD_IMM_REGEX: &'static str          = r"(r[0-7]), *(#[^,]+)";
const RD_SP_IMM_REGEX: &'static str       = r"(r[0-7]), *sp, *(#[^,]+)";
const SP_OR_SP_SP_IMM_REGEX: &'static str = r"(sp, *){1,2}(#[^,]+)";
const RHS_REGEX: &'static str             = r"(r[0-9]|r1[0-2]|sp|lr|pc)";
const RD_LABEL_REGEX: &'static str        = r"(r[0-7]), *([^\[]+)";
const RD_POOL_REGEX: &'static str         = r"(r[0-7]), *=([^,]+)";
const RD_DEREF_RB_RO_REGEX: &'static str  = r"(r[0-7]), *\[ *(r[0-7]), *(r[0-7]) *\]";
const RD_DEREF_RB_IMM_REGEX: &'static str = r"(r[0-7]), *\[ *(r[0-7])(|, *(#[^\]]+)) *\]";
const RD_DEREF_SP_IMM_REGEX: &'static str = r"(r[0-7]), *\[ *sp(|, *(#[^\]]+)) *\]";
const RLIST_REGEX: &'static str           = r"({[^}]+})";
const RB_EXCL_RLIST_REGEX: &'static str   = r"(r[0-7])!, *({[^}]+})";
const LABEL_OR_IMM_REGEX: &'static str    = r"(.+)";
````

But it's the same deal:

````
thread '<unnamed>' panicked at src/lexer.rs:822:49:
Failed to compile regex scanner: regex parse error:
    ^push ({[^}]+})\s*
           ^
error: repetition operator missing expression
````

Let's escape it:

````
const RLIST_REGEX: &'static str           = r"(\{[^\}]+\})";
const RB_EXCL_RLIST_REGEX: &'static str   = r"(r[0-7])!, *(\{[^\}]+\})";
````

2025-11-04 Wk 45 Tue - 11:09 +03:00

Some data we get back for the `captures` panics to know how to extract the capture groups:

````
13 captures: ["push {lr}\n\t", "{lr}"]
4 captures: ["mov r0, #\\flag16 >> 8\n\t\tmov r1", "r0", "#\\flag16 >> 8\n\t\tmov r1"]
4 captures: ["mov r0, #0\n\tmov pc", "r0", "#0\n\tmov pc"]
15 captures: ["bl main_initToolkitAndOtherSubsystems // () -> ()\n\t", "main_initToolkitAndOtherSubsystems // () -> ()"]
15 captures: ["b _GameEntryPoint\n\t", "_GameEntryPoint"]
8 captures: ["ldr r2, =word_200DCF0\n\tldrh r1, ", "r2", "=word_200DCF0\n\tldrh r1, "]
````

Many of these aren't lexing right.

We need to ensure we don't parse past the line we're in. And we also need to exclude comments. There also are 16 formats, and we're only seeing 4 so far.

2025-11-05 Wk 45 Wed - 00:59 +03:00

Wrote some tests to cover some opcodes. Will keep writing for new cases as I pass the old ones.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo test test_thumb_isa

# out (error, relevant)
---- lexer::tests::thumb_isa_tests::test_thumb_isa stdout ----
[1049420::ThreadId(2)] <exhaustively_process_using_scanners>
[1049420::ThreadId(2)] </exhaustively_process_using_scanners 207.642881ms #items: 9>
Expected Records:
0 LexerRecord { lexon_type: MovImmThumbOpCode, lexon_data: RdImm(R2, "0x50"), capture: "mov r2, #0x50\n" }
1 LexerRecord { lexon_type: LslImmThumbOpCode, lexon_data: RdRsImm(R2, R2, "8"), capture: "lsl r2, 2, #8\n" }
2 LexerRecord { lexon_type: OrrThumbOpCode, lexon_data: RdRs(R1, R2), capture: "orr r1, r2\n" }
3 LexerRecord { lexon_type: StrhRbImmThumbOpCode, lexon_data: RdDerefRbOptImm(R1, R0, None), capture: "strh r1, [r0]\n" }

Actual Records:
0 LexerRecord { lexon_type: MovImmThumbOpCode, lexon_data: RdImm(R2, "0x50"), capture: "mov r2, #0x50\n" }
1 LexerRecord { lexon_type: LslImmThumbOpCode, lexon_data: RdRsImm(R2, R2, "8"), capture: "lsl r2, r2, #8\n" }
2 LexerRecord { lexon_type: OrrThumbOpCode, lexon_data: RdRs(R1, R2), capture: "orr r1, r2\n" }
3 LexerRecord { lexon_type: ThumbOpcode, lexon_data: Ident("strh"), capture: "strh " }
4 LexerRecord { lexon_type: Reg, lexon_data: Ident("r1"), capture: "r1" }
5 LexerRecord { lexon_type: Comma, lexon_data: Sign, capture: ", " }
6 LexerRecord { lexon_type: LBrac, lexon_data: Sign, capture: "[" }
7 LexerRecord { lexon_type: Reg, lexon_data: Ident("r0"), capture: "r0" }
8 LexerRecord { lexon_type: RBrac, lexon_data: Sign, capture: "]" }

thread 'lexer::tests::thumb_isa_tests::test_thumb_isa' panicked at src/lexer.rs:1843:29:
case000_000_lsl_imm: Expected length 4 but got 9
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

It's falling back to parsing parts. Need to look into `StrhRbImmThumbOpCode`.

its regex:

````rust
// for strh r1, [r0]
const RD_DEREF_RB_OPT_IMM_REGEX: &'static str = r"(r[0-7]), *\[ *(r[0-7])(?:|, *#([^\]]+)) *\]";
LexonType::StrhRbImmThumbOpCode => format!(r"strh {RD_DEREF_RB_OPT_IMM_REGEX}\s*"),
````

I've also had to change the regex for IMM in multiple formats: `#([^,\n(?:\/\/)]+)`, to have the `#` outside the capture and also add more exceptions than just `,`. It was eating new lines and it shouldn't, and it also should stop at comments. Didn't abstract it out since those are all constant strings, although there should be a way to substitute that data in, or just turn the consts into functions, but not sure if needed here.

2025-11-05 Wk 45 Wed - 01:24 +03:00

Without `(?:|, *#([^\]]+))` it would capture. But this should mean nothing or...

We can use zero or one syntax instead `(?:, *#([^\]]+))?`

2025-11-05 Wk 45 Wed - 01:36 +03:00

Where would be the spec for the regular expression used here?

We're using [docs.rs regex](https://docs.rs/regex/latest/regex/) ([gh](https://github.com/rust-lang/regex)) which uses [docs.rs regex_syntax](https://docs.rs/regex-syntax/latest/regex_syntax/)

2025-11-05 Wk 45 Wed - 04:21 +03:00

[RFC9485](https://www.rfc-editor.org/rfc/rfc9485) is a proposed minimal feature spec for regular expressions.

2025-11-05 Wk 45 Wed - 05:20 +03:00

[gh rust-lang/regex #955](https://github.com/rust-lang/regex/issues/955) Some interesting reasoning here and similarities between the regex crate and others like [gh google/re2](https://github.com/google/re2). RE2 document the syntax [here](https://github.com/google/re2/wiki/Syntax).

2025-11-05 Wk 45 Wed - 02:00 +03:00

Spawn [010 Reproduce failure to capture optional group for strh](010%20Reproduce%20failure%20to%20capture%20optional%20group%20for%20strh.md) <a name="spawn-task-5c84c6" />^spawn-task-5c84c6

2025-11-05 Wk 45 Wed - 04:56 +03:00

Spawn [000 Can use LazyLock to compile regex only once](../ideas/000%20Can%20use%20LazyLock%20to%20compile%20regex%20only%20once.md) <a name="spawn-idea-5ec335" />^spawn-idea-5ec335

2025-11-05 Wk 45 Wed - 06:31 +03:00

Python regex library: [docs.python.org re](https://docs.python.org/3/library/re.html)
