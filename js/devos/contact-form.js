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
    showFormStatus(statusDiv, 'Sending your message…', 'info');

    // Deliver straight to the inbox via FormSubmit (free, no backend — works on
    // GitHub Pages). The very first submission triggers a one-time activation
    // email to the owner; after that it's delivered automatically.
    fetch('https://formsubmit.co/ajax/ryanjamesfranciscoindangan@yahoo.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            _subject: `Portfolio contact: ${formData.subject}`,
            _template: 'table',
            _captcha: 'false'
        })
    })
        .then((r) => r.json())
        .then((data) => {
            if (data && (data.success === true || data.success === 'true')) {
                showFormStatus(statusDiv, "✅ Thanks! Your message has been sent — I'll get back to you soon.", 'success');
                form.reset();
                if (window.showNotification) window.showNotification('Message sent! 📨', 'success', 4000);
            } else {
                throw new Error((data && data.message) || 'Send failed');
            }
        })
        .catch(() => {
            // Graceful fallback: open the visitor's email client pre-filled.
            showFormStatus(statusDiv, "Couldn't send directly — opening your email app instead…", 'error');
            window.location.href = createMailtoLink(formData);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message 📤';
        });
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

