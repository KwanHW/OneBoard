import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { Input } from 'reactstrap';
import { updateNote } from '../../store/note-actions';

const EditNote = (props) => {
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const { isTitle, onCancel, onEdit, note } = props;
	const dispatch = useDispatch();

	const cancelHandler = (e) => {
		const newData = e.target.value;
		if (newData === (isTitle ? note.name : note.description)) {
			onCancel();
			return;
		}

		// let newNote;
		// if (isTitle) newNote = { ...note, name: newData };
		// else newNote = { ...note, description: newData };
		const newNote = isTitle
			? { ...note, name: newData }
			: { ...note, description: newData };
		dispatch(updateNote(token, note._id, newNote));
		onEdit(newNote);
		onCancel();
	};

	return (
		<Input
			type={isTitle ? 'text' : 'textarea'}
			onBlur={cancelHandler}
			defaultValue={isTitle ? note.name : note.description}
			autoFocus
		/>
	);
};

export default EditNote;
