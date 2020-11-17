const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  // get token from header
  const token = req.header('x-auth-token');

  // check if no token
  if (!token) {
    return res.status(401).json({ msg: 'no token authorization denied' });
  }

  //   verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    if (decoded.user.role !== config.get('admin')) {
      return res.json({ msg: 'User is not admin' }).status(401);
    }

    next();
  } catch (err) {
    res.status(401).json({ msg: err });
  }
};
