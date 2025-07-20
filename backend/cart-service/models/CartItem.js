const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // id du user (venant du JWT/account-service)
  productId: { type: String, required: true }, // id du produit dans tech-service
  quantity: { type: Number, default: 1, min: 1 },
  addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CartItem', CartItemSchema);
