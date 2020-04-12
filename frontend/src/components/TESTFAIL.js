import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";

export class TESTFAIL extends Component {
	render() {
		return (
			<MuiThemeProvider>
				<React.Fragment>
					<AppBar title="FAIL" />
				</React.Fragment>
			</MuiThemeProvider>
		);
	}
}

export default TESTFAIL;
