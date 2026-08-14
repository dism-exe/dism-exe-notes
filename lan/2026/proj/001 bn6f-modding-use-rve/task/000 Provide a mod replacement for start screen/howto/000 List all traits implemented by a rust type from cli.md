---
context_type: howto
status: done
---

Parent: [lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/000 Provide a mod replacement for start screen](../000%20Provide%20a%20mod%20replacement%20for%20start%20screen.md)

Spawned by: [lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/task/002 Impl struct layout parsing from bn6f inc and parse gdb memory xw log](../task/002%20Impl%20struct%20layout%20parsing%20from%20bn6f%20inc%20and%20parse%20gdb%20memory%20xw%20log.md)

Spawned in: [^spawn-howto-869f14](../task/002%20Impl%20struct%20layout%20parsing%20from%20bn6f%20inc%20and%20parse%20gdb%20memory%20xw%20log.md#spawn-howto-869f14)

# Journal

2026-08-05 Wk 32 Wed - 08:32 +03:00

https://stackoverflow.com/questions/26623243/list-all-traits-implemented-by-a-type-in-a-scope

Suggests we can do lsp autocomplete to find what traits a type is implemented as. It is true, but it would also be good to be able to query this, especially as we might want to grep here.

We could query the lsp server like with https://github.com/RangerMauve/lsp-query

That doesn't work.

--/ 2026-08-05 Wk 32 Wed - 09:15 +03:00

`howto[t:status=done]` Scan all TCP ports in a network

https://isosecu.com/blog/tools-nmap-all-ports-scanning

````sh
nmap -sT -p- localhost
````

To also know what process is listening,

https://www.tecmint.com/find-out-which-process-listening-on-a-particular-port/

````sh
ss -ltnp
````

--/

Nothing listening for me for `rust-analyzer`.

* https://users.rust-lang.org/t/how-can-i-elicit-a-full-response-from-rust-analyzer-to-my-initialization-request/87471/3
* $\to$ https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#initialize

From https://stackoverflow.com/a/71221119,

````sh
send() { msg=$(jq -n "$@"); printf "%s\r\n" "Content-Length: ${#msg}" "" "$msg" | tee /dev/stderr; }
send '{ jsonrpc: "2.0", id: 1, method: "exit" }' | clangd
````

Okay `rust-analyzer` does respond to that:

````sh
send() { msg=$(jq -n "$@"); printf "%s\r\n" "Content-Length: ${#msg}" "" "$msg" | tee /dev/stderr; }
send '{ jsonrpc: "2.0", id: 1, method: "exit" }' | rust-analyzer

# out
Content-Length: 53

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "exit"
}
Content-Length: 159

{"jsonrpc":"2.0","id":1,"error":{"code":-32002,"message":"expected initialize request, got Request { id: RequestId(I32(1)), method: \"exit\", params: Null }"}}Error: no Content-Length

Stack backtrace:
   0: <unknown>
   1: <unknown>
   2: <unknown>
   3: <unknown>
   4: <unknown>
   5: <unknown>
   6: <unknown>
````

````sh
send() { msg=$(jq -n "$@"); printf "%s\r\n" "Content-Length: ${#msg}" "" "$msg" | tee /dev/stderr; }
send "$(cat ~/ta)" | rust-analyzer

# out
Content-Length: 144

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "capabilities": {
      "textDocument/completion": null
    }
  }
}
Content-Length: 2768

