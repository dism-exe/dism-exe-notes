---
parent: '[[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]'
spawned_by: '[[001 Investigating slow bn repo lexer]]'
context_type: entry
---

Parent: [001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation](../001%20Turn%20EWRAM%20and%20ROM%20Structs%20into%20C%20Structs%20and%20embed%20into%20type%20for%20gdb%20memory%20manipulation.md)

Spawned by: [001 Investigating slow bn repo lexer](../investigations/001%20Investigating%20slow%20bn%20repo%20lexer.md)

Spawned in: [<a name="spawn-entry-535246" />^spawn-entry-535246](../investigations/001%20Investigating%20slow%20bn%20repo%20lexer.md#spawn-entry-535246)

# 1 Journal

2025-11-13 Wk 46 Thu - 13:58 +03:00

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

All is relative to probe 0. Encoding code blocks with `block_timing_start` and `block_timing_stop` and at end of the application call `block_timing_report`

This is meant to be quick and temporary and requires no dependencies besides std, hence the unsafe blocks.
