---
parent: "[[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]"
spawned_by: "[[006 Resolving include keys issues for lexer include chunks]]"
context_type: issue
status: todo
---

Parent: [[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]

Spawned by: [[006 Resolving include keys issues for lexer include chunks]] 

Spawned in: [[006 Resolving include keys issues for lexer include chunks#^spawn-issue-405bbd|^spawn-issue-405bbd]]

# 1 Journal

2025-07-18 Wk 29 Fri - 23:15

Escaped quotes in string

```rust
thread '<unnamed>' panicked at src/lexer.rs:557:14:
Scan failed: "\"/home/lan/src/cloned/gh/dism-exe/bn6f/data/textscript/compressed/CompText8742D64.s\":224:6 Failed to scan r\\\"\\n\"\n\t.string "
```

Since we process in parallel, we did not see these panics.

2025-07-20 Wk 29 Sun - 03:02

The suspect line is

```
.string "The \"Healing Water\"\n"
```

Due to unhandled quote escaping. This was captured in `test_lexer_record_scan > case001.1` .

We parsed Healing and Water as if they are idents, and tripped on the final escaped quote...

```
Failed to scan: "Failed to parse around at 28: <r\\\"\\n\"\n                >
```

2025-07-20 Wk 29 Sun - 04:23

The parsing is in the function returned by `lexer.rs > build_scanner` .

Our regex here is not able to accommodate escaped quotes:

```rust
LexonType::String => format!(r##""(.*?)"\s*"##),
```

We should allow any number of escaped quotes.

This is an issue that others have encountered. For example in this [post](https://stackoverflow.com/questions/249791/regex-for-quoted-string-with-escaping-quotes).

There, they recommend 

Similar to [Guy Bedford](https://stackoverflow.com/users/1292590/guy-bedford)'s [answer](https://stackoverflow.com/a/10786066/6944447),

```rust
LexonType::String => format!(r##""([^"\\]*(\\.[^"\\]*)*)"\s*"##),
```

is able to handle escaped quotes within the quotes.

Using the [wiki regex docs](https://en.wikipedia.org/wiki/Regular_expression#POSIX_.28Portable_Operating_System_Interface_.5Bfor_Unix.5D.29) for some meanings.

Breakdown:

| Regex           | Meaning                                                                                                                                                                                                                                                                           |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"(...)"\s*`    | Outer layer. All that we're matching in `...` must be enclosed in quotes, and also consumes any white space. Inner is `[^"\\]*(\\.[^"\\]*)*`.                                                                                                                                     |
| `[^"\\]*`       | Match anything not  `"` or `\`                                                                                                                                                                                                                                                    |
| `(\\.[^"\\]*)*` | This is a composite. Matches `\`, any character, and then anything that is not `"` or `\`.  This allows us to capture `\"` and any other escaped character as it matches the description of `\\.`. This triggers again as we consume the remaining non-escape-related characters. |

2025-08-07 Wk 32 Thu - 21:01

Thanks to [FutureFractal](https://github.com/FutureFractal) for bringing to my attention [vscode cpp syntax regex](https://github.com/Microsoft/vscode/blob/main/extensions/cpp/syntaxes/c.tmLanguage.json) and also specifically [string escape sequences](https://github.com/Microsoft/vscode/blob/main/extensions/cpp/syntaxes/c.tmLanguage.json#L3329)

The string is `"(?x)\\\\ (\n\\\\\t\t\t |\n[abefnprtv'\"?]   |\n[0-3]\\d{,2}\t |\n[4-7]\\d?\t\t|\nx[a-fA-F0-9]{,2} |\nu[a-fA-F0-9]{,4} |\nU[a-fA-F0-9]{,8} )"` . But because it's in JSON, it's being escaped.

```python
print("(?x)\\\\ (\n\\\\\t\t\t |\n[abefnprtv'\"?]   |\n[0-3]\\d{,2}\t |\n[4-7]\\d?\t\t|\nx[a-fA-F0-9]{,2} |\nu[a-fA-F0-9]{,4} |\nU[a-fA-F0-9]{,8} )")

# out
(?x)\\ (
\\                       |
[abefnprtv'"?]   |
[0-3]\d{,2}      |
[4-7]\d?                |
x[a-fA-F0-9]{,2} |
u[a-fA-F0-9]{,4} |
U[a-fA-F0-9]{,8} )
```

2025-08-07 Wk 32 Thu - 21:44

Spawn [[008 Get rs_repro regex string tester to work]] ^spawn-task-594761

2025-08-07 Wk 32 Thu - 23:40

We're unable to compile the above printed regex with rs_repro repro004. 

Spawn [[#4.6 Unable to compile regex for vscode cpp string regex due to repetition quantifier]] ^spawn-issue-072345


Spawn [[001 Unable to compile regex for vscode cpp string regex due to repetition quantifier]] ^spawn-issue-64d4c9


2025-08-07 Wk 32 Thu - 21:46

Attempt to remap the regex string manuaally:

Let's try to fit it within

```rust
LexonType::String => format!(r##""##),
```

```rust
LexonType::String => format!(r##"(?x)\\ (\n\\\t\t\t |\n[abefnprtv'\"?]   |\n[0-3]\\d{,2}\t |\n[4-7]\\d?\t\t|"##),
```


`\nx[a-fA-F0-9]{,2} |\nu[a-fA-F0-9]{,4} |\nU[a-fA-F0-9]{,8} )"`

Breakdown

| Regex       | Meaning |
| ----------- | ------- |
| `"(?x)..."` |         |
|             |         |
