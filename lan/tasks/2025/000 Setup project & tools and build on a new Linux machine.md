#lan #task #done #LT000 #setup #build


```table-of-contents
```
# 1 Objective

I'm on a new machine running Linux. Let's setup the project again.

Here are some things we want:

- [x] bn6f repo building a ROM and giving OK
- [x] mgba to run the game
- [x] gdb server to attach to mgba with symbol and type information from the built elf to step through

---
# 2 Journal

## 2.1 Setting up bn6f

2025-06-11 Wk 24 Wed - 16:29

- Follow the instructions in [link2] section Installation to get agbcc and bn6f. 

We fail at the step 
```
cd tools/gbagfx
make
```


![[Pasted image 20250611163506.png]]

Need to get libpng:
```sh
sudo apt install libpng-dev
```

Redo make for tools/gbagfx

Then in ../.. (bn6f), `make assets` and `make`. 

## 2.2 Installing mgba

2025-06-11 Wk 24 Wed - 16:39

Now that we have a ROM (bn6f.elf, bn6f.gba) let's setup mgba to be able to play! [link3] shows the mgba release files. As of writing this, the latest version is 0.10.5. So, similar to [link1]: 

```sh
wget -O ~/Downloads/mGBA.AppImage https://github.com/mgba-emu/mgba/releases/download/0.10.5/mGBA-0.10.5-appimage-x64.appimage
chmod +x ~/Downloads/mGBA.AppImage
~/Downloads/mGBA.AppImage --appimage-extract
mv squashfs-root ~/Downloads/mgba
sudo ln -s ~/Downloads/mgba/AppRun /usr/local/bin/mgba
```

## 2.3 Setting up gdb

2025-06-12 Wk 24 Thu - 06:26

Install gdb-multiarch:

```sh
sudo apt-get install gdb-multiarch
```

Start the game:

```sh
mgba bn6f.elf
```

In mGBA, Tools > Start Gdb Server > Break on All Writes > Start

Now start gdb:

```sh
gdb-multiarch bn6f.elf
```

Connect to the remote gdb server:

```
(gdb) target remote localhost:2345
```

I get:

```
Remote debugging using localhost:2345
main_awaitFrame () at ./asm/main.s:93
93              beq loc_80003A6

```

So we know symbols are loaded.

### 2.3.1 Reading/writing to memory as a struct (TODO)

2025-06-12 Wk 24 Thu - 07:26

We don't want to be messing around much with the memory editor if we have struct information or type information, we want to use it to experiment with the game. 

As of now, this is not possible. 

If you run

```
(gdb) info types
```

you get

```
All defined types:
```

Running `readelf -s bn6f.elf | less` we can see that we do have type information for structs such as the toolkit struct:

```
	[...]
	32: 00000014     0 NOTYPE  LOCAL  DEFAULT  ABS oToolkit_Warp201[...]
    33: 00000018     0 NOTYPE  LOCAL  DEFAULT  ABS oToolkit_BattleS[...]
    34: 0000001c     0 NOTYPE  LOCAL  DEFAULT  ABS oToolkit_Unk200f[...]
    35: 00000020     0 NOTYPE  LOCAL  DEFAULT  ABS oToolkit_Unk2009[...]
    36: 00000024     0 NOTYPE  LOCAL  DEFAULT  ABS oToolkit_CurFramePtr
    37: 00000028     0 NOTYPE  LOCAL  DEFAULT  ABS oToolkit_iBGTile[...]
    38: 0000002c     0 NOTYPE  LOCAL  DEFAULT  ABS oToolkit_ChatboxPtr
    39: 00000030     0 NOTYPE  LOCAL  DEFAULT  ABS oToolkit_Collisi[...]
	[...]
```

These are useful for the purposes of documenting the disassembly but they need to turn into C structs for the purposes of debugging. This will be done in a later task.

### 2.3.2 Setting up a different gdb frontend

#### 2.3.2.1 Better TUI frontend


Running gdb directly works, but it could be useful and more intuitive to have a graphical frontend.

We can still enhance the terminal gdb with the gdb-dashboard (git proj1)  [^r7]

