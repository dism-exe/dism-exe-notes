# Journal

2026-05-23 Wk 21 Sat - 02:25 +03:00

We understand things better when we can play with them and modify them. For a while, we could not edit the bn6f source because of ROM shifting problems. This is still a problem, but now the game is slightly more playable. More on that in [Wiki Bn6f ROM Shifting](../../../proj/000%20bn6f-rom-shifting/wiki/000%20Wiki%20Bn6f%20ROM%20Shifting/000%20Wiki%20Bn6f%20ROM%20Shifting.md).

The advantage of reading the main source code in assembly is it answers questions about how the developers implemented the game with the tools they had at the time, and exactly what their way of writing it is. A disassembly preserves this information, it is a digital archaeology project in that sense. We want to extend that with this port, although the code would be different, there is benefit to proving that different code is nonetheless behaviorally equivalent to the code they wrote. This can help us understand the system itself, modular implementation details. A port is hard. To be able to write this port requires already we understand the system that is bn6f; since it always must behave identically. There is also no metric test for "behaves identically", as there is for a disassembly (Exact ROM checksum). But for now we can attempt to boost our confidence in this with tests and manual visual checking. There may also be more sophisticated methods to develop, such as exact mgba state log files for a given movie.

We will repurpose [gh LanHikari22/bn6f-modding](https://github.com/LanHikari22/bn6f-modding) for this. The rust port and modding should go hand in hand. If we want to mod, we probably want to already be operating at the highest level of system description available to us.

2026-05-23 Wk 21 Sat - 02:52 +03:00

~~The first thing we find is that `bn6f` is not set as an upstream. It should be, we will be pulling from there disassembly progress.~~

Actually let's not do that, they really are simply separate projects with separate aims. They do not share a fork relation, but rather a use relation.

2026-05-23 Wk 21 Sat - 07:04 +03:00

With commit `1a0440a` now, `bn6f-modding` no longer duplicates `bn6f` as a project. It will fetch it and install the hooks and changes necessary to be able to develop an asm mod automatically with `fetch_bn6f.sh`.  Now to make a GBA rust project!

::Aside

* Interesting read: [medium @suryyyansh forgotten runtime post](https://medium.com/@suryyyansh/the-forgotten-runtimes-0872a1e5fd2a): a post running an analysis on C and rust runtimes
* [gh rust-console/min-gba](https://github.com/rust-console/min-gba): Could be useful to read for the minimum needed to build a GBA ROM with Rust.

::

We can build the clone with [gh agbrs/agb](https://github.com/agbrs/agb). (template: [gh agbrs/template](https://github.com/agbrs/template))

2026-05-23 Wk 21 Sat - 08:11 +03:00

https://doc.rust-lang.org/stable/embedded-book/peripherals/singletons.html: This could be a pattern to use when we get to cloning peripheral use.

2026-05-23 Wk 21 Sat - 23:41 +03:00

agb seems pretty high level for our purposes here which is cloning. There is also [docs.rs gba](https://docs.rs/gba/latest/gba/). This at least does expose all the IO registers: [gba/mmio/index.html](https://docs.rs/gba/latest/gba/mmio/index.html).

2026-05-24 Wk 21 Sun - 00:31 +03:00

Had to add some custom dummy tester that doesn't do anything to get that `#![no_std]` to be accepted by rust. We need the linkerscripts now.

[gh rust-console/gba](https://github.com/rust-console/gba)
