import moment from 'moment';
import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { Card, CardTitle } from 'reactstrap';
import AddExpense from './AddExpense';
import ExpenseList from './ExpenseList';
import { fetchExpenses } from '../../store/expense-action';

function Expense(props) {
	const dispatch = useDispatch();
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;

	// ! Needs more testing
	useEffect(() => {
		function fetchData() {
			const start = moment().startOf('month').toDate();
			const end = moment().endOf('month').toDate();
			dispatch(fetchExpenses(token, start, end));
		}

		fetchData();
	}, []);

	return (
		<div className="row m-4">
			{/* {console.log(props)} */}
			<div className="col-5">
				<Card className="row p-4">
					<CardTitle tag="h3">Add Expense </CardTitle>
					<AddExpense />
				</Card>
				<div>Track Expenses</div>
			</div>
			<div className="col-7">
				<Card className="p-4">
					<CardTitle tag="h3">Transaction History</CardTitle>
					<ExpenseList />
				</Card>
			</div>
		</div>
	);
}

export default Expense;