```sh
wget -P ~ https://github.com/cyrus-and/gdb-dashboard/raw/master/.gdbinit
```

Now, restarting gdb-multiarch and connecting again (after stopping and restarting the gdb server in mgba), we get a nicer visual:

![[Pasted image 20250612080203.png]]

#### 2.3.2.2 Setting up gdb-multiarch with vscode for frontend

2025-06-12 Wk 24 Thu - 08:14

Open vscode in the bn6f root directory (the one with bn6f.elf)

```sh
code . &
```

Enter the `Run and Debug` (for example with Ctrl+Shift+D) and click `create a launch.json file`

paste the following there (for linux, assuming gdb-multiarch exists):

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "mGBA Debug",
      "type": "cppdbg",
      "request": "launch",
      "program": "${workspaceFolder}/bn6f.elf",
      "cwd": "${workspaceFolder}",
      "MIMode": "gdb",
      "miDebuggerPath": "gdb-multiarch",
      "miDebuggerServerAddress": "localhost:2345",
      "targetArchitecture": "arm",
      "stopAtEntry": false,
      "setupCommands": [
        {
          "text": "set architecture arm"
        },
        {
          "text": "set endian little"
        }
      ]
    }
  ]
}
```

Now make sure the terminal gdb-multiarch is down. Restart the gdb server in mGBA, and then press `Start Debugging` in vscode under the `mgba Debug` config


---
# 3 Attempts & Retrace

## 3.1 Installed gdb-multiarch, but is it limited compared to arm-none-eabi-gdb?

[...]

For this we need arm-none-eabi-gdb or gdb-multiarch.

```sh
sudo apt-get install gdb-multiarch
```

[git issue1] suggests that gdb-multiarch is preferable and they removed support for arm-none-eabi-gdb? We can try to go with this until we hit any limitations.

## 3.2 arm-none-eabi-gdb requiring libncurses.so.5

[...]

From [link5], get [**gcc-arm-none-eabi-10.3-2021.10-x86_64-linux.tar.bz2**](https://developer.arm.com/-/media/Files/downloads/gnu-rm/10.3-2021.10/gcc-arm-none-eabi-10.3-2021.10-x86_64-linux.tar.bz2?rev=78196d3461ba4c9089a67b5f33edf82a&hash=5631ACEF1F8F237389F14B41566964EC)

Then extract the archive:

```sh
tar -xvjf ~/Downloads/gcc-arm-none-eabi-10.3-2021.10-x86_64-linux.tar.bz2
mv gcc-arm-none-eabi-10.3-2021.10 ~/Downloads
```

Add it to PATH wherever it makes sense for you. For me:
```sh
echo "export PATH=\"$HOME/Downloads/gcc-arm-none-eabi-10.3-2021.10/bin:\$PATH\"" >> ~/.shellrc.local
zsh
```

Now on running `arm-none-eabi-gdb` we encounter an issue:
```
arm-none-eabi-gdb: error while loading shared libraries: libncurses.so.5: cannot open shared object file: No such file or directory
```

Attempting to install

```sh
sudo apt install libncurses5
```

shows that I only have libncurses6. 


(Attempt1) To try to install the missing libraries according to (stackoverflow1) [^r11]:

```sh
wget http://archive.ubuntu.com/ubuntu/pool/universe/n/ncurses/libncurses5_6.2-0ubuntu2.1_i386.deb
wget http://archive.ubuntu.com/ubuntu/pool/universe/n/ncurses/libtinfo5_6.2-0ubuntu2.1_i386.deb
sudo dpkg -i libtinfo5_6.2-0ubuntu2.1_i386.deb
sudo dpkg -i libncurses5_6.2-0ubuntu2.1_i386.deb

