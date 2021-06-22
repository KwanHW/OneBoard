import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	id: '',
	firstName: '',
	lastName: '',
	email: '',
	boards: { boards: [], selectedBoard: '' },
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		login(state, action) {
			state.id = action.payload.id;
			state.firstName = action.payload.firstName;
			state.lastName = action.payload.lastName;
			state.email = action.payload.email;
		},
		logout(state) {
			return initialState;
		},
		update(state, action) {
			const { firstName, lastName } = action.payload;
			return { ...state, firstName, lastName };
		},
		addBoard(state, action) {
			state.boards.boards.push(action.payload);
		},
		setBoards(state, action) {
			state.boards = action.payload;
		},
		setSelectedBoard(state, action) {
			const boardId = action.payload;
			const boards = state.boards.boards;
			state.boards.selectedBoard = boards.find(
				(board) => board._id === boardId
			);
		},
		deleteBoard(state, action) {
			const { boardId, index } = action.payload;
			let newIndex = index - 1;
			if (index === 0) newIndex = 1;
			state.boards.selectedBoard = state.boards.boards[newIndex];
			state.boards.boards = state.boards.boards.filter(
				(board) => board._id !== boardId
			);
		},
	},
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
