import React, { useState, useContext } from 'react';
import {
	Alert,
	Button,
	Label,
	Input,
	Form,
	FormGroup,
	FormFeedback,
} from 'reactstrap';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import styles from './LoginCommon.module.css';
import LoginPage from './LoginPage';
import useInput from '../hooks/use-input';
import { isEmail, textNotEmpty, validPW } from '../../lib/validators';
import useError from '../hooks/use-error';
import { register, login, fetchUserData } from '../../store/user-actions';
import AuthContext from '../../store/AuthContext';

export default function Register() {
	const dispatch = useDispatch();
	const history = useHistory();
	const authContext = useContext(AuthContext);

	const {
		value: fName,
		isValid: fNameIsValid,
		hasError: fNameHasError,
		onChange: fNameOnChange,
		onBlur: fNameOnBlur,
	} = useInput(textNotEmpty);

	const {
		value: lName,
		isValid: lNameIsValid,
		hasError: lNameHasError,
		onChange: lNameOnChange,
		onBlur: lNameOnBlur,
	} = useInput(textNotEmpty);

	const {
		value: email,
		isValid: emailIsValid,
		hasError: emailHasError,
		onChange: emailOnChange,
		onBlur: emailOnBlur,
	} = useInput(isEmail);

	const {
		value: password,
		isValid: pwIsValid,
		hasError: pwHasError,
		onChange: pwOnChange,
		onBlur: pwOnBlur,
	} = useInput(validPW);

	const {
		value: cfmPassword,
		isValid: cfmPwIsValid,
		hasError: cfmPwHasError,
		onChange: cfmPwOnChange,
		onBlur: cfmPwOnBlur,
	} = useInput((value) => textNotEmpty(value) && value === password);

	const { error, errorMsg, changeError, changeMessage } = useError();

	const submitHandler = async (e) => {
		e.preventDefault();
		if (
			!(
				fNameIsValid &&
				lNameIsValid &&
				emailIsValid &&
				pwIsValid &&
				cfmPwIsValid
			)
		) {
			changeMessage('Please check if all fields are valid.');
			return;
		}

		const user = { firstName: fName, lastName: lName, email, password };

		const response = await dispatch(register(user));

		if (response.status) {
			const loginResponse = await dispatch(
				login({ username: email, password })
			);
			if (loginResponse.status) {
				const { data } = loginResponse;
				const id = data.user._id;
				const token = data.token;
				const userData = await dispatch(fetchUserData(token));
				if (userData.isSuccess) {
					localStorage.setItem('id', id);
					authContext.login(token);
					history.push('/');
					return;
				} else {
					changeMessage(userData.errorMsg);
					return;
				}
			}
			changeMessage(loginResponse.message);
			return;
		}
		changeMessage(response.message);
		return;
	};

	// const toggleCheckHandler = (e) => {
	// 	setIsChecked(!isChecked);
	// 	setIsTouched(true);
	// };

	return (
		<LoginPage title="Register">
			<Alert
				color="danger"
				className="w-50"
				isOpen={error}
				toggle={() => changeError(!error)}
				fade={false}
			>
				{errorMsg}
			</Alert>
			<Form onSubmit={submitHandler} className="w-50">
				<div className="row">
					<FormGroup className="col">
						<Label for="fName">First Name</Label>
						<Input
							id="fName"
							type="text"
							onChange={fNameOnChange}
							onBlur={fNameOnBlur}
							value={fName}
							valid={fNameIsValid}
							invalid={fNameHasError}
							data-testid="fName"
						/>
						<FormFeedback invalid="true">
							First name should not be empty
						</FormFeedback>
					</FormGroup>
					<FormGroup className="col">
						<Label for="lName">Last Name</Label>
						<Input
							id="lName"
							type="text"
							onChange={lNameOnChange}
							onBlur={lNameOnBlur}
							value={lName}
							valid={lNameIsValid}
							invalid={lNameHasError}
							data-testid="lName"
						/>
						<FormFeedback invalid="true">
							Last name should not be empty
						</FormFeedback>
					</FormGroup>
				</div>

				<div className="row">
					<FormGroup className="col">
						<Label for="email">E-mail</Label>
						<Input
							id="email"
							type="email"
							onChange={emailOnChange}
							onBlur={emailOnBlur}
							value={email}
							valid={emailIsValid}
							invalid={emailHasError}
							data-testid="email"
						/>
						<FormFeedback invalid="true">
							Please enter a valid E-mail
						</FormFeedback>
					</FormGroup>
				</div>

				<div className="row">
					<FormGroup className="col">
						<Label for="password">Password</Label>
						<Input
							id="password"
							type="password"
							onChange={pwOnChange}
							onBlur={pwOnBlur}
							value={password}
							valid={pwIsValid}
							invalid={pwHasError}
							data-testid="password"
						/>
						<FormFeedback invalid="true">
							The password must be at least 8 characters and
							contain a digit.
						</FormFeedback>
					</FormGroup>
					<FormGroup className="col">
						<Label for="cfmPassword">Confirm Password</Label>
						<Input
							id="cfmPassword"
							type="password"
							onChange={cfmPwOnChange}
							onBlur={cfmPwOnBlur.bind(null, password)}
							value={cfmPassword}
							valid={cfmPwIsValid}
							invalid={cfmPwHasError}
							data-testid="cfmPW"
						/>
						<FormFeedback invalid="true">
							{cfmPassword.length < 8
								? 'Ensure the password is at least 8 characters long and contain a digit.'
								: 'Ensure both passwords are the same.'}
						</FormFeedback>
					</FormGroup>
				</div>

				<Button type="submit" color="primary" className="mt-4">
					Register
				</Button>
				<p className={styles.footText}>
					Already have an account? <Link to="/">Login here.</Link>
				</p>
			</Form>
		</LoginPage>
	);
}