{"jsonrpc":"2.0","id":1,"result":{"capabilities":{"positionEncoding":"utf-16","textDocumentSync":{"openClose":true,"change":2,"save":{}},"selectionRangeProvider":true,"hoverProvider":true,"completionProvider":{"resolveProvider":false,"triggerCharacters":[":",".","'","("],"completionItem":{"labelDetailsSupport":false}},"signatureHelpProvider":{"triggerCharacters":["(",",","<"]},"definitionProvider":true,"typeDefinitionProvider":true,"implementationProvider":true,"referencesProvider":true,"documentHighlightProvider":true,"documentSymbolProvider":true,"workspaceSymbolProvider":true,"codeActionProvider":true,"codeLensProvider":{"resolveProvider":true},"documentFormattingProvider":true,"documentRangeFormattingProvider":false,"documentOnTypeFormattingProvider":{"firstTriggerCharacter":".","moreTriggerCharacter":["=","<",">","{","(","|","+"]},"renameProvider":{"prepareProvider":true},"foldingRangeProvider":true,"declarationProvider":true,"workspace":{"workspaceFolders":{"supported":true,"changeNotifications":true},"fileOperations":{"willRename":{"filters":[{"scheme":"file","pattern":{"glob":"**/*.rs","matches":"file"}},{"scheme":"file","pattern":{"glob":"**","matches":"folder"}}]}}},"callHierarchyProvider":true,"semanticTokensProvider":{"legend":{"tokenTypes":["comment","decorator","enumMember","enum","function","interface","keyword","macro","method","namespace","number","operator","parameter","property","string","struct","typeParameter","variable","type","angle","arithmetic","attributeBracket","attribute","bitwise","boolean","brace","bracket","builtinAttribute","builtinType","character","colon","comma","comparison","constParameter","const","deriveHelper","derive","dot","escapeSequence","formatSpecifier","generic","invalidEscapeSequence","label","lifetime","logical","macroBang","negation","parenthesis","procMacro","punctuation","selfKeyword","selfTypeKeyword","semicolon","static","toolModule","typeAlias","union","unresolvedReference"],"tokenModifiers":["async","documentation","declaration","static","defaultLibrary","deprecated","associated","attribute","callable","constant","consuming","controlFlow","crateRoot","injected","intraDocLink","library","macro","mutable","procMacro","public","reference","trait","unsafe"]},"range":true,"full":{"delta":true}},"inlayHintProvider":{"resolveProvider":false},"diagnosticProvider":{"identifier":"rust-analyzer","interFileDependencies":true,"workspaceDiagnostics":false},"experimental":{"externalDocs":true,"hoverRange":true,"joinLines":true,"matchingBrace":true,"moveItem":true,"onEnter":true,"openCargoToml":true,"parentModule":true,"childModules":true,"runnables":{"kinds":["cargo"]},"ssr":true,"workspaceSymbolScopeKindFiltering":true}},"serverInfo":{"name":"rust-analyzer","version":"1.95.0"}}}Error: no Content-Length

Stack backtrace:
   0: <unknown>
   1: <unknown>
   2: <unknown>
   3: <unknown>
   4: <unknown>
   5: <unknown>
   6: <unknown>
````

Even if I put nothing under capabilities I get that. Seems like it's telling me all the options available. I can copy that into big response JSON block into `~/tb` and then view it more nicely via `cat ~/tb | jq -C | less -R`.

https://stackoverflow.com/questions/37424497/sending-data-to-stdin-of-another-process-through-linux-terminal

````sh
send() { msg=$(jq -n "$@"); printf "%s\r\n" "Content-Length: ${#msg}" "" "$msg" | tee /dev/stderr; }
send "$(cat ~/ta)" > /proc/{pid}/fd/0
````

find out `{pid}` with `ps -aux | grep rust-analyzer`

https://unix.stackexchange.com/questions/58550/how-to-view-the-output-of-a-running-process-in-another-bash-session

To trace syscalls:

````sh
su
PID=$(ps -aux | grep rust-analyzer | tail -n2 | head -n1 | xargs | cut -d' ' -f2)
strace -p$PID -s9999 -ewrite
````

Nothing is being written. And when we trace `read`, nothing is being read either when we send to `/proc/$PID/fd/0`.

https://stackoverflow.com/questions/5374255/how-to-write-data-to-existing-processs-stdin-from-external-process

We need to pipe into the process so that it reads from the terminal.

Still doesn't do it. I also noticed that the text sent over to `/proc/$PID/fd/0`  appears there, but seems ghostly. ie, it won't interact with the terminal or be read, but I can type in the terminal and immediately it picks something.

