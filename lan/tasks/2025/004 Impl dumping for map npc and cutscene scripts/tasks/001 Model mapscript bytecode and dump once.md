---
parent: "[[004 Impl dumping for map npc and cutscene scripts]]"
spawned_by: "[[004 Impl dumping for map npc and cutscene scripts]]"
context_type: task
status: todo
---

Parent: [[004 Impl dumping for map npc and cutscene scripts]]

Spawned by: [[004 Impl dumping for map npc and cutscene scripts]]

Spawned in: [[004 Impl dumping for map npc and cutscene scripts#^spawn-task-1bb35f|^spawn-task-1bb35f]]

# 1 Journal

2025-10-18 Wk 42 Sat - 12:45 +03:00

Thanks to [[000 Impl expt000 to get symbol data at label or ea]] We can get the data at a label. Now we need to parse that according to bytecode.

But first we need to have the bytecode parser to begin with.

The bytecode is specified in `include/bytecode/map_script.inc` in `/home/lan/src/cloned/gh/dism-exe/bn6f`.

2025-10-18 Wk 42 Sat - 14:29 +03:00

![[Pasted image 20251018142932.png]]

Fun mix of syntax, `<<` expected to be for templates rather than logical shift left

2025-10-18 Wk 42 Sat - 14:48 +03:00

Compute of `dumped_fields` is a bit involved in `encoding::dump`:

```rust
FieldSchema::U32(name) => {
	Ok(Field::U32(name.clone(), 
		((buf[mut_i + field_off + *mut_j + 3] as u32) << 24) + 
		((buf[mut_i + field_off + *mut_j + 2] as u32) << 16) + 
		((buf[mut_i + field_off + *mut_j + 1] as u32) << 8) + 
		buf[mut_i + field_off + *mut_j] as u32))
},
```

since `buf` is a `&[u8]` there are bytes at the 8$^{\text{th}}$, 16$^\text{th}$, and 24$^\text{th}$ bits. We also have to treat them as `u32`.  We are at the `mut_i`$^\text{th}$ instruction, the field portion of it with `field_off`, and `mut_j` accumulates processed fields within that instruction.

We could also use `u32::from_le_bytes` as I noticed during an llm session.