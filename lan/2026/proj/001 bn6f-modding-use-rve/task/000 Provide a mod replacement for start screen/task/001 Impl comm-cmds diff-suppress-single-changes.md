---
context_type: task
status: todo
---

Parent: [lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/000 Provide a mod replacement for start screen](../000%20Provide%20a%20mod%20replacement%20for%20start%20screen.md)

Spawned by: [lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/issue/001 bn6f build crashes at hook during startscr mod for fa07f00a](../issue/001%20bn6f%20build%20crashes%20at%20hook%20during%20startscr%20mod%20for%20fa07f00a.md)

Spawned in: [^spawn-task-1ad42e](../issue/001%20bn6f%20build%20crashes%20at%20hook%20during%20startscr%20mod%20for%20fa07f00a.md#spawn-task-1ad42e)

# Journal

2026-08-01 Wk 31 Sat - 21:42 +03:00

````sh
source /home/lan/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/comm_cmds.sh
diff -u ~/a ~/b --color=always | comm-cmds diff-suppress-single-changes | less -R
````

````
Traceback (most recent call last):
  File "/home/lan/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/comm_cmds.py", line 159, in <module>
    _main()
    ~~~~~^^
  File "/home/lan/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/comm_cmds.py", line 149, in _main
    return main(args)
  File "/home/lan/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/comm_cmds.py", line 108, in main
    AppDiffSuppressSingleChanges.app_diff_suppress_single_changes(args)
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^
  File "/home/lan/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/comm_cmds.py", line 94, in app_diff_suppress_single_changes
    print(line)
    ~~~~~^^^^^^
BrokenPipeError: [Errno 32] Broken pipe
Exception ignored while flushing sys.stdout:
BrokenPipeError: [Errno 32] Broken pipe
````

Hmm.

I don't get this now, will see if it happens again

2026-08-01 Wk 31 Sat - 21:25 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/comm_cmds.py > fn AppDiffSuppressSingleChanges.app_diff_suppress_single_changes {
	if mut_remaining_to_print != 0:
		mut_remaining_to_print -= 1
		print(f'A1 {mut_remaining_to_print}', line)
		continue
# }

# in /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
source /home/lan/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/comm_cmds.sh
diff -u ~/a ~/b --color=always | comm-cmds diff-suppress-single-changes | less -R

# out (relevant)
A1 3863093 -
A1 3863092 +    thumb_local_start
A1 3863091 +GameEntryPoint:
A1 3863090 +       0:   0032            movs    r2, r6
A1 3863089 +       2:   ea00 ff24                       ; <UNDEFINED> instruction: 0xea00ff24
A1 3863088 +       6:   51ae            str     r6, [r5, r6]
````

It's skipping everything to print. (also that dump is wrong, but it's fine, it just does thumb and the boot is in arm.)

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/comm_cmds.py > fn AppDiffSuppressSingleChanges.get_current_change {
	for i in range(from_nth, len(lines)):
	            cur_line = lines[i]
	            cur_line_mode = cls.get_line_mode(cur_line)
	            print(f'(mode {cur_line_mode}) (line {lines[i]})')
# }

# in /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
source /home/lan/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/comm_cmds.sh
diff -u ~/a ~/b --color=always | comm-cmds diff-suppress-single-changes | less -R

# out (relevant)
(mode Mode.NEG) (line -)
(mode Mode.POS) (line + thumb_local_start)
(mode Mode.POS) (line +GameEntryPoint:)
(mode Mode.POS) (line +       0:        0032            movs    r2, r6)
(mode Mode.POS) (line +       2:        ea00 ff24                       ; <UNDEFINED> instruction: 0xea00ff24)
(mode Mode.POS) (line +       6:        51ae            str     r6, [r5, r6])
(mode Mode.POS) (line +       8:        9a69            ldr     r2, [sp, #420]  ; 0x1a4)
(mode Mode.POS) (line +       a:        21a2            movs    r1, #162        ; 0xa2)
````

So `get_current_change` consumes everything in one chunk instead of many.

Oh oops. `~/a` is empty now. Recompute:

````sh
source ~/.venv/venv_main/bin/activate # must use with source

# in venv_main > /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f {
export RAW_DUMP=1
~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.sh bn6f.gba bn6f.sym 'None' 'sym:GameEntryPoint' 'sym:.fill' > ~/a
# }

# in venv_main > /home/lan/src/cloned/gh/dism-exe/bn6f {
export RAW_DUMP=1
~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.sh bn6f.gba bn6f.sym 'None' 'sym:GameEntryPoint' 'sym:.fill' > ~/b
# }

diff -u ~/a ~/b --color=always | less -R
````

````sh
  File "/home/lan/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/comm_cmds.py", line 124, in get_current_change
    assert(line_mode == cls.Mode.POS or line_mode == cls.Mode.NEG)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError
````

Refining error.

This is because `get_current_changeset` needs to handle neutral lines on its own. `get_current_change` just accumulates a current set of contiguous `-` and `+` lines.

Also corrected `get_current_change` so that it doesn't assume that it won't encounter lines of modes other than `-` and `+` as it scans forward, that is its stop condition.

We also need `get_current_changeset` to give us the neutral lines as well now to count properly how many lines to skip.

2026-08-01 Wk 31 Sat - 22:03 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
git commit

# out
[master 17410d60] impl script command diff-suppress-single-changes
````

OK
