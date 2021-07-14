import { useContext } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AiOutlineClose } from 'react-icons/ai';
import ModalContext from '../../store/ModalContext';
import styles from './DeleteNote.module.css';
import { deleteNote } from '../../store/note-actions';

const DeleteNote = (props) => {
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const { note } = props;
	const modalContext = useContext(ModalContext);
	const dispatch = useDispatch();

	const deleteHandler = () => {
		const { _id } = note;
		dispatch(deleteNote(token, _id));
		modalContext.hideModal();
	};

	return (
		<Modal isOpen={modalContext.isVisible} toggle={modalContext.hideModal}>
			<AiOutlineClose
				onClick={modalContext.hideModal}
				className={`${styles.close} me-3 mt-3`}
			/>
			<ModalHeader>Delete Note</ModalHeader>
			<ModalBody>Are you sure you want to delete {note.name}?</ModalBody>
			<ModalFooter>
				<Button color="danger" onClick={deleteHandler}>
					Delete Task
				</Button>
				<Button onClick={modalContext.hideModal}>Cancel</Button>
			</ModalFooter>
		</Modal>
	);
};

export default DeleteNote;
