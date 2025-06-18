# 1 Rust Derive in Struct for CSV Vec Writer/Reader


<hr class="__chatgpt_plugin">

### 1.1.1 role::user

I want a quick CSV writer/reader for a `Vec<T>`. If this could be done quickly with derives that would be great. Allow any data within Strings in the CSV. Multiline, quotes, whatever. Figure it out. If CSV is not the right format, then something just like it that handles this. TSV, or whatever.

<hr class="__chatgpt_plugin">

### 1.1.2 role::assistant<span style="font-size: small;"> (chatgpt-4o)</span>
^csv-writer-reader-setup1
Distilled, ^d895a3

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

pub fn write_csv<T: Serialize>(path: &str, data: &[T]) -> Result<(), Box<dyn Error>> {
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

pub fn read_csv<T: DeserializeOwned>(path: &str) -> Result<Vec<T>, Box<dyn Error>> {
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
use serde::{Serialize, Deserialize};

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

    write_csv("users.csv", &users).unwrap();
    let loaded: Vec<User> = read_csv("users.csv").unwrap();
    println!("{:#?}", loaded);
    Ok(())
}
```
