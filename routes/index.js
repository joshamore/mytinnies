const express = require("express");
const router = express.Router();
const passport = require("passport");

// Index route
router.get("/", (req, res) => {
	// TODO: update
	res.render("welcome");
});

module.exports = router;
