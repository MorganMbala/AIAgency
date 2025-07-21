const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const generateRoleCode = (role) => {
  switch (role) {
    case 'admin': return 'ADM-' + Date.now();
    case 'employe': return 'EMP-' + Date.now();
    default: return 'CLI-' + Date.now();
  }
};

const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email déjà utilisé.' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const code = generateRoleCode(role);
    const user = await User.create({ username, email, password: hashedPassword, role, code });
    res.status(201).json({ message: 'Compte créé avec succès', user: { id: user.id, username: user.username, email: user.email, role: user.role, code: user.code } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Identifiants invalides.' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Identifiants invalides.' });
    const token = jwt.sign({
      user_id: user.id,
      username: user.username,
      role: user.role
    }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // Envoi du cookie JWT optimal
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: 'localhost'
    });
    res.json({ message: 'Connexion réussie', user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Route pour changer le rôle d'un utilisateur (admin uniquement)
const changeRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;
    if (!['client', 'employe', 'admin'].includes(newRole)) {
      return res.status(400).json({ message: 'Rôle invalide.' });
    }
    // Empêcher la création d'un autre admin
    if (newRole === 'admin') {
      const adminCount = await User.count({ where: { role: 'admin' } });
      if (adminCount > 0) {
        return res.status(403).json({ message: 'Un seul admin autorisé.' });
      }
    }
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    user.role = newRole;
    user.code = generateRoleCode(newRole);
    await user.save();
    res.json({ message: 'Rôle mis à jour', user: { id: user.id, username: user.username, email: user.email, role: user.role, code: user.code } });
  } catch (err) {
    console.error('ChangeRole error:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const { name, email, sub, picture } = payload;
    let user = await User.findOne({ where: { email } });
    if (!user) {
      const hashedPassword = await bcrypt.hash(sub, 10); // hash du sub Google
      user = await User.create({
        username: name,
        email,
        password: hashedPassword,
        role: 'client',
        code: generateRoleCode('client')
      });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res
      .cookie('token', token, {
        httpOnly: true,
        secure: false, // mettre true en production (HTTPS)
        sameSite: 'Lax', // 'None' si cross-domain/port en HTTPS
        maxAge: 24 * 60 * 60 * 1000
      })
      .status(200)
      .json({ user: { id: user.id, username: user.username, email: user.email, role: user.role, code: user.code } });
  } catch (error) {
    console.error('GoogleAuth error:', error);
    res.status(500).json({ error: "Erreur lors de la connexion Google." });
  }
};

// GET /api/auth/me - retourne l'utilisateur connecté
const me = async (req, res) => {
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
    // Récupère l'utilisateur en base pour avoir le rôle à jour
    const user = await User.findByPk(payload.user_id || payload.id);
    if (!user) return res.status(401).json({ message: 'Utilisateur non trouvé' });
    res.json({ user: { id: user.id, username: user.username, email: user.email, role: user.role, code: user.code } });
  } catch (err) {
    res.status(401).json({ message: 'Token invalide' });
  }
};

// POST /api/auth/logout - déconnexion (suppression du cookie)
const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false, // mettre true en production
    sameSite: 'Lax',
  });
  res.json({ message: 'Déconnecté' });
};

module.exports = {
  register,
  login,
  changeRole,
  googleAuth,
  me,
  logout,
};
