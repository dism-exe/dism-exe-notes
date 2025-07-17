#lan #llm #resolved #visidata #script #shell

# 1 000 Lexer RON to CSV for quick visidata inspection

This relates to [[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation#2.5.3.1 Reading/Writing LexerReport to RON files]]. Since we are writing the lexer report in RON files, they are not parsable in visidata. But we can write a quick specific translation layer here for if visidata is desirable to use.

# 2 Objective

Given data like

```ron
(lexon_type: ThumbOpcode, lexon_data: Word("push"), capture: "push ")
(lexon_type: LCurly, lexon_data: Sign, capture: "{")
(lexon_type: Reg, lexon_data: Word("lr"), capture: "lr")
(lexon_type: RCurly, lexon_data: Sign, capture: "}\n\t")
...
```

Generate a CSV buffer to stdout. in the form

```csv
lexon_type, lexon_data, capture
"ThumbOpcode, Word("push"), "push "
"LCurly, Sign, "{"
"Reg, Word("lr"), "lr"
"RCurly, Sign, "}\n\t"
...
```

# 3 Solution

```python
#!/bin/python3

# bn_lexer_ron2csv.py
import sys
import csv
import re
import os

# Regular expression to match RON-style tuple entries
ron_re = re.compile(
    r'''
    ^\(
    \s*lexon_type:\s*([^\s,]+),\s*
    lexon_data:\s*([^\s,]+(?:\(".*?"\))?),\s*
    capture:\s*("(?:[^"\\]|\\.)*?")
    \s*\)
    ''',
    re.VERBOSE,
)

# Matches FILENAME directive line
filename_re = re.compile(r'^FILENAME\s+(.+)$')

def strip_filename(path):
    """Return path relative to the last occurrence of 'lexer/'"""
    parts = path.split('lexer/')
    return parts[-1] if len(parts) > 1 else os.path.basename(path)

def parse_with_filenames(input_lines):
    current_filename = None
    for line in input_lines:
        line = line.rstrip('\n')
        fname_match = filename_re.match(line)
        if fname_match:
            current_filename = strip_filename(fname_match.group(1))
            continue

        ron_match = ron_re.match(line)
        if ron_match and current_filename:
            yield [
                ron_match.group(1),  # lexon_type
                ron_match.group(2),  # lexon_data
                ron_match.group(3),  # capture (escaped as-is)
                current_filename     # simplified filename
            ]

def main():
    reader = sys.stdin
    writer = csv.writer(sys.stdout, quoting=csv.QUOTE_MINIMAL)
    writer.writerow(['lexon_type', 'lexon_data', 'capture', 'filename'])

    for row in parse_with_filenames(reader):
        writer.writerow(row)

if __name__ == "__main__":
    main()
```


Saving it and making it executable:
```sh
chmod +x ~/src/exp/scripts/bn_lexer_ron2csv.py
```

Then we can analyze the entire repository lexer files using:

```sh
find ~/data/apps/bn_repo_editor/lexer -type f | while read -r file; do echo "FILENAME $file"; cat $file; done | ~/src/exp/scripts/bn_lexer_ron2csv.py | vd -f csv
```

Now we can for example see a frequency breakdown of the use of `.include` directives by filename:

![[Pasted image 20250628121911.png]]


Or a frequency breakdown of files by amount of tokens in them:

![[Pasted image 20250628124240.png]]

We can see the largest file also only contains references to 4 identifiers:

![[Pasted image 20250628125649.png]]

This is different from double colon labels which are used to export global symbols. These would be identifiers as they are used.

![[Pasted image 20250628125846.png]]

An identifier used in the source file itself:

![[Pasted image 20250628125959.png]]

This seems like a false positive pointer. Issues with ROM shift-ability may be made worse with the presence of false positives and not just what pointers we miss.
# 4 LLM Instructions
- This is a diagnostic document and not a conversation. Everything shared is context. Address the questions tagged (Q#) like (Q1) for example. If you see something like (~1), assume it part of the archive and not a latest set of questions.
	- Since it keeps occurring, I ask Again
	- !!! NEVER RESPOND TO (~1), (~2), etc.
	- ONLY respond to the tagged questions. Nothing else.

(LLM chatgpt-4o)
(Note: Between these tags is responses from ChatGPT-4o.
(/LLM chatgpt-4o)

(LLM chatgpt-4o)
(/LLM chatgpt-4o)

# 5 Journal

2025-06-26 Wk 26 Thu - 22:46

## 5.1 Translating specific Lexer RON format to CSV


### 5.1.1 Attempt 1

(~1) Satisfy objective. Do not hardcode the content, remember it's just guideline for the form itself. Write this as a python3 script.

(LLM chatgpt-4o)
```python
#!/bin/python3

# bn_lexer_ron2csv.py
import sys
import csv
import re

# Regular expression to match RON-style tuple entries
line_re = re.compile(
    r"""
    ^\(
    \s*lexon_type:\s*([^\s,]+),\s*
    lexon_data:\s*([^\s,]+(?:\(".*?"\))?),\s*
    capture:\s*("(?:[^"\\]|\\.)*?")
    \s*\)
    """,
    re.VERBOSE,
)

def parse_ron_lines(input_lines):
    for line in input_lines:
        match = line_re.match(line.strip())
        if match:
            lexon_type = match.group(1)
            lexon_data = match.group(2)
            capture = match.group(3)
            yield [lexon_type, lexon_data, eval(capture)]

def main():
    reader = sys.stdin
    writer = csv.writer(sys.stdout)
    writer.writerow(['lexon_type', 'lexon_data', 'capture'])

    for row in parse_ron_lines(reader):
        writer.writerow(row)

if __name__ == "__main__":
    main()
```

Usage:
```sh
cat your_data.ron | python3 script.py > output.csv
```

(/LLM chatgpt-4o)

(~1) This solution does not escape quotes nor new lines nor tabs. The RON strings are escaped. They should **remain** escaped in translation to CSV. It was properly one entry per line and now it no longer is the case.

### 5.1.2 Attempt 2


(LLM chatgpt-4o)
```py
#!/bin/python3

# bn_lexer_ron2csv.py
import sys
import csv
import re

# Regular expression to match RON-style tuple entries
line_re = re.compile(
    r'''
    ^\(
    \s*lexon_type:\s*([^\s,]+),\s*
    lexon_data:\s*([^\s,]+(?:\(".*?"\))?),\s*
    capture:\s*("(?:[^"\\]|\\.)*?")
    \s*\)
    ''',
    re.VERBOSE,
)

def parse_ron_lines(input_lines):
    for line in input_lines:
        match = line_re.match(line.strip())
        if match:
            lexon_type = match.group(1)
            lexon_data = match.group(2)
            capture = match.group(3)  # leave as-is, including escaped quotes/newlines
            yield [lexon_type, lexon_data, capture]

def main():
    reader = sys.stdin
    writer = csv.writer(sys.stdout, quoting=csv.QUOTE_MINIMAL)
    writer.writerow(['lexon_type', 'lexon_data', 'capture'])

    for row in parse_ron_lines(reader):
        writer.writerow(row)

if __name__ == "__main__":
    main()

```
(/LLM chatgpt-4o)

## 5.2 Including filenames as column

2025-06-28 Wk 26 Sat - 10:37

Also include the filename as an extra column, since we will typically analyze all files like so:

```sh
cat ~/data/apps/bn_repo_editor/lexer/**/*.lexer.ron | ~/src/exp/scripts/bn_lexer_ron2csv/bn_lexer_ron2csv.py | vd -f csv
```

Maybe with cat we can also include the filename in the first line?

2025-06-28 Wk 26 Sat - 10:49

It doesn't seem like `cat` is able to get us the file names, so we can find them explicitly with

```sh
find ~/data/apps/bn_repo_editor/lexer -type f
```

We are able to feed the files to `cat` via piping with `xargs` ([post on xargs and cat answer](<https://unix.stackexchange.com/a/257098>) [[#^post1-ans]]):

```sh
echo "/home/lan/data/apps/bn_repo_editor/lexer/data/dat38_39.lexer.ron /home/lan/data/apps/bn_repo_editor/lexer/data/dat23.lexer.ron" | xargs cat | less
```

Now we would like to `echo FILENAME {args}` and then pass the same input to cat so we can parse this.

But this wouldn't work because cat takes all the arguments at once via `xargs`. 

Similar to [post on xargs multi commands answer](<https://stackoverflow.com/a/6958957/6944447>) [[#^post2-ans]],

we can do

```sh
echo "A B C" | xargs -d $'\n' sh -c 'for arg do echo "arg: $arg"; echo "ARG: $arg"; done' _

# output
arg: A B C
ARG: A B C
```

But this keeps all the inputs together still, so we wouldn't be able to only output the filename once.

```sh
for token in $(echo "A B C"); do echo "T $token"; done    

# output
T A
T B
T C
```

(~ 11:23) This works but we need a way to pass input into the for loop stuff via stdin. so that `echo "A B C"` is decoupled from the for loop logic


(LLM chatgpt-4o)

```sh
echo "A B C" | tr ' ' '\n' | while read -r token; do echo "T $token"; done
```

(/LLM chatgpt-4o)

2025-06-28 Wk 26 Sat - 11:29

Now we are able to do add `FILENAME $file` before every cat output.

```sh
echo "/home/lan/data/apps/bn_repo_editor/lexer/data/dat38_39.lexer.ron /home/lan/data/apps/bn_repo_editor/lexer/data/dat23.lexer.ron" | tr ' ' '\n' | while read -r file; do echo "FILENAME $file"; cat $file; done | less
```

(~ 11:32) All that remains is to also parse this FILENAME token and use it to update the column filename to add 

so that we can do 

```sh
find ~/data/apps/bn_repo_editor/lexer -type f | while read -r file; do echo "FILENAME $file"; cat $file; done | ~/src/exp/scripts/bn_lexer_ron2csv/bn_lexer_ron2csv.py | vd -f csv
```


(LLM chatgpt-4o)

```python
#!/bin/python3

# bn_lexer_ron2csv.py
import sys
import csv
import re

# Regular expression to match RON-style tuple entries
ron_re = re.compile(
    r'''
    ^\(
    \s*lexon_type:\s*([^\s,]+),\s*
    lexon_data:\s*([^\s,]+(?:\(".*?"\))?),\s*
    capture:\s*("(?:[^"\\]|\\.)*?")
    \s*\)
    ''',
    re.VERBOSE,
)

# Regular expression to detect FILENAME directive
filename_re = re.compile(r'^FILENAME\s+(.+)$')

def parse_with_filenames(input_lines):
    current_filename = None
    for line in input_lines:
        line = line.rstrip('\n')
        fname_match = filename_re.match(line)
        if fname_match:
            current_filename = fname_match.group(1)
            continue

        ron_match = ron_re.match(line)
        if ron_match and current_filename:
            yield [
                ron_match.group(1),  # lexon_type
                ron_match.group(2),  # lexon_data
                ron_match.group(3),  # capture (escaped as-is)
                current_filename     # filename
            ]

def main():
    reader = sys.stdin
    writer = csv.writer(sys.stdout, quoting=csv.QUOTE_MINIMAL)
    writer.writerow(['lexon_type', 'lexon_data', 'capture', 'filename'])

    for row in parse_with_filenames(reader):
        writer.writerow(row)

if __name__ == "__main__":
    main()
```

(/LLM chatgpt-4o)

(~ 12:10) This works, also strip the filename to just whatever is after `.../lexer/` so that `/home/lan/data/apps/bn_repo_editor/lexer/rom.lexer.ron` becomes `rom.lexer.ron` and `A/B/lexer/C/D` becomes `C/D`. 

(LLM chatgpt-4o)

```python
#!/bin/python3

# bn_lexer_ron2csv.py
import sys
import csv
import re
import os

# Regular expression to match RON-style tuple entries
ron_re = re.compile(
    r'''
    ^\(
    \s*lexon_type:\s*([^\s,]+),\s*
    lexon_data:\s*([^\s,]+(?:\(".*?"\))?),\s*
    capture:\s*("(?:[^"\\]|\\.)*?")
    \s*\)
    ''',
    re.VERBOSE,
)

# Matches FILENAME directive line
filename_re = re.compile(r'^FILENAME\s+(.+)$')

def strip_filename(path):
    """Return path relative to the last occurrence of 'lexer/'"""
    parts = path.split('lexer/')
    return parts[-1] if len(parts) > 1 else os.path.basename(path)

def parse_with_filenames(input_lines):
    current_filename = None
    for line in input_lines:
        line = line.rstrip('\n')
        fname_match = filename_re.match(line)
        if fname_match:
            current_filename = strip_filename(fname_match.group(1))
            continue

        ron_match = ron_re.match(line)
        if ron_match and current_filename:
            yield [
                ron_match.group(1),  # lexon_type
                ron_match.group(2),  # lexon_data
                ron_match.group(3),  # capture (escaped as-is)
                current_filename     # simplified filename
            ]

def main():
    reader = sys.stdin
    writer = csv.writer(sys.stdout, quoting=csv.QUOTE_MINIMAL)
    writer.writerow(['lexon_type', 'lexon_data', 'capture', 'filename'])

    for row in parse_with_filenames(reader):
        writer.writerow(row)

if __name__ == "__main__":
    main()
```

(/LLM chatgpt-4o)


## 5.3 Issues

2025-06-28 Wk 26 Sat - 12:28

Fun! I got visidata to divide by zero! Just by pressing `.` in some frequency analysis.

![[Pasted image 20250628122831.png]]

# 6 References
1. [post on xargs and cat](<https://unix.stackexchange.com/questions/257096/can-i-redirect-the-output-of-a-program-to-cat-with-a-pipe>) ^post1
2. [post on xargs and cat answer](<https://unix.stackexchange.com/a/257098>) ^post1-ans
3. [post on xargs multi commands](<https://stackoverflow.com/questions/6958689/running-multiple-commands-with-xargs>) ^post2
4. [post on xargs multi commands answer](<https://stackoverflow.com/a/6958957/6944447>) ^post2-ans
5. [post space-delimited string loop](<https://stackoverflow.com/questions/25870689/simple-unix-way-of-looping-through-space-delimited-strings>)