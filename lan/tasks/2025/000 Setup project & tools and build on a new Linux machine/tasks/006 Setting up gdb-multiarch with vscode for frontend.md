---
parent: "[[000 Setup project & tools and build on a new Linux machine]]"
spawned_by: "[[004 Setting up a different gdb frontend]]"
context_type: task
status: todo
---

Parent: [[000 Setup project & tools and build on a new Linux machine]]

Spawned by: [[004 Setting up a different gdb frontend]] 

Spawned in: [[004 Setting up a different gdb frontend#^spawn-task-411c54|^spawn-task-411c54]]

# 1 Journal

2025-06-12 Wk 24 Thu - 08:14

Open vscode in the bn6f root directory (the one with bn6f.elf)

```sh
code . &
```

Enter the `Run and Debug` (for example with Ctrl+Shift+D) and click `create a launch.json file`

paste the following there (for linux, assuming gdb-multiarch exists):

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "mGBA Debug",
      "type": "cppdbg",
      "request": "launch",
      "program": "${workspaceFolder}/bn6f.elf",
      "cwd": "${workspaceFolder}",
      "MIMode": "gdb",
      "miDebuggerPath": "gdb-multiarch",
      "miDebuggerServerAddress": "localhost:2345",
      "targetArchitecture": "arm",
      "stopAtEntry": false,
      "setupCommands": [
        {
          "text": "set architecture arm"
        },
        {
          "text": "set endian little"
        }
      ]
    }
  ]
}
```

Now make sure the terminal gdb-multiarch is down. Restart the gdb server in mGBA, and then press `Start Debugging` in vscode under the `mgba Debug` config

Spawn [[000 Installed gdb-multiarch, but is it limited compared to arm-none-eabi-gdb?]] ^spawn-invst-ea3561

Spawn [[000 arm-none-eabi-gdb requiring libncurses.so.5]] ^spawn-issue-748850

2025-06-12 Wk 24 Thu - 08:30

Spawn [[001 On Running debugging in vscode, I encounter a vMustReplyEmpty error]] ^spawn-issue-74ec13
