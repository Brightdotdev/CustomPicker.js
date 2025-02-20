// script.js
document.addEventListener('DOMContentLoaded', () => {
    const hueSlider = document.getElementById('hueSlider');
    const hueCursor = document.getElementById('huePicker');
    const sbSelector = document.getElementById('sbPicker');
    const sbCursor = document.getElementById('sbPointer');
    const colorCode = document.getElementById('color-code');

    let hue = 0;
    let saturation = 100;
    let brightness = 100;

    // Handle mouse and touch events
    hueSlider.addEventListener('mousedown', startHueDrag);
    hueSlider.addEventListener('touchstart', startHueDrag, {passive: false});

    sbSelector.addEventListener('mousedown', startSbDrag);
    sbSelector.addEventListener('touchstart', startSbDrag, {passive: false});

    function startHueDrag(e) {
        document.addEventListener('mousemove', updateHue);
        document.addEventListener('mouseup', stopHueDrag);
        document.addEventListener('touchmove', updateHue, {passive: false});
        document.addEventListener('touchend', stopHueDrag);
        updateHue(e);
    }

    function stopHueDrag() {
        document.removeEventListener('mousemove', updateHue);
        document.removeEventListener('mouseup', stopHueDrag);
        document.removeEventListener('touchmove', updateHue, {passive: false});
        document.removeEventListener('touchend', stopHueDrag);
    }

    function updateHue(e) {
        e.preventDefault();
        const rect = hueSlider.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        hue = ((clientX - rect.left) / rect.width) * 360;
        hue = Math.max(0, Math.min(hue, 360)); // Clamp hue between 0 and 360
        hueCursor.style.left = `${(hue / 360) * 100}%`;
        updateColor();
    }

    function startSbDrag(e) {
        document.addEventListener('mousemove', updateSb);
        document.addEventListener('mouseup', stopSbDrag);
        document.addEventListener('touchmove', updateSb, {passive: false});
        document.addEventListener('touchend', stopSbDrag);
        updateSb(e);
    }

    function stopSbDrag() {
        document.removeEventListener('mousemove', updateSb);
        document.removeEventListener('mouseup', stopSbDrag);
        document.removeEventListener('touchmove', updateSb, {passive: false});
        document.removeEventListener('touchend', stopSbDrag);
    }

    function updateSb(e) {
        e.preventDefault();
        const rect = sbSelector.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        saturation = ((clientX - rect.left) / rect.width) * 100;
        brightness = 100 - ((clientY - rect.top) / rect.height) * 100;
        saturation = Math.max(0, Math.min(saturation, 100)); // Clamp saturation between 0 and 100
        brightness = Math.max(0, Math.min(brightness, 100)); // Clamp brightness between 0 and 100
        sbCursor.style.left = `${saturation}%`;
        sbCursor.style.top = `${100 - brightness}%`;
        updateColor();
    }

    function updateColor() {
        const hsl = `hsl(${Math.round(hue)}, ${Math.round(saturation)}%, ${Math.round(brightness)}%)`;
        sbSelector.style.background = `
            linear-gradient(to right, white, hsl(${Math.round(hue)}, 100%, 50%)), 
            linear-gradient(to bottom, transparent, black)
        `;
        colorCode.value = hsl;
        document.body.style.backgroundColor = hsl;
    }

    updateColor();
});
