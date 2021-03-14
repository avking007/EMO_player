const mongoose = require('mongoose');
const config = require('./default');

const connectDB = async () => {
  try {
    // mongoDB connection request
    mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    // once mongo is connected
    const db = mongoose.connection;
    db.once('open', () => {
      console.log('DB connected');
    });
  } catch (error) {
    console.log('Error', error);
  }
};

module.exports = connectDB;
