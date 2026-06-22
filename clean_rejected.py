import os
import json
import glob

rejected = [
    "IMG_5620_Original", "IDG_20260526_152828_141", "IDG_20260526_152030_762",
    "IMG_6434_Original", "IMG_9872", "IDG_20260525_183450_820",
    "IDG_20260526_151942_167", "IMG_9744", "IDG_20260526_152849_280",
    "IMG_9742", "IMG_9884", "IMG_9848", "IMG_20130913_152313_Original",
    "20190101_185728_Original", "IMG_9879", "IDG_20260525_155133_911",
    "IMG_9871", "IMG_9874", "IDG_20260526_152826_290",
    "IDG_20260526_152137_558", "IDG_20260526_151854_975"
]

output_dir = "assets_generated"
manifest_path = os.path.join(output_dir, "assets_manifest.json")

# Delete the actual files
for b in rejected:
    # Remove photo files
    for f in glob.glob(os.path.join(output_dir, f"{b}_*.*")):
        os.remove(f)

# Update manifest
if os.path.exists(manifest_path):
    with open(manifest_path, 'r') as f:
        manifest = json.load(f)
    
    # Filter out rejected
    new_manifest = [m for m in manifest if m["base_name"] not in rejected]
    
    with open(manifest_path, 'w') as f:
        json.dump(new_manifest, f)
    
    print(f"Removed {len(manifest) - len(new_manifest)} items from manifest.")

# Update process_all.py to never process them again
with open("process_all.py", 'r') as f:
    code = f.read()

import re
if "REJECTED_FILES = " not in code:
    insertion = f"REJECTED_FILES = {rejected}\n\n"
    code = code.replace("VIDEO_FRAMES_COUNT = 15", "VIDEO_FRAMES_COUNT = 15\n" + insertion)
    code = code.replace("if not os.path.isfile(path):", "if not os.path.isfile(path):\n            continue\n        if base_name in REJECTED_FILES:\n")
    with open("process_all.py", 'w') as f:
        f.write(code)
    print("Updated process_all.py to ignore rejected files.")

