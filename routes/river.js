const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config');
const auth = require('../middleware/auth');
const userAuth = require('../middleware/userAuth');
const adminAuth = require('../middleware/adminAuth');

const { check, validationResult } = require('express-validator');
// file upload
const upload = require('../services/fileUpload');
// models
const Post = require('../models/Post');
const User = require('../models/User');
const River = require('../models/River');
const Profile = require('../models/Profile');
const CommentRiver = require('../models/CommentRiver');

// @route   POST api/river/create-river
// @desc    create river
// @acess   admin
router.post(
  '/create-river',
  auth,
  adminAuth,
  [
    check('river', 'River is required').not().isEmpty(),
    check('info', 'Info is required').not().isEmpty(),
    check('section', 'Section is required').not().isEmpty(),
    check('classs', 'Class is required').not().isEmpty(),
    check('state', 'State is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userId = req.user.id;

    const { section, river, info, classs, state, _id } = req.body;

    const userObject = {
      section,
      river,
      info,
      classs,
      state,
      user: userId,
    };

    try {
      let rivToUpdate = await River.findOne({ _id: _id });
      if (rivToUpdate) {
        // update
        rivToUpdate = await River.findOneAndUpdate(
          { _id },
          { $set: userObject },
          { new: true }
        );
        return res.json(rivToUpdate);
      }

      // create
      let riv = await River.create(userObject);
      riv = await riv.populate('user', ['name', 'photo']).execPopulate();

      res.json(riv);
    } catch (err) {
      res.status(500).json({ msg: err.message });
      console.log(err.message);
    }
  }
);

// @route   PUT api/river/update/:id
// @desc    Get all rivers
// @acess   user
router.put('/update/:id', [auth, userAuth], async (req, res) => {
  const { id } = req.body;
  const { river, info, classs, state, photos, gMap, name } = req.body;
  const riverObject = {
    river,
    info,
    classs,
    state,
    photos,
    gMap,
    name,
    date: Date.now(),
  };
  try {
    const rivU = await River.findById(id);
    if (rivU) {
      rivN = await River.findByIdAndUpdate(
        id,
        { $set: riverObject },
        { new: true }
      );
      return res.json(rivU);
    }
    res.json({ msg: 'No river found' }).status(404);
  } catch (err) {
    res.status(500).json({ msg: err.message });
    console.log(err.message);
  }
});

// @route   GET api/river/get-all
// @desc    Get all rivers
// @acess   Public
router.get('/get-all', async (req, res) => {
  try {
    const rivers = await River.find({ published: true }).populate('user', [
      'name',
      'photo',
    ]);

    res.json(rivers);
  } catch (err) {
    res.status(500).json({ msg: err.message });
    console.log(err.message);
  }
});

// @route   POST api/river/file-upload/:id
// @desc    Upload file to river found by river id
// @acess   user
router.post(
  '/file-upload/:id',
  [auth, userAuth],
  upload.array('photos'),
  async (req, res) => {
    // get river id
    const id = req.params.id;

    try {
      // get location of files

      const files = await req.files;
      const fileLocations = await files.map((file) => file.location);
      // find and add photos to river
      const rivers = await River.findByIdAndUpdate(id, {
        photos: fileLocations,
        date: Date.now(),
      });

      const updatedRiver = await River.findById(id);

      res.json(updatedRiver);
    } catch (err) {
      res.status(500).json({ msg: err.message });
      console.log(err.message);
    }
  }
);

// @route   DELETE api/river/:id
// @desc    Upload file to river found by id
// @acess   user
router.delete('/:id', [auth, userAuth], async (req, res) => {
  try {
    const river = await River.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Post removed' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
    console.log(err.message);
  }
});

// @route   GET api/river/user/:id
// @desc    get all rivers created by specific user
// @acess   Public
router.get('/user/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const rivers = await River.find({ user: id });

    // this does not work... come up with better 'not found' solution
    if (!rivers) {
      return res.json({ msg: 'No rivers found' });
    }
    res.json(rivers);
  } catch (err) {
    res.status(500).json({ msg: err.message });
    console.log(err);
  }
});

// @route   GET api/river/get-one/:id
// @desc    get river by id
// @acess   Public
router.get('/get-one/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const river = await River.findById(id).populate('user', 'name');

    // populate river comments
    await river
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: '-password -email -role -adminApp -date -__v',
        },
      })
      .execPopulate();
    if (!river) {
      return res.json({ msg: 'No river found' });
    }

    res.json(river);
  } catch (err) {
    res.status(500).json({ msg: err.message });
    console.log(err);
  }
});

