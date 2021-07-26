import { DatePicker } from 'antd';
import moment from 'moment';
import React, { useContext, useState, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input } from 'reactstrap';
import DeleteExpense from './DeleteExpense';
import EditDelete from '../Kanban/KanbanUI/EditDelete';
import LabelBar from '../../UI/LabelBar';
import ModalContext from '../../store/ModalContext';
import useInput from '../hooks/use-input';
import { updateExpense } from '../../store/expense-action';
import {
	DATE_FORMAT,
	hasId,
	isNumeric,
	textNotEmpty,
} from '../../lib/validators';
import Dropdown from '../../UI/Dropdown/Dropdown';

function ExpenseItem(props) {
	const { expense } = props;
	const dispatch = useDispatch();
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const expenseLabels = useSelector((state) => state.expense.labels).filter(
		hasId
	);
	const modalContext = useContext(ModalContext);
	const [isEdit, setIsEdit] = useState(false);
	const [beforeChange, setBeforeChange] = useState(expense);
	const [date, setDate] = useState(moment(beforeChange.date));
	const [showMore, setShowMore] = useState(false);

	const {
		value: name,
		isValid: nameIsValid,
		onChange: nameOnChange,
	} = useInput(textNotEmpty, beforeChange.name);

	const descriptionRef = useRef();
	const [labelSelect, setLabelSelect] = useState(
		expense.label.filter((label) =>
			expenseLabels.find((eLabel) => eLabel._id === label)
		)
	);

	const {
		value: amount,
		isValid: amountIsValid,
		onChange: amountOnChange,
	} = useInput(isNumeric, beforeChange.amount.toString());

	const deleteHandler = () => {
		modalContext.showModal(<DeleteExpense expense={beforeChange} />);
	};

	const editHandler = () => {
		const dateToString = date.toDate().toString();
		const description = descriptionRef.current.value;

		if (!(nameIsValid && amountIsValid && date)) {
			setIsEdit(false);
			return;
		}

		const amountFloat = parseFloat(amount).toFixed(2);

		let isChanged = false;
		if (labelSelect.length !== beforeChange.label.length) isChanged = true;
		if (!isChanged) {
			for (let i = 0; i < labelSelect.length; i++) {
				if (
					!beforeChange.label.some((label) => label === labelSelect)
				) {
					isChanged = true;
				}
			}
		}

		if (
			name === beforeChange.name &&
			amountFloat === beforeChange.amount &&
			description === beforeChange.description &&
			moment(date, 'YYYY-MM-DD').isSame(beforeChange.date, 'day') &&
			!isChanged
		) {
			// console.log('The same');
			setIsEdit(false);
			return;
		}

		const updatedExpense = {
			...beforeChange,
			name,
			date: dateToString,
			description,
			label: labelSelect,
			amount: `$${amountFloat}`,
		};

		dispatch(updateExpense(token, updatedExpense));
		setBeforeChange({ ...updatedExpense, amount: parseFloat(amountFloat) });
		setIsEdit(false);
	};

	const toggleShowMore = () => {
		setShowMore(!showMore);
	};

	const renderContent = isEdit ? (
		<React.Fragment>
			<td>
				<DatePicker
					allowClear
					value={date}
					format={DATE_FORMAT}
					onChange={(date) => setDate(date)}
					className="w-100"
				/>
			</td>
			<td>
				<Input type="text" value={name} onChange={nameOnChange} />
				<Dropdown
					className="w-100"
					value={labelSelect}
					onChange={(value) => setLabelSelect(value)}
					labelSrc={expenseLabels}
				/>
			</td>
			<td>
				<Input
					type="textarea"
					innerRef={descriptionRef}
					defaultValue={beforeChange.description}
				/>
			</td>
			<td>
				<Input
					id="amount"
					type="number"
					min="0.00"
					value={amount}
					onChange={amountOnChange}
				/>
			</td>
			<td>
				<Button color="success" onClick={editHandler}>
					Done
				</Button>
			</td>
		</React.Fragment>
	) : (
		<React.Fragment>
			<td> {moment(beforeChange.date).format(DATE_FORMAT)}</td>{' '}
			<td>
				<React.Fragment>
					{beforeChange.name}
					<LabelBar
						labels={beforeChange.label}
						labelSrc={expenseLabels}
					/>
				</React.Fragment>
			</td>
			<td>
				{beforeChange.description.length < 25 ? (
					beforeChange.description
				) : (
					<React.Fragment>
						<p>
							{showMore
								? beforeChange.description
								: beforeChange.description.substring(
										0,
										30
								  )}{' '}
							{/* Style link */}
							<u
								onClick={toggleShowMore}
								style={{ cursor: 'pointer' }}
							>
								{showMore ? 'Less' : 'Read more'}
							</u>
						</p>
					</React.Fragment>
				)}
			</td>
			<td>{beforeChange.amount.toFixed(2)}</td>
			<td>
				{/* CSS change needed */}
				<EditDelete
					onEdit={() => {
						setIsEdit(true);
					}}
					onDelete={deleteHandler}
					className="my-0 text-center"
				/>
			</td>
		</React.Fragment>
	);

	return <tr key={beforeChange._id}>{renderContent}</tr>;
}

export default ExpenseItem;
