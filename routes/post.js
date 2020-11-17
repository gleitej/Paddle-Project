const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config');
const auth = require('../middleware/auth');
const userAuth = require('../middleware/userAuth');

const { check, validationResult } = require('express-validator');
// models
const Post = require('../models/Post');
const User = require('../models/User');

// @route   POST api/post/create-post
// @desc    Create post
// @acess   user
router.post(
  '/create-post',
  [auth, userAuth, [check('text', 'Text is required')]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id = req.user.id;

    const postObject = {
      text: req.body.text,
      user: id,
    };
    try {
      // let post = await new Post(postObject).populate('user', ['name', 'photo']);
      // await post.save();
      let post = await Post.create(postObject);
      post = await post.populate('user', ['name', 'photo']).execPopulate();
      res.json(post);
    } catch (err) {
      res.status(500).json({ err: err.message });
      console.log('Server error');
    }
  }
);
// @route   GET api/post/all-posts
// @desc    Get all posts
// @acess   Public
router.get('/all-posts', async (req, res) => {
  try {
    const profiles = await Post.find({})
      .populate('user', ['name', 'photo'])
      .sort({ date: -1 });
    res.json(profiles);
  } catch (err) {
    status(500).json({ msg: err.message });
    console.log('Server error');
  }
});

// @route   PUT api/post/like/:id_post
// @desc    Likes a post
// @acess   user
router.put('/like/:id_post', [auth, userAuth], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id_post);

    // check if the post has already been liked by user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/post/unlike/:id_post
// @desc    Unlike a post
// @acess   user
router.put('/unlike/:id_post', [auth, userAuth], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id_post);

    // check if the post has already been liked by user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/post/comment/:id_post
// @desc    Create comment
// @acess   user
router.put(
  '/comment/:id_post',
  [auth, userAuth],
  [check('text', 'Text is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id_post);

      const newComment = {
        text: req.body.text,
        name: user.name,
        photo: user.photo,
        user: req.user.id,
      };

      post.comments.unshift(newComment);

      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   Delete api/post/:id_post
// @desc    delete single post
// @acess   user
router.delete('/:id_post', [auth, userAuth], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id_post);

    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.statius(401).json({ msg: 'User not athorized' });
    }

    // Check post
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    await post.remove();
    res.json({ msg: 'Posts removed' });
  } catch (err) {
    console.log(err.message);

    // Check if Id is valid
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.status(500).send('Server error');
  }
});

// @route   GET api/post/comment/:id_post
// @desc    Get post and all comments by post id
// @acess   public
router.get('/comment/:id_post', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id_post).populate('user', [
      'name',
      'photo',
    ]);

    // check if Id is valid
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

// @route   Delete api/post/comment/:id_post/:id_comment
// @desc    delete a comment
// @acess   user
router.delete(
  '/comment/:id_post/:id_comment',
  [auth, userAuth],
  async (req, res) => {
    try {
      // const user = await User.findById(req.user.id);
      const post = await Post.findById(req.params.id_post);
      // pull out comment
      const comment = post.comments.find(
        (comment) => comment.id === req.params.id_comment
      );

      // make sure comment exists
      if (!comment) {
        return res.status(404).json({ msg: 'Comment does not exist ' });
      }

      // check user
      if (req.user.id !== comment.user.toString()) {
        res.status(401).json({ msg: 'User is not authorized' });
      }

      const removeIndex = post.comments
        .map((comment) => comment.user.toString())
        .indexOf(req.user.id);

      post.comments.splice(removeIndex, 1);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