For example, if you do `echo "ls" > /dev/pts/{terminalno}` and you press ENTER in that terminal, no ls is really executed, although it looks typed there.

https://serverfault.com/a/297095

We can also use `mkfifo` :

````sh
mkfifo /tmp/t-inp
cat > /tmp/t-inp &
echo $! > /tmp/t-inp-cat-pid
cat /tmp/t-inp | rust-analyzer &
````

Now we can send data to the named pipe `/tmp/t-inp` and `rust-analyzer` can receive it as stdin.

Though it's still quitting after one command anyway.

````sh
cat /tmp/t-inp | clangd &

send() { msg=$(jq -n "$@"); printf "%s\r\n" "Content-Length: ${#msg}" "" "$msg" | tee /dev/stderr; }
send '{ jsonrpc: "2.0", id: 1, method: "exit" }' > /tmp/t-inp

# out
I[11:53:21.831] <-- exit(1)
E[11:53:21.831] Call exit before initialization.
I[11:53:21.831] --> reply:exit(1) 0 ms, error: -32002: server not initialized
Content-Length: 83

{"error":{"code":-32002,"message":"server not initialized"},"id":1,"jsonrpc":"2.0"}I[11:53:21.831] Warning: Missing Content-Length header, or zero-length message.
E[11:53:21.831] Transport error: Input/output error
I[11:53:21.831] LSP finished, exiting with status 1
````

https://github.com/segoon/lsp-cli

````sh
# in /home/lan/src/cloned/cb/lan22h/bn-repo-editor
lsp-cli definition exhaus . --lsp rust-analyzer

