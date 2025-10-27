---
parent: '[[004 Impl dumping for map npc and cutscene scripts]]'
spawned_by: '[[004 Impl dumping for map npc and cutscene scripts]]'
context_type: task
status: todo
---

Parent: [004 Impl dumping for map npc and cutscene scripts](../004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts.md)

Spawned by: [004 Impl dumping for map npc and cutscene scripts](../004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts.md)

Spawned in: [<a name="spawn-task-4eec5d" />^spawn-task-4eec5d](../004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts.md#spawn-task-4eec5d)

# 1 Journal

2025-10-18 Wk 42 Sat - 20:13 +03:00

We give symbol types to many symbols and functions in the bn6f repository, so let's parse them to make use of them in analysis and dumping.

We would then be able to parse table of pointers to tables of pointers ... using the type.

2025-10-18 Wk 42 Sat - 20:15 +03:00

There's a basic example of using trait objects with `Box<dyn T>` in [rbe dyn](https://doc.rust-lang.org/rust-by-example/trait/dyn.html). But we would like to know how to get a concrete type out of a trait object.

[rbe derive](https://doc.rust-lang.org/rust-by-example/trait/derive.html) also includes a list of familiar traits we've deriving like `Clone`, `Debug`, `Eq`, ...

This [stackoverflow answer](https://stackoverflow.com/a/33687996/6944447) shows a way with `Any` and `downcast_ref` The issue is that only tests each variant on its own. Let's create a type type to go with the `SymType` trait.

Though... We could instead of using a `Box<dyn T>` we could have an enum `SymType`, and for most types to include `SymType`. This way we can just match.

2025-10-18 Wk 42 Sat - 21:08 +03:00

![Pasted image 20251018210827.png](../../../../../attachments/Pasted%20image%2020251018210827.png)

So it won't let us derive the traits `PartialEq` and `Eq` for `SymType` since it's a recursive type. It's interesting this makes it conclude SymType and PointerType have infinite size.
