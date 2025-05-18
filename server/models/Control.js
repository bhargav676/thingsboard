const mongoose = require('mongoose');

const controlSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  ledState: { type: String, required: true, enum: ['ON', 'OFF'] },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Control', controlSchema);