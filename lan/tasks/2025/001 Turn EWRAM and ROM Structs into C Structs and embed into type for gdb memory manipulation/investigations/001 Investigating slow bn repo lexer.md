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
