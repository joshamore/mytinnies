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
	res.render("dashboard");
});

module.exports = router;
