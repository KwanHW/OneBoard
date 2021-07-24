import reducer, { userActions } from './user';

const initialState = {
	id: '',
	firstName: '',
	lastName: '',
	email: '',
	featured: '',
	boards: { boards: [], selectedBoard: '' },
};

const userLoggedIn = {
	id: 'user-1',
	firstName: 'Test 762',
	lastName: 'Test',
	email: 'test2@gmail.com',
	featured: '60deecdafa3eb5041de27d49',
	boards: {
		boards: [
			{
				_id: 'board-1',
				name: 'board-420',
			},
			{
				_id: 'board-2',
				name: 'Empty',
			},
		],
		selectedBoard: {
			_id: 'board-1',
			name: 'board-420',
		},
	},
};

describe('REDUX: user slice (user information)', () => {
	test('login', () => {
		const userInfo = {
			id: 'user-1',
			firstName: 'Jon',
			lastName: 'Doe',
			email: 'jondoe@gmail.com',
			featured: '',
		};

		expect(reducer(initialState, userActions.login(userInfo))).toEqual({
			id: 'user-1',
			firstName: 'Jon',
			lastName: 'Doe',
			email: 'jondoe@gmail.com',
			featured: '',
			boards: { boards: [], selectedBoard: '' },
		});
	});

	test('update user information', () => {
		expect(
			reducer(
				userLoggedIn,
				userActions.update({
					firstName: 'Jane',
					lastName: 'Smith',
				})
			)
		).toEqual({
			...userLoggedIn,
			firstName: 'Jane',
			lastName: 'Smith',
		});
	});

	test('logout', () => {
		expect(reducer(userLoggedIn, userActions.logout())).toEqual(
			initialState
		);
	});
});

describe('REDUX: user slice (kanban information)', () => {
	const newBoard = { _id: 'board-3', name: 'A new board' };
	test('add board', () => {
		const expectedBoards = {
			boards: [...userLoggedIn.boards.boards, newBoard],
			selectedBoard: userLoggedIn.boards.selectedBoard,
		};

		expect(reducer(userLoggedIn, userActions.addBoard(newBoard))).toEqual({
			...userLoggedIn,
			boards: expectedBoards,
		});
	});

	// Set boards

	test('set selected board (existing board)', () => {
		const expectedBoards = {
			boards: [...userLoggedIn.boards.boards],
			selectedBoard: {
				_id: 'board-2',
				name: 'Empty',
			},
		};

		// Replace existing board
		expect(
			reducer(userLoggedIn, userActions.setSelectedBoard('board-2'))
		).toEqual({ ...userLoggedIn, boards: expectedBoards });

		const initBoards = {
			boards: [...userLoggedIn.boards.boards],
			selectedBoard: {},
		};
		const initState = { ...userLoggedIn, boards: initBoards };

		// Setting from empty selectedBoard
		expect(
			reducer(initState, userActions.setSelectedBoard('board-2'))
		).toEqual({ ...userLoggedIn, boards: expectedBoards });
	});

	test('update board', () => {
		const newBoard = {
			_id: 'board-1',
			name: 'A new board',
		};

		const expectedBoard = {
			boards: [
				newBoard,
				{
					_id: 'board-2',
					name: 'Empty',
				},
			],
			selectedBoard: newBoard,
		};

		// User has to be on the selected board in order to make changes
		expect(
			reducer(userLoggedIn, userActions.updateBoard(newBoard))
		).toEqual({
			...userLoggedIn,
			boards: expectedBoard,
		});
	});

	test('deleteBoard', () => {
		const initBoard = {
			boards: userLoggedIn.boards.boards,
			selectedBoard: userLoggedIn.boards.boards[1],
		};
		const initState = { ...userLoggedIn, boards: initBoard };

		const notFirstBoards = {
			boards: [userLoggedIn.boards.boards[0]],
			selectedBoard: userLoggedIn.boards.selectedBoard,
		};

		// Board to delete is not first on boards
		expect(reducer(initState, userActions.deleteBoard('board-2'))).toEqual({
			...userLoggedIn,
			boards: notFirstBoards,
		});

		const isFirstBoards = {
			boards: [userLoggedIn.boards.boards[1]],
			selectedBoard: userLoggedIn.boards.boards[1],
		};

		// Board to delete is first on boards
		expect(
			reducer(userLoggedIn, userActions.deleteBoard('board-1'))
		).toEqual({ ...userLoggedIn, boards: isFirstBoards });
	});
});

describe('REDUX: user slice (featured event)', () => {
	test('update featured', () => {
		// Existing featured
		expect(
			reducer(userLoggedIn, userActions.updateFeatured('event-2'))
		).toEqual({ ...userLoggedIn, featured: 'event-2' });

		// Setting on an empty featured
		expect(
			reducer(
				{ ...userLoggedIn, featured: '' },
				userActions.updateFeatured('event-2')
			)
		).toEqual({ ...userLoggedIn, featured: 'event-2' });

		// Setting an existing featured to empty
		expect(reducer(userLoggedIn, userActions.updateFeatured(''))).toEqual({
			...userLoggedIn,
			featured: '',
		});
	});
});
