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
		});
	},
	createUserTinniesRecord: (userID, tinnies) => {
		/*
			@args userID = the new user's ID
			@args tinnies = the number of tinnies for new user

			@returns a promise which will resolve with the tinnies record ID. Otherwise, throws error.
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
		});
	},
	getUserFromEmail: (email) => {
		/*
			@args email = the user email address to retrieve from DB

			@returns an object promise containing the user's data or an object with userNotFound === true
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
		});
	},
	getUserHistory: function (user_ID) {
		/*
			@args user_ID = the user's ID.

			@returns a promise that will resolve to an object containing the user's history rows
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
		});
	},
};
