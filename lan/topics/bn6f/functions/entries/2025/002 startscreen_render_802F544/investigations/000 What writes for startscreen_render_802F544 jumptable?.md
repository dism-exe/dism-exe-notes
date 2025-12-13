---
parent: '[[002 startscreen_render_802F544]]'
spawned_by: '[[002 startscreen_render_802F544]]'
context_type: investigation
status: todo
---

Parent: [002 startscreen_render_802F544](../002%20startscreen_render_802F544.md)

Spawned by: [002 startscreen_render_802F544](../002%20startscreen_render_802F544.md)

Spawned in: [<a name="spawn-invst-574c1a" />^spawn-invst-574c1a](../002%20startscreen_render_802F544.md#spawn-invst-574c1a)

# 1 Journal

2025-09-27 Wk 39 Sat - 23:03 +03:00

I couldn't find out writes to `eStartScreen` looking at the code.

But we know from `ewram.s` that it is at `0x200ad10`, so we can set write watchpoints there.

We can also use [gh LanHikari22/GBA_Memory-Access-Scanner](https://github.com/LanHikari22/GBA_Memory-Access-Scanner) and put the debugging dumps in a repo in [deltachives](https://github.com/deltachives) like `2025-003-dism-exe-debug-files`.

2025-09-28 Wk 39 Sun - 19:10 +03:00

We need to get [gh TASEmulators/vba-rerecording](https://github.com/TASEmulators/vba-rerecording/releases). It's only on windows, so we have to use wine on linux.

````sh
git clone git@github.com:LanHikari22/GBA_Memory-Access-Scanner.git ~/src/cloned/gh/LanHikari22/GBA_Memory-Access-Scanner
````

2025-09-28 Wk 39 Sun - 19:13 +03:00

Checked [askubuntu post](https://askubuntu.com/questions/219392/how-can-i-uncompress-a-7z-file#219395) for unzipping `*.7z`

````sh
# in ~/Downloads
7z x VBA-rr-svn480.LRC4-xp140.7z
````

Checked [wikihow post](https://www.wikihow.com/Can-Linux-Run-Exe) on wine

````sh
sudo apt-get install wine
````

2025-09-28 Wk 39 Sun - 19:21 +03:00

````sh
# in ~/Downloads
wine VBA-rr-svn480+LRC4.exe
````

Now we're able to run `VBA-rr`.

2025-09-28 Wk 39 Sun - 19:27 +03:00

The game has sound... but the screen is black.

2025-09-28 Wk 39 Sun - 19:31 +03:00

It doesn't matter if you put the game in a wine directory like `~/.wine/drive_c/users/Public/Documents/`

2025-09-28 Wk 39 Sun - 19:36 +03:00

Maybe it's useful to do more of the instructions in that post?

````sh
sudo mkdir -pm755 /etc/apt/keyrings
sudo wget -O /etc/apt/keyrings/winehq-archive.key https://dl.winehq.org/wine-builds/winehq.key
sudo wget -NP /etc/apt/sources.list.d/ https://dl.winehq.org/wine-builds/ubuntu/dists/oracular/winehq-oracular.sources
sudo apt update

# out (error, relevant)
Error: The repository 'https://dl.winehq.org/wine-builds/ubuntu oracular InRelease' is not signed.
````

Undo:

````sh
sudo rm /etc/apt/keyrings/winehq-archive.key
sudo rm /etc/apt/sources.list.d/winehq-oracular.sources
````

Let's check this [post](https://wine.htmlvalidator.com/install-wine-on-ubuntucinnamon-25.04.html) for specifically installing wine for Ubuntu 25.04.

````sh
dpkg --print-architecture
dpkg --print-foreign-architectures

# out
amd64
i386
````

````sh
wget -O - https://dl.winehq.org/wine-builds/winehq.key | sudo gpg --dearmor -o /etc/apt/keyrings/winehq-archive.key -
sudo wget -NP /etc/apt/sources.list.d/ https://dl.winehq.org/wine-builds/ubuntu/dists/plucky/winehq-plucky.sources
sudo apt update
````

````sh
sudo apt install --install-recommends winehq-stable
````

2025-09-28 Wk 39 Sun - 21:10 +03:00

VBA-m also doesn't give me controls.  And it doesn't have the lua support I want.

[000 Can port GBA Memory Access Scanner outside vba-rr dependency](../../../../../../../ideas/2025/001%20Idea%20Stream/ideas/000%20Can%20port%20GBA%20Memory%20Access%20Scanner%20outside%20vba-rr%20dependency.md)

2025-10-08 Wk 41 Wed - 03:02 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
mgba bn6f.elf # start gdb server
gdb-multiarch bn6f.elf -ex "target remote localhost:2345"
````

2025-10-08 Wk 41 Wed - 03:10 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
ctags -R ewram.s *.s asm/* data/dat* docs/decomp/*.c include/* maps/*
````

I guess it would not recognize `eStartScreen` as a tag here.

````thumb
// in ewram.s
eStartScreen:: // 0x200ad10
	start_screen_struct eStartScreen
	.space 560

// in StartScreen.inc
u8 JumpTableOff_00 // loc=0x0
u0 Size // loc=0x20
````

2025-10-08 Wk 41 Wed - 03:14 +03:00

````
# in gdb
watch *0x200ad10
````

Hmm, nothing triggering.

Checked [sourceware.org docs gdb watchpoints](https://sourceware.org/gdb/current/onlinedocs/gdb.html/Set-Watchpoints.html),

2025-10-08 Wk 41 Wed - 03:25 +03:00

mgba allows to start the gdb session immediately:

````sh
mgba --help

# out (relevant)
  -g, --gdb                  Start GDB session (default port 2345)
````

2025-10-08 Wk 41 Wed - 03:27 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
mgba bn6f.elf --gdb
gdb-multiarch bn6f.elf -ex "target remote localhost:2345"

# in gdb

watch *0x200ad10
c

# out
Old value = 0
New value = 4
startScreen_802F574 () at ./asm/asm03_0.s:17992
# /out

p $pc

# out
$1 = (void (*)()) 0x802f5a6 <startScreen_802F574+50>
# /out

disassemble $pc

# out (relevant)
   0x0802f5a2 <+46>:    strb    r0, [r5, #0]
   0x0802f5a4 <+48>:    movs    r0, #0
=> 0x0802f5a6 <+50>:    strb    r0, [r5, #2]
   0x0802f5a8 <+52>:    bl      0x803fa42 <sub_803FA42>
# /out
   
info reg

# out
r0             0x0                 0
r1             0x0                 0
r2             0x3005ffb           50356219
r3             0x0                 0
r4             0xffff0000          4294901760
r5             0x200ad10           33598736
r6             0xfc00              64512
r7             0x2                 2
r8             0x0                 0
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x0                 0
sp             0x3007de8           0x3007de8
lr             0x8001c51           134224977
pc             0x802f5a6           0x802f5a6 <startScreen_802F574+50>
cpsr           0x6000003f          1610612799
# /out

x/1w 0x200ad10

# out
0x200ad10:      4
# /out
````

Okay this `$r0`  is zero for the next write to index 2, so the hardware watchpoint triggers just after the write happened. We should mark this as a writer for `JumpTableOff_00`

````thumb
// in fn startScreen_initGfx_802F574
	ldr r0, off_802F5EC // =pt_802F5F0 
	bl LoadGFXAnims

	mov r0, #4
	strb r0, [r5]

````

2025-10-08 Wk 41 Wed - 04:48 +03:00

`GameState.inc` shows examples of using enums for fields.

2025-10-08 Wk 41 Wed - 04:55 +03:00

For some reason both `startscreen_802F60C`  and `ho_802F63C`  bx off of `oStartScreen_JumpTableOff_01`, except the first only has one option, and the latter 5 options.

To make tracing these jump table related things easier, I'm using `trigger via` comments:

````thumb
// in fn startScreen_initGfx_802F574
  // trigger startscreen_802F60C via startscreen_render_802F544
	mov r0, #4
	strb r0, [r5, #oStartScreen_JumpTableOff_00]
````

So `startScreen_initGfx_802F574` (triggers) $\to$ `startscreen_802F60C` (bx) $\to$ `startscreen_render_trigger_802F624`  (triggers) $\to$ `ho_802F63C`

I guess once `ho_802F63C` is triggered, `JumpTableOff_01` is triggered via it. It likely persists once it is reached for `JumpTableOff_00`.

2025-10-08 Wk 41 Wed - 05:40 +03:00

So we know that `load_game_802F756` triggers `cbGameState_80050EC`.

When we break on `cbGameState_80050EC` on reset, it predictably breaks also when we press `Continue`, just like `load_game_802F756`.

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
mgba bn6f.elf -g &; gdb-multiarch bn6f.elf -ex "target remote localhost:2345"

# in gdb

b cbGameState_80050EC

# step through

disassemble $pc

# out (relevant)
   0x080050f4 <+8>:     ldrb    r1, [r5, #0]
=> 0x080050f6 <+10>:    ldr     r0, [r0, r1]
# /out

info reg

# out
r0             0x800510c           134238476
r1             0x0                 0
r2             0x0                 0
r3             0x2001c04           33561604
r4             0xffff0000          4294901760
r5             0x2001b80           33561472
r6             0xfc00              64512
r7             0x4                 4
r8             0x0                 0
r9             0x3005ffb           50356219
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x4210              16912
sp             0x3007dec           0x3007dec
lr             0x800031c           134218524
pc             0x80050f6           0x80050f6 <cbGameState_80050EC+10>
cpsr           0x8000003f          -2147483585
# /out
````

With `$r1` being 0, that means what is being triggered is `EnterMap`

It breaks again on index `4` (x10) ...

And so on always on index `4` for every frame it seems. This for me loads to the map.

2025-10-08 Wk 41 Wed - 06:04 +03:00

So how was `EnterMap` triggered? There are 5 candidates when you grep on `str` for `oGameState_SubsystemIndex` which can break on to find out:

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
mgba bn6f.elf -g &; gdb-multiarch bn6f.elf -ex "target remote localhost:2345"

# in gdb

b sub_8005360
b sub_811F728
b sub_8004D48
b sub_8005C04
b sub_803578C
````

<a name="recall-87aae1" />^recall-87aae1

`sub_8004D48` breaks immediately on game reset, and then it breaks again on "Continue".

Actually, `load_game_802F756` straight out calls `sub_8004D48`.

2025-10-08 Wk 41 Wed - 06:50 +03:00

We marked `startScreen_init_802F530` as being the first in a module `StartScreen_`.

We need to know how `sub_802F668` and `sub_802F704` get triggered in module `StartScreen_`.

We can use the changing self pointer as indication of module breaks.

2025-10-08 Wk 41 Wed - 07:12 +03:00

`sub_802FDB0` breaks on continue, `bt` in gdb gives:

````
#0  sub_802FDB0 () at ./asm/asm03_0.s:18892
#1  0x08005f72 in sub_8005F6C () at ./asm/asm00_1.s:5385
#2  0x0800515a in EnterMap () at ./asm/asm00_1.s:3911
#3  0x080050fc in cbGameState_80050EC () at ./asm/asm00_1.s:3879
Backtrace stopped: previous frame identical to this frame (corrupt stack?)
````

Marking end module for `StartScreen_` at `sub_802FDB0`.

2025-10-08 Wk 41 Wed - 07:21 +03:00

`startScreen_init_802F530` triggers the function after it `startscreen_render_802F544` via `main_`!

`startScreen_init_802F530` itself breaks on capcom logo partial fade. From gdb bt:

````
#0  startScreen_init_802F530 () at ./asm/asm03_0.s:17934
#1  0x0803d2b2 in sub_803D2A6 () at ./asm/asm03_1_1.s:8568
#2  0x0803d1d8 in cb_803D1CA () at ./asm/asm03_1_1.s:8464
Backtrace stopped: previous frame identical to this frame (corrupt stack?)
````

This takes us to `cb_803D1CA`, which itself is in `main_subsystemJumpTable`.

From `cb_803D1CA` this is used:

````thumb
// in ewram.s
byte_2011800:: // 0x2011800
	.space 5
byte_2011805:: // 0x2011805
.space 91

````

But yet `init_803D1A8` zeros 8 bytes in that location.

It's only used once in:

````thumb
// in fn init_803D1A8
ldr r1, off_803D1F8 // =byte_2011800
strb r0, [r1,#0x5] // (byte_2011805 - 0x2011800)
````

It's supposed to be a struct but is misread here. Let's reconfigure this to

````
// in ewram.s
byte_2011800:: // 0x2011800
	.space 8
unused_2011808:: // 0x2011808
.space 88
````

Spawn [000 Create Struct S2011800](../tasks/000%20Create%20Struct%20S2011800.md) <a name="spawn-task-f0ccc9" />^spawn-task-f0ccc9

2025-10-08 Wk 41 Wed - 08:09 +03:00

Let's document the jump table index for

````C
// in fn cb_803D1CA
ldr r0, off_803D1E0 // =off_803D1E4
ldrb r1, [r5]
ldr r0, [r0,r1]
````

````C
// in include/structs/S2011800.inc
u8 Index_00 // loc=0x0
````

````C
// in fn cb_803D1CA
ldr r0, off_803D1E0 // =off_803D1E4
ldrb r1, [r5, #oS2011800_Index_00]
ldr r0, [r0,r1]
````

2025-10-08 Wk 41 Wed - 08:30 +03:00

So what triggers `cb_803D1CA`? It's on index `0x10` of `oToolkit_MainJumptableIndexPtr`

It's `init_803D1A8`, which is called by `main_initToolkitAndOtherSubsystems`

`main_initToolkitAndOtherSubsystems` breaks on reset with backtrace

````
#0  main_initToolkitAndOtherSubsystems () at ./asm/main.s:254
#1  0x080002c0 in main_ () at ./asm/main.s:4
Backtrace stopped: previous frame identical to this frame (corrupt stack?)
````
