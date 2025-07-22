const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  let token = req.cookies.token;
  // Si le token n'est pas dans les cookies, tente de le récupérer dans l'en-tête Authorization
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }
  if (!token) return res.status(401).json({ message: 'Non authentifié' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.user_id || payload.id || payload.sub;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};
