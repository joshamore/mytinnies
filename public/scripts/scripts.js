const getters = {
	getTinnies: async function () {
		const url = "http://localhost:5000/api/getTinnies";

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

function authTest() {
	const url = "http://localhost:5000/users/auth";
	fetch(url);
}

document.onload = getters
	.getTinnies()
	.then((tinnies) => {
		document.getElementById("tinnies").innerHTML = tinnies.tinnies;
	})
	.catch((err) => {
		console.error(err.message);
	});
