import os
import glob
import cv2
import numpy as np
from PIL import Image
from rembg import remove
import pillow_heif
import json

SOURCE_DIR = "/Users/kl/Fotoksiązka "
OUTPUT_DIR = os.path.join(SOURCE_DIR, "photobook_3d", "assets_generated")
MAX_DIMENSION = 1200 # Skalowanie by przyspieszyć procesowanie AI
VIDEO_FRAMES_COUNT = 15
REJECTED_FILES = ['IMG_5620_Original', 'IDG_20260526_152828_141', 'IDG_20260526_152030_762', 'IMG_6434_Original', 'IMG_9872', 'IDG_20260525_183450_820', 'IDG_20260526_151942_167', 'IMG_9744', 'IDG_20260526_152849_280', 'IMG_9742', 'IMG_9884', 'IMG_9848', 'IMG_20130913_152313_Original', '20190101_185728_Original', 'IMG_9879', 'IDG_20260525_155133_911', 'IMG_9871', 'IMG_9874', 'IDG_20260526_152826_290', 'IDG_20260526_152137_558', 'IDG_20260526_151854_975']

 # Tyle klatek wyciągniemy z każdego filmu

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

pillow_heif.register_heif_opener()

def process_single_image(img_path, base_name):
    print(f"Przetwarzanie obrazu: {base_name}")
    fg_path = os.path.join(OUTPUT_DIR, f"{base_name}_fg.png")
    bg_path = os.path.join(OUTPUT_DIR, f"{base_name}_bg.jpg")
    
    if os.path.exists(fg_path) and os.path.exists(bg_path):
        print("  -> Już istnieje, pomijam.")
        return {"type": "photo", "base_name": base_name}

    try:
        # Wczytanie z automatyczną obsługą HEIC przez pillow_heif
        img = Image.open(img_path)
        img = img.convert("RGB")
        
        # Resize
        img.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.Resampling.LANCZOS)
        
        # Konwersja do CV2 (RGB -> BGR)
        img_cv = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
        
        # Wycinanie postaci (rembg)
        img_byte_arr = np.array(img)
        print("  -> Wycinanie tła (AI)...")
        fg_rgba = remove(img_byte_arr)
        
        # Ekstrakcja maski i poszerzenie jej tolerancji (zostawienie części tła wokół postaci)
        alpha_channel = fg_rgba[:, :, 3]
        _, base_mask = cv2.threshold(alpha_channel, 10, 255, cv2.THRESH_BINARY)
        
        kernel_fg = np.ones((25, 25), np.uint8) # Poszerzamy o 25 pikseli
        mask_fg = cv2.dilate(base_mask, kernel_fg, iterations=1)
        
        # Aplikujemy nową grubą maskę do oryginalnego obrazu (RGB)
        fg_custom = np.zeros((img_byte_arr.shape[0], img_byte_arr.shape[1], 4), dtype=np.uint8)
        fg_custom[:, :, :3] = img_byte_arr
        fg_custom[:, :, 3] = mask_fg
        
        # Zapisz Foreground
        fg_pil = Image.fromarray(fg_custom)
        fg_pil.save(fg_path)
        
        # Rekonstrukcja tła
        print("  -> Rekonstrukcja tła (Inpainting)...")
        kernel_bg = np.ones((15, 15), np.uint8)
        mask_bg_dilated = cv2.dilate(mask_fg, kernel_bg, iterations=1)
        
        bg_inpainted = cv2.inpaint(img_cv, mask_bg_dilated, 10, cv2.INPAINT_TELEA)
        cv2.imwrite(bg_path, bg_inpainted)
        
        print("  -> Zakończono.")
        return {"type": "photo", "base_name": base_name}
        
    except Exception as e:
        print(f"Błąd podczas {base_name}: {e}")
        return None

