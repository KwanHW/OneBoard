import React from 'react';
import { Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import useInput from '../../hooks/use-input';

function AddSubtask(props) {
	const { addSubtask } = props;

	const {
		value: title,
		isValid: titleIsValid,
		onChange: titleOnChange,
		onBlur: titleOnBlur,
		reset: titleReset,
	} = useInput((value) => value.trim() !== '', '');

	const addSubtaskHandler = () => {
		if (!titleIsValid) return;
		const subtask = { name: title, isDone: false };
		addSubtask(subtask);
		titleReset();
	};

	return (
		<InputGroup>
			<Input
				placeholder="Add Subtask"
				value={title}
				onChange={titleOnChange}
				onBlur={titleOnBlur}
			/>
			<InputGroupAddon addonType="prepend">
				{/* onClick passed by prop */}
				<Button color="success" onClick={addSubtaskHandler}>
					AddTask
				</Button>
			</InputGroupAddon>
		</InputGroup>
	);
}

export default AddSubtask;
