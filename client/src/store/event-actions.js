import { createEvent } from '../lib/event';
import { eventActions } from './event';
import { userActions } from './user';

const URL_HEADERS = '/api/event';

function formatId(id) {
	return `${URL_HEADERS}/${id}`;
}

function formatQueryString(start, end) {
	return `${URL_HEADERS}?start=${start}&end=${end}`;
}

export const fetchEvents = (token, start, end) => {
	const formatStart = start.toISOString();
	const formatEnd = end.toISOString();
	return async (dispatch) => {
		const fetchData = async () => {
			const response = await fetch(
				formatQueryString(formatStart, formatEnd),
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				}
			);

			// If there are no events on the user it would also lead to 400
			if (!response.ok) {
				throw new Error('Could not fetch events');
			}

			const data = await response.json();

			return data;
		};

		try {
			const eventRes = await fetchData();
			const events = eventRes.map((event) => createEvent(event));
			dispatch(eventActions.replace(events));
		} catch (error) {}
	};
};

export const fetchEvent = (token, eventId) => {
	return async (dispatch) => {
		const fetchData = async () => {
			const response = await fetch(formatId(eventId), {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error('Could not fetch event');
			}

			const data = await response.json();

			return data;
		};
		try {
			const event = await fetchData();
			const formatEvent = createEvent(event);
			return formatEvent;
		} catch (error) {}
	};
};

export const addEvent = (token, event) => {
	return async (dispatch) => {
		const options = {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(event),
		};

		const postData = async () => {
			const response = await fetch(URL_HEADERS, options);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message);
			}
			return data;
		};

		try {
			const addEvent = await postData();
			const event = createEvent(addEvent);
			dispatch(eventActions.addEvent(event));
		} catch (error) {
			alert('Error');
		}
	};
};

export const updateEvent = (token, eventUpd) => {
	return async (dispatch) => {
		const updateData = async () => {
			const response = await fetch(formatId(eventUpd._id), {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(eventUpd),
			});

			if (!response.ok) {
				throw new Error('Could not update event');
			}

			const data = await response.json();

			return data;
		};

		try {
			const { event } = await updateData();
			const formatEvent = createEvent(event);
			dispatch(eventActions.updateEvent(formatEvent));
		} catch (error) {}
	};
};

export const deleteEvent = (token, id) => {
	return async (dispatch) => {
		const deleteData = async () => {
			console.log(formatId(id));
			const response = await fetch(formatId(id), {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error('Could not update event');
			}

			const data = await response.json();

			return data;
		};

		try {
			await deleteData();
			dispatch(eventActions.deleteEvent(id));
		} catch (error) {}
	};
};

export const changeFeatured = (token, id) => {
	return async (dispatch) => {
		const options = {
			method: id !== '' ? 'POST' : 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		};

		const url = `${URL_HEADERS}/${id}`;

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
