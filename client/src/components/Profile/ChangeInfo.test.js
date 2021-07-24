import { render, fireEvent, screen } from './test-utils';
import ChangeInfo from './ChangeInfo';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';

const userLoggedIn = {
	id: 'user-1',
	firstName: 'Test 762',
	lastName: 'Test',
	email: 'test2@gmail.com',
	featured: '60deecdafa3eb5041de27d49',
	boards: {
		boards: [
			{
				_id: 'board-1',
				name: 'board-420',
			},
			{
				_id: 'board-2',
				name: 'Empty',
			},
		],
		selectedBoard: {
			_id: 'board-1',
			name: 'board-420',
		},
	},
};

describe('Change Info component', () => {
	test('render component', () => {
		render(<ChangeInfo />, { preloadedState: { user: userLoggedIn } });

		const titleText = screen.getByText('Change User Information');
		expect(titleText).toBeVisible;
	});

	test('submit without changes', () => {
		render(<ChangeInfo />, { preloadedState: { user: userLoggedIn } });

		const updateBtn = screen.getByText('Update Information');
		userEvent.click(updateBtn);
		const noChanges = screen.getByText('No changes made.');
		expect(noChanges).toBeVisible;
	});

	test('invalid submit - empty firstName', () => {
		render(<ChangeInfo />, { preloadedState: { user: userLoggedIn } });

		const updateBtn = screen.getByText('Update Information');
		const fName = screen.getByRole('textbox', { name: 'First Name' });

		userEvent.clear(fName, '');
		userEvent.click(updateBtn);
		const errorMsg = screen.getByText(
			'Please ensure all fields are valid.'
		);
		expect(errorMsg).toBeVisible;
	});

	test('invalid submit - empty lastName', () => {
		render(<ChangeInfo />, { preloadedState: { user: userLoggedIn } });

		const updateBtn = screen.getByText('Update Information');
		const lName = screen.getByRole('textbox', { name: 'Last Name' });

		userEvent.clear(lName, '');
		userEvent.click(updateBtn);
		const errorMsg = screen.getByText(
			'Please ensure all fields are valid.'
		);
		expect(errorMsg).toBeVisible;
	});

	test('valid submit', async () => {
		jest.spyOn(window, 'fetch');
		window.fetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({}),
		});
		render(<ChangeInfo />, { preloadedState: { user: userLoggedIn } });

		const fName = screen.getByRole('textbox', { name: 'First Name' });
		const lName = screen.getByRole('textbox', { name: 'Last Name' });
		const updateBtn = screen.getByText('Update Information');

		userEvent.clear(fName);
		userEvent.type(fName, 'John');
		userEvent.clear(lName);
		userEvent.type(lName, 'Doe');
		userEvent.click(updateBtn);
		await waitFor(() => {
			expect(screen.queryByText('Successfully updated.')).toBeVisible;
		});
	});
});
