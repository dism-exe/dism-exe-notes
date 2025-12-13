---
parent: '[[005 Replace all data directives not to be on label line]]'
spawned_by: '[[005 Replace all data directives not to be on label line]]'
context_type: howto
status: done
---

Parent: [005 Replace all data directives not to be on label line](../005%20Replace%20all%20data%20directives%20not%20to%20be%20on%20label%20line.md)

Spawned by: [005 Replace all data directives not to be on label line](../005%20Replace%20all%20data%20directives%20not%20to%20be%20on%20label%20line.md)

Spawned in: [<a name="spawn-howto-02890e" />^spawn-howto-02890e](../005%20Replace%20all%20data%20directives%20not%20to%20be%20on%20label%20line.md#spawn-howto-02890e)

# 1 Objective

I would like for example to be able to replace the pattern `{Identifier}:: .{Dir:byte|hword|word} {Rest:.*}` with

````
{Identifier}::
	.{Dir} {Rest}
````

So the result is multiline, and the content is regex captured.

# 2 Journal

2025-10-25 Wk 43 Sat - 16:27 +03:00

Through LLM use, I learned we can actually do group-based substitution with sed directly. For example:

````
%s/\(.word\|.byte\)/\1zzz/g
````

will change all `.word` AND `.byte` into `.wordzzz` and `.bytezzz`, with `\1` being the first group.

So we can do something like this:

````
:%s/\([a-zA-Z_][0-9a-zA-Z_]*\):: \(.byte\|.hword\|.word\) \(.*\)/\1::\n\t\2 \3/g
````

to capture each group, the identifier, directive, and remaining. Although with a slight issue that \n isn't getting encoded right.

This [stackoverflow post](https://stackoverflow.com/questions/46082397/insert-newline-n-using-sed) hints it doesn't support it.

2025-10-25 Wk 43 Sat - 17:54 +03:00

Anyway although vim sed doesn't support it, it is supported for me by `sed`:

````
cat maps/ACDCTown/data.s | sed 's/\([a-zA-Z_][0-9a-zA-Z_]*\):: \(.byte\|.hword\|.word\) \(.*\)/\1::\n\t\2 \3/g'
````
