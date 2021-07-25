import React, { useState } from 'react';
import {
	Alert,
	Button,
	Form,
	FormFeedback,
	FormGroup,
	Label,
	Input,
} from 'reactstrap';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import useInput from '../hooks/use-input';
import useError from '../hooks/use-error';
import { updateName } from '../../store/user-actions';
import { textNotEmpty } from '../../lib/validators';
import styles from './ProfileChange.module.css';

function ChangeInfo() {
	const dispatch = useDispatch();
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const user = useSelector((state) => state.user);
	const [isSuccess, setIsSuccess] = useState(false);
	const [beforeChange, setBeforeChange] = useState({
		firstName: user.firstName,
		lastName: user.lastName,
	});

	const {
		value: firstName,
		isValid: fNameIsValid,
		hasError: fNameHasError,
		onChange: fNameOnChange,
		onBlur: fNameOnBlur,
	} = useInput(textNotEmpty, user.firstName);

	const {
		value: lastName,
		isValid: lNameIsValid,
		hasError: lNameHasError,
		onChange: lNameOnChange,
		onBlur: lNameOnBlur,
	} = useInput(textNotEmpty, user.lastName);

	const { error, errorMsg, changeMessage } = useError();

	const onSubmitHandler = (e) => {
		e.preventDefault();

		if (!(fNameIsValid && lNameIsValid)) {
			setIsSuccess(false);
			changeMessage('Please ensure all fields are valid.');
			return;
		}

		if (
			firstName === beforeChange.firstName &&
			lastName === beforeChange.lastName
		) {
			setIsSuccess(true);
			changeMessage('No changes made.');
			return;
		}

		const updatedUser = { firstName, lastName };
		dispatch(updateName(token, updatedUser));
		setBeforeChange(updatedUser);
		setIsSuccess(true);
		changeMessage('Successfully updated.');
	};

	return (
		<React.Fragment>
			<h3>Change User Information</h3>
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
					<Label for="fName">First Name</Label>
					<Input
						id="fName"
						type="text"
						onBlur={fNameOnBlur}
						onChange={fNameOnChange}
						value={firstName}
						invalid={fNameHasError}
					/>
					<FormFeedback invalid>
						Please ensure field is not empty.
					</FormFeedback>
				</FormGroup>

				<FormGroup>
					<Label for="lName">Last Name</Label>
					<Input
						id="lName"
						type="text"
						onBlur={lNameOnBlur}
						onChange={lNameOnChange}
						value={lastName}
						invalid={lNameHasError}
					/>
					<FormFeedback invalid>
						Please ensure field is not empty.
					</FormFeedback>
				</FormGroup>

				<div className="mt-4">
					<Button type="submit" color="success">
						Update Information
					</Button>
					<Link to="/" className={styles.link}>
						<Button outline>Go back</Button>
					</Link>
				</div>
			</Form>
		</React.Fragment>
	);
}

export default ChangeInfo;
