const { Pool, Client } = require("pg");
const LocalStrategy = require("passport-local").Strategy;
const userHelpers = require("../helpers/userHelpers");

module.exports = function (passport) {
	// Connecting to PG database
	const pool = new Pool({
		user: process.env.PG_USER,
		host: process.env.PG_URL,
		database: process.env.DB_NAME,
		password: process.env.PG_PASSWORD,
		port: process.env.PG_PORT,
	});
	passport.use(
		new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
			// Creating record in users table
			pool.query(
				"SELECT * FROM users WHERE email=$1",
				[email],
				(err, userData) => {
					if (err) {
						pool.end();
						console.log(err);
						return done(null, false, { message: "Issue with user. Failed." });
					} else if (userData.rowCount === 0) {
						pool.end();
						return done(null, false, { message: "User email not found" });
					} else {
						// Validating password
						userHelpers
							.passwordHashCompare(password, userData.rows[0].password_hash)
							.then((isMatch) => {
								if (!isMatch) {
									return done(null, false, { message: "Password incorrect" });
								} else {
									return done(null, {
										email: userData.rows[0].email,
										user_id: userData.rows[0].user_id,
									});
								}
							});
					}
				}
			);
			// // Checking if user's email exists in DB.
			// db.get("SELECT * FROM users WHERE email = ?", email, (err, row) => {
			// 	if (!row) {
			// 		return done(null, false, { message: "User email not found" });
			// 	} else {
			// 		// Checking if password matches
			// 		userHelpers
			// 			.passwordHashCompare(password, row.password_hash)
			// 			.then((isMatch) => {
			// 				if (!isMatch) {
			// 					return done(null, false, { message: "Password incorrect" });
			// 				} else {
			// 					return done(null, { email: row.email, user_id: row.user_id });
			// 				}
			// 			})
			// 			.catch((err) => {
			// 				throw err;
			// 			});
			// 	}
			// });
		})
	);

	passport.serializeUser((user, done) => {
		return done(null, user.user_id);
	});

	passport.deserializeUser((id, done) => {
		// Connecting to PG database
		const pool = new Pool({
			user: process.env.PG_USER,
			host: process.env.PG_URL,
			database: process.env.DB_NAME,
			password: process.env.PG_PASSWORD,
			port: process.env.PG_PORT,
		});

		pool.query(
			"SELECT user_id, email FROM users WHERE user_id=$1",
			[id],
			(err, userData) => {
				if (err) {
					pool.end();
					return done(null, false);
				} else if (userData.rowCount === 0) {
					pool.end();
					return done(null, false);
				} else {
					pool.end();
					return done(null, userData.rows[0]);
				}
			}
		);
		// db.get(
		// 	"SELECT user_id, email FROM users WHERE user_id = ?",
		// 	id,
		// 	(err, row) => {
		// 		if (!row) {
		// 			return done(null, false);
		// 		} else {
		// 			return done(null, row);
		// 		}
		// 	}
		// );
	});
};
