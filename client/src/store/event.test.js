import reducer, { eventActions } from './event';

// Bare minimum event
const event = {
	_id: 'abcdef',
	title: 'test title',
	start: new Date('2021-07-01'),
	end: new Date('2021-07-02'),
	allDay: false,
	description: '',
	resource: '',
};

describe('REDUX: event slice', () => {
	test('initialise state slice', () => {
		expect(reducer(undefined, {})).toEqual([]);
	});

	test('add event to empty slice', () => {
		expect(reducer([], eventActions.addEvent(event))).toEqual([event]);
	});

	test('add event to non-empty slice', () => {
		const newEvent = {
			_id: 'asdfgh',
			title: 'a new event',
			start: new Date('2021-07-01'),
			end: new Date('2021-07-02'),
			allDay: false,
			description: '',
			resource: '',
		};

		expect(reducer([event], eventActions.addEvent(newEvent))).toEqual([
			event,
			newEvent,
		]);
	});

	test('update event in slice (has id)', () => {
		const newEvent = {
			_id: 'abcdef',
			title: 'a new event',
			start: new Date('2021-07-01'),
			end: new Date('2021-07-02'),
			allDay: false,
			description: '',
			resource: '',
		};

		expect(reducer([event], eventActions.updateEvent(newEvent))).toEqual([
			newEvent,
		]);
	});

	test('update event in slice (no id)', () => {
		const newEvent = {
			_id: '123456',
			title: 'a new event',
			start: new Date('2021-07-01'),
			end: new Date('2021-07-02'),
			allDay: false,
			description: '',
			resource: '',
		};

		expect(reducer([event], eventActions.updateEvent(newEvent))).toEqual([
			event,
		]);
	});

	test('delete event (1 element)', () => {
		expect(reducer([event], eventActions.deleteEvent(event._id))).toEqual(
			[]
		);
	});

	test('delete event (> 1 elements)', () => {
		const newEvent = {
			_id: 'asdfgh',
			title: 'a new event',
			start: new Date('2021-07-01'),
			end: new Date('2021-07-02'),
			allDay: false,
			description: '',
			resource: '',
		};
		const prevState = [event, newEvent];

		expect(reducer(prevState, eventActions.deleteEvent(event._id))).toEqual(
			[newEvent]
		);
	});

	test('clear slice', () => {
		// Empty slice
		expect(reducer([], eventActions.clear())).toEqual([]);

		// Non-empty slice
		expect(reducer([event], eventActions.clear())).toEqual([]);
	});
});
