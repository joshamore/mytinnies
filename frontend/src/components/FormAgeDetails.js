import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";

export class FormAgeDetails extends Component {
	// Moves to next step on continue click
	continue = (e) => {
		e.preventDefault();
		this.props.nextStep();
	};

	// Moves to prev step on continue click
	back = (e) => {
		e.preventDefault();
		this.props.prevStep();
	};

	render() {
		const { values, handleChange } = this.props;
		return (
			<MuiThemeProvider>
				<React.Fragment>
					<AppBar title="Age Details 🍺" />
					<TextField
						hintText="Enter your Age"
						foatingLabelText="Age"
						onChange={handleChange("age")}
						defaultValue={values.age}
					/>
					<br />
					<RaisedButton
						label="Continue"
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

export default FormAgeDetails;
