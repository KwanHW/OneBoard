import { expenseActions } from './expense';
import {
	deleteRequest,
	getRequest,
	postRequest,
	putRequest,
	determineURL,
	formatQueryString,
} from '../lib/fetch';
import { createExpense } from '../lib/expense';
import { createLabels } from '../lib/kanban';

const URL_HEADER = 'api/expense';

export const fetchExpenses = (token, start, end) => {
	const formatStart = start.toISOString();
	const formatEnd = end.toISOString();
	return async (dispatch) => {
		try {
			const expenseRes = await getRequest(
				token,
				formatQueryString(URL_HEADER, formatStart, formatEnd)
			);

			const expenses = expenseRes.map((event) => createExpense(event));

			dispatch(expenseActions.replace({ type: 'expenses', expenses }));
		} catch (error) {}
	};
};

export const getExpenses = async (token, start, end) => {
	const formatStart = start.toISOString();
	const formatEnd = end.toISOString();
	try {
		const expenseRes = await getRequest(
			token,
			formatQueryString(URL_HEADER, formatStart, formatEnd)
		);

		const expenses = expenseRes.map((expense) => createExpense(expense));
		return expenses;
	} catch (error) {
		return [];
	}
};

export const bulkAddExpense = (token, file) => {
	return async (dispatch) => {
		const url = `${URL_HEADER}/upload`;
		const formdata = new FormData();
		console.log(file.name);
		formdata.append('file', file, file.name);
		const bulkReq = async () => {
			const response = await fetch(url, {
				method: 'POST',
				headers: { Authorization: `Bearer ${token}` },
				body: formdata,
			});

			if (!response.ok) {
				throw new Error('Bulk Add failed');
			}

			const data = await response.json();

			return data;
		};
		try {
			// console.log('Uploading');
			const response = await bulkReq();
			// console.log(response);
			const expenses = response.map((expense) => createExpense(expense));
			dispatch(expenseActions.bulkAddExpense(expenses));
		} catch (error) {}
	};
};

export const addExpense = (token, dataReq) => {
	return async (dispatch) => {
		try {
			const response = await postRequest(token, URL_HEADER, dataReq);

			const expense = createExpense(response);
			dispatch(expenseActions.addExpense(expense));
		} catch (error) {}
	};
};

export const updateExpense = (token, expense) => {
	return async (dispatch) => {
		try {
			const response = await putRequest(
				token,
				determineURL(URL_HEADER, expense._id),
				expense
			);
			const formatEvent = createExpense(response);
			dispatch(expenseActions.updateExpense(formatEvent));
		} catch (error) {}
	};
};

export const deleteExpense = (token, id) => {
	return async (dispatch) => {
		try {
			await deleteRequest(token, determineURL(URL_HEADER, id));
			dispatch(expenseActions.deleteExpense(id));
		} catch (error) {}
	};
};

export const updateLabels = (token, dataReq) => {
	return async (dispatch) => {
		try {
			const labels = await putRequest(token, URL_HEADER, dataReq);
			const formatLabels = createLabels(labels);
			dispatch(
				expenseActions.replace({ type: 'labels', labels: formatLabels })
			);
		} catch (error) {}
	};
};
