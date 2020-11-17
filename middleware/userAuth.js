const jwt = require('jsonwebtoken');
const config = require('config');

// THIS MIDDLEWARE CURRENTLY DOES NOTHING

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

    // CODE BELOW CAUSES ISSUES
    // Issue - #1 CURRENTLY IT IS PROTECTING ROUTES THAT MUST BE ACCESSIBLE TO USERS OF DIFFERENT AUTH ROLES

    // if (decoded.user.role !== config.get('user')) {
    //   return res.json({ msg: 'is not user' }).status(401);
    // }

    next();
  } catch (err) {
    res.status(401).json({ msg: err });
  }
};
