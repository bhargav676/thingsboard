import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DeviceList from './components/DeviceList';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <h1>IoT Platform</h1>
        <Routes>
          <Route path="/" element={<DeviceList />} />
          <Route path="/dashboard/:deviceId" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 