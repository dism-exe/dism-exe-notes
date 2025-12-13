---
parent: '[[003 Exploring Graphics for Start Screen]]'
spawned_by: '[[000 Wk 42 Exploring Graphics for Start Screen]]'
context_type: task
status: todo
---

Parent: [003 Exploring Graphics for Start Screen](../003%20Exploring%20Graphics%20for%20Start%20Screen.md)

Spawned by: [000 Wk 42 Exploring Graphics for Start Screen](../entries/000%20Wk%2042%20Exploring%20Graphics%20for%20Start%20Screen.md)

Spawned in: [<a name="spawn-task-3d1f90" />^spawn-task-3d1f90](../entries/000%20Wk%2042%20Exploring%20Graphics%20for%20Start%20Screen.md#spawn-task-3d1f90)

# 1 Journal

2025-10-19 Wk 42 Sun - 10:44 +03:00

Similar process to [000 Create Struct S200F348](000%20Create%20Struct%20S200F348.md)

`sub_8049DDC`, `sub_8039570`, and `sub_8048F9C` all zero it with size `0x1b0`

````C
# in include/structs/S200A290.inc
//! type: S200A290

  .macro s_200A290_struct label:req, struct_entry=label_struct_entry, set_struct_start_address=set_struct_start_address
  \set_struct_start_address \label
  set_struct_label \struct_entry, \label

  // `sub_8049DDC`, `sub_8039570`, and `sub_8048F9C` all zero it with size `0x1b0`
  struct_org 0x1b0
  u0 Size // loc=0x1b0

  restore_struct_label
  .endm

  // TODO This might be an overlay so it can't go in ewram.s yet
  def_struct_offsets s_200A290_struct, oS200A290
````

````C
# in include/macros/ewram_structs.inc
.include "structs/S200A290.inc"
````

````sh
./replacep.sh "byte_200A290" "eS200A290"
````

Documented in [000 Documentation Actions](../../../../../logs/entries/2025/000%20Documentation%20Actions.md)

Spawn [002 Merge fields and handle overlay of eScreenFade and S200A290](002%20Merge%20fields%20and%20handle%20overlay%20of%20eScreenFade%20and%20S200A290.md) <a name="spawn-task-750757" />^spawn-task-750757
