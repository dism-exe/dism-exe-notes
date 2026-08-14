---
context_type: entry
---

Parent: [lan/2026/main/entry/003 Ideas/003 Ideas](../003%20Ideas.md)

Spawned by: [lan/2026/main/entry/003 Ideas/entry/000 Spawns for Ideas](000%20Spawns%20for%20Ideas.md)

Spawned in: [^spawn-entry-3c7e3c](000%20Spawns%20for%20Ideas.md#spawn-entry-3c7e3c)

# Journal

2026-08-01 Wk 31 Sat - 12:02 +03:00

I'm imagining an mmbn6 meta-mod, that combines the gentoo-inspired USE flags to compile the mod you want, and also lets you compile with an in-game shell that lets you mod in runtime. Like changing the color of the fire, tiles, and all sorts of stuff. Could have a little story too.

````
Lan: MegaMan! Dad and researchers figured out we live in a simulation!
MegaMan: Maybe it will help you understand what it is like to be me, Lan.
Lan: Nevermind that! I got this from the lab: meta-mod.exe. It can let us alter reality! Let's go play with it!
MegaMan: Whoah! That sounds really dangerous Lan, we should return tha-
Lan: What's the worst that can happen? If we can crash, whoever's out there can just relaunch the simulation! They even have checkpoints!
````

Inspired by cogmind is that cutscenes should only play if you play them from this terminal window. We should figure out how to hook up mgba to an actual keyboard so that players can use the terminal in-game to edit the world.

2026-08-01 Wk 31 Sat - 12:50 +03:00

This would be like a meta-mod, where the player can, prior to building the game using USE flags, configure their own mod.

Down the line, modders could also fork a module and add their own customization just to that component and contribute this in with a PR. And the player would be able to use modded components rather than original ones from different modders. We could also define compatibiltiy rules between mods and what components go together so that the user can always ensure they have a valid mod set, or they can be adventurous and manually bypass this to install any combination of mods and test things.

This can also serve as a good demonstration of what source-based mods can do, since we would work fork in-game modules and mod them at the source level!

Also, the in-game terminal can interact with objects via shell commands, so that they can go to an NPC, and check a help menu for interaction, or a jack-in point, and jack in through the terminal, and maybe also some extra functionality they can do to the game objects!
