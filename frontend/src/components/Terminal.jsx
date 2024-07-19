import React from 'react';

const TerminalComponent = ({ output }) => {
    return (
        <div className="bg-gray-800 p-4 mt-4 rounded-lg shadow-lg w-full max-w-lg h-64 overflow-auto">
            <pre className="text-green-400 whitespace-pre-wrap text-xs">{output}</pre>
        </div>
    );
};

export default TerminalComponent;
