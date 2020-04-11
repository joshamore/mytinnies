const sqlite3 = require("sqlite3").verbose();

module.exports = {
	createNewUserRecord: (firstName, lastName, email, passwordHash) => {
		/*
			@args firstName = the new user's first name
			@args lastName = the new user's last name
			@args email = the new user's email
			@args passwordHash = the new user's hashed password
			@returns a promise which will resolve as an object containing the user's new ID
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

			// Query to create user record
			let sql =
				'INSERT INTO users ("first_name", "last_name", "email", "password_hash") VALUES (?, ?, ?, ?)';

			// Updating DB data and closing
			db.run(sql, [firstName, lastName, email, passwordHash], function (err) {
				if (err) {
					db.close();
					rej(Error("Unable to create user"));
				} else {
					db.close();
					res(this.lastID);
				}
			});
		});
	},
	getUserTinniesData: (userID) => {
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
	updateTinnies: (newTinnies, user) => {
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
			db.run(sql, [user], (err) => {
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
	getUserFromEmail: (email) => {
		/*
			@args email = the user email address to retrieve from DB
			@returns an object promise containing the user's data or object with userNotFound = true
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

			// Query to get user data from DB from email address
			let sql = `SELECT * FROM users WHERE email=?`;

			// Getting DB data and closing
			db.get(sql, [email], (err, row) => {
				if (err) {
					db.close();
					rej(Error("Unable to access user record"));
				} else if (row === undefined) {
					db.close();
					res({ userNotFound: true });
				} else {
					db.close();
					res(row);
				}
			});
		});
	},
};
