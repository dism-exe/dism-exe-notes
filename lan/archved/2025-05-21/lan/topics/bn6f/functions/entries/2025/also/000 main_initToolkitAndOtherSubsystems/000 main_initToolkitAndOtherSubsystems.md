
# 1 Journal

2025-09-25 Wk 39 Thu - 05:20

```diff
main_initToolkitAndOtherSubsystems:
-  mov r0, #1
+  //mov r0, #1
+  pop {pc}
```

Disabling this causes the game to no longer boot. Mark it `#critical`. 

```
tools/doc_scripts/replacesig.sh "main_initToolkitAndOtherSubsystems" "() -> ()"
```

2025-09-25 Wk 39 Thu - 06:07

`loc_80004AA` in `main_initToolkitAndOtherSubsystems` is only used within it. 

Why is it pushing r5?

