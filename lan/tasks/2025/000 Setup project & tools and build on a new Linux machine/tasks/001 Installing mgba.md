---
parent: '[[000 Setup project & tools and build on a new Linux machine]]'
spawned_by: '[[000 Setup project & tools and build on a new Linux machine]]'
context_type: task
status: done
---

Parent: [000 Setup project & tools and build on a new Linux machine](../000%20Setup%20project%20&%20tools%20and%20build%20on%20a%20new%20Linux%20machine.md)

Spawned by: [000 Setup project & tools and build on a new Linux machine](../000%20Setup%20project%20&%20tools%20and%20build%20on%20a%20new%20Linux%20machine.md)

Spawned in: [<a name="spawn-task-80b40e" />^spawn-task-80b40e](../000%20Setup%20project%20&%20tools%20and%20build%20on%20a%20new%20Linux%20machine.md#spawn-task-80b40e)

# 1 Journal

2025-06-11 Wk 24 Wed - 16:39

Now that we have a ROM (bn6f.elf, bn6f.gba) let's setup mgba to be able to play!

[gh mgba-emu/mgba releases](http://github.com/mgba-emu/mgba/releases/) shows the mgba release files. As of writing this, the latest version is 0.10.5. So, similar to [bnbox Dockerfile](https://github.com/LanHikari22/bnbox/blob/main/Dockerfile):

````sh
wget -O ~/Downloads/mGBA.AppImage https://github.com/mgba-emu/mgba/releases/download/0.10.5/mGBA-0.10.5-appimage-x64.appimage
chmod +x ~/Downloads/mGBA.AppImage
~/Downloads/mGBA.AppImage --appimage-extract
mv squashfs-root ~/Downloads/mgba
sudo ln -s ~/Downloads/mgba/AppRun /usr/local/bin/mgba
````
