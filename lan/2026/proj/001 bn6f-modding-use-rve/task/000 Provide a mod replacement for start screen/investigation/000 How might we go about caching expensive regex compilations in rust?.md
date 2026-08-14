---
context_type: investigation
status: done
---

Parent: [[lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/000 Provide a mod replacement for start screen]]

Spawned by: [[lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/entry/001 Side notes for Impl struct layout parsing from bn6f inc and parse gdb memory xw log]]

Spawned in: [[lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/entry/001 Side notes for Impl struct layout parsing from bn6f inc and parse gdb memory xw log#^spawn-invst-a5dbfd|^spawn-invst-a5dbfd]]

# Resolution

Caching a pure function `compile_regex` can be done using global static state that only that function is responsible for. It makes it possible to have variants of this function for different caching methods, as well as minimizing the surface influence of this caching capability. Alternatives like passing a cache from main were considered, but they end up pushing the responsibility for passing down mutable references to much other code that would otherwise require no mutation of incoming state.

As this is a pure transformation from a given regex source, the corresponding regex is leaked to make its lifetime static.

Source:

```rust
use std::sync::Mutex;

use im::HashMap;
use regex::Regex;

/// # Global State
/// This function handles its own caching of expensive regex compilation using global state
///
/// # Panics
/// - If the regex source has errors
pub fn compile_regex(regex_str: &'static str) -> &'static Regex {
    lazy_static::lazy_static! {
        static ref RE_CACHE: Mutex<HashMap<&'static str, &'static Regex>> = Mutex::new(HashMap::new());
    }

    let mut re_cache = RE_CACHE.lock().expect("Failed to lock re_cache");

    if re_cache.contains_key(regex_str) {
        re_cache[regex_str]
    } else {
        let re = Regex::new(regex_str)?;
        let leaked: &'static mut Regex = Box::leak(Box::new(re));

        re_cache.insert(regex_str, leaked);
        re_cache[regex_str]
    }
}
```

OK

# Journal

2026-08-07 Wk 32 Fri - 21:43 +03:00

We want to cache regex compilation, but also keep the caching localized where it is needed and not have every consumer of that code manage it for it.

https://stackoverflow.com/a/36628640 suggests [`lazy_static!`](https://github.com/rust-lang-nursery/lazy-static.rs) inside the function, but this is in conflict with how `lazy_static` should be used as claimed here: https://users.rust-lang.org/t/how-to-use-lazy-static-inside-a-function/87933. Their point is that you should use it for *mostly* compile-known values but with some runtime transformations.

2026-08-08 Wk 32 Sat - 00:30 +03:00

Let's instead make a `Cached<T>` type controlled by the caller to instantiate for `T`, where `T` handled expensive regex compilations. We should try to make this fully generic with respect to caching expensive compute, giving the consumer option to simply wrap their logic with `Cached` to gain this capability, irrespective of the underlying details of compute. All we ask the underlying `T` is to have the capability to provide a unique key per value computed, so that it is pinged at most once per any key by `Cached<T>`.

Hmm. Well `T` maybe needs to be a function instead since that's where the caching is applied. The reason why I want it to be any type is because we can impliment any trait on a type which builds on prior computations. For example I have a trait `ExhaustiveScan` that I implement on an enum which provides a set of possible grammars to scan through. I do not want `ExhaustiveScan` to come in variants like `CachedExhaustiveScan`. I also do not want it to simply do unnecessary expensive work. If it relies on regex to do its implementation for `T`, then it could make use of a `CompileRegex` trait of `T`. And it is when `T` is specifically an instance of `Cached<T>` that I want the `CompileRegex` behavior to cache. But It seems hard to do this at a generality for any trait.

We also want these on `T`, because we do not have the instances of it yet. These are traits that produce such instances, so we can't just put an extra `cache` to `self` for `T`. But we could do it to a struct `HashMapCached<T>` that allows us to retrieve its associated type `T` and also have a ready instance that only supplies a hashmap cache.

2026-08-08 Wk 32 Sat - 12:08 +03:00

Even if we use `HashMapCached<T>` we could possibly run into usage conflicts because it's not clear what the cache is *for* and there could be multiple, so let's just localize it to `RegexCached<T>`. 

But still in this case the function local side effect for caching was the simplest solution and exposed the least to the consumer. On the other hand, this allows the consumer to chose their caching solution.

https://github.com/jaemk/cached

https://users.rust-lang.org/t/solved-what-pattern-would-you-suggest-for-caching-since-theres-no-concept-of-global-heap-variables-in-rust/26086/28

Even using `RegexCached<T>` still requires the traits we otherwise implement now support `self` because that's where the state is. If `compile_regex` normally does not need it for `T`, but now does for `RegexCached<T>` it's a problem. If we make it so compiling regex requires input cache state, then all downstream users of it now must also supply it like `ExhaustiveScan`, even if it is possible to implement it without using Regex.

We can try to provide `WithSelf` variants of traits. Ex: `CompileRegexWithSelf`.  Or maybe better `WithSelfRef`: `CompileRegexWithSelfRef`. It provides the same `compile_regex`, but now it takes `&self`. `RegexCached<T>` would implement `CompileRegexWithSelfRef` while `T` must implement `CompileRegex`. Actually since it's caching, `WithMutSelfRef`.

2026-08-08 Wk 32 Sat - 19:29 +03:00

`RegexCached<T>` works for whatever the consumer initiates. They are in control of using `RegexCached<TheirEnumOfInterest>::new().exhaustive_scan` which will make use of the regex cache.

But what about recursive scanners? 

For example `StructIncInsts` for its `DefineMacro` instruction has a parameter list, with different variants for how they are parsed, it seeks to also exhaustively scan via the enum `MacroParam`.

But it is providing its custom regex capture to type logic by implementing `FromRegexCaptures`, which does not allow it to additionally cache. compiled regex for `MacroParam`. 

--/ 2026-08-08 Wk 32 Sat - 19:35 +03:00

I will provide a different trait: `FromRegexCapturesWithRegexCache`. Already in the implementation `ExhaustiveScanWithMutSelfRef` for `RegexCached<T>` we are concerned with solutions that make use of caching, so since this depends on user defined functionality via `FromRegexCapturea`, it should allow the user to also extend the cache for performance gains.

--/ 2026-08-08 Wk 32 Sat - 20:25 +03:00

`RegexCached<T>` also needs to not own the cache now. If the user wants to exhaustively scan using the same cache of a recursively initialized `RegexCached<T>` then they would have to be able to reuse the same regex cache and also mutate it.

Now `Fn` needs to become `FnMut` for exhaustive scan since it is allowing subscanners to mutate, all for regex caching.

There is really large surface area impact on the rest of the design for this approach. The benefits are not materializing for us here. Let us revert back to the global caching effect approach. Cache directly at the pure function `compile_regex`, which everyone else uses, and do not expose any caching mechanics to anyone else. It is a pure function. It will give the same output whether you cache or not. It will just do it faster sometimes.

--/

2026-08-08 Wk 32 Sat - 20:45 +03:00

```sh
# in /home/lan/src/cloned/cb/lan22h/bn-repo-editor/Cargo.toml
[dependencies]
lazy_static = "1.5.0"
```

We need to turn out `Regex` into a `'static` reference. Let's leak it:

https://rustbites.com/posts/bite-067/, [docs Box.leak](https://doc.rust-lang.org/1.54.0/std/boxed/struct.Box.html#method.leak)

```rust
use std::sync::Mutex;

use im::HashMap;
use regex::Regex;

/// # Global State
/// This function handles its own caching of expensive regex compilation using global state
///
/// # Panics
/// - If the regex source has errors
pub fn compile_regex(regex_str: &'static str) -> &'static Regex {
    lazy_static::lazy_static! {
        static ref RE_CACHE: Mutex<HashMap<&'static str, &'static Regex>> = Mutex::new(HashMap::new());
    }

    let mut re_cache = RE_CACHE.lock().expect("Failed to lock re_cache");

    if re_cache.contains_key(regex_str) {
        re_cache[regex_str]
    } else {
        let re = Regex::new(regex_str)?;
        let leaked: &'static mut Regex = Box::leak(Box::new(re));

        re_cache.insert(regex_str, leaked);
        re_cache[regex_str]
    }
}
```

2026-08-08 Wk 32 Sat - 21:29 +03:00

The design simplifies with this. We no longer need the trait `CompileRegex`. Just call `compile_regex` whenever. It suffices to have `ToRegexSource`, since `compile_regex` is just a pure transformation from the regex source.