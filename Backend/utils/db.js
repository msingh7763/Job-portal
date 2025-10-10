// import mongoose from "mongoose";
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("MongoDb connected...");


//   } catch (error) {
//     console.log();
//     ("Error in connection ", error.message);
//     //process.exit(1);
//   }

// };
// export default connectDB;
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI not defined in .env");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected...");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    // Do NOT exit process — allow server to run for dev testing
  }
};

export default connectDB;
