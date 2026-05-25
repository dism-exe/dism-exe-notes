---
parent: "[[002 startscreen_render_802F544]]"
spawned_by: "[[000 What writes for startscreen_render_802F544 jumptable?]]"
context_type: task
status: done
---

Parent: [[002 startscreen_render_802F544]]

Spawned by: [[000 What writes for startscreen_render_802F544 jumptable?]]

Spawned in: [[000 What writes for startscreen_render_802F544 jumptable?#^spawn-task-f0ccc9|^spawn-task-f0ccc9]]

# 1 Journal

2025-10-08 Wk 41 Wed - 07:37 +03:00

```C
// in fn init_803D1A8
// memBlock
ldr r0, off_803D1F8 // =byte_2011800
// size
mov r1, #8
bl ZeroFillByWord // (mut_mem: *mut (), num_bytes: usize) -> ()

// in ewram.s
byte_2011800:: // 0x2011800
	.space 8
```

2025-10-08 Wk 41 Wed - 07:39 +03:00

For info on creating new structs,

Recall [[001 SubMenuControl Documenting SubMenu struct#^recall-494fe5|recall-494fe5]] in [[001 SubMenuControl Documenting SubMenu struct]]

```C
# in include/macros/ewram_structs.inc
.include "structs/S2011800.inc"
```

```C
# in include/structs/S2011800.inc
//! type: S2011800

  .macro s_2011800_struct label:req, struct_entry=label_struct_entry, set_struct_start_address=set_struct_start_address
  \set_struct_start_address \label
  set_struct_label \struct_entry, \label

  // init_803D1A8 implies 0x08
  struct_org 0x08
  u0 Size // loc=0x08

  restore_struct_label
  .endm

  def_struct_offsets s_2011800_struct, oS2011800
```

2025-10-08 Wk 41 Wed - 07:56 +03:00

Change

```C
// in ewram.s
byte_2011800:: // 0x2011800
	.space 8
```

to

```C
// in ewram.s
eS2011800:: // 0x2011800
	s_2011800_struct eS2011800
```

With

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
./replacep.sh "byte_2011800" "eS2011800"
```

Documented in [[000 Documentation Actions]]

Then confirm OK:

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
make clean && make -j$(nproc) assets && make -j$(nproc); 

# out (relevant)
bn6f.gba: OK
```


