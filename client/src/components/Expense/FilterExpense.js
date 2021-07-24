import React, { useEffect, useState, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { DatePicker } from 'antd';
import { Button, Input, Label } from 'reactstrap';
import useInput from '../hooks/use-input';
import { DATE_FORMAT, hasId, textNotEmpty } from '../../lib/validators';
import Dropdown from '../../UI/Dropdown/Dropdown';
import { getExpenses } from '../../store/expense-action';
import { sortByDate } from '../../lib/expense';

function queryInString(value, query) {
	return value.toLowerCase().includes(query.toLowerCase());
}

const { RangePicker } = DatePicker;

function FilterExpense(props) {
	const { allExpenses, filterResults, labelSrc } = props;
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const labels = labelSrc.filter(hasId);
	const {
		value: filter,
		isValid: filterIsValid,
		onChange: filterOnChange,
		reset: filterReset,
	} = useInput(textNotEmpty, '');
	const [expensesToFilter, setExpensesToFilter] = useState([]);
	const [checked, setChecked] = useState({ name: true, description: true });
	const [labelSelect, setLabelSelect] = useState([]);
	const [dateSelect, setDateSelect] = useState(null);
	const nameRef = useRef();
	const descriptionRef = useRef();

	useEffect(() => {
		async function fetchExpenses() {
			if (dateSelect === null) {
				setExpensesToFilter(allExpenses);
				return;
			}
			const [start, end] = [
				dateSelect[0].clone().subtract(1, 'day').toDate(),
				dateSelect[1].clone().add(1, 'day').toDate(),
			];
			const expenses = await getExpenses(token, start, end);
			setExpensesToFilter(expenses);
		}

		fetchExpenses();
	}, [dateSelect]);

	useEffect(() => {
		function filterExpenses(expToFilter) {
			let filteredExp =
				labelSelect.length === 0
					? expToFilter
					: expToFilter.filter((expense) =>
							expense.label.some((id) => labelSelect.includes(id))
					  );

			//   Change implementation similar to kanban
			if (filterIsValid) {
				filteredExp = filteredExp.filter(
					(expense) =>
						(checked.name && queryInString(expense.name, filter)) ||
						(checked.description &&
							queryInString(expense.description, filter))
				);
			}

			const sortedExp = [...filteredExp].sort(sortByDate);
			return sortedExp;
		}

		const expenseSrc = dateSelect !== null ? expensesToFilter : allExpenses;
		filterResults(filterExpenses(expenseSrc));
		return () => {};
	}, [
		allExpenses,
		filter,
		checked,
		expensesToFilter,
		dateSelect,
		labelSelect.length,
	]);

	const resetHandler = () => {
		filterReset();
		setChecked({ name: true, description: true });
		setLabelSelect([]);
		setDateSelect(null);
	};

	return (
		<div className="d-flex w-100 align-items-center flex-wrap">
			<Input
				id="filter"
				name="filter"
				placeholder="Enter Transaction Name"
				value={filter}
				onChange={filterOnChange}
				className="w-25"
			/>
			<div className="mx-2">
				<Input
					id="filterName"
					name="filterName"
					type="checkbox"
					innerRef={nameRef}
					checked={checked.name}
					onChange={() => {
						setChecked({ ...checked, name: !checked.name });
					}}
				/>
				<Label for="filterName" style={{ marginRight: '4px' }}>
					Name
				</Label>

				<Input
					id="description"
					name="description"
					type="checkbox"
					innerRef={descriptionRef}
					checked={checked.description}
					onChange={() => {
						setChecked({
							...checked,
							description: !checked.description,
						});
					}}
				/>
				<Label for="description">Description</Label>
			</div>
			<Dropdown
				value={labelSelect}
				onChange={(value) => {
					setLabelSelect(value);
				}}
				className="w-50"
				labelSrc={labels}
			/>
			<RangePicker
				className="w-50"
				onChange={(date) => {
					setDateSelect(date);
				}}
				format={DATE_FORMAT}
				value={dateSelect}
				allowClear
			/>
			<Button onClick={resetHandler} className="mx-2">
				Reset
			</Button>
		</div>
	);
}

export default FilterExpense;
