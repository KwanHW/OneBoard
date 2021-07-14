import React from 'react';
import { Button } from 'reactstrap';
import { useSelector } from 'react-redux';

function ExpenseSummary() {
	const expenses = useSelector((state) => state.expense.expense);
	const totalExpenses = expenses.reduce(
		(total, expense) => (total += expense.amount),
		0
	);
	return (
		<div>
			<h3>${totalExpenses.toFixed(2)}</h3>
			<p style={{ fontSize: '1.25em' }}>For July 2021</p>
			<Button className="mt-2">
				<a href="#expenses" style={{ color: 'white' }}>
					More Details
				</a>
			</Button>
		</div>
	);
}

export default ExpenseSummary;
