import App from './App';
import { Provider } from 'react-redux';
import store from './store/index';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('App Component', () => {
	test('renders login page', () => {
		render(
			<Provider store={store}>
				<App />
			</Provider>
		);
		const loginTitle = screen.getAllByText('Log In');

		expect(loginTitle).toBeInTheDocument;
	});

	test('renders register page (button click)', () => {
		render(
			<Provider store={store}>
				<App />
			</Provider>
		);

		const linkElement = screen.getByRole('link');
		userEvent.click(linkElement);

		const registerTitle = screen.getAllByText('Register');

		expect(registerTitle).toBeInTheDocument;
	});
});
