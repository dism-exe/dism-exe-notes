---
parent: "[[002 bn6f ROM shifting]]"
spawned_by: "[[005 Create RAM struct dword_20364C0]]"
context_type: task
status: todo
---

Parent: [[002 bn6f ROM shifting]]

Spawned by: [[005 Create RAM struct dword_20364C0]]

Spawned in: [[005 Create RAM struct dword_20364C0#^spawn-task-437477|^spawn-task-437477]]

# 1 Journal

2025-12-30 Wk 1 Tue - 14:38 +03:00

Other temporary script we are swapping: [[003 temp python script for diffing only changes after val=]]

```sh
# Example usage:

cat a.log | sort -u > a1.log
cat a1.log | python3 ~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/dump_code.py ea_to_sym_filter bn6f.sym > b1.log

# To get stores
cat b1.log | grep 'GBAStore' | grep 'addr=eS20364C0' | grep -v 'ZeroFillByByte' | cut -d',' -f-2 | rev | sort -u | rev | python3 ~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/a.py 'transform_gbastoreload_logs_to_struct_fields' | sort -u
# To get loads
cat b1.log | grep 'GBALoad' | grep 'addr=eS20364C0' | grep -v 'ZeroFillByByte' | cut -d',' -f-2 | rev | sort -u | rev | python3 ~/src/cloned/gh/dism-exe/bn6f/tools/misc_scripts/dump_code/a.py 'transform_gbastoreload_logs_to_struct_fields' | sort -u
```

```python
import sys
from typing import Dict, List, Tuple

# Expects lines like
# LAN - GBAStore32 PC=sub_802BD60+0C, addr=eS20364C0+18
# LAN - GBALoad16 PC=loc_8028D50, addr=eS20364C0+3A
def transform_gbastoreload_logs_to_struct_fields(inp: str):
    for line in inp.split("\n"):
        if line.strip() == "":
            continue

        prefix1 = "LAN - GBAStore"
        prefix2 = "LAN - GBALoad"

        if prefix1 in line:
            line1 = line[line.index(prefix1) + len(prefix1):]
        elif prefix2 in line:
            line1 = line[line.index(prefix2) + len(prefix2):]
        else:
            raise Exception("Expected GBALoad or GBAStore line")

        tokens = line1.split(" ")

        width = int(tokens[0], 10)

        addr = tokens[2].split("=")[1].replace(',', '').strip()

        if '+' in addr:
            addr_tokens = addr.split("+")

            addr_diff = int(addr_tokens[1], 16)
        else:
            addr_diff = 0

        
        print(f'u{width} Unk_{addr_diff:02x} // loc=0x{addr_diff:x}')

if __name__ == '__main__':
    inp = sys.stdin.read()
    filter = sys.argv[1]

    if filter == 'transform_gbastoreload_logs_to_struct_fields':
        transform_gbastoreload_logs_to_struct_fields(inp)
    else:
        raise Exception("Unknown filter")
```