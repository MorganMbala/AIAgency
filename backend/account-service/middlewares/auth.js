const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  // Prend le token d'abord dans le cookie, sinon dans l'Authorization header
  const token = req.cookies.token || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);
  console.log('Token reçu:', token); // LOG
  if (!token) return res.status(401).json({ message: 'Token manquant' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalide' });
    console.log('Utilisateur décodé:', user); // LOG
    req.user = user;
    next();
  });
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Accès refusé' });
  }
  next();
};

module.exports = { authenticate, authorize };
