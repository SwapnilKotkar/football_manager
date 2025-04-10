const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
	console.log("mongo uri", process.env.MONGO_URI);
	console.log("db name", process.env.DB_NAME);
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			dbName: process.env.DB_NAME,
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Auth Service connected to MongoDB");
	} catch (error) {
		console.error("MongoDB connection error:", error);
		process.exit(1);
	}
};

module.exports = connectDB;
