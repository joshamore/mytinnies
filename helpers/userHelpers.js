const bcrypt = require("bcryptjs");

module.exports = {
	passwordHash: (plaintext) => {
		/*
            @args plaintext = plaintext user password.
            @returns a promise that will resolve with a hashed password (safe to store in DB)
        */
		return new Promise((res, rej) => {
			// Generates salt
			bcrypt.genSalt(10, (err, salt) => {
				// checking if error with salt
				if (err) {
					rej(Error("Unable to generate salt"));
				}
				// Uses generated salt to hash provided password
				bcrypt.hash(plaintext, salt, (err, hash) => {
					if (err) {
						rej(Error("Unable to hash"));
					} else {
						res(hash);
					}
				});
			});
		});
	},
	passwordHashCompare: (plaintext, hash) => {
		/*
            @args plaintext = the plaintext password to be compared
            @args hash = the hashed password to comapare with the plaintext password
            @retrns a promise that will resolve with a bool true if passwords match or false if not
        */
		return new Promise((res, rej) => {
			bcrypt
				.compare(plaintext, hash)
				.then((isMatch) => {
					res(isMatch);
				})
				.catch((e) => rej(Error(e)));
		});
	},
};