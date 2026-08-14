---
parent: '[[002 bn6f ROM shifting]]'
spawned_by: '[[006 Attempt to modify mgba to get information on save corruption gunner issue]]'
context_type: task
status: done
---

Parent: [002 bn6f ROM shifting](../002%20bn6f%20ROM%20shifting.md)

Spawned by: [006 Attempt to modify mgba to get information on save corruption gunner issue](../investigations/006%20Attempt%20to%20modify%20mgba%20to%20get%20information%20on%20save%20corruption%20gunner%20issue.md)

Spawned in: [^spawn-task-30bc6f](../investigations/006%20Attempt%20to%20modify%20mgba%20to%20get%20information%20on%20save%20corruption%20gunner%20issue.md#spawn-task-30bc6f)

# 1 Journal

2025-12-27 Wk 52 Sat - 11:56 +03:00

We need to deal with massive data processing things like

````
cat a | python3 ~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.py ea_to_sym_filter bn6f.sym --shift -2 > b.log
````

So far we get readings like

````
read_lines: 100.97026824951172ms
process_line: 10.37287712097168ms
process_line: 6.156444549560547ms
process_line: 6.182193756103516ms
process_line: 6.120920181274414ms
process_line: 6.153345108032227ms
````

````python
    import time
    time_file = open('time.log', 'w')

    def capture_time(start: time.time, time_file, prefix: str):
        end = time.time()

        diff_ms = (end - start) * 1000

        time_file.write(f"{prefix}: {diff_ms}ms\n")
````

Let's see if this improves it:

````python
// in fn app_ea_to_sym_filter
// in fn process_line
# if '_' + ea_token in mut_out:
#     mut_out = mut_out.replace('_' + ea_token, '<<<PLACEHOLDER>>>')
#     mut_out = mut_out.replace(ea_token, sym)
#     mut_out = mut_out.replace('<<<PLACEHOLDER>>>', '_' + ea_token)
# else:
#     mut_out = mut_out.replace(ea_token, sym)

mut_out = mut_out.replace(ea_token, sym, 1)
````

On recommandation of this [stackexchange answer](https://unix.stackexchange.com/a/202889),

````sh
sudo apt-get install datamash
````

````sh
cat time.log | grep 'process_line' | head -n100 | sed 's/process_line: //g' | sed 's/ms//g' | datamash count 1 mean 1 sstdev 1 --header-out

# out
count(field-1)  mean(field-1)   sstdev(field-1)
100     7.3831343650818 2.0574766401328
````

After the change:

````sh
cat time.log | grep 'process_line' | head -n10000 | sed 's/process_line: //g' | sed 's/ms//g' | datamash count 1 mean 1 sstdev 1 --header-out

# out
count(field-1)  mean(field-1)   sstdev(field-1)
10000   7.4661389827728 3.4437274869463
````

Before the change:

````sh
cat time.log | grep 'process_line' | head -n10000 | sed 's/process_line: //g' | sed 's/ms//g' | datamash count 1 mean 1 sstdev 1 --header-out

# out
count(field-1)  mean(field-1)   sstdev(field-1)
10000   8.0602656841278 3.7636151404117
````

So it seems to help.

There is fluctuation however across test runs. So here's measuring this again for after the change:

````sh
cat time.log | grep 'process_line' | head -n10000 | sed 's/process_line: //g' | sed 's/ms//g' | datamash count 1 mean 1 sstdev 1 --header-out

# out
count(field-1)  mean(field-1)   sstdev(field-1)
10000   7.7809272527695 3.8850247886344
````

2025-12-27 Wk 52 Sat - 12:22 +03:00

Ok so this is our baseline. The next change is to avoid parsing int twice, so `get_ea_tokens` should return the parsed int to be reused.

This is after the change:

````sh
cat time.log | grep 'process_line' | head -n10000 | sed 's/process_line: //g' | sed 's/ms//g' | datamash count 1 mean 1 sstdev 1 --header-out

# out
count(field-1)  mean(field-1)   sstdev(field-1)
10000   7.5600828886032 3.8234654181861
````

It's unclear if it's a positive, but also these values seem to fluctuate a lot. For example here's at `N=30000`:

````sh
cat time.log | grep 'process_line' | head -n30000 | sed 's/process_line: //g' | sed 's/ms//g' | datamash count 1 mean 1 sstdev 1 --header-out

# out
count(field-1)  mean(field-1)   sstdev(field-1)
30000   7.2689646402995 3.696372371203
````

2025-12-27 Wk 52 Sat - 12:33 +03:00

Let's do a component timing analysis on `process_line`,

````python
def process_line(line: str):
	start = time.time()
	ea_tokens_and_parsed = get_ea_tokens_and_parsed(line)
	capture_time(start, time_file, 'C1')

	mut_out = line

	for (ea_token, ea) in ea_tokens_and_parsed:
		start = time.time()
		sym = get_ea_symbol_or_shifted(syms, ea + shift)
		capture_time(start, time_file, 'C2')

		start = time.time()
		mut_out = mut_out.replace(ea_token, sym, 1)
		capture_time(start, time_file, 'C3')

	start1 = time.time()
	print(mut_out)
	capture_time(start1, time_file, 'C4')
	capture_time(start, time_file, 'Full')
````

````sh
cat time.log | grep 'C1' | head -n30000 | sed 's/C1: //g' | sed 's/ms//g' | datamash count 1 mean 1 sstdev 1 --header-out

# out
count(field-1)  mean(field-1)   sstdev(field-1)
30000   0.015759841601054       0.006223772431793
# /out

cat time.log | grep 'C2' | head -n30000 | sed 's/C2: //g' | sed 's/ms//g' | datamash count 1 mean 1 sstdev 1 --header-out

# out
count(field-1)  mean(field-1)   sstdev(field-1)
30000   3.6352231899897 2.2043790917782
# /out

cat time.log | grep 'C3' | head -n30000 | sed 's/C3: //g' | sed 's/ms//g' | datamash count 1 mean 1 sstdev 1 --header-out

# out
count(field-1)  mean(field-1)   sstdev(field-1)
30000   0.0011565685272217      0.00070606893738785
# /out

cat time.log | grep 'C4' | head -n30000 | sed 's/C4: //g' | sed 's/ms//g' | datamash count 1 mean 1 sstdev 1 --header-out

# out
count(field-1)  mean(field-1)   sstdev(field-1)
30000   0.0030404567718506      0.0054302612085799
# /out

cat time.log | grep 'Full' | head -n30000 | sed 's/Full: //g' | sed 's/ms//g' | datamash count 1 mean 1 sstdev 1 --header-out

# out
count(field-1)  mean(field-1)   sstdev(field-1)
30000   0.0086308876673381      0.0082820761099196
# /out
````

We did not measure it right. Let's be careful with these variable names `start`.

````python
def process_line(line: str):
	start0 = time.time()
	ea_tokens_and_parsed = get_ea_tokens_and_parsed(line)
	capture_time(start0, time_file, 'C1')

	mut_out = line

	for (ea_token, ea) in ea_tokens_and_parsed:
		start1 = time.time()
		sym = get_ea_symbol_or_shifted(syms, ea + shift)
		capture_time(start1, time_file, 'C2')

		start1 = time.time()
		mut_out = mut_out.replace(ea_token, sym, 1)
		capture_time(start1, time_file, 'C3')

	start2 = time.time()
	print(mut_out)
	capture_time(start2, time_file, 'C4')
	capture_time(start0, time_file, 'Full')
````

````
process_line: 6.332159042358398ms
C1: 0.017404556274414062ms
C2: 3.072023391723633ms
C3: 0.0007152557373046875ms
C2: 0.001430511474609375ms
C3: 0.000476837158203125ms
C2: 3.059864044189453ms
C3: 0.000476837158203125ms
C4: 0.003337860107421875ms
Full: 6.171941757202148ms
````

We can also see that the portions happen with different frequency.

````sh
cat time.log | grep 'C1' | head -n30000 | sed 's/C1: //g' | sed 's/ms//g' | datamash count 1 mean 1 sstdev 1 --header-out

# out
count(field-1)  mean(field-1)   sstdev(field-1)
30000   0.015990130106608       0.0057811272118053
# /out

cat time.log | grep 'C2' | head -n30000 | sed 's/C2: //g' | sed 's/ms//g' | datamash count 1 mean 1 sstdev 1 --header-out

# out
count(field-1)  mean(field-1)   sstdev(field-1)
30000   3.7719574689865 2.2284901530898
# /out

cat time.log | grep 'C3' | head -n30000 | sed 's/C3: //g' | sed 's/ms//g' | datamash count 1 mean 1 sstdev 1 --header-out

# out
count(field-1)  mean(field-1)   sstdev(field-1)
30000   0.0011317173639933      0.00071358504728406
# /out

cat time.log | grep 'C4' | head -n30000 | sed 's/C4: //g' | sed 's/ms//g' | datamash count 1 mean 1 sstdev 1 --header-out

# out
count(field-1)  mean(field-1)   sstdev(field-1)
30000   0.0030918518702189      0.0056932527614383
# /out

cat time.log | grep 'Full' | head -n30000 | sed 's/Full: //g' | sed 's/ms//g' | datamash count 1 mean 1 sstdev 1 --header-out

# out
count(field-1)  mean(field-1)   sstdev(field-1)
30000   7.6080896298091 3.6907804714956
# /out
````

so `C2` often repeats twice, and is the bulk of time being spent. Let's investigate it.

2025-12-27 Wk 52 Sat - 12:51 +03:00

One issue is that I've implemented `ea_to_maximum_ea_before_using_syms` as `O(N)` where `N` is the number of symbols, and this is for each symbol it's applied to, which in our case is most. Let's improve so that retrieval can be `O(1)` in time by use of memory.

2025-12-27 Wk 52 Sat - 13:09 +03:00

It's extremely faster once we populate the whole space and make retrieval `O(1)`, though I still have to test correctness.

````sh
cat time.log | grep 'process_line' | head -n1000000 | sed 's/process_line: //g' | sed 's/ms//g' | datamash count 1 mean 1 sstdev 1 --header-out

# out
count(field-1)  mean(field-1)   sstdev(field-1)
367647  0.014232711818555       0.0039744587114831
````

We're recovering

````python
if '_' + ea_token in mut_out:
    mut_out = mut_out.replace('_' + ea_token, '<<<PLACEHOLDER>>>')
    mut_out = mut_out.replace(ea_token, sym)
    mut_out = mut_out.replace('<<<PLACEHOLDER>>>', '_' + ea_token)
else:
    mut_out = mut_out.replace(ea_token, sym)
````

It's more likely to be correct, and it didn't have a big impact on the timing.

There was an issue with range, where I used `range(N, M)` instead of `range(1, M-N)` to get actual indices instead of values from `N` to `M` but besides that it seems correct now, and it's fast that we can filter an original 295mb log file.
