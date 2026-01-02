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

        // Pattern matching for responses (now returns object with text and suggestions)
        let response = this.generateResponse(lowerMessage);
        
        // Ensure response is an object
        if (typeof response === 'string') {
            response = { text: response, suggestions: [] };
        }
        
        // Add bot response to history
        this.conversationHistory.push({
            role: 'assistant',
            message: response.text,
            suggestions: response.suggestions || [],
            timestamp: new Date().toISOString()
        });

        this.saveHistory();
        return response;
    }

    generateResponse(message) {
        // Greetings
        if (this.matches(message, ['hi', 'hello', 'hey', 'greetings'])) {
            return {
                text: "Hello! 👋 I'm Ryan's AI Assistant. I can help you learn about his skills, experience, projects, and AI/ML expertise. What would you like to know?",
                suggestions: [
                    "What are your skills?",
                    "Tell me about your AI work",
                    "Show me your experience",
                    "What projects have you built?"
                ]
            };
        }

        // Skills & Expertise
        if (this.matches(message, ['skill', 'expertise', 'technology', 'tech stack', 'what can', 'what do you know'])) {
            return {
                text: `Ryan specializes in:\n\n🤖 **AI/ML**: Document Intelligence, OCR (Tesseract, OpenCV), PDF processing, Watermark Removal (RandomForest), LLM Integration (Ollama, vLLM)\n\n💻 **Full-Stack**: React, Next.js, Vue, Angular, Node.js, Python, FastAPI, PHP, Laravel\n\n☁️ **DevOps**: AWS (Lambda, EventBridge), Docker, Kubernetes, CI/CD\n\n💾 **Databases**: MySQL, PostgreSQL, MongoDB\n\nAsk me about specific technologies or [Open Technical Skills] to see more!`,
                suggestions: [
                    "Tell me about AI/ML",
                    "What frameworks do you use?",
                    "Show me your projects",
                    "Open Technical Skills"
                ]
            };
        }

        // AI/ML Focus
        if (this.matches(message, ['ai', 'machine learning', 'ml', 'document intelligence', 'ocr', 'llm'])) {
            return {
                text: `Ryan is an **AI Developer / Machine Learning Engineer** with deep expertise in:\n\n📄 **Document Intelligence**: End-to-end pipelines for bank statement extraction, validation, and data extraction\n\n👁️ **Computer Vision**: OCR preprocessing with OpenCV, multi-angle scanning, quality scoring\n\n💧 **Watermark Removal**: ML-based detection using RandomForest classification\n\n🧠 **LLM Integration**: Local LLM workflows (Ollama) for structured underwriting summaries\n\n🔒 **Secure AI Gateway**: Node.js gateway with JWT/RSA management and FastAPI SSE\n\n[Open AI Lab] to see more details!`,
                suggestions: [
                    "Tell me about OCR",
                    "What is document intelligence?",
                    "Show me AI projects",
                    "Open AI Lab"
                ]
            };
        }

        // Experience
        if (this.matches(message, ['experience', 'work', 'job', 'role', 'position', 'current', 'where do you work'])) {
            return {
                text: `Ryan currently works as **AI Developer / Machine Learning Engineer** at **Alliance Global Solutions BPO Intl Corp.** (Nov 2025 - Present)\n\nKey achievements:\n• Built end-to-end bank statement extraction pipelines\n• Implemented advanced OCR preprocessing\n• Designed ML-based watermark removal system\n• Integrated local LLM workflows (Ollama)\n• Built secure Node gateway with JWT/RSA\n\nPrevious role: Support Engineer at Bada LLC (Apr 2025 - Oct 2025)\n\n[Open Work Experience] for full details!`,
                suggestions: [
                    "What technologies did you use?",
                    "Tell me about your projects",
                    "Show me your skills",
                    "Open Work Experience"
                ]
            };
        }

        // Projects
        if (this.matches(message, ['project', 'what have you built', 'portfolio', 'showcase'])) {
            return {
                text: `Ryan has delivered **50+ projects** with expertise in:\n\n🏦 **Bank Statement Extraction**: Native PDF + OCR fallback pipeline\n💧 **Watermark Removal**: ML-based automated detection and removal\n🧠 **LLM Underwriting**: Structured summaries using Ollama\n🔒 **Secure AI Gateway**: Real-time processing with FastAPI SSE\n\nPlus full-stack web applications, APIs, and automation systems.\n\n[Open Projects] to explore more!`,
                suggestions: [
                    "Tell me about AI projects",
                    "What technologies?",
                    "Show me your skills",
                    "Open Projects"
                ]
            };
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
            return {
                text: `I can help you with:\n\n✅ Skills & Expertise\n✅ Work Experience\n✅ Projects & Portfolio\n✅ AI/ML Capabilities\n✅ Certifications\n✅ Navigation Help\n✅ Contact Information\n\nJust ask me anything about Ryan's portfolio!`,
                suggestions: [
                    "What are your skills?",
                    "Tell me about your AI work",
                    "Show me your experience",
                    "How do I navigate this?"
                ]
            };
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
        return {
            text: `I'm not sure I understand that. 🤔\n\nTry asking me about:`,
            suggestions: [
                "What are your skills?",
                "Tell me about your experience",
                "Show me AI projects",
                "Help"
            ]
        };
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

