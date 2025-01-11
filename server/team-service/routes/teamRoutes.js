const express = require("express");
const { createTeam, getTeam } = require("../controllers/teamController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", authenticate, createTeam);
router.get("/", authenticate, getTeam);

module.exports = router;
