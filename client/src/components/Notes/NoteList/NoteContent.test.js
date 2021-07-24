import { render, fireEvent, screen } from '../test-utils';
import userEvent from '@testing-library/user-event';
import NoteContent from './NoteContent';

describe('Note Content Component', () => {
	test('renders Note Component', () => {
		// Bare minimum note
		const noteParams = {
			onEdit: jest.fn(),
			note: {
				_id: '60f125f7df8805365eb1fd0e',
				name: 'Used to react test',
				description: '',
			},
		};

		render(<NoteContent {...noteParams} />);

		const title = screen.getByRole('heading', { level: 3 });
		const noDesc = screen.getByText(
			'No description. Click to add description'
		);
		expect(title).toBeInTheDocument;
		expect(noDesc).toBeInTheDocument;
	});

	test('renders Note Component (with description)', () => {
		const noteParams = {
			onEdit: jest.fn(),
			note: {
				_id: '60f125f7df8805365eb1fd0e',
				name: 'Used to react test',
				description: 'A test description',
			},
		};

		render(<NoteContent {...noteParams} />);

		const title = screen.getByRole('heading', { level: 3 });
		const desc = screen.getByText('A test description');
		expect(title).toBeInTheDocument;
		expect(desc).toBeInTheDocument;
	});
});
