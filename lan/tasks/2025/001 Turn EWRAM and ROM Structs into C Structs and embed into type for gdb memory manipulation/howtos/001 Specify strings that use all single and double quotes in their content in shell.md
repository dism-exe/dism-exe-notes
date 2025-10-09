---
parent: '[[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]'
spawned_by: '[[008 Get rs_repro regex string tester to work]]'
context_type: howto
status: todo
---

Parent: [001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation](../001%20Turn%20EWRAM%20and%20ROM%20Structs%20into%20C%20Structs%20and%20embed%20into%20type%20for%20gdb%20memory%20manipulation.md)

Spawned by: [008 Get rs_repro regex string tester to work](../tasks/008%20Get%20rs_repro%20regex%20string%20tester%20to%20work.md)

Spawned in: [<a name="spawn-howto-94f49b" />^spawn-howto-94f49b](../tasks/008%20Get%20rs_repro%20regex%20string%20tester%20to%20work.md#spawn-howto-94f49b)

# 1 Journal

This [post](https://sqlpey.com/bash/bash-quoting-single-quotes/#faqs-on-bash-effectively-quoting-strings-with-single-quotes) mentions a `$''` syntax in bash that could be used and would require escaping single quotes.

It also mentions the multiline method

````sh
str=$(cat <<'EOF'
Text with "double quotes" and 'single quotes!'
EOF
)
````
