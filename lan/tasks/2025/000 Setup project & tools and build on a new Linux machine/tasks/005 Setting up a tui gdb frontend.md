---
parent: '[[000 Setup project & tools and build on a new Linux machine]]'
spawned_by: '[[004 Setting up a different gdb frontend]]'
context_type: task
status: done
---

Parent: [000 Setup project & tools and build on a new Linux machine](../000%20Setup%20project%20&%20tools%20and%20build%20on%20a%20new%20Linux%20machine.md)

Spawned by: [004 Setting up a different gdb frontend](004%20Setting%20up%20a%20different%20gdb%20frontend.md)

Spawned in: [<a name="spawn-task-148408" />^spawn-task-148408](004%20Setting%20up%20a%20different%20gdb%20frontend.md#spawn-task-148408)

# 1 Journal

Running gdb directly works, but it could be useful and more intuitive to have a graphical frontend.

We can still enhance the terminal gdb with the gdb-dashboard (git proj1)  \[<a name="r7" />^r7\]

````sh
wget -P ~ https://github.com/cyrus-and/gdb-dashboard/raw/master/.gdbinit
````

Now, restarting gdb-multiarch and connecting again (after stopping and restarting the gdb server in mgba), we get a nicer visual:

![Pasted image 20250612080203.png](../../../../../attachments/Pasted%20image%2020250612080203.png)
