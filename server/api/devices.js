const express = require('express');
const router = express.Router();
const Device = require('../models/Device');

router.post('/', async (req, res) => {
  const { deviceId, name, type } = req.body;
  try {
    console.log('POST /api/devices received:', req.body);
    if (!deviceId || !name) {
      return res.status(400).json({ error: 'deviceId and name are required' });
    }
    const device = new Device({ deviceId, name, type: type || 'sensor' });
    await device.save();
    console.log('Device saved:', device);
    res.status(201).json(device);
  } catch (err) {
    console.error('Error saving device:', err);
    res.status(500).json({ error: 'Error saving device', details: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    console.log('GET /api/devices called');
    const devices = await Device.find();
    console.log('Devices fetched:', devices);
    res.json(devices);
  } catch (err) {
    console.error('Error fetching devices:', err);
    res.status(500).json({ error: 'Error fetching devices', details: err.message });
  }
});

module.exports = router;