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
        this.conversationMode = this.getConversationMode(); // 'professional', 'casual', 'technical'
        this.userPreferences = this.loadUserPreferences(); // Track user interests and behavior
        this.learningData = this.loadLearningData(); // Track frequently asked questions, favorite topics
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
        
        // Check for conversation mode change
        if (this.matches(lowerMessage, ['switch to professional mode', 'professional mode', 'be professional'])) {
            this.setConversationMode('professional');
            return {
                text: "Switched to **Professional Mode**. I'll provide formal, detailed responses. 💼",
                suggestions: this.getSmartSuggestions()
            };
        }
        
        if (this.matches(lowerMessage, ['switch to casual mode', 'casual mode', 'be casual', 'be friendly'])) {
            this.setConversationMode('casual');
            return {
                text: "Switched to **Casual Mode**. Let's chat more casually! 😊",
                suggestions: this.getSmartSuggestions()
            };
        }
        
        if (this.matches(lowerMessage, ['switch to technical mode', 'technical mode', 'be technical'])) {
            this.setConversationMode('technical');
            return {
                text: "Switched to **Technical Mode**. I'll provide detailed technical information. 🔧",
                suggestions: this.getSmartSuggestions()
            };
        }
        
        // Detect intent and entities
        const intent = this.detectIntent(userMessage);
        const entities = this.extractEntities(userMessage);
        
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
        let response = this.generateResponse(lowerMessage, {
            ...context,
            intent: intent,
            entities: entities
        });
        
        // Ensure response is an object
        if (typeof response === 'string') {
            response = { text: response, suggestions: [] };
        }
        
        // Adjust response tone based on conversation mode
        if (response.text) {
            response.text = this.adjustResponseTone(response.text);
        }
        
        // Generate smart suggestions if not provided
        if (!response.suggestions || response.suggestions.length === 0) {
            response.suggestions = this.getSmartSuggestions();
        }
        
        // Track interaction for learning
        this.trackInteraction(userMessage, response, response.action);
        
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
        
        // Enhanced suggestions based on user preferences and learning data
        const favoriteTopics = this.userPreferences.favoriteTopics || [];
        const frequentlyAsked = Object.keys(this.learningData.questionFrequency || {})
            .sort((a, b) => (this.learningData.questionFrequency[b] || 0) - (this.learningData.questionFrequency[a] || 0))
            .slice(0, 3);
        
        // Context-aware suggestions based on active app
        if (activeApp === 'ai-lab') {
            const suggestions = [
                "Tell me about document intelligence",
                "What is OCR?",
                "Show me AI projects",
                "What technologies do you use?"
            ];
            // Add personalized suggestions based on user interests
            if (favoriteTopics.includes('ai')) {
                suggestions.unshift("Tell me more about watermark removal");
            }
            return suggestions;
        }
        
        if (activeApp === 'skills') {
            const suggestions = [
                "Tell me about AI/ML",
                "What frameworks?",
                "Show me your projects",
                "What's your experience?"
            ];
            if (favoriteTopics.includes('backend')) {
                suggestions.unshift("What backend technologies?");
            }
            return suggestions;
        }
        
        if (activeApp === 'experience') {
            const suggestions = [
                "What technologies did you use?",
                "Tell me about your projects",
                "Show me your skills",
                "What's your current role?"
            ];
            if (favoriteTopics.includes('ai')) {
                suggestions.unshift("Tell me about your AI work");
            }
            return suggestions;
        }
        
        if (activeApp === 'projects') {
            const suggestions = [
                "Tell me about AI projects",
                "What technologies?",
                "Show me your skills",
                "What's your experience?"
            ];
            if (favoriteTopics.includes('ai')) {
                suggestions.unshift("Show me document intelligence projects");
            }
            return suggestions;
        }
        
        // Topic-based smart suggestions with learning
        if (topics.includes('ai') && !topics.includes('projects')) {
            const suggestions = [
                "Tell me about AI projects",
                "What AI tools do you use?",
                "Show me your experience",
                "What is document intelligence?"
            ];
            // Add based on frequently asked questions
            if (frequentlyAsked.length > 0) {
                suggestions.unshift(frequentlyAsked[0]);
            }
            return suggestions;
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
        
        // Math/Calculation questions - Check FIRST before other patterns
        const mathResult = this.handleMathQuestion(message);
        if (mathResult) {
            return mathResult;
        }
        
        // General knowledge questions
        const knowledgeResult = this.handleGeneralKnowledge(message);
        if (knowledgeResult) {
            return knowledgeResult;
        }
        
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
            const startYear = 2018;
            const currentYear = new Date().getFullYear();
            const years = currentYear - startYear;
            return {
                text: `**Ryan James Indangan** is a Full-Stack Developer & Certified CTO with **${years}+ years** of experience.\n\n🎯 **Current Focus**: AI/ML Engineering, Document Intelligence, and Automation\n\n📊 **Stats**:\n• ${years}+ Years Experience\n• 50+ Projects Delivered\n• 12 Team Members Led\n\nHe specializes in building intelligent systems for document processing, data extraction, and automation workflows.\n\n[Open About Me] to learn more!`,
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
    
    getConversationMode() {
        return localStorage.getItem('chatbotMode') || 'professional';
    }
    
    setConversationMode(mode) {
        this.conversationMode = mode;
        localStorage.setItem('chatbotMode', mode);
    }
    
    loadUserPreferences() {
        const saved = localStorage.getItem('chatbotUserPreferences');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return {
                    favoriteTopics: [],
                    frequentlyAsked: [],
                    openedApps: [],
                    interactionCount: 0
                };
            }
        }
        return {
            favoriteTopics: [],
            frequentlyAsked: [],
            openedApps: [],
            interactionCount: 0
        };
    }
    
    saveUserPreferences() {
        localStorage.setItem('chatbotUserPreferences', JSON.stringify(this.userPreferences));
    }
    
    loadLearningData() {
        const saved = localStorage.getItem('chatbotLearningData');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return {
                    questionFrequency: {},
                    topicFrequency: {},
                    appOpenFrequency: {},
                    responseFeedback: {}
                };
            }
        }
        return {
            questionFrequency: {},
            topicFrequency: {},
            appOpenFrequency: {},
            responseFeedback: {}
        };
    }
    
    saveLearningData() {
        localStorage.setItem('chatbotLearningData', JSON.stringify(this.learningData));
    }
    
    // Track user interaction for learning
    trackInteraction(message, response, action = null) {
        // Update interaction count
        this.userPreferences.interactionCount++;
        
        // Track question frequency
        const questionKey = message.toLowerCase().trim();
        this.learningData.questionFrequency[questionKey] = 
            (this.learningData.questionFrequency[questionKey] || 0) + 1;
        
        // Track topics mentioned
        const topics = this.extractTopics();
        topics.forEach(topic => {
            this.learningData.topicFrequency[topic] = 
                (this.learningData.topicFrequency[topic] || 0) + 1;
            
            if (!this.userPreferences.favoriteTopics.includes(topic)) {
                this.userPreferences.favoriteTopics.push(topic);
            }
        });
        
        // Track app opens
        if (action && action.type === 'openApp') {
            const appId = action.appId;
            this.learningData.appOpenFrequency[appId] = 
                (this.learningData.appOpenFrequency[appId] || 0) + 1;
            
            if (!this.userPreferences.openedApps.includes(appId)) {
                this.userPreferences.openedApps.push(appId);
            }
        }
        
        // Keep only top 10 favorite topics
        if (this.userPreferences.favoriteTopics.length > 10) {
            this.userPreferences.favoriteTopics = this.userPreferences.favoriteTopics.slice(0, 10);
        }
        
        // Save preferences and learning data
        this.saveUserPreferences();
        this.saveLearningData();
    }
    
    // Enhanced natural language understanding - Intent detection
    detectIntent(message) {
        const lowerMessage = message.toLowerCase().trim();
        
        // Greeting intent
        if (this.matches(lowerMessage, ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'])) {
            return { intent: 'greeting', confidence: 0.9 };
        }
        
        // Question intent
        if (this.matches(lowerMessage, ['what', 'how', 'why', 'when', 'where', 'who', 'which', 'tell me', 'explain', 'describe'])) {
            return { intent: 'question', confidence: 0.85 };
        }
        
        // Action intent
        if (this.matches(lowerMessage, ['open', 'show', 'display', 'launch', 'start', 'go to'])) {
            return { intent: 'action', confidence: 0.9 };
        }
        
        // Information request intent
        if (this.matches(lowerMessage, ['skills', 'experience', 'projects', 'about', 'contact', 'resume', 'certifications'])) {
            return { intent: 'information', confidence: 0.8 };
        }
        
        // Comparison intent
        if (this.matches(lowerMessage, ['compare', 'difference', 'vs', 'versus', 'better', 'best'])) {
            return { intent: 'comparison', confidence: 0.75 };
        }
        
        // Help intent
        if (this.matches(lowerMessage, ['help', 'assist', 'support', 'guide', 'how can you'])) {
            return { intent: 'help', confidence: 0.9 };
        }
        
        return { intent: 'general', confidence: 0.5 };
    }
    
    // Extract entities from message (technologies, skills, projects, etc.)
    extractEntities(message) {
        const entities = {
            technologies: [],
            skills: [],
            projects: [],
            apps: []
        };
        
        const lowerMessage = message.toLowerCase();
        
        // Technology keywords
        const techKeywords = {
            'react': 'React',
            'vue': 'Vue.js',
            'angular': 'Angular',
            'node': 'Node.js',
            'python': 'Python',
            'javascript': 'JavaScript',
            'typescript': 'TypeScript',
            'php': 'PHP',
            'fastapi': 'FastAPI',
            'django': 'Django',
            'laravel': 'Laravel',
            'aws': 'AWS',
            'docker': 'Docker',
            'kubernetes': 'Kubernetes',
            'ocr': 'OCR',
            'tesseract': 'Tesseract',
            'opencv': 'OpenCV',
            'llm': 'LLM',
            'ollama': 'Ollama',
            'machine learning': 'Machine Learning',
            'ai': 'AI',
            'ml': 'Machine Learning'
        };
        
        for (const [keyword, tech] of Object.entries(techKeywords)) {
            if (lowerMessage.includes(keyword)) {
                entities.technologies.push(tech);
            }
        }
        
        // App names
        const appKeywords = {
            'ai lab': 'ai-lab',
            'ai-lab': 'ai-lab',
            'skills': 'skills',
            'experience': 'experience',
            'projects': 'projects',
            'about': 'about',
            'contact': 'contact',
            'blog': 'blog',
            'github stats': 'github-stats',
            'testimonials': 'testimonials'
        };
        
        for (const [keyword, appId] of Object.entries(appKeywords)) {
            if (lowerMessage.includes(keyword)) {
                entities.apps.push(appId);
            }
        }
        
        return entities;
    }
    
    // Get portfolio data for better integration
    getPortfolioData(type) {
        // Access apps data if available
        if (typeof apps !== 'undefined') {
            switch(type) {
                case 'projects':
                    return apps.projects?.content || null;
                case 'skills':
                    return apps.skills?.content || null;
                case 'experience':
                    return apps.experience?.content || null;
                default:
                    return null;
            }
        }
        return null;
    }
    
    // Generate response based on conversation mode
    adjustResponseTone(text) {
        if (this.conversationMode === 'casual') {
            // Make responses more casual and friendly
            text = text.replace(/I'm/g, "I am");
            text = text.replace(/I'll/g, "I will");
            text = text.replace(/can't/g, "cannot");
            // Add casual phrases
            if (!text.includes('😊') && !text.includes('👋')) {
                text = text.replace(/\./g, (match, offset) => {
                    return offset === text.length - 1 ? '! 😊' : match;
                });
            }
        } else if (this.conversationMode === 'technical') {
            // Make responses more technical and detailed
            // Add technical details where appropriate
            if (text.includes('AI') && !text.includes('Machine Learning')) {
                text = text.replace(/AI/g, 'AI/Machine Learning');
            }
        }
        // 'professional' mode uses default text
        return text;
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
            const startYear = 2018;
            const currentYear = new Date().getFullYear();
            const years = currentYear - startYear;
            return {
                text: `**Ryan James Indangan** is a Full-Stack Developer & Certified CTO with **${years}+ years** of experience.\n\n🎯 **Current Focus**: AI/ML Engineering, Document Intelligence, and Automation\n\n📊 **Stats**:\n• ${years}+ Years Experience\n• 50+ Projects Delivered\n• 12 Team Members Led\n\nHe specializes in building intelligent systems for document processing, data extraction, and automation workflows.\n\n[Open About Me] to learn more!`,
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
            'experience': (() => {
                const startYear = 2018;
                const currentYear = new Date().getFullYear();
                const years = currentYear - startYear;
                return `Ryan has ${years}+ years of experience, currently working as AI Developer/ML Engineer. [Open Work Experience] for details!`;
            })(),
            'project': 'Ryan has delivered 50+ projects including AI/ML systems, web applications, and automation tools. [Open Projects] to explore!',
            'portfolio': 'This is Ryan\'s portfolio! You can explore his skills, experience, projects, and certifications. [Open Projects] to see his work!',
            'certificate': 'Ryan holds CTO certification and Hacker-X Ethical Hacking Course. [Open Certifications] to view certificates!'
        };
        return responses[topic] || 'I can help you learn about Ryan\'s portfolio. What would you like to know?';
    }
    
    // Handle math/calculation questions
    handleMathQuestion(message) {
        // Pattern: "1+1", "2*3", "10/2", "5-3", "what is 1+1", "calculate 2*5", etc.
        // First, check if it's a simple math question like "what is 1+1"
        const lowerMessage = message.toLowerCase().trim();
        
        // Replace words with operators
        let expression = message.trim();
        expression = expression.replace(/\bplus\b/gi, '+');
        expression = expression.replace(/\bminus\b/gi, '-');
        expression = expression.replace(/\btimes\b|\bmultiplied\s+by\b/gi, '*');
        expression = expression.replace(/\bdivided\s+by\b|\bdivide\b/gi, '/');
        expression = expression.replace(/\bwhat\s+is\b|\bwhat's\b|\bcalculate\b|\bcompute\b|\bsolve\b|\bevaluate\b/gi, '');
        expression = expression.replace(/\?/g, '');
        expression = expression.trim();
        
        // Check if it looks like a math expression (numbers, operators, parentheses, spaces)
        // Updated regex to be more explicit: must contain at least one operator and numbers
        const mathRegex = /^[\d+\-*/().\s^]+$/;
        const hasOperator = /[+\-*/^]/.test(expression);
        const hasNumber = /\d/.test(expression);
        
        if (!mathRegex.test(expression) || !hasOperator || !hasNumber) {
            return null;
        }
        
        // Try to evaluate using expr-eval library (if available) or safe eval
        try {
            let result;
            let parser = null;
            
            // Try multiple possible global names for expr-eval
            if (typeof Parser !== 'undefined') {
                parser = new Parser();
            } else if (typeof exprEval !== 'undefined' && exprEval.Parser) {
                parser = new exprEval.Parser();
            } else if (typeof window !== 'undefined' && window.Parser) {
                parser = new window.Parser();
            } else if (typeof window !== 'undefined' && window.exprEval && window.exprEval.Parser) {
                parser = new window.exprEval.Parser();
            }
            
            // Use expr-eval if available (safer)
            if (parser) {
                // Replace ^ with ** for power
                const cleanExpression = expression.replace(/\^/g, '**').replace(/\s/g, '');
                result = parser.evaluate(cleanExpression);
            } else {
                // Fallback: Safe evaluation for simple expressions only
                // Only allow numbers, operators, and parentheses
                const safeExpression = expression.replace(/[^0-9+\-*/().\s]/g, '').replace(/\s/g, '');
                if (safeExpression.length === 0 || !/^[\d+\-*/().]+$/.test(safeExpression)) {
                    return null; // Contains unsafe characters or empty
                }
                // Use Function constructor (safer than eval)
                result = Function('"use strict"; return (' + safeExpression + ')')();
            }
            
            // Format result
            const formattedResult = Number.isInteger(result) ? result : parseFloat(result.toFixed(10));
            
            // Handle edge cases
            if (isNaN(formattedResult) || !isFinite(formattedResult)) {
                return null;
            }
            
            return {
                text: `**${expression.replace(/\s/g, '')}** = **${formattedResult}** 🧮\n\nI can help with:\n• Basic arithmetic (+, -, *, /)\n• Complex expressions\n• Powers (^ or **)\n\nTry asking: "What is 15 * 23?" or "Calculate 100 / 4"`,
                suggestions: [
                    "What is 2+2?",
                    "Calculate 10*5",
                    "What are your skills?",
                    "Tell me about your AI work"
                ]
            };
        } catch (error) {
            // If evaluation fails, it's probably not a math question
            console.debug('Math evaluation failed:', error, 'for expression:', expression);
            return null;
        }
    }
    
    // Handle general knowledge questions
    handleGeneralKnowledge(message) {
        const lowerMessage = message.toLowerCase().trim();
        
        // First, try to catch math questions that might have been missed by handleMathQuestion
        // This is a fallback for questions like "what is 1+1" with variations
        const mathPattern = /what\s+(?:is|'s)\s+([\d+\-*/().\s^]+)/i;
        const mathMatch = message.match(mathPattern);
        if (mathMatch && mathMatch[1]) {
            const mathResult = this.handleMathQuestion(mathMatch[1].trim());
            if (mathResult) {
                return mathResult;
            }
        }
        
        // Simple Q&A pairs
        const knowledgeBase = {
            // Math basics (exact matches)
            'what is 1+1': '1 + 1 = **2** 🧮',
            'what\'s 1+1': '1 + 1 = **2** 🧮',
            'what is 2+2': '2 + 2 = **4** 🧮',
            'what\'s 2+2': '2 + 2 = **4** 🧮',
            'what is 1+1+1': '1 + 1 + 1 = **3** 🧮',
            
            // General knowledge
            'what is the capital of': (msg) => {
                const country = msg.replace(/what is the capital of/i, '').trim();
                if (country) {
                    const capitals = {
                        'philippines': 'Manila',
                        'usa': 'Washington D.C.',
                        'united states': 'Washington D.C.',
                        'japan': 'Tokyo',
                        'china': 'Beijing',
                        'uk': 'London',
                        'united kingdom': 'London',
                        'france': 'Paris',
                        'germany': 'Berlin',
                        'australia': 'Canberra',
                        'canada': 'Ottawa'
                    };
                    const capital = capitals[country.toLowerCase()];
                    return capital ? `The capital of ${country} is **${capital}** 🌍` : null;
                }
                return null;
            },
            
            // Time/Date
            'what time is it': () => {
                const now = new Date();
                return `It's **${now.toLocaleTimeString()}** 🕐`;
            },
            'what date is it': () => {
                const now = new Date();
                return `Today is **${now.toLocaleDateString()}** 📅`;
            },
            'what day is it': () => {
                const now = new Date();
                return `Today is **${now.toLocaleDateString('en-US', { weekday: 'long' })}** 📅`;
            },
            
            // Simple facts
            'how many days in a week': 'There are **7 days** in a week 📅',
            'how many hours in a day': 'There are **24 hours** in a day ⏰',
            'how many minutes in an hour': 'There are **60 minutes** in an hour ⏰',
            'how many seconds in a minute': 'There are **60 seconds** in a minute ⏰',
            
            // Programming basics
            'what is javascript': '**JavaScript** is a programming language used for web development. It runs in browsers and can also be used on servers (Node.js). Ryan uses JavaScript/TypeScript for full-stack development! 💻',
            'what is python': '**Python** is a high-level programming language known for its simplicity. Ryan uses Python for AI/ML, data processing, and backend development! 🐍',
            'what is html': '**HTML** (HyperText Markup Language) is the standard markup language for creating web pages. It structures content on the web! 🌐',
            'what is css': '**CSS** (Cascading Style Sheets) is used to style and layout web pages. It makes websites look beautiful! 🎨',
        };
        
        // Check exact matches first
        if (knowledgeBase[lowerMessage]) {
            const answer = typeof knowledgeBase[lowerMessage] === 'function' 
                ? knowledgeBase[lowerMessage](message)
                : knowledgeBase[lowerMessage];
            if (answer) {
                return {
                    text: answer,
                    suggestions: [
                        "What are your skills?",
                        "Tell me about your AI work",
                        "What is 2+2?",
                        "Help"
                    ]
                };
            }
        }
        
        // Check pattern matches
        for (const [pattern, handler] of Object.entries(knowledgeBase)) {
            if (typeof handler === 'function' && lowerMessage.includes(pattern)) {
                const answer = handler(message);
                if (answer) {
                    return {
                        text: answer,
                        suggestions: [
                            "What are your skills?",
                            "Tell me about your AI work",
                            "What is 2+2?",
                            "Help"
                        ]
                    };
                }
            }
        }
        
        return null;
    }
}

// Initialize chatbot
window.portfolioChatbot = new PortfolioChatbot();

