const express = require("express");
const router = express.Router();
const passport = require("passport");

// Index route
router.get("/", (req, res) => {
	res.render("welcome");
});

// Dashboard route
router.get("/dashboard", (req, res) => {
	res.render("dashboard");
});

module.exports = router;
