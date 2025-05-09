const express = require("express");
const {
	register,
	login,
	refreshToken,
	logout,
} = require("../controllers/authController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", authenticate, logout);

module.exports = router;
