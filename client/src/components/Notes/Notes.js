import React, { useEffect, useState, useContext } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai';
import { FaCaretLeft, FaCaretRight, FaTrash } from 'react-icons/fa';
import AddNote from './AddNote';
// import DeleteNote from './DeleteNote';
// import SearchNote from './SearchNote';
import EditNote from './EditNote';
import ModalContext from '../../store/ModalContext';
import { fetchAllNotes } from '../../store/note-actions';

const SearchNote = React.lazy(() => import('./SearchNote'));
const DeleteNote = React.lazy(() => import('./DeleteNote'));

function colorIcon(predicate) {
	return predicate ? 'grey' : 'black';
}

function Notes() {
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const dispatch = useDispatch();
	const noteStore = useSelector((state) => state.note);
	const { isEmpty, notes } = noteStore;
	const [index, setIndex] = useState(0);
	const [isAdd, setIsAdd] = useState(false);
	const [isEdit, setIsEdit] = useState({ title: false, description: false });
	const modalContext = useContext(ModalContext);

	// Just fetch new notes
	useEffect(() => {
		dispatch(fetchAllNotes(token));
	}, [dispatch, token]);

	// Handles note changes when note is deleted
	useEffect(() => {
		// Default show the only element
		if (notes.length === 1) {
			setIndex(0);
			// setCurrentNote(notes[0]);
			return;
		}
		// Checks if accessing out of bounds (undefined)
		if (!notes[index] && notes.length > 0) {
			// setCurrentNote(notes[index - 1]);
			setIndex(index);
		}

		return () => {};
	}, [notes.length]);

	const nextHandler = () => {
		if (isEmpty) return;
		if (index === notes.length - 1) return;
		setIndex(index + 1);
	};

	const previousHandler = () => {
		if (isEmpty) return;
		if (index === 0) return;
		setIndex(index - 1);
	};

	const deleteHandler = () => {
		if (isEmpty) return;
		modalContext.showModal(<DeleteNote note={notes[index]} />);
	};

	const addHandler = () => {
		// Ensures that the user is not editing anything
		if (Object.values(isEdit).some((e) => e)) return;

		setIsAdd(true);
	};

	const searchHandler = () => {
		if (isEmpty) return;
		modalContext.showModal(<SearchNote goTo={goToHandler} />);
	};

	const goToHandler = (index) => {
		setIndex(index);
		modalContext.hideModal();
	};

	const titleToggleHandler = () => {
		setIsEdit({ ...isEdit, title: !isEdit.title });
	};

	const descriptionToggleHandler = () => {
		setIsEdit({ ...isEdit, description: !isEdit.description });
	};

	const makeEditNote = (isTitle) => {
		return (
			<EditNote
				onCancel={
					isTitle ? titleToggleHandler : descriptionToggleHandler
				}
				note={notes[index]}
				isTitle={isTitle}
			/>
		);
	};

	// If user is adding Note, return AddNote Component instead
	if (isAdd) {
		return (
			<AddNote
				onCancel={() => {
					setIsAdd(false);
				}}
			/>
		);
	}

	const rightDisable = colorIcon(index === notes.length - 1 || isEmpty);
	const leftDisable = colorIcon(index === 0 || isEmpty);
	const colorIcons = colorIcon(isEmpty);

	return (
		<div className="d-flex flex-column justify-content-between h-100">
			<div>
				{isEmpty || !notes[index] ? (
					<p>No notes. Create one by pressing the "+" icon below</p>
				) : (
					<NoteContent
						titleChange={titleToggleHandler}
						descriptionChange={descriptionToggleHandler}
						note={notes[index]}
						isEdit={isEdit}
						onEdit={makeEditNote}
					/>
				)}
			</div>
			<div style={{ fontSize: '1.75rem', cursor: 'pointer' }}>
				<FaCaretLeft onClick={previousHandler} color={leftDisable} />
				<AiOutlinePlus onClick={addHandler} />
				<AiOutlineSearch onClick={searchHandler} color={colorIcons} />
				<FaTrash onClick={deleteHandler} color={colorIcons} />
				<FaCaretRight onClick={nextHandler} color={rightDisable} />
			</div>
		</div>
	);
}

const NoteContent = (props) => {
	const { note, isEdit, titleChange, descriptionChange, onEdit } = props;
	const toAddDescription =
		note.description === '' ? (
			<p onClick={descriptionChange}>
				No description. Click to add description
			</p>
		) : (
			<p onClick={descriptionChange} style={{ whiteSpace: 'pre-line' }}>
				{note.description}
			</p>
		);

	const titleComponent = isEdit.title ? (
		onEdit(true)
	) : (
		<h4 onClick={titleChange}>{note.name}</h4>
	);

	const descriptionComponent = isEdit.description
		? onEdit(false)
		: toAddDescription;

	return (
		<React.Fragment>
			{titleComponent}
			{descriptionComponent}
		</React.Fragment>
	);
};

export default Notes;
