---
parent: '[[000 Setup project & tools and build on a new Linux machine]]'
spawned_by: '[[006 Setting up gdb-multiarch with vscode for frontend]]'
context_type: investigation
status: skipped
---

Parent: [000 Setup project & tools and build on a new Linux machine](../000%20Setup%20project%20&%20tools%20and%20build%20on%20a%20new%20Linux%20machine.md)

Spawned by: [006 Setting up gdb-multiarch with vscode for frontend](../tasks/006%20Setting%20up%20gdb-multiarch%20with%20vscode%20for%20frontend.md)

Spawned in: [<a name="spawn-invst-ea3561" />^spawn-invst-ea3561](../tasks/006%20Setting%20up%20gdb-multiarch%20with%20vscode%20for%20frontend.md#spawn-invst-ea3561)

# 1 Journal

\[...\]

For this we need arm-none-eabi-gdb or gdb-multiarch.

````sh
sudo apt-get install gdb-multiarch
````

\[git issue1\] suggests that gdb-multiarch is preferable and they removed support for arm-none-eabi-gdb? We can try to go with this until we hit any limitations.
