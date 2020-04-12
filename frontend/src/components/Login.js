import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";

export class Login extends Component {
	state = {
		email: "",
		password: "",
	};

	// Handle field change
	handleChange = (input) => (e) => {
		this.setState({ [input]: e.target.value });
	};

	// Attempts to log in
	login = (e) => {
		e.preventDefault();

		// TODO: fix the below -- this is not sending the data to the server (seems to be an issue with fetch POST method)
		// Creating a form object
		let formData = new FormData();
		formData.append("email", this.state.email);
		formData.append("password", this.state.password);

		console.log(formData);
		fetch("http://localhost:5000/users/login/", {
			method: "POST",
			body: formData,
		})
			.then((dataProm) => {
				dataProm
					.json()
					.then((data) => {
						// Printing success message to console.
						console.log(data);
					})
					.catch((e) => {
						throw e;
					});
			})
			.catch((e) => console.log(e.message + " reeeee!"));
	};

	render() {
		return (
			<MuiThemeProvider>
				<React.Fragment>
					<AppBar title="Log in" />
					<TextField
						hintText="Your email address"
						foatingLabelText="Email"
						onChange={this.handleChange("email")}
						defaultValue=""
					/>
					<br />
					<TextField
						hintText="Enter a new password"
						foatingLabelText="password"
						type="password"
						onChange={this.handleChange("password")}
						defaultValue=""
					/>
					<br />
					<RaisedButton
						label="Log in"
						primary={true}
						style={styles.button}
						onClick={this.login}
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

export default Login;
