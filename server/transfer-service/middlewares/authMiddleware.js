const jwt = require("jsonwebtoken");
const BlacklistedToken = require("../../auth-service/models/BlacklistedToken"); // If applicable
const tokenService = require("../../auth-service/services/tokenService"); // If shared

require("dotenv").config();

exports.authenticate = async (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) return res.status(401).json({ message: "No token provided" });

	// Implement token blacklist check if necessary
	// const blacklisted = await BlacklistedToken.findOne({ token });
	// if (blacklisted) return res.status(403).json({ message: 'Token is blacklisted' });

	try {
		const decoded = tokenService.verifyAccessToken(token);
		req.user = decoded;
		next();
	} catch (error) {
		res.status(403).json({ message: "Invalid token", error: error.message });
	}
};
