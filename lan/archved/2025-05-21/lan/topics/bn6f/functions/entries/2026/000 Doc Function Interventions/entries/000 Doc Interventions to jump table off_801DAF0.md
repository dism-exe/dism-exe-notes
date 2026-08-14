---
parent: '[[000 Doc Function Interventions]]'
spawned_by: '[[000 Doc Function Interventions]]'
context_type: entry
---

Parent: [000 Doc Function Interventions](../000%20Doc%20Function%20Interventions.md)

Spawned by: [000 Doc Function Interventions](../000%20Doc%20Function%20Interventions.md)

Spawned in: [^spawn-entry-f12249](../000%20Doc%20Function%20Interventions.md#spawn-entry-f12249)

# 1 Journal

2026-01-09 Wk 2 Fri - 18:44 +03:00

On Breaking:

````sh
#!/bin/bash
mgba bn6f.elf -g &
gdb-multiarch bn6f.elf -ex "target remote localhost:2345" \
 -ex "b sub_801DB54" \
 -ex "b sub_801DB6C" \
 -ex "b sub_801DC60" \
 -ex "b sub_801DD60" \
 -ex "b sub_801DDD8" \
 -ex "b sub_801DE1E" \
 -ex "b sub_801DFEA" \
 -ex "b sub_801E022" \
 -ex "b sub_801E1A4" \
 -ex "b sub_801E138" \
 -ex "b sub_801E0DC" \
 -ex "b sub_801E35A" \
 -ex "b sub_801E44C" \
 -ex "b sub_801E4B0" \
 -ex "b sub_801E5E0" \
 -ex "b sub_801E73C" \
 -ex "b sub_801EB00" \
 -ex "b sub_801DE64" \
 -ex "b sub_801EB50" \
 -ex "b sub_801EBD2" \
 -ex "b sub_801E3C4" \
 -ex "b sub_801EC2C" \
 -ex "b sub_801EC84" \
 -ex "b sub_801E060"
````

````C
off_801DAF0:
	// 0x00 (0x00)
	.word sub_801DB54+1
	// 0x04 (0x01)
	// - Breaks when opening cut menu after bar fills with L (0)
	.word sub_801DB6C+1
	// 0x08 (0x02)
	.word sub_801DC60+1
	// 0x0C (0x03)
	.word sub_801DD60+1
	// 0x10 (0x04)
	// - Breaks when opening cut menu after bar fills with L (1)
	.word sub_801DDD8+1
	// 0x14 (0x05)
	.word sub_801DE1E+1
	// 0x18 (0x06)
	// Breaks when attacking enemy with chip
	// - Breaks when opening cut menu after bar fills with L (2)
	.word sub_801DFEA+1
	// 0x1C (0x07)
	// - Breaks start of battle after battle objects spawn and before cut menu shows (1)
	// - Following sub_801E4B0 on pressing OK, breaks when cust menu sliding left only has the width of the chips selected menu left
	//   then breaks again when it's fully out of view
	// - Breaks when opening cut menu after bar fills with L (4)
	// - Breaks on escape dialog window closing at minimum height, then when it is fully closed, then nothing breaks and we are out of battle
	.word sub_801E022+1
	// 0x20 (0x08)
	// - Breaks when an enemy is defeated (1)
	.word sub_801E1A4+1
	// 0x24 (0x09)
	.word sub_801E138+1
	// 0x28 (0x0A)
	// - Breaks start of battle after battle objects spawn and before cut menu shows (0)
	// - Breaks when an enemy is defeated (0)
	// - Breaks when opening cut menu after bar fills with L (3)
	.word sub_801E0DC+1
	// 0x2C (0x0B)
	.word sub_801E35A+1
	// 0x30 (0x0C)
	.word sub_801E44C+1
	// 0x34 (0x0D)
	// - Breaks when pressing select in cust menu in battle which slides it away
	// - Breaks when pressing OK in cust menu
	.word sub_801E4B0+1
	// 0x38 (0x0E)
	.word sub_801E5E0+1
	// 0x3C (0x0F)
	// Breaks when "BATTLE START!" is vertically squishing away following pressing OK
	.word sub_801E73C+1
	// 0x40 (0x10)
	.word sub_801EB00+1
	// 0x44 (0x11)
	.word sub_801DE64+1
	// 0x48 (0x12)
	.word sub_801EB50+1
	// 0x4C (0x13)
	.word sub_801EBD2+1
	// 0x50 (0x14)
	.word sub_801E3C4+1
	// 0x54 (0x15)
	.word sub_801EC2C+1
	// 0x58 (0x16)
	.word sub_801EC84+1
	// 0x5C (0x17)
	.word sub_801E060+1
````

2026-01-09 Wk 2 Fri - 18:46 +03:00

On Disabling:

````C
// Example:

// 0x3C (0x0F)
//.word sub_801E73C+1
.word nullsub_38+1
````

````C
off_801DAF0:
	// 0x00 (0x00)
	.word sub_801DB54+1
	// 0x04 (0x01)
	.word sub_801DB6C+1
	// 0x08 (0x02)
	.word sub_801DC60+1
	// 0x0C (0x03)
	.word sub_801DD60+1
	// 0x10 (0x04)
	.word sub_801DDD8+1
	// 0x14 (0x05)
	.word sub_801DE1E+1
	// 0x18 (0x06)
	.word sub_801DFEA+1
	// 0x1C (0x07)
	.word sub_801E022+1
	// 0x20 (0x08)
	.word sub_801E1A4+1
	// 0x24 (0x09)
	.word sub_801E138+1
	// 0x28 (0x0A)
	.word sub_801E0DC+1
	// 0x2C (0x0B)
	.word sub_801E35A+1
	// 0x30 (0x0C)
	.word sub_801E44C+1
	// 0x34 (0x0D)
	// - Disabling this causes freeze on select or OK.
	.word sub_801E4B0+1
	// 0x38 (0x0E)
	.word sub_801E5E0+1
	// 0x3C (0x0F)
	// - Disabling this causes freeze when "BATTLE START!" is vertically squished
	.word sub_801E73C+1
	// 0x40 (0x10)
	.word sub_801EB00+1
	// 0x44 (0x11)
	.word sub_801DE64+1
	// 0x48 (0x12)
	.word sub_801EB50+1
	// 0x4C (0x13)
	.word sub_801EBD2+1
	// 0x50 (0x14)
	.word sub_801E3C4+1
	// 0x54 (0x15)
	.word sub_801EC2C+1
	// 0x58 (0x16)
	.word sub_801EC84+1
	// 0x5C (0x17)
	.word sub_801E060+1
````
