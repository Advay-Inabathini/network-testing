import React from 'react';

const TerminalComponent = ({ output }) => {
    return (
        <div>
            <pre>{output}</pre>
        </div>
    );
};

export default TerminalComponent;
