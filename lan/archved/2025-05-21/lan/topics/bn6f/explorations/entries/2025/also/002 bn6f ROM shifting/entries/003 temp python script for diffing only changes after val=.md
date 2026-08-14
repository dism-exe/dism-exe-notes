---
parent: '[[002 bn6f ROM shifting]]'
spawned_by: '[[006 Attempt to modify mgba to get information on save corruption gunner issue]]'
context_type: entry
---

Parent: [002 bn6f ROM shifting](../002%20bn6f%20ROM%20shifting.md)

Spawned by: [006 Attempt to modify mgba to get information on save corruption gunner issue](../investigations/006%20Attempt%20to%20modify%20mgba%20to%20get%20information%20on%20save%20corruption%20gunner%20issue.md)

Spawned in: [^spawn-entry-0e0040](../investigations/006%20Attempt%20to%20modify%20mgba%20to%20get%20information%20on%20save%20corruption%20gunner%20issue.md#spawn-entry-0e0040)

# 1 Journal

This is temporarily put in `/home/lan/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/a.py `

````python
import sys
from typing import Dict, List, Tuple

def line_to_val_dict(lines: List[str]) -> Dict[str, str]:
    mut_out = {}

    for line in lines:
        if line.strip() == "":
            continue

        val_idx = line.index("val=")
        mut_out[line[:val_idx]] = line[val_idx:]
    
    return mut_out

def read_sym_file(sym_file: str) -> List[Tuple[int, str]]:
    mut_out = []

    with open(sym_file, 'r') as f:
        for line in f.readlines():
            tokens = line.split(' ')
            mut_out.append((int(tokens[0], 16), tokens[3].strip()))
    
    return mut_out

def get_sym_to_ea_map(syms: List[Tuple[int, str]]) -> Dict[str, int]:
    mut_out = {}

    for (ea, sym) in syms:
        if sym.strip() not in mut_out:
            mut_out[sym.strip()] = ea

    return mut_out

def is_label_shift_but_identical_vals(orig_val: str, shifted_val: str, orig_sym_to_ea_map: Dict[int, str], shifted_sym_to_ea_map: Dict[int, str]) -> bool:
    if orig_val == shifted_val:
        return False

    # We're only interested in the case of label+diff
    if '+' not in orig_val or '+' not in shifted_val:
        return False
    
    if 'val=' not in orig_val or 'val=' not in shifted_val :
        raise Exception("We expect values to start with val=")
    
    orig_val1 = orig_val[orig_val.index("val=") + len("val="):]
    shifted_val1 = shifted_val[shifted_val.index("val=") + len("val="):]

    if ' + COMPRESSED_PTR_FLAG' in orig_val1:
        orig_val2 = orig_val1.replace(' + COMPRESSED_PTR_FLAG', '')
        orig_val_compressed_shift = 0x80000000
    else:
        orig_val2 = orig_val1
        orig_val_compressed_shift = 0

    if ' + COMPRESSED_PTR_FLAG' in shifted_val1:
        shifted_val2 = shifted_val1.replace(' + COMPRESSED_PTR_FLAG', '')
        shifted_val_compressed_shift = 0x80000000
    else:
        shifted_val2 = shifted_val1
        shifted_val_compressed_shift = 0

    # After accounting for compressed flag addition, we still expect different diffs.
    if '+' not in orig_val2 or '+' not in shifted_val2:
        return False
    
    orig_tokens = orig_val2.split("+")
    shifted_tokens = shifted_val2.split("+")

    if len(orig_tokens) != 2 or len(shifted_tokens) != 2:
        raise Exception(f"We're expecting diff from label: {orig_val}, {shifted_val}")
    
    orig_label = orig_tokens[0].strip().split('.')[-1]
    shifted_label = shifted_tokens[0].strip().split('.')[-1]

    orig_diff = int(orig_tokens[1].strip(), 10)
    shifted_diff = int(shifted_tokens[1].strip(), 10)

    orig_label_ea = orig_sym_to_ea_map[orig_label] + orig_val_compressed_shift
    shifted_label_ea = shifted_sym_to_ea_map[shifted_label] + shifted_val_compressed_shift

    orig_val_n = orig_label_ea + orig_diff
    shifted_val_n = shifted_label_ea + shifted_diff

    is_likely_same_val = orig_val_n == shifted_val_n or abs(orig_val_n - shifted_val_n) == 0x1000

    if not is_likely_same_val:
        print("data_diff", orig_label, shifted_label, hex(orig_val_n), hex(shifted_val_n))

    return is_likely_same_val

def keep_lines_identical_up_to_val_but_then_different(orig_file: str, shifted_file: str):
    orig_syms = read_sym_file('/home/lan/src/cloned/gh/dism-exe/bn6f/bn6f.sym')
    shifted_syms = read_sym_file('/home/lan/src/cloned/gh/dism-exe/branches/bn6f@tmp/bn6f.sym')

    orig_sym_to_ea_map = get_sym_to_ea_map(orig_syms)
    shifted_sym_to_ea_map = get_sym_to_ea_map(shifted_syms)

    with open(orig_file, 'r') as f:
        orig_file_lines = f.readlines()

    with open(shifted_file, 'r') as f:
        shifted_file_lines = f.readlines()
    
    shifted_dict = line_to_val_dict(shifted_file_lines)
    
    for orig_line in orig_file_lines:
        if orig_line.strip() == "":
            continue

        orig_val_idx = orig_line.index("val=")
        orig_before_val = orig_line[:orig_val_idx]
        orig_after_val = orig_line[orig_val_idx:]

        if orig_before_val in shifted_dict and orig_after_val != shifted_dict[orig_before_val]:
            if not is_label_shift_but_identical_vals(orig_after_val.strip(), shifted_dict[orig_before_val].strip(), orig_sym_to_ea_map, shifted_sym_to_ea_map):
                print(f'-{orig_before_val}{orig_after_val.strip()}')
                print(f'+{orig_before_val}{shifted_dict[orig_before_val].strip()}')

if __name__ == '__main__':
    orig_file = sys.argv[1]
    shifted_file = sys.argv[2]
    filter = sys.argv[3]

    if filter == 'keep_lines_identical_up_to_val_but_then_different':
        keep_lines_identical_up_to_val_but_then_different(orig_file, shifted_file)
    
````
