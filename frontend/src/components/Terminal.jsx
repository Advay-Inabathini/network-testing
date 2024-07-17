import React from 'react';

const TerminalComponent = ({ output }) => {
    return (
        <div style={{ backgroundColor: 'black', color: 'green', padding: '10px', minHeight: '200px' }}>
            <pre>{output}</pre>
        </div>
    );
};

export default TerminalComponent;
