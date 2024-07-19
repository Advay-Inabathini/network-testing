import React from 'react';

const TerminalComponent = ({ output }) => {
    return (
        <div className="bg-gray-800 p-6 mt-4 rounded-lg shadow-lg text-green-400">
            <pre>{output}</pre>
        </div>
    );
};

export default TerminalComponent;
