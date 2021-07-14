import moment from 'moment';
import React, { useContext } from 'react';
import { Badge } from 'reactstrap';
import { Draggable } from 'react-beautiful-dnd';
import { BiTime } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import DeleteModal from './Delete/DeleteModal';
import EditDelete from './KanbanUI/EditDelete';
import LabelBar from '../../UI/LabelBar';
import TaskModal from './KanbanUI/TaskModal';
import styles from './Task.module.css';
import ModalContext from '../../store/ModalContext';
import { TYPES } from '../../store/kanban-actions';
import { DATE_FORMAT, hasId } from '../../lib/validators';

function Task(props) {
	const { task, index: taskIndex, columnTitle } = props;
	const modalContext = useContext(ModalContext);
	const boardLabels = useSelector((state) => state.kanban.labels).filter(
		hasId
	);

	const deleteTaskHandler = (e) => {
		e.stopPropagation();
		deleteTask();
	};

	const showTaskHandler = (e) => {
		if (e.defaultPrevented) {
			return;
		}
		modalContext.showModal(setTaskModal(false));
	};

	const editTaskHandler = (e) => {
		e.stopPropagation();
		modalContext.showModal(setTaskModal(true));
	};

	const deleteTask = () => {
		const deleteModal = (
			<DeleteModal id={task._id} title={task.name} type={TYPES.TASK} />
		);
		modalContext.showModal(deleteModal);
	};

	const setTaskModal = (isWrite) => {
		return (
			<TaskModal
				write={isWrite}
				task={task}
				columnTitle={columnTitle}
				onDelete={deleteTask}
				boardLabels={boardLabels}
			/>
		);
	};

	return (
		<Draggable draggableId={task._id} index={taskIndex}>
			{(provided) => {
				return (
					<div
						className={styles.container}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						ref={provided.innerRef}
						onClick={showTaskHandler}
					>
						<p>{task.name}</p>
						<LabelBar labels={task.label} labelSrc={boardLabels} />
						{task.expireAt && (
							<p className={styles.deadline}>
								<Badge className="bg-warning align-self-start">
									<BiTime />{' '}
									{moment(task.expireAt).format(DATE_FORMAT)}
								</Badge>
							</p>
						)}
						<EditDelete
							onEdit={editTaskHandler}
							onDelete={deleteTaskHandler}
						/>
					</div>
				);
			}}
		</Draggable>
	);
}

export default Task;
