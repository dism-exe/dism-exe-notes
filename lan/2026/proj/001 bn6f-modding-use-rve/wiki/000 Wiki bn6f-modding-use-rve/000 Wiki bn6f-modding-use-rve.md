Wiki Process Notes: [000 Wiki Proc bn6f-modding-use-rve](../../wikiproc/000%20Wiki%20Proc%20bn6f-modding-use-rve/000%20Wiki%20Proc%20bn6f-modding-use-rve.md)

# What?

This mod is inspired by the gentoo linux USE flags system.

The goal is to create a mod where the user can enable/disable use flags to modify the ROM.

This includes enabling/disabling game features, or replacing them with modded code.

This critically depends on the ROM being shiftable which is tracked under [000 Wiki Bn6f ROM Shifting](../../../000%20bn6f-rom-shifting/wiki/000%20Wiki%20Bn6f%20ROM%20Shifting/000%20Wiki%20Bn6f%20ROM%20Shifting.md).

We also want to use something like USE flag expressions to add a constraint on what a valid set of flags is.

This is the `use-rve` branch mod because it's to be used for reverse engineering, but the goal is that there will be a `use` mod for use by primarily modders.
