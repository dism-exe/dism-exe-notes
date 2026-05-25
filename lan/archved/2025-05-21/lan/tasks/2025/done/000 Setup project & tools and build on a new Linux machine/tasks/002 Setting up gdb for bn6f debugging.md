---
parent: "[[000 Setup project & tools and build on a new Linux machine]]"
spawned_by: "[[000 Setup project & tools and build on a new Linux machine]]"
context_type: task
status: done
---

Parent: [[000 Setup project & tools and build on a new Linux machine]]

Spawned by: [[000 Setup project & tools and build on a new Linux machine]] 

Spawned in: [[000 Setup project & tools and build on a new Linux machine#^spawn-task-422a75|^spawn-task-422a75]]

# 1 Journal

2025-06-12 Wk 24 Thu - 06:26

Install gdb-multiarch:

```sh
sudo apt-get install gdb-multiarch
```

Start the game:

```sh
mgba bn6f.elf
```

In mGBA, Tools > Start Gdb Server > Break on All Writes > Start

Now start gdb:

```sh
gdb-multiarch bn6f.elf
```

Connect to the remote gdb server:

```
(gdb) target remote localhost:2345
```

I get:

```
Remote debugging using localhost:2345
main_awaitFrame () at ./asm/main.s:93
93              beq loc_80003A6

```

So we know symbols are loaded.

2025-09-25 Wk 39 Thu - 10:07

Can also do:

```
gdb-multiarch bn6f.elf -ex "target remote localhost:2345"
```