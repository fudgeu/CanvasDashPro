import os
import requests
import json
from flask import Flask, jsonify, request
from dotenv import load_dotenv
from cloudflare_ai import run

# Load environment variables from the .env file
load_dotenv()

app = Flask(__name__)

@app.route('/')
def home():
    return "Bruh"

@app.route('/assignment_analyze', methods=['POST'])
def assignment_analyze():
    if request.is_json:  # Check if the request has JSON content
        data = request.get_json()  # Parse the incoming JSON data
        print(data)  # Debugging: Print incoming JSON data
        
        # Extract class information from JSON data
        className = data.get('className')
        assignmentTitle = data.get('assignmentTitle')
        assignmentDesc = data.get('assignmentDesc')

        # System messages for AI input
        system1 = {
            "role": "system",
            "content": '''
                You are an expert school educator who can analyze how much time and difficulty an college assignment is.
                You will get a JSON format like the following:
                { 
                    "className": "Name",
                    "assignmentTitle": "Title",
                    "assignmentDesc": "Description as HTML"
                }
                Calculate an average score based on approximate time needed and overall difficulty of the assignment. 
                Reply ONLY THE 3 things BELOW in a JSON object. 
                1. Response ONLY the overall score as a number between 1 to 10. 
                2. Respond the time needed in minutes.
                3. Give a 2 sentence in total reasoning that explains the difficulty score and approximate time and less than 30 words. 
                USE FORMAT BELOW AND GENERATE IN JSON FORMAT, MAKE SURE YOUR RESPONSE CAN BE JSONIFIED AND NOTHING WILL STOP IT FROM BEING PARSED
                { 
                    "score": "",
                    "time": "",
                    "reason": ""
                }
            '''
        }

        # Combine the messages with user input
        inputs = [system1, {"role": "user", "content": assignmentDesc}]
        
        # Call the Cloudflare AI API
        output = run("@cf/meta/llama-3-8b-instruct", inputs)
        
        # Check if the AI output contains a valid JSON object
        try:
            # Debugging: Print the AI output to check its structure
            print(output)
            
            # Return the AI's response as JSON
            return json.loads(output)
        except Exception as e:
            return jsonify({"error": f"Failed to process AI response: {str(e)}"}), 500
    else:
        return jsonify({"error": "Request must be JSON formatted"}), 400

if __name__ == '__main__':
    app.run(debug=True)
