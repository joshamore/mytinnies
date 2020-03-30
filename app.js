const express = require("express");

// TODO: Below is for dev only remove before deploying
const sqlite3 = require("sqlite3").verbose();
// TODO: This var is used for testing purpose -- delete
var USER = 23;

// Creates express server
const app = express();

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
	let db = new sqlite3.Database("MyTinnies.db", sqlite3.OPEN_READWRITE, err => {
		if (err) {
			res.status(500).json({ error: "Database Error" });
		} else {
			console.log("Connected to the SQlite database.");
		}
	});

	// Query to get usre data from DB
	let sql = `SELECT * FROM tinnies WHERE user_ID=?`;

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

app.post("/api/drinkTinnie/", (req, res) => {
	// Remove one tinnie for user
	// TODO
});

// Getting port from env or setting to 5000
const PORT = process.env.PORT || 5000;

// Starting server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

/*
----------- HELPER FUNCTIONS START -----------
*/
let todo;
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
