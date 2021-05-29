import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import { kanbanActions } from '../../store/kanban';
import styles from './AddTask.module.css';

const AddTask = (props) => {
	const dispatch = useDispatch();
	const taskName = useRef();

	const addTaskHandler = () => {
		if (taskName.current.value.trim() === '') {
			props.onCancel();
			return;
		}
		dispatch(
			kanbanActions.addTask({
				taskName: taskName.current.value,
				columnId: props.columnId,
			})
		);
		props.onCancel();
	};

	const cancelHandler = () => {
		if (taskName.current.value.trim() === '') {
			props.onCancel();
		}
		return;
	};

	return (
		<div className={styles.addTask}>
			<textarea
				autoFocus
				placeholder="Enter Task here"
				ref={taskName}
				className={styles.text}
				onBlur={cancelHandler}
			/>
			<div>
				<button onClick={addTaskHandler} className={styles.confirm}>
					Add Task
				</button>
				<AiOutlineClose
					onClick={props.onCancel}
					className={styles.cancel}
				/>
			</div>
		</div>
	);
};

export default AddTask;
