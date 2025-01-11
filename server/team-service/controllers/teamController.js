const Team = require("../models/Team");
const Player = require("../models/Player");
const { Worker } = require("worker_threads");
const path = require("path");

exports.createTeam = async (req, res) => {
	try {
		const userId = req.user.id;

		// Check if team already exists
		const existingTeam = await Team.findOne({ userId });
		if (existingTeam) {
			return res.status(400).json({ message: "Team already exists" });
		}

		// Start worker thread for team creation
		const worker = new Worker(
			path.resolve(__dirname, "../workers/teamCreationWorker.js"),
			{
				workerData: { userId },
			}
		);

		worker.on("message", async (team) => {
			await Team.create(team);
			res.status(201).json({ message: "Team created successfully" });
		});

		worker.on("error", (error) => {
			console.error("Worker error:", error);
			res
				.status(500)
				.json({ message: "Team creation failed", error: error.message });
		});
	} catch (error) {
		res
			.status(500)
			.json({ message: "Team creation failed", error: error.message });
	}
};

exports.getTeam = async (req, res) => {
	try {
		const userId = req.user.id;
		const team = await Team.findOne({ userId }).populate("players.playerId");
		if (!team) {
			return res.status(404).json({ message: "Team not found" });
		}
		res.json(team);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Failed to retrieve team", error: error.message });
	}
};
