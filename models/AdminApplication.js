const mongoose = require('mongoose');
const config = require('config');

const applicationNoSubmit = config.get('applicationNoSubmit');
adminApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  status: { type: String, default: applicationNoSubmit },
  why: { type: String, isRequired: true },
  about: { type: String, isRequired: true },
  craft: { type: String, isRequired: true },
  experience: { type: String, isRequired: true },
  favoriteRiver: { type: String, isRequired: true },
});

AdminApplication = mongoose.model('AdminApplication', adminApplicationSchema);
module.exports = AdminApplication;
