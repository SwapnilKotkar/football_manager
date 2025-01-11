const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const { rateLimiter } = require("./middlewares/rateLimiter");
const { sendEmail } = require("./utils/emailEmitter");
const cluster = require("cluster");
const os = require("os");
require("dotenv").config();

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
	console.log(`Master ${process.pid} is running`);

	// Fork workers
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	// Listen for dying workers
	cluster.on("exit", (worker, code, signal) => {
		console.log(`Worker ${worker.process.pid} died`);
		cluster.fork();
	});
} else {
	const app = express();

	app.use(express.json());
	app.use(morgan("dev"));
	app.use(helmet());
	app.use(cors());
	app.use(rateLimiter);

	// Routes
	app.use("/auth", authRoutes);

	// MongoDB Connection
	mongoose
		.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => console.log("Auth Service connected to MongoDB"))
		.catch((err) => console.error(err));

	const PORT = process.env.AUTH_PORT || 5001;
	app.listen(PORT, () => {
		console.log(`Auth Service running on port ${PORT}`);
	});
}
