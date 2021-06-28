import React, { useContext, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import {
	Button,
	Badge,
	Form,
	Input,
	Label,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from 'reactstrap';
import ModalContext from '../../../store/ModalContext';
import styles from './EditBoard.module.css';
import useInput from '../../hooks/use-input';
import { LABEL_TYPES } from '../../../lib/kanban';
import { updateLabels } from '../../../store/kanban-actions';
import { userActions } from '../../../store/user';

function EditBoard() {
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const board = useSelector((state) => state.kanban);
	const [labels, setLabels] = useState(board.labels);
	const modalContext = useContext(ModalContext);
	const dispatch = useDispatch();

	const {
		value: boardName,
		isValid: boardNameIsValid,
		onChange: boardNameOnChange,
		onBlur: boardNameOnBlur,
	} = useInput((value) => value.trim() !== '', board.name);

	const editLabelsHandler = (e, index) => {
		const name = e.target.value;
		if (name.trim() === labels[index]) return;
		const newLabel = { ...labels[index], name: name };
		const newLabels = [...labels];
		newLabels.splice(index, 1, newLabel);
		setLabels(newLabels);
	};

	const confirmChangeHandler = () => {
		if (!boardNameIsValid) return;

		let labelChanged = [];
		for (let i = 0; i < 6; i++) {
			if (
				JSON.stringify(labels[i]) !== JSON.stringify(board.labels[i]) ||
				labels[i]._id
			) {
				const { _id } = board.labels[i];
				if (labels[i].name === '') continue;
				if (_id !== '') labelChanged.push({ _id, ...labels[i] });
				else labelChanged.push({ ...labels[i] });
			}
		}

		if (boardName === board.name && labelChanged.length === 0) {
			modalContext.hideModal();
			return;
		}

		let data = {};
		if (labelChanged.length > 0)
			data = { name: boardName, labels: labelChanged };
		else data = { name: boardName };
		dispatch(updateLabels(token, data, board.id));
		dispatch(userActions.updateBoard({ _id: board.id, name: boardName }));
		modalContext.hideModal();
		//  Add a success banner ?
	};

	const renderLabels = LABEL_TYPES.map((label, index) => {
		let found = labels.find((l) => l.type === label) || {
			name: '',
		};
		return (
			<div className="d-flex flex-row align-items-center" key={label}>
				<Badge className={`bg-${label} p-3`}> </Badge>
				<Input
					type="text"
					onBlur={(e) => editLabelsHandler(e, index)}
					defaultValue={found.name}
				/>
			</div>
		);
	});

	return (
		<Modal
			isOpen={modalContext.isVisible}
			toggle={modalContext.hideModal}
			className={`my-1 ${styles.modal}`}
		>
			<AiOutlineClose
				onClick={modalContext.hideModal}
				className={`${styles.close} me-3 mt-3`}
			/>
			<ModalHeader>Edit Board</ModalHeader>
			<ModalBody>
				<Form>
					<Label for="boardName">Board Name</Label>
					<Input
						type="text"
						id="boardName"
						name="boardName"
						value={boardName}
						onChange={boardNameOnChange}
						onBlur={boardNameOnBlur}
					/>
					<Label for="labels">Labels</Label>
					{renderLabels}
				</Form>
			</ModalBody>
			<ModalFooter>
				<Button color="success" onClick={confirmChangeHandler}>
					Confirm Changes
				</Button>
				{/* <Button color="danger">Delete Board</Button> */}
				<Button outline onClick={modalContext.hideModal}>
					Close
				</Button>
			</ModalFooter>
		</Modal>
	);
}

export default EditBoard;
