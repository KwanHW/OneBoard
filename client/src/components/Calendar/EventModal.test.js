import { getByText, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import EventModal from './EventModal';
import store from '../../store/index';
import ModalContext from '../../store/ModalContext';

const eventModalWrapper = ({ children }) => (
	<ModalContext.Provider value={{ isVisible: true, modal: children }}>
		<Provider store={store}>{children}</Provider>
	</ModalContext.Provider>
);

const event = {
	_id: 'abcdef',
	title: 'test title',
	start: new Date('2021-07-01'),
	end: new Date('2021-07-02'),
	allDay: true,
};

// Change featured not tested yet
describe('Event Modal Component', () => {
	test('render No Params', () => {
		render(<EventModal />, { wrapper: eventModalWrapper });

		const error = screen.getByText('Error!');

		expect(error).toBeInTheDocument;
	});

	test('render invalid modalType', () => {
		render(<EventModal modalType="abcdefg" />, {
			wrapper: eventModalWrapper,
		});

		const error = screen.getByText('Error!');

		expect(error).toBeInTheDocument;
	});

	test('render Read mode', () => {
		render(<EventModal event={event} modalType="Read" />, {
			wrapper: eventModalWrapper,
		});

		const title = screen.getByText('test title');
		expect(title).toBeInTheDocument;
	});

	test('render Add mode', () => {
		// addStart is the date time which the use selected on the calendar
		const addStart = new Date();

		render(<EventModal modalType="Add" addStart={addStart} />, {
			wrapper: eventModalWrapper,
		});

		const title = screen.getByText('Add Event');
		expect(title).toBeInTheDocument;
	});

	test('render Edit mode', () => {
		render(<EventModal modalType="Edit" event={event} />, {
			wrapper: eventModalWrapper,
		});

		const title = screen.getByText('Edit Event');
		expect(title).toBeInTheDocument;
	});

	test('render Delete mode', () => {
		render(<EventModal modalType="Delete" event={event} />, {
			wrapper: eventModalWrapper,
		});

		// Get the heading first then find the text
		const title = getByText(
			screen.getByRole('heading', { level: 3 }),
			'Delete Event'
		);
		expect(title).toBeInDocument;
	});
});
