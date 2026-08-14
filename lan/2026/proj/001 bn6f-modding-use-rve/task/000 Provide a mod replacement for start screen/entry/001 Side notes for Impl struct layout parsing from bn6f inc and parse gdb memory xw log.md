---
context_type: entry
---

Parent: [[lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/000 Provide a mod replacement for start screen]]

Spawned by: [[lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/task/002 Impl struct layout parsing from bn6f inc and parse gdb memory xw log]]

Spawned in: [[lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/task/002 Impl struct layout parsing from bn6f inc and parse gdb memory xw log#^spawn-entry-a09d3b|^spawn-entry-a09d3b]]

# Journal

2026-08-08 Wk 32 Sat - 18:33 +03:00

--/ 2026-08-04 Wk 32 Tue - 15:05 +03:00

`jdgmt[t:status=none t:topic=rust]` Do not use crates or libraries that just provide "common" functionality, but prefer to always use libraries which perform a defined function.

Let's not use `lan_rs_common`. If they really are common utils, duplicate them and accept the duplication drift cost. If what is common is a dedicated module that performs a function, prefer to just make a crate for it and use it.

--/ 2026-08-04 Wk 32 Tue - 16:56 +03:00

`jdgmt[t:status=none t:topic=programming]` Three options for error design to minimize the burden of unnecessary handling of errors and respect invariants.

Prior we decided to not expose errors that are due to invariant conditions. But we still had the expectation that if the error is influenced by the caller it must expose this error back to them.

Here we extend this decision with the concept of call-site contracts. A function may have a ~~`# Contracts`~~ `# Panics` section in its documentation where it specifies conditions that must be met, or it otherwise panics.

This simplifies scenarios where the caller already would expect to uphold the contract, and should not have to handle cases they know are impossible.

Where possible, it is preferable to communicate invariant conditions via the type system by providing a subtype that restricts the space of possible values only to the valid set.

Recall that invariant conditions are purely internal and must not be reachable by any input, so they differ from contracts because with contracts the consumer can influence our code to enter an invalid state.

--/--/ 2026-08-04 Wk 32 Tue - 20:23 +03:00

Amend `# Contracts` to `# Panics`. This is a convention we already see in the rust standard library, so we do not need to invent new terminology for this. Internal invariant related panics can be documented in the function body, for the interest of developers who work on that code. For the consumer of the function, we record panics that can be caused by their choice of input under `# Panics`.  In other languages where the word `Panic` is not common, we may write `# Exceptions`, etc.

--/--/

--/ 2026-08-04 Wk 32 Tue - 17:22 +03:00

`jdgmt[t:status=none t:topic=rust]` Write tests with this schema: `tests::for_[sv_{service}|fn_{function}]::claim`.

For example, I have a function `exhaustive_scan` in `src/util/regex.rs`. It describes a `# Contract` that if a provided scanner outputs an advance that exceeds the input buffer, it will panic.

We can test that this claim holds up: 

```rust
#[cfg(test)]
mod tests {
	mod for_fn_exhaustive_scan {
		use super::super::*;
		
		#[test]
		fn respects_contract() {
			// ...
		}
	}
}
```

Notice the claim is a full sentence that describes a property of interest.

We also have `sv_{service}` for testing functionality that is not reducible to any single function. For example a module may offer an http interface and an https interface, and then there are different claims we want to test for `sv_http` and `sv_https`, regardless of how functions are used or composed.

If we are testing a type associated function, we can also use further module `for_ty_{type}` then `for_fn_{method}`. If it is for a specific trait impl, `for_ty_{type} -> for_impl_{trait}` and just 
specific claim tests for the trait as a whole.

--/--/ 2026-08-08 Wk 32 Sat - 22:13 +03:00

Put `#[cfg(test)]` at the first mod `mod tests`. This just means that this will be included in compilation if `test` is defined.

A lot of the time we want to provide some basic testing. So you can have a generic function `basic_tested`, which would be the claim it is basically tested!

--/

2026-08-05 Wk 32 Wed - 00:04 +03:00

Apparently both of these are valid:

```inc
# in /home/lan/src/cloned/cb/lan22h/bn6f-modding/bn6f/include/structs/GameState.incfile
.macro game_state_struct, label=oGameState, struct_entry=label_struct_entry, set_struct_start_address=set_struct_start_address
.macro PETNavi field:req // type: enum PETNavi
```

You can include `,` after the macro name or not.

Spawn [[000 How might we go about caching expensive regex compilations in rust?]] ^spawn-invst-a5dbfd

2026-08-08 Wk 32 Sat - 15:49 +03:00

https://stackoverflow.com/a/77623886 `std::mem::discrimnant` for checking variant kinds only

2026-08-08 Wk 32 Sat - 16:31 +03:00

How does `strum::IntoEnumIterator` handle enum variants data?

Let's create a new repo to be able to answer these sort of questions with example code: `lan-rs-repro`, similar to the one we had in https://github.com/LanHikari22/rs_repro. Though let's make this different. Instead of compiler flags or many bins, make it a multi-crate repo, and have it be indexed by kind, and source. For example:

- An example for project  https://github.com/Peternator7/strum: `git_root/examples/gh/Peternator7/strum/example_crate_1/`

We just have to make the folder and then go into it and do `cargo init`. Now all the complexity should be out of the crate build system, and we can provide example usage for any project. We can use examples we write there as experiments that guide how we use them using minimal examples.

I wanted to also put `repro` and `issues` into this like before, but let's make this one more focused. Just `rust-examples` instead of `lan-rs-repro`, and drop the `git_root/examples` part. Just `rust-examples` to be consistent with other repos I have like `dotfiles` which don't have to be `{user}-dotfiles`. 

Here is our executable proof: `/home/lan/src/cloned/cb/lan22h-experiments/rs-examples/gh/Peternator7/strum/into_enum_uses_variants_data_default/src/bad/enum_iter_requires_all_variants_data_to_impl_default.rs`

It uses `Default` to deal with variant data when enumerating. If that bad file is included in `bad/mod.rs` we will get a corresponding compiler error to impl `Default`.

```sh
# in /home/lan/src/cloned/cb/lan22h-experiments/rs-examples
git commit # out { [main 1e82770] first! }
```

https://codeberg.org/lan22h-experiments/rs-examples/src/branch/main/gh/Peternator7/strum/into_enum_uses_variants_data_default/src/bad/enum_iter_requires_all_variants_data_to_impl_default.rs

