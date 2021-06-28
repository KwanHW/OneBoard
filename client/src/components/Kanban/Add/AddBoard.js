import React, { useContext, useRef, useState } from 'react';
import { Button, Input } from 'reactstrap';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import EditDelete from '../KanbanUI/EditDelete';
import useInput from '../../hooks/use-input';
import { userActions } from '../../../store/user';
import { addData, TYPES } from '../../../store/kanban-actions';
import ModalContext from '../../../store/ModalContext';
import DeleteModal from '../KanbanUI/DeleteModal';
import EditBoard from '../Edit/EditBoard';
import styles from './AddBoard.module.css';

function AddBoard(props) {
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const boards = useSelector((state) => state.user.boards);
	const selectedBoard = boards.selectedBoard || {
		name: '',
		_id: '',
	};
	const selectBoardRef = useRef();
	const [boardAdd, setBoardAdd] = useState(false);
	const modalContext = useContext(ModalContext);
	const dispatch = useDispatch();

	const {
		value: boardName,
		isValid: boardNameIsValid,
		hasError: boardNameHasError,
		onChange: boardNameOnChange,
		onBlur: boardNameOnBlur,
		reset: boardNameReset,
	} = useInput((value) => value.trim() !== '', '');

	const toggleBoardAdd = () => {
		setBoardAdd((prevAdd) => !prevAdd);
	};

	const addBoardHandler = () => {
		if (!boardNameIsValid) return;
		const data = { name: boardName };
		dispatch(addData(token, TYPES.BOARD, data));
		boardNameReset();
		toggleBoardAdd();
	};

	const boardSelectChangeHandler = () => {
		const newBoardId = selectBoardRef.current.value;
		dispatch(userActions.setSelectedBoard(newBoardId));
	};

	const deleteBoardHandler = () => {
		modalContext.showModal(
			<DeleteModal
				type={TYPES.BOARD}
				id={selectedBoard._id}
				index={selectBoardRef.current.selectedIndex}
			/>
		);
	};

	const editBoardHandler = () => {
		modalContext.showModal(<EditBoard />);
	};

	const renderOptions =
		boards.boards.length === 0 ? (
			<option hidden selected>
				No Boards. Please Add Board.
			</option>
		) : (
			boards.boards.map((board) => {
				const isSelected = board._id === selectedBoard._id;
				const optionAttr = {
					value: board._id,
					key: board._id,
					selected: isSelected,
				};
				return <option {...optionAttr}>{board.name}</option>;
			})
		);

	return (
		<div className="d-flex flex-row">
			{boardAdd ? (
				<Input
					type="text"
					name="boardName"
					id="boardId"
					value={boardName}
					onChange={boardNameOnChange}
					onBlur={boardNameOnBlur}
					placeholder="Enter board name"
					style={{ width: '75%' }}
					invalid={boardNameHasError}
				/>
			) : (
				<Input
					type="select"
					name="boardSelect"
					id="boardSelect"
					innerRef={selectBoardRef}
					onChange={boardSelectChangeHandler}
					style={{ width: '75%' }}
				>
					{renderOptions}
				</Input>
			)}
			<Button
				onClick={boardAdd ? addBoardHandler : toggleBoardAdd}
				color={boardAdd ? 'success' : 'secondary'}
			>
				Add Board
			</Button>
			{boardAdd && (
				<Button onClick={toggleBoardAdd} color="danger" outline>
					Cancel
				</Button>
			)}
			<EditDelete
				onEdit={editBoardHandler}
				onDelete={deleteBoardHandler}
				className={styles.icons}
			/>
		</div>
	);
}

export default AddBoard;
