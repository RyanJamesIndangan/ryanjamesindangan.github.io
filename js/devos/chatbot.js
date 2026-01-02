// ===========================
// AI Chatbot Engine
// ===========================

class PortfolioChatbot {
    constructor() {
        this.conversationHistory = [];
        this.loadHistory();
        this.init();
    }

    init() {
        // Load conversation history from localStorage
        const saved = localStorage.getItem('chatbotHistory');
        if (saved) {
            try {
                this.conversationHistory = JSON.parse(saved);
            } catch (e) {
                this.conversationHistory = [];
            }
        }
    }

    loadHistory() {
        const saved = localStorage.getItem('chatbotHistory');
        if (saved) {
            try {
                this.conversationHistory = JSON.parse(saved);
            } catch (e) {
                this.conversationHistory = [];
            }
        }
    }

    saveHistory() {
        // Keep only last 20 messages to avoid localStorage bloat
        if (this.conversationHistory.length > 20) {
            this.conversationHistory = this.conversationHistory.slice(-20);
        }
        localStorage.setItem('chatbotHistory', JSON.stringify(this.conversationHistory));
    }

    processMessage(userMessage) {
        const lowerMessage = userMessage.toLowerCase().trim();
        
        // Add user message to history
        this.conversationHistory.push({
            role: 'user',
            message: userMessage,
            timestamp: new Date().toISOString()
        });

        // Pattern matching for responses
        let response = this.generateResponse(lowerMessage);
        
        // Add bot response to history
        this.conversationHistory.push({
            role: 'assistant',
            message: response,
            timestamp: new Date().toISOString()
        });

        this.saveHistory();
        return response;
    }

