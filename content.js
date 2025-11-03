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
        transition: 'opacity 0.3s ease',
        opacity: '1'
    });
    document.body.appendChild(crosshairContainer);

    // === Load saved settings ===
    let currentColor = localStorage.getItem("miniblox_crosshair_color") || "rgb(255,255,255)";
    let crosshairEnabled = localStorage.getItem("miniblox_crosshair_enabled") !== "false";

    // === STATE ===
    let menuOpen = false;

    // === Helper Functions ===
    const makeLine = (styles) => {
        const div = document.createElement('div');
        Object.assign(div.style, {
            position: 'absolute',
            backgroundColor: currentColor,
            pointerEvents: 'none',
            transition: 'background-color 0.3s ease'
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
            c.appendChild(makeLine({ top: '0', left: '50%', width: '1px', height: '8px', transform: 'translateX(-50%)' }));
            c.appendChild(makeLine({ bottom: '0', left: '50%', width: '1px', height: '8px', transform: 'translateX(-50%)' }));
            c.appendChild(makeLine({ left: '0', top: '50%', width: '8px', height: '1px', transform: 'translateY(-50%)' }));
            c.appendChild(makeLine({ right: '0', top: '50%', width: '8px', height: '1px', transform: 'translateY(-50%)' }));
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
            c.appendChild(makeLine({ top: '-10px', left: '50%', width: '1.5px', height: '6px', transform: 'translateX(-50%)' }));
            c.appendChild(makeLine({ bottom: '-10px', left: '50%', width: '1.5px', height: '6px', transform: 'translateX(-50%)' }));
            c.appendChild(makeLine({ left: '-10px', top: '50%', width: '6px', height: '1.5px', transform: 'translateY(-50%)' }));
            c.appendChild(makeLine({ right: '-10px', top: '50%', width: '6px', height: '1.5px', transform: 'translateY(-50%)' }));
            return c;
        },
        "Crosshair": () => {
            const c = document.createElement('div');
            c.appendChild(makeLine({ top: '0', left: '50%', width: '2px', height: '6px', transform: 'translateX(-50%)' }));
            c.appendChild(makeLine({ bottom: '0', left: '50%', width: '2px', height: '6px', transform: 'translateX(-50%)' }));
            c.appendChild(makeLine({ left: '0', top: '50%', width: '6px', height: '2px', transform: 'translateY(-50%)' }));
            c.appendChild(makeLine({ right: '0', top: '50%', width: '6px', height: '2px', transform: 'translateY(-50%)' }));
            return c;
        }
    };

    let currentDesign = localStorage.getItem("miniblox_crosshair") || "Crosshair";

    const updateCrosshair = () => {
        crosshairContainer.innerHTML = '';
        crosshairContainer.appendChild(designs[currentDesign]());
        updateVisibility();
    };

    const updateVisibility = () => {
        crosshairContainer.style.opacity = crosshairEnabled ? '1' : '0';
    };

    updateCrosshair();

    // === Menu ===
    const menu = document.createElement('div');
    Object.assign(menu.style, {
        position: 'fixed',
        bottom: '200px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.95)',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '10px',
        zIndex: '10000',
        display: 'none',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        textAlign: 'center',
        border: '2px solid rgba(255,255,255,0.2)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
    });
    menu.innerHTML = `<b style="font-size:16px;">🎯 Crosshair Settings</b><br><br><b>Select Style:</b><br>`;
    document.body.appendChild(menu);

    Object.keys(designs).forEach(name => {
        const btn = document.createElement('button');
        btn.textContent = name;
        Object.assign(btn.style, {
            margin: '5px',
            background: currentDesign === name ? '#0066cc' : '#222',
            color: 'white',
            border: '1px solid #555',
            borderRadius: '6px',
            cursor: 'pointer',
            padding: '6px 12px',
            fontWeight: currentDesign === name ? 'bold' : 'normal'
        });
        btn.onmouseenter = () => btn.style.background = currentDesign === name ? '#0066cc' : '#444';
        btn.onmouseleave = () => btn.style.background = currentDesign === name ? '#0066cc' : '#222';
        btn.onclick = () => {
            currentDesign = name;
            localStorage.setItem("miniblox_crosshair", name);
            updateCrosshair();
            // Update all button styles
            menu.querySelectorAll('button').forEach(b => {
                b.style.background = '#222';
                b.style.fontWeight = 'normal';
            });
            btn.style.background = '#0066cc';
            btn.style.fontWeight = 'bold';
        };
        menu.appendChild(btn);
    });

    // === Color Sliders ===
    const colorSection = document.createElement('div');
    colorSection.style.marginTop = '10px';
    colorSection.innerHTML = `<hr style="border:1px solid #444;margin:10px 0;"><b>Color:</b><br>`;
    menu.appendChild(colorSection);

    const colorPreview = document.createElement('div');
    Object.assign(colorPreview.style, {
        width: '50px',
        height: '25px',
        margin: '8px auto',
        background: currentColor,
        borderRadius: '4px',
        border: '2px solid #555',
        transition: 'background-color 0.3s ease'
    });
    colorSection.appendChild(colorPreview);

    ['R','G','B'].forEach((label, i) => {
        const wrap = document.createElement('div');
        wrap.style.margin = '5px 0';
        const text = document.createElement('span');
        text.textContent = `${label}: `;
        text.style.display = 'inline-block';
        text.style.width = '25px';
        text.style.textAlign = 'left';
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = 0;
        slider.max = 255;
        slider.value = parseInt(currentColor.match(/\d+/g)?.[i] || 255);
        slider.style.width = '120px';
        slider.style.verticalAlign = 'middle';
        slider.dataset.channel = label;
        
        const valueLabel = document.createElement('span');
        valueLabel.textContent = slider.value;
        valueLabel.style.display = 'inline-block';
        valueLabel.style.width = '35px';
        valueLabel.style.marginLeft = '5px';
        valueLabel.style.fontSize = '12px';
        
        slider.addEventListener('input', () => {
            valueLabel.textContent = slider.value;
            const [r,g,b] = ['R','G','B'].map(l => colorSection.querySelector(`input[data-channel="${l}"]`).value);
            currentColor = `rgb(${r},${g},${b})`;
            localStorage.setItem("miniblox_crosshair_color", currentColor);
            colorPreview.style.background = currentColor;
            
            // Update crosshair colors
            crosshairContainer.querySelectorAll('div').forEach(el => {
                if (el.style.backgroundColor) el.style.backgroundColor = currentColor;
                if (el.style.borderColor) el.style.borderColor = currentColor;
            });
        });
        
        wrap.appendChild(text);
        wrap.appendChild(slider);
        wrap.appendChild(valueLabel);
        colorSection.appendChild(wrap);
    });

    // === Toggle Button ===
    const toggleSection = document.createElement('div');
    toggleSection.style.marginTop = '10px';
    toggleSection.innerHTML = `<hr style="border:1px solid #444;margin:10px 0;">`;
    menu.appendChild(toggleSection);

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = crosshairEnabled ? '✓ Crosshair ON' : '✗ Crosshair OFF';
    Object.assign(toggleBtn.style, {
        margin: '5px',
        background: crosshairEnabled ? '#00aa00' : '#aa0000',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        padding: '8px 16px',
        fontWeight: 'bold',
        fontSize: '13px'
    });
    toggleBtn.onclick = () => {
        crosshairEnabled = !crosshairEnabled;
        localStorage.setItem("miniblox_crosshair_enabled", crosshairEnabled);
        toggleBtn.textContent = crosshairEnabled ? '✓ Crosshair ON' : '✗ Crosshair OFF';
        toggleBtn.style.background = crosshairEnabled ? '#00aa00' : '#aa0000';
        updateVisibility();
    };
    toggleSection.appendChild(toggleBtn);

    const helpText = document.createElement('div');
    helpText.innerHTML = `<br><small style="color:#888;">Press \\ or F5 to toggle menu<br>Press ESC in-game to hide crosshair</small>`;
    menu.appendChild(helpText);

    // === Key Handling ===
    document.addEventListener('keydown', e => {
        const key = e.key.toLowerCase();
        
        // Toggle menu with backslash or F5
        if (key === '\\' || key === 'f5') {
            e.preventDefault(); // Prevent F5 refresh
            menuOpen = !menuOpen;
            menu.style.display = menuOpen ? 'block' : 'none';
        }
        
        // Hide crosshair when certain keys are pressed (inventory, pause, etc)
        if (['escape', 'e', 'tab'].includes(key)) {
            crosshairContainer.style.opacity = '0';
            setTimeout(() => {
                if (crosshairEnabled) {
                    crosshairContainer.style.opacity = '1';
                }
            }, 100);
        }
    });

    // === Hide Default Crosshair ===
    const hideDefaultCrosshair = () => {
        // Try multiple selectors for the default crosshair
        const selectors = ['.css-xhoozx', '[class*="crosshair"]', '[class*="reticle"]'];
        selectors.forEach(selector => {
            const defaultCrosshair = document.querySelector(selector);
            if (defaultCrosshair) {
                defaultCrosshair.style.display = 'none';
            }
        });
    };

    // Check for default crosshair periodically
    new MutationObserver(hideDefaultCrosshair).observe(document.body, { childList: true, subtree: true });
    setInterval(hideDefaultCrosshair, 1000);
    
    // Initial hide
    setTimeout(hideDefaultCrosshair, 500);

    console.log('✓ Miniblox Custom Crosshair loaded! Press \\ or F5 to open settings.');
})();
