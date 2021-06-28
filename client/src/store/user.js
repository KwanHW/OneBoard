import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	id: '',
	firstName: '',
	lastName: '',
	email: '',
	featured: '',
	boards: { boards: [], selectedBoard: '' },
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		// TODO can be refactored
		login(state, action) {
			state.id = action.payload.id;
			state.firstName = action.payload.firstName;
			state.lastName = action.payload.lastName;
			state.email = action.payload.email;
			state.featured = action.payload.featured;
		},
		logout(state) {
			return initialState;
		},
		// TODO To change soon
		update(state, action) {
			return { ...state, ...action.payload };
			// const { firstName, lastName } = action.payload;
			// return { ...state, firstName, lastName };
		},
		// * Kanban related information
		addBoard(state, action) {
			state.boards.boards = [...state.boards.boards, action.payload];
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
		updateBoard(state, action) {
			const { _id } = action.payload;
			state.boards.boards = state.boards.boards.map((board) =>
				board._id === _id ? action.payload : board
			);
			state.boards.selectedBoard = action.payload;
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
		// * Calendar related information
		updateFeatured(state, action) {
			console.log(action.payload);
			state.featured = action.payload;
		},
	},
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
