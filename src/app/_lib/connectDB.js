import mongoose from "mongoose";

const URI = process.env.MONGODB_URI_ETHERNET;
let connection;

const connectDB = async () => {
  if (!connection) connection = await mongoose.connect(URI);
  console.log("DB connected");
  return connection;
};
export default connectDB;
