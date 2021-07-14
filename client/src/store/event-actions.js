import { createEvent } from '../lib/event';
import { eventActions } from './event';
import { userActions } from './user';
import {
	deleteRequest,
	getRequest,
	postRequest,
	putRequest,
	determineURL,
	formatQueryString,
} from '../lib/fetch';

const URL_HEADER = '/api/event';

export const fetchEvents = (token, start, end) => {
	const formatStart = start.toISOString();
	const formatEnd = end.toISOString();
	return async (dispatch) => {
		try {
			const eventRes = await getRequest(
				token,
				formatQueryString(URL_HEADER, formatStart, formatEnd)
			);
			const events = eventRes.map((event) => createEvent(event));
			dispatch(eventActions.replace(events));
		} catch (error) {}
	};
};

export const fetchEvent = (token, eventId) => {
	return async () => {
		try {
			const event = await getRequest(
				token,
				determineURL(URL_HEADER, eventId)
			);
			const formatEvent = createEvent(event);
			return formatEvent;
		} catch (error) {}
	};
};

export const addEvent = (token, eventReq) => {
	return async (dispatch) => {
		try {
			const addEvent = await postRequest(token, URL_HEADER, eventReq);
			const event = createEvent(addEvent);
			dispatch(eventActions.addEvent(event));
		} catch (error) {
			alert('Error');
		}
	};
};

export const updateEvent = (token, eventUpd) => {
	return async (dispatch) => {
		try {
			const event = await putRequest(
				token,
				determineURL(URL_HEADER, eventUpd._id),
				eventUpd
			);
			const formatEvent = createEvent(event);
			dispatch(eventActions.updateEvent(formatEvent));
		} catch (error) {}
	};
};

export const deleteEvent = (token, id) => {
	return async (dispatch) => {
		try {
			deleteRequest(token, determineURL(URL_HEADER, id));
			dispatch(eventActions.deleteEvent(id));
		} catch (error) {}
	};
};

// Need to see how to change this
export const changeFeatured = (token, id) => {
	return async (dispatch) => {
		const options = {
			method: id !== '' ? 'POST' : 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		};

		const url = `${URL_HEADER}/${id}`;

		const postData = async () => {
			const response = await fetch(url, options);

			if (!response.ok) {
				throw new Error('Could not update featured');
			}
		};

		try {
			await postData();
			dispatch(userActions.updateFeatured(id));
		} catch (error) {
			console.log('Error:', error.message);
		}
	};
};
