---
parent: '[[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]'
spawned_by: '[[000 Panics when processing Lexer files]]'
context_type: issue
status: todo
---

Parent: [001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation](../001%20Turn%20EWRAM%20and%20ROM%20Structs%20into%20C%20Structs%20and%20embed%20into%20type%20for%20gdb%20memory%20manipulation.md)

Spawned by: [000 Panics when processing Lexer files](000%20Panics%20when%20processing%20Lexer%20files.md)

Spawned in: [<a name="spawn-issue-64d4c9" />^spawn-issue-64d4c9](000%20Panics%20when%20processing%20Lexer%20files.md#spawn-issue-64d4c9)

# 1 Journal

````sh
# in /home/lan/src/cloned/gh/LanHikari22/rs_repro
regex=$(cat <<'EOF'
(?x)\\ (
\\                       |
[abefnprtv'"?]   |
[0-3]\d{,2}      |
[4-7]\d?                |
x[a-fA-F0-9]{,2} |
u[a-fA-F0-9]{,4} |
U[a-fA-F0-9]{,8} )
EOF
)
str=$(cat <<'EOF'
"Hello"
EOF
)
cargo run --features "repro004" "$regex" "$str"

# out (relevant)
thread 'main' panicked at src/repro_tracked/repro004_regex_tester.rs:35:33:
Invalid regex: Syntax(
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
regex parse error:
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
1: (?x)\\ (
2: \\                       |
3: [abefnprtv'"?]   |
4: [0-3]\d{,2}      |
           ^
5: [4-7]\d?                |
6: x[a-fA-F0-9]{,2} |
7: u[a-fA-F0-9]{,4} |
8: U[a-fA-F0-9]{,8} )
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
error: repetition quantifier expects a valid decimal
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/rs_repro
regex=$(cat <<'EOF'
(?x)\\\\ (\n\\\\\t\t\t |\n[abefnprtv'\"?]   |\n[0-3]\\d{,2}\t |\n[4-7]\\d?\t\t|\nx[a-fA-F0-9]{,2} |\nu[a-fA-F0-9]{,4} |\nU[a-fA-F0-9]{,8} )
EOF
)
str=$(cat <<'EOF'
"Hello"
EOF
)
cargo run --features "repro004" "$regex" "$str"

# out (relevant)
Invalid regex: Syntax(
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
regex parse error:
    (?x)\\\\ (\n\\\\\t\t\t |\n[abefnprtv'\"?]   |\n[0-3]\\d{,2}\t |\n[4-7]\\d?\t\t|\nx[a-fA-F0-9]{,2} |\nu[a-fA-F0-9]{,4} |\nU[a-fA-F0-9]{,8} )
                                                            ^
error: repetition quantifier expects a valid decimal
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
)
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````
