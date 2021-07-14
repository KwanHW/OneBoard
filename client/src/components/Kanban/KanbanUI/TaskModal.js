import moment from 'moment';
import React, { useContext, useState, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import { DatePicker } from 'antd';
import {
	Alert,
	Button,
	Input,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
} from 'reactstrap';
import styles from './TaskModal.module.css';
import { TYPES, updateData } from '../../../store/kanban-actions';
import ModalContext from '../../../store/ModalContext';
import { AddSubtask, SubtaskList } from '../Subtask';
import useError from '../../hooks/use-error';
import LabelBar from '../../../UI/LabelBar';
import { hasId } from '../../../lib/validators';
import Dropdown from '../../../UI/Dropdown/Dropdown';

function TaskModal(props) {
	const { task, columnTitle, write, onDelete } = props;
	const dispatch = useDispatch();
	const [cookies] = useCookies(['t']);
	const token = cookies.t;
	const boardLabels = useSelector((state) => state.kanban.labels).filter(
		hasId
	);
	const modalContext = useContext(ModalContext);
	const nameRef = useRef();
	const descriptionRef = useRef();
	const [isWrite, setIsWrite] = useState(write);
	const [beforeChange, setBeforeChange] = useState({ ...task });
	const [subTasks, setSubTasks] = useState(task.subTask);
	const [deadline, setDeadline] = useState(
		task.expireAt ? moment(task.expireAt) : null
	);
	const [labelSelect, setLabelSelect] = useState(
		task.label.filter((label) =>
			boardLabels.find((bLabel) => bLabel._id === label)
		)
	);
	const { error, errorMsg, changeMessage } = useError();

	const confirmEditHandler = () => {
		if (nameRef.current.value.trim() === '') {
			changeMessage('Please make sure the name field is not empty.');
			return;
		}

		let dateChanged = true;
		let newExpiry;
		if (deadline === null) {
			// console.log('New deadline null, checking against old value');
			dateChanged = !!beforeChange.expireAt;
		} else {
			// console.log('Deadline is a time, checking against old value');
			dateChanged = !deadline.isSame(beforeChange.expireAt, 'day');
		}

		if (dateChanged) {
			if (deadline) newExpiry = deadline.toDate().toISOString();
			else newExpiry = '';
		} else {
			if (beforeChange.expireAt === '') newExpiry = '';
			else newExpiry = new Date(beforeChange.expireAt).toISOString();
		}

		let labelsChanged = false;
		if (labelSelect.length !== beforeChange.label.length) {
			labelsChanged = true;
		}

		if (!labelsChanged) {
			for (let i = 0; i < labelSelect.length; i++) {
				const labelSel = labelSelect[i];
				// If there is some id that does not exist in the old array,
				// then there is a change
				if (!beforeChange.label.some((label) => label === labelSel)) {
					labelsChanged = true;
				}
			}
		}

		// ? Existing task changes not tested yet
		let subTaskChanged = subTasks.length !== task.subTask.length;
		let newSubtask = subTaskChanged ? subTasks : [];

		// If lengths are the same manually find changes
		if (!subTaskChanged) {
			for (let i = 0; i < subTasks.length; i++) {
				if (
					JSON.stringify(subTasks[i]) ===
						JSON.stringify(task.subTask[i]) ||
					subTasks[i]._id
				) {
					newSubtask.push(subTasks[i]);
					// Existing data added is not counted as a change
					if (!subTasks[i]._id) subTaskChanged = true;
				}
			}
		}

		if (
			nameRef.current.value === beforeChange.name &&
			descriptionRef.current.value === beforeChange.description &&
			!dateChanged &&
			!labelsChanged &&
			!subTaskChanged
		) {
			changeMessage('No changes made.');
			toggleEditHandler();
			return;
		}

		const updatedTask = {
			_id: task._id,
			name: nameRef.current.value,
			description: descriptionRef.current.value,
			order: beforeChange.order,
			expireAt: newExpiry,
			subTask: newSubtask,
			label: labelSelect,
		};

		console.log(updatedTask);
		dispatch(updateData(token, TYPES.TASK, updatedTask, task._id));
		setBeforeChange(updatedTask);
		changeMessage('Update success.');
		toggleEditHandler();
	};

	const toggleEditHandler = () => {
		setIsWrite((prevWrite) => !prevWrite);
	};

	const addSubTaskHandler = (subtask) => {
		setSubTasks([...subTasks, subtask]);
	};

	const updateSubtaskHandler = (index, subtask = null) => {
		const newSubtasks = [...subTasks];
		if (subtask) newSubtasks.splice(index, 1, subtask);
		else newSubtasks.splice(index, 1);
		if (!isWrite) {
			const updatedTask = { ...task, subTask: newSubtasks };
			dispatch(
				updateData(token, TYPES.TASK, updatedTask, updatedTask._id)
			);
		}
		setSubTasks(newSubtasks);
	};

	const renderButtons = isWrite ? (
		<React.Fragment>
			<Button color="success" onClick={confirmEditHandler}>
				Confirm Changes
			</Button>
			<Button color="danger" outline onClick={toggleEditHandler}>
				Cancel Changes
			</Button>
		</React.Fragment>
	) : (
		<React.Fragment>
			<Button onClick={onDelete} color="danger">
				Delete Task
			</Button>
			<Button onClick={toggleEditHandler} color="warning">
				Edit Task
			</Button>
		</React.Fragment>
	);

	const renderLabel =
		beforeChange.label.length === 0 ? (
			<p>No label</p>
		) : (
			<LabelBar labels={beforeChange.label} labelSrc={boardLabels} />
		);

	return (
		<Modal
			isOpen={modalContext.isVisible}
			toggle={modalContext.hideModal}
			className="my-1"
		>
			<AiOutlineClose
				onClick={modalContext.hideModal}
				className={`${styles.close} me-3 mt-3`}
			/>
			<ModalHeader tag="div">
				<React.Fragment>
					{!isWrite && (
						<h2 className={styles.title}>{beforeChange.name}</h2>
					)}
					{isWrite && (
						<Input
							type="text"
							id="taskTitle"
							innerRef={nameRef}
							defaultValue={beforeChange.name}
							className={styles.input}
						/>
					)}
					<p className={styles.subtitle}>in {columnTitle}</p>
				</React.Fragment>
			</ModalHeader>
			<ModalBody>
				<Alert
					color={error ? 'success' : 'danger'}
					isOpen={!!errorMsg}
					toggle={() => {
						changeMessage('');
					}}
				>
					{errorMsg}
				</Alert>
				{/* Description */}
				<h3 className={`styles.header mt-2`}>Description</h3>
				{isWrite ? (
					<Input
						type="textarea"
						innerRef={descriptionRef}
						defaultValue={beforeChange.description}
						className={styles.input}
					/>
				) : (
					<p className={styles.description}>
						{beforeChange.description || ' '}
					</p>
				)}

				{/* Deadline */}
				<h3 className="mt-2">Deadline</h3>
				{isWrite ? (
					<DatePicker
						allowClear
						defaultValue={deadline}
						onChange={(date) => setDeadline(date)}
						format={'DD/MM/YYYY'}
					/>
				) : (
					<p>
						{deadline
							? deadline.format('DD/MM/YYYY')
							: 'No deadline'}
					</p>
				)}

				{/* Labels */}
				<h3 className="mt-2">Labels</h3>
				{isWrite ? (
					<Dropdown
						className="w-75"
						value={labelSelect}
						onChange={(value) => {
							setLabelSelect(value);
						}}
						labelSrc={boardLabels}
					/>
				) : (
					<div>{renderLabel}</div>
				)}

				{/* Subtasks */}
				<h3 className="mt-2">Subtasks </h3>
				{isWrite && (
					<AddSubtask
						taskId={task._id}
						addSubtask={addSubTaskHandler}
					/>
				)}
				<SubtaskList
					subtasks={subTasks}
					task={task}
					onUpdate={updateSubtaskHandler}
				/>
			</ModalBody>

			<ModalFooter>{renderButtons}</ModalFooter>
		</Modal>
	);
}

export default TaskModal;
