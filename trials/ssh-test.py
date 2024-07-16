import pexpect
import time

def ssh_connect(host, username, password):
    print(f'connecting to {host} as {username}...')
    child = pexpect.spawn(f'ssh {username}@{host}')
    child.expect("assword:")
    child.sendline(password)
    child.expect([r'\$', r'#', r'%'])
    print(child.before.decode('utf-8'))
    # clear buffer
    child.expect(r".+")
    
    return child

# chilled.expect([r'\$', r'#', r'%'])
print("Getting ls output...")
chilled.sendline('ls')
chilled.expect([r'\$', r'#', r'%'])
print(chilled.before.decode('utf-8'))
print("Done")

chilled.expect(r".+")
chilled.sendline('pwd')
chilled.expect([r'\$', r'#', r'%'])
print(chilled.before.decode('utf-8'))