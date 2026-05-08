const mongoose = require('mongoose');

const connectDB = async () => {

  try {

    const conn = await mongoose.connect(
      process.env.MONGO_URI,
      {
        dbName: 'homefeast'
      }
    );

    console.log(`MongoDB connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);

  } catch (error) {

    console.error(`MongoDB error: ${error.message}`);
    process.exit(1);

  }

};

module.exports = connectDB;