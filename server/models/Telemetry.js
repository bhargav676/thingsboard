const mongoose = require('mongoose');

const TelemetrySchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  data: { type: Object, required: true }, // e.g., { temperature: 25 }
});

module.exports = mongoose.model('Telemetry', TelemetrySchema);