// @route   PUT api/river/update-photos/:id
// @desc    add photo to array
// @acess   user
router.put(
  '/update-photos/:id',
  [auth, userAuth],
  upload.array('photos'),
  async (req, res) => {
    const id = req.params.id;

    try {
      let riv = await River.findById(id);
      const newFiles = await req.files;

      // if no river found
      if (!riv) {
        return res.json({ msg: 'No river found' });
      }

      let existingPhotos = riv.photos;

      for (let i = 0; i < newFiles.length; i++) {
        existingPhotos.push(newFiles[i].location);
      }

      const nRiv = await River.findOneAndUpdate(
        { _id: id },
        { photos: existingPhotos, date: Date.now() },
        { new: true }
      );
      res.json(nRiv);
    } catch (err) {
      res.status(500).json({ msg: err.message });
      console.log(err);
    }
  }
);

// @route   DELETE api/river/delete-photo/:riverId/:index
// @desc    Delete spefific photo from array
// @acess   user

router.delete(
  '/delete-photo/:riverId/:index',
  [auth, userAuth],
  async (req, res) => {
    const riverId = req.params.riverId;
    const index = req.params.index;

    try {
      const riv = await River.findById(riverId);
      // no river found
      if (!riv) {
        return res.json({ msg: 'River could not be found' });
      }

      // update
      let choosenPhoto = riv.photos[index];

      let updatedArray = riv.photos.filter((url) => url !== choosenPhoto);

      const updatedRiver = await River.findOneAndUpdate(
        { _id: riverId },
        { photos: updatedArray, date: Date.now() },
        { new: true }
      );

      res.json(updatedRiver);
    } catch (err) {
      res.status(500).json({ msg: err.message });
      console.log(err);
    }
  }
);

// @route   POST api/river/create-google-maps/:id
// @desc    Add google map to a river found by :id
// @acess   user
router.post('/create-google-maps/:id', [auth, userAuth], async (req, res) => {
  const id = req.params.id;

  // this might not be right
  const data = req.body;
  try {
    let riverWithMapData = await River.findByIdAndUpdate(
      id,
      { gMap: data, date: Date.now() },
      { new: true }
    );

    res.json(riverWithMapData);
  } catch (err) {
    res.status(500).json({ msg: err.message });
    console.log(err);
  }
});

