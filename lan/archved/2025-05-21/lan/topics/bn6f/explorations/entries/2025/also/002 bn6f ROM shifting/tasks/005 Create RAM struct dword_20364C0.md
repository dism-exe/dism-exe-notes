---
parent: '[[002 bn6f ROM shifting]]'
spawned_by: '[[006 Attempt to modify mgba to get information on save corruption gunner issue]]'
context_type: task
status: done
---

Parent: [002 bn6f ROM shifting](../002%20bn6f%20ROM%20shifting.md)

Spawned by: [006 Attempt to modify mgba to get information on save corruption gunner issue](../investigations/006%20Attempt%20to%20modify%20mgba%20to%20get%20information%20on%20save%20corruption%20gunner%20issue.md)

Spawned in: [^spawn-task-3838f9](../investigations/006%20Attempt%20to%20modify%20mgba%20to%20get%20information%20on%20save%20corruption%20gunner%20issue.md#spawn-task-3838f9)

# 1 Journal

2025-12-30 Wk 1 Tue - 14:04 +03:00

Similar to [001 Create Struct S2011E30 used in dispatch_80339CC](../../001%20Exploring%20bn6f%20CentralArea%20Map/tasks/001%20Create%20Struct%20S2011E30%20used%20in%20dispatch_80339CC.md)

2025-12-30 Wk 1 Tue - 14:05 +03:00

````C
// in fn sub_8026840
// memBlock
ldr r0, off_8026BF0 // =dword_20364C0 
// size
mov r1, #0x70 
bl ZeroFillByWord // (mut_mem: *mut (), num_bytes: usize) -> ()
````

````sh
python3 -c "print(hex(0x20364c0 + 0x70))" # 0x2036530
````

Issue is that `unk_2036500` has uses though. For now let's just fill up to that.

````
dword_20364C0:: // 0x20364c0
	.space 0x40
unk_2036500:: // 0x2036500
	.space 192
````

2025-12-30 Wk 1 Tue - 14:13 +03:00

````C
# in include/structs/S20364C0.inc
//! type: struct S20364C0

  .macro s_20364C0_struct label:req, struct_entry=label_struct_entry, set_struct_start_address=set_struct_start_address
  \set_struct_start_address \label
  set_struct_label \struct_entry, \label

  // sub_8026840 implies 0x70, but this conflicts with unk_2036500 which has references. So up to conflict is 0x40
  struct_org 0x40
  u0 Size // loc=0x40

  restore_struct_label
  .endm

  def_struct_offsets s_20364C0_struct, oS20364C0
````

2025-12-30 Wk 1 Tue - 14:18 +03:00

````C
# in include/macros/ewram_structs.inc
.include "structs/S20364C0.inc"
````

2025-12-30 Wk 1 Tue - 14:19 +03:00

````sh
./replacep.sh "dword_20364C0" "eS20364C0"
````

````diff
// in ewram.s
eS20364C0:: // 0x20364c0
-	.space 0x40
+	s_20364C0_struct eS20364C0
````

Then check OK

2025-12-30 Wk 1 Tue - 14:35 +03:00

Spawn [006 Create temporary script to transform gbastore to struct def](006%20Create%20temporary%20script%20to%20transform%20gbastore%20to%20struct%20def.md) ^spawn-task-437477

2025-12-30 Wk 1 Tue - 20:55 +03:00

Spawn [004 Checking fields of S20364C0](../entries/004%20Checking%20fields%20of%20S20364C0.md) ^spawn-entry-c76469
