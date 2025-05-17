const express = require('express');
const mongoose = require('mongoose');
const mqtt = require('mqtt');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));


const mqttClient = mqtt.connect(process.env.MQTT_BROKER);
mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
  mqttClient.subscribe(process.env.MQTT_TOPIC, err => {
    if (err) console.error('MQTT subscribe error:', err);
  });
});

mqttClient.on('message', async (topic, message) => {
  try {
    const data = JSON.parse(message.toString()); 
    const telemetry = new (require('./models/Telemetry'))({
      deviceId: data.deviceId,
      data: { temperature: data.temperature },
    });
    await telemetry.save();
    console.log('Telemetry saved:', data);
  } catch (err) {
    console.error('MQTT message error:', err);
  } 
}); 

// API Routes
app.use('/api/devices', require('./api/devices'));
app.use('/api/telemetry', require('./api/telemetry'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));