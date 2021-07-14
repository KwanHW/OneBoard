import Board from './Board';
import { Provider } from 'react-redux';
import { useCookies } from 'react-cookie';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import store from '../../store/index';

describe('Board element', () => {
	beforeAll(() => {
		document.cookie = 'aCookie';
	});

	test('renders empty board without crashing', () => {
		render(
			<Provider store={store}>
				<Board />
			</Provider>
		);
		console.log(store);

		const emptyBoard = screen.getByText('No boards');

		expect(emptyBoard).toBeInTheDocument;
	});

	// test('renders non-empty board without crashing', () => {
	// 	render(
	// 		<Provider store={store}>
	// 			<Board />
	// 		</Provider>
	// 	);
	// });
});
