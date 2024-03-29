const express = require("express");
const router = express.Router();
const passport = require("passport");
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
						.then((newUser) => {
							req.flash(
								"success_msg",
								"You have registered. Welcome to MyTinnies!"
							);
							res.redirect("/users/login");
						})
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
		successRedirect: "/dashboard",
		failureRedirect: "/users/login",
		failureFlash: true,
	})(req, res, next);
});

// Login route
router.get("/login", (req, res) => {
	res.render("login");
});

// Logout handle
router.get("/logout", (req, res) => {
	// If user is currently logged in, logs them out
	if (req.isAuthenticated()) {
		req.logout();
		req.flash("success_msg", "You have logged out 👍");
		res.redirect("/users/login");
	} else {
		// Redirects user to homepage if they're not logged in
		res.redirect("/");
	}
});

module.exports = router;
