---
parent: '[[002 bn6f ROM shifting]]'
spawned_by: '[[006 Attempt to modify mgba to get information on save corruption gunner issue]]'
context_type: task
status: todo
---

Parent: [002 bn6f ROM shifting](../002%20bn6f%20ROM%20shifting.md)

Spawned by: [006 Attempt to modify mgba to get information on save corruption gunner issue](../investigations/006%20Attempt%20to%20modify%20mgba%20to%20get%20information%20on%20save%20corruption%20gunner%20issue.md)

Spawned in: [^spawn-task-6aabf7](../investigations/006%20Attempt%20to%20modify%20mgba%20to%20get%20information%20on%20save%20corruption%20gunner%20issue.md#spawn-task-6aabf7)

# 1 Journal

2026-01-04 Wk 1 Sun - 14:22 +03:00

Result will put in `constants/enums/sprite_categories.inc`.

For assistance with naming the sprites let's use [TREZ mmbn6 wiki](https://www.therockmanexezone.com/wiki/Mega_Man_Battle_Network_6).

For example `r1=0x00 r2=0x01` is [heat beast in the cross system wiki](https://www.therockmanexezone.com/wiki/Cross_System).

I am imaging by varying parameters to `load_sprite` in `playerObject_init_80172F0` and then going to a battle to see MegaMan's sprite changing.

There's a sprite database [spritedatabase.net mmbn6](https://spritedatabase.net/game/1067) but it's not complete.

There is this [sprite unpacker tool](https://github.com/RockmanEXEZone/Battle-Network-Sprite-Unpacker) that could come in handy later.

TREZ Did some imaging in [trez sprite-list-map](https://forums.therockmanexezone.com/sprite-list-map-t5161.html)

This gives us all of `r1=0x00 r2=0x00..0xFF` and then only `r1=0x01 r2=0x00..0x1F`
