---
parent: '[[001 Exploring bn6f CentralArea Map]]'
spawned_by: '[[003 Look into how the map data is loaded for central town]]'
context_type: task
status: todo
---

Parent: [001 Exploring bn6f CentralArea Map](../001%20Exploring%20bn6f%20CentralArea%20Map.md)

Spawned by: [003 Look into how the map data is loaded for central town](../investigations/003%20Look%20into%20how%20the%20map%20data%20is%20loaded%20for%20central%20town.md)

Spawned in: [^spawn-task-d75b30](../investigations/003%20Look%20into%20how%20the%20map%20data%20is%20loaded%20for%20central%20town.md#spawn-task-d75b30)

# 1 Journal

2025-12-25 Wk 52 Thu - 10:23 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
cp data/compressed/CompCapcomLogoTileset_86C3528.lz77 a.lz
tools/gbagfx/gbagfx a.lz a.bin
dd skip=$(python3 -c "print(0x4)") if=a.bin of=a.4bpp bs=1
rm a.lz a.bin

cp data/compressed/CompCapcomLogoTilemap_86C3E94.lz77 a.lz
tools/gbagfx/gbagfx a.lz a.bin
dd skip=$(python3 -c "print(0x4)") if=a.bin of=a.tilemap bs=1
rm a.lz a.bin

# CapcomLogoPalette_86C3C94
dd skip=$(python3 -c "print(0x86C3C94 - 0x8000000)") count=$(python3 -c "print(0x86C3CB4 - 0x86C3C94)") if=bn6f.ign of=a.pal bs=1 2>/dev/null
````

We can try to load `CapcomLogoTilemap` with [gh Prof9/PixelPet](https://github.com/Prof9/PixelPet).

2025-12-25 Wk 52 Thu - 10:32 +03:00

````sh
# in /home/lan/Downloads
wget https://github.com/Prof9/PixelPet/releases/download/v1.1.0/PixelPet-1.1.0-Ubuntu.zip
mkdir PixelPet-1.1.0-Ubuntu
mv PixelPet-1.1.0-Ubuntu.zip PixelPet-1.1.0-Ubuntu
cd PixelPet-1.1.0-Ubuntu
unzip PixelPet-1.1.0-Ubuntu.zip
````

2025-12-25 Wk 52 Thu - 10:39 +03:00

It specifies that it requires .NET 9.0.8:

From [microsoft instructions](https://learn.microsoft.com/en-us/dotnet/core/install/linux-ubuntu-install?tabs=dotnet9&pivots=os-linux-ubuntu-2504),

````
sudo apt-get update && \
  sudo apt-get install -y aspnetcore-runtime-9.0
````

````sh
# in /home/lan/Downloads/PixelPet-1.1.0-Ubuntu
./PixelPet

# out
PixelPet 1.1.0 by Prof. 9 (45999ae @ 11 Aug 2025 0:10:59 UTC)

No commands specified.

Run `PixelPet Help` to view available commands.
Run `PixelPet View-Licenses` to view licenses.

Done.
````

OK we can run it now.

````sh
# in /home/lan/Downloads/PixelPet-1.1.0-Ubuntu
./PixelPet Run-Script <(cat << 'EOF'
View-Licenses
EOF
)
````

````sh
# in /home/lan/Downloads/PixelPet-1.1.0-Ubuntu
./PixelPet Run-Script <(cat << 'EOF'
Help
EOF
)
````

2025-12-25 Wk 52 Thu - 11:02 +03:00

````sh
# in /home/lan/Downloads/PixelPet-1.1.0-Ubuntu
./PixelPet Run-Script <(cat << 'EOF'
Import-Bytes "/home/lan/src/cloned/gh/dism-exe/bn6f/a.4bpp"
Deserialize-Tileset GBA-4BPP

Import-Bytes "/home/lan/src/cloned/gh/dism-exe/bn6f/a.pal"
Deserialize-Palettes GBA --palette-size 16 --palette-count 2

Import-Bytes "/home/lan/src/cloned/gh/dism-exe/bn6f/a.tilemap"
Deserialize-Tilemap GBA-4BPP

Render-Tileset
Export-Bitmap "out.png"

EOF
)
````

This gives us an error

````
PixelPet 1.1.0 by Prof. 9 (45999ae @ 11 Aug 2025 0:10:59 UTC)

Imported 2528 bytes from binary a.4bpp.
Deserialized 79 tiles.
Imported 32 bytes from binary a.pal.
Deserialized 1 palettes with 16 colors each (16 colors total).
Imported 1280 bytes from binary a.tilemap.
ERROR: Could not save bitmap out.png
Aborted.
````

The actual error is not reported as we can see in the [source](https://github.com/Prof9/PixelPet/blob/10a3428f9333baf3580190334aaf54aa04ecefa5/PixelPet/CLI/Commands/ExportBitmapCmd.cs#L51).

````sh
# in /home/lan/Downloads/PixelPet-1.1.0-Ubuntu
./PixelPet Run-Script <(cat << 'EOF'
Import-Bytes "/home/lan/src/cloned/gh/dism-exe/bn6f/a.4bpp"
Deserialize-Tileset GBA-4BPP

Import-Bytes "/home/lan/src/cloned/gh/dism-exe/bn6f/a.pal"
Deserialize-Palettes GBA --palette-size 16 --palette-count 2

Import-Bytes "/home/lan/src/cloned/gh/dism-exe/bn6f/a.tilemap"
Deserialize-Tilemap GBA-4BPP

Quantize-Bitmap 4BPP

Render-Tilemap 20 30
Export-Bitmap "out.png"

EOF
)
````
