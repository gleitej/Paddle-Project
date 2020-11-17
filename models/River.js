const mongoose = require('mongoose');

riverSchema = new mongoose.Schema({
  published: { type: Boolean, default: false },
  river: { type: String, isRequired: true },
  info: { type: String, isRequired: true },
  classs: { type: String, isRequired: true },
  state: { type: String, isRequired: true },
  section: { type: String, isRequired: true },
  photos: [],
  gMap: [],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  name: { type: String, isRequired: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CommentRiver' }],
  upVote: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    },
  ],
  downVote: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now(),
  },
});

River = mongoose.model('river', riverSchema);
module.exports = River;
