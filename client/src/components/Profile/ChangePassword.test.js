import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../store/index';
import ChangePassword from './ChangePassword';
import { getByText, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// import { render, fireEvent, screen } from './test-utils';
// import userEvent from '@testing-library/user-event';
// import { waitFor } from '@testing-library/react';

const Wrapper = ({ children }) => (
	<Router>
		<Provider store={store}>{children}</Provider>
	</Router>
);

describe('Change Password component', () => {
	test('renders component', () => {
		render(<ChangePassword />, { wrapper: Wrapper });
		const title = screen.getByRole('heading', { level: 3 });
		expect(getByText(title, 'Change Password')).toBeInTheDocument;
	});

	test('invalid input - empty fields', () => {
		render(<ChangePassword />, { wrapper: Wrapper });

		const submitBtn = screen.getByTestId('submitBtn');
		userEvent.click(submitBtn);
		const invalid = screen.getByText('Please ensure all fields are valid.');
		expect(invalid).toBeVisible;
	});

	test('valid submit - valid password change', async () => {
		jest.spyOn(window, 'fetch');
		window.fetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({}),
		});

		render(<ChangePassword />, { wrapper: Wrapper });

		const submitBtn = screen.getByTestId('submitBtn');
		const currentPW = screen.getByTestId('currentPW');
		const newPW = screen.getByTestId('newPW');
		const cfmPW = screen.getByTestId('cfmPW');

		userEvent.type(currentPW, '123456789');
		userEvent.type(newPW, '@bcd1234');
		userEvent.type(cfmPW, '@bcd1234');
		userEvent.click(submitBtn);

		await waitFor(() => {
			expect(screen.getByText('Password Updated')).toBeVisible;
		});
	});

	test('valid submit - invalid password change', async () => {
		jest.spyOn(window, 'fetch');
		window.fetch.mockResolvedValueOnce({
			ok: false,
			json: async () => ({
				message: 'Password or username is incorrect',
			}),
		});

		render(<ChangePassword />, { wrapper: Wrapper });

		const submitBtn = screen.getByTestId('submitBtn');
		const currentPW = screen.getByTestId('currentPW');
		const newPW = screen.getByTestId('newPW');
		const cfmPW = screen.getByTestId('cfmPW');

		userEvent.type(currentPW, '123456789');
		userEvent.type(newPW, '@bcd1234');
		userEvent.type(cfmPW, '@bcd1234');
		userEvent.click(submitBtn);

		await waitFor(() => {
			expect(screen.getByText('Wrong password.')).toBeVisible;
		});
	});
});
