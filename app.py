import json
import os
from datetime import datetime
from flask import Flask, jsonify, make_response, request

app = Flask(__name__)

events = []

@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/api/getdata', methods=['GET'])
def get_events():
    response = make_response(
        jsonify(events),
        200,
    )
    response.headers["Content-Type"] = "application/json"
    return response


@app.route('/api/getdata/last', methods=['GET'])
def get_latest_event():
    response = make_response(
        jsonify(events.pop()),
        200,
    )
    response.headers["Content-Type"] = "application/json"
    return response


@app.route('/api/startprocess', methods=['POST'])
def start_process_event():
    cmd = os.system("cmd /c python C:\\Users\\Fujitsu\\Documents\\Arduino\\Security-Station\\recognition.py")
    response = make_response(
        jsonify(
            {"status": "process started", "exit status": cmd}
        ),
        201,
    )
    response.headers["Content-Type"] = "application/json"
    return response


@app.route('/api/postdata', methods=['POST'])
def post_event():
    event = json.loads(request.data)
    print(event)
    events.append(event)
    response = make_response(
        jsonify(
            {"status": "created", "event": event}
        ),
        201,
    )
    response.headers["Content-Type"] = "application/json"
    return response


if __name__ == '__main__':
    app.run(host='192.168.1.3', port=8080, debug=True)
