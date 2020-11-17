const express = require('express');
const router = express.Router();

var asyncPackage = require('async');

// modal
const User = require('../models/User');
const Key = require('../models/Key');

// config
const config = require('config');
const user = config.get('user');

// validation
const { check, validationResult } = require('express-validator');

// encryption
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// nodemailer
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

// route config
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// @route   Post api/users/register
// @desc    Register user
// @acess   Public
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check(
      'password',
      'Please enter a password with six or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    // set user role
    const role = config.get('pending');

    try {
      // check if user is in database
      const userFound = await User.findOne({ email });
      if (userFound !== null) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Email is already registered' }] });
      }

      // create user obj
      const user = new User({ name, email, password, role });
      // hash password

      // encryption takes place as pre middleware in ./models/User.js

      await user.save();

      // create user key obj
      key = new Key({ user: user._id });
      await key.save();

      // send auth email
      const link = `http://www.paddle-project.com/confirm-email/${user._id}/${key._id}`;
      // create transporter
      const transporter = nodemailer.createTransport({
        port: 465,
        host: 'smtp.gmail.com',
        auth: {
          user: config.get('email'),
          pass: config.get('emailPass'),
        },
        secure: true, // upgrades later with STARTTLS -- change this based on the PORT
      });
      //   create mailData
      const mailData = {
        from: config.get('email'),
        to: email,
        subject: 'Paddle Project - Confirm Email',
        // text: 'text prop',
        html: `<b>Hey there! </b><br> Please follow this link to confirm your email <a href="http://www.paddle-project.com/confirm-email/${user._id}/${key._id}" >${link}<a/><br/>`,
      };
      // send mail
      transporter.sendMail(mailData, (error, info) => {
        if (error) {
          return console.log(error);
        }
        res
          .status(200)
          .send({ message: 'Mail send', message_id: info.messageId });
      });

      // Create JWT payload
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      res.status(500).send('server error');
      console.log(err.message);
    }
  }
);

// @route    POST /api/users/confirm-email
// @desc     confirm email
// @access   Public
router.put(
  '/confirm-email',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password, userId, keyId } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      if (user.id !== userId) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Email' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // check user role
      if (user.role !== 'pending') {
        res.status(403).json([{ msg: 'Email is already confirmed' }]);
      }

      // set user role
      user.role = 'user';
      await user.save();

      // delete key
      await Key.findByIdAndDelete(keyId);

      // set JWT token
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      const expToken = 36000;

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: expToken },
        (err, token) => {
          if (err) {
            throw err;
          }

          // if not admin
          res.json(user.role);
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);

// @route    POST /api/users/forgot
// @desc     send user link via email
// @access   Public
router.post('/forgot', async (req, res) => {
  const buf = crypto.randomBytes(20);
  const token = buf.toString('hex');

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({ msg: 'No user with that email exists' });
    }

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; //1 hour

    await user.save();

    const link = `http://www.paddle-project.com/reset/${token}`;

    // create transporter
    const transporter = nodemailer.createTransport({
      port: 465,
      host: 'smtp.gmail.com',
      auth: {
        user: config.get('email'),
        pass: config.get('emailPass'),
      },
      secure: true, // upgrades later with STARTTLS -- change this based on the PORT
    });

    //   create mailData
    const mailData = {
      from: config.get('email'),
      to: req.body.email,
      subject: 'Paddle Project - Password Reset',
      // text: 'text prop',
      html: `<div>Hey there!' <br> Please follow this link to reset your password <a href="http://www.paddle-project.com/reset/${token}" >${link}<a/> <br> If you did not request this, please ignore this email and your password will remain unchanged.</div>`,
    };

    // send mail
    await transporter.sendMail(mailData);
    res.status(200).json({ msg: 'Confirmation email sent' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// @route    POST /api/users/reset/:token
// @desc     Reset user password
// @access   Public
router.post(
  '/reset/:token',
  [
    check(
      'password',
      'Please enter a password with six or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const token = req.params.token;
    const { password, email } = req.body;
    const date = Date.now();
    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: date },
      });

      if (!user || user.length <= 0) {
        return res.json({
          msg: 'Password reset token is invalid or has expired.',
          color: 'danger',
          status: false,
        });
      }

      if (user.email !== email) {
        return res.json({
          msg: 'email is incorrect',
          color: 'danger',
          status: false,
        });
      }

      // encryption takes place as pre middleware in ./models/User.js

      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      // create transporter
      const transporter = nodemailer.createTransport({
        port: 465,
        host: 'smtp.gmail.com',
        auth: {
          user: config.get('email'),
          pass: config.get('emailPass'),
        },
        secure: true, // upgrades later with STARTTLS -- change this based on the PORT
      });
      //   create mailData
      const mailData = {
        from: config.get('email'),
        to: user.email,
        subject: 'Paddle Project - Your Password Has Changed',
        // text: 'text prop',
        html:
          'Hello,\n\n' +
          'This is a confirmation that the password for your account ' +
          user.email +
          ' has just been changed.\n',
      };
      // send mail
      await transporter.sendMail(mailData);

      res.status(200).send({
        msg: 'Passord reset successful',
        color: 'success',
        status: true,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);

// @route    GET /api/users/token-status/:token
// @desc     check password reset token status
// @access   Public
router.get('/token-status/:token', async (req, res) => {
  const token = req.params.token;
  const date = Date.now();

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: date },
    });

    if (!user || user.length <= 0) {
      return res.json({
        msg: 'Password reset token is invalid or has expired.',
        color: 'danger',
        valid: false,
      });
    }
    res
      .status(200)
      .json({ msg: 'Token is valid', color: 'success', valid: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

module.exports = router;
