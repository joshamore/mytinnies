const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

USER = {
	email: "bob@example.com",
	password_plain:
		"$2a$10$ob7sWNAfJPPq5SnBJazcyuUJ0BAXFSMeagqwxwuuhcKOZ7LD02OHa",
	password_hash: "reeeeeeeeeee",
};

module.exports = function (passport) {
	passport.use(
		new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
			// Matching user - Note: will need to call db, but dor now it's just
			// checking the array USER
			if (email !== USER.email) {
				return done(null, false, { message: "User email does not exist" });
			}

			// Matching password -- first arg is plaintext password and second is encrypted
			bcrypt.compare(password, USER.password_hash, (err, isMatch) => {
				// Throws error if an error exists.
				if (err) throw err;

				// isMatch is a boolean -- true if matches or false if not
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: "Password invalid" });
				}
			});
		})
	);
};
