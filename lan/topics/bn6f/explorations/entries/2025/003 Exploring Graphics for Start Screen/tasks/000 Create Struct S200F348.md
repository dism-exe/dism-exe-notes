---
parent: '[[003 Exploring Graphics for Start Screen]]'
spawned_by: '[[000 Wk 42 Exploring Graphics for Start Screen]]'
context_type: task
status: todo
---

Parent: [003 Exploring Graphics for Start Screen](../003%20Exploring%20Graphics%20for%20Start%20Screen.md)

Spawned by: [000 Wk 42 Exploring Graphics for Start Screen](../entries/000%20Wk%2042%20Exploring%20Graphics%20for%20Start%20Screen.md)

Spawned in: [<a name="spawn-task-1b468b" />^spawn-task-1b468b](../entries/000%20Wk%2042%20Exploring%20Graphics%20for%20Start%20Screen.md#spawn-task-1b468b)

# 1 Journal

2025-10-19 Wk 42 Sun - 10:45 +03:00

Referenced by  [001 Create Struct S200A290](001%20Create%20Struct%20S200A290.md)

2025-10-19 Wk 42 Sun - 10:27 +03:00

Similar process to [001 Create Struct S2011E30 used in dispatch_80339CC](../../001%20Exploring%20bn6f%20CentralArea%20Map/tasks/001%20Create%20Struct%20S2011E30%20used%20in%20dispatch_80339CC.md),

We can infer the size to be `8` from

````C
// in fn sub_803FB28
// memBlock
ldr r0, off_803FB60 // =byte_200F348
// size
mov r1, #8
bl ZeroFillByWord // (mut_mem: *mut (), num_bytes: usize) -> ()
````

````C
# in include/structs/S200F348.inc
//! type: S200F348

  .macro s_200F348_struct label:req, struct_entry=label_struct_entry, set_struct_start_address=set_struct_start_address
  \set_struct_start_address \label
  set_struct_label \struct_entry, \label

  // sub_803FB28 implies 0x08
  struct_org 0x08
  u0 Size // loc=0x08

  restore_struct_label
  .endm

  def_struct_offsets s_200F348_struct, oS200F348
````

````C
# in include/macros/ewram_structs.inc
.include "structs/S200F348.inc"
````

````sh
./replacep.sh "byte_200F348" "eS200F348"
````

Documented in [000 Documentation Actions](../../../../../logs/entries/2025/000%20Documentation%20Actions.md)

````diff
// in ewram.s
// 0x200f348
eS200F348::
-	.space 8
+   s_200F348_struct eS200F348
````

It's already exactly its size.

Then confirm OK.

````sh
# in  /home/lan/src/cloned/gh/dism-exe/bn6f
make clean && make -j$(nproc) assets && make -j$(nproc)
````
