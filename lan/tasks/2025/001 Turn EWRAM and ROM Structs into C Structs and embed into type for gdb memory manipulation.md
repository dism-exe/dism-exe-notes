---
status: todo
---
#lan #task #active #build #debugging #gdb #types #external 
```table-of-contents
```

# 1 Objective

As mentioned in [[000 Setup project & tools and build on a new Linux machine#2.3.1 Reading/writing to memory as a struct (TODO)]], we are unable to modify memory using C type information because although we document structs they are not present in a format gdb understands.

- [x] Setup a toy gba asm project with ldscript memory mapping
- [x] Successfully map EWRAM and ROM Structs to specific regions
- [x] Investigate using these types for read/write/watch in gdb
- [x] Able to import these symbols in addition to bn6f.elf for enhanced debugging
- [ ] Parse all structs from bn6f repo using bn_repo_editor
- [ ] Create a docker container for bn_repo_editor with the ability to generate a final elf to read symbols off of for bn6f.elf
- [ ] Setup a script that breaks in a function, and writes to memory via a type for persistent intervention


# 2 Journal

## 2.1 Misc Notes

2025-06-13 Wk 24 Fri - 07:37

[[#^link1]] mentions that NanoBoyadvance is currently the most accurate emulator.

## 2.2 Setting up basic gba project for debug symbol injection

We should be able to clone gba-bootstrap [[#^link3]] as our toy project. The next thing is to define a struct and map it to some region in EWRAM like `0x2000000`

```sh
git clone https://github.com/davidgfnet/gba-bootstrap.git
```

Because we already setup arm-none-eabi-xxx in [[000 Setup project & tools and build on a new Linux machine#3.2 arm-none-eabi-gdb requiring libncurses.so.5]] we are able to just go to `template_c` and `make`

let's try the game

```sh
mgba first.elf
```

Right, no game loop or anything. We can see what happens when we try to debug it:
```
Program received signal SIGILL, Illegal instruction.

0x00000004 in ?? ()
```

This is because in this fork, a `testfn` function was called first prior to the game loop. Commenting it out, we can see three dots in mGBA:

![[Pasted image 20250613082539.png]]

## 2.3 Investigating adding debug struct types and usage

Let's check via gdb if there are currently any recognized types in this game:

```
(gdb) info types
All defined types:
```

No. In Makefile, add `-g` for `ASFLAGS` and `CFLAGS` and remove `-O3` for `CFLAGS`, then we find:

```
All defined types:

File /home/lan/Downloads/gcc-arm-none-eabi-10.3-2021.10/arm-none-eabi/include/machine/_default_types.h:
57:     typedef unsigned short __uint16_t;

File /home/lan/Downloads/gcc-arm-none-eabi-10.3-2021.10/arm-none-eabi/include/sys/_stdint.h:
36:     typedef unsigned short uint16_t;

File source/main.c:
        char
        int
        long
        long long
        unsigned long long
        unsigned long
        short
        unsigned short
        signed char
        unsigned char
        unsigned int
```

(Attempt1) I added to main.c:

```C
typedef struct {
    uint16_t HP;
    uint16_t MP;
}MyStruct;
```

Still not recognized. 

(Attempt2) Let's make sure that the struct is used in main via a stack variable:

```C
struct MyStruct {
    uint16_t HP;
    uint16_t MP;
};

[...]

int main(int argc, char *argv[])
{
    REG_DISPCNT = DISPCNT_BG_MODE(3) | DISPCNT_BG2_ENABLE;

    struct MyStruct st = {0};
    st.HP = 400;

	[...]
}

``` 
^code1

We can find that it exists via the debug dump of readelf:

```sh
$ readelf -w  first.elf | less
[...]
DW_AT_name        : (indirect string, offset: 0x60): MyStruct
[...]
0x00000060 4d795374 72756374 00474e55 20433131 MyStruct.GNU C11
```

gdb also recognizes it now:

```
(gdb) info types
All defined types:                                                               
[...]
File source/main.c:
19:     struct MyStruct;
```

2025-06-13 Wk 24 Fri - 11:08

By adding
```C
// to main.c
struct MyStruct {
    uint16_t HP;
    uint16_t MP;
};
volatile struct MyStruct St1 __attribute__((section(".mystruct")));

// to gba_cart.ld
/* EWRAM Struct Info */
.mystruct 0x2000000 : { KEEP(*(.mystruct)) } > EWRAM
```

We are now able to get gdb to associate this address with the struct, without changing any behavior or using it in functions:

```
$ (vscode) -exec p St1

$2 = {HP = 0, MP = 0}
```

There is also in vscode autocompletion for fields of structs:
![[Pasted image 20250613111515.png]]

```
$ -exec p St1->HP

$3 = 0
```

Additionally, if a variable points to it, gdb is able to recognize what struct that symbol maps to:
```C
// Added to main:
void *x = 0x2000000;

// in vscode Variables/locals
x = 0x2000000 <St1>
```

But it will not show directly in the registers:

```C
// Added to main:
__asm__ volatile ("ldr r4, =0x2000000");

// Variables/Registers/CPU shows:
r4 = 0x2000000
```

vscode allows us to read memory, however when I tried to edit memory directly through this it did not register:
![[Pasted image 20250613111907.png]]

We can set memory directly:
```
$ -exec set {uint16_t[2]}0x2000000 = {0x03, 0x11}
=memory-changed,thread-group="i1",addr="0x02000000",len="0x4"
```

Now we can verify this reflects in the struct read:
```
$ -exec p St1

$6 = {HP = 3, MP = 17}
```

Yes! Though it would be good to specify these values in hex:

```
$ -exec p/x St1

$7 = {HP = 0x3, MP = 0x11}
```

We can also write directly via the struct:

```
$ -exec set St1->HP = 0x55

=memory-changed,thread-group="i1",addr="0x02000000",len="0x2"

$ -exec p/x St1

$8 = {HP = 0x55, MP = 0x11}
```

## 2.4 Setting up workflow for debug type injection

2025-06-13 Wk 24 Fri - 12:40

We should be able to make a tool to extract all types from the repository, and inject them whether they are EWRAM or ROM structs via

```C
// in main.c
struct MyStruct {
    uint16_t HP;
    uint16_t MP;
};
volatile struct MyStruct St1 __attribute__((section(".mystruct")));

struct MyROMStruct {
    uint16_t HP;
    uint16_t MP;
};
volatile struct MyROMStruct St2 __attribute__((section(".myromstruct")));

// in gba_cart.ld

/* EWRAM Struct Info */
.mystruct 0x2000000 : { KEEP(*(.mystruct)) } > EWRAM

/* ROM Struct Info */
.myromstruct 0x8003000 : { KEEP(*(.myromstruct)) } > ROM
}
```

and once we build the elf, we can just retain the debug symbols to be included in gdb:

```
$ arm-none-eabi-objcopy --only-keep-debug first.elf firstdbg.elf
$ (gdb) add-symbol-file firstgdb.elf 0
```

To quickly load the extra symbols and also connect to remote gdb (in the terminal) you can use

```sh
arm-none-eabi-gdb bn6f.elf -ex "target remote localhost:2345" -ex "add-symbol-file firstdbg.elf 0"
```

## 2.5 Continuing impl for bn_repo_editor to parse struct info from the repo

2025-06-13 Wk 24 Fri - 14:03

To get it to build I had to install
```
sudo apt-get install libssl-dev
```

This is useful for data viewing:
```sh
python3 -m pip install visidat
```

So far we have lexical analysis done on all the asm file. This is saved in the following format (visidata UI):

![[Pasted image 20250613183553.png]]

The fields are linecol (if parsed), lexon type, and lexon data.

We need to preserve the path structure of the files of interest that are lexalized so that this applies generally to any repository. Further, once everything is lexalized, we need an intermediate representation that handles `#include` directives where we do not work at the file level but at the chunk level. Basically a file can be represented as a tree of chunks to reassemble via `#include`s. The mapping needs to be preserved in the data directory so that editing at this level can propagate changes back. 

Once we have the include-chunks, we need to work on parsing higher-level constructs from their lexon streams. There are many things to consider here. Functions, data... For the purpose of this note, our first priority is struct types. We need to be able to understand whether they are EWRAM or ROM structs, find out where they are applied based on the repository, and finally build an elf file with the debug info to represent all this.

2025-06-13 Wk 24 Fri - 19:45

```
subtractive: "tools/bn_textscript_dumper/tests/data/TextScriptBattleTutFullSynchro.s"
subtractive: "tools/bn_textscript_dumper/tests/data/TextScriptChipDescriptions0_86eb8b8.s"
subtractive: "tools/bn_textscript_dumper/tests/data/TextScriptChipTrader86C580C.s"
subtractive: "tools/bn_textscript_dumper/tests/data/TextScriptDialog87E30A0.s"
subtractive: "tools/bn_textscript_dumper/tests/data/TextScriptFolderNames86cf4ac.s"
subtractive: "tools/bn_textscript_dumper/tests/data/TextScriptWhoAmI.s"
subtractive: "tools/bn_textscript_dumper/tests/data/out/TextScriptBattleTutFullSynchro.s"
subtractive: "tools/bn_textscript_dumper/tests/data/out/TextScriptChipDescriptions0_86eb8b8.s"
subtractive: "tools/bn_textscript_dumper/tests/data/out/TextScriptChipTrader86C580C.s"
subtractive: "tools/bn_textscript_dumper/tests/data/out/TextScriptDialog87E30A0.s"
subtractive: "tools/bn_textscript_dumper/tests/data/out/TextScriptFolderNames86cf4ac.s"
subtractive: "tools/bn_textscript_dumper/tests/data/out/TextScriptWhoAmI.s"
```

It seems unexpected files are getting caught in. 
- [x] We need to add a blacklist setting for folders to not include.

### 2.5.1 Investigating slow lexer

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

### 2.5.2 Logs for improved times and actions

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

---

![[Pasted image 20250627144708.png]]
Figure 1: visidata breakdown by lexon_type of the entire repository of `bn6f` ^fig1

---

It's much better than before. Can be even better, but at least usable.

### 2.5.3 Map current lexer project files to include chunks

2025-06-28 Wk 26 Sat - 12:43

**What is a lexer? And why use it?**

The point of a lexer is so that we no longer deal with the repository source files in terms of text, but rather in terms of typed boxes.

![[Pasted image 20250628124516.png]]

In the above image, every box has its own grammatical meaning. These would be the lexer tokens.

The next step once each source file has a corresponding `.lexer.ron`, is to resolve all `.include` directives so that we can deal with continuous streams of tokens that produce effect rather than deal with how they break down in file structure.

There are also 11 million tokens in the `bn6f` project, so running the lexical stage all at once in parallel helps save time with analysis and reconstruction of the repository files.

2025-06-16 Wk 25 Mon - 21:46

Repository source code (asm) can `.include` files. We won't be able to parse it as a stream as-is, we need to find all the `.include`s and turn the repository into chunks. Each file can correspond to a list of chunks. So a file that maps from the files in `lexer/` to files in `lexer-include-chunks/` . The paths can be preserved, with an appended `.chunkN` 

First, we should stop getting lineno and storing this in a quick text file. We need the lexical stage to be easy and quick to serialize/deserialize. See [[001 General Assist Archive#^d895a3|csv writer/reader setup]].

2025-06-16 Wk 25 Mon - 22:57

This should make it easy to write/read from csv with quotes and multilines. Now we just need to write/read the lexer phase results themselves which are HashMap of path and LexerReport. 

2025-06-17 Wk 25 Tue - 09:49

Here is the process:

```mermaid
graph TD

%% Nodes
A0[Repository]
A1[Lexer]
A2[LexerIncludeChunks]
B1[CodeParser]
B2[ROMDataParser]
B3[StructParser]
C1[LexerReport]
C2[LexerIncludeChunksReport]
C3[StructParserReport]
D1[User]
D2[...]
W1[LexerWriter]
W2[LexerIncludeChunksWriter]
W3[StructWriter]

%% Settings
classDef note fill:#f9f9a6,stroke:#333,stroke-width:1px,color:#000,font-style:italic;

%% Connections
A0 --> |sources| A1
C1 --> |sources| A2

C2 --> |sources| B1
C2 --> |sources| B2
C2 --> |sources| B3

A1 --> |generates| C1
A2 --> |generates| C2
B3 --> |generates| C3

W3 --> |overwrites| C2
W2 --> |overwrites| C1
W1 --> |overwrites| A0

C3 --> |sources| W3
C2 --> |sources| W2
C1 --> |sources| W1

B1 --> D2
B2 --> D2

D1 <--> |IO| C3
```
^repo-read-write-process1


2025-06-17 Wk 25 Tue - 23:54

Created a test `lexer_record_vec_read_write_are_inverses` to investigate how `write_vec_to_csv` and `read_vec_to_csv` are giving different data

```
called `Result::unwrap()` on an `Err` value: Error(Deserialize { pos: Some(Position { byte: 36, line: 2, record: 1 }), err: DeserializeError { field: None, kind: Message("unknown variant `-784054805`, expected one of `Word`, `Text`, `UInt`, `NegInt`, `UHex`, `NegHex`, `Sign`") } })
```

#### 2.5.3.1 Reading/Writing LexerReport to RON files

2025-06-26 Wk 26 Thu - 19:33

See [[Wk 25 000 Rust CSV Reader Writer with Derive]] and [[Wk 25 003 Rust Parquet serialize and deserialize]] for investigations on file format to use for serialization.

For now we decided to go with RON. It's simple, and we managed to be able to seamlessly generate `Vec<T>` <-> Text File with it. One entry per line. It repeats column names, which may inflate the size but it's a simple protocol. Going to implement use of it in [`lan_rs_common`](<https://github.com/LanHikari22/lan_rs_common>) according to the example in [`repro003`](<https://github.com/LanHikari22/rs_repro/blob/main/src/repro_tracked/repro003_ron_read_write.rs>)

2025-06-26 Wk 26 Thu - 22:32

We should now be writing `lexer.ron` files to `{app_data_dir}/lexer/`

```sh
# In /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release -- gen_debug_elf --regen
```

It works for writing!

2025-06-26 Wk 26 Thu - 23:06

For translating all the `.lexer.ron` files into a csv buffer to be analyzed with visidata, see  [[Wk 26 000 Lexer RON to CSV for quick visidata inspection]].

Now we need to make sure we are able to read the `LexerReport`. 

2025-06-26 Wk 26 Thu - 23:34

The testing shows that we are able to read the report now as expected!

```rust
    let report = LexerReport::read(&lexer_path);
    println!("keys {:?}", report.path_to_records.keys());
    println!(
        "# tokens {:?}",
        report //_
            .path_to_records
            .values()
            .map(|v| v.len())
            .collect::<Vec<_>>()
    );
    println!("last modified {:?}", report.path_to_last_modified);
```

```
keys ["/home/lan/data/apps/bn_repo_editor/lexer/asm/asm00_0.lexer.ron", "/home/lan/data/apps/bn_repo_editor/lexer/asm/asm00_1.lexer.ron"]
# tokens [21464, 69850]
last modified {"/home/lan/src/cloned/gh/dism-exe/bn6f/asm/asm00_0.s": "SystemTime { tv_sec: 1749648687, tv_nsec: 580792540 }", "/home/lan/src/cloned/gh/dism-exe/bn6f/asm/asm00_1.s": "SystemTime { tv_sec: 1749827025, tv_nsec: 951723350 }"}
```

Now let's run full analysis! We should be able to move on from the lexer stage to the lexer-chunks!

```sh
cargo run --release -- gen_debug_elf --regen
```


#### 2.5.3.2 Creating include chunks

2025-06-27 Wk 26 Fri - 14:32

##### 2.5.3.2.1 Tasks

Okay. So we have the `LexerReport` now. We want to turn it into a `LexerIncludeChunksReport`. What should we do?

- [ ] We shouldn't repeat ourselves. We should check the date modified and mirror it in stage 2. If it is identical, and an output exists, nothing to do.
- [x] We need a new master RON file that maps between files and an array of enums, the enum being either a `Lexer(path_to_chunked_lexer_file)`, or an `Include(key_within_this_hash)`.  The reason here is to not repeat our work. We will eventually hit all the files, so any recursion (that isn't deadly) should be resolved via this method. For now, do not handle corner cases like circular includes, etc. These should fail build and `OK`. 
- [ ] We need individual chunk files. `{lexer_file}.chunk{n}.lexer.ron` 
- [ ] Ability to read the the report, including the maser RON file, and each chunk as mapping to a single file path, as well as the file that maps modifications for stage 2. Modifications are reflected off of the repository base files in every stage to cache compute.
- [ ] Flat master document. Meaning, it only includes chunk files to process.  It does not preserve hierarchies such as A -> B -> {C, D} where A includes B which includes C, D. Here, A would just have a flat list of chunks, some named by A, some by B, some by C and D. In addition, this does not map one-to-one with every file in the repository anymore. Only root files. A root file is a lexer file that is not included anywhere. 
- [ ] Maintain within the flat master document a mapping: root file -> list of included files. 

Eventually, we should:
- [ ] Refine how we retrieve the base files to begin with. Trace the build artifacts, do not just parse all legible source files.

##### 2.5.3.2.2 Journal

2025-06-28 Wk 26 Sat - 16:22

For function `split_by_include_directive`, 

We have to split by the `directive` token with text `include`, and keep it inclusive. The very next token contains the string, so we need to take these splits and patch them to take the first token of the next split for the current one. This solution could probably use some generalization or different approach.

2025-06-28 Wk 26 Sat - 17:08

```
Repository Lexing stage took 99.966933472s
Processing lexer include chunks took 32.674442395s
```

Issues to fix for this run:
- [x]  It seems we have made a path mistake, and it generated inside `lexer/lexer`, instead of just `lexer/`.
- [x] The chunks still include a string token. Remaining from splitting by include tokens. Some chunks even only have one string token. These shouldn't be created.

2025-06-28 Wk 26 Sat - 18:12

Thought `path_to_last_modified.json` was overwriting the one from the previous stage, but that was not the case.

- [x] New `path_to_last_modified.json` needs to be in the `lexer_incl_chunks/` not overwriting `lexer/.

There are also `.incbin` includes. But these are binary blobs, and we cannot process them as text includes.  They could be handled at a different level, as blob data.

##### 2.5.3.2.3 Debugging empty string included in lexer after include

2025-06-28 Wk 26 Sat - 18:34

For testing, I am not removing any records from the chunks when doing an inclusive split at the `.include` directive.

For `~/data/apps/bn_repo_editor/lexer_incl_chunks/data.lexer.41.chunk.lexer.ron`, we see:

```ron
(lexon_type: String, lexon_data: Text(""), capture: "\"")
(lexon_type: String, lexon_data: Text("data/dat38_67.s"), capture: "data/dat38_67.s\"\n")
(lexon_type: DoubleColonLabel, lexon_data: Word("comp_86C9148"), capture: "comp_86C9148::\n\t")
(lexon_type: Directive, lexon_data: Word("incbin"), capture: ".incbin ")
(lexon_type: String, lexon_data: Text(""), capture: "\"")
(lexon_type: String, lexon_data: Text("data/compressed/comp_86C9148.lz77"), capture: "data/compressed/comp_86C9148.lz77\"\n")
[...]
```

In the lexer file `~/data/apps/bn_repo_editor/lexer/data.lexer.ron` we see:

```ron
[...]
(lexon_type: DoubleColonLabel, lexon_data: Word("dat38_67"), capture: "dat38_67::\n\t")
(lexon_type: Directive, lexon_data: Word("include"), capture: ".include ")
(lexon_type: String, lexon_data: Text(""), capture: "\"")
(lexon_type: String, lexon_data: Text("data/dat38_67.s"), capture: "data/dat38_67.s\"\n")
[...]
```

There are three tokens with the `.include`. The include itself, an empty string, and then the actual file to include. Why?

In the original source code `data.s`:

```thumb
dat38_67::
	.include "data/dat38_67.s"
comp_86C9148::
	.incbin "data/compressed/comp_86C9148.lz77"
```

This is a bug. That empty string token shouldn't exist. We need to look back to the lexer stage how this happened. 

Also the capture says `\"`...

For debugging, adding to `lexer::search_for_repo_paths_to_process`:
```rust
.filter(|path| path.ends_with("data.s")) // for debugging, minimal output.
```

Tracing the tokens in `lexer::build_scanner`, 

```rust
println!("Debug {lexon_type:?} {lexon_data:?} -- {:?}", captures[0]);
```

Prints too much because of the data. Do not include `UHex` and `Comma`.  Also directed `.byte` and `.word`

```rust
if lexon_type != LexonType::UHex
	&& lexon_type != LexonType::Comma
	&& lexon_data != LexonData::Word("byte".into())
	&& lexon_data != LexonData::Word("word".into())
{
	println!("Debug {lexon_type:?} {lexon_data:?} -- {:?}", captures[0]);
}
```

There are many `.../data.s` files like `/home/lan/src/cloned/gh/dism-exe/bn6f/maps/MrWeatherComp/data.s`... Let the filter be specific:

```rust
.filter(|path| path == &PathBuf::from_str("/home/lan/src/cloned/gh/dism-exe/bn6f/data.s").unwrap()) // for debugging, minimal output.
```

This file shouldn't have raw data, so we can trace directly again

```rust
println!("Debug {lexon_type:?} {lexon_data:?} -- {:?}", captures[0]);
```

```
[...]
Debug DoubleColonLabel Word("dat38_67") -- "dat38_67::\n\t"
Debug Directive Word("include") -- ".include "
Debug String Text("") -- "\""
Debug String Text("data/dat38_67.s") -- "data/dat38_67.s\"\n"
Debug DoubleColonLabel Word("comp_86C9148") -- "comp_86C9148::\n\t"
[...]
```

Additional trace on `captures`:

```rust
if captures[0] == "\"" {
	println!("Beep! captures: {captures:?}");
}
```

```
Debug Directive Word("include") -- ".include "
Debug String Text("") -- "\""
Beep! captures: ["\"", ""]
```

Just before `comm_regex::regex_capture_once`, let's trace the string and regex at that point:

```rust
.map(|lexon_type| {
	println!("s: {s}");
	println!("re: {:?}", regex_scanners[lexon_type]);
	comm_regex::regex_capture_once(s, &regex_scanners[lexon_type])
```

```
[...]
s: "data/dat38_99.s"
re: Regex("^(.*?)\"\\s*")
Debug String Text("") -- "\""
Beep! captures: ["\"", ""]   
[...]
```

A typo. The regex ends with `\"` but does not begin with `\"`...

Specifically in `LexonType::to_regex`, 

```rust
LexonType::String => format!(r##"(.*?)"\s*"##),
```

It should be

```rust
LexonType::String => format!(r##""(.*?)"\s*"##),
```

2025-06-28 Wk 26 Sat - 20:02

Now the `split_by_include_directive` is panicking because the next chunk is possibly empty... Have to check before grabbing the first record off of it.

`~/data/apps/bn_repo_editor/lexer_incl_chunks/data.lexer.0.chunk.lexer.ron` is empty. So is 1, 2, and 3. We need to filter empty chunks out.

2025-06-28 Wk 26 Sat - 20:23

Writing a RON object to file for `~/data/apps/bn_repo_editor/lexer_incl_chunks/lexer_include_chunks_recursive_listing.ron`:

```
(
    path_to_chunks: {
        "/home/lan/data/apps/bn_repo_editor/lexer/data.lexer.ron": File("/home/lan/data/apps/bn_repo_editor/lexer_incl_chunks/data.lexer.71.chunk.lexer.ron"),
    },
)
```

This should list all of the chunks for `data.lexer.ron`, not just the last one.

The trace shows many entries, but it seems this collect collapses it all to just the last one:

```rust
println!("mut_path_to_chunk_tups: {mut_path_to_chunk_tups:?}");

let recursive_listing_report = LexerIncludeChunksRecursiveListing {
	path_to_chunks: mut_path_to_chunk_tups
		.into_iter()
		.collect::<HashMap<_, _>>(),
};
```

We should instead group by the path, so that it knows to make it a vec for the chunks.

This was also part of the error, missed making this a `Vec<ChunkIndex>`, or the rust compiler would've caught this problem.

```rust
pub struct LexerIncludeChunksRecursiveListing {
    pub path_to_chunks: HashMap<PathBuf, ChunkIndex>,
}
```

This should fix the issue:

```rust
#[derive(Debug, Serialize, Deserialize)]
pub struct LexerIncludeChunksRecursiveListing {
    pub path_to_chunks: HashMap<PathBuf, Vec<ChunkIndex>>,
}

// [...]

let recursive_listing_report = LexerIncludeChunksRecursiveListing {
	path_to_chunks: mut_path_to_chunk_tups
		.into_iter()
		.into_group_map()
};
```

```
(
    path_to_chunks: {
        "/home/lan/data/apps/bn_repo_editor/lexer/data.lexer.ron": [
            File("/home/lan/data/apps/bn_repo_editor/lexer_incl_chunks/data.lexer.0.chunk.lexer.ron"),
            Key("data/dat38_0.s"),
            File("/home/lan/data/apps/bn_repo_editor/lexer_incl_chunks/data.lexer.1.chunk.lexer.ron"),
            Key("data/dat38_30.s"),
            File("/home/lan/data/apps/bn_repo_editor/lexer_incl_chunks/data.lexer.2.chunk.lexer.ron"),
            Key("data/dat38_31.s"),
            File("/home/lan/data/apps/bn_repo_editor/lexer_incl_chunks/data.lexer.3.chunk.lexer.ron"),
            Key("data/dat38_32.s"),
            File("/home/lan/data/apps/bn_repo_editor/lexer_incl_chunks/data.lexer.4.chunk.lexer.ron"),
            Key("data/dat38_33.s"),
[...]
        ],
    },
)
```

OK!

Now we can remove debugging (data.s only filter) and have this capture all chunks for all files.

2025-06-28 Wk 26 Sat - 20:47

Hmm. New parsing issues.

```
thread '<unnamed>' panicked at src/lexer.rs:558:14:
Scan failed: "\"/home/lan/src/cloned/gh/dism-exe/bn6f/data/textscript/compressed/CompText879EBA8.s\":167:2 Failed to scan \"\"\n\tts_print_ch "

thread '<unnamed>' panicked at src/lexer.rs:558:14:
Scan failed: "\"/home/lan/src/cloned/gh/dism-exe/bn6f/data/textscript/compressed/CompText87C15A8.s\":491:7 Failed to scan g\\\",\\n\"\n\t.strin "

thread '<unnamed>' panicked at src/lexer.rs:558:14:
Scan failed: "\"/home/lan/src/cloned/gh/dism-exe/bn6f/data/textscript/compressed/CompText87C6028.s\":653:6 Failed to scan r\\\"!?\"\n\tts_key_ "

thread '<unnamed>' panicked at src/lexer.rs:558:14:
Scan failed: "\"/home/lan/src/cloned/gh/dism-exe/bn6f/data/textscript/compressed/CompText879DA74.s\":572:2 Failed to scan \"\"\n\tts_print_ch "
```

##### 2.5.3.2.4 Rewriting include chunking logic

2025-07-17 Wk 29 Thu - 09:10

```sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release -- gen_debug_elf
```

```
thread 'main' panicked at src/lexer_include_chunks.rs:102:69:
index out of bounds: the len is 0 but the index is 0
```

This is a fault in `lexer_include_chunks.rs > split_by_include_directive`,

Specifically for `iwram_code.s`:

```sh
cat ~/src/cloned/gh/dism-exe/bn6f/iwram_code.s

# out
        .text
asm38:
        .include "asm/asm38.s"
```

```
path "/home/lan/data/apps/bn_repo_editor/lexer/iwram_code.lexer.ron"
chunks [([LexerRecord { lexon_type: Directive, lexon_data: Word("text"), capture: ".text\n" }, LexerRecord { lexon_type: ColonLabel, lexon_data: Word("asm38"), capture: "asm38:\n\t" }], Some(LexerRecord { lexon_type: Directive, lexon_data: Word("include"), capture: ".include " })), ([], Some(LexerRecord { lexon_type: String, lexon_data: Text("asm/asm38.s"), capture: "\"asm/asm38.s\"" }))]
cur_chunks [LexerRecord { lexon_type: Directive, lexon_data: Word("text"), capture: ".text\n" }, LexerRecord { lexon_type: ColonLabel, lexon_data: Word("asm38"), capture: "asm38:\n\t" }]
cur_sep LexerRecord { lexon_type: Directive, lexon_data: Word("include"), capture: ".include " }
nxt_chunks []
```

We can see `chunks` is a vector of records and optional separator. The first has the `.include` separator as expected, while the second chunk.

2025-07-17 Wk 29 Thu - 09:50

We're running into logical problems here because there are two tokens we're trying to split on. First the `.include` and its associated input. It would be cleaner to rewrite this such that we first join them together as a single cohesive unit. Then we just split by that cohesive unit.

2025-07-17 Wk 29 Thu - 10:40

Logic was rewritten to map into `Rec` or `Incl` variants, `Rec` being a normal record and `Incl` would have both the `.include` token and the string path token. Then it is just a matter of doing an inclusive split by this `Incl` variant, and unwrapping redundant `Rec`  for the other records. 

Running into this issue now in the redundant unwrapping logic:

```
thread 'main' panicked at src/lexer_include_chunks.rs:69:50:
Did not expect Incl when unwrapping Rec
```

There is a scenario where a chunk seems to only include an `.include {path}` dual tokens.

2025-07-17 Wk 29 Thu - 11:07

Had to also ensure that we filter out the `{path}` tokens when mapping dual tokens, or they will remain there when we grab them as a next-record and yet process them next iteration.

```
thread 'main' panicked at src/lexer_include_chunks.rs:303:37:
Separators are includes only. Instead in "/home/lan/data/apps/bn_repo_editor/lexer/data/textscript/compressed/CompText87557A8.lexer.ron" got LexerRecord { lexon_type: Ident, lexon_data: Word("ts_end"), capture: "ts_end" }
```

2025-07-18 Wk 29 Fri - 20:35

```
sep is Rec(LexerRecord { lexon_type: Ident, lexon_data: Word("CompText876E538_unk100"), capture: "CompText876E538_unk100" })

thread 'main' panicked at src/lexer_include_chunks.rs:323:37:
Separators are includes only. Instead in "/home/lan/data/apps/bn_repo_editor/lexer/data/textscript/compressed/CompText876E538.lexer.ron" got LexerRecord { lexon_type: Ident, lexon_data: Word("CompText876E538_unk100"), capture: "CompText876E538_unk100" }
```

Error seems to have changed slightly...

```
SEP(>1): Rec(LexerRecord { lexon_type: Ident, lexon_data: Word("CompText87A39FC_unk4"), capture: "CompText87A39FC_unk4" })
```

The issue is because we assume all chunks with more than one element end with a separator. This is not the case. There can always be chunks that are not the last chunk, and that contain multiple records. But we can just directly check if it's an Incl variant.

##### 2.5.3.2.5 Pend
#### 2.5.3.3 Resolving Include keys

```
"/home/lan/data/apps/bn_repo_editor/lexer/data/textscript/compressed/CompText877567C.lexer.ron": [
File("/home/lan/data/apps/bn_repo_editor/lexer_incl_chunks/data/textscript/compressed/CompText877567C.lexer.0.chunk.lexer.ron"),
Key("charmap.inc"), 
File("/home/lan/data/apps/bn_repo_editor/lexer_incl_chunks/data/textscript/compressed/CompText877567C.lexer.1.chunk.lexer.ron"),
Key("include/macros/enum.inc"), 
File("/home/lan/data/apps/bn_repo_editor/lexer_incl_chunks/data/textscript/compressed/CompText877567C.lexer.2.chunk.lexer.ron"),
Key("include/bytecode/text_script.inc"),
File("/home/lan/data/apps/bn_repo_editor/lexer_incl_chunks/data/textscript/compressed/CompText877567C.lexer.3.chunk.lexer.ron"),
],
```

`.incbins` can remain as they are. For example `Bin("data/compressed/comp_87F4394.lz77")`, but `Key(...)` need to be resolved recursively to that Key's chunks so that we have just a continuous stream of chunks to fetch per file.

2025-07-18 Wk 29 Fri - 21:55

It seems some files are missing. We have not processed `*.inc` files like `charmap.inc` which is used in many places here.

```sh
find ~/data/apps/bn_repo_editor/lexer -type f | grep 'charmap'

# out
[nothing]
```

Further, instead of using `.lexer.ron` it is better to preserve the original extension: `.s.lexer.ron`, or `.inc.lexer.ron`, etc.

See [[#3.1 Revising lexer parsing to include inc files and preserve format]]

We are also seeing panics when [[#3.2 Panics when processing Lexer files|processing lexer files]]. ^spawn-task-182155

2025-08-07 Wk 32 Thu - 20:59


##### 2.5.3.3.1 Pend
#### 2.5.3.4 Pend
# 3 Tasks

## 3.1 Revising lexer parsing to include inc files and preserve format

- [ ] 

2025-07-18 Wk 29 Fri - 21:58

From [[#2.5.3.3 Resolving Include keys]].

### 3.1.1 Pend


## 3.2 Panics when processing Lexer files

- [ ] 
### 3.2.1 Escaped quotes in string

2025-07-18 Wk 29 Fri - 23:15

Noticed during [[#2.5.3.3 Resolving Include keys]]. [[#^spawn-task-182155]].

```rust
thread '<unnamed>' panicked at src/lexer.rs:557:14:
Scan failed: "\"/home/lan/src/cloned/gh/dism-exe/bn6f/data/textscript/compressed/CompText8742D64.s\":224:6 Failed to scan r\\\"\\n\"\n\t.string "
```


Since we process in parallel, we did not see these panics.

2025-07-20 Wk 29 Sun - 03:02

The suspect line is

```
.string "The \"Healing Water\"\n"
```

Due to unhandled quote escaping. This was captured in `test_lexer_record_scan > case001.1` .

We parsed Healing and Water as if they are idents, and tripped on the final escaped quote...

```
Failed to scan: "Failed to parse around at 28: <r\\\"\\n\"\n                >
```

2025-07-20 Wk 29 Sun - 04:23

The parsing is in the function returned by `lexer.rs > build_scanner` .

Our regex here is not able to accommodate escaped quotes:

```rust
LexonType::String => format!(r##""(.*?)"\s*"##),
```

We should allow any number of escaped quotes.

This is an issue that others have encountered. For example in this [post](https://stackoverflow.com/questions/249791/regex-for-quoted-string-with-escaping-quotes).

There, they recommend 

Similar to [Guy Bedford](https://stackoverflow.com/users/1292590/guy-bedford)'s [answer](https://stackoverflow.com/a/10786066/6944447),

```rust
LexonType::String => format!(r##""([^"\\]*(\\.[^"\\]*)*)"\s*"##),
```

is able to handle escaped quotes within the quotes.

Using the [wiki regex docs](https://en.wikipedia.org/wiki/Regular_expression#POSIX_.28Portable_Operating_System_Interface_.5Bfor_Unix.5D.29) for some meanings.

Breakdown:

| Regex           | Meaning                                                                                                                                                                                                                                                                           |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"(...)"\s*`    | Outer layer. All that we're matching in `...` must be enclosed in quotes, and also consumes any white space. Inner is `[^"\\]*(\\.[^"\\]*)*`.                                                                                                                                     |
| `[^"\\]*`       | Match anything not  `"` or `\`                                                                                                                                                                                                                                                    |
| `(\\.[^"\\]*)*` | This is a composite. Matches `\`, any character, and then anything that is not `"` or `\`.  This allows us to capture `\"` and any other escaped character as it matches the description of `\\.`. This triggers again as we consume the remaining non-escape-related characters. |

2025-08-07 Wk 32 Thu - 21:01

Thanks to [FutureFractal](https://github.com/FutureFractal) for bringing to my attention [vscode cpp syntax regex](https://github.com/Microsoft/vscode/blob/main/extensions/cpp/syntaxes/c.tmLanguage.json) and also specifically [string escape sequences](https://github.com/Microsoft/vscode/blob/main/extensions/cpp/syntaxes/c.tmLanguage.json#L3329)



### 3.2.2 Pend
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

## 5.1 Multiline String in Rust

- [x] 

2025-07-18 Wk 29 Fri - 23:27

For my unit tests, I would like to be able to write multiline strings that preserve the indentation I want.

I have done something for this before...

Yes! In my dbmint work.

Like this:

```rust
r#"
    @   thumb_func_start call_m4aSoundMain
    call_m4aSoundMain:
    @   push {lr}
    @   bl m4aSoundMain
    @   pop {pc}
    @   .word unk_2006840
    @   .word dword_80005BC
    @   .balign 4, 0
    dword_80005BC: .hword 0x121c
    @   .asciz "%D"
    @   .balign 4, 0
    @   thumb_func_end call_m4aSoundMain
"#//_
	.replace("    ", "")
	.replace("@", " "),
```

This way indentation is preserved how I want it, and the code itself is hygienic and doesn't  mess around with the indent level of the function content.

# 6 References
1.  https://gbadev.net/getting-started.html#tutorials ^link1
2. https://github.com/AntonioND/gba-bootstrap ^link2
3. https://github.com/davidgfnet/gba-bootstrap ^link3
4. https://markaicode.com/profiling-applications-2025/ ^tut1
5. https://docs.rs/crate/pprof/latest ^docs1
6.  https://github.com/google/pprof ^link4
7. https://github.com/tikv/pprof-rs/issues/273 ^issue1
8. https://git.io/JfYMW ^docs2
9. https://reverseengineering.stackexchange.com/questions/16081/how-to-generate-the-call-graph-of-a-binary-file ^forum1
10. https://reverseengineering.stackexchange.com/a/16082 ^forum1-ans1
11. https://book.rada.re/ ^docs3

```mermaid
graph TD

%% Nodes
A1[link1]
A2[link2]
N2_1[A minimal working project, but not immediately supporting asm]:::note
A3[link3]
N3_1[This fork includes asm as well via test.s altho original makefile allows]:::note

%% Settings
classDef note fill:#f9f9a6,stroke:#333,stroke-width:1px,color:#000,font-style:italic;

%% Connections
A1 --> |cites| A2
A2 --> |forks| A3

N3_1 -.-> |about| A3
N2_1 -.-> |about| A2
```

