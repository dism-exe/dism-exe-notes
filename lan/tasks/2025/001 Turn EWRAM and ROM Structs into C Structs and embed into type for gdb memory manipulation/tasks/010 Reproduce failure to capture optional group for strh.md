---
parent: '[[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]'
spawned_by: '[[009 Impl Lexon types for whole thumb instructions]]'
context_type: task
status: watch
---

Parent: [001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation](../001%20Turn%20EWRAM%20and%20ROM%20Structs%20into%20C%20Structs%20and%20embed%20into%20type%20for%20gdb%20memory%20manipulation.md)

Spawned by: [009 Impl Lexon types for whole thumb instructions](009%20Impl%20Lexon%20types%20for%20whole%20thumb%20instructions.md)

Spawned in: [<a name="spawn-task-5c84c6" />^spawn-task-5c84c6](009%20Impl%20Lexon%20types%20for%20whole%20thumb%20instructions.md#spawn-task-5c84c6)

# 1 Objective

We are failing to capture on

````rust
// for strh r1, [r0]
const RD_DEREF_RB_OPT_IMM_REGEX: &'static str = r"(r[0-7]), *\[ *(r[0-7])(?:|, *#([^\]]+)) *\]";
LexonType::StrhRbImmThumbOpCode => format!(r"strh {RD_DEREF_RB_OPT_IMM_REGEX}\s*"),
````

And the issue does not seem to only be about optional groups. We'll reproduce the behavior here.

# 2 Journal

2025-11-05 Wk 45 Wed - 02:00 +03:00

````sh
# in /home/lan/src/cloned/gh/LanHikari22/rs_repro
regex=$(cat <<'EOF'
this is(?:| an) (?:cool|item)
EOF
)
str=$(cat <<'EOF'
this is cool
EOF
)
cargo run --bin rs_repro --features "repro004" "$regex" "$str"

# out (relevant)
regex: this is(?:| an) (?:cool|item)
str: this is cool
matches: ["this is cool"]
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/rs_repro
regex=$(cat <<'EOF'
this is(?:| an) (?:cool|item)
EOF
)
str=$(cat <<'EOF'
this is an item
EOF
)
cargo run --bin rs_repro --features "repro004" "$regex" "$str"

# out (relevant)
regex: this is(?:| an) (?:cool|item)
str: this is an item
matches: ["this is an item"]
````

So it is able to process optional groups in this format.

2025-11-05 Wk 45 Wed - 02:44 +03:00

````sh
# in /home/lan/src/cloned/gh/LanHikari22/rs_repro
regex=$(cat <<'EOF'
strh (r[0-7]), *\[ *(r[0-7])(?:|, *#([^\]]+)) *\]
EOF
)
str=$(cat <<'EOF'
strh r1, [r0]
EOF
)
cargo run --bin rs_repro --features "repro004" "$regex" "$str"

# out (error, relevant)
thread 'main' panicked at src/repro_tracked/repro004_regex_tester.rs:42:14:
Could not parse regex: "Failed to capture"
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

Then why does this fail?

````sh
# in /home/lan/src/cloned/gh/LanHikari22/rs_repro
regex=$(cat <<'EOF'
this is(?:| an (?:extraordinary)) (?:cool|item)
EOF
)
str=$(cat <<'EOF'
this is an extraordinary item
EOF
)
cargo run --bin rs_repro --features "repro004" "$regex" "$str"

# out (relevant)
regex: this is(?:| an (?:extraordinary)) (?:cool|item)
str: this is an extraordinary item
matches: ["this is an extraordinary item"]
````

It's not due to an inner group.

2025-11-05 Wk 45 Wed - 03:19 +03:00

~~Wait the `[` and `]` are not escaped.~~ and they're not supposed to be. We want to match everything but an `\]`.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/rs_repro
regex=$(cat <<'EOF'
this is(?:| an \[([^\[]+)\]) (?:cool|item)
EOF
)
str=$(cat <<'EOF'
this is an [expensive] item
EOF
)
cargo run --bin rs_repro --features "repro004" "$regex" "$str"

# out (relevant)
regex: this is(?:| an \[([^\[]+)\]) (?:cool|item)
str: this is an [expensive] item
matches: ["this is an [expensive] item", "expensive"]
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/rs_repro
regex=$(cat <<'EOF'
strh (r[0-7]), *\[ *(r[0-7])(?:|) *\]
EOF
)
str=$(cat <<'EOF'
strh r1, [r0]
EOF
)
cargo run --bin rs_repro --features "repro004" "$regex" "$str"

# out (error, relevant)
regex: strh (r[0-7]), *\[ *(r[0-7])(?:|) *\]
str: strh r1, [r0]
matches: ["strh r1, [r0]", "r1", "r0"]
````

This part matches when replacing `(?:|, *#([^\]]+))` $\to$ `(?:|)`.

2025-11-05 Wk 45 Wed - 03:31 +03:00

````sh
# in /home/lan/src/cloned/gh/LanHikari22/rs_repro
regex=$(cat <<'EOF'
this is a cool(?:|, *#([^\]]+)) item
EOF
)
str=$(cat <<'EOF'
this is a cool,    #cold item
EOF
)
cargo run --bin rs_repro --features "repro004" "$regex" "$str"

# out (relevant)
regex: this is a cool(?:|, *#([^\]]+)) item
str: this is a cool,    #cold item
matches: ["this is a cool,    #cold item", "cold"]
````

We know that `#` can be used for comments in regex, but this did not apply here why?

````rust
// in /home/lan/src/cloned/gh/LanHikari22/rs_repro/src/repro_tracked/repro004_regex_tester.rs
// in fn main
let regex = {
	matches //_
		.get_one::<String>("regex")
		.unwrap()
		.to_string()
};
````

We also don't use `r""`.

2025-11-05 Wk 45 Wed - 03:40 +03:00

````sh
# in /home/lan/src/cloned/gh/LanHikari22/rs_repro
regex=$(cat <<'EOF'
strh (r[0-7]), *\[ *(r[0-7])(?:|, *#([^\]]+)) *\]
EOF
)
str=$(cat <<'EOF'
strh r1, [r0, #0]
EOF
)
cargo run --bin rs_repro --features "repro004" "$regex" "$str"

# out (error, relevant)
regex: strh (r[0-7]), *\[ *(r[0-7])(?:|, *#([^\]]+)) *\]
str: strh r1, [r0, #0]
matches: ["strh r1, [r0, #0]", "r1", "r0", "0"]
````

It would match if we included an immediate.

2025-11-05 Wk 45 Wed - 03:47 +03:00

````sh
regex=$(cat <<'EOF'
strh (r[0-7]), *\[ *(r[0-7])(?:|, *#([^\]]+)) *\]
EOF
)
echo $regex

# out
strh (r[0-7]), *\[ *(r[0-7])(?:|, *#([^\]]+)) *\]
````

No escaping-related issues with `\]` (llm query).

2025-11-05 Wk 45 Wed - 03:52 +03:00

````sh
# in /home/lan/src/cloned/gh/LanHikari22/rs_repro
regex=$(cat <<'EOF'
strh (r[0-7]), *\[ *(r[0-7])(?:|, *#(?:[^\]]+)) *\]
EOF
)
str=$(cat <<'EOF'
strh r1, [r0]
EOF
)
cargo run --bin rs_repro --features "repro004" "$regex" "$str"

# out (relevant)
regex: strh (r[0-7]), *\[ *(r[0-7])(?:|, *#(?:[^\]]+)) *\]
str: strh r1, [r0]
matches: ["strh r1, [r0]", "r1", "r0"]
````

It actually matches with `(?:|, *#([^\]]+))` $\to$ `(?:|, *#(?:[^\]]+))`

2025-11-05 Wk 45 Wed - 04:23 +03:00

````sh
# in /home/lan/src/cloned/gh/LanHikari22/rs_repro
regex=$(cat <<'EOF'
([A-Za-z_][A-Za-z0-9_]*)(?:| *([A-Za-z_][A-Za-z0-9_]*))
EOF
)
str=$(cat <<'EOF'
golden cat
EOF
)
cargo run --bin rs_repro --features "repro004" "$regex" "$str"

# out (error, relevant)
thread 'main' panicked at src/repro_tracked/repro004_regex_tester.rs:42:14:
Could not parse regex: "Failed to capture"
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/rs_repro
regex=$(cat <<'EOF'
([A-Za-z_][A-Za-z0-9_]*)(?:| *(?:[A-Za-z_][A-Za-z0-9_]*))
EOF
)
str=$(cat <<'EOF'
golden cat
EOF
)
cargo run --bin rs_repro --features "repro004" "$regex" "$str"

# out (relevant)
regex: ([A-Za-z_][A-Za-z0-9_]*)(?:| *(?:[A-Za-z_][A-Za-z0-9_]*))
str: golden cat
matches: ["golden", "golden"]
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/rs_repro
regex=$(cat <<'EOF'
([A-Za-z_][A-Za-z0-9_]*)(?:| *([A-Za-z_][A-Za-z0-9_]*))
EOF
)
str=$(cat <<'EOF'
golden
EOF
)
cargo run --bin rs_repro --features "repro004" "$regex" "$str"

# out (error, relevant)
thread 'main' panicked at src/repro_tracked/repro004_regex_tester.rs:42:14:
Could not parse regex: "Failed to capture"
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

2025-11-05 Wk 45 Wed - 05:27 +03:00

````sh
# in /home/lan/src/cloned/gh/LanHikari22/rs_repro
regex=$(cat <<'EOF'
([A-Za-z_][A-Za-z0-9_]*)(?:| *([A-Za-z_][A-Za-z0-9_]*))
EOF
)
str=$(cat <<'EOF'
golden cat
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

# out
<re.Match object; span=(0, 6), match='golden'>
````

It's not matching `golden cat` in python either. `golden` here is a correct match, so it probably just stopped.

Original regex:

````sh
# in /home/lan/src/cloned/gh/LanHikari22/rs_repro
regex=$(cat <<'EOF'
strh (r[0-7]), *\[ *(r[0-7])(?:|, *#([^\]]+)) *\]
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

thread 'main' panicked at src/repro_tracked/repro004_regex_tester.rs:42:14:
Could not parse regex: "Failed to capture"
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

This works fine in python.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/rs_repro
regex=$(cat <<'EOF'
([A-Za-z_][A-Za-z0-9_]*)(?:| *([A-Za-z_][A-Za-z0-9_]*));
EOF
)
str=$(cat <<'EOF'
golden cat;
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

# out
<re.Match object; span=(0, 11), match='golden cat;'>
````

Now this matches the entire string with the `;` added. Now there's no ambiguity. `golden;` or `golden cat;` match, not a substring `golden`.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/rs_repro
regex=$(cat <<'EOF'
([A-Za-z_][A-Za-z0-9_]*)(?:| *([A-Za-z_][A-Za-z0-9_]*));
EOF
)
str=$(cat <<'EOF'
golden cat;
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

# out
<re.Match object; span=(0, 11), match='golden cat;'>

regex: ([A-Za-z_][A-Za-z0-9_]*)(?:| *([A-Za-z_][A-Za-z0-9_]*));
str: golden cat;
matches: ["golden cat;", "golden", "cat"]
````

This works in rust too! ~~We expected the opposite.~~ (We expected the opposite, but for the absence case which indeed fails)

It fails for the absence case  (only for rust):

````sh
# in /home/lan/src/cloned/gh/LanHikari22/rs_repro
regex=$(cat <<'EOF'
([A-Za-z_][A-Za-z0-9_]*)(?:| *([A-Za-z_][A-Za-z0-9_]*));
EOF
)
str=$(cat <<'EOF'
golden;
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
<re.Match object; span=(0, 7), match='golden;'>

thread 'main' panicked at src/repro_tracked/repro004_regex_tester.rs:42:14:
Could not parse regex: "Failed to capture"
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

This might be why it is able to parse `[r0, #0]` but not `[r0]`:

````sh
# in /home/lan/src/cloned/gh/LanHikari22/rs_repro
regex=$(cat <<'EOF'
strh (r[0-7]), *\[ *(r[0-7])(?:|, *#([^\]]+)) *\]
EOF
)
str=$(cat <<'EOF'
strh r1, [r0, #0]
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

# out
<re.Match object; span=(0, 17), match='strh r1, [r0, #0]'>

regex: strh (r[0-7]), *\[ *(r[0-7])(?:|, *#([^\]]+)) *\]
str: strh r1, [r0, #0]
matches: ["strh r1, [r0, #0]", "r1", "r0", "0"]
````

2025-11-05 Wk 45 Wed - 06:06 +03:00

What if we use an alternative form of optional, does the problem persist?

````sh
# in /home/lan/src/cloned/gh/LanHikari22/rs_repro
regex=$(cat <<'EOF'
strh (r[0-7]), *\[ *(r[0-7])(?:, *#([^\]]+))? *\]
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

thread 'main' panicked at src/repro_tracked/repro004_regex_tester.rs:42:14:
Could not parse regex: "Failed to capture"
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

Same issue.

Here is the case with the immediate but for the alternative optional route:

````sh
# in /home/lan/src/cloned/gh/LanHikari22/rs_repro
regex=$(cat <<'EOF'
strh (r[0-7]), *\[ *(r[0-7])(?:, *#([^\]]+))? *\]
EOF
)
str=$(cat <<'EOF'
strh r1, [r0, #0]
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
<re.Match object; span=(0, 17), match='strh r1, [r0, #0]'>

regex: strh (r[0-7]), *\[ *(r[0-7])(?:, *#([^\]]+))? *\]
str: strh r1, [r0, #0]
matches: ["strh r1, [r0, #0]", "r1", "r0", "0"]
````

Works as expected when including the non-absent alternative.

2025-11-05 Wk 45 Wed - 06:55 +03:00

Filed an issue [gh rust-lang/regex #1313](https://github.com/rust-lang/regex/issues/1313).

2025-11-05 Wk 45 Wed - 09:54 +03:00

Closed the issue. As explained in the issue, it was an application problem erroring on valid use of the library.
