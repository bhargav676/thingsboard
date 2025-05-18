import React, { useState } from 'react';
import axios from 'axios';

function Control() {
  const [deviceId] = useState('123'); // Fixed for your device
  const [error, setError] = useState('');
  const [status, setStatus] = useState('Unknown');

  const sendControl = async (ledState) => {
    try {
      console.log(`Sending ${ledState} to device ${deviceId}`);
      const response = await axios.post(
        'https://thingsboardserver.vercel.app/api/control',
        { deviceId, ledState },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('Control response:', response.data);
      setStatus(ledState);
      setError('');
    } catch (err) {
      console.error('Error sending control:', err);
      setError(`Failed to send ${ledState}: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div>
      <h2>LED Control for Device {deviceId}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Current Status: {status}</p>
      <button
        onClick={() => sendControl('ON')}
        style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white' }}
      >
        ON
      </button>
      <button
        onClick={() => sendControl('OFF')}
        style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white' }}
      >
        OFF
      </button>
    </div>
  );
}

export default Control;