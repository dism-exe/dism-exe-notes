---
parent: "[[002 Run self contained compiled gba game from within modded bn6f]]"
spawned_by: "[[002 Run self contained compiled gba game from within modded bn6f]]"
context_type: entry
---

Parent: [[002 Run self contained compiled gba game from within modded bn6f]]

Spawned by: [[002 Run self contained compiled gba game from within modded bn6f]] 

Spawned in: [[002 Run self contained compiled gba game from within modded bn6f#^spawn-entry-119ebd|^spawn-entry-119ebd]]

# 1 Journal

(1)

2025-09-20 Wk 38 Sat - 06:08

Our data model can constantly get outdated as new developments happen in bn6f. Update mods are self-contained, and so they should be able to update their symbol and type dependencies based on the latest project. But this is currently tied with progress in [[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]].

We want to be able to parse all repository information, then we can use it in this effort.

(2)

2025-09-20 Wk 38 Sat - 06:11

Even though we can't shift the ROM yet, we should be able to re-implement functions of interest by having them `bx` into the address of our mod code, given the function has enough room to be modified in-place without shifting anything. This should allow us to disable or reimplement certain functions. More generally, we could create hooks and they do not have to map to functions but could patch the binary. 

(3)

2025-09-20 Wk 38 Sat - 06:19

We might be able to side-step the ROM shift problem by creating a mod where we fork and inplace-replace instructions, but it's limited and we won't be able to add content to functions in this way. It might be best to instead add a replace hook so that the function can be freely change at the end of the ROM by the update mod.