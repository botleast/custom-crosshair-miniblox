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
    const rgbToHsl = (r, g, b) => {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }
        return [h * 360, s * 100, l * 100];
    };

    const hslToRgb = (h, s, l) => {
        h /= 360; s /= 100; l /= 100;
        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    };

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
            menu.querySelectorAll('button').forEach(b => {
                b.style.background = '#222';
                b.style.fontWeight = 'normal';
            });
            btn.style.background = '#0066cc';
            btn.style.fontWeight = 'bold';
        };
        menu.appendChild(btn);
    });

    // === Color Wheel ===
    const colorSection = document.createElement('div');
    colorSection.style.marginTop = '10px';
    colorSection.innerHTML = `<hr style="border:1px solid #444;margin:10px 0;"><b>Color:</b><br>`;
    menu.appendChild(colorSection);

    // Color wheel canvas
    const wheelCanvas = document.createElement('canvas');
    wheelCanvas.width = 150;
    wheelCanvas.height = 150;
    wheelCanvas.style.cursor = 'crosshair';
    wheelCanvas.style.margin = '10px auto';
    wheelCanvas.style.display = 'block';
    wheelCanvas.style.borderRadius = '50%';
    wheelCanvas.style.border = '2px solid #555';
    colorSection.appendChild(wheelCanvas);

    const ctx = wheelCanvas.getContext('2d');
    const centerX = wheelCanvas.width / 2;
    const centerY = wheelCanvas.height / 2;
    const radius = wheelCanvas.width / 2 - 2;

    // Draw color wheel
    const drawColorWheel = () => {
        for (let angle = 0; angle < 360; angle += 1) {
            const startAngle = (angle - 90) * Math.PI / 180;
            const endAngle = (angle - 89) * Math.PI / 180;
            
            for (let r = 0; r < radius; r += 1) {
                const saturation = (r / radius) * 100;
                const lightness = 50;
                const [red, green, blue] = hslToRgb(angle, saturation, lightness);
                
                ctx.beginPath();
                ctx.arc(centerX, centerY, r, startAngle, endAngle);
                ctx.strokeStyle = `rgb(${red},${green},${blue})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    };
    drawColorWheel();

    // Current color indicator
    const colorIndicator = document.createElement('div');
    Object.assign(colorIndicator.style, {
        position: 'absolute',
        width: '12px',
        height: '12px',
        border: '2px solid white',
        borderRadius: '50%',
        pointerEvents: 'none',
        boxShadow: '0 0 3px black',
        display: 'none'
    });
    wheelCanvas.parentElement.style.position = 'relative';
    colorSection.appendChild(colorIndicator);

    // Update indicator position based on current color
    const updateIndicator = () => {
        const rgb = currentColor.match(/\d+/g).map(Number);
        const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
        const angle = (h - 90) * Math.PI / 180;
        const dist = (s / 100) * radius;
        const x = centerX + dist * Math.cos(angle);
        const y = centerY + dist * Math.sin(angle);
        
        colorIndicator.style.left = `${x + 75 - 8}px`;
        colorIndicator.style.top = `${y + 10 - 8}px`;
        colorIndicator.style.display = 'block';
    };
    updateIndicator();

    // Color preview
    const colorPreview = document.createElement('div');
    Object.assign(colorPreview.style, {
        width: '60px',
        height: '30px',
        margin: '10px auto',
        background: currentColor,
        borderRadius: '6px',
        border: '2px solid #555',
        transition: 'background-color 0.3s ease',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
    });
    colorSection.appendChild(colorPreview);

    // Color wheel interaction
    let isDragging = false;
    const updateColorFromWheel = (e) => {
        const rect = wheelCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= radius) {
            let angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
            if (angle < 0) angle += 360;
            
            const saturation = Math.min((distance / radius) * 100, 100);
            const lightness = 50;
            
            const [r, g, b] = hslToRgb(angle, saturation, lightness);
            currentColor = `rgb(${r},${g},${b})`;
            localStorage.setItem("miniblox_crosshair_color", currentColor);
            colorPreview.style.background = currentColor;
            updateIndicator();
            
            crosshairContainer.querySelectorAll('div').forEach(el => {
                if (el.style.backgroundColor) el.style.backgroundColor = currentColor;
                if (el.style.borderColor) el.style.borderColor = currentColor;
            });
        }
    };

    wheelCanvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateColorFromWheel(e);
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            updateColorFromWheel(e);
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    wheelCanvas.addEventListener('click', updateColorFromWheel);

    // Brightness slider
    const brightnessWrap = document.createElement('div');
    brightnessWrap.style.margin = '10px 0';
    brightnessWrap.innerHTML = '<b>Brightness:</b><br>';
    colorSection.appendChild(brightnessWrap);

    const brightnessSlider = document.createElement('input');
    brightnessSlider.type = 'range';
    brightnessSlider.min = 20;
    brightnessSlider.max = 100;
    brightnessSlider.value = 50;
    brightnessSlider.style.width = '140px';
    brightnessSlider.style.verticalAlign = 'middle';
    brightnessSlider.style.margin = '5px';

    brightnessSlider.addEventListener('input', () => {
        const rgb = currentColor.match(/\d+/g).map(Number);
        const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
        const newL = parseFloat(brightnessSlider.value);
        
        const [r, g, b] = hslToRgb(h, s, newL);
        currentColor = `rgb(${r},${g},${b})`;
        localStorage.setItem("miniblox_crosshair_color", currentColor);
        colorPreview.style.background = currentColor;
        
        crosshairContainer.querySelectorAll('div').forEach(el => {
            if (el.style.backgroundColor) el.style.backgroundColor = currentColor;
            if (el.style.borderColor) el.style.borderColor = currentColor;
        });
    });

    brightnessWrap.appendChild(brightnessSlider);

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
        
        if (key === '\\' || key === 'f5') {
            e.preventDefault();
            menuOpen = !menuOpen;
            menu.style.display = menuOpen ? 'block' : 'none';
        }
        
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
        const selectors = ['.css-xhoozx', '[class*="crosshair"]', '[class*="reticle"]'];
        selectors.forEach(selector => {
            const defaultCrosshair = document.querySelector(selector);
            if (defaultCrosshair) {
                defaultCrosshair.style.display = 'none';
            }
        });
    };

    new MutationObserver(hideDefaultCrosshair).observe(document.body, { childList: true, subtree: true });
    setInterval(hideDefaultCrosshair, 1000);
    setTimeout(hideDefaultCrosshair, 500);

    console.log('✓ Miniblox Custom Crosshair loaded! Press \\ or F5 to open settings.');
})();
