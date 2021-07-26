import reducer, { kanbanActions } from './kanban';

const initState = {
	id: '',
	name: '',
	labels: [],
	columns: [],
};

const nonEmptyBoard = {
	id: '60dee95360caf473891fe2bd',
	name: 'Sample Board',
	labels: [
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
	],
	columns: [
		{
			_id: 'col-1',
			order: 0,
			name: 'To-Do',
			tasks: [
				{
					_id: 'task-1',
					name: 'Example Task',
					order: 0,
					description: '',
					subTask: [],
					expireAt: 1625221459108,
					label: [],
				},
			],
		},
		// {
		// 	_id: '60dee95360caf473891fe2bf',
		// 	order: 1,
		// 	name: 'In Progress',
		// 	tasks: [],
		// },
		// {
		// 	_id: '60dee95360caf473891fe2c0',
		// 	order: 2,
		// 	name: 'Done',
		// 	tasks: [],
		// },
	],
};

describe('REDUX: kanban slice', () => {
	test('initialise kanban', () => {
		expect(reducer(undefined, {})).toEqual(initState);
	});

	test('clear kanban', () => {
		// Empty State
		expect(reducer(initState, kanbanActions.clear())).toEqual(initState);

		// Non-empty state
		expect(reducer(nonEmptyBoard, kanbanActions.clear())).toEqual(
			initState
		);
	});
});

describe('REDUX: kanban slice - Column', () => {
	const newCol = {
		_id: 'col-2',
		order: 1,
		name: 'A new col',
		tasks: [],
	};

	test('add column (empty board)', () => {
		expect(reducer(initState, kanbanActions.addColumn(newCol))).toEqual({
			...initState,
			columns: [newCol],
		});
	});

	test('add column (non-empty board', () => {
		const updatedCols = [
			{
				_id: 'col-1',
				order: 0,
				name: 'To-Do',
				tasks: [
					{
						_id: 'task-1',
						name: 'Example Task',
						order: 0,
						description: '',
						subTask: [],
						expireAt: 1625221459108,
						label: [],
					},
				],
			},
			newCol,
		];

		expect(reducer(nonEmptyBoard, kanbanActions.addColumn(newCol))).toEqual(
			{
				...nonEmptyBoard,
				columns: updatedCols,
			}
		);
	});

	test('update column', () => {
		const colToUpdate = {
			_id: 'col-1',
			order: 0,
			name: 'A new column',
			tasks: [
				{
					_id: 'task-1',
					name: 'Example Task',
					order: 0,
					description: '',
					subTask: [],
					expireAt: 1625221459108,
					label: [],
				},
			],
		};

		// Updating column details only
		// Refer to Task suite for task changes
		expect(
			reducer(
				nonEmptyBoard,
				kanbanActions.updateColumn({
					_id: 'col-1',
					column: colToUpdate,
				})
			)
		).toEqual({ ...nonEmptyBoard, columns: [colToUpdate] });
	});

	test('delete column', () => {
		expect(
			reducer(nonEmptyBoard, kanbanActions.deleteColumn('col-1'))
		).toEqual({
			...nonEmptyBoard,
			columns: [],
		});
	});
});

describe('REDUX: kanban slice - Task', () => {
	const newTask = {
		_id: 'task-2',
		name: 'Example Task',
		order: 0,
		description: '',
		expireAt: '',
		subTask: [],
		label: [],
	};

	test('add task to empty column', () => {
		const emptyColumnBoard = {
			id: '60dee95360caf473891fe2bd',
			name: 'Sample Board',
			labels: [],
			columns: [
				{
					_id: 'col-1',
					order: 0,
					name: 'To-Do',
					tasks: [],
				},
			],
		};

		expect(
			reducer(
				emptyColumnBoard,
				kanbanActions.addTask({ task: newTask, id: 'col-1' })
			)
		).toEqual({
			...emptyColumnBoard,
			columns: [
				{
					_id: 'col-1',
					order: 0,
					name: 'To-Do',
					tasks: [newTask],
				},
			],
		});
	});

	test('add task to non-empty column', () => {
		const newTasks = [
			{
				_id: 'task-1',
				name: 'Example Task',
				order: 0,
				description: '',
				subTask: [],
				expireAt: 1625221459108,
				label: [],
			},
			newTask,
		];

		expect(
			reducer(
				nonEmptyBoard,
				kanbanActions.addTask({ task: newTask, id: 'col-1' })
			)
		).toEqual({
			...nonEmptyBoard,
			columns: [
				{
					_id: 'col-1',
					order: 0,
					name: 'To-Do',
					tasks: newTasks,
				},
			],
		});
	});

	test('update task', () => {
		const updTask = {
			_id: 'task-1',
			name: 'An Updated Task',
			order: 0,
			description: '',
			expireAt: '',
			subTask: [],
			label: [],
		};

		expect(
			reducer(nonEmptyBoard, kanbanActions.updateTask(updTask))
		).toEqual({
			...nonEmptyBoard,
			columns: [
				{
					_id: 'col-1',
					order: 0,
					name: 'To-Do',
					tasks: [updTask],
				},
			],
		});
	});

	test('delete task', () => {
		const expectedCol = [
			{
				_id: 'col-1',
				order: 0,
				name: 'To-Do',
				tasks: [],
			},
		];

		expect(
			reducer(nonEmptyBoard, kanbanActions.deleteTask('task-1'))
		).toEqual({ ...nonEmptyBoard, columns: expectedCol });
	});
});
