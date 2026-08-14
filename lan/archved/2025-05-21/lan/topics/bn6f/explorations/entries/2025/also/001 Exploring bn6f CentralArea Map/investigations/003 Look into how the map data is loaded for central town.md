---
parent: '[[001 Exploring bn6f CentralArea Map]]'
spawned_by: '[[001 Exploring bn6f CentralArea Map]]'
context_type: investigation
status: todo
---

Parent: [001 Exploring bn6f CentralArea Map](../001%20Exploring%20bn6f%20CentralArea%20Map.md)

Spawned by: [001 Exploring bn6f CentralArea Map](../001%20Exploring%20bn6f%20CentralArea%20Map.md)

Spawned in: [^spawn-invst-be936e](../001%20Exploring%20bn6f%20CentralArea%20Map.md#spawn-invst-be936e)

# 1 Journal

2025-12-11 Wk 50 Thu - 05:41 +03:00

From [001 Resource Stream](../../../../../../../../entries/2025/001%20Resource%20Stream.md),

 > 
 > [TREZ modding guide index](https://forums.therockmanexezone.com/updated-links-for-modded-guide-index-t16688.html)

I want to see if there is any discussion or guides around the map data itself.

Didn't find anything.

* [steam Map wiki data post](https://steamcommunity.com/sharedfiles/filedetails/?id=2967955077)
  * [vgmaps mmbn6 ripped maps](www.vgmaps.com/Atlas/GBA/index.htm#MegaManBattleNetwork6)
  * [interodi mmbn6 logical maps](https://www.interordi.com/mega_man_pc/games/mmbn6/)

So there's the collision information, and then there's just the graphical representation of these maps.

2025-12-11 Wk 50 Thu - 06:08 +03:00

`main_` $\to$ `cbGameState_80050EC` $\to$ `EnterMap`

2025-12-12 Wk 50 Fri - 01:07 +03:00

* `CentralTown_EnterMapGroup`
  * $\leftarrow$ `EnterMap_RealWorldMapGroupJumptable`
    * $\leftarrow$ `EnterMap_RunMapGroupAsmFunction_8030A00`
      * $\leftarrow$ `EnterMap`

2025-12-25 Wk 52 Thu - 08:47 +03:00

Can see already discovered `ACDCTown_Map0_Tileset`, `ACDCTown_Map0_Palette`, `ACDCTown_Map0_Tilemap`

2025-12-25 Wk 52 Thu - 09:28 +03:00

Before, we visualized `CompCapcomLogoTileset_86C3528` and `CompCapcomLogoTilemap_86C3E94` in [003 Use a tool to visualize Capcom Logo tile graphics](../../../003%20Exploring%20Graphics%20for%20Start%20Screen/tasks/003%20Use%20a%20tool%20to%20visualize%20Capcom%20Logo%20tile%20graphics.md):

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
````

Then we can view it with

````sh
wine ~/Downloads/tilemapstudio.exe
````

`File > Tilemap`, select `a.tilemap`, Format `GBA tiles + 4bpp palettes`

`Tileset > Load...` (might have to unload first), select `a.4bpp`

If you do `Shift Tileset... (Ctrl + K)` and select `1`, then a lot of the noise from our previous attempt goes away and we see just the logo.

2025-12-25 Wk 52 Thu - 10:06 +03:00

As for palettes, they explained in this [issue reply](https://github.com/Rangi42/tilemap-studio/issues/68#issuecomment-1111393651) explains that the feature to add palettes is not planned.

We can try to load `CapcomLogoTilemap` with [gh Prof9/PixelPet](https://github.com/Prof9/PixelPet).

Spawn [005 Attempt loading CapcomLogoTilemap with PixelPet](../tasks/005%20Attempt%20loading%20CapcomLogoTilemap%20with%20PixelPet.md) ^spawn-task-d75b30
