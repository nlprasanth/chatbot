# WordPress AI Chatbot

This is a custom AI chatbot implementation for panorixsolutions.com. The chatbot uses OpenAI's GPT model for intelligent responses and can be easily integrated into your WordPress website.

## Setup Instructions

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Create a `.env` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

3. Run the backend server:
   ```bash
   python app.py
   ```

4. Add the chatbot widget to your WordPress site by including the script tag in your theme's footer.

## Features
- Real-time AI-powered responses
- Customizable chat interface
- Mobile-responsive design
- Easy WordPress integration

## Configuration
The chatbot can be customized by modifying the following files:
- `static/chatbot.js`: Frontend widget configuration
- `app.py`: Backend API and AI model settings
- `static/styles.css`: Visual customization
