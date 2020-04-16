const express = require("express");
const router = express.Router();
const passport = require("passport");
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
	//TODO
	res.render("add");
});

module.exports = router;
