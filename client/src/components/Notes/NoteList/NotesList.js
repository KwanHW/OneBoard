import React from 'react';
import {
	ListGroup,
	ListGroupItem,
	ListGroupItemHeading,
	ListGroupItemText,
} from 'reactstrap';
import NoteContent from './NoteContent';
import styles from './NotesList.module.css';

function NotesList(props) {
	const { notes, selectedNote, goTo, onEdit } = props;
	const renderNotes = notes.map((note) => {
		const isSelected = note._id === selectedNote._id;
		return (
			<ListGroupItem
				active={isSelected}
				onClick={() => {
					goTo(note._id);
				}}
				key={note._id}
				className={styles.cursor}
			>
				<ListGroupItemHeading
					className={
						isSelected ? styles.selected : styles.notSelected
					}
				>
					{note.name}
				</ListGroupItemHeading>
				<ListGroupItemText className={styles.subText}>
					{note.description}
				</ListGroupItemText>
			</ListGroupItem>
		);
	});

	return (
		<div className="d-flex justify-content-center">
			<div className="col-4">
				<ListGroup className={styles.noteList}>{renderNotes}</ListGroup>
			</div>
			<div className="col-8 border p-4">
				<NoteContent note={selectedNote} onEdit={onEdit} />
			</div>
		</div>
	);
}

export default NotesList;
