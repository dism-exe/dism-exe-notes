---
parent: '[[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]'
spawned_by: '[[003 Map current lexer project files to include chunks]]'
context_type: task
status: todo
---

Parent: [001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation](../001%20Turn%20EWRAM%20and%20ROM%20Structs%20into%20C%20Structs%20and%20embed%20into%20type%20for%20gdb%20memory%20manipulation.md)

Spawned by: [003 Map current lexer project files to include chunks](003%20Map%20current%20lexer%20project%20files%20to%20include%20chunks.md)

Spawned in: [<a name="spawn-task-f67f89" />^spawn-task-f67f89](003%20Map%20current%20lexer%20project%20files%20to%20include%20chunks.md#spawn-task-f67f89)

# 1 Journal

2025-06-26 Wk 26 Thu - 19:33

See [Wk 25 000 Rust CSV Reader Writer with Derive](../../../../llm/weekly/2025/Wk%2025%20000%20Rust%20CSV%20Reader%20Writer%20with%20Derive.md) and [Wk 25 003 Rust Parquet serialize and deserialize](../../../../llm/weekly/2025/Wk%2025%20003%20Rust%20Parquet%20serialize%20and%20deserialize.md) for investigations on file format to use for serialization.

For now we decided to go with RON. It's simple, and we managed to be able to seamlessly generate `Vec<T>` \<-> Text File with it. One entry per line. It repeats column names, which may inflate the size but it's a simple protocol. Going to implement use of it in [`lan_rs_common`](https://github.com/LanHikari22/lan_rs_common) according to the example in [`repro003`](https://github.com/LanHikari22/rs_repro/blob/main/src/repro_tracked/repro003_ron_read_write.rs)

2025-06-26 Wk 26 Thu - 22:32

We should now be writing `lexer.ron` files to `{app_data_dir}/lexer/`

````sh
# In /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release -- gen_debug_elf --regen
````

It works for writing!

2025-06-26 Wk 26 Thu - 23:06

For translating all the `.lexer.ron` files into a csv buffer to be analyzed with visidata, see  [Wk 26 000 Lexer RON to CSV for quick visidata inspection](../../../../llm/weekly/2025/Wk%2026%20000%20Lexer%20RON%20to%20CSV%20for%20quick%20visidata%20inspection.md).

Now we need to make sure we are able to read the `LexerReport`.

2025-06-26 Wk 26 Thu - 23:34

The testing shows that we are able to read the report now as expected!

````rust
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
````

````
keys ["/home/lan/data/apps/bn_repo_editor/lexer/asm/asm00_0.lexer.ron", "/home/lan/data/apps/bn_repo_editor/lexer/asm/asm00_1.lexer.ron"]
# tokens [21464, 69850]
last modified {"/home/lan/src/cloned/gh/dism-exe/bn6f/asm/asm00_0.s": "SystemTime { tv_sec: 1749648687, tv_nsec: 580792540 }", "/home/lan/src/cloned/gh/dism-exe/bn6f/asm/asm00_1.s": "SystemTime { tv_sec: 1749827025, tv_nsec: 951723350 }"}
````

Now let's run full analysis! We should be able to move on from the lexer stage to the lexer-chunks!

````sh
cargo run --release -- gen_debug_elf --regen
````
