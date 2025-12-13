---
parent: '[[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]'
spawned_by: '[[001 Investigating slow bn repo lexer]]'
context_type: task
status: done
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

2025-11-05 Wk 45 Wed - 07:39 +03:00

Issue is reproduced, but if we can't use optional capture groups, we have to handle this differently.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/rs_repro
regex=$(cat <<'EOF'
strh (r[0-7]), *\[ *(r[0-7])(|, *#(?:[^\]]+)) *\]
EOF
)
str=$(cat <<'EOF'
strh r1, [r0]
EOF
)
py_script=$(cat <<'EOF'
import re, sys
regex = sys.argv[1]
s = sys.argv[2]
print(re.match(regex, s))
EOF
)
python3 -c $py_script "$regex" "$str"
cargo run --bin rs_repro --features "repro004" "$regex" "$str"

# out (relevant)
<re.Match object; span=(0, 13), match='strh r1, [r0]'>

regex: strh (r[0-7]), *\[ *(r[0-7])(|, *#(?:[^\]]+)) *\]
str: strh r1, [r0]
matches: ["strh r1, [r0]", "r1", "r0", ""]
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/rs_repro
regex=$(cat <<'EOF'
strh (r[0-7]), *\[ *(r[0-7])(|, *#(?:[^\]]+)) *\]
EOF
)
str=$(cat <<'EOF'
strh r1, [r0, #5]
EOF
)
py_script=$(cat <<'EOF'
import re, sys
regex = sys.argv[1]
s = sys.argv[2]
print(re.match(regex, s))
EOF
)
python3 -c $py_script "$regex" "$str"
cargo run --bin rs_repro --features "repro004" "$regex" "$str"

# out (relevant)
<re.Match object; span=(0, 17), match='strh r1, [r0, #5]'>

regex: strh (r[0-7]), *\[ *(r[0-7])(|, *#(?:[^\]]+)) *\]
str: strh r1, [r0, #5]
matches: ["strh r1, [r0, #5]", "r1", "r0", ", #5"]
````

This should work for both cases. We capture the presence or absence either way. It will require us on presence to just remove `, *#`.

2025-11-05 Wk 45 Wed - 10:15 +03:00

Now we have to update the code based on captures being nullable. Shouldn't have suppressed this.

2025-11-06 Wk 45 Thu - 03:29 +03:00

Okay so regex compilation and precedence sorting now happens once per execution, passed down to anything that needs it since it only needs to be computed once. Even in the tests, this reduced our runtime cost by a lot:

````
[562090::ThreadId(2)] </exhaustively_process_using_scanners 194.431754ms #items: 4>
[609727::ThreadId(2)] </exhaustively_process_using_scanners 4.393535ms #items: 4>
````

Since with the tests, they recomputed it for every item.

For the application, this should also mean that we do not recompute it for every file, but only once, distributed for all files.

2025-11-06 Wk 45 Thu - 04:01 +03:00

All thumb ISA tests pass so far! Now to make more! Remaining untested formats: `RhdRhs, RdSpImm, SpOrSpSpImm, Rhs, RdLabel, RdPool, RList, RbExclRList, RdDerefSpOptImm`

2025-11-06 Wk 45 Thu - 04:06 +03:00

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
git commit -m "implementing thumb isa opcode lexon types"

# out
[main 51c381e] implementing thumb isa opcode lexon types
 1 file changed, 1275 insertions(+), 209 deletions(-)
````

2025-11-06 Wk 45 Thu - 05:10 +03:00

Finished writing tests for `cargo test test_thumb_isa` with the remaining cases. Now to finish implementing the captures for all of them and pass `case000_003_remaining_formats`.

2025-11-06 Wk 45 Thu - 05:19 +03:00

````
thread 'lexer::tests::thumb_isa_tests::test_thumb_isa' panicked at src/lexer.rs:1160:25:
6 captures: ["sp, ", "0x10 "]
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

It's unclear whether we get `sp, ` or `sp, sp, ` so we need to modify this regex:

````rust
const SP_OR_SP_SP_IMM_REGEX: &'static str = r"(sp, *){1,2}#([^,\n(?:\/\/)]+)";
````

to

````rust
const SP_OR_SP_SP_IMM_REGEX: &'static str = r"(sp, *|sp, *sp, *)#([^,\n(?:\/\/)]+)";
````

It also looks like it skipped

````rust
// in fn tests::thumb_isa_tests::get_test_data
// in case case000_003_remaining_formats
LexerRecord {
	lexon_type: LexonType::AddSpThumbOpCode,
	lexon_data: LexonData::SpOrSpSpImm(true, "0x20".to_owned()),
	capture: "add sp, sp, #0x20".to_owned(),
},
````

2025-11-06 Wk 45 Thu - 05:36 +03:00

````
thread 'lexer::tests::thumb_isa_tests::test_thumb_isa' panicked at src/lexer.rs:1198:25:
8 captures: ["r0", "byte_8002810\n\nldr r0, =byte_809E8C4\n\npush {lr}\npush {r4,r5,lr}\npush {r0,r1,r3-r7}\npop {pc}\n\nstmia r1!, {r4,r6,r7}\nldmia r0!, {r2,r3}\n\nldr r2, "]
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

````rust
const RD_LABEL_REGEX: &'static str = r"(r[0-7]), *([^\[]+)";
````

This is happening for the instruction

````
ldr r0, byte_8002810
````

That `\[` exclude is wrong for this regex since there's no dereference in this instruction. Need to update it also not to eat into next lines:

````diff
-const RD_LABEL_REGEX: &'static str = r"(r[0-7]), *([^\[]+)";
+const RD_LABEL_REGEX: &'static str = r"(r[0-7]), *([^,\n(?:\/\/)]+)";
````

2025-11-06 Wk 45 Thu - 05:41 +03:00

````
thread 'lexer::tests::thumb_isa_tests::test_thumb_isa' panicked at src/lexer.rs:1269:25:
13 captures: ["{lr}"]
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

````rust
const RLIST_REGEX: &'static str = r"(\{[^\}]+\})";
````

Don't capture the `{}` too:

````rust
const RLIST_REGEX: &'static str = r"\{([^\}]+)\}";
````

````
thread 'lexer::tests::thumb_isa_tests::test_thumb_isa' panicked at src/lexer.rs:1282:25:
14 captures: ["r1", "{r4,r6,r7}"]
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

Same for this

````diff
-const RB_EXCL_RLIST_REGEX: &'static str = r"(r[0-7])!, *(\{[^\}]+\})";
+const RB_EXCL_RLIST_REGEX: &'static str = r"(r[0-7])!, *\{([^\}]+)\}";
````

2025-11-06 Wk 45 Thu - 05:48 +03:00

So this is why it was skipped:

````
1 LexerRecord { lexon_type: AddRhdRhsThumbOpCode, lexon_data: RhdRhs(R0, SP), capture: "add r0, sp" }
2 LexerRecord { lexon_type: Comma, lexon_data: Sign, capture: ", " }
3 LexerRecord { lexon_type: LiteralHash, lexon_data: Sign, capture: "#" }
4 LexerRecord { lexon_type: UInt, lexon_data: UInt(4), capture: "4\n\n" }
5 LexerRecord { lexon_type: AddRhdRhsThumbOpCode, lexon_data: RhdRhs(SP, SP), capture: "add sp, sp" }
````

Just `add r0, sp` was a valid substring...

It did it also for this

````
5 LexerRecord { lexon_type: AddRhdRhsThumbOpCode, lexon_data: RhdRhs(SP, SP), capture: "add sp, sp" }
6 LexerRecord { lexon_type: Comma, lexon_data: Sign, capture: ", " }
7 LexerRecord { lexon_type: LiteralHash, lexon_data: Sign, capture: "#" }
8 LexerRecord { lexon_type: UHex, lexon_data: UHex(32), capture: "0x20\n" }
9 LexerRecord { lexon_type: SubSpThumbOpCode, lexon_data: SpOrSpSpImm(true, "0x10"), capture: "sub sp, #0x10 " }
````

These correspond to `add r0, sp, #4` (`RdSpImm` but parsed partially as `RhdRhs`) and `add sp, sp, #0x20` (`SpOrSpSpImm` but parsed partially as `RhdRhs`).

There's also still `RdSpImm, RdPool` parsing that hasn't been triggered yet.

2025-11-06 Wk 45 Thu - 06:03 +03:00

Let's try to reorder the opcodes scanning to process `RdSpImm` first for add.

````
AddRdRsRnThumbOpCode,
AddRdRsImmThumbOpCode,
AddRdImmThumbOpCode,
AddRhdRhsThumbOpCode,
AddRdSpImmThumbOpCode,
AddSpThumbOpCode,
````

to

````
AddRdSpImmThumbOpCode,
AddRdRsRnThumbOpCode,
AddRdRsImmThumbOpCode,
AddRdImmThumbOpCode,
AddSpThumbOpCode,
AddRhdRhsThumbOpCode,
````

2025-11-06 Wk 45 Thu - 06:14 +03:00

`bx r10` (`Rhs`) got processed as

````
6 LexerRecord { lexon_type: BxThumbOpCode, lexon_data: Rhs(R1), capture: "bx r1" }
7 LexerRecord { lexon_type: UInt, lexon_data: UInt(0), capture: "0\n\n" }
````

````rust
const RHS_REGEX: &'static str = r"(r[0-9]|r1[0-2]|sp|lr|pc)";
````

This doesn't work here. `r1` counts and so it stops. I think I also read all alternations are processed in parallel so I don't think putting `r1[0-2]` first will help but we can try.

It does seem to have helped.

2025-11-06 Wk 45 Thu - 06:23 +03:00

````
thread 'lexer::tests::thumb_isa_tests::test_thumb_isa' panicked at src/lexer.rs:2330:33:
assertion `left == right` failed
  left: "LexerRecord { lexon_type: LdrLabelThumbOpCode, lexon_data: RdLabel(R0, \"=byte_809E8C4\"), capture: \"ldr r0, =byte_809E8C4\\n\\n\" }"
 right: "LexerRecord { lexon_type: LdrPoolThumbOpCode, lexon_data: RdPool(R0, \"byte_809E8C4\"), capture: \"ldr r0, =byte_809E8C4\\n\\n\" }"
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

Label shouldn't have equals.

````diff
-const RD_LABEL_REGEX: &'static str = r"(r[0-7]), *([^,\n(?:\/\/)]+)";
+const RD_LABEL_REGEX: &'static str = r"(r[0-7]), *([^=,\n(?:\/\/)]+)";
````

````
8 LexerRecord { lexon_type: LdrLabelThumbOpCode, lexon_data: RdLabel(R0, ""), capture: "ldr r0, " }
````

Now it grabs a space... Let's prioritize `LdrPoolThumbOpCode` over `LdrLabelThumbOpCode`

````
thread 'lexer::tests::thumb_isa_tests::test_thumb_isa' panicked at src/lexer.rs:1240:25:
9 captures: ["r0", "byte_809E8C4\n\npush {lr}\npush {r4"]
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

````rust
const RD_POOL_REGEX: &'static str = r"(r[0-7]), *=([^,]+)";
````

Should be the same immediate parsing: `([^,\n(?:\/\/)]+)`

````rust
const RD_POOL_REGEX: &'static str = r"(r[0-7]), *=([^,\n(?:\/\/)]+)";
````

2025-11-06 Wk 45 Thu - 06:32 +03:00

````
thread 'lexer::tests::thumb_isa_tests::test_thumb_isa' panicked at src/lexer.rs:2349:33:
assertion `left == right` failed
  left: "LexerRecord { lexon_type: LdrLabelThumbOpCode, lexon_data: RdLabel(R2, \"[sp]\"), capture: \"ldr r2, [sp]\\n\" }"
 right: "LexerRecord { lexon_type: LdrSpImmThumbOpCode, lexon_data: RdDerefSpOptImm(R2, None), capture: \"ldr r2, [sp]\\n\" }"
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

````diff
~~-const RD_LABEL_REGEX: &'static str = r"(r[0-7]), *([^=,\n(?:\/\/)]+)";~~
~~+const RD_LABEL_REGEX: &'static str = r"(r[0-7]), *([^=\[,\n(?:\/\/)]+)";~~
````

Instead let's prioritize `LdrSpImmThumbOpCode` over `LdrLabelThumbOpCode`

2025-11-06 Wk 45 Thu - 06:38 +03:00

All tests pass for thumb opcode ISA!

We made a lot of changes so let's make sure that other tests pass too. Mainly because now that we process instructions, other tests that had instructions in them should not expect the fallback lexons.

We should also process macro structs as one lexon. This can be useful for reading big arrays of structs like `ChipDataArr_8021DA8` when it is dumped.

There are two forms:

````
/*
 map_bg_tileset_header_struct [
      word_count: 0x1330,
      compressed_data_offset: 0x18,
      vram_offset: 0x00000000,
    ]
*/
macro_ident [
	(key: *val,)*
]
````

````
// ms_set_event_flag byte1=0xFF event16_2=0x16D0
macro_ident (key *= *val)+
````

Making it one or more so that idents don't get false positive readings as macros.

Adding the corresponding two lexon types:

````rust
// in enum LexonType
InLineMacro,
MultiLineMacro,
````

with data format

````rust
// in LexonData
MacroKeyVal(String, Vec<(String, String)>),
````

2025-11-06 Wk 45 Thu - 08:48 +03:00

Implementation and testing done for macro parsing!

Let's parse the entire repo now

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
rm -rf /home/lan/data/apps/bn_repo_editor/lexer
rm profile*
cargo run --release --bin bn_repo_editor lexer
````

````
[2342099::ThreadId(24)] </exhaustively_process_using_scanners 42.802955315s #items: 19586>
[2342099::ThreadId(24)] 45.462131176s Writing to "/home/lan/data/apps/bn_repo_editor/lexer/constants/enums/ewram_flags.inc.lexer.ron"
````

Let's also disable the profile and redo it.

````
[2355830::ThreadId(19)] </exhaustively_process_using_scanners 18.490419108s #items: 2670>
[2355830::ThreadId(19)] 25.076399991s Writing to "/home/lan/data/apps/bn_repo_editor/lexer/data/dat38_87.s.lexer.ron"

[2355830::ThreadId(21)] </exhaustively_process_using_scanners 66.140317569s #items: 19586>
[2355830::ThreadId(21)] 67.113495441s Writing to "/home/lan/data/apps/bn_repo_editor/lexer/constants/enums/ewram_flags.inc.lexer.ron"

[2355830::ThreadId(3)] </exhaustively_process_using_scanners 113.560614973s #items: 22886>
[2355830::ThreadId(3)] 124.525479451s Writing to "/home/lan/data/apps/bn_repo_editor/lexer/asm/asm33.s.lexer.ron"

[2355830::ThreadId(11)] </exhaustively_process_using_scanners 455.403900072s #items: 10320>
[2355830::ThreadId(11)] 456.236551587s Writing to "/home/lan/data/apps/bn_repo_editor/lexer/data/dat38_60.s.lexer.ron"
````

`dat38_60.s` used to take 116s so why 455s now?

This was last time:

````
[3099638::ThreadId(10)] </exhaustively_process_using_scanners 116.384681038s #items: 10320>
[3099638::ThreadId(10)] 119.337681619s Writing to "/home/lan/data/apps/bn_repo_editor/lexer/data/dat38_60.s.lexer.ron"
````

2025-11-06 Wk 45 Thu - 10:03 +03:00

This took too longer too

````
[2355830::ThreadId(10)] </exhaustively_process_using_scanners 3976.52647741s #items: 223923>
[2355830::ThreadId(10)] 3976.68434434s Writing to "/home/lan/data/apps/bn_repo_editor/lexer/asm/asm31.s.lexer.ron"
[2355830::ThreadId(10)] File Writing took 709.195711ms
[2355830::ThreadId(10)] Full Scanning took 3977.251679612s
````

This was last time:

````
[3099638::ThreadId(6)] </exhaustively_process_using_scanners 3434.583390021s #items: 771344>
[3099638::ThreadId(6)] 3434.719893148s Writing to "/home/lan/data/apps/bn_repo_editor/lexer/asm/asm31.s.lexer.ron"
[3099638::ThreadId(6)] File Writing took 2.406818129s
[3099638::ThreadId(6)] Full Scanning took 3437.006571157s
````

It didn't get much longer, but the number of items decreased a lot.

Maybe it's related to doing `is_match` and then capture

?
