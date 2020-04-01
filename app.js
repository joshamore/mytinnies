const express = require("express");
const bodyParser = require("body-parser");

// TODO: Below is for dev only remove before deploying
const sqlite3 = require("sqlite3").verbose();
// TODO: This var is used for testing purpose -- delete
var USER = 23;

// Creates express server
const app = express();

// Adding body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
	// Getting user from param
	const user = parseInt(req.params.id);

	// Opening DB connection
	let db = new sqlite3.Database(
		"MyTinnies.db",
		sqlite3.OPEN_READWRITE,
		(err) => {
			if (err) {
				res.status(500).json({ error: "Database Error" });
			} else {
				console.log("Connected to the SQlite database.");
			}
		}
	);

	// Query to get usre data from DB
	let sql = `SELECT * FROM tinnies WHERE user_ID=?`;

	// Getting DB data and closing
	db.get(sql, [user], (err, row) => {
		if (err) {
			db.close();
			res.status(400).json({ error: "Error getting user" });
		} else if (row === undefined) {
			db.close();
			res.status(400).json({ error: "Error getting user" });
		} else {
			db.close();
			res.json(row);
		}
	});
});

// Drink tinnie  - Removes the number of drank tinnies from the DB entry for user
app.post("/api/drinkTinnie/", (req, res) => {
	// Opening DB connection
	let db = new sqlite3.Database(
		"MyTinnies.db",
		sqlite3.OPEN_READWRITE,
		(err) => {
			if (err) {
				res.status(500).json({ error: "Database Error" });
			} else {
				console.log("Connected to the SQlite database.");
			}
		}
	);

	// Query to get usre data from DB
	let sql = `SELECT tinnies FROM tinnies WHERE user_ID=?`;

	// Getting DB data and closing
	db.get(sql, [USER], (err, row) => {
		if (err) {
			db.close();
			res.status(400).json({ error: "Error getting user" });
		} else if (row === undefined) {
			db.close();
			res.status(400).json({ error: "Error getting user" });
		} else {
			db.close();
			if (row.tinnies >= req.body.drank) {
				dbHelpers
					.drinkTinnies(row.tinnies - req.body.drank)
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
					error: `User only has ${row.tinnies} and cannot drink ${req.body.drank}`,
				});
			}
		}
	});
});

// Add Tinnies - Adds to user's tinnies
app.post("/api/addTinnie/", (req, res) => {
	//
});

// Getting port from env or setting to 5000
const PORT = process.env.PORT || 5000;

// Starting server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

/*
----------- HELPER FUNCTIONS START -----------
*/
const dbHelpers = {
	drinkTinnies: (newTinnies) => {
		/*
			@args newTinnies = the updated number of tinnies for the current user
			@returns a boolean promise with true if the update was successful or false if unsuccessful
		*/
		return new Promise((res, rej) => {
			// Opening DB connection
			let db = new sqlite3.Database(
				"MyTinnies.db",
				sqlite3.OPEN_READWRITE,
				(err) => {
					if (err) {
						rej(Error("Unable to open DB"));
					} else {
						console.log("Connected to the SQlite database.");
					}
				}
			);

			// Query to update user's tinnnies
			let sql = `UPDATE tinnies SET tinnies = ${newTinnies} WHERE user_id = ?`;

			// Updating DB data and closing
			db.run(sql, [USER], (err) => {
				if (err) {
					db.close();
					rej(Error("Unable to access user"));
				} else {
					db.close();
					console.log(`New tinnies: ${newTinnies}`);
					res(true);
				}
			});
		});
	},
};
/*
----------- HELPER FUNCTIONS End -----------
*/
