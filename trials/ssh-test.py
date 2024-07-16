import pexpect

def ssh_connect(host, username, password):
    print(f'connecting to {host} as {username}...')
    child = pexpect.spawn(f'ssh {username}@{host}')
    child.expect("assword:")
    child.sendline(password)
    child.expect([r'\$', r'#', r'%'])
    print(child.before.decode('utf-8'))
    return child

chilled = ssh_connect('ip', 'username', 'password')
chilled.sendline('ls')
chilled.expect([r'\$', r'#'])
print(chilled.before.decode('utf-8'))