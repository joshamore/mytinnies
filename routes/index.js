const express = require("express");
const router = express.Router();
const passport = require("passport");
const { ensureAuthenticated } = require("../config/auth");

// Index route
router.get("/", (req, res) => {
	// TODO: update
	res.send(`<h1>My Tinnies</h1>`);
});

// Login route
router.get("/login", ensureAuthenticated, (req, res) => {
	res.send("yeah all good mate");
});

// Logout route
router.get("/logout", (req, res) => {
	res.send("yeah mate, just left the pub");
});

module.exports = router;
