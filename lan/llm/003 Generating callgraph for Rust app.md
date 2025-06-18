# 1 When generating callgraph via radare2 for rust app it is too big (PEND)

2025-06-16 Wk 25 Mon - 12:35

<hr class="__chatgpt_plugin">

### 1.1.1 role::user

png is around 80mb. The app is not large. It seems to include unstripped library symbols. 



<hr class="__chatgpt_plugin">

### 1.1.2 role::assistant<span style="font-size: small;"> (chatgpt-4o)</span>

Distilled,

```toml
[profile.release]
lto = "fat"
codegen-units = 1
opt-level = "z"
```

```sh
cargo build --release
strip target/release/your_binary
```



<hr class="__chatgpt_plugin">

### 1.1.3 role::user


```sh
# Prior to changes
$ ls -alh target/release/bn_repo_editor
-rwxrwxr-x 2 lan lan 4.8M Jun 16 11:39 target/release/bn_repo_editor

# After suggested LLM changes (pre-strip)
$ ls -alh target/release/bn_repo_editor
-rwxrwxr-x 2 lan lan 3.0M Jun 16 12:30 target/release/bn_repo_editor

# After suggested LLM changes (post-strip)
$ strip target/release/bn_repo_editor
ls -alh target/release/bn_repo_editor
-rwxrwxr-x 2 lan lan 2.4M Jun 16 12:57 target/release/bn_repo_editor

# Scary comparison to debug binary
$ ls -alh target/debug/bn_repo_editor
-rwxrwxr-x 2 lan lan 78M Jun 16 11:22 target/debug/bn_repo_editor
```

pre-strip, we got a worse callgraph.png somehow. Why? I have not deleted output.dot, but I don't believe it accumulates. For the next trial (post) I am deleting it.
```sh
$ ls -alh callgraph.png                
-rw-rw-r-- 1 lan lan 152M Jun 16 12:45 callgraph.png
```

Trying again post strip, over radare2 to generate callgraph.png

```sh
cargo build --release
r2 target/release/bn_repo_editor

# in radare2
-- Can you challenge a perfect immortal machine? # (before)
-- Change the UID of the debugged process with child.uid (requires root) # (now)                                
[0x0003fd60]> aaa # aa instead of aaa for function-only?
[0x0003fd60]> agCd > output.dot
[0x0003fd60]> !!dot -Tpng -o callgraph.png output.dot

```

```sh
$ ls -alh output.dot   
-rw-r--r-- 1 lan lan 1.5M Jun 16 13:12 output.dot

$ ls -alh callgraph.png
-rw-rw-r-- 1 lan lan 69M Jun 16 13:19 callgraph.png
```

The size is still bad, though better. Trying again but with `aa` radare2 analysis:

```sh
$ ls -alh callgraph.png
-rw-rw-r-- 1 lan lan 17K Jun 16 13:26 callgraph.png
```

It's now too small. Literally has only 5 symbols in it. Will stick to aaa.

Also why are the functions called `fcn.000f7ed3`, can we preserve symbol names in the release binary?



<hr class="__chatgpt_plugin">

### 1.1.4 role::assistant<span style="font-size: small;"> (chatgpt-4o)</span>

Distilled,

