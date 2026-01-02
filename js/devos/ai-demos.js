// ===========================
// AI/ML Interactive Demos
// ===========================

// OCR Demo
function initializeOCRDemo() {
    const uploadBtn = document.getElementById('ocrUploadBtn');
    const imageInput = document.getElementById('ocrImageInput');
    const imagePreview = document.getElementById('ocrImagePreview');
    const processBtn = document.getElementById('ocrProcessBtn');
    const progressDiv = document.getElementById('ocrProgress');
    const progressText = document.getElementById('ocrProgressText');
    const resultDiv = document.getElementById('ocrResult');
    
    if (!uploadBtn || !imageInput || !imagePreview || !processBtn) return;
    
    // Upload button click
    uploadBtn.addEventListener('click', () => {
        imageInput.click();
    });
    
    // Image selection
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            showNotification('Please select an image file', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
            imagePreview.innerHTML = `<img src="${event.target.result}" alt="Uploaded image" style="max-width: 100%; max-height: 300px; border-radius: 6px;">`;
            processBtn.disabled = false;
            resultDiv.textContent = 'Click "Process OCR" to extract text...';
        };
        reader.readAsDataURL(file);
    });
    
    // Process OCR
    processBtn.addEventListener('click', async () => {
        if (!imageInput.files[0]) return;
        
        processBtn.disabled = true;
        progressDiv.style.display = 'block';
        resultDiv.textContent = 'Processing...';
        
        try {
            // Check if Tesseract is available
            if (typeof Tesseract === 'undefined') {
                throw new Error('Tesseract.js not loaded. Please refresh the page.');
            }
            
            const file = imageInput.files[0];
            const imageUrl = URL.createObjectURL(file);
            
            // Process with Tesseract.js
            const { data: { text, confidence } } = await Tesseract.recognize(imageUrl, 'eng', {
                logger: (m) => {
                    if (m.status === 'recognizing text') {
                        const progress = Math.round(m.progress * 100);
                        progressText.textContent = `${progress}%`;
                    }
                }
            });
            
            // Display results
            resultDiv.textContent = text || 'No text detected';
            resultDiv.style.color = '#1a1a1a';
            
            // Show confidence
            const confidenceInfo = document.createElement('div');
            confidenceInfo.style.cssText = 'margin-top: 0.5rem; padding: 0.5rem; background: #e8f4f8; border-radius: 4px; font-size: 0.8rem; color: #2171d6;';
            confidenceInfo.textContent = `Confidence: ${Math.round(confidence)}%`;
            resultDiv.appendChild(confidenceInfo);
            
            progressDiv.style.display = 'none';
            processBtn.disabled = false;
            
            showNotification(`OCR completed! Extracted ${text.length} characters`, 'success');
            
            URL.revokeObjectURL(imageUrl);
        } catch (error) {
            console.error('OCR Error:', error);
            const errorMessage = error.message || 'Unknown error occurred';
            resultDiv.innerHTML = `
                <div style="color: #ef4444; padding: 1rem; background: #fee; border: 1px solid #fcc; border-radius: 4px;">
                    <strong>Error:</strong> ${errorMessage}
                    <br><br>
                    <small style="color: #999;">Please ensure the image is clear and try again. Supported formats: JPG, PNG, GIF</small>
                </div>
            `;
            progressDiv.style.display = 'none';
            processBtn.disabled = false;
            showNotification('OCR processing failed. Please try again.', 'error');
        }
    });
}

// Pipeline Visualization
function initializePipelineVisualization() {
    const simulateBtn = document.getElementById('simulatePipelineBtn');
    if (!simulateBtn) return;
    
    simulateBtn.addEventListener('click', () => {
        const steps = document.querySelectorAll('.pipeline-step');
        
        // Reset all steps
        steps.forEach(step => {
            step.style.background = '#f0f0f0';
            step.style.borderColor = '#ccc';
            const titleDiv = step.querySelector('div[style*="font-weight: 600"]');
            const descDiv = step.querySelector('div[style*="font-size: 0.85rem"]');
            if (titleDiv) titleDiv.style.color = '#666';
            if (descDiv) descDiv.style.color = '#999';
        });
        
        simulateBtn.disabled = true;
        simulateBtn.textContent = 'Processing...';
        
        const processStep = (stepIndex) => {
            if (stepIndex >= steps.length) {
                // Reset after completion
                setTimeout(() => {
                    steps.forEach(step => {
                        step.style.background = '#f0f0f0';
                        step.style.borderColor = '#ccc';
                        const titleDiv = step.querySelector('div[style*="font-weight: 600"]');
                        const descDiv = step.querySelector('div[style*="font-size: 0.85rem"]');
                        if (titleDiv) titleDiv.style.color = '#666';
                        if (descDiv) descDiv.style.color = '#999';
                    });
                    simulateBtn.disabled = false;
                    simulateBtn.textContent = '▶️ Simulate Pipeline';
                }, 2000);
                return;
            }
            
            const step = steps[stepIndex];
            step.style.background = '#e8f4f8';
            step.style.borderColor = '#2171d6';
            step.style.transform = 'scale(1.05)';
            
            const titleDiv = step.querySelector('div[style*="font-weight: 600"]');
            const descDiv = step.querySelector('div[style*="font-size: 0.85rem"]');
            
            if (titleDiv) titleDiv.style.color = '#2171d6';
            if (descDiv) descDiv.style.color = '#666';
            
            setTimeout(() => {
                step.style.transform = 'scale(1)';
                processStep(stepIndex + 1);
            }, 800);
        };
        
        processStep(0);
    });
}

// Watermark Removal Demo
function initializeWatermarkDemo() {
    const processBtn = document.getElementById('processWatermarkBtn');
    const beforeDiv = document.getElementById('watermarkBefore');
    const afterDiv = document.getElementById('watermarkAfter');
    const infoDiv = document.getElementById('watermarkInfo');
    
    if (!processBtn || !beforeDiv || !afterDiv) return;
    
    processBtn.addEventListener('click', () => {
        processBtn.disabled = true;
        processBtn.textContent = 'Processing...';
        
        // Simulate processing
        setTimeout(() => {
            // Remove watermark from "before" div
            const watermark = beforeDiv.querySelector('div[style*="CONFIDENTIAL"]');
            if (watermark) {
                watermark.style.opacity = '0';
                watermark.style.transition = 'opacity 1s ease';
            }
            
            // Show "after" result
            afterDiv.innerHTML = `
                <div style="text-align: center; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                    <div>
                        <div style="font-size: 2rem; margin-bottom: 0.5rem;">✨</div>
                        <div style="font-weight: 600; color: #4caf50; margin-bottom: 0.25rem;">Watermark Removed</div>
                        <div style="font-size: 0.85rem; color: #666;">ML Detection: Text Watermark</div>
                    </div>
                </div>
            `;
            
            // Show info
            if (infoDiv) {
                const typeEl = document.getElementById('watermarkType');
                const confEl = document.getElementById('watermarkConfidence');
                const timeEl = document.getElementById('watermarkTime');
                if (typeEl) typeEl.textContent = 'Text Watermark';
                if (confEl) confEl.textContent = '94';
                if (timeEl) timeEl.textContent = '234';
                infoDiv.style.display = 'block';
            }
            
            processBtn.disabled = false;
            processBtn.textContent = '🔄 Process Watermark Removal';
            
            showNotification('Watermark removed successfully!', 'success');
        }, 1500);
    });
}

