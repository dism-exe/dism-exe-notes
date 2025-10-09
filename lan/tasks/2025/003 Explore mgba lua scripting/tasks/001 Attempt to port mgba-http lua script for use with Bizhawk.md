---
parent: '[[003 Explore mgba lua scripting]]'
spawned_by: '[[003 Explore mgba lua scripting]]'
context_type: task
status: paused
---

Parent: [003 Explore mgba lua scripting](../003%20Explore%20mgba%20lua%20scripting.md)

Spawned by: [003 Explore mgba lua scripting](../003%20Explore%20mgba%20lua%20scripting.md)

Spawned in: [<a name="spawn-task-b4e586" />^spawn-task-b4e586](../003%20Explore%20mgba%20lua%20scripting.md#spawn-task-b4e586)

# 1 Related

[000 Resources encountered while exploring mgba lua scripting](../entries/000%20Resources%20encountered%20while%20exploring%20mgba%20lua%20scripting.md)

# 2 Journal

2025-10-01 Wk 40 Wed - 08:48 +03:00

The [gh TASEmulators/BizHawk](https://github.com/TASEmulators/BizHawk) lua function docs are [here](https://tasvideos.org/Bizhawk/LuaFunctions).

[gh nikouu/mGBA-http](https://github.com/nikouu/mGBA-http).

2025-10-01 Wk 40 Wed - 08:49 +03:00

We should start with trying to fix the first error:

````sh
# in /home/lan/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts/
bizhawk/BizHawk-2.11-linux-x64/EmuHawkMono.sh ~/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts/bn6f.gba --movie '/home/lan/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts/bizhawk/BizHawk-2.11-linux-x64/Movies/Save Game.bk2' --lua '/home/lan/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts/mGBA-http/mGBASocketServer.lua'

# out (UI, error, relevant)
NLua.Exceptions.LuaScriptException: [string "main"]:285: attempt to index a nil value (global 'callbacks')
````

This is on this line

````lua
callbacks:add("frame", updateKeys)
````

Maybe there's an equivalence for this?

[lua script by denilsonsa](https://github.com/denilsonsa/bizhawk-lua-scripts/blob/master/GEN%20-%20Disney's%20Aladdin%20(U)%20%5B!%5D%20-%20hide%20HUD.lua) shows an example of the infinite loop lua script that advances frames.

Uses

````
**emu.frameadvance**  

- void emu.frameadvance()

- Signals to the emulator to resume emulation. Necessary for any lua script while loop or else the emulator will freeze!
````

2025-10-01 Wk 40 Wed - 09:56 +03:00

[gh Isotarge/ScriptHawk ScriptHawl.lua L2208](https://github.com/Isotarge/ScriptHawk/blob/31b51aa14d074c529c65c1b1df9c5f2403f28d47/ScriptHawk.lua#L2208) has example usage of setting events with `event.onloadstate` and `event.onframeend` And [it](https://github.com/Isotarge/ScriptHawk/blob/31b51aa14d074c529c65c1b1df9c5f2403f28d47/ScriptHawk.lua#L2603) uses `emu.yield` since it's UI heavy.

[here](https://github.com/Isotarge/ScriptHawk/blob/31b51aa14d074c529c65c1b1df9c5f2403f28d47/Tetris%20Attack%20Bot.lua#L759) they use `event.onframestart` directly to initialize their `mainLoop`.
