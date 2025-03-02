from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({
                "error": "Message cannot be empty",
                "status": "error"
            }), 400
        
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
        
        return jsonify({
            "response": bot_response,
            "status": "success"
        })
    
    except Exception as e:
        print(f"Error: {str(e)}")  # Log the error
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
