const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ message: 'Authentication is not configured' });
  }

  const authorization = req.headers.authorization;
  const [scheme, token] = authorization ? authorization.split(' ') : [];

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const payload = jwt.verify(token, secret);

    if (typeof payload !== 'object' || !payload.sub) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.userId = payload.sub;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticate;