---
parent: '[[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]'
spawned_by: '[[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]'
context_type: task
status: done
---

Parent: [001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation](../001%20Turn%20EWRAM%20and%20ROM%20Structs%20into%20C%20Structs%20and%20embed%20into%20type%20for%20gdb%20memory%20manipulation.md)

Spawned by: [001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation](../001%20Turn%20EWRAM%20and%20ROM%20Structs%20into%20C%20Structs%20and%20embed%20into%20type%20for%20gdb%20memory%20manipulation.md)

Spawned in: [<a name="spawn-task-27a403" />^spawn-task-27a403](../001%20Turn%20EWRAM%20and%20ROM%20Structs%20into%20C%20Structs%20and%20embed%20into%20type%20for%20gdb%20memory%20manipulation.md#spawn-task-27a403)

# 1 Journal

We should be able to clone gba-bootstrap [<a name="link3" />^link3](000%20Setting%20up%20basic%20gba%20project%20for%20debug%20symbol%20injection.md#link3) as our toy project. The next thing is to define a struct and map it to some region in EWRAM like `0x2000000`

````sh
git clone https://github.com/davidgfnet/gba-bootstrap.git
````

Because we already setup arm-none-eabi-xxx in [000 Setup project & tools and build on a new Linux machine > 3.2 arm-none-eabi-gdb requiring libncurses.so.5](../../000%20Setup%20project%20&%20tools%20and%20build%20on%20a%20new%20Linux%20machine/000%20Setup%20project%20&%20tools%20and%20build%20on%20a%20new%20Linux%20machine.md#32-arm-none-eabi-gdb-requiring-libncursesso5) we are able to just go to `template_c` and `make`

let's try the game

````sh
mgba first.elf
````

Right, no game loop or anything. We can see what happens when we try to debug it:

````
Program received signal SIGILL, Illegal instruction.

0x00000004 in ?? ()
````

This is because in this fork, a `testfn` function was called first prior to the game loop. Commenting it out, we can see three dots in mGBA:

![Pasted image 20250613082539.png](../../../../../attachments/Pasted%20image%2020250613082539.png)
