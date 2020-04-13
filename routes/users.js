const express = require("express");
const router = express.Router();
const passport = require("passport");
const { ensureAuthenticated } = require("../config/auth");
const userHelpers = require("../helpers/userHelpers");

// Register user handle
router.post("/register", (req, res) => {
	// Storing email and password from request body
	const { firstName, lastName, email, password, password2 } = req.body;

	// Storing any errors
	let errors = [];

	// Checking required fields aren't blank
	if (!firstName || !lastName || !email || !password || !password2) {
		errors.push({ msg: "Please fill in all fields" });
	}

	// Validates that both passwords match
	if (password !== password2) {
		errors.push({ msg: "Passwords must match" });
	}

	// Validate password length
	if (password.length < 6) {
		errors.push({ msg: "Password must be at least 6 characters" });
	}

	// Rerendering with errors if any present or continuing to DB calls
	if (errors.length > 0) {
		res.render("register", {
			errors,
			firstName,
			lastName,
			email,
			password,
			password2,
		});
	} else {
		// Confirming if user already exists
		userHelpers
			.checkUserExistsByEmail(email)
			.then((confirm) => {
				// If user already exists, add error
				if (confirm) {
					errors.push({ msg: "Email already registered" });

					res.render("register", {
						errors,
						firstName,
						lastName,
						email,
						password,
						password2,
					});
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
							res.send({ error: err.message });
						});
				}
			})
			.catch((err) => res.send({ error: err.message }));
	}
});

// Register route
router.get("/register", (req, res) => {
	res.render("register");
});

// Login handle
router.post("/login", (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/users/login",
		failureRedirect: "/users/fail",
	})(req, res, next);
});

// Login route
router.get("/login", (req, res) => {
	res.render("login");
});

// Logout handle
router.post("/logout", (req, res) => {
	// If user is currently logged in, logs them out
	if (req.isAuthenticated()) {
		req.logout();
		res.redirect("/users/logout");
	} else {
		// Redirects user to homepage if they're not logged in
		res.redirect("/");
	}
});

// Logout route
router.get("/logout", (req, res) => {
	res.send("yeah mate, just left the pub");
});

// Auth test route
// Note: this route shows how you confirm auth (with ensureAuthenticated)
// TODO: delete when finshed with setup of passport/sessions
router.get("/auth", ensureAuthenticated, (req, res) => {
	console.log("good");
	res.send("AUTH YEAH");
});

module.exports = router;
