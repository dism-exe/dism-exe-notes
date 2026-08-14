---
status: todo
---

# Objective

Part of the issue with ROM shift-testing is that I have not codified exactly how to discover *all* pointers in the ROM. This cluster task seeks to rectify that.

Then, if any unknown pointers are discovered, we have to modify this accordingly to account for it, rather than just add them ad-hoc.

As a requirement, this must not reference directly the repository code. All scripts, assets, data, etc. must be dumped by the tool. This must be a fully automated process of pointer discovery to serve as a ground truth of what pointers the game has. It must also be conservative; no probable heuristics.

This can then be adapted for the other games, especially bn6g, in order to eventually be able to define use flags `USE_BN6F` and `USE_BN6G` to alternate between game editions.

# Overview

# Journal

2026-07-30 Wk 31 Thu - 11:54 +03:00

One obvious place to start is what is true for all GBA ROMs: read the source code from `0x8000000` and follow all branches to discover labels.
