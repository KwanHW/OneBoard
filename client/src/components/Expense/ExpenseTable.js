import React from 'react';
import { Table } from 'reactstrap';
import ExpenseItem from './ExpenseItem';

const ExpenseTable = (props) => {
	const { expenses } = props;

	return (
		// TODO Pagination after 13 transactions
		<React.Fragment>
			<Table striped>
				<thead>
					<tr key="header">
						<th>Date</th>
						<th>Name</th>
						<th>Description</th>
						<th>Amount ($)</th>
						<th>Edit/Delete</th>
					</tr>
				</thead>
				{expenses.length > 0 && (
					<tbody>
						{expenses.map((expense) => (
							<ExpenseItem expense={expense} key={expense._id} />
						))}
					</tbody>
				)}
			</Table>
			{expenses.length === 0 && (
				<h4 className="text-center">No Expenses Found</h4>
			)}
		</React.Fragment>
	);
};

export default ExpenseTable;
