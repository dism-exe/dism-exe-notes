---
parent: "[[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]"
spawned_by: "[[008 Get rs_repro regex string tester to work]]"
context_type: howto
status: todo
---

Parent: [[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]

Spawned by: [[008 Get rs_repro regex string tester to work]] 

Spawned in: [[008 Get rs_repro regex string tester to work#^spawn-howto-94f49b|^spawn-howto-94f49b]]

# 1 Journal

This [post](https://sqlpey.com/bash/bash-quoting-single-quotes/#faqs-on-bash-effectively-quoting-strings-with-single-quotes) mentions a `$''` syntax in bash that could be used and would require escaping single quotes.

It also mentions the multiline method

```sh
str=$(cat <<'EOF'
Text with "double quotes" and 'single quotes!'
EOF
)
```

