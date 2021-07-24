import { createSlice } from '@reduxjs/toolkit';

const initialState = { notes: [], isEmpty: true };

const noteSlice = createSlice({
	name: 'note',
	initialState,
	reducers: {
		addNote(state, action) {
			const note = action.payload;
			state.notes = [...state.notes, note];
			state.isEmpty = false;
		},
		updateNote(state, action) {
			const newNote = action.payload;
			state.notes = state.notes.map((note) =>
				note._id === newNote._id ? newNote : note
			);
		},
		deleteNote(state, action) {
			const id = action.payload;
			if (state.notes.length === 1) state.isEmpty = true;
			state.notes = state.notes.filter((note) => note._id !== id);
		},
		replace(state, action) {
			const notes = action.payload;
			const isEmpty = notes.length === 0;
			return { notes, isEmpty };
		},
		clear(state) {
			return initialState;
		},
		// store(state) {
		// 	localStorage.setItem('notes', JSON.stringify(state));
		// },
	},
});

export const noteActions = noteSlice.actions;

export default noteSlice.reducer;
