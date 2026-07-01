const { Schema, model } = require('mongoose');

const monitorsSchema = new Schema({
  name: { type: String },
  interval: {
    type: Number,
    required: true,
    default: 60,
  },
  url: { type: String, required: true },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  alertsEnabled: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = model('Monitors', monitorsSchema);
