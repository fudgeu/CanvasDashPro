import os
import requests
import json
from flask import Flask, jsonify, request
from dotenv import load_dotenv
from cloudflare_ai import run
from flask_cors import CORS
import sys
# Load environment variables from the .env file
load_dotenv()

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})


def validate_input(data, required_fields):
    """
    Validate that the required fields are present and are of the correct type.
    """
    for field in required_fields:
        if field not in data:
            return False, f"Missing required field: {field}"
        if not isinstance(data[field], str):
            return False, f"Invalid value for field: {field} must be a non-empty string"
    return True, "OK"

@app.route('/')
def home():
    return "Bruh"

@app.route('/assignment_analyze', methods=['POST'])
def assignment_analyze():
    if request.is_json:
        data = request.get_json()

        required_fields = ['className', 'assignmentTitle', 'assignmentDesc']
        is_valid, message = validate_input(data, required_fields)

        if not is_valid:
            return jsonify({"error": message}), 400

        className = data['className'].strip()
        assignmentTitle = data['assignmentTitle'].strip()
        assignmentDesc = data['assignmentDesc'].strip()

        system1 = {
            "role": "system",
            "content": '''
                You are an expert school educator who can analyze how much time and difficulty a college assignment is.
                IF THERE IS NO DESCRIPTION THEN JUDGE IT BASED ON TITLE.
                You will get the data in JSON format like the following:
                { 
                    "className": "Name",
                    "assignmentTitle": "Title",
                    "assignmentDesc": "Description as HTML"
                }
                Calculate an average score based on approximate time needed and overall difficulty of the assignment. 
                Reply ONLY the 3 things BELOW in a JSON object. 
                1. Response ONLY the overall score as a number between 1 to 10, NO DECIMALS FOR A SMART COLLEGE STUDENT. 
                2. Respond the time needed in minutes as a number.
                3. Give a 2 sentence reasoning in less than 30 words.
                FOLLOW THE FOLLOWING JSON FORMAT and output. Your output MUST be a valid JSON object. Do NOT use any additional characters that may break a JSON parser, including line breaks or code blocks. Make sure you close all quotes, and close all brackets:
                { 
                    "score": 5,
                    "time": 20,
                    "reason": ""
                }
                
            '''
        }

        user_input = {
            "role": "user",
            "content": json.dumps({
                "className": className,
                "assignmentTitle": assignmentTitle,
                "assignmentDesc": assignmentDesc
            })
        }

        inputs = [system1, user_input]

        # output = run("@cf/meta/llama-3.2-3b-instruct", inputs)
        output = run("@cf/meta/llama-3-8b-instruct", inputs)


        try:
            print(output)
            return json.loads(output)
        except Exception as e:
            return jsonify({"error": f"Failed to process AI response: {str(e)}"}), 500
    else:
        return jsonify({"error": "Request must be JSON formatted"}), 400


@app.route('/announcement_keywords', methods=['POST'])
def announcement_keywords():
    if request.is_json:
        data = request.get_json()

        required_fields = ['author', 'timePosted', 'course', 'announcementTitle', 'announcementBody']
        is_valid, message = validate_input(data, required_fields)

        if not is_valid:
            return jsonify({"error": message}), 400

        author = data['author'].strip()
        timePosted = data['timePosted'].strip()
        course = data['course'].strip()
        announcementTitle = data['announcementTitle'].strip()
        announcementBody = data['announcementBody'].strip()

        # System message for AI input
        system1 = {
            "role": "system",
            "content": '''
                You are an expert school educator and a professional writer who can summarize college course announcements.
                You will get the data in JSON format like the following:
                { 
                    "author": "the announcement's author's name",
                    "timePosted": "the time when the announcement is posted",
                    "course": "course full name",
                    "announcementTitle": "the announcement's title",
                    "announcementBody": "the announcement's body"
                }
                Generate a one-sentence summary less than 25 words long in third-person perspective from the given data.
                Make sure the response is strictly following in JSON format like this and there should be no other content that will effect the JSON parsing process:
                {"body": "summary..."}
            '''
        }

        # Combine the system message with user input
        user_input = {
            "role": "user",
            "content": json.dumps({
                "author": author,
                "timePosted": timePosted,
                "course": course,
                "announcementTitle": announcementTitle,
                "announcementBody": announcementBody
            })
        }

        inputs = [system1, user_input]

        # output = run("@cf/meta/llama-3.2-3b-instruct", inputs)
        output = run("@cf/meta/llama-3-8b-instruct", inputs)

        try:
            return json.loads(output)
        except Exception as e:
            return jsonify({"error": f"Failed to process AI response: {str(e)}"}), 500
    else:
        return jsonify({"error": "Request must be JSON formatted"}), 400


if __name__ == '__main__':
    app.run(debug=True)
