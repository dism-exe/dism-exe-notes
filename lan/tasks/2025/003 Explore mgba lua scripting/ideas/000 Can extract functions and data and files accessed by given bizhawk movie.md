---
parent: "[[003 Explore mgba lua scripting]]"
spawned_by: "[[000 Create bn6f TAS movie for reproducible debugging using bizhawk]]"
context_type: idea
---

Parent: [[003 Explore mgba lua scripting]]

Spawned by: [[000 Create bn6f TAS movie for reproducible debugging using bizhawk]]

Spawned in: [[000 Create bn6f TAS movie for reproducible debugging using bizhawk#^spawn-idea-ed4f94|^spawn-idea-ed4f94]]

# 1 Related

[[001 Idea Stream]]

# 2 Journal

2025-10-01 Wk 40 Wed - 06:16 +03:00

So a [bizhawk](https://github.com/TASEmulators/BizHawk) movie allows us to have a deterministic portion of gameplay.  We can use this to extract information from the game.

Some ideas:

- We can get all functions accessed. Given a symbol map we can know where the functions are and we can trace log them whenever we find ourselves in their first instruction. We can generate a log of functions accessed as a sequence which can be processed to give distinct functions accessed.
- Given an optonal folder path of C-struct definitions, and a CSV detailing Type + address, we can get a log of structs written and read. We should support also no struct but just a buffer size at some address, and we can give a log of sized reads and writes to it. 

