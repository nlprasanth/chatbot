from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')
        
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
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