// @route   PUT api/river/comment/:id_river
// @desc    Add comment to river found by id
// @acess   Private
router.put(
  '/comment/:id_river',
  [auth, userAuth],
  [check('text', 'Text is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // find river
      const river = await River.findById(req.params.id_river).populate({
        path: 'comments',
      });

      // find user
      const user = await User.findById(req.user.id).select('-password');

      // create RiverComment data
      const newComment = {
        text: req.body.text,
        user: req.user.id,
      };

      // add newComment to database
      const savedRiverComment = await new CommentRiver(newComment).save();

      // const data = { CommentRiver: savedRiverComment.id };
      river.comments.unshift(savedRiverComment.id);

      // save
      await river.save();

      // populate
      await river
        .populate({
          path: 'comments',
          populate: {
            path: 'user',
            select: '-password -email -role -adminApp -date -__v',
          },
        })
        .execPopulate();

      res.json(river.comments);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   DELETE api/river/comment/:id_river/:id_comment
// @desc    delete a comment found by id
// @acess   users
router.delete(
  '/comment/:id_river/:id_comment',
  [auth, userAuth],
  async (req, res) => {
    try {
      // find river by id
      const river = await River.findById(req.params.id_river);

      await river
        .populate({
          path: 'comments',
        })
        .execPopulate();

      // pull out comment
      const comment = river.comments.find(
        (comment) => comment.id === req.params.id_comment
      );

      // make sure comment exists
      if (!comment) {
        return res.status(404).json({ msg: 'Comment does not exist' });
      }

      // check user
      if (req.user.id !== comment.user.toString()) {
        res.status(401).json({ msg: 'User is not authorized' });
      }

      // remove id comment from river
      const removeIndex = river.comments
        .map((comment) => comment.id.toString())
        .indexOf(req.params.id_comment);

      river.comments.splice(removeIndex, 1);

      await river.save();
      await river
        .populate({
          path: 'comments',
          populate: {
            path: 'user',
            select: '-password -email -role -adminApp -date',
          },
        })
        .execPopulate();

      // remove comment from comment document from database
      await CommentRiver.findByIdAndDelete(req.params.id_comment);

      return res.json(river.comments);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   PUT api/river/like/:id_comment
// @desc    Likes a comment
// @acess   user
router.put('/like/:id_comment', [auth, userAuth], async (req, res) => {
  try {
    const comment = await CommentRiver.findById(req.params.id_comment);

    // check if comment has already been liked by user
    if (
      comment.likes.filter((like) => like.user.toString() === req.user.id)
        .length > 0
    ) {
      return res.status(400).json({ msg: 'Comment already liked' });
    }

    comment.likes.unshift({ user: req.user.id });

    await comment.save();
    res.json(comment.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/river/unlike/:id_comment
// @desc    Unlike a post
// @acess   user
router.put('/unlike/:id_comment', [auth, userAuth], async (req, res) => {
  try {
    const comment = await CommentRiver.findById(req.params.id_comment);

    // check if the comment has already been liked by user
    if (
      comment.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked ' });
    }

    const removeIndex = comment.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    comment.likes.splice(removeIndex, 1);

    await comment.save();
    res.json(comment.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/river/publish-status/:river_id
// @desc    Change river publish status
// @acess   admin
router.put('/publish-status/:river_id', auth, adminAuth, async (req, res) => {
  const riverId = req.params.river_id;
  try {
    const river = await River.findById(riverId);
    river.published ? (river.published = false) : (river.published = true);
    river.save();
    res.json(river);
  } catch (error) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/river/add-upvote/:id_post
// @desc    add upvote
// @acess   user
router.put('/add-upvote/:id_river', auth, async (req, res) => {
  try {
    const river = await River.findById(req.params.id_river);

    // check if river has already been downvoted
    if (
      river.downVote.filter(
        (downVote) => downVote.user.toString() === req.user.id
      ).length > 0
    ) {
      return res.status(400).json({ msg: 'River has been down voted' });
    }

    // check if river has already been upvoted
    if (
      river.upVote.filter((upVote) => upVote.user.toString() === req.user.id)
        .length > 0
    ) {
      return res.status(400).json({ msg: 'River has already been upvoted' });
    }

    river.upVote.unshift({ user: req.user.id });

    await river.save();
    res.json(river.upVote);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/river/remove-upvote/:id_post
// @desc    remove upvote
// @acess   user
router.put('/remove-upvote/:id_river', auth, async (req, res) => {
  try {
    const river = await River.findById(req.params.id_river);

    // check if river has already been upvoted
    if (
      river.upVote.filter((upVote) => upVote.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'River has not yet been upvoted' });
    }

    const removeIndex = river.upVote
      .map((upVote) => upVote.user.toString())
      .indexOf(req.user.id);

    river.upVote.splice(removeIndex, 1);
    await river.save();
    res.json(river.upVote);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/river/add-downvote/:id_post
// @desc    add downvote
// @acess   user
router.put('/add-downvote/:id_river', auth, async (req, res) => {
  try {
    const river = await River.findById(req.params.id_river);

    // check if river has alreaded been upvoted
    if (
      river.upVote.filter((upVote) => upVote.user.toString() === req.user.id)
        .length > 0
    ) {
      return res.status(403).json({ msg: 'River has already been upvoted' });
    }

    // check if river has already been downvoted
    if (
      river.downVote.filter(
        (downVote) => downVote.user.toString() === req.user.id
      ).length > 0
    ) {
      return res.status(400).json({ msg: 'River has already been downvoted' });
    }

    river.downVote.unshift({ user: req.user.id });

    await river.save();
    res.json(river.downVote);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/river/remove-downvote/:id_post
// @desc    remove downvote
// @acess   user
router.put('/remove-downvote/:id_river', auth, async (req, res) => {
  try {
    const river = await River.findById(req.params.id_river);

    // check if river has already been downvoted
    if (
      river.downVote.filter(
        (downVote) => downVote.user.toString() === req.user.id
      ).length === 0
    ) {
      return res.status(400).json({ msg: 'River has not yet been downvoted' });
    }

    const removeIndex = river.downVote
      .map((downVote) => downVote.user.toString())
      .indexOf(req.user.id);

    river.downVote.splice(removeIndex, 1);
    await river.save();
    res.json(river.downVote);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
module.exports = router;
