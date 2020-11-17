const mongoose = require('mongoose');
const config = require('config');
const bcrypt = require('bcryptjs');

const guest = config.get('guest');
const applicationNoSubmit = config.get('applicationNoSubmit');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  photo: { type: String, default: null },
  role: { type: String, default: guest },
  adminApp: { type: String, default: applicationNoSubmit },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

UserSchema.pre('save', function (next) {
  const user = this;
  const SALT_FACTOR = 10;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    cb(null, isMatch);
  });
};

User = mongoose.model('user', UserSchema);
module.exports = User;
