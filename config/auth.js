module.exports = {
	ensureAuthenticated: function (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			req.flash("error_msg", "🙅‍♂️ Please log in to access that page");
			res.redirect("/users/login");
		}
	},
};
