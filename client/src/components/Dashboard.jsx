import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard({ match }) {
  const deviceId = match.params.deviceId;
  const [telemetry, setTelemetry] = useState([]);

  useEffect(() => {
    fetchTelemetry();
  }, [deviceId]);

  const fetchTelemetry = async () => {
    const res = await axios.get(`http://thingsboardserver.vercel.app/api/telemetry/${deviceId}`);
    setTelemetry(res.data);
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
      <Line data={chartData} />
    </div>
  );
}

export default Dashboard;