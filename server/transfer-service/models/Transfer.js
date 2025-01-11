const mongoose = require("mongoose");

const transferSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	playerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Player",
		required: true,
	},
	askingPrice: { type: Number, required: true },
	isListed: { type: Boolean, default: true },
});

module.exports = mongoose.model("Transfer", transferSchema);
