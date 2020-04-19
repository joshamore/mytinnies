const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

// Index route
router.get("/", (req, res) => {
	res.render("welcome");
});

// Dashboard route
router.get("/dashboard", ensureAuthenticated, (req, res) => {
	// This passes is the user's email as a variable to EJS
	res.render("dashboard", {
		email: req.user.email,
	});
});

// Add tinnies route
router.get("/add", ensureAuthenticated, (req, res) => {
	res.render("add");
});

// History route
router.get("/history", ensureAuthenticated, (req, res) => {
	//TODO
	res.render("history");
});

module.exports = router;
