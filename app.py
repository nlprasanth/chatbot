from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import openai
import os
import logging
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["https://panorixsolutions.com", "http://panorixsolutions.com"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')
if not openai.api_key:
    logger.error("OpenAI API key is not set!")

@app.route('/')
def home():
    return jsonify({"status": "healthy"})

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

@app.route('/api/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        logger.info("Received chat request")
        data = request.json
        logger.debug(f"Request data: {data}")
        
        user_message = data.get('message', '')
        if not user_message:
            logger.warning("Empty message received")
            return jsonify({
                "error": "Message cannot be empty",
                "status": "error"
            }), 400

        logger.info(f"Making request to OpenAI with message: {user_message}")
        # Create chat completion with OpenAI
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant for Panorix Solutions website. Be professional and concise in your responses."},
                {"role": "user", "content": user_message}
            ],
            max_tokens=150
        )
        
        # Extract the assistant's response
        bot_response = response.choices[0].message.content
        logger.info("Successfully got response from OpenAI")
        
        return jsonify({
            "response": bot_response,
            "status": "success"
        })
    
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}", exc_info=True)
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
