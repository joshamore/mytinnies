const express = require("express");
const router = express.Router();

// Logout Handle Route
router.post("/logout", (req, res) => {
	req.logout();
	res.redirect("/users/logout");
});

// Logout test route
router.get("/logout", (req, res) => {
	res.send("yeah mate, just left the pub");
});

module.exports = router;
