class PanorixChatbot {
    constructor() {
        this.createChatWidget();
        this.apiUrl = 'https://panorix-chatbot.onrender.com/api/chat'; // Updated Render URL
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

    toggleChat() {
        const chatWindow = document.querySelector('.chat-window');
        chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
    }

    async sendMessage() {
        const input = document.querySelector('.chat-input input');
        const message = input.value.trim();
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        input.value = '';

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            const data = await response.json();
            if (data.status === 'success') {
                this.addMessage(data.response, 'bot');
            } else {
                this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
            }
        } catch (error) {
            this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
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
}

// Initialize chatbot
const panorixChatbot = new PanorixChatbot();
