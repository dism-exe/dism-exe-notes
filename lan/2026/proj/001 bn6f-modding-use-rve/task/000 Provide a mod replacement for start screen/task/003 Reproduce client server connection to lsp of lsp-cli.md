---
context_type: task
status: done
---

Parent: [lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/000 Provide a mod replacement for start screen](../000%20Provide%20a%20mod%20replacement%20for%20start%20screen.md)

Spawned by: [000 List all traits implemented by a rust type from cli](../howto/000%20List%20all%20traits%20implemented%20by%20a%20rust%20type%20from%20cli.md)

Spawned in: [^spawn-task-d94f71](../howto/000%20List%20all%20traits%20implemented%20by%20a%20rust%20type%20from%20cli.md#spawn-task-d94f71)

# Journal

2026-08-05 Wk 32 Wed - 14:57 +03:00

`/home/lan/src/idea/cb/lan22h-experiments/lsp-cli-client-conn-rust-analyzer-repro`

Include upstream (https://github.com/segoon/lsp-cli) LICENSE and explain in README.md.

--/ 2026-08-05 Wk 32 Wed - 15:14 +03:00

Renamed project to include `rust-analyzer`. This repro will be tested primarily for this, and as it is for demonstration purposes, it helps to be concrete. Plus, the very repro project is in rust so we can test against it too.

--/

2026-08-05 Wk 32 Wed - 15:02 +03:00

* `/home/lan/src/cloned/gh/segoon/lsp-cli/src/commands/common.rs > fn connect_lsp_client`
* $\to$ `/home/lan/src/cloned/gh/segoon/lsp-cli/src/lsp/client.rs > fn LspClient::new`

Starts a child process. It takes the following server command per my earlier invocation in [000 List all traits implemented by a rust type from cli](../howto/000%20List%20all%20traits%20implemented%20by%20a%20rust%20type%20from%20cli.md):

````
(workspace.server_command ["rust-analyzer"])
````

So the first thing to reproduce here is to spawn rust-analyzer: `/home/lan/src/idea/cb/lan22h-experiments/lsp-cli-client-conn-repro/src/main.rs > fn spawn_lsp_process`.

2026-08-05 Wk 32 Wed - 16:11 +03:00

* `/home/lan/src/cloned/gh/segoon/lsp-cli/src/commands/list_symbols.rs > fn run`
* $\to$ `/home/lan/src/cloned/gh/segoon/lsp-cli/src/lsp/client/requests.rs > fn LspClient::initialize`

Needed during initialization:

````
(workspace.root_uri "file:///home/lan/src/cloned/gh/segoon/lsp-cli/")
(workspace.workspace_name "lsp-cli")
````

2026-08-05 Wk 32 Wed - 20:15 +03:00

Spawn [000 Stop using and remove uses of encountered mut_ opt_ and res_ prefixes in my codebases](../judgment/000%20Stop%20using%20and%20remove%20uses%20of%20encountered%20mut_%20opt_%20and%20res_%20prefixes%20in%20my%20codebases.md) ^spawn-jdgmt-d447fd

2026-08-05 Wk 32 Wed - 20:41 +03:00

We've done spawning, and initialization. Next is the issuing of a command.

* `/home/lan/src/cloned/gh/segoon/lsp-cli/src/commands/list_symbols.rs > fn run`
  * \|-- `/home/lan/src/cloned/gh/segoon/lsp-cli/src/commands/symbol_query.rs > ensure_document_symbol_support`
  * $\to$ `/home/lan/src/cloned/gh/segoon/lsp-cli/src/lsp/capabilities.rs > fn document_symbol_supported`
  * ................................................................................

2026-08-06 Wk 32 Thu - 12:44 +03:00

Okay we confirm multi-message communication!

--/ 2026-08-06 Wk 32 Thu - 15:01 +03:00

`idea[t:_ t:topic=programming]` Naming Convention Idea: Name helper modules after source libraries  and differentiate in source

This can even apply at the individual function level, to change its interface, so simply provide the same module name and same function name which uses the upstream.

Example:

````rust
// in /home/lan/src/cloned/gh/segoon/lsp-cli/src/lsp/client/requests.rs > fn LspClient::open_document
let text: String = crate::fs::read_to_string(path)?;
````

--/

Spawn [001 Configure cargo fmt to allow user choice for function chains in own lines](../howto/001%20Configure%20cargo%20fmt%20to%20allow%20user%20choice%20for%20function%20chains%20in%20own%20lines.md) ^spawn-howto-2a5991

2026-08-07 Wk 32 Fri - 00:47 +03:00

We had to send a notification with the entire text of a given document to `rust-analyzer` via `lsp_types::DidOpenTextDocumentParams`.  See `fn open_document_for`.

Without this, if we request the list of symbols from the document `uri`, `rust-analyzer` would simply give us an error that it couldn't find the file. But the file exists, really it was not given to it.

Searching `"name"` of the last response, we successfully get the symbols in the supplied document.

Remember you can prettify the debug json by copying it to a file and using `jq`:  `cat ~/ta | jq -C | less -R`

Added `.pre-commit-config.yaml`

````sh
source ~/.venv/venv_main/bin/activate # must use with source
pip install pre-commit
pre-commit install
````

This is no longer an `idea` project. It fulfilled at least one central function. Publishing.

https://codeberg.org/lan22h-experiments/lsp-cli-client-conn-rust-analyzer-repro

2026-08-07 Wk 32 Fri - 01:25 +03:00

````sh
# in /home/lan/src/cloned/cb/lan22h-experiments/lsp-cli-client-conn-repro
git commit

# out
[main 6c0f9b0] reproduce list commands request
````

OK
