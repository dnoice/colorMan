// Color Wheel Component
class ColorWheel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.listeners = [];
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        // Create wrapper
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'color-wheel-wrapper';
        
        // Add SVG wheel
        this.loadSVG('assets/images/svg/simple_color_wheel.svg')
            .then(svg => {
                // Add interactive elements to SVG
                this.setupInteractiveWheel(svg);
                
                // Create selected color indicator
                this.createColorIndicator();
                
                // Add event listeners
                this.addEventListeners();
            })
            .catch(error => {
                console.error('Error loading color wheel SVG:', error);
                // Fallback to a basic color picker if SVG fails to load
                this.createFallbackWheel();
            });
            
        this.container.appendChild(this.wrapper);
    }
    
    async loadSVG(url) {
        try {
            const response = await fetch(url);
            const svgText = await response.text();
            
            // Create SVG DOM element
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
            const svg = svgDoc.documentElement;
            
            // Add class for styling
            svg.classList.add('interactive-color-wheel');
            
            // Append to wrapper
            this.wrapper.appendChild(svg);
            
            return svg;
        } catch (error) {
            throw new Error('Failed to load SVG: ' + error.message);
        }
    }
    
    setupInteractiveWheel(svg) {
        // Get all color segments in the wheel
        const segments = svg.querySelectorAll('path');
        
        segments.forEach(segment => {
            // Add hover effect
            segment.addEventListener('mouseover', () => {
                segment.setAttribute('data-original-fill', segment.getAttribute('fill'));
                segment.style.stroke = '#ffffff';
                segment.style.strokeWidth = '2';
                segment.style.cursor = 'pointer';
            });
            
            segment.addEventListener('mouseout', () => {
                segment.style.stroke = 'none';
                segment.style.strokeWidth = '0';
            });
            
            // Add click event
            segment.addEventListener('click', (e) => {
                const fill = segment.getAttribute('fill');
                this.updateSelectedColor(fill);
                
                // Notify listeners
                this.notifyListeners(fill);
                
                // Visual feedback
                this.pulseSegment(segment);
            });
        });
        
        // Store reference to wheel
        this.wheel = svg;
    }
    
    createColorIndicator() {
        // Selected color indicator
        this.colorIndicator = document.createElement('div');
        this.colorIndicator.className = 'selected-color-indicator';
        
        const colorDisplay = document.createElement('div');
        colorDisplay.className = 'color-indicator-display';
        
        const colorValue = document.createElement('div');
        colorValue.className = 'color-indicator-value';
        colorValue.textContent = 'Click the wheel to select a color';
        
        this.colorIndicator.appendChild(colorDisplay);
        this.colorIndicator.appendChild(colorValue);
        
        this.wrapper.appendChild(this.colorIndicator);
        
        // Store references
        this.colorDisplay = colorDisplay;
        this.colorValue = colorValue;
    }
    
    createFallbackWheel() {
        // Simple fallback color input
        const fallback = document.createElement('div');
        fallback.className = 'fallback-color-picker';
        fallback.innerHTML = `
            <p>Interactive color wheel could not be loaded. Please use this color input instead:</p>
            <input type="color" class="fallback-color-input">
        `;
        
        this.wrapper.appendChild(fallback);
        
        // Add event listener to fallback input
        const input = fallback.querySelector('input');
        input.addEventListener('change', (e) => {
            const color = e.target.value;
            this.notifyListeners(color);
        });
    }
    
    updateSelectedColor(color) {
        if (this.colorDisplay) {
            this.colorDisplay.style.backgroundColor = color;
        }
        
        if (this.colorValue) {
            this.colorValue.textContent = color;
        }
    }
    
    pulseSegment(segment) {
        // Add animation class
        segment.classList.add('pulse-segment');
        
        // Remove after animation completes
        setTimeout(() => {
            segment.classList.remove('pulse-segment');
        }, 500);
    }
    
    addEventListeners() {
        // Could add more interactive features here
    }
    
    addColorListener(callback) {
        this.listeners.push(callback);
    }
    
    notifyListeners(color) {
        this.listeners.forEach(callback => callback(color));
    }
    
    // Utility to extract actual color from wheel segments
    getSegmentColor(segment) {
        // Get the fill attribute
        const fill = segment.getAttribute('fill');
        
        // If fill is a valid color, return it
        if (fill && fill !== 'none') {
            return fill;
        }
        
        // Otherwise, try to get computed style
        const computedStyle = window.getComputedStyle(segment);
        return computedStyle.fill || computedStyle.backgroundColor;
    }
}
