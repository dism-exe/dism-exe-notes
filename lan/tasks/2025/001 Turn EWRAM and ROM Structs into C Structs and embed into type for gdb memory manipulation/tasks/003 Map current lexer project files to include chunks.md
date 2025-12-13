---
parent: '[[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]'
spawned_by: '[[002 Continuing impl for bn_repo_editor to parse struct info from the repo]]'
context_type: task
status: todo
---

Parent: [001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation](../001%20Turn%20EWRAM%20and%20ROM%20Structs%20into%20C%20Structs%20and%20embed%20into%20type%20for%20gdb%20memory%20manipulation.md)

Spawned by: [002 Continuing impl for bn_repo_editor to parse struct info from the repo](002%20Continuing%20impl%20for%20bn_repo_editor%20to%20parse%20struct%20info%20from%20the%20repo.md)

Spawned in: [<a name="spawn-task-50f486" />^spawn-task-50f486](002%20Continuing%20impl%20for%20bn_repo_editor%20to%20parse%20struct%20info%20from%20the%20repo.md#spawn-task-50f486)

# 1 Purpose

2025-06-28 Wk 26 Sat - 12:43

**What is a lexer? And why use it?**

The point of a lexer is so that we no longer deal with the repository source files in terms of text, but rather in terms of typed boxes.

![Pasted image 20250628124516.png](../../../../../attachments/Pasted%20image%2020250628124516.png)

In the above image, every box has its own grammatical meaning. These would be the lexer tokens.

The next step once each source file has a corresponding `.lexer.ron`, is to resolve all `.include` directives so that we can deal with continuous streams of tokens that produce effect rather than deal with how they break down in file structure.

There are also 11 million tokens in the `bn6f` project, so running the lexical stage all at once in parallel helps save time with analysis and reconstruction of the repository files.

# 2 Journal

2025-06-16 Wk 25 Mon - 21:46

Repository source code (asm) can `.include` files. We won't be able to parse it as a stream as-is, we need to find all the `.include`s and turn the repository into chunks. Each file can correspond to a list of chunks. So a file that maps from the files in `lexer/` to files in `lexer-include-chunks/` . The paths can be preserved, with an appended `.chunkN`

First, we should stop getting lineno and storing this in a quick text file. We need the lexical stage to be easy and quick to serialize/deserialize. See [csv writer/reader setup](../../../../llm/2025/001%20General%20Assist%20Archive.md#d895a3).

2025-06-16 Wk 25 Mon - 22:57

This should make it easy to write/read from csv with quotes and multilines. Now we just need to write/read the lexer phase results themselves which are HashMap of path and LexerReport.

2025-06-17 Wk 25 Tue - 09:49

Here is the process:

````mermaid
graph TD

%% Nodes
A0[Repository]
A1[Lexer]
A2[LexerIncludeChunks]
B1[CodeParser]
B2[ROMDataParser]
B3[StructParser]
C1[LexerReport]
C2[LexerIncludeChunksReport]
C3[StructParserReport]
D1[User]
D2[...]
W1[LexerWriter]
W2[LexerIncludeChunksWriter]
W3[StructWriter]

%% Settings
classDef note fill:#f9f9a6,stroke:#333,stroke-width:1px,color:#000,font-style:italic;

%% Connections
A0 --> |sources| A1
C1 --> |sources| A2

C2 --> |sources| B1
C2 --> |sources| B2
C2 --> |sources| B3

A1 --> |generates| C1
A2 --> |generates| C2
B3 --> |generates| C3

W3 --> |overwrites| C2
W2 --> |overwrites| C1
W1 --> |overwrites| A0

C3 --> |sources| W3
C2 --> |sources| W2
C1 --> |sources| W1

B1 --> D2
B2 --> D2

D1 <--> |IO| C3
````

<a name="repo-read-write-process1" />^repo-read-write-process1

2025-06-17 Wk 25 Tue - 23:54

Created a test `lexer_record_vec_read_write_are_inverses` to investigate how `write_vec_to_csv` and `read_vec_to_csv` are giving different data

````
called `Result::unwrap()` on an `Err` value: Error(Deserialize { pos: Some(Position { byte: 36, line: 2, record: 1 }), err: DeserializeError { field: None, kind: Message("unknown variant `-784054805`, expected one of `Word`, `Text`, `UInt`, `NegInt`, `UHex`, `NegHex`, `Sign`") } })
````

2025-06-26 Wk 26 Thu - 19:33

Spawn [004 Reading and Writing LexerReport to RON files](004%20Reading%20and%20Writing%20LexerReport%20to%20RON%20files.md) <a name="spawn-task-f67f89" />^spawn-task-f67f89

---

**Creating include chunks**

2025-06-27 Wk 26 Fri - 14:32

Okay. So we have the `LexerReport` now. We want to turn it into a `LexerIncludeChunksReport`. What should we do?

* [ ] We shouldn't repeat ourselves. We should check the date modified and mirror it in stage 2. If it is identical, and an output exists, nothing to do.
* [x] We need a new master RON file that maps between files and an array of enums, the enum being either a `Lexer(path_to_chunked_lexer_file)`, or an `Include(key_within_this_hash)`.  The reason here is to not repeat our work. We will eventually hit all the files, so any recursion (that isn't deadly) should be resolved via this method. For now, do not handle corner cases like circular includes, etc. These should fail build and `OK`.
* [ ] We need individual chunk files. `{lexer_file}.chunk{n}.lexer.ron`
* [ ] Ability to read the the report, including the maser RON file, and each chunk as mapping to a single file path, as well as the file that maps modifications for stage 2. Modifications are reflected off of the repository base files in every stage to cache compute.
* [ ] Flat master document. Meaning, it only includes chunk files to process.  It does not preserve hierarchies such as A -> B -> {C, D} where A includes B which includes C, D. Here, A would just have a flat list of chunks, some named by A, some by B, some by C and D. In addition, this does not map one-to-one with every file in the repository anymore. Only root files. A root file is a lexer file that is not included anywhere.
* [ ] Maintain within the flat master document a mapping: root file -> list of included files.

Eventually, we should:

* [ ] Refine how we retrieve the base files to begin with. Trace the build artifacts, do not just parse all legible source files.

2025-06-28 Wk 26 Sat - 16:22

For function `split_by_include_directive`,

We have to split by the `directive` token with text `include`, and keep it inclusive. The very next token contains the string, so we need to take these splits and patch them to take the first token of the next split for the current one. This solution could probably use some generalization or different approach.

2025-06-28 Wk 26 Sat - 17:08

````
Repository Lexing stage took 99.966933472s
Processing lexer include chunks took 32.674442395s
````

Issues to fix for this run:

* [x] It seems we have made a path mistake, and it generated inside `lexer/lexer`, instead of just `lexer/`.
* [x] The chunks still include a string token. Remaining from splitting by include tokens. Some chunks even only have one string token. These shouldn't be created.

2025-06-28 Wk 26 Sat - 18:12

Thought `path_to_last_modified.json` was overwriting the one from the previous stage, but that was not the case.

* [x] New `path_to_last_modified.json` needs to be in the `lexer_incl_chunks/` not overwriting \`lexer/.

There are also `.incbin` includes. But these are binary blobs, and we cannot process them as text includes.  They could be handled at a different level, as blob data.

2025-06-28 Wk 26 Sat - 18:34

Spawn [002 Debugging empty string included in lexer after include](../investigations/002%20Debugging%20empty%20string%20included%20in%20lexer%20after%20include.md) <a name="spawn-invst-43448a" />^spawn-invst-43448a

2025-07-17 Wk 29 Thu - 09:10

Spawn [005 Rewriting include chunking logic for lexer include chunks](005%20Rewriting%20include%20chunking%20logic%20for%20lexer%20include%20chunks.md) <a name="spawn-task-bed020" />^spawn-task-bed020

Spawn [006 Resolving include keys issues for lexer include chunks](006%20Resolving%20include%20keys%20issues%20for%20lexer%20include%20chunks.md) <a name="spawn-task-b071df" />^spawn-task-b071df
