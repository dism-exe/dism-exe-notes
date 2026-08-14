---
parent: '[[002 Note Captures]]'
spawned_by: '[[002 Note Captures]]'
context_type: entry
---

Parent: [002 Note Captures](../002%20Note%20Captures.md)

Spawned by: [002 Note Captures](../002%20Note%20Captures.md)

Spawned in: [^spawn-entry-f49dcf](../002%20Note%20Captures.md#spawn-entry-f49dcf)

# 1 Journal

2026-01-02 Wk 1 Fri - 14:02 +03:00

Test case is regular battle in start of game in Central Area 1.

Disabling `battle_80052D8`: whitescreen when battle starts

No effect observed when disabling `bl`  in `battle_80052D8` for

````
dispatch_80339CC, sub_80039AA, sub_8003AFA, sub_80027B4, sub_800286C, sub_8003BF4, sub_8003E98, npc_init_800467C, 
sub_8004298, sub_8004590, sub_8004934, sub_80024AE, sub_803F530
````

`bne locret_800531A` $\to$ `b locret_800531A` causes whitescreen freeze when battle starts

Disabling `bl sub_800531C` in `battle_80052D8` causes whitescreen freeze.
