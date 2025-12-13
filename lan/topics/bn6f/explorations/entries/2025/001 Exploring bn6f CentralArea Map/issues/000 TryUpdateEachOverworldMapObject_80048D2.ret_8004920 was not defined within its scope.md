---
parent: '[[001 Exploring bn6f CentralArea Map]]'
spawned_by: '[[001 Create Struct S2011E30 used in dispatch_80339CC]]'
context_type: issue
status: done
---

Parent: [001 Exploring bn6f CentralArea Map](../001%20Exploring%20bn6f%20CentralArea%20Map.md)

Spawned by: [001 Create Struct S2011E30 used in dispatch_80339CC](../tasks/001%20Create%20Struct%20S2011E30%20used%20in%20dispatch_80339CC.md)

Spawned in: [<a name="spawn-issue-47ff20" />^spawn-issue-47ff20](../tasks/001%20Create%20Struct%20S2011E30%20used%20in%20dispatch_80339CC.md#spawn-issue-47ff20)

# 1 Journal

2025-10-11 Wk 41 Sat - 09:58 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
make clean && make -j$(nproc) assets && make -j$(nproc);

# out (error, relevant)
./asm/asm00_1.s: Assembler messages:
./asm/asm00_1.s:2915: Error: agbasm local label `TryUpdateEachOverworldMapObject_80048D2.ret_8004920' was not defined within its scope
./asm/asm00_1.s:2931: Error: agbasm local label `TryUpdateEachOverworldMapObject_80048D2.endcheck_8004916' was not defined within its scope
./asm/asm00_1.s:2959: Error: agbasm local label `loc_800490A.ForEachOverworldMapObject_80048F2' was not defined within its scope
./asm/asm03_1_0.s:192: Error: agbasm local label `dispatch_80339CC.internet_8033A0A' was not defined within its scope
make: *** [Makefile:58: rom.o] Error 1
````

2025-10-11 Wk 41 Sat - 10:00 +03:00

````diff
// in fn EnterMap
-.endif1
+.endif1:
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
make clean && make -j$(nproc) assets && make -j$(nproc);

# out (error, relevant)
./asm/asm00_1.s: Assembler messages:
./asm/asm00_1.s:2915: Error: agbasm local label `TryUpdateEachOverworldMapObject_80048D2.ret_8004920' was not defined within its scope
./asm/asm00_1.s:2931: Error: agbasm local label `TryUpdateEachOverworldMapObject_80048D2.endcheck_8004916' was not defined within its scope
./asm/asm00_1.s:2959: Error: agbasm local label `loc_800490A.ForEachOverworldMapObject_80048F2' was not defined within its scope
./asm/asm03_1_0.s:192: Error: agbasm local label `dispatch_80339CC.internet_8033A0A' was not defined within its scope
make: *** [Makefile:58: rom.o] Error 1
````

2025-10-11 Wk 41 Sat - 10:16 +03:00

Turning all the local labels complained about into global labels gives OK

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
make clean && make -j$(nproc) assets && make -j$(nproc);

# out (relevant)
bn6f.gba: OK
````

2025-10-11 Wk 41 Sat - 10:20 +03:00

You also get OK if all the labels within a function are local labels with `.`, just don't mix the two.

OK
