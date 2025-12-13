---
parent: '[[000 Setup project & tools and build on a new Linux machine]]'
spawned_by: '[[006 Setting up gdb-multiarch with vscode for frontend]]'
context_type: issue
status: todo
---

Parent: [000 Setup project & tools and build on a new Linux machine](../000%20Setup%20project%20&%20tools%20and%20build%20on%20a%20new%20Linux%20machine.md)

Spawned by: [006 Setting up gdb-multiarch with vscode for frontend](../tasks/006%20Setting%20up%20gdb-multiarch%20with%20vscode%20for%20frontend.md)

Spawned in: [<a name="spawn-issue-74ec13" />^spawn-issue-74ec13](../tasks/006%20Setting%20up%20gdb-multiarch%20with%20vscode%20for%20frontend.md#spawn-issue-74ec13)

# 1 Journal

2025-06-12 Wk 24 Thu - 08:30

Open the extensions marketplace (for example with Ctrl+Shift+X) and install **Cortex-Debug** by marus25

````
Failed to launch GDB: Remote replied unexpectedly to 'vMustReplyEmpty': swbreak+;hwbreak+;qXfer:features:read+;qXfer:memory-map:read+;QStartNoAckMode+ (from interpreter-exec console "target remote localhost:2345")
````

The settings this happens under:

````json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "mGBA Debug",
      "type": "cortex-debug",
      "request": "launch",
      "servertype": "external",
      "gdbTarget": "localhost:2345",
      "executable": "./bn6f.elf",
      "gdbPath": "gdb-multiarch",
      "device": "ARM7TDMI",
      "cwd": "${workspaceFolder}",
      "runToEntryPoint": "",
      "overrideLaunchCommands": [
        "target remote localhost:2345"
      ],
      "postLaunchCommands": [
        "set architecture arm",
        "set endian little"
      ]
    }
  ]
}
````

This seems to have shut down my mgba emulator too. (blog1) \[<a name="r8" />^r8\] gave a launch.json config that requires arm-none-eabi-gdb, but we're using gdb-multiarch in this instance.

Let's try this for a minimal config:

````json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "mGBA Debug",
      "type": "cppdbg",
      "request": "launch",
      "targetArchitecture": "arm",
      "program": "${workspaceFolder}/bn6f.elf",
      "stopAtEntry": false,
      "cwd": "${workspaceFolder}",
      "MIMode": "gdb",
      "miDebuggerPath": "gdb-multiarch",
      "miDebuggerServerAddress": "localhost:2345",
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
````

This seems to work! We have a callstack, it even opens the correct files where we break. But we do not seem to be able to add breakpoints? Also step-out doesn't work... Or it works once?

So we are able to in fact add breakpoints, it just seems to have to be done through the Breakpoints section on a symbol and this works. Unsure why line breakpoint integration is not working.

Issue persists with arm-none-eabi-gdb as well, not just gdb-multiarch.
