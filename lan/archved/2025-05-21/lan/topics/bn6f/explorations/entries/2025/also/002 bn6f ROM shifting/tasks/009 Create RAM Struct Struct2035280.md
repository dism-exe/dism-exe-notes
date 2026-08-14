---
parent: '[[002 bn6f ROM shifting]]'
spawned_by: '[[006 Attempt to modify mgba to get information on save corruption gunner issue]]'
context_type: task
status: todo
---

Parent: [002 bn6f ROM shifting](../002%20bn6f%20ROM%20shifting.md)

Spawned by: [006 Attempt to modify mgba to get information on save corruption gunner issue](../investigations/006%20Attempt%20to%20modify%20mgba%20to%20get%20information%20on%20save%20corruption%20gunner%20issue.md)

Spawned in: [^spawn-task-a82dc9](../investigations/006%20Attempt%20to%20modify%20mgba%20to%20get%20information%20on%20save%20corruption%20gunner%20issue.md#spawn-task-a82dc9)

# 1 Journal

2026-01-04 Wk 1 Sun - 18:35 +03:00

Similar process to [005 Create RAM struct dword_20364C0](005%20Create%20RAM%20struct%20dword_20364C0.md)

2026-01-04 Wk 1 Sun - 18:36 +03:00

````C
sub_801BE70:
	push {lr}
	// memBlock
	ldr r0, off_801BFE8 // =eStruct2035280
	// size
	mov r1, #0x60 
	bl ZeroFillByWord // (mut_mem: *mut (), num_bytes: usize) -> ()
````

````sh
python3 -c "print(hex(0x2035280 + 0x60))" # 0x20352e0
````

Had to remove all labels until there.

````C
eStruct2035280:: // 0x2035280
	.space 0x60
dword_20352E0:: // 0x20352e0
````

2026-01-04 Wk 1 Sun - 18:42 +03:00

````C
# in include/structs/Struct2035280.inc
//! type: struct Struct2035280

  .macro s_2035280_struct label:req, struct_entry=label_struct_entry, set_struct_start_address=set_struct_start_address
  \set_struct_start_address \label
  set_struct_label \struct_entry, \label

  // sub_801BE70 implies 0x60
  struct_org 0x60
  u0 Size // loc=0x60

  restore_struct_label
  .endm

  def_struct_offsets s_2035280_struct, oStruct2035280
````

````C
# in include/macros/ewram_structs.inc
.include "structs/Struct2035280.inc"
````

````diff
// in ewram.s
eStruct2035280:: // 0x2035280
-	.space 0x60
+	s_2035280_struct eStruct2035280
````

Then build
