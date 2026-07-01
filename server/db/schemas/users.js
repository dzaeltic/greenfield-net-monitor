const { Schema, model } = require('mongoose');

const usersSchema = new Schema({
  googleId: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true },
}, { timestamps: true });

module.exports = model('Users', usersSchema);
