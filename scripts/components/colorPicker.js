// Color Picker Component
class ColorPicker {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentColor = '#FF5722'; // Default color
        this.listeners = [];
        this.init();
    }

    init() {
        if (!this.container) return;
        
        // Create main wrapper
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'color-picker-wrapper';
        
        // Create color wheel
        this.wheelContainer = document.createElement('div');
        this.wheelContainer.className = 'color-wheel-container';
        
        // Use the SVG color wheel
        this.wheelContainer.innerHTML = this.getColorWheelSVG();
        this.wheel = this.wheelContainer.querySelector('svg');
        this.wheel.classList.add('interactive-wheel');
        
        // Current color display
        this.colorDisplay = document.createElement('div');
        this.colorDisplay.className = 'current-color-display';
        this.colorDisplay.style.backgroundColor = this.currentColor;
        
        // Color input
        this.colorInput = document.createElement('input');
        this.colorInput.type = 'text';
        this.colorInput.className = 'color-input';
        this.colorInput.value = this.currentColor;
        
        // Color value slider container
        this.sliderContainer = document.createElement('div');
        this.sliderContainer.className = 'slider-container';
        
        // Create RGB sliders
        const rgb = ColorUtils.hexToRgb(this.currentColor);
        this.createSlider('R', 'red-slider', rgb.r, 0, 255);
        this.createSlider('G', 'green-slider', rgb.g, 0, 255);
        this.createSlider('B', 'blue-slider', rgb.b, 0, 255);
        
        // Add quirky elements - Color personality
        this.personalityBox = document.createElement('div');
        this.personalityBox.className = 'color-personality';
        this.personalityBox.innerHTML = `<h3>Color Mood</h3><p>This vibrant orange radiates energy and creativity!</p>`;
        
        // Assemble the component
        this.wrapper.appendChild(this.wheelContainer);
        this.wrapper.appendChild(this.colorDisplay);
        this.wrapper.appendChild(this.colorInput);
        this.wrapper.appendChild(this.sliderContainer);
        this.wrapper.appendChild(this.personalityBox);
        this.container.appendChild(this.wrapper);
        
        // Add event listeners
        this.addEventListeners();
    }
    
    getColorWheelSVG() {
        // This could load the SVG dynamically, but for now let's use a placeholder
        // In production, you'd load the SVG from your assets folder
        return `
            <svg width="200" height="200" viewBox="0 0 73 73" version="1.1" xmlns="http://www.w3.org/2000/svg" class="color-wheel">
                <!-- The SVG content will be loaded from assets/images/svg/simple_color_wheel.svg -->
            </svg>
        `;
    }
    
    createSlider(label, id, value, min, max) {
        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'color-slider';
        
        const labelEl = document.createElement('label');
        labelEl.textContent = label;
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.id = id;
        slider.min = min;
        slider.max = max;
        slider.value = value;
        
        const valueDisplay = document.createElement('span');
        valueDisplay.textContent = value;
        
        sliderWrapper.appendChild(labelEl);
        sliderWrapper.appendChild(slider);
        sliderWrapper.appendChild(valueDisplay);
        this.sliderContainer.appendChild(sliderWrapper);
        
        // Store slider for later access
        this[id] = { slider, valueDisplay };
    }
    
    addEventListeners() {
        // Color input change
        this.colorInput.addEventListener('change', (e) => {
            const newColor = e.target.value;
            this.updateColor(newColor);
        });
        
        // Sliders
        const updateFromSliders = () => {
            const r = parseInt(this['red-slider'].slider.value);
            const g = parseInt(this['green-slider'].slider.value);
            const b = parseInt(this['blue-slider'].slider.value);
            
            this['red-slider'].valueDisplay.textContent = r;
            this['green-slider'].valueDisplay.textContent = g;
            this['blue-slider'].valueDisplay.textContent = b;
            
            const newColor = ColorUtils.rgbToHex(r, g, b);
            this.currentColor = newColor;
            this.colorDisplay.style.backgroundColor = newColor;
            this.colorInput.value = newColor;
            this.updatePersonality(newColor);
            this.notifyListeners();
        };
        
        this['red-slider'].slider.addEventListener('input', updateFromSliders);
        this['green-slider'].slider.addEventListener('input', updateFromSliders);
        this['blue-slider'].slider.addEventListener('input', updateFromSliders);
        
        // Color wheel events for interactive selection
        this.wheel.addEventListener('click', (e) => {
            // In a full implementation, this would calculate the color based on the 
            // position clicked in the wheel. For now, it's a placeholder.
            const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
            this.updateColor(randomColor);
        });
    }
    
    updateColor(newColor) {
        try {
            // Validate color
            if (!/^#[0-9A-F]{6}$/i.test(newColor)) {
                console.error('Invalid color format');
                return;
            }
            
            this.currentColor = newColor;
            this.colorDisplay.style.backgroundColor = newColor;
            this.colorInput.value = newColor;
            
            // Update sliders
            const rgb = ColorUtils.hexToRgb(newColor);
            this['red-slider'].slider.value = rgb.r;
            this['green-slider'].slider.value = rgb.g;
            this['blue-slider'].slider.value = rgb.b;
            this['red-slider'].valueDisplay.textContent = rgb.r;
            this['green-slider'].valueDisplay.textContent = rgb.g;
            this['blue-slider'].valueDisplay.textContent = rgb.b;
            
            this.updatePersonality(newColor);
            this.notifyListeners();
        } catch (e) {
            console.error('Error updating color:', e);
        }
    }
    
    updatePersonality(color) {
        // This would contain personality logic based on color theory
        // For now, a simple example
        const rgb = ColorUtils.hexToRgb(color);
        const hsl = ColorUtils.rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        let mood = '';
        if (hsl.h >= 0 && hsl.h < 30) {
            mood = 'This red-orange hue evokes passion and enthusiasm!';
        } else if (hsl.h >= 30 && hsl.h < 60) {
            mood = 'This warm yellow radiates optimism and joy!';
        } else if (hsl.h >= 60 && hsl.h < 150) {
            mood = 'This green brings balance and growth energy!';
        } else if (hsl.h >= 150 && hsl.h < 240) {
            mood = 'This blue suggests calm and trustworthiness!';
        } else if (hsl.h >= 240 && hsl.h < 300) {
            mood = 'This purple conveys creativity and wisdom!';
        } else {
            mood = 'This magenta-red suggests passion and intensity!';
        }
        
        this.personalityBox.innerHTML = `<h3>Color Mood</h3><p>${mood}</p>`;
    }
    
    getCurrentColor() {
        return this.currentColor;
    }
    
    addChangeListener(callback) {
        this.listeners.push(callback);
    }
    
    notifyListeners() {
        this.listeners.forEach(callback => callback(this.currentColor));
    }
}
