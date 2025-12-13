---
parent: '[[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]'
spawned_by: '[[009 Impl Lexon types for whole thumb instructions]]'
context_type: idea
---

Parent: [001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation](../001%20Turn%20EWRAM%20and%20ROM%20Structs%20into%20C%20Structs%20and%20embed%20into%20type%20for%20gdb%20memory%20manipulation.md)

Spawned by: [009 Impl Lexon types for whole thumb instructions](../tasks/009%20Impl%20Lexon%20types%20for%20whole%20thumb%20instructions.md)

Spawned in: [<a name="spawn-idea-5ec335" />^spawn-idea-5ec335](../tasks/009%20Impl%20Lexon%20types%20for%20whole%20thumb%20instructions.md#spawn-idea-5ec335)

# 1 Journal

Found [here](https://github.com/rust-lang/regex?tab=readme-ov-file#usage-avoid-compiling-the-same-regex-in-a-loop):

````rust
use std::sync::LazyLock;

use regex::Regex;

fn some_helper_function(haystack: &str) -> bool {
    static RE: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"...").unwrap());
    RE.is_match(haystack)
}

fn main() {
    assert!(some_helper_function("abc"));
    assert!(!some_helper_function("ac"));
}
````

I compile once per file, but with this, it would become per process and I won't have to change much else for the lexer.

There is also a `Regex::is_match` and `Regex::find` from the README that can be used to speed up process rather than just failing capture! We've only failed capture many times!

The README also contains ways of running benchmarks which can come in handy.

They also have a versioning policy that is used where minor version increments can increment the lowest supported rust version. This can be a good idea if we have dependencies like this to track.

2025-11-06 Wk 45 Thu - 02:54 +03:00

Doesn't seem easy to make this change yet in my bn_repo_editor because of non-constant regex strings. And `LazyLock` requires them to be known in compile time.
