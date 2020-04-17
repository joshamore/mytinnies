// TODO: remove in production
const DOMAIN = "http://localhost:5000";

// NOTE: JS is written in an odd wasy to make the transiton to React easier.

// Calls to backend API
const api = {
	getTinnies: async function () {
		/*
			@returns the tinnies table row for the current user.
		*/
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
		/*
			Reduces the current user's tinnies by 1.

			@returns a boolean of true if successful or false if fails
		*/
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
	addTinnies: async function (newTinnies) {
		/*
			@returns the new tinnies count
		*/
		const url = `${DOMAIN}/api/addTinnies`;

		try {
			let response = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ newTinnies: newTinnies }),
			});
			if (response.redirected === true) {
				return Error("NO Auth");
			} else {
				return await response.json();
			}
		} catch (err) {
			console.error(err);
			return Error("Failed to add tinnies");
		}
	},
};

// Page render functions
const renders = {
	tinniesCountDash: function () {
		/*
			Renders the current user's tinnies count to the dashboard.
		*/
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
	// Renders count of tinies on pageload of dashboard.
	renders.tinniesCountDash();

	// Drinks a tinnie on button click and rerenders the counter total.
	document.getElementById("smashTinnie").addEventListener("click", () => {
		api.drinkTinnie().then((res) => {
			if (res) renders.tinniesCountDash();
		});
	});
}

if (window.location.href === `${DOMAIN}/add`) {
	document.getElementById("addTinnies").addEventListener("click", () => {
		const tinniesVal = document.getElementById("tinniesVal").value;
		console.log(tinniesVal);

		if (tinniesVal < 1 || !tinniesVal) {
			//TODO
		}
	});
}
