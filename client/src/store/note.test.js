import reducer, { noteActions } from './note';

const initialState = { notes: [], isEmpty: true };
const note = {
	_id: 'note-1',
	name: 'Bare minimum note',
	description: '',
};
const nonEmptyState = { notes: [note], isEmpty: false };

describe('REDUX: note slice', () => {
	test('initialise note slice', () => {
		expect(reducer(undefined, {})).toEqual(initialState);
	});

	test('add note to empty notes', () => {
		//  Bare minimum note
		expect(reducer(initialState, noteActions.addNote(note))).toEqual({
			notes: [note],
			isEmpty: false,
		});
	});

	test('add note to non-empty notes', () => {
		const newNote = {
			_id: 'note-2',
			name: 'Bare minimum note',
			description: '',
		};

		// Bare minimum note
		expect(reducer(nonEmptyState, noteActions.addNote(newNote))).toEqual({
			...nonEmptyState,
			notes: [...nonEmptyState.notes, newNote],
		});
	});

	test('update note', () => {
		const newNote = {
			_id: 'note-1',
			name: 'A brand new note',
			description: 'With a brand new desc',
		};
		expect(reducer(nonEmptyState, noteActions.updateNote(newNote))).toEqual(
			{ ...nonEmptyState, notes: [newNote] }
		);
	});

	test('delete note (becomes empty)', () => {
		expect(
			reducer(nonEmptyState, noteActions.deleteNote('note-1'))
		).toEqual(initialState);
	});

	test('delete note (becomes not empty)', () => {
		const testNotes = [
			note,
			{
				_id: 'note-2',
				name: 'Bare minimum note',
				description: '',
			},
		];

		expect(
			reducer(
				{ notes: testNotes, isEmpty: false },
				noteActions.deleteNote('note-2')
			)
		).toEqual({ notes: [note], isEmpty: false });
	});

	test('replace notes (empty slice', () => {
		expect(reducer(nonEmptyState, noteActions.replace([]))).toEqual(
			initialState
		);
	});

	test('replace notes (non-empty slice)', () => {
		const replaceNotes = [
			{
				_id: '60deef89fa3eb5041de27d4e',
				name: 'note-397',
				description:
					'Not Required! Unless.... I have more things to say hehehahaho\n',
			},
			{
				_id: '60ebb48151fd972004542eba',
				name: 'Some title',
				description:
					'A descriptions so jank\nLong words\nLong words\nLong \nLong \nLong Words\nEh?\neight\nNine\nTen\nEleben\nTwelve',
			},
		];

		expect(
			reducer(nonEmptyState, noteActions.replace(replaceNotes))
		).toEqual({ notes: replaceNotes, isEmpty: false });
	});

	test('clear empty slice', () => {
		expect(reducer(initialState, noteActions.clear())).toEqual(
			initialState
		);
	});

	test('clear non-empty slice', () => {
		const noteToClear = [
			{
				_id: '60deef89fa3eb5041de27d4e',
				name: 'note-397',
				description:
					'Not Required! Unless.... I have more things to say hehehahaho\n',
			},
			{
				_id: '60ebb48151fd972004542eba',
				name: 'Some title',
				description:
					'A descriptions so jank\nLong words\nLong words\nLong \nLong \nLong Words\nEh?\neight\nNine\nTen\nEleben\nTwelve',
			},
		];
		expect(
			reducer({ notes: noteToClear, isEmpty: false }, noteActions.clear())
		).toEqual(initialState);
	});
});
