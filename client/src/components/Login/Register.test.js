import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../store/index';
import Register from './Register';

const RegisterComponent = (
	<Router>
		<Provider store={store}>
			<Register />
		</Provider>
	</Router>
);

describe('Register Component', () => {
	test('renders register', () => {
		render(RegisterComponent);

		const registerTitle = screen.getAllByText('Register');
		expect(registerTitle).toBeInTheDocument;
	});

	test('register empty fields', () => {
		render(RegisterComponent);

		const registerBtn = screen.getByRole('button');
		userEvent.click(registerBtn);

		const invalidRegister = screen.getByText(
			'Please check if all fields are valid.'
		);
		expect(invalidRegister).toBeInTheDocument;
	});
});

describe('E-mail Input Field', () => {
	test('render valid input', () => {
		render(RegisterComponent);
		const emailField = screen.getByTestId('email');
		userEvent.type(emailField, 'test@gmail.com');

		expect(emailField).not.toHaveClass('is-invalid');
	});

	test('render invalid input - blank E-Mail', () => {
		render(RegisterComponent);

		const emailField = screen.getByTestId('email');

		userEvent.click(emailField);
		fireEvent.blur(emailField);
		expect(emailField).toHaveClass('is-invalid');
	});

	test('render invalid input - invalid E-Mail - no @<domain>', () => {
		render(RegisterComponent);

		const emailField = screen.getByTestId('email');

		userEvent.type(emailField, 'test');
		fireEvent.blur(emailField);
		expect(emailField).toHaveClass('is-invalid');
	});

	test('render invalid input - invalid E-Mail - only @<domain>', () => {
		render(RegisterComponent);

		const emailField = screen.getByTestId('email');

		userEvent.type(emailField, '@test.com');
		fireEvent.blur(emailField);
		expect(emailField).toHaveClass('is-invalid');
	});
});
