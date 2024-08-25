// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.sendStatus(403);

    const authenticatedUser = await User.findByPk(user.id);
    if (!authenticatedUser) return res.sendStatus(404);

    req.user = authenticatedUser; // Attach user to request
    next();
  });
};
