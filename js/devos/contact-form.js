// ===========================
// Contact Form Handler
// ===========================

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', handleContactFormSubmit);
}

function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const statusDiv = document.getElementById('contactFormStatus');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Get form data
    const formData = {
        name: document.getElementById('contactName').value.trim(),
        email: document.getElementById('contactEmail').value.trim(),
        subject: document.getElementById('contactSubject').value.trim(),
        message: document.getElementById('contactMessage').value.trim()
    };
    
    // Validate
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        showFormStatus(statusDiv, 'Please fill in all required fields.', 'error');
        return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showFormStatus(statusDiv, 'Please enter a valid email address.', 'error');
        return;
    }
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    // Since we're on GitHub Pages (static hosting), we can't actually send emails
    // Instead, we'll create a mailto link with the form data
    const mailtoLink = createMailtoLink(formData);
    
    // Show success message and open mailto
    showFormStatus(statusDiv, 'Opening your email client...', 'success');
    
    // Open mailto link
    window.location.href = mailtoLink;
    
    // Reset form after a delay
    setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message 📤';
        statusDiv.style.display = 'none';
        
        if (window.showNotification) {
            window.showNotification('Form data prepared! Please send the email from your email client.', 'info', 5000);
        }
    }, 2000);
}

function createMailtoLink(formData) {
    const subject = encodeURIComponent(formData.subject);
    const body = encodeURIComponent(
        `Hello Ryan,\n\n` +
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n\n` +
        `Message:\n${formData.message}\n\n` +
        `---\n` +
        `This message was sent from your portfolio contact form.`
    );
    
    return `mailto:ryanjamesfranciscoindangan@yahoo.com?subject=${subject}&body=${body}`;
}

function showFormStatus(statusDiv, message, type) {
    if (!statusDiv) return;
    
    statusDiv.style.display = 'block';
    statusDiv.textContent = message;
    statusDiv.style.padding = '1rem';
    statusDiv.style.borderRadius = '6px';
    statusDiv.style.marginTop = '0.5rem';
    
    if (type === 'error') {
        statusDiv.style.background = 'rgba(239, 68, 68, 0.1)';
        statusDiv.style.border = '1px solid rgba(239, 68, 68, 0.3)';
        statusDiv.style.color = '#ef4444';
    } else if (type === 'success') {
        statusDiv.style.background = 'rgba(76, 175, 80, 0.1)';
        statusDiv.style.border = '1px solid rgba(76, 175, 80, 0.3)';
        statusDiv.style.color = '#4caf50';
    } else {
        statusDiv.style.background = 'var(--glass-bg)';
        statusDiv.style.border = '1px solid var(--glass-border)';
        statusDiv.style.color = 'var(--text-primary)';
    }
}

// Initialize when contact app is opened
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Check if contact form exists (it will be created dynamically)
        setTimeout(initContactForm, 500);
    });
} else {
    setTimeout(initContactForm, 500);
}

// Also listen for app opening events
document.addEventListener('appOpened', (e) => {
    if (e.detail && e.detail.appId === 'contact') {
        setTimeout(initContactForm, 100);
    }
});

