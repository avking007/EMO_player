const express = require('express');
const connectDB = require('./config/db');

const app = express();

// connect mongoDB
connectDB();

// middleware for handling body request
app.use(express.json({ extended: false }));

// api routes
app.use('/user', require('./routes/auth'));

// define port for server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Server Connected');
});
