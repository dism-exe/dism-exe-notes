---
parent: '[[001 Exploring bn6f CentralArea Map]]'
spawned_by: '[[001 Exploring bn6f CentralArea Map]]'
context_type: investigation
status: todo
---

Parent: [001 Exploring bn6f CentralArea Map](../001%20Exploring%20bn6f%20CentralArea%20Map.md)

Spawned by: [001 Exploring bn6f CentralArea Map](../001%20Exploring%20bn6f%20CentralArea%20Map.md)

Spawned in: [<a name="spawn-invst-be936e" />^spawn-invst-be936e](../001%20Exploring%20bn6f%20CentralArea%20Map.md#spawn-invst-be936e)

# 1 Journal

2025-12-11 Wk 50 Thu - 05:41 +03:00

From [001 Resource Stream](../../../../../../../entries/2025/001%20Resource%20Stream.md),

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
