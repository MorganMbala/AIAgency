const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const cartController = require('../controllers/cartController');

router.post('/add', auth, cartController.addToCart);
router.post('/remove', auth, cartController.removeFromCart);
router.post('/clear', auth, cartController.clearCart);
router.get('/', auth, cartController.getCart);

module.exports = router;
