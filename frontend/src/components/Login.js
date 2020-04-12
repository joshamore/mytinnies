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

	// Attempting login
	login = (e) => {
		e.preventDefault();

		// Setting form data to a URLSearchParams object
		const searchParamsForm = new URLSearchParams();
		searchParamsForm.set("email", this.state.email);
		searchParamsForm.set("password", this.state.password);

		// Submitting form
		fetch("http://localhost:5000/users/login/", {
			method: "POST",
			body: searchParamsForm,
		})
			.then((data) => {
				// TODO: this should redirect
				console.log(data);
			})
			.catch((e) => {
				// TODO: this should reroute to failed page or throw an alert
				console.log(e.message + " Failed!");
			});
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
