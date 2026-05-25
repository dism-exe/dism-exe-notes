---
parent: "[[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]"
spawned_by: "[[003 Map current lexer project files to include chunks]]"
context_type: task
status: todo
---

Parent: [[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]

Spawned by: [[003 Map current lexer project files to include chunks]] 

Spawned in: [[003 Map current lexer project files to include chunks#^spawn-task-f67f89|^spawn-task-f67f89]]

# 1 Journal

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

