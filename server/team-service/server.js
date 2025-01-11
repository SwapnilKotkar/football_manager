const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const cluster = require("cluster");
const os = require("os");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // Import the connectDB function
const teamRoutes = require("./routes/teamRoutes");
const { errorHandler } = require("../shared/middlewares/errorHandler"); // Assuming you have an error handler

dotenv.config();

const numCPUs = os.cpus().length;

// Clustering to utilize multiple CPU cores
if (cluster.isMaster) {
	console.log(`Master ${process.pid} is running`);

	// Fork workers based on the number of CPU cores
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	// Listen for dying workers and replace them
	cluster.on("exit", (worker, code, signal) => {
		console.log(`Worker ${worker.process.pid} died. Forking a new worker.`);
		cluster.fork();
	});
} else {
	const app = express();

	// Middleware Setup
	app.use(express.json());
	app.use(morgan("dev"));
	app.use(helmet());
	app.use(cors());

	// Rate Limiting Middleware
	const limiter = rateLimit({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // Limit each IP to 100 requests per windowMs
		message: "Too many requests from this IP, please try again later.",
	});
	app.use(limiter);

	// Connect to MongoDB
	connectDB();

	// Routes
	app.use("/team", teamRoutes);

	// Error Handling Middleware
	app.use(errorHandler);

	// Start the Server
	const PORT = process.env.TEAM_PORT || 5002;
	app.listen(PORT, () => {
		console.log(`Team Service running on port ${PORT}`);
	});
}
