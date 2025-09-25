---
parent: "[[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]"
spawned_by: "[[002 Continuing impl for bn_repo_editor to parse struct info from the repo]]"
context_type: investigation
status: todo
---

Parent: [[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]

Spawned by: [[002 Continuing impl for bn_repo_editor to parse struct info from the repo]] 

Spawned in: [[002 Continuing impl for bn_repo_editor to parse struct info from the repo#^spawn-invst-088e2e|^spawn-invst-088e2e]]

# 1 Journal

2025-06-14 Wk 24 Sat - 06:45

```
145.86541107s Scanning "/home/lan/src/cloned/gh/dism-exe/bn6f/asm/asm31.s"
This took 1413.73046379s
1559.595904427s Writing to "/home/lan/data/apps/bn_repo_editor/lexer/asm/asm31.s"
This took 18934.689293169s
Full took 20348.422512138s
```

This is way too slow. Need to find out what the bottleneck here is. This file has 821338 tokens. Original file has 168866 lines.

2025-06-14 Wk 24 Sat - 21:04

Setup profiling according to [[#^tut1|this tutorial]] for flamegraph:

```sh
sudo apt-get install linux-tools-common linux-tools-generic
cargo install flamegraph
cargo build --release

# It's at 4, make it 1 temporarily
sudo sysctl -w kernel.perf_event_paranoid=1

CARGO_PROFILE_RELEASE_DEBUG=true cargo flamegraph --bin bn_repo_editor --  gen_debug_elf --regen

# reset back to 4
sudo sysctl -w kernel.perf_event_paranoid=4
```

2025-06-15 Wk 24 Sun - 09:10

It seems that my use of im::vector is very inefficient. But this view is also sort of hard to navigate. 

![[Pasted image 20250615090851.png]]

Let's try to use pprof. See [[#3.4.3 Pprof Rust setup to create profile.pb|instructions]].

2025-06-16 Wk 25 Mon - 08:10

For testing, we need to make it lexalize only two files:
```rust
fn app_lexer_scan_repo_files_to_dir(
	[...]
        .filter(|path| path.ends_with("asm00_0.s") || path.ends_with("asm00_1.s"))
```

```sh
$ cargo run gen_debug_elf --regen
$ sudo apt-get install graphviz
$ ~/go/bin/pprof -svg target/debug/bn_repo_editor profile.pb
```


![[Pasted image 20250616083716.png]]

We have some folds to optimize away. The graph included a [[#^docs2|link]] to documentation for how to read it.

2025-06-16 Wk 25 Mon - 09:25

- use of `Vector<T>` from the im crate for structural sharing and then doing concats on it in a loop like `&acc + &vector![item]` is slow. Replace with mutable pushs to Vec.

2025-06-16 Wk 25 Mon - 10:16

![[Pasted image 20250616101635.png]]

We still have to optimize `lexer_write_scanned_items_to_file`. This was written quickly for debugging, so it's not optimized. It rebuilds the files scanned on-the-fly to parse lineno info, which causes huge slowdowns. Still, let's try to do that hack better before we retire it completely.

- First immediate flag is immutable string concats within folds for the reconstructed file. Let's turn that into mutable edits.
- We also, as we reconstruct the file, call `get_lineno_and_col_at_index` which keeps turning the build string into lines again and again. This is unnecessary. Give it all the lines at  once, and let it use index to find the lineno and col by only searching the lines.

2025-06-16 Wk 25 Mon - 11:30

![[Pasted image 20250616113144.png]]

It seems creating file content -> lines iter is still expensive, despite that we only do it once per file now. This is over debug. We'll also try over release.

![[Pasted image 20250616114346.png]]

We get more readable and logical flows over release! It's also much faster.

![[Pasted image 20250616114556.png]]

This is our most expensive call right now. `core slice memchr memchr_aligned`

[[#^forum1-ans1|this forum answer]] has nice recommendations on using radare2 to generate a call graph png from an executable, which could be helpful in tracing problems like this.

We can look at that `get_lineno_and_col_at_index` in the assembly and source

```sh
objdump -d target/release/bn_repo_editor | less
```


# 2 Logs for improved times and actions

2025-06-16 Wk 25 Mon - 10:59

(Debug)

| Trial (#) | asm00_0 Scan | asm00_0 Write | asm00_0 Full | asm00_1 Scan | asm00_1 Write | asm00_1 Full |
| --------- | ------------ | ------------- | ------------ | ------------ | ------------- | ------------ |
| 0         | 15.87s       | 16.14s        | 32.0s        | 43.22s       | 164.21s       | 207.43s      |
| 1         | 11.83s       | 16.64s        | 28.47s       | 37.96s       | 162.18s       | 200.13s      |
| 2         | 12.78s       | 14.78s        | 27.56s       | 37.30s       | 155.65s       | 192.95s      |
| 3         | 12.18s       | 15.89s        | 28.06s       | 41.02s       | 166.53s       | 207.55s      |

| Trial (#) | When                         | Notes                                                                                                                                                                                                  |
| --------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0         | 2025-06-16 Wk 25 Mon - 09:25 | 1.  Improvements to scan based on Vector concat usage. Used mutable variables and loops instead of folds.                                                                                              |
| 1         | 2025-06-16 Wk 25 Mon - 10:57 | 1. lineno calc reuses lines iter from whole file and not recreate it from each accumulated portion of the file.<br>2. Did not show significant improvements in asm00_1 Write.                          |
| 2         | 2025-06-16 Wk 25 Mon - 11:07 | 1. Dropped original file reconstruction. No longer used and just wastes cycles.                                                                                                                        |
| 3         | 2025-06-16 Wk 25 Mon - 11:27 | 1. Logic only checks index within range or continues. We should break if the current index is above the query index not to waste cycles scanning the whole file when it's impossible to find anything. |

(Release)

| Trial (#) | asm00_0 Scan | asm00_0 Write | asm00_0 Full | asm00_1 Scan | asm00_1 Write | asm00_1 Full |
| --------- | ------------ | ------------- | ------------ | ------------ | ------------- | ------------ |
| 0         | 1.18s        | 2.40s         | 3.58s        | 3.76s        | 30.76s        | 34.53s       |

| Trial (#) | When                         | Notes                                                                                           |
| --------- | ---------------------------- | ----------------------------------------------------------------------------------------------- |
| 0         | 2025-06-16 Wk 25 Mon - 11:40 | 1. Release has vast timing improvements over debug. But writing for asm00_1 is still very slow. |
|           |                              |                                                                                                 |

2025-06-27 Wk 26 Fri - 14:45

With parallelization and using RON for file writes, now it takes in total $\approx 104$ seconds to do lexical analysis on the whole repository, which contains 11,421,102 tokens in total.
