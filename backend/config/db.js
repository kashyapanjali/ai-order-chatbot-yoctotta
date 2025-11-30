const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		const mongoURI = process.env.MONGO_URI;
		
		if (!mongoURI) {
			throw new Error("MONGO_URI is not set in .env file.");
		}
		
		// Connection options to prevent buffering timeout
		const options = {
			serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
			socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
		};
		
		await mongoose.connect(mongoURI, options);
		console.log("MongoDB connected successfully");
		
		// Handle connection events
		mongoose.connection.on('error', (err) => {
			console.error('MongoDB connection error:', err);
		});
		
		mongoose.connection.on('disconnected', () => {
			console.warn('MongoDB disconnected');
		});
	} catch (err) {
		console.error("MongoDB connection error:", err.message);
		throw err; // Re-throw to let the caller handle it
	}
};

module.exports = connectDB;
