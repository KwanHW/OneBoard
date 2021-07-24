import { render, fireEvent, screen } from './test-utils';
import EditNote from './EditNote';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';

// Bare minimum note
const note = {
	_id: 'note-1',
	name: 'A note title',
	description: '',
};

describe('Edit Note Component - Title', () => {
	beforeEach(() => {
		const onCancel = jest.fn();
		const onEdit = jest.fn();

		render(
			<EditNote
				onCancel={onCancel}
				note={note}
				isTitle={true}
				onEdit={onEdit}
			/>
		);
	});

	test('renders component (title)', () => {
		const title = screen.getByDisplayValue('A note title');
		expect(title).toBeVisible;
	});

	test('invalid submit - empty title', () => {
		jest.spyOn(window, 'fetch');
		window.fetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({}),
		});

		const title = screen.getByDisplayValue('A note title');
		userEvent.clear(title);

		// To trigger the submission
		fireEvent.blur(title);
		expect(window.fetch).not.toBeCalled;
	});

	test('valid submit - change title', async () => {
		jest.spyOn(window, 'fetch');
		window.fetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				_id: 'note-1',
				name: 'A brand new note title',
				description: '',
			}),
		});

		const title = screen.getByDisplayValue('A note title');
		userEvent.type(title, 'A brand new note title');

		// To trigger the submission
		fireEvent.blur(title);
		expect(window.fetch).toBeCalled;
	});
});

describe('Edit Note Component - description', () => {
	beforeEach(() => {
		const onCancel = jest.fn();
		const onEdit = jest.fn();

		render(
			<EditNote
				onCancel={onCancel}
				note={note}
				isTitle={false}
				onEdit={onEdit}
			/>
		);
	});

	test('renders component (description)', () => {
		const description = screen.getByDisplayValue('');
		expect(description).toBeVisible;
	});

	test('invalid submit', () => {
		jest.spyOn(window, 'fetch');

		const description = screen.getByDisplayValue('');

		// To trigger the submission
		fireEvent.blur(description);
		expect(window.fetch).not.toBeCalled;
	});

	test('valid submit - description changed', async () => {
		jest.spyOn(window, 'fetch');
		window.fetch
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					_id: 'note-1',
					name: 'A note title',
					description: 'A new description',
				}),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					_id: 'note-1',
					name: 'A note title',
					description: 'Totally different description',
				}),
			});

		const description = screen.getByDisplayValue('');

		// Filling an empty description
		userEvent.type(description, 'A new description');
		fireEvent.blur(description);
		await waitFor(() => {
			expect(window.fetch).toBeCalledTimes(1);
		});

		// Writing a new description
		userEvent.type(description, 'Totally different description');
		fireEvent.blur(description);
		await waitFor(() => {
			expect(window.fetch).toBeCalledTimes(2);
		});
	});
});

test('valid submit - clearing description', async () => {
	jest.spyOn(window, 'fetch');
	window.fetch.mockResolvedValueOnce({
		ok: true,
		json: async () => ({
			_id: 'note-1',
			name: 'A note title',
			description: '',
		}),
	});

	const onCancel = jest.fn();
	const onEdit = jest.fn();

	const newNote = { ...note, description: 'A new description' };

	render(
		<EditNote
			onCancel={onCancel}
			note={newNote}
			isTitle={false}
			onEdit={onEdit}
		/>
	);

	const description = screen.getByDisplayValue('A new description');
	userEvent.clear(description);
	fireEvent.blur(description);
	await waitFor(() => {
		expect(window.fetch).toBeCalled;
	});
});
