
# 1 Journal

2025-09-25 Wk 39 Thu - 06:15

For commit `ddc1c1e3`,

```sh
# in /home/lan/src/cloned/gh/dism-exe/bn6f
tools/doc_scripts/replacesig.sh "CopyWords" "(src: *const u32, mut_dest: *mut u32, size: u32) -> ()"
tools/doc_scripts/replacesig.sh "CopyByEightWords" "(src: *const u32, mut_dest: *mut u32, size: u32) -> ()"
tools/doc_scripts/replacesig.sh "SWI_CpuFastSet" "(src: *const u32, mut_dest: *mut u32, mode: int) -> ()"
tools/doc_scripts/replacesig.sh "ZeroFillByByte" "(mut_mem: *mut (), num_bytes: usize) -> ()"
tools/doc_scripts/replacesig.sh "ZeroFillByWord" "(mut_mem: *mut (), num_bytes: usize) -> ()"
tools/doc_scripts/replacesig.sh "init_803D1A8" "() -> ()"
tools/doc_scripts/replacesig.sh "SetPrimaryToolkitPointers" "() -> ()"
tools/doc_scripts/replacesig.sh "RandomizeExtraToolkitPointers" "() -> ?"
tools/doc_scripts/replacesig.sh "clear_e201AD04" "() -> ()"
tools/doc_scripts/replacesig.sh "start_800023C" "() -> ()"
tools/doc_scripts/replacesig.sh "SubMenuControl" "() -> ()" 
tools/doc_scripts/replacesig.sh "sub_811FB84" "(a0: u32?, a1: usize) -> u32?"
tools/doc_scripts/replacesig.sh "sub_8123360" "() -> bool"

./replacep.sh "loc_80008B8" "loc_loop_80008B8"
./replacep.sh "loc_803D1AC" "call_803D1AC"
./replacep.sh "sub_803D1A8" "init_803D1A8"
./replacep.sh "isSameSubsystem_800A732" "notSameSubsystem_800A732"
./replacep.sh "main_static_8000454" "main_static_screen_fade_8000454"
./replacep.sh "saveMenu_8132CB8" "saveMenu_config_textscript_8132CB8"
./replacep.sh "sub_802F756" "load_game_802F756"
```