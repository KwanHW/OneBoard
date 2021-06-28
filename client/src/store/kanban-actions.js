import { kanbanActions } from './kanban';
import { userActions } from './user';
import { createColumn, createLabels } from '../lib/kanban';

export const TYPES = {
	TASK: 'TASK',
	COLUMN: 'COLUMN',
	BOARD: 'BOARD',
};

const URL_HEADER = 'api/kanban';

function sortData(dataA, dataB) {
	return dataA.order - dataB.order;
}

function determineURL(type, id) {
	let ending;
	switch (type) {
		case TYPES.TASK:
			ending = `/task/${id}`;
			break;
		case TYPES.COLUMN:
			ending = `/column/${id}`;
			break;
		default:
			ending = `/${id}`;
			break;
	}
	return URL_HEADER + ending;
}

// * BOARD
export const fetchAllBoards = (token) => {
	return async (dispatch) => {
		const fetchData = async () => {
			const response = await fetch(`${URL_HEADER}/boards`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error('Could not retrieve boards!');
			}

			const data = await response.json();

			return data;
		};

		try {
			const boardsData = await fetchData();
			let boards = {};
			boardsData.forEach((board) => {
				const { name, labels, columns, _id: id } = board;
				const newColumns = columns
					.sort(sortData)
					.map((col) => createColumn(col));
				const formatLabels = createLabels(labels);
				boards[id] = {
					id,
					name,
					labels: formatLabels,
					columns: newColumns,
				};
			});

			const boardKeys = Object.keys(boards);
			const boardKey = boardKeys[0];

			let boardArr = [];
			boardKeys.forEach((key) =>
				boardArr.push({ _id: key, name: boards[key].name })
			);

			dispatch(
				userActions.setBoards({
					boards: boardArr,
					selectedBoard: boardArr[0],
				})
			);
			const boardToLoad = boards[boardKey];
			dispatch(kanbanActions.replace(boardToLoad));
			localStorage.setItem('currentBoard', JSON.stringify(boardToLoad));
		} catch (error) {
			console.warn(error.message);
		}
	};
};

export const getBoard = (token, id) => {
	return async (dispatch) => {
		const getData = async () => {
			const response = await fetch(determineURL(TYPES.BOARD, id), {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error('Could not retrieve board!');
			}

			const data = await response.json();

			return data;
		};

		try {
			const board = await getData();
			const { name, labels, columns, _id: id } = board;
			const newColumns = columns
				.sort(sortData)
				.map((col) => createColumn(col));

			const formatLabels = createLabels(labels);
			// console.log(formatLabels);
			const newBoard = {
				id,
				name,
				labels: formatLabels,
				columns: newColumns,
			};
			dispatch(kanbanActions.replace(newBoard));
			localStorage.setItem('currentBoard', JSON.stringify(newBoard));
		} catch (error) {
			alert(error.message);
		}
	};
};

// Used for updating column information
export const updateLabels = (token, dataReq, id) => {
	return async (dispatch) => {
		const postData = async () => {
			const response = await fetch(determineURL(TYPES.BOARD, id), {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(dataReq),
			});

			if (!response.ok) {
				throw new Error(`Could not change board`);
			}

			const data = await response.json();

			return data;
		};
		try {
			const res = await postData();
			const { labels, name } = res.board;
			const formatLabels = createLabels(labels);
			dispatch(
				kanbanActions.updateLabels({ name, labels: formatLabels })
			);
		} catch (error) {}
	};
};

// * See try blocks for all
export const addData = (token, type, data, id = '') => {
	return async (dispatch) => {
		const url = determineURL(type, id);
		const options = {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		};

		const postData = async () => {
			const response = await fetch(url, options);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message);
			}
			return data;
		};

		try {
			const response = await postData();
			switch (type) {
				case TYPES.TASK:
					dispatch(
						kanbanActions.addTask({ task: response.task, id })
					);
					break;
				case TYPES.COLUMN:
					dispatch(kanbanActions.addColumn(response.data));
					break;
				default:
					// ! Special things need to be done for add Board
					const { _id, name } = response;
					dispatch(userActions.addBoard({ _id, name }));
					break;
			}
		} catch (error) {}
	};
};

export const deleteData = (token, type, id) => {
	return async (dispatch) => {
		const url = determineURL(type, id);
		const postData = async () => {
			const response = await fetch(url, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error(`Could not delete ${type}`);
			}

			const data = await response.json();

			return data;
		};

		try {
			await postData();
			switch (type) {
				case TYPES.TASK:
					dispatch(kanbanActions.deleteTask(id));
					break;
				case TYPES.COLUMN:
					dispatch(kanbanActions.deleteColumn(id));
					break;
				default:
					// ! Special things need to be done for delete Board
					break;
			}
		} catch (error) {}
	};
};

export const updateData = (token, type, dataReq, id) => {
	return async (dispatch) => {
		const postData = async () => {
			const response = await fetch(determineURL(type, id), {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(dataReq),
			});

			if (!response.ok) {
				throw new Error(`Could not change ${type.toLowerCase()}`);
			}

			const data = await response.json();

			return data;
		};

		try {
			const data = await postData();
			switch (type) {
				case TYPES.TASK:
					dispatch(kanbanActions.updateTask(data.task));
					break;
				case TYPES.COLUMN:
					dispatch(
						kanbanActions.updateColumn({ column: dataReq, _id: id })
					);
					break;
				default:
					// Used for updating column order
					dispatch(kanbanActions.updateBoard(dataReq));
					break;
			}
		} catch (error) {}
	};
};
