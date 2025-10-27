// ===========================
// DevOS Boot Sequence
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    const bootScreen = document.getElementById('bootScreen');
    
    // Simulate boot process
    setTimeout(() => {
        bootScreen.classList.remove('active');
        
        // Initialize desktop after boot
        setTimeout(() => {
            bootScreen.style.display = 'none';
        }, 500);
    }, 2500);
});

