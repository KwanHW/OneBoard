import React, { useContext } from 'react';
import { useCookies } from 'react-cookie';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useDispatch } from 'react-redux';
import styles from './DeleteModal.module.css';
import { deleteData } from '../../../store/kanban-actions';
import ModalContext from '../../../store/ModalContext';
import { TYPES } from '../../../store/kanban-actions';

function DeleteModal(props) {
	const { type, id } = props;
	const modalContext = useContext(ModalContext);
	const dispatch = useDispatch();
	const [cookies] = useCookies(['t']);
	const token = cookies.t;

	const deleteHandler = () => {
		dispatch(deleteData(token, type, id));
		modalContext.hideModal();
	};

	return (
		<Modal isOpen={modalContext.isVisible} toggle={modalContext.hideModal}>
			<ModalHeader>
				Are you sure you want to delete this{' '}
				{props.isCol ? 'Column' : 'Task'}?
			</ModalHeader>
			{type === TYPES.COLUMN && (
				<ModalBody className={styles.warning}>
					If this column is deleted, all tasks in the column would be
					deleted too! Relocate your tasks to other columns to prevent
					them from being deleted!
				</ModalBody>
			)}
			{type === TYPES.BOARD && (
				<ModalBody className={styles.warning}>
					If this board is deleted, all information in the board will
					be deleted!
				</ModalBody>
			)}
			<ModalFooter>
				<Button onClick={deleteHandler} color="danger">
					Delete {type.toLowerCase()}
				</Button>
				<Button onClick={modalContext.hideModal} outline>
					Go Back
				</Button>
			</ModalFooter>
		</Modal>
	);
}

export default DeleteModal;
