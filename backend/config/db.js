const mongoose = require("mongoose");

/**
 * Connects to MongoDB with a retry mechanism.
 *
 * This function attempts to connect to MongoDB using the provided `MONGO_URI`
 * from environment variables. If the connection fails, it will retry up to
 * a specified number of times before exiting the process.
 *
 * @param {number} retries - Number of retry attempts in case of connection failure (default: 5).
 * @returns {Promise<void>} Resolves when the connection is successful, otherwise exits the process.
 */
const connectDB = async (retries = 5) => {
  while (retries) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log("MongoDB Connected!");
      break;
    } catch (error) {
      console.error(`MongoDB Connection Error: ${error.message}`);

      retries -= 1;
      console.log(`Retrying in 3 seconds... (${retries} attempts left)`);

      await new Promise((res) => setTimeout(res, 3000));
    }
  }

  if (!retries) {
    process.exit(1);
  }
};

module.exports = connectDB;
