import { useRef } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { Input, Button } from 'reactstrap';
import { AiOutlineClose } from 'react-icons/ai';
import styles from './AddColumn.module.css';
import { addData, TYPES } from '../../../store/kanban-actions';

const AddColumn = (props) => {
	const { boardId, onCancel, next: order } = props;
	const columnName = useRef();
	const dispatch = useDispatch();
	const [cookies] = useCookies(['t']);
	const token = cookies.t;

	const addColumnHandler = (e) => {
		e.preventDefault();

		if (columnName.current.value.trim() === '') {
			props.onCancel();
			return;
		}

		const name = columnName.current.value.trim();

		const data = { name, order };
		dispatch(addData(token, TYPES.COLUMN, data, boardId));
		onCancel();
	};

	const cancelHandler = () => {
		if (columnName.current.value.trim() === '') {
			props.onCancel();
		}
		return;
	};

	return (
		<div className={styles.addCol}>
			<Input
				autoFocus
				placeholder="Enter Column here"
				innerRef={columnName}
				onBlur={cancelHandler}
			/>
			<div className="mt-2">
				<Button
					type="submit"
					onClick={addColumnHandler}
					className={styles.confirm}
				>
					Add Column
				</Button>
				<AiOutlineClose
					onClick={props.onCancel}
					className={styles.cancel}
				/>
			</div>
		</div>
	);
};

export default AddColumn;
