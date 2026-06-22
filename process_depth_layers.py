import os
import json
import glob
import numpy as np
import cv2
from PIL import Image
from transformers import pipeline

try:
    from pillow_heif import register_heif_opener
    register_heif_opener()
except ImportError:
    pass

def slice_image_by_depth(image_path, depth_estimator, output_dir, file_prefix):
    print(f"Przetwarzanie (Głębia): {os.path.basename(image_path)}")
    try:
        # 1. Wczytanie obrazu
        original = Image.open(image_path).convert("RGB")
        original.thumbnail((800, 800)) # Ograniczenie dla modelu AI i optymalizacji
        
        # 2. Estymacja głębi
        predictions = depth_estimator(original)
        depth_map = predictions["depth"] # Zwraca PIL Image
        depth_array = np.array(depth_map)
        
        # 3. Normalizacja 0-255
        depth_min = depth_array.min()
        depth_max = depth_array.max()
        depth_norm = (depth_array - depth_min) / (depth_max - depth_min) * 255.0
        depth_norm = depth_norm.astype(np.uint8)
        
        # 4. Obliczanie progów cięcia (3 warstwy: daleko, środek, blisko)
        # Obiekty bliżej są jaśniejsze (wyższe wartości) w DPT.
        # Podzielmy histogram na 3 logiczne przedziały (bazując na statystyce lub na sztywno).
        # Użyjemy percentyli dla równomierniejszego rozłożenia, np 33% i 66%.
        threshold_1 = np.percentile(depth_norm, 33)
        threshold_2 = np.percentile(depth_norm, 66)
        
        orig_array = np.array(original)
        
        layers_generated = []
        
        # Słownik definiujący warstwy
        layer_definitions = [
            {"name": "far", "mask": (depth_norm <= threshold_1)},
            {"name": "mid", "mask": ((depth_norm > threshold_1) & (depth_norm <= threshold_2))},
            {"name": "near", "mask": (depth_norm > threshold_2)}
        ]
        
        for layer_def in layer_definitions:
            mask = layer_def["mask"].astype(np.uint8) * 255
            
            # Wygładzenie krawędzi maski, żeby nie były pikselowate (blur)
            mask = cv2.GaussianBlur(mask, (15, 15), 0)
            
            # Tworzymy obraz z przezroczystością (RGBA)
            rgba_img = np.dstack((orig_array, mask))
            
            # Zapisz jako PNG
            out_filename = f"{file_prefix}_{layer_def['name']}.png"
            out_path = os.path.join(output_dir, out_filename)
            Image.fromarray(rgba_img).save(out_path, "PNG")
            layers_generated.append({"file": out_filename, "type": layer_def['name']})
            
        return layers_generated
        
    except Exception as e:
        print(f"Błąd przy przetwarzaniu głębi {image_path}: {e}")
        return []

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    assets_dir = os.path.join(base_dir, "photobook_3d", "assets")
    
    if not os.path.exists(assets_dir):
        os.makedirs(assets_dir)
        
    print("Ładowanie modelu AI (GLPN)... Może to chwilę potrwać.")
    # Model lekki: GLPN NYU
    depth_estimator = pipeline("depth-estimation", model="vinvino02/glpn-nyu")
    print("Model załadowany pomyślnie!")

    # Znajdź pliki
    extensions = ['*.jpg', '*.jpeg', '*.png', '*.heic']
    all_files = []
    for ext in extensions:
        all_files.extend(glob.glob(os.path.join(base_dir, ext)))
        all_files.extend(glob.glob(os.path.join(base_dir, ext.upper())))
        
    all_files = sorted(list(set(all_files)))
    
    # Przetwórz np 3-4 pliki testowe na start by zaprezentować
    files_to_process = all_files[:4]
    
    scene_layers = []
    
    # Dalekie Tło uniwersalne
    scene_layers.append({
        "type": "background",
        "z": -10000,
        "x": 0,
        "y": 0,
        "image": None
    })
    
    # Odległość pomiędzy kolejnymi "grupami" zdjęć
    group_spacing = -1500
    
    # Aktualna pozycja kamery na starcie to 0. 
    # Pierwsza grupa będzie na z=-800.
    current_group_z = -800
    
    for idx, f in enumerate(files_to_process):
        prefix = f"group_{idx}"
        layers = slice_image_by_depth(f, depth_estimator, assets_dir, prefix)
        
        if len(layers) == 3:
            # Sortujemy według kolejności wyświetlania: far, mid, near
            # Zmienna current_group_z to "środek" grupy.
            
            group_x_offset = -600 if idx % 2 == 0 else 600
            
            for l in layers:
                if l['type'] == 'far':
                    z_offset = -250 # Odsunięte do tyłu
                elif l['type'] == 'mid':
                    z_offset = 0 # Środek
                elif l['type'] == 'near':
                    z_offset = 250 # Blisko
                    
                scene_layers.append({
                    "type": l['type'],
                    "z": current_group_z + z_offset,
                    "x": group_x_offset,  # Przesunięcie całej grupy (lewo / prawo)
                    "y": 0,
                    "image": l['file']
                })
                
            current_group_z += group_spacing # Przesuwamy się głęboko do tyłu na kolejne zdjęcie
            
    # Zapis
    scene_path = os.path.join(base_dir, "photobook_3d", "scene.json")
    with open(scene_path, 'w', encoding='utf-8') as f:
        json.dump(scene_layers, f, indent=4)
        
    print(f"Zakończono! Wygenerowano {len(scene_layers)-1} warstw 3D z użyciem głębi.")

if __name__ == "__main__":
    main()
