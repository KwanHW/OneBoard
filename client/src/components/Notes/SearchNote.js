import React, { useState, useContext, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Label,
	Input,
	Table,
} from 'reactstrap';
import { AiOutlineClose } from 'react-icons/ai';
import ModalContext from '../../store/ModalContext';
import styles from './DeleteNote.module.css';

function SearchNote(props) {
	const notes = useSelector((state) => state.note.notes);
	const modalContext = useContext(ModalContext);
	const queryRef = useRef('');
	const [filteredList, setFilteredList] = useState(notes);
	const [checkBox, setCheckBox] = useState({
		name: true,
		description: true,
	});

	const toggleCheckBox = (e) => {
		const { id, checked } = e.target;
		if (id === 'title') {
			setCheckBox({ ...checkBox, name: checked });
		} else {
			setCheckBox({ ...checkBox, description: !checkBox.description });
		}
		searchHandler();
	};

	// Possible memo (useCallback?)
	const searchHandler = () => {
		const query = queryRef.current.value.toLowerCase();
		if (!query || !(checkBox.description || checkBox.name)) {
			setFilteredList(notes);
		} else {
			let hits = notes.filter((note) => {
				const lowerName = note.name.toLowerCase();
				const lowerDesc = note.description.toLowerCase();
				return (
					(lowerName.includes(query) && checkBox.name) ||
					(lowerDesc.includes(query) && checkBox.description)
				);
			});
			// console.log(hits);
			setFilteredList(hits);
		}
	};

	return (
		// TODO Change width of modal to accommodate longer description
		<Modal isOpen={modalContext.isVisible} toggle={modalContext.hideModal}>
			<AiOutlineClose
				onClick={modalContext.hideModal}
				className={`${styles.close} me-3 mt-3`}
			/>
			<ModalHeader>Find Note</ModalHeader>
			<ModalBody>
				<Input
					type="text"
					placeholder="Enter text to search"
					onChange={searchHandler}
					innerRef={queryRef}
				/>
				<Input
					type="checkbox"
					id="title"
					name="title"
					checked={checkBox.name}
					onChange={toggleCheckBox}
				/>
				<Label for="title">Title</Label>
				<Input
					type="checkbox"
					id="description"
					name="description"
					checked={checkBox.description}
					onChange={toggleCheckBox}
				/>
				<Label for="description">Description</Label>
				<FilteredTable filtered={filteredList} goTo={props.goTo} />
			</ModalBody>
			<ModalFooter>
				<Button color="danger" outline onClick={modalContext.hideModal}>
					Close
				</Button>
			</ModalFooter>
		</Modal>
	);
}

const FilteredTable = (props) => {
	const { filtered } = props;

	const renderListItems = filtered.map((note, index) => (
		<tr
			// Change to anon arrow function
			onClick={() => {
				props.goTo(note._id);
			}}
			key={note._id}
			style={{ cursor: 'pointer' }}
		>
			<td>{index + 1}</td>
			<td>{note.name}</td>
			<td>{note.description}</td>
		</tr>
	));

	if (filtered.length === 0) return <h4>No results!</h4>;

	return (
		<Table striped>
			<thead>
				<tr>
					<th>S/N</th>
					<th>Title</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>{renderListItems}</tbody>
		</Table>
	);
};

export default SearchNote;
