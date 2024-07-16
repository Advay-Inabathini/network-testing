import iperf3
import pexpect

def ssh_connect(host, username, password):
    print(f'connecting to {host} as {username}...')
    child = pexpect.spawn(f'ssh {username}@{host}')
    child.expect("assword:")
    child.sendline(password)
    child.expect([r'\$', r'#', r'%'])
    print(child.before.decode('utf-8'))
    return child

server_ip = input("enter server device ip address: ")
server_username = input("enter server device username: ")
server_password = input("enter server device password: ")

client_ip = input("enter client device ip address: ")
client_username = input("enter client device username: ")
client_password = input("enter client device password: ")

server_process = ssh_connect(server_ip, server_username, server_password)
client_process = ssh_connect(client_ip, client_username, client_password)