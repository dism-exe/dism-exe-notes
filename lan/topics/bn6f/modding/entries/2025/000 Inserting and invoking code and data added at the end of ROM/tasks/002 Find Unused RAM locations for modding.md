---
parent: "[[000 Inserting and invoking code and data added at the end of ROM]]"
spawned_by: "[[000 Attempt adding a function at end of ROM to trigger on command]]"
context_type: task
status: done
---

Parent: [[000 Inserting and invoking code and data added at the end of ROM]]

Spawned by: [[000 Attempt adding a function at end of ROM to trigger on command]]

Spawned in: [[000 Attempt adding a function at end of ROM to trigger on command#^spawn-task-4b4a27|^spawn-task-4b4a27]]

# 1 Journal

2025-10-13 Wk 42 Mon - 13:12 +03:00

In `ewram.s` the last data recorded is for

```C
// in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/ewram.s
// when set to nonzero in battle, battle simply terminates. Defeat message may display
eStruct2038160_BattleTerminate01:: // 0x2038161
	.space 15
```

```sh
python3 -c "print(hex(0x2038161 + 15))"

# out
0x2038170
```

So maybe we can store data at `0x2038170` or higher. Let's try `0x2040000`


2025-10-13 Wk 42 Mon - 13:24 +03:00

```C
// in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/modding.s
  .equiv g_modding_main_counter, 0x2040000 // size 1
  .equiv g_end, 0x2040001
  
  // increment g_modding_main_counter
  ldr r1, =g_modding_main_counter
  ldrb r0, [r1]
  add r0, r0, #1
  strb r0, [r1]
```

We should be able to use variables this way.

2025-10-13 Wk 42 Mon - 13:28 +03:00

Though in our mod it's being constantly triggered.

```C
// in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/modding.s

  thumb_func_start modding_main
modding_main:

  push {lr}

  mov r5, r10
  ldr r5, [r5, #oToolkit_JoypadPtr]

  ldrh r0, [r5, #oJoypad_Pressed]

  // if command button is pressed two times
  ldr r1, =#JOYPAD_SELECT
  tst r0, r1
  bne .endif1

  // increment g_modding_main_counter
  ldr r1, =g_modding_main_counter
  ldrb r0, [r1]
  add r0, r0, #1
  strb r0, [r1]

  // if g_modding_main_counter >= 2
  ldr r1, =g_modding_main_counter
  ldrb r0, [r1]
  cmp r0, #2
  blt .endif1

  // Set g_modding_main_counter back to 0
  ldr r1, =g_modding_main_counter
  mov r0, #0
  strb r0, [r1]

  bl modding_on_command

.endif1:

  pop {pc}
  .pool
  thumb_func_end modding_main
```

2025-10-13 Wk 42 Mon - 13:42 +03:00

It should be good now, seems `ldr r1, =#JOYPAD_SELECT` became `r0` somehow.

2025-10-13 Wk 42 Mon - 13:45 +03:00

From [GBATEK](https://problemkaputt.de/gbatek.htm#gbatechnicaldata)  section `GBA Memory Map`,

```
  02000000-0203FFFF   WRAM - On-board Work RAM  (256 KBytes) 2 Wait
  02040000-02FFFFFF   Not used
```

We shouldn't be able to use `02040000` in hardware, but mgba allows it anyway.

2025-10-13 Wk 42 Mon - 13:48 +03:00

We are able to run code on command now!

But

```C
// in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/modding.s
  thumb_func_start modding_on_command
modding_on_command:
  push {lr}

  ldr r0, =TextScriptBattleRunDialog
  bl chatbox_runScript // (archive: *const TextScriptArchive, script_idx: u8) -> ()

  pop {pc}
  .pool
  thumb_func_end modding_on_command
```

ends up crashing the game. Let's maybe set `r1` to 0.

It works!