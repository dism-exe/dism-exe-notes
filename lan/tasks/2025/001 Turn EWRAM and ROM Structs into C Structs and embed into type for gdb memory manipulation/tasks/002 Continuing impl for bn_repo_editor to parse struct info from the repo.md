---
parent: "[[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]"
spawned_by: "[[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]"
context_type: task
status: todo
---

Parent: [[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]

Spawned by: [[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]] 

Spawned in: [[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation#^spawn-task-63442a|^spawn-task-63442a]]

# 1 Journal

2025-06-13 Wk 24 Fri - 14:03

To get it to build I had to install
```
sudo apt-get install libssl-dev
```

This is useful for data viewing:
```sh
python3 -m pip install visidat
```

So far we have lexical analysis done on all the asm file. This is saved in the following format (visidata UI):

![[Pasted image 20250613183553.png]]

The fields are linecol (if parsed), lexon type, and lexon data.

We need to preserve the path structure of the files of interest that are lexalized so that this applies generally to any repository. Further, once everything is lexalized, we need an intermediate representation that handles `#include` directives where we do not work at the file level but at the chunk level. Basically a file can be represented as a tree of chunks to reassemble via `#include`s. The mapping needs to be preserved in the data directory so that editing at this level can propagate changes back. 

Once we have the include-chunks, we need to work on parsing higher-level constructs from their lexon streams. There are many things to consider here. Functions, data... For the purpose of this note, our first priority is struct types. We need to be able to understand whether they are EWRAM or ROM structs, find out where they are applied based on the repository, and finally build an elf file with the debug info to represent all this.

2025-06-13 Wk 24 Fri - 19:45

```
subtractive: "tools/bn_textscript_dumper/tests/data/TextScriptBattleTutFullSynchro.s"
subtractive: "tools/bn_textscript_dumper/tests/data/TextScriptChipDescriptions0_86eb8b8.s"
subtractive: "tools/bn_textscript_dumper/tests/data/TextScriptChipTrader86C580C.s"
subtractive: "tools/bn_textscript_dumper/tests/data/TextScriptDialog87E30A0.s"
subtractive: "tools/bn_textscript_dumper/tests/data/TextScriptFolderNames86cf4ac.s"
subtractive: "tools/bn_textscript_dumper/tests/data/TextScriptWhoAmI.s"
subtractive: "tools/bn_textscript_dumper/tests/data/out/TextScriptBattleTutFullSynchro.s"
subtractive: "tools/bn_textscript_dumper/tests/data/out/TextScriptChipDescriptions0_86eb8b8.s"
subtractive: "tools/bn_textscript_dumper/tests/data/out/TextScriptChipTrader86C580C.s"
subtractive: "tools/bn_textscript_dumper/tests/data/out/TextScriptDialog87E30A0.s"
subtractive: "tools/bn_textscript_dumper/tests/data/out/TextScriptFolderNames86cf4ac.s"
subtractive: "tools/bn_textscript_dumper/tests/data/out/TextScriptWhoAmI.s"
```

It seems unexpected files are getting caught in. 
- [x] We need to add a blacklist setting for folders to not include.

2025-06-14 Wk 24 Sat - 06:45

Spawn [[001 Investigating slow bn repo lexer]] ^spawn-invst-088e2e

---

![[Pasted image 20250627144708.png]]
Figure 1: visidata breakdown by lexon_type of the entire repository of `bn6f` ^fig1

---

It's much better than before. Can be even better, but at least usable.

2025-06-28 Wk 26 Sat - 12:43

Spawn [[003 Map current lexer project files to include chunks]] ^spawn-task-50f486