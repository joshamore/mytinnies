const express = require("express");
// TODO: Below is for dev only remove before deploying
const sqlite3 = require("sqlite3").verbose();

// Creates express server
const app = express();

// Index route
app.get("/", (req, res) => {
	res.send("<h1>My Tinnies</h1>");
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
let db = new sqlite3.Database("MyTinnies.db", sqlite3.OPEN_READWRIT, err => {
	if (err) {
		return console.error(err.message);
	} else {
		console.log("Connected to the in-memory SQlite database.");
	}
});

// SQL query
let sql = "SELECT * FROM tinnies WHERE user_ID=23";

// Getting each row
db.each(sql, (err, row) => {
	if (err) {
		console.error("REEE");
	}
	console.log(`User ${row.user_id} has ${row.tinnies} tinnies`);
});

db.close(err => {
	if (err) {
		console.error(err.message);
	}
	console.log("Close the database connection.");
});
