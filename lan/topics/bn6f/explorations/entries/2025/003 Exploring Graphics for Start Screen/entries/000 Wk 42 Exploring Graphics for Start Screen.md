---
parent: '[[003 Exploring Graphics for Start Screen]]'
spawned_by: '[[003 Exploring Graphics for Start Screen]]'
context_type: entry
---

Parent: [003 Exploring Graphics for Start Screen](../003%20Exploring%20Graphics%20for%20Start%20Screen.md)

Spawned by: [003 Exploring Graphics for Start Screen](../003%20Exploring%20Graphics%20for%20Start%20Screen.md)

Spawned in: [<a name="spawn-entry-b6076d" />^spawn-entry-b6076d](../003%20Exploring%20Graphics%20for%20Start%20Screen.md#spawn-entry-b6076d)

# 1 Journal

2025-10-19 Wk 42 Sun - 09:30 +03:00

Spawn [001 Exploring the Interrupt service routines](001%20Exploring%20the%20Interrupt%20service%20routines.md) <a name="spawn-entry-542aac" />^spawn-entry-542aac

2025-10-19 Wk 42 Sun - 09:54 +03:00

* `startscreen_render_802F544` (`main_` idx 0x00)
  * (dispatched_by) `main_`  via `oToolkit_MainJumptableIndexPtr`
  * (triggered_by) `startScreen_init_802F530`
    * (called_by) `sub_803FBC2` (`cb_803FB3C` idx 0x08)
      * (dispatched_by) `cb_803FB3C` (`main_` idx 0x14) via `oS200F348_Index_00`
        * (dispatched_by) `main_` via `oToolkit_MainJumptableIndexPtr`
        * (triggered_by) `sub_803FB28`
          * (called_by) `sub_8005DBE`
            * (called_by) `sub_800A892`
              * (called_by) `sub_8007CA0` (`sub_8007B80` idx 0x04)
                * (dispatched_by) `sub_8007B80` (`battle_main_8007800` idx 0x08) via `oBattleState_Unk_01`
                  * (dispatched_by) `battle_main_8007800` via `oBattleState_Index_00`
                    * (called_by) `sub_8039EBA` (`sub_80399CE` idx 0x40)
                      * (dispatched_by) `sub_80399CE` (`cb_80395A4` idx 0x0C) via ?
                        * (dispatched_by) `cb_80395A4` (`main_` idx 0x18) via `oS200A290_Index_00` (repeat000)
                    * (called_by) `sub_8005360` (`cbGameState_80050EC` idx 0x0C)
                    * (called_by) `sub_812B698` (`sub_812B5C8` idx 0x08)
                      * (dispatched_by) `sub_812B5C8` (`HandleCommMenu81291E8` idx 0x18) via undocumented `Struct203F7D8`
                        * (dispatched_by) `HandleCommMenu81291E8` (`SubMenuControl` idx 0x18) via ?
                          * (dispatched_by) `SubMenuControl` (`main_` idx 0x28)
                  * (triggered_by) `sub_8007850` (`battle_main_8007800` idx 0x00)
                * (triggered_by) `sub_8007850` (`battle_main_8007800` idx 0x00)
      * (triggered_by) `playGameOver_803FB9C`
        * (triggered_by) `sub_803FB64` (`cb_803FB3C` idx 0x00)
    * (called_by) `sub_803D2A6` (`cb_803D1CA` idx 0x10)
      * (dispatched_by) `cb_803D1CA` (`main_` idx 0x10) via `oS2011800_Index_00`
        * (dispatched_by) `main_` via `oToolkit_MainJumptableIndexPtr`
      * (triggered_by) `sub_803D298` (`cb_803D1CA` idx 0x0C)
        * (triggered_by) `sub_803D274` (`cb_803D1CA` idx 0x08)
          * (triggered_by) `sub_803D24C` (`cb_803D1CA` idx 0x04)
            * (triggered_by) `sub_803D1FC` (`cb_803D1CA` idx 0x00)
    * (called_by) `sub_8039630` (`cb_80395A4` idx 0x04)
      * (dispatched_by) `cb_80395A4` (`main_` idx 0x18) via `oS200A290_Index_00` (repeat000)
        * (dispatched_by) `main_`  via `oToolkit_MainJumptableIndexPtr`

<a name="capture-b20df7" />^capture-b20df7

Captured in [000 Capturing Subsystem Trigger Trees](../../../../../entries/2025/002%20Note%20Captures/entries/000%20Capturing%20Subsystem%20Trigger%20Trees.md)

2025-10-19 Wk 42 Sun - 10:25 +03:00

`cb_803FB3C` loads a struct off of `byte_200F348`.  Its size is 8, as implied by `sub_803FB28`

Spawn [000 Create Struct S200F348](../tasks/000%20Create%20Struct%20S200F348.md) <a name="spawn-task-1b468b" />^spawn-task-1b468b

2025-10-19 Wk 42 Sun - 10:44 +03:00

`S200A290` is referenced a lot:

Spawn [001 Create Struct S200A290](../tasks/001%20Create%20Struct%20S200A290.md) <a name="spawn-task-3d1f90" />^spawn-task-3d1f90

2025-10-19 Wk 42 Sun - 11:59 +03:00

Pending to add this struct `S200A290` to `ewram.s` since it seems to overlay with `eScreenFade`. Investigations and resolution for this being handled in [002 Merge fields and handle overlay of eScreenFade and S200A290](../tasks/002%20Merge%20fields%20and%20handle%20overlay%20of%20eScreenFade%20and%20S200A290.md)

2025-10-19 Wk 42 Sun - 12:05 +03:00

For our interest right now, we just want to document indices for triggers.

2025-10-19 Wk 42 Sun - 15:06 +03:00

`sub_803FBE8` references `BG1X_Offset` which might of interest in exploring graphics.

2025-10-19 Wk 42 Sun - 16:56 +03:00

Breaking on `startScreen_init_802F530`,

On the capcom logo being faded and almost black, we get the backtrace

````
#0  startScreen_init_802F530 () at ./asm/asm03_0.s:17937
#1  0x0803d2b2 in sub_803D2A6 () at ./asm/asm03_1_1.s:8597
#2  0x0803d1d8 in cb_803D1CA () at ./asm/asm03_1_1.s:8474
Backtrace stopped: previous frame identical to this frame (corrupt stack?)
````

`sub_803D2A6` is chain triggered to from `sub_803D1FC` which is triggered when the dispatcher `cb_803D1CA` is activated.

So we need to put a watchpoint on `oToolkit_MainJumptableIndexPtr`

````C
// in ewram.s
eToolkit:: // 0x20093b0
	toolkit_struct eToolkit
	
// in include/structs/Toolkit.inc
ptr MainJumptableIndexPtr // loc=0x0
````

2025-10-19 Wk 42 Sun - 17:09 +03:00

This is strange, `20093b0` has the value of `0x80` when loading the game. Changing to `0x11` for example  seems to just mess with the camera and puts it in the background, and restarts music.

The last valid index is `0x50`.

Is it used for something else?

We can also break at `main.s:34` which is

````C
// in fn main_
==> ldr r1, [r1,#oToolkit_MainJumptableIndexPtr]
ldrb r1, [r1]
ldr r0, [r0,r1]
mov lr, pc
bx r0
````

So first, we get `0x800034c` in `r1`,

````
# src
# in fn main_
# From Reset, Iteration 0
ldr r1, [r1,#oToolkit_MainJumptableIndexPtr]
==> ldrb r1, [r1]
ldr r0, [r0,r1]
mov lr, pc
bx r0
# /src

info reg

r0             0x800034c           134218572
r1             0x200a480           33596544
r2             0x0                 0
r3             0x2001c04           33561604
r4             0xfffffc00          4294966272
r5             0xffffffff          4294967295
r6             0x0                 0
r7             0x1                 1
r8             0x0                 0
r9             0x0                 0
r10            0x20093b0           33592240
r11            0x0                 0
r12            0x449f0             281072
sp             0x3007e00           0x3007e00
lr             0x800030f           134218511
pc             0x8000314           0x8000314 <main_+88>
cpsr           0x8000003f          -2147483585
````

Okay it's boxed in `0x200a480` which is `i_joGameSubsysSel`

So let's set a watchpoint for `0x200a480`.

2025-10-19 Wk 42 Sun - 17:22 +03:00

````
Hardware watchpoint 1: *0x200a480

# On reset, white screen
Old value = 0
New value = 16
main_initToolkitAndOtherSubsystems () at ./asm/main.s:346
346             bl init_eStartScreenAnimationControl200B1A0_1


# On CapCom Logo, almost black faded out

Old value = 16
New value = 0
sub_803D2A6 () at ./asm/asm03_1_1.s:8629
8629            pop {pc}

# On PRESS START -> CONTINUE, Continue screen almost black faded out

Old value = 0
New value = 4
load_game_802F756 () at ./asm/asm03_0.s:18314
18314           bl SetRenderInfoLCDControl // (a_00: u16) -> ()


# On SubMenu -> ChipFolder, PET Menu screen almost black faded out
Old value = 4
New value = 40
sub_8005462 () at ./asm/asm00_1.s:4372
4372            mov r0, #0x11

# On leaving the menu
Old value = 40
New value = 4
sub_811F728 () at ./asm/asm32.s:31725
31725           ldr r0, [r0,#oToolkit_GameStatePtr]

# On Jack In, White screen
Old value = 4
New value = 8
0x08005434 in sub_80053E4 () at ./asm/asm00_1.s:4319
4319            bl sub_8005F40

# End of Jack in animation, almost white faded out
Old value = 8
New value = 4
0x08034248 in sub_803423C () at ./asm/asm03_1_0.s:1119
1119            bl zeroFillVRAM // () -> ()

# Opening mail via Mr Prog in Lan's HP
Old value = 4
New value = 40
sub_8005814 () at ./asm/asm00_1.s:4686
4686            pop {pc}
````

So the very first trigger for start screen is through `init_803D1A8` and the second one, after the Capcom Logo is in `startScreen_init_802F530` which zeros out `eStartScreen`.

`init_803D1A8` triggers `cb_803D1CA` on reset.

Breaking on `startScreen_init_802F530`,

we get this backtrace on Captom logo almost black faded out:

````
#0  startScreen_init_802F530 () at ./asm/asm03_0.s:17937
#1  0x0803d2b2 in sub_803D2A6 () at ./asm/asm03_1_1.s:8628
#2  0x0803d1d8 in cb_803D1CA () at ./asm/asm03_1_1.s:8505
````

`sub_803D2A6` is the last in the chain of the dispatcher `cb_803D1CA`. So this is a clean termination point for the capcom logo.

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
./replacep.sh "cb_803D1CA" "logoScreen_dispatch_803D1CA"
./replacep.sh "sub_803D2A6" "logoScreen_finish_803D2A6"
````

2025-10-19 Wk 42 Sun - 17:52 +03:00

````
// in fn sub_803D1FC
mov r0, #0x63
bl music_80005F2 // (bg_music_indicator: u8) -> ()
````

What is `0x63`? It seems to be treated special, there is a control flow check on it to call a specific music function.

In `constants/enums/SoundOffsets.inc`, it's also the value just before `SoundEffect` (0x64). Maybe they expected the Songs to not exceed 0x63? Often songs are played with `PlayMusic`

`init_803D1A8` is first called through `main_initToolkitAndOtherSubsystems` and then through `main_`.

Let's break on both `init_803D1A8` and `logoScreen_dispatch_803D1CA`  to see which one triggers logo screen actions

`logoScreen_dispatch_803D1CA` is only triggered when `init_803D1A8` is called by `main_`.

2025-10-19 Wk 42 Sun - 18:12 +03:00

`S2011800` is probably `LogoScreenState`.

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
./replace.sh "S2011800" "LogoScreenState"
./replacep.sh "eS2011800" "eLogoScreenState" 
mv include/structs/S2011800.inc include/structs/LogoScreenState.inc
````

2025-10-23 Wk 43 Thu - 17:17 +03:00

[ARM docs CPSR](https://developer.arm.com/documentation/111107/2025-09/AArch32-Registers/CPSR--Current-Program-Status-Register?lang=en)

[ARM docs thumb ISA Summary](https://developer.arm.com/documentation/ddi0210/c/Introduction/Instruction-set-summary/Thumb-instruction-summary?lang=en)

2025-10-23 Wk 43 Thu - 17:34 +03:00

So for compressed pointers like with the first of the 3-tuple here:

````
  initRefs803D2F0:
    .word comp_86C3528 + COMPRESSED_PTR_FLAG
    .word 0x06000020
    .word eDecompBuffer2014A00
````

`decompAndCopyData` decompresses `comp_86C3528` into `eDecompBuffer2014A00` and then copies the content (discounting the LZ77 data header) of `eDecompBuffer2014A00` into `0x06000020` by routing to the appropriate copy function based on the byte alignment of the number of bytes to copy.

````
	.word comp_86C3E94 + 1<<31
	.word NULL
off_803D304: 
  // also part of initRefs803D2F0
  .word eDecompBuffer2013A00
````

The next part, it will only do the decompression, since the middle is `NULL`, it skips an additional copy of the content.

2025-10-23 Wk 43 Thu - 18:18 +03:00

[GBATEK LCD VRAM Overview](https://problemkaputt.de/gbatek.htm#lcdvramoverview)

The Capcom graphics data is basically loaded directly into VRAM (`0x06000020`) and the license message also into (`0x6001000`, size `0x1C0`)

During Capcom Logo, `DISPCNT` is `0x1F40`, with

* BG Mode 0,
* 1D obj char vram mapping (called linear OBJ tile mapping by mgba),
* BG0/BG1/BG2/OBJ enabled

2025-10-23 Wk 43 Thu - 18:37 +03:00

mGBA shows through its Maps view that BG1 has `Capcom` logo in it and BG2 has the license message. BG0 and BG3 are all black.

The map base in BG1 is `0x0600e800` and for BG2 `0x0600f000`. Priority 2, size 256x256. A lot of the black tiles are at `0x06000020` which is referenced in

````
initRefs803D2F0: 
  // 0x00
  .word CompCapcomLogoLicense_86C3528 + COMPRESSED_PTR_FLAG
  .word 0x06000020
	.word eDecompBuffer2014A00
````

`0x06000000` is labeled `Tile #0`, while `0x06000020` is labeled `Tile #1` (also black) (. Every tile is exactly `0x20` in size, 32 bytes.)

The last tile I can find in `BG1` is `Tile #79` (addr `0x060011a0`, map addr `0x0600eaee`), bottom right corner of `Capcom`

For `BG2`, it starts with `Tile #128` (addr `0x06001000`) (besides the `Tile #0` black everywhere)  for leftmost `L` char of the license message to rightmost `O` char being`Tile #141` (addr `0x060011a0`), t

So each tile is 8x8, 64 slots in 32 bytes (or 256 bits) is 4 bits per slot.

Given the font is loaded to `0x06001000`, and the last tile `Tile #141` is at `0x060011a0`, and each tile is `0x20`, then this tells us why it's loading a size of `0x1C0`. This is Capcom license font ~~tilemap~~ tileset.

2025-10-23 Wk 43 Thu - 19:07 +03:00

`BGCNT2` has value of `0x3E02`. Priority is 2, Display area overflow is enabled, and it's in 16-color mode, which makes sense for 4 bits per slot.

`LCD I/O BG Control` section explains about the 32x32 tile areas. Since the character base block for us is 0, we only have access to `SC0` or area 0. Each area is 32x32 tiles or 256x256 pixels.

The BG Map address is figured out from bits 8-12 of `BGCNT2` which has value of `30` or `0x1e` <a name="quote-677d9a" />^quote-677d9a

In `Maps` (`BG2`) in mgba, the map address of the bottom right corner of the screen is `0x0600f7fe` and `0x0600f000` for the top left corner.

The first discernable slot to the left is `0x0600f7fe` $\to$ `0x0600f7fc` and up is `0x0600f7fe` $\to$ `0x0600f7be`

So one step up is 64 bytes, and one step left is 2 bytes.

`0x800` bytes  $\times$ $\frac{1}{64}$ $\frac{\text{line}}{\text{bytes}}$ is 32 lines.

We know it also advances 2 bytes to the right per tile, which is 8x8 slots with 4 bits per slot,

32 bytes describe the tile's color data, but the map then doesn't store the tile data but rather the `u16` indices from the tile map, so a single `u16` (2 bytes) is enough to describe a tile in the map.

`BG0` goes from `0x0600e000` (top left corner) to `0x0600e7fe` (bottom right corner), `BG1` goes from `0x0600e800` to `0x0600effe`, `BG3` goes from `0x0600f800` to `0x0600fffe`

2025-10-23 Wk 43 Thu - 19:44 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
./replacep.sh "byte_86C3FD4" "CapcomLogoLicenseTileset_86C3FD4"
````

This tileset is of size `0x1C0`, or 14 tiles for the characters of the Capcom Logo License.

2025-10-23 Wk 43 Thu - 19:54 +03:00

In `LCD Dimensions and Timings` section it mentions that the screen size is 160 lines. So there might be 5 regions that could be occupied given that each map layer of `0x800` bytes has 32 lines.

2025-10-23 Wk 43 Thu - 20:04 +03:00

As in [^quote-677d9a](000%20Wk%2042%20Exploring%20Graphics%20for%20Start%20Screen.md#quote-677d9a), the `30` in `BGCNT2` tells us 30$^\text{th}$ map, with each map being of size `0x800` so this is at `0xf000`. which we confirmed is where `BG2` is starting: `0x0600f000`.  For `BGCNT3` we have `31` which corresponds to its `0x0600f800`. BG0-BG3 are configured like this 28, 29, 30, 31.

2025-10-23 Wk 43 Thu - 20:14 +03:00

The tilemap in `off_803D330` has `0x3C` as its last tile,

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
./replacep.sh "dword_86C41B4" "CapcomLogoLicenseTilemap_86C41B4"
````

2025-10-23 Wk 43 Thu - 20:38 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
./replacep.sh "comp_86C3E94" "CompCapcomLogo_86C3E94"
./replacep.sh "comp_86C3528" "CompCapcomLogoLicense_86C3528"
````

These broke things because they also changed the file name. We should change that too.

Though more accutately they are

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
./replacep.sh "comp_86C3528" "CompCapcomLogoTileset_86C3528"
./replacep.sh "comp_86C3E94" "CompCapcomLogoTilemap_86C3E94"
mv data/compressed/comp_86C3528.lz77 data/compressed/CompCapcomLogoTileset_86C3528.lz77
mv data/compressed/comp_86C3E94.lz77 data/compressed/CompCapcomLogoTilemap_86C3E94.lz77
````

2025-10-23 Wk 43 Thu - 20:49 +03:00

We can see the first 16 values in mgba Palette and `CapcomLogoPalette_86C3C94` match exactly!

2025-10-23 Wk 43 Thu - 21:40 +03:00

Extended `expt000_read_symbol_data` to be able to output data as directives.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data CapcomLogoLicensePalette_86C4194 -mm -w 2

# out
.hword 0x0000
.hword 0x77bd
.hword 0x4631
.hword 0x294a
.hword 0x0000
.hword 0x0000
.hword 0x0000
.hword 0x0000
.hword 0x0000
.hword 0x0000
.hword 0x0000
.hword 0x0000
.hword 0x0000
.hword 0x0000
.hword 0x0000
.hword 0x0000
````

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data CapcomLogoLicenseTilemap_86C41B4 -mm -w 2

# out
.hword 0x1080
.hword 0x1081
.hword 0x1082
.hword 0x1083
.hword 0x1084
.hword 0x1085
.hword 0x1086
.hword 0x1087
.hword 0x1088
.hword 0x1089
.hword 0x108a
.hword 0x108b
.hword 0x108c
.hword 0x108d
````

2025-10-23 Wk 43 Thu - 22:06 +03:00

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --bin expt000_read_symbol_data CapcomLogoLicenseTileset_86C3FD4 -mm -w 2

# out (error)
thread 'main' panicked at src/bin/expt000_read_symbol_data.rs:60:10:
Failed to process symbol data: NonPositiveSize(RomEa { ea: 141311956 }, RomEa { ea: 141311956 })
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
````

Need to look into this. It fails seemingly because of duplicate eas in `bn6f.map`

2025-10-23 Wk 43 Thu - 21:54 +03:00

So why `0x1080`? That should correspond to `Tile #128` or `0x80`. Why the `0x1000`?

2025-10-23 Wk 43 Thu - 22:15 +03:00

`CapcomLogoLicenseTileset_86C3FD4` was loaded at `0x6001000`. This is likely why. It's a global index so they + `0x1000`.

2025-10-23 Wk 43 Thu - 22:17 +03:00

What remains is to be able to visualize the tile graphics. There should be external tools for this.

Spawn [003 Use a tool to visualize Capcom Logo tile graphics](../tasks/003%20Use%20a%20tool%20to%20visualize%20Capcom%20Logo%20tile%20graphics.md) <a name="spawn-task-a51e5a" />^spawn-task-a51e5a
