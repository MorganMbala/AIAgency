const mongoose = require('mongoose');

// Exemple de modèle solide pour un produit personnalisable (type fast-food/McDonalds)
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String }, // URL de l'image
  category: { type: String },
  available: { type: Boolean, default: true },
  // Pour la personnalisation (ex: choix d'ingrédients, tailles, options)
  options: [
    {
      name: String, // ex: "Taille", "Pain", "Sauce"
      required: { type: Boolean, default: false },
      choices: [
        {
          label: String, // ex: "Petit", "Moyen", "Grand", "Ketchup"
          price: { type: Number, default: 0 }, // supplément éventuel
        }
      ]
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
