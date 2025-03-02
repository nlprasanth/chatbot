from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import openai
import os
import logging
import json
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='static')
CORS(app, resources={
    r"/*": {
        "origins": ["https://panorixsolutions.com", "http://panorixsolutions.com", "http://localhost:5000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Accept"]
    }
})

# Configure OpenAI
api_key = os.getenv('OPENAI_API_KEY')
if not api_key:
    logger.error("OpenAI API key is not set!")

openai.api_key = api_key
openai.api_base = "https://api.openai.com/v1"  # Ensure we're using the correct base URL

@app.route('/')
def home():
    return jsonify({"status": "healthy"})

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

@app.route('/test')
def test():
    try:
        # Test OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "Hello"}],
            max_tokens=5
        )
        api_test = "success"
    except Exception as e:
        api_test = f"failed: {str(e)}"

    return jsonify({
        "status": "ok",
        "message": "Test endpoint working",
        "openai_key_set": bool(openai.api_key),
        "openai_key_length": len(openai.api_key) if openai.api_key else 0,
        "openai_api_test": api_test
    })

@app.route('/api/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        logger.info("Received chat request")
        logger.info(f"Request headers: {dict(request.headers)}")
        
        # Log raw request data
        raw_data = request.get_data()
        logger.info(f"Raw request data: {raw_data}")
        
        try:
            data = request.get_json()
        except Exception as e:
            logger.error(f"Failed to parse JSON: {e}")
            return jsonify({
                "error": "Invalid JSON data",
                "status": "error"
            }), 400
            
        logger.debug(f"Parsed request data: {data}")
        
        user_message = data.get('message', '')
        if not user_message:
            logger.warning("Empty message received")
            return jsonify({
                "error": "Message cannot be empty",
                "status": "error"
            }), 400

        logger.info(f"Making request to OpenAI with message: {user_message}")
        try:
            # Create chat completion with OpenAI
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant for Panorix Solutions website. Be professional and concise in your responses."},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=150,
                temperature=0.7
            )
            
            # Extract the assistant's response
            bot_response = response.choices[0].message.content
            logger.info("Successfully got response from OpenAI")
            logger.debug(f"OpenAI response: {response}")
            
            return jsonify({
                "response": bot_response,
                "status": "success"
            })
            
        except openai.error.OpenAIError as e:
            logger.error(f"OpenAI API error: {str(e)}")
            error_msg = str(e)
            if "auth" in error_msg.lower() or "api key" in error_msg.lower():
                error_msg = "Authentication error with AI service. Please check API key configuration."
            return jsonify({
                "error": error_msg,
                "status": "error"
            }), 500
    
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}", exc_info=True)
        return jsonify({
            "error": f"Server error: {str(e)}",
            "status": "error"
        }), 500

# This is important for gunicorn
application = app

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
