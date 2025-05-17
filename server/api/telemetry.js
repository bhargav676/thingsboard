const express = require('express');
const router = express.Router();
const Telemetry = require('../models/Telemetry');

// Receive telemetry via HTTP
router.post('/', async (req, res) => {
  const { deviceId, temperature } = req.body;
  try {
    const telemetry = new Telemetry({
      deviceId,
      data: { temperature },
    });
    await telemetry.save();
    res.status(201).json({ message: 'Telemetry saved' });
  } catch (err) {
    res.status(500).json({ error: 'Error saving telemetry' });
  }
});

// Get telemetry for a device
router.get('/:deviceId', async (req, res) => {
  try {
    const telemetry = await Telemetry.find({ deviceId: req.params.deviceId })
      .sort({ timestamp: -1 })
      .limit(100);
    res.json(telemetry);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching telemetry' });
  }
});

module.exports = router;