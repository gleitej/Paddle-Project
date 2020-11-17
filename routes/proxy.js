const express = require('express');
const router = express.Router();
const config = require('config');
const cors = require('cors');
const axios = require('axios');

router.use(cors());

router.get('/gmap-data', async (req, res) => {
  const gmapURL = ``;
  try {
    const res = await axios.get('');
    res.send(res.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

module.exports = router;
