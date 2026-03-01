import {useState} from 'react';
import {WhatsappEditor} from './components/WhatsappEditor';

export default function App() {
    const [message, setMessage] = useState('');
    const [isDark, setIsDark] = useState(false);

    const loadSavedMessage = () => {
        setMessage("Welcome back! This is a *bold* test and this is _italic_.\n\nHere is some inline code: ```console.log('Hello');```");
    };
    return (
        <div style={{ /* ... keep your existing container styles ... */ padding: '20px'}}>
            <h2>WhatsApp Editor Test</h2>

            <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
                <button onClick={() => setIsDark(!isDark)} style={{padding: '8px 12px', cursor: 'pointer'}}>
                    Toggle {isDark ? 'Light' : 'Dark'} Mode
                </button>
                <button onClick={loadSavedMessage} style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    backgroundColor: '#00a884',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px'
                }}>
                    Load Database Message
                </button>
            </div>

            <WhatsappEditor
                theme={isDark ? 'dark' : 'light'}
                value={message}             // <-- Passing the state IN
                onChange={(val) => setMessage(val)} // <-- Extracting the state OUT
                placeholder="Type a message..."
            />

            <div style={{
                marginTop: '20px',
                padding: '10px',
                background: isDark ? '#2a3942' : '#e1e1e1',
                borderRadius: '5px'
            }}>
                <strong>Raw Output:</strong>
                <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
          {message || "No output yet..."}
        </pre>
            </div>
        </div>
    );
}