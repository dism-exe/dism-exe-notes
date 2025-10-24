

# 1 Objective

Data directives like

```C
off_8032A38:: .word byte_8503C90
	.word byte_85077F8
	.word byte_850799C
	.word byte_8509354
```

Get in the way of typing data, and fixing them manually each time takes forever. Typing also fails silently when it detects them as it cannot fix them itself.

For consistency, they all should look like

```C
off_8032A38:: 
	.word byte_8503C90
	.word byte_85077F8
	.word byte_850799C
	.word byte_8509354
```

There's also an inconsistency in the repository between `<TAB>` and spaces, so remember to use `<TAB>` for this to remain consistent.

# 2 Journal

2025-10-24 Wk 43 Fri - 13:57 +03:00

Spawn [[000 Replace pattern in repository into multilines preserving content]] ^spawn-howto-02890e


