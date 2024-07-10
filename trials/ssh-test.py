import pexpect

def ssh_connect(host, username, password):
    print(f'connecting to {host} as {username}...')
    child = pexpect.spawn(f'ssh {username}@{host}')
    child.expect("password:")
    child.sendline(password)
    child.expect(pexpect.EOF)
    print(child.before.decode('utf-8'))
    return child

chilled = ssh_connect('192.168.0.123', 'htpc', 'htpc')
chilled.sendline('ls')
chilled.expect(pexpect.EOF)
print(chilled.before.decode('utf-8'))