---
context_type: issue
status: done
---

Parent: [lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/000 Provide a mod replacement for start screen](../000%20Provide%20a%20mod%20replacement%20for%20start%20screen.md)

Spawned by: [lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/issue/001 bn6f build crashes at hook during startscr mod for fa07f00a](001%20bn6f%20build%20crashes%20at%20hook%20during%20startscr%20mod%20for%20fa07f00a.md)

Spawned in: [^spawn-issue-9e0c0a](001%20bn6f%20build%20crashes%20at%20hook%20during%20startscr%20mod%20for%20fa07f00a.md#spawn-issue-9e0c0a)

# Issue

We're not able to match with `\\e` here:

````python
import re

arr = [27, 91, 49, 109, 45, 45, 45, 32, 47, 104, 111, 109, 101, 47, 108, 97, 110, 47, 97, 9, 50, 48, 50, 54, 45, 48, 56, 45, 48, 49, 32, 49, 54, 58, 50, 57, 58, 49, 51, 46, 54, 51, 55, 54, 48, 55, 48, 52, 48, 32, 43, 48, 51, 48, 48, 27, 91, 48, 109]
bstr = bytes(arr)

s = bstr.decode('ascii')
s # out { '\x1b[1m--- /home/lan/a\t2026-08-01 16:29:13.637607040 +0300\x1b[0m' }

regex = re.compile(r'\\e\[[0-9]*m')

regex.findall(s) # out { [] }

s1 = '\\e[1m--- /home/lan/a\t2026-08-01 16:29:13.637607040 +0300\\e[0m'

regex.findall(s1) # out { ['\\e[1m', '\\e[0m'] }
````

I tried to use `\e` before, but got another error:

````python
import re
regex = re.compile(r'\e\[[0-9]*m')

# out (error)
Traceback (most recent call last):
  File "<python-input-2>", line 1, in <module>
    regex = re.compile(r'\e\[[0-9]*m')
  File "/usr/lib/python3.14/re/__init__.py", line 289, in compile
    return _compile(pattern, flags)
  File "/usr/lib/python3.14/re/__init__.py", line 350, in _compile
    p = _compiler.compile(pattern, flags)
  File "/usr/lib/python3.14/re/_compiler.py", line 762, in compile
    p = _parser.parse(p, flags)
  File "/usr/lib/python3.14/re/_parser.py", line 973, in parse
    p = _parse_sub(source, state, flags & SRE_FLAG_VERBOSE, 0)
  File "/usr/lib/python3.14/re/_parser.py", line 460, in _parse_sub
    itemsappend(_parse(source, state, verbose, nested + 1,
                ~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                       not nested and not items))
                       ^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/lib/python3.14/re/_parser.py", line 544, in _parse
    code = _escape(source, this, state)
  File "/usr/lib/python3.14/re/_parser.py", line 443, in _escape
    raise source.error("bad escape %s" % escape, len(escape))
re.PatternError: bad escape \e at position 0
````

# Resolution

Regex needs to be given an actual escape character, not a literal slash, e, like with `\\e`. That actually only matches literal slash, e.

It is also not accepting the escape character `\e` directly. But it does work with the explicit byte `\x1b`:

````python
import re

arr = [27, 91, 49, 109, 45, 45, 45, 32, 47, 104, 111, 109, 101, 47, 108, 97, 110, 47, 97, 9, 50, 48, 50, 54, 45, 48, 56, 45, 48, 49, 32, 49, 54, 58, 50, 57, 58, 49, 51, 46, 54, 51, 55, 54, 48, 55, 48, 52, 48, 32, 43, 48, 51, 48, 48, 27, 91, 48, 109]
bstr = bytes(arr)

s = bstr.decode('ascii')
s # out { '\x1b[1m--- /home/lan/a\t2026-08-01 16:29:13.637607040 +0300\x1b[0m' }

regex = re.compile(r'\x1b\[[0-9]*m')

regex.findall(s) # out { ['\x1b[1m', '\x1b[0m'] }
````

OK

# Journal

2026-08-01 Wk 31 Sat - 18:27 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/comm_cmds.py > fn AppDiffSuppressSingleChanges.get_line_mode {
	line1 = line.strip()
	
	if line1.startswith('---'):
		return cls.Mode.NEGF
	[...]
	else:
		print(f'(??? {line1})', line1.startswith('---'), str(ord(line1[0])))
		
		return cls.Mode.NEUTRAL
# }

# in /home/lan/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/comm_cmds.py > fn AppDiffSuppressSingleChanges.app_diff_suppress_single_changes {
	for (i, line) in enumerate(lines):
		[...]
		line_mode = cls.get_line_mode(line)
		print(f'(line_mode {line_mode}) (line {line})')
# }

# in /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
source /home/lan/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/comm_cmds.sh
diff -u ~/a ~/b --color=always | comm-cmds diff-suppress-single-changes | less -R

# out (error, relevant)
(??? --- /home/lan/a    2026-08-01 16:29:13.637607040 +0300) False 27
(line_mode Mode.NEUTRAL) (line --- /home/lan/a  2026-08-01 16:29:13.637607040 +0300)
Exception: We must not process changeset internals at this level
````

From https://www.ascii-code.com/,

character 27 is Escape (`ESC`).

Right this output is ansi colored!

We need to process lines similar to

````
^[[1m--- /home/lan/a    2026-08-01 16:29:13.637607040 +0300^[[0m
^[[1m+++ /home/lan/b    2026-08-01 16:28:02.006071348 +0300^[[0m
^[[36m@@ -347,13 +347,13 @@^[[0m
      306:  3101        adds    r1, #1
      308:  8001        strh    r1, [r0, #0]
      30a:  f000 fd81   bl  0xe10
^[[31m-     30e:    4802        ldr r0, [pc, #8]    ; (0x318)^[[0m
````

````
echo -e '\e[36m Good \e[31mMorning \e[0mWorld'
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/comm_cmds.py > fn AppDiffSuppressSingleChanges.filter_out_color_ansi {
	matches = regex.findall(line)
	print(f'(regex {regex}) (matches {matches}) (for-line {line}) (as-bytes {list(bytes(line.encode('utf8')))})')
# }

# in /home/lan/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/comm_cmds.py > fn AppDiffSuppressSingleChanges.app_diff_suppress_single_changes {
	for (i, line) in enumerate(lines):
		[...]
		line_mode = cls.get_line_mode(line)
		print(f'(line_mode {line_mode}) (line {line})')
# }

# in /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
source /home/lan/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/comm_cmds.sh
diff -u ~/a ~/b --color=always | comm-cmds diff-suppress-single-changes

# out (error, relevant)
(regex re.compile('\\\\e\\[[0-9]*m')) (matches []) (for-line --- /home/lan/a    2026-08-01 16:29:13.637607040 +0300) (as-bytes [27, 91, 49, 109, 45, 45, 45, 32, 47, 104, 111, 109, 101, 47, 108, 97, 110, 47, 97, 9, 50, 48, 50, 54, 45, 48, 56, 45, 48, 49, 32, 49, 54, 58, 50, 57, 58, 49, 51, 46, 54, 51, 55, 54, 48, 55, 48, 52, 48, 32, 43, 48, 51, 48, 48, 27, 91, 48, 109])
(line_mode Mode.NEUTRAL) (line --- /home/lan/a  2026-08-01 16:29:13.637607040 +0300)
Exception: We must not process changeset internals at this level
````

When we apply `bytes` to that `(as-bytes _)` we get `b'\x1b[1m--- /home/lan/a\t2026-08-01 16:29:13.637607040 +0300\x1b[0m'`.

````python
import re

arr = [27, 91, 49, 109, 45, 45, 45, 32, 47, 104, 111, 109, 101, 47, 108, 97, 110, 47, 97, 9, 50, 48, 50, 54, 45, 48, 56, 45, 48, 49, 32, 49, 54, 58, 50, 57, 58, 49, 51, 46, 54, 51, 55, 54, 48, 55, 48, 52, 48, 32, 43, 48, 51, 48, 48, 27, 91, 48, 109]
bstr = bytes(arr)

s = bstr.decode('ascii')
s # out { '\x1b[1m--- /home/lan/a\t2026-08-01 16:29:13.637607040 +0300\x1b[0m' }

regex = re.compile(r'\\e\[[0-9]*m')

regex.findall(s) # out { [] }

s1 = '\\e[1m--- /home/lan/a\t2026-08-01 16:29:13.637607040 +0300\\e[0m'

regex.findall(s1) # out { ['\\e[1m', '\\e[0m'] }
````

Alright let's use the more explicit `\x1b`.

Now we pass:

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/comm_cmds.py > fn AppDiffSuppressSingleChanges.filter_out_color_ansi {
	matches = regex.findall(line)
	print(f'(regex {regex}) (matches {matches}) (for-line {line}) (as-bytes {list(bytes(line.encode('utf8')))})')
# }

# in /home/lan/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/comm_cmds.py > fn AppDiffSuppressSingleChanges.app_diff_suppress_single_changes {
	for (i, line) in enumerate(lines):
		[...]
		line_mode = cls.get_line_mode(line)
		print(f'(line_mode {line_mode}) (line {line})')
# }

# in /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
source /home/lan/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/comm_cmds.sh
diff -u ~/a ~/b --color=always | comm-cmds diff-suppress-single-changes

# out (error, relevant)
(regex re.compile('\\x1b\\[[0-9]*m')) (matches ['\x1b[1m', '\x1b[0m']) (for-line --- /home/lan/a        2026-08-01 20:05:50.211023285 +0300) (as-bytes [27, 91, 49, 109, 45, 45, 45, 32, 47, 104, 111, 109, 101, 47, 108, 97, 110, 47, 97, 9, 50, 48, 50, 54, 45, 48, 56, 45, 48, 49, 32, 50, 48, 58, 48, 53, 58, 53, 48, 46, 50, 49, 49, 48, 50, 51, 50, 56, 53, 32, 43, 48, 51, 48, 48, 27, 91, 48, 109])
(line_mode Mode.NEGF) (line --- /home/lan/a     2026-08-01 20:05:50.211023285 +0300)
NameError: name 'line' is not defined. Did you mean: 'lines'?
````

We fail for another reason, but this problem is resolved when using `regex = re.compile(r'\x1b\[[0-9]*m')`.

Notice that python would complain if we did `\e` directly:

````
raise source.error("bad escape %s" % escape, len(escape))
re.PatternError: bad escape \e at position 0
````

This was the reason I changed it to `\\e` but that was not a solution: Now it doesn't actually match against `\x1b`. So the explicit `\x1b` did not trigger the same issue `\e` did, and it worked as expected.

Now that the issue is clarified, let's rename it:

`002 Filtering out ansi code failing to find matches with slash e in python`

* $\to$ `Python regex does not allow matching by backslash e but accepts backslash x 1b`

OK
