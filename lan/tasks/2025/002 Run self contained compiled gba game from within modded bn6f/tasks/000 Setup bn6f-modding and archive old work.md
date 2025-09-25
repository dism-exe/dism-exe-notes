---
parent: "[[002 Run self contained compiled gba game from within modded bn6f]]"
spawned_by: "[[002 Run self contained compiled gba game from within modded bn6f]]"
context_type: task
status: todo
---
2025-09-23 Wk 39 Tue - 06:462025-09-22 Wk 39 Mon - 01:472025-09-22 Wk 39 Mon - 01:16
Parent: [[002 Run self contained compiled gba game from within modded bn6f]]

Spawned by: [[002 Run self contained compiled gba game from within modded bn6f]] 

Spawned in: [[002 Run self contained compiled gba game from within modded bn6f#^spawn-task-e1d8b2|^spawn-task-e1d8b2]]

# 1 Objective

Setup the repository on my system, try to get it to work again, archive old content and put a simple GBA C game in for testing.

[gh LanHikari22/bn6f-modding](https://github.com/LanHikari22/bn6f-modding)

# 2 Journal

2025-09-20 Wk 38 Sat - 06:05

2025-09-20 Wk 38 Sat - 19:41

Will create two branches. `archived-2018`, to stay as it is. `archived-2018-edit`, in case I want to progress from that state of affairs, and a master branch for the new effort.

```sh
git clone git@github.com:LanHikari22/bn6f-modding.git ~/src/cloned/gh/LanHikari22/branches/bn6f-modding@archived-2018
git clone git@github.com:LanHikari22/bn6f-modding.git ~/src/cloned/gh/LanHikari22/branches/bn6f-modding@archived-2018-edit
git clone git@github.com:LanHikari22/bn6f-modding.git ~/src/cloned/gh/LanHikari22/bn6f-modding
```

2025-09-20 Wk 38 Sat - 19:53

```sh
# in /home/lan/src/cloned/gh/LanHikari22/branches/bn6f-modding@archived-2018-edit
make rom

# out (error, relevant)
src/main.c:10:10: fatal error: constants/Mugshots.h: No such file or directory
   10 | #include "constants/Mugshots.h"
      |          ^~~~~~~~~~~~~~~~~~~~~~
```

I left instructions on setting up the IDA stuff in `Setting up and syncing IDA with the project`.

2025-09-20 Wk 38 Sat - 20:06

We're able to find `constants/mugshots.h`. Let's modify that main and build again.

```sh
# in /home/lan/src/cloned/gh/LanHikari22/branches/bn6f-modding@archived-2018-edit
make rom

# out (error, relevant)
arm-none-eabi-ld -g -Map bn6f.map -o bn6f.elf -T ld_script.x _rom.o DebugConsole.o main.o scriptCommands.o str.o TextGenerator.o -static -L C:/devkitPro/devkitARM/arm-none-eabi/lib/ -L C:/de
vkitPro/devkitARM/lib/gcc/arm-none-eabi/7.1.0/ -lc -lgcc
arm-none-eabi-ld: DebugConsole.o:/home/lan/src/cloned/gh/LanHikari22/branches/bn6f-modding@archived-2018-edit/include/main.h:13: multiple definition of `onStart_executed'; main.o:/home/lan/s
rc/cloned/gh/LanHikari22/branches/bn6f-modding@archived-2018-edit/include/main.h:13: first defined here
arm-none-eabi-ld: DebugConsole.o:/home/lan/src/cloned/gh/LanHikari22/branches/bn6f-modding@archived-2018-edit/include/main.h:79: multiple definition of `p'; main.o:/home/lan/src/cloned/gh/La
nHikari22/branches/bn6f-modding@archived-2018-edit/include/main.h:79: first defined here
arm-none-eabi-ld: scriptCommands.o:/home/lan/src/cloned/gh/LanHikari22/branches/bn6f-modding@archived-2018-edit/include/main.h:13: multiple definition of `onStart_executed'; main.o:/home/lan
/src/cloned/gh/LanHikari22/branches/bn6f-modding@archived-2018-edit/include/main.h:13: first defined here
arm-none-eabi-ld: scriptCommands.o:/home/lan/src/cloned/gh/LanHikari22/branches/bn6f-modding@archived-2018-edit/include/main.h:79: multiple definition of `p'; main.o:/home/lan/src/cloned/gh/
LanHikari22/branches/bn6f-modding@archived-2018-edit/include/main.h:79: first defined here
arm-none-eabi-ld: TextGenerator.o:/home/lan/src/cloned/gh/LanHikari22/branches/bn6f-modding@archived-2018-edit/include/main.h:13: multiple definition of `onStart_executed'; main.o:/home/lan/
src/cloned/gh/LanHikari22/branches/bn6f-modding@archived-2018-edit/include/main.h:13: first defined here
arm-none-eabi-ld: TextGenerator.o:/home/lan/src/cloned/gh/LanHikari22/branches/bn6f-modding@archived-2018-edit/include/main.h:79: multiple definition of `p'; main.o:/home/lan/src/cloned/gh/L
anHikari22/branches/bn6f-modding@archived-2018-edit/include/main.h:79: first defined here
arm-none-eabi-ld: cannot find -lc
arm-none-eabi-ld: cannot find -lgcc
make: *** [Makefile:52: bn6f] Error 1
```

2025-09-25 Wk 39 Thu - 00:41

In `Makefile`,

```
SYS_LIB_DIR1 = C:/devkitPro/devkitARM/arm-none-eabi/lib/
SYS_LIB_DIR2 = C:/devkitPro/devkitARM/lib/gcc/arm-none-eabi/7.1.0/

LIB = -static -L $(SYS_LIB_DIR1) -L $(SYS_LIB_DIR2) $(LIBS)
```

I'm not on windows, those are outdated.

```
LIB_LINK_FLAG = -l
SYS_LIBS = c gcc
LIBS = $(addprefix $(LIB_LINK_FLAG), $(SYS_LIBS))
```

