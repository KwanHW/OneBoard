import React, { useState, useEffect } from 'react';
import { Label, Input, Button } from 'reactstrap';
import { DatePicker } from 'antd';
import Dropdown from '../../../UI/Dropdown/Dropdown';
import { DATE_FORMAT, hasId, textNotEmpty } from '../../../lib/validators';
import useInput from '../../hooks/use-input';

function FilterKanban(props) {
	const { boardInfo, onFilter } = props;
	const labels = props.labels.filter(hasId);
	const [labelSelect, setLabelSelect] = useState([]);
	const [dateSelect, setDateSelect] = useState(null);
	const [isOverdue, setIsOverdue] = useState(false);

	const {
		value: query,
		isValid: queryIsValid,
		onChange: queryOnChange,
		reset: queryReset,
	} = useInput(textNotEmpty, '');

	useEffect(() => {
		if (!queryIsValid && labelSelect.length === 0 && !dateSelect) {
			onFilter(boardInfo);
			return;
		}

		const filteredKanban = boardInfo.map((col) => {
			if (col.tasks.length === 0) return null;
			const tasks = col.tasks.filter((task) => {
				// Label, name, date
				let matched = [null, null, null];

				if (labelSelect.length > 0) {
					matched[0] = task.label.some((labelId) =>
						labelSelect.includes(labelId)
					);
				}

				if (queryIsValid) {
					matched[1] = task.name
						.toLowerCase()
						.includes(query.toLowerCase());
				}

				if (dateSelect !== null) {
					if (!task.expireAt) matched[2] = false;
					matched[2] = isOverdue
						? dateSelect.isAfter(task.expireAt)
						: dateSelect.isBefore(task.expireAt);
				}

				// If all entries are empty
				if (matched.every((match) => match === null)) return true;
				return matched
					.filter((match) => match !== null) // Keep params which was evaluated
					.every((match) => match);
			});

			return { ...col, tasks };
		});

		onFilter(filteredKanban.filter((col) => col));
		return () => {};
	}, [boardInfo, query, labelSelect.length, dateSelect, isOverdue]);

	const resetHandler = () => {
		queryReset();
		setLabelSelect([]);
		setDateSelect(null);
		setIsOverdue(false);
	};

	return (
		<div className="d-flex align-items-center">
			<Input
				type="text"
				placeholder="Search keyword"
				name="query"
				id="query"
				className="w-25"
				style={{ marginRight: '8px' }}
				value={query}
				onChange={queryOnChange}
			/>
			<div className="mx-2">
				<Input
					type="checkbox"
					name="isOverdue"
					id="isOverdue"
					checked={isOverdue}
					onChange={(e) => setIsOverdue(e.target.checked)}
				/>
				<Label for="isOverdue">Find Overdue</Label>
			</div>
			<DatePicker
				allowClear
				onChange={setDateSelect}
				format={DATE_FORMAT}
			/>
			<Dropdown
				value={labelSelect}
				onChange={setLabelSelect}
				labelSrc={labels}
				className="w-25"
			/>
			<Button onClick={resetHandler}>Reset</Button>
		</div>
	);
}

export default FilterKanban;
