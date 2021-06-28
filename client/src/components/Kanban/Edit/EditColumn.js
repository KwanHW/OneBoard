import React, { useContext, useState, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import DeleteModal from '../Delete/DeleteModal';
import styles from './EditColumn.module.css';
import { updateData } from '../../../store/kanban-actions';
import ModalContext from '../../../store/ModalContext';
import { TYPES } from '../../../store/kanban-actions';

function EditColumn(props) {
	const { title, column, onCancel } = props;
	const titleRef = useRef();
	const modalContext = useContext(ModalContext);
	const [editTitle, setIsEditTitle] = useState(props.title);
	const [cookies] = useCookies(['t']);
	const token = cookies.t;
	const dispatch = useDispatch();

	const updateColumnHandler = () => {
		const updatedTitle = titleRef.current.value.trim();
		if (editTitle.previous === updatedTitle || updatedTitle === '') {
			props.onCancel();
			return;
		}
		const data = { name: updatedTitle, order: column.order };
		dispatch(updateData(token, TYPES.COLUMN, data, column._id));
		setIsEditTitle(updatedTitle);
		onCancel();
	};

	const deleteColumnHandler = () => {
		modalContext.showModal(
			<DeleteModal title={title} id={column._id} type={TYPES.COLUMN} />
		);
	};

	return (
		<div className={styles.editTitle}>
			<input
				autoFocus
				ref={titleRef}
				placeholder={title}
				onBlur={updateColumnHandler}
			/>
			<FaTrash
				onClick={deleteColumnHandler}
				className={styles.editIcon}
			/>
		</div>
	);
}

export default EditColumn;
