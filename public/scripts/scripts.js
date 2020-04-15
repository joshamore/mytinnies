// TODO: remove in production
const DOMAIN = "http://localhost:5000";

// NOTE: JS is written in an odd wasy to make the transiton to React easier.

// Calls to backend API
const getters = {
	getTinnies: async function () {
		const url = `${DOMAIN}/api/getTinnies`;

		try {
			let response = await fetch(url);
			if (response.redirected === true) {
				return Error("NO Auth");
			} else {
				return await response.json();
			}
		} catch (err) {
			console.error(err);
			return Error("Failed to get tinnies");
		}
	},
};

// Page renders
const renders = {
	tinniesCountDash: function () {
		const tinniesEl = document.getElementById("tinnies");

		if (tinniesEl !== null) {
			tinniesEl.onload = getters
				.getTinnies()
				.then((tinnies) => {
					document.getElementById(
						"tinnies"
					).innerHTML = `<h2>Ya Tinniez:</h2><div><p>${tinnies.tinnies}</p></div>`;
				})
				.catch((err) => {
					console.error(err.message);
				});
		}
	},
};

// Render events
if (window.location.href === `${DOMAIN}/dashboard`) {
	renders.tinniesCountDash();
}
