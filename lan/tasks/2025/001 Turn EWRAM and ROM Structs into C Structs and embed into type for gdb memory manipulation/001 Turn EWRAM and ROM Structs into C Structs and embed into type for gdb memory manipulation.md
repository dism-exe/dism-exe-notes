---
status: todo
---
#gdb #types #automation #tooling #debugging

# 1 Objective

As mentioned in [[003 Reading and Writing to memory as a struct Incomplete]],

We are unable to modify memory using C type information because although we document structs they are not present in a format gdb understands.

- [x] Setup a toy gba asm project with ldscript memory mapping
- [x] Successfully map EWRAM and ROM Structs to specific regions
- [x] Investigate using these types for read/write/watch in gdb
- [x] Able to import these symbols in addition to bn6f.elf for enhanced debugging
- [ ] Parse all structs from bn6f repo using bn_repo_editor
- [ ] Create a docker container for bn_repo_editor with the ability to generate a final elf to read symbols off of for bn6f.elf
- [ ] Setup a script that breaks in a function, and writes to memory via a type for persistent intervention

# 2 Journal

2025-06-13 Wk 24 Fri - 07:37

Spawn [[000 Some resources found while building gdb memory automation]] ^spawn-entry-8655cc

Spawn [[000 Setting up basic gba project for debug symbol injection]] ^spawn-task-27a403

Spawn [[000 Investigating adding debug struct types and usage]] ^spawn-invst-0eea84

2025-06-13 Wk 24 Fri - 12:40

Spawn [[001 Setting up workflow for debug type injection]] ^spawn-task-0bfa3f

2025-06-13 Wk 24 Fri - 14:03

Spawn [[002 Continuing impl for bn_repo_editor to parse struct info from the repo]] ^spawn-task-63442a

2025-07-18 Wk 29 Fri - 23:27

Spawn [[002 Multiline String in Rust]] ^spawn-howto-6df57b

# 3 Tasks

# 4 Issues

## 4.1 Installing visidata gives an error on run

```sh
sudo apt-get install visidata
vd
```

```
Traceback (most recent call last):
  File "/usr/bin/vd", line 6, in <module>
    visidata.main.vd_cli()
    ^^^^^^^^^^^^^^^^^^^^
AttributeError: 'function' object has no attribute 'vd_cli'
```

Try to install it through python3 instead.

```sh
sudo apt-get remove visidata
python3 -m pip install visidata
```

This works.

## 4.2 Issue building `lan_rs_common`

2025-06-14 Wk 24 Sat - 15:24

I need this for graph data types, graph search, logging, and parallelism with pipelines.

There's on `cargo build`:

