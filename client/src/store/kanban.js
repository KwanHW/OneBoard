import { createSlice } from '@reduxjs/toolkit';
import { createColumn, createTask } from '../lib/kanban';

const initState = {
	id: '',
	name: '',
	labels: [],
	columns: [
		// ! Causing error messages - Commented for documentation purposes
		// {
		// 	id: '',
		// 	name: '',
		// 	order: -1,
		// 	tasks: [
		// 		{
		// 			id: '',
		// 			name: '',
		// 			description: '',
		// 			subtasks: [],
		// 			label: '', // Blanked for now
		// 		},
		// 	],
		// },
	],
};

const kanbanSlice = createSlice({
	name: 'kanban',
	initialState: initState,
	reducers: {
		// * Tasks
		addTask(state, action) {
			const { task, id: columnId } = action.payload;
			const newTask = createTask(task);
			const column = state.columns.find((col) => col._id === columnId);
			column.tasks.push(newTask);
		},
		updateTask(state, action) {
			const newTask = createTask(action.payload);
			const { _id } = newTask;

			const taskInCol = state.columns.find((col) =>
				col.tasks.find((task) => task._id === _id)
			);

			const newTasks = taskInCol.tasks.map((task) =>
				task._id === _id ? newTask : task
			);

			const newCol = { ...taskInCol, tasks: newTasks };
			state.columns = state.columns.map((col) =>
				col._id === newCol._id ? newCol : col
			);
		},
		deleteTask(state, action) {
			const id = action.payload;
			const column = state.columns.find((col) =>
				col.tasks.find((task) => task._id === id)
			);
			const newTasks = column.tasks.filter((task) => task._id !== id);
			column.tasks = newTasks;
		},
		// * Column
		addColumn(state, action) {
			const column = createColumn(action.payload);
			state.columns = [...state.columns, column];
		},
		deleteColumn(state, action) {
			const id = action.payload;
			state.columns = state.columns.filter((col) => col._id !== id);
		},
		updateColumn(state, action) {
			const { _id, column } = action.payload;
			const oldCol = { ...state.columns.find((col) => col._id === _id) };
			const newCol = { ...oldCol, ...column };
			state.columns = state.columns.map((col) =>
				col._id === _id ? newCol : col
			);
		},
		// * Board
		updateBoard(state, action) {
			const newBoard = action.payload;
			return { ...state, ...newBoard };
		},
		updateLabels(state, action) {
			const { name, labels } = action.payload;
			state.name = name;
			state.labels = labels;
		},
		store(state) {
			localStorage.setItem('currentBoard', JSON.stringify(state));
		},
		replace(state, action) {
			return action.payload;
		},
		clear(state) {
			return initState;
		},
	},
});

export const kanbanActions = kanbanSlice.actions;

export default kanbanSlice.reducer;
