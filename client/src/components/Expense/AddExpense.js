import { DatePicker } from 'antd';
import moment from 'moment';
import React, { useRef, useState, useContext } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import {
	Form,
	FormGroup,
	FormFeedback,
	Label,
	Input,
	Button,
	InputGroup,
	InputGroupAddon,
	InputGroupText,
} from 'reactstrap';
import 'antd/dist/antd.css';
import styles from './AddExpense.module.css';
import ManageLabel from './ManageLabel';
import useInput from '../hooks/use-input';
import {
	textNotEmpty,
	isNumeric,
	hasId,
	DATE_FORMAT,
} from '../../lib/validators';
import { addExpense } from '../../store/expense-action';
import ModalContext from '../../store/ModalContext';
import Dropdown from '../../UI/Dropdown/Dropdown';
import BulkExpense from './BulkExpense/BulkExpense';

function AddExpense(props) {
	const dispatch = useDispatch();
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const modalContext = useContext(ModalContext);
	const expenseLabels = useSelector((state) => state.expense.labels).filter(
		hasId
	);

	const {
		value: name,
		isValid: nameIsValid,
		hasError: nameHasError,
		onChange: nameOnChange,
		onBlur: nameOnBlur,
		reset: nameReset,
	} = useInput(textNotEmpty, '');
	const [date, setDate] = useState(moment());
	const descRef = useRef();
	const {
		value: amount,
		isValid: amountIsValid,
		hasError: amountHasError,
		onChange: amountOnChange,
		onBlur: amountOnBlur,
		reset: amountReset,
	} = useInput(isNumeric, 0.0);
	const [label, setLabels] = useState([]);

	const addExpenseHandler = () => {
		const dateToString = date.toDate().toISOString();
		const description = descRef.current.value.trim();

		if (!(nameIsValid && amountIsValid && date)) return;

		const amountNumber = parseFloat(amount);

		const expense = {
			name,
			date: dateToString,
			amount: amountNumber,
			description,
			label,
		};

		dispatch(addExpense(token, expense));
		nameReset();
		amountReset();
		setDate(moment());
		descRef.current.value = '';
		setLabels([]);
	};

	return (
		<div className={` ${styles.addExpense}`}>
			<Form className="d-flex flex-wrap">
				{/* Name */}
				<FormGroup className="w-50">
					<Label for="name">Name</Label>
					<Input
						id="name"
						type="text"
						name="name"
						placeholder="Enter expense name"
						value={name}
						onChange={nameOnChange}
						onBlur={nameOnBlur}
						invalid={nameHasError}
					/>
					<FormFeedback>Please ensure name is not empty</FormFeedback>
				</FormGroup>

				{/* Amount */}
				<FormGroup className="w-50">
					<Label for="amount">Amount</Label>
					<InputGroup>
						<InputGroupAddon addonType="prepend">
							<InputGroupText>$</InputGroupText>
						</InputGroupAddon>
						<Input
							id="amount"
							type="number"
							min="0.00"
							value={amount}
							onChange={amountOnChange}
							onBlur={amountOnBlur}
							placeholder="Enter amount"
							invalid={amountHasError}
						/>
					</InputGroup>
					<FormFeedback>Please ensure amount is valid</FormFeedback>
				</FormGroup>

				{/* Date of transaction */}
				<FormGroup className="w-50">
					<Label for="date">Date</Label>
					<DatePicker
						allowClear
						value={date}
						format={DATE_FORMAT}
						onChange={(date) => setDate(date)}
						className="w-100"
					/>
				</FormGroup>

				{/* Labels */}
				<div className="w-50">
					<Label for="label">Label</Label>
					<Dropdown
						className="w-100"
						onChange={(value) => setLabels(value)}
						labelSrc={expenseLabels}
					/>
				</div>

				{/* Description */}
				<Label for="description">Description</Label>
				<Input
					id="description"
					type="textarea"
					innerRef={descRef}
					placeholder="Enter description"
					style={{ resize: 'none' }}
				/>

				<div className="mt-3">
					<Button color="success" onClick={addExpenseHandler}>
						Add Expense
					</Button>
					<Button
						onClick={() => {
							modalContext.showModal(<BulkExpense />);
						}}
					>
						Import from csv
					</Button>
					{/* TODO To be placed somewhere else */}
					<Button
						onClick={() => {
							modalContext.showModal(<ManageLabel />);
						}}
					>
						Manage Labels
					</Button>
				</div>
			</Form>
		</div>
	);
}

export default React.memo(AddExpense);
