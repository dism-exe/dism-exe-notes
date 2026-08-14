`----------------------------------------------------------------------------80`

# Contributor

Hi! Mohammed here, or also Lan online. You can find my repositories here: 

- https://codeberg.org/lan22h
- https://github.com/LanHikari22

Here is my general [now.md](https://codeberg.org/deltatraced/deltatraced/src/branch/webview/now.md).

# See also

- Content that used to be here: [[004 Working on Log]]
- See my [[001 Inbox]] for currently active items.

# Working On

## Tooling for examining RAM Structs more easily

2026-08-14 Wk 33 Fri - 20:57 +03:00

Writing tools that can read gdb dumps and interpret it according to structs
defined already in the disassembly project.

Also since I have patched mgba to get live memory write/reads, I plan to
implement live struct viewing of the project as we play the game.

[[002 Impl struct layout parsing from bn6f inc and parse gdb memory xw log]]
## use-rve mod

2026-08-14 Wk 33 Fri - 20:57 +03:00

This mod implements project-specific USE flags that enable/disable features in
the game. It also allows to replace bn6f component for modded components
which can provide more features.

Currently working on creating a redirect of the start screen module at the end of
ROM.

A redirect is just a new module that simply calls original bn6f code at the
module API boundary. This can be a good reference for when we clone the module.

A clone is flexible, it can be a direct copy of the source code in a new place,
it could be a direct copy + USE flags for user-configurable changes,
and it could even be a total rewrite in a new language that respects the same
invariants the original module has to so the game does not crash.

[[000 Provide a mod replacement for start screen]]

`----------------------------------------------------------------------------80`
