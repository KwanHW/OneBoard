import moment from 'moment';
import React, { useContext, useState, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import { DatePicker, Select } from 'antd';
import {
	Badge,
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
import { AddSubtask, SubtaskList } from './Subtask';

const { Option } = Select;

function TaskModal(props) {
	const dispatch = useDispatch();
	const { task, columnTitle, write, onDelete } = props;
	const boardLabels = useSelector((state) => state.kanban.labels);
	const modalContext = useContext(ModalContext);
	const nameRef = useRef();
	const descriptionRef = useRef();
	const [isWrite, setIsWrite] = useState(write || false);
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
	const [cookies] = useCookies(['t']);
	const token = cookies.t;

	const confirmEditHandler = () => {
		if (nameRef.current.value.trim() === '') {
			return;
		}

		let dateChanged = true;
		let newExpiry;
		if (deadline === null) {
			console.log('New deadline null, checking against old value');
			dateChanged = !!beforeChange.expireAt;
		} else {
			console.log('Deadline is a time, checking against old value');
			dateChanged = !deadline.isSame(beforeChange.expireAt, 'day');
		}
		if (dateChanged) {
			newExpiry = deadline.toDate().toISOString();
		} else {
			if (beforeChange.expireAt === '') newExpiry = '';
			else newExpiry = new Date(beforeChange.expireAt).toISOString();
		}

		let newLabels;
		let labelsChanged = false;
		if (labelSelect.length !== beforeChange.label.length) {
			newLabels = labelSelect;
			labelsChanged = true;
		}

		if (!labelsChanged) {
			for (let i = 0; i < labelSelect.length; i++) {
				const labelSel = labelSelect[i];
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
			console.log('No changes at all');
			toggleEditHandler();
			return;
		}

		const updatedTask = {
			name: nameRef.current.value,
			description: descriptionRef.current.value,
			order: beforeChange.order,
			expireAt: newExpiry,
			subTask: newSubtask,
			label: newLabels,
		};

		dispatch(updateData(token, TYPES.TASK, updatedTask, task._id));
		setBeforeChange(updatedTask);
		toggleEditHandler();
	};

	const toggleEditHandler = () => {
		setIsWrite((prevWrite) => !prevWrite);
	};

	const dateChangeHandler = (date, dateString) => {
		setDeadline(date);
	};

	const addSubTaskHandler = (subtask) => {
		const newSubtasks = [...subTasks];
		newSubtasks.push(subtask);
		setSubTasks(newSubtasks);
	};

	const updateSubtaskHandler = (index, subtask = null) => {
		const newSubtasks = [...subTasks];
		if (subtask) newSubtasks.splice(index, 1, subtask);
		else newSubtasks.splice(index, 1);
		setSubTasks(newSubtasks);
	};

	const updateLabelHandler = (value, option) => {
		console.log(value);
		setLabelSelect(value);
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
		beforeChange.label.length === 0
			? 'No label'
			: beforeChange.label.map((bLabel) => {
					const label = boardLabels.find(
						(label) => label._id === bLabel
					);
					if (!label) return null;
					return (
						<Badge className={`bg-${label.type} mx-1`}>
							{label.name}
						</Badge>
					);
			  });

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
				<h3 className={`styles.header mt-2`}>Description</h3>
				{!isWrite && (
					<p className={styles.description}>
						{beforeChange.description || ' '}
					</p>
				)}
				{isWrite && (
					<Input
						type="textarea"
						innerRef={descriptionRef}
						defaultValue={beforeChange.description}
						className={styles.input}
					/>
				)}

				{/* Deadline */}
				<h3 className="mt-2">Deadline</h3>
				{isWrite && (
					<DatePicker
						allowClear
						defaultValue={deadline}
						onChange={dateChangeHandler}
						format={'DD/MM/YYYY'}
					/>
				)}
				{!isWrite && (
					<p>
						{deadline
							? deadline.format('DD/MM/YYYY')
							: 'No deadline'}
					</p>
				)}

				{/* Labels */}
				<h3 className="mt-2">Labels</h3>
				{isWrite ? (
					<Select
						showSearch
						allowClear
						placeholder="Select label"
						style={{ minWidth: '200px', width: 'auto' }}
						value={labelSelect}
						onChange={updateLabelHandler}
						mode="multiple"
					>
						{boardLabels
							.filter((label) => !!label._id)
							.map((label) => (
								<Option value={label._id} key={label._id}>
									<Badge className={`bg-${label.type}`}>
										{label.name}
									</Badge>
								</Option>
							))}
					</Select>
				) : (
					<div className="d-flex align-items-center">
						{renderLabel}
					</div>
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
					taskId={task._id}
					onUpdate={updateSubtaskHandler}
				/>
			</ModalBody>

			<ModalFooter>{renderButtons}</ModalFooter>
		</Modal>
	);
}

export default TaskModal;
