import React, { useEffect, useState, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { BiSort } from 'react-icons/bi';
import { AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai';
import AddNote from './AddNote';
import SearchNote from './SearchNote';
import SortNote from './SortNote';
import { fetchAllNotes } from '../../store/note-actions';
import { Button, UncontrolledCollapse } from 'reactstrap';
import NotesList from './NoteList/NotesList';
import { noteSort } from '../../lib/note';

function Notes() {
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const dispatch = useDispatch();
	const { isEmpty, notes } = useSelector((state) => state.note);
	const [filteredNotes, setFilteredNotes] = useState(notes);
	const [selectedNote, setSelectedNote] = useState(notes[0]);
	const [sortMode, setSortMode] = useState('');
	const addNoteRef = useRef();

	useEffect(() => {
		if (token) {
			dispatch(fetchAllNotes(token));
		}
	}, [dispatch, token]);

	// Handles note changes when note is deleted
	useEffect(() => {
		// Default show the only element
		if (notes.length === 1) {
			setSelectedNote(notes[0]);
			return;
		}

		// Checks if accessing out of bounds (undefined)
		if (notes.length > 0) {
			const index = filteredNotes.findIndex(
				(note) => note._id === selectedNote._id
			);
			if (index === notes.length)
				setSelectedNote(notes[notes.length - 1]);
		}

		return () => {};
	}, [notes.length, selectedNote]);

	// Forces filteredNotes to be refreshed after a CRUD
	useEffect(() => {
		setFilteredNotes(notes);
		if (!selectedNote) setSelectedNote(notes[0]);
	}, [notes.length]);

	const goToHandler = (id) => {
		const index = notes.findIndex((note) => note._id === id);
		setSelectedNote(notes[index]);
	};

	const changeSortMode = (newMode) => {
		console.log(newMode);
		setSortMode(newMode);
	};

	const sortedNotes =
		sortMode === '' ? filteredNotes : noteSort(filteredNotes, sortMode);
	// console.log(filteredNotes);
	// console.log(sortedNotes);

	return (
		<div>
			{/* Icons for the notes */}
			<div>
				<Button id="addnote" innerRef={addNoteRef} color="success">
					<AiOutlinePlus color="white" />
					Add Note
				</Button>
				<Button id="searchnote">
					<AiOutlineSearch color="white" />
					Search Note
				</Button>
				<Button id="sortnote">
					<BiSort color="white" />
					Sort Note
				</Button>
			</div>
			<UncontrolledCollapse toggler="#searchnote">
				<SearchNote goTo={goToHandler} onFilter={setFilteredNotes} />
			</UncontrolledCollapse>
			<UncontrolledCollapse toggler="#addnote">
				<AddNote
					onCancel={() => {
						addNoteRef.current.click();
					}}
				/>
			</UncontrolledCollapse>
			<UncontrolledCollapse toggler="#sortnote">
				<SortNote selected={sortMode} changeSort={changeSortMode} />
			</UncontrolledCollapse>
			<div className="row my-3">
				{isEmpty || filteredNotes.length === 0 ? (
					<h3>No notes</h3>
				) : (
					<NotesList
						notes={sortedNotes}
						selectedNote={selectedNote}
						goTo={goToHandler}
						onEdit={setSelectedNote}
					/>
				)}
			</div>
		</div>
	);
}

export default Notes;
