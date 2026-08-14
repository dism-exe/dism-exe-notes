# 1 Journal

2026-01-24 Wk 4 Sat - 05:57 +03:00

Patterns like

````
ts_check_flag [
	flag: 0xC20,
	jumpIfTrue: CompText874041C_unk142_id,
	jumpIfFalse: TS_CONTINUE,
]
````

We want to replace that `flag: 0xC20` with the actual flag. Generalize for all `ts_check_flag` in the repository of this form.

[005 Replace all data directives not to be on label line](../../2025/done/005%20Replace%20all%20data%20directives%20not%20to%20be%20on%20label%20line/005%20Replace%20all%20data%20directives%20not%20to%20be%20on%20label%20line.md) could be of help. There we did

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
sed -i 's/\([a-zA-Z_][0-9a-zA-Z_]*\)\(::\|:\) \(.byte\|.hword\|.word\) \(.*\)/\1\2\n\t\3 \4/g' $(find -regex ".*\(.s\)" -type f)
````

Though this replaces a line for multiple lines, we might be able to also apply it for multiple lines.

2026-01-24 Wk 4 Sat - 06:26 +03:00

This has effect:

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
sed -i 's/\tts_check_flag \[/TEST1\nTEST2/g' $(find -regex ".*\(.s\)" -type f)
````

But this does not:

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
sed -i 's/\tts_check_flag \[\n/TEST1\nTEST2/g' $(find -regex ".*\(.s\)" -type f)
````

Doesn't seem we're able to multiline replace this way. We were able to place in multiple lines for a line, but not replace multiple lines.

