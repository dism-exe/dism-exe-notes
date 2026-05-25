---
parent: "[[002 bn6f ROM shifting]]"
spawned_by: "[[006 Attempt to modify mgba to get information on save corruption gunner issue]]"
context_type: task
status: todo
---

Parent: [[002 bn6f ROM shifting]]

Spawned by: [[006 Attempt to modify mgba to get information on save corruption gunner issue]]

Spawned in: [[006 Attempt to modify mgba to get information on save corruption gunner issue#^spawn-task-dc2d18|^spawn-task-dc2d18]]

# 1 Journal

2026-01-03 Wk 1 Sat - 16:20 +03:00

Similar process to [[005 Create RAM struct dword_20364C0]]

2026-01-03 Wk 1 Sat - 16:27 +03:00

Hmm, didn't seem to find a zero fill for this, but I removed some ewram labels that were unused (only calculations from this)

```C
// in ewram.s
byte_200BC50:: // 0x200bc50
	.space 1
	.space 1
	.space 1
	.space 1
	.space 1
	.space 1
	.space 1
	.space 1
	.space 2
	.space 2
	.space 4
byte_200BC60:: // 0x200bc60
	.space 1
```

This gives us a size of `0x10`. 

2026-01-03 Wk 1 Sat - 16:29 +03:00

```C
# in include/structs/S200BC50.inc
//! type: struct S200BC50

  .macro s_200BC50_struct label:req, struct_entry=label_struct_entry, set_struct_start_address=set_struct_start_address
  \set_struct_start_address \label
  set_struct_label \struct_entry, \label

  // guess based on next used ewram reference byte_200BC60
  struct_org 0x10
  u0 Size // loc=0x10

  restore_struct_label
  .endm

  def_struct_offsets s_200BC50_struct, oS200BC50
```

2026-01-03 Wk 1 Sat - 16:31 +03:00

```C
# in include/macros/ewram_structs.inc
.include "structs/S200BC50.inc"
```

```sh
./replacep.sh "byte_200BC50" "eS200BC50"
```

```diff
// in ewram.s
eS200BC50:: // 0x200bc50
-	.space 0x10
+	s_200BC50_struct eS200BC50
```

Spawn [[005 Checking fields of S200BC50]] ^spawn-entry-7c2ff5
