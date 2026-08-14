---
parent: '[[000 Exploring bn6f save data]]'
spawned_by: '[[000 Investigate mgba sav file format loading]]'
context_type: entry
---

Parent: [000 Exploring bn6f save data](../000%20Exploring%20bn6f%20save%20data.md)

Spawned by: [000 Investigate mgba sav file format loading](../investigations/000%20Investigate%20mgba%20sav%20file%20format%20loading.md)

Spawned in: [^spawn-entry-946091](../investigations/000%20Investigate%20mgba%20sav%20file%20format%20loading.md#spawn-entry-946091)

# 1 Journal

2025-12-26 Wk 52 Fri - 19:40 +03:00

````C
// in static inline void ThumbStep(struct ARMCore* cpu) {
printf("LAN - ThumbStep PC=%X opcode=%X\n", cpu->gprs[ARM_PC], opcode);
cpu->gprs[ARM_PC] += WORD_SIZE_THUMB;
````

This seems to be off by -2, so shifting it.

````C
// in static inline void ThumbStep(struct ARMCore* cpu) {
printf("LAN - ThumbStep PC=%X opcode=%X\n", cpu->gprs[ARM_PC] - 2, opcode);
cpu->gprs[ARM_PC] += WORD_SIZE_THUMB;
````

2025-12-26 Wk 52 Fri - 19:58 +03:00

````C
// in DEFINE_INSTRUCTION_THUMB(BL2,
	uint32_t pc = cpu->gprs[ARM_PC];
	printf("LAN - BL PC1=%X, PC2=%X LR=%X\n", cpu->gprs[ARM_PC], cpu->gprs[ARM_LR] + immediate, pc - 1);
````

````
LAN - BL PC1=loc_8003370+2, PC2=sub_8003400 LR=loc_8003370+1
````

From the example here, it seems where it actually occurs is 4 bytes before, so we're adding `- 4`.

````C
// in DEFINE_INSTRUCTION_THUMB(BL2,
	uint32_t pc = cpu->gprs[ARM_PC];
	printf("LAN - BL PC1=%X, PC2=%X LR=%X\n", cpu->gprs[ARM_PC] - 4, cpu->gprs[ARM_LR] + immediate, pc - 1);
````

2025-12-27 Wk 52 Sat - 15:42 +03:00

`GBAStore8`, `GBAStore16`, and `GBAStore32` all have a `PC` 4 bytes after the target, so adding `-4`.
