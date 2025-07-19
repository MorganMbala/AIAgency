// Route pour récupérer tous les clients (customers)
const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { authenticate } = require('../middlewares/auth');

// GET /api/customers - retourne tous les utilisateurs avec le rôle 'client'
router.get('/customers', authenticate, async (req, res) => {
  try {
    const customers = await User.findAll({ where: { role: 'client' } });
    res.json(customers);
  } catch (err) {
    console.error('Erreur lors de la récupération des clients:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des clients.' });
  }
});

// GET /api/employees - retourne tous les utilisateurs avec le rôle 'employe'
router.get('/employees', authenticate, async (req, res) => {
  try {
    const employees = await User.findAll({ where: { role: 'employe' } });
    res.json(employees);
  } catch (err) {
    console.error('Erreur lors de la récupération des employés:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des employés.' });
  }
});

module.exports = router;
