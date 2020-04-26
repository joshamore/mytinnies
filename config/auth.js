module.exports = {
	// Confirms if user is logged in. If not, redirects to login screen with flash message.
	ensureAuthenticated: function (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			req.flash("error_msg", "🙅‍♂️ Please log in to access that page");
			res.redirect("/users/login");
		}
	},
};