Suggestions:
- Use `--emit=llvm-ir` or `cargo llvm-ir` for alt graphing
	- (If you're open to not using radare2 — LLVM IR graphs can be more controllable)

```toml
[profile.release]
debug = true  # keeps symbols but still optimized
strip = true  # if on Rust 1.60+, else use manual strip
```

Might want to filter some functions out
- auto-generated functions (`core::`, `alloc::`, etc.)
- compiler intrinsics (`_ZN`, etc.)

`sfdp` instead of `dot` for better layout on huge graphs:
```
sfdp -Tpng -o callgraph.png output.dot
```



<hr class="__chatgpt_plugin">

### 1.1.5 role::user

2025-06-16 Wk 25 Mon - 13:36

```sh
$ rustc --version                 
rustc 1.87.0 (17067e9ac 2025-05-09)

# In Cargo.toml
[profile.release]
lto = "fat"
codegen-units = 1
opt-level = "z"
strip = true
debug = true
```

```sh
$ cargo build --release
$ ls -alh target/release/bn_repo_editor
-rwxrwxr-x 2 lan lan 2.4M Jun 16 13:36 target/release/bn_repo_editor
```

Running radare2 (aaa) again to get callgraph.png

```sh
$ ls -alh callgraph.png                
-rw-rw-r-- 1 lan lan 65M Jun 16 13:47 callgraph.png
```

Still big. And how do I check over radare2 for a function list or some names? it still says fcn.xxx. Also make this analysis only trace things out of main. 

Edit:
- In response to "But `strip = true` _removes symbols_! So **`debug = true` is being canceled out by `strip = true`**."
	- What does strip do exactly? Keep names. I don't care to remove these. When I asked for symbol stripping I actually meant to remove all symbols *not used by main and its derivatives*
- Stop suggesting to remove symbols in the visualization stage. I want everything in that stage. What should be filtered is during analysis/build.

<hr class="__chatgpt_plugin">

### 1.1.6 role::assistant<span style="font-size: small;"> (chatgpt-4o)</span>

Distilled,

Suggestions:

```sh
# radare2
[0x000xxxxx]> afl  # function list with names
[0x000xxxxx]> afl~main  # show only functions with "main" in the name

afl                   # all analyzed functions
afn                   # name of current function
```

After analysis (`aaa`), do this:
```sh
afl~main  # Find the address of main, e.g., 0x00401234

# Then jump to it
s 0x00401234

# Generate callgraph starting *from here*
agCd > output.dot
```

Use sfdp
```sh
sfdp -Tsvg -o callgraph.svg output.dot
```



<hr class="__chatgpt_plugin">

### 1.1.7 role::user

```sh
# In Cargo.toml
[profile.release]
lto = "fat"
codegen-units = 1
opt-level = "z"
debug = true

# In terminal
$ cargo build --release
$ ls -alh target/release/bn_repo_editor
-rwxrwxr-x 2 lan lan 22M Jun 16 14:03 target/release/bn_repo_editor
$ r2 target/release/bn_repo_editor

# In radare2
-- Use zoom.byte=entropy and press 'z' in visual mode to zoom out to see the entropy of the whole file
[0x0003fd70]> s main
[0x0004d740]> agCd > output.dot
[0x0004d740]> !!sfdp -Tsvg -o callgraph.svg output.dot
[0x0004d740]> !!sfdp -Tpng -o callgraph.png output.dot
[0x0004d740]> !!dot -Tpng -o callgraph.png output.dot

# In Terminal
$ ls -alh callgraph.svg                
-rw-rw-r-- 1 lan lan 7.2M Jun 16 14:12 callgraph.svg
$ ls -alh callgraph.png
-rw-rw-r-- 1 lan lan 15M Jun 16 14:17 callgraph.png
$ ls -alh callgraph.png
-rw-rw-r-- 1 lan lan 173M Jun 16 14:26 callgraph.png # too big! cannot open
```

Image viewer freezes with `callgraph.svg` so did with `callgraph.png` too. It loaded after a while, but with png, it places symbols on top of each other as if they're some cloud, it's not readable. There are also some symbols that connect to nothing else but another symbol. This should not happen: A -> B. If it doesn't somehow link to main, it shouldn't be included!!

Are you sure just being in main ensure only outgoing ingoing functions are included in the callgraph? It would be ideal if where main is is shown too. 


### 1.1.8 role::assistant<span style="font-size: small;"> (chatgpt-4o)</span>

Distilled,

Suggestions:

Try a different tool

```sh
cargo install cargo-call-stack
cargo call-stack --bin bn_repo_editor --target x86_64-unknown-linux-gnu
```



<hr class="__chatgpt_plugin">

### 1.1.9 role::user

This tool reports that it requires nightly:

```sh
$ rustup default                             
stable-x86_64-unknown-linux-gnu (default)

$ rustup default nightly
$ rustup default        
nightly-x86_64-unknown-linux-gnu (default)
$ rustc --version
rustc 1.89.0-nightly (586ad391f 2025-06-15)
```

```sh
$ cargo call-stack --bin bn_repo_editor --target x86_64-unknown-linux-gnu
Your rust toolchain does not match the last known working version, which is nightly-2023-11-13.
```

What do I do? Do I have to install a rustc from 2023? Why? 


<hr class="__chatgpt_plugin">

### 1.1.10 role::assistant<span style="font-size: small;"> (chatgpt-4o)</span>

Distilled,

Suggests "tools like `cargo-call-stack` are often tightly coupled to a specific nightly version, because they depend on **unstable MIR or LLVM internals**, which change frequently across nightly releases."

```sh
rustup install nightly-2023-11-13
rustup run nightly-2023-11-13 cargo call-stack --bin bn_repo_editor
```



<hr class="__chatgpt_plugin">

### 1.1.11 role::user

Command requires `edition2024` in Cargo.toml. Adding `cargo-features = ["edition2024"]` top the top of the file.

```sh
$ rustup run nightly-2023-11-13 cargo call-stack --bin bn_repo_editor
error: -Zbuild-std requires --target

$ rustup run nightly-2023-11-13 cargo call-stack --bin bn_repo_editor --target x86_64-unknown-linux-gnu
```

Now it says 
```
error: failed to parse lock file at: {repo}/Cargo.lock

Caused by:
  lock file version 4 requires `-Znext-lockfile-bump`
```

LLM suggests to add it as a flag;

```sh
rustup run nightly-2023-11-13 cargo -Znext-lockfile-bump call-stack --bin bn_repo_editor --target x86_64-unknown-linux-gnu

```

But same issue.

LLM Suggests to downgrade this: Cargo.toml to 2021 (from 2024):

```toml
[package]
name = "bn_repo_editor"
version = "0.1.0"
edition = "2021"
```

But issue persists.

Removed Cargo.toml and reran 
```sh
rustup run nightly-2023-11-13 cargo call-stack --bin bn_repo_editor --target x86_64-unknown-linux-gnu
```

New issue with downloading, so reverting edition 2021 to 2024.

```
error: failed to download `rpds v1.1.1`
```

Issue persists.

LLM Suggests to generate Cargo.lock first then try again (after reverting back to edition 2021):
```sh
rm Cargo.lock
cargo +nightly-2023-11-13 generate-lockfile
```

But issue persists.

From https://github.com/japaric/cargo-call-stack,

```sh
$ # NOTE always use the latest stable release
$ cargo +stable install cargo-call-stack

$ rustup +nightly component add rust-src

$ cargo +nightly call-stack --example app > cg.dot
```

The issue really has to do with just `cargo build`:
```sh
$ rm cargo.lock
$ cargo +nightly-2023-11-13 build       
[...]
error: failed to download `rpds v1.1.1`
```

I removed rpds from a common crate `lan_rs_common` I was using.

But it seems something uses this yoke library... How do I reverse lookup dependencies via cargo so that I know what to delete?

```
error: package `yoke v0.8.0` cannot be built because it requires rustc 1.81 or newer, while the currently active rustc version is 1.76.0-nightly
Either upgrade to rustc 1.81 or newer, or use
cargo update yoke@0.8.0 --precise ver
where `ver` is the latest version of `yoke` supporting rustc 1.76.0-nightly
```

```sh
$ cargo tree -i yoke
yoke v0.8.0
├── icu_collections v2.0.0
│   ├── icu_normalizer v2.0.0
│   │   └── idna_adapter v1.2.1
│   │       └── idna v1.0.3
│   │           └── url v2.5.4
│   │               └── reqwest v0.12.20
```

It's reqwest. Removing.

```
error: package `backtrace v0.3.75` cannot be built because it requires rustc 1.82.0 or newer, while the currently active rustc version is 1.76.0-nightly
```

```sh
$ cargo tree -i backtrace
backtrace v0.3.75
└── pprof v0.15.0
```

Disabling pprof for now.

It is able to build now. 

```sh
$ rustup run nightly-2023-11-13 cargo call-stack --bin bn_repo_editor --target x86_64-unknown-linux-gnu
```

asks me to run 

```sh
rustup component add rust-src --toolchain nightly-2023-11-13-x86_64-unknown-linux-gnu
```

Running the rustup run command, I get the error

```sh
error: failed to run custom build command for `rustversion v1.0.21`
[...]
  Error: unexpected output from `rustc --version`: ""
```

Maybe I'll try to set this as the rustc version insto of using rustup run

```sh
rustup default nightly-2023-11-13 
rm Cargo.lock
cargo call-stack --bin bn_repo_editor --target x86_64-unknown-linux-gnu
```

Same thing, just with an extra error
```
error: failed to run custom build command for `libc v0.2.173`
[...]
  --- stderr
  thread 'main' panicked at /home/lan/.cargo/registry/src/index.crates.io-6f17d22bba15001f/libc-0.2.173/build.rs:194:5:
  failed to run rustc: error: missing `--crate-name` argument

```

Trying reinstallation
```sh
rustup uninstall nightly-2023-11-13
rustup install nightly-2023-11-13
rustup component add rust-src --toolchain nightly-2023-11-13
rustup default nightly-2023-11-13
```

Issue persists.

The tools themselves work fine
```sh
$ rustup run nightly-2023-11-13 rustc --version
rustc 1.76.0-nightly (2b603f95a 2023-11-12)

$ cargo +nightly-2023-11-13 --version
cargo 1.76.0-nightly (6790a5127 2023-11-10)
```

2025-06-16 Wk 25 Mon - 17:44

[This forum answer](<https://stackoverflow.com/a/76795215>) claims that rustup itself needs to be reinstalled...

```sh
rustup self uninstall
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup install nightly-2023-11-13
rustup component add rust-src --toolchain nightly-2023-11-13
rustup default nightly-2023-11-13
cargo install cargo-call-stack
rm Cargo.lock
cargo call-stack --bin bn_repo_editor --target x86_64-unknown-linux-gnu
```

Issue persists!

Note that build is fine. even `cargo call-stack` runs fine. This issue seems internal to `call-stack`.

LLM Suggests these environmental variables, 
```sh
export RUSTC=$(rustup which --toolchain nightly-2023-11-13 rustc)
export CARGO=$(rustup which --toolchain nightly-2023-11-13 cargo)

cargo call-stack --bin bn_repo_editor --target x86_64-unknown-linux-gnu
```

but issue persists.

This may give some info:

```sh
$ strace -f -e execve cargo call-stack --bin bn_repo_editor --target x86_64-unknown-linux-gnu
$ strace -f -v -s 4096 -e trace=execve cargo call-stack --bin bn_repo_editor --target x86_64-unknown-linux-gnu
```

It's wasn't showing environmental variables, just saying `/* 117 vars */`

The second strace gives full environment variables alongside executables. one thing of note was the `RUSTC_WRAPPER` environment variable, searching the repo, this is its usage:
```
fn run() -> anyhow::Result<i32> {
	if env::var_os("CARGO_CALL_STACK_==RUSTC_WRAPPER==").is_some() {
	    return wrapper::wrapper();

	cargo.env("CARGO_CALL_STACK_==RUSTC_WRAPPER==", "1");

	cargo.env("==RUSTC_WRAPPER==", env::current_exe()?);
```

Some notes from the repo:
-     let mut rustc = Command::new(&rustc_path);
-     let meta = rustc_version::version_meta()?;

LLM Suggests:
- `==RUSTC_WRAPPER==` → invalid key
	- But no, I confirm that  RUSTC_WRAPPER itself is set. To this: "RUSTC_WRAPPER=/home/lan/.cargo/bin/cargo-call-stack"
	- This is also set:  "CARGO_CALL_STACK_RUSTC_WRAPPER=1",


<hr class="__chatgpt_plugin">

### 1.1.12 role::user

2025-06-16 Wk 25 Mon - 18:17

Let's build [cargo-call-stack](<https://github.com/japaric/cargo-call-stack>) and invoke it ourselves.

```
error[E0635]: unknown feature `proc_macro_span_shrink`
  --> /home/lan/.cargo/registry/src/index.crates.io-6f17d22bba15001f/proc-macro2-1.0.51/src/lib.rs:92:30
   |
92 |     feature(proc_macro_span, proc_macro_span_shrink)
   |                              ^^^^^^^^^^^^^^^^^^^^^^
```

We encounter this error on build.

```sh
$ rustup default nightly
$ rustc --version
rustc 1.89.0-nightly (586ad391f 2025-06-15)
$ cargo build --release
```

It persists.

I replied in this [issue](<https://github.com/japaric/cargo-call-stack/issues/112#issuecomment-2977278821>) to resolve this problem. I just had to remove Cargo.lock, but the person mistakingly said to remove Cargo.toml. Now it builds.

We now have access to a build `/home/lan/src/cloned/gh/japaric/cargo-call-stack/target/release/cargo-call-stack`

```sh
$ rustup default nightly-2023-11-13
$ /home/lan/src/cloned/gh/japaric/cargo-call-stack/target/release/cargo-call-stack --bin bn_repo_editor --target x86_64-unknown-linux-gnu
```

```
  thread 'main' panicked at /home/lan/.cargo/registry/src/index.crates.io-6f17d22bba15001f/libc-0.2.173/build.rs:194:5:
  failed to run rustc: error: missing `--crate-name` argument
```

We can see the source now. 

```rust

	// ---
    let output = cmd.output().expect("Failed to get rustc version");
    
	// line 194
    assert!(
        output.status.success(),
        "failed to run rustc: {}",
        String::from_utf8_lossy(output.stderr.as_slice())
    );
```

```sh
$ cargo tree -i libc     
libc v0.2.173
├── filetime v0.2.25
│   └── cargo-call-stack v0.1.16 (/home/lan/src/cloned/gh/japaric/cargo-call-stack)
└── is-terminal v0.4.16
    └── env_logger v0.10.2
        └── cargo-call-stack v0.1.16 (/home/lan/src/cloned/gh/japaric/cargo-call-stack)

```

Let's bump the versions of these libraries. 0.10.0 -> 0.11.8 for env_logger. filetime is latest already. It didn't help.

Let's try to patch libc:

```sh
$ git clone git@github.com:rust-lang/libc.git
```

This is a libc issue... will have to build it and replace the fetched with local to patch.

2025-06-16 Wk 25 Mon - 20:32

Trying a [fork](<https://github.com/Dirbaio/cargo-call-stack>) of `cargo-call-stack` that fixed some issues (Cargo.toml removed) and has a commit saying [Use llvm-sys instead of custom parser. Make no longer a cargo plugin.](https://github.com/japaric/cargo-call-stack/commit/a9df75ed3c9f3fb8a3f8ebe6c09e7cd208e1f529)

```sh
$ cargo build --release
error: No suitable version of LLVM was found system-wide or pointed
              to by LLVM_SYS_170_PREFIX.
       
              Consider using `llvmenv` to compile an appropriate copy of LLVM, and
              refer to the llvm-sys documentation for more information.
       
              llvm-sys: https://crates.io/crates/llvm-sys
              llvmenv: https://crates.io/crates/llvmenv
```

Have to install LLVM for this:

```sh
$ rustup default stable-x86_64-unknown-linux-gnu
$ cargo install llvmenv
$ llvmenv init
$ llvmenv entries
$ llvmenv build -entry 13.0.0
```

```
thread 'main' panicked at /home/lan/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/llvmenv-0.3.2/src/bin/llvmenv.rs:173:32:
called `Result::unwrap()` on an `Err` value: CommandNotFound { cmd: "cd \"/home/lan/.cache/llvmenv/13.0.0/build\" && \"cmake\" \"/home/lan/.cache/llvmenv/13.0.0\" \"-DCMAKE_INSTALL_PREFIX=/home/lan/.local/share/llvmenv/13.0.0\" \"-DCMAKE_BUILD_TYPE=Release\"" }
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

We do not have cmake.

```sh
sudo apt install cmake
```

Then, attempting rebuild...

```
In file included from /home/lan/.cache/llvmenv/13.0.0/lib/Support/Signals.cpp:14:
/home/lan/.cache/llvmenv/13.0.0/include/llvm/Support/Signals.h:119:8: error: variable or field ‘CleanupOnSignal’ declared void
  119 |   void CleanupOnSignal(uintptr_t Context);
      |        ^~~~~~~~~~~~~~~
/home/lan/.cache/llvmenv/13.0.0/include/llvm/Support/Signals.h:119:24: error: ‘uintptr_t’ was not declared in this scope
  119 |   void CleanupOnSignal(uintptr_t Context);
      |                        ^~~~~~~~~
/home/lan/.cache/llvmenv/13.0.0/include/llvm/Support/Signals.h:18:1: note: ‘uintptr_t’ is defined in header ‘<cstdint>’; this is probably fixable by adding ‘#include <cstdint>’
   17 | #include <string>
  +++ |+#include <cstdint>
   18 | 
In file included from /home/lan/.cache/llvmenv/13.0.0/lib/Support/Signals.cpp:251:
/home/lan/.cache/llvmenv/13.0.0/lib/Support/Unix/Signals.inc:348:44: error: ‘void llvm::sys::CleanupOnSignal(uintptr_t)’ should have been declared inside ‘llvm::sys’
  348 | void sys::CleanupOnSignal(uintptr_t Context) {
      |                                            ^
```




<hr class="__chatgpt_plugin">

### 1.1.13 role::user

Try again to get the objective done for generating a graph without relying on this `cargo-call-stack`

<hr class="__chatgpt_plugin">

### 1.1.14 role::assistant<span style="font-size: small;"> (chatgpt-4o)</span>

Distilled,

(Option 1)

```sh
python3 -m pip install r2pipe
```

```python
# main_callgraph.py

import r2pipe

print("[*] Opening binary...")
r2 = r2pipe.open("target/release/bn_repo_editor", flags=["-2"])  # -2 = quiet mode
r2.cmd("aaa")  # Full analysis

print("[*] Fetching function list...")
funcs = r2.cmdj("aflj")
if not funcs:
    print("[-] No functions found after analysis")
    exit(1)

# Create lookup map for names
addr_to_name = {
    f.get("offset"): f.get("name", hex(f.get("offset", 0)))
    for f in funcs
    if "offset" in f
}

# Try finding `main` function
print("[*] Locating main function...")
main_fn = next(
    (f for f in funcs if "main" in f.get("name", "") and "offset" in f),
    None
)

if not main_fn:
    print("[-] Could not find main() function")
    exit(1)

main_addr = main_fn["offset"]
print(f"[+] Found main at {hex(main_addr)}")

# Graph traversal
visited = set()
queue = [main_addr]
edges = []

print("[*] Traversing reachable functions from main...")
while queue:
    addr = queue.pop()
    if addr in visited:
        continue
    visited.add(addr)
    r2.cmd(f"s {addr}")
    info = r2.cmdj("agfj") or []
    if not info:
        continue
    calls = info[0].get("calls", [])
    for c in calls:
        callee = c.get("addr")
        if callee and isinstance(callee, int):
            edges.append((addr, callee))
            if callee not in visited:
                queue.append(callee)

print(f"[+] Collected {len(edges)} edges from {len(visited)} functions")

# Write graph to DOT file
with open("main_only.dot", "w") as f:
    f.write("digraph G {\n")
    for src, dst in edges:
        src_label = addr_to_name.get(src, hex(src))
        dst_label = addr_to_name.get(dst, hex(dst))
        f.write(f'  "{src_label}" -> "{dst_label}";\n')
    f.write("}\n")

print("[+] Graph written to main_only.dot")
print("Run: dot -Tpng -o main_callgraph.png main_only.dot")
```

Errors:

```
Error: Expecting ',' delimiter: line 2 column 1 (char 16)
Could not find main()

```
- [x] 

```
Traceback (most recent call last):
  File "/home/lan/src/cloned/gh/LanHikari22/bn_repo_editor/main_callgraph.py", line 19, in <module>
    main_addr = main_fn["offset"]
                ~~~~~~~^^^^^^^^^^
KeyError: 'offset'
```
- [x] 

```
[*] Opening binary...
[*] Fetching function list...
[*] Locating main function...
[-] Could not find main() function
```
- [ ] 

(Option 2)

```sh
RUSTFLAGS="--emit=llvm-ir" cargo build --release
sudo apt install llvm clang
opt -passes='dot-callgraph' -disable-output target/release/deps/bn_repo_editor-<hash>.ll
dot -Tpng -o callgraph.png callgraph.dot
```

Errors:

```
The `opt -passname` syntax for the new pass manager is not supported, please use `opt -passes=<pipeline>` (or the `-p` alias for a more concise version).
See https://llvm.org/docs/NewPassManager.html#invoking-opt for more details on the pass pipeline syntax.
```
- [x] OK

```sh
Writing 'target/release/deps/bn_repo_editor-26b70e4f6e1fa4c4.ll.callgraph.dot'...

$ dot -Tpng -o callgraph.png target/release/deps/bn_repo_editor-26b70e4f6e1fa4c4.ll.callgraph.dot
```


This game shall never end!

We're even referencing code now!




Just answer this last question.

Just focus on the last  problem. The rest is just context.
