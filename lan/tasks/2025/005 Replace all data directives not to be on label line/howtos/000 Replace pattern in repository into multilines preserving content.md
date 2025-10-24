---
parent: "[[005 Replace all data directives not to be on label line]]"
spawned_by: "[[005 Replace all data directives not to be on label line]]"
context_type: howto
status: todo
---

Parent: [[005 Replace all data directives not to be on label line]]

Spawned by: [[005 Replace all data directives not to be on label line]]

Spawned in: [[005 Replace all data directives not to be on label line#^spawn-howto-02890e|^spawn-howto-02890e]]

# 1 Objective

I would like for example to be able to replace the pattern `{Identifier}:: .{Dir:byte|hword|word} {Rest:.*}` with 

```
{Identifier}::
	.{Dir} {Rest}
```

So the result is multiline, and the content is regex captured.

# 2 Journal

