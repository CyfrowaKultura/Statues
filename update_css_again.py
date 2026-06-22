import re
with open("style.css", "r") as f:
    css = f.read()

new_css = """
.quote-text {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    transition: opacity 2s ease, filter 2s ease;
    opacity: 1;
}

.quote-inner {
    width: 2500px;
    font-family: 'Georgia', serif;
    font-size: 120px;
    color: rgba(255, 255, 255, 0.85);
    text-shadow: 2px 4px 10px rgba(0, 0, 0, 0.9), 0px 0px 20px rgba(0, 0, 0, 0.6);
    line-height: 1.6;
    font-style: italic;
    text-align: center;
}
"""

css = re.sub(r'\.quote-text \{.*', new_css.strip(), css, flags=re.DOTALL)
with open("style.css", "w") as f:
    f.write(css)
