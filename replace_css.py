import re

with open('style.css', 'r') as f:
    css = f.read()

# Remove old quote styles
css = re.sub(r'/\* Cytaty o obojętności \*/.*', '', css, flags=re.DOTALL)

# Add new quote overlay styles
new_css = """
/* 2D Quote Overlay */
#quote-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.9);
    z-index: 4000;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 1.5s ease;
    pointer-events: none;
    cursor: pointer;
}

#quote-overlay.visible {
    opacity: 1;
    pointer-events: auto;
}

#quote-content {
    width: 80%;
    max-width: 1000px;
    font-family: 'Georgia', serif;
    font-size: 2vw;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0px 4px 15px rgba(0, 0, 0, 1);
    line-height: 1.6;
    font-style: italic;
    text-align: center;
    margin-bottom: 40px;
}

#quote-overlay .continue-hint {
    font-family: 'Courier New', Courier, monospace;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 3px;
    text-transform: uppercase;
    animation: pulse 2s infinite ease-in-out;
}
"""

with open('style.css', 'w') as f:
    f.write(css + new_css)
