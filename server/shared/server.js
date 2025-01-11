const express = require("express");
const axios = require("axios");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const { errorHandler } = require("./middlewares/errorHandler");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

// Environment variables for microservices URLs
const AUTH_SERVICE_URL =
	process.env.AUTH_SERVICE_URL || "http://localhost:5001";
const TEAM_SERVICE_URL =
	process.env.TEAM_SERVICE_URL || "http://localhost:5002";
const TRANSFER_SERVICE_URL =
	process.env.TRANSFER_SERVICE_URL || "http://localhost:5003";

// Proxy routes to respective microservices
app.use("/auth", (req, res) => {
	axios({
		method: req.method,
		url: `${AUTH_SERVICE_URL}${req.originalUrl}`,
		data: req.body,
		headers: req.headers,
	})
		.then((response) => res.send(response.data))
		.catch((error) =>
			res.status(error.response.status).send(error.response.data)
		);
});

app.use("/team", (req, res) => {
	axios({
		method: req.method,
		url: `${TEAM_SERVICE_URL}${req.originalUrl}`,
		data: req.body,
		headers: req.headers,
	})
		.then((response) => res.send(response.data))
		.catch((error) =>
			res.status(error.response.status).send(error.response.data)
		);
});

app.use("/transfer", (req, res) => {
	axios({
		method: req.method,
		url: `${TRANSFER_SERVICE_URL}${req.originalUrl}`,
		data: req.body,
		headers: req.headers,
	})
		.then((response) => res.send(response.data))
		.catch((error) =>
			res.status(error.response.status).send(error.response.data)
		);
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Shared server running on port ${PORT}`);
});
