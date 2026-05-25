---
parent: "[[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]"
spawned_by: "[[003 Map current lexer project files to include chunks]]"
context_type: task
status: todo
---

Parent: [[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]

Spawned by: [[003 Map current lexer project files to include chunks]] 

Spawned in: [[003 Map current lexer project files to include chunks#^spawn-task-b071df|^spawn-task-b071df]]

# 1 Journal

```
"/home/lan/data/apps/bn_repo_editor/lexer/data/textscript/compressed/CompText877567C.lexer.ron": [
File("/home/lan/data/apps/bn_repo_editor/lexer_incl_chunks/data/textscript/compressed/CompText877567C.lexer.0.chunk.lexer.ron"),
Key("charmap.inc"), 
File("/home/lan/data/apps/bn_repo_editor/lexer_incl_chunks/data/textscript/compressed/CompText877567C.lexer.1.chunk.lexer.ron"),
Key("include/macros/enum.inc"), 
File("/home/lan/data/apps/bn_repo_editor/lexer_incl_chunks/data/textscript/compressed/CompText877567C.lexer.2.chunk.lexer.ron"),
Key("include/bytecode/text_script.inc"),
File("/home/lan/data/apps/bn_repo_editor/lexer_incl_chunks/data/textscript/compressed/CompText877567C.lexer.3.chunk.lexer.ron"),
],
```

`.incbins` can remain as they are. For example `Bin("data/compressed/comp_87F4394.lz77")`, but `Key(...)` need to be resolved recursively to that Key's chunks so that we have just a continuous stream of chunks to fetch per file.

2025-07-18 Wk 29 Fri - 21:55

It seems some files are missing. We have not processed `*.inc` files like `charmap.inc` which is used in many places here.

```sh
find ~/data/apps/bn_repo_editor/lexer -type f | grep 'charmap'

# out
[nothing]
```

Further, instead of using `.lexer.ron` it is better to preserve the original extension: `.s.lexer.ron`, or `.inc.lexer.ron`, etc.

We are also seeing panics when processing lexer files.

Spawn [[000 Panics when processing Lexer files]] ^spawn-issue-405bbd

2025-08-07 Wk 32 Thu - 20:59

2025-07-18 Wk 29 Fri - 21:58

Spawn [[007 Revising lexer parsing to include inc files and preserve format]] ^spawn-task-092c93

