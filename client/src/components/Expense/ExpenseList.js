import React, { useState } from 'react';
import ExpenseTable from './ExpenseTable';
import { useSelector } from 'react-redux';
import FilterExpense from './FilterExpense';

function ExpenseList(props) {
	const { expense, labels } = useSelector((state) => state.expense);
	const [filteredExpenses, setFilteredExpenses] = useState([]);

	return (
		<div>
			<FilterExpense
				allExpenses={expense}
				filterResults={setFilteredExpenses}
				labelSrc={labels}
			/>

			<ExpenseTable expenses={filteredExpenses} />
		</div>
	);
}

export default ExpenseList;
