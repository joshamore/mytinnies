const { Pool, Client } = require("pg");
const LocalStrategy = require("passport-local").Strategy;
const userHelpers = require("../helpers/userHelpers");

// Connecting to PG database
const pool = new Pool({
	user: process.env.PG_USER,
	host: process.env.PG_URL,
	database: process.env.DB_NAME,
	password: process.env.PG_PASSWORD,
	port: process.env.PG_PORT,
});

module.exports = function (passport) {
	passport.use(
		new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
			// Getting record from users table
			pool.query(
				"SELECT * FROM users WHERE email=$1",
				[email],
				(err, userData) => {
					if (err) {
						console.log(err);
						return done(null, false, { message: "Issue with user. Failed." });
					} else if (userData.rowCount === 0) {
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
		})
	);

	passport.serializeUser((user, done) => {
		return done(null, user.user_id);
	});

	passport.deserializeUser((id, done) => {
		pool.query(
			"SELECT user_id, email FROM users WHERE user_id=$1",
			[id],
			(err, userData) => {
				if (err) {
					return done(null, false);
				} else if (userData.rowCount === 0) {
					return done(null, false);
				} else {
					return done(null, userData.rows[0]);
				}
			}
		);
	});
};
