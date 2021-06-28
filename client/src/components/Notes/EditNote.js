import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { Input, InputGroup } from 'reactstrap';
import { updateNote } from '../../store/note-actions';

const EditNote = (props) => {
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const { isTitle, onCancel, note } = props;
	const dispatch = useDispatch();

	const cancelHandler = (e) => {
		const newData = e.target.value;
		if (
			newData === (isTitle ? note.name : note.description) ||
			newData === ''
		) {
			onCancel();
			return;
		}

		let newNote;
		if (isTitle) newNote = { ...note, name: newData };
		else newNote = { ...note, description: newData };
		dispatch(updateNote(token, note._id, newNote));
		onCancel();
	};

	return (
		<InputGroup>
			<Input
				type={isTitle ? 'text' : 'textarea'}
				onBlur={cancelHandler}
				defaultValue={isTitle ? note.name : note.description}
				autoFocus
			/>
		</InputGroup>
	);
};

export default EditNote;
