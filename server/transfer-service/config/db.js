const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			dbName: process.env.DB_NAME,
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Transfer Service connected to MongoDB");
	} catch (error) {
		console.error("MongoDB connection error:", error);
		process.exit(1);
	}
};

module.exports = connectDB;
