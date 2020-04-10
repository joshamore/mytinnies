if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const dbHelpers = require("./helpers/dbHelpers");
const passport = require("passport");
const cors = require("cors");
const { ensureAuthenticated } = require("./config/auth");

// Passport Config
require("./config/passport")(passport);

/*
	NOTE RE testing DB: 
		- User ID 1 has a plaintext password of: "reeeeeeeeeee"
		- User ID 2 has a plaintext password of: "cool stuff"
*/

// TODO: Below is for dev only remove before deploying
const sqlite3 = require("sqlite3").verbose();
// TODO: This var is used for testing purpose -- delete
var USER = 23;

// Creates express server
const app = express();

// Adding body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Adding CORS middleware
app.use(cors());

// Adding express session middleware
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Index route
app.get("/", (req, res) => {
	// Testing that session is initialised and working.
	req.session.views = req.session.views + 1;
	res.send(`<h1>My Tinnies</h1> ${req.session.views}`);
});

// Routes
app.use("/users", require("./routes/users"));

// Success test route
app.get("/in", (req, res) => {
	res.send("yeah all good mate");
});

// Auth test route
app.get("/auth", ensureAuthenticated, (req, res) => {
	res.send("AUTH YEAH");
});

// Login route
app.post("/login", (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/in",
		failureRedirect: "/fail",
	})(req, res, next);
});

// Get Tinnies route - Returns current number of tinnies for a user
app.get("/api/getTinnies/:id", (req, res) => {
	/*
        TODO: unsure how to handle ID auth at this point.
        Probably won't be via an ID in the GET url outside of testing
    */
	// Getting user data and resolving.
	dbHelpers
		.getUserData(parseInt(req.params.id))
		.then((userData) => res.json(userData))
		.catch((e) => {
			res.status(400).json({ error: e.message });
		});
});

// Drink tinnie  - Removes the number of drank tinnies from the DB entry for user
app.post("/api/drinkTinnies/", (req, res) => {
	dbHelpers
		.getUserData(USER)
		.then((userData) => {
			console.log(typeof req.body.drank);
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
app.post("/api/addTinnies/", (req, res) => {
	dbHelpers
		.getUserData(USER)
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

// Getting port from env or setting to 5000
const PORT = process.env.PORT || 5000;

// Starting server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
