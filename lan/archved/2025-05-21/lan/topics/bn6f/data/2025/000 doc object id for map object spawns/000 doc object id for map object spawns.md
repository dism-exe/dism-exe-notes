---
status: todo
---

# 1 Journal

2025-12-16 Wk 51 Tue - 06:41 +03:00

In CentralTown, `CentralTownObjectSpawns` the coordinate `(0x8C, -0x58, 0x00)` can be modified to `(0xCC, -0x58, 0x00)` and it'll be just out of the map to give a clear picture of a given objet id. This corresponds to the tree left from the blue bird statue facing against it.

positive x moves towards the blue bird status, in the same direction as the road while positive y moves away from the gate, towards the robo dog or other tree besides the blue bird statue.

These structs are used by `SpawnObjectsFromList`. Via `SpawnObjectJumptable` it routes to `SpawnOverworldMapObject`

Object ID ends up in `oOverworldMapObject_ObjectID` then these IDs end up corresponding to `OverworldMapObjects`, which has values from 0x00 to 0xf3.

We can document these constants in `include/structs/OverworldMapObject.inc`.

````python
#!/bin/python3

for i in range(0, 0xF4):
    print(f'.equiv OW_MAP_OBJECT_ID_UNK_{i:02X}, 0x{i:02X}')
````

2025-12-16 Wk 51 Tue - 07:52 +03:00

I get white dot for replacing tree with 0x03-0x06 ID

This should be resolved on re-running.

````
	map_object_data_struct 0x1c, 0x30, 0x00, 0xff, 0x00000000, 0x00, 0x00, 0x0000, 0x0000, 0x0000 // Object ID: 0x7d
````

0x51 $\to$ 0x30 turned all the 0x7d trees into animating dolphins in `OverworldMapObjects`

This field is called the SpriteIndex...
