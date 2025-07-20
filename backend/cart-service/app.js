const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const cartRoutes = require('./routes/cart');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cart-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connecté'))
.catch((err) => console.error('Erreur MongoDB :', err));

app.use('/api/cart', cartRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Cart service running on port ${PORT}`));
