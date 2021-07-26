import { createSlice } from '@reduxjs/toolkit';
import { sortByDate } from '../lib/expense';

const initialState = { expense: [], labels: [], lastUpdate: '' };

const expenseSlice = createSlice({
	name: 'expense',
	initialState,
	reducers: {
		addExpense(state, action) {
			const expense = action.payload;
			const newUpdate = new Date().toISOString();
			const newExpenses = [...state.expense, expense].sort(sortByDate);
			state.expense = newExpenses;
			state.lastUpdate = newUpdate;
		},
		bulkAddExpense(state, action) {
			const expenses = action.payload;
			const lastUpdate = new Date().toISOString();
			const newExpenses = [...state.expense]
				.concat(expenses)
				.sort(sortByDate);
			return { expense: newExpenses, labels: state.labels, lastUpdate };
		},
		deleteExpense(state, action) {
			const id = action.payload;
			const newUpdate = new Date().toISOString();
			const newExpenses = state.expense.filter(
				(expense) => expense._id !== id
			);
			return {
				expense: newExpenses,
				labels: state.labels,
				lastUpdate: newUpdate,
			};
		},
		updateExpense(state, action) {
			const newExpense = action.payload;
			const newUpdate = new Date().toISOString();
			state.lastUpdate = newUpdate;
			state.expense = state.expense
				.map((expense) =>
					expense._id === newExpense._id ? newExpense : expense
				)
				.sort(sortByDate);
		},
		replace(state, action) {
			const { type, expenses, labels } = action.payload;
			const newUpdate = new Date().toISOString();
			state.lastUpdate = newUpdate;
			switch (type) {
				case 'expenses':
					state.expense = expenses.sort(sortByDate);
					return;
				case 'labels':
					state.labels = labels;
					return;
				default:
					return state;
			}
		},
		// Probably not needed
		store(state) {
			// Requires date to be converted (see event.js)
			const storeExpense = state.expense.map((expense) => {
				const date = expense.date.valueOf();
				return { ...expense, date };
			});
			const storeState = { expenses: storeExpense, labels: state.labels };
			localStorage.setItem('expenses', JSON.stringify(storeState));
		},
		clear(state) {
			return initialState;
		},
	},
});

export const expenseActions = expenseSlice.actions;

export default expenseSlice.reducer;
