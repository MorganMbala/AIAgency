// Route pour récupérer tous les clients (customers)
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate, authorize } = require('../middlewares/auth');
const getSequelizeErrorMessage = require('../utils/sequelizeError');

// GET /api/users/customers - retourne tous les utilisateurs avec le rôle 'client'
router.get('/customers', authenticate, authorize('admin'), async (req, res) => {
  try {
    const customers = await User.findAll({ where: { role: 'client' } });
    console.log('Clients trouvés:', customers); // LOG
    res.json(customers);
  } catch (err) {
    console.error('Erreur lors de la récupération des clients:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des clients.' });
  }
});

// POST /api/users/customers - création d'un client
router.post('/customers', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { username, email, password, code } = req.body;
    // On force le rôle à 'client' côté backend
    const user = await User.create({ username, email, password, code, role: 'client' });
    res.json(user);
  } catch (err) {
    const msg = getSequelizeErrorMessage(err);
    if (msg) return res.status(400).json({ error: msg });
    res.status(500).json({ error: 'Erreur lors de la création du client.' });
  }
});

// PUT /api/users/customers/:id - modification d'un client
router.put('/customers/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { username, email, password, code } = req.body;
    // On force le rôle à 'client' côté backend
    await User.update(
      { username, email, password, code, role: 'client' },
      { where: { id: req.params.id, role: 'client' } }
    );
    const updated = await User.findByPk(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la modification du client.' });
  }
});

// DELETE /api/users/customers/:id - suppression d'un client
router.delete('/customers/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id, role: 'client' } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression du client.' });
  }
});

// GET /api/users/employees - retourne tous les utilisateurs avec le rôle 'employe'
router.get('/employees', authenticate, authorize('admin'), async (req, res) => {
  try {
    const employees = await User.findAll({ where: { role: 'employe' } });
    console.log('Employés trouvés:', employees); // LOG
    res.json(employees);
  } catch (err) {
    console.error('Erreur lors de la récupération des employés:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des employés.' });
  }
});

// POST /api/users/employees - création d'un employé
router.post('/employees', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { username, email, password, code } = req.body;
    // On force le rôle à 'employe' côté backend
    const user = await User.create({ username, email, password, code, role: 'employe' });
    res.json(user);
  } catch (err) {
    const msg = getSequelizeErrorMessage(err);
    if (msg) return res.status(400).json({ error: msg });
    res.status(500).json({ error: 'Erreur lors de la création de l\'employé.' });
  }
});

// PUT /api/users/employees/:id - modification d'un employé
router.put('/employees/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { username, email, password, code } = req.body;
    // On force le rôle à 'employe' côté backend
    await User.update(
      { username, email, password, code, role: 'employe' },
      { where: { id: req.params.id, role: 'employe' } }
    );
    const updated = await User.findByPk(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la modification de l\'employé.' });
  }
});

// DELETE /api/users/employees/:id - suppression d'un employé
router.delete('/employees/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id, role: 'employe' } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'employé.' });
  }
});

// GET /api/users/:id - retourne le nom d'utilisateur pour un id donné
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    res.json({ id: user.id, username: user.username, name: user.name || user.username, email: user.email }); // <-- Ajout email
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur lors de la récupération de l’utilisateur.' });
  }
});

module.exports = router;
