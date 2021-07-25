import React, { useContext } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import {
	Button,
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
import useLabel from '../../hooks/use-label';
import { updateLabels } from '../../../store/kanban-actions';
import { userActions } from '../../../store/user';
import EditLabel from '../../../UI/Label/EditLabel';
import { textNotEmpty } from '../../../lib/validators';

function EditBoard() {
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const board = useSelector((state) => state.kanban);
	const modalContext = useContext(ModalContext);
	const dispatch = useDispatch();

	const {
		value: boardName,
		isValid: boardNameIsValid,
		onChange: boardNameOnChange,
		onBlur: boardNameOnBlur,
	} = useInput(textNotEmpty, board.name);

	const { labels, editLabels } = useLabel(board.labels);

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

		const data =
			labelChanged.length > 0
				? { name: boardName, labels: labelChanged }
				: { name: boardName };
		// let data = {};
		// if (labelChanged.length > 0)
		// 	data = { name: boardName, labels: labelChanged };
		// else data = { name: boardName };
		dispatch(updateLabels(token, data, board.id));
		dispatch(userActions.updateBoard({ _id: board.id, name: boardName }));
		modalContext.hideModal();
		//  Add a success banner ?
	};

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
					<EditLabel labels={labels} onEdit={editLabels} />
				</Form>
			</ModalBody>
			<ModalFooter>
				<Button color="success" onClick={confirmChangeHandler}>
					Confirm Changes
				</Button>
				<Button outline onClick={modalContext.hideModal}>
					Close
				</Button>
			</ModalFooter>
		</Modal>
	);
}

export default EditBoard;
