const sqlite3 = require("sqlite3").verbose();
const LocalStrategy = require("passport-local").Strategy;
const userHelpers = require("../helpers/userHelpers");

// Opening DB connection
let db = new sqlite3.Database(
	"./MyTinnies.db",
	sqlite3.OPEN_READWRITE,
	(err) => {
		if (err) {
			throw err;
		} else {
			console.log("Connected to the SQlite database.");
		}
	}
);

module.exports = function (passport) {
	passport.use(
		new LocalStrategy((email, password, done) => {
			// Checking if user's email exists in DB.
			db.get("SELECT * FROM users WHERE email = ?", email, (err, row) => {
				if (!row) {
					return done(null, false, { message: "User email not found" });
				} else {
					// Checking if password hash matches
					userHelpers
						.passwordHash(password)
						.then((res, rej) => {
							db.get(
								"SELECT email, user_id FROM users WHERE email = ? AND password_hash = ?",
								email,
								res,
								(err, row) => {
									if (err) throw err;

									if (!row) {
										return done(null, false, { message: "Password incorrect" });
									} else {
										return done(null, row);
									}
								}
							);
						})
						.catch((err) => {
							throw err;
						});
				}
			});
		})
	);

	passport.serializeUser(function (user, done) {
		return done(null, user.user_id);
	});

	passport.deserializeUser(function (id, done) {
		db.get(
			"SELECT user_id, email FROM users WHERE user_id = ?",
			id,
			(err, row) => {
				if (!row) {
					return done(null, false);
				} else {
					return done(null, row);
				}
			}
		);
	});
};
