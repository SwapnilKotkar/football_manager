const Transfer = require("../models/Transfer");
const Player = require("../../team-service/models/Player");
const Team = require("../../team-service/models/Team");
const mongoose = require("mongoose");

exports.listTransfer = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const { playerId, askingPrice } = req.body;
		const userId = req.user.id;

		// Check if player is already listed
		const existingTransfer = await Transfer.findOne({ playerId }).session(
			session
		);
		if (existingTransfer) {
			await session.abortTransaction();
			session.endSession();
			return res
				.status(400)
				.json({ message: "Player is already listed for transfer" });
		}

		const transfer = new Transfer({ userId, playerId, askingPrice });
		await transfer.save({ session });

		await session.commitTransaction();
		session.endSession();
		res.status(201).json({ message: "Player listed for transfer" });
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		res
			.status(500)
			.json({ message: "Listing transfer failed", error: error.message });
	}
};

exports.removeTransfer = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const transferId = req.params.id;
		const userId = req.user.id;

		const transfer = await Transfer.findOne({
			_id: transferId,
			userId,
		}).session(session);
		if (!transfer) {
			await session.abortTransaction();
			session.endSession();
			return res.status(404).json({ message: "Transfer not found" });
		}

		await Transfer.deleteOne({ _id: transferId }).session(session);

		await session.commitTransaction();
		session.endSession();
		res.json({ message: "Transfer removed" });
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		res
			.status(500)
			.json({ message: "Removing transfer failed", error: error.message });
	}
};

exports.buyPlayer = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const transferId = req.params.id;
		const buyerId = req.user.id;

		const transfer = await Transfer.findById(transferId).session(session);
		if (!transfer || !transfer.isListed) {
			await session.abortTransaction();
			session.endSession();
			return res.status(404).json({ message: "Transfer not available" });
		}

		const sellerId = transfer.userId;
		const player = await Player.findById(transfer.playerId).session(session);
		if (!player) {
			await session.abortTransaction();
			session.endSession();
			return res.status(404).json({ message: "Player not found" });
		}

		const sellingPrice = transfer.askingPrice * 0.95;

		// Fetch buyer's team
		const buyerTeam = await Team.findOne({ userId: buyerId }).session(session);
		if (!buyerTeam) {
			await session.abortTransaction();
			session.endSession();
			return res.status(404).json({ message: "Buyer team not found" });
		}

		if (buyerTeam.budget < sellingPrice) {
			await session.abortTransaction();
			session.endSession();
			return res.status(400).json({ message: "Insufficient budget" });
		}

		// Deduct from buyer's budget and add player
		buyerTeam.budget -= sellingPrice;
		buyerTeam.players.push({ playerId: player._id, position: player.position });
		await buyerTeam.save({ session });

		// Add to seller's budget and remove player from their team
		const sellerTeam = await Team.findOne({ userId: sellerId }).session(
			session
		);
		if (sellerTeam) {
			sellerTeam.budget += sellingPrice;
			sellerTeam.players = sellerTeam.players.filter(
				(p) => p.playerId.toString() !== player._id.toString()
			);
			await sellerTeam.save({ session });
		}

		// Mark transfer as not listed
		transfer.isListed = false;
		await transfer.save({ session });

		await session.commitTransaction();
		session.endSession();
		res.json({ message: "Player purchased successfully" });
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		res.status(500).json({ message: "Purchase failed", error: error.message });
	}
};

exports.filterTransfers = async (req, res) => {
	try {
		const { teamName, playerName, price } = req.query;
		const filter = {};

		if (teamName) {
			filter.teamName = { $regex: teamName, $options: "i" };
		}
		if (playerName) {
			filter.name = { $regex: playerName, $options: "i" };
		}
		if (price) {
			filter.price = { $lte: Number(price) };
		}

		const transfers = await Transfer.find(filter).populate("playerId");
		res.json(transfers);
	} catch (error) {
		res.status(500).json({ message: "Filtering failed", error: error.message });
	}
};
