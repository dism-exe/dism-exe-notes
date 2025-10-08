
# 1 Objective

Learn about mgba lua scripting and see if it's feasible to accomplish [[000 Can port GBA Memory Access Scanner outside vba-rr dependency]] through it

# 2 Journal

2025-10-01 Wk 40 Wed - 04:08 +03:00

The repository for this can be found in [gh deltachives/2025-Wk40-000-mgba-lua-scripts](https://github.com/deltachives/2025-Wk40-000-mgba-lua-scripts).

mgba lua scripting documentation: [lua scripting](https://mgba.io/docs/scripting.html).

2025-10-01 Wk 40 Wed - 04:43 +03:00

We can generalize our application language by using [nikouu/mGBA-http](https://github.com/nikouu/mGBA-http).

2025-10-01 Wk 40 Wed - 04:48 +03:00

```sh
# in /home/lan/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts
mkdir -p mGBA-http
wget https://github.com/nikouu/mGBA-http/releases/download/0.6.0/mGBASocketServer.lua -O mGBA-http/mGBASocketServer.lua
wget https://github.com/nikouu/mGBA-http/releases/download/0.6.0/mGBA-http-0.6.0-linux-x64 -O mGBA-http/mGBA-http-0.6.0-linux-x64
chmod +x mGBA-http/mGBA-http-0.6.0-linux-x64
```

2025-10-01 Wk 40 Wed - 04:55 +03:00

Since we can just interface with it via http, let's use Rust.

```sh
# in /home/lan/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts
cargo init --name mgba_lua_scripting
```

2025-10-01 Wk 40 Wed - 04:56 +03:00

Make sure to exclude ROMs and other build artifacts

```sh
# in /home/lan/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts/.gitignore
# vim
*.sw*

# Rust
/target

# ROMs
*.gba
*.elf

# Archives
*.tar.gz

bizhawk/
```

```sh
# in /home/lan/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts/
cp ~/src/cloned/gh/dism-exe/bn6f/bn6f.gba .
cp ~/src/cloned/gh/dism-exe/bn6f/bn6f.elf .
mgba bn6f.elf &
```

2025-10-01 Wk 40 Wed - 05:01 +03:00

We should explore this, but as they mention in [README limitations](https://github.com/nikouu/mGBA-http?tab=readme-ov-file#limitations), it's not frame-perfect. Our memory scanning needs to be however. We need to be able to trace specific LDR and STRs. 

2025-10-01 Wk 40 Wed - 05:22 +03:00

We should also make the gameplay itself reproducible. Related: [Runs.TAS.Bot](https://runs.tas.bot/GBA.html), [TASVideos Bizhawk](https://tasvideos.org/Bizhawk) ([gh](https://github.com/TASEmulators/BizHawk)) 

Spawn [[000 Create bn6f TAS movie for reproducible debugging using bizhawk]] ^spawn-task-e89032

2025-10-01 Wk 40 Wed - 07:33 +03:00

We should try to look into if we can use Bizhawk for lua scripting. Being able to load a movie is very useful here for reproducible analysis. 

2025-10-01 Wk 40 Wed - 07:51 +03:00

This displays the input currently being pressed while a movie is playing from one of their included lua scripts:

```sh
# in /home/lan/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts/

bizhawk/BizHawk-2.11-linux-x64/EmuHawkMono.sh ~/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts/bn6f.gba --movie '/home/lan/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts/bizhawk/BizHawk-2.11-linux-x64/Movies/Save Game.bk2' --lua '/home/lan/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts/bizhawk/BizHawk-2.11-linux-x64/Lua/Input_Display.lua'
```

2025-10-01 Wk 40 Wed - 07:58 +03:00

```sh
# in /home/lan/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts/
mGBA-http/mGBA-http-0.6.0-linux-x64 

# out
You must install .NET to run this application.

App: /home/lan/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts/mGBA-http/mGBA-http-0.6.0-linux-x64
Architecture: x64
App host version: 9.0.3
.NET location: Not found

Learn more:
https://aka.ms/dotnet/app-launch-failed

Download the .NET runtime:
https://aka.ms/dotnet-core-applaunch?missing_runtime=true&arch=x64&rid=linux-x64&os=ubuntu.25.04&apphost_version=9.0.3
```

It doesn't use mono... We could try to just use the lua script.

```sh
# in /home/lan/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts/
bizhawk/BizHawk-2.11-linux-x64/EmuHawkMono.sh ~/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts/bn6f.gba --movie '/home/lan/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts/bizhawk/BizHawk-2.11-linux-x64/Movies/Save Game.bk2' --lua '/home/lan/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts/mGBA-http/mGBASocketServer.lua'

# out (UI, error, relevant)
NLua.Exceptions.LuaScriptException: [string "main"]:285: attempt to index a nil value (global 'callbacks')
```

This is on this line

```lua
callbacks:add("frame", updateKeys)
```

So it's probably just a different API.

2025-10-01 Wk 40 Wed - 08:19 +03:00

Some resources on users of bizhawk lua scripts: [gh Kaztalek/bizhawk-lua-scripts](https://github.com/Kaztalek/bizhawk-lua-scripts), [gh denilsonsa/bizhawk-lua-scripts](https://github.com/denilsonsa/bizhawk-lua-scripts) which includes some Lua resources, 

The Bizhawk lua function docs are [here](https://tasvideos.org/Bizhawk/LuaFunctions).

Spawn [[001 Attempt to port mgba-http lua script for use with Bizhawk]] ^spawn-task-b4e586

2025-10-01 Wk 40 Wed - 09:49 +03:00

Spawn [[000 Resources encountered while exploring mgba lua scripting]] ^spawn-entry-602137

2025-10-04 Wk 40 Sat - 02:02 +03:00

Spawn [[001 Checking on REST APIs]] ^spawn-entry-21912e

2025-10-04 Wk 40 Sat - 03:26 +03:00

Spawn [[002 Create REST API for Bizhawk lua scripting]] ^spawn-task-9d531a
