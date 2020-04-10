if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const { ensureAuthenticated } = require("./config/auth");

// Passport Config
require("./config/passport")(passport);

/*
	NOTE RE testing DB: 
		- User ID 1 has a plaintext password of: "reeeeeeeeeee"
		- User ID 2 has a plaintext password of: "cool stuff"
*/

// TODO: Below is for dev only remove before deploying
const sqlite3 = require("sqlite3").verbose();
// Create express server
const app = express();

// Adding body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Adding CORS middleware
app.use(cors());

// Adding express session middleware
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Index route
app.get("/", (req, res) => {
	// Testing that session is initialised and working.
	req.session.views = req.session.views + 1;
	res.send(`<h1>My Tinnies</h1> ${req.session.views}`);
});

// Routes
app.use("/users", require("./routes/users"));
app.use("/api", require("./routes/api"));

// Getting port from env or setting to 5000
const PORT = process.env.PORT || 5000;

// Starting server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
