import React, { useState } from 'react';
import ExpenseTable from './ExpenseTable';
import { useSelector } from 'react-redux';
import FilterExpense from './FilterExpense';

function ExpenseList(props) {
	const { expense, labels } = useSelector((state) => state.expense);
	const [filteredExpenses, setFilteredExpenses] = useState([]);

	return (
		<div>
			{/* For now written like this, will be generalised to kanban */}
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
