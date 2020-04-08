const LocalStrategy = require("passport-local").Strategy;
const userHelpers = require("./helpers/userHelpers");

/*
    Guide for SQLITE setup: https://stackoverflow.com/questions/23481817/node-js-passport-autentification-with-sqlite
*/

// Will need to
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
		})
	);
};
