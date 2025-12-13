---
parent: '[[001 Exploring bn6f CentralArea Map]]'
spawned_by: '[[000 Wk 41 Exploring bn6f CentralArea Map]]'
context_type: task
status: todo
---

Parent: [001 Exploring bn6f CentralArea Map](../001%20Exploring%20bn6f%20CentralArea%20Map.md)

Spawned by: [000 Wk 41 Exploring bn6f CentralArea Map](../entries/000%20Wk%2041%20Exploring%20bn6f%20CentralArea%20Map.md)

Spawned in: [<a name="spawn-task-2fab74" />^spawn-task-2fab74](../entries/000%20Wk%2041%20Exploring%20bn6f%20CentralArea%20Map.md#spawn-task-2fab74)

# 1 Journal

2025-10-19 Wk 42 Sun - 08:57 +03:00

Exploring the general cutscene functions

````
# after byte_8086678+32, `sub_8086FD8`, `sub_808FE74`, `sub_808CB0C` start cutscenes generally
````

Starting with `sub_8086FD8`

I cannot find an xref for `sub_8086FD8`

* `sub_808FE74`
  * (referenced_by) `byte_806A35A` (in maps/MrWeatherComp/data.s)
    * (referenced_by) `off_806A26C`
      * (referenced_by) `InternetMapScriptPointers`

This might be why we can't find xrefs. These might be referred to directly by map scripts.

* `sub_808CB0C`
  * (referenced_by) `byte_8069462` (in maps/JudgeTreeComp/data.s)
  * (referenced_by) `byte_806AF94` (in maps/PavilionComp/data.s)

Actually `byte_806AF94` is malformed since its only reference is as `.word byte_806AF94+6` in `off_806AE1C`. I removed the label in favor of `MapScript_806AF9A`
