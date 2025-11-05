---
parent: '[[000 Setup project & tools and build on a new Linux machine]]'
spawned_by: '[[006 Setting up gdb-multiarch with vscode for frontend]]'
context_type: issue
status: done
---

Parent: [000 Setup project & tools and build on a new Linux machine](../000%20Setup%20project%20&%20tools%20and%20build%20on%20a%20new%20Linux%20machine.md)

Spawned by: [006 Setting up gdb-multiarch with vscode for frontend](../tasks/006%20Setting%20up%20gdb-multiarch%20with%20vscode%20for%20frontend.md)

Spawned in: [<a name="spawn-issue-748850" />^spawn-issue-748850](../tasks/006%20Setting%20up%20gdb-multiarch%20with%20vscode%20for%20frontend.md#spawn-issue-748850)

# 1 Journal

From [gnu-rm downloads](https://developer.arm.com/downloads/-/gnu-rm), get [**gcc-arm-none-eabi-10.3-2021.10-x86_64-linux.tar.bz2**](https://developer.arm.com/-/media/Files/downloads/gnu-rm/10.3-2021.10/gcc-arm-none-eabi-10.3-2021.10-x86_64-linux.tar.bz2?rev=78196d3461ba4c9089a67b5f33edf82a&hash=5631ACEF1F8F237389F14B41566964EC)

Then extract the archive:

````sh
tar -xvjf ~/Downloads/gcc-arm-none-eabi-10.3-2021.10-x86_64-linux.tar.bz2
mv gcc-arm-none-eabi-10.3-2021.10 ~/Downloads
````

Add it to PATH wherever it makes sense for you. For me:

````sh
echo "export PATH=\"$HOME/Downloads/gcc-arm-none-eabi-10.3-2021.10/bin:\$PATH\"" >> ~/.shellrc.local
zsh
````

Now on running `arm-none-eabi-gdb` we encounter an issue:

````
arm-none-eabi-gdb: error while loading shared libraries: libncurses.so.5: cannot open shared object file: No such file or directory
````

Attempting to install

````sh
sudo apt install libncurses5
````

shows that I only have libncurses6.

(Attempt1) To try to install the missing libraries according to this  [stackoverflow answer](https://askubuntu.com/a/1528135):

````sh
wget http://archive.ubuntu.com/ubuntu/pool/universe/n/ncurses/libncurses5_6.2-0ubuntu2.1_i386.deb
wget http://archive.ubuntu.com/ubuntu/pool/universe/n/ncurses/libtinfo5_6.2-0ubuntu2.1_i386.deb
sudo dpkg -i libtinfo5_6.2-0ubuntu2.1_i386.deb
sudo dpkg -i libncurses5_6.2-0ubuntu2.1_i386.deb

````

This is the wrong packages, I had to uninstall them with

````sh
sudo dpkg -r libncurses5:i386 libtinfo5:i386
````

(Attempt2) For me I need the 64-bit versions:

````sh
wget http://archive.ubuntu.com/ubuntu/pool/universe/n/ncurses/libtinfo5_6.2-0ubuntu2.1_amd64.deb
wget http://archive.ubuntu.com/ubuntu/pool/universe/n/ncurses/libncurses5_6.2-0ubuntu2.1_amd64.deb
sudo dpkg -i libtinfo5_6.2-0ubuntu2.1_amd64.deb
sudo dpkg -i libncurses5_6.2-0ubuntu2.1_amd64.deb
rm libtinfo5_6.2-0ubuntu2.1_amd64.deb
rm libncurses5_6.2-0ubuntu2.1_amd64.deb
````

Now I confirm that the libraries are loaded:

````
$ arm-none-eabi-gdb --version
GNU gdb (GNU Arm Embedded Toolchain 10.3-2021.10) 10.2.90.20210621-git
Copyright (C) 2021 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

$ ldd "$(which arm-none-eabi-gdb)" 
[...]
````
