import { useState, useContext } from 'react';
import { FaTrash } from 'react-icons/fa';
import DeleteNote from '..//DeleteNote';
import EditNote from '../EditNote';
import ModalContext from '../../../store/ModalContext';
import styles from './NoteContent.module.css';
import { Button } from 'reactstrap';

const NoteContent = (props) => {
	const { note, onEdit } = props;
	const modalContext = useContext(ModalContext);
	const [isEdit, setIsEdit] = useState({ title: false, description: false });

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
				note={note}
				isTitle={isTitle}
				onEdit={onEdit}
			/>
		);
	};

	const toAddDescription =
		note.description === '' ? (
			<u onClick={descriptionToggleHandler}>
				No description. Click to add description
			</u>
		) : (
			<p
				onClick={descriptionToggleHandler}
				className={styles.textContent}
			>
				{note.description}
			</p>
		);

	const titleComponent = isEdit.title ? (
		makeEditNote(true)
	) : (
		<h3 onClick={titleToggleHandler}>{note.name}</h3>
	);

	const descriptionComponent = isEdit.description
		? makeEditNote(false)
		: toAddDescription;

	return (
		<div className="h-100 pb-3">
			<div className={styles.noteContent}>
				{titleComponent}
				{descriptionComponent}
			</div>
			<Button
				color="danger"
				onClick={() => {
					modalContext.showModal(<DeleteNote note={note} />);
				}}
			>
				<FaTrash /> Delete Note
			</Button>
		</div>
	);
};

export default NoteContent;
