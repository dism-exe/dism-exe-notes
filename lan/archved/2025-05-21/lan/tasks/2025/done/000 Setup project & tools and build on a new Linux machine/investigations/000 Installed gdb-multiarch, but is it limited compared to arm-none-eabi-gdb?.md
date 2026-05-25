---
parent: "[[000 Setup project & tools and build on a new Linux machine]]"
spawned_by: "[[006 Setting up gdb-multiarch with vscode for frontend]]"
context_type: investigation
status: skipped
---
Parent: [[000 Setup project & tools and build on a new Linux machine]]

Spawned by: [[006 Setting up gdb-multiarch with vscode for frontend]] 

Spawned in: [[006 Setting up gdb-multiarch with vscode for frontend#^spawn-invst-ea3561|^spawn-invst-ea3561]]

# 1 Journal

[...]

For this we need arm-none-eabi-gdb or gdb-multiarch.

```sh
sudo apt-get install gdb-multiarch
```

[git issue1] suggests that gdb-multiarch is preferable and they removed support for arm-none-eabi-gdb? We can try to go with this until we hit any limitations.