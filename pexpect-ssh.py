import pexpect

def ssh_connect(host, username, password):
    print(f'connecting to {host} as {username}...')
    child = pexpect.spawn(f'ssh {username}@{host}')
    child.expect("assword:")
    child.sendline(password)
    child.expect([r'\$', r'#', r'%'])
    print(child.before.decode('utf-8'))
    return child

def send_command(process, command):
    process.expect(r".+")
    process.sendline(command)
    process.expect([r'\$', r'#', r'%'])
    print(process.before.decode('utf-8'))


server_ip = input("enter server device ip address: ")
server_username = input("enter server device username: ")
server_password = input("enter server device password: ")

client_ip = input("enter client device ip address: ")
client_username = input("enter client device username: ")
client_password = input("enter client device password: ")


server_process = ssh_connect(server_ip, server_username, server_password)
client_process = ssh_connect(client_ip, client_username, client_password)

send_command(server_process, 'ls')
send_command(client_process,'ls')

send_command(server_process, 'echo server ready')
send_command(client_process,'echo client ready')

send_command(server_process, 'iperf3 -s -p 5500')
send_command(client_process, f'iperf3 -c {server_ip} -p 5500')
