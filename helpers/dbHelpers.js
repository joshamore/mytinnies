const sqlite3 = require("sqlite3").verbose();

// TODO: This var is used for testing purpose -- delete
var USER = 2;

module.exports = {
	getUserData: (userID) => {
		/*
			@args userID = the user's ID
			@returns a promise which will resolve as an object containing the user's ID and tinnnies count.
		*/
		return new Promise((res, rej) => {
			// Opening DB connection
			let db = new sqlite3.Database(
				"./MyTinnies.db",
				sqlite3.OPEN_READWRITE,
				(err) => {
					if (err) {
						rej(Error("Unable to open DB"));
					} else {
						console.log("Connected to the SQlite database.");
					}
				}
			);

			// Query to get user data from DB
			let sql = `SELECT * FROM tinnies WHERE user_ID=?`;

			// Getting DB data and closing
			db.get(sql, [userID], (err, row) => {
				if (err) {
					db.close();
					rej(Error("Unable to access user"));
				} else if (row === undefined) {
					db.close();
					rej(Error("User does not exist"));
				} else {
					db.close();
					res(row);
				}
			});
		});
	},
	updateTinnies: (newTinnies) => {
		/*
			@args newTinnies = the updated number of tinnies for the current user
			@returns a boolean promise with true if the update was successful or false if unsuccessful
		*/
		return new Promise((res, rej) => {
			// Opening DB connection
			let db = new sqlite3.Database(
				"./MyTinnies.db",
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
