---
parent: "[[000 Exploring bn6f save data]]"
spawned_by: "[[000 Wk 39 Exploring bn6f save data]]"
context_type: investigation
status: todo
---

Parent: [[000 Exploring bn6f save data]]

Spawned by: [[000 Wk 39 Exploring bn6f save data]]

Spawned in: [[000 Wk 39 Exploring bn6f save data#^spawn-invst-b987ec|^spawn-invst-b987ec]]

# 1 Journal

2025-11-14 Wk 46 Fri - 08:01 +03:00

2025-12-25 Wk 52 Thu - 21:56 +03:00

To build `mgba`,

```sh
# in /home/lan/src/cloned/gh/mgba-emu/mgba
docker run --rm -it -v ${PWD}:/home/mgba/src mgba/ubuntu:plucky
```

There's `GBALoadSave` to look into which uses `GBASavedataInitSRAM`. 

There's `GBAStore8`  which writes to SRAM with `GBAUnlCartWriteSRAM` or direct write.

2025-12-25 Wk 52 Thu - 22:22 +03:00

```sh
# in /home/lan/src/cloned/gh/mgba-emu/mgba/build-oracular
qt/mgba-qt

# out (error)
qt/mgba-qt: error while loading shared libraries: libQt6Multimedia.so.6: cannot open shared object file: No such file or directory
```

Seems for [Qt Multimedia](https://doc.qt.io/qt-6/qtmultimedia-index.html).

From [How To Install libqt6multimedia6 on Ubuntu 22.04](https://installati.one/install-libqt6multimedia6-ubuntu-22-04/),

```sh
sudo apt-get -y install libqt6multimedia6
```


[pkgs ubuntu 25.04 libqt6openglwidgets6_6.8.3+dfsg-0ubuntu2_arm64.deb](https://ubuntu.pkgs.org/25.04/ubuntu-universe-arm64/libqt6openglwidgets6_6.8.3+dfsg-0ubuntu2_arm64.deb.html)

It seems to require other packages too.

2025-12-26 Wk 52 Fri - 12:19 +03:00

for just `mgba`, we needed

```
sudo apt-get install libzip5
```

Then at least we are able to run `mgba`, though not `mgba-qt` with

```sh
LD_LIBRARY_PATH=/home/lan/src/cloned/gh/mgba-emu/mgba/build-oracular/install/usr/local/lib/ \
  /home/lan/src/cloned/gh/mgba-emu/mgba/build-oracular/install/usr/local/bin/mgba \
  -2 $@
```

with `-2` for a slightly larger screen.

There is a man page we can examine:

```sh
# in /home/lan/src/cloned/gh/mgba-emu/mgba
man doc/mgba.6
```

But it doesn't mention what possible config there is.

It mentions this:

```
ENVIRONMENT
       XDG_CONFIG_HOME
               The location where mgba will look for the configuration directory.  If not set, ~/.config is used.
```

It seems we can see some values if we search the source for `ConfigurationGetValue`.

```
~/src/cloned/gh/mgba-emu/run_mgba.sh ~/src/cloned/gh/dism-exe/bn6f/bn6f.gba -C mute
```

This works. I somehow got this by luck. You can find it as a bool in `mCoreOptions`.  There is also an option there for `volume=N`

2025-12-26 Wk 52 Fri - 12:45 +03:00

There is another issue, it barely reacts to me pressing up or down. MegaMan walks up or down when I hold it in a very slow jagged way.

2025-12-26 Wk 52 Fri - 13:00 +03:00

When we make changes to the source, we can rebuild with this in my case (`ubuntu:plucky`):

```sh
# in /home/lan/src/cloned/gh/mgba-emu/mgba
docker run --rm -it -e MAKEFLAGS=-j$(nproc) -v ${PWD}:/home/mgba/src mgba/ubuntu:plucky
```

I tried adding

```C
// in bool GBALoadSave(struct GBA* gba, struct VFile* sav) {
printf("LAN - We loaded a save! PC=%X", gba->cpu->regs.gprs[15]);
```

But it never triggered. Maybe needs a `\n` in the end.

Also adding this `printf`:

```C
// in void GBAIllegal(struct ARMCore* cpu, uint32_t opcode) {
if (!gba->yankedRomSize) {
	mLOG(GBA, WARN, "Illegal opcode: %08x", opcode);
	printf("LAN - Illegal opcode\n");
}
```

Yup those work.

```
GBA: Illegal opcode: 0000b1c9
LAN - illegal opcode
```

And this triggers immediately on game boot:

```
LAN - We loaded a save! PC=0
```

```C
// in void ARMRaiseIRQ(struct ARMCore* cpu) {
printf("LAN - IRQ Triggered, set PC to %X\n", cpu->gprs[ARM_PC]);
```

This would probably trigger a lot.

There's `GBASwi16` and `GBASwi32`... `src/arm/isa-thumb.c` is interesting because they define the thumb opcodes there. The instruction step happens through `ThumbStep` and `ARMStep`. 

We might be hitting that illegal opcode due to this `ILL` somehow:

Spawn [[001 Editing notes for listings in b987ec]] ^spawn-entry-946091

```C
DEFINE_INSTRUCTION_THUMB(ILL, ARM_ILL)
```

```C
// in static inline void ThumbStep(struct ARMCore* cpu) {
printf("LAN - ThumbStep PC=%X opcode=%X\n", cpu->gprs[ARM_PC] - 2, opcode);
cpu->gprs[ARM_PC] += WORD_SIZE_THUMB;

// in static inline void ARMStep(struct ARMCore* cpu) {
cpu->prefetch[0] = cpu->prefetch[1];
printf("LAN - ARMStep PC=%X opcode=%X\n", cpu->gprs[ARM_PC], opcode);
```

It's understandably super slow to be logging each thumbstep like that. We might get far from logging the branches though.

```
LAN - ThumbStep PC=8004C70 opcode=80E
LAN - ThumbStep PC=8004C72 opcode=B1C9
GBA: Illegal opcode: 0000b1c9
```

```
8004C70 is between:
08004a48 l 00000000 T4BattleObjectJumptable
08004c90 l 00000080 sub_8004510
```


```C
// in DEFINE_INSTRUCTION_THUMB(BX,
	printf("LAN - BX PC=%X, rm=#%d:%X\n", cpu->gprs[ARM_PC] - 2, rm, cpu->gprs[rm] & 0xFFFFFFFE);
	cpu->gprs[ARM_PC] = cpu->gprs[rm] & 0xFFFFFFFE;
	
// in DEFINE_INSTRUCTION_THUMB(BL2,
	uint32_t pc = cpu->gprs[ARM_PC];
	printf("LAN - BL PC1=%X, PC2=%X LR=%X\n", cpu->gprs[ARM_PC], cpu->gprs[ARM_LR] + immediate, pc - 1);
	
// in DEFINE_INSTRUCTION_THUMB(B,
	int16_t immediate = (opcode & 0x07FF) << 5;
	printf("LAN - B PC1=%X, PC2=%X\n", cpu->gprs[ARM_PC], cpu->gprs[ARM_PC] + (((int32_t) immediate) >> 4));
	
// in #define DEFINE_CONDITIONAL_BRANCH_THUMB(COND) \
	int8_t immediate = opcode; \
	printf("LAN - B COND PC1=%X, PC2=%X\n", cpu->gprs[ARM_PC], cpu->gprs[ARM_PC] + ((int32_t) immediate << 1)); \
	
// in DEFINE_INSTRUCTION_ARM(B,
	offset >>= 6;
	printf("LAN - ARM B PC1=%X, PC2=%X\n", cpu->gprs[ARM_PC], cpu->gprs[ARM_PC] + offset);
	
// in DEFINE_INSTRUCTION_ARM(BL,
	int32_t immediate = (opcode & 0x00FFFFFF) << 8;
	printf("LAN - ARM BL PC1=%X, PC2=%X LR=%X\n", cpu->gprs[ARM_PC] - 4, cpu->gprs[ARM_PC] + (immediate >> 6), cpu->gprs[ARM_PC] - WORD_SIZE_ARM);
	
// in DEFINE_INSTRUCTION_ARM(BX,
	int rm = opcode & 0x0000000F;
	printf("LAN - ARM BX PC=%X, rm=#%d:%X\n", cpu->gprs[ARM_PC] - 2, rm, cpu->gprs[rm] & 0xFFFFFFFE);
	
// in void GBAStore32(struct ARMCore* cpu, uint32_t address, int32_t value, int* cycleCounter) {
	char* waitstatesRegion = memory->waitstatesNonseq32;

	printf("LAN - GBAStore32 PC=%X, addr=%X, val=%X\n", cpu->gprs[ARM_PC], address, value);

// in void GBAStore16(struct ARMCore* cpu, uint32_t address, int16_t value, int* cycleCounter) {
	int16_t oldValue;

	printf("LAN - GBAStore16 PC=%X, addr=%X, val=%X\n", cpu->gprs[ARM_PC], address, value);

// in void GBAStore8(struct ARMCore* cpu, uint32_t address, int8_t value, int* cycleCounter) {
	uint16_t oldValue;

	printf("LAN - GBAStore8 PC=%X, addr=%X, val=%X\n", cpu->gprs[ARM_PC], address, value);
	
// in void GBAStore8(struct ARMCore* cpu, uint32_t address, int8_t value, int* cycleCounter) {
if (memory->unl.type) {
	GBAUnlCartWriteSRAM(gba, address & 0xFFFF, value);
	printf("LAN - SRAMWrite0 PC=%X, addr=%X, val=%X\n", cpu->gprs[ARM_PC], address, value);
} else {
	memory->savedata.data[address & (GBA_SIZE_SRAM - 1)] = value;
	printf("LAN - SRAMWrite1 PC=%X, addr=%X, val=%X\n", cpu->gprs[ARM_PC], address, value);
}
```

`B COND` happens a lot more frequently than the others. 

It gathered 3.2GB data so quick, there's so much data with this... It seems to be faster though when I pipe to file.

2025-12-26 Wk 52 Fri - 22:48 +03:00

```
LAN - SRAMWrite1 PC=814D97C, addr=E007F80, val=FFFFFFAB
LAN - GBAStore8 PC=814D97C, addr=E007F81, val=C
LAN - SRAMWrite1 PC=814D97C, addr=E007F81, val=C
LAN - GBAStore8 PC=814D97C, addr=E007F82, val=FFFFFFDB
LAN - SRAMWrite1 PC=814D97C, addr=E007F82, val=FFFFFFDB
```

```
cat a | python3 ~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.py ea_to_sym_filter bn6f.sym > b.log

# out
LAN - SRAMWrite1 PC=loc_814D976+6, addr=E007F80, val=FFFFFFAB
LAN - GBAStore8 PC=loc_814D976+6, addr=E007F81, val=C
LAN - SRAMWrite1 PC=loc_814D976+6, addr=E007F81, val=C
LAN - GBAStore8 PC=loc_814D976+6, addr=E007F82, val=FFFFFFDB
LAN - SRAMWrite1 PC=loc_814D976+6, addr=E007F82, val=FFFFFFDB
```

This is in `libSave_CopyToGamePak`.

```
	ldr r0, off_803F888 // =timer_2000000
	ldr r1, dword_803F88C // =0xe000100
	ldr r2, dword_803F890 // =0x6710
	push {r0-r2}
	bl libSave_CopyToGamePak
```

A lot of the data in the sav is just bulk copy of data in ewram.
