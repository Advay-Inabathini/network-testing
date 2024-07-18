import React, { useState } from 'react';
import RemoteMachineComponent from './components/RemoteMachine';
import TerminalComponent from './components/Terminal';
import axios from 'axios';

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
        setServerOutput(data);
    };

    const handleClientTerminalData = (data) => {
        setClientOutput(data);
    };

    const generateTraffic = async () => {
        try {
            console.log('inside the generateTraffic function')
            const serverResponse = await axios.post('http://localhost:5000/command', {
                host: serverIp,
                command: 'iperf3 -s -p 5500',
            });
            setServerOutput(serverResponse.data.output);

            const clientResponse = await axios.post('http://localhost:5000/command', {
                host: clientIp,
                command: `iperf3 -c ${serverIp} -p 5500`,
            });
            setClientOutput(clientResponse.data.output);
        } catch (error) {
            console.error('Error generating traffic:', error);
        }
    };

    return (
        <div>
            <h1>iPerf3 Traffic Generator</h1>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div>
                    <RemoteMachineComponent type="Client" onConnect={handleClientConnect} onTerminalData={handleClientTerminalData} />
                    <TerminalComponent output={clientOutput} />
                </div>
                <div>
                    <RemoteMachineComponent type="Server" onConnect={handleServerConnect} onTerminalData={handleServerTerminalData} />
                    <TerminalComponent output={serverOutput} />
                </div>
            </div>
            <button onClick={generateTraffic} disabled={!serverIp || !clientIp}>
                Generate Traffic
            </button>
        </div>
    );
};

export default App;
