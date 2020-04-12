import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import RegisterUserForm from "./components/RegisterUserForm";
import Index from "./components/Index";

function App() {
	return (
		<Router>
			<div className="App">
				<Switch>
					<Route path="/" exact component={Index} />
					<Route path="/register" exact component={RegisterUserForm} />
				</Switch>
			</div>
		</Router>
	);
}

export default App;
