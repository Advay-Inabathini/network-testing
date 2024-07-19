import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RemoteMachineComponent = ({ type, onConnect, onTerminalData }) => {
    const [ip, setIp] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [connected, setConnected] = useState(false);

    const connect = async () => {
        try {
            const response = await axios.post('http://localhost:5000/connect', {
                host: ip,
                username: username,
                password: password,
            });
            if (response.data.message === 'Connected') {
                setConnected(true);
                onConnect(ip);
                fetchTerminalData(); // Fetch terminal data after connection
            }
        } catch (error) {
            console.error('Error connecting:', error);
        }
    };

    const fetchTerminalData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/terminal-data', {
                params: { host: ip },
            });
            onTerminalData(response.data.data);
        } catch (error) {
            console.error('Error fetching terminal data:', error);
        }
    };

    useEffect(() => {
        if (connected) {
            const interval = setInterval(fetchTerminalData, 5000); // Fetch data every 5 seconds
            return () => clearInterval(interval);
        }
    }, [connected]);

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-white text-center mb-4">{type}</h2>
            <input
                type="text"
                placeholder="IP Address"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
            />
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
            />
            <button
                onClick={connect}
                disabled={connected}
                className={`w-full p-2 ${connected ? 'bg-green-600' : 'bg-green-500 hover:bg-green-600'} text-white rounded`}
            >
                {connected ? 'Connected' : 'Connect'}
            </button>
        </div>
    );
};

export default RemoteMachineComponent;
