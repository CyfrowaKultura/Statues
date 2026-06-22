import os, json
import random

def regenerate_scene():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    scene_layers = []
    current_group_z = -8000
    group_spacing = -5000 # Jeszcze większa odległość w głąb tunelu
    
    # Tworzymy listę wszystkich dostępnych indeksów grup (pomijamy indeks 1, bo nie pasował)
    available_indices = [i for i in range(8) if i != 1]
    
    # Losowa kolejność!
    random.shuffle(available_indices)
    
    for idx in available_indices:
        prefix = f"group_{idx}"
        
        # Znacznie większa różnorodność na osi X (zdjęcia mogą być mocno "wyrzucone" na boki)
        group_x_offset = random.randint(-1200, 1200)
        group_y_offset = random.randint(-150, 150)
        
        layers = [
            {"type": "photo_bg", "file": f"{prefix}_bg.jpg", "z_offset": -500},
            {"type": "photo_fg", "file": f"{prefix}_fg.png", "z_offset": 300}
        ]
        
        for l in layers:
            scene_layers.append({
                "type": l["type"],
                "z": current_group_z + l["z_offset"],
                "x": group_x_offset,
                "y": group_y_offset,
                "image": l["file"]
            })
            
        current_group_z += group_spacing
            
    with open(os.path.join(base_dir, "scene.json"), "w") as f:
        json.dump(scene_layers, f, indent=4)

if __name__ == "__main__":
    regenerate_scene()
