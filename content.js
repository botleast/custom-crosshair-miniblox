// Miniblox Pro Crosshair – Customizable crosshair with multiple designs, smooth color & fade, F5/Backslash toggle, and persistent settings.
(function() {
    // === Overlay ===
    const crosshairContainer = document.createElement('div');
    Object.assign(crosshairContainer.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: '9999',
        pointerEvents: 'none',
        display: 'none',
        transition: 'opacity 0.3s ease', // Smooth fade
        opacity: '0'
    });
    document.body.appendChild(crosshairContainer);

    // === Load saved color ===
    let currentColor = localStorage.getItem("miniblox_crosshair_color") || "rgb(255,255,255)";

    // === STATE ===
    let f5PressCount = 0; 
    let otherKeysHidden = false;

    // === Helper Functions ===
    const makeLine = (styles) => {
        const div = document.createElement('div');
        Object.assign(div.style, {
            position: 'absolute',
            backgroundColor: currentColor,
            pointerEvents: 'none'
        }, styles);
        return div;
    };

    const createCircle = (size = 18, border = 2) => {
        const circle = document.createElement('div');
        Object.assign(circle.style, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: `${size}px`,
            height: `${size}px`,
            border: `${border}px solid ${currentColor}`,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            transition: 'border-color 0.3s ease'
        });
        return circle;
    };

    const createDot = (size = 3) => {
        const dot = document.createElement('div');
        Object.assign(dot.style, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: currentColor,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            transition: 'background-color 0.3s ease'
        });
        return dot;
    };

    // === Designs ===
    const designs = {
        "All": () => {
            const c = document.createElement('div');
            c.appendChild(createCircle());
            c.appendChild(createDot());
            c.appendChild(makeLine({ top: '0', left: '50%', width: '1px', height: '8px', transform: 'translateX(-50%)', transition: 'background-color 0.3s ease' }));
            c.appendChild(makeLine({ bottom: '0', left: '50%', width: '1px', height: '8px', transform: 'translateX(-50%)', transition: 'background-color 0.3s ease' }));
            c.appendChild(makeLine({ left: '0', top: '50%', width: '8px', height: '1px', transform: 'translateY(-50%)', transition: 'background-color 0.3s ease' }));
            c.appendChild(makeLine({ right: '0', top: '50%', width: '8px', height: '1px', transform: 'translateY(-50%)', transition: 'background-color 0.3s ease' }));
            return c;
        },
        "Dot": () => {
            const c = document.createElement('div');
            c.appendChild(createDot(5));
            return c;
        },
        "Circle": () => {
            const c = document.createElement('div');
            c.appendChild(createCircle());
            c.appendChild(createDot());
            return c;
        },
        "Target": () => {
            const c = document.createElement('div');
            c.appendChild(createDot());
            c.appendChild(makeLine({ top: '-10px', left: '50%', width: '1.5px', height: '6px', transform: 'translateX(-50%)', transition: 'background-color 0.3s ease' }));
            c.appendChild(makeLine({ bottom: '-10px', left: '50%', width: '1.5px', height: '6px', transform: 'translateX(-50%)', transition: 'background-color 0.3s ease' }));
            c.appendChild(makeLine({ left: '-10px', top: '50%', width: '6px', height: '1.5px', transform: 'translateY(-50%)', transition: 'background-color 0.3s ease' }));
            c.appendChild(makeLine({ right: '-10px', top: '50%', width: '6px', height: '1.5px', transform: 'translateY(-50%)', transition: 'background-color 0.3s ease' }));
            return c;
        },
        "Crosshair": () => {
            const c = document.createElement('div');
            c.appendChild(makeLine({ top: '0', left: '50%', width: '2px', height: '6px', transform: 'translateX(-50%)', transition: 'background-color 0.3s ease' }));
            c.appendChild(makeLine({ bottom: '0', left: '50%', width: '2px', height: '6px', transform: 'translateX(-50%)', transition: 'background-color 0.3s ease' }));
            c.appendChild(makeLine({ left: '0', top: '50%', width: '6px', height: '2px', transform: 'translateY(-50%)', transition: 'background-color 0.3s ease' }));
            c.appendChild(makeLine({ right: '0', top: '50%', width: '6px', height: '2px', transform: 'translateY(-50%)', transition: 'background-color 0.3s ease' }));
            return c;
        }
    };

    let currentDesign = localStorage.getItem("miniblox_crosshair") || "Crosshair";

    const updateCrosshair = () => {
        crosshairContainer.innerHTML = '';
        crosshairContainer.appendChild(designs[currentDesign]());
    };
    updateCrosshair();

    // === Menu ===
    const menu = document.createElement('div');
    Object.assign(menu.style, {
        position: 'fixed',
        bottom: '200px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.9)',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '10px',
        zIndex: '10000',
        display: 'none',
        fontFamily: 'sans-serif',
        fontSize: '14px',
        textAlign: 'center'
    });
    menu.innerHTML = `<b>Select Crosshair:</b><br>`;
    document.body.appendChild(menu);

    Object.keys(designs).forEach(name => {
        const btn = document.createElement('button');
        btn.textContent = name;
        Object.assign(btn.style, {
            margin: '5px',
            background: '#222',
            color: 'white',
            border: '1px solid #555',
            borderRadius: '6px',
            cursor: 'pointer',
            padding: '5px 10px'
        });
        btn.onmouseenter = () => btn.style.background = '#444';
        btn.onmouseleave = () => btn.style.background = '#222';
        btn.onclick = () => {
            currentDesign = name;
            localStorage.setItem("miniblox_crosshair", name);
            updateCrosshair();
            menu.style.display = 'none';
        };
        menu.appendChild(btn);
    });

    // === Color Sliders ===
    const colorSection = document.createElement('div');
    colorSection.style.marginTop = '10px';
    colorSection.innerHTML = `<hr style="border:1px solid #444;margin:8px 0;"><b>Color Adjust:</b><br>`;
    menu.appendChild(colorSection);

    const colorPreview = document.createElement('div');
    Object.assign(colorPreview.style, {
        width: '40px',
        height: '20px',
        margin: '8px auto',
        background: currentColor,
        borderRadius: '4px',
        border: '1px solid #555',
        transition: 'background-color 0.3s ease'
    });
    colorSection.appendChild(colorPreview);

    ['R','G','B'].forEach((label, i) => {
        const wrap = document.createElement('div');
        wrap.style.margin = '5px 0';
        const text = document.createElement('span');
        text.textContent = `${label}: `;
        text.style.display = 'inline-block';
        text.style.width = '20px';
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = 0;
        slider.max = 255;
        slider.value = parseInt(currentColor.match(/\d+/g)?.[i] || 255);
        slider.style.width = '120px';
        slider.dataset.channel = label;
        slider.addEventListener('input', () => {
            const [r,g,b] = ['R','G','B'].map(l => colorSection.querySelector(`input[data-channel="${l}"]`).value);
            currentColor = `rgb(${r},${g},${b})`;
            localStorage.setItem("miniblox_crosshair_color", currentColor);
            colorPreview.style.background = currentColor;
            // Smooth color update
            crosshairContainer.querySelectorAll('div').forEach(el => {
                if (el.style.backgroundColor !== undefined) el.style.backgroundColor = currentColor;
                if (el.style.borderColor !== undefined) el.style.borderColor = currentColor;
            });
        });
        wrap.appendChild(text);
        wrap.appendChild(slider);
        colorSection.appendChild(wrap);
    });

    // === Key Handling ===
    document.addEventListener('keydown', e => {
        const key = e.key.toLowerCase();
        if (key === 'f5' || key === '\\') {
            f5PressCount = (f5PressCount + 1) % 2; // toggle show/hide
            otherKeysHidden = false;
            crosshairContainer.style.display = 'block';
            crosshairContainer.style.opacity = f5PressCount === 0 ? '1' : '0';
        }
        if (['f1','f3','z','escape','e'].includes(key)) {
            otherKeysHidden = !otherKeysHidden;
            f5PressCount = 0;
            crosshairContainer.style.display = 'block';
            crosshairContainer.style.opacity = otherKeysHidden ? '0' : '1';
        }
        if (key === '\\') menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });

    // === Crosshair Visibility Check ===
    const checkCrosshair = () => {
        const defaultCrosshair = document.querySelector('.css-xhoozx');
        const pauseMenu = document.querySelector('.chakra-modal__content-container,[role="dialog"]');
        const hidden = f5PressCount !== 0 || otherKeysHidden;

        if (defaultCrosshair && !pauseMenu) {
            crosshairContainer.style.display = 'block';
            crosshairContainer.style.opacity = hidden ? '0' : '1';
            defaultCrosshair.style.display = 'none';
        } else {
            crosshairContainer.style.opacity = '0';
            f5PressCount = 0;
            otherKeysHidden = false;
        }
    };

    new MutationObserver(checkCrosshair).observe(document.body, { childList: true, subtree: true });
    setInterval(checkCrosshair, 500);
})();
