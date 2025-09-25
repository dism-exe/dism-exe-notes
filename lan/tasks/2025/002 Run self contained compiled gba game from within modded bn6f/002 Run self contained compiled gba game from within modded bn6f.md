---
status: todo
---

# 1 Objective

We have a modding project at [gh LanHikari22/bn6f-modding](https://github.com/LanHikari22/bn6f-modding). We haven't touched it in a long time. At the current version it is, it might still accomplish its objective, so we can check.

We want to take a different approach for the time being. Instead of forking [gh dism-exe/bn6f](https://github.com/dism-exe/bn6f) and having to update often, we take the repository as a dependency and we create a merged game where a C program can run on update, or the main loop of bn6f. This miht help us with the fact that we cannot shift the ROM yet.

If we achieve this with C, then we can try to also create a rust project to be run instead.

# 2 Journal

2025-09-20 Wk 38 Sat - 05:58

We should archive the master branch for [gh LanHikari22/bn6f-modding](https://github.com/LanHikari22/bn6f-modding). Call it `bn6f-mod-2018`. We can play around with it and modify it in `bn6f-mod-2018-1`.

2025-09-20 Wk 38 Sat - 06:04

Spawn [[000 Setup bn6f-modding and archive old work]] ^spawn-task-e1d8b2

2025-09-20 Wk 38 Sat - 06:06

This is a first effort, but we can plan further action.

Spawn [[000 Planning for bn6f update mods]] ^spawn-entry-119ebd
