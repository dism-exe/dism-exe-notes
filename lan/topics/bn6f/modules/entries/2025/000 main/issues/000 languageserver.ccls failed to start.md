---
parent: '[[000 main]]'
spawned_by: '[[000 Wk 39 exploring main module]]'
context_type: issue
status: todo
---

Parent: [000 main](../000%20main.md)

Spawned by: [000 Wk 39 exploring main module](../entries/000%20Wk%2039%20exploring%20main%20module.md)

Spawned in: [<a name="spawn-issue-f05cfe" />^spawn-issue-f05cfe](../entries/000%20Wk%2039%20exploring%20main%20module.md#spawn-issue-f05cfe)

# 1 Journal

2025-09-25 Wk 39 Thu - 00:58

In vim, we have `languageserver.ccls` installed as per `CocList > services`. We did `CocUpdate`.

But we get

````
coc.nvim] Server languageserver.ccls failed to start: Error: Launching server "languageserver.ccls" using command ccls failed.
````

2025-09-25 Wk 39 Thu - 01:02

As per [stackexchange post](https://vi.stackexchange.com/questions/36929/getting-server-languageserver-ccls-failed-to-start-error-when-ever-i-open-cpp),

````sh
sudo apt-get install ccls
````

Now it says it's running.

2025-09-25 Wk 39 Thu - 02:03

The project we're in is on ARM assembly though.

You can find the list of some supported language servers here: [coc.nvim wiki Language-servers](https://github-wiki-see.page/m/neoclide/coc.nvim/wiki/Language-servers). There's nother list in [coc.nvim Using coc extensions](https://github.com/neoclide/coc.nvim/wiki/Using-coc-extensions).

2025-09-25 Wk 39 Thu - 02:20

There is a language server in [lib.rs asm-lsp](https://lib.rs/crates/asm-lsp) ([gh](https://github.com/bergercookie/asm-lsp)).

````sh
cargo install --git https://github.com/bergercookie/asm-lsp asm-lsp
````

Adding to `~/.vim/coc-settings.json`,

````json
"asm-lsp": {
    "command": "asm-lsp",
    "filetypes": [
        "asm", "s", "S"
    ]
}
````

but we're still not able to install it with `:CocInstall asm-lsp`

````
- ✗ asm-lsp Bad response from https://registry.npmjs.org/asm-lsp: 404 
````

2025-09-25 Wk 39 Thu - 03:54

In [bergercookie/asm-lsp #254](https://github.com/bergercookie/asm-lsp/issues/254), issue author was able to install it with coc.nvim.

Updating with `:PlugUpdate` and `:PlugUpgrade`.

2025-09-25 Wk 39 Thu - 04:20

We could at least use ctags to move around:

````sh
sudo apt-get install exuberant-ctags
ctags -R *
````