This [stackexchange answer](https://unix.stackexchange.com/a/26290) shows that `sed` has a language for intricate manipulations of text.

This [stackexchange answer](https://unix.stackexchange.com/a/525524) shows that we can use the `-z` option so that GNU sed can accept the new line. So now this works:

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
sed -zi 's/\tts_check_flag \[\n\t\tflag: 0xC20,/TEST1\nTEST2/g' $(find -regex ".*\(.s\)" -type f)
````

2026-01-24 Wk 4 Sat - 06:42 +03:00

If we just remove the `0x`,  then we have a direct mapping to the event labels themselves:

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
sed -zi 's/\tts_check_flag \[\n\t\tflag: 0x\([A-F0-9]*\),/\tts_check_flag \[\n\t\tflag: EVENT_\1,/g' $(find -regex ".*\(.s\)" -type f)
````

This will fail just when we have renamed the labels:

````
(.data+0x4edaf6): undefined reference to `EVENT_171D'
````

In this case it's `EVENT_PET_NAVI_ACTIVE`

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
sed -i 's/EVENT_171D/EVENT_PET_NAVI_ACTIVE/g' $(find -regex ".*\(.s\)" -type f)
````

Though we fail build for some reason.

Spawn [000 Invst failing build when replacing hardcoded events for ts_check_flag](investigations/000%20Invst%20failing%20build%20when%20replacing%20hardcoded%20events%20for%20ts_check_flag.md) ^spawn-invst-0eba00

2026-01-24 Wk 4 Sat - 15:06 +03:00

Need to make sure to also do

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
sed -i 's/EVENT_1729/EVENT_COPYBOT_ACTIVE/g' $(find -regex ".*\(.s\)" -type f)
````

Now that we covered `ts_check_flag`, we need to do the others too. There's `ts_flag_set`, `ts_flag_clear`, `ts_flag_toggle`, `ts_flag_multi_set`, `ts_check_multi_flag`

Some other commands unused, like `ts_wait_flag`, `ts_wait_flag_clear`, `ts_flag_multi_clear`

`ts_flag_toggle` had only one use which I replaced manually.

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
sed -i 's/\tts_flag_set flag=0x\([A-F0-9]*\)/\tts_flag_set flag=EVENT_\1/g' $(find -regex ".*\(.s\)" -type f)
sed -i 's/EVENT_171D/EVENT_PET_NAVI_ACTIVE/g' $(find -regex ".*\(.s\)" -type f)
sed -i 's/EVENT_1729/EVENT_COPYBOT_ACTIVE/g' $(find -regex ".*\(.s\)" -type f)
````

We fail build, likely for the same reason as before, with undefined enums going as 0.

2026-01-24 Wk 4 Sat - 15:30 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
cat constants/enums/ewram_flags.inc | grep 'enum ' > a.ign

# in vim

# Filter out all instances with only hex after EVENT_
:g/EVENT_\([A-F0-9]\)*$/d

# out
enum EVENT_NPC_OBJECTS_DISABLED
enum EVENT_NON_NPC_ANIMATION_LOCKED
enum EVENT_PET_COMM_SAVE_DISABLED
enum EVENT_PET_DISABLED
enum EVENT_PLAYER_CAN_MOVE
enum EVENT_EVENT_CUR_DIR_LOCKED
enum EVENT_1716 // constantly written
enum EVENT_1717_PLAYER_ADVANCE_FORWARD
enum EVENT_PET_NAVI_ACTIVE
enum EVENT_1722_BEAST_LINK_GATE_RELATED
enum EVENT_L_MESSAGE_ACTIVE
enum EVENT_COPYBOT_ACTIVE
enum EVENT_IN_SLIPRUN_STATE
````

````sh
#sed -i 's/EVENT_1701/EVENT_NPC_OBJECTS_DISABLED/g' $(find -regex ".*\(.s\)" -type f)
#sed -i 's/EVENT_1702/EVENT_NON_NPC_ANIMATION_LOCKED/g' $(find -regex ".*\(.s\)" -type f)
#sed -i 's/EVENT_1706/EVENT_PET_COMM_SAVE_DISABLED/g' $(find -regex ".*\(.s\)" -type f)
#sed -i 's/EVENT_1707/EVENT_PET_DISABLED/g' $(find -regex ".*\(.s\)" -type f)
#sed -i 's/EVENT_1714/EVENT_PLAYER_CAN_MOVE/g' $(find -regex ".*\(.s\)" -type f)
sed -i 's/EVENT_1715/EVENT_EVENT_CUR_DIR_LOCKED/g' $(find -regex ".*\(.s\)" -type f)
#sed -i 's/EVENT_1717/EVENT_1717_PLAYER_ADVANCE_FORWARD/g' $(find -regex ".*\(.s\)" -type f)
sed -i 's/EVENT_171D/EVENT_PET_NAVI_ACTIVE/g' $(find -regex ".*\(.s\)" -type f)
#sed -i 's/EVENT_1722/EVENT_1722_BEAST_LINK_GATE_RELATED/g' $(find -regex ".*\(.s\)" -type f)
#sed -i 's/EVENT_1728/EVENT_L_MESSAGE_ACTIVE/g' $(find -regex ".*\(.s\)" -type f)
sed -i 's/EVENT_1729/EVENT_COPYBOT_ACTIVE/g' $(find -regex ".*\(.s\)" -type f)
#sed -i 's/EVENT_173D/EVENT_IN_SLIPRUN_STATE/g' $(find -regex ".*\(.s\)" -type f)
````

Now we build OK!

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
sed -i 's/\tts_flag_clear flag=0x\([A-F0-9]*\)/\tts_flag_clear flag=EVENT_\1/g' $(find -regex ".*\(.s\)" -type f)
sed -zi 's/\tts_flag_multi_set \[\n\t\tflag: 0x\([A-F0-9]*\),/\tts_flag_multi_set \[\n\t\tflag: EVENT_\1,/g' $(find -regex ".*\(.s\)" -type f)
sed -zi 's/\tts_check_multi_flag \[\n\t\tflag: 0x\([A-F0-9]*\),/\tts_check_multi_flag \[\n\t\tflag: EVENT_\1,/g' $(find -regex ".*\(.s\)" -type f)

# after each then confirm build OK
sed -i 's/EVENT_1701/EVENT_NPC_OBJECTS_DISABLED/g' $(find -regex ".*\(.s\)" -type f)
sed -i 's/EVENT_1702/EVENT_NON_NPC_ANIMATION_LOCKED/g' $(find -regex ".*\(.s\)" -type f)
sed -i 's/EVENT_1706/EVENT_PET_COMM_SAVE_DISABLED/g' $(find -regex ".*\(.s\)" -type f)
sed -i 's/EVENT_1707/EVENT_PET_DISABLED/g' $(find -regex ".*\(.s\)" -type f)
sed -i 's/EVENT_1714/EVENT_PLAYER_CAN_MOVE/g' $(find -regex ".*\(.s\)" -type f)
sed -i 's/EVENT_1715/EVENT_EVENT_CUR_DIR_LOCKED/g' $(find -regex ".*\(.s\)" -type f)
sed -i 's/EVENT_171D/EVENT_PET_NAVI_ACTIVE/g' $(find -regex ".*\(.s\)" -type f)
sed -i 's/EVENT_1728/EVENT_L_MESSAGE_ACTIVE/g' $(find -regex ".*\(.s\)" -type f)
sed -i 's/EVENT_1729/EVENT_COPYBOT_ACTIVE/g' $(find -regex ".*\(.s\)" -type f)
sed -i 's/EVENT_173D/EVENT_IN_SLIPRUN_STATE/g' $(find -regex ".*\(.s\)" -type f)
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
````
