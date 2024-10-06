import requests
import os
from dotenv import load_dotenv
import json

load_dotenv()

API_BASE_URL = "https://api.cloudflare.com/client/v4/accounts/" + os.getenv('ACCOUNT_ID')+ "/ai/run/"
headers = {"Authorization": "Bearer " + os.getenv('CLOUDFLARE_AUTH_TOKEN')}

def run(model, inputs):
    """
    Sends a request to the Cloudflare AI model and returns the result.

    :param model: The AI model to use (e.g., "@cf/meta/llama-3-8b-instruct")
    :param inputs: List of messages to send to the AI model
    :return: JSON response from the Cloudflare AI model
    """
    
    input_data = { "messages": inputs }
    response = requests.post(f"{API_BASE_URL}{model}", headers=headers, json=input_data)
    print(response.json())
    return response.json()['result']['response']

def main():
    """
    Main function to test the `run()` function by sending inputs and printing the output.
    """
    inputs = [
        { "role": "system", "content": "You are a mathematician" },
        { "role": "user", "content": "Find the 30th place of fibonacci number." }
    ]
    # Call the run function and print the output
    output = run("@cf/meta/llama-3-8b-instruct", inputs)
    print(output)

if __name__ == '__main__':
    main()
