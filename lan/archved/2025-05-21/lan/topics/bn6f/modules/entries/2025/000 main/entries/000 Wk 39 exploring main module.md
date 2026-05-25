---
parent: "[[000 main]]"
spawned_by: "[[000 main]]"
context_type: entry
---

Parent: [[000 main]]

Spawned by: [[000 main]] 

Spawned in: [[000 main#^spawn-entry-8585a1|^spawn-entry-8585a1]]

# 1 Related

[[000 Wk 39 Exploring bn6f save data]]

# 2 Journal

2025-09-25 Wk 39 Thu - 00:58

Spawn [[000 languageserver.ccls failed to start]] ^spawn-issue-f05cfe

2025-09-25 Wk 39 Thu - 04:22

We want to utilize the idea of having function metadata. 

For example right now we're sometimes clear about signature:

```c
SeedRNG: // () -> void
```

We can use `tools/doc_scripts/replacesig.sh` to change the signature of a function.

2025-09-25 Wk 39 Thu - 04:29

```C
GetRNG: // () -> int
```

Prefer to use an explicit type like `i32` 

2025-09-25 Wk 39 Thu - 04:43

Added `docs/documenting/documenting functions.md`.

2025-09-25 Wk 39 Thu - 04:52

```sh
chmod +x tools/doc_scripts/replacesig.sh
```

2025-09-25 Wk 39 Thu - 05:03

Let's create a tmp branch just for experimenting with breaking modifications. Nothing here should be commited. 

2025-09-25 Wk 39 Thu - 05:11

No vim clipboard acccess... [post](https://itsfoss.gitlab.io/post/how-to-enable-and-manage-clipboard-access-in-vim-on-linux/)

Managed to resolve with [gh jasonccox/vim-wayland-clipboard](https://github.com/jasonccox/vim-wayland-clipboard)

2025-09-25 Wk 39 Thu - 06:03

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
chmod +x replacep.sh
```

Documenting [[000 main_initToolkitAndOtherSubsystems]]

2025-09-25 Wk 39 Thu - 07:32

We have macros for `TRUE` and `FALSE`.

```
mov r4, #TRUE
```

