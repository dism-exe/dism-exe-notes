---
parent: '[[002 bn6f ROM shifting]]'
spawned_by: '[[006 Attempt to modify mgba to get information on save corruption gunner issue]]'
context_type: investigation
status: todo
---

Parent: [002 bn6f ROM shifting](../002%20bn6f%20ROM%20shifting.md)

Spawned by: [006 Attempt to modify mgba to get information on save corruption gunner issue](006%20Attempt%20to%20modify%20mgba%20to%20get%20information%20on%20save%20corruption%20gunner%20issue.md)

Spawned in: [^spawn-invst-4ccb51](006%20Attempt%20to%20modify%20mgba%20to%20get%20information%20on%20save%20corruption%20gunner%20issue.md#spawn-invst-4ccb51)

# 1 Journal

2026-01-11 Wk 2 Sun - 20:51 +03:00

These relate through `m4a_SongNumStart`, we need to understand the data structures of it.

`unk_8158519` seems wrong, as there are pointers in `sound_MusicTable` that would be invalid if were to be valid. But it is referenced in `off_81CA450`, which we do not know how it is referenced.

`byte_8158795` also seems wrong, as it cuts `sound_MusicTable` which we know now is an array of `(* ?, u32)`.  `byte_8158809` also cuts it and should be removed. Also `byte_815881D, byte_8158DFD, byte_8159265`,

2026-01-11 Wk 2 Sun - 21:18 +03:00

To number each tuple `(*const ?, u32)` in the array, with content of `a` being one tuple per line.

````
cat a | python3 tools/misc_scripts/dump_code/misc_filters.py "add_index_comments_for_each_line"
````

````C
// 0x208 (0x82)
.word 0x081B8724, 0x00070007
````

We find one uncut pointer.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 81B8724 -M "unk_81B8724"
````

2026-01-11 Wk 2 Sun - 21:23 +03:00

````C
// 0x764 (0x1D9)
.word dword_81BD0A8, 0x000B000B
````

(Had to correct that offset `0x764` to `0xEC8`, because the record size is 8 bytes, not 4 bytes.)

This is the last one, and they all seem to follow a similar pattern, each being a `(u32, *const ?, *const ?)` or `(u32, *const ?, *const ?, *const ?)`.

2026-01-11 Wk 2 Sun - 21:51 +03:00

I will call the struct that `sound_MusicTable` references `RomStructLike1B820C`, just because that's the first instance we see in `sound_MusicTable` and we don't have a semantic name for it yet.

2026-01-11 Wk 2 Sun - 22:36 +03:00

````
byte_2010510:: // 0x2010510
	.space 64
byte_2010550:: // 0x2010550
	.space 64
byte_2010590:: // 0x2010590
	.space 64
byte_20105D0:: // 0x20105d0
	.space 56
off_2010608:: // 0x2010608
	.space 8
byte_2010610:: // 0x2010610
	.space 64
byte_2010650:: // 0x2010650
	.space 64
````

`byte_20105D0` and `off_2010608` seem suspicious here, these should be `.space 64` like the previous ones, all seem to be linked via `sound_814F104`'s first argument.

2026-01-12 Wk 3 Mon - 00:58 +03:00

With some of the fixes we've done, the awful screeching sound on shift is gone. But there are strange sound glitches now, with coherent music out of place playing around. This also got rid of the lag, which might have been due to that bogus music reading out of invalid data before.

Strangely after the shift, an object in `Teacher's Rm` became a white dot. It's right next to the wide blue screen, with the text "A big computer that controls all of the".  Some parts of it seem to still remain in room, mainly its outer curves.

There are many in there too once we hit the cutscene where the teachers are surrounded by the bots Mick and Blastman were controlling. With some text like `Where's Blastman!?` by Lan and `I don't care how many NetBattles you've fought...`

Aand we freeze right when logging to `RobCtrlComp1` during the `0x1000` shift.
