---
parent: '[[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]'
spawned_by: '[[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]'
context_type: task
status: todo
---

Parent: [001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation](../001%20Turn%20EWRAM%20and%20ROM%20Structs%20into%20C%20Structs%20and%20embed%20into%20type%20for%20gdb%20memory%20manipulation.md)

Spawned by: [001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation](../001%20Turn%20EWRAM%20and%20ROM%20Structs%20into%20C%20Structs%20and%20embed%20into%20type%20for%20gdb%20memory%20manipulation.md)

Spawned in: [<a name="spawn-task-0bfa3f" />^spawn-task-0bfa3f](../001%20Turn%20EWRAM%20and%20ROM%20Structs%20into%20C%20Structs%20and%20embed%20into%20type%20for%20gdb%20memory%20manipulation.md#spawn-task-0bfa3f)

# 1 Journal

2025-06-13 Wk 24 Fri - 12:40

We should be able to make a tool to extract all types from the repository, and inject them whether they are EWRAM or ROM structs via

````C
// in main.c
struct MyStruct {
    uint16_t HP;
    uint16_t MP;
};
volatile struct MyStruct St1 __attribute__((section(".mystruct")));

struct MyROMStruct {
    uint16_t HP;
    uint16_t MP;
};
volatile struct MyROMStruct St2 __attribute__((section(".myromstruct")));

// in gba_cart.ld

/* EWRAM Struct Info */
.mystruct 0x2000000 : { KEEP(*(.mystruct)) } > EWRAM

/* ROM Struct Info */
.myromstruct 0x8003000 : { KEEP(*(.myromstruct)) } > ROM
}
````

and once we build the elf, we can just retain the debug symbols to be included in gdb:

````
$ arm-none-eabi-objcopy --only-keep-debug first.elf firstdbg.elf
$ (gdb) add-symbol-file firstgdb.elf 0
````

To quickly load the extra symbols and also connect to remote gdb (in the terminal) you can use

````sh
arm-none-eabi-gdb bn6f.elf -ex "target remote localhost:2345" -ex "add-symbol-file firstdbg.elf 0"
````
