import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard() {
  const { deviceId } = useParams(); // Get deviceId from URL
  const [telemetry, setTelemetry] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTelemetry();
  }, [deviceId]);

  const fetchTelemetry = async () => {
    try {
      const res = await axios.get(`https://thingsboardserver.vercel.app/api/telemetry/${deviceId}`);
      setTelemetry(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching telemetry:', err);
      setError(`Failed to fetch telemetry: ${err.response?.data?.error || err.message}`);
    }
  };

  const chartData = {
    labels: telemetry.map(t => new Date(t.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: telemetry.map(t => t.data.temperature),
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h2>Dashboard for {deviceId}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {telemetry.length === 0 ? (
        <p>No telemetry data available</p>
      ) : (
        <>
          <Line data={chartData} />
          <h3>Telemetry Data</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Timestamp</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Temperature (°C)</th>
              </tr>
            </thead>
            <tbody>
              {telemetry.map((t, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {new Date(t.timestamp).toLocaleString()}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {t.data.temperature}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default Dashboard;