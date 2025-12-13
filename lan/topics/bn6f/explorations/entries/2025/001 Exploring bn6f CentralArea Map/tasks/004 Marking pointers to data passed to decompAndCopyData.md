---
parent: '[[001 Exploring bn6f CentralArea Map]]'
spawned_by: '[[001 Exploring bn6f CentralArea Map]]'
context_type: task
status: done
---

Parent: [001 Exploring bn6f CentralArea Map](../001%20Exploring%20bn6f%20CentralArea%20Map.md)

Spawned by: [001 Exploring bn6f CentralArea Map](../001%20Exploring%20bn6f%20CentralArea%20Map.md)

Spawned in: [<a name="spawn-task-d4c93b" />^spawn-task-d4c93b](../001%20Exploring%20bn6f%20CentralArea%20Map.md#spawn-task-d4c93b)

# 1 Journal

2025-10-26 Wk 43 Sun - 22:01 +03:00

This issue is recorded in [002 Suspicious pointers encountered during CentralArea Map Exploring](../entries/002%20Suspicious%20pointers%20encountered%20during%20CentralArea%20Map%20Exploring.md) at [<a name="ref-318303" />^ref-318303](../entries/002%20Suspicious%20pointers%20encountered%20during%20CentralArea%20Map%20Exploring.md#ref-318303)

I already started some of the work. We're at `sub_8135B94` use of `decompAndCopyData`.

Finding

````
.word 0x886D4494
````

Triangulating in `bn6f.map` points us towards it being embedded between `byte_86D3984` and `comp_86D471C`.

We've already cut `byte_86D3984` to create `comp_86D3CF4`

So it's between `comp_86D3CF4` and `comp_86D471C`.

We can cut it with

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data comp_86D3CF4 -mmm -w 32 -c $(python3 -c "print(0x86D4494)")
````

(mode `-mmm` is words, `-w 32` is 32 bytes per line)

Then replace `CUT:` with `comp_86D4494::` and ensure `.word` is tabbed with `\t.word`.

Now we can replace this

````diff
off_8135C64:
-	.word 0x886D4494
+	.word comp_86D4494 + COMPRESSED_PTR_FLAG
````

Then confirm OK

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
make clean && make -j$(nproc) assets && make -j$(nproc)

# out (relevant)
bn6f.gba: OK
````

2025-10-26 Wk 43 Sun - 22:28 +03:00

`.word 0x886D45AC`  is between `comp_86D4494` and  `comp_86D471C`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data comp_86D4494 -mmm -w 32 -c $(python3 -c "print(0x86D45AC)")
````

`.word 0x886D4670` is between `comp_86D45AC` and `comp_86D471C`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data comp_86D45AC -mmm -w 32 -c $(python3 -c "print(0x86D4670)")
````

2025-10-26 Wk 43 Sun - 22:49 +03:00

`.word 0x886D439C` is between `comp_86D3CF4` and `comp_86D4494`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data comp_86D3CF4 -mmm -w 32 -c $(python3 -c "print(0x86D439C)")
````

`.word 0x886D3D70` is between `comp_86D3CF4` and `comp_86D439C`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data comp_86D3CF4 -mmm -w 32 -c $(python3 -c "print(0x86D3D70)")
````

`.word 0x886D3F34` is between `comp_86D3D70` and `comp_86D439C`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data comp_86D3D70 -mmm -w 32 -c $(python3 -c "print(0x86D3F34)")
````

`.word 0x886D4140` is between `comp_86D3F34` and `comp_86D439C`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data comp_86D3F34 -mmm -w 32 -c $(python3 -c "print(0x86D4140)")
````

`.word 0x886D4560` is between `comp_86D4494` and `comp_86D45AC`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data comp_86D4494 -mmm -w 32 -c $(python3 -c "print(0x86D4560)")
````

2025-10-26 Wk 43 Sun - 23:52 +03:00

`.word 0x886D46A8`  is between `comp_86D4670` and `comp_86D471C`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data comp_86D4670 -mmm -w 32 -c $(python3 -c "print(0x86D46A8)")
````

`.word 0x886D46E4` is between `comp_86D46A8` and `comp_86D471C`

Repeat the process

Showing output once for demonstration for a small example:

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data comp_86D46A8 -mmm -w 32 -c $(python3 -c "print(0x86D46E4)")

# out (relevant)
.word 0xc410, 0xc40003, 0xf0300100, 0x19001, 0x30033002, 0x30053004, 0x140066c, 0xf0070fb0
.word 0x801c031, 0x30090130, 0x300b300a, 0xbc01400c, 0xf00d0fb0, 0xf001f031, 0x18001

CUT:
.word 0xc410, 0xc40000, 0x3300200, 0x30040730, 0x40063005, 0xf00ff001, 0xf90800f, 0x30093008
.word 0x3d0b300a, 0x1400c30, 0xff00ff0, 0xf0010f90, 0x1f0e001, 0x16001f0
````

Since it's the l

2025-10-26 Wk 43 Sun - 23:59 +03:00

Also ran into this:

````C
TextScriptNaviCustDialog_inc:
	.include "data/textscript/TextScriptNaviCustDialog.s"
// TODO copmression: not compressed??? decompressing this fails, but there's a 88 pointer to it
comp_86D6618::
````

Might have to do with how they are cut?

Also renaming it into `TODO compression` or it won't be found...

2025-10-27 Wk 44 Mon - 00:04 +03:00

Now we're finally done with compressed assets used by `sub_8135B94`.

2025-10-27 Wk 44 Mon - 00:14 +03:00

For `reqBBS_813FDA8`, a lot of the pointers are in bytes. We need to split everything into groups of 4 bytes each, then transform that all bytes so they are 2-zero-padded and then merge them into words first.

Select all the data and run this replace to make sure all bytes are 2-zero-padded (vim sed):

````
:'<,'>s/0x\([0-9A-F]\)\(,\|$\)/0x0\1\2/g
````

Select all the data again and run this to merge the bytes into little endian words:

````
:'<,'>s/.byte 0x\([0-9A-F][0-9A-F]\), 0x\([0-9A-F][0-9A-F]\), 0x\([0-9A-F][0-9A-F]\), 0x\([0-9A-F][0-9A-F]\)/.word 0x\4\3\2\1/g
````

2025-10-27 Wk 44 Mon - 00:33 +03:00

`.word 0x887EF884`  is between `byte_87EF824` and `byte_87EFBA4`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data byte_87EF824 -mmm -w 32 -c $(python3 -c "print(0x87EF884)")
````

`.word 0x887EFC28` is between `reqBBS_textualShades (0x087efbc8)`  and `CompText87EFE14`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data reqBBS_textualShades -mmm -w 32 -c $(python3 -c "print(0x87EFC28)")
````

`.word 0x887EFD14` is between `comp_87EFC28` and `CompText87EFE14`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data comp_87EFC28 -mmm -w 32 -c $(python3 -c "print(0x87EFD14)")
````

`.word 0x887EFD78` is between `comp_87EFD14` and `CompText87EFE14`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data comp_87EFD14 -mmm -w 32 -c $(python3 -c "print(0x87EFD78)")
````

2025-10-27 Wk 44 Mon - 01:02 +03:00

In `off_812B08C`,

`.word 0x886D9104` is between `dword_86D9068` and `comp_86D91FC`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data dword_86D9068 -mmm -w 32 -c $(python3 -c "print(0x86D9104)")
````

2025-10-27 Wk 44 Mon - 01:11 +03:00

Oops... I realized `expt000` zero-pads words to 4 rather than 8, so they don't look even. But this is okay, it still produces OK. And many of these compressed assets may be extracted. I fixed it now to pad to 8. I thought it wasn't adding, then saw a `.word 0x0000`, which was strange.

2025-10-27 Wk 44 Mon - 03:01 +03:00

It should also be upper... 0xA not 0xa.

2025-10-27 Wk 44 Mon - 01:27 +03:00

Let's modify `expt000_read_symbol_data` to make it so that on an `EaNotInMap` error it triangulates between two values that are in the map, if possible.

This means if we want to triangulate, we can get this information out of an intentional error of this command. This also will make the command much more useful continuously for any address. If we're in the middle of an array, triangulation gives you the array address.

(HowTo) Checked [stackoverflow answer](https://stackoverflow.com/a/32554326/6944447) for checking two enum instances of same variant. This is using [std::mem::discriminant](https://doc.rust-lang.org/std/mem/fn.discriminant.html)

2025-10-27 Wk 44 Mon - 01:20 +03:00

In `byte_8128F38`,

`.word 0x886D66A8`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 86D66A8

# out (relevant)
RomEa { ea: 141387432 } is not in map. But it is between Identifier { s: "comp_86D6618" } and Identifier { s: "dword_86D6754" }
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data comp_86D6618 -mmm -w 32 -c $(python3 -c "print(0x86D66A8)")
````

Hey this is the one with the TODO.

````diff
-// TODO compression: not compressed??? decompressing this fails, but there's a 88 pointer to it
+// TODO compression: Try decompressing again. This had within it multiple compressed assets.
comp_86D6618::
````

2025-10-27 Wk 44 Mon - 03:46 +03:00

In `byte_812B168`,

`.word 0x886DC418`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 86DC418

# out (relevant)
RomEa { ea: 141411352 } is not in map. But it is between Identifier { s: "dat38_80" } and Identifier { s: "comp_86DC518" }
````

In `dat38_80` we find the first symbol `off_86DC3F8`. (Currently this would error on using `dat38_80` due to its ea being equivalent to `off_86DC3F8`)

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data off_86DC3F8 -mmm -w 32 -c $(python3 -c "print(0x86DC418)")

# out (error, relevant)
Failed to process symbol data: NonPositiveSize(RomEa { ea: 141411320 }, RomEa { ea: 141411320 })
````

2025-10-27 Wk 44 Mon - 03:58 +03:00

This issue happens here:

````rust
// in fn read_symbol_data
let next_ea = addressed_labels[ea_idx + 1]
	.0
	.clone()
	.pipe(|ea| match ea {
		Ea::Rom(rom_ea) => Some(rom_ea),
		_ => None,
	})
	.ok_or(FnErr::NextEaIsNotRomEa(ea.clone(), addressed_labels[ea_idx + 1].0.clone()))?;

if ea.ea >= next_ea.ea {
	return Err(FnErr::NonPositiveSize(ea.clone(), next_ea.clone()));
}
````

Let's just keep getting the next until this passes for any duplication.

2025-10-27 Wk 44 Mon - 04:06 +03:00

Okay it's fixed. It will skip all equivalent eas till it finds the next actually higher one so it no longer fails. Both `off_86DC3F8` and `dat38_80` can be used and they will give equivalent results for data content.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data off_86DC3F8 -mmm -w 32 -c $(python3 -c "print(0x86DC418)")
````

`byte_8420000` looks suspicious and fake, it only has a reference here. Let's remove it. `off_86DC3F8` is used by `sub_811AE7C` which processes it directly as graphics of size `0x20`, no indication that there needs to be a pointer there, so it's likely wrong.

2025-10-27 Wk 44 Mon - 04:13 +03:00

In `byte_812B1A0`,

`.word 0x886DCA9C`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 86DCA9C
````

It's exactly at `dat38_81`.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data dat38_81 -mmm -w 32
````

`.word 0x886DCBC8`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 86DCBC8

# out (relevant)
RomEa { ea: 141413320 } is not in map. But it is between Identifier { s: "dat38_81" } and Identifier { s: "comp_86DCCF0" }
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data comp_86DCA9C -mmm -w 32 -c $(python3 -c "print(0x86DCBC8)")
````

`.word 0x886DD0AC`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 86DD0AC
````

It's exactly at `dat38_82`

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data dat38_82 -mmm -w 32
````

`.word 0x886DD1CC`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 86DD1CC

# out (relevant)
RomEa { ea: 141414860 } is not in map. But it is between Identifier { s: "dat38_82" } and Identifier { s: "comp_86DD328" }
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data comp_86DD0AC -mmm -w 32 -c $(python3 -c "print(0x86DD1CC)")
````

2025-10-27 Wk 44 Mon - 04:38 +03:00

`sub_812AF3C` uses `decompAndCopyData` from ewram at `unk_201D020`...  This is written by `sub_812AF3C` from values given by `sub_811FB84`. There's some one unmarked compressed pointer there for `comp_86C9AA4` that I just marked, and 3 more which have been already marked.

2025-10-27 Wk 44 Mon - 04:47 +03:00

In `byte_8128978`,

`.word 0x886D64F0`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 86D64F0

# out (relevant)
RomEa { ea: 141386992 } is not in map. But it is between Identifier { s: "TextScriptNaviCustDialog" } and Identifier { s: "comp_86D6618" }
````

`TextScriptNaviCustDialog` is an undumped textscript... Recorded in [004 Encountered undumped textscripts](../entries/004%20Encountered%20undumped%20textscripts.md)

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data TextScriptNaviCustDialog -mmm -w 32 -c $(python3 -c "print(0x86D64F0)")
````

2025-10-27 Wk 44 Mon - 04:55 +03:00

`sub_81288FC` also uses `decompAndCopyData` from ewram at `unk_20096E0`. This has 22 uses. Noted in [005 Reminders noted during bn6f CentralArea Map Exploration](../entries/005%20Reminders%20noted%20during%20bn6f%20CentralArea%20Map%20Exploration.md)

There seems to be a repeated pattern like with `off_8133F30`. We've encountered another (`off_812AFE4, byte_8127D38`) like this with many compressed textscripts.  <a name="reminder-9381d0" />^reminder-9381d0

Notes in [005 Reminders noted during bn6f CentralArea Map Exploration](../entries/005%20Reminders%20noted%20during%20bn6f%20CentralArea%20Map%20Exploration.md)

2025-10-27 Wk 44 Mon - 05:24 +03:00

In `dword_8132718`,

`.word 0x886DB0F8`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 86DB0F8

# out (relevant)
RomEa { ea: 141406456 } is not in map. But it is between Identifier { s: "comp_86DB014" } and Identifier { s: "comp_86DB208" }
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data comp_86DB014 -mmm -w 32 -c $(python3 -c "print(0x86DB0F8)")
````

`.word 0x886DBD64`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 86DBD64

# out (relevant)
SymbolData {
  ea: RomEa { ea: 086dbd64 }
  label: Identifier { s: "dat38_79" }
  size: 48
  data: [10, 24, 00, 00, 00, 00, 24, 00, 00, 00,
         00, de, 7b, 0c, 75, 5e, a5, 35, 10, 09,
         f0, 01, 00, 00, 10, 24, 00, 00, 00, 00,
         24, 00, 00, 00, 00, b4, 7f, 0c, 75, 5e,
         a5, 35, 10, 09, f0, 01, 00, 00, ]
}
````

It's exactly `dat38_79`.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data dat38_79 -mmm -w 32

# out (relevant)
.word 0x00002410, 0x00240000, 0xDE000000, 0x5E750C7B, 0x091035A5, 0x000001F0, 0x00002410, 0x00240000
.word 0xB4000000, 0x5E750C7F, 0x091035A5, 0x000001F0
````

`.word 0x886DBD7C`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 86DBD7C

# out (relevant)
RomEa { ea: 141409660 } is not in map. But it is between Identifier { s: "dat38_79" } and Identifier { s: "comp_86DBD94" }
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data comp_86DBD64 -mmm -w 32 -c $(python3 -c "print(0x86DBD7C)")

# out (relevant)
.word 0x00002410, 0x00240000, 0xDE000000, 0x5E750C7B, 0x091035A5, 0x000001F0

CUT:
.word 0x00002410, 0x00240000, 0xB4000000, 0x5E750C7F, 0x091035A5, 0x000001F0
````

2025-10-27 Wk 44 Mon - 05:48 +03:00

In `byte_8131418`,

`.word 0x886DD488`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 86DD488
````

It's exactly `dat38_83`

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data dat38_83 -mmm -w 32
````

In `byte_813E6FC`,

`.word 0x887E7368`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 87E7368

# out (relevant)
RomEa { ea: 142504808 } is not in map. But it is between Identifier { s: "sprite_87E6E20" } and Identifier { s: "dword_87E74F4" }
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data sprite_87E6E20 -mmm -w 32 -c $(python3 -c "print(0x87E7368)")
````

`.word 0x887E72A0`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 87E72A0

# out (relevant)
RomEa { ea: 142504608 } is not in map. But it is between Identifier { s: "sprite_87E6E20" } and Identifier { s: "comp_87E7368" }
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data sprite_87E6E20 -mmm -w 32 -c $(python3 -c "print(0x87E72A0)")
````

`.word 0x887E723C`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 87E723C

# out (relevant)
RomEa { ea: 142504508 } is not in map. But it is between Identifier { s: "sprite_87E6E20" } and Identifier { s: "comp_87E72A0" }
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data sprite_87E6E20 -mmm -w 32 -c $(python3 -c "print(0x87E723C)")
````

2025-10-27 Wk 44 Mon - 06:15 +03:00

In `byte_8127D38`,

`.word 0x086D0460`

This isn't compressed, yet grepping it gives us a file `data/textscript/compressed/CompText86D0460.s`. And this isn't referenced anywhere!

<a name="reminder-23aa66" />^reminder-23aa66

Noted in [005 Reminders noted during bn6f CentralArea Map Exploration](../entries/005%20Reminders%20noted%20during%20bn6f%20CentralArea%20Map%20Exploration.md)

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 86D0460

# out (relevant)
RomEa { ea: 141362272 } is not in map. But it is between Identifier { s: "dat38_73" } and Identifier { s: "byte_86D0508" }
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data dat38_73 -mmm -w 32 -c $(python3 -c "print(0x86D0460)")
````

2025-10-27 Wk 44 Mon - 06:39 +03:00

In `dword_8127D98`,

`.word 0x886C9694`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 86C9694
````

It's exactly `dat38_68`

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data dat38_68 -mmm -w 32
````

2025-10-27 Wk 44 Mon - 07:00 +03:00

`.word 0x886D00C0`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 86D00C0

# out (relevant)
RomEa { ea: 141361344 } is not in map. But it is between Identifier { s: "comp_86CFFA8" } and Identifier { s: "CompText86D0460" }
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data comp_86CFFA8 -mmm -w 32 -c $(python3 -c "print(0x86D00C0)")
````

`.word 0x886D01DC`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 86D01DC

# out (relevant)
RomEa { ea: 141361628 } is not in map. But it is between Identifier { s: "comp_86D00C0" } and Identifier { s: "CompText86D0460" }
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data comp_86D00C0 -mmm -w 32 -c $(python3 -c "print(0x86D01DC)")
````

`.word 0x886D02D4`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 86D02D4

# out (relevant)
RomEa { ea: 141361876 } is not in map. But it is between Identifier { s: "comp_86D01DC" } and Identifier { s: "CompText86D0460" }
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data comp_86D01DC -mmm -w 32 -c $(python3 -c "print(0x86D02D4)")
````

`.word 0x886D0264`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 86D0264

# out (relevant)
RomEa { ea: 141361764 } is not in map. But it is between Identifier { s: "comp_86D01DC" } and Identifier { s: "comp_86D02D4" }
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data comp_86D01DC -mmm -w 32 -c $(python3 -c "print(0x86D0264)")
````

`.word 0x886D0430`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 86D0430

# out (relevant)
RomEa { ea: 141362224 } is not in map. But it is between Identifier { s: "comp_86D02D4" } and Identifier { s: "CompText86D0460" }
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data comp_86D02D4 -mmm -w 32 -c $(python3 -c "print(0x86D0430)")
````

`.word 0x886D02BC`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 86D02BC

# out (relevant)
RomEa { ea: 141361852 } is not in map. But it is between Identifier { s: "comp_86D0264" } and Identifier { s: "comp_86D02D4" }
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data comp_86D0264 -mmm -w 32 -c $(python3 -c "print(0x86D02BC)")
````

2025-10-27 Wk 44 Mon - 07:35 +03:00

In `byte_8089268`,

`.word 0x87DDD4C`

Repeat the process

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data 87DDD4C

# out (relevant)
RomEa { ea: 142466380 } is not in map. But it is between Identifier { s: "sprite_87DDB7C" } and Identifier { s: "byte_87DE44C" }
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data sprite_87DDB7C -mmm -w 32 -c $(python3 -c "print(0x87DDD4C)")
````

2025-10-27 Wk 44 Mon - 07:39 +03:00

And we're done! With this, all of the pointers found in direct uses of `decompAndCopyData`  have been marked! Only have to double check on `unk_20096E0`.

It gets written to from `sub_811FB84` from a lot of sources, and everything there is marked so we're good!
