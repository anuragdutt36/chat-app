import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        if (error.name === 'MongooseServerSelectionError') {
            console.error('=> Make sure your current IP address is whitelisted in MongoDB Atlas Network Access (0.0.0.0/0 for access from anywhere).');
        }
    }
};
export default connectDB;