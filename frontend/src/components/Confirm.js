import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import { List, ListItem } from "material-ui/List";
import RaisedButton from "material-ui/RaisedButton";

export class Confirm extends Component {
	// Moves to next step on continue click
	continue = (e) => {
		// Prevents default form trigger
		e.preventDefault();
		const {
			values: { firstName, lastName, email, password },
		} = this.props;

		// Sending fetch request to register route
		fetch("http://localhost:5000/users/register/", {
			method: "POST",
			body: JSON.stringify({
				firstName: firstName,
				lastName: lastName,
				email: email,
				password: password,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((dataProm) => {
				dataProm
					.json()
					.then((data) => console.log(data))
					.catch((e) => {
						throw e;
					});

				this.props.nextStep();
			})
			.catch((e) => console.log(e.message + " reeeee!"));

		// this.props.nextStep();
	};

	// Moves to prev step on continue click
	back = (e) => {
		e.preventDefault();
		this.props.prevStep();
	};

	render() {
		const {
			values: { firstName, lastName, email, age },
		} = this.props;
		return (
			<MuiThemeProvider>
				<React.Fragment>
					<AppBar title="Confirm Your Deets 👍🏻" />
					<List>
						<ListItem primaryText="First Name" secondaryText={firstName} />
						<ListItem primaryText="Last Name" secondaryText={lastName} />
						<ListItem primaryText="Email" secondaryText={email} />
						<ListItem primaryText="Password" secondaryText="🙊" />
						<ListItem primaryText="Age" secondaryText={age} />
					</List>
					<br />
					<RaisedButton
						label="Confirm & Continue"
						primary={true}
						style={styles.button}
						onClick={this.continue}
					/>
					<RaisedButton
						label="Back"
						primary={false}
						style={styles.button}
						onClick={this.back}
					/>
				</React.Fragment>
			</MuiThemeProvider>
		);
	}
}

const styles = {
	button: {
		margin: 15,
	},
};

export default Confirm;
