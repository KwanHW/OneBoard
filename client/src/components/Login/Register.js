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
import { isEmail, textNotEmpty } from '../../lib/validators';
import useError from '../hooks/use-error';
import { register, login, fetchUserData } from '../../store/user-actions';
import AuthContext from '../../store/AuthContext';

export default function Register() {
	const dispatch = useDispatch();
	const history = useHistory();
	const authContext = useContext(AuthContext);
	const [isChecked, setIsChecked] = useState(false);
	const [checkIsTouched, setIsTouched] = useState(false);

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
	} = useInput(textNotEmpty);

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
				cfmPwIsValid &&
				isChecked
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
				const userData = await dispatch(fetchUserData(id, token));
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

	const toggleCheckHandler = (e) => {
		setIsChecked(!isChecked);
		setIsTouched(true);
	};

	return (
		<LoginPage title="Register">
			<Alert
				color="danger"
				className="w-25"
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
						/>
						<FormFeedback invalid>
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
						/>
						<FormFeedback invalid>
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
						/>
						<FormFeedback invalid>
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
						/>
						<FormFeedback invalid>
							Please enter your password.
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
						/>
						<FormFeedback invalid>
							Confirmed password does not match.
						</FormFeedback>
					</FormGroup>
				</div>

				<div
					className={` ${styles.checkBox} ${
						!isChecked && checkIsTouched ? styles.invalid : ''
					}`}
				>
					<Input
						type="checkbox"
						name="toc"
						id="toc"
						checked={isChecked}
						onChange={toggleCheckHandler}
						style={{ fontSize: '20px' }}
					/>
					<Label
						check
						for="toc"
						style={{ marginLeft: '15px', fontSize: '20px' }}
					>
						I agree to the terms of use
					</Label>
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
