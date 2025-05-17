const express = require('express');
const router = express.Router();
const Telemetry = require('../models/Telemetry');

router.post('/', async (req, res) => {
  const { deviceId, temperature } = req.body;
  try {
    console.log('Received telemetry:', req.body); // Log request body
    const telemetry = new Telemetry({
      deviceId,
      data: { temperature },
    });
    await telemetry.save();
    res.status(201).json({ message: 'Telemetry saved' });
  } catch (err) {
    console.error('Error saving telemetry:', err); // Log detailed error
    res.status(500).json({ error: 'Error saving telemetry', details: err.message });
  }
});

router.get('/:deviceId', async (req, res) => {
  try {
    const telemetry = await Telemetry.find({ deviceId: req.params.deviceId })
      .sort({ timestamp: -1 })
      .limit(100);
    res.json(telemetry);
  } catch (err) {
    console.error('Error fetching telemetry:', err);
    res.status(500).json({ error: 'Error fetching telemetry' });
  }
});

module.exports = router;