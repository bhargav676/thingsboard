const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, default: 'sensor' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Device', DeviceSchema);