import { render, fireEvent, screen } from './test-utils';
import AddNote from './AddNote';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';

describe('Add Note Component', () => {
	test('renders Add Note Component', () => {
		const onCancel = jest.fn();
		render(<AddNote onCancel={onCancel} />);
		const title = screen.getByRole('textbox', { name: 'Title' });
		const description = screen.getByRole('textbox', {
			name: 'Description',
		});
		expect(title).toBeInTheDocument;
		expect(description).toBeInTheDocument;
	});

	test('invalid submission - all empty fields', () => {
		jest.spyOn(window, 'fetch');
		window.fetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({}),
		});

		const onCancel = jest.fn();
		render(<AddNote onCancel={onCancel} />);
		const addBtn = screen.getByText('Add');
		userEvent.click(addBtn);
		expect(window.fetch).not.toHaveBeenCalled;
	});

	// Redux required
	// Bare minimum note test
	test('valid submission - no description', async () => {
		jest.spyOn(window, 'fetch');
		window.fetch
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					_id: 'note-1',
					name: 'A note title',
					description: '',
				}),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					_id: 'note-2',
					name: 'Another title',
					description: '',
				}),
			});

		const onCancel = jest.fn();

		// On empty notes
		render(<AddNote onCancel={onCancel} />, {
			preloadedState: { note: { notes: [], isEmpty: true } },
		});
		const title = screen.getByRole('textbox', { name: 'Title' });
		const addBtn = screen.getByText('Add');

		userEvent.type(title, 'A note title');
		userEvent.click(addBtn);
		await waitFor(() => {
			expect(window.fetch).toHaveBeenCalledTimes(1);
		});

		// On non-empty note
		userEvent.clear(title);
		userEvent.type(title, 'Another title');
		userEvent.click(addBtn);
		await waitFor(() => {
			expect(window.fetch).toHaveBeenCalledTimes(2);
		});
	});

	test('valid submission - has description', async () => {
		jest.spyOn(window, 'fetch');
		window.fetch
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					_id: 'note-1',
					name: 'A note title',
					description: 'A note description',
				}),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					_id: 'note-2',
					name: 'Another title',
					description: 'A note description',
				}),
			});

		const onCancel = jest.fn();

		// On empty notes
		render(<AddNote onCancel={onCancel} />, {
			preloadedState: { note: { notes: [], isEmpty: true } },
		});
		const title = screen.getByRole('textbox', { name: 'Title' });
		const description = screen.getByRole('textbox', {
			name: 'Description',
		});
		const addBtn = screen.getByText('Add');

		userEvent.type(title, 'A note title');
		userEvent.type(description, 'A note description');
		userEvent.click(addBtn);
		await waitFor(() => {
			expect(window.fetch).toHaveBeenCalledTimes(1);
		});

		// On non-empty note
		userEvent.clear(title);
		userEvent.type(title, 'Another title');
		userEvent.click(addBtn);
		await waitFor(() => {
			expect(window.fetch).toHaveBeenCalledTimes(2);
		});
	});
});
