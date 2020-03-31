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

// Get Tinnies route -- Returns current number of tinnies for a user
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

// Drink tinnie route
app.post("/api/drinkTinnie/", (req, res) => {
	// Remove number of tinnies from the DB
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
				console.log(`Yeah mate we got ${row.tinnies}`);
				console.log(dbHelpers.drinkTinnies(row.tinnies - req.body.drank));
			} else {
				console.log(`Nah mate we got ${req.body.drank}`);
			}
		}
	});

	console.log(req.body.drank);
	res.send("Good");
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
			@args newTinnies = the updated number of tinnies
		*/
		// Opening DB connection
		let db = new sqlite3.Database(
			"MyTinnies.db",
			sqlite3.OPEN_READWRITE,
			(err) => {
				if (err) {
					return false;
				} else {
					console.log("11Connected to the SQlite database.");
				}
			}
		);

		// Query to get usre data from DB
		let sql = `UPDATE tinnies SET tinnies = ${newTinnies} WHERE user_id = ?`;

		// Updating DB data and closing
		db.run(sql, [USER], (err) => {
			if (err) {
				db.close();
				return false;
			} else {
				db.close();
				return true;
			}
		});
	},
};
/*
----------- HELPER FUNCTIONS End -----------
*/

// DB testing

//Creating a CLI mock of app.

// console.log("Did you by a slab of tinnies? [Y/N]");

// rl.on("line", input => {
// 	if (input === "y") {
// 		mock.getTinnies().then(answer => console.log(`Sick cunt ${answer}`));
// 	} else {
// 		console.log("nerd");
// 	}
// });

// mock = {
// 	getTinnies: () => {
// 		rl.question("How many tinnes bro?", answer => {
// 			// Closing readline stream.
// 			rl.close();

// 			return parseInt(answer);
// 		});
// 	},
// 	addTinnies: () => {
// 		let db = new sqlite3.Database(
// 			"MyTinnies.db",
// 			sqlite3.OPEN_READWRIT,
// 			err => {
// 				if (err) {
// 					return console.error("Error");
// 				} else {
// 					console.log("Connected to the SQlite database.");
// 				}
// 			}
// 		);

// 		// SQL query
// 		let sql = `SELECT * FROM tinnies WHERE user_ID=?`;

// 		// Getting each row -- note: second arg [USER] is passing the ID into the SQL query.
// 		db.get(sql, [USER], (err, row) => {
// 			if (err) {
// 				console.error("REEE");
// 			} else if (row === undefined) {
// 				console.error("Also REEE");
// 			} else {
// 				console.log(row);
// 			}
// 		});

// 		db.close(err => {
// 			if (err) {
// 				console.error(err.message);
// 			}
// 			console.log("Close the database connection.");
// 		});
// 	}
// };
