
const mongoose = require("mongoose");

exports.connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI).then(() => { })
    console.log("MongoDB connected");
    
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
