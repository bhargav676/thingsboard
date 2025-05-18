import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DeviceList from './components/DeviceList';
import Dashboard from './components/Dashboard';
import Control from './components/Control';

function App() {
  return (
    <Router>
      <div>
        <h1>IoT Platform</h1>
        <Routes>
          <Route path="/" element={<DeviceList />} />
          <Route path="/dashboard/:deviceId" element={<Dashboard />} />
          <Route path="/control" element={<Control />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;