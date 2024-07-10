import iperf3
import pexpect

iperf3test = pexpect.spawn('iperf3 -s')
iperf3test.expect('listening')
print(iperf3test.before.decode('utf-8'))
print(iperf3test.after.decode('utf-8'))