const express = require("express");
const router = express.Router();
const passport = require("passport");
const { ensureAuthenticated } = require("../config/auth");
const userHelpers = require("../helpers/userHelpers");

// Create user handle
router.post("/register", (req, res) => {
	// Storing email and password from request body
	const { firstName, lastName, email, password } = req.body;

	// Confirming if user already exists
	userHelpers
		.checkUserExistsByEmail(email)
		.then((confirm) => {
			// If user already exists, respond with error
			if (confirm) {
				throw Error("Email address already registered");
			} else {
				// Creating new user
				userHelpers
					.createNewUser(firstName, lastName, email, password)
					.then((newUser) =>
						// TODO: This is a placeholder -- will need a different success response/process when
						// frontend exists.
						res.send({
							success: `New user created with ID ${newUser}`,
						})
					)
					.catch((err) => {
						throw Error(err);
					});
			}
		})
		.catch((err) => res.send({ error: err.message }));
});

// Login handle
router.post("/login", (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/users/login",
		failureRedirect: "/users/fail",
	})(req, res, next);
});

// Login success route
router.get("/login", (req, res) => {
	res.send("yeah all good mate");
});

// Logout handle
router.post("/logout", (req, res) => {
	req.logout();
	res.redirect("/users/logout");
});

// Logout route
router.get("/logout", (req, res) => {
	res.send("yeah mate, just left the pub");
});

// Auth test route
// Note: this route shows how you confirm auth (with ensureAuthenticated)
// TODO: delete when finshed with setup of passport/sessions
router.get("/auth", ensureAuthenticated, (req, res) => {
	res.send("AUTH YEAH");
});

module.exports = router;
