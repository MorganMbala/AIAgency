const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// CRUD routes
router.post('/', productController.createProduct); // Ajouter un produit
router.get('/', productController.getProducts); // Liste des produits
router.get('/:id', productController.getProductById); // Détail d'un produit
router.put('/:id', productController.updateProduct); // Modifier un produit
router.delete('/:id', productController.deleteProduct); // Supprimer un produit

module.exports = router;
