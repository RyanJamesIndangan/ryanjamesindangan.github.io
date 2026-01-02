// ===========================
// AI Chatbot Engine
// ===========================

class PortfolioChatbot {
    constructor() {
        this.conversationHistory = [];
        this.conversationContext = {
            lastTopic: null,
            lastResponse: null,
            mentionedTopics: []
        };
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
        
        // Check for action commands first (e.g., "open ai lab", "show skills")
        const actionResult = this.executeAction(lowerMessage);
        if (actionResult) {
            return actionResult;
        }
        
        // Add user message to history
        this.conversationHistory.push({
            role: 'user',
            message: userMessage,
            timestamp: new Date().toISOString()
        });

        // Get context (active app, conversation topics)
        const context = this.getContext();
        
        // Update conversation context
        this.updateConversationContext(lowerMessage);

        // Pattern matching for responses (now returns object with text and suggestions)
        let response = this.generateResponse(lowerMessage, context);
        
        // Ensure response is an object
        if (typeof response === 'string') {
            response = { text: response, suggestions: [] };
        }
        
        // Generate smart suggestions if not provided
        if (!response.suggestions || response.suggestions.length === 0) {
            response.suggestions = this.getSmartSuggestions();
        }
        
        // Store last response for multi-turn conversations
        this.conversationContext.lastResponse = response.text;
        
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

    getContext() {
        const activeApp = this.getActiveApp();
        const topics = this.extractTopics();
        
        return {
            activeApp: activeApp,
            topics: topics,
            lastTopic: this.conversationContext.lastTopic
        };
    }

    getActiveApp() {
        const activeWindow = window.windowManager?.activeWindow;
        return activeWindow ? activeWindow.dataset.appId : null;
    }

    extractTopics() {
        const topics = new Set();
        const recentMessages = this.conversationHistory.slice(-6); // Last 6 messages
        
        recentMessages.forEach(msg => {
            const text = msg.message.toLowerCase();
            if (text.includes('ai') || text.includes('machine learning') || text.includes('ml')) topics.add('ai');
            if (text.includes('skill') || text.includes('tech') || text.includes('technology')) topics.add('skills');
            if (text.includes('experience') || text.includes('work') || text.includes('job')) topics.add('experience');
            if (text.includes('project') || text.includes('portfolio') || text.includes('showcase')) topics.add('projects');
            if (text.includes('certificate') || text.includes('credential')) topics.add('certifications');
            if (text.includes('contact') || text.includes('email') || text.includes('hire')) topics.add('contact');
        });
        
        return Array.from(topics);
    }

    updateConversationContext(message) {
        // Detect current topic
        if (this.matches(message, ['ai', 'machine learning', 'ml', 'document intelligence', 'ocr', 'llm'])) {
            this.conversationContext.lastTopic = 'ai';
        } else if (this.matches(message, ['skill', 'expertise', 'technology', 'tech stack'])) {
            this.conversationContext.lastTopic = 'skills';
        } else if (this.matches(message, ['experience', 'work', 'job', 'role'])) {
            this.conversationContext.lastTopic = 'experience';
        } else if (this.matches(message, ['project', 'portfolio', 'showcase'])) {
            this.conversationContext.lastTopic = 'projects';
        } else if (this.matches(message, ['certificate', 'certification', 'credential'])) {
            this.conversationContext.lastTopic = 'certifications';
        }
        
        // Track mentioned topics
        const topics = this.extractTopics();
        this.conversationContext.mentionedTopics = topics;
    }

    executeAction(message) {
        // Action commands: "open", "show", "launch", "go to"
        if (this.matches(message, ['open', 'show', 'launch', 'go to', 'display'])) {
            // Try to extract app name
            const appPatterns = [
                /(?:open|show|launch|go to|display)\s+(?:the\s+)?(.+?)(?:\s+app|\s+window)?$/i,
                /(?:open|show|launch|go to|display)\s+(.+)/i
            ];
            
            for (const pattern of appPatterns) {
                const match = message.match(pattern);
                if (match) {
                    const appName = match[1].trim();
                    const appId = this.mapAppNameToId(appName);
                    
                    if (appId) {
                        // Execute action
                        setTimeout(() => {
                            if (window.openApp) {
                                window.openApp(appId);
                            }
                        }, 100);
                        
                        return {
                            text: `Opening ${this.getAppDisplayName(appId)} for you! 🚀`,
                            suggestions: [
                                "Tell me about this",
                                "What can I see here?",
                                "Show me more"
                            ],
                            action: { type: 'openApp', appId: appId }
                        };
                    }
                }
            }
        }
        
        // Download resume command
        if (this.matches(message, ['download', 'get', 'show']) && this.matches(message, ['resume', 'cv'])) {
            // Trigger resume download (if implemented)
            return {
                text: "You can download Ryan's resume from the [Open Resume] app! 📄",
                suggestions: [
                    "Open Resume",
                    "Tell me about Ryan",
                    "Show me skills"
                ]
            };
        }
        
        return null;
    }

    mapAppNameToId(appName) {
        const appMap = {
            'about me': 'about',
            'about': 'about',
            'technical skills': 'skills',
            'tech stack': 'skills',
            'skills': 'skills',
            'expertise': 'skills',
            'work experience': 'experience',
            'experience': 'experience',
            'professional journey': 'experience',
            'projects': 'projects',
            'project': 'projects',
            'showcase': 'projects',
            'portfolio': 'projects',
            'certifications': 'certifications',
            'certificate': 'certifications',
            'credentials': 'certifications',
            'ai lab': 'ai-lab',
            'ai': 'ai-lab',
            'contact': 'contact',
            'resume': 'resume',
            'cv': 'resume',
            'terminal': 'terminal',
            'snake': 'snake',
            'snake game': 'snake'
        };
        
        return appMap[appName.toLowerCase()] || null;
    }

    getAppDisplayName(appId) {
        const appNames = {
            'about': 'About Me',
            'skills': 'Technical Skills',
            'experience': 'Work Experience',
            'projects': 'Projects',
            'certifications': 'Certifications',
            'ai-lab': 'AI Lab',
            'contact': 'Contact',
            'resume': 'Resume',
            'terminal': 'Terminal',
            'snake': 'Snake Game'
        };
        
        return appNames[appId] || appId;
    }

    getSmartSuggestions() {
        const topics = this.conversationContext.mentionedTopics;
        const lastTopic = this.conversationContext.lastTopic;
        const activeApp = this.getActiveApp();
        
        // Context-aware suggestions based on active app
        if (activeApp === 'ai-lab') {
            return [
                "Tell me about document intelligence",
                "What is OCR?",
                "Show me AI projects",
                "What technologies do you use?"
            ];
        }
        
        if (activeApp === 'skills') {
            return [
                "Tell me about AI/ML",
                "What frameworks?",
                "Show me your projects",
                "What's your experience?"
            ];
        }
        
        if (activeApp === 'experience') {
            return [
                "What technologies did you use?",
                "Tell me about your projects",
                "Show me your skills",
                "What's your current role?"
            ];
        }
        
        if (activeApp === 'projects') {
            return [
                "Tell me about AI projects",
                "What technologies?",
                "Show me your skills",
                "What's your experience?"
            ];
        }
        
        // Topic-based smart suggestions
        if (topics.includes('ai') && !topics.includes('projects')) {
            return [
                "Tell me about AI projects",
                "What AI tools do you use?",
                "Show me your experience",
                "What is document intelligence?"
            ];
        }
        
        if (topics.includes('experience') && !topics.includes('skills')) {
            return [
                "What skills did you use?",
                "What technologies?",
                "Tell me about your projects",
                "Show me your skills"
            ];
        }
        
        if (topics.includes('skills') && !topics.includes('projects')) {
            return [
                "Tell me about your projects",
                "What's your experience?",
                "Show me AI work",
                "What have you built?"
            ];
        }
        
        if (topics.includes('projects') && !topics.includes('ai')) {
            return [
                "Tell me about AI projects",
                "What technologies?",
                "Show me your skills",
                "What's your experience?"
            ];
        }
        
        // Multi-turn conversation handling
        if (this.matches(this.conversationContext.lastResponse || '', ['more', 'details', 'expand'])) {
            return [
                "Tell me more",
                "What else?",
                "Show me examples",
                "Give me details"
            ];
        }
        
        // Default smart suggestions
        if (lastTopic === 'ai') {
            return [
                "Tell me about AI projects",
                "What is document intelligence?",
                "Show me your skills",
                "What technologies?"
            ];
        }
        
        if (lastTopic === 'skills') {
            return [
                "Tell me about your projects",
                "What's your experience?",
                "Show me AI work",
                "What have you built?"
            ];
        }
        
        if (lastTopic === 'experience') {
            return [
                "What skills did you use?",
                "Tell me about your projects",
                "What technologies?",
                "Show me your skills"
            ];
        }
        
        // Generic fallback
        return [
            "Tell me more",
            "What else can you do?",
            "Show me your skills",
            "What's your experience?"
        ];
    }

    generateResponse(message, context = {}) {
        const activeApp = context.activeApp;
        const lastTopic = context.lastTopic;
        
        // Context-aware responses
        if (activeApp === 'ai-lab' && this.matches(message, ['help', 'what', 'tell me'])) {
            return {
                text: `Since you're viewing **AI Lab**, I can tell you about:\n\n📄 **Document Intelligence**: End-to-end pipelines for bank statement extraction\n👁️ **OCR Processing**: Advanced preprocessing with OpenCV\n💧 **Watermark Removal**: ML-based detection using RandomForest\n🧠 **LLM Integration**: Local LLM workflows with Ollama\n\n[Open AI Lab] to explore more!`,
                suggestions: [
                    "Tell me about OCR",
                    "What is document intelligence?",
                    "Show me AI projects",
                    "What technologies?"
                ]
            };
        }
        
        if (activeApp === 'skills' && this.matches(message, ['help', 'what', 'tell me'])) {
            return {
                text: `You're viewing **Technical Skills**! Ryan specializes in:\n\n🤖 **AI/ML**: Document Intelligence, OCR, PDF processing, LLM Integration\n💻 **Full-Stack**: React, Next.js, Vue, Angular, Node.js, Python, FastAPI\n☁️ **DevOps**: AWS, Docker, Kubernetes, CI/CD\n\n[Open Technical Skills] to see the full list!`,
                suggestions: [
                    "Tell me about AI/ML",
                    "What frameworks?",
                    "Show me projects",
                    "What's your experience?"
                ]
            };
        }
        
        // Multi-turn conversation handling
        if (this.matches(message, ['tell me more', 'more', 'expand', 'details', 'and', 'what else'])) {
            if (lastTopic === 'ai') {
                return {
                    text: `More about Ryan's **AI/ML expertise**:\n\n🔬 **Advanced Techniques**:\n• Multi-angle OCR scanning with quality scoring\n• Feature engineering for ML models\n• Token-efficient LLM payloads\n• Real-time processing with FastAPI SSE\n\n📊 **Results**:\n• 10K+ documents processed\n• 94% OCR accuracy\n• Automated underwriting workflows\n\n[Open AI Lab] to see detailed projects!`,
                    suggestions: [
                        "Tell me about OCR",
                        "What is document intelligence?",
                        "Show me projects",
                        "What technologies?"
                    ]
                };
            }
            
            if (lastTopic === 'experience') {
                return {
                    text: `More about Ryan's **work experience**:\n\n💼 **Current Role** (Nov 2025 - Present):\n• Building production AI pipelines\n• Leading document intelligence systems\n• Integrating LLM workflows for automation\n\n📈 **Key Achievements**:\n• Designed validation-first extraction framework\n• Created ML-based watermark removal system\n• Built secure AI gateway with JWT/RSA\n\n[Open Work Experience] for complete details!`,
                    suggestions: [
                        "What technologies did you use?",
                        "Tell me about projects",
                        "Show me skills",
                        "What's your current role?"
                    ]
                };
            }
            
            if (lastTopic === 'skills') {
                return {
                    text: `More about Ryan's **technical skills**:\n\n🛠️ **Specializations**:\n• End-to-end AI pipeline design\n• Full-stack web development\n• Cloud infrastructure & DevOps\n• Database design & optimization\n\n💡 **Expertise Areas**:\n• Document processing & automation\n• API design & integration\n• System architecture\n• Team leadership\n\n[Open Technical Skills] to see everything!`,
                    suggestions: [
                        "Tell me about projects",
                        "What's your experience?",
                        "Show me AI work",
                        "What have you built?"
                    ]
                };
            }
            
            // Generic "tell me more"
            return {
                text: `I'd be happy to tell you more! What would you like to know?\n\n• Skills & Technologies\n• Work Experience\n• AI/ML Projects\n• Certifications\n• How to navigate\n\nJust ask! 😊`,
                suggestions: [
                    "What are your skills?",
                    "Tell me about your experience",
                    "Show me AI projects",
                    "Help"
                ]
            };
        }
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
        if (this.matches(message, ['how', 'navigate', 'where', 'find'])) {
            return {
                text: `Here's how to navigate this portfolio:\n\n🖱️ **Desktop Icons**: Double-click any icon to open an app\n\n📋 **Start Menu**: Click the Windows logo (bottom-left) to see all apps\n\n🔍 **Search**: Type in the start menu search box to find apps quickly\n\n⌨️ **Keyboard Shortcuts**:\n• Win/Ctrl+Alt + D: Show desktop\n• Win/Ctrl+Alt + Arrow keys: Snap windows\n\n💬 **Chat Commands**: You can also say "Open [App Name]" to open apps directly!\n\n💡 **Try**: "About Me", "Technical Skills", "Work Experience", "AI Lab", "Terminal"`,
                suggestions: [
                    "Open About Me",
                    "Open Technical Skills",
                    "Open AI Lab",
                    "What can you do?"
                ]
            };
        }

        // Certifications
        if (this.matches(message, ['certificate', 'certification', 'credential', 'cto', 'hacker'])) {
            return {
                text: `Ryan holds:\n\n🎓 **Certified Chief Technology Officer** (IMTF, Jul 2023)\n\n🔐 **Hacker-X Ethical Hacking Course** (21 modules, Sep 2024 - Nov 2025)\n\n[Open Certifications] to view certificates!`,
                suggestions: [
                    "Tell me about CTO certification",
                    "What is Hacker-X?",
                    "Show me your skills",
                    "Open Certifications"
                ]
            };
        }

        // Contact
        if (this.matches(message, ['contact', 'email', 'reach', 'get in touch', 'hire'])) {
            return {
                text: `To contact Ryan:\n\n📧 Check the [Open Contact] app in the start menu\n📄 Download his resume from the [Open Resume] app\n💼 View his LinkedIn and GitHub profiles\n\nAll contact information is available in the portfolio!`,
                suggestions: [
                    "Open Contact",
                    "Open Resume",
                    "Tell me about Ryan",
                    "Show me skills"
                ]
            };
        }

        // About Ryan
        if (this.matches(message, ['who', 'about', 'tell me about', 'introduce'])) {
            return {
                text: `**Ryan James Indangan** is a Full-Stack Developer & Certified CTO with **7+ years** of experience.\n\n🎯 **Current Focus**: AI/ML Engineering, Document Intelligence, and Automation\n\n📊 **Stats**:\n• 7+ Years Experience\n• 50+ Projects Delivered\n• 12 Team Members Led\n\nHe specializes in building intelligent systems for document processing, data extraction, and automation workflows.\n\n[Open About Me] to learn more!`,
                suggestions: [
                    "Tell me about your skills",
                    "Show me your experience",
                    "What projects have you built?",
                    "Open About Me"
                ]
            };
        }

        // Terminal commands
        if (this.matches(message, ['terminal', 'command', 'cli'])) {
            return {
                text: `Try these commands in the Terminal app:\n\n• \`ai-about\`: Learn about Ryan's AI focus\n• \`ai-skills\`: View AI/ML skills\n• \`ai-projects\`: See AI projects\n• \`ocr-demo\`: Simulate OCR processing\n• \`llm-status\`: Check LLM service status\n• \`help\`: List all commands\n\n[Open Terminal] and start typing!`,
                suggestions: [
                    "Open Terminal",
                    "Tell me about AI",
                    "What can the terminal do?",
                    "Show me skills"
                ]
            };
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

