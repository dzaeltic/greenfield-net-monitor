const { Schema, model } = require('mongoose');

// { id: profile.id ,
// displayName: profile.displayName,
// emails: profile.emails[0].value }

const usersSchema = new Schema({
  googleId: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true },
}, { timestamps: true });

module.exports = model('Users', usersSchema);
