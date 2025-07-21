require('dotenv').config();
const express = require('express');
const sequelize = require('./config/sequelize');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());
// CORS optimal pour JWT cookie
app.use(cors({
  origin: [
    'http://localhost:5173', // Vite frontend
    'http://localhost:3000', // Dashboard admin
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('Account Service API'));

const PORT = process.env.PORT || 4000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Account service running on port ${PORT}`);
  });
});


const usersRoutes = require('./routes/user');
app.use('/api/users', usersRoutes);