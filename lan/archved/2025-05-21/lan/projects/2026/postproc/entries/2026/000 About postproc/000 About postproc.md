
# 1 Journal

2026-02-17 Wk 8 Tue - 18:23 +03:00

The point of this project is to attempt to compute pre and post world state conditions for any given function in bn6f code. if we fix in place variable for the precondition of a function, we can simply directly emulate the function given this precondition, and generate postcondition slices every step by how the prior instruction modified the state.

If during execution we encounter a new aspect of the world not previously used, we add a new fixed variable to denote its prior value, and continue on manipulating it. In particular, there will be a lot of manipulations of the register file, as well as memory locations in EWRAM and IWRAM. There will also be reading from ROM. 

In addition, we will also parse type judgements and names from the repository. For example, often we name the function input, such as `r0 : size`. When encountered, then instead of using an anonymous name for the values, use the variable. So instead of `r0 := a0`, do `r0 := size0`.

We might also encounter type judgments on registers or memory locations, these should propagate across. We may need to blacklist exceptions where the system is loose with typing.

2026-02-17 Wk 8 Tue - 20:03 +03:00

Conditionals need to also be recorded:

```
pre: 
R0 := a0; R1 := a1.  

post:
R0 := a0;  R1 := if (a0 == 5) { 2 * a1 } else { 3 * a1 }.
```

2026-02-17 Wk 8 Tue - 20:08 +03:00

Spawn [[000 Similar projects to postproc]] ^spawn-entry-d5e9b9

