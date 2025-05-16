// Palette Generator Component with dynamic shifting colors
class PaletteGenerator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.baseColor = '#FF5722'; // Default orange
        this.palettes = [];
        this.isShifting = false;
        this.shiftInterval = null;
        this.shiftSpeed = 2000; // ms between shifts
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        // Create wrapper
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'palette-generator-wrapper';
        
        // Title
        const title = document.createElement('h2');
        title.className = 'section-title';
        title.textContent = 'Dynamic Palette Generator';
        
        // Controls container
        this.controlsContainer = document.createElement('div');
        this.controlsContainer.className = 'palette-controls';
        
        // Harmony type selector
        this.harmonySelector = document.createElement('select');
        this.harmonySelector.className = 'harmony-selector';
        
        const harmonies = [
            { value: 'complementary', label: 'Complementary' },
            { value: 'analogous', label: 'Analogous' },
            { value: 'triadic', label: 'Triadic' },
            { value: 'tetradic', label: 'Tetradic' },
            { value: 'split-complementary', label: 'Split Complementary' },
            { value: 'monochromatic', label: 'Monochromatic' },
            { value: 'dynamic-random', label: 'Dynamic Random (Unique!)' }
        ];
        
        harmonies.forEach(harmony => {
            const option = document.createElement('option');
            option.value = harmony.value;
            option.textContent = harmony.label;
            this.harmonySelector.appendChild(option);
        });
        
        // Shift toggle button - UNIQUE FEATURE
        this.shiftToggle = document.createElement('button');
        this.shiftToggle.className = 'shift-toggle-btn';
        this.shiftToggle.textContent = 'Start Color Shift';
        
        // Speed control for shifting
        this.speedControl = document.createElement('div');
        this.speedControl.className = 'speed-control';
        this.speedControl.innerHTML = `
            <label>Shift Speed:</label>
            <input type="range" min="500" max="5000" step="500" value="${this.shiftSpeed}">
            <span class="speed-value">${this.shiftSpeed/1000}s</span>
        `;
        
        // Palette display container
        this.paletteDisplay = document.createElement('div');
        this.paletteDisplay.className = 'palette-display';
        
        // Palette swatch template
        this.paletteSwatchTemplate = document.createElement('div');
        this.paletteSwatchTemplate.className = 'palette-template';
        this.paletteSwatchTemplate.innerHTML = `
            <div class="swatch-container">
                <div class="color-swatch"></div>
                <div class="swatch-info">
                    <div class="swatch-hex"></div>
                    <button class="copy-swatch-btn">Copy</button>
                </div>
            </div>
        `;
        
        // Export buttons
        this.exportContainer = document.createElement('div');
        this.exportContainer.className = 'export-container';
        this.exportContainer.innerHTML = `
            <button class="export-btn" data-format="css">Export as CSS Variables</button>
            <button class="export-btn" data-format="scss">Export as SCSS</button>
            <button class="export-btn" data-format="json">Export as JSON</button>
        `;
        
        // Save palette button
        this.saveButton = document.createElement('button');
        this.saveButton.className = 'save-palette-btn';
        this.saveButton.textContent = 'Save This Palette';
        
        // Saved palettes section
        this.savedPalettesContainer = document.createElement('div');
        this.savedPalettesContainer.className = 'saved-palettes-container';
        this.savedPalettesContainer.innerHTML = `
            <h3>Saved Palettes</h3>
            <div class="saved-palettes-list"></div>
        `;
        
        // Quirky information section about color harmony
        this.infoBox = document.createElement('div');
        this.infoBox.className = 'color-harmony-info';
        this.updateInfoBox('complementary');
        
        // Assemble the component
        this.controlsContainer.appendChild(this.harmonySelector);
        this.controlsContainer.appendChild(this.shiftToggle);
        this.controlsContainer.appendChild(this.speedControl);
        
        this.wrapper.appendChild(title);
        this.wrapper.appendChild(this.controlsContainer);
        this.wrapper.appendChild(this.paletteDisplay);
        this.wrapper.appendChild(this.exportContainer);
        this.wrapper.appendChild(this.saveButton);
        this.wrapper.appendChild(this.infoBox);
        this.wrapper.appendChild(this.savedPalettesContainer);
        
        this.container.appendChild(this.wrapper);
        
        // Add event listeners
        this.addEventListeners();
        
        // Initialize with default color
        this.updatePalette();
    }
    
    addEventListeners() {
        // Harmony type change
        this.harmonySelector.addEventListener('change', () => {
            this.updatePalette();
            this.updateInfoBox(this.harmonySelector.value);
        });
        
        // Shift toggle
        this.shiftToggle.addEventListener('click', () => {
            this.toggleColorShift();
        });
        
        // Speed control
        const speedInput = this.speedControl.querySelector('input');
        const speedValue = this.speedControl.querySelector('.speed-value');
        
        speedInput.addEventListener('input', (e) => {
            this.shiftSpeed = parseInt(e.target.value);
            speedValue.textContent = `${this.shiftSpeed/1000}s`;
            
            // Reset interval if currently shifting
            if (this.isShifting) {
                clearInterval(this.shiftInterval);
                this.startColorShift();
            }
        });
        
        // Export buttons
        const exportButtons = this.exportContainer.querySelectorAll('.export-btn');
        exportButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const format = e.target.dataset.format;
                this.exportPalette(format);
            });
        });
        
        // Save palette button
        this.saveButton.addEventListener('click', () => {
            this.savePalette();
        });
    }
    
    updatePalette() {
        const harmonyType = this.harmonySelector.value;
        let colors = [];
        
        // Generate colors based on harmony type
        switch(harmonyType) {
            case 'complementary':
                colors = this.generateComplementary();
                break;
            case 'analogous':
                colors = this.generateAnalogous();
                break;
            case 'triadic':
                colors = this.generateTriadic();
                break;
            case 'tetradic':
                colors = this.generateTetradic();
                break;
            case 'split-complementary':
                colors = this.generateSplitComplementary();
                break;
            case 'monochromatic':
                colors = this.generateMonochromatic();
                break;
            case 'dynamic-random':
                colors = this.generateDynamicRandom();
                break;
            default:
                colors = this.generateComplementary();
        }
        
        this.displayPalette(colors);
    }
    
    displayPalette(colors) {
        // Clear current palette
        this.paletteDisplay.innerHTML = '';
        
        // Add color swatches
        colors.forEach(color => {
            const swatchClone = this.paletteSwatchTemplate.cloneNode(true);
            const swatch = swatchClone.querySelector('.color-swatch');
            const hexValue = swatchClone.querySelector('.swatch-hex');
            const copyBtn = swatchClone.querySelector('.copy-swatch-btn');
            
            swatch.style.backgroundColor = color;
            hexValue.textContent = color;
            
            // Add copy event
            copyBtn.addEventListener('click', () => {
                this.copyToClipboard(color);
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy';
                }, 1500);
            });
            
            this.paletteDisplay.appendChild(swatchClone);
        });
        
        // Store current palette
        this.currentPalette = colors;
    }
    
    // HARMONY GENERATION METHODS
    
    generateComplementary() {
        const rgb = ColorUtils.hexToRgb(this.baseColor);
        const hsl = ColorUtils.rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        // Complementary color (opposite on the color wheel)
        const compH = (hsl.h + 180) % 360;
        
        // Calculate RGB values for complementary color
        const compRgb = this.hslToRgb(compH, hsl.s, hsl.l);
        const compHex = ColorUtils.rgbToHex(compRgb.r, compRgb.g, compRgb.b);
        
        // Add some variations of each
        const colors = [
            this.baseColor,
            this.adjustLightness(this.baseColor, 20), // Lighter base
            this.adjustLightness(this.baseColor, -20), // Darker base
            compHex,
            this.adjustLightness(compHex, 20), // Lighter comp
            this.adjustLightness(compHex, -20), // Darker comp
        ];
        
        return colors;
    }
    
    generateAnalogous() {
        const rgb = ColorUtils.hexToRgb(this.baseColor);
        const hsl = ColorUtils.rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        // Analogous colors (30 degrees apart)
        const h1 = (hsl.h - 30 + 360) % 360;
        const h2 = (hsl.h + 30) % 360;
        const h3 = (hsl.h - 60 + 360) % 360;
        const h4 = (hsl.h + 60) % 360;
        
        // Convert back to hex
        const rgb1 = this.hslToRgb(h1, hsl.s, hsl.l);
        const rgb2 = this.hslToRgb(h2, hsl.s, hsl.l);
        const rgb3 = this.hslToRgb(h3, hsl.s, hsl.l);
        const rgb4 = this.hslToRgb(h4, hsl.s, hsl.l);
        
        const hex1 = ColorUtils.rgbToHex(rgb1.r, rgb1.g, rgb1.b);
        const hex2 = ColorUtils.rgbToHex(rgb2.r, rgb2.g, rgb2.b);
        const hex3 = ColorUtils.rgbToHex(rgb3.r, rgb3.g, rgb3.b);
        const hex4 = ColorUtils.rgbToHex(rgb4.r, rgb4.g, rgb4.b);
        
        return [hex3, hex1, this.baseColor, hex2, hex4];
    }
    
    generateTriadic() {
        const rgb = ColorUtils.hexToRgb(this.baseColor);
        const hsl = ColorUtils.rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        // Triadic colors (120 degrees apart)
        const h1 = (hsl.h + 120) % 360;
        const h2 = (hsl.h + 240) % 360;
        
        // Convert back to hex
        const rgb1 = this.hslToRgb(h1, hsl.s, hsl.l);
        const rgb2 = this.hslToRgb(h2, hsl.s, hsl.l);
        
        const hex1 = ColorUtils.rgbToHex(rgb1.r, rgb1.g, rgb1.b);
        const hex2 = ColorUtils.rgbToHex(rgb2.r, rgb2.g, rgb2.b);
        
        return [
            this.baseColor, 
            this.adjustLightness(this.baseColor, 20),
            hex1,
            this.adjustLightness(hex1, 20),
            hex2,
            this.adjustLightness(hex2, 20)
        ];
    }
    
    generateTetradic() {
        const rgb = ColorUtils.hexToRgb(this.baseColor);
        const hsl = ColorUtils.rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        // Tetradic colors (rectangle on the color wheel)
        const h1 = (hsl.h + 90) % 360;
        const h2 = (hsl.h + 180) % 360;
        const h3 = (hsl.h + 270) % 360;
        
        // Convert back to hex
        const rgb1 = this.hslToRgb(h1, hsl.s, hsl.l);
        const rgb2 = this.hslToRgb(h2, hsl.s, hsl.l);
        const rgb3 = this.hslToRgb(h3, hsl.s, hsl.l);
        
        const hex1 = ColorUtils.rgbToHex(rgb1.r, rgb1.g, rgb1.b);
        const hex2 = ColorUtils.rgbToHex(rgb2.r, rgb2.g, rgb2.b);
        const hex3 = ColorUtils.rgbToHex(rgb3.r, rgb3.g, rgb3.b);
        
        return [this.baseColor, hex1, hex2, hex3];
    }
    
    generateSplitComplementary() {
        const rgb = ColorUtils.hexToRgb(this.baseColor);
        const hsl = ColorUtils.rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        // Split complementary (complement +/- 30 degrees)
        const compH = (hsl.h + 180) % 360;
        const h1 = (compH - 30 + 360) % 360;
        const h2 = (compH + 30) % 360;
        
        // Convert back to hex
        const rgb1 = this.hslToRgb(h1, hsl.s, hsl.l);
        const rgb2 = this.hslToRgb(h2, hsl.s, hsl.l);
        
        const hex1 = ColorUtils.rgbToHex(rgb1.r, rgb1.g, rgb1.b);
        const hex2 = ColorUtils.rgbToHex(rgb2.r, rgb2.g, rgb2.b);
        
        return [
            this.baseColor,
            this.adjustLightness(this.baseColor, 20),
            this.adjustLightness(this.baseColor, -20),
            hex1,
            hex2
        ];
    }
    
    generateMonochromatic() {
        const rgb = ColorUtils.hexToRgb(this.baseColor);
        const hsl = ColorUtils.rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        // Variations with different lightness and saturation
        const colors = [];
        
        // Add base color
        colors.push(this.baseColor);
        
        // Add lightness variations
        for (let i = 1; i <= 2; i++) {
            const lighterL = Math.min(hsl.l + (i * 15), 95);
            const darkerL = Math.max(hsl.l - (i * 15), 5);
            
            const lighterRgb = this.hslToRgb(hsl.h, hsl.s, lighterL);
            const darkerRgb = this.hslToRgb(hsl.h, hsl.s, darkerL);
            
            const lighterHex = ColorUtils.rgbToHex(lighterRgb.r, lighterRgb.g, lighterRgb.b);
            const darkerHex = ColorUtils.rgbToHex(darkerRgb.r, darkerRgb.g, darkerRgb.b);
            
            colors.push(lighterHex);
            colors.push(darkerHex);
        }
        
        return colors;
    }
    
    // UNIQUE FEATURE: Dynamic random palette with color theory principles
    generateDynamicRandom() {
        const rgb = ColorUtils.hexToRgb(this.baseColor);
        const hsl = ColorUtils.rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        const colors = [this.baseColor];
        
        // Seed several interesting angles using golden ratio (optimal distribution)
        const goldenAngle = 137.5;
        
        for (let i = 1; i <= 4; i++) {
            // Use golden angle to distribute colors in a visually appealing way
            const newH = (hsl.h + (goldenAngle * i)) % 360;
            
            // Vary saturation and lightness slightly for visual interest
            const newS = Math.min(Math.max(hsl.s + (Math.random() * 20 - 10), 20), 90);
            const newL = Math.min(Math.max(hsl.l + (Math.random() * 20 - 10), 25), 75);
            
            const newRgb = this.hslToRgb(newH, newS, newL);
            const newHex = ColorUtils.rgbToHex(newRgb.r, newRgb.g, newRgb.b);
            
            colors.push(newHex);
        }
        
        return colors;
    }
    
    // UNIQUE FEATURE: Color shifting animation
    toggleColorShift() {
        if (this.isShifting) {
            this.stopColorShift();
            this.shiftToggle.textContent = 'Start Color Shift';
        } else {
            this.startColorShift();
            this.shiftToggle.textContent = 'Stop Color Shift';
        }
    }
    
    startColorShift() {
        this.isShifting = true;
        
        // Clear any existing interval
        if (this.shiftInterval) {
            clearInterval(this.shiftInterval);
        }
        
        // Set new interval
        this.shiftInterval = setInterval(() => {
            this.shiftColors();
        }, this.shiftSpeed);
    }
    
    stopColorShift() {
        this.isShifting = false;
        clearInterval(this.shiftInterval);
        this.shiftInterval = null;
    }
    
    shiftColors() {
        const rgb = ColorUtils.hexToRgb(this.baseColor);
        const hsl = ColorUtils.rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        // Shift the hue by a small amount
        const newH = (hsl.h + 5) % 360;
        const newRgb = this.hslToRgb(newH, hsl.s, hsl.l);
        const newHex = ColorUtils.rgbToHex(newRgb.r, newRgb.g, newRgb.b);
        
        // Update the base color
        this.baseColor = newHex;
        
        // Regenerate the palette
        this.updatePalette();
    }
    
    // Utility methods
    adjustLightness(hexColor, amount) {
        const rgb = ColorUtils.hexToRgb(hexColor);
        const hsl = ColorUtils.rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        // Adjust lightness, keeping within bounds
        const newL = Math.min(Math.max(hsl.l + amount, 0), 100);
        
        const newRgb = this.hslToRgb(hsl.h, hsl.s, newL);
        return ColorUtils.rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    }
    
    hslToRgb(h, s, l) {
        // Convert HSL to RGB
        s /= 100;
        l /= 100;
        
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = l - c / 2;
        
        let r, g, b;
        
        if (h >= 0 && h < 60) {
            [r, g, b] = [c, x, 0];
        } else if (h >= 60 && h < 120) {
            [r, g, b] = [x, c, 0];
        } else if (h >= 120 && h < 180) {
            [r, g, b] = [0, c, x];
        } else if (h >= 180 && h < 240) {
            [r, g, b] = [0, x, c];
        } else if (h >= 240 && h < 300) {
            [r, g, b] = [x, 0, c];
        } else {
            [r, g, b] = [c, 0, x];
        }
        
        return {
            r: Math.round((r + m) * 255),
            g: Math.round((g + m) * 255),
            b: Math.round((b + m) * 255)
        };
    }
    
    copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log('Text copied to clipboard');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    }
    
    updateInfoBox(harmonyType) {
        const descriptions = {
            'complementary': 'Complementary colors sit opposite each other on the color wheel. This scheme offers high contrast and high impact color combinations.',
            'analogous': 'Analogous colors sit next to each other on the color wheel. They match well and create serene and comfortable designs.',
            'triadic': 'Triadic colors are evenly spaced around the color wheel. This scheme offers strong visual contrast while preserving harmony.',
            'tetradic': 'Tetradic (or double complementary) uses four colors arranged in two complementary pairs, offering rich color possibilities.',
            'split-complementary': 'A base color and two colors adjacent to its complement, offering strong visual contrast with less tension than complementary scheme.',
            'monochromatic': 'Monochromatic colors are variations in lightness and saturation of a single hue, creating a cohesive look.',
            'dynamic-random': 'Our unique algorithm creates harmonious palettes using the golden ratio for optimal color distribution. Colors shift over time, creating captivating, evolving combinations!'
        };
        
        this.infoBox.innerHTML = `
            <h3>About ${harmonyType.replace('-', ' ')} Harmony</h3>
            <p>${descriptions[harmonyType]}</p>
        `;
    }
    
    exportPalette(format) {
        let result = '';
        
        switch (format) {
            case 'css':
                result = `:root {\n`;
                this.currentPalette.forEach((color, index) => {
                    result += `  --color-${index + 1}: ${color};\n`;
                });
                result += `}`;
                break;
                
            case 'scss':
                this.currentPalette.forEach((color, index) => {
                    result += `$color-${index + 1}: ${color};\n`;
                });
                break;
                
            case 'json':
                const jsonObj = {
                    palette: this.currentPalette.map((color, index) => ({
                        name: `Color ${index + 1}`,
                        value: color
                    }))
                };
                result = JSON.stringify(jsonObj, null, 2);
                break;
        }
        
        this.copyToClipboard(result);
        
        // Show a toast or some indication
        alert(`${format.toUpperCase()} format copied to clipboard!`);
    }
    
    savePalette() {
        // Clone current palette
        const paletteToSave = [...this.currentPalette];
        
        // Create saved palette UI
        const savedPalette = document.createElement('div');
        savedPalette.className = 'saved-palette';
        
        // Add mini-swatches for each color
        let swatchesHTML = '';
        paletteToSave.forEach(color => {
            swatchesHTML += `<div class="mini-swatch" style="background-color: ${color}"></div>`;
        });
        
        // Add delete button
        savedPalette.innerHTML = `
            <div class="saved-palette-swatches">${swatchesHTML}</div>
            <button class="delete-palette-btn">×</button>
        `;
        
        // Add events
        const deleteBtn = savedPalette.querySelector('.delete-palette-btn');
        deleteBtn.addEventListener('click', () => {
            savedPalette.remove();
        });
        
        // Click on palette to load it
        const swatchesContainer = savedPalette.querySelector('.saved-palette-swatches');
        swatchesContainer.addEventListener('click', () => {
            this.baseColor = paletteToSave[0];
            this.updatePalette();
        });
        
        // Add to saved palettes
        const savedPalettesList = this.savedPalettesContainer.querySelector('.saved-palettes-list');
        savedPalettesList.appendChild(savedPalette);
    }
    
    // Method to be called from outside to update base color
    setBaseColor(color) {
        this.baseColor = color;
        this.updatePalette();
        
        // Stop shifting if it was enabled
        if (this.isShifting) {
            this.toggleColorShift();
        }
    }
}
