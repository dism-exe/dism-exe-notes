---
parent: "[[001 SubMenuControl]]"
spawned_by: "[[001 SubMenuControl]]"
context_type: entry
---

Parent: [[001 SubMenuControl]]

Spawned by: [[001 SubMenuControl]] 

Spawned in: [[001 SubMenuControl#^spawn-entry-a02337|^spawn-entry-a02337]]

# 1 Journal

2025-09-25 Wk 39 Thu - 08:15

So this uses `oToolkit_SubmenuPtr`, which is pointed to in  `0x20093b0 + 0x34 = 0x20093e4` 

See [[002 Setting up gdb for bn6f debugging]].

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
mgba bn6f.elf
```

```
(gdb) x 0x20093e4
0x20093e4:      0x02009a30
```

In `ewram.s`, that points to 

```
sSubmenu:: // 0x2009a30
	.space 80
```

2025-09-25 Wk 39 Thu - 08:24

We need to figure out the size of this via software writes.

2025-09-25 Wk 39 Thu - 08:40

Many functions don't get this from the toolkit at r10. They just put the address in the pool and load it directly.

2025-09-25 Wk 39 Thu - 08:42

We could also learned about this through `ToolkitPointers` which is used to set `sSubMenu` and the others in `SetPrimaryToolkitPointers`. 

2025-09-25 Wk 39 Thu - 08:49

I couldn't find its size. Let's do the second best thing and search for the latest used offset + size in the code.

```
u8? idx_00
u8? 0x1
u8? 0x2
u8? 0xd
u16? 0x1e

u32? 0x20 // 1
u16? 0x20 // 1

u16? 0x24
```

2025-09-25 Wk 39 Thu - 08:59

Actually in `sub_8123408` we can see that it copies `0x80` bytes for `sSubmenu`.  Let's mark `sub_8123408` as `#copy`. 

2025-09-25 Wk 39 Thu - 09:14

So let's add a new struct for this.

^recall-494fe5

```C
# in include/macros/ewram_structs.inc
.include "structs/SubMenu.inc"
```

```C
# in include/structs/SubMenu.inc
//! type: SubMenu

  .macro sub_menu_struct label:req, struct_entry=label_struct_entry, set_struct_start_address=set_struct_start_address
  \set_struct_start_address \label
  set_struct_label \struct_entry, \label

  u8 idx_00 // loc=0x0

  // sub_8123408 implies 0x80, but we only have this much space as implied by ewram.s
  struct_org 0x50
  u0 Size // loc=0x80

  restore_struct_label
  .endm

  def_struct_offsets sub_menu_struct, oSubMenu

```

The types that can be used can be found in `include/macros/struct.inc`

2025-09-25 Wk 39 Thu - 09:28

```diff
// in ewram.s
sSubmenu:: // 0x2009a30
+	sub_menu_struct sSubmenu
-	.space 80
```

2025-09-25 Wk 39 Thu - 09:36

Even though `sub_8123408` copies `0x80`, weirdly we only have room until the next label by `80 (0x50)` only, so let's adjust for that for now. Also, make sure to have two spaces at least for the struct definition, or it won't compile.

2025-09-25 Wk 39 Thu - 09:38

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
make -j$(nproc)

# out (relevant)
OK
```

Now we have a new struct. We can experiment with it and document it.