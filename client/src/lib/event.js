import moment from 'moment';

export function createEvent(event) {
	const { _id, name, description, allDay, start, end, place } = event;
	return {
		_id,
		title: name,
		description,
		allDay,
		start,
		end,
		resource: place,
	};
}

export function convertToDate(event) {
	const start = new Date(event.start);
	const end = new Date(event.end);
	return { ...event, start, end };
}

export function initializeEvent(event, addStart) {
	const isAdd = !!!event;
	const title = event ? event.title : '';
	const dateTime = event
		? [moment(event.start), moment(event.end)]
		: [moment(addStart), moment(addStart).add(1, 'hour')];
	const description = event ? event.description || '' : '';
	const allDay = event ? event.allDay : false;
	const resource = event ? event.resource || '' : '';
	return { isAdd, allDay, title, dateTime, description, resource };
}

export function updateEventTime(data) {
	const { start: newStart, end: newEnd, event } = data;
	const serialDate = [newStart, newEnd].map((date) => date.toISOString());
	return {
		...event,
		start: serialDate[0],
		end: serialDate[1],
	};
}

export function formatDate(date, allDay) {
	return allDay
		? moment(date).format('DD MMM, YYYY')
		: moment(date).format('DD MMM, YYYY, h:mm a');
}

export function durationIsSame(currentDuration, durationToCompare) {
	const keys = Object.keys(currentDuration);
	return keys
		.map((key) => {
			const currentTime = currentDuration[key];
			const compareTime = durationToCompare[key];
			return moment(currentTime).isSame(compareTime);
		})
		.some((isSame) => isSame);
}
