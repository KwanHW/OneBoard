import { useRef } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { Input, Button } from 'reactstrap';
import { AiOutlineClose } from 'react-icons/ai';
import styles from './AddData.module.css';
import { addData } from '../../../store/kanban-actions';

const AddData = (props) => {
	const { id, onCancel, order, type, className } = props;
	const addName = useRef();
	const dispatch = useDispatch();
	const [cookies] = useCookies(['t']);
	const token = cookies.t;

	const addHandler = (e) => {
		e.preventDefault();

		if (addName.current.value.trim() === '') {
			onCancel();
			return;
		}

		const name = addName.current.value.trim();

		const data = { name, order };
		dispatch(addData(token, type, data, id));
		onCancel();
	};

	const cancelHandler = () => {
		if (addName.current.value.trim() === '') {
			onCancel();
		}
		return;
	};

	const formatString = type.charAt(0) + type.substring(1).toLowerCase();

	return (
		<div className={className}>
			<Input
				autoFocus
				placeholder={`Enter ${formatString} here`}
				innerRef={addName}
				onBlur={cancelHandler}
			/>
			<div className="mt-2">
				<Button
					type="submit"
					onClick={addHandler}
					className={styles.confirm}
				>
					Add {formatString}
				</Button>
				<AiOutlineClose onClick={onCancel} className={styles.cancel} />
			</div>
		</div>
	);
};

export default AddData;