```
   Compiling crossbeam-utils v0.8.21                                                                                                                                                          
error: failed to run custom build command for `yeslogic-fontconfig-sys v6.0.0`

Caused by:
  process didn't exit successfully: `/home/lan/src/cloned/gh/LanHikari22/lan_rs_common/target/debug/build/yeslogic-fontconfig-sys-83e88fcec271c856/build-script-build` (exit status: 101)
  --- stdout
  cargo:rerun-if-env-changed=RUST_FONTCONFIG_DLOPEN
  cargo:rerun-if-env-changed=FONTCONFIG_NO_PKG_CONFIG
  cargo:rerun-if-env-changed=PKG_CONFIG_x86_64-unknown-linux-gnu
  cargo:rerun-if-env-changed=PKG_CONFIG_x86_64_unknown_linux_gnu
  cargo:rerun-if-env-changed=HOST_PKG_CONFIG
  cargo:rerun-if-env-changed=PKG_CONFIG
  cargo:rerun-if-env-changed=FONTCONFIG_STATIC
  cargo:rerun-if-env-changed=FONTCONFIG_DYNAMIC 
  cargo:rerun-if-env-changed=PKG_CONFIG_ALL_STATIC
  cargo:rerun-if-env-changed=PKG_CONFIG_ALL_DYNAMIC
  cargo:rerun-if-env-changed=PKG_CONFIG_PATH_x86_64-unknown-linux-gnu
  cargo:rerun-if-env-changed=PKG_CONFIG_PATH_x86_64_unknown_linux_gnu
  cargo:rerun-if-env-changed=HOST_PKG_CONFIG_PATH
  cargo:rerun-if-env-changed=PKG_CONFIG_PATH
  cargo:rerun-if-env-changed=PKG_CONFIG_LIBDIR_x86_64-unknown-linux-gnu
  cargo:rerun-if-env-changed=PKG_CONFIG_LIBDIR_x86_64_unknown_linux_gnu
  cargo:rerun-if-env-changed=HOST_PKG_CONFIG_LIBDIR
  cargo:rerun-if-env-changed=PKG_CONFIG_LIBDIR
  cargo:rerun-if-env-changed=PKG_CONFIG_SYSROOT_DIR_x86_64-unknown-linux-gnu
  cargo:rerun-if-env-changed=PKG_CONFIG_SYSROOT_DIR_x86_64_unknown_linux_gnu
  cargo:rerun-if-env-changed=HOST_PKG_CONFIG_SYSROOT_DIR
  cargo:rerun-if-env-changed=PKG_CONFIG_SYSROOT_DIR

  --- stderr

  thread 'main' panicked at /home/lan/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/yeslogic-fontconfig-sys-6.0.0/build.rs:8:48:
  called `Result::unwrap()` on an `Err` value: "\npkg-config exited with status code 1\n> PKG_CONFIG_ALLOW_SYSTEM_LIBS=1 PKG_CONFIG_ALLOW_SYSTEM_CFLAGS=1 pkg-config --libs --cflags fontconfig\n\nThe system library `fontconfig` required by crate `yeslogic-fontconfig-sys` was not found.\nThe file `fontconfig.pc` needs to be installed and the PKG_CONFIG_PATH environment variable must contain its parent directory.\nThe PKG_CONFIG_PATH environment variable is not set.\n\nHINT: if you have installed the library, try setting PKG_CONFIG_PATH to the directory containing `fontconfig.pc`.\n"
  note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
warning: build failed, waiting for other jobs to finish...

```
^errorlog1

Distilled,

```
The system library `fontconfig` required by crate `yeslogic-fontconfig-sys` was not found.
```

Solution:

```sh
sudo apt-get install fontconfig # probably not needed. only the dev below.
sudo apt install libfontconfig1-dev
```

## 4.3 Perf Paranoid Setting

2025-06-14 Wk 24 Sat - 21:50

```sh
$ CARGO_PROFILE_RELEASE_DEBUG=true cargo flamegraph --bin bn_repo_editor
Error:
Access to performance monitoring and observability operations is limited.
Consider adjusting /proc/sys/kernel/perf_event_paranoid setting to open
access to performance monitoring and observability operations for processes
without CAP_PERFMON, CAP_SYS_PTRACE or CAP_SYS_ADMIN Linux capability.
More information can be found at 'Perf events and tool security' document:
https://www.kernel.org/doc/html/latest/admin-guide/perf-security.html
perf_event_paranoid setting is 4:
  -1: Allow use of (almost) all events by all users
      Ignore mlock limit after perf_event_mlock_kb without CAP_IPC_LOCK
>= 0: Disallow raw and ftrace function tracepoint access
>= 1: Disallow CPU event access
>= 2: Disallow kernel profiling
To make the adjusted perf_event_paranoid setting permanent preserve it
in /etc/sysctl.conf (e.g. kernel.perf_event_paranoid = <setting>)
failed to sample program, exited with code: Some(255)

```

Currently `/proc/sys/kernel/perf_event_paranoid` is set to `4`. 

Temporarily set to 1, and reset to 4 later:

```sh
sudo sysctl -w kernel.perf_event_paranoid=1
```

## 4.4 pprof Report::write_options error

2025-06-15 Wk 24 Sun - 10:34

### 4.4.1 Issue

In trying to use pprof:

```sh
cargo add pprof

# In your code
use pprof::ProfilerGuard;

fn main() {
    let guard = ProfilerGuard::new(100).unwrap();
    
    // Your program runs here
    
    if let Ok(report) = guard.report().build() {
        let file = File::create("profile.pb").unwrap();
        let mut options = report.write_options();
        options.write_proto(&file).unwrap();
    }
}

# usage

# Run your program
cargo run --release

# Then analyze with pprof
pprof -http=localhost:8080 profile.pb
```


