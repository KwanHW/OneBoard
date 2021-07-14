import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlinePlus } from 'react-icons/ai';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from './Column';
import styles from './Board.module.css';
import {
	TYPES,
	fetchAllBoards,
	updateData,
	fetchBoard,
} from '../../store/kanban-actions';
import AddData from './Add/AddData';
import ManageBoard from './KanbanUI/ManageBoard';

function Board(props) {
	const [isEditing, setIsEditing] = useState(false);
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const { boards, selectedBoard } = useSelector((state) => state.user.boards);
	const { _id: currentId } = selectedBoard || '';
	const kanban = useSelector((state) => state.kanban);
	const { columns, id: boardId } = kanban;
	const [filteredCols, setFilteredCols] = useState(columns);
	const dispatch = useDispatch();

	useEffect(() => {
		function boardFromStorage() {
			if (currentId) {
				dispatch(fetchBoard(token, currentId));
			} else {
				dispatch(fetchAllBoards(token));
			}
		}

		boardFromStorage();
		return () => {};
	}, [dispatch, token, currentId]);

	const dragEndHandler = (result) => {
		// draggalbeId not used
		const { source, destination, type } = result;

		// Draggable dropped outside of DnD
		// Draggable has no change in position
		if (
			!destination ||
			(source.droppableId === destination.droppableId &&
				source.index === destination.index)
		) {
			return;
		}

		// * Operation for movement between columns
		if (type === 'column') {
			console.log('Reorder columns');
			let columnsInOrder = [...columns];
			const [colToMove] = columnsInOrder.splice(source.index, 1);
			columnsInOrder.splice(destination.index, 0, colToMove);
			columnsInOrder = columnsInOrder.map((col, index) => {
				return { ...col, order: index };
			});
			const data = { name: kanban.name, columns: columnsInOrder };
			dispatch(updateData(token, TYPES.BOARD, data, boardId));
			return;
		}

		const start = columns.find((col) => col._id === source.droppableId);
		const finish = columns.find(
			(col) => col._id === destination.droppableId
		);

		// * Operation for same column
		if (start === finish) {
			const { name, order, _id } = start;
			let tasksInCol = [...start.tasks];
			const [taskToMove] = tasksInCol.splice(source.index, 1);
			tasksInCol.splice(destination.index, 0, taskToMove);
			tasksInCol = tasksInCol.map((task, index) => {
				return {
					...task,
					expireAt:
						task.expireAt && new Date(task.expireAt).toISOString(),
					order: index,
				};
			});

			const data = { name, order, tasks: tasksInCol };
			dispatch(updateData(token, TYPES.COLUMN, data, _id));
		} else {
			// * Operation for different column
			let tasksInStart = [...start.tasks];
			let tasksInFin = [...finish.tasks];
			const [taskToMove] = tasksInStart.splice(source.index, 1);
			tasksInFin.splice(destination.index, 0, taskToMove);
			const newStart = { ...start, tasks: tasksInStart };
			const newFin = { ...finish, tasks: tasksInFin };
			dispatch(updateData(token, TYPES.COLUMN, newStart, newStart._id));
			dispatch(updateData(token, TYPES.COLUMN, newFin, newFin._id));
		}
		return;
	};

	const toggleAddColumn = () => {
		setIsEditing((prev) => !prev);
	};

	const renderCols = filteredCols.map((col, index) => (
		<Column
			key={col._id}
			index={index}
			boardId={boardId}
			column={col}
			data-testid="column"
		/>
	));

	const renderAddCol = isEditing ? (
		<AddData
			id={boardId}
			onCancel={toggleAddColumn}
			order={columns.length}
			type={TYPES.COLUMN}
			className={styles.addCol}
		/>
	) : (
		<div className={styles.addColBtn} onClick={toggleAddColumn}>
			<AiOutlinePlus />
			<h4>Add Column</h4>
		</div>
	);

	return (
		<div className="d-flex flex-column p-4">
			{/* Handle Board Manipulation */}
			<ManageBoard onFilter={setFilteredCols} />
			{/* The kanban board itself */}
			{boards.length > 0 && (
				<div className={`d-flex flex-row ${styles.kanban}`}>
					<DragDropContext onDragEnd={dragEndHandler}>
						<Droppable
							droppableId="all-cols"
							direction="horizontal"
							type="column"
						>
							{(provided) => (
								<div
									className={styles.cols}
									{...provided.droppableProps}
									ref={provided.innerRef}
								>
									{renderCols}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</DragDropContext>
					{renderAddCol}
				</div>
			)}
			{boards.length === 0 && <p>No boards</p>}
		</div>
	);
}

export default Board;
