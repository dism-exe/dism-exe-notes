---
parent: "[[003 Exploring Graphics for Start Screen]]"
spawned_by: "[[000 Wk 42 Exploring Graphics for Start Screen]]"
context_type: entry
---

Parent: [[003 Exploring Graphics for Start Screen]]

Spawned by: [[000 Wk 42 Exploring Graphics for Start Screen]]

Spawned in: [[000 Wk 42 Exploring Graphics for Start Screen#^spawn-entry-542aac|^spawn-entry-542aac]]

# 1 Journal

2025-10-19 Wk 42 Sun - 09:30 +03:00

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
tools/doc_scripts/replacesig.sh "_SetInterruptCallback" "(interrupt_idx: u8, callback: *const ()) -> ()"
```

So what's `interrupt_idx` in this case? Can we find it in the documentation?

The callback is written to some index of `off_3000E70` which is read by `sub_3005B00`