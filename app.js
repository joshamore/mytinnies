const express = require("express");
const bodyParser = require("body-parser");
const dbHelpers = require("./helpers/dbHelpers");
const cors = require("cors");
const bcrypt = require("bcryptjs");

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

// Index route
app.get("/", (req, res) => {
	res.send("<h1>My Tinnies</h1>");
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

/*******************
 * TESTING BCRYPT
 *******************/
// takes plaintext and returns encrypted hash
const bcryptHashTest = (plaintext) => {
	return new Promise((res, rej) => {
		// outer function generates salt
		bcrypt.genSalt(10, (err, salt) => {
			// checking if error
			if (err) {
				rej(Error("unable to salt"));
			}
			// Uses generated salt to hash provided plaintext
			bcrypt.hash(plaintext, salt, (err, hash) => {
				if (err) {
					rej(Error("unable to hash"));
				} else {
					res(hash);
				}
			});
		});
	});
};

// Compares a hashed string to a plaintext string
const bcryptCompreTest = (plaintext, hash) => {
	return new Promise((res, rej) => {
		bcrypt
			.compare(plaintext, hash)
			.then((isMatch) => {
				res(isMatch);
			})
			.catch((e) => rej(Error(e)));
	});
};

// Testing above two functions
const plain = "reeeeeeeeeee";
bcryptHashTest(plain)
	.then((res) => {
		bcryptCompreTest(plain, res)
			.then((isMatch) => console.log(isMatch))
			.catch((e) => console.log("cunt"));
	})
	.catch((e) => console.log(e));
