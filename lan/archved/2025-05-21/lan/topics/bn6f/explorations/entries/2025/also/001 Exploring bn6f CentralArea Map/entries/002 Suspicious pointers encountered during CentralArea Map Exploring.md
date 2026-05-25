---
parent: "[[001 Exploring bn6f CentralArea Map]]"
spawned_by: "[[001 Exploring bn6f CentralArea Map]]"
context_type: entry
---

Parent: [[001 Exploring bn6f CentralArea Map]]

Spawned by: [[001 Exploring bn6f CentralArea Map]]

Spawned in: [[001 Exploring bn6f CentralArea Map#^spawn-entry-b44338|^spawn-entry-b44338]]

# 1 Journal

2025-10-16 Wk 42 Thu - 06:37 +03:00

- [ ] Resolved

```
off_809C278: 
  .word unk_2020000
```

2025-10-16 Wk 42 Thu - 06:40 +03:00

- [x] Resolved

```
// in fn sub_809B130
ldr r0, byte_809B16C // =0x84
ldr r1, byte_809B16C+4 // =0x2
bl StartCutscene // (script: *const CutsceneScript, param: u32) -> ()
```

These are fine, they're just direct accesses instead of using the pool. The false signal is expecting them to be pool. r1 might be though, that's strange referencing.

2025-10-16 Wk 42 Thu - 06:47 +03:00

- [ ] Resolved

```
off_8098A68:: 
  .word LCDControl
	.byte 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0
```

2025-10-16 Wk 42 Thu - 06:58 +03:00

- [ ] Resolved

```
byte_8093FD1:: 
  .byte 0x4, 0xC0, 0x0, 0x0, 0x1, 0x0, 0xFF, 0x0, 0x0, 0x4, 0x38, 0x0, 0x0, 0x1
	.byte 0x0, 0x0, 0x0, 0x0, 0x8, 0x4, 0x10, 0x0, 0x0, 0x0, 0x0, 0x1, 0x0, 0x0
	.byte 0x4, 0x50, 0x0, 0x0, 0x0, 0x0, 0x1, 0x80, 0xFF, 0x4, 0x30, 0x0, 0x0, 0x0
	.byte 0x0
	.word LCDControl+1
	.word 0x50
```

2025-10-16 Wk 42 Thu - 07:00 +03:00

- [ ] Resolved

```
off_8092DC8:: 
  .word Channel3WavePatternRAM_2banks___
	.byte 0x0, 0x0, 0x44, 0x1, 0x0, 0x0, 0x9C, 0xFF, 0x0, 0x0, 0x0, 0x0
	.word unk_4000190
	.byte 0x0, 0x0, 0xC6, 0xFF, 0x0, 0x0, 0xBA, 0xFE, 0x0, 0x0, 0x0, 0x0
```

2025-10-16 Wk 42 Thu - 07:11 +03:00

- [ ] Resolved

```
off_8089214: 
  .word GeneralLCDStatus_STAT_LYC_
	.byte 0xFC, 0x0, 0x0, 0xFC, 0x4, 0xFC, 0x2, 0x2, 0xFC, 0x4, 0xFE, 0xFE
	.byte 0x8, 0x0, 0x0, 0x8, 0xF8, 0x0, 0x0, 0xF8, 0x8, 0xF8, 0x4, 0x4
	.byte 0xF8, 0x8, 0xFC, 0xFC
```

2025-10-23 Wk 43 Thu - 15:46 +03:00

- [ ] Resolved

```
initRefs803D2F0: 
  .word 0x886C3528
```

Need to check many different inputs to `decompAndCopyData` across the repository. There's compressed graphics like this that's not caught.

^ref-318303

See [[004 Marking pointers to data passed to decompAndCopyData]]

This one is also known and corresponds to 

```
comp_86C3528::
.incbin "data/compressed/comp_86C3528.lz77"
```

2025-10-23 Wk 43 Thu - 15:49 +03:00

- [ ]  Resolved

```
.word comp_86C3E94 + 1<<31
```

This is also in `initRefs803D2F0`, and it uses `1<<31` instead of `COMPRESSED_PTR_FLAG`, although this wouldn't cause a shift problem.

2025-10-26 Wk 43 Sun - 18:54 +03:00

- [ ] Resolved

Many compressed pointers we corrected have already been found and identified. We can search the whole repository for instances that might have been skipped through a list of all lz/lz77 asset addresses
