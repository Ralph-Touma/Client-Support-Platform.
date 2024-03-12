import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || '');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {

    if (error instanceof Error) {
      console.error(`Connection error: ${error.message}`);
    } else {
      console.error(`An unexpected error occurred: ${error}`);
    }
    process.exit(1);
  }
};

export default connectDB;
