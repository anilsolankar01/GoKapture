// middleware/roleMiddleware.js
exports.checkRole = (roles) => {
    return (req, res, next) => {
      const { role } = req.user; // Assuming `req.user` contains the authenticated user
  
      if (!roles.includes(role)) {
        return res.status(403).json({ error: 'Access denied. You do not have permission to perform this action.' });
      }
  
      next();
    };
  };
  