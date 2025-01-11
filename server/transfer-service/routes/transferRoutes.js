const express = require("express");
const {
	listTransfer,
	removeTransfer,
	buyPlayer,
	filterTransfers,
} = require("../controllers/transferController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/list", authenticate, listTransfer);
router.delete("/remove/:id", authenticate, removeTransfer);
router.post("/buy/:id", authenticate, buyPlayer);
router.get("/filter", authenticate, filterTransfers);

module.exports = router;
