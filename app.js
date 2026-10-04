require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const articlesRoutes = require('./routes/articles');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Blog API is running!' });
});

app.use('/articles', articlesRoutes);

const connectDB = async () => {
  const mongoUri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    'mongodb://127.0.0.1:27017/blog-api-week9';

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
  } catch (error) {
    console.warn(
      'MongoDB connection failed. Starting server without a database connection:',
      error.message
    );
  }
};

if (require.main === module) {
  connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = { app, connectDB };