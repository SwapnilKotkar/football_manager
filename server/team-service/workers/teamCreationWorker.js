const { parentPort, workerData } = require("worker_threads");
const Player = require("../models/Player");

const generatePlayers = async () => {
	const players = [
		// Goalkeepers
		{ name: "GK1", teamName: "TeamA", price: 50000, position: "Goalkeeper" },
		{ name: "GK2", teamName: "TeamB", price: 60000, position: "Goalkeeper" },
		{ name: "GK3", teamName: "TeamC", price: 55000, position: "Goalkeeper" },
		// Defenders
		{ name: "DF1", teamName: "TeamA", price: 80000, position: "Defender" },
		{ name: "DF2", teamName: "TeamB", price: 90000, position: "Defender" },
		{ name: "DF3", teamName: "TeamC", price: 85000, position: "Defender" },
		{ name: "DF4", teamName: "TeamD", price: 95000, position: "Defender" },
		{ name: "DF5", teamName: "TeamE", price: 100000, position: "Defender" },
		{ name: "DF6", teamName: "TeamF", price: 110000, position: "Defender" },
		// Midfielders
		{ name: "MF1", teamName: "TeamA", price: 120000, position: "Midfielder" },
		{ name: "MF2", teamName: "TeamB", price: 130000, position: "Midfielder" },
		{ name: "MF3", teamName: "TeamC", price: 125000, position: "Midfielder" },
		{ name: "MF4", teamName: "TeamD", price: 135000, position: "Midfielder" },
		{ name: "MF5", teamName: "TeamE", price: 140000, position: "Midfielder" },
		{ name: "MF6", teamName: "TeamF", price: 150000, position: "Midfielder" },
		// Attackers
		{ name: "AT1", teamName: "TeamA", price: 160000, position: "Attacker" },
		{ name: "AT2", teamName: "TeamB", price: 170000, position: "Attacker" },
		{ name: "AT3", teamName: "TeamC", price: 165000, position: "Attacker" },
		{ name: "AT4", teamName: "TeamD", price: 175000, position: "Attacker" },
		{ name: "AT5", teamName: "TeamE", price: 180000, position: "Attacker" },
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