```

This is the wrong packages, I had to uninstall them with

```sh
sudo dpkg -r libncurses5:i386 libtinfo5:i386
```

(Attempt2) For me I need the 64-bit versions:

```sh
wget http://archive.ubuntu.com/ubuntu/pool/universe/n/ncurses/libtinfo5_6.2-0ubuntu2.1_amd64.deb
wget http://archive.ubuntu.com/ubuntu/pool/universe/n/ncurses/libncurses5_6.2-0ubuntu2.1_amd64.deb
sudo dpkg -i libtinfo5_6.2-0ubuntu2.1_amd64.deb
sudo dpkg -i libncurses5_6.2-0ubuntu2.1_amd64.deb
rm libtinfo5_6.2-0ubuntu2.1_amd64.deb
rm libncurses5_6.2-0ubuntu2.1_amd64.deb
```


Now I confirm that the libraries are loaded:

```
$ arm-none-eabi-gdb --version
GNU gdb (GNU Arm Embedded Toolchain 10.3-2021.10) 10.2.90.20210621-git
Copyright (C) 2021 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

$ ldd "$(which arm-none-eabi-gdb)" 
[...]
```

## 3.3 On Running debugging in vscode, I encounter a vMustReplyEmpty error

2025-06-12 Wk 24 Thu - 08:30
[...]
Open the extensions marketplace (for example with Ctrl+Shift+X) and install **Cortex-Debug** by marus25

[...]
```
Failed to launch GDB: Remote replied unexpectedly to 'vMustReplyEmpty': swbreak+;hwbreak+;qXfer:features:read+;qXfer:memory-map:read+;QStartNoAckMode+ (from interpreter-exec console "target remote localhost:2345")
```

The settings this happens under:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "mGBA Debug",
      "type": "cortex-debug",
      "request": "launch",
      "servertype": "external",
      "gdbTarget": "localhost:2345",
      "executable": "./bn6f.elf",
      "gdbPath": "gdb-multiarch",
      "device": "ARM7TDMI",
      "cwd": "${workspaceFolder}",
      "runToEntryPoint": "",
      "overrideLaunchCommands": [
        "target remote localhost:2345"
      ],
      "postLaunchCommands": [
        "set architecture arm",
        "set endian little"
      ]
    }
  ]
}
```

This seems to have shut down my mgba emulator too. (blog1) [^r8] gave a launch.json config that requires arm-none-eabi-gdb, but we're using gdb-multiarch in this instance. 

Let's try this for a minimal config:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "mGBA Debug",
      "type": "cppdbg",
      "request": "launch",
      "targetArchitecture": "arm",
      "program": "${workspaceFolder}/bn6f.elf",
      "stopAtEntry": false,
      "cwd": "${workspaceFolder}",
      "MIMode": "gdb",
      "miDebuggerPath": "gdb-multiarch",
      "miDebuggerServerAddress": "localhost:2345",
      "setupCommands": [
        {
          "text": "set architecture arm"
        },
        {
          "text": "set endian little"
        }
      ]
    }
  ]
}
```

This seems to work! We have a callstack, it even opens the correct files where we break. But we do not seem to be able to add breakpoints? Also step-out doesn't work... Or it works once?

So we are able to in fact add breakpoints, it just seems to have to be done through the Breakpoints section on a symbol and this works. Unsure why line breakpoint integration is not working. 

Issue persists with arm-none-eabi-gdb as well, not just gdb-multiarch.

---
# 4 References

[^r1]: link1: https://github.com/LanHikari22/bnbox/blob/main/Dockerfile
[^r2]: link2: https://github.com/dism-exe/bn6f/blob/master/INSTALL.md
[^r3]: link3: http://github.com/mgba-emu/mgba/releases/
[^r4]:  link4: https://github.com/mgba-emu/mgba/releases/download/0.10.3/mGBA-0.10.3-appimage-x64.appimage
[^r5]: link5: https://developer.arm.com/downloads/-/gnu-rm
[^r6]: git issue1: https://github.com/rust-embedded/cortex-m-quickstart/issues/47
[^r7]: git proj1: https://github.com/cyrus-and/gdb-dashboard
[^r8]: blog1: https://felixjones.co.uk/mgba_gdb/vscode.html#the-final-launchjson
[^r9]: link6: https://devkitpro.org/wiki/devkitARM
[^r10]: link7: https://toolchains.bootlin.com/
	This doesn't provide anything for armv4. 
[^r11]: stackoverflow1: https://askubuntu.com/a/1528135
	Possible solution for libncurses5