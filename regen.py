import os, json

def regenerate_scene():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    layers = []
    layers.append({
        "type": "background",
        "z": -4000,
        "x": 0,
        "y": 0,
        "image": None
    })
    
    z_index = -3000
    for idx in range(8):
        if idx % 2 == 0:
            # Anioły mocno w lewo
            layers.append({
                "type": "statue",
                "z": z_index,
                "x": -600,
                "y": 0,
                "image": f"angel_{idx}.png"
            })
            z_index += 400
        else:
            # Ludzie mocno w prawo
            layers.append({
                "type": "person",
                "z": z_index + 200, 
                "x": 600,
                "y": 100,
                "image": f"homeless_{idx}.png"
            })
            z_index += 400
            
    with open(os.path.join(base_dir, "scene.json"), "w") as f:
        json.dump(layers, f, indent=4)
        
if __name__ == "__main__":
    regenerate_scene()
