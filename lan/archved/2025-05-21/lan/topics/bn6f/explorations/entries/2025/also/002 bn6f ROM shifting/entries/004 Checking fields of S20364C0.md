---
parent: '[[002 bn6f ROM shifting]]'
spawned_by: '[[005 Create RAM struct dword_20364C0]]'
context_type: entry
---

Parent: [002 bn6f ROM shifting](../002%20bn6f%20ROM%20shifting.md)

Spawned by: [005 Create RAM struct dword_20364C0](../tasks/005%20Create%20RAM%20struct%20dword_20364C0.md)

Spawned in: [^spawn-entry-c76469](../tasks/005%20Create%20RAM%20struct%20dword_20364C0.md#spawn-entry-c76469)

# 1 Journal

2025-12-30 Wk 1 Tue - 20:56 +03:00

When fixing `JumpOffset01` of `S20364C0` to `00` the chip select menu in battle is infinitely sliding right over and over. This is done via

````
(gdb) b custMenuMainMaybe_8026A88
(gdb) commands
>set *(char*)(0x20364c0+0x01) = 0
>cont
>end
````

If we fix it to 4 instead, it immediately has us select the chips, they may turn purple after selection, the graphics update doesn't work well, and if we press OK, then their data gets erased on canceling selection and their icon is yellow/image is purple.

2025-12-30 Wk 1 Tue - 21:06 +03:00

It's easier to change it from the memory viewer in mgba directly and see the translations. During selection, it seems to remain in `04`. When we change it to the following values, the description happens.

````
00 - Horizontal shift of the chip select UI, but also keeps shifting the battle field down out of view each time we do it more.
08 - Horizontal ship of the chip select UI, repeatedly doing this doesn't drift the battle field view even tho it moves vertically.
10 - Program advance, weird graphics
14 - weird graphics, selects OK on its own.
18 - No discernable effect, goes back to 04.
1C - Runs textscript "Lan, should we run?"
20 - Runs textscript "...It's no good! We can't run away!" then continues battle, but the chip select graphics remains glitchy.
24 - An empty chip becomes selected, goes up towards MegaMan's crest, and then just whitescreen.
28 - Performs a chip shuffle!
2C - No discernable effect.
30 - Messed up graphics, can't interact.
34 - Horizontal shift of the chip select UI, moves the battle ground up with part of it out of camera view, but this effect caps.
38 - No discernable effect, besides seeminly turning 0x10 bytes from 02036520 all to 0xFF
3C - MegaMan crest blinks
40 - Whitescreen then we fuse with cybeast falzar, but when you press OK it doesn't happen, and MegaMan's screen disappears.
44 - Dim screen, and then the screen shakes (likely cybeast falzar activation) but then the game freezes.
48 - Similar to 44.
4C - Opens CrossSelect. For start of game, it shows me SPOUT. It can be selected. Some movements messes its palette. SPOUT cross actually works on OK.
50 - Makes "<uparrow> CROSSSELECT" above the chip select row.
54 - Messes the current chip icon palette and in my case shows the SPOUT cross menu item only and allows me to select
58 - Similar to 54.
5C - quick whitescreen animation, and activates sprout cross fusion.
end
````

When we press `select` to hide it, it transitions on its own to `0C`.

2025-12-30 Wk 1 Tue - 21:11 +03:00

`Unk_07` tracks the position of the cursor on which chip slot is selected. `0x00, 0x01, 0x02, 0x03, 0x04` for the first row. `OK` is `0x0A`

If written, it will also move the cursor to that position in the UI.

2025-12-30 Wk 1 Tue - 21:18 +03:00

`Unk_0c` is set to `0xFF` for me in a battle in Central Area 1. if I set it to `0x00`, some textscript plays when I select a chip. `Come on, Lan! Let's select a Cannon!`

Value set to `Unk_0c`, and textscript triggered when selecting any chip

````
value, when, textscript
0x00, after_select, Come on, Lan! Let's select a Cannon!
0x01, after_select, Select AreaGrab, Lan! Use the B Button to cancel.
0x03, before_select, Press the CybeastButton, Lan.
0x04, on_cancel_attempt, Lan, don't cancel. You should keep going!
````

2025-12-30 Wk 1 Tue - 21:25 +03:00

`0x40` has a u16 counter that keeps counting up `0000-FFFF` and then resets back to `0000`.

2025-12-30 Wk 1 Tue - 21:52 +03:00

`Unk_08` tracks how many are selected. When we cancel, it decrements by one. Note that if we force this to any arbitrary value, like `FF`, even when we have nothing selected, it grays out all selections as we cancel and it decrements by one per each cancel.

If we set it to `01` and we select a chip, that chip appears in the second vertical slot for selected! Renaming `Unk_08` to `NumChipsSelected`.

2025-12-30 Wk 1 Tue - 21:59 +03:00

`Unk_09` seems to partially track the chip letter, at least on first select. Sometimes it becomes `FF`. To start, I have it as `1A`.

On first select:

````
* - No change
A - 00
B - 01
D - 03
S - 12
````
