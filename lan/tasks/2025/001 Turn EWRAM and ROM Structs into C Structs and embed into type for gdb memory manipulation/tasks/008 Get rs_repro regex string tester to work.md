---
parent: "[[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]"
spawned_by: "[[000 Panics when processing Lexer files]]"
context_type: task
status: todo
---

Parent: [[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]

Spawned by: [[000 Panics when processing Lexer files]] 

Spawned in: [[000 Panics when processing Lexer files#^spawn-task-594761|^spawn-task-594761]]

# 1 Journal

2025-08-07 Wk 32 Thu - 21:46

We need to test regex strings quickly. Let's get an example CLI in rs_repro to allow us to do this.

2025-08-07 Wk 32 Thu - 22:12

this [`regex_capture_once`](https://github.com/LanHikari22/bn_repo_editor/blob/9b91454b165030f64f1af271d7272c2ec8157b15/src/lexer.rs#L370) use is how we process regex strings in [bn_repo_editor](https://github.com/LanHikari22/bn_repo_editor/tree/main). Let's reproduce this. 

2025-08-07 Wk 32 Thu - 22:30

We need to import [lan-rs-common](https://github.com/LanHikari22/lan_rs_common) but it allows different feature configurations. And each repro should be minimial with the feature set it requires. For example for regex, as of now, no features are required. 

Spawn [[000 Specify multiple optional dependencies with different names to be used by features in Cargo.toml for rust]] ^spawn-howto-843eb6


2025-08-07 Wk 32 Thu - 23:04

That doesn't seem recommended... So I guess we hit a limit with repros in rs_repro being minimal. Either import all of [lan-rs-common](https://github.com/LanHikari22/lan_rs_common) features reproduced or not.

2025-08-07 Wk 32 Thu - 23:14

Let's test for the regex string  `"([^"\\]*(\\.[^"\\]*)*)"\s*` But this has quotes in it and is tricky to put as an argument. 

Spawn [[001 Specify strings that use all single and double quotes in their content in shell]] ^spawn-howto-94f49b


2025-08-07 Wk 32 Thu - 23:37

We can see this regex is able to handle strings with escaped quotes in them,

```sh
# in /home/lan/src/cloned/gh/LanHikari22/rs_repro
regex=$(cat <<'EOF'
"([^"\\]*(\\.[^"\\]*)*)"\s*
EOF
)
str=$(cat <<'EOF'
"Hello \"beep\""
EOF
)
cargo run --features "repro004" "$regex" "$str"

# out (relevant)
regex: "([^"\\]*(\\.[^"\\]*)*)"\s*
str: "Hello \"beep\""
matches: ["\"Hello \\\"beep\\\"\"", "Hello \\\"beep\\\"", "\\\""]
```

But not plain strings,

```sh
# in /home/lan/src/cloned/gh/LanHikari22/rs_repro
regex=$(cat <<'EOF'
"([^"\\]*(\\.[^"\\]*)*)"\s*
EOF
)
str=$(cat <<'EOF'
"Hello"
EOF
)
cargo run --features "repro004" "$regex" "$str"

# out (relevant)
regex: "([^"\\]*(\\.[^"\\]*)*)"\s*
str: "Hello"
Could not parse regex: "Failed to capture"
```