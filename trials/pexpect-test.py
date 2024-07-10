import pexpect

child = pexpect.spawn('ls')
child.expect(pexpect.EOF)
print(child.before.decode('utf-8'))

