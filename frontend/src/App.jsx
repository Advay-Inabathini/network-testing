import React, { useState } from 'react';
import RemoteMachineComponent from './components/RemoteMachine';
import TerminalComponent from './components/Terminal';
import axios from 'axios';
import stripAnsi from 'strip-ansi';

const App = () => {
    const [serverOutput, setServerOutput] = useState('');
    const [clientOutput, setClientOutput] = useState('');
    const [serverIp, setServerIp] = useState('');
    const [clientIp, setClientIp] = useState('');

    const handleServerConnect = (ip) => {
        setServerIp(ip);
    };

    const handleClientConnect = (ip) => {
        setClientIp(ip);
    };

    const handleServerTerminalData = (data) => {
        setServerOutput(stripAnsi(data));
    };

    const handleClientTerminalData = (data) => {
        setClientOutput(stripAnsi(data));
    };

    const generateTraffic = async () => {
        try {
            console.log('inside the generateTraffic function');

            // Ensure clean state by killing any previous iPerf3 processes
            console.log('killing previous server iperf3');
            await axios.post('http://localhost:5000/command', {
                host: serverIp,
                command: 'pkill -f iperf3',
            });

            console.log('killing previous client iperf3');
            await axios.post('http://localhost:5000/command', {
                host: clientIp,
                command: 'pkill -f iperf3',
            });

            // Start iPerf3 server on the server machine
            console.log('starting iperf3 server');
            const serverResponse = await axios.post('http://localhost:5000/command', {
                host: serverIp,
                command: 'iperf3 -s -p 5500',
            });
            setServerOutput(stripAnsi(serverResponse.data.output));

            // Start iPerf3 client on the client machine
            console.log('starting iperf3 client');
            const clientResponse = await axios.post('http://localhost:5000/command', {
                host: clientIp,
                command: `iperf3 -c ${serverIp} -p 5500`,
            });
            setClientOutput(stripAnsi(clientResponse.data.output));
        } catch (error) {
            console.error('Error generating traffic:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-8">iPerf3 Traffic Generator</h1>
            <div className="flex justify-around w-full max-w-6xl">
                <div className="flex flex-col items-center">
                    <RemoteMachineComponent type="Client" onConnect={handleClientConnect} onTerminalData={handleClientTerminalData} />
                    <TerminalComponent output={clientOutput} />
                </div>
                <div className="flex flex-col items-center">
                    <RemoteMachineComponent type="Server" onConnect={handleServerConnect} onTerminalData={handleServerTerminalData} />
                    <TerminalComponent output={serverOutput} />
                </div>
            </div>
            <button
                className="mt-8 bg-green-500 p-4 rounded-lg disabled:opacity-50"
                onClick={generateTraffic}
                disabled={!serverIp || !clientIp}
            >
                Generate Traffic
            </button>
        </div>
    );
};

export default App;
