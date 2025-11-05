---
parent: '[[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]'
spawned_by: '[[008 Get rs_repro regex string tester to work]]'
context_type: howto
status: rejected
---

Parent: [001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation](../001%20Turn%20EWRAM%20and%20ROM%20Structs%20into%20C%20Structs%20and%20embed%20into%20type%20for%20gdb%20memory%20manipulation.md)

Spawned by: [008 Get rs_repro regex string tester to work](../tasks/008%20Get%20rs_repro%20regex%20string%20tester%20to%20work.md)

Spawned in: [<a name="spawn-howto-843eb6" />^spawn-howto-843eb6](../tasks/008%20Get%20rs_repro%20regex%20string%20tester%20to%20work.md#spawn-howto-843eb6)

# 1 Journal

2025-08-07 Wk 32 Thu - 22:38

this [reddit post](https://www.reddit.com/r/rust/comments/f2fsi8/can_program_depend_on_the_same_create_twice_but/) seems to suggest the practice is not encouraged nor supported by cargo, but it's also a dated post from 6 years ago as of this writing. They mention a concept of feature additivity which also appears in [cargo #10489](https://github.com/rust-lang/cargo/issues/10489).

They link the [docs on feature unification](https://doc.rust-lang.org/1.59.0/cargo/reference/features.html#feature-unification).

Will close this as not recommended.
