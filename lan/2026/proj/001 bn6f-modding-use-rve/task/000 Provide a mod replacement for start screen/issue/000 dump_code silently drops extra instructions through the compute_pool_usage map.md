---
context_type: issue
status: done
---

Parent: [[lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/000 Provide a mod replacement for start screen]]

Spawned by: [[lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/task/000 Replace Start Screen module with a module that reports via chatbox unimplemented in asm]]

Spawned in: [[lan/2026/proj/001 bn6f-modding-use-rve/task/000 Provide a mod replacement for start screen/task/000 Replace Start Screen module with a module that reports via chatbox unimplemented in asm#^spawn-issue-a29dcd|^spawn-issue-a29dcd]]

# Journal

2026-07-31 Wk 31 Fri - 09:27 +03:00

```sh
source ~/.venv/venv_main/bin/activate # must use with source

# in venv_main > /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
export RAW_DUMP=1
~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.sh bn6f.gba bn6f.sym 'None' 'sym:main_' 'sym:off_8000344'

export RAW_DUMP=0
~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.sh bn6f.gba bn6f.sym 'None' 'sym:main_' 'sym:off_8000344'

# out (relevant)
\tthumb_local_start
main_:
   0:   f000 f8f2       bl      0x1e8
   4:   f001 f928       bl      0x1258
   8:   f03f f900       bl      0x3f20c
   [...]
  80:   f000 f88a       bl      0x198
  84:   e7c4            b.n     0x10
  86:   0000            movs    r0, r0
\tthumb_func_end main_

main_:
        bl main_initToolkitAndOtherSubsystems
        bl SeedRNG
        bl clear_e200AD04
		[...]
        bx r0
        b loc_800031c
        .pool
        ldr r0, off_8000344 // =copyTo_iObjectAttr3001D70_3006814
\tthumb_func_end main_
```


Disabling 

```
# in ~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.sh
python3 $SCRIPT_PATH/dump_code.py compute_pool_usage $CONST_SYM_FILE $CONST_INPUT_PROG $start_addr_hex |
```

prevents this issue:

```
\tthumb_local_start
main_:
        bl main_initToolkitAndOtherSubsystems
        bl SeedRNG
        bl clear_e200AD04
		[...]
        bl main_static_screen_fade_8000454
        b loc_80002cc
        .balign 4, 0
\tthumb_func_end main_
```

2026-07-31 Wk 31 Fri - 10:08 +03:00

It will happen due to faulty assumption about the start of pool:

```python
# in tools/misc_scripts/dump_code/dump_code.py > fn AppComputePoolUsage::app_compute_pool_usage
elif cur_line_inst_idx > least_pool_location:
	# pool values do not need to be printed
	continue
```

Further, this excludes functions with pool in the middle of their body separated by a branch. We even considered middle of function pool case:

```python
# in tools/misc_scripts/dump_code/dump_code.py > fn AppComputePoolUsage::app_compute_pool_usage
elif cur_line_inst_idx > most_pool_location + 2:
	# This can happen with functions that have pool in the middle of their body.
	print(line)
```

But in principle it is possible to have multiple pools all around the function.

```python
# in tools/misc_scripts/dump_code/dump_code.py > fn AppComputePoolUsage::app_compute_pool_usage {
	last_line_inst_idx = get_last_line_inst_idx(inp)
	file_debug_log(f'(last_line_inst_idx {hex(last_line_inst_idx)})');
# }

# in venv_main > /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
export RAW_DUMP=0
~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.sh bn6f.gba bn6f.sym 'None' 'sym:main_' 'sym:off_8000344'

# in debug.log
(last_line_inst_idx 0x86)
```

The last line being 0x86 matches the raw dump.

```python
# in tools/misc_scripts/dump_code/dump_code.py > fn AppComputePoolUsage::app_compute_pool_usage {
	line_to_pool32_loc_and_islocal_map = cls.get_line_to_pool32_loc_and_islocal_map(inp, last_line_inst_idx)
	file_debug_log(f'(line_to_pool32_loc_and_islocal_map {line_to_pool32_loc_and_islocal_map})');
	
	(least_pool_location, least_pool_location_is_local) = sorted(line_to_pool32_loc_and_islocal_map.values())[0]
	(most_pool_location, most_pool_location_is_local) = sorted(line_to_pool32_loc_and_islocal_map.values())[-1]
	file_debug_log(f'(least_pool_location {least_pool_location}) (is_local {least_pool_location_is_local}');
	file_debug_log(f'(most_pool_location {most_pool_location}) (is_local {most_pool_location_is_local}');
# }

# in venv_main > /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
export RAW_DUMP=0
~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.sh bn6f.gba bn6f.sym 'None' 'sym:main_' 'sym:off_8000344'

# in debug.log
(line_to_pool32_loc_and_islocal_map {'  52:\t4802      \tldr\tr0, [pc, #8]\t; (0x5c)': (92, True), '  7a:\t4803      \tldr\tr0, [pc, #12]\t; (0x88)': (136, False)})
(least_pool_location 92) (is_local True
(most_pool_location 136) (is_local False
```

```sh
python3 -c "print(hex(136), hex(92))" # out { 0x88 0x5c }
```

So least pool location is interpreted here:

```
  5a:   0000            movs    r0, r0
  5c:   e3f1            b.n     0x842
  5e:   087f            lsrs    r7, r7, #1
```

We definitely should not just ignore everything after the least, this means we're still not abiding by the fact that pool can occur in the middle. What we need is to identify all pool lines, ~~not regions~~ (we do use contiguous regions but we need to identify each line to form them first) nor a heuristic they're at the end, and only filter those out from printing, replaced by `.pool`.

```python
# in tools/misc_scripts/dump_code/dump_code.py > fn AppComputePoolUsage::app_compute_pool_usage {
	line_to_pool32_loc_and_islocal_map = cls.get_line_to_pool32_loc_and_islocal_map(inp, last_line_inst_idx)
	file_debug_log(f'(line_to_pool32_loc_and_islocal_map {line_to_pool32_loc_and_islocal_map})')
# }

# in venv_main > /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
export RAW_DUMP=0
~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.sh bn6f.gba bn6f.sym 'None' 'sym:main_' 'sym:off_8000344'

# in debug.log
(line_to_pool32_loc_and_islocal_map {'  52:\t4802      \tldr\tr0, [pc, #8]\t; (0x5c)': (92, True), '  7a:\t4803      \tldr\tr0, [pc, #12]\t; (0x88)': (136, False)})
```

We can use this to get a list of all pool locations, then add `.pool` at the start of each contiguous region, otherwise add 0 padding or skip

```python
# in tools/misc_scripts/dump_code/dump_code.py > fn AppComputePoolUsage::app_compute_pool_usage {
	pool32_locs = (
		line_to_pool32_loc_and_islocal_map
			.values()
			.__iter__()
			| pipe.OfIter[Tuple[int, bool]].map(lambda loc_and_islocal: loc_and_islocal[0])
			| pipe.OfIter[int].to_list()
	)
	file_debug_log(f'(pool32_locs {pool32_locs})')
# }

# in venv_main > /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
export RAW_DUMP=0
~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.sh bn6f.gba bn6f.sym 'None' 'sym:main_' 'sym:off_8000344'

# in debug.log
(pool32_locs [92, 136])
```

```python
# in tools/misc_scripts/dump_code/dump_code.py > fn AppComputePoolUsage::app_compute_pool_usage {
	grouped_pool32_locs = cls.get_pool32_locs_contiguous_groups(pool32_locs)
	file_debug_log(f'(grouped_pool32_locs {grouped_pool32_locs})')
# }

# in venv_main > /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
export RAW_DUMP=0
~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.sh bn6f.gba bn6f.sym 'None' 'sym:main_' 'sym:off_8000344'

# in debug.log
(grouped_pool32_locs [[92], [136]])
```

```python
# in tools/misc_scripts/dump_code/dump_code.py > fn AppComputePoolUsage::app_compute_pool_usage {
	grouped_pool32_least_locs = (
		grouped_pool32_locs
			.__iter__()
			| pipe.OfIter[List[int]].map(lambda l: l[0])
			| pipe.OfIter[int].to_list()
	)
	file_debug_log(f'(grouped_pool32_least_locs {grouped_pool32_least_locs})')
# }

# in venv_main > /home/lan/src/cloned/cb/lan22h/branches/bn6f-modding@use-rve/bn6f
export RAW_DUMP=0
~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.sh bn6f.gba bn6f.sym 'None' 'sym:main_' 'sym:off_8000344'

# in debug.log
(grouped_pool32_least_locs [92, 136])
```

For this case, the least locations just the same as the locations themselves. These should be where `.pool` is.

The last pool is at `0x88`, and yet we stop the dump at `0x86`, need to adjust the end address. `main_subsystemJumpTable` should be after the pool.

Also the reason there is a `.pool` in the middle there is me!

```asm
# in asm/main.s > fn main_
	.ifdef USE_MOD
		  // hook to modding.s
		  ldr r0, =main_hook+1
		  mov lr, pc
		  bx r0
		  b main_endHook
		  .pool
		main_endHook:
```

2026-08-01 Wk 31 Sat - 09:06 +03:00

```
        b loc_800031c
        .pool
        lsr r7, r7, #1
loc_800031c:

[...]

        bl main_static_screen_fade_8000454
        b loc_80002cc
        .pool
        lsl r0, r0, #0xc
        lsl r4, r1, #0xd
        lsr r0, r0, #0x20
\tthumb_func_end main_
```

The data at the end `.pool` remains to be handled, but this has resolved the function body dropping. 

```diff
# in tools/misc_scripts/dump_code/dump_code.py > fn AppComputePoolUsage::app_compute_pool_usage
	within_pool_region_checks = (
		grouped_pool32_locs
			.__iter__()
-			| pipe.OfIter[List[int]].map(lambda locs: cur_line_inst_idx >= locs[0] and cur_line_inst_idx <= locs[-1])
+			| pipe.OfIter[List[int]].map(lambda locs: cur_line_inst_idx >= locs[0] and cur_line_inst_idx < locs[-1] + 4)
			| pipe.OfIter[bool].to_list()
	)
```

We should account for the fact that each pool location is a 32-bit region (4 bytes), and so we are still within until last one + 4. This fixes the first instance but not the second:

```
        b loc_800031c
        .pool
loc_800031c:

[...]

        b loc_80002cc
        .pool
        lsl r4, r1, #0xd
        lsr r0, r0, #0x20
```

Also need to make sure the pool contiguous groups are sorted.

We use more than just one pool. It should show up. Actually because of `USE_MOD`, we're no longer using `main_subsystemJumpTable`, at least not here. It is done in the hook. So for this test, we should end with `off_8000348`. And for that it works as expected:

```
        b loc_80002cc
        .pool
\tthumb_func_end main_
```

2026-08-01 Wk 31 Sat - 09:47 +03:00

```
# in /home/lan/src/cloned/gh/dism-exe/bn6f
git commit

# out
[master 85203097] dump_code: fix compute_pool_usage not accounting for multiple pool regions
```

OK