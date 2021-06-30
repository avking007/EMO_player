const express = require('express');
const connectDB = require('./config/db');
const cors = require("cors")

const app = express();

// connect mongoDB
connectDB();

// middleware for handling body request
app.use(express.json({ extended: false }));
app.use(cors())

// api routes
app.use('/user', require('./routes/auth'));
app.use('/song', require('./routes/songs'));

// define port for server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Server Connected');
});
