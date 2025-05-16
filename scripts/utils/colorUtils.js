// Basic color manipulation functions
const ColorUtils = {
    // Convert hex to RGB
    hexToRgb(hex) {
        hex = hex.replace('#', '');
        return {
            r: parseInt(hex.substring(0, 2), 16),
            g: parseInt(hex.substring(2, 4), 16),
            b: parseInt(hex.substring(4, 6), 16)
        };
    },
    
    // Convert RGB to hex
    rgbToHex(r, g, b) {
        return '#' + 
            ((1 << 24) + (r << 16) + (g << 8) + b)
            .toString(16).slice(1);
    },
    
    // Convert RGB to HSL
    rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return { 
            h: Math.round(h * 360), 
            s: Math.round(s * 100), 
            l: Math.round(l * 100) 
        };
    }
    // ADD MORE HERE
};
