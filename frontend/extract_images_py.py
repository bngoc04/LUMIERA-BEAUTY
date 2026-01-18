import os
import re
import base64
import uuid

def extract_images(html_file, assets_dir):
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()

    if not os.path.exists(assets_dir):
        os.makedirs(assets_dir)

    def replace_image(match):
        img_data = match.group(2)
        img_type = match.group(1) # png, jpeg, etc.
        
        # Generate unique filename
        filename = f"extracted_{uuid.uuid4().hex[:8]}.{img_type}"
        file_path = os.path.join(assets_dir, filename)
        
        # Save image
        try:
            with open(file_path, 'wb') as f:
                f.write(base64.b64decode(img_data))
            print(f"Extracted: {filename}")
            # Return relative path for HTML
            return f'src="./assets/images/{filename}"'
        except Exception as e:
            print(f"Failed to save {filename}: {e}")
            return match.group(0) # Keep original if failed

    # Regex for src="data:..."
    pattern_src = r'src="data:image/(\w+);base64,([^"]+)"'
    
    # Regex for background-image: url(data:...)
    # Note: capturing group order is same: 1=type, 2=data
    pattern_bg = r'url\(data:image/(\w+);base64,([^)]+)\)'

    def replace_match(match):
        return replace_image(match, is_bg=False)

    def replace_match_bg(match):
        return replace_image(match, is_bg=True)

    def replace_image(match, is_bg=False):
        img_data = match.group(2)
        img_type = match.group(1) 
        
        filename = f"extracted_{uuid.uuid4().hex[:8]}.{img_type}"
        file_path = os.path.join(assets_dir, filename)
        
        try:
            with open(file_path, 'wb') as f:
                f.write(base64.b64decode(img_data))
            print(f"Extracted: {filename}")
            if is_bg:
                return f'url(./assets/images/{filename})'
            else:
                return f'src="./assets/images/{filename}"'
        except Exception as e:
            print(f"Failed to save {filename}: {e}")
            return match.group(0)

    content = re.sub(pattern_src, lambda m: replace_image(m, False), content)
    content = re.sub(pattern_bg, lambda m: replace_image(m, True), content)
    
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated HTML file.")

if __name__ == "__main__":
    extract_images('d:/LUMIERA_BEAUTY/about.html', 'd:/LUMIERA_BEAUTY/assets/images')
