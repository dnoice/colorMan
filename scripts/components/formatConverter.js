// Format Converter Component
class FormatConverter {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentColor = '#FF5722'; // Default orange
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        // Create wrapper
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'format-converter-wrapper';
        
        // Title
        const title = document.createElement('h2');
        title.className = 'section-title';
        title.textContent = 'Color Format Converter';
        
        // Format display container
        this.formatContainer = document.createElement('div');
        this.formatContainer.className = 'format-container';
        
        // Create different format displays
        this.createFormatDisplay('HEX', 'hex-display');
        this.createFormatDisplay('RGB', 'rgb-display');
        this.createFormatDisplay('HSL', 'hsl-display');
        this.createFormatDisplay('HSV', 'hsv-display');
        this.createFormatDisplay('CMYK', 'cmyk-display');
        this.createFormatDisplay('Name', 'name-display');
        
        // Copy button
        this.copyBtn = document.createElement('button');
        this.copyBtn.className = 'copy-btn';
        this.copyBtn.textContent = 'Copy All Formats';
        this.copyBtn.addEventListener('click', () => this.copyAllFormats());
        
        // Add quirky feature - Color name generator
        this.nameGenerator = document.createElement('div');
        this.nameGenerator.className = 'name-generator';
        this.nameGenerator.innerHTML = `
            <h3>Creative Color Name</h3>
            <div class="generated-name">Tangerine Dream</div>
            <button class="generate-btn">Generate New Name</button>
        `;
        
        // Assemble the component
        this.wrapper.appendChild(title);
        this.wrapper.appendChild(this.formatContainer);
        this.wrapper.appendChild(this.copyBtn);
        this.wrapper.appendChild(this.nameGenerator);
        this.container.appendChild(this.wrapper);
        
        // Add event listeners
        this.addEventListeners();
        
        // Initialize with default color
        this.updateFormats(this.currentColor);
    }
    
    createFormatDisplay(label, id) {
        const formatWrapper = document.createElement('div');
        formatWrapper.className = 'format-item';
        
        const labelEl = document.createElement('label');
        labelEl.textContent = label;
        
        const valueEl = document.createElement('div');
        valueEl.className = 'format-value';
        valueEl.id = id;
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-format-btn';
        copyBtn.innerHTML = '📋';
        copyBtn.title = `Copy ${label} value`;
        
        formatWrapper.appendChild(labelEl);
        formatWrapper.appendChild(valueEl);
        formatWrapper.appendChild(copyBtn);
        this.formatContainer.appendChild(formatWrapper);
        
        // Store for later access
        this[id] = { valueEl, copyBtn };
        
        // Add copy event listener
        copyBtn.addEventListener('click', () => {
            this.copyToClipboard(valueEl.textContent);
            copyBtn.innerHTML = '✓';
            setTimeout(() => { copyBtn.innerHTML = '📋'; }, 1500);
        });
    }
    
    addEventListeners() {
        // Name generator button
        const generateBtn = this.nameGenerator.querySelector('.generate-btn');
        generateBtn.addEventListener('click', () => {
            this.generateColorName();
        });
    }
    
    updateFormats(color) {
        this.currentColor = color;
        
        // HEX
        this['hex-display'].valueEl.textContent = color.toUpperCase();
        
        // RGB
        const rgb = ColorUtils.hexToRgb(color);
        this['rgb-display'].valueEl.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        
        // HSL
        const hsl = ColorUtils.rgbToHsl(rgb.r, rgb.g, rgb.b);
        this['hsl-display'].valueEl.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        
        // HSV (would need implementation in ColorUtils)
        this['hsv-display'].valueEl.textContent = this.calculateHSV(rgb.r, rgb.g, rgb.b);
        
        // CMYK (would need implementation in ColorUtils)
        this['cmyk-display'].valueEl.textContent = this.calculateCMYK(rgb.r, rgb.g, rgb.b);
        
        // Color name approximation
        this['name-display'].valueEl.textContent = this.approximateColorName(hsl.h);
        
        // Update the creative name as well
        this.generateColorName();
    }
    
    calculateHSV(r, g, b) {
        // Simple HSV calculation
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const diff = max - min;
        const v = max;
        
        const s = max === 0 ? 0 : diff / max;
        
        let h;
        if (max === min) {
            h = 0;
        } else {
            if (max === r) {
                h = (g - b) / diff + (g < b ? 6 : 0);
            } else if (max === g) {
                h = (b - r) / diff + 2;
            } else {
                h = (r - g) / diff + 4;
            }
            h *= 60;
        }
        
        return `hsv(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(v * 100)}%)`;
    }
    
    calculateCMYK(r, g, b) {
        // Convert RGB to CMYK
        r /= 255;
        g /= 255;
        b /= 255;
        
        const k = 1 - Math.max(r, g, b);
        
        if (k === 1) {
            return 'cmyk(0%, 0%, 0%, 100%)';
        }
        
        const c = (1 - r - k) / (1 - k);
        const m = (1 - g - k) / (1 - k);
        const y = (1 - b - k) / (1 - k);
        
        return `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`;
    }
    
    approximateColorName(hue) {
        // Super simple approximation based just on hue
        const colorNames = [
            'Red', 'Red-Orange', 'Orange', 'Yellow-Orange', 'Yellow', 
            'Yellow-Green', 'Green', 'Blue-Green', 'Cyan', 'Blue', 
            'Blue-Violet', 'Violet', 'Purple', 'Magenta', 'Pink'
        ];
        
        const index = Math.floor(((hue % 360) / 360) * colorNames.length);
        return colorNames[index];
    }
    
    generateColorName() {
        // Get creative with color naming (this would be more sophisticated in a real app)
        const adjectives = [
            'Vibrant', 'Mellow', 'Dreamy', 'Electric', 'Vintage', 
            'Cosmic', 'Neon', 'Pastel', 'Bold', 'Subtle', 'Radiant'
        ];
        
        const objects = [
            'Sunset', 'Ocean', 'Meadow', 'Galaxy', 'Twilight', 
            'Sunrise', 'Desert', 'Forest', 'Midnight', 'Horizon'
        ];
        
        // Use the color's HSL to influence name selection
        const rgb = ColorUtils.hexToRgb(this.currentColor);
        const hsl = ColorUtils.rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        // Adjust selection based on HSL values
        const adjectiveIndex = Math.floor((hsl.s / 100) * adjectives.length);
        const objectIndex = Math.floor((hsl.h / 360) * objects.length);
        
        const adjective = adjectives[adjectiveIndex];
        const object = objects[objectIndex];
        
        const nameElement = this.nameGenerator.querySelector('.generated-name');
        nameElement.textContent = `${adjective} ${object}`;
    }
    
    copyToClipboard(text) {
        // Use the clipboard API
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log('Text copied to clipboard');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    }
    
    copyAllFormats() {
        const formats = [
            `HEX: ${this['hex-display'].valueEl.textContent}`,
            `RGB: ${this['rgb-display'].valueEl.textContent}`,
            `HSL: ${this['hsl-display'].valueEl.textContent}`,
            `HSV: ${this['hsv-display'].valueEl.textContent}`,
            `CMYK: ${this['cmyk-display'].valueEl.textContent}`,
            `Name: ${this['name-display'].valueEl.textContent}`
        ].join('\n');
        
        this.copyToClipboard(formats);
        
        this.copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            this.copyBtn.textContent = 'Copy All Formats';
        }, 1500);
    }
}
