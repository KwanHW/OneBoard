import { useContext } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AiOutlineClose } from 'react-icons/ai';
import ModalContext from '../../store/ModalContext';
import styles from './DeleteExpense.module.css';
import { deleteExpense } from '../../store/expense-action';

const DeleteExpense = (props) => {
	const dispatch = useDispatch();
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const { expense } = props;
	const modalContext = useContext(ModalContext);

	const deleteHandler = () => {
		const { _id } = expense;
		dispatch(deleteExpense(token, _id));
		modalContext.hideModal();
	};

	return (
		<Modal isOpen={modalContext.isVisible} toggle={modalContext.hideModal}>
			<AiOutlineClose
				onClick={modalContext.hideModal}
				className={`${styles.close} me-3 mt-3`}
			/>
			<ModalHeader>Delete Expense</ModalHeader>
			<ModalBody>
				Are you sure you want to delete {expense.name}?
			</ModalBody>
			<ModalFooter>
				<Button color="danger" onClick={deleteHandler}>
					Delete Expense
				</Button>
				<Button onClick={modalContext.hideModal}>Cancel</Button>
			</ModalFooter>
		</Modal>
	);
};

export default DeleteExpense;
