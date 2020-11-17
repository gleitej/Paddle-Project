const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config');
const auth = require('../middleware/auth');
const userAuth = require('../middleware/userAuth');
const upload = require('../services/fileUpload');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const Profile = require('../models/Profile');

// @route   GET /api/profile/me
// @desc    Get user profile
// acess    registered user
router.get('/me', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'photo']
    );
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ err: err.message });
    console.log('Sever error');
  }
});

// @route   GET /api/profile/profiles
// @desc    Get all user profile
// @acess   Public
router.get('/profiles', async (req, res) => {
  try {
    let profiles = await Profile.find({}).populate('user', ['name', 'photo']);
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// @route   POST api/profile
// @desc    Create or update user profile
// @acess   user
router.post(
  '/',
  [
    [auth, userAuth],
    [
      check('craft', 'Craft is required').not().isEmpty(),

      check('bio', 'Bio is required').not().isEmpty(),

      check('level', 'Level is required').not().isEmpty(),
      check('state', 'State is requried').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { craft, bio, level, state } = req.body;
    const id = req.user.id;
    const profileObject = {
      craft,
      bio,
      level,
      state,
      user: id,
    };

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // update
        profile = await Profile.findOneAndUpdate(
          { user: id },
          { $set: profileObject },
          { new: true }
        );
        return res.json(profile);
      }

      // create
      profile = new Profile(profileObject);
      await profile.save();

      res.json(profile);
    } catch (err) {
      res.status(500).json({ err: err.message });
      console.log('Sever error');
    }
  }
);

// @route   POST api/profile/file-upload
// @desc    upload photo
// @acess   user

router.post(
  '/file-upload',
  [auth, userAuth],
  upload.single('photo'),
  async (req, res) => {
    try {
      const { location } = await req.file;

      // upload file to user
      let user = await User.findByIdAndUpdate(req.user.id, { photo: location });

      // find user's profile
      let profile = await Profile.findOne({
        user: req.user.id,
      }).populate('user', ['name', 'photo']);

      // return user's profile with photo uploaded
      return res.json(profile);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  }
);

// @route   GET /api/profile/:id
// @desc    Gets profile by id
// @acess   Public
router.get('/:user_id', async (req, res) => {
  try {
    let profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'photo']);
    if (!profile) {
      return res.json({ msg: 'profile not found' });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).res.json({ err: err.message });
  }
});

// @route   DELETE /api/profile/delete-profile
// @desc    Deletes user profile
// @acess   user
router.delete('/delete-profile', [auth, userAuth], async (req, res) => {
  try {
    // Remove user posts
    //   await Post.deleteMany({ user: req.user.id });
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
