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
            console.log('inside the generateTraffic function')
            const serverResponse = await axios.post('http://localhost:5000/command', {
                host: serverIp,
                command: 'iperf3 -s -p 5500',
            });
            setServerOutput(stripAnsi(serverResponse.data.output));

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
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
            <h1 className="text-3xl font-bold mt-8">iPerf3 Traffic Generator</h1>
            <div className="flex justify-around mt-8 w-full max-w-6xl">
                <div className="w-1/2 px-4">
                    <RemoteMachineComponent type="Client" onConnect={handleClientConnect} onTerminalData={handleClientTerminalData} />
                    <TerminalComponent output={clientOutput} />
                </div>
                <div className="w-1/2 px-4">
                    <RemoteMachineComponent type="Server" onConnect={handleServerConnect} onTerminalData={handleServerTerminalData} />
                    <TerminalComponent output={serverOutput} />
                </div>
            </div>
            <button
                onClick={generateTraffic}
                disabled={!serverIp || !clientIp}
                className="mt-8 bg-green-500 hover:bg-green-600 text-white p-4 rounded"
            >
                Generate Traffic
            </button>
        </div>
    );
};

export default App;
