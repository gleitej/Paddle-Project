const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  craft: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  photo: {
    type: String
  }
});

Profile = mongoose.model('profile', ProfileSchema);
module.exports = Profile;
