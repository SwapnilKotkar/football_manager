const jwt = require("jsonwebtoken");
const BlacklistedToken = require("../models/BlacklistedToken");
const tokenService = require("../services/tokenService");
require("dotenv").config();

exports.authenticate = async (req, res, next) => {
	console.log("authenticate_111", req.headers);
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) return res.status(401).json({ message: "No token provided" });

	const blacklisted = await BlacklistedToken.findOne({ token });
	if (blacklisted)
		return res.status(403).json({ message: "Token is blacklisted" });

	try {
		const decoded = tokenService.verifyAccessToken(token);
		req.user = decoded;
		req.token = token;
		next();
	} catch (error) {
		res.status(403).json({ message: "Invalid token", error: error.message });
	}
};
