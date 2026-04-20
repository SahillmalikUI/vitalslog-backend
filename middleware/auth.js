const jwt = require('jsonwebtoken');

// 🧒 This is your security guard!
// Before letting anyone access vitals data,
// it checks if they have a valid token (wristband)

const authMiddleware = (req, res, next) => {

  try {
    // 🧒 Token comes in the request header
    // Like showing your wristband at the door
    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided! Please login first.'
      });
    }

    // 🧒 Token format is: "Bearer eyJhbG..."
    // We only need the part after "Bearer "
    const token = authHeader.split(' ')[1];

    // 🧒 Verify the token is valid and not expired
    // Like checking if the wristband is real and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🧒 Add userId to request so next function can use it
    // Like stamping "VERIFIED - Sahil's ID: 123" on the request
    req.userId = decoded.userId;

    // 🧒 next() means "security check passed, let them through!"
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token! Please login again.'
    });
  }
};

module.exports = authMiddleware;