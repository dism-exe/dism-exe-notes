---
parent: "[[002 bn6f ROM shifting]]"
spawned_by: "[[003 Look into dumping undumped code with methods outside IDA]]"
context_type: task
status: done
---

Parent: [[002 bn6f ROM shifting]]

Spawned by: [[003 Look into dumping undumped code with methods outside IDA]]

Spawned in: [[003 Look into dumping undumped code with methods outside IDA#^spawn-task-249edd|^spawn-task-249edd]]

# 1 Journal

2025-12-23 Wk 52 Tue - 13:33 +03:00

```
# lists, LoadGFXAnims

off_807ED8C
off_807EDA8
off_807EDBC

off_806646C
off_8066484

off_806A090
off_806A0C0
off_806A0F0

off_80690E0
off_8069100
off_8069120

off_80527A4
off_80527AC
off_80527B4
off_80527BC
off_80527C4
off_80527CC
off_80527D4
off_80527DC
dword_80527E4
dword_80527E8
dword_80527EC

off_8067C04
off_8067C30
off_8067C5C

off_806AAD0
off_806AAFC
off_806AB20
off_806AB54
off_806AB70

off_804E6FC
off_804E70C
dword_804E714
off_804E718

off_807A994
off_807A9A0
off_807A9B8

off_8075500
off_8075510
off_8075520

off_805968C
off_80596A0
off_80596AC
off_80596B4
off_80596BC

off_8071C04
off_8071C18
off_8071C24

off_80793B4
off_80793CC

off_805DFC8
off_805DFD0
off_805DFD8
off_805DFE0
off_805DFE8

off_8077DA4
off_8077DC4

off_806C310
off_806C31C
off_806C328
off_806C334
off_806C344
off_806C350

off_807CEB4
off_807CED0
off_807CEE4
off_807CF10

off_8062B90
off_8062B9C
off_8062BA4
off_8062BAC
off_8062BB8
off_8062BC4

off_8060428
off_8060430
off_806043C
off_8060444

off_806DA50

off_806FD4C

off_8035448

off_8035418

off_80353FC

pt_802F5F0

dword_8081278
dword_8081278
off_808127C
dword_8081284
dword_8081284
off_8081288
off_8081290
off_8081290
off_8081298
off_80812A0
off_80812A8
off_80812B0
off_80812B8
off_80812C0
off_80812C8
off_80812D0
off_80812DC
off_80812E4
off_80812EC
off_80812F4
off_80812FC

off_8035688

# single scripts, LoadGFXAnim
off_806C1C4
off_8039370
byte_8039350
off_8039308
byte_80392D8
byte_80392A8
dword_804C4E0
dword_804C4B0
dword_802F334
byte_802F2E4
byte_8038A84
byte_8038A6C
byte_8038A3C
byte_80389AC
byte_803888C
byte_80387FC
byte_80389AC
byte_803891C
byte_803875C
byte_811EAEC
byte_811EAD4
byte_811EB5C
byte_811EB04
byte_811EAB8
byte_811EA68
byte_8140BF0
byte_8140BAC
off_8084054
off_8084040
```

```
	thumb_local_start
// 0x30 ptr1
// call LoadGFXAnim with r0=ptr1
CutsceneCameraCmd_call_sub_8001B1C:

	enum ccs_call_sub_8001B1C_cmd // 0x30
// 0x30 ptr1
// call LoadGFXAnim with r0=ptr1
	.macro ccs_call_sub_8001B1C ptr1:req
	.byte ccs_call_sub_8001B1C_cmd
	.word \ptr1
	.endm
```

No single use of `ccs_call_sub_8001B1C` though.

```sh
# in /home/lan/src/cloned/gh/LanHikari22/bn_repo_editor

#cargo run --release --bin dump_script list_trace gfx_anim off_807ED8C &&
#cargo run --release --bin dump_script list_trace gfx_anim off_807EDA8 &&
#cargo run --release --bin dump_script list_trace gfx_anim off_807EDBC &&
#cargo run --release --bin dump_script list_trace gfx_anim off_806646C &&
#cargo run --release --bin dump_script list_trace gfx_anim off_8066484 &&
#cargo run --release --bin dump_script list_trace gfx_anim off_806A090 &&
#cargo run --release --bin dump_script list_trace gfx_anim off_806A0C0 &&
cargo run --release --bin dump_script list_trace gfx_anim off_806A0F0 &&
cargo run --release --bin dump_script list_trace gfx_anim off_80690E0 &&
cargo run --release --bin dump_script list_trace gfx_anim off_8069100 &&
cargo run --release --bin dump_script list_trace gfx_anim off_8069120 &&
cargo run --release --bin dump_script list_trace gfx_anim off_80527A4 &&
cargo run --release --bin dump_script list_trace gfx_anim off_80527AC &&
cargo run --release --bin dump_script list_trace gfx_anim off_80527B4 &&
cargo run --release --bin dump_script list_trace gfx_anim off_80527BC &&
cargo run --release --bin dump_script list_trace gfx_anim off_80527C4 &&
cargo run --release --bin dump_script list_trace gfx_anim off_80527CC &&
cargo run --release --bin dump_script list_trace gfx_anim off_80527D4 &&
cargo run --release --bin dump_script list_trace gfx_anim off_80527DC &&
cargo run --release --bin dump_script list_trace gfx_anim dword_80527E4 &&
cargo run --release --bin dump_script list_trace gfx_anim dword_80527E8 &&
cargo run --release --bin dump_script list_trace gfx_anim dword_80527EC &&
cargo run --release --bin dump_script list_trace gfx_anim off_8067C04 &&
cargo run --release --bin dump_script list_trace gfx_anim off_8067C30 &&
cargo run --release --bin dump_script list_trace gfx_anim off_8067C5C &&
cargo run --release --bin dump_script list_trace gfx_anim off_806AAD0 &&
cargo run --release --bin dump_script list_trace gfx_anim off_806AAFC &&
cargo run --release --bin dump_script list_trace gfx_anim off_806AB20 &&
cargo run --release --bin dump_script list_trace gfx_anim off_806AB54 &&
cargo run --release --bin dump_script list_trace gfx_anim off_806AB70 &&
cargo run --release --bin dump_script list_trace gfx_anim off_804E6FC &&
cargo run --release --bin dump_script list_trace gfx_anim off_804E70C &&
cargo run --release --bin dump_script list_trace gfx_anim dword_804E714 &&
cargo run --release --bin dump_script list_trace gfx_anim off_804E718 &&
cargo run --release --bin dump_script list_trace gfx_anim off_807A994 &&
cargo run --release --bin dump_script list_trace gfx_anim off_807A9A0 &&
cargo run --release --bin dump_script list_trace gfx_anim off_807A9B8 &&
cargo run --release --bin dump_script list_trace gfx_anim off_8075500 &&
cargo run --release --bin dump_script list_trace gfx_anim off_8075510 &&
cargo run --release --bin dump_script list_trace gfx_anim off_8075520 &&
cargo run --release --bin dump_script list_trace gfx_anim off_805968C &&
cargo run --release --bin dump_script list_trace gfx_anim off_80596A0 &&
cargo run --release --bin dump_script list_trace gfx_anim off_80596AC &&
cargo run --release --bin dump_script list_trace gfx_anim off_80596B4 &&
cargo run --release --bin dump_script list_trace gfx_anim off_80596BC &&
cargo run --release --bin dump_script list_trace gfx_anim off_8071C04 &&
cargo run --release --bin dump_script list_trace gfx_anim off_8071C18 &&
cargo run --release --bin dump_script list_trace gfx_anim off_8071C24 &&
cargo run --release --bin dump_script list_trace gfx_anim off_80793B4 &&
cargo run --release --bin dump_script list_trace gfx_anim off_80793CC &&
cargo run --release --bin dump_script list_trace gfx_anim off_805DFC8 &&
cargo run --release --bin dump_script list_trace gfx_anim off_805DFD0 &&
cargo run --release --bin dump_script list_trace gfx_anim off_805DFD8 &&
cargo run --release --bin dump_script list_trace gfx_anim off_805DFE0 &&
cargo run --release --bin dump_script list_trace gfx_anim off_805DFE8 &&
cargo run --release --bin dump_script list_trace gfx_anim off_8077DA4 &&
cargo run --release --bin dump_script list_trace gfx_anim off_8077DC4 &&
cargo run --release --bin dump_script list_trace gfx_anim off_806C310 &&
cargo run --release --bin dump_script list_trace gfx_anim off_806C31C &&
cargo run --release --bin dump_script list_trace gfx_anim off_806C328 &&
cargo run --release --bin dump_script list_trace gfx_anim off_806C334 &&
cargo run --release --bin dump_script list_trace gfx_anim off_806C344 &&
cargo run --release --bin dump_script list_trace gfx_anim off_806C350 &&
cargo run --release --bin dump_script list_trace gfx_anim off_807CEB4 &&
cargo run --release --bin dump_script list_trace gfx_anim off_807CED0 &&
cargo run --release --bin dump_script list_trace gfx_anim off_807CEE4 &&
cargo run --release --bin dump_script list_trace gfx_anim off_807CF10 &&
cargo run --release --bin dump_script list_trace gfx_anim off_8062B90 &&
cargo run --release --bin dump_script list_trace gfx_anim off_8062B9C &&
cargo run --release --bin dump_script list_trace gfx_anim off_8062BA4 &&
cargo run --release --bin dump_script list_trace gfx_anim off_8062BAC &&
cargo run --release --bin dump_script list_trace gfx_anim off_8062BB8 &&
cargo run --release --bin dump_script list_trace gfx_anim off_8062BC4 &&
cargo run --release --bin dump_script list_trace gfx_anim off_8060428 &&
cargo run --release --bin dump_script list_trace gfx_anim off_8060430 &&
cargo run --release --bin dump_script list_trace gfx_anim off_806043C &&
cargo run --release --bin dump_script list_trace gfx_anim off_8060444 &&
cargo run --release --bin dump_script list_trace gfx_anim off_806DA50 &&
cargo run --release --bin dump_script list_trace gfx_anim off_806FD4C &&
cargo run --release --bin dump_script list_trace gfx_anim off_8035448 &&
cargo run --release --bin dump_script list_trace gfx_anim off_8035418 &&
cargo run --release --bin dump_script list_trace gfx_anim off_80353FC &&
cargo run --release --bin dump_script list_trace gfx_anim pt_802F5F0 &&
cargo run --release --bin dump_script list_trace gfx_anim dword_8081278 &&
cargo run --release --bin dump_script list_trace gfx_anim dword_8081278 &&
cargo run --release --bin dump_script list_trace gfx_anim off_808127C &&
cargo run --release --bin dump_script list_trace gfx_anim dword_8081284 &&
cargo run --release --bin dump_script list_trace gfx_anim dword_8081284 &&
cargo run --release --bin dump_script list_trace gfx_anim off_8081288 &&
cargo run --release --bin dump_script list_trace gfx_anim off_8081290 &&
cargo run --release --bin dump_script list_trace gfx_anim off_8081290 &&
cargo run --release --bin dump_script list_trace gfx_anim off_8081298 &&
cargo run --release --bin dump_script list_trace gfx_anim off_80812A0 &&
cargo run --release --bin dump_script list_trace gfx_anim off_80812A8 &&
cargo run --release --bin dump_script list_trace gfx_anim off_80812B0 &&
cargo run --release --bin dump_script list_trace gfx_anim off_80812B8 &&
cargo run --release --bin dump_script list_trace gfx_anim off_80812C0 &&
cargo run --release --bin dump_script list_trace gfx_anim off_80812C8 &&
cargo run --release --bin dump_script list_trace gfx_anim off_80812D0 &&
cargo run --release --bin dump_script list_trace gfx_anim off_80812DC &&
cargo run --release --bin dump_script list_trace gfx_anim off_80812E4 &&
cargo run --release --bin dump_script list_trace gfx_anim off_80812EC &&
cargo run --release --bin dump_script list_trace gfx_anim off_80812F4 &&
cargo run --release --bin dump_script list_trace gfx_anim off_80812FC &&
cargo run --release --bin dump_script list_trace gfx_anim off_8035688 &&

# single scripts, LoadGFXAnim
cargo run --release --bin dump_script trace gfx_anim off_806C1C4 &&
cargo run --release --bin dump_script trace gfx_anim off_8039370 &&
cargo run --release --bin dump_script trace gfx_anim byte_8039350 &&
cargo run --release --bin dump_script trace gfx_anim off_8039308 &&
cargo run --release --bin dump_script trace gfx_anim byte_80392D8 &&
cargo run --release --bin dump_script trace gfx_anim byte_80392A8 &&
cargo run --release --bin dump_script trace gfx_anim dword_804C4E0 &&
cargo run --release --bin dump_script trace gfx_anim dword_804C4B0 &&
cargo run --release --bin dump_script trace gfx_anim dword_802F334 &&
cargo run --release --bin dump_script trace gfx_anim byte_802F2E4 &&
cargo run --release --bin dump_script trace gfx_anim byte_8038A84 &&
cargo run --release --bin dump_script trace gfx_anim byte_8038A6C &&
cargo run --release --bin dump_script trace gfx_anim byte_8038A3C &&
cargo run --release --bin dump_script trace gfx_anim byte_80389AC &&
cargo run --release --bin dump_script trace gfx_anim byte_803888C &&
cargo run --release --bin dump_script trace gfx_anim byte_80387FC &&
cargo run --release --bin dump_script trace gfx_anim byte_80389AC &&
cargo run --release --bin dump_script trace gfx_anim byte_803891C &&
cargo run --release --bin dump_script trace gfx_anim byte_803875C &&
cargo run --release --bin dump_script trace gfx_anim byte_811EAEC &&
cargo run --release --bin dump_script trace gfx_anim byte_811EAD4 &&
cargo run --release --bin dump_script trace gfx_anim byte_811EB5C &&
cargo run --release --bin dump_script trace gfx_anim byte_811EB04 &&
cargo run --release --bin dump_script trace gfx_anim byte_811EAB8 &&
cargo run --release --bin dump_script trace gfx_anim byte_811EA68 &&
cargo run --release --bin dump_script trace gfx_anim byte_8140BF0 &&
cargo run --release --bin dump_script trace gfx_anim byte_8140BAC &&
cargo run --release --bin dump_script trace gfx_anim off_8084054 &&
cargo run --release --bin dump_script trace gfx_anim off_8084040 &&
```

```
speaker-test -t sine -f 1000 -l 1
```

2025-12-23 Wk 52 Tue - 16:33 +03:00

```
Tracing gfx_anim_script Identifier { s: "off_8066048" }

thread 'main' panicked at src/bin/dump_script.rs:215:15:
script RomEa { ea: 0x08066048 } "off_8066048": We can only cut in ROM EAs: Vram(VramEa { ea: 0x06008040 })
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

```sh
python3 -c "print(hex(0x06008040 - 0x60079C0))" # 0x680
python3 -c "print(hex(0x6640 - 0x680))" # 0x5fc0
```

```C
// in vram.s
byte_60079C0:: // 0x60079C0
	.space 0x680
unk_6008040:: // 0x6008040
	.space 0x5fc0
```

2025-12-23 Wk 52 Tue - 17:17 +03:00

```
Tracing gfx_anim_script Identifier { s: "byte_80524E8" }

thread 'main' panicked at src/bin/dump_script.rs:457:21:
Failed to read gfx_anim_script instructions at Identifier { s: "byte_80524E8" }: Other error: Failed to read gfx anim script data commands: line 402: Failed to read a u32 at position 12 for buffer of length 14 for data delay
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

Removing unused pointer `byte_8052502`.

2025-12-23 Wk 52 Tue - 17:20 +03:00

```
Tracing gfx_anim_script Identifier { s: "off_8067914" }

thread 'main' panicked at src/bin/dump_script.rs:215:15:
script RomEa { ea: 0x08067914 } "off_8067914": We can only cut in ROM EAs: Vram(VramEa { ea: 0x06000020 })
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

```C
// in vram.s
byte_6000000:: // 0x6000000
	.space 0x20
unk_6000020:: // 0x6000020
	.space 0x79A0
```

2025-12-23 Wk 52 Tue - 17:24 +03:00

```
Tracing gfx_anim_script Identifier { s: "off_8067944" }

thread 'main' panicked at src/bin/dump_script.rs:215:15:
script RomEa { ea: 0x08067944 } "off_8067944": We can only cut in ROM EAs: Vram(VramEa { ea: 0x060000E0 })
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

```C
// in vram.s
unk_6000020:: // 0x6000020
	.space 0xC0
unk_60000E0:: // 0x60000E0
	.space 0x78E0
```

2025-12-23 Wk 52 Tue - 17:59 +03:00

```
Tracing gfx_anim_script Identifier { s: "byte_807A850" }

thread 'main' panicked at src/bin/dump_script.rs:451:21:
No terminating command before failing to read gfx_anim_script instructions at Identifier { s: "byte_807A850" }: Partial read Error. Original error: Failed to read gfx anim script data commands: Invalid data encountered at position 68: 0x000000C. Parsed commands: [Inst { name: "gfx_anim_data_ptr", cmd: 255, opt_subcmd: None, fields: [Ptr("ptr", Rom(RomEa { ea: 0x085DB0C0 })), U32("delay", 16)] }, Inst { name: "gfx_anim_data_ptr", cmd: 255, opt_subcmd: None, fields: [Ptr("ptr", Rom(RomEa { ea: 0x085DB0E0 })), U32("delay", 16)] }, Inst { name: "gfx_anim_data_ptr", cmd: 255, opt_subcmd: None, fields: [Ptr("ptr", Rom(RomEa { ea: 0x085DB100 })), U32("delay", 16)] }, Inst { name: "gfx_anim_data_ptr", cmd: 255, opt_subcmd: None, fields: [Ptr("ptr", Rom(RomEa { ea: 0x085DB120 })), U32("delay", 16)] }, Inst { name: "gfx_anim_data_ptr", cmd: 255, opt_subcmd: None, fields: [Ptr("ptr", Rom(RomEa { ea: 0x085DB140 })), U32("delay", 16)] }, Inst { name: "gfx_anim_data_ptr", cmd: 255, opt_subcmd: None, fields: [Ptr("ptr", Rom(RomEa { ea: 0x085DB120 })), U32("delay", 16)] }, Inst { name: "gfx_anim_data_ptr", cmd: 255, opt_subcmd: None, fields: [Ptr("ptr", Rom(RomEa { ea: 0x085DB100 })), U32("delay", 16)] }, Inst { name: "gfx_anim_data_ptr", cmd: 255, opt_subcmd: None, fields: [Ptr("ptr", Rom(RomEa { ea: 0x085DB0E0 })), U32("delay", 16)] }, Inst { name: "gfx_anim_loop", cmd: 1, opt_subcmd: None, fields: [Magic24("magic24_1", 0)] }]
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

Added

```
end_gfx_anim_807A8DD::
	.balign 4, 0
```

Had to also add `end_gfx_anim_807A89D` and `unk_807A8A0` though...

Well no need for `end_gfx_anim_807A89D`, that was part of the command. Let's try to also parse `unk_807A8A0` as gfx_anim. We might not need `end_gfx_anim_807A8DD` as it is part of it, so removing.

2025-12-23 Wk 52 Tue - 18:42 +03:00

```
Tracing gfx_anim_script Identifier { s: "off_80790EC" }

thread 'main' panicked at src/bin/dump_script.rs:215:15:
script RomEa { ea: 0x080790EC } "off_80790EC": We can only cut in ROM EAs: Vram(VramEa { ea: 0x06008020 })
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

```C
// in vram.s
byte_60079C0:: // 0x60079C0
	.space 0x660
unk_6008020:: // 0x6008020
	.space 0x20
```

There was also another gfx anim script `unk_807A8C0` right after `unk_807A8A0`. Neither of these have any reference, which might mean we have to process them range like...

Also would need to look at the kind of data `off_8079F74` points to.

2025-12-24 Wk 52 Wed - 06:52 +03:00

```
Tracing gfx_anim_script Identifier { s: "off_807C974" }

thread 'main' panicked at src/bin/dump_script.rs:215:15:
script RomEa { ea: 0x0807C974 } "off_807C974": We can only cut in ROM EAs: Vram(VramEa { ea: 0x06005AC0 })
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

```C
// in vram.s
unk_60000E0:: // 0x60000E0
	.space 0x78E0
byte_60079C0:: // 0x60079C0
	.space 0x660
```

```sh
python3 -c "print(hex(0x6005AC0 - 0x60000E0))" # 0x59e0
python3 -c "print(hex(0x78E0 - 0x59E0))" # 0x1f00
```

```C
// in vram.s
unk_60000E0:: // 0x60000E0
	.space 0x59E0
unk_6005AC0:: // 0x6005AC0
	.space 0x1F00
```

2025-12-25 Wk 52 Thu - 08:34 +03:00

```
tools/binutils/bin/arm-none-eabi-ld: data.o: in function `byte_854D410':
(.data+0x375720): undefined reference to `off_8000701'
```

Gonna have to blacklist `off_8000700` in `display_symbol_data_as_directives_with_labels`. Also `0x02020201`. 

2025-12-25 Wk 52 Thu - 09:31 +03:00

```
dat38_60::
	.word 0x00000100

unk_857D870:
	.word 0x313F7C1F, 0x0FDF0421, 0x0C630C63, 0x7F2F7C1F, 0x410675EB, 0x7C1F7C1F, 0x24950078, 0x0078313F
	.word 0x04217C1F, 0x0FDF313F, 0x0C630FDF, 0x61467C1F, 0x75EB4106, 0x7C1F7C1F, 0x0078313F, 0x313F067E
	.word 0x0C637C1F, 0x0FDF0C63, 0x0FDF0FDF, 0x41067C1F, 0x75EB75EB, 0x7C1F7C1F, 0x313F067E, 0x24950078
"data/dat38_60.s"
```

There should be a pointer at the start of `dat38_60`.

2025-12-25 Wk 52 Thu - 12:11 +03:00

```
Tracing gfx_anim_script Identifier { s: "off_807F690" }

thread 'main' panicked at src/bin/dump_script.rs:215:15:
script RomEa { ea: 0x0807F690 } "off_807F690": We can only cut in ROM EAs: Vram(VramEa { ea: 0x06000040 })
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

```C
// in vram.s
unk_6000020:: // 0x6000020
	.space 0xC0
```

```C
// in vram.s
unk_6000020:: // 0x6000020
	.space 0x20
unk_6000040:: // 0x6000040
	.space 0xA0
```

2025-12-25 Wk 52 Thu - 12:16 +03:00

```
Tracing gfx_anim_script Identifier { s: "off_80805C0" }

thread 'main' panicked at src/bin/dump_script.rs:457:21:
Failed to read gfx_anim_script instructions at Identifier { s: "off_80805C0" }: Other error: Failed to read gfx anim script data commands: line 402: Failed to read a u32 at position 60 for buffer of length 62 for data delay
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

labels `off_8080684`, `byte_8080689`, `byte_808068A`, `byte_808068B`, `byte_80806B3`, all have no references. Removing.

`byte_808060A` has 2 uncertain references. Removing.

Hmm `off_80805C0` seems to refer to many labels similar to the ones we removed.

2025-12-25 Wk 52 Thu - 12:29 +03:00

```
     Running `target/release/dump_script trace gfx_anim byte_8039350`
Tracing gfx_anim_script Identifier { s: "byte_8039350" }

thread 'main' panicked at src/bin/dump_script.rs:457:21:
Failed to read gfx_anim_script instructions at Identifier { s: "byte_8039350" }: Other error: Failed to read gfx anim script start command: line 319: Expected magic value 4294967295 but got 255: InstSchema { name: "gfx_anim_play_sound", cmd: 16, opt_subcmd: None, fields: [Magic32("magic32_0", 4294967295), Magic32("magic32_4", 4294967295), U8("index"), Magic8("magic8_10", 255), Magic8("magic8_11", 255)] } Magic32("magic32_0", 4294967295)
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

```rust
// in src/bytecode/gfx_anim_script.rs
// Parameters for this are guesses
InstSchema {
	name: "gfx_anim_play_sound".to_owned(),
	cmd: 0x10,
	opt_subcmd: None,
	fields: vec![
		FieldSchema::Magic32("magic32_0".to_owned(), 0xFFFFFFFF),
		FieldSchema::Magic32("magic32_4".to_owned(), 0xFFFFFFFF),
		FieldSchema::U8("index".to_owned()),
		FieldSchema::Magic8("magic8_10".to_owned(), 0xFF),
		FieldSchema::Magic8("magic8_11".to_owned(), 0xFF),
	],
},
```

```
byte_8039350:
	.byte 0xFF, 0x0, 0x0, 0x0, 0xFF, 0x0, 0x0, 0x0, 0x10, 0x3, 0xFF, 0xFF
	.byte 0xFF, 0xFF, 0xFF, 0xFF, 0x1E, 0x0, 0x0, 0x0, 0x8D, 0x0, 0x0, 0x0
	.byte 0x1, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0
```

```
byte_8039350:
		  0     1    2    3    4     5    6    7    8     9    10
	.byte 0xFF, 0x0, 0x0, 0x0, 0xFF, 0x0, 0x0, 0x0, 0x10, 0x3, 0xFF, 0xFF
		  [magic32_0        ]  [magic32_4        ]  [id]x [ma]gic8_10
		                                                       [ma]gic8_11
	.byte 0xFF, 0xFF, 0xFF, 0xFF, 0x1E, 0x0, 0x0, 0x0, 0x8D, 0x0, 0x0, 0x0
	.byte 0x1, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0
```

So there's some issues here. `magic8_10` is at index 9 (not 10), and `magic8_11` is at index 10 (not 11). `magic32_0` and `magic32_4` are `0x000000FF` instead of `0xFFFFFF`. 

The first mismatch is because we're annotating wrong. The command is known to be at byte 10 and is thus skipped. Thus:

```
byte_8039350:
		  0     1    2    3    4     5    6    7    8     9    10    11
	.byte 0xFF, 0x0, 0x0, 0x0, 0xFF, 0x0, 0x0, 0x0, 0x10, 0x3, 0xFF, 0xFF
		  [magic32_0        ]  [magic32_4        ]       i[d]x [ma]gic8_10
		                                                             [ma]gic8_11
	.byte 0xFF, 0xFF, 0xFF, 0xFF, 0x1E, 0x0, 0x0, 0x0, 0x8D, 0x0, 0x0, 0x0
	.byte 0x1, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0
```

Now we can see that `magic8_10` and `magic8_11` are `0xFF` as expected, and we are indeed routed to command `0x10`.

```C
# in include/bytecode/gfx_anim_script.inc
	enum GFX_ANIM_PLAY_SOUND // 0x10
	// haven't actually seen an instance of this command, guessing values
	.macro gfx_anim_play_sound index:req
	gfx_anim_data_common_struct 0xffffffff, 0xffffffff, GFX_ANIM_PLAY_SOUND, \index
	.endm
```

So our guess of `0xffffffff` was wrong. This is the first instance we have encountered of this in `byte_8039350`. 

Updating:

```C
# in include/bytecode/gfx_anim_script.inc
	enum GFX_ANIM_PLAY_SOUND // 0x10
  // encountered in byte_8039350
	.macro gfx_anim_play_sound index:req
	gfx_anim_data_common_struct 0x000000ff, 0x000000ff, GFX_ANIM_PLAY_SOUND, \index
	.endm
```

```rust
// in src/bytecode/gfx_anim_script.rs
InstSchema {
	name: "gfx_anim_play_sound".to_owned(),
	cmd: 0x10,
	opt_subcmd: None,
	fields: vec![
		FieldSchema::Magic32("magic32_0".to_owned(), 0x000000FF),
		FieldSchema::Magic32("magic32_4".to_owned(), 0x000000FF),
		FieldSchema::U8("index".to_owned()),
		FieldSchema::Magic8("magic8_10".to_owned(), 0xFF),
		FieldSchema::Magic8("magic8_11".to_owned(), 0xFF),
	],
},
```


2025-12-25 Wk 52 Thu - 12:56 +03:00

```
Tracing gfx_anim_script Identifier { s: "byte_8039350" }

thread 'main' panicked at src/bin/dump_script.rs:457:21:
Failed to read gfx_anim_script instructions at Identifier { s: "byte_8039350" }: Other error: Failed to read gfx anim script data commands: Sound effect at position 0 must be a u8, but 4294967295 is not.
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

It also gives value `0xFFFFFFFF` for sound effect... interpreting as `0xFF`. 

But then this means that what we have here is false:

```rust
Inst {
	name: "gfx_anim_data_sound".to_owned(),
	cmd: 0x00, // it doesn't have a command
	opt_subcmd: None,
	fields: vec![
		Field::U8("sound_effect8".to_owned(), sound_effect8),
		Field::Magic24("magic24_1".to_owned(), 0x000000),
		Field::U32("delay".to_owned(), delay),
	],
}
```

`magic4_1` would be `0xFFFFFF`.  Let's just interpret it as u32. 

We assume the value is always a u8, so let's make the magic `0xFFFFFF` just in case `sound_effect8` is `0xFF`.

```
byte_8039350:
		  0     1    2    3    4     5    6    7    8     9    10    11
	.byte 0xFF, 0x0, 0x0, 0x0, 0xFF, 0x0, 0x0, 0x0, 0x10, 0x3, 0xFF, 0xFF
		  [magic32_0        ]  [magic32_4        ]       i[d]x [ma]gic8_10
		                                                             [ma]gic8_11
	.byte 0xFF, 0xFF, 0xFF, 0xFF, 0x1E, 0x0, 0x0, 0x0, 0x8D, 0x0, 0x0, 0x0
		  [so]und_effect8         [delay            ]  [sound_effect8    ]
		        [magic24_1     ]
	.byte 0x1, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0
	      [delay           ]  [end             ]
```

But this would not work either because it is also treated as magic in the repo:

```
  // This expects a sound effect index or FFs for command 0x10.
	.macro gfx_anim_data_sound sound_effect8:req, delay:req
	.byte \sound_effect8, 0x0, 0x0, 0x0
	.word \delay
	.endm
```

It might be easiest to treat it as `sound_effect32` but we suspect the value can only be in range of a u8. Let's add another command

```
	.macro gfx_anim_data_no_sound delay:req
	.word 0xFFFFFFFF
	.word \delay
	.endm
```

`0xFFFFFFFF` probably means disable which probably means no sound. 

```rust
if sound_effect8 == 0xFF {
	Inst {
		name: "gfx_anim_data_no_sound".to_owned(),
		cmd: 0x00, // it doesn't have a command
		opt_subcmd: None,
		fields: vec![
			Field::Magic24("magic32_0".to_owned(), 0xFFFFFFFF),
			Field::U32("delay".to_owned(), delay),
		],
	}
} else {
	Inst {
		name: "gfx_anim_data_sound".to_owned(),
		cmd: 0x00, // it doesn't have a command
		opt_subcmd: None,
		fields: vec![
			Field::U8("sound_effect8".to_owned(), sound_effect8),
			Field::Magic24("magic24_1".to_owned(), 0x000000),
			Field::U32("delay".to_owned(), delay),
		],
	}
}
```

2025-12-25 Wk 52 Thu - 12:29 +03:00

`off_8039308` right now looks strange, with indexed offsets to compressed data like `.word compSpriteWhiteDot_84E0C4C+0x20` to `.word compSpriteWhiteDot_84E0C4C+0xA0`. 

2025-12-25 Wk 52 Thu - 13:26 +03:00

It tried to cut there...

```diff
 off_8039308:
-       .word unk_3001AE0
-       .word 0x20
-       .word 0xFFFF0100
-       .word byte_87E672C
-       .word 0x1E
-       .word compSpriteWhiteDot_84E0C4C
-       .word 0x1
-       .word compSpriteWhiteDot_84E0C4C+0x20
-       .word 0x1
-       .word compSpriteWhiteDot_84E0C4C+0x40
-       .word 0x1
-       .word compSpriteWhiteDot_84E0C4C+0x60
-       .word 0x1
-       .word compSpriteWhiteDot_84E0C4C+0x80
-       .word 0x1
-       .word compSpriteWhiteDot_84E0C4C+0xA0
-       .word 0x1
-       .word 0x0
+       gfx_anim_pal_copy dest=unk_3001AE0 size=0x00000020 index=0x01
+       gfx_anim_data_ptr ptr=byte_87E672C delay=0x0000001E
+       gfx_anim_data_ptr ptr=compSpriteWhiteDot_84E0C4C delay=0x00000001
+       gfx_anim_data_ptr ptr=unk_84E0C6C delay=0x00000001
+       gfx_anim_data_ptr ptr=unk_84E0C8C delay=0x00000001
+       gfx_anim_data_ptr ptr=unk_84E0CAC delay=0x00000001
+       gfx_anim_data_ptr ptr=unk_84E0CCC delay=0x00000001
+       gfx_anim_data_ptr ptr=unk_84E0CEC delay=0x00000001
+       gfx_anim_end
+

 compSpriteWhiteDot_84E0C4C::
-       .incbin "data/sprites/compSpriteWhiteDot_84E0C4C.lz77"
+       .word 0x0006FC10, 0x06FC0000, 0x01000400, 0x007C051F, 0x00900000, 0x0300A403, 0x0300B855, 0xE00300CC
+
+unk_84E0C6C:
+       .word 0x00F40300, 0x01080503, 0x001C0000, 0x03003003, 0x03004455, 0x6C030058, 0x00800300, 0x00945503
+
+unk_84E0C8C:
+       .word 0x0300A803, 0xD00300BC, 0xE4500300, 0x00F80300, 0x00020C03, 0x00205500, 0x03003403, 0x5C030048
+
+unk_84E0CAC:
+       .word 0x70550300, 0x00840300, 0x03009803, 0x540300AC, 0xD40300C0, 0x00E80300, 0xC0036C03, 0x03007F00
+
+unk_84E0CCC:
+       .word 0x00000504, 0x80550002, 0x009C1360, 0x13C01403, 0x550300A8, 0xB413C024, 0xC0340300, 0x0300C013
+
+unk_84E0CEC:
+       .word 0x13C04455, 0x540300CC, 0x00D813C0, 0xC0645503, 0x0300E413, 0xF013C074, 0x84540300, 0x00FC13C0
+       .word 0x13C09403, 0x01D50408, 0x1413C047, 0xC0B41300, 0x13002013, 0x13C0C455, 0xD413002C, 0x003813C0
+       .word 0xC0E45513, 0x13004413, 0x5013C0F4, 0x042A1300, 0x5C13B006, 0xC0141300, 0x00AA6813, 0x13C02413
+       .word 0x34130074, 0xAA8013C0, 0xC0441300, 0x13008C13, 0x9813C054, 0x641300AA, 0x00A413C0, 0x13C07413
+       .word 0x1300AAB0, 0xBC13C084, 0xC0941300, 0x11DBC813, 0xD413C03F, 0x13C03F11, 0xC03F11E0, 0x11EC6D13
+       .word 0xF813C03F, 0x13403F11, 0x08CF0280, 0x77770000, 0x44770320, 0x0310EC11, 0x03300200, 0x30034011
+       .word 0x3F11001D, 0x03307744, 0x03300400, 0x08501E40, 0x50FD3740, 0x50575047, 0x4037601E, 0x20575047
+       .word 0xFF008320, 0x7367397F, 0x003DCD52, 0x25072D49, 0x293C1CC5, 0x8E18B300, 0x0F146A14, 0x38EC0249
+       .word 0x24A82CEA, 0x0000B200, 0xFF800100, 0x1144FFFF, 0xF00BF0FF, 0xF00BF00B, 0xF00BF00B, 0xF00BF00B
+       .word 0x0BF0FF0B, 0x0BF00BF0, 0x0BF00BF0, 0x0BF00BF0, 0xF0FB0BF0, 0xF00BF00B, 0x200BF00B, 0xBD04F80B
+       .word 0xF0FF0D00, 0xF00FF00F, 0xF00FF00F, 0xF00FF00F, 0xFF0FF00F, 0x0FF00FF0, 0x0FF00FF0, 0x0FF00FF0
+       .word 0x0FF00FF0, 0xF00FF0FF, 0xF00FF00F, 0xF00FF00F, 0xF00FF00F, 0x0FF0E00F, 0x0FD00FF0
+"data/sprites/compSpriteWhiteDot_84E0C4C.lz77"
```

Let's try to decompress `compSpriteWhiteDot_84E0C4C`. 

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
cp data/sprites/compSpriteWhiteDot_84E0C4C.lz77 a.lz
tools/gbagfx/gbagfx a.lz a.bin
dd skip=$(python3 -c "print(0x4)") if=a.bin of=a.spr bs=1
rm a.lz a.bin
```

We are able to decompress it to `a.spr`, so we assume it is correct. Let's assume though we got the end boundary wrong.  Right now we have proof that `unk_84E0C6C` is the minimum end boundary we know for `compSpriteWhiteDot_84E0C4C`. Let's treat this region as the compressed asset and try to decompress it.

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
dd skip=$(python3 -c "print(0x84E0C4C - 0x8000000)") count=$(python3 -c "print(0x84E0C6C - 0x84E0C4C)") if=bn6f.ign of=a.lz bs=1 2>/dev/null

tools/gbagfx/gbagfx a.lz a.bin

# out (error)
Fatal error while decompressing LZ file.
```

So this new block is not a valid `LZ file`, while the previous one was.

Let's try with the previous end boundary extracted at: `084e0e68`. 

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
dd skip=$(python3 -c "print(0x84E0C4C - 0x8000000)") count=$(python3 -c "print(0x84E0E68 - 0x84E0C4C)") if=bn6f.ign of=a.lz bs=1 2>/dev/null

tools/gbagfx/gbagfx a.lz a.bin
dd skip=$(python3 -c "print(0x4)") if=a.bin of=a.spr bs=1
rm a.lz a.bin
```

and this can generate `a.spr` just fine. If we are to trust that `084e0e68` is the true boundary for `compSpriteWhiteDot_84E0C4C` and that it is a compressed asset with no possible labels within (as verified by decompression), then there cannot be a `unk_84E0C6C`. 

We've also had 154 uses of `gfx_anim_pal_copy` which is also very trustworthy itself, yet we have a conflict here.

For now I added it manually:

```C
// TODO This needs investigation. How is it indexing into a compressed asset?
off_8039308:
	gfx_anim_pal_copy dest=unk_3001AE0 size=0x00000020 index=0x01
	gfx_anim_data_ptr ptr=byte_87E672C delay=0x0000001E
	gfx_anim_data_ptr ptr=compSpriteWhiteDot_84E0C4C+0x00 delay=0x00000001
	gfx_anim_data_ptr ptr=compSpriteWhiteDot_84E0C4C+0x20 delay=0x00000001
	gfx_anim_data_ptr ptr=compSpriteWhiteDot_84E0C4C+0x40 delay=0x00000001
	gfx_anim_data_ptr ptr=compSpriteWhiteDot_84E0C4C+0x60 delay=0x00000001
	gfx_anim_data_ptr ptr=compSpriteWhiteDot_84E0C4C+0x80 delay=0x00000001
	gfx_anim_data_ptr ptr=compSpriteWhiteDot_84E0C4C+0xA0 delay=0x00000001
	gfx_anim_end
```

Spawn [[004 Investigate use of off_8039308 which seems to be invalidly pointing inside a compressed asset]] ^spawn-invst-f89343

2025-12-25 Wk 52 Thu - 14:12 +03:00

```
Tracing gfx_anim_script Identifier { s: "byte_80392D8" }

thread 'main' panicked at src/bin/dump_script.rs:215:15:
script RomEa { ea: 0x080392D8 } "byte_80392D8": We can only cut in ROM EAs: IwRam(IwramEa { ea: 0x03001B80 })
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

```C
// in iwram_data.s
iPalette3001B60:: // 0x3001b60
	.space 0x120
iPalette3001C80:: // 0x3001c80
	.space 0xe0
```

```C
// in iwram_data.s
iPalette3001B60:: // 0x3001b60
	.space 0x20
unk_3001B80:: // 0x3001b80
	.space 0x100
```

2025-12-25 Wk 52 Thu - 14:23 +03:00

```
Tracing gfx_anim_script Identifier { s: "off_8084054" }

thread 'main' panicked at src/bin/dump_script.rs:384:25:
No instructions read, and yet we fail to read gfx_anim_script instructions at Identifier { s: "off_8084054" }: Partial read Error. Original error: Failed to read gfx anim script start command: Could not route command 52. Parsed instructions: [].
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

Those are indexed wrong 

`off_8084054` and `off_8084040` are lists, and not scripts themselves. They point to:

```
cargo run --release --bin dump_script trace gfx_anim dword_8140AA4 &&
cargo run --release --bin dump_script trace gfx_anim dword_8140AD4 &&
cargo run --release --bin dump_script trace gfx_anim dword_8140B1C &&
cargo run --release --bin dump_script trace gfx_anim dword_8140B4C &&
cargo run --release --bin dump_script trace gfx_anim dword_8140B7C &&

cargo run --release --bin dump_script trace gfx_anim dword_8140ABC &&
cargo run --release --bin dump_script trace gfx_anim dword_8140AEC &&
cargo run --release --bin dump_script trace gfx_anim dword_8140B34 &&
cargo run --release --bin dump_script trace gfx_anim dword_8140B64 &&
cargo run --release --bin dump_script trace gfx_anim dword_8140B94 &&
```

We're done!