import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../store/index';
import Login from './Login';
// import reducer, { userActions } from '../../store/user';

const LoginComponent = (
	<Router>
		<Provider store={store}>
			<Login />
		</Provider>
	</Router>
);

describe('Login Component', () => {
	test('renders login', () => {
		render(LoginComponent);

		const loginTitle = screen.getAllByText('Log In');
		expect(loginTitle).toBeInTheDocument;
	});

	test('logging in with empty fields', () => {
		render(LoginComponent);

		const loginButton = screen.getByRole('button');
		userEvent.click(loginButton);

		const invalidTitle = screen.getByText(
			'Please ensure all fields are valid'
		);
		expect(invalidTitle).toBeInTheDocument;
	});

	test('render invalid input - blank Password', () => {
		render(LoginComponent);

		const passwordField = screen.getByTestId('password');
		userEvent.click(passwordField);

		const invalidPassword = screen.getByText('Please enter your password');
		expect(invalidPassword).toBeInTheDocument;
	});

	test('Login Invalid', async () => {
		window.fetch = jest.fn().mockRejectedValue({ status: 401 });

		render(LoginComponent);
		const emailField = screen.getByTestId('email');
		userEvent.type(emailField, 'testabc@gmail.com');
		const passwordField = screen.getByTestId('password');
		userEvent.type(passwordField, 'text');

		const loginButton = screen.getByRole('button');
		userEvent.click(loginButton);
		await waitFor(() => screen.queryByText('Incorrect e-mail or password'));
	});

	// Not sure if this is a good test
	// test('Login valid', async () => {
	// 	window.fetch = jest
	// 		.fn()
	// 		// Login Request
	// 		.mockResolvedValueOnce({
	// 			token: 'aToken',
	// 			user: {
	// 				_id: '60d6e69456a1e841a2fd00e6',
	// 				username: 'jdoe@gmail.com',
	// 				role: 0,
	// 			},
	// 		})
	// 		// Fetch user data request
	// 		.mockResolvedValueOnce({
	// 			user: {
	// 				role: 0,
	// 				verified: false,
	// 				history: [],
	// 				boards: [],
	// 				notes: [],
	// 				events: [],
	// 				_id: '60d6e69456a1e841a2fd00e6',
	// 				username: 'jdoe@gmail.com',
	// 				firstName: 'John',
	// 				lastName: 'Pasta',
	// 				createdAt: '2021-06-26T08:34:28.527Z',
	// 				updatedAt: '2021-06-29T11:58:22.993Z',
	// 				__v: 0,
	// 				featured: '60d7257600d53f1af7b40e17',
	// 			},
	// 		});

	// 	render(LoginComponent);
	// 	const emailField = screen.getByTestId('email');
	// 	userEvent.type(emailField, 'testabc@gmail.com');
	// 	const passwordField = screen.getByTestId('password');
	// 	userEvent.type(passwordField, 'text');

	// 	const loginButton = screen.getByRole('button');
	// 	userEvent.click(loginButton);
	// 	await waitFor(
	// 		() =>
	// 			expect(screen.queryByText('Incorrect e-mail or password')).not
	// 				.toBeInTheDocument
	// 	);
	// });
});

describe('E-mail Input Field', () => {
	test('render valid input', () => {
		render(LoginComponent);
		const emailField = screen.getByTestId('email');
		userEvent.type(emailField, 'test@gmail.com');

		expect(emailField).not.toHaveClass('is-invalid');
	});

	test('render invalid input - blank E-Mail', () => {
		render(LoginComponent);

		const emailField = screen.getByTestId('email');

		userEvent.click(emailField);
		fireEvent.blur(emailField);
		expect(emailField).toHaveClass('is-invalid');
	});

	test('render invalid input - invalid E-Mail - no @<domain>', () => {
		render(LoginComponent);

		const emailField = screen.getByTestId('email');

		userEvent.type(emailField, 'test');
		fireEvent.blur(emailField);
		expect(emailField).toHaveClass('is-invalid');
	});

	test('render invalid input - invalid E-Mail - only @<domain>', () => {
		render(LoginComponent);

		const emailField = screen.getByTestId('email');

		userEvent.type(emailField, '@test.com');
		fireEvent.blur(emailField);
		expect(emailField).toHaveClass('is-invalid');
	});
});
