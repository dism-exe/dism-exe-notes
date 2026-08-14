---
context_type: task
status: done
---

Parent: [lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/000 Provide a mod replacement for start screen](../000%20Provide%20a%20mod%20replacement%20for%20start%20screen.md)

Spawned by: [lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/task/002 Impl struct layout parsing from bn6f inc and parse gdb memory xw log](002%20Impl%20struct%20layout%20parsing%20from%20bn6f%20inc%20and%20parse%20gdb%20memory%20xw%20log.md)

Spawned in: [^spawn-task-683000](002%20Impl%20struct%20layout%20parsing%20from%20bn6f%20inc%20and%20parse%20gdb%20memory%20xw%20log.md#spawn-task-683000)

# Journal

2026-08-09 Wk 32 Sun - 00:56 +03:00

Adding test logs that only run during testing, and the arguments should be lazily evaluated so that it has negligible performance impact outside `test`.

https://internals.rust-lang.org/t/pub-on-macro-rules/19358

https://stackoverflow.com/questions/26731243/how-do-i-use-a-macro-across-module-files

2026-08-09 Wk 32 Sun - 14:07 +03:00

regex `captures` will find any match in the stack, so for scanning purposes we should add `^` at the beginning of a regex to indicate it must match the start, not just a pattern in the middle of the haystack.

2026-08-09 Wk 32 Sun - 15:42 +03:00

Alright basic lexical parsing for ram struct `.inc` files looks alright:

````sh
# in /home/lan/src/cloned/cb/lan22h/bn-repo-editor
clear && cargo test --lib -q for_ty_struct_inc_insts::for_impl_exhaustive_scan::basic_tested
````

Though had to pay in test bugs for this:

````rust
// in /home/lan/src/cloned/cb/lan22h/bn-repo-editor/src/util/regex.rs > fn tests::for_fn_exhaustive_scan::basic_tested
let items = exhaustive_scan("(takes some value)    (value 100)", fn_scan).unwrap();

assert_eq!(
	format!("{:?}", items),
	format!("{:?}", vec![("takes", "some value"), ("value", "100")])
);
````

It was a quick hack, but now that we've changed the API of `exhaustive_scan` it still compiles, and it just fails. Better to explicitly `assert_eq` against its structure.

2026-08-09 Wk 32 Sun - 18:16 +03:00

````sh
# in /home/lan/src/cloned/cb/lan22h/bn-repo-editor
git commit # out { [main 3735013] impl lexical analysis for ram struct inc }
````

2026-08-10 Wk 33 Mon - 16:01 +03:00

I need a `test_log` feature flag to allow `test_log` to emit its logs that usually are only used for tests.

https://doc.rust-lang.org/rustc/command-line-arguments.html

`--cfg`

https://stackoverflow.com/a/38040431 `(Answers How to pass rustc flags to cargo?)`

Diagnostics also recommended using a feature:

````toml
# in /home/lan/src/cloned/cb/lan22h/bn-repo-editor/Cargo.toml
[features]
test_log = []
````

````rust
// in /home/lan/src/cloned/cb/lan22h/bn-repo-editor/src/util/util.rs
pub fn test_log(fn_name: &str, msg_fn: impl Fn() -> String) {
    // Takes a function to ensure that the input is lazily evaluated as it will not be used outside
    // tests or on feature "test_log".
    if cfg!(test) || cfg!(feature = "test_log") {
		println!("(fn {fn_name}) | {}", msg_fn());
    }
}
````

````sh
# in /home/lan/src/cloned/cb/lan22h/bn-repo-editor
clear && cargo run --release --features 'test_log' --bin interpret_memory_logs
````

2026-08-10 Wk 33 Mon - 17:35 +03:00

https://stackoverflow.com/a/37988661 `(Answers Regex: match everything but a specific pattern)`

`^(([^f].{2}|.[^o].|.{2}[^o]).*|.{0,2})$`

It's rather awkward but I do not want to use lookahead.

````rust
// in /home/lan/src/cloned/cb/lan22h/bn-repo-editor/src/formats/struct_inc.rs
impl ToRegexSource for Comment {
    fn to_regex_source(&self) -> &'static str {
        match self {
            Comment::Block(_) => r"/\*([^\*]*)\*/\s*",
            Comment::LocInline { .. } => r"// loc=0x([0-9a-fA-F]*)([^\n]*)\n",
            Comment::NonLocInline(_) => r"//(\s*[^\n]*)\n",
        }
    }
}
````

Technically the idea was that `NonLocInline` would only check for *remaining* matches after `LocInline`. But I just list all matches for all variants.

Renaming `NonLocInline` to just `Inline`, and we'll let the regex matches consumer handle not replacing `loc`s.

2026-08-10 Wk 33 Mon - 17:50 +03:00

There are some observed inconsistent exceptions to the rule that every member definition includes a `// loc=0x` comment. Rather than requiring the parser to handle this, we just fix the source code.

2026-08-10 Wk 33 Mon - 18:43 +03:00

Now we're able to read `/home/lan/src/cloned/gh/dism-exe/bn6f/include/structs/GameState.inc`! Lexical analysis, comment preprocessing, line processor constraints checked, and memory layout constructed from the file!

````sh
# in /home/lan/src/cloned/cb/lan22h/bn-repo-editor
git commit # out { [main 21219c9] impl reading memory layout from struct inc files }
````
