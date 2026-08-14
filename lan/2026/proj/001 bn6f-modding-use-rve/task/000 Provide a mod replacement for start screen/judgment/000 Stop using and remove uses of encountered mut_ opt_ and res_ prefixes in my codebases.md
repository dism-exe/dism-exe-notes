---
context_type: judgment
status: done
---

Parent: [[lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/000 Provide a mod replacement for start screen]]

Spawned by: [[lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/task/003 Reproduce client server connection to lsp of lsp-cli]]

Spawned in: [[lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/task/003 Reproduce client server connection to lsp of lsp-cli#^spawn-jdgmt-d447fd|^spawn-jdgmt-d447fd]]

# Decision

OK

## Should we prefix with mut_?

We will stop prefixing variables with `mut_` due to the majority reasons below weighing against:

Reasons here are ordered by perceived importance within each category (reasons for, counterarguments, reasons against),

**Reasons for**
- When reading my own code, I can at a glance tell whether a variable is mutable. Moreover, I can always assume immutability at a glance unless specified otherwise.
- In general I wanted to avoid using immutable variables unless I had to, so the extra `mut_` is a marker for this.

**Counterarguments**

- I argued that I could tell whether a variable is mutable at a glance with `mut_`, but the benefits of this are unclear. In general if I write mostly immutable code, and check the context of usage which further indicates immutable usage (accesses, etc), it becomes clear whether a variable is being used in a mutable way or not. There are obvious examples like `.push`, `.insert`, etc. 

**Reasons against**

- Non-standard convention that I have not seen in practice or mentioned anywhere. Likely to confuse people who end up working with me.
	- The standard library does not prefix with anything to mark mutability.
- Sometimes I have to make a mistake writing the silly `let mut mut_`, so I might actually end up writing `let mut_` then get a compiler complaint that my `mut_` variable is not `mut`!
- if we decide to grep for `mut`, we've now polluted the codebase with many `mut_`s. Although this can be handled by filter.

OK

## Should we prefix with opt_?

We will drop use of `opt_` due to its rare application in practice and that it takes us into the habit of diluting the semantic content of a variable name: What is it *about*, rather than the various conditions it must satisfy (optionality, immutability, fallibility, ...).

**Reasons for**

- Adding a prefix to optional values is seen in practice:
	- https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html#the-option-enum
		- Here the rust book explicitly labels the first example with `some_` and `absent_`. Although for pedagogical reasons, it remains that this is a fairly significant semantic change.
	- https://stackoverflow.com/a/26695786
		- Poster claims they have seen `maybe_` in practice.
		- In my crates, grepping for `: Option` to see how values are named which are optional. If you additionally filter this list by `maybe_` you will find 25 out of 11107 hits that really do use it: `maybe_name`, `maybe_range`, and so on. You will even find `optional_` for 18 out of 11107 hits, and ` opt_` for 13 out of 11107 hits. 2 out of 11107 hits for `some_`. `optional_`  has 18 out of 
			- However, None were used in the standard library (no pun intended).
- It is explicit by name that a value is optional. Although I can check the type, it seems quicker at a glance to see that a requested parameter is `opt_` for me.
- Avoiding overshadowing variables, `opt_myvar`  and later pattern arm `myvar` are distinct.

**Reasons against**

- Possible conflicts with standard practice. It is seen in practice, but rarely. The standard library itself does not use it, and it preserves naming for just the semantics of the content and not its optionality.
- `opt_`? `maybe_`? `optional_`? Many inconsistent prefixes exist in practice.
- Compositional noise: I have sometimes ended up naming a variable with a prefix like `res_opt_`. Once these type-level details of how to work with a value are put in the name, then it seems their compositions have to too for consistency.
- If one uses rust-analyzer inlay hints, it could also visually support seeing if a variable is optional at a glance.
	- But note that as of this writing (2026-08-06 Wk 32 Thu - 21:31 +03:00) inlay hints do not have good integration with `cargo fmt`.

OK

## Should we prefix with res_?

It is similar to the above `mut_` and `opt_`. Searching the crates in my registry sources, I do not find any `res_`, and very few `result_`s. Again this is the way of packaging a variable, its semantics are best signaled as what it is *about* rather than *how* it is used.

So we will drop `res_` following `mut_` and `opt_`.

OK

# Journal

2026-08-05 Wk 32 Wed - 21:38 +03:00

Current title: `000 Should I use mut_ and opt_ before variables for mutable and optional variables respectively?`

Once a resolution is reached, it will be renamed accordingly.

--/ 2026-08-05 Wk 32 Wed - 21:57 +03:00

We've come to a decision!

New Title: `000 Stop using and remove uses of encountered mut_ opt_ and res_ prefixes in my codebases`

--/ 

2026-08-05 Wk 32 Wed - 20:15 +03:00

For a while I was in the habit of using `mut_` at the beginning of a variable name if it is made mutable. The reasoning was that this can make it clear
at a glance where the mutable and immutable variables are.

Another one I've been doing is `opt_` and `res_` for respectively options and results.

I have seen it omitted in practice. `id` may be absent, so I have not seen any `maybe_id`s or `opt_id`s, but I have seen `id`s which may be None. For example in https://github.com/segoon/lsp-cli. This conforms with the fact that in other languages values can be implicitly nullable. So you always have to think about whether they are present. For this reason, I favor the explicit `opt_` prefix, where you do not have to ask this question. Note that I have been using `mut_` for very similar reasoning: to not have to query at scale as I scan code fast. I can immediately assume for my own code that the lack of `opt_` and `mut_` means explicit and immutable data.

2026-08-05 Wk 32 Wed - 21:30 +03:00

Let's check some popular sources for how they use `Option<T>`:

- `/usr/lib/rust/1.95.0/lib/rustlib/src/rust/library/std/src`
	- grep for `: Option` to see how values are named which are optional. The conclusion is that all of them do not indicate optional in the name. They are *of optional value* yet have naming that is just about the semantics of the content: `name`, `number_of_links`, etc.
- `~/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f`
	- grep for `: Option` to see how values are named which are optional. If you additionally filter this list by `maybe_` you will find 25 out of 11107 hits that really do use it: `maybe_name`, `maybe_range`, and so on. You will even find `optional_` for 18 out of 11107 hits, and ` opt_` for 13 out of 11107 hits.

2026-08-06 Wk 32 Thu - 21:30 +03:00

Replace some reason with vague references

```diff
-- certain use of intellisense can also make variables appear optional at a glance, for example due to type hints.
+- If one uses rust-analyzer inlay hints, it could also visually support seeing if a variable is optional at a glance.
+	- But note that as of this writing (2026-08-06 Wk 32 Thu - 21:31 +03:00) inlay hints do not have good integration with `cargo fmt`.
```