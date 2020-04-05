import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import { List, ListItem } from "material-ui/List";
import RaisedButton from "material-ui/RaisedButton";

export class Confirm extends Component {
	// Moves to next step on continue click
	continue = (e) => {
		e.preventDefault();
		/*
            FETCH TEST WITH DUMMY ROUTE.
            TODO: Update to a create user route after this has been created.
        */
		fetch("http://localhost:5000/api/getTinnies/23")
			.then((data) => {
				this.props.nextStep();
			})
			.catch((e) => console.log(e.message + " reeeee!"));
		/*
            END OF FETCH TEST
        */
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
