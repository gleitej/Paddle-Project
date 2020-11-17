const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config');
const auth = require('../middleware/auth');
const masterAdminAuth = require('../middleware/masterAdminAuth');
const { check, validationResult } = require('express-validator');
// models
const User = require('../models/User');
const AdminApplication = require('../models/AdminApplication');

// @route   POST api/master-admin/admin-apply
// @desc    submit applitcation
// @acess   masterAdmin
router.post(
  '/admin-apply',
  [
    auth,
    [
      (check('why', 'Please fill out all fields').exists(),
      check('about', 'Please fill out all fields').exists(),
      check('craft', 'Please fill out all fields').exists(),
      check('experience', 'Please fill out all fields').exists(),
      check('favoriteRiver', 'Please fill out all fields').exists()),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const id = req.user.id;
    const { why, password, about, craft, experience, favoriteRiver } = req.body;
    const applicationPending = config.get('applicationPending');

    const adminApplicationObject = {
      why,
      password,
      about,
      experience,
      favoriteRiver,
      status: applicationPending,
      user: id,
    };

    try {
      const applicationAlreadySubmitted = await AdminApplication.find({
        user: id,
      });
      if (applicationAlreadySubmitted.length > 0) {
        return res.json(applicationPending);
      }
      const application = await AdminApplication.create(adminApplicationObject);
      res.json(application.status);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);

// @route   GET api/master-admin/get-application-status/:user_id
// @desc    Get application status by user id
// @acess   user
router.get('/get-application-status/:user_id', auth, async (req, res) => {
  try {
    const userId = req.params.user_id;
    const user = req.user.id;
    if (userId !== user) {
      return res
        .status(401)
        .json({ msg: 'Application does not belong to this user' });
    }
    const application = await AdminApplication.findOne({ user: userId });

    if (!application) {
      return res.json(config.get('applicationNoSubmit'));
    }
    res.json(application.status);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// @route   GET /api/master-adminget-all-pending-applications
// @desc    Get all applications
// @acess   masterAdmin
router.get(
  '/get-all-pending-applications',
  auth,
  masterAdminAuth,
  async (req, res) => {
    try {
      const applications = await AdminApplication.find({
        status: config.get('applicationPending'),
      }).populate('user', ['role', 'name']);

      res.json(applications);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);

// @route   GET /api/master-admin/get-all-user-info
// @desc    Get all applications
// @acess   masterAdmin
router.get(
  '/get-all-approved-applications',
  auth,
  masterAdminAuth,
  async (req, res) => {
    try {
      const applications = await AdminApplication.find({
        status: config.get('applicationApproved'),
      }).populate('user', ['role', 'name']);
      res.json(applications);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);

// @route   GET /api/master-admin/get-all-user-info
// @desc    Get all applications
// @acess   masterAdmin
router.get('/get-all-user-info', auth, masterAdminAuth, async (req, res) => {
  try {
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// @route   PUT api/master-admin/change-status/:user_id
// @desc    change user or admin status
// @acess   masterAdmin
router.put(
  '/change-status/:user_id',
  [auth, masterAdminAuth, [check('userStatus', 'User status is required')]],
  async (req, res) => {
    const newStatus = req.body.newStatus;
    const userId = req.params.user_id;
    try {
      // find user by userId
      const user = await User.findById(userId).select('-password');

      // find user application {user: userId}
      const application = await AdminApplication.findOne({
        user: userId,
      });
      // change user role
      user.role = newStatus;
      await user.save();

      // user role change to admin
      if (user.role === config.get('admin')) {
        application.status = config.get('applicationApproved');
        application.save();
      }

      // user role change to user
      if (user.role === config.get('user')) {
        application.status = config.get('applicationPending');
        application.save();
      }

      res.json(application);
    } catch (err) {}
  }
);
module.exports = router;
