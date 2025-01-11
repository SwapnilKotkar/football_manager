const { parentPort, workerData } = require("worker_threads");
const Player = require("../models/Player"); // Assuming you have access to Player model

// Dummy function to generate random players
const generatePlayers = async () => {
	// For simplicity, creating static players. In real scenarios, fetch from a database or external API.
	const players = [
		// Goalkeepers
		{ name: "GK1", teamName: "TeamA", price: 50000, position: "Goalkeeper" },
		{ name: "GK2", teamName: "TeamB", price: 60000, position: "Goalkeeper" },
		{ name: "GK3", teamName: "TeamC", price: 55000, position: "Goalkeeper" },
		// Defenders
		// ... add 6 Defenders
		// Midfielders
		// ... add 6 Midfielders
		// Attackers
		// ... add 5 Attackers
	];

	// Ensure you have the required number of players
	// Here you should implement the logic to select 20 players based on positions

	// For demonstration, returning empty players
	return players;
};

const createTeam = async () => {
	const { userId } = workerData;
	const players = await generatePlayers();

	// Map players to player IDs after saving them to the database
	// Here, just simulating with dummy ObjectIds
	const mappedPlayers = players.map((player) => ({
		playerId: new mongoose.Types.ObjectId(), // Replace with actual player IDs
		position: player.position,
	}));

	return {
		userId,
		budget: 5000000,
		players: mappedPlayers,
	};
};

createTeam()
	.then((team) => parentPort.postMessage(team))
	.catch((err) => parentPort.postMessage({ error: err.message }));
