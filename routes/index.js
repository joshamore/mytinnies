const express = require("express");
const router = express.Router();
const dbHelpers = require("../helpers/dbHelpers");
const { ensureAuthenticated } = require("../config/auth");

// Index route
router.get("/", (req, res) => {
	// Redirects to dashboard if logged in. Otherwise, renders welcome screen.
	if (req.isAuthenticated()) {
		res.redirect("/dashboard");
	} else {
		res.render("welcome");
	}
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
	// Getting user history or redirecting to dashboard on error.
	dbHelpers
		.getUserHistory(req.user.user_id)
		.then((history) => {
			res.render("history", {
				history: history,
			});
		})
		.catch((err) => {
			console.log(err.message);
			res.redirect("/dashboard");
		});
});

module.exports = router;
