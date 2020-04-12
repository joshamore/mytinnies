import React, { Component } from "react";
import FormUserDetails from "./FormUserDetails";
import FormAgeDetails from "./FormAgeDetails";
import Confirm from "./Confirm";
import Success from "./Success";

export class RegisterUserForm extends Component {
	state = {
		step: 1,
		firstName: "",
		password: "",
		lastName: "",
		email: "",
		age: 18,
	};

	// Proceed to the next step
	nextStep = () => {
		const { step } = this.state;

		this.setState({
			step: step + 1,
		});
	};

	// Go back a step
	prevStep = () => {
		const { step } = this.state;
		this.setState({
			step: step - 1,
		});
	};

	// Handle field change
	handleChange = (input) => (e) => {
		this.setState({ [input]: e.target.value });
	};

	render() {
		// Destructures and creates a variable with current step
		const { step } = this.state;
		// Destructures and creates a variable with current entered data
		const { firstName, lastName, email, age, password } = this.state;
		// Destructures values into array to make passing into components easier
		const values = { firstName, lastName, email, age, password };

		// Rendering component based on step
		switch (step) {
			case 1:
				return (
					<FormUserDetails
						nextStep={this.nextStep}
						handleChange={this.handleChange}
						values={values}
					/>
				);
			case 2:
				return (
					<FormAgeDetails
						nextStep={this.nextStep}
						prevStep={this.prevStep}
						handleChange={this.handleChange}
						values={values}
					/>
				);
			case 3:
				return (
					<Confirm
						nextStep={this.nextStep}
						prevStep={this.prevStep}
						values={values}
					/>
				);
			case 4:
				return <Success />;

			default:
				return <RegisterUserForm />;
		}
	}
}

export default RegisterUserForm;
