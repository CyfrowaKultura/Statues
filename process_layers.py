import os
import json
import glob
from pathlib import Path
try:
    from rembg import remove
    from PIL import Image
    from pillow_heif import register_heif_opener
    register_heif_opener() # Obsługa formatu HEIC
except ImportError:
    print("Zainstaluj biblioteki: pip install rembg Pillow pillow-heif")
    exit(1)

def extract_subject_from_image(input_path, output_path):
    print(f"Wycinanie: {os.path.basename(input_path)}")
    try:
        image = Image.open(input_path)
        # Zmniejszamy rozmiar do celów przeglądarkowych jeśli są ogromne (np. z iPhone)
        image.thumbnail((1200, 1200))
        
        # Opcje wycinania: alpha_matting pomaga zachować delikatne krawędzie (np. włosy, krawędzie ubrań / ziemi)
        output = remove(image, alpha_matting=True)
        output.save(output_path, "PNG")
        return True
    except Exception as e:
        print(f"Błąd przy {input_path}: {e}")
        return False

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) # /Users/kl/Fotoksiązka
    assets_dir = os.path.join(base_dir, "photobook_3d", "assets")
    
    if not os.path.exists(assets_dir):
        os.makedirs(assets_dir)
        
    # Pobierz wszystkie pliki (JPG, HEIC)
    extensions = ['*.jpg', '*.jpeg', '*.png', '*.heic']
    all_files = []
    for ext in extensions:
        all_files.extend(glob.glob(os.path.join(base_dir, ext)))
        all_files.extend(glob.glob(os.path.join(base_dir, ext.upper())))
        
    all_files = sorted(list(set(all_files))) # Sortowanie np. alfabetyczne
    
    # Ponieważ nie mam wzrokowego dostępu do każdego z 25 plików z poziomu tego skryptu,
    # aby nadać im narrację naprzemienną, przypiszę je na przemian jako warstwy 'anioł' i 'bezdomny'.
    # Jeśli algorytm trafi odwrotnie, możesz po prostu zamienić nazwy plików w folderze assets.
    
    processed_files = []
    
    # Przetworz pierwsze 8 zdjęć na start
    files_to_process = all_files[:8]
    
    scene_layers = []
    
    # Globalne czarne tło z tyłu
    scene_layers.append({
        "type": "background",
        "z": -15000,
        "x": 0,
        "y": 0,
        "image": None
    })
    
    current_group_z = -800
    group_spacing = -1500
    
    for idx, f in enumerate(files_to_process):
        prefix = f"group_{idx}"
        
        fg_name = f"{prefix}_fg.png"
        fg_path = os.path.join(assets_dir, fg_name)
        bg_name = f"{prefix}_bg.jpg"
        bg_path = os.path.join(assets_dir, bg_name)
        
        print(f"Przetwarzanie (Pop-out 2.5D z Inpaintingiem): {os.path.basename(f)}")
        
        # 1. Wycinamy postać za pomocą rembg
        if extract_subject_from_image(f, fg_path):
            
            # 2. Usuwamy postać z tła za pomocą OpenCV (Inpainting)
            import cv2
            import numpy as np
            
            # Wczytaj oryginał i zmniejsz
            orig_pil = Image.open(f).convert("RGB")
            orig_pil.thumbnail((1000, 1000))
            orig_cv = cv2.cvtColor(np.array(orig_pil), cv2.COLOR_RGB2BGR)
            
            # Wczytaj wyciętą postać z kanałem alpha, dopasuj rozmiar do orig_cv
            fg_pil = Image.open(fg_path)
            fg_pil.thumbnail((1000, 1000)) # By upewnić się, że rozmiar pasuje
            
            fg_cv = np.array(fg_pil)
            if fg_cv.shape[2] == 4: # Ma kanał alpha
                alpha = fg_cv[:, :, 3]
                # Stwórz maskę (wszystko co nie jest przezroczyste to obiekt do usunięcia)
                _, mask = cv2.threshold(alpha, 10, 255, cv2.THRESH_BINARY)
                
                # Pogrubienie maski (Dylatacja), aby upewnić się, że krawędzie też znikną
                kernel = np.ones((15, 15), np.uint8)
                mask = cv2.dilate(mask, kernel, iterations=1)
                
                # Upewnienie się, że rozmiary maski i oryginału pasują idealnie
                mask = cv2.resize(mask, (orig_cv.shape[1], orig_cv.shape[0]), interpolation=cv2.INTER_NEAREST)
                
                # Wypełnianie tła (Inpainting Telea)
                inpainted = cv2.inpaint(orig_cv, mask, 15, cv2.INPAINT_TELEA)
                
                # Zapis tła
                cv2.imwrite(bg_path, inpainted)
            else:
                # Fallback jeśli brak kanału alpha z jakiegoś powodu
                orig_pil.save(bg_path, "JPEG")
                
            group_x_offset = -300 if idx % 2 == 0 else 300
            
            # Warstwa tła (inpainted)
            scene_layers.append({
                "type": "photo_bg",
                "z": current_group_z - 100,
                "x": group_x_offset,
                "y": 0,
                "image": bg_name
            })
            
            # Warstwa pierwszego planu (postać)
            scene_layers.append({
                "type": "photo_fg",
                "z": current_group_z + 100,
                "x": group_x_offset,
                "y": 0,
                "image": fg_name
            })
            
        current_group_z += group_spacing
            
    scene_path = os.path.join(base_dir, "photobook_3d", "scene.json")
    with open(scene_path, 'w', encoding='utf-8') as f:
        json.dump(scene_layers, f, indent=4)
        
    print(f"Zakończono! Zastosowano precyzyjny efekt 2.5D Pop-out dla {len(files_to_process)} zdjęć.")

if __name__ == "__main__":
    main()
