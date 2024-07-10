import iperf3
import pexpect

def ssh_connect(host, username, password):
    print(f'connecting to {host} as {username}...')
    child = pexpect.spawn(f'ssh {username}@{host}')
    child.expect("password:")
    child.sendline(password)
    child.expect(pexpect.EOF)
    print(child.before.decode('utf-8'))
    return child

server_ip = input("enter server device ip address: ")
server_username = input("enter server device username: ")
server_password = input("enter server device password: ")

client_ip = input("enter client device ip address: ")
client_username = input("enter client device username: ")
client_password = input("enter client device password: ")