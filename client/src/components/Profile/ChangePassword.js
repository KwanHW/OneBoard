import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import {
	Alert,
	Button,
	Form,
	FormGroup,
	FormFeedback,
	Label,
	Input,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import useInput from '../hooks/use-input';
import useError from '../hooks/use-error';
import { updatePassword } from '../../store/user-actions';
import { textNotEmpty, validPW } from '../../lib/validators';
import styles from './ProfileChange.module.css';

function ChangePassword(props) {
	const dispatch = useDispatch();
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const [isSuccess, setIsSuccess] = useState(false);
	const {
		value: currentPassword,
		isValid: currentPWValid,
		hasError: currentPWHasError,
		onBlur: currentPWOnBlur,
		onChange: currentPWOnChange,
		reset: currentPWReset,
	} = useInput(textNotEmpty);

	const {
		value: newPassword,
		isValid: newPWValid,
		hasError: newPWHasError,
		onBlur: newPWOnBlur,
		onChange: newPWOnChange,
		reset: newPWReset,
	} = useInput((value) => validPW(value) && value !== currentPassword);

	const {
		value: cfmPassword,
		isValid: cfmPWValid,
		hasError: cfmPWHasError,
		onBlur: cfmPWOnBlur,
		onChange: cfmPWOnChange,
		reset: cfmPWReset,
	} = useInput((value) => textNotEmpty(value) && value === newPassword);

	const { error, errorMsg, changeMessage } = useError();

	const onSubmitHandler = async (e) => {
		e.preventDefault();
		if (!(currentPWValid && newPWValid && cfmPWValid)) {
			setIsSuccess(false);
			changeMessage('Please ensure all fields are valid.');
			return;
		}

		const newPW = {
			oldPassword: currentPassword,
			newPassword: cfmPassword,
		};
		const response = await dispatch(updatePassword(token, newPW));
		if (response) {
			setIsSuccess(false);
			changeMessage(response);
		} else {
			setIsSuccess(true);
			changeMessage('Password Updated');
		}
		currentPWReset();
		newPWReset();
		cfmPWReset();
	};

	return (
		<React.Fragment>
			<h3>Change Password</h3>
			<Alert
				color={isSuccess ? 'success' : 'danger'}
				isOpen={error}
				toggle={() => {
					changeMessage('');
				}}
			>
				{errorMsg}
			</Alert>
			<Form onSubmit={onSubmitHandler}>
				<FormGroup>
					<Label for="currentPassword">Current Password</Label>
					<Input
						id="currentPassword"
						type="password"
						onBlur={currentPWOnBlur}
						onChange={currentPWOnChange}
						value={currentPassword}
						invalid={currentPWHasError}
						data-testid="currentPW"
					/>
					<FormFeedback invalid>
						Please ensure field is not empty.
					</FormFeedback>
				</FormGroup>

				<FormGroup>
					<Label for="newPassword">New Password</Label>
					<Input
						id="newPassword"
						type="password"
						onBlur={newPWOnBlur}
						onChange={newPWOnChange}
						value={newPassword}
						invalid={newPWHasError}
						data-testid="newPW"
					/>
					<FormFeedback invalid>
						Please ensure field is not empty.
					</FormFeedback>
				</FormGroup>

				<FormGroup>
					<Label for="cfmPassword">Confirm New Password</Label>
					<Input
						id="cfmPassword"
						type="password"
						onBlur={cfmPWOnBlur}
						onChange={cfmPWOnChange}
						value={cfmPassword}
						invalid={cfmPWHasError}
						data-testid="cfmPW"
					/>
					<FormFeedback invalid>
						Please ensure field is not empty and matches with New
						Password.
					</FormFeedback>
				</FormGroup>
				<div className="mt-4">
					<Button
						type="submit"
						color="success"
						data-testid="submitBtn"
					>
						Change Password
					</Button>
					<Link to="/" className={styles.link}>
						<Button outline>Go back</Button>
					</Link>
				</div>
			</Form>
		</React.Fragment>
	);
}

export default ChangePassword;
