const mongoose = require("mongoose");
const connectDB = async () => {
  const dbURI = process.env.MONGO_URI;
  console.log("Attempting to connect to MongoDB with URI:", dbURI);
  
  try {
    await mongoose.connect(dbURI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
    });
    console.log("🟢 MongoDB Connection Successful");
    console.log("Connection Details:", mongoose.connection.host);
  } catch (err) {
    console.error("🔴 MongoDB Connection Failed:", err);
    console.error("Error Name:", err.name);
    console.error("Error Message:", err.message);
    console.error("Full Error:", JSON.stringify(err, null, 2));
    process.exit(1);
  }
};

module.exports = connectDB;
