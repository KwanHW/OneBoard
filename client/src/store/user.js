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
		login(state, action) {
			return { ...state, ...action.payload };
		},
		logout(state) {
			return initialState;
		},
		update(state, action) {
			return { ...state, ...action.payload };
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
			const id = action.payload;
			let newIndex =
				state.boards.boards.findIndex((board) => board._id === id) - 1;
			if (newIndex === -1) newIndex = 1;
			state.boards.selectedBoard = state.boards.boards[newIndex];
			state.boards.boards = state.boards.boards.filter(
				(board) => board._id !== id
			);
		},
		// * Calendar related information
		updateFeatured(state, action) {
			state.featured = action.payload;
		},
	},
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
