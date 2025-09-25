---
parent: "[[000 Setup project & tools and build on a new Linux machine]]"
spawned_by: "[[000 Setup project & tools and build on a new Linux machine]]"
context_type: task
status: done
---

Parent: [[000 Setup project & tools and build on a new Linux machine]]

Spawned by: [[000 Setup project & tools and build on a new Linux machine]] 

Spawned in: [[000 Setup project & tools and build on a new Linux machine#^spawn-task-26141b|^spawn-task-26141b]]

# 1 Journal

2025-06-11 Wk 24 Wed - 16:29

- Follow the instructions in [INSTALL.md](https://github.com/dism-exe/bn6f/blob/master/INSTALL.md) section Installation to get agbcc and bn6f. 

We fail at the step 
```
cd tools/gbagfx
make
```


![[Pasted image 20250611163506.png]]

Need to get libpng:

```sh
sudo apt install libpng-dev
```

Redo make for `tools/gbagfx`

Then in `../..` (bn6f), 

`make assets` and `make`. 
