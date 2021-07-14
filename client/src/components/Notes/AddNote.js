import React, { useRef } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { Form, Label, Input, Button } from 'reactstrap';
import useInput from '../hooks/use-input';
import { addNote } from '../../store/note-actions';

function AddNote(props) {
	const dispatch = useDispatch();
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const {
		value: name,
		isValid: nameIsValid,
		onChange: nameOnChange,
		onBlur: nameOnBlur,
		reset: nameReset,
	} = useInput((value) => value.trim() !== '', '');
	const descRef = useRef();

	const addHandler = () => {
		if (!nameIsValid) return;
		const description = descRef.current.value;

		dispatch(addNote(token, { name, description }));
		nameReset();
		descRef.current.value = '';
		props.onCancel();
	};

	return (
		<Form className="w-50">
			<Label for="title">Title</Label>
			<Input
				type="text"
				id="title"
				name="title"
				placeholder="Enter title.."
				value={name}
				onChange={nameOnChange}
				onBlur={nameOnBlur}
			/>
			<Label for="description">Description</Label>
			<Input
				type="textarea"
				id="description"
				name="description"
				placeholder="Enter description.."
				innerRef={descRef}
			/>
			<Button onClick={addHandler} color="success">
				Add
			</Button>
			<Button onClick={props.onCancel}>Cancel</Button>
		</Form>
	);
}

export default AddNote;