    generateResponse(message) {
        // Greetings
        if (this.matches(message, ['hi', 'hello', 'hey', 'greetings'])) {
            return "Hello! 👋 I'm Ryan's AI Assistant. I can help you learn about his skills, experience, projects, and AI/ML expertise. What would you like to know?";
        }

        // Skills & Expertise
        if (this.matches(message, ['skill', 'expertise', 'technology', 'tech stack', 'what can', 'what do you know'])) {
            return `Ryan specializes in:\n\n🤖 **AI/ML**: Document Intelligence, OCR (Tesseract, OpenCV), PDF processing, Watermark Removal (RandomForest), LLM Integration (Ollama, vLLM)\n\n💻 **Full-Stack**: React, Next.js, Vue, Angular, Node.js, Python, FastAPI, PHP, Laravel\n\n☁️ **DevOps**: AWS (Lambda, EventBridge), Docker, Kubernetes, CI/CD\n\n💾 **Databases**: MySQL, PostgreSQL, MongoDB\n\nAsk me about specific technologies or check out the "Technical Skills" app!`;
        }

        // AI/ML Focus
        if (this.matches(message, ['ai', 'machine learning', 'ml', 'document intelligence', 'ocr', 'llm'])) {
            return `Ryan is an **AI Developer / Machine Learning Engineer** with deep expertise in:\n\n📄 **Document Intelligence**: End-to-end pipelines for bank statement extraction, validation, and data extraction\n\n👁️ **Computer Vision**: OCR preprocessing with OpenCV, multi-angle scanning, quality scoring\n\n💧 **Watermark Removal**: ML-based detection using RandomForest classification\n\n🧠 **LLM Integration**: Local LLM workflows (Ollama) for structured underwriting summaries\n\n🔒 **Secure AI Gateway**: Node.js gateway with JWT/RSA management and FastAPI SSE\n\nTry opening the "AI Lab" app to see more details!`;
        }

        // Experience
        if (this.matches(message, ['experience', 'work', 'job', 'role', 'position', 'current', 'where do you work'])) {
            return `Ryan currently works as **AI Developer / Machine Learning Engineer** at **Alliance Global Solutions BPO Intl Corp.** (Nov 2025 - Present)\n\nKey achievements:\n• Built end-to-end bank statement extraction pipelines\n• Implemented advanced OCR preprocessing\n• Designed ML-based watermark removal system\n• Integrated local LLM workflows (Ollama)\n• Built secure Node gateway with JWT/RSA\n\nPrevious role: Support Engineer at Bada LLC (Apr 2025 - Oct 2025)\n\nCheck the "Work Experience" app for full details!`;
        }

        // Projects
        if (this.matches(message, ['project', 'what have you built', 'portfolio', 'showcase'])) {
            return `Ryan has delivered **50+ projects** with expertise in:\n\n🏦 **Bank Statement Extraction**: Native PDF + OCR fallback pipeline\n💧 **Watermark Removal**: ML-based automated detection and removal\n🧠 **LLM Underwriting**: Structured summaries using Ollama\n🔒 **Secure AI Gateway**: Real-time processing with FastAPI SSE\n\nPlus full-stack web applications, APIs, and automation systems.\n\nOpen the "Projects" app to explore more!`;
        }

        // How to navigate
        if (this.matches(message, ['how', 'navigate', 'where', 'find', 'show me', 'open'])) {
            return `Here's how to navigate this portfolio:\n\n🖱️ **Desktop Icons**: Double-click any icon to open an app\n\n📋 **Start Menu**: Click the Windows logo (bottom-left) to see all apps\n\n🔍 **Search**: Type in the start menu search box to find apps quickly\n\n⌨️ **Keyboard Shortcuts**:\n• Win/Ctrl+Alt + D: Show desktop\n• Win/Ctrl+Alt + Arrow keys: Snap windows\n\n💡 **Try**: "About Me", "Technical Skills", "Work Experience", "AI Lab", "Terminal"`;
        }

        // Certifications
        if (this.matches(message, ['certificate', 'certification', 'credential', 'cto', 'hacker'])) {
            return `Ryan holds:\n\n🎓 **Certified Chief Technology Officer** (IMTF, Jul 2023)\n\n🔐 **Hacker-X Ethical Hacking Course** (21 modules, Sep 2024 - Nov 2025)\n\nOpen the "Certifications" app to view certificates!`;
        }

        // Contact
        if (this.matches(message, ['contact', 'email', 'reach', 'get in touch', 'hire'])) {
            return `To contact Ryan:\n\n📧 Check the "Contact" app in the start menu\n📄 Download his resume from the "Resume / CV" app\n💼 View his LinkedIn and GitHub profiles\n\nAll contact information is available in the portfolio!`;
        }

        // About Ryan
        if (this.matches(message, ['who', 'about', 'tell me about', 'introduce'])) {
            return `**Ryan James Indangan** is a Full-Stack Developer & Certified CTO with **7+ years** of experience.\n\n🎯 **Current Focus**: AI/ML Engineering, Document Intelligence, and Automation\n\n📊 **Stats**:\n• 7+ Years Experience\n• 50+ Projects Delivered\n• 12 Team Members Led\n\nHe specializes in building intelligent systems for document processing, data extraction, and automation workflows.\n\nOpen "About Me" to learn more!`;
        }

        // Terminal commands
        if (this.matches(message, ['terminal', 'command', 'cli'])) {
            return `Try these commands in the Terminal app:\n\n• \`ai-about\`: Learn about Ryan's AI focus\n• \`ai-skills\`: View AI/ML skills\n• \`ai-projects\`: See AI projects\n• \`ocr-demo\`: Simulate OCR processing\n• \`llm-status\`: Check LLM service status\n• \`help\`: List all commands\n\nOpen the Terminal app and start typing!`;
        }

        // Help
        if (this.matches(message, ['help', 'what can you do', 'commands'])) {
            return `I can help you with:\n\n✅ Skills & Expertise\n✅ Work Experience\n✅ Projects & Portfolio\n✅ AI/ML Capabilities\n✅ Certifications\n✅ Navigation Help\n✅ Contact Information\n\nJust ask me anything about Ryan's portfolio! Try:\n• "What are your skills?"\n• "Tell me about your AI work"\n• "Show me your experience"\n• "How do I navigate this?"`;
        }

        // Fun responses
        if (this.matches(message, ['joke', 'fun', 'entertain'])) {
            const jokes = [
                "Why do AI developers prefer dark mode? Because light attracts bugs! 🐛",
                "I'm not a real AI, but I play one in this portfolio! 😄",
                "Did you know? Ryan has processed 10K+ documents with 94% OCR accuracy! That's impressive! 📄✨"
            ];
            return jokes[Math.floor(Math.random() * jokes.length)];
        }

        // Default response
        return `I'm not sure I understand that. 🤔\n\nTry asking me about:\n• Skills & expertise\n• Work experience\n• AI/ML projects\n• How to navigate\n• Certifications\n\nOr type "help" for more options!`;
    }

    matches(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    }

    clearHistory() {
        this.conversationHistory = [];
        localStorage.removeItem('chatbotHistory');
    }
}

// Initialize chatbot
window.portfolioChatbot = new PortfolioChatbot();

