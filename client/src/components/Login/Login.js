import React, { useContext, useState } from 'react';
import {
	Alert,
	Form,
	FormFeedback,
	FormGroup,
	Label,
	Input,
	Button,
	Modal,
	ModalBody,
	ModalFooter,
} from 'reactstrap';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './LoginCommon.module.css';
import LoginPage from './LoginPage';
import useInput from '../hooks/use-input';
import useError from '../hooks/use-error';
import { fetchUserData, login } from '../../store/user-actions';
import AuthContext from '../../store/AuthContext';
import { isEmail, textNotEmpty } from '../../lib/validators';
import { ModalHeader } from 'reactstrap';

export default function Login(props) {
	// Used for announcement only
	// const [open, setOpen] = useState(true);
	const dispatch = useDispatch();
	const authContext = useContext(AuthContext);

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

	const { error, errorMsg, changeError, changeMessage } = useError();

	const submitHandler = async (e) => {
		e.preventDefault();

		if (!(emailIsValid && pwIsValid)) {
			changeMessage('Please ensure all fields are valid');
			return;
		}

		const user = { username: email, password };

		const response = await dispatch(login(user));

		if (!response.status) {
			changeMessage(response.message);
		} else {
			const { data } = response;
			const token = data.token;
			const id = data.user._id;
			const userData = await dispatch(fetchUserData(token));
			if (userData.isSuccess) {
				localStorage.setItem('id', id);
				authContext.login(token);
			} else {
				changeMessage(userData.errorMsg);
			}
		}
	};

	return (
		<LoginPage title="Log In">
			{/* {open && (
				<Announcement
					toggle={() => {
						setOpen(false);
					}}
				/>
			)} */}
			<Alert
				color="danger"
				className="w-25"
				isOpen={error}
				toggle={() => {
					changeError(!error);
				}}
			>
				{errorMsg}
			</Alert>
			<Form onSubmit={submitHandler} className="w-50">
				<FormGroup>
					<Label for="email">E-mail</Label>
					<Input
						type="email"
						name="email"
						id="email"
						placeholder="Enter your email"
						onChange={emailOnChange}
						onBlur={emailOnBlur}
						value={email}
						invalid={emailHasError}
						data-testid="email"
					/>
					<FormFeedback invalid="true">
						Please enter a valid E-mail
					</FormFeedback>
				</FormGroup>
				<FormGroup>
					<Label for="password">Password</Label>
					<Input
						id="password"
						name="password"
						type="password"
						placeholder="Enter your password"
						onChange={pwOnChange}
						onBlur={pwOnBlur}
						value={password}
						invalid={pwHasError}
						data-testid="password"
					/>
					<FormFeedback invalid="true">
						Please enter your password
					</FormFeedback>
				</FormGroup>
				<Button type="submit" color="primary" className="mt-4">
					Log In
				</Button>
				<p className={styles.footText}>
					Don't have an account?{' '}
					<Link to="/register">Register here.</Link>
				</p>
			</Form>
		</LoginPage>
	);
}

const Announcement = (props) => {
	const { toggle } = props;
	return (
		<Modal isOpen={true} toggle={toggle}>
			<ModalHeader>A message from us</ModalHeader>
			<ModalBody>
				<p>Hey there! Thank you for trying out OneBoard!</p>
				<br />
				<p>
					We hope to receive any feedback you may have to improve
					OneBoard. As the application is deployed on free servers,
					the application may feel slow and unresponsive.
				</p>
				<br />
				<p>- Kwan Hao Wei & Goh Zheng Teck</p>
			</ModalBody>
			<ModalFooter>
				<Button color="primary" onClick={toggle}>
					Close
				</Button>
			</ModalFooter>
		</Modal>
	);
};
