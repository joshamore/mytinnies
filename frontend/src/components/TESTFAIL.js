import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";

export class TESTFAIL extends Component {
	render() {
		return (
			<MuiThemeProvider>
				<React.Fragment>
					<AppBar title="FAIL 😞" />
					<h1> Failed to do what you attmempted. Better luck next time!</h1>
				</React.Fragment>
			</MuiThemeProvider>
		);
	}
}

export default TESTFAIL;
