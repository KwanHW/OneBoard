import React, { useState } from 'react';
import { Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import ExpenseItem from './ExpenseItem';

const ExpenseTable = (props) => {
	const { expenses } = props;
	const [currentPage, setCurrentPage] = useState(0);
	const pageSize = 10;
	const pageCount = Math.ceil(expenses.length / pageSize);

	if (expenses.length === 0) {
		return <h4 className="text-center">No Expenses Found</h4>;
	}

	const renderPages = [...Array(pageCount)].map((page, index) => (
		<PaginationItem active={index === currentPage} key={index}>
			<PaginationLink onClick={() => setCurrentPage(index)}>
				{index + 1}
			</PaginationLink>
		</PaginationItem>
	));

	const expensesToRender = expenses
		.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
		.map((expense) => <ExpenseItem expense={expense} key={expense._id} />);

	return (
		<React.Fragment>
			<Table striped className="mt-3">
				<thead>
					<tr key="header">
						<th style={{ width: '15%' }}>Date</th>
						<th style={{ width: '22%' }}>Name</th>
						<th style={{ width: '35%' }}>Description</th>
						<th style={{ width: '13%' }}>Amount ($)</th>
						<th style={{ width: '10%' }}>Edit/Delete</th>
					</tr>
				</thead>
				{expenses.length > 0 && <tbody>{expensesToRender}</tbody>}
			</Table>
			{expenses.length > 10 && (
				<Pagination className="d-flex justify-content-center">
					<PaginationItem disabled={currentPage === 0}>
						<PaginationLink
							onClick={() => {
								setCurrentPage(currentPage - 1);
							}}
							previous
						/>
					</PaginationItem>
					{renderPages}
					<PaginationItem disabled={currentPage === pageCount - 1}>
						<PaginationLink
							onClick={() => {
								setCurrentPage(currentPage + 1);
							}}
							next
						/>
					</PaginationItem>
				</Pagination>
			)}
			{expenses.length === 0 && (
				<h4 className="text-center">No Expenses Found</h4>
			)}
		</React.Fragment>
	);
};

export default ExpenseTable;
