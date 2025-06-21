

# 1 Rust Parquet serialize and deserialize

2025-06-20 Wk 25 Fri - 14:09

This note relates to [[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]. We are trying to run the lexer on the entire repository and save it as tokens and we need a good library for this and to be conservative about space and fast about reading/writing.


# 2 Objective

Produce a ready example of serializing a `Vec<T>` to a parquet file and deserializing it again. This should happen with minimum friction, using `#[derive]s` on the types. Ideally using or similar to the `serde` library.

# 3 Instructions for LLM
- This is a diagnostic document and not a conversation. Everything shared is context. Address the questions tagged (Q#) like (Q1) for example. If you see something like (~1), assume it part of the archive and not a latest set of questions.
	- Since it keeps occurring, I ask Again
	- !!! NEVER RESPOND TO (~1), (~2), etc.
	- ONLY respond to the tagged questions. Nothing else.

(LLM chatgpt-4o)
(/LLM chatgpt-4o)

# 4 Journal

<hr class="__chatgpt_plugin">
### 1.2.1 role::assistant<span style="font-size: small;"> (chatgpt-4o)</span>

I have found a [tutorial](<https://colinsblog.net/2021-07-27-reading-parquet-with-rust/>) by Colin which writes on parquet use, however it manually constructs the expected schema. I need it to be automatic based on type definitions.

Same for this [post](<https://stackoverflow.com/questions/67900928/writing-a-vec-of-rows-to-a-parquet-file>). It gives an example, but not using derive.

(~1) Find a working example of this.

- There is a [parquet_derive](<https://docs.rs/crate/parquet_derive/latest>) [[#^1]] crate.

They have a working example there. Let's try to adapt it to the same example we used in [[Wk 25 000 Rust CSV Reader Writer with Derive]]


Searching stack overflow for `parquet_derive`, I find this [post](<https://stackoverflow.com/questions/75124404/creating-datafusions-dataframe-from-vecstruct-in-rust/75125062#75125062>) which leads to an [example](<https://docs.rs/parquet_derive/30.0.1/parquet_derive/derive.ParquetRecordWriter.html>) in the [parquet_derive](<https://docs.rs/crate/parquet_derive/latest>) [[#^1]] docs


(Q1) Combine the current code with their working example. I do not want a manual schema either.

## 4.1 Getting the parquet_derive example to work

It did not work immediately, but with some minor corrections it did. It will be in `repro001`. 

When I try to open it with visidata, I get:

```
External package "pyarrow" not installed
```

Install it:

```sh
python3 -m pip install pyarrow
```

Now we are able to open parquet files and confirm the example works as expected.

In order to run the [example](<https://github.com/LanHikari22/rs_repro/blob/main/src/repro_tracked/repro001_parquet_derive_example.rs>):

```sh
git clone https://github.com/LanHikari22/rs_repro.git
cd rs_repro
cargo run --features "repro001"
```

Then you will see `example.parquet` created in the repo root directory.


# 5 Solution

serde


```rust
use parquet;
use parquet::record::RecordWriter;

#[derive(Debug, ParquetRecordWriter)]
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

# 6 References
1. [parquet_derive docs](<https://docs.rs/parquet_derive/30.0.1/parquet_derive/derive.ParquetRecordWriter.html>) ^1