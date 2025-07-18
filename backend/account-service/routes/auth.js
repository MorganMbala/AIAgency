const express = require('express');
const router = express.Router();
const { register, login, changeRole, googleAuth } = require('../controllers/authController');
const { authenticate, authorize } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.patch('/role', authenticate, authorize('admin'), changeRole);

module.exports = router;
