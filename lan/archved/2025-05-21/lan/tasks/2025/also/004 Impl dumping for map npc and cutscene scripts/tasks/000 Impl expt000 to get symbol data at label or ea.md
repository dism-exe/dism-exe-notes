---
parent: "[[004 Impl dumping for map npc and cutscene scripts]]"
spawned_by: "[[004 Impl dumping for map npc and cutscene scripts]]"
context_type: task
status: done
---

Parent: [[004 Impl dumping for map npc and cutscene scripts]]

Spawned by: [[004 Impl dumping for map npc and cutscene scripts]]

Spawned in: [[004 Impl dumping for map npc and cutscene scripts#^spawn-task-2b4257|^spawn-task-2b4257]]

# 1 Journal

2025-10-18 Wk 42 Sat - 11:51 +03:00

To start dumping, we need to be able to know what the data content of a given ROM label is.

We can process those symbols and their sizes from `bn6f.map`, and then read `bn6f.elf` for the data content.

2025-10-18 Wk 42 Sat - 12:01 +03:00

```sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data byte_804EA41

# out (error, relevant)
thread 'main' panicked at src/drivers/symbols.rs:277:18:
Failed to convert symbol to ea: SymbolNotInMap("byte_804EA41")
```

It is there.

```rust
// in fn read_map_file_for_symbol_addresses
content
	.lines()
	.map(|line| line.trim().split_ascii_whitespace().collect::<Vec<_>>())
	.filter(|tokens| tokens.len() == 2 && u32::from_str_radix(tokens[0], 16).is_ok())
	.map(|x| {
		println!("Helloooo {x:?}");
		x
	})
```

This does not trigger any logs, but putting the map x before that filter, you would see many.

We resolve this by removing the "0x" in eas. But we also have to handle some invalid exceptions: `Helloooo ["0x00000000", "0x1f"]` 

We filter for the invariants that the first token is a hex and not 0, and the second one is not a hex.

2025-10-18 Wk 42 Sat - 12:12 +03:00o

```sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data byte_804EA41

# out (relevant)
mut_buf_len1: 107
mut_buf_len2: 107
SymbolData { ea: RomEa { ea: 134539841 }, label: Identifier { s: "byte_804EA41" }, size: 107, data: [5, 255, 58, 0, 82, 234, 4, 8, 38, 233, 187, 9, 8, 0, 0, 0, 0, 2, 0, 15, 136, 234, 4, 8, 2, 16, 31, 45, 235, 4, 8, 2, 32, 47, 219, 235, 4, 8, 2, 48, 63, 59, 236, 4, 8, 2, 64, 79, 141, 236, 4, 8, 2, 80, 95, 214, 236, 4, 8, 2, 96, 111, 225, 237, 4, 8, 1, 246, 238, 4, 8, 31, 255, 244, 22, 41, 180, 30, 1, 2, 2, 4, 5, 8, 31, 255, 245, 22, 2, 0, 0, 172, 234, 4, 8, 2, 1, 1, 198, 234, 4, 8, 1, 246, 238, 4, 8] }
```

These are harder to read when they're not hex.

The `mut_buf_len` are to check that this fills the buffer, which it does:

```rust
pub fn read_bin_file_at_offset_and_size(path: &Path, size: usize, offset: usize) -> Result<Vec<u8>, std::io::Error> {
    let file = File::open(path)?;

    let mut mut_buf = vec![0; size];

    println!("mut_buf_len1: {}", mut_buf.len());

    file.read_exact_at(&mut mut_buf, offset as u64)?;

    println!("mut_buf_len2: {}", mut_buf.len());

    Ok(mut_buf)
}
```

2025-10-18 Wk 42 Sat - 12:17 +03:00

(HowTo) Checked [rust-by-example display](https://doc.rust-lang.org/rust-by-example/hello/print/print_display.html) for how to `write!` usage with `fmt::Formatter` 


2025-10-18 Wk 42 Sat - 12:34 +03:00

```
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data byte_804EA41

# out (relevant)
SymbolData {
  ea: RomEa { ea: 0804ea41 }
  label: Identifier { s: "byte_804EA41" }
  size: 107
  data: [05, ff, 3a, 00, 52, ea, 04, 08, 26, e9, 
         bb, 09, 08, 00, 00, 00, 00, 02, 00, 0f, 
         88, ea, 04, 08, 02, 10, 1f, 2d, eb, 04, 
         08, 02, 20, 2f, db, eb, 04, 08, 02, 30, 
         3f, 3b, ec, 04, 08, 02, 40, 4f, 8d, ec, 
         04, 08, 02, 50, 5f, d6, ec, 04, 08, 02, 
         60, 6f, e1, ed, 04, 08, 01, f6, ee, 04, 
         08, 1f, ff, f4, 16, 29, b4, 1e, 01, 02, 
         02, 04, 05, 08, 1f, ff, f5, 16, 02, 00, 
         00, ac, ea, 04, 08, 02, 01, 01, c6, ea, 
         04, 08, 01, f6, ee, 04, 08, ]
}
```

Better!

And it's correct!