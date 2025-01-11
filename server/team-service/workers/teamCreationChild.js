const { parentPort, workerData } = require("worker_threads");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Player = require("../models/Player");
const Team = require("../models/Team");

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Worker connected to MongoDB");
		createTeam();
	})
	.catch((err) => {
		console.error("MongoDB connection error in worker:", err);
		parentPort.postMessage({ error: err.message });
	});

// Function to generate players based on position
const generatePlayersByPosition = (position, count) => {
	const players = [];
	for (let i = 1; i <= count; i++) {
		players.push({
			name: `${position[0]}K${i}`, // Example: GK1, GK2, etc.
			teamName: `Team${String.fromCharCode(
				65 + Math.floor(Math.random() * 26)
			)}`, // Random team name like TeamA, TeamB, etc.
			price: getRandomPrice(position),
			position,
		});
	}
	return players;
};

// Function to get random price based on position
const getRandomPrice = (position) => {
	switch (position) {
		case "Goalkeeper":
			return getRandomInt(30000, 70000);
		case "Defender":
			return getRandomInt(50000, 120000);
		case "Midfielder":
			return getRandomInt(80000, 150000);
		case "Attacker":
			return getRandomInt(100000, 200000);
		default:
			return 50000;
	}
};

// Utility function to get random integer between min and max
const getRandomInt = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to create team
const createTeam = async () => {
	try {
		const { userId } = workerData;

		// Define required positions and counts
		const positionRequirements = {
			Goalkeeper: 3,
			Defender: 6,
			Midfielder: 6,
			Attacker: 5,
		};

		let allPlayers = [];

		// Generate players for each position
		for (const [position, count] of Object.entries(positionRequirements)) {
			const players = generatePlayersByPosition(position, count);
			allPlayers = allPlayers.concat(players);
		}

		// Insert players into the database
		const insertedPlayers = await Player.insertMany(allPlayers);

		// Map inserted players to the team structure
		const teamPlayers = insertedPlayers.map((player) => ({
			playerId: player._id,
			position: player.position,
		}));

		// Create team data
		const teamData = {
			userId,
			budget: 5000000, // $5,000,000
			players: teamPlayers,
		};

		// Send the team data back to the parent thread
		parentPort.postMessage({ team: teamData });

		// Close the MongoDB connection
		mongoose.connection.close();
	} catch (error) {
		console.error("Error in team creation worker:", error);
		parentPort.postMessage({ error: error.message });
		mongoose.connection.close();
	}
};
