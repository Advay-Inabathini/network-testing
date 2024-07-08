import pexpect

def ssh_connect(host, username, password):
    print(f'connecting to {host} as {username}...')
    child = pexpect.spawn(f'ssh {username}@{host}')
    child.expect("password:")
    child.sendline(password)
    
    print(child.before.decode('utf-8'))
    return child

chilled = ssh_connect('192.168.0.123', 'htpc', 'htpc')
chilled.sendline('ls')
print(chilled.before.decode('utf-8'))