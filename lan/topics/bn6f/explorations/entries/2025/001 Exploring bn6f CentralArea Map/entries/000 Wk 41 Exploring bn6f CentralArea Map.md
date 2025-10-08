---
parent: "[[001 Exploring bn6f CentralArea Map]]"
spawned_by: "[[001 Exploring bn6f CentralArea Map]]"
context_type: entry
---

Parent: [[001 Exploring bn6f CentralArea Map]]

Spawned by: [[001 Exploring bn6f CentralArea Map]]

Spawned in: [[001 Exploring bn6f CentralArea Map#^spawn-entry-f550c2|^spawn-entry-f550c2]]

# 1 Journal

2025-10-08 Wk 41 Wed - 08:47 +03:00

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
mgba bn6f.elf -g &; gdb-multiarch bn6f.elf -ex "target remote localhost:2345"

# in gdb

b CentralArea_EnterMapGroup

# breaks on entering Central Area, on screen transition being black

bt

# out
#0  CentralArea_EnterMapGroup () at ./maps/CentralArea/loader.s:4
#1  0x08030a20 in EnterMap_RunMapGroupAsmFunction_8030A00 () at ./asm/asm03_0.s:20692
Backtrace stopped: previous frame identical to this frame (corrupt stack?)
# /out
```

`EnterMap_RunMapGroupAsmFunction_8030A00` should be called by `EnterMap`

2025-10-08 Wk 41 Wed - 08:59 +03:00

But what triggered `EnterMap` in this instance?

Recall [[000 What writes for startscreen_render_802F544 jumptable?#^recall-87aae1|^recall-87aae1]] in  [[000 What writes for startscreen_render_802F544 jumptable?]]

We had those candidates:

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
mgba bn6f.elf -g &; gdb-multiarch bn6f.elf -ex "target remote localhost:2345"

# in gdb

b sub_8005360
b sub_811F728
b sub_8004D48
b sub_8005C04
b sub_803578C

# when breaking on entering CentralArea1 from Lan's HP

# out
#0  sub_8005C04 () at ./asm/asm00_1.s:4974
#1  0x080053da in sub_800536E () at ./asm/asm00_1.s:4164
#2  0x080050fc in cbGameState_80050EC () at ./asm/asm00_1.s:3904
Backtrace stopped: previous frame identical to this frame (corrupt stack?)
# /out
```

So in this case we're interested in `sub_8005C04`. It triggered `EnterMap` when we entered `CentralArea1`. 

Spawn [[000 Document fields for S2001c04]] ^spawn-task-f6b548


