#lan #task #active #LT000 #setup #build

# Objective

I'm on a new machine running Linux. Let's setup the project again.

Here are some things we want:

- [x] bn6f repo building a ROM and giving OK
- [x] mgba to run the game
- [ ] gdb server to attach to mgba with symbol and type information from the built elf to step through

---
# Journal

2025-06-11 Wk 24 Wed - 16:29
- Follow the instructions in [link2] section Installation to get agbcc and bn6f. 

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

Redo make for tools/gbagfx

Then in ../.. (bn6f), `make assets` and `make`. 

2025-06-11 Wk 24 Wed - 16:39

Now that we have a ROM (bn6f.elf, bn6f.gba) let's setup mgba to be able to play! [link3] shows the mgba release files. As of writing this, the latest version is 0.10.5. So, similar to [link1]: 

```sh
wget -O ~/Downloads/mGBA.AppImage https://github.com/mgba-emu/mgba/releases/download/0.10.5/mGBA-0.10.5-appimage-x64.appimage
chmod +x ~/Downloads/mGBA.AppImage
~/Downloads/mGBA.AppImage --appimage-extract
mv squashfs-root ~/Downloads/mgba
sudo ln -s ~/Downloads/mgba/AppRun /usr/local/bin/mgba
```

---
# References

- [link1]: https://github.com/LanHikari22/bnbox/blob/main/Dockerfile
- [link2]: https://github.com/dism-exe/bn6f/blob/master/INSTALL.md
- [link3]: http://github.com/mgba-emu/mgba/releases/
- [link4]: https://github.com/mgba-emu/mgba/releases/download/0.10.3/mGBA-0.10.3-appimage-x64.appimage
- 