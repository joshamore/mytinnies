// TODO: remove in production
const DOMAIN = "http://localhost:5000";

// NOTE: JS is written in an odd wasy to make the transiton to React easier.

// Calls to backend API
const api = {
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
	drinkTinnie: async function () {
		const url = `${DOMAIN}/api/drinkTinnies`;

		try {
			let response = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ drank: 1 }),
			});

			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	},
};

// Page render functions
const renders = {
	tinniesCountDash: function () {
		const tinniesEl = document.getElementById("tinnies");

		if (tinniesEl !== null) {
			tinniesEl.onload = api
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
	// Renders cunt of tinies on pageload of dashboard.
	renders.tinniesCountDash();

	// Drinks a tinnie on button click and rerenders the counter total.
	document.getElementById("smashTinnie").addEventListener("click", () => {
		api.drinkTinnie().then((res) => {
			if (res) renders.tinniesCountDash();
		});
	});
}
