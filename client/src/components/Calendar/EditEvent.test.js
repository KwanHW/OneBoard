import { getByRole, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import store from '../../store/index';
import { userActions } from '../../store/user';
import EditEvent from './EditEvent';

const event = {
	_id: 'abcdef',
	title: 'test title',
	start: new Date('2021-07-01'),
	end: new Date('2021-07-02'),
	allDay: false,
	description: '',
	resource: '',
};

const reduxWrapper = ({ children }) => (
	<Provider store={store}>{children}</Provider>
);

describe('EditEvent (Edit Mode)', () => {
	test('renders EditEvent (bare minimum)', () => {
		render(<EditEvent event={event} />, { wrapper: reduxWrapper });
		const title = screen.getByDisplayValue(event.title);
		const dateRange = screen.getAllByDisplayValue(
			/\d{2}\/\d{2}\/\d{4} \d{1,2}:\d{2} [ap]m/
		);
		const description = screen.getByRole('textbox', {
			name: 'Description',
		});
		const resource = screen.getByRole('textbox', { name: 'Location' });
		const allDay = screen.getByRole('checkbox', { checked: event.allDay });

		expect(title).toBeInTheDocument;
		expect(dateRange).toBeInTheDocument;
		expect(description).toBeInTheDocument;
		expect(resource).toBeInTheDocument;
		expect(allDay).toBeInTheDocument;
	});

	test('invalid input - empty title', () => {
		render(<EditEvent event={event} />, { wrapper: reduxWrapper });
		const title = screen.getByDisplayValue(event.title);
		const submitBtn = screen.getByText('Submit');
		userEvent.clear(title);
		userEvent.click(submitBtn);
		const errorMsg = screen.getByText(
			'Please make sure title and duration is not empty.'
		);
		expect(errorMsg).toBeVisible;
	});

	// Need to find a way to click on the clear
	// test('invalid input - empty dates', () => {
	// 	render(<EditEvent event={event} />, {
	// 		wrapper: reduxWrapper,
	// 	});
	// 	const submitBtn = screen.getByText('Submit');
	// 	userEvent.click(submitBtn);
	// 	const errorMsg = screen.getByText(
	// 		'Please make sure title and duration is not empty.'
	// 	);
	// 	expect(errorMsg).toBeVisible;
	// });
});
