// Main application script
document.addEventListener('DOMContentLoaded', () => {
    // Initialize DOM utils
    const domUtils = {
        createElement: (tag, className, innerHTML) => {
            const element = document.createElement(tag);
            if (className) element.className = className;
            if (innerHTML) element.innerHTML = innerHTML;
            return element;
        },
        
        appendChildren: (parent, ...children) => {
            children.forEach(child => parent.appendChild(child));
        }
    };
    
    // Initialize components
    const colorPickerElem = document.getElementById('color-picker');
    if (colorPickerElem) {
        // Create wrapper elements
        const title = domUtils.createElement('h2', 'section-title', 'Color Picker');
        const wheelsContainer = domUtils.createElement('div', 'wheels-container');
        const pickerContainer = domUtils.createElement('div', 'picker-container');
        
        // Add to DOM
        colorPickerElem.appendChild(title);
        colorPickerElem.appendChild(wheelsContainer);
        colorPickerElem.appendChild(pickerContainer);
        
        // Initialize color wheel
        wheelsContainer.id = 'wheel-container';
        const colorWheel = new ColorWheel('wheel-container');
        
        // Initialize color picker
        pickerContainer.id = 'picker-component';
        const colorPicker = new ColorPicker('picker-component');
        
        // Connect components - wheel updates picker
        colorWheel.addColorListener(color => {
            colorPicker.updateColor(color);
        });
        
        // Make color picker available globally
        window.colorPicker = colorPicker;
    }
    
    // Initialize format converter
    const formatConverterElem = document.getElementById('format-converter');
    if (formatConverterElem) {
        const formatConverter = new FormatConverter('format-converter');
        
        // Connect color picker with format converter
        if (window.colorPicker) {
            window.colorPicker.addChangeListener(color => {
                formatConverter.updateFormats(color);
            });
        }
    }
    
    // Initialize palette generator
    const paletteGeneratorElem = document.getElementById('palette-generator');
    if (paletteGeneratorElem) {
        const paletteGenerator = new PaletteGenerator('palette-generator');
        
        // Connect color picker with palette generator
        if (window.colorPicker) {
            window.colorPicker.addChangeListener(color => {
                paletteGenerator.setBaseColor(color);
            });
        }
    }
    
    // Add splash animation to the header
    const header = document.querySelector('header');
    if (header) {
        header.classList.add('animated');
        
        // Create accent colors
        const createColorDot = () => {
            const dot = domUtils.createElement('div', 'color-dot');
            const hue = Math.floor(Math.random() * 360);
            dot.style.backgroundColor = `hsl(${hue}, 80%, 60%)`;
            dot.style.left = `${Math.random() * 100}%`;
            dot.style.animationDelay = `${Math.random() * 2}s`;
            return dot;
        };
        
        // Add several color dots for dynamic background
        for (let i = 0; i < 15; i++) {
            header.appendChild(createColorDot());
        }
    }
    
    // Add tutorial overlay for first-time visitors (stored in localStorage)
    if (!localStorage.getItem('colorManTutorialShown')) {
        showTutorial();
        localStorage.setItem('colorManTutorialShown', 'true');
    }
    
    function showTutorial() {
        const tutorial = domUtils.createElement('div', 'tutorial-overlay');
        tutorial.innerHTML = `
            <div class="tutorial-content">
                <h2>Welcome to ColorMan!</h2>
                <p>Your all-in-one color manipulation tool. Here's how to get started:</p>
                <ol>
                    <li>Select colors using the interactive color wheel or sliders</li>
                    <li>View and copy different color formats (HEX, RGB, HSL, etc.)</li>
                    <li>Generate beautiful, harmonious palettes</li>
                    <li>Try the unique color shifting feature for dynamic palettes!</li>
                </ol>
                <button class="tutorial-close">Got it!</button>
            </div>
        `;
        
        document.body.appendChild(tutorial);
        
        const closeBtn = tutorial.querySelector('.tutorial-close');
        closeBtn.addEventListener('click', () => {
            tutorial.classList.add('fade-out');
            setTimeout(() => {
                tutorial.remove();
            }, 500);
        });
    }
});
