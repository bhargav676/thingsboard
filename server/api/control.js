const express = require('express');
const router = express.Router();
const Control = require('../models/Control');

router.post('/', async (req, res) => {
  const { deviceId, ledState } = req.body;
  if (!deviceId || !['ON', 'OFF'].includes(ledState)) {
    return res.status(400).json({ error: 'Invalid deviceId or ledState' });
  }
  try {
    console.log('POST /api/control received:', req.body);
    const control = new Control({ deviceId, ledState });
    await control.save();
    res.status(201).json({ message: `LED set to ${ledState}` });
  } catch (err) {
    console.error('Error saving control:', err);
    res.status(500).json({ error: 'Error saving control', details: err.message });
  }
});

router.get('/:deviceId', async (req, res) => {
  try {
    console.log('GET /api/control/:deviceId called:', req.params.deviceId);
    const control = await Control.findOne({ deviceId: req.params.deviceId })
      .sort({ timestamp: -1 });
    if (!control) {
      return res.status(404).json({ error: 'No control state found' });
    }
    res.json({ ledState: control.ledState });
  } catch (err) {
    console.error('Error fetching control:', err);
    res.status(500).json({ error: 'Error fetching control', details: err.message });
  }
});

module.exports = router;