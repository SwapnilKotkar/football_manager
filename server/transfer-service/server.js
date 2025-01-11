const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const transferRoutes = require("./routes/transferRoutes");
const { rateLimiter } = require("./middlewares/rateLimiter");
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
	app.use("/transfer", transferRoutes);

	// MongoDB Connection
	mongoose
		.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => console.log("Transfer Service connected to MongoDB"))
		.catch((err) => console.error(err));

	const PORT = process.env.TRANSFER_PORT || 5003;
	app.listen(PORT, () => {
		console.log(`Transfer Service running on port ${PORT}`);
	});
}
