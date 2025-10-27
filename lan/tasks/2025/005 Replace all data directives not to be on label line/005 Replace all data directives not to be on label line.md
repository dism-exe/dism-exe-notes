---
status: done
---

# 1 Objective

Data directives like

````C
off_8032A38:: .word byte_8503C90
	.word byte_85077F8
	.word byte_850799C
	.word byte_8509354
````

Get in the way of typing data, and fixing them manually each time takes forever. Typing also fails silently when it detects them as it cannot fix them itself.

For consistency, they all should look like

````C
off_8032A38:: 
	.word byte_8503C90
	.word byte_85077F8
	.word byte_850799C
	.word byte_8509354
````

There's also an inconsistency in the repository between `<TAB>` and spaces, so remember to use `<TAB>` for this to remain consistent.

# 2 Journal

2025-10-24 Wk 43 Fri - 13:57 +03:00

Spawn [000 Replace pattern in repository into multilines preserving content](howtos/000%20Replace%20pattern%20in%20repository%20into%20multilines%20preserving%20content.md) <a name="spawn-howto-02890e" />^spawn-howto-02890e

2025-10-25 Wk 43 Sat - 17:56 +03:00

Tried to make it similar to `/home/lan/src/cloned/gh/dism-exe/bn6f/replacep.sh`, but that gets files grepping for a label.

2025-10-25 Wk 43 Sat - 18:43 +03:00

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
sed -i 's/\([a-zA-Z_][0-9a-zA-Z_]*\)\(::\|:\) \(.byte\|.hword\|.word\) \(.*\)/\1\2\n\t\3 \4/g' $(find -regex ".*\(.s\)" -type f)
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
make clean && make -j$(nproc) assets && make -j$(nproc)

# out (relevant)
bn6f.gba: OK
````

````sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
git commit -m "take all data directives out of label lines" 

# out
[master 1635089a] take all data directives out of label lines
 187 files changed, 58890 insertions(+), 29445 deletions(-)
````
