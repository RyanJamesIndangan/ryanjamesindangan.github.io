// ===========================
// DevOS Boot Sequence
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    const bootScreen = document.getElementById('bootScreen');
    const bootText = bootScreen?.querySelector('.boot-text');
    const desktop = document.getElementById('desktop');
    
    if (!bootScreen || !bootText) return;
    
    // AI-themed boot messages
    const bootMessages = [
        'Initializing Document Intelligence...',
        'Loading ML Models...',
        'Connecting to LLM Services...',
        'Preparing AI Pipeline...',
        'Welcome'
    ];
    
    let messageIndex = 0;
    
    // Update boot messages with animation
    const updateBootMessage = () => {
        if (messageIndex < bootMessages.length) {
            bootText.textContent = bootMessages[messageIndex];
            bootText.style.opacity = '0';
            bootText.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                bootText.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                bootText.style.opacity = '1';
                bootText.style.transform = 'translateY(0)';
            }, 50);
            
            messageIndex++;
            
            if (messageIndex < bootMessages.length) {
                setTimeout(updateBootMessage, 500);
            } else {
                // Final message, wait longer before booting
                setTimeout(() => {
                    // Fade out boot screen
                    bootScreen.classList.add('fade-out');
                    
                    // Fade in desktop
                    desktop.classList.add('loaded');
                    
                    // Hide boot screen after transition
                    setTimeout(() => {
                        bootScreen.style.display = 'none';
                        // Dispatch boot complete event
                        document.dispatchEvent(new CustomEvent('bootComplete'));
                    }, 800);
                }, 800);
            }
        }
    };
    
    // Start boot sequence
    setTimeout(() => {
        updateBootMessage();
    }, 500);
});

