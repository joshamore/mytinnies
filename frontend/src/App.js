import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import RegisterUserForm from "./components/RegisterUserForm";
import Index from "./components/Index";
import Login from "./components/Login";

function App() {
	return (
		<Router>
			<div className="App">
				<Switch>
					<Route path="/" exact component={Index} />
					<Route path="/register" exact component={RegisterUserForm} />
					<Route path="/login" exact component={Login} />
				</Switch>
			</div>
		</Router>
	);
}

export default App;
