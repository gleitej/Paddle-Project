const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const config = require('config');
const bodyParser = require('body-parser');

// modal
const Key = require('../models/Key');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// @route   GET /api/confirm-email/get-key/:key_id
// @desc    get key by key_id
// @acess   Public

router.get('/get-key/:key_id', async (req, res) => {
  const keyId = req.params.key_id;
  try {
    const foundKey = await Key.findById(keyId);
    res.json(foundKey);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

module.exports = router;
