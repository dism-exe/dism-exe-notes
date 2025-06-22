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

## 4.3 Setting up repro003 with Ron (PEND)

2025-06-21 Wk 25 Sat - 22:00

Let's get `Ron` working. `parquet_derive` also does not support enums right now, nor nested structs... read/write using ron derive will be in `repro003`. We will be reproducing the [example](<https://github.com/ron-rs/ron?tab=readme-ov-file#mainrs>) in the README, but modified to work with a `Vec<T>`. 

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