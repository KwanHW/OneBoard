import { eventActions } from './event';
import reducer, { expenseActions } from './expense';

const initialState = { expense: [], labels: [] };

const exp = {
	_id: 'exp1',
	name: 'Bare min expense',
	description: '',
	date: '2021-07-12T05:33:55.544Z',
	amount: 130,
	label: [],
};

const labels = [
	{
		type: 'primary',
		name: '',
	},
	{
		type: 'dark',
		name: '',
	},
	{
		type: 'success',
		name: '',
	},
	{
		type: 'info',
		name: '',
	},
	{
		type: 'warning',
		name: '',
	},
	{
		type: 'danger',
		name: '',
	},
];

describe('REDUX: expense slice', () => {
	test('initalise state slice', () => {
		expect(reducer(undefined, {})).toEqual({ expense: [], labels: [] });
	});

	test('add expense to empty expense array', () => {
		expect(reducer(initialState, expenseActions.addExpense(exp))).toEqual({
			expense: [exp],
			labels: [],
		});
	});

	test('add expense to non-empty expense array', () => {
		// newExp comes later than exp
		let newExp = {
			_id: 'exp2',
			name: 'Bare min expense',
			description: '',
			date: new Date('2021-07-13').toISOString(),
			amount: 130,
			label: [],
		};

		expect(
			reducer(
				{ expense: [exp], labels: [] },
				expenseActions.addExpense(newExp)
			)
		).toEqual({
			expense: [exp, newExp],
			labels: [],
		});

		// newExp comes earlier than exp
		newExp = { ...newExp, date: new Date('2021-07-01').toISOString() };
		expect(
			reducer(
				{ expense: [exp], labels: [] },
				expenseActions.addExpense(newExp)
			)
		).toEqual({
			expense: [newExp, exp],
			labels: [],
		});
	});

	test('delete expense', () => {
		expect(
			reducer(
				{ expense: [exp], labels: [] },
				expenseActions.deleteExpense(exp._id)
			)
		).toEqual(initialState);
	});

	test('update expense', () => {
		const newExp = {
			_id: 'exp1',
			name: 'A new Exp',
			description: '',
			date: '2021-07-12T05:33:55.544Z',
			amount: 135,
			label: [],
		};

		expect(
			reducer(
				{ expense: [exp], labels: [] },
				expenseActions.updateExpense(newExp)
			)
		).toEqual({
			expense: [newExp],
			labels: [],
		});
	});

	test('update expense (date changed)', () => {
		let newExp = {
			_id: 'exp1',
			name: 'A new Exp',
			description: '',
			date: new Date('2021-07-31'),
			amount: 135,
			label: [],
		};

		const exp2 = {
			_id: 'exp2',
			name: 'Bare min expense number 2',
			description: '',
			date: new Date('2021-07-16'),
			amount: 130,
			label: [],
		};

		expect(
			reducer(
				{ expense: [exp, exp2], labels: [] },
				expenseActions.updateExpense(newExp)
			)
		).toEqual({
			expense: [exp2, newExp],
			labels: [],
		});

		newExp = { ...newExp, date: new Date('2021-07-01').toISOString() };
		expect(
			reducer(
				{ expense: [exp, exp2], labels: [] },
				expenseActions.updateExpense(newExp)
			)
		).toEqual({
			expense: [newExp, exp2],
			labels: [],
		});
	});

	test('replace expenses', () => {
		const exp2 = {
			_id: 'exp2',
			name: 'Bare min expense number 2',
			description: '',
			date: new Date('2021-07-16'),
			amount: 130,
			label: [],
		};

		// Replace empty expenses
		expect(
			reducer(
				initialState,
				expenseActions.replace({
					type: 'expenses',
					expenses: [exp2, exp],
				})
			)
		).toEqual({ expense: [exp, exp2], labels: [] });

		// Replace existing expense array
		expect(
			reducer(
				{ expense: [exp], labels: [] },
				expenseActions.replace({
					type: 'expenses',
					expenses: [exp, exp2],
				})
			)
		).toEqual({
			expense: [exp, exp2],
			labels: [],
		});
	});

	test('replace labels', () => {
		const newLabels = [
			{
				type: 'primary',
				name: '',
			},
			{
				type: 'dark',
				name: '',
			},
			{
				_id: '60e410e86de8df1a71e68357',
				type: 'success',
				name: 'iHerb',
			},
			{
				type: 'info',
				name: '',
			},
			{
				_id: '60e40d3d6de8df1a71e68353',
				type: 'warning',
				name: 'Sample-2',
			},
			{
				_id: '60ebae1551fd972004542eb6',
				type: 'danger',
				name: 'Red label',
			},
		];

		expect(
			reducer(
				{ expense: [], labels },
				expenseActions.replace({ type: 'labels', labels: newLabels })
			)
		).toEqual({ expense: [], labels: newLabels });
	});

	test('invalid replace', () => {
		const prevState = { expense: [exp], labels };
		const exp2 = {
			_id: 'exp2',
			name: 'Bare min expense number 2',
			description: '',
			date: new Date('2021-07-16'),
			amount: 130,
			label: [],
		};
		const newLabels = [
			{
				type: 'primary',
				name: '',
			},
			{
				type: 'dark',
				name: '',
			},
			{
				_id: '60e410e86de8df1a71e68357',
				type: 'success',
				name: 'iHerb',
			},
			{
				type: 'info',
				name: '',
			},
			{
				_id: '60e40d3d6de8df1a71e68353',
				type: 'warning',
				name: 'Sample-2',
			},
			{
				_id: '60ebae1551fd972004542eb6',
				type: 'danger',
				name: 'Red label',
			},
		];
		expect(
			reducer(
				prevState,
				expenseActions.replace({
					type: 'random',
					labels: newLabels,
					expense: [exp, exp2],
				})
			)
		).toEqual(prevState);
	});

	test('clears non-empty slice', () => {
		expect(
			reducer({ expense: [exp], labels: [] }, expenseActions.clear())
		).toEqual({ expense: [], labels: [] });
	});
});
