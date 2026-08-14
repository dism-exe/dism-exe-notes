---
parent: '[[000 Document event flags for textscript]]'
spawned_by: '[[000 Document event flags for textscript]]'
context_type: investigation
status: done
---

Parent: [000 Document event flags for textscript](../000%20Document%20event%20flags%20for%20textscript.md)

Spawned by: [000 Document event flags for textscript](../000%20Document%20event%20flags%20for%20textscript.md)

Spawned in: [^spawn-invst-0eba00](../000%20Document%20event%20flags%20for%20textscript.md#spawn-invst-0eba00)

# 1 Journal

2026-01-24 Wk 4 Sat - 06:54 +03:00

One instance replace builds OK:

````
	ts_check_flag [
		flag: EVENT_11FF,
		jumpIfTrue: CompText87A2C04_unk4_id,
		jumpIfFalse: TS_CONTINUE,
	]
````

2026-01-24 Wk 4 Sat - 06:58 +03:00

Trying to just hardcode `0x171D` to see if the issue is elsewhere:

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
sed -i 's/EVENT_171D/0x171D/g' $(find -regex ".*\(.s\)" -type f)
````

This also fails build. In both cases we see many differences via `python3 tools/fdiff.py bn6f.ign bn6f.gba | less`.

We can make it more readable with

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
python3 tools/fdiff.py bn6f.ign bn6f.gba | sed 's/@ /@ 0x8/g' | python3 ~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.py ea_to_sym_filter bn6f.sym | less
````

This is evidence that some shifting happened somehow:

````
Found diff #0 @ off_804483C: bin1=CompText8775E00+C20 bin2=CompText8776A20
Found diff #1 @ off_804483C+04: bin1=CompText8776A20+22C bin2=CompText8776C50
Found diff #2 @ off_804483C+08: bin1=CompText8776C50+424 bin2=CompText8777078
Found diff #3 @ off_804483C+0C: bin1=CompText8777078+3AC bin2=CompText8777428
Found diff #4 @ off_804483C+10: bin1=CompText8777428+250 bin2=CompText877767C
````

2026-01-24 Wk 4 Sat - 07:57 +03:00

Even if you change just one value to a faulty one:

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
sed -zi 's/\tts_check_flag \[\n\t\tflag: 0x171D,/\tts_check_flag \[\n\t\tflag: 0xFFFF,/g' $(find -regex ".*\(.s\)" -type f)
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
python3 tools/fdiff.py bn6f.ign bn6f.gba | sed 's/@ /@ 0x8/g' | python3 ~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.py ea_to_sym_filter bn6f.sym --comment-original | less

# out (relevant)
Found diff #1 @ /*0x802F35C*/ off_802F350+0C: bin1=/*0x87F93B4*/ byte_87F93B4+08 bin2=/*0x87F93AC*/ byte_87F93B4
Found diff #2 @ /*0x802F364*/ off_802F350+14: bin1=/*0x87F93D4*/ byte_87F93D4+08 bin2=/*0x87F93CC*/ byte_87F93D4
Found diff #3 @ /*0x802F36C*/ off_802F350+1C: bin1=/*0x87F93F4*/ byte_87F93F4+08 bin2=/*0x87F93EC*/ byte_87F93F4
````

2026-01-24 Wk 4 Sat - 08:42 +03:00

Maybe the reason it's shifting is because the compressed assets end up being of different size even though the changes should preserve the asset's size?

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
ls -al data/textscript/compressed/CompText87EE1AC.s.bin
ls -al data/textscript/compressed/CompText87EE1AC.s.lz

# original (build OK)
-rw-rw-r-- 1 lan lan 620 Jan 24 08:44 data/textscript/compressed/CompText87EE1AC.s.bin
-rw-rw-r-- 1 lan lan 324 Jan 24 08:44 data/textscript/compressed/CompText87EE1AC.s.lz

# 0x171D -> 0xFFFF (build FAILED)
-rw-rw-r-- 1 lan lan 620 Jan 24 08:48 data/textscript/compressed/CompText87EE1AC.s.bin
-rw-rw-r-- 1 lan lan 324 Jan 24 08:48 data/textscript/compressed/CompText87EE1AC.s.lz
````

No changes for the one selected. How about all?

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
git status | grep 'data/textscript/compressed' | sed 's/modified://g' | sed 's/\.s/.s.lz/g' | xargs

# out
data/textscript/compressed/CompText87385CC.s.lz data/textscript/compressed/CompText873C0D8.s.lz data/textscript/compressed/CompText87565E8.s.lz data/textscript/compressed/CompText8759870.s.lz data/textscript/compressed/CompText8759C10.s.lz data/textscript/compressed/CompText875A918.s.lz data/textscript/compressed/CompText875B4B0.s.lz data/textscript/compressed/CompText875BFD8.s.lz data/textscript/compressed/CompText8774530.s.lz data/textscript/compressed/CompText87EE1AC.s.lz data/textscript/compressed/CompText87EFE14.s.lz data/textscript/compressed/CompText87F0FF4.s.lz data/textscript/compressed/CompText87F1BA8.s.lz data/textscript/compressed/CompText87F1E10.s.lz data/textscript/compressed/CompText87F2094.s.lz
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
ls -al $(echo data/textscript/compressed/CompText87385CC.s.lz data/textscript/compressed/CompText873C0D8.s.lz data/textscript/compressed/CompText87565E8.s.lz data/textscript/compressed/CompText8759870.s.lz data/textscript/compressed/CompText8759C10.s.lz data/textscript/compressed/CompText875A918.s.lz data/textscript/compressed/CompText875B4B0.s.lz data/textscript/compressed/CompText875BFD8.s.lz data/textscript/compressed/CompText8774530.s.lz data/textscript/compressed/CompText87EE1AC.s.lz data/textscript/compressed/CompText87EFE14.s.lz data/textscript/compressed/CompText87F0FF4.s.lz data/textscript/compressed/CompText87F1BA8.s.lz data/textscript/compressed/CompText87F1E10.s.lz data/textscript/compressed/CompText87F2094.s.lz)

ls -al $(echo data/textscript/compressed/CompText87385CC.s.bin data/textscript/compressed/CompText873C0D8.s.bin data/textscript/compressed/CompText87565E8.s.bin data/textscript/compressed/CompText8759870.s.bin data/textscript/compressed/CompText8759C10.s.bin data/textscript/compressed/CompText875A918.s.bin data/textscript/compressed/CompText875B4B0.s.bin data/textscript/compressed/CompText875BFD8.s.bin data/textscript/compressed/CompText8774530.s.bin data/textscript/compressed/CompText87EE1AC.s.bin data/textscript/compressed/CompText87EFE14.s.bin data/textscript/compressed/CompText87F0FF4.s.bin data/textscript/compressed/CompText87F1BA8.s.bin data/textscript/compressed/CompText87F1E10.s.bin data/textscript/compressed/CompText87F2094.s.bin)

# original (build OK)
-rw-rw-r-- 1 lan lan  732 Jan 24 09:03 data/textscript/compressed/CompText87385CC.s.lz
-rw-rw-r-- 1 lan lan 1228 Jan 24 09:03 data/textscript/compressed/CompText873C0D8.s.lz
-rw-rw-r-- 1 lan lan 1212 Jan 24 09:03 data/textscript/compressed/CompText87565E8.s.lz
-rw-rw-r-- 1 lan lan  928 Jan 24 09:03 data/textscript/compressed/CompText8759870.s.lz
-rw-rw-r-- 1 lan lan  744 Jan 24 09:03 data/textscript/compressed/CompText8759C10.s.lz
-rw-rw-r-- 1 lan lan 1868 Jan 24 09:03 data/textscript/compressed/CompText875A918.s.lz
-rw-rw-r-- 1 lan lan 1156 Jan 24 09:03 data/textscript/compressed/CompText875B4B0.s.lz
-rw-rw-r-- 1 lan lan  596 Jan 24 09:03 data/textscript/compressed/CompText875BFD8.s.lz
-rw-rw-r-- 1 lan lan 2584 Jan 24 09:03 data/textscript/compressed/CompText8774530.s.lz
-rw-rw-r-- 1 lan lan  324 Jan 24 09:03 data/textscript/compressed/CompText87EE1AC.s.lz
-rw-rw-r-- 1 lan lan  600 Jan 24 09:03 data/textscript/compressed/CompText87EFE14.s.lz
-rw-rw-r-- 1 lan lan  644 Jan 24 09:03 data/textscript/compressed/CompText87F0FF4.s.lz
-rw-rw-r-- 1 lan lan  616 Jan 24 09:03 data/textscript/compressed/CompText87F1BA8.s.lz
-rw-rw-r-- 1 lan lan  644 Jan 24 09:03 data/textscript/compressed/CompText87F1E10.s.lz
-rw-rw-r-- 1 lan lan 1128 Jan 24 09:03 data/textscript/compressed/CompText87F2094.s.lz

# applied `sed -zi 's/\tts_check_flag \[\n\t\tflag: 0x171D,/\tts_check_flag \[\n\t\tflag: 0xFFFF,/g' $(find -regex ".*\(.s\)" -type f)`
-rw-rw-r-- 1 lan lan  732 Jan 24 09:05 data/textscript/compressed/CompText87385CC.s.lz
-rw-rw-r-- 1 lan lan 1228 Jan 24 09:05 data/textscript/compressed/CompText873C0D8.s.lz
-rw-rw-r-- 1 lan lan 1212 Jan 24 09:05 data/textscript/compressed/CompText87565E8.s.lz
-rw-rw-r-- 1 lan lan  928 Jan 24 09:05 data/textscript/compressed/CompText8759870.s.lz
-rw-rw-r-- 1 lan lan  744 Jan 24 09:05 data/textscript/compressed/CompText8759C10.s.lz
-rw-rw-r-- 1 lan lan 1868 Jan 24 09:05 data/textscript/compressed/CompText875A918.s.lz
-rw-rw-r-- 1 lan lan 1156 Jan 24 09:05 data/textscript/compressed/CompText875B4B0.s.lz
-rw-rw-r-- 1 lan lan  596 Jan 24 09:05 data/textscript/compressed/CompText875BFD8.s.lz
-rw-rw-r-- 1 lan lan 2584 Jan 24 09:05 data/textscript/compressed/CompText8774530.s.lz
-rw-rw-r-- 1 lan lan  324 Jan 24 09:05 data/textscript/compressed/CompText87EE1AC.s.lz
-rw-rw-r-- 1 lan lan  600 Jan 24 09:05 data/textscript/compressed/CompText87EFE14.s.lz
-rw-rw-r-- 1 lan lan  640 Jan 24 09:05 data/textscript/compressed/CompText87F0FF4.s.lz
-rw-rw-r-- 1 lan lan  616 Jan 24 09:05 data/textscript/compressed/CompText87F1BA8.s.lz
-rw-rw-r-- 1 lan lan  644 Jan 24 09:05 data/textscript/compressed/CompText87F1E10.s.lz
-rw-rw-r-- 1 lan lan 1124 Jan 24 09:05 data/textscript/compressed/CompText87F2094.s.lz

# original (build OK)
-rw-rw-r-- 1 lan lan 1358 Jan 24 09:03 data/textscript/compressed/CompText87385CC.s.bin
-rw-rw-r-- 1 lan lan 3870 Jan 24 09:03 data/textscript/compressed/CompText873C0D8.s.bin
-rw-rw-r-- 1 lan lan 1717 Jan 24 09:03 data/textscript/compressed/CompText87565E8.s.bin
-rw-rw-r-- 1 lan lan 1327 Jan 24 09:03 data/textscript/compressed/CompText8759870.s.bin
-rw-rw-r-- 1 lan lan 1064 Jan 24 09:03 data/textscript/compressed/CompText8759C10.s.bin
-rw-rw-r-- 1 lan lan 3244 Jan 24 09:03 data/textscript/compressed/CompText875A918.s.bin
-rw-rw-r-- 1 lan lan 1582 Jan 24 09:03 data/textscript/compressed/CompText875B4B0.s.bin
-rw-rw-r-- 1 lan lan  828 Jan 24 09:03 data/textscript/compressed/CompText875BFD8.s.bin
-rw-rw-r-- 1 lan lan 4505 Jan 24 09:03 data/textscript/compressed/CompText8774530.s.bin
-rw-rw-r-- 1 lan lan  620 Jan 24 09:03 data/textscript/compressed/CompText87EE1AC.s.bin
-rw-rw-r-- 1 lan lan 1070 Jan 24 09:03 data/textscript/compressed/CompText87EFE14.s.bin
-rw-rw-r-- 1 lan lan 1202 Jan 24 09:03 data/textscript/compressed/CompText87F0FF4.s.bin
-rw-rw-r-- 1 lan lan 1151 Jan 24 09:03 data/textscript/compressed/CompText87F1BA8.s.bin
-rw-rw-r-- 1 lan lan 1231 Jan 24 09:03 data/textscript/compressed/CompText87F1E10.s.bin
-rw-rw-r-- 1 lan lan 2055 Jan 24 09:03 data/textscript/compressed/CompText87F2094.s.bin

# applied `sed -zi 's/\tts_check_flag \[\n\t\tflag: 0x171D,/\tts_check_flag \[\n\t\tflag: 0xFFFF,/g' $(find -regex ".*\(.s\)" -type f)`
-rw-rw-r-- 1 lan lan 1358 Jan 24 09:05 data/textscript/compressed/CompText87385CC.s.bin
-rw-rw-r-- 1 lan lan 3870 Jan 24 09:05 data/textscript/compressed/CompText873C0D8.s.bin
-rw-rw-r-- 1 lan lan 1717 Jan 24 09:05 data/textscript/compressed/CompText87565E8.s.bin
-rw-rw-r-- 1 lan lan 1327 Jan 24 09:05 data/textscript/compressed/CompText8759870.s.bin
-rw-rw-r-- 1 lan lan 1064 Jan 24 09:05 data/textscript/compressed/CompText8759C10.s.bin
-rw-rw-r-- 1 lan lan 3244 Jan 24 09:05 data/textscript/compressed/CompText875A918.s.bin
-rw-rw-r-- 1 lan lan 1582 Jan 24 09:05 data/textscript/compressed/CompText875B4B0.s.bin
-rw-rw-r-- 1 lan lan  828 Jan 24 09:05 data/textscript/compressed/CompText875BFD8.s.bin
-rw-rw-r-- 1 lan lan 4505 Jan 24 09:05 data/textscript/compressed/CompText8774530.s.bin
-rw-rw-r-- 1 lan lan  620 Jan 24 09:05 data/textscript/compressed/CompText87EE1AC.s.bin
-rw-rw-r-- 1 lan lan 1070 Jan 24 09:05 data/textscript/compressed/CompText87EFE14.s.bin
-rw-rw-r-- 1 lan lan 1202 Jan 24 09:05 data/textscript/compressed/CompText87F0FF4.s.bin
-rw-rw-r-- 1 lan lan 1151 Jan 24 09:05 data/textscript/compressed/CompText87F1BA8.s.bin
-rw-rw-r-- 1 lan lan 1231 Jan 24 09:05 data/textscript/compressed/CompText87F1E10.s.bin
-rw-rw-r-- 1 lan lan 2055 Jan 24 09:05 data/textscript/compressed/CompText87F2094.s.bin
````

Okay, we can notice that the `*.s.bin` files are all the same, and this should be the case. A change in `XXXX` for `.hword XXXX` should carry with it no size change. But notice that this is not the case with the compressed assets:

````sh
# original (build OK)
-rw-rw-r-- 1 lan lan  644 Jan 24 09:03 data/textscript/compressed/CompText87F0FF4.s.lz
-rw-rw-r-- 1 lan lan 1128 Jan 24 09:03 data/textscript/compressed/CompText87F2094.s.lz

# applied `sed -zi 's/\tts_check_flag \[\n\t\tflag: 0x171D,/\tts_check_flag \[\n\t\tflag: 0xFFFF,/g' $(find -regex ".*\(.s\)" -type f)`
-rw-rw-r-- 1 lan lan  640 Jan 24 09:05 data/textscript/compressed/CompText87F0FF4.s.lz
-rw-rw-r-- 1 lan lan 1124 Jan 24 09:05 data/textscript/compressed/CompText87F2094.s.lz
````

They're almost all identical with exception for these two files. So that change of content *can* cause a shift.

In both cases, `0xFFFF` appeared multiple times.

2026-01-24 Wk 4 Sat - 10:04 +03:00

Let's do the proper substitution again

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
sed -zi 's/\tts_check_flag \[\n\t\tflag: 0x\([A-F0-9]*\),/\tts_check_flag \[\n\t\tflag: EVENT_\1,/g' $(find -regex ".*\(.s\)" -type f)
sed -i 's/EVENT_171D/EVENT_PET_NAVI_ACTIVE/g' $(find -regex ".*\(.s\)" -type f)
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
git status | grep 'data/textscript/compressed' | sed 's/modified://g' | sed 's/\.s/.s.lz/g' | xargs > a.ign
git status | grep 'data/textscript/compressed' | sed 's/modified://g' | sed 's/\.s/.s.bin/g' | xargs > b.ign
````

````sh
# after applying changes
ls -al $(cat a.ign) | column -t -o @ | tr -d ' ' | cut -d'@' -f5,9 | tr '@' ' ' > lz_new.ign
ls -al $(cat b.ign) | column -t -o @ | tr -d ' ' | cut -d'@' -f5,9 | tr '@' ' ' > bin_new.ign

# original (OK)
ls -al $(cat a.ign) | column -t -o @ | tr -d ' ' | cut -d'@' -f5,9 | tr '@' ' ' > lz_orig.ign
ls -al $(cat b.ign) | column -t -o @ | tr -d ' ' | cut -d'@' -f5,9 | tr '@' ' ' > bin_orig.ign
````

````diff
# in /home/lan/src/cloned/gh/dism-exe/bn6f
diff -u lz_orig.ign lz_new.ign

# out
--- lz_orig.ign 2026-01-24 14:42:22.470276743 +0300
+++ lz_new.ign  2026-01-24 14:40:22.944270360 +0300
@@ -156,11 +156,11 @@
 704 data/textscript/compressed/CompText8774F48.s.lz
 1252 data/textscript/compressed/CompText877567C.s.lz
 672 data/textscript/compressed/CompText8775B60.s.lz
-3104 data/textscript/compressed/CompText8775E00.s.lz
+3108 data/textscript/compressed/CompText8775E00.s.lz
 560 data/textscript/compressed/CompText8776A20.s.lz
 944 data/textscript/compressed/CompText8777078.s.lz
 596 data/textscript/compressed/CompText8777428.s.lz
-3460 data/textscript/compressed/CompText877767C.s.lz
+3456 data/textscript/compressed/CompText877767C.s.lz
 748 data/textscript/compressed/CompText8778400.s.lz
 332 data/textscript/compressed/CompText87789F4.s.lz
 1896 data/textscript/compressed/CompText8778B40.s.lz
````

````diff
# in /home/lan/src/cloned/gh/dism-exe/bn6f
diff -u bin_orig.ign bin_new.ign

# out
[nothing]
````

We already know this change shouldn't induce a difference in the bins since the content change is within the size constraints.

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
python3 tools/fdiff.py /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/data/textscript/compressed/CompText8775E00.s.bin data/textscript/compressed/CompText8775E00.s.bin

# out
Found diff #0 @ 000124: bin1=0x6172900 bin2=0x6000000
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
python3 tools/fdiff.py /home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/data/textscript/compressed/CompText877767C.s.bin data/textscript/compressed/CompText877767C.s.bin

# out
Found diff #0 @ 0000E4: bin1=0x2900EFE6 bin2=0xEFE6
Found diff #1 @ 0000E8: bin1=0xF5FF0417 bin2=0xF5FF0400
Found diff #2 @ 000118: bin1=0x3172900 bin2=0x3000000
````

2026-01-24 Wk 4 Sat - 14:59 +03:00

For `CompText8775E00` the difference is in here:

````C
	def_text_script CompText8775E00_unk3
	ts_check_flag [
		flag: EVENT_1729,
		jumpIfTrue: CompText8775E00_unk6_id,
		jumpIfFalse: TS_CONTINUE,
	]
````

Which I found out by hardcoding it out and that resolving the conflict diff between the two binary files.

`EVENT_1729` does not exist. So why does it build? This was supposed to point to `EVENT_COPYBOT_ACTIVE`. Not only does it build, but it also gets defaulted to zeros?

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
sed -i 's/EVENT_1729/EVENT_COPYBOT_ACTIVE/g' $(find -regex ".*\(.s\)" -type f)
````

Now we get an OK build.

I am unsure why `EVENT_1729` does not trigger a build error as `EVENT_171D` did for me before, but for now this resolved our problem.
