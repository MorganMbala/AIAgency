const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/product');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tech-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connecté'))
.catch((err) => console.error('Erreur MongoDB :', err));

// Routes produits
app.use('/api/products', productRoutes);

// Route de test
app.get('/', (req, res) => {
  res.send('Tech Service API is running');
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
