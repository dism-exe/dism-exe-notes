---
parent: '[[004 Impl dumping for map npc and cutscene scripts]]'
spawned_by: '[[004 Impl dumping for map npc and cutscene scripts]]'
context_type: issue
status: done
---

Parent: [004 Impl dumping for map npc and cutscene scripts](../004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts.md)

Spawned by: [004 Impl dumping for map npc and cutscene scripts](../004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts.md)

Spawned in: [<a name="spawn-issue-e5f88c" />^spawn-issue-e5f88c](../004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts.md#spawn-issue-e5f88c)

# 1 Journal

2025-10-15 Wk 42 Wed - 12:47 +03:00

We changed `lan_rs_common` to require a feature for everything but did not update `bn_repo_editor`.

It needs `incl_regex`, and that needs `tap`. We need `incl_common`

Removing `i32_column_to_freq_map`, we will likely not be using `im`  crate

Adding `incl_io`, `incl_pipe`, `incl_test`

`rs_comm::io` $\to$ `rs_comm::util::io`, `rs_comm::test` $\to$ `rs_comm::util::test`

`incl_test` needs to use `rand`
