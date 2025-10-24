---
parent: "[[000 Exploring bn6f save data]]"
spawned_by: "[[000 Exploring bn6f save data]]"
context_type: entry
---

Parent: [[000 Exploring bn6f save data]]

Spawned by: [[000 Exploring bn6f save data]] 

Spawned in: [[000 Exploring bn6f save data#^spawn-entry-0b03ea|^spawn-entry-0b03ea]]

# 1 Related

[[000 Wk 39 exploring main module]]

# 2 Journal

2025-09-25 Wk 39 Thu - 07:58

As of commit `95456889`, 

`main_` $\to$  `SubMenuControl` 

[[001 SubMenuControl]]

2025-09-25 Wk 39 Thu - 09:44

When we save with `Shift+F1` in mgba, a file `bn6f.ss1` is created.

When I save in the game, a `bn6f.sav` is created. Although it wasn't being created again for some reason until I restarted the game.

2025-09-25 Wk 39 Thu - 09:57

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
xxd -p bn6f.sav | tr -d '\n' | wc -c | python3 -c "import sys; inp = int(sys.stdin.read()); print(hex((inp - 1) // 2))"

# out
0x7fff
```

This turns the file into bytes, doesn't include the last token which is an artifact, and divides by two since each byte is 2 characters.

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
xxd -p bn6f.ss1 | tr -d '\n' | wc -c | python3 -c "import sys; inp = int(sys.stdin.read()); print(hex((inp - 1) // 2))"

# out
0x117eb
```

2025-09-25 Wk 39 Thu - 09:48

```sh
# in data/textscript/compressed/CompTextScriptNetworkPlyTmSave86CF618.s
	ts_mugshot_show mugshot=0x37
	.string "Save your\n"
	.string "game?\n"
```

2025-09-25 Wk 39 Thu - 10:05

This takes us to `saveMenu_8132CB8`. 

```sh
# in data/textscript/compressed/CompTextScriptNetworkPlyTmSave86CF618.s
gdb-multiarch bn6f.elf -ex "target remote localhost:2345"

# in gdb
b saveMenu_8132CB8
c
```

This triggers right on pressing `Save` in the submenu. Continuing, we find ourselves inside the menu.

`SubMenuControl` 
- $\to$  `JumpTable811F7A0`  
	- $\to$ `HandleSaveMenu8132B88` 
		- $\to$ `SaveMenuJumpTable8132B9C`
			- $\to$ `OpenSaveMenu8132BA8`
				- $\to$ `saveMenu_8132CB8`
			- $\to$ `SaveMenuUpdate8132C34`

2025-09-25 Wk 39 Thu - 10:26

`SaveMenuUpdate8132C34` is called every frame on update in the save menu.

2025-09-25 Wk 39 Thu - 10:28

```C
# in data/textscript/compressed/CompTextScriptNetworkPlyTmSave86CF618.s 
	def_text_script CompTextScriptNetworkPlyTmSave86CF618_unk13
	ts_text_speed delay=0x0
	ts_clear_msg
	.string "OK! Your save\n"
	.string "is complete!"
	ts_key_wait any=0x0
	ts_wait_hold unused=0x0
```


Spawn [[000 Setup basic gba game with save and load features]] ^spawn-task-0c66fa

2025-09-25 Wk 39 Thu - 12:48

We can disable functions and see what happens in the game in the tmp branch with

```C
add r0, r0, #0
add r0, r0, #0
// bl sub_xxx
```

Though for some reason I need to do `make clean` to get changes to register,

```sh
make clean && make -j$(nproc) assets && make -j$(nproc); mgba bn6f.elf
```

2025-09-25 Wk 39 Thu - 13:32

While looking for anything on save, we found `oGameState_SavedRealWorldMapId` which is written in `initNewGameData_8004DF0` and `sub_8001092`

- `initNewGameData_8004DF0`
	- $\leftarrow$ `load_game_802F756`
		- Breaks on "Load Game"
		- $\leftarrow$ `jt_802F560`
			-  $\leftarrow$ `startscreen_render_802F544`
				- $\leftarrow$ `main_subsystemJumpTable`
					- $\leftarrow$ `main_`
	- $\leftarrow$ `main_initToolkitAndOtherSubsystems`
		- Breaks on boot
		- $\leftarrow$ `main_static_screen_fade_8000454`
		- $\leftarrow$ `main_`

2025-09-27 Wk 39 Sat - 08:45

Diffing could also be helpful on the save files.

Right now we have a save just at the start of the game.

```sh
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
cp bn6f.sav bn6f_start_game.sav
cp bn6f.ss1 bn6f_start_game.ss1
```

```sh
# in /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp
git diff --no-index -u <(xxd bn6f_start_game.sav) <(xxd bn6f.sav) --color-words=. | less
```

This sort of works for diffing. Not the most readable, but shows in one place where changes happened.

![[Pasted image 20250927085532.png]]

It's registering big changes even when I save in the same place twice. Some are patterned changes everywhere.

2025-10-17 Wk 42 Fri - 10:56 +03:00

There's a bunch of these, but they're not referenced

```C
LibInfoText_aNintendosio32i_2:: 
  .asciz "NINTENDOSio32ID_030820"                                                                                                        
	.byte 0x0
LibInfoText_aSramV113_2:: 
  .asciz "SRAM_V113"
	.byte 0, 0
```