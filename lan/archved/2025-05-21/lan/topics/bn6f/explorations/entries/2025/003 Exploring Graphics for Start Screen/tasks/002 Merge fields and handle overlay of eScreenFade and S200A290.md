---
parent: "[[003 Exploring Graphics for Start Screen]]"
spawned_by: "[[001 Create Struct S200A290]]"
context_type: task
status: todo
---

Parent: [[003 Exploring Graphics for Start Screen]]

Spawned by: [[001 Create Struct S200A290]]

Spawned in: [[001 Create Struct S200A290#^spawn-task-750757|^spawn-task-750757]]

# 1 Journal

2025-10-19 Wk 42 Sun - 11:06 +03:00

`S200A290` is of size `0x1b0` or 432, this would include exactly all of those:

```C
// in ewram.s
eS200A290:: // 0x200a290
	.space 1
byte_200A291:: // 0x200a291
	.space 2
unk_200A293:: // 0x200a293
	.space 17
byte_200A2A4:: // 0x200a2a4
	.space 2
byte_200A2A6:: // 0x200a2a6
	.space 1
byte_200A2A7:: // 0x200a2a7
	.space 9
word_200A2B0:: // 0x200a2b0
	.space 2
word_200A2B2:: // 0x200a2b2
	.space 2
word_200A2B4:: // 0x200a2b4
	.space 2
word_200A2B6:: // 0x200a2b6
	.space 234
unk_200A3A0:: // 0x200a3a0
	.space 16
unk_200A3B0:: // 0x200a3b0
	.space 16
unk_200A3C0:: // 0x200a3c0
	.space 32
unk_200A3E0:: // 0x200a3e0
	.space 32
unk_200A400:: // 0x200a400
	.space 32
unk_200A420:: // 0x200a420
	.space 32

eScreenFade:: // 0x200a440
	screen_fade_struct eScreenFade
eScreenFadeEnd:: // 0x200a460
```

But there is evidence that `eScreenFade` is its own struct. 

It seems to be an array indexed from one of two structs:

```
eScreenFade:: // 0x200a440
	screen_fade_struct eScreenFade
eScreenFadeEnd:: // 0x200a460

eScreenFade2:: // 0x200a460
	screen_fade_struct eScreenFade2
eScreenFade2End:: // 0x200a480
```

and it's zero'd to its size of `0x20` by `sub_80062D0`. 

Does anything use index 0x190 or beyond for `S200A290`? It might not be a struct given how big it is.

```C
// in ewram.s
unk_200A3C0:: // 0x200a3c0
	.space 32
unk_200A3E0:: // 0x200a3e0
	.space 32
unk_200A400:: // 0x200a400
	.space 32
unk_200A420:: // 0x200a420
	.space 32
```

Also all of these are of size `0x20` also...

A bunch of them are copied in `sub_803C2AA`. It copied precisely

```C
// in ewram.s
unk_200A3A0:: // 0x200a3a0
	.space 16
unk_200A3B0:: // 0x200a3b0
	.space 16
	
unk_200A400:: // 0x200a400
	.space 32
unk_200A420:: // 0x200a420
	.space 32
```

2025-10-19 Wk 42 Sun - 11:36 +03:00

Grepping for `size 0x1b0`, `OWPlayer.h` mentions `0x1b0`, although it's corrected to be a struct of size `0xc8` in `include/structs/OverworldPlayerObject.inc`. 

2025-10-19 Wk 42 Sun - 11:45 +03:00

Can't seem to find a clear indication for writing `eOWPlayerObject`. We can look at uses of `oOWPlayerObject_Size`  And it is used by things like `ObjectMemorySizes`

So it's more general how these are initialized.
