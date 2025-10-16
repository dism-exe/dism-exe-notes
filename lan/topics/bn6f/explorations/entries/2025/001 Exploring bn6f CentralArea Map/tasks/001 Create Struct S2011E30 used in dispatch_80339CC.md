---
parent: "[[001 Exploring bn6f CentralArea Map]]"
spawned_by: "[[000 Wk 41 Exploring bn6f CentralArea Map]]"
context_type: task
status: done
---

Parent: [[001 Exploring bn6f CentralArea Map]]

Spawned by: [[000 Wk 41 Exploring bn6f CentralArea Map]]

Spawned in: [[000 Wk 41 Exploring bn6f CentralArea Map#^spawn-task-aec1e0|^spawn-task-aec1e0]]

# 1 Journal

2025-10-11 Wk 41 Sat - 09:33 +03:00

Similar process to [[000 Create Struct S2011800]]

Its size can be inferred to `0x10` from

```C
// in fn sub_8033948
ldr r5, off_8033A78 // =unk_2011E30
// memBlock
mov r0, r5
// size
mov r1, #0x10
bl ZeroFillByWord // (mut_mem: *mut (), num_bytes: usize) -> ()
```

2025-10-11 Wk 41 Sat - 09:36 +03:00

```C
# in include/structs/S2011E30.inc
//! type: S2011E30

  .macro s_2011E30_struct label:req, struct_entry=label_struct_entry, set_struct_start_address=set_struct_start_address
  \set_struct_start_address \label
  set_struct_label \struct_entry, \label

  // sub_8033948 implies 0x10
  struct_org 0x10
  u0 Size // loc=0x10

  restore_struct_label
  .endm

  def_struct_offsets s_2011E30_struct, oS2011E30
```

2025-10-11 Wk 41 Sat - 09:41 +03:00

```C
# in include/macros/ewram_structs.inc
.include "structs/S2011E30.inc"
```

```C
// in ewram.s
unk_2011E30:: // 0x2011e30
	.space 4

// These are all comments from IDA, delete them.
byte_2011E34:: // 0x2011e34
	.space 3
byte_2011E37:: // 0x2011e37
	.space 1
word_2011E38:: // 0x2011e38
	.space 8
```

2025-10-11 Wk 41 Sat - 09:47 +03:00

```C
// in ewram.s
unk_2011E30:: // 0x2011e30
	.space 4
	.space 3
	.space 1
	.space 8
```

This is exactly `0x10`

```sh
./replacep.sh "unk_2011E30" "eS2011E30"
```

Documented in [[000 Documentation Actions]]

```diff
// in ewram.s
eS2011E30:: // 0x2011e30
-	.space 4
-	.space 3
-	.space 1
-	.space 8
+   s_2011E30_struct eS2011E30
```

2025-10-11 Wk 41 Sat - 09:54 +03:00

Then confirm OK:

Spawn [[000 TryUpdateEachOverworldMapObject_80048D2.ret_8004920 was not defined within its scope]] ^spawn-issue-47ff20

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
make clean && make -j$(nproc) assets && make -j$(nproc); 

# out (relevant)
bn6f.gba: OK
```

