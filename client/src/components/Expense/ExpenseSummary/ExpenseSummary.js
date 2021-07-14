import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Bar } from 'react-chartjs-2';
import { Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { useSelector } from 'react-redux';
import { getExpenses } from '../../../store/expense-action';
import { hasId } from '../../../lib/validators';

const TYPE_COLOR = {
	primary: '0d6efd',
	dark: '#212529',
	success: '#198754',
	info: '#0dcaf0',
	warning: '#ffc107',
	danger: '#dc3545',
	other: '#6f42c1',
};

const options = {
	scales: {
		yAxes: [
			{
				stacked: true,
				ticks: {
					beginAtZero: true,
				},
			},
		],
		xAxes: [
			{
				stacked: true,
			},
		],
	},
};

function ExpenseSummary() {
	const labels = useSelector((state) => state.expense.labels).filter(hasId);
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const [expensesToShow, setExpensesToShow] = useState([]);
	const [timePeriod, setTimePeriod] = useState('month');
	const [duration, setDuration] = useState(6);

	useEffect(() => {
		async function fetchExpenses() {
			const start = moment()
				.subtract(duration - 1, timePeriod)
				.startOf(timePeriod)
				.toDate();
			const end = moment().endOf(timePeriod).toDate();
			const expenses = await getExpenses(token, start, end);
			setExpensesToShow(expenses);
		}

		fetchExpenses();
		return () => {};
	}, [token, timePeriod, duration]);

	const convertToDataset = () => {
		const data = {
			labels: [],
			datasets: labels.map((l) => {
				return {
					label: l.name,
					data: Array(duration).fill(0),
					backgroundColor: TYPE_COLOR[l.type],
					stack: '',
				};
			}),
		};
		data.datasets.push({
			label: 'Not labelled',
			data: Array(duration).fill(0),
			backgroundColor: TYPE_COLOR.other,
			stack: '',
		});

		for (let i = 0; i < duration; i++) {
			const start = moment()
				.subtract(duration - 1 - i, timePeriod)
				.startOf(timePeriod);
			const end = start.clone().endOf(timePeriod);

			const format =
				timePeriod === 'month'
					? start.format("MMM 'YY")
					: `${start.format('DD/MM')} - ${end.format('DD/MM')}`;
			data.labels.push(format);
			const expensesInMonth = expensesToShow.filter((expense) =>
				moment(expense.date).isBetween(start, end)
			);

			if (expensesInMonth.length === 0) continue;
			expensesInMonth.forEach((expense) => {
				let inLabel = 'Not labelled';
				if (expense.label.length > 0) {
					const foundLabel = labels.find(
						(label) => label._id === expense.label[0]
					);
					inLabel = foundLabel ? foundLabel.name : 'Not labelled';
				}

				const foundDataset = data.datasets.find(
					(dataset) => dataset.label === inLabel
				);
				foundDataset.data[i] += expense.amount;
			});
		}

		return { data, options };
	};

	return (
		<div>
			<div className="d-flex mt-3">
				<InputGroup className="w-50">
					<InputGroupAddon addonType="prepend">
						<InputGroupText>Duration</InputGroupText>
					</InputGroupAddon>

					<Input
						type="number"
						value={duration}
						name="duration"
						id="duration"
						min="3"
						max="12"
						onChange={(e) => setDuration(parseInt(e.target.value))}
					/>
				</InputGroup>
				<InputGroup className="w-50">
					<InputGroupAddon addonType="prepend">
						<InputGroupText>Period</InputGroupText>
					</InputGroupAddon>
					<Input
						type="select"
						name="period"
						id="period"
						onChange={(e) => {
							setTimePeriod(e.target.value.toLowerCase());
						}}
					>
						<option>Month</option>
						<option>Week</option>
					</Input>
				</InputGroup>
			</div>
			{expensesToShow.length > 0 ? (
				<Bar {...convertToDataset()} className="mt-2" />
			) : (
				<h3 className="text-center mt-2">No expenses</h3>
			)}
		</div>
	);
}

export default ExpenseSummary;