Based on instructions in [[#^tut1]] we encounter the following error:

```
error[E0599]: no method named `write_options` found for struct `pprof::Report` in the current scope
   --> src/main.rs:280:34
    |
280 |         let mut options = report.write_options();
    |                                  ^^^^^^^^^^^^^ method not found in `Report`


```

[[#^docs1|pprof documentation]] offers different instructions, maybe due to version changes.

For the official documentation [[#3.4.2 Pprof Rust setup to create profile.pb|code]] , some changes were necessary:

```rust
        println!("report: {}", &report);
```

Seems to give errors. Had to change it to `{:?}`

and 

```
no method named `pprof` found for struct `pprof::Report` in the current scope  
method not found in `Report`
```

Checking the features to see if there are any that bring pprof:

```sh
$ cargo install cargo-feature --locked
$ cargo feature pprof                 
   Avaliable features for `pprof`
default = ["cpp"]
_protobuf = []
cpp = ["symbolic-demangle/cpp"]
flamegraph = ["inferno"]
frame-pointer = []
framehop-unwinder = ["framehop", "memmap2", "object"]
huge-depth = []
large-depth = []
perfmaps = ["arc-swap"]
prost-codec = ["prost", "prost-derive", "prost-build", "sha2", "_protobuf"]
protobuf-codec = ["protobuf", "protobuf-codegen", "_protobuf"]
arc-swap (optional)
criterion (optional)
framehop (optional)
inferno (optional)
memmap2 (optional)
object (optional)
prost (optional)
prost-build (optional)
prost-derive (optional)
protobuf (optional)
protobuf-codegen (optional)
sha2 (optional)
```

Adding `protobuf-codec` feature fixed pprof missing in Report. Next we get

```
error[E0599]: no method named `encode` found for struct `Profile` in the current scope
   --> src/main.rs:285:21
    |
285 |             profile.encode(&mut content).unwrap();
    |                     ^^^^^^ method not found in `Profile`


```

Via [[001 General Assist Archive#1 No method pprof in Report|this diagnostic log]], we need to issue the following corrections:

Include the feature `prost-codec` only instead of protobuf:
```toml
pprof = { version = "0.15.0", features = ["prost-codec"] }
```

Then include
```rust
use pprof::protos::Message;
```

This runs, but then we also run into an issue trying to convert it to svg:

```sh
$ ~/go/bin/pprof -svg profile.pb
Main binary filename not available.
pprof: failed to execute dot. Is Graphviz installed? Error: exec: "dot": executable file not found in $PATH
```

Do this:

```sh
sudo apt-get install graphviz
```

And try again but with the executable as well this time:

```sh
~/go/bin/pprof -svg target/debug/bn_repo_editor profile.pb
```
### 4.4.2 Github issue report on broken pprof example


2025-06-16 Wk 25 Mon - 08:00

- [x] Since this was in the official documentation, we need to report this via a github issue. 

[[#^issue1|Issue]] submitted
### 4.4.3 Pprof Rust setup to create profile.pb

First, we need to enable the `prost-codec` instead of `protobuf` feature in Cargo.toml:
```toml
pprof = { version = "0.15.0", features = ["prost-codec"] }
```

Then in the code,

```rust
use pprof::protos::Message;
use std::fs::File;
use std::io::Write;

[...]

// Added in program start
let guard = pprof::ProfilerGuardBuilder::default().frequency(1000).blocklist(&["libc", "libgcc", "pthread", "vdso"]).build().unwrap();

[...]

// For output in profile.proto format:
match guard.report().build() {
    Ok(report) => {
        let mut file = File::create("profile.pb").unwrap();
        let profile = report.pprof().unwrap();

        let mut content = Vec::new();
        profile.encode(&mut content).unwrap();
        file.write_all(&content).unwrap();

        println!("report: {:?}", &report);
    }
    Err(_) => {}
};
```

In order to visualize `prof.pb`, we need [[#^link4|pprof]]. Here are the [[#3.5 pprof and Go installation|Installation instructions]].

## 4.5 pprof and Go installation

To install [[#^link4|pprof]]:

- Get Go. https://go.dev/dl/

(As of this time...)
```sh
wget https://go.dev/dl/go1.24.4.linux-amd64.tar.gz
```

Then install
```sh
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf go1.24.4.linux-amd64.tar.gz

# Save to settings
export PATH=$PATH:/usr/local/go/bin
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin
```

Then get pprof:
```sh
go install github.com/google/pprof@latest
```

# 5 HowTos
# 6 Investigations

# 7 Ideas
# 8 Side notes
