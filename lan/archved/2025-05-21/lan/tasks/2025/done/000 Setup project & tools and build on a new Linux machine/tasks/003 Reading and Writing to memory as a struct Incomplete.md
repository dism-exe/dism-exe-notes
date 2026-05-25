---
parent: "[[000 Setup project & tools and build on a new Linux machine]]"
spawned_by: "[[000 Setup project & tools and build on a new Linux machine]]"
context_type: task
status: pend
---

Parent: [[000 Setup project & tools and build on a new Linux machine]]

Spawned by: [[000 Setup project & tools and build on a new Linux machine]] 

Spawned in: [[000 Setup project & tools and build on a new Linux machine#^spawn-task-6b4885|^spawn-task-6b4885]]

# 1 Journal

2025-06-12 Wk 24 Thu - 07:26

We don't want to be messing around much with the memory editor if we have struct information or type information, we want to use it to experiment with the game. 

As of now, this is not possible. 

If you run

```
(gdb) info types
```

you get

```
All defined types:
```

Running `readelf -s bn6f.elf | less` we can see that we do have type information for structs such as the toolkit struct:

```
	[...]
	32: 00000014     0 NOTYPE  LOCAL  DEFAULT  ABS oToolkit_Warp201[...]
    33: 00000018     0 NOTYPE  LOCAL  DEFAULT  ABS oToolkit_BattleS[...]
    34: 0000001c     0 NOTYPE  LOCAL  DEFAULT  ABS oToolkit_Unk200f[...]
    35: 00000020     0 NOTYPE  LOCAL  DEFAULT  ABS oToolkit_Unk2009[...]
    36: 00000024     0 NOTYPE  LOCAL  DEFAULT  ABS oToolkit_CurFramePtr
    37: 00000028     0 NOTYPE  LOCAL  DEFAULT  ABS oToolkit_iBGTile[...]
    38: 0000002c     0 NOTYPE  LOCAL  DEFAULT  ABS oToolkit_ChatboxPtr
    39: 00000030     0 NOTYPE  LOCAL  DEFAULT  ABS oToolkit_Collisi[...]
	[...]
```

These are useful for the purposes of documenting the disassembly but they need to turn into C structs for the purposes of debugging. This will be done in a later task.
