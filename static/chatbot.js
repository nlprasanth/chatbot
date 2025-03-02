class PanorixChatbot {
    constructor() {
        this.createChatWidget();
        this.apiUrl = 'https://panorix-chatbot.onrender.com/api/chat'; // Updated Render URL
        this.isWaiting = false;
    }

    createChatWidget() {
        // Create chat container
        const chatContainer = document.createElement('div');
        chatContainer.id = 'panorix-chatbot';
        chatContainer.innerHTML = `
            <div class="chat-icon" onclick="panorixChatbot.toggleChat()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </div>
            <div class="chat-window" style="display: none;">
                <div class="chat-header">
                    <h3>Panorix Assistant</h3>
                    <button onclick="panorixChatbot.toggleChat()">×</button>
                </div>
                <div class="chat-messages"></div>
                <div class="chat-input">
                    <input type="text" placeholder="Type your message..." onkeypress="panorixChatbot.handleKeyPress(event)">
                    <button onclick="panorixChatbot.sendMessage()">Send</button>
                </div>
            </div>
        `;
        document.body.appendChild(chatContainer);

        // Add styles
        const styles = document.createElement('style');
        styles.textContent = `
            #panorix-chatbot {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                font-family: Arial, sans-serif;
            }
            .chat-icon {
                background: #0066cc;
                color: white;
                padding: 15px;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            }
            .chat-window {
                position: fixed;
                bottom: 80px;
                right: 20px;
                width: 300px;
                height: 400px;
                background: white;
                border-radius: 10px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.2);
                display: flex;
                flex-direction: column;
            }
            .chat-header {
                padding: 15px;
                background: #0066cc;
                color: white;
                border-radius: 10px 10px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .chat-header h3 {
                margin: 0;
                font-size: 16px;
            }
            .chat-header button {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
            }
            .chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 15px;
            }
            .message {
                margin-bottom: 10px;
                padding: 8px 12px;
                border-radius: 15px;
                max-width: 80%;
            }
            .user-message {
                background: #e6f2ff;
                margin-left: auto;
            }
            .bot-message {
                background: #f0f0f0;
            }
            .chat-input {
                padding: 15px;
                border-top: 1px solid #eee;
                display: flex;
            }
            .chat-input input {
                flex: 1;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 20px;
                margin-right: 10px;
            }
            .chat-input button {
                background: #0066cc;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 20px;
                cursor: pointer;
            }
        `;
        document.head.appendChild(styles);
    }

    async sendMessage() {
        const input = document.querySelector('.chat-input input');
        const message = input.value.trim();
        if (!message || this.isWaiting) return;

        try {
            this.isWaiting = true;
            this.addMessage(message, 'user');
            input.value = '';

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                mode: 'cors',
                credentials: 'omit',
                body: JSON.stringify({ 
                    message: message 
                })
            });

            const data = await response.json();
            console.log('Server response:', data);  // Debug log
            
            if (data.status === 'success' && data.response) {
                this.addMessage(data.response, 'bot');
            } else {
                throw new Error(data.error || 'Unknown error occurred');
            }
        } catch (error) {
            console.error('Chat error:', error);
            let errorMessage = error.message;
            if (errorMessage.includes('OpenAI API error')) {
                errorMessage = 'Sorry, there was an issue with the AI service. Please try again in a moment.';
            }
            this.addMessage(errorMessage, 'bot');
        } finally {
            this.isWaiting = false;
        }
    }

    addMessage(text, sender) {
        const messagesContainer = document.querySelector('.chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.sendMessage();
        }
    }

    toggleChat() {
        const chatWindow = document.querySelector('.chat-window');
        chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
    }
}

// Initialize chatbot
const panorixChatbot = new PanorixChatbot();
