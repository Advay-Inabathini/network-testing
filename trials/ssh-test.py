import pexpect
import time

def send_command(process, command):
    process.expect(r".+")
    process.sendline(command)
    process.expect([r'\$', r'#', r'%'])
    print(process.before.decode('utf-8'))

def ssh_connect(host, username, password):
    print(f'connecting to {host} as {username}...')
    child = pexpect.spawn(f'ssh {username}@{host}')
    child.expect("assword:")
    child.sendline(password)
    child.expect([r'\$', r'#', r'%'])
    print(child.before.decode('utf-8'))
    # clear buffer
    # child.expect(r".+")
    return child

chilled = ssh_connect('ip address', 'username', 'password')

# chilled.expect([r'\$', r'#', r'%'])
# print("Getting ls output...")
# chilled.sendline('ls')
# chilled.expect([r'\$', r'#', r'%'])
# print(chilled.before.decode('utf-8'))
# print("Done")

# chilled.expect(r".+")
# chilled.sendline('pwd')
# chilled.expect([r'\$', r'#', r'%'])
# print(chilled.before.decode('utf-8'))

send_command(chilled, 'pwd')
send_command(chilled, 'ls')
send_command(chilled, 'echo okay cool')