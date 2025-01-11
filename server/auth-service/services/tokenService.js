const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.generateAccessToken = (user) => {
	return jwt.sign(
		{ id: user._id, email: user.email },
		process.env.ACCESS_TOKEN_SECRET,
		{ expiresIn: "15m" }
	);
};

exports.generateRefreshToken = (user) => {
	return jwt.sign(
		{ id: user._id, email: user.email },
		process.env.REFRESH_TOKEN_SECRET,
		{ expiresIn: "7d" }
	);
};

exports.verifyAccessToken = (token) => {
	return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

exports.verifyRefreshToken = (token) => {
	return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};
