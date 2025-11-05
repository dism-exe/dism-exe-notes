---
parent: '[[003 Exploring Graphics for Start Screen]]'
spawned_by: '[[000 Wk 42 Exploring Graphics for Start Screen]]'
context_type: task
status: todo
---

Parent: [003 Exploring Graphics for Start Screen](../003%20Exploring%20Graphics%20for%20Start%20Screen.md)

Spawned by: [000 Wk 42 Exploring Graphics for Start Screen](../entries/000%20Wk%2042%20Exploring%20Graphics%20for%20Start%20Screen.md)

Spawned in: [<a name="spawn-task-a51e5a" />^spawn-task-a51e5a](../entries/000%20Wk%2042%20Exploring%20Graphics%20for%20Start%20Screen.md#spawn-task-a51e5a)

# 1 Journal

2025-10-23 Wk 43 Thu - 22:18 +03:00

2025-10-23 Wk 43 Thu - 22:30 +03:00

We can try with [romhacking.net Tilemap Studio](https://www.romhacking.net/utilities/1480/) although it's windows only...

````sh
# in /home/lan/Downloads
wine tilemapstudio.exe
````

This seems to work.

![Pasted image 20251023223759.png](../../../../../../../../attachments/Pasted%20image%2020251023223759.png)

````
0024:fixme:shcore:SetCurrentProcessExplicitAppUserModelID L"Rangi.Tilemap Studio": stub
0024:err:virtual:allocate_virtual_memory out of memory for allocation, base (nil) size 06010000
````

It crashed. Maybe loading the entire ROM is not a good idea.

The tileset we want is of size `0x1C0` at `CapcomLogoLicenseTileset_86C3FD4`

2025-10-23 Wk 43 Thu - 23:09 +03:00

(HowTo) Checked [stackoverflow answer](https://stackoverflow.com/a/1423362/6944447) for how to extract a binary chunk at offset and size from file

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
dd skip=7094228 count=448 if=bn6f.gba of=a.bin bs=1

# out
dd: bn6f.gba: cannot skip to specified offset
0+0 records in
0+0 records out
0 bytes copied, 6.4269e-05 s, 0.0 kB/s
````

We're able to load it as a `a.4bpp`

Let's also get the tilemap. `CapcomLogoLicenseTilemap_86C41B4` of size `14`.

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
dd skip=0x6C41B4 count=14 if=bn6f.gba of=b.bin bs=1

# out (error)
dd: invalid number: '0x6C41B4'

````

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
dd skip=$(python3 -c "print(0x6C41B4)") count=14 if=bn6f.gba of=b.bin bs=1

# out
14+0 records in
14+0 records out
14 bytes copied, 0.00016242 s, 86.2 kB/s
````

![Pasted image 20251023232506.png](../../../../../../../../attachments/Pasted%20image%2020251023232506.png)

This is able to recognize the format, and turn global tile ids  like `0x1080` into `0x0080`

But our tileset at `a.4bpp` does not have the same indices now. They're starting at `0x00`.

2025-10-23 Wk 43 Thu - 23:31 +03:00

With `Tools > Shift Tileset` with a value of `80` (which is hex) we got them to match after reloading the tilemap!

What's left for it is palette, and still unsure how to load that, but at least we can discern form now!

It's just saying `LICENSED BY`, with `Y` halfway there because we only provided half the tilemap.  It's 14 *tile_ids* which are `u16` each so it should be 28 bytes.

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
dd skip=$(python3 -c "print(0x6C41B4)") count=28 if=bn6f.gba of=b.bin bs=1
````

Now it adds the missing `Y` and `NINTENDO`!

2025-10-23 Wk 43 Thu - 23:50 +03:00

For compressed data, we can see in the `Makefile` we use `tools/gbagfx/gbagfx` to process them. Though this performs compression, and we want to decompress.

The files of interest are in:

````
data/compressed/CompCapcomLogoTileset_86C3528.lz77
data/compressed/CompCapcomLogoTilemap_86C3E94.lz77
````

2025-10-24 Wk 43 Fri - 01:39 +03:00

Old notes from 2020 included

````
(0) +Asset Integration: Integrate recompression into build
	(0) Asset Integration: Integrate preproc and scaninc to detect files to recompress
	(0) Asset Integration: Use gbagfx to Decompress/recompress .lz files
````

So `gbagfx` could decompress? I tried `tools/decompress.py` but it failed with those two compressed files.

2025-10-24 Wk 43 Fri - 01:54 +03:00

There is a comment in pret

````
I need gbagfx in the repo now because I just started tackling the compressed textscripts too
````

Let's try that.

Once renamed from lz77 to lz it works:

````
tools/gbagfx/gbagfx a.lz a.bin
````

So this is how we decompress.

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
cp data/compressed/CompCapcomLogoTileset_86C3528.lz77 a.lz
tools/gbagfx/gbagfx a.lz a.bin
dd skip=$(python3 -c "print(0x4)") if=a.bin of=a.4bpp bs=1

# out
2528+0 records in
2528+0 records out
2528 bytes (2.5 kB, 2.5 KiB) copied, 0.01355 s, 187 kB/s
````

For removing the LZ77 header.

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
cp data/compressed/CompCapcomLogoTilemap_86C3E94.lz77 a.lz
tools/gbagfx/gbagfx a.lz a.bin
dd skip=$(python3 -c "print(0x4)") if=a.bin of=a.tilemap bs=1

# out
1280+0 records in
1280+0 records out
1280 bytes (1.3 kB, 1.2 KiB) copied, 0.00696701 s, 184 kB/s
````

2025-10-24 Wk 43 Fri - 02:17 +03:00

It works! I see Capcom in Tilemap studio. Although the tileset might have a shifting problem, the entire background is a part of a character. But CAPCOM is mostly intact.
