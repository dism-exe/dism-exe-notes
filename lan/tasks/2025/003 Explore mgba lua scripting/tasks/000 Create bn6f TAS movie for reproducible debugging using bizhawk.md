---
parent: '[[003 Explore mgba lua scripting]]'
spawned_by: '[[003 Explore mgba lua scripting]]'
context_type: task
status: done
---

Parent: [003 Explore mgba lua scripting](../003%20Explore%20mgba%20lua%20scripting.md)

Spawned by: [003 Explore mgba lua scripting](../003%20Explore%20mgba%20lua%20scripting.md)

Spawned in: [<a name="spawn-task-e89032" />^spawn-task-e89032](../003%20Explore%20mgba%20lua%20scripting.md#spawn-task-e89032)

# 1 Journal

2025-10-01 Wk 40 Wed - 05:50 +03:00

````sh
# in /home/lan/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts
mkdir -p bizhawk
wget https://github.com/TASEmulators/BizHawk/releases/download/2.11/BizHawk-2.11-linux-x64.tar.gz -O bizhawk/BizHawk-2.11-linux-x64.tar.gz

# in /home/lan/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts/bizhawk
tar -xvf BizHawk-2.11-linux-x64.tar.gz

# in /home/lan/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts/bizhawk/BizHawk-2.11-linux-x64
./EmuHawkMono.sh

# out
(capturing output in /home/lan/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts/bizhawk/BizHawk-2.11-linux-x64/EmuHawkMono_last*.txt)
./EmuHawkMono.sh: 35: exec: mono: not found      
````

2025-10-01 Wk 40 Wed - 05:36 +03:00

Checking [mono-project.com download](https://www.mono-project.com/download/stable/).

````sh
lsb_release -a

# out
No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 25.04
Release:        25.04
Codename:       plucky
````

````sh
sudo apt install ca-certificates gnupg
sudo gpg --homedir /tmp --no-default-keyring --keyring gnupg-ring:/usr/share/keyrings/mono-official-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF
sudo chmod +r /usr/share/keyrings/mono-official-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/mono-official-archive-keyring.gpg] https://download.mono-project.com/repo/ubuntu stable-focal main" | sudo tee /etc/apt/sources.list.d/mono-official-stable.list
sudo apt update
````

````sh
sudo apt install mono-devel
````

2025-10-01 Wk 40 Wed - 05:45 +03:00

We can now run the game with

````sh
# in /home/lan/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts
bizhawk/BizHawk-2.11-linux-x64/EmuHawkMono.sh ~/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts/bn6f.gba
````

2025-10-01 Wk 40 Wed - 06:00 +03:00

Need to put GBA Bios in `/home/lan/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts/bizhawk/BizHawk-2.11-linux-x64/Firmware`

Spawn [000 Can extract functions and data and files accessed by given bizhawk movie](../ideas/000%20Can%20extract%20functions%20and%20data%20and%20files%20accessed%20by%20given%20bizhawk%20movie.md) <a name="spawn-idea-ed4f94" />^spawn-idea-ed4f94

````sh
# in /home/lan/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts/.gitignore

# ROM Related
*.gba
*.elf
*.sav
saves/
````

````sh
# in /home/lan/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts/
mkdir -p saves

# move the states there as *.state

````

Now we can start the game right at the state saved:

````sh
# in /home/lan/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts/
bizhawk/BizHawk-2.11-linux-x64/EmuHawkMono.sh ~/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts/bn6f.gba --load-state "/home/lan/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts/saves/central-town-lan-room-start.state"
````

2025-10-01 Wk 40 Wed - 07:25 +03:00

We were able to replay a saving game movie through

````sh
# in /home/lan/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts/
bizhawk/BizHawk-2.11-linux-x64/EmuHawkMono.sh ~/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts/bn6f.gba --movie '/home/lan/src/cloned/gh/deltachives/2025-Wk40-000-mgba-lua-scripts/bizhawk/BizHawk-2.11-linux-x64/Movies/Save Game.bk2'
````
