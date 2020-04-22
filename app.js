const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");

// DOTENV Config
require("dotenv").config();

// Passport Config
require("./config/passport")(passport);

/*
	NOTE RE testing DB: 
		- User ID 1 has a plaintext password of: "reeeeeeeeeee"
		- User ID 2 has a plaintext password of: "cool stuff"

	in PG:
	user 1 password = testybruhyas
*/

// TODO: Below is for dev only remove before deploying
const sqlite3 = require("sqlite3").verbose();
// Create express server
const app = express();

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// EJS middleware
app.use(expressLayouts);
app.set("view engine", "ejs");

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS middleware
app.use(cors());

// Express session middleware
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

// Flash middleware
app.use(flash());

// Global flash variables
app.use((req, res, next) => {
	res.locals.success_msg = req.flash("success_msg");
	res.locals.error_msg = req.flash("error_msg");
	res.locals.error = req.flash("error");
	next();
});

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/api", require("./routes/api"));

// Getting port from env or setting to 5000
const PORT = process.env.PORT || 5000;

// Starting server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

/////////////// Testing for pg
const dbHelpers = require("./helpers/dbHelpers");

dbHelpers
	.createUserTinniesRecord(6, 99)
	.then((data) => {
		console.log(data);
	})
	.catch((err) => console.log(err));
