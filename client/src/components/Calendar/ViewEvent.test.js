import { render, screen } from '@testing-library/react';
import ViewEvent from './ViewEvent';

// Basic Event
const event = {
	_id: 'abcdef',
	title: 'test title',
	start: new Date('2021-07-01'),
	end: new Date('2021-07-02'),
	allDay: false,
	description: '',
	resource: '',
};

describe('View Event Component', () => {
	// Render no allDay
	test('event no allDay (bare minimum event)', () => {
		render(<ViewEvent event={event} />);

		const dateTime = screen.getByText(
			/(\d{2} \w{3}, \d{4}, \d:\d{2} [ap]m)/
		);

		// No location, No description
		const allParas = screen.getAllByText(/^No/);
		expect(dateTime).toBeInTheDocument;
		expect(allParas).toHaveLength(2);
	});

	// Render with allDay
	test('event allDay', () => {
		const testEvent = { ...event, allDay: true };
		render(<ViewEvent event={testEvent} />);

		const dateTime = screen.queryByText(
			/(\d{2} \w{3}, \d{4}, \d:\d{2} [ap]m)/
		);
		expect(dateTime).not.toBeInTheDocument;
	});

	// Render with description
	test('event with description', () => {
		const description = 'A Description';
		const testEvent = { ...event, description };
		render(<ViewEvent event={testEvent} />);

		const descRender = screen.getByText(description);
		expect(descRender).toBeInTheDocument;
	});

	// Render location
	test('event with description', () => {
		const resource = 'A resource';
		const testEvent = { ...event, resource };
		render(<ViewEvent event={testEvent} />);

		const descRender = screen.getByText(resource);
		expect(descRender).toBeInTheDocument;
	});
});
