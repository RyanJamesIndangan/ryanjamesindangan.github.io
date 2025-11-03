// ===========================
// DevOS Boot Sequence
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    const bootScreen = document.getElementById('bootScreen');
    const desktop = document.getElementById('desktop');
    
    // Simulate boot process - Windows 7 style
    setTimeout(() => {
        // Fade out boot screen
        bootScreen.classList.add('fade-out');
        
        // Fade in desktop
        desktop.classList.add('loaded');
        
        // Hide boot screen after transition
        setTimeout(() => {
            bootScreen.style.display = 'none';
        }, 800);
    }, 2500);
});

