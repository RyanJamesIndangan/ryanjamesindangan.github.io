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
        this.userName = this.getUserName();
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
        
        // Check for special commands FIRST (before name extraction)
        if (this.matches(lowerMessage, ['clear chat', 'clear messages', 'clear conversation'])) {
            return {
                text: "Chat cleared! 💬",
                suggestions: [],
                action: { type: 'clearChat' }
            };
        }
        
        if (this.matches(lowerMessage, ['clear memory', 'forget everything', 'reset memory', 'clear history'])) {
            this.clearHistory();
            this.userName = null;
            localStorage.removeItem('chatbotUserName');
            return {
                text: "Memory cleared! I've forgotten our conversation and your name. Starting fresh! 🧹",
                suggestions: [
                    "What are your skills?",
                    "Tell me about your AI work",
                    "Show me your experience",
                    "Help"
                ],
                action: { type: 'clearMemory' }
            };
        }
        
        // Check for name introduction patterns
        const nameExtracted = this.extractAndSaveName(userMessage);
        
        // If name was extracted, acknowledge it immediately
        if (nameExtracted) {
            // Add user message to history
            this.conversationHistory.push({
                role: 'user',
                message: userMessage,
                timestamp: new Date().toISOString()
            });
            
            const response = {
                text: `Nice to meet you, ${nameExtracted}! 👋 I'll remember your name. How can I help you learn about Ryan's portfolio?`,
                suggestions: [
                    "What are your skills?",
                    "Tell me about your AI work",
                    "Show me your experience",
                    "What projects have you built?"
                ]
            };
            
            // Add bot response to history
            const nameResponseMessageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            this.conversationHistory.push({
                role: 'assistant',
                message: response.text,
                suggestions: response.suggestions || [],
                timestamp: new Date().toISOString(),
                messageId: nameResponseMessageId
            });
            
            this.saveHistory();
            return response;
        }
        
        // Add user message to history FIRST (so action commands are also tracked)
        this.conversationHistory.push({
            role: 'user',
            message: userMessage,
            timestamp: new Date().toISOString()
        });

        // Get context (active app, conversation topics)
        const context = this.getContext();
        
        // Update conversation context
        this.updateConversationContext(lowerMessage);
        
        // Check for action commands (e.g., "open ai lab", "show skills")
        const actionResult = this.executeAction(lowerMessage);
        if (actionResult) {
            // Store last response for multi-turn conversations
            this.conversationContext.lastResponse = actionResult.text;
            
            // Add bot response to history
            const actionMessageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            this.conversationHistory.push({
                role: 'assistant',
                message: actionResult.text,
                suggestions: actionResult.suggestions || [],
                timestamp: new Date().toISOString(),
                messageId: actionMessageId
            });
            
            this.saveHistory();
            return actionResult;
        }

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
        const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this.conversationHistory.push({
            role: 'assistant',
            message: response.text,
            suggestions: response.suggestions || [],
            timestamp: new Date().toISOString(),
            messageId: messageId
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
            // Try to extract app name - more flexible patterns
            const appPatterns = [
                /(?:open|show|launch|go to|display)\s+(?:the\s+)?(.+?)(?:\s+app|\s+window)?$/i,
                /(?:open|show|launch|go to|display)\s+(.+)/i,
                /(?:open|show|launch|go to|display)\s+(.+?)(?:\s|$)/i
            ];
            
            for (const pattern of appPatterns) {
                const match = message.match(pattern);
                if (match && match[1]) {
                    const appName = match[1].trim();
                    const appId = this.mapAppNameToId(appName);
                    
                    if (appId) {
                        // Update context to track this action
                        this.conversationContext.lastTopic = appId;
                        
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
        if (this.matches(message, ['download', 'get']) && this.matches(message, ['resume', 'cv'])) {
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
        if (!appName) return null;
        
        const normalizedName = appName.toLowerCase().trim();
        const appMap = {
            'about me': 'about',
            'about': 'about',
            'technical skills': 'skills',
            'tech stack': 'skills',
            'skills': 'skills',
            'skill': 'skills',
            'expertise': 'skills',
            'work experience': 'experience',
            'experience': 'experience',
            'professional journey': 'experience',
            'journey': 'experience',
            'projects': 'projects',
            'project': 'projects',
            'showcase': 'projects',
            'portfolio': 'projects',
            'certifications': 'certifications',
            'certification': 'certifications',
            'certificate': 'certifications',
            'credentials': 'certifications',
            'credential': 'certifications',
            'ai lab': 'ai-lab',
            'ai': 'ai-lab',
            'contact': 'contact',
            'resume': 'resume',
            'cv': 'resume',
            'terminal': 'terminal',
            'snake': 'snake',
            'snake game': 'snake'
        };
        
        // Try exact match first
        if (appMap[normalizedName]) {
            return appMap[normalizedName];
        }
        
        // Try partial match (e.g., "ai lab" in "open ai lab")
        for (const [key, value] of Object.entries(appMap)) {
            if (normalizedName.includes(key) || key.includes(normalizedName)) {
                return value;
            }
        }
        
        return null;
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
        
        // Context-aware responses (only if message is generic/asking for help)
        // Exclude specific "what is" questions from context-aware responses
        const isSpecificWhatIs = (this.matches(message, ['what is', 'what\'s', 'explain']) && 
                                  (this.matches(message, ['document intelligence', 'ocr', 'watermark', 'llm', 'large language model'])));
        const isGenericQuestion = !isSpecificWhatIs && 
                                 this.matches(message, ['help', 'what', 'tell me', 'explain', 'describe']) && 
                                 !this.matches(message, ['skill', 'experience', 'project', 'certificate', 'contact', 'about']);
        
        if (activeApp === 'ai-lab' && isGenericQuestion) {
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
        
        if (activeApp === 'skills' && isGenericQuestion) {
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
        
        // Check for name-related questions (before other "what is" patterns)
        // Use regex to match "what is my name" / "what's my name" / "do you know my name" etc.
        const nameQuestionPattern = /(?:what\s+(?:is|'s)\s+my\s+name|what\s+my\s+name|do\s+you\s+know\s+my\s+name|remember\s+my\s+name|what\s+did\s+i\s+say\s+my\s+name|what\s+name\s+did\s+i\s+give)/i;
        if (nameQuestionPattern.test(message)) {
            if (this.userName) {
                return {
                    text: `Your name is **${this.userName}**! 👋 I remember you from when you introduced yourself. How can I help you today?`,
                    suggestions: [
                        "What are your skills?",
                        "Tell me about your AI work",
                        "Show me your experience",
                        "What projects have you built?"
                    ]
                };
            } else {
                return {
                    text: `I don't think you've told me your name yet! 😊\n\nYou can introduce yourself by saying:\n• "My name is [Your Name]"\n• "I'm [Your Name]"\n• "Call me [Your Name]"\n\nOnce you tell me, I'll remember it!`,
                    suggestions: [
                        "My name is...",
                        "What are your skills?",
                        "Tell me about your AI work",
                        "Help"
                    ]
                };
            }
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
            const greeting = this.userName 
                ? `Hello ${this.userName}! 👋 Nice to see you again! I'm Ryan's AI Assistant. How can I help you today?`
                : "Hello! 👋 I'm Ryan's AI Assistant. I can help you learn about his skills, experience, projects, and AI/ML expertise. What would you like to know?";
            
            return {
                text: greeting,
                suggestions: [
                    "What are your skills?",
                    "Tell me about your AI work",
                    "Show me your experience",
                    "What projects have you built?"
                ]
            };
        }

        // Specific "What is" questions - MUST come before general patterns
        if (this.matches(message, ['what is', 'what\'s', 'explain']) && this.matches(message, ['document intelligence'])) {
            return {
                text: `**Document Intelligence** is Ryan's expertise in building end-to-end systems that automatically extract, validate, and process data from documents (especially financial documents like bank statements).\n\n🔧 **How it works**:\n• **Native PDF Extraction**: First tries to extract text directly from PDFs\n• **OCR Fallback**: If text isn't available, uses OCR (Optical Character Recognition) with advanced preprocessing\n• **Multi-angle Scanning**: Rotates and scans documents at different angles for better accuracy\n• **Quality Scoring**: Evaluates OCR results to select the best extraction\n• **Validation Framework**: Ensures data integrity and structural correctness\n\n📊 **Results**:\n• 10K+ documents processed\n• 94% OCR accuracy\n• Automated underwriting workflows\n\n[Open AI Lab] to see more!`,
                suggestions: [
                    "Tell me about OCR",
                    "What is watermark removal?",
                    "Show me AI projects",
                    "What technologies?"
                ]
            };
        }

        if (this.matches(message, ['what is', 'what\'s', 'explain']) && this.matches(message, ['ocr'])) {
            return {
                text: `**OCR (Optical Character Recognition)** converts images of text into machine-readable text. Ryan uses advanced OCR techniques:\n\n👁️ **Preprocessing**:\n• Denoising with OpenCV\n• Adaptive thresholding\n• Deskewing (straightening rotated text)\n• Multi-angle scanning\n\n📈 **Quality Scoring**:\n• Evaluates OCR confidence\n• Compares multiple scan angles\n• Selects best result automatically\n\n🔧 **Tools**: Tesseract OCR, OpenCV, PIL (Python Imaging Library)\n\nUsed as a fallback when PDFs don't have native text, ensuring 94%+ accuracy even on scanned documents.\n\n[Open AI Lab] to see more!`,
                suggestions: [
                    "What is document intelligence?",
                    "What is watermark removal?",
                    "Show me AI projects",
                    "What technologies?"
                ]
            };
        }

        if (this.matches(message, ['what is', 'what\'s', 'explain']) && this.matches(message, ['watermark', 'watermark removal'])) {
            return {
                text: `**Watermark Removal** is an ML-based system that automatically detects and removes watermarks from documents.\n\n🤖 **How it works**:\n• **Feature Engineering**: Extracts visual features from document regions\n• **RandomForest Classification**: ML model identifies watermark types\n• **Smart Routing**: Routes documents to appropriate removal strategies based on watermark type\n• **Automated Processing**: Removes watermarks without manual intervention\n\n📊 **Benefits**:\n• Improves OCR accuracy\n• Enables automated document processing\n• Handles multiple watermark types\n\n🔧 **Tech Stack**: scikit-learn, RandomForest, OpenCV, feature engineering\n\n[Open AI Lab] to see more!`,
                suggestions: [
                    "What is document intelligence?",
                    "What is OCR?",
                    "Show me AI projects",
                    "What technologies?"
                ]
            };
        }

        if (this.matches(message, ['what is', 'what\'s', 'explain']) && this.matches(message, ['llm', 'large language model'])) {
            return {
                text: `**LLM (Large Language Model) Integration** uses AI language models to process and summarize documents.\n\n🧠 **Ryan's Implementation**:\n• **Local LLM Workflows**: Uses Ollama for privacy and cost efficiency\n• **OpenAI-Compatible APIs**: Supports multiple LLM backends (Ollama, vLLM)\n• **Structured Summaries**: Generates structured underwriting summaries from documents\n• **Token-Efficient**: Optimized payloads to reduce costs\n• **Real-time Streaming**: FastAPI Server-Sent Events (SSE) for live updates\n\n📊 **Use Cases**:\n• Automated underwriting summaries\n• Document classification\n• Data extraction and validation\n• Intelligent document processing\n\n🔧 **Tech Stack**: Ollama, vLLM, FastAPI, SSE, OpenAI-compatible APIs\n\n[Open AI Lab] to see more!`,
                suggestions: [
                    "What is document intelligence?",
                    "What is OCR?",
                    "Show me AI projects",
                    "What technologies?"
                ]
            };
        }

        // Skills & Expertise - check for technologies/tech questions
        if (this.matches(message, ['technolog', 'tech', 'skill', 'expertise', 'what can', 'what do you know', 'what tools', 'what stack', 'what framework'])) {
            return {
                text: `Ryan specializes in:\n\n🤖 **AI/ML**: Document Intelligence, OCR (Tesseract, OpenCV), PDF processing, Watermark Removal (RandomForest), LLM Integration (Ollama, vLLM)\n\n💻 **Full-Stack**: React, Next.js, Vue, Angular, Node.js, Python, FastAPI, PHP, Laravel\n\n☁️ **DevOps**: AWS (Lambda, EventBridge), Docker, Kubernetes, CI/CD\n\n💾 **Databases**: MySQL, PostgreSQL, MongoDB\n\nAsk me about specific technologies or [Open Technical Skills] to see more!`,
                suggestions: [
                    "Tell me about AI/ML",
                    "What is document intelligence?",
                    "What frameworks do you use?",
                    "Open Technical Skills"
                ]
            };
        }

        // AI/ML Focus (general - only if not a specific "what is" question)
        if (this.matches(message, ['ai', 'machine learning', 'ml']) && !this.matches(message, ['what is', 'what\'s', 'explain'])) {
            return {
                text: `Ryan is an **AI Developer / Machine Learning Engineer** with deep expertise in:\n\n📄 **Document Intelligence**: End-to-end pipelines for bank statement extraction, validation, and data extraction\n\n👁️ **Computer Vision**: OCR preprocessing with OpenCV, multi-angle scanning, quality scoring\n\n💧 **Watermark Removal**: ML-based detection using RandomForest classification\n\n🧠 **LLM Integration**: Local LLM workflows (Ollama) for structured underwriting summaries\n\n🔒 **Secure AI Gateway**: Node.js gateway with JWT/RSA management and FastAPI SSE\n\n[Open AI Lab] to see more details!`,
                suggestions: [
                    "What is document intelligence?",
                    "Tell me about OCR",
                    "Show me AI projects",
                    "Open AI Lab"
                ]
            };
        }

        // Document Intelligence / OCR / LLM mentions (general - only if not a specific "what is" question)
        if ((this.matches(message, ['document intelligence', 'ocr', 'llm']) && !this.matches(message, ['what is', 'what\'s', 'explain']))) {
            return {
                text: `Ryan specializes in **Document Intelligence** and AI/ML:\n\n📄 **Document Intelligence**: End-to-end pipelines for bank statement extraction\n👁️ **OCR**: Advanced preprocessing with OpenCV, multi-angle scanning\n💧 **Watermark Removal**: ML-based detection using RandomForest\n🧠 **LLM Integration**: Local LLM workflows (Ollama) for structured summaries\n\n[Open AI Lab] to see more details!`,
                suggestions: [
                    "What is document intelligence?",
                    "What is OCR?",
                    "Show me AI projects",
                    "Open AI Lab"
                ]
            };
        }

        // Experience
        if (this.matches(message, ['experience', 'experiences', 'work', 'job', 'jobs', 'role', 'roles', 'position', 'positions', 'current', 'where do you work', 'employment', 'career'])) {
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
        if (this.matches(message, ['project', 'projects', 'what have you built', 'what have you done', 'portfolio', 'showcase', 'work samples'])) {
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
        if (this.matches(message, ['certificate', 'certificates', 'certification', 'certifications', 'credential', 'credentials', 'cto', 'hacker', 'cert'])) {
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
        if (this.matches(message, ['help', 'what can you do', 'commands', 'what can', 'how can'])) {
            const userName = this.userName ? ` ${this.userName}` : '';
            return {
                text: `Hi${userName}! I'm Ryan's AI Assistant. Here's what I can help you with:\n\n**📚 Information:**\n✅ Skills & Expertise\n✅ Work Experience\n✅ Projects & Portfolio\n✅ AI/ML Capabilities\n✅ Certifications\n✅ Contact Information\n\n**🎮 Commands:**\n• **"Open [App Name]"** - Open any app (e.g., "Open AI Lab")\n• **"Clear chat"** - Clear the chat window\n• **"Clear memory"** - Forget our conversation and your name\n• **"Help"** - Show this help message\n\n**💡 Tips:**\n• Click quick reply buttons for suggestions\n• I remember your name if you introduce yourself\n• Ask specific questions like "What is document intelligence?"\n\n**🔧 Technical Note:**\nI'm a client-side, rule-based chatbot built with vanilla JavaScript. I use pattern matching and keyword detection to provide relevant responses. This demonstrates Ryan's ability to build interactive features without external APIs or backend services.\n\nJust ask me anything about Ryan's portfolio!`,
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
            return {
                text: jokes[Math.floor(Math.random() * jokes.length)],
                suggestions: [
                    "Tell me more jokes",
                    "What else can you do?",
                    "Show me your skills",
                    "Help"
                ]
            };
        }

        // Filipino/Tagalog language support
        const filipinoResponse = this.handleFilipino(message);
        if (filipinoResponse) {
            return filipinoResponse;
        }
        
        // Handle random/silly questions with friendly responses
        const sillyResponse = this.handleSillyQuestions(message);
        if (sillyResponse) {
            return sillyResponse;
        }
        
        // Try fuzzy matching for typos before giving up
        const fuzzyResponse = this.tryFuzzyMatch(message, context);
        if (fuzzyResponse) {
            return fuzzyResponse;
        }
        
        // Default response - try to be more helpful and conversational
        const isQuestion = this.matches(message, ['what', 'how', 'when', 'where', 'why', 'tell me', 'show me', 'explain', 'describe', 'ano', 'paano', 'saan', 'kailan', 'bakit']);
        
        // More varied default responses
        const defaultResponses = [
            {
                text: `I'm not sure I understand that question. 🤔\n\nTry asking me about:\n• Skills & Technologies\n• Work Experience\n• AI/ML Projects\n• Certifications\n• Or say "Help" for more options!`,
                suggestions: ["What are your skills?", "What technologies?", "Tell me about your experience", "Help"]
            },
            {
                text: `Hmm, I'm not quite sure what you mean by that. 😅\n\nI can help you learn about:\n• Ryan's technical skills\n• His work experience\n• AI/ML projects\n• Certifications\n\nWhat would you like to know?`,
                suggestions: ["What are your skills?", "Tell me about AI work", "Show me projects", "Help"]
            },
            {
                text: `I'm not familiar with that question, but I'd love to help! 💡\n\nYou can ask me about:\n• Skills & Technologies\n• Work Experience\n• Projects & Portfolio\n• Or type "Help" to see all options`,
                suggestions: ["What technologies?", "Tell me about your experience", "Show me AI projects", "Help"]
            }
        ];
        
        const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        
        if (isQuestion) {
            return randomResponse;
        }
        
        return {
            text: `I'm not sure I understand that. 🤔\n\nTry asking me about:`,
            suggestions: [
                "What are your skills?",
                "What technologies?",
                "Tell me about your experience",
                "Help"
            ]
        };
    }

    matches(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    }
    
    // Optimized fuzzy matching - only for short words to prevent lag
    fuzzyMatch(message, keywords, threshold = 0.7) {
        const words = message.split(/\s+/).filter(w => w.length <= 15); // Only check short words
        for (const keyword of keywords) {
            if (keyword.length > 15) continue; // Skip long keywords
            for (const word of words) {
                // Quick check: if words are similar length and share first letter
                if (Math.abs(word.length - keyword.length) <= 2 && word[0] === keyword[0]) {
                    const similarity = this.quickSimilarity(word, keyword);
                    if (similarity >= threshold) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    // Fast similarity check (optimized for performance)
    quickSimilarity(str1, str2) {
        if (str1 === str2) return 1.0;
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        if (longer.length === 0) return 1.0;
        if (longer.length > 15) return 0; // Skip long strings for performance
        
        // Simple character overlap check (faster than Levenshtein)
        let matches = 0;
        const shorterChars = shorter.split('');
        const longerChars = longer.split('');
        for (const char of shorterChars) {
            const index = longerChars.indexOf(char);
            if (index !== -1) {
                matches++;
                longerChars.splice(index, 1); // Remove to avoid double counting
            }
        }
        return matches / longer.length;
    }
    
    // Normalize message for better matching (remove punctuation, normalize whitespace)
    normalizeMessage(message) {
        return message
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    clearHistory() {
        this.conversationHistory = [];
        localStorage.removeItem('chatbotHistory');
    }
    
    getUserName() {
        const saved = localStorage.getItem('chatbotUserName');
        return saved || null;
    }
    
    saveUserName(name) {
        if (name && name.trim()) {
            this.userName = name.trim();
            localStorage.setItem('chatbotUserName', this.userName);
            return true;
        }
        return false;
    }
    
    extractAndSaveName(message) {
        let extractedName = null;
        
        // Patterns: "my name is X", "I'm X", "I am X", "call me X", "name is X"
        // Use [a-zA-Z] to explicitly match both cases, or use \w for word characters
        const patterns = [
            /(?:my\s+name\s+is|i'?m|i\s+am|call\s+me|name\s+is)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)*)/i,
            /(?:hi|hello|hey),?\s+(?:my\s+name\s+is|i'?m|i\s+am|call\s+me)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)*)/i,
            /(?:hi|hello|hey),?\s+([a-zA-Z]+)(?:\s+here)?$/i
        ];
        
        for (const pattern of patterns) {
            const match = message.match(pattern);
            if (match && match[1]) {
                extractedName = match[1].trim();
                // Filter out common words that aren't names
                const notName = ['hi', 'hello', 'hey', 'there', 'here', 'this', 'that', 'the', 'a', 'an', 'is', 'am', 'are'];
                const lowerName = extractedName.toLowerCase();
                if (!notName.includes(lowerName) && extractedName.length > 1) {
                    // Capitalize first letter of each word
                    const capitalizedName = extractedName.split(' ').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    ).join(' ');
                    this.saveUserName(capitalizedName);
                    return capitalizedName;
                }
            }
        }
        
        return null;
    }
    
    // Handle Filipino/Tagalog language
    handleFilipino(message) {
        const lowerMessage = message.toLowerCase();
        
        // Greetings in Filipino
        if (this.matches(lowerMessage, ['kumusta', 'kamusta', 'musta', 'hello po', 'hi po', 'magandang araw', 'magandang umaga', 'magandang hapon', 'magandang gabi'])) {
            const userName = this.userName ? ` ${this.userName}` : '';
            const greetings = [
                `Kumusta${userName}! 👋 I'm Ryan's AI Assistant. I can help you learn about his skills, experience, and projects. Ano ang gusto mong malaman?`,
                `Kamusta${userName}! 👋 I'm Ryan's AI Assistant. Paano kita matutulungan?`,
                `Hello po${userName}! 👋 I'm Ryan's AI Assistant. What would you like to know about Ryan?`
            ];
            return {
                text: greetings[Math.floor(Math.random() * greetings.length)],
                suggestions: [
                    "What are your skills?",
                    "Tell me about your AI work",
                    "Show me your experience",
                    "What projects have you built?"
                ]
            };
        }
        
        // Skills/Technology questions in Filipino
        if (this.matches(lowerMessage, ['ano ang skills', 'ano ang teknolohiya', 'ano ang tech', 'ano ang kaya', 'ano ang alam', 'skills mo', 'teknolohiya mo', 'tech stack mo'])) {
            return {
                text: `Ryan specializes in:\n\n🤖 **AI/ML**: Document Intelligence, OCR, PDF processing, LLM Integration\n💻 **Full-Stack**: React, Next.js, Vue, Angular, Node.js, Python, FastAPI\n☁️ **DevOps**: AWS, Docker, Kubernetes, CI/CD\n💾 **Databases**: MySQL, PostgreSQL, MongoDB\n\n[Open Technical Skills] to see more!`,
                suggestions: [
                    "Tell me about AI/ML",
                    "What is document intelligence?",
                    "What frameworks?",
                    "Open Technical Skills"
                ]
            };
        }
        
        // Experience questions in Filipino
        if (this.matches(lowerMessage, ['ano ang experience', 'ano ang trabaho', 'saan ka nagtatrabaho', 'ano ang work', 'experience mo', 'trabaho mo'])) {
            return {
                text: `Ryan currently works as **AI Developer / Machine Learning Engineer** at **Alliance Global Solutions BPO Intl Corp.** (Nov 2025 - Present)\n\nKey achievements:\n• Built end-to-end bank statement extraction pipelines\n• Implemented advanced OCR preprocessing\n• Designed ML-based watermark removal system\n• Integrated local LLM workflows (Ollama)\n\n[Open Work Experience] for full details!`,
                suggestions: [
                    "What technologies did you use?",
                    "Tell me about your projects",
                    "Show me your skills",
                    "Open Work Experience"
                ]
            };
        }
        
        // Projects questions in Filipino
        if (this.matches(lowerMessage, ['ano ang projects', 'ano ang ginawa', 'ano ang portfolio', 'projects mo', 'ginawa mo', 'portfolio mo'])) {
            return {
                text: `Ryan has delivered **50+ projects** with expertise in:\n\n🏦 **Bank Statement Extraction**: Native PDF + OCR fallback pipeline\n💧 **Watermark Removal**: ML-based automated detection\n🧠 **LLM Underwriting**: Structured summaries using Ollama\n🔒 **Secure AI Gateway**: Real-time processing with FastAPI SSE\n\n[Open Projects] to explore more!`,
                suggestions: [
                    "Tell me about AI projects",
                    "What technologies?",
                    "Show me your skills",
                    "Open Projects"
                ]
            };
        }
        
        // Help in Filipino
        if (this.matches(lowerMessage, ['tulong', 'help po', 'paano', 'ano ang pwede', 'ano ang kaya'])) {
            const userName = this.userName ? ` ${this.userName}` : '';
            return {
                text: `Hi${userName}! I'm Ryan's AI Assistant. Here's what I can help you with:\n\n**📚 Information:**\n✅ Skills & Expertise\n✅ Work Experience\n✅ Projects & Portfolio\n✅ AI/ML Capabilities\n✅ Certifications\n\n**🎮 Commands:**\n• "Open [App Name]" - Open any app\n• "Clear chat" - Clear the chat\n• "Help" - Show this message\n\nJust ask me anything about Ryan's portfolio!`,
                suggestions: [
                    "What are your skills?",
                    "Tell me about your AI work",
                    "Show me your experience",
                    "How do I navigate this?"
                ]
            };
        }
        
        // About Ryan in Filipino
        if (this.matches(lowerMessage, ['sino si ryan', 'ano si ryan', 'sino ka', 'ano ka', 'tell me about ryan'])) {
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
        
        return null;
    }
    
    // Handle silly/random questions with friendly responses
    handleSillyQuestions(message) {
        const lowerMessage = message.toLowerCase();
        
        // Weather questions
        if (this.matches(lowerMessage, ['weather', 'ulan', 'maulan', 'init', 'lamig', 'temperature'])) {
            return {
                text: `I'm not a weather bot! 😄 But I can tell you about Ryan's skills and projects. What would you like to know?`,
                suggestions: [
                    "What are your skills?",
                    "Tell me about your AI work",
                    "Show me your experience",
                    "Help"
                ]
            };
        }
        
        // Time/Date questions
        if (this.matches(lowerMessage, ['what time', 'ano ang oras', 'what date', 'ano ang petsa', 'kelan'])) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
            const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            return {
                text: `It's ${timeStr} on ${dateStr}. ⏰\n\nBut I'm here to help you learn about Ryan's portfolio! What would you like to know?`,
                suggestions: [
                    "What are your skills?",
                    "Tell me about your AI work",
                    "Show me your experience",
                    "Help"
                ]
            };
        }
        
        // Compliments
        if (this.matches(lowerMessage, ['good', 'great', 'awesome', 'amazing', 'galing', 'magaling', 'ang galing', 'impressive', 'nice', 'cool'])) {
            return {
                text: `Thank you! 😊 I'm glad you like it! Ryan put a lot of effort into building this portfolio. Would you like to learn more about his skills or projects?`,
                suggestions: [
                    "What are your skills?",
                    "Tell me about your AI work",
                    "Show me your experience",
                    "What projects have you built?"
                ]
            };
        }
        
        // How are you / How's it going
        if (this.matches(lowerMessage, ['how are you', 'kamusta ka', 'musta ka', 'how\'s it going', 'how are things', 'kumusta ka'])) {
            return {
                text: `I'm doing great, thanks for asking! 😊 I'm here to help you learn about Ryan's portfolio. What would you like to know?`,
                suggestions: [
                    "What are your skills?",
                    "Tell me about your AI work",
                    "Show me your experience",
                    "Help"
                ]
            };
        }
        
        // Random questions about the chatbot itself
        if (this.matches(lowerMessage, ['who are you', 'sino ka', 'what are you', 'ano ka', 'are you ai', 'ai ka ba'])) {
            return {
                text: `I'm Ryan's AI Assistant! 🤖 I'm a rule-based chatbot built with vanilla JavaScript. I use pattern matching to answer questions about Ryan's portfolio.\n\nI can help you learn about:\n• Skills & Technologies\n• Work Experience\n• Projects & Portfolio\n• AI/ML Capabilities\n\nWhat would you like to know?`,
                suggestions: [
                    "What are your skills?",
                    "Tell me about your AI work",
                    "Show me your experience",
                    "Help"
                ]
            };
        }
        
        return null;
    }
    
    // Try fuzzy matching for typos
    tryFuzzyMatch(message, context) {
        const normalized = this.normalizeMessage(message);
        
        // Common typos and variations
        const typoMap = {
            'skils': 'skills',
            'skil': 'skills',
            'teknology': 'technology',
            'teknologies': 'technologies',
            'tech': 'technology',
            'expirience': 'experience',
            'experiance': 'experience',
            'projec': 'project',
            'projecs': 'projects',
            'portfolo': 'portfolio',
            'certificat': 'certificate',
            'certificats': 'certificates'
        };
        
        for (const [typo, correct] of Object.entries(typoMap)) {
            if (normalized.includes(typo)) {
                // Try to match with corrected version
                const correctedMessage = normalized.replace(typo, correct);
                // Check if corrected message would match known patterns
                if (this.matches(correctedMessage, [correct, 'what', 'tell me', 'show me'])) {
                    // Return a helpful response
                    return {
                        text: `I think you might be asking about "${correct}". Let me help you with that! 💡\n\n${this.getTopicResponse(correct)}`,
                        suggestions: [
                            "What are your skills?",
                            "Tell me about your experience",
                            "Show me projects",
                            "Help"
                        ]
                    };
                }
            }
        }
        
        return null;
    }
    
    getTopicResponse(topic) {
        const responses = {
            'skills': 'Ryan specializes in AI/ML, Full-Stack Development, DevOps, and Databases. [Open Technical Skills] to see more!',
            'technology': 'Ryan uses Python, JavaScript, React, FastAPI, AWS, Docker, and many more technologies. [Open Technical Skills] to see the full list!',
            'experience': 'Ryan has 7+ years of experience, currently working as AI Developer/ML Engineer. [Open Work Experience] for details!',
            'project': 'Ryan has delivered 50+ projects including AI/ML systems, web applications, and automation tools. [Open Projects] to explore!',
            'portfolio': 'This is Ryan\'s portfolio! You can explore his skills, experience, projects, and certifications. [Open Projects] to see his work!',
            'certificate': 'Ryan holds CTO certification and Hacker-X Ethical Hacking Course. [Open Certifications] to view certificates!'
        };
        return responses[topic] || 'I can help you learn about Ryan\'s portfolio. What would you like to know?';
    }
}

// Initialize chatbot
window.portfolioChatbot = new PortfolioChatbot();

