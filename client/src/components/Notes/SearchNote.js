import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Label, Input } from 'reactstrap';
import styles from './SearchNote.module.css';

function SearchNote(props) {
	const { onFilter } = props;
	const notes = useSelector((state) => state.note.notes);
	// const queryRef = useRef('');
	const [query, setQuery] = useState('');
	const [checkBox, setCheckBox] = useState({
		name: true,
		description: true,
	});

	useEffect(() => {
		onFilter(filterNotes());
		return () => {};
	}, [query, checkBox]);

	const toggleCheckBox = (e) => {
		const { id, checked } = e.target;
		if (id === 'title') {
			setCheckBox({ ...checkBox, name: checked });
		} else {
			setCheckBox({ ...checkBox, description: !checkBox.description });
		}
	};

	const filterNotes = () => {
		const queryFormat = query.toLowerCase();
		if (!queryFormat || !(checkBox.description || checkBox.name)) {
			return notes;
		} else {
			let hits = notes.filter((note) => {
				const lowerName = note.name.toLowerCase();
				const lowerDesc = note.description.toLowerCase();
				return (
					(lowerName.includes(queryFormat) && checkBox.name) ||
					(lowerDesc.includes(queryFormat) && checkBox.description)
				);
			});
			console.log(hits);
			return hits;
		}
	};

	const resetHandler = () => {
		setCheckBox({ name: true, description: true });
		setQuery('');
	};

	return (
		<div className="d-inline-flex align-items-center ">
			<Input
				type="text"
				placeholder="Enter text to search"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				style={{ width: '350px' }}
			/>
			<Input
				type="checkbox"
				id="title"
				name="title"
				checked={checkBox.name}
				onChange={toggleCheckBox}
				className={styles.checkbox}
			/>
			<Label for="title">Title</Label>
			<Input
				type="checkbox"
				id="description"
				name="description"
				checked={checkBox.description}
				onChange={toggleCheckBox}
				className={styles.checkbox}
			/>
			<Label for="description">Description</Label>
			<Button onClick={resetHandler}>Reset</Button>
		</div>
	);
}

export default SearchNote;
