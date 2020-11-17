const mongoose = require('mongoose');

const KeySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
});

Key = mongoose.model('Key', KeySchema);
module.exports = Key;
