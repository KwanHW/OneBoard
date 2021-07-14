import { useContext } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import {
	Button,
	Form,
	Label,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from 'reactstrap';
import ModalContext from '../../store/ModalContext';
import styles from './ManageLabel.module.css';
import useLabel from '../hooks/use-label';
import EditLabel from '../../UI/Label/EditLabel';
import { updateLabels } from '../../store/expense-action';

function ManageLabel() {
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const expenseLabels = useSelector((state) => state.expense.labels);
	const modalContext = useContext(ModalContext);
	const dispatch = useDispatch();

	const { labels, editLabels } = useLabel(expenseLabels);

	const confirmChangeHandler = () => {
		let labelChanged = [];
		// TODO Find some way to check if there are no changes
		for (let i = 0; i < 6; i++) {
			if (
				JSON.stringify(labels[i]) !==
					JSON.stringify(expenseLabels[i]) ||
				labels[i]._id
			) {
				const { _id } = expenseLabels[i];

				if (labels[i].name === '') continue;
				if (_id !== '') labelChanged.push({ _id, ...labels[i] });
				else labelChanged.push({ ...labels[i] });
			}
		}

		dispatch(updateLabels(token, labelChanged));
		modalContext.hideModal();
	};

	return (
		<Modal
			isOpen={modalContext.isVisible}
			toggle={modalContext.hideModal}
			className={`my-1 ${styles.modal}`}
		>
			<AiOutlineClose
				onClick={modalContext.hideModal}
				className={`${styles.close} me-3 mt-3`}
			/>
			<ModalHeader>Manage Labels</ModalHeader>
			<ModalBody>
				<Form>
					<Label for="labels">Labels</Label>
					<EditLabel labels={labels} onEdit={editLabels} />
				</Form>
			</ModalBody>
			<ModalFooter>
				<Button color="success" onClick={confirmChangeHandler}>
					Confirm Changes
				</Button>
				<Button outline onClick={modalContext.hideModal}>
					Close
				</Button>
			</ModalFooter>
		</Modal>
	);
}

export default ManageLabel;
