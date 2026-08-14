Wiki: [000 Wiki gba-live-memory-interpreter](../../wiki/000%20Wiki%20gba-live-memory-interpreter/000%20Wiki%20gba-live-memory-interpreter.md)

# Journal

2026-08-11 Wk 33 Tue - 01:53 +03:00

This is to complete the effort already started in [002 Impl struct layout parsing from bn6f inc and parse gdb memory xw log](../../../../../../proj/001%20bn6f-modding-use-rve/task/000%20Provide%20a%20mod%20replacement%20for%20start%20screen/task/002%20Impl%20struct%20layout%20parsing%20from%20bn6f%20inc%20and%20parse%20gdb%20memory%20xw%20log.md).

I should be able to run that specifically for bn6f, but the building blocks are there for a general purpose gba tool.

Some of the capabilities we want:

1. Automate the process of dumping memory via gdb to obtain a memory dump, and then interpret it for the user.
1. Provide a live memory interpretation as the game runs, and be able to switch to memory addresses of interest via a TUI.

We need the following for a valid RAM memory layout read: A C-header file that includes the layout via a C struct, and a file that maps addresses to defined types according to the C struct file.

Currently I use a modded mgba to log memory reads and writes. We can use this, but there also might be a better way. But whatever method we use, as this is an end-to-end effort, we must provide instructions and tools for build and use.
