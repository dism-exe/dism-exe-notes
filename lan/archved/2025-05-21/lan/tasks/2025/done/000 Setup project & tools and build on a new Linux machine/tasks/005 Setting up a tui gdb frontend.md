---
parent: "[[000 Setup project & tools and build on a new Linux machine]]"
spawned_by: "[[004 Setting up a different gdb frontend]]"
context_type: task
status: done
---

Parent: [[000 Setup project & tools and build on a new Linux machine]]

Spawned by: [[004 Setting up a different gdb frontend]] 

Spawned in: [[004 Setting up a different gdb frontend#^spawn-task-148408|^spawn-task-148408]]

# 1 Journal

Running gdb directly works, but it could be useful and more intuitive to have a graphical frontend.

We can still enhance the terminal gdb with the gdb-dashboard (git proj1)  [^r7]

```sh
wget -P ~ https://github.com/cyrus-and/gdb-dashboard/raw/master/.gdbinit
```

Now, restarting gdb-multiarch and connecting again (after stopping and restarting the gdb server in mgba), we get a nicer visual:

![[Pasted image 20250612080203.png]]
