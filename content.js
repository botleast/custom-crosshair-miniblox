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
        display: 'none'
    });
    document.body.appendChild(crosshairContainer);

    // === Load saved color or default ===
    let currentColor = localStorage.getItem("miniblox_crosshair_color") || "rgb(255,255,255)";

    // === STATE MANAGEMENT VARIABLES ===
    // F5 Hide/Show cycle: 0=Show, 1=Hide, 2=Hide
    let f5PressCount = 0; 
    // F1/Z/Escape Hide/Show toggle: false=Show, true=Hide
    let otherKeysManualHide = false;
    
    // === Helper ===
    const makeLine = (styles) => {
        const div = document.createElement('div');
        Object.assign(div.style, {
            position: 'absolute',
            backgroundColor: currentColor,
            pointerEvents: 'none'
        }, styles);
        return div;
    };

    // === Designs ===
    const designs = {
        "All": function() {
            const c = document.createElement('div');

            // Circle
            const circle = document.createElement('div');
            Object.assign(circle.style, {
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '18px',
                height: '18px',
                border: `2px solid ${currentColor}`,
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)'
            });
            c.appendChild(circle);

            // Dot
            const dot = document.createElement('div');
            Object.assign(dot.style, {
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '3px',
                height: '3px',
                backgroundColor: currentColor,
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)'
            });
            c.appendChild(dot);

            // Crosshair lines
            c.appendChild(makeLine({ top: '0', left: '50%', width: '1px', height: '8px', transform: 'translateX(-50%)' }));
            c.appendChild(makeLine({ bottom: '0', left: '50%', width: '1px', height: '8px', transform: 'translateX(-50%)' }));
            c.appendChild(makeLine({ left: '0', top: '50%', width: '8px', height: '1px', transform: 'translateY(-50%)' }));
            c.appendChild(makeLine({ right: '0', top: '50%', width: '8px', height: '1px', transform: 'translateY(-50%)' }));

            return c;
        },

        "Dot": function() {
            const c = document.createElement('div');
            const dot = document.createElement('div');
            Object.assign(dot.style, {
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '5px',
                height: '5px',
                backgroundColor: currentColor,
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)'
            });
            c.appendChild(dot);
            return c;
        },

        "Circle": function() {
            const c = document.createElement('div');

            // Outer circle
            const circle = document.createElement('div');
            Object.assign(circle.style, {
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '18px',
                height: '18px',
                border: `2px solid ${currentColor}`,
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)'
            });
            c.appendChild(circle);

            // Center dot (same color as circle)
            const dot = document.createElement('div');
            Object.assign(dot.style, {
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '3px',
                height: '3px',
                backgroundColor: currentColor,
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)'
            });
            c.appendChild(dot);
            return c;
        },

        "Target": function() {
            const c = document.createElement('div');
            const dot = document.createElement('div');
            Object.assign(dot.style, {
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '3px',
                height: '3px',
                backgroundColor: currentColor,
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)'
            });
            c.appendChild(dot);
            // Short lines
            c.appendChild(makeLine({ top: '-10px', left: '50%', width: '1.5px', height: '6px', transform: 'translateX(-50%)' }));
            c.appendChild(makeLine({ bottom: '-10px', left: '50%', width: '1.5px', height: '6px', transform: 'translateX(-50%)' }));
            c.appendChild(makeLine({ left: '-10px', top: '50%', width: '6px', height: '1.5px', transform: 'translateY(-50%)' }));
            c.appendChild(makeLine({ right: '-10px', top: '50%', width: '6px', height: '1.5px', transform: 'translateY(-50%)' }));
            return c;
        },

        "Crosshair": function() {
            const c = document.createElement('div');
            c.appendChild(makeLine({ top: '0', left: '50%', width: '2px', height: '6px', transform: 'translateX(-50%)' }));
            c.appendChild(makeLine({ bottom: '0', left: '50%', width: '2px', height: '6px', transform: 'translateX(-50%)' }));
            c.appendChild(makeLine({ left: '0', top: '50%', width: '6px', height: '2px', transform: 'translateY(-50%)' }));
            c.appendChild(makeLine({ right: '0', top: '50%', width: '6px', height: '2px', transform: 'translateY(-50%)' }));
            return c;
        }
    };

    // === Active design ===
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
        background: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '10px',
        zIndex: '10000',
        display: 'none',
        fontFamily: 'sans-serif',
        fontSize: '14px',
        textAlign: 'center'
    });
    document.body.appendChild(menu);

    menu.innerHTML = `<b>Select Crosshair:</b><br>`;

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

    // === RGB Slider Section ===
    const colorSection = document.createElement('div');
    colorSection.style.marginTop = '10px';
    colorSection.innerHTML = `<hr style="border:1px solid #444;margin:8px 0;"><b>Color Adjust:</b><br>`;

    const sliders = ['R', 'G', 'B'].map((label, i) => {
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

        wrap.appendChild(text);
        wrap.appendChild(slider);
        return wrap;
    });

    sliders.forEach(s => colorSection.appendChild(s));

    // Color preview box
    const colorPreview = document.createElement('div');
    Object.assign(colorPreview.style, {
        width: '40px',
        height: '20px',
        margin: '8px auto',
        background: currentColor,
        borderRadius: '4px',
        border: '1px solid #555'
    });
    colorSection.appendChild(colorPreview);
    menu.appendChild(colorSection);

    const updateColor = () => {
        const [r, g, b] = sliders.map(s => s.querySelector('input').value);
        currentColor = `rgb(${r},${g},${b})`;
        localStorage.setItem("miniblox_crosshair_color", currentColor);
        colorPreview.style.background = currentColor;
        updateCrosshair();
    };

    sliders.forEach(s => s.querySelector('input').addEventListener('input', updateColor));

    // === Toggle menu and Key-based Hide Logic ===
    document.addEventListener('keydown', e => {
        // Toggle menu when '=' is pressed
        if (e.key === '\\') {
            menu.style.display = (menu.style.display === 'none') ? 'block' : 'none';
        }

        // Handle F5 specific logic (Stop, Stop, Show)
        if (e.key === 'F5') {
            e.preventDefault(); // Attempt to prevent browser refresh for F5
            
            f5PressCount = (f5PressCount + 1) % 3; // Cycles through 0, 1, 2
            
            // F5 now takes control, so reset otherKeysManualHide
            otherKeysManualHide = false; 

            // Immediate hide/show for F5 to feel responsive
            if (f5PressCount === 0) {
                crosshairContainer.style.display = 'block';
            } else {
                crosshairContainer.style.display = 'none';
            }
        }

        // Handle F1, Z, Escape toggle logic
        if (e.key === 'F1') {
            // Toggle the hide state
            otherKeysManualHide = !otherKeysManualHide;

            // F1/Z/Esc now takes control, so reset F5 counter
            f5PressCount = 0; 
            
            // Immediate hide/show for responsiveness
            if (otherKeysManualHide) {
                 crosshairContainer.style.display = 'none';
            } else {
                 crosshairContainer.style.display = 'block';
            }
        }
    });

    // === Game state check ===
    const checkCrosshair = () => {
        const defaultCrosshair = document.querySelector('.css-xhoozx');
        const pauseMenu = document.querySelector('.chakra-modal__content-container,[role="dialog"]');
        
        // The crosshair should be hidden if EITHER the F5 cycle is in a hide state (1 or 2) OR the other keys toggle is on (true).
        const isManuallyHidden = (f5PressCount === 1 || f5PressCount === 2) || otherKeysManualHide;

        // --- Custom Crosshair Logic ---
        if (defaultCrosshair && !pauseMenu) {
            
            if (isManuallyHidden) {
                // If either state variable says "hide," force it hidden
                crosshairContainer.style.display = 'none';
                defaultCrosshair.style.display = 'none';
            } else {
                // Otherwise, the crosshair is allowed to be visible.
                defaultCrosshair.style.display = 'none';
                crosshairContainer.style.display = 'block';
            }
        } else {
            // Hide custom crosshair when game state changes (e.g., pause menu opens)
            crosshairContainer.style.display = 'none';
            
            // When game state changes (e.g., pause menu), reset all manual hides
            f5PressCount = 0; 
            otherKeysManualHide = false; 
        }
    };
    new MutationObserver(checkCrosshair).observe(document.body, { childList: true, subtree: true });
    setInterval(checkCrosshair, 500);
})();

