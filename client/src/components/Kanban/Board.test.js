import Board from './Board';
import { render, screen, fireEvent } from './test-utils';
import userEvent from '@testing-library/user-event';
import { findByText, waitFor } from '@testing-library/react';

describe('Board element', () => {
	test('renders empty board without crashing', () => {
		render(<Board />);

		const emptyBoard = screen.getByText('No boards');

		expect(emptyBoard).toBeInTheDocument;
	});

	test('init renders new boards', async () => {
		jest.spyOn(window, 'fetch');
		window.fetch
			.mockResolvedValueOnce({
				ok: true,
				json: async () => getAllBoards,
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => defaultSelected,
			});

		render(<Board />);

		await waitFor(() => {
			expect(window.fetch).toBeCalledTimes(2);
			expect(screen.getByText('Selected Task')).toBeVisible;
		});
	});

	test('change board', async () => {
		jest.spyOn(window, 'fetch');
		window.fetch
			.mockResolvedValueOnce({
				ok: true,
				json: async () => getAllBoards,
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => defaultSelected,
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => getAllBoards[1],
			});

		render(<Board />);
		const changeBoard = await screen.findByRole('option', {
			name: 'The Second Board',
		});
		userEvent.selectOptions(screen.getByTestId('selectBoard'), changeBoard);
		expect(changeBoard.selected).toBe(true);
		await waitFor(() => {
			// Still has fetch problems?
			expect(window.fetch).toBeCalledTimes(3);
			expect(screen.getByText('Example Task')).toBeVisible;
			expect(screen.queryByText('Selected Task')).toBeNull;
		});
	});
});

const getAllBoards = [
	{
		columns: [
			{
				tasks: [
					{
						label: [],
						_id: '60f96f6442e9810022b9c11f',
						name: 'Selected Task',
						order: 0,
						expireAt: '2021-07-22T13:15:16.656Z',
						subTask: [],
						createdAt: '2021-07-22T13:15:16.658Z',
						updatedAt: '2021-07-22T13:15:16.658Z',
						__v: 0,
					},
				],
				_id: '60f96f6342e9810022b9c11c',
				name: 'To-Do',
				order: 0,
				createdAt: '2021-07-22T13:15:15.722Z',
				updatedAt: '2021-07-22T13:15:16.899Z',
				__v: 0,
			},
			{
				tasks: [],
				_id: '60f96f6442e9810022b9c11e',
				name: 'Done',
				order: 2,
				createdAt: '2021-07-22T13:15:16.190Z',
				updatedAt: '2021-07-22T13:15:16.190Z',
				__v: 0,
			},
		],
		_id: '60f96f6342e9810022b9c11b',
		name: 'Another board',
		labels: [],
		createdAt: '2021-07-22T13:15:15.213Z',
		updatedAt: '2021-07-22T13:15:16.428Z',
		__v: 0,
	},
	{
		columns: [
			{
				tasks: [
					{
						label: [],
						_id: '60f96f6e42e9810022b9c124',
						name: 'Example Task',
						order: 0,
						expireAt: '2021-07-22T13:15:26.081Z',
						subTask: [],
						createdAt: '2021-07-22T13:15:26.083Z',
						updatedAt: '2021-07-22T13:15:26.083Z',
						__v: 0,
					},
				],
				_id: '60f96f6d42e9810022b9c121',
				name: 'To-Do',
				order: 0,
				createdAt: '2021-07-22T13:15:25.161Z',
				updatedAt: '2021-07-22T13:15:26.323Z',
				__v: 0,
			},
		],
		_id: '60f96f6c42e9810022b9c120',
		name: 'The Second Board',
		labels: [],
		createdAt: '2021-07-22T13:15:24.687Z',
		updatedAt: '2021-07-22T13:15:25.848Z',
		__v: 0,
	},
];

const defaultSelected = getAllBoards[0];
