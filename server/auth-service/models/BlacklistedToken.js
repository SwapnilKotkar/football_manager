// server/auth-service/models/BlacklistedToken.js

const mongoose = require("mongoose");

const blacklistedTokenSchema = new mongoose.Schema({
	token: { type: String, required: true },
	expiresAt: { type: Date, required: true },
});

// Optional: Add an index to automatically delete expired tokens
blacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("BlacklistedToken", blacklistedTokenSchema);
