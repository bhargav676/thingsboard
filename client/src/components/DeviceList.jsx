import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DeviceList() {
  const [devices, setDevices] = useState([]);
  const [form, setForm] = useState({ deviceId: '', name: '', type: 'sensor' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:3000/api/devices');
      setDevices(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching devices:', err);
      setError(`Failed to fetch devices: ${err.response?.data?.details || err.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:3000/api/devices', form);
      fetchDevices();
      setForm({ deviceId: '', name: '', type: 'sensor' });
      setError('');
    } catch (err) {
      console.error('Error adding device:', err);
      setError(`Failed to add device: ${err.response?.data?.details || err.message}`);
    }
  };

  return (
    <div>
      <h2>Devices</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Device ID"
          value={form.deviceId}
          onChange={(e) => setForm({ ...form, deviceId: e.target.value })}
        />
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <button type="submit">Add Device</button>
      </form>
      <ul>
        {devices.length === 0 ? (
          <p>No devices found</p>
        ) : (
          devices.map((device) => (
            <li key={device.deviceId}>
              <a href={`/dashboard/${device.deviceId}`}>{device.name}</a>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default DeviceList;