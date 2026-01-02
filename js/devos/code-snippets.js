// ===========================
// Interactive Code Snippets Handler
// ===========================

function initializeCodeSnippets() {
    // Initialize copy buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('code-copy-btn') || e.target.closest('.code-copy-btn')) {
            const btn = e.target.classList.contains('code-copy-btn') ? e.target : e.target.closest('.code-copy-btn');
            const codeBlock = btn.closest('.code-snippet-container');
            if (codeBlock) {
                const codeElement = codeBlock.querySelector('code');
                if (codeElement) {
                    copyCodeToClipboard(codeElement.textContent, btn);
                }
            }
        }
        
        // Handle run buttons for JavaScript snippets
        if (e.target.classList.contains('code-run-btn') || e.target.closest('.code-run-btn')) {
            const btn = e.target.classList.contains('code-run-btn') ? e.target : e.target.closest('.code-run-btn');
            const codeBlock = btn.closest('.code-snippet-container');
            if (codeBlock) {
                const codeElement = codeBlock.querySelector('code');
                if (codeElement) {
                    runJavaScriptCode(codeElement.textContent, codeBlock);
                }
            }
        }
    });
}

function copyCodeToClipboard(code, button) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => {
            const originalText = button.textContent;
            button.textContent = '✓ Copied!';
            button.style.background = '#4caf50';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 2000);
            
            if (window.showNotification) {
                window.showNotification('Code copied to clipboard! 📋', 'success', 2000);
            }
        }).catch(() => {
            fallbackCopyCode(code, button);
        });
    } else {
        fallbackCopyCode(code, button);
    }
}

function fallbackCopyCode(code, button) {
    const textArea = document.createElement('textarea');
    textArea.value = code;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        const originalText = button.textContent;
        button.textContent = '✓ Copied!';
        button.style.background = '#4caf50';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
        
        if (window.showNotification) {
            window.showNotification('Code copied to clipboard! 📋', 'success', 2000);
        }
    } catch (err) {
        if (window.showNotification) {
            window.showNotification('Failed to copy code', 'error', 2000);
        }
    }
    
    document.body.removeChild(textArea);
}

function runJavaScriptCode(code, container) {
    const outputDiv = container.querySelector('.code-output');
    if (!outputDiv) {
        // Create output div if it doesn't exist
        const newOutputDiv = document.createElement('div');
        newOutputDiv.className = 'code-output';
        newOutputDiv.style.cssText = 'margin-top: 1rem; padding: 1rem; background: #f0f0f0; border: 1px solid #e0e0e0; border-radius: 6px; font-family: monospace; font-size: 0.9rem; max-height: 200px; overflow-y: auto;';
        container.appendChild(newOutputDiv);
    }
    
    const outputDiv = container.querySelector('.code-output');
    outputDiv.style.display = 'block';
    outputDiv.innerHTML = '<div style="color: #666;">Running...</div>';
    
    try {
        // Capture console.log output
        const logs = [];
        const originalLog = console.log;
        console.log = (...args) => {
            logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' '));
            originalLog.apply(console, args);
        };
        
        // Execute code in a safe context
        const result = Function('"use strict"; return (' + code + ')')();
        
        // Restore console.log
        console.log = originalLog;
        
        // Display result
        if (result !== undefined) {
            const resultStr = typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result);
            outputDiv.innerHTML = `<div style="color: #4caf50; margin-bottom: 0.5rem;"><strong>Result:</strong></div><pre style="margin: 0; white-space: pre-wrap; word-wrap: break-word;">${escapeHtml(resultStr)}</pre>`;
            if (logs.length > 0) {
                outputDiv.innerHTML += `<div style="color: #666; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid #e0e0e0;"><strong>Console:</strong></div><pre style="margin: 0; white-space: pre-wrap; word-wrap: break-word;">${escapeHtml(logs.join('\n'))}</pre>`;
            }
        } else if (logs.length > 0) {
            outputDiv.innerHTML = `<div style="color: #666;"><strong>Console Output:</strong></div><pre style="margin: 0; white-space: pre-wrap; word-wrap: break-word;">${escapeHtml(logs.join('\n'))}</pre>`;
        } else {
            outputDiv.innerHTML = '<div style="color: #4caf50;">✓ Code executed successfully (no output)</div>';
        }
    } catch (error) {
        outputDiv.innerHTML = `<div style="color: #ef4444;"><strong>Error:</strong> ${escapeHtml(error.message)}</div>`;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize when code snippets app is opened
document.addEventListener('appOpened', (e) => {
    if (e.detail && e.detail.appId === 'code-snippets') {
        setTimeout(initializeCodeSnippets, 100);
    }
});

// Also initialize on page load if app is already open
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            const codeSnippetsWindow = document.querySelector('.window[data-app-id="code-snippets"]');
            if (codeSnippetsWindow && !codeSnippetsWindow.classList.contains('minimized')) {
                initializeCodeSnippets();
            }
        }, 1000);
    });
} else {
    setTimeout(() => {
        const codeSnippetsWindow = document.querySelector('.window[data-app-id="code-snippets"]');
        if (codeSnippetsWindow && !codeSnippetsWindow.classList.contains('minimized')) {
            initializeCodeSnippets();
        }
    }, 1000);
}

