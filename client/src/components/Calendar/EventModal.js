import React, { useState, useContext } from 'react';
import { Modal, ModalHeader } from 'reactstrap';
import {
	AiOutlineClose,
	AiFillPushpin,
	AiOutlinePushpin,
} from 'react-icons/ai';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import DeleteEvent from './DeleteEvent';
import EditEvent from './EditEvent';
import ModalContext from '../../store/ModalContext';
import styles from './EventModal.module.css';
import ViewEvent from './ViewEvent';
import { changeFeatured } from '../../store/event-actions';

function EventModal(props) {
	const { modalType, event } = props;
	const dispatch = useDispatch();
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const { featured: pinned } = useSelector((state) => state.user) || null;
	const [isFeatured, setIsFeatured] = useState(
		pinned && event ? pinned === event._id : false
	);
	const modalContext = useContext(ModalContext);

	const renderContent = () => {
		switch (modalType) {
			case 'Read':
				return <ViewEvent event={event} />;
			case 'Add':
				return <EditEvent addStart={props.addStart} />;
			case 'Edit':
				return <EditEvent event={event} />;
			case 'Delete':
				return <DeleteEvent event={event} />;
			default:
				return <p>Error!</p>;
		}
	};

	const changeFeaturedHandler = () => {
		if (isFeatured) {
			// Delete pin goes here
			dispatch(changeFeatured(token, ''));
			setIsFeatured(false);
		} else {
			// Update pin goes here
			console.log(event._id);
			dispatch(changeFeatured(token, event._id));
			setIsFeatured(true);
		}
	};

	const renderHeader =
		modalType === 'Read' ? event.title : `${modalType} Event`;

	const renderFeatured = isFeatured ? (
		<AiFillPushpin onClick={changeFeaturedHandler} />
	) : (
		<AiOutlinePushpin onClick={changeFeaturedHandler} />
	);

	return (
		<Modal
			isOpen={modalContext.isVisible}
			toggle={modalContext.hideModal}
			className={`my-1 ${styles.modal}`}
			data-testid="modal"
		>
			<AiOutlineClose
				onClick={modalContext.hideModal}
				className={`${styles.close} me-3 mt-3`}
				data-testid="close"
			/>
			<ModalHeader tag="h3">
				{modalType !== 'Add' && renderFeatured} {renderHeader}
			</ModalHeader>
			{renderContent()}
		</Modal>
	);
}

export default EventModal;
