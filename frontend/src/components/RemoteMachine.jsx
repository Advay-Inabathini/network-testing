import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RemoteMachine = () => {
    const [connected, setConnected] = useState(false);
    const [terminalData, setTerminalData] = useState('');
    const [error, setError] = useState(null);

    const connect = async () => {
        try {
            const response = await axios.post('http://localhost:5000/connect', {
                // Request payload if any
            });
            console.log('Connected:', response.data);
            setConnected(true);
            fetchTerminalData(); // Fetch terminal data after connection
        } catch (err) {
            setError(err.message || 'Error connecting to the server');
            console.error('Error connecting:', err);
        }
    };

    const fetchTerminalData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/terminal-data');
            console.log('Terminal Data:', response.data);
            setTerminalData(response.data);
        } catch (err) {
            setError(err.message || 'Error fetching terminal data');
            console.error('Error fetching terminal data:', err);
        }
    };

    useEffect(() => {
        if (connected) {
            // Optionally, you can set an interval to periodically fetch terminal data
            const interval = setInterval(fetchTerminalData, 5000); // Fetch data every 5 seconds
            return () => clearInterval(interval);
        }
    }, [connected]);

    return (
        <div>
            {!connected && <button onClick={connect}>Connect</button>}
            {connected && <p>Connected to the remote machine.</p>}
            {error && <p>Error: {error}</p>}
            <div>
                <h2>Terminal Output</h2>
                <pre>{terminalData}</pre>
            </div>
        </div>
    );
};

export default RemoteMachine;
