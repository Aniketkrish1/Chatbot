import os
from flask import Flask, request, jsonify, send_from_directory
from PIL import Image
from io import BytesIO
import base64
import requests
import json
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from IPython.display import Markdown, clear_output, display
# Placeholder for your ChatGoogleGenerativeAI import
# from your_model_module import ChatGoogleGenerativeAI, HumanMessage

os.environ['GOOGLE_API_KEY'] = 'AIzaSyAH45HFgQwDEl5Pr7W04YHhkBCmGj-7c3M'

app = Flask(__name__, static_url_path='', static_folder='')

def con_img(img):
    if img.startswith("http"):
        img = Image.open(BytesIO(requests.get(img).content))
    else:
        img = Image.open(img)
    return img

def image_url(img):
    buffered = BytesIO()
    img.save(buffered, format="JPEG")
    return 'data:image/jpeg;base64,' + base64.b64encode(buffered.getvalue()).decode("utf-8")

@app.route('/')
def serve_index():
    return send_from_directory('', 'index.html')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    prompt = data.get('prompt')
    img_url = data.get('img_url')
    
    if img_url:
        img = con_img(img_url)
        img_data = image_url(img)
        message = HumanMessage(content=[
            { 'type': 'text', 'text': prompt },
            { 'type': 'image_url', 'image_url': img_data }
        ])
    else:
        message = HumanMessage(content=[
            { 'type': 'text', 'text': prompt }
        ])
    
    model = ChatGoogleGenerativeAI(model="gemini-1.5-flash")
    response = model.stream([message])

    buffer = []
    for chunk in response:
        buffer.append(chunk.content)
    
    return jsonify({'content': ''.join(buffer)})

if __name__ == '__main__':
    app.run(debug=True)
