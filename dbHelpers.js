const sqlite3 = require("sqlite3").verbose();

// TODO: This var is used for testing purpose -- delete
var USER = 23;

module.exports = {
	updateTinnies: (newTinnies) => {
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
