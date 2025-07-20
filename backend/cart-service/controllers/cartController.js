const CartItem = require('../models/CartItem');
const axios = require('axios');

// Ajouter un produit au panier
exports.addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.userId;
  console.log('addToCart called:', { userId, productId, quantity });
  if (!productId) {
    console.error('Erreur: productId requis');
    return res.status(400).json({ error: 'productId requis' });
  }
  try {
    let item = await CartItem.findOne({ userId, productId });
    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      item = await CartItem.create({ userId, productId, quantity });
    }
    res.json(item);
  } catch (err) {
    console.error('Erreur addToCart:', err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
};

// Supprimer un produit du panier
exports.removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.userId;
  await CartItem.deleteOne({ userId, productId });
  res.json({ success: true });
};

// Vider le panier
exports.clearCart = async (req, res) => {
  const userId = req.userId;
  await CartItem.deleteMany({ userId });
  res.json({ success: true });
};

// Récupérer le panier de l'utilisateur
exports.getCart = async (req, res) => {
  const userId = req.userId;
  try {
    const items = await CartItem.find({ userId });
    console.log('getCart:', { userId, nbItems: items.length });
    res.json(items);
  } catch (err) {
    console.error('Erreur getCart:', err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
};
