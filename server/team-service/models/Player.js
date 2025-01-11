const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
	name: { type: String, required: true },
	teamName: { type: String, required: true },
	price: { type: Number, required: true },
	position: {
		type: String,
		enum: ["Goalkeeper", "Defender", "Midfielder", "Attacker"],
		required: true,
	},
});

module.exports = mongoose.model("Player", playerSchema);
