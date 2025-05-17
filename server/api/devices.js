const express = require('express');
const router = express.Router();
const Device = require('../models/Device');

// Register a device
router.post('/', async (req, res) => {
  const { deviceId, name, type } = req.body;
  try {
    const device = new Device({ deviceId, name, type });
    await device.save();
    res.status(201).json(device);
  } catch (err) {
    res.status(500).json({ error: 'Error registering device' });
  }
});

// Get all devices
router.get('/', async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching devices' });
  }
});

module.exports = router;