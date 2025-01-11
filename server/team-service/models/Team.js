const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	budget: { type: Number, default: 5000000 },
	players: [
		{
			playerId: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
			position: {
				type: String,
				enum: ["Goalkeeper", "Defender", "Midfielder", "Attacker"],
				required: true,
			},
		},
	],
});

module.exports = mongoose.model("Team", teamSchema);
