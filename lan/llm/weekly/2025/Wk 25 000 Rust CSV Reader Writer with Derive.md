#lan #llm #pr #external #rust


# 1 Rust Derive in Struct for CSV Vec Writer/Reader


<hr class="__chatgpt_plugin">

# 2 Objective

This note relates to [[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]. We are trying to run the lexer on the entire repository and save it as tokens and we need a good library for this and to be conservative about space and fast about reading/writing.

I want a quick CSV writer/reader for a `Vec<T>`. If this could be done quickly with derives that would be great. Allow any data within Strings in the CSV. Multiline, quotes, whatever. Figure it out. If CSV is not the right format, then something just like it that handles this. TSV, or whatever.

# 3 Instructions for LLM:
- This is a diagnostic document and not a conversation. Everything shared is context. Address the questions tagged (Q#) like (Q1) for example. If you see something like (~1), assume it part of the archive and not a latest set of questions.
	- Since it keeps occurring, I ask Again
	- !!! NEVER RESPOND TO (~1), (~2), etc.
	- ONLY respond to the tagged questions. Nothing else.

# 4 Journal

## 4.1 Fixing issues with csv solution

2025-06-18 Wk 25 Wed - 21:05

Writer uses 
```csv
.quote_style(csv::QuoteStyle::NonNumeric) // ensures strings are quoted when needed
```

Also what I have so far fails inverse property:
```rust
    #[test]
    fn lexer_record_vec_read_write_are_inverses() {
        // create some random records
        let records = {
            (0..10)
                .map(|_| rs_comm::test::fuzzed_instance::<LexerRecord>().unwrap())
                .collect::<Vec<_>>()
        };

        let debug_str_before = format!("{records:?}");

        let (path, _) = rs_comm::test::create_random_tmp_file().unwrap();

        rs_comm::util::io::write_vec_to_csv(&path.to_string_lossy(), &records).unwrap();

        let read_records: Vec<LexerRecord> =
            rs_comm::util::io::read_vec_from_csv(&path.to_string_lossy()).unwrap();

        fs::remove_file(path).unwrap();
        
        let debug_str_after = format!("{read_records:?}");

        assert_eq!(debug_str_before, debug_str_after);
    }
```

```
called `Result::unwrap()` on an `Err` value: Error(Deserialize { pos: Some(Position { byte: 36, line: 2, record: 1 }), err: DeserializeError { field: None, kind: Message("unknown variant `-1014961617`, expected one of `Word`, `Text`, `UInt`, `NegInt`, `UHex`, `NegHex`, `Sign`") } })
```

```rust
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize, Arbitrary)]
pub enum LexonData {
    Word(String), // One token, no spaces
    Text(String),
    UInt(u32),
    NegInt(i32),
    UHex(u32),
    NegHex(i32),
    Sign,
}

#[derive(Debug, Serialize, Deserialize, Arbitrary)]
pub struct LexerRecord {
    lexon_type: LexonType,
    lexon_data: LexonData,
    capture: String,
}
```


It seems that when writing to csv, only something like `-345` is preserved in the lexon_data column and not `NegInt(-345).`

(~1) Can `writer.serialize` be configured to preserve the variant information and then for it to be read back correctly?

LLM suggests to tell serde to record both variant and content like this:

```rust
#[serde(tag = "variant", content = "value")]
pub enum LexonData {
...
}
```

This modification presents the problem:

```
thread 'lexer::tests::lexer_record_vec_read_write_are_inverses' panicked at src/lexer.rs:777:80:
called `Result::unwrap()` on an `Err` value: Error(Serialize("cannot serialize LexonData container inside struct when writing headers from structs"))
```

2025-06-20 Wk 25 Fri - 12:42

This [serde documentation](<https://serde.rs/enum-representations.html>) on enum representations shows multiple representations with tags, but all for JSON. We don't want JSON, we want CSV because there can be hundreds of thousands of lines and to repeat the same text of {col1: "val1", col2: "val2"} would be very wasteful.

In this [forum question](<https://stackoverflow.com/questions/69417454/serialize-deserialize-csv-with-nested-enum-struct-with-serde-in-rust>) [Netwave](https://stackoverflow.com/users/1695172/netwave) [answers](<https://stackoverflow.com/a/69418163>) with the need to add

```rust
#[serde(tag = "type")]
```

and that alone should fix the issue?

They confirm limitations with csv/serde integration and point to this [issue](<https://github.com/BurntSushi/rust-csv/issues/211>) in rust-csv which show that it's a limitation they don't intend to fix or know how to.  In the issue, a potential workaround is given in this [playground](<https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&gist=e783dda6e5473a53b61eb77e42d1b488>) by [The0x539](<https://github.com/The0x539>)

I also like their use of [Playground](<https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=03b72840eb492266beffe660f3ac1895>) in order to make code snippets immediately accessible. In fact, I will use it for the [[#1.1.3 Solution]] in this diagnostic document.

2025-06-20 Wk 25 Fri - 13:30

We do not want to make use of  [The0x539](<https://github.com/The0x539>)'s workaround because it hardcodes variant structs in multiple places. 

(~1) Is there a cheap way to do a derive, with some crate to resolve the enum weirdness even if it turns it into a string "Stuff(5)" formatting just for the purposes of serde/csv? It still needs to be cheap, like a derive, not something I reimplement all the time.

(~2) Alternatively, is there a better csv serialize/deserlialize library?

(~3) Alternatively, is there a better format that avoids repetitive text than JSON that plays well with serde other than CSV? that's the main appeal to use csv anyway, but a recursive, typed, text format, with minimal symbols (like repeated columns as in JSON), would be desirable.

LLM suggests [ron](<https://github.com/ron-rs/ron>). Although it is verbose and repeats column named, it still has high interoperability with serde and enums. So we could use it.

## 4.2 Considering other options

2025-06-20 Wk 25 Fri - 14:03

Let's try to do this with parquet. This has costs in simplicity because it's no longer a text file format and so version control becomes trickier. Looking into version control solutions, I am led to [Delta Lake](<https://github.com/delta-io/delta>) and for rust specifically [delta-rs](<https://github.com/delta-io/delta-rs>). This seems to have python bindings and is too heavy for our purposes here. 

For now version control is not a critical cost, let's just try to get parquet serialization/deserialization going with minimum friction.

This is out of scope for this note, so check out [[Wk 25 003 Rust Parquet serialize and deserialize]]

## 4.3 Setting up repro003 with Ron

PEND

2025-06-21 Wk 25 Sat - 22:00

Let's get `Ron` working. `parquet_derive` also does not support enums right now, nor nested structs... read/write using ron derive will be in `repro003`. We will be reproducing the [example](<https://github.com/ron-rs/ron?tab=readme-ov-file#mainrs>) in the README, but modified to work with a `Vec<T>`. 

2025-06-22 Wk 25 Sun - 14:04

[this docs example](<https://github.com/ron-rs/ron/blob/master/examples/encode_file.rs>) uses `.to_io_writer_pretty` which can be useful for writing to files.

We are able to read/write single structs, but how about `Vec<T>`? This can be done manually, but the writers of the library have not set up examples for this use case. 

Another issue is that visidata will not recognize RON, since it is not a popular protocol.

2025-06-22 Wk 25 Sun - 15:19

deserializing seems to fail because the struct is unnamed.

Actually it was because of an empty line, did not trim the string.

2025-06-22 Wk 25 Sun - 15:53

[repro003](<https://github.com/LanHikari22/rs_repro/blob/main/src/repro_tracked/repro003_ron_read_write.rs>) is done. We can now use RON to serialize `Vec<T>` to/from files with derive. This solution uses a magic string separator. 

To run it, use 

```sh
git clone https://github.com/LanHikari22/rs_repro.git
cd rs_repro
cargo run --features "repro003"
```

## 4.4 Open PR to add repro003 to examples for RON

2025-06-22 Wk 25 Sun - 15:54

Let's open a PR for [ron](<https://github.com/ron-rs/ron>) with the new example. 

First let's add a feature issue for a new example to write to /read from file with `Vec<T>`

2025-06-22 Wk 25 Sun - 16:11

Created [#572](<https://github.com/ron-rs/ron/issues/572>).

After forking the project,

```sh
cd /home/lan/src/cloned/gh/LanHikari22/forked
git clone git@github.com:LanHikari22/ron.git
cd ron
git checkout -b add_vec_file_read_write_example
cp ~/src/cloned/gh/LanHikari22/rs_repro/src/repro_tracked/repro003_ron_read_write.rs examples/file_read_write_vec.rs
```

Then let's do some modifications for brevity for the example here.

Checking `git log` for convention, it seems we can just write `Add x example`

```sh
git add .
git commit -m "Add file IO with Vec<T> example"
git push origin add_vec_file_read_write_example
```

When trying to open a  PR, it says 

```markdown
* [ ] I've included my change in `CHANGELOG.md`
```

Checking `CHANGELOG.md`, it links to the following:
- The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
- and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Will leave it to the maintainers to advise or take over about version incrementing. Let's add the commit details to the `changelog`. The convention is to point to the PR itself. So let's create the PR and then add the commit with the `changelog` and point to it.

This is the [PR](<https://github.com/ron-rs/ron/pull/573>). Let's add it to the `changelog`.

```
## Unreleased

- Add a new example `file_read_write_vec.rs` for reading and writing `Vec<T>` to/from files. ([#573](https://github.com/ron-rs/ron/pull/573))
```

```sh
git add .
git commit -m "Update CHANGELOG.md (#573)"
git push origin add_vec_file_read_write_example
```

2025-06-22 Wk 25 Sun - 16:38

Now we can check the mark for including the change.

### 4.4.1 Feedback on RON PR

2025-06-26 Wk 26 Thu - 07:10

In PR [#573](<https://github.com/ron-rs/ron/pull/573>),  [`juntyr`](<https://github.com/juntyr>) recommended that a different strategy could be used. So that we d not require a magic separator.

#### 4.4.1.1 Setting no line separator and string escapes in pretty config

2025-06-26 Wk 26 Thu - 08:07

Running into this issue when trying to create my own `PrettyConfig` instance:

```rust
error[E0639]: cannot create non-exhaustive struct using struct expression
  --> src/repro_tracked/repro003_ron_read_write.rs:73:21
   |
73 | /                     PrettyConfig {
74 | |                         depth_limit: todo!(),
75 | |                         new_line: todo!(),
76 | |                         indentor: todo!(),
...  |
82 | |                         compact_arrays: todo!(),
83 | |                     }
   | |_____________________^
```

2025-06-26 Wk 26 Thu - 08:11

Okay the example `rustdoc` for `PrettyConfig` does mention how to use it:

```rust
use ron::ser::PrettyConfig;

let my_config = PrettyConfig::new()
    .depth_limit(4)
    // definitely superior (okay, just joking)
    .indentor("\t".to_owned());
```

Funny!

2025-06-26 Wk 26 Thu - 08:16

Options available for `PrettyConfig` can be found [here](<https://github.com/ron-rs/ron/blob/ba572011ad8eb24992cb6fa9e540a86e3e249a91/src/ser/mod.rs#L119>) (As of commit [`ba57201`](<https://github.com/ron-rs/ron/commit/ba572011ad8eb24992cb6fa9e540a86e3e249a91>)).

Since we want one entry per line for as much compactness as possible, we want:
- `compact_arrays`  set to `true`
- `compact_structs` set to `true`
- `compact_maps` set to `true`
- `escape_strings` set to `true`. This is the default but just to be explicit.

2025-06-26 Wk 26 Thu - 08:29

Seems we can only use whitespace for `seperator`:

```rust
if !conf.separator.chars().all(is_whitespace_char) {
	return Err(Error::Message(String::from(
		"Invalid non-whitespace `PrettyConfig::separator`",
	)));
}
```

So the current `" "` is the minimal we want to keep.

2025-06-26 Wk 26 Thu - 08:36

Seems for [`repro003`](<https://github.com/LanHikari22/rs_repro/blob/main/src/repro_tracked/repro003_ron_read_write.rs>) I am using version `0.8.x`, but actually latest is `0.10.x`. This includes the new `PrettyConfig` settings like `compact_structs`, `compact_maps`, and `escape_strings`. Updating this for `repro003`. It should be mirroring the same example as in PR [#573](<https://github.com/ron-rs/ron/pull/573>).

We get errors bumping `0.8.x` -> `0.10.1`...

```rust
error[E0277]: `?` couldn't convert the error to `SpannedError`                                                                                                                                
   --> src/repro_tracked/repro003_ron_read_write.rs:107:36                                                                                                                                    
    |                                                                                                                                                                                         
106 | fn read_ron_vec_from_file<T: DeserializeOwned>(path: &PathBuf) -> SpannedResult<Vec<T>> {                                                                                               
    |                                                                   --------------------- expected `SpannedError` because of this                                                         
107 |     let mut file = File::open(path)?;                                                                                                                                                   
    |                    ----------------^ the trait `From<std::io::Error>` is not implemented for `SpannedError`                                                                             
    |                    |                                                                                                                                                                    
    |                    this can't be annotated with `?` because it has type `Result<_, std::io::Error>`                                                                                     
    |                                                                                                                                                                                         
    = note: the question mark operation (`?`) implicitly performs a conversion on the error value using the `From` trait

```


![[Pasted image 20250626084337.png]]

2025-06-26 Wk 26 Thu - 09:08

I mapped the errors to `SpannedError` with a `Position` at line 1 col 1, and the io error as string for `Error:Io`.

2025-06-26 Wk 26 Thu - 09:13

It works!

```sh
cat example.ron                  
(name: "Alice", email: "alice@example.com", comment: "New\nLine, and \"quotes\"", role: Admin(key: 3735944941), meta: (created_at: "2025-06-22", author: "Admin"))
(name: "Bob", email: "bob@example.com", comment: "Tabs\ttoo", role: User, meta: (created_at: "2025-06-22", author: "Admin"))
```

One entry per line!

Is there anything for us to test before we push this commit?

2025-06-26 Wk 26 Thu - 09:21

So this works for  [`repro003`](<https://github.com/LanHikari22/rs_repro/blob/main/src/repro_tracked/repro003_ron_read_write.rs>) bumped to `0.10.1` but still when we try to get the example working in the repo itself, we get this error for constructing `SpannedError` :

```
missing structure fields:

- span
```

This is trickier as this change is not part of the latest release as of Jun 2025. See the [`changelog`](<https://github.com/ron-rs/ron/blob/master/CHANGELOG.md>).

We do not need to be returning this `SpannedError`. Just return the code, via Error, and it's simpler.

2025-06-26 Wk 26 Thu - 09:35

Ok! Pushed again!

```sh
git push origin add_vec_file_read_write_example
```

#### 4.4.1.2 Changes for Commit (06bf8a0)

Commit is [here](<https://github.com/ron-rs/ron/pull/573/commits/06bf8a0d5189205ef20b5a65a646f627bb13b08d>).

- [x] Updated example to remove magic separator and ensure one entry per row
- [x] Ensured example works under `0.10.1` and not just `0.8.x`.
- [x] Ensured that new lines added per entry handled windows/non-windows
- [x] Ensured that the example file is deleted after testing

I want to:

- [x] Update example to remove the magic separator and instead condense the pretty output as suggested, one entry per row.

### 4.4.2 Feedback on RON PR: Clarify comments and rename example file

2025-06-26 Wk 26 Thu - 15:51

For PR [#573](<https://github.com/ron-rs/ron/pull/573>),

[`juntyr`](<https://github.com/juntyr>)'s feedback:
- [x] Update comment description. It still talks about the magic seperator
- [x] Rename the example file generated to `vec-example.ron`

Testing:
- [x] Ensure it works over in `repro003` before copying over

Also:
- Simplified `read_ron_vec_from_str` pipeline. It no longer needs to trim each string and filter for empties. The data format is simpler now. It can directly just parse lines and map the lines to entries!

2025-06-26 Wk 26 Thu - 15:56

OK. [Commited](<https://github.com/ron-rs/ron/pull/573/commits/4ac4dccb53f9521bf21c5093c9ba1d8c08f7b27d>) and pushed.

### 4.4.3 Solving CI Failure for RON PR

PEND

2025-06-29 Wk 26 Sun - 11:35

For PR [#573](<https://github.com/ron-rs/ron/pull/573>),

There are some CI failures we need to resolve like [this](<https://github.com/ron-rs/ron/actions/runs/15902804363/job/44870823770?pr=573>).

2025-06-30 Wk 27 Mon - 23:42

```sh
# in ~/src/cloned/gh/LanHikari22/forked/ron
cargo test --no-default-features

# output
[...]
115 |     file.read_to_string(&mut content)?;
    |          ----------------------------^ the trait `From<std::io::Error>` is not implemented for `ron::Error`
    |          |
    |          this can't be annotated with `?` because it has type `Result<_, std::io::Error>`
[...]
```

I made sure the same code works on [`repro003`](<https://github.com/LanHikari22/rs_repro/blob/main/src/repro_tracked/repro003_ron_read_write.rs>) but it fails here...

2025-07-04 Wk 27 Fri - 21:51

```rust
let mut file = File::create(path)?;
```

This doesn't fail on `cargo test` but does fail on `cargo test --no-default-features`.

Though we are also not installing any ron features for repro003:

```toml
repro003 = ["ron", "serde"]
ron = { version = "0.10.1", optional = true }
serde = { version = "1", features = ["derive"], optional = true }
```

2025-07-04 Wk 27 Fri - 20:21

So this line behaves differently. It errors but only in that no default features...

2025-07-05 Wk 27 Sat - 04:40

It's fine now after mapping the error to string in Error::Io. but there's another failing [job](<https://github.com/ron-rs/ron/actions/runs/15902804363/job/44870798384?pr=573>).

```sh
cargo fmt --all -- --check
```

```diff
cargo fmt --all -- --check
Diff in /home/lan/src/cloned/gh/LanHikari22/forked/ron/examples/file_read_write_vec.rs:1:
 /// Getting RON with type derives and reading/writing a Vec<T> to/from a file.
-use ron::{Error, error::SpannedResult, ser::PrettyConfig};
-use serde::{Deserialize, Serialize, de::DeserializeOwned};
+use ron::{error::SpannedResult, ser::PrettyConfig, Error};
+use serde::{de::DeserializeOwned, Deserialize, Serialize};
 use std::{
     fs::File,
     io::{Read, Write},
Diff in /home/lan/src/cloned/gh/LanHikari22/forked/ron/examples/file_read_write_vec.rs:107:
 
     let mut content = String::new();
 
-    file.read_to_string(&mut content).map_err(|e| Error::Io(e.to_string()))?;
+    file.read_to_string(&mut content)
+        .map_err(|e| Error::Io(e.to_string()))?;
 
     read_ron_vec_from_str(&content).map_err(|e| e.code)
 }
```

Exit status is 1. These are the formatting failures.

Corrected. Their rust formatter is a bit different from mine... Around the imports.

# 5 Solution

### 5.1.1 Using CSV (Limited enum support)

^csv-writer-reader-setup1

```sh
cargo add csv
```

```toml
serde = { version = "1.0.219", features = ["derive"] }
csv = "1.3.1"
```

```rust
use std::error::Error;
use std::fs::File;
use serde::{Serialize, de::DeserializeOwned};
use csv::{WriterBuilder, ReaderBuilder};

/// Mark a type as "#[derive(Serialize, Deserialize)]" and it should be usable through this
pub fn write_vec_to_csv<T: Serialize>(path: &str, data: &[T]) -> Result<(), Box<dyn Error>> {
    let file = File::create(path)?;
    let mut writer = WriterBuilder::new()
        .quote_style(csv::QuoteStyle::NonNumeric) // ensures strings are quoted when needed
        .from_writer(file);

    for item in data {
        writer.serialize(item)?;
    }

    writer.flush()?;
    Ok(())
}

pub fn read_vec_from_csv<T: DeserializeOwned>(path: &str) -> Result<Vec<T>, Box<dyn Error>> {
    let file = File::open(path)?;
    let mut reader = ReaderBuilder::new()
        .from_reader(file);

    let mut result = Vec::new();
    for record in reader.deserialize() {
        result.push(record?);
    }
    Ok(result)
}
```

```rust
use serde::{Deserialize};

#[derive(Debug, Serialize, Deserialize)]
struct User {
    name: String,
    email: String,
    comment: String,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let users = vec![
        User {
            name: "Alice".into(),
            email: "alice@example.com".into(),
            comment: "New\nLine, and \"quotes\"".into(),
        },
        User {
            name: "Bob".into(),
            email: "bob@example.com".into(),
            comment: "Tabs\ttoo".into(),
        },
    ];

    write_vec_to_csv("users.csv", &users).unwrap();
    let loaded: Vec<User> = read_vec_from_csv("users.csv").unwrap();
    println!("{:#?}", loaded);
    Ok(())
}
```

#### 5.1.1.1 Playground

Try this in [Playground](<https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=03b72840eb492266beffe660f3ac1895>)

# 6 References
1. [RON Wiki Specification](<https://github.com/ron-rs/ron/wiki/Specification>) ^1