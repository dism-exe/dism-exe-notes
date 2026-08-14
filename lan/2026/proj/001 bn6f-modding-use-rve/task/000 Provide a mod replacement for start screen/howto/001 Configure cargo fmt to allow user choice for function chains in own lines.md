---
context_type: howto
status: cantdo
---

Parent: [[lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/000 Provide a mod replacement for start screen]]

Spawned by: [[lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/task/003 Reproduce client server connection to lsp of lsp-cli]]

Spawned in: [[lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/task/003 Reproduce client server connection to lsp of lsp-cli#^spawn-howto-2a5991|^spawn-howto-2a5991]]

# Journal

2026-08-06 Wk 32 Thu - 15:16 +03:00

This is to be more friendly with 80-character limit and also inlay hint workflows.

It seems that the default is 100 characters ([claim](https://github.com/cloud-hypervisor/cloud-hypervisor/issues/8281#issuecomment-4557200441)) but even zooming out my `:vsplit` neovim panes to fit 100 characters This will still wrap:

```
/////////////////////////////////////////////////////////////////////////////////////////////////100
        let msg = msgs.recv_timeout(Duration::from_millis(1000));
```

Notice it's within the limit, but this changes with the inlay hint:

```
/////////////////////////////////////////////////////////////////////////////////////////////////100
        let msg: Result<IncomingMessage, RecvTimeoutError> = msgs.recv_timeout(Duration::from_millis(1000));
```

One solution I would use for this is to put the `.rect_timeout` in its own line

```
/////////////////////////////////////////////////////////////////////////////////////////////////100
        let msg: Result<IncomingMessage, RecvTimeoutError> = msgs &Receiver<IncomingMessage>
	        .recv_timeout(Duration::from_millis(1000));
```

Inlay hints also benefit from this as it gave intermediate types.

But then `cargo fmt` will deny this change and revert back to 

```
/////////////////////////////////////////////////////////////////////////////////////////////////100
        let msg: Result<IncomingMessage, RecvTimeoutError> = msgs.recv_timeout(Duration::from_millis(1000));
```

2026-08-06 Wk 32 Thu - 15:40 +03:00

https://github.com/rust-lang/rustfmt/blob/main/Configurations.md

https://rust-lang.github.io/rustfmt/?version=v1.10.0&search=

https://www.rustfaq.org/en/how-to-use-cargo-fmt-to-format-rust-code/


I want `match_arm_leading_pipes="Always"`,


https://stackoverflow.com/questions/75561258/how-can-one-make-rustfmt-allow-iterator-adapaters-on-separate-lines

Apparently they say the default rule is that it will put them in the same line if they're `<= 60` characters.

```
/////////////////////////////////////////////////////////////////////////////////////////////////100
//////////////////////////////////////////////////////////60
		//////////////////////////////////////////////////////////60
        let msg = msgs.recv_timeout(Duration::from_millis(1000));
```

Doesn't seem to be the case though, unless we exclude indentation.

It will also not respect the `{ ... }` by default to have to be on its own line:

```
        let msg = { msgs.recv_timeout(Duration::from_millis(1000)) };
```

https://stackoverflow.com/questions/79626029/is-there-a-rustfmt-option-for-placing-opening-brace-on-a-new-line-when-assigning

https://github.com/rust-lang/rustfmt/issues/5433#issuecomment-1179050268

2026-08-06 Wk 32 Thu - 20:45 +03:00

```sh
# in /home/lan/src/idea/cb/lan22h-experiments/lsp-cli-client-conn-repro/rustfmt.toml
match_arm_leading_pipes = "always"
max_width = 80
chain_width = 0
use_small_heuristics = "Off"
```

Even a `chain_width` of `0` causes this line to collapse

```
        let msg = { msgs.recv_timeout(Duration::from_millis(1000)) };
```

One thing I did in the past was add a strange `//_` at the end of a line, and it will confuse it not to format that particular item. But this is really not ideal and it will look strange to anyone that sees my code.

Another solution in this case is to turn the ghost inlay hint type text into an actual type.

2026-08-06 Wk 32 Thu - 21:17 +03:00

Are there inlay hint and cargo format integration discussions anywhere?

- https://github.com/zed-industries/zed/discussions/47221 (no response)
- https://users.rust-lang.org/t/vscode-word-wrap-and-inlay-hints/48462 (no response)
-  https://users.rust-lang.org/t/vscode-inlay-hints-wordwrapcolumn/71545

What about issue trackers?

- https://ehuss.github.io/cargo/contrib/issues.html
- $\to$ https://github.com/rust-lang/rustfmt

2026-08-06 Wk 32 Thu - 22:19 +03:00

Okay I learned through rust discourse you can configure the inlay hints to be at the end of lines. Examples: 
- https://github.com/felpafel/inlay-hint.nvim
- https://github.com/chrisgrieser/nvim-lsp-endhints

Also through rust discourse, apparently there are technical difficulties with implementing an integration due to how rustfmt processes ASTs rather than semantics.

https://echasnovski.com/blog/2026-03-13-a-guide-to-vim-pack

`vim.pack` wouldn't accept sources that end with `/`.

```sh
# in /home/lan/src/cloned/cb/lan22h/dotfiles/etc/nvim/init_d/plugin/init.lua
vim.pack.add{ { src = 'https://github.com/chrisgrieser/nvim-lsp-endhints' }, }
```

This actually respects the line and adds `...` rather than wrapping! It still does well even at absurdly high zoom levels.
