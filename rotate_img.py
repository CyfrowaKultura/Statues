from PIL import Image
import os

base_name = "IMG_1061_Original"
output_dir = "assets_generated"

for ext, suffix in [(".png", "_fg"), (".jpg", "_bg")]:
    path = os.path.join(output_dir, f"{base_name}{suffix}{ext}")
    if os.path.exists(path):
        img = Image.open(path)
        # 90 degrees to the right is -90 or 270. In PIL, ROTATE_270 means rotate 270 degrees counter-clockwise, which is 90 degrees clockwise.
        img = img.transpose(Image.ROTATE_270)
        img.save(path)
        print(f"Rotated {path}")
    else:
        print(f"File not found: {path}")

