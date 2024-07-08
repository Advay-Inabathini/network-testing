import iperf3
import argparse
import socket

def get_ip_address():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # doesn't even have to be reachable
        s.connect(('10.254.254.254', 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = '127.0.0.1'
    finally:
        s.close()
    return IP

def start_server():
    server = iperf3.Server()
    
    # Bind to an available port
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('', 0))
        server.port = s.getsockname()[1]
    
    ip_address = get_ip_address()
    print(f'Server is live on {ip_address}:{server.port}')
    
    while True:
        result = server.run()
        if result.error:
            print(f'Error: {result.error}')
        else:
            print(f'Test completed:\n{result.json}')

def start_client(server_ip, server_port):
    client = iperf3.Client()
    client.server_hostname = server_ip
    client.port = server_port
    client.duration = 10  # duration of the test in seconds
    
    print(f'Starting client to connect to {server_ip}:{server_port}')
    result = client.run()
    
    if result.error:
        print(f'Error: {result.error}')
    else:
        print(f'Test completed:\n{result.json}')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='iperf3 Network Testing Tool')
    parser.add_argument('mode', choices=['server', 'client'], help='Start as server or client')
    parser.add_argument('--server-ip', type=str, help='IP address of the server (required for client mode)')
    parser.add_argument('--port', type=int, help='Port number to use (default: assigned automatically for server)')
    
    args = parser.parse_args()
    
    if args.mode == 'server':
        start_server()
    elif args.mode == 'client':
        if not args.server_ip or not args.port:
            print('Server IP address and port are required in client mode.')
        else:
            start_client(args.server_ip, args.port)