# out
/home/lan/src/cloned/cb/lan22h/bn-repo-editor/src/util/regex.rs:80:11:pub trait ExhaustiveScan
/home/lan/src/cloned/cb/lan22h/bn-repo-editor/src/errors.rs:18:5:    ExhaustiveScanError<T: std::fmt::Debug, Err: std::fmt::Debug> := {
/home/lan/src/cloned/cb/lan22h/bn-repo-editor/src/errors.rs:7:5:    MacroParamExhaustiveScanError := {
/home/lan/src/cloned/cb/lan22h/bn-repo-editor/src/errors.rs:11:5:    StructIncInstsExhaustiveScanError := {
````

It's slow.

2026-08-05 Wk 32 Wed - 12:44 +03:00

There are not many capabilities you can use this directly with. I would like to get the output of `C-x o` in neovim.

````sh
export REPO=segoon/lsp-cli && git clone git@github.com:$REPO.git /home/lan/src/cloned/gh/$REPO
````

* `/home/lan/src/cloned/gh/segoon/lsp-cli/src/commands/symbol_query.rs > fn with_initialized_client`

* `/home/lan/src/cloned/gh/segoon/lsp-cli/src/lsp/client/requests.rs > fn LspClient::initialize`

* `/home/lan/src/cloned/gh/segoon/lsp-cli/src/commands/references.rs > fn run`

* $\to$ `/home/lan/src/cloned/gh/segoon/lsp-cli/src/commands/symbol_query.rs > fn run_named_location_query`

* $\to$ `/home/lan/src/cloned/gh/segoon/lsp-cli/src/commands/symbol_query.rs > fn collect_named_location_matches`
  
  * program ran on the client

````rust
// in /home/lan/src/cloned/gh/segoon/lsp-cli/src/lsp/client.rsf > fn LspClient::new
let Some(stdout) = child.stdout.take() else {
	let error = Error::unexpected(format!("failed to open stdout for {program}"));
	log_unexpected_error(&error.to_string());
	return Err(error);
};
// [...]
let messages = spawn_reader(stdout, debug);
````

Never used `let` and `else` this way. That's a cool way with keeping the indent levels low and also not having to unwrap.

Found this on their `TODO.md` which could be useful: https://www.w3tutorials.net/blog/what-is-the-idiomatic-way-of-writing-man-pages-for-rust-cli-tools/

````sh
# in /home/lan/src/cloned/gh/segoon/lsp-cli
./target/release/lsp-cli daemon . --lang rust --lsp rust-analyzer
# to stop: ./target/release/lsp-cli stop-all
````

````sh
# in /home/lan/src/cloned/gh/segoon/lsp-cli
./target/release/lsp-cli list-symbols . --detach --lang rust --lsp rust-analyzer
````

* `/home/lan/src/cloned/gh/segoon/lsp-cli/src/commands/list_symbols.rs > fn run`
* $\to$ `/home/lan/src/cloned/gh/segoon/lsp-cli/src/lsp/client/requests.rs > fn LspClient::document_symbol`

````sh
# in /home/lan/src/cloned/gh/segoon/lsp-cli/src/commands/symbol_query.rs > fn collect_list_symbol_matches
println!("(target {target:?})");
println!("(args {args:?})");
println!("(config {config:?})");

let workspace_root_uri = workspace.root_uri.clone();
let workspace_workspace_name = workspace.workspace_name.clone();
let workspace_server_command = workspace.server.command.clone();
println!("(workspace.root_uri {workspace_root_uri:?})");
println!("(workspace.workspace_name {workspace_workspace_name:?})");
println!("(workspace.server_command {workspace_server_command:?})");

println!("(initialize {initialize:?})");

# in /home/lan/src/cloned/gh/segoon/lsp-cli
cargo build --release
./target/release/lsp-cli list-symbols . --detach --lang rust --lsp rust-analyzer

# out (relevant)
(target Directory)
(args ListSymbolsArgs { path: ".", server: InstallDebugArgs { selection: SelectionArgs { lang: Some("rust"), lsp: Some("rust-analyzer") }, download: false, debug: false }, detach: true, wait_for_index: false, json: false, timeout: 10s, limit: 100 })
(config [really long json])
(workspace.root_uri "file:///home/lan/src/cloned/gh/segoon/lsp-cli/")
(workspace.workspace_name "lsp-cli")
(workspace.server_command ["rust-analyzer"])
(initialize [really long json])
````

````sh
# in /home/lan/src/cloned/gh/segoon/lsp-cli/src/lsp/client/requests.rs > fn LspClient::initialize
let response = self.send_request::<Initialize>(&params)?;
println!("(params {params:?})");
println!("(response {response})");

# in /home/lan/src/cloned/gh/segoon/lsp-cli
cargo build --release
./target/release/lsp-cli list-symbols . --detach --lang rust --lsp rust-analyzer

# out (relevant)
(params InitializeParams { process_id: Some(1403142), root_path: None, root_uri: Some(Uri(Uri { scheme: Some("file"), authority: Some(Authority { userinfo: None, host: Host { text: "", data: RegName("") }, port: None }), path: "/home/lan/src/cloned/gh/segoon/lsp-cli/", query: None, fragment: None })), initialization_options: None, capabilities: ClientCapabilities { workspace: Some(WorkspaceClientCapabilities { apply_edit: None, workspace_edit: None, did_change_configuration: None, did_change_watched_files: None, symbol: None, execute_command: None, workspace_folders: Some(true), configuration: None, semantic_tokens: None, code_lens: None, file_operations: None, inline_value: None, inlay_hint: None, diagnostic: None }), text_document: None, notebook_document: None, window: Some(WindowClientCapabilities { work_done_progress: Some(true), show_message: None, show_document: None }), general: Some(GeneralClientCapabilities { regular_expressions: None, markdown: None, stale_request_support: None, position_encodings: Some([PositionEncodingKind("utf-16")]) }), experimental: Some(Object {"serverStatusNotification": Bool(true)}) }, trace: None, workspace_folders: Some([WorkspaceFolder { uri: Uri(Uri { scheme: Some("file"), authority: Some(Authority { userinfo: None, host: Host { text: "", data: RegName("") }, port: None }), path: "/home/lan/src/cloned/gh/segoon/lsp-cli/", query: None, fragment: None }), name: "lsp-cli" }]), client_info: Some(ClientInfo { name: "lsp-cli", version: Some("0.1.4") }), locale: None, work_done_progress_params: WorkDoneProgressParams { work_done_token: None } })

(response {"capabilities":{"callHierarchyProvider":true,"codeActionProvider":true,"codeLensProvider":{"resolveProvider":true},"completionProvider":{"completionItem":{"labelDetailsSupport":false},"resolveProvider":false,"triggerCharacters":[":",".","'","("]},"declarationProvider":true,"definitionProvider":true,"diagnosticProvider":{"identifier":"rust-analyzer","interFileDependencies":true,"workspaceDiagnostics":false},"documentFormattingProvider":true,"documentHighlightProvider":true,"documentOnTypeFormattingProvider":{"firstTriggerCharacter":".","moreTriggerCharacter":["=","<",">","{","(","|","+"]},"documentRangeFormattingProvider":false,"documentSymbolProvider":true,"experimental":{"childModules":true,"externalDocs":true,"hoverRange":true,"joinLines":true,"matchingBrace":true,"moveItem":true,"onEnter":true,"openCargoToml":true,"parentModule":true,"runnables":{"kinds":["cargo"]},"ssr":true,"workspaceSymbolScopeKindFiltering":true},"foldingRangeProvider":true,"hoverProvider":true,"implementationProvider":true,"inlayHintProvider":{"resolveProvider":false},"positionEncoding":"utf-16","referencesProvider":true,"renameProvider":{"prepareProvider":true},"selectionRangeProvider":true,"semanticTokensProvider":{"full":{"delta":true},"legend":{"tokenModifiers":["async","documentation","declaration","static","defaultLibrary","deprecated","associated","attribute","callable","constant","consuming","controlFlow","crateRoot","injected","intraDocLink","library","macro","mutable","procMacro","public","reference","trait","unsafe"],"tokenTypes":["comment","decorator","enumMember","enum","function","interface","keyword","macro","method","namespace","number","operator","parameter","property","string","struct","typeParameter","variable","type","angle","arithmetic","attributeBracket","attribute","bitwise","boolean","brace","bracket","builtinAttribute","builtinType","character","colon","comma","comparison","constParameter","const","deriveHelper","derive","dot","escapeSequence","formatSpecifier","generic","invalidEscapeSequence","label","lifetime","logical","macroBang","negation","parenthesis","procMacro","punctuation","selfKeyword","selfTypeKeyword","semicolon","static","toolModule","typeAlias","union","unresolvedReference"]},"range":true},"signatureHelpProvider":{"triggerCharacters":["(",",","<"]},"textDocumentSync":{"change":2,"openClose":true,"save":{}},"typeDefinitionProvider":true,"workspace":{"fileOperations":{"willRename":{"filters":[{"pattern":{"glob":"**/*.rs","matches":"file"},"scheme":"file"},{"pattern":{"glob":"**","matches":"folder"},"scheme":"file"}]}},"workspaceFolders":{"changeNotifications":true,"supported":true}},"workspaceSymbolProvider":true},"serverInfo":{"name":"rust-analyzer","version":"1.95.0"}})
````

~~And after some time, it then fulfills the request. I guess the request is async.~~ No wait, this is *just* the initialization. Then we also need to send the actual list commands request.

````rust
// in /home/lan/src/cloned/gh/segoon/lsp-cli/src/lsp/client.rs > fn LspClient::send_request
let message = jsonrpc(Some(id), R::METHOD, params)?;
log_debug_message(self.debug, "-> ", &message);
````

This shows the messages being sent back and forth `->` `<-` when we pass `--debug`.

2026-08-05 Wk 32 Wed - 14:12 +03:00

We can try to send the same messages ourselves.

````sh
cat /tmp/t-inp | rust-analyzer &

send() { msg=$(jq -n "$@"); printf "%s\r\n" "Content-Length: ${#msg}" "" "$msg" | tee /dev/stderr; }

json=$(cat <<'EOF'
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "initialize",
  "params": {
    "capabilities": {
      "experimental": {
        "serverStatusNotification": true
      },
      "general": {
        "positionEncodings": [
          "utf-16"
        ]
      },
      "window": {
        "workDoneProgress": true
      },
      "workspace": {
        "workspaceFolders": true
      }
    },
    "clientInfo": {
      "name": "lsp-cli",
      "version": "0.1.4"
    },
    "processId": 0,
    "rootUri": "file:///home/lan/src/cloned/gh/segoon/lsp-cli/",
    "workspaceFolders": [
      {
        "name": "lsp-cli",
        "uri": "file:///home/lan/src/cloned/gh/segoon/lsp-cli/"
      }
    ]
  }
}
EOF
)
send "$json" > /tmp/t-inp

````

It responds but then exits with error `Error: no Content-Length` after the initialization response still.

https://github.com/helix-editor/helix/issues/504 "LSP crashes with `missing content length` #504"

 > 
 > when previous message hasn't been processed yet, a new message processing have started, and when it was looking for `Content-Length`, it found body from previous unprocessed yet message.

Maybe something like this is happening, where it's reading too much in?

So far we know that the `\r\n` is necessary, and also the empty line `""` between `Content-Length` and the message.

`clangd` for example gives

````
I[14:38:01.522] Warning: Missing Content-Length header, or zero-length message.
````

The proc in `/tmp/t-inp-cat-pid` died some time ago.

````sh
mkfifo /tmp/t-inp
cat > /tmp/t-inp &
echo $! > /tmp/t-inp-cat-pid
cat /tmp/t-inp | rust-analyzer &
````

This doesn't fix the issue though.

Spawn [lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/task/003 Reproduce client server connection to lsp of lsp-cli](../task/003%20Reproduce%20client%20server%20connection%20to%20lsp%20of%20lsp-cli.md) ^spawn-task-d94f71

2026-08-07 Wk 32 Fri - 01:59 +03:00

Now that we're able to communicate with rust-analyzer. Let's try to request completion.

2026-08-07 Wk 32 Fri - 02:28 +03:00

````sh
# in /home/lan/src/cloned/cb/lan22h-experiments/lsp-cli-client-conn-repro
cargo run --release

# out (error, relevant)
<- {"jsonrpc":"2.0","method":"experimental/serverStatus","params":{"health":"error","message":"Failed to discover workspace.\nConsider adding the `Cargo.toml` of the workspace to the [`linkedProjects`](https://rust-analyzer.github.io/book/configuration.html#linkedProjects) setting.\n\nFailed to load workspaces.","quiescent":false}}

<- {"id":1,"jsonrpc":"2.0","result":null}
````

I guess for completion though we need more than just provide the file.

````rust
// in /home/lan/src/cloned/cb/lan22h-experiments/lsp-cli-client-conn-repro/src/main.rs
// Send Cargo.toml
let path: PathBuf = "Cargo.toml".parse().expect("Failed to parse pathbuf");
let _ = open_document_for(&path, msgs, stdin);
````

Just sending it `Cargo.toml` like this won't work. It still gives the same error.

https://rust-analyzer.github.io/book/configuration.html#linkedProjects

rust-analyzer supports capabilities `workspaceFolders` and `workspace`.

````sh
# in /home/lan/src/cloned/gh/segoon/lsp-cli/src/lsp/client.rs > fn LspClient::new
println!("(command {command:?})");

# in /home/lan/src/cloned/gh/segoon/lsp-cli
cargo build --release
./target/release/lsp-cli list-symbols . --detach --lang rust --lsp rust-analyzer --debug

# out (relevant)
(command ["rust-analyzer"])
````

2026-08-07 Wk 32 Fri - 13:53 +03:00

````sh
# in /home/lan/src/idea/cb/lan22h-experiments/lsp-cli-client-conn-repro
git commit # out { [main 7bc18f7] wip impl autocompletions req }
````

It seems I've hardcoded the path to the workspace in initialize, so need to update `frozen-1`. This should be a fine update, since it is pushing a needed fix for it to work for others and not doing any more impl work.

````sh
# in /home/lan/src/idea/cb/lan22h-experiments/lsp-cli-client-conn-repro
git commit # out { [frozen-1 ab34bf1] fix hardcoded workspace uri }
````

Okay merging back into main, this resolves the `Failed to discover workspace` problem.

2026-08-07 Wk 32 Fri - 14:53 +03:00

Keep getting a `<- {"id":1,"jsonrpc":"2.0","result":null}` response. I tried to point it to a different crate with a location at the end of `var` and `var::`  where I would expect neovim's `C-x C-o` to give me completions.  But I still get this null result.

````
->Rq {"id":1,"jsonrpc":"2.0","method":"textDocument/completion","params":{"position":{"character":17,"line":67},"textDocument":{"uri":"file:///home/lan/src/cloned/gh/segoon/lsp-cli/src/main.rs"}}}

[...]

<- {"id":1,"jsonrpc":"2.0","result":null}
````

* https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#initialize
* $\to$ https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_completion

2026-08-07 Wk 32 Fri - 17:19 +03:00

Running `read_to_string` on stderr gets the server to give a lot more communications. It might be we're closing abruptly after the last command?

Yeah if we just sleep for a second and try again we get a different result (also had to replace an unimplemented error with a warning during message draining):

````
<- {"id":2,"jsonrpc":"2.0","result":{"isIncomplete":true,"items":[]}}
````

We are able to get completions now! But it's more unstable communications. Had to increase the send request timeout for a response `1000ms -> 5000ms` since the panic for it was triggered.

````json
->Rq {"id":2,"jsonrpc":"2.0","method":"textDocument/completion","params":{"position":{"character":16,"line":67},"textDocument":{"uri":"file:///home/lan/src/cloned/gh/segoon/lsp-cli/src/main.rs"}}}
<- {"id":2,"jsonrpc":"2.0","result":{"isIncomplete":true,"items":[{"detail":"fn(self) -> Result<T, <Self as TryInto<T>>::Error>","documentation":{"kind":"markdown","value":"Performs the conversion."},"filterText":"try_into","kind":2,"label":"try_into(as TryInto)","sortText":"80000004","textEdit":{"newText":"try_into","range":{"end":{"character":0,"line":68},"start":{"character":0,"line":68}}}},{"detail":"fn(self) -> T","documentation":{"kind":"markdown","value":"Converts this type into the (usually inferred) input type."},"filterText":"into","kind":2,"label":"into(as Into)","sortText":"80000004","textEdit":{"newText":"into","range":{"end":{"character":0,"line":68},"start":{"character":0,"line":68}}}},{"detail":"fn(&self, &Rhs) -> bool","documentation":{"kind":"markdown","value":"Tests for `self` and `other` values to be equal, and is used by `==`."},"filterText":"eq","kind":2,"label":"eq(as PartialEq)","sortText":"80000009","textEdit":{"newText":"eq","range":{"end":{"character":0,"line":68},"start":{"character":0,"line":68}}}},{"detail":"fn(&self, &Rhs) -> bool","documentation":{"kind":"markdown","value":"Tests for `!=`. The default implementation is almost always sufficient,\nand should not be overridden without very good reason."},"filterText":"ne","kind":2,"label":"ne(as PartialEq)","sortText":"80000009","textEdit":{"newText":"ne","range":{"end":{"character":0,"line":68},"start":{"character":0,"line":68}}}}]}}
````

Seems to trigger more stable now on my system with the new timeout. I am also filtering for the message since now there's a lot of messages the server is sending: \`cargo run --release | grep "id":2,

This is currently the completion for `raw_command.` in `lsp-ci`'s `main`.

I don't get this output though. This is *not* what I get from neovim's `<C-x> <C-o>` at the same position.

What about with complete code? I can still do autocompletion at `use system_log::` in neovim for `lsp-cli/src/main.rs`.  `log_lsp_server_starting` is one of the options.

It just gives a huge JSON output for many things like `debug_assert_ne!` and `macro_rules! eprint` but not what I actually see in neovim.

Also it's supposed to be line 62 character 16, but it is giving a range for `(start (character 0) (line 62))` and `(end (character 0) (line 62))`.

They do seem to some match completions you would get at character 0 though, but neovim would still offer some things that aren't there like `Box`.

prettify the last message: `cargo run --release | grep \"id\":3, | tail -n1 | cut -d' ' -f2- | jq -C | less -R`

Sometimes it's able to give results for a non-0 `character`.

2026-08-07 Wk 32 Fri - 18:24 +03:00

Would adding a completion context to the completion request help?

I did get correct results for `output.` this time, though I specified the end of some line, it went to the beginning of the next line.

We are sort of able to get the traits from this:

````
        "label": "unwrap_unchecked",
        "label": "inspect",
        "label": "as_deref_mut",
        "label": "expect",
        "label": "iter().filter_map(as Iterator)",
        "label": "iter().clone_from(as Clone)",
        "label": "iter().skip(as Iterator)",
        "label": "iter().size_hint(as Iterator)",
        "label": "iter().position(as Iterator)",
        "label": "iter().rfold(alias foldr) (as DoubleEndedIterator)",
````

2026-08-07 Wk 32 Fri - 18:37 +03:00

Let's try it to our original context

````sh
# in /home/lan/src/cloned/cb/lan22h/bn-repo-editor/src/formats/struct_inc.rs > fn <MacroParam as impl ExhaustiveScan>::exhaustive_scan
MacroParam::
            MacroParam::
//////////////////////24
// line 53
````

We need to know it implements `CompileRegex`. It doesn't show up but we didn't improve it yet, let's try it again.

````sh
cargo run --release | grep \"id\":3, | tail -n1 | cut -d' ' -f2- | jq -C | grep 'label' | less -R

# out
"label": "ReqMacroParam",
"label": "DefaultMacroParam",
"label": "compile_regex(as CompileRegex)",
"label": "to_owned(as ToOwned)",
"label": "ne(as PartialEq)",
"label": "exhaustive_scan(as ExhaustiveScan)",
"label": "from(as From)",
"label": "try_into(as TryInto)",
"label": "clone_into(as ToOwned)",
"label": "iter(as IntoEnumIterator)",
"label": "into(as Into)",
"label": "to_regex_s(as ToRegexS)",
"label": "clone(as Clone)",
"label": "eq(as PartialEq)",
"label": "clone_from(as Clone)",
"label": "try_from(as TryFrom)",
````

and there you have it. We can get this information directly, so this yield a proof of concept. There is probably an easier way by analysing rust AST directly, but this helped us understand what goes underneath autocompletion with the language protocol servers.

I suspect autocompletion goes to the end of the line and expects that completion context carries from the prior line.

2026-08-07 Wk 32 Fri - 19:02 +03:00

Let's try to quickly package it anyway so it can be run as a binary on any rust project and at any lineno/character.

````sh
# in /home/lan/src/cloned/cb/lan22h-experiments/lsp-cli-client-conn-repro
WORKSPACE_PATH="/home/lan/src/cloned/cb/lan22h/bn-repo-editor" \
FILE_PATH="/home/lan/src/cloned/cb/lan22h/bn-repo-editor/src/formats/struct_inc.rs" \
LINENO=53 \
CHARNO=24 \
./target/release/completions_at | grep \"id\":3, | tail -n1 | cut -d' ' -f2- | jq -C | grep 'label' | less -R
````

2026-08-07 Wk 32 Fri - 19:49 +03:00

````sh
# in /home/lan/src/cloned/cb/lan22h-experiments/lsp-cli-client-conn-repro
git commit # out { [main 5b3adba] add completions-at binary }
````

OK
