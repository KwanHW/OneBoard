export function createExpense(data) {
	const { _id, name, description, date, amount, label } = data;
	const newDesc = description ? description : '';
	return {
		_id,
		name,
		description: newDesc,
		date,
		amount: amount / 100,
		label,
	};
}

export function sortByDate(expA, expB) {
	const expATime = new Date(expA.date).valueOf();
	const expBTime = new Date(expB.date).valueOf();
	return expATime - expBTime;
}
