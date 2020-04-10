module.exports = {
	ensureAuthenticated: function (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			console.log("Attempted to access content that requires login.");
			res.redirect("/fail");
		}
	},
};
