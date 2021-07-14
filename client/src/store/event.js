import { createSlice } from '@reduxjs/toolkit';
const initialState = [];

const eventSlice = createSlice({
	name: 'event',
	initialState,
	reducers: {
		addEvent(state, action) {
			state.push(action.payload);
		},
		updateEvent(state, action) {
			const newEvent = action.payload;
			console.log(newEvent);
			return state.map((event) =>
				newEvent._id === event._id ? newEvent : event
			);
		},
		deleteEvent(state, action) {
			const id = action.payload;
			return state.filter((event) => event._id !== id);
		},
		replace(state, action) {
			return action.payload;
		},
		store(state) {
			localStorage.setItem('event', JSON.stringify(state));
		},
		clear(state) {
			return initialState;
		},
	},
});

export const eventActions = eventSlice.actions;

export default eventSlice.reducer;
