import moment from 'moment';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Badge } from 'reactstrap';
import { BiTime } from 'react-icons/bi';
import { Draggable } from 'react-beautiful-dnd';
import DeleteModal from './Delete/DeleteModal';
import EditDelete from './KanbanUI/EditDelete';
import TaskModal from './KanbanUI/TaskModal';
import styles from './Task.module.css';
import ModalContext from '../../store/ModalContext';
import { TYPES } from '../../store/kanban-actions';

// const DeleteModal = React.lazy(() => import('./KanbanUI/DeleteModal'));
// const TaskModal = React.lazy(() => import('./KanbanUI/TaskModal'));

function Task(props) {
	const { task, index: taskIndex, columnTitle } = props;
	const modalContext = useContext(ModalContext);

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
						<LabelBar labels={task.label} />
						{task.expireAt && (
							<p
								style={{
									fontSize: '16px',
									marginTop: '4px',
								}}
							>
								<Badge className="bg-warning align-self-start">
									<BiTime />{' '}
									{moment(task.expireAt).format('DD/MM/YY')}
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

const LabelBar = (props) => {
	const { labels } = props;
	const boardLabels = useSelector((state) => state.kanban.labels).filter(
		(label) => label._id
	);

	if (!labels) return null;

	return (
		<div className="my-1">
			{labels.map((label) => {
				const foundLabel = boardLabels.find(
					(bLabel) => bLabel._id === label
				);
				if (!foundLabel) return null;
				return (
					<Badge className={`bg-${foundLabel.type}`} key={label}>
						{foundLabel.name}
					</Badge>
				);
			})}
		</div>
	);
};

export default Task;
