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
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
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
    res.status(200).json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role, code: user.code } });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la connexion Google." });
  }
};

module.exports = { register, login, changeRole, googleAuth };
