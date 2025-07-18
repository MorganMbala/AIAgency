require('dotenv').config();
const express = require('express');
const sequelize = require('./config/sequelize');
const authRoutes = require('./routes/auth');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('Account Service API'));

const PORT = process.env.PORT || 4000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Account service running on port ${PORT}`);
  });
});
