


<hr class="__chatgpt_plugin">

### 0.1.1 role::user

Basically I have a `HashMap<PathBuf, String>` in Rust. I wanna be able to write/read it to/from JSON. As simple as possible.


<hr class="__chatgpt_plugin">

### 0.1.2 role::assistant<span style="font-size: small;"> (chatgpt-4o)</span>

Distilled,

I ended up using

```rust
fn write_path_to_last_modified_to_file(path_to_last_modified: &HashMap<PathBuf, String>, path: &PathBuf) {
    let data = {
        path_to_last_modified
            .into_iter()
            .map(|(k, v)| (k.to_string_lossy().into_owned(), v.clone()))
            .collect::<Vec<_>>()
    };

    let json = serde_json::to_string_pretty(&data).unwrap();
    fs::write(path, json).unwrap();
}

fn read_path_to_last_modified_from_file(path: &PathBuf) -> Option<HashMap<PathBuf, String>> {
    let json = fs::read_to_string(path).ok()?;
    let data: Vec<(String, String)> = serde_json::from_str(&json).ok()?;

    let hashmap = {
        data
            .into_iter()
            .map(|(path, last_modified)| (PathBuf::from(path), last_modified))
            .collect::<HashMap<_, _>>()
    };

    Some(hashmap)
}
```