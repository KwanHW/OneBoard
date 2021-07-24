import { useRef, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { ListGroupItem, Input } from 'reactstrap';

const SubtaskItem = (props) => {
	const { subtask, index, onUpdate } = props;
	const subtaskRef = useRef();
	const isDoneRef = useRef();
	const [isEdit, setIsEdit] = useState(false);
	const [beforeChange, setBeforeChange] = useState(subtask);
	const [isInvalid, setIsInvalid] = useState(null);

	const openEditHandler = () => {
		setIsEdit(true);
	};

	const closeEditHandler = () => {
		setIsEdit(false);
	};

	const onBlurHandler = () => {
		let name;
		if (subtaskRef.current) {
			name = subtaskRef.current.value;
		} else {
			name = beforeChange.name;
		}
		const isDone = isDoneRef.current.checked;
		if (name.trim() === '') {
			setIsInvalid(true);
			return;
		}

		if (name === beforeChange.name && isDone === beforeChange.isDone) {
			closeEditHandler();
			return;
		}

		const updatedSubtask = { ...beforeChange, name, isDone };
		// POST request handled by onUpdate
		onUpdate(index, updatedSubtask);
		setBeforeChange(updatedSubtask);
		setIsInvalid(false);
		closeEditHandler();
	};

	const subtaskTitle = subtask.isDone ? (
		<strike onClick={openEditHandler} className="w-75">
			{beforeChange.name}
		</strike>
	) : (
		<span onClick={openEditHandler} className="w-75">
			{beforeChange.name}
		</span>
	);

	return (
		// TODO Improve CSS
		<ListGroupItem className="d-flex justify-content-between">
			{isEdit ? (
				<Input
					defaultValue={beforeChange.name}
					innerRef={subtaskRef}
					autoFocus
					onBlur={onBlurHandler}
					invalid={isInvalid}
				/>
			) : (
				subtaskTitle
			)}
			<div>
				<Input
					type="checkbox"
					innerRef={isDoneRef}
					defaultChecked={beforeChange.isDone}
					onClick={onBlurHandler}
				/>{' '}
				<FaTrash
					style={{ cursor: 'pointer' }}
					onClick={() => {
						onUpdate(index);
					}}
				/>
			</div>
		</ListGroupItem>
	);
};

export default SubtaskItem;
