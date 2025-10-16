---
parent: '[[001 Idea Stream]]'
spawned_by: '[[001 Idea Stream]]'
context_type: idea
---

Parent: [001 Idea Stream](../001%20Idea%20Stream.md)

Spawned by: [001 Idea Stream](../001%20Idea%20Stream.md)

Spawned in: [<a name="spawn-idea-a738ef" />^spawn-idea-a738ef](../001%20Idea%20Stream.md#spawn-idea-a738ef)

# 1 Idea

I would like to use the tool [gh LanHikari22/GBA_Memory-Access-Scanner](https://github.com/LanHikari22/GBA_Memory-Access-Scanner/tree/master) again but I'm on Linux, and I would have to use wine to run VBA-rr.

A more general approach is to port it to work directly via gdb rather than having an emulator dependency. However, last time I tried to do this, I overwhelmed mgba with watchpoints set as per the issue I created in 2019: [mgba-emu/mgba #1355](https://github.com/mgba-emu/mgba/issues/1355). They also mention the protocol itself is limited?

mgba itself has [lua scripting](https://mgba.io/docs/scripting.html) now, but unsure if this has the same capabilities for a port.

# 2 Related

[003 Explore mgba lua scripting](../../../../tasks/2025/003%20Explore%20mgba%20lua%20scripting/003%20Explore%20mgba%20lua%20scripting.md)
