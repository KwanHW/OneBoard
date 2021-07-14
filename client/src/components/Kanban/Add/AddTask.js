import { useRef } from 'react';
import { useCookies } from 'react-cookie';
import { Input, Button } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import styles from './AddTask.module.css';
import { TYPES, addData } from '../../../store/kanban-actions';

const AddTask = (props) => {
	const { columnId, onCancel, next: order } = props;
	const dispatch = useDispatch();
	const taskName = useRef();
	const [cookies] = useCookies(['t']);
	const token = cookies.t;

	const addTaskHandler = (e) => {
		e.preventDefault();

		if (taskName.current.value.trim() === '') {
			onCancel();
			return;
		}

		const name = taskName.current.value.trim().replace(/\n/g, ' ');
		const newTask = { name, order };
		dispatch(addData(token, TYPES.TASK, newTask, columnId));
		onCancel();
	};

	const cancelHandler = () => {
		if (taskName.current.value.trim() === '') {
			props.onCancel();
		}
		return;
	};

	return (
		<div>
			<Input
				autoFocus
				placeholder="Enter Task here"
				innerRef={taskName}
				onBlur={cancelHandler}
			/>
			<div className="mt-2">
				<Button
					type="submit"
					onClick={addTaskHandler}
					className={styles.confirm}
				>
					Add Task
				</Button>
				<AiOutlineClose onClick={onCancel} className={styles.cancel} />
			</div>
		</div>
	);
};

export default AddTask;
