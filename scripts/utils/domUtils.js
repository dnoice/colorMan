// DOM Utility Functions
const DOMUtils = {
    // Create element with specified attributes
    createElement(tag, options = {}) {
        const element = document.createElement(tag);
        
        // Set attributes
        Object.entries(options).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else if (key === 'children') {
                // Append children
                value.forEach(child => element.appendChild(child));
            } else {
                element.setAttribute(key, value);
            }
        });
        
        return element;
    },
    
    // Append multiple children at once
    appendChildren(parent, ...children) {
        children.forEach(child => {
            if (child) parent.appendChild(child);
        });
    },
    
    // Create and append element in one function
    createAndAppend(parent, tag, options = {}) {
        const element = this.createElement(tag, options);
        parent.appendChild(element);
        return element;
    },
    
    // Add multiple event listeners to an element
    addEventListeners(element, events = {}) {
        Object.entries(events).forEach(([event, callback]) => {
            element.addEventListener(event, callback);
        });
    },
    
    // Remove all children from an element
    removeAllChildren(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    },
    
    // Toggle class on an element
    toggleClass(element, className) {
        element.classList.toggle(className);
    },
    
    // Add/remove class based on condition
    setClass(element, className, condition) {
        if (condition) {
            element.classList.add(className);
        } else {
            element.classList.remove(className);
        }
    },
    
    // Fade in animation
    fadeIn(element, duration = 500) {
        element.style.opacity = 0;
        element.style.display = 'block';
        
        let start = null;
        
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                window.requestAnimationFrame(animate);
            }
        };
        
        window.requestAnimationFrame(animate);
    },
    
    // Fade out animation
    fadeOut(element, duration = 500) {
        element.style.opacity = 1;
        
        let start = null;
        
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = 1 - progress;
            
            if (progress < 1) {
                window.requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        
        window.requestAnimationFrame(animate);
    },
    
    // Slide down animation
    slideDown(element, duration = 500) {
        // Store the element's height
        element.style.display = 'block';
        const height = element.scrollHeight;
        
        // Set initial state
        element.style.height = '0px';
        element.style.overflow = 'hidden';
        element.style.transition = `height ${duration}ms ease`;
        
        // Trigger animation
        setTimeout(() => {
            element.style.height = `${height}px`;
        }, 10);
        
        // Clean up after animation
        setTimeout(() => {
            element.style.height = '';
            element.style.overflow = '';
            element.style.transition = '';
        }, duration + 10);
    },
    
    // Slide up animation
    slideUp(element, duration = 500) {
        // Set initial state
        element.style.height = `${element.scrollHeight}px`;
        element.style.overflow = 'hidden';
        element.style.transition = `height ${duration}ms ease`;
        
        // Trigger animation
        setTimeout(() => {
            element.style.height = '0px';
        }, 10);
        
        // Clean up after animation
        setTimeout(() => {
            element.style.display = 'none';
            element.style.height = '';
            element.style.overflow = '';
            element.style.transition = '';
        }, duration + 10);
    },
    
    // Create tooltip
    createTooltip(element, text, position = 'top') {
        const tooltip = this.createElement('div', {
            className: `tooltip tooltip-${position}`,
            textContent: text
        });
        
        element.addEventListener('mouseenter', () => {
            document.body.appendChild(tooltip);
            const rect = element.getBoundingClientRect();
            
            switch (position) {
                case 'top':
                    tooltip.style.bottom = `${window.innerHeight - rect.top + 5}px`;
                    tooltip.style.left = `${rect.left + rect.width / 2}px`;
                    tooltip.style.transform = 'translateX(-50%)';
                    break;
                case 'bottom':
                    tooltip.style.top = `${rect.bottom + 5}px`;
                    tooltip.style.left = `${rect.left + rect.width / 2}px`;
                    tooltip.style.transform = 'translateX(-50%)';
                    break;
                case 'left':
                    tooltip.style.top = `${rect.top + rect.height / 2}px`;
                    tooltip.style.right = `${window.innerWidth - rect.left + 5}px`;
                    tooltip.style.transform = 'translateY(-50%)';
                    break;
                case 'right':
                    tooltip.style.top = `${rect.top + rect.height / 2}px`;
                    tooltip.style.left = `${rect.right + 5}px`;
                    tooltip.style.transform = 'translateY(-50%)';
                    break;
            }
            
            tooltip.classList.add('show');
        });
        
        element.addEventListener('mouseleave', () => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        });
    },
    
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function(...args) {
            const later = () => {
                timeout = null;
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};
