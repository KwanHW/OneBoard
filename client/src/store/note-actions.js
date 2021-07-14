import { createNote } from '../lib/note';
import { noteActions } from './note';
import {
	deleteRequest,
	getRequest,
	postRequest,
	putRequest,
	determineURL,
} from '../lib/fetch';

const URL_HEADER = 'api/note';

// May need to inspect further
export const fetchAllNotes = (token) => {
	return async (dispatch) => {
		try {
			const responseData = await getRequest(token, URL_HEADER);
			const notes = responseData.map((note) => createNote(note));
			dispatch(noteActions.replace(notes));
		} catch (error) {}
	};
};

export const addNote = (token, dataReq) => {
	return async (dispatch) => {
		try {
			const responseData = await postRequest(token, URL_HEADER, dataReq);
			const note = createNote(responseData);
			dispatch(noteActions.addNote(note));
		} catch (error) {}
	};
};

export const deleteNote = (token, id) => {
	return async (dispatch) => {
		try {
			deleteRequest(token, determineURL(URL_HEADER, id));
			dispatch(noteActions.deleteNote(id));
		} catch (error) {}
	};
};

export const updateNote = (token, id, dataReq) => {
	return async (dispatch) => {
		try {
			putRequest(token, determineURL(URL_HEADER, id), dataReq);
			dispatch(noteActions.updateNote(dataReq));
		} catch (error) {}
	};
};
