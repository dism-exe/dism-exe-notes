---
parent: '[[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]'
spawned_by: '[[002 Continuing impl for bn_repo_editor to parse struct info from the repo]]'
context_type: investigation
status: todo
---

Parent: [001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation](../001%20Turn%20EWRAM%20and%20ROM%20Structs%20into%20C%20Structs%20and%20embed%20into%20type%20for%20gdb%20memory%20manipulation.md)

Spawned by: [002 Continuing impl for bn_repo_editor to parse struct info from the repo](../tasks/002%20Continuing%20impl%20for%20bn_repo_editor%20to%20parse%20struct%20info%20from%20the%20repo.md)

Spawned in: [<a name="spawn-invst-088e2e" />^spawn-invst-088e2e](../tasks/002%20Continuing%20impl%20for%20bn_repo_editor%20to%20parse%20struct%20info%20from%20the%20repo.md#spawn-invst-088e2e)

# 1 Journal

2025-06-14 Wk 24 Sat - 06:45

````
145.86541107s Scanning "/home/lan/src/cloned/gh/dism-exe/bn6f/asm/asm31.s"
This took 1413.73046379s
1559.595904427s Writing to "/home/lan/data/apps/bn_repo_editor/lexer/asm/asm31.s"
This took 18934.689293169s
Full took 20348.422512138s
````

This is way too slow. Need to find out what the bottleneck here is. This file has 821338 tokens. Original file has 168866 lines.

2025-06-14 Wk 24 Sat - 21:04

Setup profiling according to [this tutorial](001%20Investigating%20slow%20bn%20repo%20lexer.md#tut1) for flamegraph:

````sh
sudo apt-get install linux-tools-common linux-tools-generic
cargo install flamegraph
cargo build --release

# It's at 4, make it 1 temporarily
sudo sysctl -w kernel.perf_event_paranoid=1

CARGO_PROFILE_RELEASE_DEBUG=true cargo flamegraph --bin bn_repo_editor --  gen_debug_elf --regen

# reset back to 4
sudo sysctl -w kernel.perf_event_paranoid=4
````

2025-06-15 Wk 24 Sun - 09:10

It seems that my use of im::vector is very inefficient. But this view is also sort of hard to navigate.

![Pasted image 20250615090851.png](../../../../../attachments/Pasted%20image%2020250615090851.png)

Let's try to use pprof. See [instructions](001%20Investigating%20slow%20bn%20repo%20lexer.md#343-pprof-rust-setup-to-create-profilepb).

2025-06-16 Wk 25 Mon - 08:10

For testing, we need to make it lexalize only two files:

````rust
fn app_lexer_scan_repo_files_to_dir(
	[...]
        .filter(|path| path.ends_with("asm00_0.s") || path.ends_with("asm00_1.s"))
````

````sh
$ cargo run gen_debug_elf --regen
$ sudo apt-get install graphviz
$ ~/go/bin/pprof -svg target/debug/bn_repo_editor profile.pb
````

![Pasted image 20250616083716.png](../../../../../attachments/Pasted%20image%2020250616083716.png)

We have some folds to optimize away. The graph included a [link](001%20Investigating%20slow%20bn%20repo%20lexer.md#docs2) to documentation for how to read it.

2025-06-16 Wk 25 Mon - 09:25

* use of `Vector<T>` from the im crate for structural sharing and then doing concats on it in a loop like `&acc + &vector![item]` is slow. Replace with mutable pushs to Vec.

2025-06-16 Wk 25 Mon - 10:16

![Pasted image 20250616101635.png](../../../../../attachments/Pasted%20image%2020250616101635.png)

We still have to optimize `lexer_write_scanned_items_to_file`. This was written quickly for debugging, so it's not optimized. It rebuilds the files scanned on-the-fly to parse lineno info, which causes huge slowdowns. Still, let's try to do that hack better before we retire it completely.

* First immediate flag is immutable string concats within folds for the reconstructed file. Let's turn that into mutable edits.
* We also, as we reconstruct the file, call `get_lineno_and_col_at_index` which keeps turning the build string into lines again and again. This is unnecessary. Give it all the lines at  once, and let it use index to find the lineno and col by only searching the lines.

2025-06-16 Wk 25 Mon - 11:30

![Pasted image 20250616113144.png](../../../../../attachments/Pasted%20image%2020250616113144.png)

It seems creating file content -> lines iter is still expensive, despite that we only do it once per file now. This is over debug. We'll also try over release.

![Pasted image 20250616114346.png](../../../../../attachments/Pasted%20image%2020250616114346.png)

We get more readable and logical flows over release! It's also much faster.

![Pasted image 20250616114556.png](../../../../../attachments/Pasted%20image%2020250616114556.png)

This is our most expensive call right now. `core slice memchr memchr_aligned`

[this forum answer](001%20Investigating%20slow%20bn%20repo%20lexer.md#forum1-ans1) has nice recommendations on using radare2 to generate a call graph png from an executable, which could be helpful in tracing problems like this.

We can look at that `get_lineno_and_col_at_index` in the assembly and source

````sh
objdump -d target/release/bn_repo_editor | less
````

# 2 Logs for improved times and actions

2025-06-16 Wk 25 Mon - 10:59

(Debug)

|Trial (#)|asm00_0 Scan|asm00_0 Write|asm00_0 Full|asm00_1 Scan|asm00_1 Write|asm00_1 Full|
|---------|------------|-------------|------------|------------|-------------|------------|
|0|15.87s|16.14s|32.0s|43.22s|164.21s|207.43s|
|1|11.83s|16.64s|28.47s|37.96s|162.18s|200.13s|
|2|12.78s|14.78s|27.56s|37.30s|155.65s|192.95s|
|3|12.18s|15.89s|28.06s|41.02s|166.53s|207.55s|

|Trial (#)|When|Notes|
|---------|----|-----|
|0|2025-06-16 Wk 25 Mon - 09:25|1.  Improvements to scan based on Vector concat usage. Used mutable variables and loops instead of folds.|
|1|2025-06-16 Wk 25 Mon - 10:57|1. lineno calc reuses lines iter from whole file and not recreate it from each accumulated portion of the file.<br>2. Did not show significant improvements in asm00_1 Write.|
|2|2025-06-16 Wk 25 Mon - 11:07|1. Dropped original file reconstruction. No longer used and just wastes cycles.|
|3|2025-06-16 Wk 25 Mon - 11:27|1. Logic only checks index within range or continues. We should break if the current index is above the query index not to waste cycles scanning the whole file when it's impossible to find anything.|

(Release)

|Trial (#)|asm00_0 Scan|asm00_0 Write|asm00_0 Full|asm00_1 Scan|asm00_1 Write|asm00_1 Full|
|---------|------------|-------------|------------|------------|-------------|------------|
|0|1.18s|2.40s|3.58s|3.76s|30.76s|34.53s|

|Trial (#)|When|Notes|
|---------|----|-----|
|0|2025-06-16 Wk 25 Mon - 11:40|1. Release has vast timing improvements over debug. But writing for asm00_1 is still very slow.|
||||

2025-06-27 Wk 26 Fri - 14:45

(update)
~~With parallelization and using RON for file writes, now it takes in total $\approx 104$ seconds to do lexical analysis on the whole repository, which contains 11,421,102 tokens in total.~~

2025-11-04 Wk 45 Tue - 00:29 +03:00

Might not have cleared cache? Or some other change caused it to get way slower? Unclear.

(/update)

2025-11-03 Wk 45 Mon - 22:45 +03:00

Continuing from [006 Dump scripts via script tracing](../../004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts/tasks/006%20Dump%20scripts%20via%20script%20tracing.md).

 > 
 > Scanning took `</build_scanner_or_fail 15354.411425704s>`  for `dat38_60.s` on release.  Need to know why. This file is full of data, 100176 lines currently. Each comma separated token repeats the scanning process.

We need to optimize the lexer more.

We want to use

````sh
~/go/bin/pprof -svg target/release/bn_repo_editor profile.pb
````

From the comments in `main.rs` and `Cargo.toml` it seems we need to add:

````toml
pprof = { version = "0.15.0", features = ["prost-codec"] }
````

````rust
// At the start of main
let guard = pprof::ProfilerGuardBuilder::default().frequency(1000).blocklist(&["libc", "libgcc", "pthread", "vdso"]).build().unwrap();

// At the end of main
use pprof::protos::Message;

match guard.report().build() {
	Ok(report) => {
		let mut file = fs::File::create("profile.pb").unwrap();
		let profile = report.pprof().unwrap();

		let mut content = Vec::new();
		profile.encode(&mut content).unwrap();
		std::io::Write::write_all(&mut file, &content).unwrap();
	}
	Err(_) => {}
};
````

Let's try it against `asm00_0.s`. This took 2.75s.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
~/go/bin/pprof -svg target/release/bn_repo_editor profile.pb
open profile001.svg
````

````
// In the header of profile001.svg:
Duration: 2.93s, Total samples = 1566ms (53.37%)
````

* `generate_or_fail` takes 89.91% ($\frac{1408 \text{ms}}{1566 \text{ms}}$)
  * `_find_index_to_insert_behind` takes 71.78% ($\frac{1124 \text{ms}}{1566 \text{ms}}$)

We need to cache `LexonType::variants_by_scan_precedence()` rather then recompute it for every token scan.

2025-11-03 Wk 45 Mon - 23:19 +03:00

Let's try again now with `LexonType::variants_by_scan_precedence()` cached by `build_scanner_or_fail` for the closure it returns.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin bn_repo_editor lexer

# out (relevant)
Repository Lexing stage took 34.886639ms
````

~~That's a big improvement from 2.75s~~

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
~/go/bin/pprof -svg target/release/bn_repo_editor profile.pb

# out
Generating report in profile002.svg
````

````
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
open profile002.svg
````

Not much is notable. Let's try with the bigger `dat38_60.s` and disable `LexerIncludeChunks` from interfering.

Actually, before trying `dat38_60.s`, ensure there was no caching interference:

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
rm -rf /home/lan/data/apps/bn_repo_editor/lexer
rm profile*
cargo run --release --bin bn_repo_editor lexer

# out (relevant)
Repository Lexing stage took 1.202244028s
````

Okay the improvements are more modest ($\frac{1.20 \text{s}}{2.75 \text{s}} = 0.436\%$). We need to keep clearing cache. This solution doesn't re-process files it's already touched.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
~/go/bin/pprof -svg target/release/bn_repo_editor profile.pb
open profile001.svg
````

````
// In the header of profile001.svg:
Duration: 1.20s, Total Samples = 235ms (19.53%)
````

* `build_scanner_or_fail {{closure}}` takes 66.38% ($\frac{156 \text{ms}}{235 \text{ms}}$)
  * `build_scanner_or_fail {{closure}} {{closure}}` takes 8.94% ($\frac{21 \text{ms}}{235 \text{ms}}$) of 53.19% ($\frac{125 \text{ms}}{235 \text{ms}}$)
    * `regex_capture_once` takes 36.17% ($\frac{85 \text{ms}}{235 \text{ms}}$)

They link to a [graph legend](https://git.io/JfYMW)

2025-11-04 Wk 45 Tue - 00:02 +03:00

Unsure what the N of X mean in the graph. Like the 9.84% for `build_scanner_or_fail {{closure}} {{closure}}`. There is a 21ms arrow pointing out of that towards `thread:bn_repo_editor` which is done for all leaf nodes. So I am guessing it means the amount of time spent not in its callees but in its body.

Anyway let's try again but with `dat38_60.s`.

We expect improvements only by a factor of 0.436%, which is still $0.436\% \times 15354 \approx 6700s \approx 112 \text{min}$

Let's start:

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
rm -rf /home/lan/data/apps/bn_repo_editor/lexer
rm profile*
cargo run --release --bin bn_repo_editor lexer
````

2025-11-04 Wk 45 Tue - 00:44 +03:00

````
verbose: 0
repo_path: "/home/lan/src/cloned/gh/dism-exe/bn6f/"
data_path: "/home/lan/data/apps/bn_repo_editor/"
[1934142::ThreadId(5)] 60.634787ms Processing "/home/lan/src/cloned/gh/dism-exe/bn6f/data/dat38_60.s"
[1934142::ThreadId(5)] 64.74749ms Scanning "/home/lan/src/cloned/gh/dism-exe/bn6f/data/dat38_60.s"
[1934142::ThreadId(5)] <build_scanner_or_fail>
[1934142::ThreadId(5)] </build_scanner_or_fail 2207.161193459s>
[1934142::ThreadId(5)] Scanning took 2207.178467003s
[1934142::ThreadId(5)] 2207.243237784s Writing to "/home/lan/data/apps/bn_repo_editor/lexer/data/dat38_60.s.lexer.ron"
[1934142::ThreadId(5)] File Scanning took 3.396550834s
[1934142::ThreadId(5)] Full took 2210.579171103s
Repository Lexing stage took 2210.649423163s
````

$2210 \text{s} \approx 39 \text{min}$  is better than expected, but still too slow. Let's check.

````rust
let t0 = std::time::Instant::now();
println!("[{pid}::{tid:?}] <build_scanner_or_fail>");

// This can be very expensive        
let res =
	comm_regex::exhaustively_process_using_scanners(s.trim(), build_scanner_or_fail());

println!("[{pid}::{tid:?}] </build_scanner_or_fail {:?}>", std::time::Instant::now() - t0);
````

Not the best named, it should be `<exhaustively_process_using_scanners>` instead of `<build_scanner_or_fail>`.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
~/go/bin/pprof -svg target/release/bn_repo_editor profile.pb
open profile001.svg
````

````
// In the header of profile001.svg:
Duration: 2210.70s, Total samples = 11340ms (0.51%)
````

* `build_scanner_or_fail` takes 7.20% ($\frac{816 \text{ms}}{11340 \text{ms}}$) of 74.51% ($\frac{8450 \text{ms}}{11340 \text{ms}}$)

Let's add a new lexon type just for entire data lines which start with `.{byte|word|hword}` and then just have a comma seperated list of hex values. This should at least be able to reduce processing many COMMAs and HEXs.

2025-11-04 Wk 45 Tue - 01:32 +03:00

(HowTo) From [stackoverflow answer](https://stackoverflow.com/a/3512504/6944447),

 > 
 > `?:` is used when you want to group an expression, but you do not want to save it as a matched/captured portion of the string.

2025-11-04 Wk 45 Tue - 02:17 +03:00

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
rm -rf /home/lan/data/apps/bn_repo_editor/lexer
rm profile*
cargo run --release --bin bn_repo_editor lexer

# out
verbose: 0
repo_path: "/home/lan/src/cloned/gh/dism-exe/bn6f/"
data_path: "/home/lan/data/apps/bn_repo_editor/"
[2596140::ThreadId(7)] 33.318722ms Processing "/home/lan/src/cloned/gh/dism-exe/bn6f/data/dat38_60.s"
[2596140::ThreadId(7)] 37.655114ms Scanning "/home/lan/src/cloned/gh/dism-exe/bn6f/data/dat38_60.s"
[2596140::ThreadId(7)] <exhaustively_process_using_scanners>
[2596140::ThreadId(7)] </exhaustively_process_using_scanners 145.78636427s>
[2596140::ThreadId(7)] Scanning took 145.787909343s
[2596140::ThreadId(7)] 145.825588327s Writing to "/home/lan/data/apps/bn_repo_editor/lexer/data/dat38_60.s.lexer.ron"
[2596140::ThreadId(7)] File Scanning took 597.388564ms
[2596140::ThreadId(7)] Full took 146.38967343s
Repository Lexing stage took 146.425970126s
````

Just processing data lines together instead of as `DIRECTIVE`s, `COMMA`s, and `HEX`s improved speed significantly as the calls to regex are much lower.

We're down to ~146s.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
git commit -m "added data_line lexon type"

# out
[main 7089130] added data_line lexon type
 15 files changed, 2015 insertions(+), 936 deletions(-)
 delete mode 100644 src/bin/dump_mapscript.rs
 create mode 100644 src/bin/dump_script.rs
 create mode 100644 src/util/eventflag.rs
````

I wonder if instead of one regex capture per data line, it would be even better with one regex capture per entire data block. It would make the processing a little more complicated since each line can have different data sizes, but it will significantly reduce the number of regex captures once more. Let's try it.

2025-11-04 Wk 45 Tue - 02:29 +03:00

It seems there's an overriding effect per capture group with `(...)+` only yielding the last. But it's fine because we can simply split this big pattern by lines, we don't need to extract everything with the capture groups, only to fit the entire pattern, although this could mean wasted compute between pattern checking and then again extraction.

2025-11-04 Wk 45 Tue - 02:42 +03:00

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
rm -rf /home/lan/data/apps/bn_repo_editor/lexer
rm profile*
cargo run --release --bin bn_repo_editor lexer

# out (relevant)
[2755228::ThreadId(21)] </exhaustively_process_using_scanners 131.721492116s>
````

~132s. The savings are pretty minimal in comparison.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
~/go/bin/pprof -svg target/release/bn_repo_editor profile.pb
open profile001.svg
````

````
// In the header of profile001.svg:
Duration: 132.20s, Total samples = 1091ms (0.83%)
````

* `build_scanner_or_fail {{closure}} {{closure}}` takes 0 of 58.75% ($\frac{641 \text{ms}}{1091 \text{ms}}$)
* `<impl serde::ser::Serialize for &T>` takes 0 of 30.61% ($\frac{334 \text{ms}}{1091 \text{ms}}$)

Seems the scanning time cost now is comparable to serialization time cost.

Checking `/home/lan/data/apps/bn_repo_editor/lexer/data/dat38_60.s.lexer.ron`, we now process 10320 lexons instead of 100k+.

2025-11-04 Wk 45 Tue - 03:10 +03:00

Let's try a full repository test now.

2025-11-04 Wk 45 Tue - 03:40 +03:00

````
[3035869::ThreadId(16)] </exhaustively_process_using_scanners 46.029658ms ERR>
[3035869::ThreadId(21)] </exhaustively_process_using_scanners 47.831998ms ERR>
[3035869::ThreadId(19)] </exhaustively_process_using_scanners 48.395243ms ERR>
[3035869::ThreadId(13)] </exhaustively_process_using_scanners 64.368752ms ERR>
[3035869::ThreadId(3)] </exhaustively_process_using_scanners 90.810383ms ERR>
````

Saying ERR but not failing... I'm trying to make it so that if any lexical scanning fails that the rayon parallel file scanning stops.

````
Failed to process lexer record: Failing fast on scan: "/home/lan/src/cloned/gh/dism-exe/bn6f/asm/asm28_0.s":34:0 Failed to scan: Capture does not contain data size (byte/hword/word) for hex buf: Line "" for ".byte 0x0C, 0x08, 0x08, 0xFF\n\n\t.word 0x4000105, 0x[...]" <buf>
        .byte 0x0C, 0</buf>
````

Data blocks can have an arbitrary amount of empty lines.

2025-11-04 Wk 45 Tue - 03:52 +03:00

````
[3099638::ThreadId(16)] </exhaustively_process_using_scanners 1.459079851s ERR Invariant Error: All hex buf values must start with 0x but "" did not: ".byte 0x0, 0x0, 0x8, -0x8\n\t.byte -0x8, 0x8, 0x8, 0[...]">
````

Even with returning an error in the map and collecting `.collect::<Result<...>>()` it still wouldn't stop after the first failure, but at least we can trace the last `ERR` in the buffer.

````
[3099638::ThreadId(10)] </exhaustively_process_using_scanners 116.384681038s #items: 10320>
[3099638::ThreadId(10)] 119.337681619s Writing to "/home/lan/data/apps/bn_repo_editor/lexer/data/dat38_60.s.lexer.ron"
[3099638::ThreadId(10)] File Writing took 247.199991ms
[3099638::ThreadId(10)] Full Scanning took 116.646856774s
````

Big pause here.

2025-11-04 Wk 45 Tue - 05:18 +03:00

````
[3099638::ThreadId(6)] </exhaustively_process_using_scanners 3434.583390021s #items: 771344>
[3099638::ThreadId(6)] 3434.719893148s Writing to "/home/lan/data/apps/bn_repo_editor/lexer/asm/asm31.s.lexer.ron"
[3099638::ThreadId(6)] File Writing took 2.406818129s
[3099638::ThreadId(6)] Full Scanning took 3437.006571157s
````

~3435s or ~57 minutes. `asm31.s` is mostly code and it's 174823 lines.

2025-11-04 Wk 45 Tue - 05:37 +03:00

[004 Reading and Writing LexerReport to RON files](../tasks/004%20Reading%20and%20Writing%20LexerReport%20to%20RON%20files.md) mentions:

 > 
 > For translating all the `.lexer.ron` files into a csv buffer to be analyzed with visidata, see  [Wk 26 000 Lexer RON to CSV for quick visidata inspection](../../../../llm/weekly/2025/Wk%2026%20000%20Lexer%20RON%20to%20CSV%20for%20quick%20visidata%20inspection.md).

So we can convert these RON files to csv using

````sh
find ~/data/apps/bn_repo_editor/lexer -type f | while read -r file; do echo "FILENAME $file"; cat $file; done | ~/src/exp/scripts/bn_lexer_ron2csv.py | vd -f csv
````

2025-11-04 Wk 45 Tue - 05:56 +03:00

(HowTo) Converting csv to md table. this [post](https://www.devutilhub.com/tool/csv-markdown-converter) recommends `csvtomd`, and this [post](https://gaultier.github.io/blog/tip_of_day_3.html) has a script solution.

So we can select all rows in a visidata view, `Edit > Copy > to system clipboard > selected rows` to get it in a csv format, then cat pipe that to `csvtomd`, and we can put the table here!

|filename|count|percent|histogram|
|--------|-----|-------|---------|
|asm/asm31.s.lexer.ron|768838|71.93|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■|
|asm/asm32.s.lexer.ron|146404|13.70|■■■■■■■|
|asm/asm29.s.lexer.ron|45679|4.27|■■|
|asm/chatbox.s.lexer.ron|38328|3.59|■|
|asm/map_script_cutscene.s.lexer.ron|17983|1.68||
|asm/asm28_0.s.lexer.ron|14995|1.40||
|asm/npc.s.lexer.ron|11958|1.12||
|asm/sprite.s.lexer.ron|7761|0.73||
|asm/asm25.s.lexer.ron|5392|0.50||
|asm/asm23.s.lexer.ron|4278|0.40||
|asm/asm34.s.lexer.ron|3852|0.36||
|asm/asm21.s.lexer.ron|1309|0.12||
|asm/main.s.lexer.ron|1132|0.11||
|asm/start.s.lexer.ron|674|0.06||
|asm/asm30_0.s.lexer.ron|225|0.02||

71.93% of all lexons now just live in `asm31.s`!  Though it's strange the count of these files is quite low.

It's failing to parse `DataBlock`.

2025-11-04 Wk 45 Tue - 06:30 +03:00

Updated the script in [Wk 26 000 Lexer RON to CSV for quick visidata inspection](../../../../llm/weekly/2025/Wk%2026%20000%20Lexer%20RON%20to%20CSV%20for%20quick%20visidata%20inspection.md).

This is the new statistics, cut out since there are many files:

|filename|count|percent|histogram|
|--------|-----|-------|---------|
|asm/asm31.s.lexer.ron|771344|40.93|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■|
|asm/asm32.s.lexer.ron|147416|7.82|■■■■■■■|
|asm/libs.s.lexer.ron|102739|5.45|■■■■■|
|asm/asm00_1.s.lexer.ron|67261|3.57|■■■|
|asm/asm36.s.lexer.ron|66974|3.55|■■■|
|asm/asm29.s.lexer.ron|45892|2.44|■■|
|asm/chatbox.s.lexer.ron|38569|2.05|■|
|asm/object.s.lexer.ron|24375|1.29|■|
|asm/asm00_0.s.lexer.ron|20489|1.09|■|
|asm/reqBBS.s.lexer.ron|19298|1.02||
|asm/asm38.s.lexer.ron|19207|1.02||
|asm/map_script_cutscene.s.lexer.ron|18447|0.98||

Let's look at a frequency analysis of the lexon types in `asm31.s.lexer.ron`,

|lexon_type|count|percent|histogram|
|----------|-----|-------|---------|
|Reg|170052|22.05|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■|
|Comma|139185|18.04|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■|
|ThumbOpcode|125160|16.23|■■■■■■■■■■■■■■■■■■■■■■■■■■■|
|Ident|76772|9.95|■■■■■■■■■■■■■■■■■|
|LiteralHash|62651|8.12|■■■■■■■■■■■■■■|
|LBrac|38577|5.00|■■■■■■■■|
|RBrac|38577|5.00|■■■■■■■■|
|UInt|28178|3.65|■■■■■■|
|ColonIdent|19664|2.55|■■■■|
|LCurly|13698|1.78|■■■|
|RCurly|13698|1.78|■■■|
|UHex|11424|1.48|■■|
|Directive|9962|1.29|■■|
|InlineComment|7795|1.01|■|
|Plus|5810|0.75|■|
|ThumbFuncEnd|5265|0.68|■|
|DataBlock|2506|0.32||
|Minus|1330|0.17||
|ThumbFuncStart|582|0.08||
|MathInfix|355|0.05||
|ArmOpcode|85|0.01||
|NegInt|6|0.00||
|Equals|4|0.00||
|Colon|4|0.00||
|MultilineComment|2|0.00||
|LParen|1|0.00||
|RParen|1|0.00||
|2025-11-04 Wk 45 Tue - 06:58 +03:00||||

Just as `Directive`, `Comma`, and `UHex` can be used as fallback for patterns that `DataBlock` does not handle, we can do the same with full instructions that full back to just `ThumbOpCode`, `Reg`, etc. Though there's the complication of values that may be labels or constants, but right now `Reg` and `ThumbOpCode` etc dominate the total number of lexons processed.

Here is the current total distribution of lexon types for all files combined:

|lexon_type|count|percent|histogram|
|----------|-----|-------|---------|
|Reg|328482|17.43|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■|
|Ident|293555|15.58|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■|
|Comma|287609|15.26|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■|
|ThumbOpcode|243171|12.90|■■■■■■■■■■■■■■■■■■■■■■■■■■■■|
|LiteralHash|112517|5.97|■■■■■■■■■■■■■|
|Directive|76394|4.05|■■■■■■■■|
|UHex|74895|3.97|■■■■■■■■|
|LBrac|72144|3.83|■■■■■■■■|
|RBrac|72144|3.83|■■■■■■■■|
|UInt|64706|3.43|■■■■■■■|
|ColonIdent|61564|3.27|■■■■■■■|
|String|37953|2.01|■■■■|
|Equals|26222|1.39|■■■|
|LCurly|24790|1.32|■■|
|RCurly|24790|1.32|■■|
|InlineComment|24544|1.30|■■|
|DataBlock|20732|1.10|■■|
|ThumbFuncEnd|10139|0.54|■|
|Plus|10084|0.54|■|
|DoubleColonLabel|9825|0.52|■|
|Minus|4884|0.26||
|ThumbFuncStart|1806|0.10||
|MathInfix|528|0.03||
|CustThumbOpcode|439|0.02||
|ArmOpcode|151|0.01||
|MultilineComment|131|0.01||
|Colon|80|0.00||
|LParen|40|0.00||
|RParen|40|0.00||
|NegHex|12|0.00||
|NegInt|11|0.00||
|ArmFuncEnd|5|0.00||
|MacroParam|4|0.00||
|ArmFuncStart|1|0.00||

2025-11-04 Wk 45 Tue - 07:14 +03:00

Also my `thumb_local_start` and `arm_local_start` lexon type is wrong. Those functions do not take any input label.

We also need to resolve this error from before:

````
[3099638::ThreadId(16)] </exhaustively_process_using_scanners 1.459079851s ERR Invariant Error: All hex buf values must start with 0x but "" did not: ".byte 0x0, 0x0, 0x8, -0x8\n\t.byte -0x8, 0x8, 0x8, 0[...]">
````

Why would `-0x8` match?

````rust
// in fn LexonType::to_regex
LexonType::DataBlock => r"(?:.(?:byte|hword|word) (?:(?:0x[A-Fa-f0-9]+,?\s*)+)\s*)+\s*".to_owned(),
````

This is from `SoulWeaponMapBasedCameraOffsets`.

````C
// in asm/asm37_1.s
SoulWeaponMapBasedCameraOffsets:
	.byte 0x0, 0x0, 0x8, -0x8
	.byte -0x8, 0x8, 0x8, 0x8
	.byte 0x8, 0x8, 0x10, 0x0
	.byte 0xC, 0x4, 0x4, -0x4
````

Even though there's no matching for `-`, `.byte 0x0, 0x0, 0x8,` do match... But this means then that there's an empty token `''` after the last comma. It's also interesting this only happened once. We're not supporting negative, since `DataBlock` is more meant for non-label, and uninterpreted huge data blocks which there are many of.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
git commit -m "impl datablock scanning"

# out
[main a3f34b1] impl datablock scanning
 4 files changed, 108 insertions(+), 662 deletions(-)
 delete mode 100644 profile.pb
````

Spawn [009 Impl Lexon types for whole thumb instructions](../tasks/009%20Impl%20Lexon%20types%20for%20whole%20thumb%20instructions.md) <a name="spawn-task-c84e3d" />^spawn-task-c84e3d

2025-11-13 Wk 46 Thu - 10:01 +03:00

Coming from [000 Investigate parsing gfx anim scripts](../../004%20Impl%20dumping%20for%20map%20npc%20and%20cutscene%20scripts/investigations/000%20Investigate%20parsing%20gfx%20anim%20scripts.md).

Last measure for `dat38_60.s` is

````
[2953102::ThreadId(1)] </exhaustively_process_using_scanners 1909.308244408s #items: 10322>
````

Removed the is match check from `regex_capture_once`, since we do want the captures and it seems like we would just be repeating work on correct guesses. Also made `s_short` into `s_short_fn` to reduce compute in happy path.

````sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor
cargo run --release --bin bn_repo_editor lexer_once "/home/lan/src/cloned/gh/dism-exe/bn6f/data/dat38_60.s"
````

````
[3169420::ThreadId(1)] </exhaustively_process_using_scanners 457.685365214s #items: 10324>
````

that's roughly 7.6 minutes now. Big improvement over 1909 seconds or nearly 32 minutes.

Let's try with bringing back `s_short` for at least one use to ensure it's calculated to see how much of an impact that had.

````
[3245191::ThreadId(1)] </exhaustively_process_using_scanners 2017.696603268s #items: 10324>
````

Seems it had a lot of influence. Running again with `s_short_fn` and still using

````rust
// in fn regex_capture_once
if !re.is_match(s) {
	return Err(FnErr::NoMatch(re.as_str().to_owned(), s.to_owned()));
}
````

````
[3477712::ThreadId(1)] </exhaustively_process_using_scanners 1895.50631985s #items: 10324>
````

Similarly very slow.

Hmm. `regex_capture_once` is supposed to be run many times, and we simply discard the errors.

Let's use an Option variant that does not waste cycles computing errors that would just be discarded while still including `re.is_match` and see if it helps us.

2025-11-13 Wk 46 Thu - 11:37 +03:00

Let's use these unsafe probes for some temporary time analysis:

````rust
static mut mut_opt_block_timer_0: Option<std::time::Instant> = None;
static mut mut_opt_block_timer_1: Option<std::time::Instant> = None;
static mut mut_block_dur_0: std::time::Duration = std::time::Duration::ZERO;
static mut mut_block_dur_1: std::time::Duration = std::time::Duration::ZERO;

pub unsafe fn block_timing_start(probe: usize) {
    if probe == 0 {
        mut_opt_block_timer_0 = Some(std::time::Instant::now());
    } else if probe == 1 {
        mut_opt_block_timer_1 = Some(std::time::Instant::now());
    }
}

pub unsafe fn block_timing_stop(probe: usize) {
    if probe == 0 {
        if let Some(t) = mut_opt_block_timer_0 {
            mut_block_dur_0 += std::time::Instant::now() - t;
        }
    } else if probe == 1 {
        if let Some(t) = mut_opt_block_timer_0 {
            mut_block_dur_1 += std::time::Instant::now() - t;
        }
    }
}

pub unsafe fn block_timing_get(probe: usize) -> std::time::Duration {
    if probe == 0 {
        mut_block_dur_0
    } else if probe == 1 {
        mut_block_dur_0
    } else {
        panic!("Probe does not exist");
    }
}
````

Two so that we can understand how long a portion of a function takes relative to the whole.

2025-11-13 Wk 46 Thu - 11:46 +03:00

This is shorter and more general, we can have as many probes as we need:

````rust
static mut MUT_OPT_BLOCK_TIMERS: [Option<std::time::Instant>; 4] = [None; 4];
static mut MUT_BLOCK_DURS: [std::time::Duration; 4] = [std::time::Duration::ZERO; 4];
static mut MUT_BLOCK_COUNTS: [u128; 4] = [0; 4];

pub unsafe fn block_timing_start(probe: usize) {
    unsafe {
        MUT_OPT_BLOCK_TIMERS[probe] = Some(std::time::Instant::now());
    }
}

pub unsafe fn block_timing_stop(probe: usize) {
    unsafe {
        if let Some(t) = MUT_OPT_BLOCK_TIMERS[probe] {
            MUT_BLOCK_DURS[probe] += std::time::Instant::now() - t;
            MUT_BLOCK_COUNTS[probe] += 1;
        }
    }
}

pub unsafe fn block_timing_report() {
    unsafe {
        let first = MUT_BLOCK_DURS[0];
        let mut mut_sum: std::time::Duration = std::time::Duration::ZERO;
        for (i, dur) in MUT_BLOCK_DURS.into_iter().enumerate() {
            mut_sum += dur;
            println!("{i} {dur:?} {} #{}", dur.as_secs_f64() / first.as_secs_f64(), MUT_BLOCK_COUNTS[i]);
        }
        mut_sum -= first;
        println!("Total {mut_sum:?} {}", mut_sum.as_secs_f64() / first.as_secs_f64());
    }
}
````

2025-11-13 Wk 46 Thu - 13:58 +03:00

Spawn [002 Code for Rust Timing Probes](../entries/002%20Code%20for%20Rust%20Timing%20Probes.md) <a name="spawn-entry-535246" />^spawn-entry-535246

2025-11-13 Wk 46 Thu - 11:54 +03:00

Let's try probing the parts of `regex_capture_once_opt`

````rust
pub fn regex_capture_once_opt(s: &str, re: &Regex) -> Option<(String, Vec<Option<String>>)> {
    unsafe {block_timing_start(0);}

    unsafe {block_timing_start(1);}
    if !re.is_match(s) {
        return None;
    }
    unsafe {block_timing_stop(1);}

    unsafe {block_timing_start(2);}
    let matches = re
        .captures(&s)?
        .iter()
        .map(|opt| {
            opt.and_then(|mtch| {
                Some(mtch.as_str().to_owned())
            })
        })
        .collect::<Vec<Option<String>>>();

    if matches.is_empty() {
        return None;
    }
    unsafe {block_timing_stop(2);}

    unsafe {block_timing_start(3);}
    let whole_match = matches[0].clone()?;
    unsafe {block_timing_stop(3);}

    unsafe {block_timing_start(4);}
    let remaining_matches = matches
        .into_iter()
        .skip(1)
        .collect::<Vec<_>>();
    unsafe {block_timing_stop(4);}

    unsafe {block_timing_stop(0);}

    Some((whole_match, remaining_matches))
}
````

````
[3787432::ThreadId(1)] </exhaustively_process_using_scanners 438.923997ms #items: 10324>
0 63.671352ms 1
1 1.927264ms 0.030268934763628075
2 55.445431ms 0.8708065599109628
3 3.31152ms 0.052009575672274086
4 1.140899ms 0.017918560925170867
````

438ms... It seems our decision to simplify error paths with expensive string copies significantly reduced the time.

2025-11-13 Wk 46 Thu - 12:07 +03:00

Running again, just improving the time probe reports to show accumulative to know how much of the function the other probes besides probe 0 accounted.

````
[3828077::ThreadId(1)] </exhaustively_process_using_scanners 749.655998ms #items: 10324>
0 102.719613ms 1
1 3.319837ms 0.032319407200258825
2 90.218615ms 0.8782997946068976
3 5.068319ms 0.04934129765461636
4 1.341332ms 0.013058187826311221
Total 99.948103ms 0.9730186872880838
````

Contrary to my assumptions before, using `is_match` did not hurt us. We've spent only 3% of the time in there compared to the heavy work with capturing groups spending 87% of the time.

Something else is taking the majority of the 749ms. What is that?

2025-11-13 Wk 46 Thu - 12:26 +03:00

Probing `fn scan`,

````rust
fn scan(
	s: &str,
	regex_scanners: &HashMap<LexonType, Regex>,
	variants_by_scan_precedence: &[LexonType],
) -> Result<Vec<LexerRecord>, (Vec<LexerRecord>, usize, ScanError)> {
	unsafe {block_timing_start(0);}

	let pid = std::process::id();
	let tid = thread::current().id();

	let t0 = std::time::Instant::now();
	println!("[{pid}::{tid:?}] <exhaustively_process_using_scanners>");

	unsafe {block_timing_start(1);}
	// This can be very expensive
	let res = comm_regex::exhaustively_process_using_scanners(
		s.trim(),
		build_scanner(regex_scanners, variants_by_scan_precedence),
	);
	unsafe {block_timing_stop(1);}

	let tup_to_record = |tup: (LexonType, LexonData, String)| {
		let (lexon_type, lexon_data, capture) = tup;

		LexerRecord {
			lexon_type,
			lexon_data,
			capture,
		}
	};

	unsafe {block_timing_start(2);}
	let out = {
		match res {
			Ok(items) => {
				println!(
					"[{pid}::{tid:?}] </exhaustively_process_using_scanners {:?} #items: {}>",
					std::time::Instant::now() - t0,
					items.len()
				);

				items
					.into_iter()
					.map(tup_to_record)
					.collect::<Vec<_>>()
					.pipe(|items| Ok(items))
			}
			Err((items, index, e)) => {
				println!(
					"[{pid}::{tid:?}] </exhaustively_process_using_scanners {:?} ERR {e}>",
					std::time::Instant::now() - t0
				);

				let new_items = { items.into_iter().map(tup_to_record).collect::<Vec<_>>() };

				Err((new_items, index, e))
			}
		}
	};
	unsafe {block_timing_stop(2);}

	unsafe {block_timing_stop(0);}

	out
}
````

````
0 704.823302ms 1
1 704.268692ms 0.9992131219293882
2 529.69µs 0.0007515216913188832
Total 704.798382ms 0.9999646436207071
````

2025-11-13 Wk 46 Thu - 12:35 +03:00

````rust
// in fn scan
unsafe {block_timing_start(1);}
let s_trim = s.trim();
unsafe {block_timing_stop(1);}

unsafe {block_timing_start(2);}
let try_scan_fn = build_scanner(regex_scanners, variants_by_scan_precedence);
unsafe {block_timing_stop(2);}

unsafe {block_timing_start(3);}
let res = comm_regex::exhaustively_process_using_scanners(
	s_trim,
	try_scan_fn,
);
unsafe {block_timing_stop(3);}
````

````
0 703.720916ms 1
1 659ns 0.0000009364507790187666
2 69ns 0.00000009805023331152488
3 703.088322ms 0.9991010726189643
Total 703.08905ms 0.9991021071199766
````

2025-11-13 Wk 46 Thu - 12:44 +03:00

````rust
// in fn exhaustively_process_using_scanners
unsafe {block_timing_start(0);}
loop {
	unsafe {block_timing_start(1);}
	if (&s[mut_acc_advance..]).is_empty() {
		break;
	}
	unsafe {block_timing_stop(1);}

	unsafe {block_timing_start(2);}
	let scan_opt = try_scan_fn(&s[mut_acc_advance..]);
	unsafe {block_timing_stop(2);}

	match scan_opt {
		Ok((item, advance)) => {
			mut_acc_items.push(item);

			let prev_acc_advance = mut_acc_advance;

			mut_acc_advance += advance;

			if prev_acc_advance >= s.len() {
				// We have reached the end
				break;
			}
		}

		Err(e) => {
			// We have failed to exhaaustively scan the buffer
			return Err((mut_acc_items, mut_acc_advance, e));
		}
	}
}
unsafe {block_timing_stop(0);}
````

````
0 709.117171ms 1
1 543.712µs 0.000766744936148218
2 705.00567ms 0.9942019440959214
Total 705.549382ms 0.9949686890320696
````

````rust
// in fn exhaustively_process_using_scanners
unsafe {block_timing_start(1);}
let s1 = &s[mut_acc_advance..];
unsafe {block_timing_stop(1);}

unsafe {block_timing_start(2);}
let scan_opt = try_scan_fn(s1);
unsafe {block_timing_stop(2);}
````

````
0 517.894057ms 1
1 340.492µs 0.0006574549280838726
2 515.511706ms 0.9953999259736629
Total 515.852198ms 0.9960573809017469
````

2025-11-13 Wk 46 Thu - 12:56 +03:00

````rust
// in fn build_scanner
    move |s: &str| {
        unsafe {block_timing_start(0);}

        let s_short_fn = || s.chars().take(50).collect::<String>().pipe(|s_short| {
            if s != s_short {
                format!("{s_short}[...]")
            } else {
                s_short
            }
        });

        unsafe {block_timing_start(1);}
        let (lexon_type, (whole, captures_opt)) = {
            let results = variants_by_scan_precedence
                .iter()
                .map(|lexon_type| {
                    comm_regex::regex_capture_once_opt(s, &regex_scanners[lexon_type])
                        .ok_or(FnErr::RegexCapture)?
                        .pipe(|(whole, captures_opt)| Ok((lexon_type.clone(), (whole, captures_opt))))
                })
                .take_while_inclusive(Result::<_, FnErr>::is_err) // Skip all errors to first success
                .collect::<Vec<_>>();

            results
                .into_iter()
                .last()
                .ok_or(FnInvErr::NoScannerRan(s_short_fn().to_owned()))?
                .map_err(|_| FnErr::NoScannerCaptures(s_short_fn().to_owned()))?
        };
        unsafe {block_timing_stop(1);}

        let lexon_data_type = lexon_type.to_lexon_data_type();

        unsafe {block_timing_start(2);}
        let (lexon_type, lexon_data) = {
			// [...]
        };
        unsafe {block_timing_stop(2);}

        unsafe {block_timing_stop(0);}

        Ok(((lexon_type, lexon_data, whole.to_owned()), whole.len()))
    }
````

````
0 701.78562ms 1
1 287.102888ms 0.40910340682101753
2 412.933219ms 0.588403648111228
Total 700.036107ms 0.9975070549322455
````

So processing the data is now taking longer. In our case, we're processing mostly data blocks, so let's just check against that portion for probe 2.

2025-11-13 Wk 46 Thu - 13:08 +03:00

Actually just gonna probe relative to this section for data buffer processing to find out what's taking long.

````rust
// in fn build_scanner
unsafe {block_timing_start(0);}
let sized_line_tokens = {
	whole
		.trim()
		.lines()
		.map(|line| line.trim())
		.filter(|line| !line.is_empty())
		.map(|line| {
			unsafe {block_timing_start(1);}
			let data_size = {
				// [...]
			};
			unsafe {block_timing_stop(1);}

			unsafe {block_timing_start(2);}
			let line1 = /* [...] */
			unsafe {block_timing_stop(2);}

			unsafe {block_timing_start(3);}
			let data = /* [...] */
			unsafe {block_timing_stop(3);}

			Ok((data_size, data))
		})
		.collect::<Result<Vec<_>, _>>()?
};
unsafe {block_timing_stop(0);}
````

````
0 423.507875ms 1
1 6.046872ms 0.014278062716071101
2 79.169572ms 0.1869376620210427
3 302.336827ms 0.7138871431847637
Total 387.553271ms 0.9151028679218774
````

2025-11-13 Wk 46 Thu - 13:23 +03:00

Improved the probe logic to also give us the counts or how many times each probe measured

````
0 246.406328ms 1 #3615
1 3.955349ms 0.016052140511586214 #96307
2 46.541207ms 0.18887991788912173 #96307
3 171.785647ms 0.6971641044867971 #96307
Total 222.282203ms 0.902096162887505
````

2025-11-13 Wk 46 Thu - 13:41 +03:00

For probes 2 and 3, removing instances of `.replace` with string slicing and avoiding the extra `.to_owned()` in probe 2.

````
0 174.90254ms 1 #3615
1 5.998224ms 0.03429466490309403 #96307
2 5.991893ms 0.034258467601442494 #96307
3 128.32665ms 0.7337037529586476 #96307
Total 140.316767ms 0.8022568854631843
````

Since this is a hot path, also removed the invariant defensive checks that should be impossible to hit for probe 3

````
[164079::ThreadId(1)] </exhaustively_process_using_scanners 291.353201ms #items: 10324>

0 111.485049ms 1 #3615
1 4.19892ms 0.03766352562665152 #96307
2 4.16943ms 0.03739900585234528 #96307
3 78.748107ms 0.7063557643500699 #96307
Total 87.116457ms 0.7814182958290666
````

````
[193872::ThreadId(1)] </exhaustively_process_using_scanners 456.959086ms #items: 10324>

0 159.112641ms 1 #3615
1 6.003207ms 0.03772929015740491 #96307
2 6.127045ms 0.03850759412635229 #96307
3 112.94628ms 0.7098510796511761 #96307
Total 125.076532ms 0.7860879639349333
````

There's some variance.

2025-11-13 Wk 46 Thu - 14:27 +03:00

The total number of lexons now is 1,052,337. It used to be 11,421,102 lexons in June 28th 2025.

````
Repository Lexing stage took 7.093197279s
````

We've also reduced the time from in just under 100s then to 7s now.