def process_video(video_path, base_name):
    print(f"Przetwarzanie wideo: {base_name}")
    
    # Sprawdzamy czy wideo już zostało zrobione
    existing = glob.glob(os.path.join(OUTPUT_DIR, f"{base_name}_frame_*_fg.png"))
    if len(existing) >= VIDEO_FRAMES_COUNT:
        print("  -> Wideo już przetworzone, pomijam.")
        return {"type": "video", "base_name": base_name, "frames": len(existing)}
        
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    if total_frames <= 0:
        print("  -> Błąd odczytu wideo.")
        return None
        
    step = max(1, total_frames // VIDEO_FRAMES_COUNT)
    frames_processed = 0
    
    for i in range(VIDEO_FRAMES_COUNT):
        frame_idx = i * step
        if frame_idx >= total_frames:
            break
            
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
        ret, frame = cap.read()
        if not ret:
            break
            
        # Skalowanie klatki wideo
        h, w = frame.shape[:2]
        if max(h, w) > MAX_DIMENSION:
            scale = MAX_DIMENSION / max(h, w)
            frame = cv2.resize(frame, (int(w * scale), int(h * scale)))
            
        # CV2 to PIL (BGR -> RGB)
        img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Wycinanie postaci
        print(f"  -> Klatka {i+1}/{VIDEO_FRAMES_COUNT}: Wycinanie...")
        fg_rgba = remove(img_rgb)
        
        alpha_channel = fg_rgba[:, :, 3]
        _, base_mask = cv2.threshold(alpha_channel, 10, 255, cv2.THRESH_BINARY)
        
        kernel_fg = np.ones((25, 25), np.uint8)
        mask_fg = cv2.dilate(base_mask, kernel_fg, iterations=1)
        
        fg_custom = np.zeros((img_rgb.shape[0], img_rgb.shape[1], 4), dtype=np.uint8)
        fg_custom[:, :, :3] = img_rgb
        fg_custom[:, :, 3] = mask_fg
        
        frame_base = f"{base_name}_frame_{i}"
        fg_path = os.path.join(OUTPUT_DIR, f"{frame_base}_fg.png")
        bg_path = os.path.join(OUTPUT_DIR, f"{frame_base}_bg.jpg")
        
        # Zapisz FG
        Image.fromarray(fg_custom).save(fg_path)
        
        # Inpaint BG
        kernel_bg = np.ones((15, 15), np.uint8)
        mask_bg_dilated = cv2.dilate(mask_fg, kernel_bg, iterations=1)
        
        bg_inpainted = cv2.inpaint(frame, mask_bg_dilated, 10, cv2.INPAINT_TELEA)
        cv2.imwrite(bg_path, bg_inpainted)
        
        frames_processed += 1
        
    cap.release()
    print("  -> Zakończono wideo.")
    return {"type": "video", "base_name": base_name, "frames": frames_processed}

def main():
    metadata = []
    
    # Przeszukujemy pliki w głównym katalogu (HEIC, JPG, MOV, etc.)
    all_files = os.listdir(SOURCE_DIR)
    
    for f in all_files:
        path = os.path.join(SOURCE_DIR, f)
        if not os.path.isfile(path):
            continue
            
        ext = f.lower().split('.')[-1]
        base_name = f.split('.')[0]
        
        if base_name in REJECTED_FILES:
            continue
        
        if ext in ['jpg', 'jpeg', 'png', 'heic']:
            res = process_single_image(path, base_name)
            if res:
                metadata.append(res)
        elif ext in ['mov', 'mp4']:
            res = process_video(path, base_name)
            if res:
                metadata.append(res)
                
    # Zapisujemy manifest wszystkich odnalezionych rzeczy dla JS (jako .json oraz .js dla trybu offline)
    with open(os.path.join(OUTPUT_DIR, 'assets_manifest.json'), 'w') as mf:
        json.dump(metadata, mf)
        
    with open(os.path.join(OUTPUT_DIR, 'assets_manifest.js'), 'w') as mf:
        mf.write("window.assetsManifestData = " + json.dumps(metadata) + ";\n")
        
    print(f"Zakończono cały proces! Zapisano manifest do: {OUTPUT_DIR}/assets_manifest.js")

if __name__ == "__main__":
    main()
