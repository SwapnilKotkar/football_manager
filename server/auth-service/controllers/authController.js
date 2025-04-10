const User = require("../models/User");
const BlacklistedToken = require("../models/BlacklistedToken");
const tokenService = require("../services/tokenService");
const { sendEmail } = require("../utils/emailEmitter");

exports.register = async (req, res) => {
	const session = await User.startSession();
	session.startTransaction();
	try {
		const { email, password } = req.body;
		const existingUser = await User.findOne({ email }).session(session);
		if (existingUser) {
			await session.abortTransaction();
			session.endSession();
			return res.status(400).json({ message: "Email already in use" });
		}

		const user = new User({ email, password });
		await user.save({ session });

		// Emit email event
		sendEmail(
			email,
			"Welcome to Football Manager!",
			"Thank you for registering."
		);

		await session.commitTransaction();
		session.endSession();
		res.status(201).json({ message: "User registered successfully" });
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		res
			.status(500)
			.json({ message: "Registration failed", error: error.message });
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user || !(await user.comparePassword(password))) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const accessToken = tokenService.generateAccessToken(user);
		const refreshToken = tokenService.generateRefreshToken(user);

		user.refreshToken = refreshToken;
		await user.save();

		res.json({ accessToken, refreshToken });
	} catch (error) {
		res.status(500).json({ message: "Login failed", error: error.message });
	}
};

exports.refreshToken = async (req, res) => {
	console.log("refreshToken_111");
	const { token } = req.body;
	if (!token) return res.status(401).json({ message: "No token provided" });

	try {
		const payload = tokenService.verifyRefreshToken(token);
		const user = await User.findById(payload.id);
		if (!user || user.refreshToken !== token) {
			return res.status(403).json({ message: "Invalid token" });
		}

		const newAccessToken = tokenService.generateAccessToken(user);
		const newRefreshToken = tokenService.generateRefreshToken(user);

		user.refreshToken = newRefreshToken;
		await user.save();

		res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
	} catch (error) {
		res.status(403).json({ message: "Invalid token", error: error.message });
	}
};

exports.logout = async (req, res) => {
	const token = req.token; // Extracted from authenticate middleware
	try {
		const decoded = tokenService.verifyAccessToken(token);
		const blacklisted = new BlacklistedToken({
			token,
			expiresAt: new Date(decoded.exp * 1000),
		});
		await blacklisted.save();
		res.json({ message: "Logged out successfully" });
	} catch (error) {
		res.status(500).json({ message: "Logout failed", error: error.message });
	}
};
