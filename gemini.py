import google.generativeai as genai
import random

API_KEYS = [
    "AIzaSyCwdDvKqc-W9Ucmve5tU2OemneMPvymVEA",
    "AIzaSyDka4ftzVGZnQSqzoBVf3YcXeZzJOH1Qas",
    "AIzaSyBAeTcNrAUOW5gvF1Un8LTby7vNIwFfBF4",
    "AIzaSyAv1xgRqX5dvGNXL-UTKZvCX4t2zTyqyg8",
    "AIzaSyAbjMsZDt2PyIlNONxjp6DVW-TVK91doJE",
    "AIzaSyCGOjfbAUhLNph07Otueu6G0srKgRccq98",
    "AIzaSyD4Uzd2f3VTktZnnZ6pyALpOeHLQ2AfetE",
    "AIzaSyDv3BUhsSjABBUCqFqBdhMOq_RRUhJW8Fk",
    "AIzaSyA7yBrleIn_-vPOaf-p0tQGDRqJ-psLnAk",
    "AIzaSyBrN8-Zwd3ZivSzg7cjz1grnZhxMCeuZLo",
    "AIzaSyB6ayq-PhDRtTuTSvSJx6QnKRiXP9ZRkYc"
]

def get_random_api_key():
    return random.choice(API_KEYS)

def llm(template):
    try:
        random_api_key = get_random_api_key()
        genai.configure(api_key=random_api_key)
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content(template)
        formatted_output = f"{response.text}\n"
        return formatted_output
    except Exception as e:
        llm(template)