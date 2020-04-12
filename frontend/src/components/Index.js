import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";

export class Index extends Component {
	render() {
		return (
			<MuiThemeProvider>
				<React.Fragment>
					<AppBar title="MyTinnies 🥫" />
				</React.Fragment>
			</MuiThemeProvider>
		);
	}
}

export default Index;
