---
parent: "[[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]"
spawned_by: "[[003 Map current lexer project files to include chunks]]"
context_type: investigation
status: todo
---

Parent: [[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]

Spawned by: [[003 Map current lexer project files to include chunks]] 

Spawned in: [[003 Map current lexer project files to include chunks#^spawn-invst-43448a|^spawn-invst-43448a]]

# 1 Journal

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
