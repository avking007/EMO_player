const express = require('express');
const connectDB = require('./config/db');
require("dotenv").config();
const cors = require("cors");
const path = require('path');

const app = express();

// connect mongoDB
connectDB();

// middleware for handling body request
app.use(express.json({ extended: false }));
app.use(cors());
console.log(process.env);
// api routes
app.use('/user', require('./routes/auth'));
app.use('/song', require('./routes/songs'));

if (process.env.NODE_ENV === 'production') {
  // set static folder
  app.use(express.static('client/build'));
  app.use('*', (req,res)=>{
    res.sendFile(
      path.resolve(__dirname, 'client', 'build', 'index.html')
    );
  });
}

// define port for server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Server Connected');
});
