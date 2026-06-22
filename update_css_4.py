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
    width: 4500px;
    flex-shrink: 0;
    font-family: 'Georgia', serif;
    font-size: 350px;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 10px 20px 30px rgba(0, 0, 0, 1), 0px 0px 40px rgba(0, 0, 0, 0.8);
    line-height: 1.4;
    font-style: italic;
    text-align: center;
}
"""

css = re.sub(r'\.quote-text \{.*', new_css.strip(), css, flags=re.DOTALL)
with open("style.css", "w") as f:
    f.write(css)
