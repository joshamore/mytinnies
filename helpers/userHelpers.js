const bcrypt = require("bcryptjs");
const dbHelpers = require("./dbHelpers");

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
	checkUserExistsByEmail: (email) => {
		/*
			@args email = the user email to confirm if it's in use
			
            @retrns a promise that will resolve with a bool true if user exists or false if not
        */
		return new Promise((res, rej) => {
			dbHelpers
				.getUserFromEmail(email)
				.then((user_res) => {
					if (user_res.userNotFound) {
						res(false);
					} else {
						res(true);
					}
				})
				.catch((err) => rej(Error(err)));
		});
	},
	createNewUser: async function (firstName, lastName, email, password) {
		/*
			@args firstName = the new user's first name
			@args lastName = the new user's last name
			@args email = the new user's email address
			@args password = the new user's password in plaintext

            @retrns a promise that will resolve with the new user's ID
        */
		try {
			// Hashing password
			const hashedPassword = await this.passwordHash(password);
			// Creating new user record
			const newUser = await dbHelpers.createNewUserRecord(
				firstName,
				lastName,
				email,
				hashedPassword
			);
			// Creating new tinnies table record
			const newTinniesRecord = await dbHelpers.createUserTinniesRecord(
				newUser,
				0
			);

			// returning new user's ID
			return newUser;
		} catch (err) {
			throw Error(err);
		}
	},
};
