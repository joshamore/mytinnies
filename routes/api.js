const express = require("express");
const router = express.Router();
const dbHelpers = require("../helpers/dbHelpers");
const { ensureAuthenticated } = require("../config/auth");

// TODO: This var is used for testing purpose -- delete
var USER = 2;

// Get Tinnies route
router.get("/getTinnies/", ensureAuthenticated, (req, res) => {
	// Getting user data and resolving.
	dbHelpers
		.getUserTinniesData(req.user.user_id)
		.then((userData) => res.json(userData))
		.catch((e) => {
			res.status(400).json({ error: e.message });
		});
});

// Drink tinnies route
router.post("/drinkTinnies/", ensureAuthenticated, (req, res) => {
	if (typeof req.body.drank !== typeof 1) {
		res.status(400).json({ error: "Drank must be a number" });
	}

	dbHelpers
		.getUserTinniesData(req.user.user_id)
		.then((userData) => {
			if (userData.tinnies >= req.body.drank) {
				dbHelpers
					.updateTinnies(userData.tinnies - req.body.drank)
					.then((didUpdate) => {
						if (didUpdate) {
							res.json({ success: `User drank ${req.body.drank} tinnie(s)` });
						} else {
							res.status(500).json({ error: "Error updating user tinnies" });
						}
					})
					.catch((e) => {
						console.log(e);
						res.status(500).json({ error: "Error updating user tinnies" });
					});
			} else {
				res.status(400).json({
					error: `User only has ${userData.tinnies} and cannot drink ${req.body.drank}`,
				});
			}
		})
		.catch((e) => {
			res.status(400).json({ error: e.message });
		});
});

// Add Tinnies - Adds to user's tinnies
router.post("/addTinnies/", (req, res) => {
	dbHelpers
		.getUserTinniesData(USER)
		.then((userData) => {
			dbHelpers
				.updateTinnies(userData.tinnies + req.body.newTinnies)
				.then((didUpdate) => {
					if (didUpdate) {
						res.json({
							success: `User now has ${
								userData.tinnies + req.body.newTinnies
							} tinnie(s)`,
						});
					} else {
						res.status(500).json({ error: "Error updating user tinnies" });
					}
				})
				.catch((e) => {
					console.log(e);
					res.status(500).json({ error: "Error updating user tinnies" });
				});
		})
		.catch((e) => {
			res.status(400).json({ error: e.message });
		});
});

module.exports = router;
