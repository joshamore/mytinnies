const sqlite3 = require("sqlite3").verbose();
const { Pool, Client } = require("pg");

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
			// Connecting to PG database
			const pool = new Pool({
				user: process.env.PG_USER,
				host: process.env.PG_URL,
				database: process.env.DB_NAME,
				password: process.env.PG_PASSWORD,
				port: process.env.PG_PORT,
			});

			// Setting query
			const sql =
				"INSERT INTO users(first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *";

			// Creating record in users table
			pool.query(
				sql,
				[firstName, lastName, email, passwordHash],
				(err, userData) => {
					if (err) {
						console.log("error in user certaion.");
						pool.end();
						rej(Error("Unable to create users record"));
					} else if (userData.rowCount === 0) {
						rej(Error("Issue creating user record"));
					} else {
						pool.end();
						res(userData.rows[0].user_id);
					}
				}
			);

			// // Opening DB connection
			// let db = new sqlite3.Database(
			// 	"./MyTinnies.db",
			// 	sqlite3.OPEN_READWRITE,
			// 	(err) => {
			// 		if (err) {
			// 			rej(Error("Unable to open DB"));
			// 		} else {
			// 			console.log("Connected to the SQlite database.");
			// 		}
			// 	}
			// );

			// // Query to create user record
			// let sql =
			// 	'INSERT INTO users ("first_name", "last_name", "email", "password_hash") VALUES (?, ?, ?, ?)';

			// // Updating DB data and closing
			// db.run(sql, [firstName, lastName, email, passwordHash], function (err) {
			// 	if (err) {
			// 		db.close();
			// 		rej(Error("Unable to create user"));
			// 	} else {
			// 		db.close();
			// 		res(this.lastID);
			// 	}
			// });
		});
	},
	createUserTinniesRecord: (userID, tinnies) => {
		/*
			@args userID = the new user's ID
			@args tinnies = the number of tinnies for new user

			@returns a promise which will resolve with the tinnies record ID
		*/
		return new Promise((res, rej) => {
			// Connecting to PG database
			const pool = new Pool({
				user: process.env.PG_USER,
				host: process.env.PG_URL,
				database: process.env.DB_NAME,
				password: process.env.PG_PASSWORD,
				port: process.env.PG_PORT,
			});

			// Setting query
			const sql =
				"INSERT INTO tinnies(user_id, tinnies) VALUES ($1, $2) RETURNING *";

			// Creating record in tinnies table
			pool.query(sql, [userID, tinnies], (err, userData) => {
				if (err) {
					pool.end();
					rej(Error("Unable to create tinnies record"));
				} else if (userData.rowCount === 0) {
					rej(Error("Issue creating user record"));
				} else {
					pool.end();
					res(userData.rows[0].record_id);
				}
			});
			// // Opening DB connection
			// let db = new sqlite3.Database(
			// 	"./MyTinnies.db",
			// 	sqlite3.OPEN_READWRITE,
			// 	(err) => {
			// 		if (err) {
			// 			rej(Error("Unable to open DB"));
			// 		} else {
			// 			console.log("Connected to the SQlite database.");
			// 		}
			// 	}
			// );
			// // Query to create tinnies record
			// let sql = 'INSERT INTO tinnies ("user_id", "tinnies") VALUES (?, ?)';
			// // Updating DB data and closing
			// db.run(sql, [userID, tinnies], function (err) {
			// 	if (err) {
			// 		db.close();
			// 		rej(
			// 			Error("Unable to create tinnies record (probably exists already)")
			// 		);
			// 	} else {
			// 		db.close();
			// 		res(this.lastID);
			// 	}
			// });
		});
	},
	createUserHistoryRecord: function (userID, tinniesCount, posOrNeg) {
		/*
			@args userID = the user's ID
			@returns a promise with boolean true if successful or throws error
		*/

		return new Promise((res, rej) => {
			// Connecting to PG database
			const pool = new Pool({
				user: process.env.PG_USER,
				host: process.env.PG_URL,
				database: process.env.DB_NAME,
				password: process.env.PG_PASSWORD,
				port: process.env.PG_PORT,
			});

			// Creating unix timestamp as string
			const timestamp = Math.floor(Date.now() / 1000).toString();

			// Setting query
			const sql =
				'INSERT INTO history ("user_id", "datetime", "pos_or_neg", "history_tinnies_count") VALUES ($1, $2, $3, $4) RETURNING *';

			// Rejecting with error if invalid argument passed. Otherwise, adding record.
			if (posOrNeg > 1 || posOrNeg < -2 || posOrNeg === 0) {
				rej(Error("posOrNeg value (3rd arg) must be -1 or 1"));
			} else if (tinniesCount <= 0) {
				rej(Error("tinnies count must be a positive number" + tinniesCount));
			} else {
				// Inserting record into history table
				pool.query(
					sql,
					[userID, timestamp, posOrNeg, tinniesCount],
					(err, userData) => {
						if (err) {
							pool.end();
							rej(Error("Unable to create history record"));
						} else if (userData.rowCount === 0) {
							rej(Error("Issue creating history record"));
						} else {
							pool.end();
							res(true);
						}
					}
				);
			}

			// // Rejecting with error if invalid argument passed
			// if (posOrNeg > 1 || posOrNeg < -2 || posOrNeg === 0) {
			// 	rej(Error("posOrNeg value (3rd arg) must be -1 or 1"));
			// } else if (tinniesCount <= 0) {
			// 	rej(Error("tinnies count must be a positive number" + tinniesCount));
			// } else {
			// 	// Opening DB connection
			// 	let db = new sqlite3.Database(
			// 		"./MyTinnies.db",
			// 		sqlite3.OPEN_READWRITE,
			// 		(err) => {
			// 			if (err) {
			// 				rej(Error("Unable to open DB"));
			// 			} else {
			// 				console.log("Connected to the SQlite database.");
			// 			}
			// 		}
			// 	);

			// 	// Creating unix timestamp as string
			// 	const timestamp = Math.floor(Date.now() / 1000).toString();

			// 	// Query to create history record
			// 	let sql =
			// 		'INSERT INTO history ("user_id", "datetime", "pos_or_neg", "history_tinnies_count") VALUES (?, ?, ?, ?)';

			// 	// Updating DB data and closing
			// 	db.run(sql, [userID, timestamp, posOrNeg, tinniesCount], function (
			// 		err
			// 	) {
			// 		if (err) {
			// 			db.close();
			// 			rej(Error("Unable to create history record"));
			// 		} else {
			// 			db.close();
			// 			res(true);
			// 		}
			// 	});
			// }
		});
	},
	getUserTinniesData: (userID) => {
		/*
			@args userID = the user's ID

			@returns a promise which will resolve as an object containing the user's ID and tinnnies count.
		*/
		return new Promise((res, rej) => {
			// Connecting to PG database
			const pool = new Pool({
				user: process.env.PG_USER,
				host: process.env.PG_URL,
				database: process.env.DB_NAME,
				password: process.env.PG_PASSWORD,
				port: process.env.PG_PORT,
			});

			// Setting query
			const sql = "SELECT * FROM tinnies WHERE user_id=($1)";

			// Getting tinnies record
			pool.query(sql, [userID], (err, userData) => {
				if (err) {
					pool.end();
					rej(Error("Unable to access user tinnies record"));
				} else if (userData.rowCount === 0) {
					pool.end();
					rej(Error("No tinnies record"));
				} else {
					pool.end();
					res(userData.rows[0]);
				}
			});

			// // Opening DB connection
			// let db = new sqlite3.Database(
			// 	"./MyTinnies.db",
			// 	sqlite3.OPEN_READWRITE,
			// 	(err) => {
			// 		if (err) {
			// 			rej(Error("Unable to open DB"));
			// 		} else {
			// 			console.log("Connected to the SQlite database.");
			// 		}
			// 	}
			// );

			// // Query to get user data from DB
			// let sql = `SELECT * FROM tinnies WHERE user_ID=?`;

			// // Getting DB data and closing
			// db.get(sql, [userID], (err, row) => {
			// 	if (err) {
			// 		db.close();
			// 		rej(Error("Unable to access user"));
			// 	} else if (row === undefined) {
			// 		db.close();
			// 		rej(Error("User does not exist"));
			// 	} else {
			// 		db.close();
			// 		res(row);
			// 	}
			// });
		});
	},
	updateTinnies: (newTinnies, userID) => {
		/*
			@args newTinnies = the updated number of tinnies for the current user

			@returns a boolean promise with true if the update was successful or false if unsuccessful
		*/
		return new Promise((res, rej) => {
			// Connecting to PG database
			const pool = new Pool({
				user: process.env.PG_USER,
				host: process.env.PG_URL,
				database: process.env.DB_NAME,
				password: process.env.PG_PASSWORD,
				port: process.env.PG_PORT,
			});

			// Setting query
			const sql =
				"UPDATE tinnies SET tinnies = $1 WHERE user_id = $2 RETURNING *";

			// Setting tinnies record
			pool.query(sql, [newTinnies, userID], (err, userData) => {
				if (err) {
					pool.end();
					console.log(err);
					console.log(`Got this ID: ${userID} and this tinnies: ${newTinnies}`);
					rej(Error("Unable to access user tinnies record"));
				} else if (userData.rowCount === 0) {
					pool.end();
					rej(Error("Update failed"));
				} else {
					pool.end();
					// True if tinnies record matches argument.
					if (userData.rows[0].tinnies === newTinnies) {
						res(true);
					} else {
						res(false);
					}
				}
			});
			// // Opening DB connection
			// let db = new sqlite3.Database(
			// 	"./MyTinnies.db",
			// 	sqlite3.OPEN_READWRITE,
			// 	(err) => {
			// 		if (err) {
			// 			rej(Error("Unable to open DB"));
			// 		} else {
			// 			console.log("Connected to the SQlite database.");
			// 		}
			// 	}
			// );

			// // Query to update user's tinnnies
			// let sql = `UPDATE tinnies SET tinnies = ${newTinnies} WHERE user_id = ?`;

			// // Updating DB data and closing
			// db.run(sql, [user], (err) => {
			// 	if (err) {
			// 		db.close();
			// 		rej(Error("Unable to access user"));
			// 	} else {
			// 		db.close();
			// 		console.log(`New tinnies: ${newTinnies}`);
			// 		res(true);
			// 	}
			// });
		});
	},
	getUserFromEmail: (email) => {
		/*
			@args email = the user email address to retrieve from DB

			@returns an object promise containing the user's data or an empty array if no user exists
		*/
		return new Promise((res, rej) => {
			// Connecting to PG database
			const pool = new Pool({
				user: process.env.PG_USER,
				host: process.env.PG_URL,
				database: process.env.DB_NAME,
				password: process.env.PG_PASSWORD,
				port: process.env.PG_PORT,
			});

			// Setting query
			const sql = "SELECT * FROM users WHERE email=($1)";

			// Getting user's data
			pool.query(sql, [email], (err, userData) => {
				if (err) {
					pool.end();
					rej(Error("Unable to access user record"));
				} else {
					if (userData.rowCount === 0) {
						pool.end();
						res({ userNotFound: true });
					} else {
						pool.end();
						res(userData.rows[0]);
					}
				}
			});

			// // Opening DB connection
			// let db = new sqlite3.Database(
			// 	"./MyTinnies.db",
			// 	sqlite3.OPEN_READWRITE,
			// 	(err) => {
			// 		if (err) {
			// 			rej(Error("Unable to open DB"));
			// 		} else {
			// 			console.log("Connected to the SQlite database.");
			// 		}
			// 	}
			// );

			// // Query to get user data from DB from email address
			// let sql = `SELECT * FROM users WHERE email=?`;

			// // Getting DB data and closing
			// db.get(sql, [email], (err, row) => {
			// 	if (err) {
			// 		db.close();
			// 		rej(Error("Unable to access user record"));
			// 	} else if (row === undefined) {
			// 		db.close();
			// 		res({ userNotFound: true });
			// 	} else {
			// 		db.close();
			// 		res(row);
			// 	}
			// });
		});
	},
	getUserHistory: function (user_ID) {
		/*
			@args user_ID = the user's ID.

			@returns a promise that will resolve to an object containing the user's history
		*/
		return new Promise((res, rej) => {
			// Connecting to PG database
			const pool = new Pool({
				user: process.env.PG_USER,
				host: process.env.PG_URL,
				database: process.env.DB_NAME,
				password: process.env.PG_PASSWORD,
				port: process.env.PG_PORT,
			});

			// Setting query
			const sql = "SELECT * FROM history WHERE user_id=$1";

			// Getting user's history
			pool.query(sql, [user_ID], (err, userData) => {
				if (err) {
					pool.end();
					rej(Error("Unable to access user history record"));
				} else {
					pool.end();
					res(userData.rows);
				}
			});
			// // Opening DB connection
			// let db = new sqlite3.Database(
			// 	"./MyTinnies.db",
			// 	sqlite3.OPEN_READWRITE,
			// 	(err) => {
			// 		if (err) {
			// 			rej(Error("Unable to open DB"));
			// 		} else {
			// 			console.log("Connected to the SQlite database.");
			// 		}
			// 	}
			// );

			// // Query to get user history data from DB
			// let sql = `SELECT * FROM history WHERE user_id=?`;

			// // Getting DB data and closing
			// db.all(sql, [user_ID], (err, rows) => {
			// 	if (err) {
			// 		db.close();
			// 		rej(Error("Unable to access user record"));
			// 	} else if (rows === undefined) {
			// 		db.close();
			// 		res({ userNotFound: true });
			// 	} else {
			// 		db.close();
			// 		res(rows);
			// 	}
			// });
		});
	},
};
