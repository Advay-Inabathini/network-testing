from flask import Flask, request, jsonify
from flask_cors import CORS
import pexpect

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# Store SSH processes
connections = {}

def ssh_connect(host, username, password):
    try:
        child = pexpect.spawn(f'ssh {username}@{host}')
        child.expect("assword:")
        child.sendline(password)
        child.expect([r'\$', r'#', r'%'])
        return child
    except Exception as e:
        print(f"Error connecting to SSH: {e}")
        return None

def send_command(process, command):
    try:
        process.expect(r".+")
        process.sendline(command)
        process.expect([r'\$', r'#', r'%'])
        return process.before.decode('utf-8')
    except Exception as e:
        print(f"Error sending command: {e}")
        return None

@app.route('/connect', methods=['POST'])
def connect():
    try:
        data = request.json
        host = data.get('host')
        username = data.get('username')
        password = data.get('password')
        connection = ssh_connect(host, username, password)
        if connection:
            connections[host] = connection
            return jsonify({"message": "Connected", "host": host})
        else:
            return jsonify({"error": "Failed to connect to SSH"}), 500
    except Exception as e:
        print(f"Error in /connect route: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/command', methods=['POST'])
def command():
    try:
        data = request.json
        host = data.get('host')
        command = data.get('command')
        connection = connections.get(host)
        if not connection:
            return jsonify({"error": "No connection found for host"}), 400
        output = send_command(connection, command)
        if output:
            return jsonify({"output": output})
        else:
            return jsonify({"error": "Failed to execute command"}), 500
    except Exception as e:
        print(f"Error in /command route: {e}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True)
