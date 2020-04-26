// TODO: Update in production
const DOMAIN = "http://localhost:5000";

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
	drinkTinnies: async function () {
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
					).innerHTML = `<h2>Ya Tinniez:</h2><div id="tinniesCount"><p class="text-info">${tinnies.tinnies}</p></div>`;
				})
				.catch((err) => {
					console.error(err.message);
				});
		}
	},
	errorAdd: function (errorMsg) {
		/*
			Renders an error message to DOM
		*/
		document.getElementById(
			"alertHouse"
		).innerHTML = `<div id="addAlert" class="alert alert-dismissible alert-danger">
		<button type="button" class="close" data-dismiss="alert">&times;</button>${errorMsg}</div>`;
	},
};

// Render events
if (window.location.href === `${DOMAIN}/dashboard`) {
	// Renders count of tinies on pageload of dashboard.
	renders.tinniesCountDash();

	// Drinks a tinnie on button click and rerenders the counter total.
	document.getElementById("smashTinnie").addEventListener("click", () => {
		// Stores audio of tinnie opening
		const smashTinnieSOUND = new Audio("/audio/tinnie.mp3");
		// Plays audio
		smashTinnieSOUND.play();

		// Updated tinnies DB count and rerenders count on page
		api.drinkTinnies().then((res) => {
			if (res) renders.tinniesCountDash();
		});
	});
}
if (window.location.href === `${DOMAIN}/add`) {
	document.getElementById("addTinnies").addEventListener("click", () => {
		const tinniesVal = document.getElementById("tinniesVal").value;
		console.log(parseInt(tinniesVal));

		// If value is invalid, triggering an error.
		if (tinniesVal < 1 || !tinniesVal) {
			renders.errorAdd("Invalid number of tinnies mate. Try again.");
		} else {
			// Updated tinnies in DB
			api.addTinnies(tinniesVal).then((reply) => {
				// redirects to dashboard
				window.location.href = `${DOMAIN}/dashboard`;
			});
		}
	});
}
